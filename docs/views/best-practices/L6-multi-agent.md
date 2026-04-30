# L6 — Multi-Agent 协同

::: tip ⏳ 远期目标
L5 稳定后的自然演进，现阶段不主动规划。
:::

## 是什么

Multi-Agent 协同是指**多个专业化 AI Agent 分工协作**——每个 Agent 聚焦一个窄域，拥有独立的上下文、工具集和专属 Prompt，通过结构化消息互相通信，最终由协调 Agent 整合结果。

它解决的核心问题：**单个 Agent 上下文窗口有限，无法同时处理大规模、多角色任务**。

```
用户目标
    ↓
Orchestrator（协调 Agent）
    ├── → Analyst Agent（分析/拆解）
    ├── → Builder Agent（代码生成）
    ├── → QA Agent（质量审计）
    └── → Integrator Agent（结果整合）
    ↓
最终交付物
```

## 核心能力

| 能力 | 说明 |
|------|------|
| **Agent 专业化** | 每个 Agent 有独立 System Prompt、工具箱和领域知识 |
| **上下文隔离** | Agent A 的上下文不污染 Agent B，避免交叉干扰 |
| **并行处理** | 独立子任务并发执行，显著缩短整体耗时 |
| **结果聚合** | 协调 Agent 或质量仲裁 Agent 合并各 Agent 输出 |
| **专项增强** | 某些任务引入更强的专属 Agent（如安全审计 Agent、性能分析 Agent）|

## 主流实现模式

| 模式 | 描述 | 代表工具 |
|------|------|---------|
| **Orchestrator/Worker** | 一个主 Agent 拆解任务，派发给多个 Worker Agent | AutoGen、CrewAI |
| **Peer-to-Peer** | Agent 之间互相调用，无固定主从关系 | Swarm (OpenAI) |
| **Hierarchical** | 多层 Agent 树，顶层负责策略，底层负责执行 | LangGraph Multi-Agent |
| **Parallel Fan-out** | 同一任务派发给多个 Agent 独立完成，取最优结果 | 自定义编排 |

> **核心成本**：Token 消耗是单 Agent 的 3-5 倍，框架复杂度显著上升。只有在单 Agent 确实无法胜任时才值得投入。

## 前端示例 — 本项目的 L6 适用场景

### 适用场景

- 20 个页面以上的批量生成，单 AI 上下文装不下时
- 需要并发处理多个独立模块（如同时处理销售域 + 生产域），缩短整体耗时
- 某个专项任务需要更强的专业 Agent（如专属的安全审计 Agent 扫描所有 `v-html` 用法）

### 可能的 Agent 分工方案

| Agent | 专属职责 | 专属工具 |
|-------|---------|---------|
| 原型分析 Agent | 理解 Axure 原型，输出 page-spec | prototype-scan Skill |
| 接口设计 Agent | 生成 api.md，与后端约定字段 | api-contract Skill |
| 代码生成 Agent | 按 page-spec + api.md 生成 4 文件 | page-codegen Skill |
| 规范审计 Agent | 并发扫描所有新生成文件 | convention-audit Skill |
| 协调 Agent | 拆解目标、分派任务、整合结果 | 所有 MCP Tools |

### 前置条件

在 **[L5 Agent Pipeline](./L5-agent-pipeline)** 跑通并稳定运转之后再规划 L6。单 Agent 能搞定的事，不需要引入 Multi-Agent 的复杂度。

## 延伸阅读

- [L5 — Agent Pipeline](./L5-agent-pipeline) — 前置阶段
- [L7 — 自演化体系](./L7-self-evolving) — 更高阶形态

## 适用场景

- 20 个页面以上的批量生成，单 AI 上下文装不下时
- 需要并发处理多个独立模块，缩短整体耗时
- 某个专项任务需要更强的专业 Agent（如专属的安全审计 Agent）

## 实现难度

**高**。需要：
- Agent 编排框架（AutoGen / LangGraph 或编辑器 Agent 模式串联）
- 上下文隔离设计
- Agent 间通信协议
- Token 消耗是单 Agent 的 3-5 倍

## 前置条件

在 **[L5 Agent Pipeline](./L5-agent-pipeline)** 跑通并稳定运转之后再规划 L6。

## 延伸阅读

- [L5 — Agent Pipeline](./L5-agent-pipeline) — 前置阶段
- [L7 — 自演化体系](./L7-self-evolving) — 更高阶形态

## 业界实践参考

| 公司 | 项目/实践 | 描述 |
|------|---------|------|
| **微软** | [AutoGen](https://microsoft.github.io/autogen/) | 微软开源的 Multi-Agent 框架，Orchestrator + Worker 模式，业界影响力最大的参考实现 |
| **AWS** | [Bedrock Multi-Agent](https://aws.amazon.com/bedrock/agents/) | AWS Bedrock 内置多 Agent 编排，适合已使用 AWS 基础设施的企业 |
| **阿里云（通义）** | [AgentFabric](https://help.aliyun.com/zh/model-studio/developer-reference/what-is-agentfabric) | 阿里云 AgentFabric，支持多 Agent 协同编排，国内大厂实践 |
| **腾讯（混元）** | [腾讯云混元 Agent](https://cloud.tencent.com/product/hunyuan) | 腾讯云混元大模型 Multi-Agent 方案，内部大规模落地经验 |
| **CrewAI** | [CrewAI](https://www.crewai.com/) | 角色扮演式 Multi-Agent 框架，Crew = 一组专家 Agent，适合流程明确的协同任务 |

## 参考资料

| 资源 | 说明 |
|------|------|
| [微软 AutoGen 官方文档](https://microsoft.github.io/autogen/) | 最成熟的开源 Multi-Agent 框架 |
| [CrewAI 官方文档](https://docs.crewai.com/) | 角色分工型 Multi-Agent，易上手 |
| [LangGraph Multi-Agent](https://langchain-ai.github.io/langgraph/concepts/multi_agent/) | 图状态机多 Agent 协同，支持复杂分支 |
| [OpenAI Swarm（实验性）](https://github.com/openai/swarm) | OpenAI 官方 Multi-Agent 轻量框架 |
| [AWS Bedrock Agents](https://aws.amazon.com/bedrock/agents/) | 企业级 Multi-Agent 托管方案 |
