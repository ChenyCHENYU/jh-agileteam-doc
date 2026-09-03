# 测试规范（11 条）

<AuthorTag :authors="['CHENY']" />

> 来源：`wl-skills-test` v0.11.0 · `standards/01~11`，对齐在线 QC 流程规范。可判定条目由 `wl-skills-test audit`（T 系列）与 `gate` 自动执行；本页为索引，各篇详情点入阅读。

---

## 流程与用例

| 规范 | 核心约束 | 详见 |
|------|---------|------|
| 01 测试流程 | 7 步标准测试方案、出入口准则、四级缺陷分级 | [01-test-process](/views/testing/standards/01-test-process) |
| 02 用例设计标准 | 用例编号/优先级/前置/步骤/预期结构化 | [02-case-design](/views/testing/standards/02-case-design) |
| 03 用例设计方法 | 等价类/边界值/场景法/错误推测在业务中的落法 | [03-case-method](/views/testing/standards/03-case-method) |
| 04 测试策略 | 分层策略（单元/接口/E2E）与回归范围界定 | [04-strategy](/views/testing/standards/04-strategy) |

## 自动化与执行

| 规范 | 核心约束 | 详见 |
|------|---------|------|
| 05 冒烟测试 | 冒烟套件定量（≤8/15/25）、准入准出 | [05-smoke](/views/testing/standards/05-smoke) |
| 06 自动化测试 | Playwright 脚本规范、页面对象、断言纪律 | [06-automation](/views/testing/standards/06-automation) |
| 07 性能测试 | JMeter 5.6.3、三场景梯度、P99 < 500ms、11 条 XML 强制规则 | [07-performance](/views/testing/standards/07-performance) |

## 质量与数据

| 规范 | 核心约束 | 详见 |
|------|---------|------|
| 08 质量门禁 | DI 4 指标上线判定、缺陷分级口径 | [08-quality-gate](/views/testing/standards/08-quality-gate) |
| 09 缺陷管理 | 缺陷生命周期、严重级别定义、收敛要求 | [09-defect-mgmt](/views/testing/standards/09-defect-mgmt) |
| 10 测试报告 | 报告结构与 test-reports 产物约定 | [10-report](/views/testing/standards/10-report) |
| 11 数据安全 | 测试数据脱敏、`AT_` 前缀、清理与隔离 | [11-data-safety](/views/testing/standards/11-data-safety) |

---

## 与机器门禁的对应

| 规范 | 机器兜底 |
|------|---------|
| 02/03 用例 | `run-gen --granularity field` 生成即合规；T10/T11/T19/T20 审计用例质量 |
| 06 自动化 | T1~T5、T12 审计 Playwright 反模式；F1~F6 自动修复 |
| 07 性能 | T6~T9、T13~T18 审计 JMeter 脚本；`jmeter_validate` 预检 |
| 11 数据安全 | 受控写入安全标记（T23）+ 清理链零污染复查 |

> 规范缺口反馈：按[疑难杂症 · 问题反馈](/views/troubleshooting/#问题反馈)提交，复盘后沉淀为新规则。
