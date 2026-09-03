<!--

> 📦 来源：`wl-skills-bd` v0.24.0 · `standards/28-production-assurance.md` · 本文可判定条目由 `wl-skills-bd validate`（B 系列）与 `mvn verify -Pwl-quality` 自动执行。

document-meta:
  purpose: 规定生产级后端在 SLA、安全、数据治理、并发一致性、微服务韧性方面的声明、证据和交付边界
  audience: backend-developers-ai-agents-architects-security-dba-sre-and-reviewers
  source-of-truth: wl-contract.json#assurance
  maintained-by: wl-skills-bd
-->

# 28 — 生产保障与交付证据规范

## 1. 适用范围

团队已有规范和项目实际技术栈优先。默认基线仍是 Java 8、Spring Boot 2、jh4j-cloud 3；不得为了追求新版本示例，擅自替换团队框架、鉴权组件、事务口径或数据库约定。社区实践只能在兼容团队基线时补强。

普通内部模块可使用 `assurance.level=standard`。面向生产、核心交易、敏感数据或高可用链路的契约必须使用 `assurance.level=production`；此时“代码已生成”不等于“允许交付”。

## 2. 生产契约必填项

生产契约必须明确：

- `criticality`：业务关键级别；
- `slo`：可用性、P95/P99 延迟和最大错误率；
- `recovery`：RTO、RPO；
- `security`：认证模型、方法级鉴权、审计要求；
- `dataGovernance`：租户隔离、数据分级、脱敏、日志策略、数据所有者和唯一事实源；
- `consistency`：幂等策略、事件投递语义、跨服务事务策略；
- `resilience`：超时、有限重试、熔断、限流；
- `evidence`：威胁模型、授权评审、压测、运行手册、恢复演练和数据评审文件。
- `dbCluster` 与 `databaseTarget`：目标 schema/库位、数据规模、停机预算、在线 DDL 能力、备份依据和恢复责任人；
- `errors`：稳定错误码、HTTP 状态、消息、责任人、可重试性及适用操作；
- 对外详情或列表字段的 `semanticId`：跨版本稳定的数据口径标识。

缺任一声明或证据文件时，协作契约保持 `draft`，`codegen apply --require-complete` 必须阻断。工具只验证证据文件存在且非空，不伪称已经替代安全、DBA、SRE 或业务评审。

## 3. 安全与权限

1. Controller 的权限码必须唯一并使用 `@PreAuthorize`；Spring Boot 2 项目必须存在 `@EnableGlobalMethodSecurity(prePostEnabled = true)`。仅写注解但未启用方法安全视为越权风险（B24）。
2. 租户 ID 只能来自可信登录上下文。详情、批量加载、更新和软删除都必须在 Mapper SQL 中显式限制 `COMPANY_ID` 与 `IS_DELETE`。
3. 写操作必须同时验证存在性、租户归属、前置状态和 revision；禁止把客户端传入的 companyId、审计字段、删除标记直接复制到 Entity。
4. confidential/restricted 字段必须声明脱敏和日志排除策略；Lombok `@ToString` 必须用 `@ToString.Exclude` 排除敏感字段（B25）。密码、令牌、证件号、密钥和完整个人信息不得写日志。
5. 高风险动作必须保留操作者、时间、对象、结果、失败原因和 traceId；审计日志不得保存 secret 原文。

## 4. 数据口径与数据库安全

1. 字段应声明稳定语义 ID、业务定义、枚举范围、初始值、数据所有者和 `sourceOfTruth`，避免同名不同义或多处维护。
2. 状态机字段必须声明 `enumValues`；新表还必须声明确定性 `initialValue`，并同步生成 Java 初始化和数据库 `DEFAULT NOT NULL`。
3. 业务删除统一软删除；DDL 只生成预览和迁移文件，不连接数据库、不自动执行。生产迁移仍需备份、审批、窗口、回滚/前滚方案与只读验证。
4. 批量命令默认全成全败：先整批加载、整批校验，再原子更新；任一记录失败时抛错并回滚，不返回“部分成功”。单批上限 1000，超大数据按主键游标分批并限速。
5. 跨服务或跨库一致性不得依赖分布式大事务作为默认方案；优先本地事务 + Outbox/事务消息 + 幂等消费，并明确重复、乱序和补偿策略。

## 5. 并发、SLA 与微服务韧性

- 更新使用 revision 乐观锁；高争用场景必须在压测证据中验证冲突率、重试边界和降级行为。
- 外部调用必须有连接/读取超时；自动重试最多 3 次，只能用于可重试且幂等的失败，并配置退避与抖动。
- 核心下游必须有熔断、限流、舱壁或等价隔离；降级不得伪造业务成功。
- 事务内禁止直接发送 MQ 或执行不受控 HTTP；避免长事务和“数据库已回滚、外部副作用已发生”。
- K8s 使用独立 startup/readiness/liveness 探针、优雅停机、非 root、只读根文件系统、禁用默认 ServiceAccount token；生产配置 PDB/HPA/拓扑分散。镜像必须由 CI 替换为不可变 tag 或 digest，禁止 `latest`。
- SLO 必须可观测：请求量、错误率、延迟、线程池/连接池、数据库、缓存、MQ、熔断和业务关键指标需要告警与运行手册对应。

## 6. 证据文件与发布出口

建议统一放在当前业务项目 `docs/backend/assurance/<contractId>/`：

| 证据 | 最低内容 |
|---|---|
| threat model | 资产、信任边界、攻击面、缓解措施、遗留风险 |
| authorization review | 角色—权限—接口矩阵、租户越权与拒绝用例 |
| load test | 数据规模、并发模型、P95/P99、错误率、资源水位、结论 |
| runbook | 告警、诊断、降级、回滚、联系人和恢复步骤 |
| restore drill | 备份可用性、恢复步骤、实际 RTO/RPO 和演练日期 |
| data review | 字段口径、分级、脱敏、留存、所有者和唯一事实源 |

发布前至少执行：契约校验与 strict diff、B1~B31、`mvn verify -Pwl-quality`、目标数据库集成测试、权限负向测试、并发/幂等测试、压测、迁移演练和恢复演练。quick/staged 结果若为 partial 不能替代 full。新增框架扩展点 Bean 时必须运行最小 Spring 容器装配测试，不能只运行直接实例化的单元测试。Controller 的真实端点清单必须与机器契约、前端调用和网关前缀对账；静态无法解析的常量路径由编译后契约测试/OpenAPI 补证。SAST、SCA、secret scan、SBOM、镜像/IaC 扫描属于 CI/安全平台职责；本包负责提醒和证据闭环，不伪装成已内置扫描器。

## 7. 完成定义

只有在实现、行为测试、协作契约、生产证据和外部评审全部闭环后，才允许把 `completion.contractStatus` 视为 `confirmed`。任何 `UnsupportedOperationException`、TODO/FIXME、空测试、未启用的方法安全、敏感日志、未渲染镜像标签或缺失恢复证据，都不能作为生产完成状态。

## 变更记录

- 2026-08-04 v0.18.0：发布门升级为 B1~B29，分页 DTO 必须与生效 Delivery Profile 一致。
- 2026-08-12 v0.18.2：发布门升级为 B1~B30，新增 Controller 真实端点清单和重复方法+路径阻断。

- 2026-08-03 v0.17.10：发布门增加 B28 与框架扩展点容器装配测试。
- 2026-07-19 v1：新增生产 assurance 契约、六类证据、方法安全、数据口径、并发一致性、SLA、K8s 和外部流水线边界。
