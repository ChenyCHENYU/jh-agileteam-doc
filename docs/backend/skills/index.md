# 后端 Skill

<AuthorTag :authors="['YangTianGuang','ZhangXiang','DaiAn','ZhangJie','PanChaoYue']" />

::: tip ✅ 已正式发布
后端 Skills 包（`@agile-team/wl-skills-bd`，当前 **v0.17.8**）已正式发布，覆盖契约驱动代码生成、模块目录与精准上下文、配置分层与多环境、任务驱动、数据安全护栏、行为契约测试、生产保障、质量门、MCP 与安全修复闭环全链路。不再是骨架，已进入业务实证与持续打磨阶段。
:::

## 概述

`wl-skills-bd` 是面向集团 **Spring Boot 2 + MyBatis-Plus + jh4j-cloud 3.1** 体系的**后端 AI Skills 模板包**，把后端工程从"规范提示词集合"升级为**可安装、可验证、可回放**的工程闭环。

> **契约同源 · 独立协同**：`wl-skills-bd` 不强依赖 `wl-skills-design` / `wl-skills-kit`。所有包遵循统一 delivery profile `jh4j3-openapi3@1.0` 与 `wl-api-contract` 结构自然对齐；有 kit 时走严格握手，没有时也能从已评审需求独立生成后端。

三条安全边界贯穿全包：**不猜业务事实、不盲目覆盖本地修改、不自动执行高风险外部变更**。

| 维度 | 现状 |
|---|---|
| 版本 | v0.17.8 |
| 规范 | 28 条后端规范（B1~B26 扫描 + J1~J8 质量门） |
| Skill | 12 个（10 已落地，1 部分落地，1 流程骨架） |
| MCP 工具 | 16 个（CLI/MCP 复用同一 `lib/` 核心） |
| 生成 Profile | `jh4j3-openapi3`（Java 8 / Spring Boot 2 / jh4j-cloud 3.1 / MyBatis-Plus / OpenAPI 3） |

## 分层架构（L0 → L6）

```text
已评审需求 / 可选 design-model 或前端契约 / 数据库约束
                    │
                    ▼
L0 机器事实    JSON Schema + shared delivery profile + rule catalog + module catalog
                    │
                    ▼
L1 上下文治理  当前模块增量扫描 / 一跳快照 / 关系与预算选择 / 全局身份去重
                    │
                    ▼
L2 确定性核心  install / contract / codegen / collaboration / audit / safe-fix / config / task-router
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
L3 CLI 适配              L3 MCP 适配        ← 二者只能适配同一 lib/，禁止复制业务逻辑
          │                   │
          └─────────┬─────────┘
                    ▼
L4 工程产物    Java / XML / DDL / tests / contracts / catalog / docs + standards/skills/quality 配置
                    │
                    ▼
L5 验证        B1~B26 + J1~J8 + strict contract diff + assurance evidence + 包自检
                    │
                    ▼
L6 人工卡口    DDL/数据、权限发布、环境部署、破坏性 API、业务重构
```

## 契约驱动生成

`wl-contract.json` 是资源级生成事实。契约缺外部路径、权限、数据库、迁移恢复或字段语义时**阻断**，不能用模板默认值掩盖未知事实。

```bash
cp .github/templates/examples/feature-category.contract.json wl-contract.json
wl-skills-bd codegen validate wl-contract.json
wl-skills-bd codegen plan    wl-contract.json --json
wl-skills-bd codegen apply   wl-contract.json --plan-hash <sha256> --confirm
```

无业务命令时生成 **17 个产物**：6 个模型（Entity/CreateDTO/UpdateDTO/PageDTO/VO/PageVO）、4 个服务/持久层（Controller/直接 Service/Mapper.java/Mapper.xml）、3 个 DDL 资产（正向 migration/人工恢复说明/DDL 风险审批预览）、2 个测试骨架（ServiceTest/ControllerTest）、2 个协作产物（`backend-contract.json` / `api.md`）。每个需要 body 的业务命令额外生成一个 `OperationRequestDTO`。

业务扩展能力（v0.9）可声明 `customOperations`（业务命令/状态机）、`relations`（主从关联）、`alter`（ALTER TABLE expand/contract）、`indexes`（自定义索引）、可选 `export`、`externalId`（跨包桥接）。

::: warning 生成安全三段式
所有写操作走 `validate / plan / apply`，apply 要求 **`planHash + --confirm`**；生产/完成度/证据门、受保护业务区、写入失败全量回滚；batch 默认全成全败。
:::

## 12 个 Skill

| # | Skill | 分类 | 触发词（示例） | 状态 |
|---|-------|------|----------------|------|
| ① | `api-design-be` | core | 接口设计 / RESTful 校验 / 字段映射 / 错误码 | ✅ 已落地 |
| ② | `entity-codegen` | core | 生成 Entity / DTO / VO / Query / 数据模型 | ✅ 已落地 |
| ③ | `service-codegen` | core | 写后端 / Controller / Service / 按 api.md 生成 | ✅ 已落地 |
| ④ | `mapper-xml-gen` | core | Mapper XML / 动态查询 / 分页 / 批量 SQL | ✅ 已落地 |
| ⑤ | `convention-audit-be` | core | 后端审计 / 分层违规 / 后端体检 | ✅ 已落地 |
| ⑥ | `business-doc-extract-be` | core | 后端业务沉淀 / 接口语义整理 / 领域模型提取 | 🟡 流程骨架 |
| ⑦ | `project-context-governance` | core | 模块目录 / 上下文 / catalog / context plan | ✅ 已落地 |
| ⑧ | `db-migration` | data | DDL / 建表 / 改表 / 加字段 / 迁移脚本 | 🟠 部分落地 |
| ⑨ | `unit-test-gen` | test | 单元测试 / 行为契约测试 / 单测生成 | ✅ 已落地 |
| ⑩ | `code-fix-be` | ops | 修复后端偏差 / 按审计报告整改 | ✅ 已落地 |
| ⑪ | `data-safety` | ops | 数据安全 / Redis 护栏 / 敏感写 / 全表写禁令 | ✅ 已落地 |
| ⑫ | `standard-env-config-be` | ops | 配置分层 / 多环境 / 环境迁移 / 故障排查 | ✅ 已落地 |

> 当前 Profile 使用 **Controller → 直接 Service → Mapper**，不生成无业务价值的 `IService + ServiceImpl` 双层；Controller→Mapper 由 ArchUnit J1 阻断。

## 28 条后端规范

AI 按**任务类型懒加载**相关条目，不全量加载；规范变更顺序追加，不复用废弃编号。

| 范围 | 编号 | 主题 |
|---|---|---|
| 工程基线 | 01–03 | 工具链（JDK/Maven/Lombok+DB 探测）/ 项目结构（分层+业务中心×端口×集群映射）/ 命名 |
| 代码模板 | 04–07 | Controller / Service（业务命令四段式）/ Mapper XML（禁 `SELECT *`+全表写禁令）/ Entity·DTO·VO |
| 异常与日志 | 08–09 | ServiceAssert + 业务码字典 + 全局 Advice / SLF4J 占位符 + 脱敏 + traceId |
| 事务与安全 | 10–11 | @Transactional 回滚矩阵 + self-injection / 权限码 + COMPANY_ID 租户过滤 + 越权清单 + 二次确认 |
| 数据库与文档 | 12–14 | DDL（建表/索引/序列/物理库归属/生产审批）/ OpenAPI 3 + Knife4j + Swagger 2 迁移 + Apifox / 测试分层 + JaCoCo 门禁 |
| 质量与防护 | 15–17 | 编程质量（14 条）/ 性能（5 条）/ 漏洞防护（16 条） |
| 协作与设计 | 18–19 | Git 提交信息格式 / 设计规约（SOLID + 长度红线 + 反模式） |
| 数据安全护栏 | 20–21 | Redis/缓存（TTL/Redisson 锁/禁令）/ 敏感写（批量分批/物理删禁令/幂等/灰度/生产只读） |
| 稳定性 | 22–23 | 限流熔断（Feign 超时/重试/熔断/舱壁）/ 定时任务（@SchedulerLock/幂等/监控） |
| 多环境与配置 | 24–25 | 多环境（profile/nacos/生产护栏）/ 配置分层（三层模型/env-matrix/体检/迁移/排查） |
| 任务与上下文 | 26–27 | 任务驱动（8 种任务/规则子集/统一安全写链）/ 项目目录与精准上下文（增量扫描/一跳快照/去重） |
| 生产保障 | 28 | 生产保障：SLO/RTO/RPO、安全、数据治理、并发一致性、韧性与六类交付证据 |

完整门控与任务类型 → 必读规范映射见 `wl-skills-bd` 包内 `files/.github/standards/index.md`。

## 任务驱动与精准触发（v0.13）

bd 既能全链路新开发完整服务，也能像前端 kit 一样**单点触发**（加接口/落库/改 bug）。关键：任何任务模式都必须遵守对应规范兜底，不让约束形同虚设。

```bash
wl-skills-bd task "加个查询接口"     # → add-api
wl-skills-bd task "加字段落库"       # → add-field
wl-skills-bd task "改个空指针bug"    # → fix-bug
wl-skills-bd task "连不上redis"      # → config-op
wl-skills-bd task --list             # 列出 8 种任务
```

| 任务 | 模式 | 触发词 | 规则子集 |
|---|---|---|---|
| new-service | full | 新开发/全套CRUD | B1-B26 子集 + J |
| add-api | incremental-contract | 加接口/加方法 | B1/B2/B5/B8/B12/B20/B24/B25/B26 |
| add-field | incremental-contract | 加字段/落库 | B3/B4/B7/B18/B25/B26 |
| add-business-cmd | incremental-contract | 加 submit/状态机 | B5/B8/B17/B20/B24/B25/B26 |
| fix-bug | fix | 改 bug/修复 | B3/B5/B7/B8/B17/B18/B24/B25/B26 |
| refactor | fix | 重构/优化 | B5-B12/B23/B24/B25/B26 |
| audit | readonly | 审计/体检 | B1-B26 |
| config-op | config | 配置/连不上 | config-doctor |

> `task` 只读、不写文件；`task --apply` 会被明确拒绝，避免出现第二套无事务写入器。增量需求先更新 `wl-contract.json`，再走 codegen `planHash + --confirm + 回滚`。

## 模块目录与精准上下文（v0.15）

大型工程默认只扫描**当前模块**的契约/源码根；关联模块只读**一跳快照**和关系/关键词命中的契约，不扫描其源码目录。快照缺失不偷偷回退全仓扫描。

```bash
wl-skills-bd catalog check  --module order
wl-skills-bd context plan   --module order --task "增加订单创建接口" --keywords "幂等,客户" --json
```

Catalog 阻断重复契约、服务类、API 路由、权限码、表写归属和 Flyway 版本；codegen 还会校验当前模块新鲜度并把上下文哈希绑定到 `planHash`。机器快照写入 `.wl-skills-bd/catalog/`，人读文档写入 `docs/backend/`（每份带 `editable: false` 注释头）。

## 配置分层与多环境（v0.12）

把"配置管理 + 环境迁移 + 故障排查"标准化为工程级闭环：一处声明（env-matrix）、全工程应用、一键体检、一键迁移、一键排查。

```bash
wl-skills-bd config init   --project wl-sale --module sale --port 10000 --db-cluster cx --json
wl-skills-bd config doctor            # L0~L8 静态体检
wl-skills-bd config doctor --probe    # + DB/Redis/Nacos TCP 连通性探测
wl-skills-bd config migrate --to huaxin --apply --plan-hash <hash> --confirm
wl-skills-bd troubleshoot "Communications link failure"
```

**三层分层模型**：L1 代码库（git，零硬编码占位）/ L2 环境变量（部署侧，不进 git）/ L3 Nacos 动态（namespace 隔离）。内置 10 类故障诊断树（DB/Redis/Nacos/K8s/端口/Bean/Profile/Flyway/Feign/MQ）。

## 数据安全与稳定性护栏（v0.10/v0.11）

把生产事故源从口头规范固化为机器兜底（be-rules B13~B19 + 稳定性 B20~B23）：

| 场景 | 禁止 | 强制 |
|---|---|---|
| Redis set | 无 TTL | 带过期时间 |
| 分布式锁 | setnx 自实现 / 长 TTL 无 watchdog | Redisson RLock 自动续期 |
| Redis 命令 | KEYS \*/FLUSHDB/FLUSHALL | SCAN |
| 删除数据 | deleteBatchIds/TRUNCATE/DROP | profile 软删列/删除值 |
| 全表写 | update/delete 无 WHERE | WHERE + COMPANY_ID 谓词 |
| 事务内 | 发 MQ/HTTP（回滚后消息已发） | 移出事务或事务消息 |
| HttpUtil | 裸调用无超时 | 加 .timeout 或 Feign+熔断 |
| API 文档 | Swagger 2 与 OpenAPI 3 同类混用 | 新代码统一 OpenAPI 3 |

`pre/prod/production` 的 codegen/safe-fix/config/permissions apply **默认零写入**，需评审后显式授权。

## 行为契约测试（v0.16）

从契约 `customOperations` 自动生成关键场景测试，**测行为不测镜像**（避免冗余）：

```bash
wl-skills-bd test scenarios wl-contract.json   # submit→正常+前置拒绝；batchCancel→整批成功+前置失败整批拒绝
wl-skills-bd test gen      wl-contract.json --output src/test/java/.../XxxServiceTest.java
```

✅ 正常路径断言实体状态变更 / ✅ 前置拒绝 `assertThrows` / ✅ batch 原子语义；❌ 不测 DTO getter / 纯转发 / verify setter 次数。

## 生产保障契约（v0.17）

生产契约可声明 `assurance.level=production`，强制声明 SLO/RTO/RPO、认证与方法安全、审计、数据治理、幂等/事件/跨服务事务、超时/重试/熔断/限流，以及威胁模型、授权评审、压测、运行手册、恢复演练、数据评审**六类非空证据**。证据缺失时 completion 保持 draft。包只验证声明和证据链，**不冒充**安全、DBA、SRE 或业务审批。

## 16 个 MCP 工具

写工具默认停在 plan/preview；apply 必须显式确认。Cursor、VS Code、Kiro、Copilot、Claude Code 和通用 Agents 的配置随 `init` 安装。

| 工具 | 写入 | 作用 |
|---|:---:|---|
| `wls_be_validate` | 否 | B1~B26 扫描 |
| `wls_be_doctor` | 否 | JDK/Maven/Profile/质量门/租户证据/契约覆盖体检 |
| `wls_be_codegen` | 条件 | 契约 validate/plan/apply |
| `wls_be_contract` | 否 | 协作契约 show/diff（前端/OpenAPI/权限/kit api.md） |
| `wls_be_safe_fix` | 条件 | B3/B5 安全修复闭环 |
| `wls_be_standards` | 否 | 读取 28 条规范 |
| `wls_be_templates` | 否 | 读取 16 个模板 |
| `wls_be_db_preview` | 否 | 只读预览 CREATE/ALTER DDL + Expand-Contract 阶段 |
| `wls_be_export_permissions` | 条件 | 导出权限码为 kit SYS_PERMISSION_INFO.md 片段 |
| `wls_be_config` | 条件 | 配置分层 init/migrate/doctor/fix |
| `wls_be_troubleshoot` | 否 | DB/Redis/Nacos/K8s 等故障诊断树 |
| `wls_be_task` | 否 | 只读任务路由 → Skill / 规则子集 / 统一安全写链 |
| `wls_be_catalog` | 条件 | 当前模块目录 plan/apply/check/show |
| `wls_be_context` | 否 | 当前模块 + 一跳快照的有界上下文选择 |
| `wls_be_commit` | 否 | `type(scope): 功能点-具体内容` 校验与 Hook doctor |
| `wls_be_test` | 否 | 行为契约测试 gen/scenarios |

## Java 质量门（J1~J8）

```bash
mvn verify -Pwl-quality
```

| 编号 | 工具 | 默认行为 |
|---|---|---|
| J1 | ArchUnit | 阻断 Controller→Mapper/Repository 等分层逆向依赖 |
| J2 | Checkstyle | 阻断命名、Javadoc、import 与规模偏差 |
| J3 | PMD 7 | 阻断缺陷、复杂度、资源和性能偏差 |
| J4 | SpotBugs | 阻断字节码缺陷 |
| J5 | Spotless | 阻断格式漂移 |
| J6 | P3C 2.1.1 / PMD 6 | 可选、非阻断、必须与 PMD 7 隔离运行 |
| J7 | Knife4j/OpenAPI | 运行时文档能力，不冒充静态质量门 |
| J8 | JaCoCo 0.8.15 | Service 类行/分支 ≥70%/60%，Controller 类行 ≥50% |

## 技术栈基线

| 类别 | 团队基线 |
|------|---------|
| JDK | 1.8 |
| 框架 | Spring Boot 2 + jh4j-cloud 3.1 |
| ORM | MyBatis-Plus（继承 `JhBaseMapper<T>`）+ 原生 XML |
| 数据库 | MySQL（业务项目）/ Oracle（mdm-service 等主数据项目） |
| 租户与乐观锁 | `AuthUtil.getLoginCompanyId()`；SQL 显式 `COMPANY_ID`；UpdateDTO 强制 id/revision |
| 返回包装 | `ApiResult.success(msg, data)`，`code=2000` |
| 权限 | Spring Security + `@PreAuthorize("@pms.hasPermission(x)")` |
| 工具库 | Hutool 5.x · Apache Commons · FastJSON 2.0 · Lombok |
| API 文档 | **新代码统一 OpenAPI 3**（springdoc + Knife4j）；Swagger 2 存量允许保留，同类混用禁止 |

## 前后端协作

bd 不直接修改前端工程。bd 与 kit 各自可从评审需求独立建立契约，通过共同 delivery profile 和 `wl-api-contract` 对齐：外部 API 根路径与五个操作方法/路径、query/path/request/response 字段、`code=2000`、分页 `data.records/data.total`、page/detail/create/update/remove 权限码、revision 的详情→更新闭环。

```bash
wl-skills-bd contract diff wl-contract.json \
  --frontend docs/contracts/page.api.md \
  --openapi openapi.json --permissions permissions.json --strict
```

## 能力边界

12 个 Skill 中 10 个已落地，1 个部分落地（`db-migration`：CREATE/ALTER/索引已自动生成，复杂数据回填仍是部分能力），1 个仍是诚实标记的流程骨架（`business-doc-extract-be`）。无执行器的能力不展示虚构命令，也不承诺自动应用。DDL 只生成，不连接数据库、不自动执行、不伪造自动回滚——生产变更由 DBA/CD 和人工审批负责。

## 快速开始

```bash
# 要求 Node.js >= 22
npx @agile-team/wl-skills-bd init --dry-run
npx @agile-team/wl-skills-bd init
npx @agile-team/wl-skills-bd doctor
wl-skills-bd validate src/main --format sarif --output reports/backend.sarif
```

`init` 写入受管 manifest，重复执行不盲目覆盖本地修改；用 `diff` 查看漂移，`check` 验证安装完整性，`update` 增量升级，`clean --dry-run` 预览可清理资产。

## 伴生工程

- 前端工程脚手架：[wl-skills-kit](/frontend/pc/skills/)
- 前端视觉能力：[wl-skills-ui](/views/styling/wl-skills-ui)
