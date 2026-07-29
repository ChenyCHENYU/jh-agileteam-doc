# 测试 Skills 概述

<AuthorTag author="ChangXing" />

::: tip 🚀 测试工程 AI 化
测试 Skills 集合覆盖**功能测试设计、自动化测试执行、性能测试压测**全链路。从需求文档到测试计划、用例生成、场景分析、自动化脚本、冒烟执行、性能压测与质量评估，形成一套标准化的 AI 辅助测试工作流。
:::

## 这是什么？

一组面向企业信息系统的 **AI 测试 Skill**，让 AI 编辑器（Copilot / Cursor / Windsurf / Claude Code / 通用 Agents）**真正理解测试设计规范与执行标准**，从需求/详设文档 → 标准化测试计划、高覆盖度测试用例、可执行自动化脚本与性能压测方案。

## 能力分层

```text
需求/详设文档
       │
       ▼
测试计划（test-plan-generator）        ← 七步标准测试方案
       │
       ▼
场景分析（test-scenario-analyzer）     ← 10 类业务场景建模 + 隐性风险挖掘
       │
       ▼
用例生成（test-case-generator）        ← 等价类/边界值/场景法，P0-P3 分级
       │            │
       ▼            ▼
用例评审        测试质量评估
(case-reviewer) (quality-analyzer)    ← 5 维度评审 / DI 缺陷分析 + go/no-go
       │
       ▼
自动化执行闭环
├─ test-script-generator（Playwright E2E 脚本）
├─ universal-test-rules（通用测试规则基座）
├─ smoke-test-selector → smoke-test-executor（冒烟套件筛选与执行）
       │
       ▼
性能压测闭环
├─ perf-plan-generator（压测方案：梯度并发/SLA/监控）
├─ perf-script-generator（JMeter 脚本 + 参数化数据）
└─ perf-report-analyzer（jtl 解析 + 瓶颈诊断 + 趋势对比）
```

## 12 个 Skill 速览

### 功能测试

| # | Skill | 用途 | 关键能力 |
|---|---|---|---|
| ① | `test-plan-generator` | 生成标准化测试计划 | 自动读取需求/详设，输出 7 步测试方案 |
| ② | `test-scenario-analyzer` | 业务场景分析建模 | 10 类场景（主流程/分支/异常/权限/跨系统/状态机/回滚/跨周期/批量/多源）|
| ③ | `test-case-generator` | 从需求生成测试用例 | 等价类/边界值/场景法/决策表，P0-P3 分级，按模块复杂度控制条数 |
| ④ | `test-case-reviewer` | 测试用例质量评审 | 5 维度：业务覆盖/规范符合/可执行性/数据完整性/边界异常 |
| ⑤ | `test-quality-analyzer` | 测试质量评估与发布决策 | DI 缺陷分析、模块级通过率、多轮趋势对比、go/no-go |

### 自动化测试

| # | Skill | 用途 | 关键能力 |
|---|---|---|---|
| ⑥ | `test-script-generator` | 生成 Playwright 测试脚本 | 元素识别、动作模式、等待策略、断言标准 |
| ⑦ | `universal-test-rules` | 通用自动化测试规则基座 | 测试流程/断言/异常处理/页面闭环/数据生命周期/输出格式 |
| ⑧ | `smoke-test-selector` | 冒烟用例筛选 | 纳入/排除规则、定量套件、可追溯性 |
| ⑨ | `smoke-test-executor` | 冒烟套件执行 | 通过/失败判定、重试逻辑、阻断检测 |

### 性能测试

| # | Skill | 用途 | 关键能力 |
|---|---|---|---|
| ⑩ | `perf-plan-generator` | 性能测试方案设计 | 场景设计、梯度并发策略、SLA 阈值、环境与监控 |
| ⑪ | `perf-script-generator` | JMeter 脚本生成 | .jmx + 参数化 CSV + CLI 命令，含登录鉴权/Token/断言 |
| ⑫ | `perf-report-analyzer` | 性能报告分析 | 解析 jtl/监控 CSV，瓶颈诊断、优化建议、3 版本趋势对比 |

## 工作流串联

```text
完整功能测试：test-plan → scenario-analyzer → test-case-generator → test-case-reviewer → test-quality-analyzer

自动化回归：  smoke-test-selector → smoke-test-executor（基于 universal-test-rules）

E2E 自动化：  test-script-generator（元素识别 + 动作录制标准）

性能压测：    perf-plan-generator → perf-script-generator → perf-report-analyzer
```

## 技术栈

| 层面 | 技术 |
|------|------|
| 功能测试 | 用例设计方法（等价类/边界值/场景法/决策表）|
| 自动化测试 | Playwright（E2E）|
| 性能测试 | JMeter 5.6.3 |
| 用例管理 | Markdown 标准格式（P0-P3 分级）|

---

进入下方各分类查看详细 Skill 文档：

- [功能测试](/views/testing/functional) — 测试计划 / 场景分析 / 用例生成 / 评审 / 质量评估
- [自动化测试](/views/testing/automation) — Playwright 脚本 / 通用规则 / 冒烟筛选与执行
- [性能测试](/views/testing/performance) — 压测方案 / JMeter 脚本 / 报告分析
