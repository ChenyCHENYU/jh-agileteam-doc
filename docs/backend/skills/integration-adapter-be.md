# integration-adapter-be — 集成适配

> 把项目/平台已有的 MQ / HTTP 集成封装接入机器契约、质量门与受控实现链。**目标 是验证并衔接项目真实封装，不建立第二套 MQ SDK 或平台规范。**

## 什么时候用

- "接入 MQ"、"适配平台消息封装"、"检查 Producer/Consumer 接线"、"集成质量门"
- 对接外部系统（如炼钢 MES 的 QMS / L2 / MPS 三路接口）

## 核心机制：项目声明，不假设平台

| 事实 | 说明 |
|------|------|
| 声明者 | 项目维护 `integration-adapters.json`：真实 Maven 坐标、Producer/Consumer/配置/测试/capability 证据、方向门禁 |
| 未配置时 | 返回 `not-configured`——**BD 不选择 MQ SDK、不连 Broker、不覆盖平台封装** |
| 成熟度判断 | 只认 adapter descriptor 的字面证据，MQ 依赖或配置关键词**不再自动触发平台假设**（避免不同平台封装产生误报） |

## 机器契约（v0.23）

集成投递也要有契约，逐项校验：

- 逻辑 ID（StableBusinessId，重复即审计）
- PayloadHash / 载荷版本 / 校验算法版本 / 规范化与长度
- 生产者 / 消费者 / 排序 / 重试 / 确认 / 死信 / 重放
- 操作与错误码引用

## 实战样例

wl-produce 与三路外部系统对接（QMS 品质管控 / L2 智能化计划下发 / MPS 计划接收），接口文档与对接清单在 `wl-produce/docs/`——接入时用本 Skill 将三路封装登记为 adapter descriptor，纳入 review 质量门。

## 红线

- 不替平台选择 SDK、Topic、ACK 语义或幂等策略
- 集成证据缺失 → review 门禁显示缺口，completion 不冒充完成

## 延伸阅读

- [standards/30 变更审查与平台集成适配](/backend/skills/) · `wl-produce/docs/`（3 份 MES 接口文档与外部系统对接清单）
