# MES 集成实战（炼钢 · wl-produce）

> 炼钢 MES 与三路外部系统的真实对接：**QMS 品质管控 / L2 炼钢智能化 / MPS 计划管理**。本文是 `integration-adapter-be` 与集成投递机器契约的落地实证。

## 三路集成总览

| 对接方 | 方向 | 传输方式 | 接口 | 状态 |
|--------|------|---------|------|------|
| QMS 品质管控 | 双向 | Feign + HTTP POST + JSON | 成分查询 / 检验接收 / 炉次表检申请·取消 | 表检已联调；成分两项契约待冻结 |
| L2 炼钢智能化 | 炼钢 → L2 | MES 发布表 → OMS 单向同步 → L2 目标库同名表 | 浇次计划 / 炉次计划（39 列契约） | 代码与机器契约已验收；OMS 配置与 L2 到达待验收 |
| MPS 计划管理 | MPS → 炼钢 | HTTP POST + JSON | `/pl/inbound/plan` · `/pl/inbound/plan/cancel` | 两端点已落地（同一事务写主表+明细+履历） |

接口文档真身：`wl-produce/docs/`（三份 md，均含实现核对日期与状态说明）。

---

## 每一路的关键约定（摘录）

### QMS（品质管控）

- 接口代码与"技术标识"**分口径管理**：`PL_CH_B_01/02` 是正式编号；`QMS-STBL-APPLY/CANCEL` 是代码能力追踪标识，BIP 后续分配编号只换标识、不改已冻结的 Feign 方法和业务语义。
- 文档内两组范围（待冻结契约 / 已联调能力）**不得混写状态**。

### L2（计划下发，OMS 数据同步）

- `hx_cxdb1` 是 MES 业务库，MES 只写 `pl_l2_cast_plan_out / pl_l2_heat_plan_out` 两张源发布表；`l2_data_interface_dev` 是 L2 自建目标库——**MES 不连接、不写入目标库**，OMS 只同步数据、不自动建表。
- 39 列契约白名单：L2 后续提出的炉次"制程（两段式/三段式）"属待确认增补，确认前不改代码、数据库或 OMS 配置；历史 migration 保持不可变。
- 公共字段：`business_id` 统一小写；BIP 通用字典 4 项非必填；`long → BIGINT`、`datetime → DATETIME(3)` 毫秒精度。

### MPS（计划接收）

- 两个端点落地在 `wl-produce-pl`；计划主表 / 明细 / 履历在**同一事务**写入 `pl_plan_main`、`pl_plan_main_d`、`pl_resume_plan`，无需新建表。
- 完整地址 = 环境 Gateway（如 `https://ytiop-sit.walsin.com.cn:8443/sit-api`）+ 路径。

---

## 这三路如何被 bd 治理

| 治理点 | 落地 |
|--------|------|
| 集成适配器 | 三路封装登记进 `integration-adapters.json`（真实 Maven 坐标 + 方向门禁），review 门禁检查接线证据 |
| 机器契约 | 计划/取消端点进 `wl-contract.json`；`review run` 检测契约与 Controller 实际路由漂移 |
| 接口一致性 | Feign 方法与 api.md 双向对齐（`contract diff --strict`） |
| 事务红线 | MPS 接收的"同事务三表写入"由 B20~B23 稳定性规则与 ServiceTest 行为契约覆盖 |

> 新增一路外部系统时的标准动作：先写接口文档（含状态分口径）→ 登记集成适配器 → 契约入 `wl-contract.json` → 实现 → `review run` 过门禁。

---

## 相关页面

- [integration-adapter-be](/backend/skills/integration-adapter-be) · [数据库治理实操](/backend/skills/db-governance) · 炼钢服务（wl-produce）为三路集成的落地实例
