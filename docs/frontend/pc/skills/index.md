# 前端 Skills 概述

前端 Skills 基于 `@agile-team/wl-skills-kit` v2.10.0 — 一条命令，将 **14 条编码规范、11 个 AI Skill、17 个 MCP Tool**、编辑器配置、组件文档、通用组件、领域样例导入到 Vue 3 前端项目，让 AI（Copilot / Cursor / Windsurf / Claude Code / Kiro / Trae / Qoder / 通用 Agents）**真正理解项目规范**，从 Axure 原型 / 详细设计文档 / 口述需求 → 全流程自动化生成可运行的完整页面代码。

## 快速开始

```bash
# 工程化前置（强制）
npx @robot-admin/git-standards init

# 安装 AI Skill 体系（在项目根目录执行）
npx @agile-team/wl-skills-kit

# 预览将写入哪些文件（不实际写入）
npx @agile-team/wl-skills-kit --dry-run

# 增量更新（仅覆盖有变化的文件）
npx @agile-team/wl-skills-kit@latest update

# 构建前清理 AI 开发辅助文件（保留组件代码）
npx @agile-team/wl-skills-kit clean

# Mock 清理（按域或全量）
npx @agile-team/wl-skills-kit mock-clean --domain <name>
npx @agile-team/wl-skills-kit mock-clean --all
```

## 包含什么

| 类别              | 数量  | 说明                                                                         |
| ----------------- | ----- | ---------------------------------------------------------------------------- |
| **AI Skills**     | 11 个 | prototype-scan / spec-doc-parse / api-contract / page-codegen / business-doc-extract / menu-sync / dict-sync / permission-sync / convention-audit / template-extract / code-fix |
| **MCP Tools**     | 17 个 | 菜单/字典/权限/代码扫描/路由检查/页面校验/UI诊断/Git日志/审计报告推送等      |
| **编码规范**      | 14 条 | 模块化规范（01-工具链 ~ 14-布局容器），AI 自动门控加载                       |
| **页面模板**      | 9 种  | LIST / FORM_ROUTE / MASTER_DETAIL / TREE_LIST / DETAIL_TABS 等               |
| **组件 API 文档** | 12 个 | jh-select / jh-date / jh-drag-row / jh-pagination 等                         |
| **通用组件**      | 15 个 | 全局 6 + 按需 4 + 远程 5                                                     |
| **领域样例**      | 13 个 | 生产域 8 页 + 销售域 5 页                                                    |
| **编辑器配置**    | 10 个 | Copilot / Cursor / Windsurf / Kiro / Trae / Claude / Roo / Cline / AGENTS / Qoder  |

## 导入后的项目结构

```
你的项目/
├── .github/
│   ├── copilot-instructions.md       ← AI 主入口（精简 ~320 行）
│   ├── standards/                    ← 14 条模块化规范
│   │   ├── index.md                  ←   规范门控（任务类型 → 加载哪几条）
│   │   ├── 01-toolchain.md
│   │   ├── 02-code-structure.md
│   │   └── ... (共 14 条，含 14-layout-containers)
│   ├── skills/                       ← 11 个 AI Skill
│   │   ├── _registry.md              ←   触发词路由表（单一数据源）
│   │   ├── _best-practices.md        ←   场景索引（AI 每轮默认加载）
│   │   ├── _pipeline.md              ←   流水线编排
│   │   ├── core/
│   │   │   ├── prototype-scan/       ←   ① 原型扫描
│   │   │   ├── spec-doc-parse/       ←   ② 说明书解析（规范线入口）
│   │   │   ├── api-contract/         ←   ③ 接口约定
│   │   │   ├── page-codegen/         ←   ④ 页面代码生成（含 9 个 TPL-*.md 模板）
│   │   │   ├── convention-audit/     ←   ⑤ 规范审计
│   │   │   ├── business-doc-extract/ ←   ⑥ 业务文档提取（语义级触发）
│   │   │   └── template-extract/     ←   ⑦ 模板提取
│   │   ├── sync/
│   │   │   ├── menu-sync/            ←   ⑧ 菜单同步
│   │   │   ├── dict-sync/            ←   ⑨ 字典同步
│   │   │   ├── permission-sync/      ←   ⑩ 权限同步（角色+授权+动作）
│   │   │   ├── _mcp-guardrail.md     ←   MCP 公共护栏（L0~L4 自愈剧本）
│   │   │   └── env.local.json        ←   统一环境配置（gitignore）
│   │   └── ops/
│   │       └── code-fix/             ←   ⑪ 受控自动修复
│   ├── guides/                       ← 人读指南
│   └── reports/                      ← AI 生成报告目录
│
├── docs/                             ← 12 个平台组件 API 文档
├── mock/
│   └── _utils.ts                     ← Mock 共享工具（pageResult/ok/paginate）
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

## 多编辑器支持（10 种）

安装后自动生成 10 个编辑器配置文件，内容统一来自 `copilot-instructions.md`（单一源头）：

| AI 工具                      | 规范加载 | Skill 自动调度        |
| ---------------------------- | -------- | --------------------- |
| **GitHub Copilot** (VS Code) | ✅ 自动  | ✅ 原生 Skill 识别    |
| **Cursor**                   | ✅ 自动  | ✅ 注册表 `read_file` |
| **Windsurf (Cascade)**       | ✅ 自动  | ✅ 注册表 `read_file` |
| **Kiro**                     | ✅ 自动  | ✅ 注册表 `read_file` |
| **Trae**                     | ✅ 自动  | ✅ 注册表 `read_file` |
| **Claude Code / CLI**        | ✅ 自动  | ✅ 注册表 `read_file` |
| **Roo Code / Cline**         | ✅ 自动  | ✅ 注册表 `read_file` |
| **Qoder**                    | ✅ 自动  | ✅ 注册表 `read_file` |
| **通用 Agents**              | ✅ 自动  | ✅ AGENTS.md 加载     |

> v2.0 起，所有编辑器的编码规范 + Skill 调度均为**自动加载（零配置）**；`env.local.json` 填写一次，`menu-sync` / `dict-sync` 自动共用同一配置。

## 11 个 Skill 速览

| #  | Skill              | 触发关键词                           | 用途                                   |
| -- | ------------------ | ------------------------------------ | -------------------------------------- |
| ①  | prototype-scan     | 扫描原型 / 口述需求 / 页面清单       | 原型 / 截图 / 口述 → page-spec JSON（原型线） |
| ②  | spec-doc-parse     | 解析说明书 / 规范文档转页面 / IPO    | 标准说明书 → page-spec JSON（规范线）  |
| ③  | api-contract       | 接口约定 / api.md / 字段定义         | 生成接口约定文档（前后端零成本对齐）   |
| ④  | page-codegen       | 生成页面 / 帮我生成 / 代码生成       | 生成 4 文件 + Mock + 菜单注册          |
| ⑤  | business-doc-extract | 语义级触发（不依赖固定关键词）       | 原型/详设/字段资料 → 结构化业务文档    |
| ⑥  | template-extract   | 提取模板 / 沉淀模板 / 模板贡献       | 从标杆页面提取领域专属模板             |
| ⑦  | convention-audit   | 规范审计 / 代码审计 / 项目体检       | 14 条规范扫描 + 偏差报告               |
| ⑧  | menu-sync          | 创建菜单 / 同步菜单 / 补菜单         | 菜单数据同步到后端（MCP 驱动）         |
| ⑨  | dict-sync          | 同步字典 / 创建字典 / 刷新字典基线   | 字典基线同步（pull / push / audit）    |
| ⑩  | permission-sync    | 权限同步 / 角色授权 / 挂动作         | 角色管理 + 菜单授权 + 动作挂载（MCP 驱动） |
| ⑪  | code-fix           | 自动修复 / 整改偏差 / 规范整改       | 受控自动修复 🟡/🟢 等级偏差           |

### 双线路由机制（v2.0+）

```
原型线：Axure / 截图 / 口述 → prototype-scan → page-spec JSON
规范线：标准说明书 / IPO 表  → spec-doc-parse → page-spec JSON
                                                    ↓
                                    两线汇聚到同一份 page-spec
                                                    ↓
                              api-contract → page-codegen → convention-audit → sync/ops
```

> AI 根据输入自动判断走哪条线：路径含 `docs/spec/` 或文档含功能编码/IPO 表走规范线，其余走原型线。
