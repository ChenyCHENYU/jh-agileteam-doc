<div align="center">

# ⚡ AGILE TEAM — AI 工程体系文档站

**金恒科技 · 敏捷团队 · AI 驱动的全流程工程化知识库**

*从原型扫描到代码交付，从提示词工程到多 Agent 协同*

[![VitePress](https://img.shields.io/badge/VitePress-2.x_alpha-646cff?style=flat-square&logo=vite)](https://vitepress.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![UnoCSS](https://img.shields.io/badge/UnoCSS-66.x-333333?style=flat-square&logo=unocss)](https://unocss.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-workspace-f69220?style=flat-square&logo=pnpm)](https://pnpm.io/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)

</div>

---

## 这是什么

一个面向全栈研发团队的 **AI 工程化知识文档站**，沉淀团队在 AI 辅助研发实践中积累的 Skills、规范、工作流与组件体系。

不是普通的 Wiki。它是一套可执行的工程化方法论 —— 每一个 Skill 都可以直接在 AI 编辑器（Copilot / Cursor / Windsurf 等）中调用，从 Axure 原型到可运行代码，一键完成。

---

## 核心能力

### 🎯 AI Skill 体系

通过 `@agile-team/wl-skills-kit` 一键将完整 Skill 体系注入到你的前端项目：

```bash
# 在前端项目根目录执行（无需全局安装）
npx @agile-team/wl-skills-kit
```

| 方向 | Skill 数量 | 覆盖链路 |
|------|-----------|---------|
| **PC 端前端** | 11 个 | 原型扫描 → 说明书解析 → 接口约定 → 页面生成 → 业务文档提取 → 菜单/字典/权限同步 → 规范审计 → 模板提取 → 自动修复 |
| **移动端 H5** | 7 个 | 原型扫描 → 接口规格 → 接口约定 → 页面生成 → 路由注册 → Mock 生成 → 规范审计 |

**套件包含内容**：

| 分类 | 数量 | 说明 |
|------|------|------|
| AI Skills | 11 个 | 端到端代码生成全链路（含双线路由） |
| MCP Tools | 17 个 | 菜单/字典/权限/代码扫描/页面校验等 |
| 编码规范 | 14 条 | 模块化规范，AI 自动门控加载 |
| 页面模板 | 9 种 | LIST / FORM / MASTER_DETAIL / TREE_LIST 等 |
| 组件 API 文档 | 12 个 | 内置平台组件使用规范 |
| 通用组件 | 15 个 | 全局 + 按需 + 远程 |
| 领域样例 | 13 个 | 生产域 8 页 + 销售域 5 页 |
| 编辑器配置 | 10 种 | Copilot / Cursor / Windsurf / Kiro / Trae 等 |

### 📐 AI 最佳实践 — L0 → L7 能力体系

```
L0  氛围编程        — 让 AI 感知项目上下文，告别泛化回答
L1  提示词工程      — 结构化 Prompt，精准控制 AI 输出质量
L2  Skill          — 可复用的 AI 任务单元，沉淀团队最佳实践
L3  Skills & MCP   — Skill 组合 + MCP 工具调用，突破上下文限制
L4  CLI            — 工程化脚手架，一行命令完成复杂初始化
L5  Agent Pipeline — 多步自动化流水线，人只在关键节点 Review  🚧
L6  Multi-Agent    — 多 Agent 分工协同，处理大规模复杂任务    🔭
L7  自演化体系      — 产出反哺规范，精度持续提升的正向飞轮    🔭
```

### 🤖 AI 工作流

覆盖软件研发全流程的 AI 协作实践：

- **原型设计** — AI 辅助交互设计与原型评审
- **详细设计** — 数据结构、接口设计的 AI 协同模式
- **全栈开发** — 前后端联动的 AI 代码生成实践
- **测试实践** — AI 驱动的测试用例生成与自动化

---

## 文档结构

```
docs/
├── views/
│   ├── guide/              # 上手指南
│   ├── best-practices/     # AI 最佳实践（L0-L7 能力层级）
│   ├── ai-workflow/        # AI 工作流（原型 / 设计 / 全栈 / 测试）
│   ├── team/               # 团队成员（前端 / 后端）
│   └── styling/            # 样式方案（UnoCSS / SCSS / UI 设计系统）
│
├── frontend/
│   ├── quick-start/        # 快速上手 + 13 条编码规范
│   ├── pc/                 # PC 端：概览、架构、规范、9 个 Skill
│   └── mobile-h5/          # 移动端 H5：概览、规范、7 个 Skill、@robot-h5/core
│
├── backend/                # 后端：概览、规范、Skills 集合
│
├── ui-components/          # 平台组件库文档（BaseTable / BaseForm / AGGrid 等）
│
├── templates/              # 页面模板库（生产 / 销售 / 质量 / 成本）
│
└── skills/                 # Skill 使用指南与 CLI 工具
```

---

## 前端 PC Skills 集合（v2.10.0）

11 个 AI 辅助研发 Skill + 17 个 MCP Tool + 9 条 CLI 命令，覆盖从需求到交付的完整链路：

| # | Skill | 说明 |
|---|---|---|
| ① | prototype-scan | 原型/截图/口述 → 页面清单（原型线） |
| ② | spec-doc-parse | 标准说明书 → 页面清单（规范线） |
| ③ | api-contract | 生成前后端接口约定文档 |
| ④ | page-codegen | 基于约定一键生成可运行页面代码（4 文件）|
| ⑤ | business-doc-extract | 语义级触发 → 结构化业务文档 |
| ⑥ | template-extract | 从标杆页面提取领域专属模板 |
| ⑦ | convention-audit | 14 条规范扫描，偏差清单自动生成 |
| ⑧ | menu-sync | MCP 驱动同步菜单（0 次手动点击）|
| ⑨ | dict-sync | MCP 驱动同步字典基线 |
| ⑩ | permission-sync | 角色+菜单授权+动作权限闭环 |
| ⑪ | code-fix | 受控自动修复偏差代码 |

```bash
# 在前端项目根目录执行（新项目接入）
npx @agile-team/wl-skills-kit

# 增量更新
npx @agile-team/wl-skills-kit update

# 一键环境预检
wl-skills check
```

## 后端 Skills 集合（v0.0.1 骨架）

`@agile-team/wl-skills-bd`：9 个核心 Skill，覆盖接口设计 → 代码生成 → DDL → 单测 → 规范审计全链路，与前端 Skills 三包协作。

---

## 快速开始

**环境要求**：Node.js ≥ 18，pnpm ≥ 8

```bash
# 克隆仓库
git clone <repo-url>
cd jh-agileteam-doc

# 安装依赖
pnpm install

# 本地开发（热更新）
pnpm dev

# 构建生产产物
pnpm build

# 预览构建结果
pnpm preview
```

访问 `http://localhost:5173` 查看文档站。

---

## 技术栈

| 层面 | 技术 | 说明 |
|------|------|------|
| 文档框架 | VitePress 2.x | SSG + Vue 3 组件支持 |
| 语言 | TypeScript 5.x | 全量类型覆盖 |
| 样式 | UnoCSS + SCSS | Atomic CSS + 组件级样式 |
| 包管理 | pnpm workspace | Monorepo 就绪 |
| 组件库 | Vue 3 | 自定义主题组件 |
| 评论系统 | Waline | 轻量无后端评论 |
| 部署 | Vercel | 自动 CI/CD，全球 CDN |

**设计语言**：Linear × Apple Premium — 暗色优先 / Glassmorphism 卡片 / Aurora 渐变网格 / 精致微动画

---

## 贡献指南

所有文档均在 `docs/` 目录下以 Markdown 编写，支持嵌入 Vue 组件。

| 配置项 | 文件路径 |
|--------|---------|
| 顶部导航 | `docs/.vitepress/config/nav.ts` |
| 侧边栏 | `docs/.vitepress/config/sidebar.ts` |
| 自定义样式 | `docs/.vitepress/theme/custom.css` |
| 全局组件 | `docs/.vitepress/components/` |

提交规范遵循 [Conventional Commits](https://www.conventionalcommits.org/)，详见 [贡献指南](/docs/frontend/quick-start/contributing.md)。

---

## 团队

金恒科技 AGILE TEAM — 前端、后端、业务、产品、测试全角色协作团队，持续推进 AI 驱动的研发工程化实践。

---

<div align="center">

Copyright © 2026 金恒科技 AGILE TEAM · All Rights Reserved

*持续进化中 · 欢迎共建*

</div>
