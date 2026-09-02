# AI 最佳实践

<AuthorTag :authors="['ZhuXiang','CHENY']" />

## 为什么分层？

AI 辅助开发容易陷入两个极端：**"只会聊天"**（浪费工程潜力）或 **"直接上全自动"**（规范与可靠性未就绪时引入不确定性）。

分层模型的价值：让每个团队清楚 **"我现在在哪里、下一步做什么、成熟后能到哪里"**，避免跳级建设。

## 效果量化（前端场景实测）

| 维度 | 效果 |
|------|------|
| 规范对齐 | 14 条规范注入 Prompt，AI 生成代码违规率 < 5% |
| 开发提速 | 标准 LIST 页面（4 文件）45 分钟 → 约 8 分钟 |
| 菜单/权限同步 | 手工 10 次操作 20 分钟 → AI 1 分钟 0 次手动，token 节省 87% |
| 规范审计 | 存量代码全量体检，偏差清单自动生成，告别"靠感觉 Review" |

## 能力谱系总览

```text
L0  氛围编程（Vibe Coding）
    │  纯自然语言 → AI 自由发挥 → 无规范约束        适合：个人探索、快速验证
    │
L1  提示词工程（Prompt Engineering）              ← 所有上层的基础
    │  结构化 Prompt → 规范注入 → 上下文压缩        适合：团队有规范，要 AI 稳定遵守
    │
L2  Skills（结构化技能文件）                       ← 已落地
    │  触发词 → SKILL.md 剧本 → Pre-flight 声明     适合：高频重复任务
    │
L3  MCP（模型上下文协议）                          ← 已落地
    │  AI 主动调用工具 → 真实 I/O → 副作用执行      适合：AI 直接操作系统
    │
L4  CLI（命令行工具）                              ← 已落地
    │  聚合命令 → 固化流程 → 零 AI 依赖 → CI/CD     适合：工程初始化、流水线自动化
    │
L5  Agent Pipeline                                 ← 践行中
    │  Skill 链式自动触发 → 状态传递                适合：多步骤标准化流程
    │
L6  Multi-Agent 协同                               ← 近期目标
    │  专家 Agent 分工 → 并发处理 → 质量仲裁        适合：大规模批量、多域并发
    │
L7  自演化体系                                      ← 终极形态
       高质量产出 → 反哺规范/模板 → 正向飞轮         适合：体系成熟后自主优化
```

## 各层级关键对比

| 层级 | Token 消耗 | 确定性 | 可 CI/CD | 实现成本 | 核心价值 |
|------|-----------|-------|---------|---------|---------|
| L0 | 高（无压缩） | 低 | ❌ | 零 | 探索验证 |
| L1 | 中（规范注入） | 中 | ❌ | 低 | 规范对齐 |
| L2 | 中（懒加载） | 高 | ❌ | 中 | 可复现产出 |
| L3 | 低（工具调用） | 高 | ⚠️ 有副作用 | 中 | 真实执行 |
| L4 | 极低（零推理） | 极高 | ✅ | 中 | 批量自动化 |
| L5 | 低（状态传递） | 高 | ⚠️ 需检查点 | 中高 | 流程自动串联 |
| L6 | 高（多 Agent） | 高 | ⚠️ 编排复杂 | 高 | 并发 + 专业化 |
| L7 | — | — | — | 极高 | 体系自优化 |

## 四层技术分工

体系骨架是横向的**四层技术分工**，决定了每层能做什么、为什么要这样拆：

```text
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

> 四层**分层隔离、互不重叠、体系闭环**。Prompt 告诉 AI「什么是对的」，Skills 封装「怎么做」，MCP 让 AI「动手执行」，CLI 在「无 AI 场景兜底」。L5+ 是四层稳定之后的升维。

## 层级体系（L0 → L7）

<LevelsTable mode="detail" />

> 各层级状态单一维护于 `LevelsTable/data.ts`，与[指南页](/views/guide/)、[成熟度对照](./maturity)自动同步。团队没有三类问题不解决就上自动化：**不稳定**（同样需求产出不同）、**不对齐**（不了解规范，Review 成本高）、**不持续**（个人技巧无法沉淀，人走知识消失）。

## 快速导航

- [成熟度对照](./maturity) — 技术栈层级 × 部门人员等级（L0-L5）映射、负向行为的工程兜底
- [L0 — 氛围编程](./L0-vibe) · [L1 — 提示词工程](./L1-prompt) · [L2 — Skill](./L2-skill) · [L3 — MCP](./L3-skills-mcp) · [L4 — CLI](./L4-cli)
- [L5 — Agent Pipeline](./L5-agent-pipeline) · [L6 — Multi-Agent](./L6-multi-agent) · [L7 — 自演化](./L7-self-evolving)
- 清单类内容的唯一权威：[前端 PC Skills](/frontend/pc/skills/) · [CLI 命令](/frontend/pc/skills/cli) · [Skills 使用指南](/frontend/pc/skills/usage-guide)

## 参考资料

| 资源 | 说明 |
|------|------|
| [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) | Agent 构建官方实践，L5/L6 设计基础 |
| [OpenAI — A practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf) | OpenAI Agent 落地指南 |
| [Model Context Protocol](https://modelcontextprotocol.io/) · [规范源码](https://github.com/modelcontextprotocol/specification) | MCP 协议规范与动态（L3 基础） |
| [GitHub Copilot 文档](https://docs.github.com/en/copilot) · [Cursor 文档](https://docs.cursor.com/) | 编辑器接入：指令文件、Agent 模式、MCP |
| [Vibe Coding — Andrej Karpathy](https://x.com/karpathy/status/1886192184808149190) | "Vibe Coding" 概念出处（2025.02） |
