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

移动端工程基线：Robot_H5 `v1.7.1+`、`@robot-h5/core@^1.1.4`；包含 PDA 旧 WebView 兼容、wl-mbase 单头部/动态标题、可信桥接与 App SDK 按需加载规范。

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
| **PC 端前端** | 13 个 | 原型扫描 → 说明书解析 → 业务文档提取 → 接口约定 → 页面生成 → 规范审计 → 模板提取 → 菜单/字典/权限同步 → 自动修复 → 环境配置 → 存量字典列 Tag 化 |
| **移动端 H5** | 7 个 | 原型扫描 → 接口规格 → 接口约定 → 页面生成 → 路由注册 → Mock 生成 → 规范审计 |

**套件包含内容**：

| 分类 | 数量 | 说明 |
|------|------|------|
| AI Skills | 13 个 | 端到端代码生成全链路（含双线路由 + status-column-audit 存量改造） |
| MCP Tools | 17 个 | 菜单/字典/权限/代码扫描/页面校验等 |
| 编码规范 | 14 条 | 模块化规范，AI 自动门控加载 |
| 页面模板 | 9 种 | LIST / FORM / MASTER_DETAIL / TREE_LIST 等 |
| 组件 API 文档 | 11 个 | 内置平台组件使用规范 |
| 通用组件 | 7 个 | local 4 + global 3 |
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
│   ├── guide/              # 上手指南与站点地图
│   ├── best-practices/     # AI 最佳实践（L0-L7 能力层级）
│   ├── ai-workflow/        # AI 工作流（设计技能 / 原型 / 详设 / 全栈 / 测试）
│   ├── team/               # 团队介绍（前端 / 后端 / 业务）
│   ├── styling/            # 样式方案（UnoCSS / SCSS / UI 设计系统）
│   └── troubleshooting/    # 疑难杂症
│
├── frontend/
│   ├── quick-start/        # 快速上手 + 16 条编码规范
│   ├── pc/                 # PC 端：概览、架构、规范、34 个组件、13 个 Skill
│   ├── mobile-h5/          # 移动端 H5：概览、规范、7 个 Skill、@robot-h5/core
│   └── mobile-uniapp/      # 移动端 uniApp：基座、H5/App 集成、消息中心、钉钉
│
├── platform/               # 低代码平台用户手册（18 模块 / 426 张截图）
│
├── scaffold/               # 工程脚手架（jh4j-cloud-cli 命令文档）
│
├── backend/                # 后端：概览、规范、Skills 集合
│
├── ui-components/          # 平台组件库入口（指向 PC 端组件文档）
│
└── templates/              # 业务页面模板库（生产 / 质量 / 销售 / 成本）
```

---

## 前端 PC Skills 集合（v2.20.1）

13 个 AI 辅助研发 Skill + 29 个 MCP Tool + 18 条 CLI 命令，覆盖从需求到交付的完整链路；v2.20 起**场景模板体系（wl-scenario）落地**——领域场景以 JSON 事实源描述，由 kit 编译器确定性渲染页面（AI 零自由度），render 单页 0.4~1ms、模型 token 恒为 0（对比 AI 主流程每页约 2 万 token 输入），配套 Page Blueprint 快照、字节级防漂移校验与往返等价性机器证明：

| # | Skill | 说明 |
|---|---|---|
| ① | prototype-scan | 原型/截图/口述 → 页面清单（原型线） |
| ② | spec-doc-parse | 标准说明书 → 页面清单（规范线） |
| ③ | business-doc-extract | 语义级触发 → 结构化业务文档 |
| ④ | api-contract | 生成前后端接口约定文档 |
| ⑤ | page-codegen | 基于约定一键生成可运行页面代码（4 文件）|
| ⑥ | convention-audit | 14 条规范扫描，偏差清单自动生成 |
| ⑦ | template-extract | 从标杆页面提取领域专属模板 |
| ⑧ | menu-sync | MCP 驱动同步菜单（0 次手动点击）|
| ⑨ | dict-sync | MCP 驱动同步字典基线 |
| ⑩ | permission-sync | 角色+菜单授权+动作权限闭环 |
| ⑪ | code-fix | 受控自动修复偏差代码 |
| ⑫ | env-config | 环境标准化 / 客户迁移（dry-run → apply）|
| ⑬ | status-column-audit | 存量字典列纯文本 → 语义自动判色 Tag（审计 + `--fix` + `--init-bridge`）|

> v2.18.0 起 kit 审计规则编号由 R1~R19 重命名为 **K1~K19**（与 wl-skills-ui 的 R001~R043 编号空间解耦）；存量项目的 `wl-skills:ignore` 标记与 `.wl-skills-validate.json` 豁免同时兼容新旧前缀，零改动升级。v2.19.0 起 `wls_project_snapshot` 提供按页隔离、默认脱敏、带 fingerprint 的 Page Blueprint 快照，AI 优先消费页面结构事实以省 token。

```bash
# 在前端项目根目录执行（新项目接入）
npx @agile-team/wl-skills-kit

# 增量更新
npx @agile-team/wl-skills-kit update

# 一键环境预检
npx @agile-team/wl-skills-kit check
```

## 工程脚手架（jh4j-cloud-cli）

`@agile-team/jh4j-cloud-cli`（v0.6.3）—— 从受控模板一键创建结构一致、配置完整的 PC 业务子系统或移动端 H5 应用：

```bash
# 无需全局安装
npx @agile-team/jh4j-cloud-cli create my-project

# 环境体检
npx @agile-team/jh4j-cloud-cli doctor
```

支持模板直选（PC/移动端）、快速/自定义双模式创建、GitHub→Gitee 主备源容灾、模板缓存、事务化生成与失败恢复；移动端模板默认基线 Robot_H5 `v1.8.0` + `@robot-h5/core@^1.2.0`（可信桥接与 App/PDA SDK 按需加载）。详见 [工程脚手架文档](/scaffold/)。

## 低代码平台用户手册

FSI2 低代码平台 V3.1.0 完整操作手册，覆盖 18 个功能模块（基础配置 / 权限菜单 / 流程人事 / 低代码开发 / 运维监控），含 426 张操作截图（托管于阿里云 OSS）。详见 [平台手册](/platform/)。

## 后端 Skills 集合（v0.24.0）

`@agile-team/wl-skills-bd`：17 个 MCP 工具 + 13 个 Skill + 30 条规范，覆盖框架扩展点 Bean（B28/B29）、生产安全契约、通用契约与运行时边界闭环、契约驱动代码生成、模块目录与精准上下文、配置分层与多环境、任务驱动、数据安全护栏、行为契约测试全链路；v0.19 起新增**数据库源头一致性闭环**（文档 ↔ 契约 ↔ Flyway ↔ 线上快照四方对账、DDL 执行账本、改名豁免审批），v0.20 落地**数据库事实源强门禁**（standards/29 基线表同名复用 + 全属性漂移检测 + B31 事实源指纹进入 planHash）；v0.21~v0.24 完成**准确率与性能优化**（规则短路/Source Index 缓存/MCP token 预算/eval:quality 门禁）、**多模块与契约分类**（crud/schema-mirror/integration-projection + contract inspect/migrate + impact field 字段影响链 + 集成投递机器契约）、**变更审查统一质量门**（review run/baseline：Git 变更 + B 规则 + 历史基线 + 豁免 + 平台适配 + 供应链 + JaCoCo 变更覆盖率），与前端 Skills 包协作。

## 测试 Skills 集合（v0.11.0）

`@agile-team/wl-skills-test`：17 个 MCP 工具 + 12 个 AI Skill + 25 条审计规则（T1-T25）+ 6 个自动修复（F1-F6）+ 3 个执行器（API/Playwright/JMeter），覆盖测试方案→用例→自动化脚本→执行→质量评估→上线判定全链路；v0.9 起 run-api 升级为 **DAG 编排 + 四层断言 + 负例 + 契约漂移检测**深度接口测试，v0.10 新增选择器适配层、沙箱模拟跑、工位模板、字典同步与 gate 聚合质量门，v0.11 落地 **test-reports 统一报告体系**（自动发现 + history.jsonl 历史趋势 + webhook 推送）与字段级细粒度用例生成。**五包中唯一具备实际执行能力的包**。

```bash
npx @agile-team/wl-skills-test        # 安装
npx @agile-team/wl-skills-test audit  # 审计测试代码
npx @agile-team/wl-skills-test run-api --contract ./wl-contract.json  # 执行API测试
```

### 五包能力矩阵

| 能力维度 | design | kit | ui | bd | **test** |
|---------|:------:|:---:|:--:|:--:|:--------:|
| 版本 | v0.11.1 | v2.20.1 | v1.12.0 | v0.24.0 | **v0.11.0** |
| MCP 工具 | 0 | 29 | 13 | 17 | **17** |
| 审计规则 | — | K1-K19 | R001-R043 | B1-B31 | **T1-T25** |
| 自动修复 | — | F1-F6 | 12 条 | B3/B5 | **F1-F6** |
| 执行能力 | ❌ | ❌ | ❌ | ❌ | **✅ API+PW+JMeter** |
| 质量门 | — | validate | check | J1-J8 | **DI 4 指标** |

---

## 快速开始

**环境要求**：Node.js ≥ 20，pnpm ≥ 10（文档站构建）；PC/移动端模板开发需 Node 22+/pnpm 11.8+

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

提交规范遵循 [Conventional Commits](https://www.conventionalcommits.org/)，详见 [贡献指南](/frontend/quick-start/contributing)。

---

## 团队

金恒科技 AGILE TEAM — 前端、后端、业务、产品、测试全角色协作团队，持续推进 AI 驱动的研发工程化实践。

---

<div align="center">

Copyright © 2026 金恒科技 AGILE TEAM · All Rights Reserved

*持续进化中 · 欢迎共建*

</div>
