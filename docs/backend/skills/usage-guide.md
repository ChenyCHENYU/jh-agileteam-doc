# 后端 Skills 使用指南

<AuthorTag :authors="['HeGuangMing','YangTianGuang']" />

> `@agile-team/wl-skills-bd` v0.18.2 — 从安装到日常使用的完整指南。

---

## 安装与初始化

```bash
# 要求 Node.js >= 22
npx @agile-team/wl-skills-bd init --dry-run   # 预览
npx @agile-team/wl-skills-bd init              # 安装
npx @agile-team/wl-skills-bd doctor            # 体检
```

`init` 写入受管 manifest（`.wl-skills-bd/`），重复执行不盲目覆盖本地修改。`diff` 查看漂移，`check` 验证安装完整性，`update` 增量升级。

---

## 工作流 A：新开发完整服务（全链路）

适用场景：全新微服务，需要完整 CRUD + DDL + 测试。

```bash
# 1. 编写契约（从需求抽取）
#    编辑 wl-contract.json，定义 entity / api / fields / migration

# 2. 代码生成（三段式安全确认）
wl-skills-bd codegen validate wl-contract.json        # 校验契约合法性
wl-skills-bd codegen plan     wl-contract.json        # 预览将生成的文件
wl-skills-bd codegen apply    wl-contract.json --plan-hash <hash> --confirm

# 3. 产物（17 个文件，无业务命令时）
#    controller/XxxController.java
#    service/XxxService.java
#    mapper/XxxMapper.java + mapper/xml/XxxMapper.xml
#    entity/Xxx.java + dto/SaveDTO.java + dto/UpdateDTO.java + dto/QueryDTO.java + vo/DetailVO.java
#    db/migration/V{version}__{desc}.sql
#    test/.../XxxServiceTest.java（行为契约测试）
#    + OpenAPI 3 + 权限码 + 各层接口

# 4. Java 质量门
mvn verify -Pwl-quality                               # J1-J8 全部阻断

# 5. 规范审计
wl-skills-bd validate src/main --format sarif --output reports/backend.sarif
```

---

## 工作流 B：增量加接口（单点触发）

适用场景：已有服务，只需加一个查询或操作。

```bash
# 1. 更新契约（仅新增操作定义）
wl-skills-bd task "加个分页查询接口"    # → add-api 模式

# 2. 编辑 wl-contract.json，在 operations 或 customOperations 中新增

# 3. 增量生成
wl-skills-bd codegen plan wl-contract.json   # 只预览变化的文件
wl-skills-bd codegen apply wl-contract.json --plan-hash <hash> --confirm

# 4. 审计（只加载相关规范子集）
wl-skills-bd validate src/main --task add-api
```

---

## 工作流 C：改 Bug + 安全修复

适用场景：修复线上 Bug 或审计发现的问题。

```bash
# 1. 审计定位
wl-skills-bd validate src/main               # 全量 B1-B30 扫描

# 2. 安全修复（仅 B3/B5 标记为可自动修复）
wl-skills-bd safe-fix src/main --plan-hash <hash> --confirm
#    B3: SELECT * → <include refid="BaseColumns"/>
#    B5: 缺少 @Transactional(rollbackFor) → 补齐

# 3. 复扫确认
wl-skills-bd validate src/main               # 确认修复无引入新问题
```

---

## 工作流 D：配置管理与环境迁移

适用场景：配置分层、环境迁移、故障排查。

```bash
# 初始化配置
wl-skills-bd config init --project wl-sale --module sale --port 10000 --db-cluster cx

# 体检（静态 + 连通性探测）
wl-skills-bd config doctor              # L0~L8 静态体检
wl-skills-bd config doctor --probe      # + DB/Redis/Nacos TCP 探测

# 环境迁移
wl-skills-bd config migrate --to huaxin --plan-hash <hash> --confirm

# 故障诊断
wl-skills-bd troubleshoot "Communications link failure"
```

---

## 工作流 E：大型工程模块目录

适用场景：多模块微服务，避免全仓扫描。

```bash
# 1. 配置模块边界
cp .wl-skills-bd/catalog.config.example.json .wl-skills-bd/catalog.config.json

# 2. 日常工作流
wl-skills-bd catalog check --module order          # 确认模块新鲜
wl-skills-bd context plan --module order \
  --task "增加订单创建接口" --keywords "幂等,客户"   # 加载一跳上下文

# 3. codegen（上下文哈希绑定 planHash）
wl-skills-bd codegen plan wl-contract.json
```

> `catalog --full` 仅供 CI 或首次初始化，**不要作为本地默认**。

---

## 行为契约测试

从契约 `customOperations` 自动生成场景测试：

```bash
# 查看可生成的测试场景
wl-skills-bd test scenarios wl-contract.json
#    submit → 正常路径 + 前置拒绝
#    batchCancel → 整批成功 + 前置失败整批拒绝

# 生成测试类
wl-skills-bd test gen wl-contract.json --output src/test/java/.../XxxServiceTest.java
```

✅ 测行为（断言状态变更 / assertThrows / batch 原子语义）❌ 不测镜像（DTO getter / 纯转发 / verify setter）

---

## 前后端契约对齐

```bash
# 后端导出权限码
wl-skills-bd export-permissions --output docs/SYS_PERMISSION_INFO.md

# 契约比对（strict 模式）
wl-skills-bd contract diff wl-contract.json \
  --frontend docs/contracts/page.api.md \
  --openapi openapi.json --permissions permissions.json --strict
```

对齐项：外部 API 根路径、五个操作方法/路径、query/path/request/response 字段、`code=2000`、分页 `data.records/data.total`、权限码、revision 闭环。

---

## 能力边界（诚实声明）

| 能力 | 状态 |
|------|:----:|
| 10 个 Skill 完全落地 | ✅ |
| db-migration 部分落地（CREATE/ALTER/索引已自动，数据回填仍部分） | 🟠 |
| business-doc-extract-be 流程骨架 | 🟡 |
| DDL 只生成不执行（DBA/CD 审批负责） | ✅ |
| 生产环境默认零写入（需显式授权） | ✅ |

> 不展示虚构命令，不承诺自动应用，不冒充安全/DBA/SRE/业务审批。

---

## 伴生工程

- 前端 Skills：[wl-skills-kit](/frontend/pc/skills/)
- 前端视觉：[wl-skills-ui](/views/styling/wl-skills-ui)
- 测试工程：[wl-skills-test](/views/testing/)
- AI Skills 流水线：[后端流水线](./skill-pipeline)
