# 后端开发规范落地宣贯文档（多项目集群管控方案）

> 文档用途：项目组会宣贯、各服务接入执行、存量代码整改和后续验收依据
> 适用对象：项目负责人、后端负责人、后端开发、DBA、运维及相关协作人员
> 工程载体：`@agile-team/wl-skills-bd`
> 工程目录：`D:\office-project\wl\wl-skills-bd`
> 上游协作：`wl-skills-design`（需求与数据库/接口设计产出物）· `wl-skills-kit`（前端 api.md 契约）
> 下游协作：`wl-skills-test`（消费 `wl-contract.json` 与 ServiceTest 执行深度接口测试）
> 运行要求：包 CLI 需 Node.js ≥ 22；目标工程基线 Java 8 + Spring Boot 2 + jh4j-cloud 3.1
> 当前核对版本：`0.20.1`（2026-08-22）

---

## 一、宣贯目标与核心结论

本次宣贯需要全员达成一个统一认识：

> 后端工程不能"每个服务各自一套写法"，`wl-skills-bd` 把后端规范变成可安装、可扫描、可生成的工程闭环——代码从契约生成、偏差由规则审计、写库先出计划再授权执行，让事故教训沉淀为机器门禁，而不是停留在会议纪要里。

本次会议结束后，各服务和模块负责人应明确以下事项：

1. 为什么后端必须统一，以及当前分层混乱和数据安全隐患对线上稳定的影响；
2. `wl-skills-bd` 的 12 个 Skill、16 个 MCP 工具、31 条 B 规则、8 个 J 质量门各管什么；
3. 新服务全链路生成、加接口增量契约、存量服务体检三种场景分别怎么做；
4. 数据库变更的"四方对账 + 计划审批 + 环境分级执行"流程，DDL 与数据操作的红线在哪；
5. 契约漂移或规则误报时，如何反馈和归口解决。

一句话概括本方案：

> 一套后端规范、一个机器契约事实源、计划先行显式授权两种写入边界、B 系列 + J 系列 + 数据库治理三层确定性防线、一条"契约 → 生成 → 审计 → 修复"闭环。

### 版本演进速览（v0.18.2 → v0.20.1）

| 版本 | 落地能力 | 对使用者的意义 |
|------|---------|--------------|
| v0.18.2 | B30：从 Controller 源码提取真实 HTTP 路由并阻断重复路由 | 端点清单有了机器事实，前后端路由对账不再靠口述 |
| v0.19.0 | B31 源头一致性：文档 ↔ 契约 ↔ Flyway ↔ 线上快照四方对账；DDL 执行账本；改名豁免审批通道 | "文档叫 A、库里叫 a_old"这类漂移在上线前被检出，且豁免必须留审批记录 |
| v0.20.0 | standards/29 数据库事实源强门禁：基线表同名复用、字段顺序/类型/注释精确对账；事实源指纹进入 planHash；环境分级执行（dev/sit 一次审批连续执行，pre/prod 保留 DBA 流程） | 数据库改动绕不开文档对账；换序/改类型/漏注释都会在预览阶段报错 |
| v0.20.1 | 0.20 能力正式发布补丁（npm 包、安装模板、徽章同步） | 安装即得完整数据库治理链路 |

---

## 二、落地背景与现存问题

### 2.1 当前项目特点

平台后端由十余个业务微服务组成，基于 **Java 8 + Spring Boot 2 + jh4j-cloud 3.1** 统一模板，每个服务独立 Git 仓库、独立部署，经 Nacos 注册、Feign 调用、RocketMQ 异步协作。基线是统一的，但落到各服务的编码习惯、SQL 写法、配置管理上，仍主要靠个人经验和评审把关。

### 2.2 主要问题

长期以来，这些依靠自觉的约定在落地时反复走样：

- 同样的增删改查，不同服务分层写法不一样：有的 Controller 直接调 Mapper，有的自行抛异常不走 `ServiceAssert`，复核成本高；
- SQL 里 `SELECT *` 顺手就写，update/delete 不带租户条件，一次失误波及全表；
- Redis set 不带过期时间，自实现的 setnx 锁没有续期，业务超时锁先释放；
- 事务方法里发 MQ、调 HTTP——本地回滚了，消息已经发出去，下游产生了脏数据；
- 接口文档一半 Swagger 2 一半 OpenAPI 3，且与真实代码脱节：前端按文档传参，后端按代码收参，联调时才发现字段长度、枚举值都对不上；
- Flyway 迁移与现场手工 DDL 各改各的："文档叫 `t_order_status`，库里叫 `t_order_stat`"，没人说得清哪个是事实源；
- 让 AI 直接写后端，出来的是 Spring Boot 3 / JDK 17 写法，Java 8 编译不过，错到运行期才暴露；
- MyBatis `@MapperScan` 通配符扫到泛型 BaseMapper，启动报 Bean 冲突，排查半天定位不到根因；
- 复盘会上定的规矩（如"更新必须带 COMPANY_ID 条件"），下一个新人照旧违反——教训无法沉淀为检查项；
- 权限码、契约、Flyway 版本号在不同服务间重复冲突，只能靠人肉记忆避免。

### 2.3 根因判断

| 层面 | 过去的状态 | 需要建立的机制 |
|------|-----------|--------------|
| 规范 | 存在但分散在 Wiki 和复盘纪要 | 单一规范基线（29 条 + B/J 规则编号化） |
| 生成 | 各服务手工起样板，风格随人 | 契约驱动生成 + 统一交付 profile |
| 检查 | 依赖 code review 人眼 | B1~B31 确定性扫描 + J1~J8 Maven 质量门 |
| 写库 | 文档、迁移、手工 DDL 各行其道 | 四方对账 + planHash 审批 + 分级执行 |
| 安全 | 事故后口头强调 | 护栏规则固化（Redis/事务/全表写等） |
| 演进 | 教训一次性消耗 | `naming-waivers` 审批留痕 + 规则版本化升级 |

---

## 三、方案定位与统一原则

### 3.1 方案定位

`wl-skills-bd` 不是"一键出全套代码"的黑盒脚手架，也不是单纯的 Checkstyle 配置集。它是面向 jh4j-cloud 后端体系的**规范工程化执行框架**，包含：

- 29 条后端规范（`.github/standards/01~29`）；
- 12 个 AI Skill（core / data / ops / test 四组）；
- 16 个 MCP 工具（CLI 与 MCP 复用同一核心实现）；
- B1~B31 确定性扫描规则 + safe-fix 受控修复；
- J1~J8 Maven 质量门（ArchUnit / Checkstyle / PMD / SpotBugs / Spotless / P3C / OpenAPI / JaCoCo）；
- 数据库源头治理工具链（drift / executed / ledger / preview）；
- 统一交付 profile `jh4j3-openapi3@1.0`。

其核心目标是：**AI 生成的后端代码和人工代码过同一套确定性检查**，并且所有高风险动作（写库、权限发布、生产配置）默认停在计划阶段，经确认后才执行。

### 3.2 三层事实来源

| 优先级 | 事实来源 | 作用 |
|--------|---------|------|
| 1 | 已评审契约 `wl-contract.json` | 资源级生成事实：路径、字段边界、约束来源、枚举、数据分级 |
| 2 | `wl-skills-bd` 当前发布版本 | 将规范转化为规则、模板与质量门配置 |
| 3 | 项目 Delivery Profile | 项目口径（如 GET 查询、分页默认值）显式登记后优先生效 |

契约缺外部路径、权限、数据库信息或字段语义时**阻断生成**，不用模板默认值掩盖未知事实。三条安全边界贯穿全包：**不猜业务事实、不盲目覆盖本地修改、不自动执行高风险外部变更**。

### 3.3 三种管控方式

| 管控方式 | 适用内容 | 示例 |
|---------|---------|------|
| 契约驱动生成 | 可从契约推导的标准产物 | 标准 CRUD 17 个产物、customOperations 业务命令 |
| 确定性扫描 | 必须从源码判定的偏差 | B26 MapperScan 通配符、B27 私锁父 BOM 依赖、B30 重复路由 |
| 计划先行 + 显式授权 | 有外部副作用的高风险动作 | codegen apply 需 planHash+confirm；pre/prod 默认零写入 |

> 项目显式采用 GET 查询、自定义分页默认值等口径时，Delivery Profile 登记后不再被通用基线误报；真正的契约/代码漂移仍然阻断。既不迁就不规范，也不冤枉合理特例。

---

## 四、整体工程架构：六层闭环

```text
已评审需求 / 前端契约 / 数据库约束
        │
        ▼
L0  机器事实层    JSON Schema · delivery profile · rule catalog · module catalog
        │
        ▼
L1  上下文治理    当前模块增量扫描 · 一跳快照 · 关系与预算选择 · 全局身份去重
        │
        ▼
L2  确定性核心    install / contract / codegen / audit / safe-fix / config / task-router
        │
        ├──→ L3a CLI 适配 ──┐
        └──→ L3b MCP 适配 ──┴─ 同一 lib/ 双出口，禁止两套逻辑
        │
        ▼
L4  工程产物      Java / XML / DDL / tests / contracts / catalog / docs
        │
        ▼
L5  验证          B1~B31 + J1~J8 + strict contract diff + 生产证据链 + 包自检
        │
        ▼
L6  人工卡口      DDL 与数据、权限发布、环境部署、破坏性 API、业务重构
```

| 层级 | 职责 | 对团队的价值 |
|------|------|-------------|
| L0/L1 | 机器事实 + 只看该看的上下文 | AI 不臆测，大仓不慢扫 |
| L2 | 生成/审计/修复全部确定性执行 | 同一输入必得同一产出 |
| L3 | CLI 给人用，MCP 给 AI 用 | 一套逻辑两处消费，不会分叉 |
| L4 | 产物齐全且带追溯 | 新人接手即可读懂交付物 |
| L5 | 三层防线机器把守 | 偏差进不了主干 |
| L6 | 高风险动作保留人的决定权 | 自动化不越权 |

---

## 五、`wl-skills-bd` 统一管控覆盖维度

### 5.1 技术栈基线锁定

| 类别 | 团队基线 | 为什么必须锁定 |
|------|---------|--------------|
| JDK / 框架 | Java 8 · Spring Boot 2 · jh4j-cloud 3.1 | AI 默认输出新版本写法，编译不过才暴露 |
| ORM | MyBatis-Plus（继承 `JhBaseMapper<T>`）+ 原生 XML | 双轨混用导致事务与缓存行为不一致 |
| 数据库 | MySQL（业务）/ Oracle（主数据） | 方言差异直接影响 DDL 生成 |
| 返回包装 | `ApiResult.success(msg, data)`，`code=2000` | 包装不统一则前端无法统一处理 |
| 权限 | Spring Security + `@PreAuthorize("@pms.hasPermission(x)")` | 自造权限体系会导致越权 |
| API 文档 | 新代码统一 OpenAPI 3（springdoc + Knife4j），Swagger 2 存量允许但同类混用禁止 | 两套注解并存时工具链都无法正确解析 |

### 5.2 分层与命名规范（J1 ArchUnit 兜底）

- 统一 Controller → 直接 Service → Mapper，**不生成无业务价值的 `IService + ServiceImpl` 双层**；Controller 直调 Mapper 由 J1 在构建期阻断。
- 方法动词五选一：`get / add / update / delete / detail`，不再出现 `queryInfo`、`delData` 这类自由发挥。
- 行为契约测试替代镜像测试：断言实体状态变更与前置拒绝（`assertThrows`），不为 DTO getter 写无意义用例。

### 5.3 数据安全护栏（B13~B19）

从事故反推的机器兜底，扫描命中即为偏差：

| 场景 | 禁止 | 强制 |
|---|---|---|
| Redis set | 无 TTL | 带过期时间 |
| 分布式锁 | setnx 自实现 / 长 TTL 无续期 | Redisson RLock watchdog 自动续期 |
| Redis 命令 | KEYS * / FLUSHDB / FLUSHALL | SCAN 渐进遍历 |
| 删除数据 | deleteBatchIds / TRUNCATE / DROP | profile 软删列 / 删除值标记 |
| 全表写 | update/delete 无 WHERE | WHERE + COMPANY_ID 租户谓词 |
| 事务内 | 发 MQ / 发 HTTP（回滚后消息已发出） | 移出事务或改事务消息 |
| HttpUtil | 裸调用无超时 | 加 `.timeout` 或改 Feign + 熔断 |

### 5.4 稳定性与框架扩展点（B20~B23、B27、B28）

- Feign 超时/重试/熔断/舱壁、定时任务 `@SchedulerLock` 幂等与监控有对应规则与模板；
- **B27**：jh4j-cloud 父 BOM 已管理的运行时依赖（首批 EasyExcel）不允许业务模块私锁版本——避免"编译通过、Spring 扫描时 ClassNotFound"；
- **B28**：平台已提供的 Spring 扩展点（如 `MetaObjectHandler` 的 `insertFill/updateFill`），业务同类 Bean 必须唯一选择并显式委托平台实现，配套最小容器测试作为装配证据——只直接 new 业务类的单测不算数。

### 5.5 配置分层与多环境

```bash
wl-skills-bd config init   --project wl-sale --module sale --port 10000 --db-cluster cx --json
wl-skills-bd config doctor            # L0~L8 静态体检
wl-skills-bd config doctor --probe    # + DB/Redis/Nacos TCP 连通性探测
wl-skills-bd config migrate --to huaxin --apply --plan-hash <hash> --confirm
wl-skills-bd troubleshoot "Communications link failure"
```

三层模型：L1 代码库（git，零硬编码占位）/ L2 环境变量（部署侧，不进 git）/ L3 Nacos 动态（namespace 隔离）。内置 10 类故障诊断树（DB / Redis / Nacos / K8s / 端口 / Bean / Profile / Flyway / Feign / MQ），故障排查从翻聊天记录变成按树走。

### 5.6 数据库源头治理（v0.19/v0.20 重点）

从事故反推的**四方对账**：需求文档镜像（docs/db-spec）↔ 契约 ↔ Flyway 迁移 ↔ 线上库快照。

```bash
wl-skills-bd db preview wl-contract.json         # DDL 预览 + 基线门禁 + 环境执行通道
wl-skills-bd db drift --snapshot snapshot.json   # 线上结构与三方对账（不连接数据库）
wl-skills-bd db executed --table t_xxx --approval-ref JIRA-123   # 执行回执入账本
wl-skills-bd db ledger                           # 审计 DDL 执行账本
```

| 机制 | 说明 |
|------|------|
| standards/29 基线复用 | 文档基线表必须同名复用，字段名称/大小写/**顺序**/类型/可空性/默认值/注释逐项精确对账；扩展字段末尾追加；新表/字段登记业务依据与审批 |
| planHash 指纹 | 数据库事实源状态进入计划哈希——先改文档再生成，跳不过去 |
| 改名豁免 | `.wl-skills-bd/naming-waivers.json` 登记改名映射与字段基线，需审批；豁免永久保留 warn 标识，绝不静默放行 |
| 执行回执 | 现场执行过的 DDL 通过 `db executed` 入账本（含审批引用），drift 据此放行并保留标识；绕过审批直改库会被 `drift` 检出为无主列 |
| 环境分级 | dev/sit 结构门禁完整、一次 planHash 审批后连续执行；pre/prod 保留 DBA/CD、备份恢复与变更窗口 |
| 命名物理约定 | MySQL 统一 `lower_snake_case`（已移除 `ENGINE=InnoDB` 显式声明，兼容 OceanBase）；Oracle 保持 `UPPER_SNAKE_CASE` |

### 5.7 契约驱动代码生成

契约显式声明的写/查独立约束、约束来源（数据库可证明的长度与精度）、跨字段时间顺序会同步进入 DTO 校验注解、manifest 和 api.md，前后端消费的是同一个机器事实。

标准 CRUD 无业务命令时生成 **17 个产物**：

| 组 | 产物 |
|----|------|
| 模型 ×6 | Entity / CreateDTO / UpdateDTO / PageDTO / VO / PageVO |
| 服务持久层 ×4 | Controller / 直接 Service / Mapper.java / Mapper.xml |
| DDL 资产 ×3 | 正向 migration / 人工恢复说明 / DDL 风险审批预览 |
| 测试骨架 ×2 | ServiceTest / ControllerTest |
| 协作产物 ×2 | `backend-contract.json` / `api.md` |

业务命令通过 `customOperations` 声明（submit、batchCancel 等），每个需要 body 的命令额外生成一个 `OperationRequestDTO`。所有写操作走三段式：`codegen validate` → `plan`（出 planHash）→ `apply --plan-hash <sha256> --confirm`；失败全量回滚，batch 全成全败。

### 5.8 任务驱动精准触发

不全量重跑，按任务加载对应规则子集：

```bash
wl-skills-bd task "加个查询接口"     # → add-api
wl-skills-bd task "加字段落库"       # → add-field
wl-skills-bd task "改个空指针bug"    # → fix-bug
wl-skills-bd task "连不上redis"      # → config-op
wl-skills-bd task --list             # 列出 8 种任务
```

| 任务 | 模式 | 规则子集示例 |
|------|------|------------|
| new-service | 全链路 | B1-B31 子集 + J |
| add-api / add-field / add-business-cmd | 增量契约 | 相关 B 规则子集 |
| fix-bug / refactor | 修复 | safe-fix（B3/B5）相关子集 |
| audit | 只读 | B1-B31 全量 |
| config-op | 配置 | config-doctor 诊断树 |

> `task` 只读路由，不写文件；增量需求先改契约再生成，不存在第二条无事务写入路径。

### 5.9 模块目录与精准上下文

大型工程不做全仓扫描：catalog 登记当前模块的契约、服务类、API 路由、权限码、表写归属、Flyway 版本，重复即阻断；context 只读取关联模块的一跳快照与关键词命中的契约。机器快照入 `.wl-skills-bd/catalog/`，人读文档写 `docs/backend/` 并带 `editable: false` 注释头。

### 5.10 提交与协作闭环

- 提交格式 `type(scope): 功能点-具体内容`，由 `wls_be_commit` 校验并提供 Hook doctor；
- 前后端握手：`contract diff` 支持对比前端 api.md / OpenAPI / 权限清单，`--strict` 时任何元数据漂移非零退出；
- 权限码可经 `wls_be_export_permissions` 导出为 kit 的 `SYS_PERMISSION_INFO.md` 片段，供 menu/permission-sync 直接消费。

---

## 六、Skill、MCP 与工程保障全景

### 6.1 12 个 Skill

| # | Skill | 分类 | 能力 | 状态 |
|---|-------|------|------|------|
| ① | api-design-be | core | 接口设计审查：RESTful 命名 / 字段映射 / 错误码 | 已落地 |
| ② | entity-codegen | core | Entity / DTO / VO / Query 生成（受 Profile 驱动） | 已落地 |
| ③ | service-codegen | core | Controller + 直接 Service（四段式业务命令） | 已落地 |
| ④ | mapper-xml-gen | core | Mapper XML：动态条件 / 分页 / 批量 / join，禁 `SELECT *` | 已落地 |
| ⑤ | db-migration | data | DDL / 建表 / 改表 / 回滚说明 | 🟠 CREATE/ALTER/索引已自动化，复杂回填待扩展 |
| ⑥ | convention-audit-be | core | B 规则全量审计 + SARIF 输出 | 已落地 |
| ⑦ | project-context-governance | core | catalog / context / 模块新鲜度校验 | 已落地 |
| ⑧ | unit-test-gen | test | 行为契约测试：scenarios + gen | 已落地 |
| ⑨ | code-fix-be | ops | safe-fix：B3/B5 受控修复 + 复扫确认 | 已落地 |
| ⑩ | data-safety | ops | Redis / 敏感写 / 全表写护栏落地指引 | 已落地 |
| ⑪ | standard-env-config-be | ops | 配置分层 / 多环境迁移 / 故障排查 | 已落地 |
| ⑫ | business-doc-extract-be | core | 后端业务沉淀 / 领域模型提取 | 🟡 流程骨架（能力尚未闭环） |

### 6.2 16 个 MCP 工具

`wls_be_validate`（B1~B31 扫描）· `doctor`（JDK/Maven/Profile/租户证据体检）· `codegen`（validate/plan/apply）· `contract`（show/diff 严格比对）· `safe_fix`（修复闭环）· `standards`（读取 29 条规范）· `templates`（读取 16 个模板）· `db_preview`（只读 DDL 预览 + Expand-Contract 阶段）· `export_permissions`（导出权限码给 kit）· `config`（init/migrate/doctor）· `troubleshoot`（10 类诊断树）· `task`（任务路由）· `catalog`（plan/apply/check/show）· `context`（有界上下文选择）· `commit`（提交校验 + Hook doctor）· `test`（gen/scenarios）

写类工具默认停在 plan/preview，apply 必须显式确认——这条对所有入口一致，AI 调用与人执行没有特权差异。

### 6.3 安装与升级安全

- 受管 manifest 管理，重复安装不盲目覆盖本地修改；`diff` 看漂移、`update` 增量升级、`clean --dry-run` 预览清理；
- 复制过程全程写入日志，任一步失败自动恢复执行前内容（结构化返回 `write-failed-rolled-back`），不会留下半安装状态；
- 内容身份按 LF 计算：Windows `core.autocrlf` 产生的 CRLF 差异不会被误判为大面积本地修改，真实改动才会触发保护。

---

## 七、接入流程

### 7.1 新服务（全链路）

```bash
# 要求 Node.js >= 22
npx @agile-team/wl-skills-bd init --dry-run     # 预览
npx @agile-team/wl-skills-bd init               # 安装规范 + 模板 + 编辑器/MCP 配置
npx @agile-team/wl-skills-bd doctor             # JDK/Maven/Profile/质量门体检

# 契约准备（可复制示例改造）
cp .github/templates/examples/feature-category.contract.json wl-contract.json

# 三段式生成
wl-skills-bd codegen validate wl-contract.json
wl-skills-bd codegen plan    wl-contract.json --json
wl-skills-bd codegen apply   wl-contract.json --plan-hash <sha256> --confirm

# 审计 + 质量门
wl-skills-bd validate src/main --format sarif --output reports/backend.sarif
mvn verify -Pwl-quality
```

### 7.2 加接口 / 落字段（增量）

```bash
# 1. 先改契约（新增 operation / 字段），2. 任务路由确认规则子集，3. 增量生成只动变化文件
wl-skills-bd task "加个查询接口"
wl-skills-bd codegen plan    wl-contract.json --json
wl-skills-bd codegen apply   wl-contract.json --plan-hash <hash> --confirm
```

### 7.3 存量服务体检

```bash
wl-skills-bd init                       # 先装规范（不覆盖本地修改）
wl-skills-bd validate src/main          # B1~B31 全量，SARIF 可贴 CI/IDE
wl-skills-bd task "改个空指针bug"        # 增量任务按子集整改
# 数据库侧：快照对账 + 账本补录
wl-skills-bd db drift --snapshot ./snapshot.json
wl-skills-bd db executed --table t_xxx --approval-ref JIRA-123
```

---

## 八、问题归属判断：改公共包、改本服务还是改契约

```text
是否属于 29 条规范或 B/J 规则覆盖范围？
  ├─ 否 → 评估是否为真实业务特例（联系密切的外部系统约束等）
  └─ 是
      ↓
是否在多个服务重复出现？
  ├─ 是 → 归口 wl-skills-bd：升级规则/模板/质量门并发版
  └─ 否
      ↓
公共包已有能力但本服务接入错误？
  ├─ 是 → 修依赖与配置（doctor 定位），必要时 diff 对照
  └─ 否
      ↓
是契约与代码不一致（漂移/漏实现）？
  ├─ 是 → 先修订 wl-contract.json 或 docs/db-spec，再走生成（契约侧）
  └─ 否 → 表名/字段改名等场景走 naming-waivers 审批豁免，永久留痕
```

判断原则：

- 公共问题不在十余个服务里重复手修，沉淀为规则统一发版；
- 规则只做确定性判定，不猜测业务语义——正因如此它不会误伤合理特例，也不会放过真偏差；
- 数据库相关一律"先文档、后契约、再迁移"，任何环节缺失都会被对账检出；
- 豁免必须审批留痕，warn 标识跟随资产终身存在。

---

## 九、全员执行要求

### 9.1 必须执行

1. 各微服务统一安装 `wl-skills-bd`，版本升级同步更新锁文件；
2. 新接口、新字段一律先改契约再生成，禁止绕过契约手写后又补文档；
3. 所有写库动作走 `db preview → planHash → apply/DBA` 流程，dev/sit 之外保留既有审批窗口；
4. 新代码统一 OpenAPI 3 注解，Swagger 2 仅限存量维护；
5. Redis、事务、批量写遵循 B13~B19 护栏（无 TTL 即偏差，无 WHERE 即红线）；
6. 平台已有扩展点不复刻（B28），父 BOM 已管依赖不私锁版本（B27）；
7. 提交走 `type(scope): 功能点-具体内容` 格式并通过 commit 校验；
8. 公共问题统一反馈归口，不在服务内打局部补丁。

### 9.2 明确禁止

- 禁止 Controller 直接注入 Mapper（J1 构建阻断）；
- 禁止 update/delete 不带 COMPANY_ID 谓词，禁止 TRUNCATE/DROP 出现在业务代码；
- 禁止事务方法内发 MQ / HTTP 调用；
- 禁止绕过 planHash 直接 apply，禁止在生产环境开启自动执行；
- 禁止私锁父 BOM 已管理版本的依赖；
- 禁止 Swagger 2 与 OpenAPI 3 在同一新接口内混用；
- 禁止手工直连库改表后不录入 `db executed` 账本——下轮 drift 对账时会以"无主变更"暴露；
- 禁止修改包内受管文件而不走 diff/update 流程。

### 9.3 允许但需评审

- Delivery Profile 显式登记的项目口径（GET 查询、自定义分页默认值等）；
- 与外部系统强耦合的非标报文与存储过程；
- 性能热点处的缓存/批处理特殊写法（需附压测证据）；
- naming-waivers 审批通过的改名与字段基线映射。

---

## 十、角色与职责

| 角色 | 主要职责 |
|------|---------|
| 后端负责人 / 规范负责人 | 维护规范基线、交付 profile 口径、版本策略与争议裁决 |
| `wl-skills-bd` 维护人员 | 规则增强、模板迭代、诊断树扩充、发版与升级说明 |
| 后端开发 | 按契约开发，跑 validate/质量门，参与增量生成 |
| DBA / 运维 | pre/prod 环境执行窗口、备份恢复、DDL 审批与账本核对 |
| 前端负责人 | 维护 api.md 契约一致性，配合 contract diff 握手 |
| 测试负责人 | 消费契约与测试骨架，反馈漂移漏检 |

---

## 十一、项目验收清单

### 11.1 接入验收

- [ ] `package.json` 与锁文件中 `wl-skills-bd` 版本一致；
- [ ] `.github/standards/` 含 29 条规范，`.github/skills/` 含 12 个 Skill；
- [ ] `doctor` 通过（JDK / Maven target / Profile / 质量门探针）；
- [ ] manifest 干净：`diff` 无意外漂移。

### 11.2 生成与审计验收

- [ ] 所有接口均有 `wl-contract.json` 且 contractStatus 为 confirmed；
- [ ] codegen plan/apply 留有 planHash 记录，无跳过三段式的直写；
- [ ] `validate src/main` SARIF 报告零 error（或有缺陷跟踪）；
- [ ] `mvn verify -Pwl-quality` 通过（J1~J8），JaCoCo 达标（Service 行/分支 ≥70%/60%，Controller 行 ≥50%）；
- [ ] customOperations 均有 scenarios + 生成的行为契约测试。

### 11.3 数据治理验收

- [ ] docs/db-spec 与契约定版，基线表同名复用；
- [ ] `db drift --snapshot` 无未解释差异；历史手工 DDL 已录 `db executed`；
- [ ] 改名场景均有 naming-waivers 审批记录；
- [ ] MySQL 物理命名 `lower_snake_case`，DDL 无 `ENGINE=InnoDB` 显式残留。

### 11.4 生产就绪验收

- [ ] assurance.level=production 的资源六类证据齐备，completion 非 draft；
- [ ] pre/prod 零写入边界验证有效（尝试直写被拒）；
- [ ] 值班手册可用 troubleshoot 诊断树走查。

---

## 十二、特殊场景反馈与持续迭代

### 12.1 反馈时必须提供的信息

```text
服务/模块名称：
wl-skills-bd 实际版本：
场景：install / codegen / validate / safe-fix / config / db drift / troubleshoot / task
契约或规则编号（如涉及）：
完整命令与退出码：
预期与实际偏差：
最小复现样例（契约片段 / 源码片段 / 快照）：
是否涉及生产环境：
```

### 12.2 公共包修复要求

每次公共包修复必须做到：

1. 附回归测试（现有 27 个测试文件覆盖规则/生成/治理/安装链路），不通过不发版；
2. 明确影响的 B/J 规则编号与模板范围，规则变更同步任务路由子集；
3. 规则只做确定性判定：新增检测不得引入语义猜测；
4. 更新 README、AGENTS 快速命令、standards 对应章节与 CHANGELOG；
5. 完成版本自检（verify-version）+ 规则自检（catalog rules：ID 唯一、executor 有真实输出，防幽灵规则）；
6. 发布版本并向各服务提供升级提示与验收清单。

---

## 十三、方案落地价值

1. **同一起跑线**：十余个服务的 CRUD 从同一套契约与模板产出，接手任何一个服务都不需要重新适应；
2. **事故变门禁**：TTL、租户谓词、MapperScan、EasyExcel 这类踩过的坑固化为 B 规则，同类问题只发生一次；
3. **数据库有事实源**：文档、契约、迁移、线上库四方对账 + 执行账本，谁改的、何时批的、改了什么都有据可查；
4. **AI 用得放心**：生成前锁定 Java 8 基线与项目 profile，生成后过规则与质量门，AI 产出入库前已经过机器验证；
5. **变更可控**：增量任务只动变化文件，上下文只读该读的模块，大仓协作不再互相牵制；
6. **交接有底稿**：catalog、docs/backend、SARIF 报告本身就是交付物，人员轮换知识不断档。

---

## 十四、宣贯会议后建议输出

1. 确认 29 条规范与 `wl-skills-bd` 为后端统一事实来源；
2. 确认各服务负责人与 DBA 对口人名单；
3. 确认接入台账与目标版本（≥ 0.20.1）及升级节奏；
4. 确认第一批试点（建议 1 个新服务走全链路生成 + 1 个存量服务做 validate 体检）；
5. 确认数据库流程切换时间点：docs/db-spec 补齐 → drift 首轮对账 → 账本补录 → waivers 清理；
6. 确认 pre/prod 写入边界的演练安排（验证零写入默认确实生效）；
7. 确认 validate/quality gate 接入 CI 与阻断级别；
8. 确认规则缺口反馈渠道与例会节奏。

---

## 附录 A：常用命令速查

```bash
# 安装与体检
npx @agile-team/wl-skills-bd init --dry-run
npx @agile-team/wl-skills-bd init
npx @agile-team/wl-skills-bd doctor
npx @agile-team/wl-skills-bd diff
npx @agile-team/wl-skills-bd update
npx @agile-team/wl-skills-bd clean --dry-run

# 契约与生成
wl-skills-bd codegen validate wl-contract.json
wl-skills-bd codegen plan    wl-contract.json --json
wl-skills-bd codegen apply   wl-contract.json --plan-hash <sha256> --confirm
wl-skills-bd contract diff wl-contract.json --frontend docs/contracts/page.api.md \
  --openapi openapi.json --permissions permissions.json --strict

# 审计与修复
wl-skills-bd validate src/main --format sarif --output reports/backend.sarif
mvn verify -Pwl-quality

# 任务驱动
wl-skills-bd task "加个查询接口"
wl-skills-bd task --list

# 目录与上下文
wl-skills-bd catalog check --module order
wl-skills-bd context plan  --module order --task "增加订单创建接口" --keywords "幂等,客户" --json

# 配置与环境
wl-skills-bd config init   --project wl-sale --module sale --port 10000 --db-cluster cx --json
wl-skills-bd config doctor [--probe]
wl-skills-bd config migrate --to huaxin --apply --plan-hash <hash> --confirm
wl-skills-bd troubleshoot "Communications link failure"

# 数据库治理
wl-skills-bd db preview wl-contract.json
wl-skills-bd db drift --snapshot snapshot.json
wl-skills-bd db executed --table t_xxx --column col --approval-ref JIRA-123
wl-skills-bd db ledger

# 测试与提交
wl-skills-bd test gen      wl-contract.json --output src/test/java/.../XxxServiceTest.java
wl-skills-bd test scenarios wl-contract.json
wl-skills-bd commit check "<type(scope): ...>"
```

## 附录 B：规范与工程能力对应关系

| 规范域 | 条目 | 工程载体 | 当前状态 |
|--------|------|---------|---------|
| 工程基线 | 01–03 | 模板 + 初始化 + B1~B12 扫描 | 已工程化 |
| 分层/异常/日志/事务/权限 | 04–11 | 代码模板 + ArchUnit(J1) + B 系规则 | 已工程化 |
| 数据库/API 文档/测试 | 12–14 | DDL 模板 + OpenAPI3 强制 + JaCoCo(J8) | 已工程化 |
| 质量/性能/防错/协作/设计 | 15–19 | Checkstyle/PMD/SpotBugs(J2~J5) + 规则扫描 | 已工程化 |
| 数据安全/稳定性护栏 | 20–23 | B13~B23 扫描 + safe-fix | 已工程化 |
| 多环境/配置分层 | 24–25 | config init/doctor/migrate + 诊断树 | 已工程化 |
| 任务驱动/目录上下文 | 26–27 | task-router + catalog/context | 已工程化 |
| 生产保障 | 28 | assurance 六类证据 + completion 卡口 | 已工程化 |
| 数据库事实源治理 | 29 | B31 四方对账 + preview/drift/ledger + waiver | 已工程化（v0.19 起） |
| 框架扩展点/依赖/路由 | — | B26/B27/B28/B30 专项规则 | 已工程化 |
| 质量门 | — | J1~J8（ArchUnit/Checkstyle/PMD/SpotBugs/Spotless/P3C/OpenAPI/JaCoCo） | 已工程化 |

---

## 十五、最终统一口径

> 后端规范统一不是要求每个人背更多条款，而是让契约成为唯一的生成事实，让规则和质量门拦住机器与人共通的偏差，让每一次写库都留下计划、审批与执行痕迹。

从本次宣贯起，后端侧共同遵循：

> 规范基线看 29 条标准，工程实现以 `wl-skills-bd` 为准；改动先入契约，生成必过三段式，扫描和质量门前置，数据库四方对账说话；公共问题归口公共包，项目口径走 Profile 显式登记，改名豁免必须审批留痕。
