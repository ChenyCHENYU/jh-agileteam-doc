# @agile-team/wl-skills-design — 产品设计 AI 技能包

> 版本：v0.2.1 · 7 条设计规范 + 5 个 AI Skill + 9 个 Copilot Prompt，支持 10 种 AI 编辑器

---

## 这是什么？

一套面向**产品设计阶段**的 AI 技能包 — 覆盖从业务流程图、需求说明书到数据库设计、接口设计、集成评审的完整链路。

与 `wl-skills-kit`（前端代码生成）和 `wl-skills-ui`（UI 风格对齐）形成三包协作：

```
wl-skills-design（需求设计）→ wl-skills-kit（代码生成）→ wl-skills-ui（视觉一致性）
```

---

## 快速开始

```bash
# 安装到设计项目
npx @agile-team/wl-skills-design

# 更新到最新版本
npx @agile-team/wl-skills-design update

# 预览安装内容
npx @agile-team/wl-skills-design --dry-run
```

安装完成后，直接在 AI 对话中描述设计需求即可触发对应 Skill。

---

## 技能覆盖

| 设计域 | 技能 | 状态 |
|-------|------|------|
| 系统需求设计 | draw.io 业务流程图 | ✅ 已发布 |
| 系统需求设计 | 需求设计说明书（IPO / 流程说明 / 功能设计） | ✅ 已发布 |
| 系统需求设计 | 原型设计 | 🔲 v2.0 规划 |
| 数据设计 | 数据库设计（ER / 数据字典 / DDL） | ✅ 已发布 |
| 接口设计 | 接口设计（RESTful / OpenAPI / 集成报文） | ✅ 已发布 |
| 跨域评审 | 设计集成评审（评分 / 追溯矩阵 / 跨文档一致性） | ✅ 已发布 |
| 代码设计 | 业务逻辑代码结构 | 🔲 v3.0 规划 |

---

## 设计全链路工作流

每个环节：**生成 → 验证 → 自动修复**，全链路闭环。

### 1. 流程图

```bash
# AI 对话触发
"帮我画一个废钢采购流程图，涉及采购部、质检部、仓储部"
```

- 输出 draw.io 格式泳道流程图
- 自动对照 20 项规范验证并修复

### 2. 需求设计说明书

```bash
"帮我编写订单管理模块的需求设计说明书 IPO 表"
```

- 生成 IPO 表 / 流程说明 / 活动说明 / 报表设计
- 验证字段完整性、编码格式、流程与 IPO 一致性

### 3. 数据库设计

```bash
"帮我设计订单模块的数据库表结构和数据字典"
```

- 从 spec IPO 表推导 ER 图 / 数据字典（10 列）/ DDL
- 执行 30 项验证，强制注入 7 个系统字段、索引、命名前缀

### 4. 接口设计

```bash
"帮我设计订单创建接口（RESTful）"
```

- 从 spec 功能编码推导接口清单 / RESTful 定义
- 执行 35 项验证（统一响应包装、安全、幂等、spec/DB 字段联动）

### 5. 集成评审

```bash
"对订单模块三份设计文档做一次整体评审，给我出评分报告"
```

- 自动采集 spec / DB / IF 三份 validate 结论
- D4 跨文档三角联动 18 项检查
- 输出综合评分报告：仪表盘 + P0 阻断清单 + 追溯矩阵

---

## 规范体系（7 条）

| 编号 | 规范 | 状态 | 验证项数 |
|------|------|------|---------|
| 01 | draw.io 泳道流程图规范 | ✅ | 20 项 |
| 02 | 原型规范 | 🔲 | — |
| 03 | 数据库设计规范 | ✅ | 30 项 |
| 04 | 接口设计规范 | ✅ | 35 项 |
| 05 | 代码设计规范 | 🔲 | — |
| 06 | 需求设计说明书规范 | ✅ | — |
| 07 | 设计集成评审规范 | ✅ | 18 项（D4 联动） |

---

## VS Code Copilot Prompts（9 个）

| Prompt | 用途 |
|--------|------|
| `/create-flowchart` | 创建业务流程图 |
| `/validate-flowchart` | 验证流程图规范合规 |
| `/create-spec-section` | 创建需求说明书章节 |
| `/validate-spec-section` | 验证说明书完整性 |
| `/create-db-design` | 创建数据库设计 |
| `/validate-db-design` | 验证数据库设计 |
| `/create-if-design` | 创建接口设计 |
| `/validate-if-design` | 验证接口设计 |
| `/design-review` | 集成评审出报告 |

---

## 安装后的项目结构

```
你的设计项目/
├── .github/
│   ├── copilot-instructions.md       AI 主入口
│   ├── standards/                    7 条设计规范
│   ├── skills/
│   │   ├── _registry.md              触发词路由表
│   │   ├── requirements/flowchart/   流程图 Skill
│   │   ├── requirements/spec/        需求说明书 Skill
│   │   ├── data/database/            数据库设计 Skill
│   │   ├── api/restful/              接口设计 Skill
│   │   └── cross/design-review/      集成评审 Skill
│   ├── prompts/                      9 个 Copilot Prompt
│   └── guides/                       使用指南
├── CLAUDE.md / AGENTS.md             Claude / Agents 规则
├── .cursorrules / .windsurfrules     Cursor / Windsurf 规则
└── .kiro / .trae / .qoder            Kiro / Trae / Qoder 规则
```

---

## 多编辑器支持（10 种）

| 编辑器 | 配置文件 |
|--------|---------|
| GitHub Copilot | `.github/copilot-instructions.md` |
| Claude Code | `CLAUDE.md` |
| Cursor | `.cursorrules` + `.cursor/rules/conventions.mdc` |
| Windsurf | `.windsurfrules` |
| Cline | `.clinerules` |
| Kiro | `.kiro/steering/conventions.md` |
| Trae | `.trae/rules/conventions.md` |
| Generic Agents | `AGENTS.md` |
| Qoder | `.qoder/rules/conventions.md` |

---

## 三包协作关系

| 包 | 职责 | 面向角色 |
|---|---|---|
| `wl-skills-design` | 需求设计（流程图/说明书/数据库/接口/评审） | 产品经理、架构师、设计师 |
| `wl-skills-kit` | 前端代码生成（页面/规范/菜单/字典/权限） | 前端开发 |
| `wl-skills-ui` | UI 风格对齐（设计令牌/化妆层/Runtime） | 前端开发 |

三包独立安装、契约对齐，共同消费同一份设计产出物。
