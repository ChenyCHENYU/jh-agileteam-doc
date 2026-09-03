# 12 · 数据库 DDL 与迁移规范（✅ 已落地）

> 📦 来源：`wl-skills-bd` v0.24.0 · `standards/12-database-ddl.md` · 本文可判定条目由 `wl-skills-bd validate`（B 系列）与 `mvn verify -Pwl-quality` 自动执行。


> DDL、数据回填和生产写操作必须先生成差异与风险报告，等待人工确认后由流水线执行。AI/MCP 默认只允许 plan/dry-run。
>
> v0.14 起契约 `alter` 必须显式声明 `phase=expand|contract`：expand 仅允许新增可空列、兼容索引和经声明的 widening 类型扩大；contract 仅允许带审批号的 drop。禁止把破坏性操作混入 expand。

## 1. 方言与物理库前置确认

生成迁移前必须确定并写入契约：

- `database`: mysql 或 oracle；
- `dbCluster`（v0.11）：cx / non_cx / pt，对应产销库 / 非产销库 / 平台库（《项目开发手册》§"数据库划分"）；
- `schema/location`：目标物理库与 Flyway location；
- 数据量、停机窗口、锁风险；
- 是否允许在线 DDL；
- 备份/快照和恢复负责人。

不得仅凭示例表名猜数据库。MDM 默认 Oracle + pt 库，产销业务（sale/quality/produce/cost）默认 Oracle + cx 库，非产销（safe/env/logistics/energy）默认 Oracle + non_cx 库。其他业务域根据实际 POM/DataSource Profile 决定。

### 数据库集群映射（与 standards/02 §数据库集群归属 联动）

| dbCluster | 物理库 | 用户 | 业务中心 | datasource profile 示例 |
|---|---|---|---|---|
| `cx` | `hx_cxdb1` | `cxuser` | sale/quality/produce/cost | `datasource-oracle-cx-{env}.yml` |
| `non_cx` | `hx_non_cxdb2` | `nonuser` | safe/env/logistics/energy | `datasource-oracle-non_cx-{env}.yml` |
| `pt` | `hx_ptdb` | `ptuser` | mdm/平台基础 | `datasource-oracle-pt-{env}.yml` |

> doctor 体检校验：契约 `dbCluster` 与 bootstrap.yml 的 `shared-configs` 中 datasource dataId 一致。

## 2. 命名

- Java 契约统一使用逻辑名，数据库物理大小写由 Profile 决定。
- Oracle 默认 `UPPER_SNAKE_CASE`。
- MySQL 默认 `lower_snake_case`；若存量库使用大写，必须在 Profile 覆盖，禁止同一 Schema 混用。
- 表名包含稳定业务前缀；字段名禁止缩写歧义。

## 3. 业务表基础字段

| 字段 | 类型 | 约束 |
|---|---|---|
| ID | String 对应的 VARCHAR/VARCHAR2 | 主键，EntityUtil 生成 |
| COMPANY_ID | VARCHAR/VARCHAR2 | NOT NULL，租户隔离 |
| profile.softDelete.column（默认 IS_DELETE） | profile 方言类型 | NOT NULL；有效值/删除值由 profile 声明，默认 1/0 |
| REVISION | INTEGER/NUMBER | NOT NULL，默认 0 |
| CREATE_USER_NO | VARCHAR/VARCHAR2 | NOT NULL |
| CREATE_DATE_TIME | VARCHAR/VARCHAR2 或 Profile 时间类型 | NOT NULL |
| UPDATE_USER_NO | VARCHAR/VARCHAR2 | 可空 |
| UPDATE_DATE_TIME | VARCHAR/VARCHAR2 或 Profile 时间类型 | 可空 |

这是 ID 加七个治理字段，共八列，禁止再写“7 件套”。

## 4. 索引与软删除唯一性

- 主键自动有索引，不重复创建。
- 根据真实查询谓词建立联合索引，避免只为低选择性 `IS_DELETE` 建独立索引。
- 租户业务查询通常从 `(COMPANY_ID, IS_DELETE, business_columns...)` 开始设计，并用执行计划验证。
- 禁止简单使用 `(business_key, COMPANY_ID, IS_DELETE)` 解决可重复软删：第二次删除/重建仍可能冲突。

可选策略必须由数据库 Profile 明确选择：

1. 删除时把唯一键迁移到带 delete token 的历史值；
2. 增加 `DELETE_TOKEN`，有效记录固定值、删除记录使用唯一值；
3. 使用数据库支持的部分索引/函数索引；
4. 业务规定只允许恢复、不允许重复创建。

## 5. Flyway 文件

```text
db/migration/
├─ common/V20260718_120000__add_feature_category.sql
├─ mysql/V20260718_120100__mysql_specific_index.sql
└─ oracle/V20260718_120100__oracle_specific_index.sql
```

- 正向版本迁移只使用 `V...__description.sql`。
- 禁止把反向 SQL 命名成 `V...__rollback.sql` 放在正常 migration location。
- 使用支持 Undo 的版本时按 Flyway 规则命名 `U...__description.sql`；否则回退脚本放 `db/rollback-manual/`，只供审批后的人工处置。
- 已发布并应用的 migration 不得修改；修复必须新增版本。
- CI 必跑 `flyway validate`，测试环境实际 migrate。

## 6. Expand-Contract

破坏性变更按以下顺序：

1. expand：新增可空列/新表/兼容索引；
2. deploy-compatible：新旧应用都能运行；
3. backfill：有界分批、可恢复、记录进度；
4. switch：切换读写并观察；
5. contract：后续独立版本删除旧结构。

禁止在单次迁移中直接重命名/删除生产列后假设应用可以回滚。

## 7. 数据回填

- 必须有稳定游标或主键范围循环，不得只执行一次 `ROWNUM <= 1000` 就声称完成。
- 每批大小、提交边界、重试、幂等和总量校验写入报告。
- Oracle DDL 隐式提交与 MySQL 行为差异必须纳入回退计划。
- 大表更新先在等量级测试环境验证锁和耗时。

## 8. 审批报告

`db-migration` 必须生成 `reports/DDL_PREVIEW_{timestamp}.md/json`，包含：

- 目标环境、数据库、Schema；
- 正向 SQL 与校验 SQL；
- 风险级别、锁表/停机预估；
- expand-contract 阶段；
- 数据备份与恢复方案；
- 手工回退步骤；
- planHash；
- 审批人和执行窗口。

`pre/prod/production` 默认拒绝工程文件写入。DDL 生成完成不等于授权执行，更不代表工具会连接数据库。

## 8.5 生产 DDL/DML 敏感操作审批流程（v0.10，与 standards/21 联动）

| 阶段 | 动作 | 责任人 | 工具 |
|---|---|---|---|
| ① 申请 | 填写 DDL_PREIVEW 报告 | 开发 | `wl-skills-bd db preview` |
| ② 评审 | 评审 SQL/索引/锁窗口 | 开发 + 架构 | 报告 |
| ③ DBA 双签 | 确认迁移可行性、回滚可行性 | DBA | 报告签字 |
| ④ 备份 | 全表备份 / binlog 位点记录 | DBA / 运维 | 工具 |
| ⑤ 窗口执行 | 低峰窗口、灰度环境先执行 | 运维 / CD | Flyway |
| ⑥ 验证 | 跑 verificationSql + 业务冒烟 | 开发 | `flyway validate` |
| ⑦ 监控 | 监控锁、慢查询、错误率 30 分钟 | SRE | 监控面板 |
| ⑧ 回滚演练 | 上线前在测试环境演练回滚 | 开发 + 运维 | Rollback.md |

**受保护环境护栏**：codegen/MCP/safe-fix/config/permissions 的写操作在 `environment=pre|prod|production` 时默认阻断；必须先审查预览和 planHash，再本地显式设置 `allowProductionWrites: true` 才能授权工程文件写入（详见 standards/21 §8）。该授权不包含执行数据库 DDL/DML。

## 9. 机器门禁

- migration-lint：文件名、重复版本、危险语句、无界 UPDATE/DELETE。
- flyway validate + 测试库 migrate。
- SQL 方言 fixture：Oracle/MySQL 分别验证。
- contract/schema diff：Entity、迁移和契约字段一致。

## 10. 源头一致性与漂移对账（v0.20，B31）

- 需求文档表结构必须提取为 `docs/db-spec/*.json`，按原顺序记录表名、表注释、字段名/大小写，并尽可能记录类型、可空性、默认值和注释。受管项目缺失镜像时 codegen/db preview 直接阻断。
- 文档表必须同名复用，不再允许用 naming waiver 长期掩盖表改名。文档不合理先由业务确认并修订文档，不能先按代码建另一张表。
- 扩展字段只能追加在文档字段末尾；扩展表/字段必须在 `.wl-skills-bd/db-governance.json` 登记用途、原因、来源、审批人和审批号。
- `codegen validate/plan/apply`、`db preview` 与 B31 共用同一门禁，事实源 fingerprint 进入 planHash。
- `wl-skills-bd db drift --snapshot <file>` 对账线上结构；无源列/无主表为 error。现场执行账本仅用于临时取证，不能替代文档、契约和 Flyway 回写。
- 详细的基线复用、退役和环境分级规则见 standards/29。

## 变更记录

- 2026-08-22 v0.20：事实源门禁升级为表/字段全属性与顺序对账，基线表必须复用，扩展需登记；流程按环境分级。
- 2026-08-20 v0.19：新增 B31 源头一致性、db drift 漂移对账与 DDL 执行账本、catalog rules 注册表自检。
- 2026-07-18 v0.14：ALTER 强制 expand/contract 分阶段；expand 仅兼容扩展，contract drop 需 approvalRef；增加只读 verification SQL、Flyway 版本不可变和 DDL_PREVIEW 门禁。
- 2026-07-18 v0.9：契约 `alter` 字段自动生成 ALTER SQL（add/modify/drop）+ Expand-Contract 阶段标注；`indexes` 字段渲染自定义索引；Rollback.md 含变更类型与 Expand-Contract 段。
- 2026-07-18 v0.8：删除重复旧章节，修正 Flyway rollback、软删唯一键与批处理规则，引入 expand-contract。
