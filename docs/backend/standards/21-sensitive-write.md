# 21 · 数据库敏感写操作规范（✅ 已落地）

> 📦 来源：`wl-skills-bd` v0.24.0 · `standards/21-sensitive-write.md` · 本文可判定条目由 `wl-skills-bd validate`（B 系列）与 `mvn verify -Pwl-quality` 自动执行。


> DDL 有 plan/apply 兜底，但**业务级 DML（写/删/批量）目前只有事务层**，缺分级与护栏。本规范把"误删全表""锁表 30 分钟""重复下单"等事故源降到机器兜底层。
>
> 强制度：🔴 必遵。be-rules B17/B18/B19 机器兜底 + codegen 生产护栏。
>
> **依据**：MyBatis-Plus 官方、MySQL/Oracle 官方《Locking Reads》《Batch Operations》、OWASP、金融级数据安全实践。

---

## 1. 写操作分级（核心模型）

| 级别 | 操作 | 审批 | 回滚 |
|---|---|---|---|
| L1 自由 | 单条 INSERT/UPDATE/软删（业务接口） | 鉴权即可 | 业务事务 |
| L2 审批 | 批量写、跨表事务、状态机变更 | 代码评审 | 业务事务 + 操作日志 |
| L3 双签 | 物理删除、TRUNCATE、跨库写 | DBA + 负责人 | 备份 + roll-forward |
| L4 DBA+窗口 | DDL（CREATE/ALTER/DROP） | DBA + 发布窗口 | Flyway + Rollback.md |

> codegen 只生成 L1/L2 代码；L3/L4 必须独立运维契约经审批后执行。

## 2. 批量写分批（锁表事故源）

| 操作 | 上限 | 超出处理 | 依据 |
|---|---|---|---|
| `saveBatch(list)` | 默认 1000 | 显式传更大值时 B19 warn | MyBatis-Plus 官方 |
| 单条 UPDATE 影响行数 | 1 万 | 改为主键游标分批 | MySQL/Oracle 锁 |
| 大表 UPDATE 全量 | 0（禁）| 按主键范围分批 + 索引 | MySQL 官方 |
| 大表 DELETE 全量 | 0（禁）| 软删或分批 | MySQL 官方 |

```java
// ✅ saveBatch 默认 1000（无需显式传）
service.saveBatch(list);

// ✅ 大表更新分批
for (List<String> ids : Lists.partition(allIds, 500)) {
    mapper.updateStatusByIds(ids, "ACTIVE");
    Thread.sleep(100); // 限速，给主从同步留时间
}

// ❌ 显式超大批（B19 warn）
service.saveBatch(list, 50000);

// ❌ 全表 UPDATE（B18 error）
mapper.update(null, Wrappers.<Entity>lambdaUpdate().set(Entity::getStatus, "X"));
```

## 3. 物理删除禁令（误删事故源）

```java
// ❌ 全部禁止（B17 error）
baseMapper.deleteBatchIds(ids);          // MyBatis-Plus 批量物理删
baseMapper.deleteById(id);               // 物理删（团队基线软删）
jdbcTemplate.execute("TRUNCATE TABLE X");
jdbcTemplate.execute("DROP TABLE X");
mapper.deletePhysical(id);

// ✅ 默认 profile 示例：软删（IS_DELETE = 0）；项目覆盖后使用 profile.deletedValue
entity.setIsDelete(0);
EntityUtil.setUpdateProp(entity);
int affected = baseMapper.updateAtomic(entity, companyId, expectedRevision);
ServiceAssert.isTrue(affected == 1, "写入失败：记录不存在、无权限或版本冲突");
```

| 操作 | 团队基线 | 例外 |
|---|---|---|
| 业务删除 | 使用 profile 声明的软删删除值（默认 IS_DELETE = 0） | 无 |
| 批量删除 | 软删 + 批量影响行数校验 | 无 |
| 物理删除 | **禁止** | 独立运维契约 + DBA 双签 |
| TRUNCATE | **禁止** | 独立运维契约 + DBA 双签 |
| DROP | **禁止** | DDL 走 standards/12 |

## 4. 全表 UPDATE/DELETE 禁令

```xml
<!-- ❌ 无 WHERE（B18 error）-->
<update id="resetAll">
    UPDATE T SET STATUS = 'X'
</update>
<delete id="purgeAll">
    DELETE FROM T
</delete>

<!-- ✅ 必须有 WHERE + 租户谓词；以下为默认 profile 的有效值示例 -->
<update id="resetByIds">
    UPDATE T SET STATUS = 'X'
    WHERE IS_DELETE = 1 AND COMPANY_ID = #{companyId} AND ID IN
    <foreach collection="ids" item="id" open="(" close=")" separator=",">#{id}</foreach>
</update>
```

> Mapper XML 的 `<update>` / `<delete>` 必须含 `WHERE`（B18 error）。`<update>` 用于 UPDATE 标签，`<delete>` 用于 DELETE 标签。

## 5. 幂等性（重复下单/重复支付事故源）

**所有外部触发的写操作必须幂等**：

| 场景 | 幂等键 | 实现 |
|---|---|---|
| 下单 | clientOrderId / requestNo | DB 唯一索引 + Redis 防重 30 分钟 |
| 支付 | paymentNo + idempotencyKey | DB 唯一索引 + 状态机 |
| 审批 | businessId + approverNo + version | 乐观锁 REVISION |
| 批量导入 | batchNo + rowMd5 | DB 唯一索引 |
| Webhook | eventId | Redis 防重 + 处理日志 |

```java
// ✅ Redis 幂等防重
String idempotentKey = "prod:sale:idempotent:order:" + dto.getClientOrderId();
Boolean first = redisTemplate.opsForValue().setIfAbsent(idempotentKey, "1", 30, TimeUnit.MINUTES);
if (!Boolean.TRUE.equals(first)) {
    throw new ServiceException("请求已处理，请勿重复提交");
}
try {
    return service.createOrder(dto);
} catch (Exception e) {
    redisTemplate.delete(idempotentKey); // 失败回滚防重，允许重试
    throw e;
}
```

> 幂等键与业务主键解耦，不能用业务主键自身（DB 唯一索引兜底仍需，但 Redis 防重是第一道墙）。

## 6. 跨库/跨数据源写（数据不一致事故源）

| 方案 | 一致性 | 适用 | 团队 |
|---|---|---|---|
| 单库事务（默认）| 强一致 | 同一数据源 | ✅ 95% 场景 |
| 事务消息（RocketMQ）| 最终一致 | 跨服务异步 | ✅ 推荐 |
| Seata AT/XA | 强一致/准强 | 跨库同步 | 🟡 按需评审 |
| 双写（DB+缓存/DB+ES）| 最终一致 | 读优化 | ✅ Cache-Aside（见 20） |

> **禁止业务代码裸双写**：DB 写成功 + ES 写失败，导致数据不一致。必须用事务消息或 binlog 监听（Canal）异步同步。

## 7. 灰度发布（事故秒级止血）

新写接口上线必须支持**特性开关**：

```java
@PreAuthorize("@pms.hasPermission('xxx')")
@PostMapping("save")
public ApiResult<String> save(@RequestBody @Validated DTO dto) {
    if (!featureToggle.isEnabled("sale.order.newFlow")) {
        return legacyService.save(dto); // 灰度前走老逻辑
    }
    return newService.save(dto);
}
```

- 开关默认关闭，灰度环境打开
- 开关变化生效 < 1 分钟（配置中心）
- 开关维度：用户、租户、百分比

## 8. 受保护环境只读护栏（codegen/MCP 默认阻断）

| 工具 | pre/prod/production | 启用方式 |
|---|---|---|
| `wls_be_codegen apply` | 阻断 | `allowProductionWrites: true`（本地显式） |
| `wls_be_export_permissions apply` | 阻断 | 同上 |
| `wls_be_safe_fix apply` | 阻断 | 同上 |
| `config init/migrate/fix apply` | 阻断 | 同上；仍需 confirm + 当前 planHash |
| `wl-skills-bd db preview` | 只读 | 无需确认 |
| `wl-skills-bd validate` | 只读 | 无需确认 |

> 环境取值来自显式参数、`WL_PROJECT_ENV` 或 `.wl-skills-bd/config.json`。任何工程文件写工具在 `pre/prod/production` 默认零写入；授权前必须审查同一内容生成的 planHash。授权仅覆盖本地工程文件，不授权数据库执行、部署或外部系统写入。

## 9. 敏感操作二次确认（扩展 11）

以下操作必须有**业务级二次确认**（前端弹窗 + 后端校验 token）：

| 操作 | 二次确认 |
|---|---|
| 重置密码 | 短信/邮箱验证码 |
| 批量删除（>10 条） | 输入"DELETE" 之类的安全词 |
| 数据导出（>1万行）| 审批流 + 水印 |
| 角色权限变更 | 走审批流 |
| 生产配置修改 | 双签 + 操作日志 |

```java
// ✅ 二次确认 token 校验
@PostMapping("batchDelete")
public ApiResult<Void> batchDelete(@RequestBody @Validated BatchDeleteDTO dto) {
    if (!tokenService.verify(dto.getConfirmToken(), "batchDelete:" + dto.getOperateAt())) {
        throw new ServiceException("二次确认 token 无效或已过期");
    }
    service.batchSoftDelete(dto.getIds());
}
```

## 10. 操作审计（合规要求）

所有 L2+ 写操作必须记**操作日志**：

```text
{操作人, 工号, 时间, 模块, 操作类型, 影响范围, 前值快照, 后值快照, 来源IP, traceId}
```

- 操作日志用独立表 + 独立事务（`REQUIRES_NEW`，主事务回滚不影响日志）
- 敏感字段（密码、token）脱敏
- 保留期按合规要求（金融行业 ≥ 5 年）

## 11. 机器门禁

| 规则 | 检测 | severity |
|---|---|---|
| B17 | `deleteBatchIds` / `deleteById` / `TRUNCATE` / `DROP TABLE` | error |
| B18 | Mapper XML 的 `<update>`/`<delete>` 无 WHERE | error |
| B19 | `saveBatch(list, n)` 显式 n > 1000 | warn |

## 12. 正反例

```java
// ✅ 软删 + 影响行数 + 操作日志
@Transactional(rollbackFor = Exception.class)
public void deleteById(String id) {
    Entity e = lambdaQuery().eq(Entity::getId, id).eq(Entity::getCompanyId, AuthUtil.getLoginCompanyId()).one();
    ServiceAssert.isNotNull(e, "记录不存在");
    e.setIsDelete(0);
    EntityUtil.setUpdateProp(e);
    int affected = baseMapper.softDeleteAtomic(e, AuthUtil.getLoginCompanyId());
    ServiceAssert.isTrue(affected == 1, "删除失败");
    operationLogService.log("DELETE", e); // REQUIRES_NEW 独立事务
}

// ❌ 物理批量删除（B17 + 无审计 + 无幂等）
baseMapper.deleteBatchIds(ids);
```

## 变更记录

- 2026-07-18 v0.14：B17/B18 扩展到 Mapper XML、JDBC/native SQL、恒真/动态 WHERE 和租户谓词；pre/prod/production 全写工具统一 planHash 护栏。
- 2026-07-18 v0.10：新增敏感写规范，落地 B17~B19 机器兜底 + 生产只读护栏 + 二次确认。
