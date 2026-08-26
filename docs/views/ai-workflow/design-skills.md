# @agile-team/wl-skills-design — 产品设计 AI 技能包

> 版本：v0.11.1 · 9 条设计规范 + 10 个 AI Skill + 16 个 Copilot Prompt，支持 10 种 AI 编辑器，机器语义双轨验证（[M]/[J]）+ verify CLI 四域机械校验（spec / flowchart / db / api）

---

## 这是什么？

一套面向**产品设计阶段**的 AI 技能包 — 覆盖从业务流程图、需求说明书、原型标注、半成品文档接入到数据库设计、接口设计、术语词典、变更影响分析、代码结构设计、集成评审的完整链路。让 AI **按团队规范做设计，且生成即合规、自检、可追溯**（`[M]` 机械 / `[J]` 语义双轨验证，`verify` CLI 四域机械校验）。

作为五包生态的设计起点，与下游各包契约对齐：

```
wl-skills-design（需求设计）→ wl-skills-kit（前端代码）→ wl-skills-ui（视觉一致性）
                            → wl-skills-bd（后端代码） → wl-skills-test（测试验证）
```

---

## 快速开始

```bash
# 安装到设计项目
npx @agile-team/wl-skills-design

# 更新到最新版本（本地改动自动备份为 .bak）
npx @agile-team/wl-skills-design update

# 预览安装内容
npx @agile-team/wl-skills-design --dry-run

# 四域机械验证（v0.10.0+：spec / flowchart / db / api 的 [M] 项由 CLI 直接执行）
npx @agile-team/wl-skills-design verify spec
npx @agile-team/wl-skills-design verify db
npx @agile-team/wl-skills-design verify api
```

安装完成后，直接在 AI 对话中描述设计需求即可触发对应 Skill。

---

## 核心架构：双层资料（模板 + 样例）

每个 Skill 目录下并排放两层资料，**职责严格分离，两层都随包发布**：

| | `templates/` 默认模板 | `examples/` 真实样例 |
|---|---|---|
| **角色** | 空白起点（脚手架） | 质量标杆（参照系） |
| **内容** | 纯结构 + `{占位符}`，零业务数据 | 真实场景填好的内容 |
| **AI 怎么用** | 复制后替换占位符开始写 | 生成后对照自检，且**必须做得不低于它** |

> 模板告诉 AI「该有哪些结构」，样例告诉 AI「好到什么程度才算达标」。样例源自真实项目（如烟台华新数智化改造），规范升级时同步抬高。

---

## 技能覆盖

| 设计域 | 技能 | 关联规范 | 验证项 | 状态 |
|-------|------|---------|-------|------|
| 系统需求 | draw.io 业务流程图（泳道图）| `01-flowchart.md` | 20 项 | ✅ v1.0 |
| 系统需求 | 需求设计说明书（IPO / 流程说明 / 活动说明 / 报表，GB1–GB8 按钮级颗粒度基线）| `06-spec-doc.md` | 43 项 | ✅ v1.0 |
| 系统需求 | 原型标注（交互模式 / 字段 / 组件 / D1–D3 深度）| `02-prototype.md` | 23 项 | ✅ v1.0 |
| 数据设计 | 数据库设计（ER / DB 清单 / 数据字典 / DDL）| `03-database.md` | 34 项 | ✅ v1.0 |
| 接口设计 | 接口设计（系统集成报文 / RESTful / OpenAPI）| `04-api-design.md` | 38 项 | ✅ v1.0 |
| 跨域评审 | 设计集成评审（评分 / 追溯矩阵 / 跨文档一致性）| `07-design-review.md` | D4 18 项 | ✅ v1.0 |
| 跨域词典 | 术语字段词典（中英文名 / 枚举 / 编码统一锚点）| `08-glossary.md` | 18 项 | ✅ v1.0 |
| 跨域协同 | 变更影响分析（影响矩阵 / 补丁计划 / 复验顺序）| `09-change-impact.md` | 20 项 | ✅ v1.0 |
| 代码设计 | 业务逻辑代码结构（AC01–AC20：模块边界 / 分层 / 契约 / 依赖方向 / 测试与发布质量门）| `05-code-design.md` | AC01-AC20 | ✅ v0.8.0 |
| 文档接入 | 半成品文档接入 doc-intake（采集归位 / 机械+语义差距分析 / 补全计划）| — | 四域 | ✅ v0.10.0 |

---

## 设计全链路工作流

每个环节：**生成 → 验证 → 自动修复**，全链路闭环。VS Code Copilot 中按 `/` 调用对应 prompt。

**推荐顺序**：先建词典骨架 → 再做 spec / 原型 → 推导数据库 / 接口（边做边登记词典）→ 变更时先跑影响分析 → 最后集成评审出评分。词典先行能让「字段对不齐」从「评审时发现」提前到「设计时杜绝」。

### 1. 流程图

```bash
"帮我画一个废钢采购流程图，涉及采购部、质检部、仓储部"
```

- 输出 draw.io 格式泳道流程图
- 自动对照 20 项规范验证并修复

### 2. 需求设计说明书

```bash
"帮我编写订单管理模块的需求设计说明书 IPO 表"
```

- 生成 IPO 表 / 流程说明 / 活动说明 / 报表设计（5 文件拆分）
- 验证字段完整性、编码格式、流程与 IPO 一致性（43 项）

### 3. 原型标注

```bash
"帮我标注订单列表页的原型，达到开发就绪（D3）"
```

- 输出 D3 开发就绪页面标注（7 区块）
- 执行 23 项验证

### 4. 数据库设计

```bash
"帮我设计订单模块的数据库表结构和数据字典"
```

- 从 spec IPO 表推导 ER 图 / 数据字典 / DDL
- 执行 34 项验证，自动注入 7 个系统字段、索引、命名前缀

### 5. 接口设计

```bash
"帮我设计订单状态变更接口（RESTful）"
```

- 从 spec 功能编码推导接口清单 / RESTful 定义
- 执行 38 项验证（统一响应包装、安全、幂等、spec/DB 字段联动）

### 6. 术语词典

```bash
"帮我建订单模块的术语字段词典，统一 spec/数据库/接口的字段命名"
```

- 统一中英文名 / 枚举 / 编码，作为字段对齐中央锚点
- 执行 18 项验证

### 7. 变更影响分析

```bash
"订单状态新增退回，帮我分析会影响哪些设计文档并出补丁计划"
```

- 逐域判断 spec / glossary / DB / API / prototype / review
- 输出 P0/P1/P2 补丁任务 + 推荐复验顺序（20 项）

### 8. 集成评审

```bash
"对订单模块三份设计文档做一次整体评审，给我出评分报告"
```

- 自动采集 spec / DB / IF 三份 validate 结论
- D4 跨文档三角联动 18 项检查
- 输出综合评分报告：仪表盘 + P0 阻断清单 + 追溯矩阵

### 9. 代码结构设计（v0.8.0）

```bash
"为订单模块设计业务逻辑代码结构（模块边界 / 分层 / 依赖方向 / 质量门）"
```

- 按 AC01–AC20 输出设计开发就绪的模块、分层、依赖与质量门约定
- 不生成具体业务代码，只固化结构契约；`validate-model` 可机械校验 design-model 的稳定 ID 与引用完整性

### 10. 半成品文档接入 doc-intake（v0.10.0）

```bash
"评估 docs/legacy 下这批设计文档，输出差距报告和补全任务清单"
```

- 采集归位（未归类区）→ 机械 + 语义差距分析（含字典值漂移、名称近似漂移检测）
- 输出 P0/P1/P2 补全任务清单；授权后补齐结构缺口，可 draft design-model 铸造

---

## 规范体系（9 条）

| 编号 | 规范 | 状态 | 验证项数 |
|------|------|------|---------|
| 01 | draw.io 泳道流程图规范 | ✅ | 20 项 |
| 02 | 原型标注规范 | ✅ | 23 项 |
| 03 | 数据库设计规范 | ✅ | 34 项 |
| 04 | 接口设计规范 | ✅ | 38 项 |
| 05 | 代码设计规范 | ✅ v1.0 | AC01–AC20（模块边界/分层/契约/依赖方向/测试与发布质量门） |
| 06 | 需求设计说明书规范 | ✅ | 43 项 |
| 07 | 设计集成评审规范 | ✅ | 18 项（D4 联动） |
| 08 | 术语字段词典规范 | ✅ | 18 项 |
| 09 | 变更影响分析规范 | ✅ | 20 项 |

---

## VS Code Copilot Prompts（16 个）

| Prompt | 用途 |
|--------|------|
| `/create-flowchart` | 创建业务流程图 |
| `/validate-flowchart` | 验证流程图规范合规 |
| `/create-spec-section` | 创建需求说明书章节 |
| `/validate-spec-section` | 验证说明书完整性 |
| `/create-prototype` | 创建原型标注 |
| `/validate-prototype` | 验证原型规范 |
| `/create-db-design` | 创建数据库设计 |
| `/validate-db-design` | 验证数据库设计 |
| `/create-if-design` | 创建接口设计 |
| `/validate-if-design` | 验证接口设计 |
| `/create-glossary` | 创建术语词典 |
| `/validate-glossary` | 验证术语词典 |
| `/analyze-change-impact` | 分析变更影响 |
| `/validate-change-impact` | 验证变更影响 |
| `/design-review` | 集成评审出报告 |
| `/intake-docs`（v0.10.0） | 半成品文档接入：采集归位 → 机械+语义差距分析 → 补全任务清单 |

---

## 安装后的项目结构

```
你的设计项目/
├── .github/
│   ├── copilot-instructions.md       AI 主入口
│   ├── standards/                    9 条设计规范 + index.md 门控
│   ├── skills/                       10 个 Skill（扁平目录）
│   │   ├── _manifest.json            机器可读执行路由（触发词/状态/上下文/输出/闭环）
│   │   ├── _registry.md              触发词路由表（人读索引）
│   │   ├── _compat/                  多编辑器适配源
│   │   ├── requirements-flowchart/   流程图（SKILL + USAGE + templates + examples）
│   │   ├── requirements-spec-doc/    需求说明书
│   │   ├── requirements-prototype/   原型标注
│   │   ├── data-database-design/     数据库设计
│   │   ├── api-interface-design/     接口设计
│   │   ├── cross-design-review/      集成评审
│   │   ├── cross-glossary/           术语词典
│   │   ├── cross-change-impact/      变更影响分析
│   │   ├── code-architecture/        代码结构设计（AC01–AC20）
│   │   └── doc-intake/               半成品文档接入
│   ├── prompts/                      16 个 Copilot Prompt
│   └── guides/                       使用指南
├── CLAUDE.md / AGENTS.md             Claude / Agents 规则
├── .cursorrules / .windsurfrules     Cursor / Windsurf 规则
└── .kiro / .trae / .qoder            Kiro / Trae / Qoder 规则
```

> 每个 Skill 目录的标准形态：`SKILL.md`（AI 触发层）+ `USAGE.md`（人读说明）+ `sub/`（Sub-Skill）+ `templates/`（空白模板）+ `examples/`（真实样例）。

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

## 五包协作关系

| 包 | 职责 | 面向角色 |
|---|---|---|
| `wl-skills-design` | 需求设计（流程图/说明书/原型/数据库/接口/术语词典/变更/评审/代码结构/文档接入） | 产品经理、架构师、设计师 |
| `wl-skills-kit` | 前端代码生成（页面/规范/菜单/字典/权限） | 前端开发 |
| `wl-skills-ui` | UI 风格对齐（设计令牌/化妆层/Runtime） | 前端开发 |
| `wl-skills-bd` | 后端代码生成（契约/实体/服务/Mapper/DDL/质量门） | 后端开发 |
| `wl-skills-test` | 测试验证（用例/自动化/执行/质量门/报告体系） | 测试工程师 |

五包独立安装、契约对齐（统一 delivery profile `jh4j3-openapi3@1.0`），共同消费同一份设计产出物。
