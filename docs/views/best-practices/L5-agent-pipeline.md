# L5 — Agent Pipeline（智能体流水线）

::: tip ▶ 近期目标
当前项目已完成 L1-L4，L5 是下一个突破点。核心工程量是编写 `_pipeline.md` 协议文件。
:::

## 是什么

Agent Pipeline 是**预定义的多步 AI 自动化工作流**——上一步的输出自动成为下一步的输入，AI 在步骤间自主传递状态，人只需要在关键节点做 Review。

它不是单个 AI 对话，也不是多个孤立 Skill 的手动拼接，而是有明确状态机的**自动串联执行链**：

```
触发入口
    ↓
Step 1 执行 → 产物 A + 状态检查
    ↓（满足条件才进入下一步）
Step 2 执行 → 产物 B + 状态检查
    ↓
Step N 执行 → 最终交付物
    ↓
[可选] 人工 Review 节点
```

## 核心能力

| 能力 | 说明 |
|------|------|
| **状态传递** | 每步输出自动传递给下一步，无需人工复制粘贴 |
| **条件分支** | 根据中间结果走不同路径（如审计发现严重偏差 → 阻断代码生成） |
| **人工检查点** | 关键节点暂停等待确认，保留人的控制权 |
| **错误恢复** | 某步失败时可重跑该步，不必从头开始 |
| **审计日志** | 每步输入输出可回溯，便于调试和复盘 |

## 行业实现方式

| 方案 | 特点 | 适用场景 |
|------|------|---------|
| **LangGraph** | 图状态机，支持循环和条件分支 | Python 技术栈，复杂分支流程 |
| **AutoGen** | 多轮 Agent 对话链 | 需要 Agent 之间互相提问的场景 |
| **n8n / Dify** | 可视化工作流编排 | 非技术角色搭建流程 |
| **自定义协议文件** | Markdown 描述步骤依赖关系，AI 读取后自主执行 | 轻量嵌入现有项目，无额外框架依赖 |

> 对于大多数工程团队来说，**自定义协议文件**是进入 L5 的最低成本路径——不引入新框架，只需写好一份 `_pipeline.md`，让 AI 读取后按规则串联已有 Skill。

## 前端示例 — 本项目的 L5 规划

### 与当前工作流的对比

**当前（L2-L4）：人工触发每一步**

```
用户 → 触发 prototype-scan → 查看输出
用户 → 手动传递文件路径 → 触发 api-contract
用户 → 手动触发 page-codegen → 审查代码
用户 → 手动触发 convention-audit
```

**目标（L5）：AI 自主串联，人工只做 review**

```
用户 → 触发 prototype-scan
AI   → 输出页面清单 → 提示"建议触发 api-contract，是否继续？"
用户 → 确认
AI   → 自动执行 api-contract → 提示"api.md 已生成，建议触发 page-codegen？"
...
```

### 核心设计：`_pipeline.md` 协议

```
prototype-scan
  output_file: reports/PROTOTYPE_SCAN_*.md
  next_suggest: api-contract（可批量触发，每页一次）

api-contract
  input_from: prototype-scan output 或用户口述
  output_file: src/views/**/api.md
  next_suggest: page-codegen

page-codegen
  input_from: api-contract output
  output_files: data.ts + index.vue + index.scss
  next_suggest: convention-audit → [menu-sync, dict-sync]（并行可选）

convention-audit
  input_from: 任意 .vue / data.ts 文件
  output_file: reports/AUDIT_*.md
  next_suggest: code-fix（有 P0 偏差时）
```

### 灵活性原则

Pipeline **不是**强制线性流水线，任一步骤可单独触发：

| 场景 | 流程 |
|------|------|
| 有原型文档 | prototype-scan → api-contract → page-codegen → convention-audit → menu-sync |
| 直接口述需求 | [口述] → page-codegen → convention-audit → menu-sync |
| 只审计现有代码 | convention-audit → code-fix |
| 只同步字典 | dict-sync（独立运行） |
| 某步结果不满意 | 重跑那一步即可，不需要从头来过 |

### 实现难度与时间线

**难度：低到中**。不需要新框架——Cursor / Copilot Agent 模式 + 长上下文已支持多步骤自主执行。核心工程量是写好 `_pipeline.md`，预计 v3.0 实现。

**当前阻碍**：Skill 间没有状态传递协议。prototype-scan 的输出需要人工告诉 api-contract 去读哪个文件——这一步人工传递就是流水线缺失的根因。

## 延伸阅读

- [全景分析 - 架构升级路线图](./ai-landscape#架构升级路线图)
- [L6 — Multi-Agent 协同](./L6-multi-agent)

## 与当前工作流的对比

**当前（L2-L4）：人工触发每一步**

```
用户 → 触发 prototype-scan → 查看输出
用户 → 手动传递文件路径 → 触发 api-contract
用户 → 手动触发 page-codegen → 审查代码
用户 → 手动触发 convention-audit
```

**目标（L5）：AI 自主串联，人工只做 review**

```
用户 → 触发 prototype-scan
AI   → 输出页面清单 → 提示"建议触发 api-contract，是否继续？"
用户 → 确认
AI   → 自动执行 api-contract → 提示"api.md 已生成，建议触发 page-codegen？"
...
```

## 核心设计：`_pipeline.md` 协议

```
prototype-scan
  output_file: reports/PROTOTYPE_SCAN_*.md
  next_suggest: api-contract（可批量触发，每页一次）

api-contract
  input_from: prototype-scan output 或用户口述
  output_file: src/views/**/api.md
  next_suggest: page-codegen

page-codegen
  input_from: api-contract output
  output_files: data.ts + index.vue + index.scss
  next_suggest: convention-audit → [menu-sync, dict-sync]（并行可选）

convention-audit
  input_from: 任意 .vue / data.ts 文件
  output_file: reports/AUDIT_*.md
  next_suggest: code-fix（有 P0 偏差时）
```

## 灵活性原则

Pipeline **不是**强制线性流水线，任一步骤可单独触发：

| 场景 | 流程 |
|------|------|
| 有原型文档 | prototype-scan → api-contract → page-codegen → convention-audit → menu-sync |
| 直接口述需求 | [口述] → page-codegen → convention-audit → menu-sync |
| 只审计现有代码 | convention-audit → code-fix |
| 只同步字典 | dict-sync（独立运行） |
| 某步结果不满意 | 重跑那一步即可，不需要从头来过 |

## 实现难度

**低到中**。不需要新框架——Cursor / Copilot Agent 模式 + 长上下文已支持多步骤自主执行。核心工程量是写好 `_pipeline.md`，预计 v3.0 实现。

## 当前阻碍

Skill 间没有状态传递协议。prototype-scan 的输出（页面清单）需要人工告诉 api-contract 去读哪个文件——这一步人工传递就是流水线缺失的根因。

## 延伸阅读

- [全景分析 - 架构升级路线图](./ai-landscape#架构升级路线图)
- [L6 — Multi-Agent 协同](./L6-multi-agent)

## 业界实践参考

> 以下均为公开资料，可作为构建 Agent Pipeline 的技术选型参考。

| 公司 | 项目/实践 | 描述 |
|------|---------|------|
| **字节跳动（Trae）** | [Trae Agent 模式](https://www.trae.ai/) | 字节自研 AI IDE，内置 Agent Pipeline 模式，支持多步 Skill 自动串联，国内落地典型案例 |
| **Cursor** | [Cursor Agent Mode](https://docs.cursor.com/agent) | 主流编辑器中最成熟的 Pipeline 实现，支持多步骤自动执行 + 检查点确认 |
| **Devin（Cognition AI）** | [Devin](https://www.cognition.ai/) | 最早商业化的完整 Agent Pipeline 产品，原型到代码到测试全自动 |
| **GitHub** | [Copilot Workspace](https://githubnext.com/projects/copilot-workspace) | GitHub 官方 Pipeline 产品，Issue → Plan → Code → PR 自动串联 |
| **百度文心** | [AppBuilder](https://appbuilder.cloud.baidu.com/) | 国内典型 Agent Pipeline 低代码平台，可视化编排多步骤 AI 流程 |

## 参考资料

| 资源 | 说明 |
|------|------|
| [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) | Agent Pipeline 核心设计原则，强烈推荐阅读 |
| [LangGraph 官方文档](https://langchain-ai.github.io/langgraph/) | 图状态机框架，L5 的主流技术实现之一 |
| [GitHub Copilot Workspace](https://githubnext.com/projects/copilot-workspace) | GitHub 官方 Pipeline 产品介绍 |
| [Cursor Agent 文档](https://docs.cursor.com/agent) | 编辑器内置 Pipeline 最佳实践 |
| [Trae 官网](https://www.trae.ai/) | 字节自研 AI IDE，国内 Agent Pipeline 落地参考 |
