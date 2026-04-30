# L1 — 提示词工程（Prompt Engineering）

> 当前项目 L1 的核心：**系统级规则注入 + 上下文压缩 + 触发词精准路由**，三层叠加让 AI 输出稳定可预测。

<AuthorTag :authors="['CHENY']" />

## 能力概览

提示词层是整个 AI 工程化体系的地基——**纯文案，不执行任何操作，只负责告诉 AI「什么是对的」**。所有上层能力（Skills / MCP / CLI）的产出质量，最终都由这一层的规则注入质量决定。

```
提示词能力
│
├── 1. 业务规则约束
│   ├── 代码规范约束、编码风格强制要求
│   ├── 项目目录结构、模块命名规范约束
│   ├── 详设文档输出格式、字段规范约束
│   └── 业务模块专属开发规则
│
├── 2. 意图理解与翻译
│   ├── 自然语言需求 → 开发动作翻译
│   ├── 口语描述 → 标准化指令转换
│   └── 复杂需求拆解、分步任务拆解
│
├── 3. 内容生成与格式化
│   ├── 纯文本文档生成（详设、接口说明、注释）
│   ├── Markdown / JSON / YAML 规范排版
│   ├── 代码注释、文案、日志文案生成
│   └── 错误信息解读、问题原因通俗解释
│
├── 4. 静态分析与评审
│   ├── 代码片段静态评审、坏味道识别
│   ├── 逻辑漏洞、写法不规范人工规则校验
│   ├── 接口设计合理性、字段设计评审
│   └── 优化建议、重构方案文案输出
│
└── 5. 上下文记忆与持续迭代
    ├── 项目全局上下文记忆、模块认知
    ├── 多轮对话连续开发、上下文续接
    └── 历史产出复用、风格统一延续
```

> **核心特征**：最耗 Token，但也是最基础的一层。没有良好的 Prompt 层，Skills / MCP / CLI 的产出就无法稳定对齐团队规范。

## 前端示例 — 本项目的 L1 实现

| 能力 | 实现方式 |
|------|----------|
| 系统级规则注入 | `copilot-instructions.md`（10 个编辑器 `_compat` 适配，统一源头） |
| 任务型少样本 | 各 `SKILL.md` 的示例输出段落（AI 知道"正确的输出长什么样"） |
| 思维链引导 | Pre-flight 声明 + 前置检查清单（AI 在执行前先列出已读文件和状态） |
| 上下文压缩 | `standards/index.md` 任务类型 → 规范子集映射，按需懒加载（避免一次性塞入 13 条规范） |
| 领域词汇锚定 | `_registry.md` 触发词单一数据源（一处定义，全编辑器同步） |

## 为什么这样设计（前端示例）

### 问题：AI 为什么经常"不守规矩"？

AI 模型的训练数据是通用互联网内容，它的默认行为是"通用最佳实践"，而不是你项目的约定（比如命名前缀、字典编码、AbstractPageQueryHook 用法）。

### 解法：上下文注入 + 懒加载

```
用户发起任务
    │
    ▼
copilot-instructions.md 已载入（系统级，Copilot 自动读取）
    │  └─ 描述：项目技术栈 + 团队约定 + Skill 路由规则
    ▼
AI 匹配触发词 → 读取对应 SKILL.md（精准加载，不污染上下文）
    │
    ▼
SKILL.md 内的 Pre-flight 指令 → AI 声明已读文件 + 工具链状态
    │  └─ 可观测：Pre-flight 没输出 = AI 没读 = 立即重触发
    ▼
任务执行（只加载本次任务需要的规范子集）
```

### 上下文压缩的价值

直接把 13 条规范全部载入 = 每次 token 浪费 ~8000 tokens，且 AI 注意力分散。

`standards/index.md` 的任务映射方案：

| 任务类型 | 加载的规范子集 |
|---------|--------------|
| 生成新页面 | 01-toolchain + 02-code-structure + 04-coding-basics + 07-config |
| 表单/弹窗 | + 11-form-validation |
| 规范审计 | 全量 13 条（convention-audit 专用） |
| 样式修改 | 仅 SCSS 相关 |

## 待提升方向

| 问题 | 现状 | 建议 |
|------|------|------|
| 边界场景回默认行为 | `page-codegen` / `convention-audit` 缺少"❌ 错误示范"反例 | 给关键 SKILL.md 加反例段落 |
| 多触发词命中时歧义 | 无消歧机制 | 在 `_registry.md` 增加互斥组声明 |
| 规范更新不一致 | 业务项目是 kit 的副本，手动改不同步 | 升级 kit + `wl-skills update` 是唯一正确路径 |

## 核心原则

> **L1 的本质是"帮 AI 建立上下文"。信息给得越精准，AI 输出越稳定。**  
> 不是让 AI 更聪明，而是让 AI 知道"这个项目里什么是对的"。

## 延伸阅读

- [L2 — Skill](./L2-skill) — 基于 L1 机制构建的结构化技能文件
- [全景分析](./ai-landscape) — L1 在整体谱系中的位置

## 参考资料

| 资源 | 说明 |
|------|------|
| [OpenAI — Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering) | OpenAI 官方提示词工程指南，L1 基础 |
| [Anthropic — Prompt Library](https://www.anthropic.com/prompt-library) | Anthropic 官方示例库，各场景提示词模板 |
| [GitHub Copilot — 指令文件官方文档](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot) | copilot-instructions.md 官方说明 |
| [Cursor Rules 官方文档](https://docs.cursor.com/context/rules-for-ai) | Cursor .cursorrules / .cursor/rules 配置 |
| [LearnPrompting.org](https://learnprompting.org/) | 提示词工程开源教程，覆盖 CoT / Few-shot / RAG 等技术 |

