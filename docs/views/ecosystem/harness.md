---
description: "WL Harness Desktop——五包本地可视化工作台：中文查找公开能力、审阅计划、运行只读检查、查看可核验证据；AI 工作台连接模型 API/本机 Codex/ZCode；经 wl-harness-adapter 公开 SDK 接入五包…"
---

# WL Harness 工作台

<AuthorTag :authors="['CHENY']" />

[[toc]]

> 五包的**本地可视化工作台**（内部工具，非 npm 发布物）：连接项目、用中文查找公开能力、审阅计划、运行检查，并查看**可核验的原始证据**。桌面端经 `wl-harness-adapter` 的公开 SDK 接入 Design / Kit / BD / UI / Test；已受控接入 Gate 的项目还可使用其公开 `gate-check`。

## 是什么

| 组成 | 说明 |
|------|------|
| `wl-harness-desktop` | Electron 桌面应用：能力搜索、业务操作、检查执行、证据审阅、AI 工作台 |
| `wl-harness-adapter` | 包外薄适配层（`0.7.0-private`），固定 DeepSeek DSH 版本，只调用五包公开 `protocol/CLI`——业务判定、生成与校验仍由各包独立负责 |

启动：已构建版本双击工程根目录 **`打开 WL Harness.command`**——只指向验收后的 `release/current.app`；窗口左下角与关于页可查看实际版本，点击版本可核对构建标识和运行路径。开发环境 Node 24（执行服务需要 `node:sqlite`）。

## 能力一览（v0.7）

- **本地全局能力搜索**：按中文需求或工具 ID 打开实际 MCP、单个/批量菜单、字典、检查器、Skills 与 CLI——搜索不调用模型；
- **业务操作**：菜单/字典/角色授权、契约与代码生成、UI 扫描修复预演、模板与环境等，展示紧凑直调链路、真实请求状态和回执（预览 planHash → 用户确认 → 逐项结果）；
- **混合审阅流程**（v0.5+）：AI / 人工审阅 / 本地应用 / 原包检查 / 只读 MCP 混合；项目文件选择器与可核对版本来源的统一入口；
- **AI 工作台**：连接模型 API、本机 Codex 或本机 ZCode，把项目资料与选定 Skill 用于分析、受控工具调用和待审文件草稿；
- **工程基线**：异步隔离、性能预算与完整操作引导。

## 五层入口与证据口径

桌面把五包入口**分开呈现**，不把说明文档当执行结果：

1. **业务操作**——从业务名进入，见目标、输入、预览与结果；
2. **执行方式**——原包公开 executor / MCP / CLI，按实际支持入口调用，不绕私有 API；
3. **Skill**——流程与规则说明；指令型生成需要真正宿主/模型执行器与可核验产物，未接通时只展示"指导流程"；
4. **项目维护**——安装、更新、差异、清理、诊断单列，不在聚合根自动 init/update；
5. **任务证据**——计划、执行、校验、新鲜度、宿主加载分别展示；`readOnlyHint:false` 不一律理解为远程写。

当前桌面只筛选 `inventory.executors` 中**业务只读检查器（10 个入口）**，五包另有 Skill / CLI / MCP 全量入口经搜索与适配层可达；同一业务的多种入口不累加宣称能力数。

## 与 Gate 的关系

已受控接入 Gate 的项目可在桌面调用公开 `gate-check`：只接受完整项目目标 `["."]`，复用 Gate 现有 `run`，保留真实策略检查、raw 质量报告、失败和过期证据阻断。未接入、仅讨论、旧计划、版本/策略/输入变化均不能执行；报告存在不等于正式发布授权。详见 [wl-skills-gate 质量门](./gate)。

## 深入阅读

工程内文档（`wl-harness-desktop/docs/`）：`capability-map.md`（五包能力与桌面操作映射）· `product-help.md`（产品帮助）· `launch-entry.md`（启动入口）· `local-ai-integration.md`（本地 AI 集成）；适配器验收记录见 `wl-harness-adapter/docs/`（含 2026-10-18 五包与 10 个只读执行器实际复验）。
