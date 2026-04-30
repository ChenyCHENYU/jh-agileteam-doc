# AI 最佳实践

<AuthorTag :authors="['ZhuXiang','CHENY']" />

## 概述

随着大模型能力的爆发，AI 辅助开发已从"偶尔用 ChatGPT 问问题"演进为**可量化、可复现、可工程化的生产力体系**。但团队在落地过程中普遍遇到三类问题：

- **不稳定**：同样的需求，AI 今天生成的代码和昨天不同，质量无法预期
- **不对齐**：AI 不了解团队规范，生成的代码风格各异，Review 成本极高
- **不持续**：个人摸索的 Prompt 技巧无法沉淀为团队资产，人走知识消失

本页面按照**能力层级（L0 → L7）** 梳理了系统化解法，帮助团队从"偶尔用 AI"进化到"AI 工程化"。**当前已落地 L1 ~ L4**，可直接体感收益：

| 能力维度 | 效果量化（前端场景） |
|---------|------------------|
| 规范对齐 | 13 条规范注入 Prompt，AI 生成代码违规率 < 5% |
| 开发提速 | 一个标准 LIST 页面（4 文件）从 45 分钟压缩到约 8 分钟 |
| 菜单/权限同步 | 手工 10 次操作 20 分钟 → AI 1 分钟 0 次手动，token 节省 87% |
| 规范审计 | 存量代码全量体检，偏差清单自动生成，告别"靠感觉 Review" |

> 完整的能力谱系分析请见 [全景分析](./ai-landscape)。

## 四层能力架构

在深入每个 L 级之前，先理解横向的**四层技术分工**——它是整个体系的骨架，决定了每一层能做什么、为什么要这样拆：

```
提示词层（Prompt）  ─── 规则 / 约束 / 意图翻译        ← 最耗 Token，最基础
        ↓ 依赖
Skills 层（Core）   ─── 业务原子能力（纯 TS 复用层）  ← 核心内核，MCP / CLI 共用
        ↓ 依赖
MCP 层（Server）    ─── AI 自由调用工具，执行真实操作  ← 细粒度，有副作用
        ↓ 聚合
CLI 层              ─── 聚合命令，固化流程，无人值守   ← 极简 Token，CI/CD 兜底
```

| 层 | 核心职责 | 特征 | 对应 L 级 |
|---|---|---|---|
| **Prompt 层** | 规范注入、上下文压缩、意图翻译 | 纯文案，不执行操作 | L1 |
| **Skills 层** | 业务工程化原子能力封装（纯 TS） | 无副作用，可被 MCP / CLI 复用 | L2 |
| **MCP 层** | AI 主动调用工具，读写 / 调接口 | 有副作用，AI 自由编排 | L3 |
| **CLI 层** | 聚合命令，批量执行，零 AI 依赖 | 可 CI/CD，最低 Token | L4 |

> 四层**分层隔离、互不重叠、体系闭环**。Prompt 告诉 AI「什么是对的」，Skills 封装「怎么做」，MCP 让 AI「动手执行」，CLI 在「无 AI 场景兜底」。L5 + 是在四层稳定之后的升维。

## 层级体系

| 层级 | 名称 | 状态 | 说明 |
|---|---|---|---|
| **L0** | 氛围编程 | 已了解 | 纯对话驱动，AI 自由发挥，高随机性 |
| **L1** | 提示词工程 | ✅ 已实现 | 结构化 Prompt + 规范注入 + 上下文压缩 |
| **L2** | Skills | ✅ 已实现 | 9 个触发词驱动的结构化技能文件 → [速查表](/frontend/pc/skills/usage-guide) |
| **L3** | MCP 工具调用 | ✅ 已实现 | 10 个 Tool，菜单/字典/角色/权限全覆盖 |
| **L4** | CLI | ✅ 已实现 | init / update / clean / dry-run |
| **L5** | Agent Pipeline | ▶ 近期目标 | Skill 链式自动触发，减少人工干预 |
| **L6** | Multi-Agent 协同 | ⏳ 远期目标 | 专家 Agent 分工 + 并发处理 |
| **L7** | 自演化体系 | 🔭 终极形态 | 高质量产出反哺规范，正向飞轮 |

## 快速导航

- [全景分析](./ai-landscape) — L0-L7 完整能力谱系 + 架构升级路线图
- [L0 — 氛围编程](./L0-vibe) — 了解 AI 自由对话的边界
- [L1 — 提示词工程](./L1-prompt) — 结构化 Prompt 与规范注入
- [L2 — Skill](./L2-skill) — 触发词驱动的结构化技能文件
- [L3 — MCP 工具调用](./L3-skills-mcp) — MCP Server 接入与工具调用
- [L4 — CLI](./L4-cli) — AI 驱动的命令行工具
- [L5 — Agent Pipeline](./L5-agent-pipeline) — Skill 链式自动触发
- [L6 — Multi-Agent 协同](./L6-multi-agent) — 多智能体并发协作
- [L7 — 自演化体系](./L7-self-evolving) — 正向飞轮与持续进化

## 参考资料

| 资源 | 说明 |
|------|------|
| [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) | Anthropic 官方发布的 Agent 构建最佳实践，L5/L6 设计基础 |
| [OpenAI — A practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf) | OpenAI 官方 Agent 落地指南 |
| [Model Context Protocol 官网](https://modelcontextprotocol.io/) | MCP 协议规范，L3 的底层标准 |
| [LangChain — Agent 文档](https://python.langchain.com/docs/concepts/agents/) | 主流 Agent 框架，L5/L6 参考实现 |
| [GitHub Copilot 官方文档](https://docs.github.com/en/copilot) | 主力编辑器接入文档 |
| [Cursor 官方文档](https://docs.cursor.com/) | Cursor 规则与 Agent 模式 |
