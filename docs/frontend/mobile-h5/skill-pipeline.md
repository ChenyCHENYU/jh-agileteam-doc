# AI Skill 流水线（移动端 H5）

> 移动端 AI Skill 流水线以 **Robot_H5** 项目（Vant 4 + Vue 3.5 + Vite 7）为参考实现，
> 同时适配 **wl-mbase**（Uniapp 跨端）项目。
> 本页对照 Robot_H5 `.github/skills/` 实际目录维护。

---

## 双端项目架构对比

| 对比项 | Robot_H5 | wl-mbase |
|--------|----------|----------|
| 框架 | Vue 3.5 + Vite 7 | Vue 3.5 + Vite 5（**Uniapp** 跨端） |
| UI 库 | Vant 4（自动引入） | Uniapp 内置 + uv-ui |
| 样式 | 原生 CSS + UnoCSS | SCSS + 设计令牌 |
| 路由 | vue-router（Hash/History） | pages.json（Uniapp 配置式） |
| 文件规范 | 三文件分离（.vue 禁止 `<style>` 块） | 三文件分离 |
| 组件命名 | `C_` 前缀全局注册 | `C_` 前缀 |
| 设计语言 | Apple HIG Liquid Glass | 跟随平台 |
| 状态管理 | Pinia | Pinia |
| 配置入口 | `manifest.json` + `copilot-instructions.md` | `src/manifest.json` + `src/pages.json` |

---

## 流水线全景（7 个 Skill）

```text
原型 / 设计稿 / 截图 / 口述
       │
       ↓
① prototype-scan ──── 扫描 → page-spec.json（结构化页面骨架）
       │
       ↓
② api-spec ────────── 生成 docs/api-spec/{module}.md（完整接口规格文档）
       │
       ├──────────────────────────────────────────┐
       ↓                                          ↓
③ api-contract ── 生成 src/api/{module}.ts   ⑥ mock-gen ── 生成 mock/{module}.ts
       │                                      + data.ts 常量
       ↓                                          │
④ page-codegen ─── 生成 src/views/{domain}/{module}/  ◄──┘
       │              （index.vue + index.scss + data.ts 三文件分离）
       ↓
⑤ route-register ── 注册到 router/modules.ts 或 menu.ts
       │
       ↓
⑦ convention-audit ─ 扫描本次变更 → P0/P1/P2 审计报告 + 自动修复
       │
       ↓
   P0 静默修复 → P1 修复+报告 → pnpm type-check → ✅ 交付
```

> **与 PC 端的关键差异**：移动端将 PC 端的「api-contract」拆为 **api-spec（规格文档）+ api-contract（代码生成）** 两步，并新增 **mock-gen**（独立 Mock 生成 Skill）和 **route-register**（路由注册独立为一步）。

---

## 各 Skill 输入输出

| 序号 | Skill | 输入 | 输出 | 说明 |
|------|-------|------|------|------|
| ① | prototype-scan | Axure HTML / 设计稿 / 截图描述 / 口述 | `page-spec.json` | 与 PC 端同源，输出移动端卡片布局描述 |
| ② | api-spec | page-spec.json 或原型描述 | `docs/api-spec/{module}.md` | 移动端独有：完整接口规格文档（字段/类型/示例） |
| ③ | api-contract | api-spec.md / page-spec / 需求描述 | `src/api/{module}.ts` | 前端 API 调用代码 |
| ④ | page-codegen | page-spec + api.md | `views/{module}/` 三文件组 | 卡片布局（primary/secondary/tags/meta 层级） |
| ⑤ | route-register | 页面路径、标题、缓存策略 | `router/modules.ts` 或 `menu.ts` | Hash/History 双模式；Uniapp 写 pages.json |
| ⑥ | mock-gen | data.ts 类型定义 | `mock/{module}.ts` + data.ts 常量 | 双产物：data.ts 常量 + mock 端点 |
| ⑦ | convention-audit | 本次变更的所有文件 | P0/P1/P2 审计报告 + 自动修复 | 三级分级 + 设计令牌检查 |

---

## 与 PC 端的差异对比

| 对比项 | PC 端（12 个 Skill） | 移动端 H5（7 个 Skill） |
|--------|---------------------|------------------------|
| Skill 数量 | 12 个 | 7 个（聚焦代码生成链路） |
| 双线入口 | prototype-scan + spec-doc-parse | 仅 prototype-scan |
| 业务文档沉淀 | business-doc-extract | 无（移动端聚焦碎片化生成） |
| 接口处理 | api-contract 一步到位 | api-spec + api-contract 两步拆分 |
| Mock 生成 | page-codegen 内置 | ⑥ 独立 Skill，双产物 |
| 路由/菜单 | menu-sync（对接权限系统） | route-register（本地路由注册） |
| 数据同步 | menu/dict/permission-sync | 无（移动端不走后端权限系统） |
| 环境配置 | env-config | 无（移动端环境配置简单） |
| 规范审计 | convention-audit | convention-audit（P0/P1/P2 三级 + 设计令牌） |
| 页面布局 | 表格行布局（BaseTable + AGGrid） | 卡片布局（Vant 卡片 + 分层设计） |
| UI 组件库 | Element Plus + @jhlc/common-core | Vant 4 / uv-ui |
| 样式体系 | Windi CSS + SCSS | UnoCSS + SCSS + `--ds-*` 设计令牌 |
| 文件规范 | 四文件分离（index/data/scss/api） | 三文件分离（.vue **禁止 `<style>` 块**） |

---

## 自动调度机制

所有 Skill 通过关键词自动匹配，无需手动选择：

```text
用户输入 "扫描原型"
  → AI 匹配 prototype-scan Skill
  → 加载 .github/skills/prototype-scan/SKILL.md
  → 按规则执行并输出 page-spec.json

用户输入 "生成页面"
  → AI 匹配 page-codegen Skill
  → 自动检查 page-spec / api-spec 是否存在
  → 生成三文件组
```

支持的 AI 编辑器：**Copilot / Cursor / Windsurf / Claude Code** — 规则文件内容同源。

| 文件 | 适用编辑器 |
|------|-----------|
| `.github/copilot-instructions.md` | GitHub Copilot |
| `.cursorrules` | Cursor |
| `.windsurfrules` | Windsurf |
| `CLAUDE.md` | Claude Code |
| `AGENTS.md` | 通用标准 |

---

## Robot_H5 移动端核心规范

> 以下规范来自 Robot_H5 的 `copilot-instructions.md`，是移动端 Skill 生成的代码必须遵循的约定。

### 1. 三文件分离

| 文件 | 职责 |
|------|------|
| `index.vue` | 模板 + 逻辑，`<template>` 在上，`<script setup lang="ts">` 在下。**禁止 `<style>` 块** |
| `index.scss` | 样式，BEM 命名，使用 `--ds-*` 设计令牌，通过 `import './index.scss'` 引入 |
| `data.ts` | 类型定义 + 常量映射 + 静态数据 + Mock 数据 |

### 2. 组件命名 C_ 前缀

- 全局组件放 `src/components/C_{Name}/`，自动注册
- 组件类型定义放 `types/{Name}/type.ts`，使用 `#/{Name}/type` 别名导入
- **禁止在 `<script setup>` 中 `export` 类型**

### 3. 样式规范

- **禁止硬编码**颜色/圆角/阴影 → 必须用 `var(--ds-xxx)` 令牌
- BEM 命名：`.{page-name}__{element}--{modifier}`
- 间距 4px 网格：4 / 8 / 12 / 16 / 20 / 24 / 32
- 字号梯度：11 / 12 / 13 / 14 / 15 / 16 / 17 / 20 / 22 / 28 / 34
- 底部安全区：`padding-bottom: calc(Xpx + env(safe-area-inset-bottom))`
- 毛玻璃：`background: var(--ds-glass-bg); backdrop-filter: blur(var(--ds-glass-blur)) saturate(var(--ds-glass-saturate))`

### 4. 图标规范

- UnoCSS 类名：`i-ph:{name}-bold`（Phosphor）或 `i-ic:{name}`（IC）
- data.ts 中动态引用的图标类名**必须加入 `uno.config.ts` 的 `safelist`**
- 禁止 CDN 图标

### 5. 类型检查（零容忍）

- 每次修改后运行 `pnpm type-check`（vue-tsc --noEmit），必须**零错误**
- Vant 组件属性须符合类型约束（如 VanTag size 只接受 `'large' | 'medium'`）
- Picker 的 columns 必须是 `PickerOption[]`，不可用 `string[]`

---

## wl-mbase（Uniapp 跨端）适配要点

wl-mbase 是基于 **Uniapp** 的跨端项目（H5 + 小程序），与 Robot_H5 的主要差异：

| 维度 | Robot_H5 | wl-mbase |
|------|----------|----------|
| 页面注册 | `router/modules.ts` | `src/pages.json`（Uniapp 配置式） |
| 路由跳转 | `router.push()` | `uni.navigateTo()` |
| 组件 | Vant 4 | uv-ui / Uniapp 内置 |
| 条件编译 | 无 | `#ifdef H5` / `#ifdef MP-WEIXIN` |
| 网络请求 | axios | `uni.request` 封装 |

> wl-mbase 目前未接入 wl-skills-kit 的 Skill 体系（无 `.github/skills/`），页面开发以 Robot_H5 的 Skill 为参考，手动适配 Uniapp 语法差异。

---

## 碎片化调用

| 你想做什么 | 对 AI 说 | 触发的 Skill |
|-----------|---------|-------------|
| 扫描移动端原型 | "扫描这些原型" | ① prototype-scan |
| 生成接口规格文档 | "生成 api-spec" | ② api-spec |
| 生成 API 调用代码 | "生成 api 代码" | ③ api-contract |
| 生成移动端页面 | "帮我生成详情页" | ④ page-codegen |
| 注册路由 | "注册路由" | ⑤ route-register |
| 生成 Mock 数据 | "生成 mock" | ⑥ mock-gen |
| 审计移动端代码 | "规范审计" | ⑦ convention-audit |

---

## 耗时预估

一个移动端模块（3-5 个页面）完整走 ① → ⑦ 流水线，约 **5-8 分钟**出完整代码（含 Mock）。

---

> 📚 参考实现：Robot_H5 `.github/skills/` 7 个 Skill 目录
> 📖 各 Skill 详细文档见左侧导航对应的子页面
