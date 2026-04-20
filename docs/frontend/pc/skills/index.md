# 前端 Skills 概述

前端 Skills 基于 `@agile-team/wl-skills-kit` — 一条命令，将 AI 编码指令、组件文档、通用组件、领域样例导入到 Vue 3 前端项目，让 AI（Copilot / Cursor / Windsurf 等）**直接理解项目规范和组件体系**，从 Axure 原型 / 详细设计文档 → 生成可运行的完整页面代码。

## 快速开始

```bash
# 在项目根目录执行（无需安装，直接运行）
npx @agile-team/wl-skills-kit

# 预览将写入哪些文件（不实际写入）
npx @agile-team/wl-skills-kit --dry-run

# 增量更新（仅覆盖有变化的文件）
npx @agile-team/wl-skills-kit@latest update

# 构建前清理 AI 开发辅助文件（保留组件代码）
npx @agile-team/wl-skills-kit clean
```

执行后自动写入 **117 个文件**，无其他副作用。

## 包含什么

| 类别              | 数量  | 说明                                                              |
| ----------------- | ----- | ----------------------------------------------------------------- |
| **AI Skills**     | 5 个  | 原型扫描 → 接口约定 → 页面生成 → 菜单同步 → 规范审计              |
| **页面模板**      | 9 种  | LIST / FORM_ROUTE / MASTER_DETAIL / TREE_LIST 等                  |
| **组件 API 文档** | 12 个 | jh-select / jh-date / jh-drag-row / jh-pagination 等              |
| **通用组件**      | 15 个 | 全局 6 + 按需 4 + 远程 5                                          |
| **领域样例**      | 13 个 | 生产域 8 页 + 销售域 5 页                                         |
| **编辑器配置**    | 8 个  | Copilot / Cursor / Windsurf / Kiro / Trae / Claude / Roo / AGENTS |

## 导入后的项目结构

```
你的项目/
├── .github/
│   ├── copilot-instructions.md       ← AI 自动加载的编码规范（项目总纲）
│   ├── skills/                       ← 5 个 AI Skill
│   │   ├── prototype-scan/SKILL.md   ←   ① 原型扫描
│   │   ├── api-contract/SKILL.md     ←   ② 接口约定
│   │   ├── page-codegen/             ←   ③ 页面代码生成（含 9 个 TPL-*.md 模板）
│   │   ├── menu-sync/SKILL.md        ←   ④ 菜单同步
│   │   └── convention-extract/SKILL.md ← ⑤ 规范审计
│   └── docs/                         ← 设计文档
│
├── docs/                             ← 12 个平台组件 API 文档
├── src/components/                   ← 全局 + 按需 + 远程组件
└── demo/                             ← 13 个领域样例页面
```

## 技术栈

| 层面     | 技术                                           |
| -------- | ---------------------------------------------- |
| 框架     | Vue 3.2 + Vite + TypeScript                    |
| UI       | Element Plus + @jhlc/jh-ui + @jhlc/common-core |
| 状态     | Pinia                                          |
| 样式     | Windi CSS + SCSS                               |
| 架构     | Module Federation 子应用                       |
| 页面模式 | AbstractPageQueryHook 配置化驱动               |

## 多编辑器支持

安装后自动生成 8 个编辑器配置文件，内容统一来自 `copilot-instructions.md`（单一源头）：

| AI 工具                      | 规范加载 | Skill 自动调度        |
| ---------------------------- | -------- | --------------------- |
| **GitHub Copilot** (VS Code) | ✅ 自动  | ✅ 原生 Skill 识别    |
| **Cursor**                   | ✅ 自动  | ✅ 注册表 `read_file` |
| **Windsurf (Cascade)**       | ✅ 自动  | ✅ 注册表 `read_file` |
| **Kiro**                     | ✅ 自动  | ✅ 注册表 `read_file` |
| **Trae**                     | ✅ 自动  | ✅ 注册表 `read_file` |
| **Claude Code / CLI**        | ✅ 自动  | ✅ 注册表 `read_file` |
| **Roo Code / Cline**         | ✅ 自动  | ✅ 注册表 `read_file` |

> v1.1.2 起，**编码规范 + Skill 调度**均为全编辑器自动加载（零配置）。
