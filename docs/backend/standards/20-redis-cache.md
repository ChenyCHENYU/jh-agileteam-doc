# 20 · Redis 与缓存规范（✅ 已落地）

> 📦 来源：`wl-skills-bd` v0.24.0 · `standards/20-redis-cache.md` · 本文可判定条目由 `wl-skills-bd validate`（B 系列）与 `mvn verify -Pwl-quality` 自动执行。


> Redis 是分布式系统的"共享内存"，但它的便利性掩盖了三件事：**OOM、超卖、雪崩**。本规范把社区血泪教训固化为团队基线。
>
> 强制度：🔴 必遵。be-rules B13~B16 机器兜底。
>
> **依据**：Redis 官方《Best Practices》《Memory Optimization》《Distributed locks》、Redisson 官方《Distributed locks and synchronizers》、Spring Data Redis 官方、OWASP。

---

## 1. Key 命名（强制）

```
{env}:{module}:{biz}:{id}[:sub]
```

| 段 | 说明 | 示例 |
|---|---|---|
| `env` | 环境隔离 | `prod` / `sit` / `uat` |
| `module` | 业务模块缩写 | `mdm` / `sale` / `safe` |
| `biz` | 业务含义 | `dict` / `lock` / `cache` / `seq` |
| `id` | 业务主键或哈希 | `1001` / `userNo:EX26071` |

```text
✅ prod:sale:lock:order:ORD20260718001
✅ sit:mdm:cache:dict:order_status
❌ "user:1"               // 多环境/多模块冲突
❌ "redis-key"            // 命名模糊
```

> 生产环境多实例共享同一 Redis 时，env 前缀是**唯一防互踩手段**。禁止裸 Key。

## 2. TTL 强制（最高频事故源）

**所有 `set` / `setIfAbsent` 必须带过期时间**（除显式登记的持久 Key，如配置类）。

```java
// ✅ 带过期时间
redisTemplate.opsForValue().set(key, value, 30, TimeUnit.MINUTES);

// ❌ 无过期时间（B13 error）
redisTemplate.opsForValue().set(key, value);
```

| 场景 | 推荐 TTL |
|---|---|
| 业务缓存 | 5~60 分钟 + 随机抖动（防雪崩） |
| 字典缓存 | 24 小时 |
| Token/Session | 与 Token 有效期一致 |
| 分布式锁 | watchdog 自动续期（Redisson）或显式 leaseTime |
| 限流计数 | 1 个窗口周期 |
| 验证码 | 5 分钟 |

> **持久 Key 白名单**：必须在 `.wl-skills-bd/redis-persistent-keys.json` 登记，写明 Key 模式、用途、容量上限、责任人。未登记的持久 Key 视为违规。

## 3. 分布式锁（超卖事故源）

**强制使用 Redisson `RLock`**，禁用 `setnx` / `setIfAbsent` 自实现锁。

```java
// ✅ Redisson RLock（自动续期 + 可重入 + 安全释放）
RLock lock = redissonClient.getLock(key);
boolean acquired = false;
try {
    acquired = lock.tryLock(waitTime, leaseTime, TimeUnit.SECONDS);
    if (!acquired) {
        throw new ServiceException("操作过于频繁，请稍后再试");
    }
    // 业务逻辑
} finally {
    if (acquired && lock.isHeldByCurrentThread()) {
        lock.unlock();
    }
}
```

| 禁止 | 原因 | 依据 |
|---|---|---|
| `setIfAbsent(k, v)` 无过期 | 宕机致死锁 | Redis 官方 |
| `setnx` + `expire` 两步 | 非原子，宕机致死锁 | Redis 官方 |
| `del` 不校验 ownership | 误释放他人锁 | Redis 官方 |
| 业务超时 > 锁超时 | 锁过期后并发执行 | Redisson 官方 |
| `finally` 缺 `isHeldByCurrentThread` | 解锁失败抛 IllegalMonitorStateException | Redisson 官方 |

> RedLock 算法在多 Redis 实例场景讨论较多；团队默认单实例 Redisson，多实例需 SRE + DBA 评审。

## 4. 缓存三大问题（社区共识）

| 问题 | 触发 | 解决 | 依据 |
|---|---|---|---|
| **穿透** | 查不存在 Key 打穿到 DB | 布隆过滤器 / 空值缓存（短 TTL 1~5 分钟） | Redis 官方 |
| **击穿** | 热点 Key 过期瞬间打 DB | 互斥锁重建 / 逻辑过期 / 热点 Key 永不过期 + 异步刷新 | Redis 官方 |
| **雪崩** | 大批 Key 同时过期 | TTL 加随机抖动（`ttl + random(0, 60s)`）/ 多级缓存 | Redis 官方 |

```java
// ✅ TTL 随机抖动防雪崩
int ttl = 1800 + ThreadLocalRandom.current().nextInt(300); // 30~35 分钟
redisTemplate.opsForValue().set(key, value, ttl, TimeUnit.SECONDS);

// ✅ 空值缓存防穿透
if (entity == null) {
    redisTemplate.opsForValue().set(key, "NULL", 3, TimeUnit.MINUTES);
    return null;
}
```

## 5. 大 Key 禁令

| 阈值 | 处理 |
|---|---|
| 单 Value > 10KB | 拆分或换结构 |
| 集合元素 > 1万 | 分页或换 Hash |
| 单 Key 内存 > 1MB | 立即重构 |

- **删除大 Key 用 `UNLINK`**，禁用 `DEL`（Redis 官方：DEL 阻塞主线程）
- **禁用 `HGETALL` / `SMEMBERS` / `LRANGE 0 -1`** 全量拉取大集合，用 `HSCAN` / `SSCAN` / 分页
- **禁用 `KEYS *`**，必须用 `SCAN`（B15 error）

## 6. 序列化（RCE 漏洞源）

```java
// ✅ Jackson + 类型信息
@Bean
public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
    RedisTemplate<String, Object> template = new RedisTemplate<>();
    template.setConnectionFactory(factory);
    Jackson2JsonRedisSerializer<Object> json = new Jackson2JsonRedisSerializer<>(Object.class);
    ObjectMapper om = new ObjectMapper();
    om.registerModule(new JavaTimeModule());
    om.activateDefaultTyping(om.getPolymorphicTypeValidator(),
        ObjectMapper.DefaultTyping.NON_FINAL);
    json.setObjectMapper(om);
    template.setKeySerializer(new StringRedisSerializer());
    template.setValueSerializer(json);
    template.setHashKeySerializer(new StringRedisSerializer());
    template.setHashValueSerializer(json);
    template.afterPropertiesSet();
    return template;
}
```

- **禁用 `JdkSerializationRedisSerializer`**（B16 warn）：二进制不可读、跨语言不兼容、历史 RCE 漏洞（CVE-2016-1000027）
- 时间类型必须注册 `JavaTimeModule`，否则 `LocalDateTime` 序列化失败
- Key 一律 `StringRedisSerializer`，避免二进制 Key 无法排查

## 7. 禁用命令（B15 error）

| 命令 | 禁止 | 替代 |
|---|---|---|
| `KEYS *` | 阻塞主线程 | `SCAN` |
| `FLUSHDB` | 清空当前库 | rename 或禁用 |
| `FLUSHALL` | 清空所有库 | rename 或禁用 |
| `EVAL` 明文 Lua | 注入风险 | `EVALSHA` + Script Cache 登记 |
| `DEBUG SLEEP` / `DEBUG OBJECT` | 运维专用 | 业务禁用 |

> 生产环境 Redis 必须 rename 或禁用 `FLUSHDB`/`FLUSHALL`/`KEYS`（Redis 官方 security checklists）。

## 8. Pipeline 与事务边界

- **批量操作用 Pipeline**，减少网络往返（Redis 官方 Pipelining）
- **单 Pipeline 不超 500 条**，否则阻塞响应（Redis 官方）
- **禁用 `MULTI/EXEC`** 做业务事务：Redis 事务不支持回滚，用 Lua 脚本或业务层补偿
- **集群模式**：Pipeline/事务必须同 slot，跨 slot 报错

## 9. 缓存一致性（社区共识）

业务侧默认 **Cache-Aside + 双删**：

```text
写：先删缓存 → 写 DB → 延迟 500ms 再删缓存（防读旧值回填）
读：查缓存 → miss 查 DB → 写缓存（带 TTL）
```

| 方案 | 一致性 | 复杂度 | 适用 |
|---|---|---|---|
| Cache-Aside + 双删 | 最终一致（秒级） | 低 | 95% 场景 |
| 监听 binlog（Canal）| 准实时（毫秒级）| 高 | 强一致核心数据 |
| 分布式事务（Seata）| 强一致 | 极高 | 极少用 |

> 禁止追求"强一致缓存"——缓存本质是性能优化，强一致请走 DB。延迟双删的"500ms"按业务读耗时实测调整。

## 10. 机器门禁

| 规则 | 检测 | severity |
|---|---|---|
| B13 | `opsForXxx().set(k, v)` / `setIfAbsent(k, v)` 无 TTL | error |
| B14 | `setnx` / `setIfAbsent` 自实现锁（非 Redisson） | error |
| B15 | `KEYS *` / `FLUSHDB` / `FLUSHALL` 明文 | error |
| B16 | `JdkSerializationRedisSerializer` 显式使用 | warn |

## 11. 正反例

```java
// ✅ 标准 Cache-Aside + TTL + 随机抖动
public UserVO getById(String id) {
    String key = "prod:mdm:cache:user:" + id;
    UserVO cached = redisTemplate.opsForValue().get(key);
    if (cached != null) return "NULL".equals(cached) ? null : cached;
    UserVO entity = mapper.getById(id);
    int ttl = 1800 + ThreadLocalRandom.current().nextInt(300);
    redisTemplate.opsForValue().set(key, entity == null ? "NULL" : entity, ttl, TimeUnit.SECONDS);
    return entity;
}

// ✅ Redisson 分布式锁
RLock lock = redissonClient.getLock("prod:sale:lock:order:" + orderId);
try {
    if (!lock.tryLock(3, 30, TimeUnit.SECONDS)) throw new ServiceException("请稍后再试");
    // 业务
} finally {
    if (lock.isHeldByCurrentThread()) lock.unlock();
}

// ❌ 无 TTL（B13）
redisTemplate.opsForValue().set(key, value);

// ❌ setIfAbsent 自实现锁（B14）
Boolean ok = redisTemplate.opsForValue().setIfAbsent(key, "1");  // 无过期，宕机死锁
```

## 变更记录

- 2026-07-18 v0.10：新增 Redis/缓存规范，落地 B13~B16 机器兜底。
