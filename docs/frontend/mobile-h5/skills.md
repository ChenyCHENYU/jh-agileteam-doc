# 移动端 H5 — Skills 集合

## 概述

移动端 H5 项目内置 **7 个 AI Skill**，覆盖从原型分析到代码生成的完整研发链路。所有 Skill 均已注册到 AI 编辑器（Copilot / Cursor / Windsurf / Claude Code），支持通过**触发词自动调度**。

::: tip AI 规则文件同源
`.github/copilot-instructions.md`、`.cursorrules`、`.windsurfrules`、`CLAUDE.md`、`AGENTS.md` 五个文件内容同源，确保所有 AI 编辑器遵循统一规范。
:::

---

## Skill 自动调度表

| 序号 | Skill | 触发词 | 规则文件 |
|---|---|---|---|
| ① | 原型扫描 | 扫描原型 / 分析原型 | `.github/skills/prototype-scan/skills.md` |
| ② | 接口规格 | 生成接口规格 / 接口字段说明 | `.github/skills/api-spec/skills.md` |
| ③ | 接口约定 | 生成接口 / 接口约定 | `.github/skills/api-contract/skills.md` |
| ④ | 页面代码生成 | 生成页面 / 生成代码 | `.github/skills/page-codegen/skills.md` |
| ⑤ | 路由注册 | 注册路由 / 添加菜单 | `.github/skills/route-register/skills.md` |
| ⑥ | Mock 生成 | 生成 Mock / 补充模拟数据 | `.github/skills/mock-gen/skills.md` |
| ⑦ | 规范审计 | 审计规范 / 代码检查 | `.github/skills/convention-audit/skills.md` |

---

## Skill 详解

### ① 原型扫描 — prototype-scan

**触发词**：`扫描原型`、`分析原型`

**功能**：解析 Axure / Figma 等原型文件，提取页面结构、字段列表、交互逻辑、状态流转等关键信息，输出结构化原型分析文档。

**输出**：
- 页面字段清单（字段名、类型、必填、校验规则）
- 交互行为描述（按钮事件、弹窗触发、跳转逻辑）
- 状态流转图

---

### ② 接口规格 — api-spec

**触发词**：`生成接口规格`、`接口字段说明`

**功能**：根据原型分析结果，生成前后端对齐的接口字段规格文档，包含请求参数、响应结构、字段类型与校验规则。

---

### ③ 接口约定 — api-contract

**触发词**：`生成接口`、`接口约定`

**功能**：基于接口规格，生成 TypeScript 接口定义文件（`api/*.ts`），遵循项目命名约定：

```ts
get{Module}List()      // 列表查询
get{Module}Detail()    // 详情查询
add{Module}()          // 新增
update{Module}()       // 修改
delete{Module}()       // 删除
```

---

### ④ 页面代码生成 — page-codegen

**触发词**：`生成页面`、`生成代码`

**功能**：根据原型分析 + 接口约定，一键生成完整的页面代码，遵循**三文件分离原则**：

```
views/{module}/
  index.vue       ← 模板 + 逻辑
  index.scss      ← 样式
  data.ts         ← 静态配置
```

**生成规范**：
- 使用全局组件 `C_Form` / `C_Table` / `C_PullRefreshList` 等
- 样式使用设计令牌，禁止硬编码
- BEM 命名：`.{page-name}__{element}--{modifier}`
- `defineOptions({ name })` 与路由 name 一致

---

### ⑤ 路由注册 — route-register

**触发词**：`注册路由`、`添加菜单`

**功能**：自动将新页面注册到路由系统：

- TabBar 页面 → 写入 `router/menu.ts`
- 子页面 → 写入 `router/modules.ts`
- 确保路由 `name` 与组件 `defineOptions({ name })` 一致

---

### ⑥ Mock 生成 — mock-gen

**触发词**：`生成 Mock`、`补充模拟数据`

**功能**：为接口约定文件自动生成配套的 Mock 数据，位于 `mock/` 目录，支持：

- 列表分页
- 详情查询
- 增删改操作
- 状态变更

---

### ⑦ 规范审计 — convention-audit

**触发词**：`审计规范`、`代码检查`

**功能**：对生成或手写的代码进行全面规范审计：

| 审计项 | 检查内容 |
|---|---|
| 文件结构 | 三文件分离（.vue 无 style 块） |
| 命名规范 | BEM / 路由 name / API 命名 |
| 样式令牌 | 禁止硬编码颜色/圆角/阴影 |
| 类型安全 | `pnpm type-check` 零错误 |
| 组件使用 | 全局组件正确引用 |
| Mock 配套 | 每个 API 有对应 Mock |

**审计流程**：
```
P0 静默修复 → P1 修复 + 报告 → type-check 零错误 → 交付
```

---

## 工作流串联

完整的 AI 辅助研发流程：

```
① 原型扫描 → 结构化原型分析
    ↓
② 接口规格 → 字段规格文档
    ↓
③ 接口约定 → TypeScript API 定义
    ↓
④ 页面代码生成 → 三文件分离的完整页面
    ↓
⑤ 路由注册 → 自动注册路由
    ↓
⑥ Mock 生成 → 配套 Mock 数据
    ↓
⑦ 规范审计 → 最终质量检查
```
