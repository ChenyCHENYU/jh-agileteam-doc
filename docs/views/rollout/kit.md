# 前端编码规范落地宣贯文档（多项目集群管控方案）

> 文档用途：项目组会宣贯、各项目接入执行、存量代码整改和后续验收依据
> 适用对象：项目负责人、模块负责人、前端负责人、前端开发、测试及相关协作人员
> 工程载体：`@agile-team/wl-skills-kit`
> 工程目录：`D:\office-project\wl\wl-skills-kit`
> 配套组件：`@jhlc/common-core` · `@agile-team/wl-skills-ui` · `@robot-admin/form-validate`
> 当前核对版本：`2.20.1`（2026-08-28）

---

## 一、宣贯目标与核心结论

本次宣贯需要全员达成一个统一认识：

> 14 条编码规范是前端代码质量的唯一基线，`wl-skills-kit` 是规范的工程化执行载体；业务项目通过统一依赖、统一规范文件、统一审计扫描、统一 CI 卡门和统一验收流程落实规范，不再依赖个人记忆和项目内零散约定维持代码一致性。

本次会议结束后，各项目和模块负责人应明确以下事项：

1. 为什么必须统一，以及当前代码质量参差对交付效率和维护成本的影响；
2. `wl-skills-kit` 已经统一了哪些规范、影响哪些代码层级、哪些内容仍需开发人员按规则实现；
3. 新项目与存量项目分别如何接入，规范如何与 AI 代码生成联动；
4. 如何通过"扫描—审计—整改—验证—CI 卡门"形成闭环；
5. 出现特殊场景或规范冲突时，应如何反馈和归口解决。

一句话概括本方案：

> 一套规范基线、一个工程化事实源、三层强制机制、14 条全覆盖规范、一条持续治理闭环。

### 版本演进速览（v2.15.0 → v2.20.1）

| 版本 | 落地能力 | 对使用者的意义 |
|------|---------|--------------|
| v2.16.3+ | Kilo Code 原生适配、K18 表单校验库检查 | 10 种 AI 编辑器全覆盖；`@robot-admin/form-validate` 缺失/废弃拆包可被自动检出 |
| v2.16.4 | "仅必填"切换扩展为统一表单能力 | 大表单必填/非必填混合场景一键切换，隐藏字段校验同步清理 |
| v2.16.5–v2.16.6 | D3 字典字段绑定门禁、S7 进阶查询（lookupFlows）门禁 | 字典错绑、查询操作不唯一、回填字段缺失均为确定性报错 |
| v2.17.0 | **status-column-audit 技能**（第 13 个 Skill） | 存量列表页"字典列纯文本 → 语义自动判色 Tag"审计+`--fix`+`--init-bridge` 一键桥接 |
| v2.18.0 | 规则编号 R1~R19 更名为 **K1~K19** | 与 wl-skills-ui 的 R001~R040 编号空间解耦；存量豁免配置新旧前缀等价，零改动升级 |
| v2.18.2 | `validate --pre-commit` 共享模块误报根治 | 仅 staged 共享模块/非页面目录的提交不再被误拦截，全量 validate 语义不变 |
| v2.18.4 | `--version` 查询；Skill 注册表单一事实源 + 版本漂移门禁；validate 缓存；K12 漏检修复 | 升级决策有依据；豁免/规则口径不再漂移 |
| v2.19.0 | 增量 validate 缓存、`wls_project_snapshot` 项目快照与 Page Blueprint 提取/校验 | AI 优先消费页面结构事实，减少逐页源码上下文与 token 消耗 |
| v2.20.x | **wl-scenario 场景模板体系**：JSON 事实源 + 确定性渲染（9 种 pattern）、`scenario validate/render/extract/verify/from-spec`、W1 字节级防漂移、往返等价机器证明 | 领域页面出码 AI 零自由度，render 单页 0.4~1ms、模型 token 恒为 0 |

---

## 二、落地背景与现存问题

### 2.1 当前项目特点

平台采用 Module Federation 多项目集群架构，包含生产（wl-produce）、销售（wl-sale）、质量（wl-quality）、成本（wl-cost）四大应用矩阵，以及系统管理、高级表格、组件库等共享子应用。各应用独立 Git 仓库、独立 CI/CD，由多名开发、多个模块负责人并行建设和持续迭代。

### 2.2 主要问题

长期以来，编码规范主要依赖文档查阅、口头同步和个人经验执行，容易产生以下问题：

- 同一种页面结构在不同项目中目录组织、文件拆分和代码顺序不一致；
- 有人把业务逻辑写在 `index.vue`，有人写在 `data.ts`，有人混写在模板里；
- 组件命名混乱：有人用 `C_` 前缀，有人用 `c_`，有人不加前缀；
- 查询表单有人手写 `<el-form>`，有人用 `BaseQuery`，有人用 `jh-query`；
- API 路径散落在模板字符串和方法内部，没有统一的 `API_CONFIG`；
- `console.log` 残留生产环境；硬编码 IP/域名；`v-html` 未加防护；
- `git commit -m "修改bug"` 绕过提交规范，提交历史无法追溯；
- `::v-deep`、`/deep/`、`:deep()` 三种深层选择器混用；
- 相同问题在十余个仓库重复修复，修复成本高且容易再次回归。

这些问题已经造成代码维护困难、新人上手慢、AI 生成的代码风格不统一，也影响客户对平台交付质量的评价。

### 2.3 根因判断

| 层面 | 过去的状态 | 需要建立的机制 |
|------|-----------|--------------|
| 规范 | 存在但分散在 Wiki/口口相传 | 单一规范基线（14 条 `.md`） |
| 执行 | 主要依赖人工走查和 code review | AI 门控 + 自动审计 + CI 卡门 |
| 修复 | 各项目局部修改 | 公共包归口修复、统一发版 |
| 验收 | 缺少统一验证清单 | 三层强制 + 回归验证 |
| 演进 | 问题零散反馈 | `wl-skills-kit update` 增量升级 |

---

## 三、方案定位与统一原则

### 3.1 方案定位

`wl-skills-kit` 不是单纯的规范文档集，也不是替代所有业务代码的脚手架。它是一套面向 Vue 3 + Element Plus + Module Federation 项目集群的**编码规范工程化执行框架**，包含：

- 14 条编码规范（`.wl-skills/standards/01~14`）
- 13 个 AI Skill（`.wl-skills/skills/`，含 v2.17.0 新增的 status-column-audit 存量改造技能）
- 29 个 MCP 工具（v2.19.0 新增 project_snapshot 与 template 治理 5 工具）
- 9 个页面模板（TPL-\*.md）
- 编辑器适配配置（10 种 AI 编辑器：Copilot / Cursor / Windsurf / Claude Code / Cline / Kiro / Kilo Code / Trae / Qoder / 通用 Agents）
- 独立 API 契约（`wl-skills contract` 可脱离后端先行建立本项目契约）
- 领域样例页面（生产域 8 页 + 销售域 5 页）

其核心目标是：**让 AI 生成的代码和人工编写的代码遵循同一套规范**，通过工具链保证而非依赖人的自觉。

### 3.2 三层事实来源

| 优先级 | 事实来源 | 作用 |
|--------|---------|------|
| 1 | 14 条编码规范（`.wl-skills/standards/`） | 确定代码结构、命名、安全、提交等所有维度的唯一基线 |
| 2 | `wl-skills-kit` 当前发布版本 | 将规范转化为 AI 可读的 Skill + 可执行的审计规则 |
| 3 | 业务项目特殊约定 | 仅承载公共规范暂未覆盖且经确认的业务特例 |

业务项目不得绕过公共包自行形成第二套"局部规范"。

### 3.3 三种管控方式

| 管控方式 | 适用内容 | 示例 |
|---------|---------|------|
| AI 自动门控 | 代码生成阶段按任务类型加载相关规范 | page-codegen 自动加载 02+04+06+09+12+13 |
| 确定性审计 | 从源码静态扫描的规范偏差 | K1~K19 AST 语义级检测 + D3 字典绑定 + S7 进阶查询门禁 |
| 模板与人工验收 | 涉及业务语义和交互的内容 | 页面模式选择、表单校验时机 |

> **规则编号说明（v2.18.0）**：kit 全部规则编号由 `R1~R19` 更名为 `K1~K19`（K=Kit），与 `wl-skills-ui` 扫描器的 `R001~R040` 编号空间彻底区分。存量项目的 `wl-skills:ignore` 行内标记与 `.wl-skills-validate.json` 豁免配置**同时接受新旧前缀**（同号等价，大小写不敏感），升级零改动。

---

## 四、整体工程架构：Module Federation + 三文件分离

```text
Module Federation 集群
├── wl-produce（生产）        ← 独立 Git/CI
├── wl-sale（销售）            ← 独立 Git/CI
├── wl-quality（质量）         ← 独立 Git/CI
├── wl-cost（成本）            ← 独立 Git/CI
├── systemApp（系统管理·共享）    ← 被所有应用依赖
├── agGridApp（高级表格·共享）    ← 被所有应用依赖
└── componentLib（组件库·共享）   ← 被所有应用依赖

每个业务页面遵循三文件分离：
├── index.vue    ← 纯模板，不写业务逻辑
├── data.ts      ← Hook + API_CONFIG，业务逻辑唯一归宿
├── index.scss   ← 样式
└── api.md       ← 接口约定文档
```

**架构原则**：统一技术栈 + 统一规范 + 独立部署 + 灵活组装 + 按需加载 + 应用间通信无直接代码依赖。

---

## 五、`wl-skills-kit` 统一管控覆盖维度

### 5.1 工具链规范（01 · 🔴 阻断式）

| 约束 | 规则 |
|------|------|
| 代码生成前置检测 | `.prettierrc.js` + `eslint.config.ts` + `.husky/` 三件套必须存在 |
| 缺失处理 | 缺任意一个立即暂停任务，输出标准提示 |
| 规则体系 | ESLint（Vue essential + TS recommended）+ Prettier 互排 |
| 组件命名 | 多词组件名（`vue/multi-word-component-names`），仅 `index` 豁免 |
| 禁止 | CommonJS `require()`、导出函数无 JSDoc |

**Prettier 六项配置**：单引号、无分号、80 字符宽、`trailingComma:"all"`、`arrowParens:"avoid"`、`endOfLine:"auto"`。

### 5.2 代码结构与顺序（02 · 🔴 必遵）

| 约束 | 规则 |
|------|------|
| 四文件原则 | 页面目录必须含 `index.vue` / `data.ts` / `index.scss` / `api.md` |
| index.vue 三段式 | `<template>` → `<script setup>` → `<style scoped>`（style 仅 `@import "./index.scss"` 一行） |
| script setup 九段式 | import → 组件宏 → 路由&Store → createPage() → 补充状态 → watch → 业务方法 → 生命周期 → defineExpose |
| data.ts 顺序 | import → API_CONFIG(`as const`) → createPage() → 辅助函数 |
| 禁止 | ❌ `index.vue` 写业务逻辑 ❌ 缺 `data.ts`/`api.md` ❌ `::v-deep`/`/deep/`（统一 `:deep()`） |

### 5.3 注释规范（03 · 🟡 应遵）

| 约束 | 规则 |
|------|------|
| 文件头 | koroFileHeader 插件自动生成，不手写 |
| 函数注释 | 仅复杂业务需要（JSDoc：`@description`/`@param`/`@returns`） |
| 行内注释 | 解释「为什么」而非「是什么」，统一 `//` |
| 禁止 | ❌ 提交注释掉的死代码 ❌ 显而易见的注释 ❌ TODO 不带责任人+日期 |

### 5.4 基础编码规范（04 · 🔴 必遵）

| 约束 | 规则 |
|------|------|
| 变量 | 优先 `const`，重赋值用 `let`，禁 `var` |
| 异步 | 统一 `async/await`，禁 `.then()` 链 |
| 字符串 | 单引号 + 模板字符串拼接 |
| 条件 | 代码块必须大括号（即使一行）；条件最多 3 层 |
| 模板 | `<template>` 只写简单表达式；`v-for` 必带 `:key` |
| 指令 | 统一缩写 `:`/`@`/`#` |
| 禁止 | ❌ 直接用 axios（用 `getAction`/`postAction`） ❌ 手写查询/工具栏/分页（用 BaseQuery/BaseToolbar/jh-pagination） ❌ `for...in` |

### 5.5 日志输出规范（05 · 🔴 必遵）

| 约束 | 规则 |
|------|------|
| 开发期 | 允许 `console.log`（ESLint warn），但 AI 生成代码不含调试 log |
| 提交期 | husky pre-commit 钩子强制清理 console |
| 生产期 | 禁任何 console；调试须 `import.meta.env.DEV` 守卫 |
| 禁止 | ❌ 生产代码出现 `console.log/warn/error` |

### 5.6 安全规范（06 · 🔴 必遵）

| 约束 | 规则 |
|------|------|
| v-html | 默认禁，受控内容使用须加来源注释 |
| Token | 仅存 `sessionStorage`/`localStorage` |
| 接口 | 统一走 `getAction`/`postAction` 等拦截器 |
| 禁止 | ❌ `eval()`/`new Function(string)` ❌ Token 放 URL/`<meta>` ❌ `import axios from 'axios'` ❌ 用户输入拼 URL |

### 5.7 配置管理规范（07 · 🔴 必遵）

| 约束 | 规则 |
|------|------|
| 环境变量 | `envs/.env.{mode}`，命名 `VITE_` 开头，`import.meta.env.VITE_XXX` 读取 |
| API 地址 | 走环境变量，接口路径集中在 `data.ts` 的 `API_CONFIG`（`as const`） |
| 敏感信息 | 不入库，走内部文档/密钥服务 |
| 禁止 | ❌ 硬编码 IP/域名/端口/`http://` 地址 ❌ API 路径散落模板字符串 ❌ token/secret 明文 |

### 5.8 Git 分支 & 提交规范（08 · 🔴 阻断式）

| 约束 | 规则 |
|------|------|
| 提交方式 | 强制 `git cz` 交互式提交（commitizen + `.cz-config.js`） |
| 提交流程 | pre-commit（lint + lint-staged）→ commit-msg（commitlint） |
| 格式 | `type(scope): 中文描述`，scope 必填可自定义，subject ≤ 88 字符 |
| type 枚举 | `wip`/`feat`/`fix`/`perf`/`deps`/`refactor`/`docs`/`test`/`style`/`build`/`chore`/`revert` |
| 禁止 | ❌ `git commit -m "xxx"` 绕过 commitizen（husky 会拦截） |

### 5.9 TypeScript 类型规范（09 · 🟡 应遵）

| 约束 | 规则 |
|------|------|
| 项目配置 | `strict: false` 宽松起步 |
| interface vs type | interface 用于对象；type 用于联合/工具/字面量 |
| 业务类型 | 从 `@/types/page` 桶文件引入，不重复定义 |
| `as any` | 仅限三场景：对接外部 SDK 边界、`createPage()` 返回值、确无法确定（加 TODO） |
| 禁止 | ❌ 业务字段默认用 `any` ❌ `function fn(row: any)` |

### 5.10 Pinia 状态管理规范（10 · 🔴 必遵）

| 约束 | 规则 |
|------|------|
| 用 Store | 跨页面共享（用户/权限/主题）、需持久化、多组件共享 |
| 不用 Store | 当前页查询/列表/分页/弹窗状态，保留页面级 ref |
| 目录 | `src/stores/{domain}/index.ts`，命名 `useXxxStore` |
| 禁止 | ❌ 在 `data.ts` 里 `import` Store |

### 5.11 表单与校验规范（11 · 🔴 必遵）

| 约束 | 规则 |
|------|------|
| 生命周期 | `c_formModal`/`c_formSections` 内置 open→回填→validate→submit→close |
| 独立路由表单 | 提交前必 `validate()`，取消/离开必 `resetFields()` |
| rules 位置 | `data.ts` 独立导出 |
| 校验时机 | 字符串/必填 `blur`，选择类 `change`，提交 `validate()`，联动 `watch`+`validateField()` |
| 标准校验库 | 新生成表单规则统一使用 `@robot-admin/form-validate@^3.4.1`（缺失依赖/废弃拆包/Naive API 误用由 K18 检出；kit 不依赖也不内置该库，安装前征询确认） |
| "仅必填"切换 | 字段 ≥10 且混合必填/非必填的大表单必须提供全部/仅必填切换（弹窗 `show-required-toggle` / 分区 `show-required-filter` / 页面 `useFormRequiredOnly`），隐藏字段同步清理校验且不丢数据（K17） |
| 禁止 | ❌ rules 写在 `<template>` 字面量里 ❌ 生成悬空 import ❌ 存量手写 validator 被静默改写 |

### 5.12 PC 端扩展规范（12-14）

| 编号 | 规范 | 强制度 | 核心约束 |
|------|------|:------:|---------|
| 12 | BaseTable + AGGrid cid | 🔴 必遵 | AGGrid 渲染模式、cid 全局唯一命名（base-36 时间戳）；弹窗内 AG Grid 必须 `v-if` 延迟挂载（K19，防弹窗动画期间零高度渲染） |
| 13 | 平台组件合规 | 🔴 阻断式 | 强制使用平台封装组件，禁止直接用 `el-*` 原生组件 |
| 14 | 布局容器 | 🔴 必遵 + 阻断式 | 左右分栏统一 `jh-drag-col`、上下分栏统一 `jh-drag-row`，禁止手写 flex 模拟分栏拖拽（lint 命中即报错） |

### 5.13 命名与目录约定（贯穿规范）

#### 项目/目录/文件命名

| 维度 | 规则 | 正例 | 反例 |
|------|------|------|------|
| 项目名 | 小写中划线（kebab-case） | `mall-management-system` | `mallManagementSystem` |
| 目录名 | 小写中划线，复数结构用复数 | `scripts`、`components` | `script`、`demo_scripts` |
| 文件名 | 小写中划线 | `user-profile.vue` | `userProfile.vue` |
| 私有组件目录 | PascalCase | `SearchForm/` | `search-form/` |
| 变量 | 小驼峰（lowerCamelCase） | `saveShopCarData` | `save_shop_car_data` |
| 常量 | 全大写下划线 | `MAX_STOCK_COUNT` | `maxStockCount` |

#### 页面目录结构

```
src/views/{domain}/{subsystem}/{feature}/
  ├── index.vue              # 视图层（纯模板）
  ├── data.ts                # 逻辑层（Hook + API_CONFIG）
  ├── index.scss             # 样式层
  ├── api.md                 # 接口约定文档
  └── components/            # 可选：页面私有组件（PascalCase 目录）
      └── SearchForm/
          ├── index.vue
          ├── data.ts
          └── index.scss
```

| 目录层级 | 规则 | 示例 |
|---------|------|------|
| 领域目录 | 小写英文 | `sale` / `produce` |
| 子系统目录 | 小写英文，长词用连字符 | `order` / `material-management` |
| 功能目录 | 固定值（不用连字符） | `list` / `form` / `detail` |

#### 组件命名三级前缀

| 组件类型 | 前缀 | 命名方式 | 放置位置 | 示例 |
|---------|------|---------|---------|------|
| 全局公共组件 | `C_` | `C_PascalCase` | `src/components/` | `C_TagStatus`、`C_Tree` |
| 业务域共享组件 | `c_` | `c_pascalCase`（首字母小写） | `src/views/{domain}/components/` | `c_formModal`、`c_formSections` |
| 页面私有组件 | 无前缀 | `PascalCase` | `.../page/components/` | `SearchForm`、`OrderItems` |

> 复杂组件建议"文件夹 + 三文件分离"；简单组件（< 100 行）可用单文件 `.vue`。

#### 增删查改统一动词

**必须使用以下 5 个动词，不得使用其他**：

| 操作 | 动词 | ❌ 禁止 |
|------|------|---------|
| 新增 | `add` | create / insert / new |
| 修改 | `update` | edit / modify / change |
| 删除 | `delete` | remove / del / drop |
| 详情 | `detail` | view / info / show |
| 查询 | `get` | query / fetch / list |

### 5.14 Git 提交规范详细（08 条展开）

#### 分支命名

| 前缀 | 用途 | 示例 |
|------|------|------|
| `feat/` | 新功能 | `feat/customer-profile` |
| `fix/` | Bug 修复 | `fix/order-flicker` |
| `refactor/` | 重构 | `refactor/form-logic` |
| `docs/` | 文档更新 | `docs/api-readme` |
| `chore/` | 构建/工具变更 | `chore/update-deps` |
| `perf/` | 性能优化 | `perf/table-render` |
| `test/` | 测试相关 | `test/unit-coverage` |

#### 提交类型（12 种枚举 + emoji）

| type | emoji | 说明 |
|------|:-----:|------|
| `wip` | 🚧 | 开发中（未完成的工作，临时提交） |
| `feat` | 🎯 | 新功能 |
| `fix` | 🐛 | Bug 修复 |
| `perf` | ⚡️ | 性能优化 |
| `deps` | 📦 | 依赖更新 |
| `refactor` | ♻️ | 重构（不新增功能，不修复 bug） |
| `docs` | 📚 | 文档变更 |
| `test` | 🔎 | 测试相关 |
| `style` | 💄 | 代码样式（空格、格式、缩进） |
| `build` | 🧳 | 构建 / 打包相关 |
| `chore` | 🔧 | 其他杂项（工具链配置等） |
| `revert` | 🔙 | 回退 |

#### 提交格式与示例

格式：`type(scope): 中文描述（≤88 字符）`

scope 必填可自定义，建议写**模块/子模块**：

```
feat(mmwr-customer): 新增客户档案页面
fix(domestic-trade): 修复订单状态切换闪烁
refactor(c_formModal): 重构表单回填逻辑
deps(package.json): 升级 vite 至 5.4
wip(quality-inspection): 质检报告页开发中
```

#### 完整提交流程

```
bun run cz / git cz
    │
    ▼
.cz-config.js → 交互式选类型、填 scope、写描述
    │
    ▼
git commit（由 commitizen 触发）
    │
    ├─ .husky/pre-commit 触发：
    │   1. lint 全量检查（0 warning 门禁）
    │   2. lint-staged                   ← 增量检查暂存文件
    │       ├─ eslint --fix --no-cache
    │       └─ prettier --write
    │
    ├─ .husky/commit-msg 触发：
    │   commitlint --edit "$1"           ← 校验提交信息格式
    │
    ▼
提交成功 ✅
```

> **禁止** `git commit -m "xxx"` 直接提交 — 绕过 commitizen，husky 会拦截。

### 5.15 Vue 组件与模板规范

#### 组件名规范

- 组件名始终**多个单词**（≥ 2 个），避免与 HTML 元素冲突
- 模板中使用 **PascalCase** + 自闭合：`<MyComponent />`

#### Prop 定义规范

```typescript
props: {
  // 组件状态，用于控制组件的颜色
  status: {
    type: String,
    required: true,
    validator: (value) => ['success', 'info', 'error'].includes(value),
  },
}
```

- 必须指定类型、必填 `required` 或 `default`、加注释、按需加 `validator`

#### 模板规范

| 规则 | 要求 |
|------|------|
| 标签顺序 | `<template>` → `<script>` → `<style>` |
| `v-for` | 必带 `:key`（优先业务 id） |
| 指令 | 统一缩写 `:` / `@` / `#` |
| 模板表达式 | 只写简单表达式，复杂逻辑移入 `computed` |
| 样式 | `<style scoped>`，`@import "./index.scss"` 一行 |
| `v-show` vs `v-if` | 频繁切换用 `v-show`，条件少变用 `v-if` |

### 5.16 Vue Router 规范

| 规则 | 要求 |
|------|------|
| 懒加载 | `component: () => import('...')` |
| path | kebab-case，必须 `/` 开头（含 children） |
| name | 与组件 `name` 一致（保 keep-alive） |
| 跳转传参 | 用路由参数（不用 Vuex/Pinia，防刷新丢失） |

```typescript
{
  path: '/upload-attachment',
  name: 'uploadAttachment',  // 与组件 defineOptions({ name: 'uploadAttachment' }) 一致
  meta: { title: '上传附件' },
  component: () => import('@/views/components/upload-attachment/index.vue'),
}
```

### 5.17 测试规范

| 维度 | 要求 |
|------|------|
| 单元测试 | Vitest，文件命名 `*.spec.ts`，覆盖率 > 80% |
| 组件测试 | Testing Library，测试用户交互行为，避免测试实现细节 |
| 测试目录 | 与源码同级或 `test/` 目录 |

```typescript
// user.service.spec.ts
import { describe, it, expect, vi } from 'vitest'

describe('UserService', () => {
  it('should get user info', async () => {
    const mockUser = { id: '1', name: 'John' }
    vi.spyOn(api, 'get').mockResolvedValue(mockUser)
    const result = await getUserInfo('1')
    expect(result).toEqual(mockUser)
  })
})
```

### 5.18 安全与性能规范

| 约束 | 规则 |
|------|------|
| `for...in` | ❌ 禁止（用 `Object.keys().forEach()`） |
| undefined 判断 | ❌ 不直接 `!== undefined`（用 `typeof x !== 'undefined'`） |
| this 引用 | 统一用 `self` |
| 懒加载组件 | `defineAsyncComponent(() => import(...))` |
| 计算属性 | 复杂过滤/计算用 `computed`，不在模板写复杂表达式 |
| 错误处理 | `try-catch` 捕获异常，定义明确错误类型，友好提示 |

---

## 六、三层强制执行机制

14 条规范并非"贴在墙上的文档"，而是通过**三层强制机制**落地：

### 第一层：AI 自动门控（生成阶段）

`.wl-skills/standards/index.md` 是规范门控中枢（AI 主入口 `.github/copilot-instructions.md` 同步指向）。AI 在执行任何代码生成任务**之前**，按**任务类型**自动加载相关规范子集：

```
page-codegen（页面生成）  → 加载 02 + 04 + 06 + 09 + 12 + 13
api-contract（接口生成）  → 加载 02 + 06 + 09
code-fix（自动修复）      → 加载全量 01-14
```

### 第二层：validate CI 卡门（提交阶段）

```bash
# 静态校验页面完整性（4 文件、AGGrid、cid、mock、api.md）
# + AST 语义级 K1~K19 检测（圈复杂度、分页边界、运行时边界、表单开关、校验库、弹窗 AG Grid）
npx @agile-team/wl-skills-kit validate

# 提交阶段增量卡门（v2.18.2：仅共享模块/非页面 staged 变更自动跳过，不再误拦截）
npx @agile-team/wl-skills-kit validate --pre-commit

# 单页面校验
npx @agile-team/wl-skills-kit validate-page src/views/xxx/yyy
```

CI 中校验未通过 → **构建中止**，偏差代码无法进入主干。

### 第三层：husky / lint-staged 拦截（本地阶段）

```
本地 husky 拦截（08 提交规范 + console 清理）
    → CI validate 卡门（02/12/13 等 + K1~K19）
        → convention-audit 体检（全量 01-14）
```

### 确定性门禁补充（v2.16.5+）

除 K 系列 AST 规则外，validate 还执行两类**契约级确定性门禁**（不靠 AI 自觉，脚本直接判定）：

| 门禁 | 检测内容 | 报错时机 |
|------|---------|---------|
| D3 字典字段绑定 | `page-spec.json` 显式声明 `dict/dictCode` 时，逐字段核对 `queryDef/columnsDef` 的 `dict/dictCode/logicValue` | 缺失或错绑即确定性错误；`--strict` 模式阻断发布 |
| S7 进阶查询（lookupFlows） | 查询操作必须唯一存在；响应模型字段必须覆盖回填来源；新增/更新模型必须覆盖回填目标 | 声明了 `lookupFlows` 的页面逐项判定；未声明保持原行为不猜测 |

---

## 七、组件合规体系

### 7.1 必须使用的平台封装组件

| 场景 | 禁止 | 必须使用 |
|------|------|---------|
| 数据表格 | 手写 `<el-table>` + 分页 | BaseTable（AGGrid 模式） |
| 查询区 | 手写 `<el-form>` + 布局 | BaseQuery |
| 工具栏 | 手写按钮堆叠 | BaseToolbar |
| 弹窗表单 | 手写 `<el-dialog>` + form | c_formModal |
| 分区表单 | 手写 `<el-collapse>` + form | c_formSections |
| 状态标签 | 手写 `<el-tag>` + 颜色 | C_TagStatus |
| 树形组件 | 手写 `<el-tree>` | C_Tree |
| 分页 | 手写 `<el-pagination>` | jh-pagination |

### 7.2 增删查改统一动词

| 操作 | 动词 | 禁止 |
|------|------|------|
| 新增 | `add` | ❌ create/insert/new |
| 修改 | `update` | ❌ edit/modify/change |
| 删除 | `delete` | ❌ remove/del/drop |
| 详情 | `detail` | ❌ view/info/show |
| 查询 | `get` | ❌ query/fetch/list |

### 7.3 13 个 AI Skill 全景（v2.20.1）

Skill 是规范的可执行剧本：每个 Skill 都有触发词路由（`_registry.md` 单一数据源）+ Pre-flight 声明（AI 执行前先报告已读文件，可观测）+ 产物落 `reports/` 追加。

| # | Skill | 分类 | 能力 | 典型触发词 |
|---|-------|------|-----------|-----------|
| ① | prototype-scan | core | Axure HTML/截图/口述 → page-spec JSON 页面清单（原型线） | "扫描原型" |
| ② | spec-doc-parse | core | 标准说明书（功能编码/IPO 表）→ page-spec JSON（规范线） | "解析说明书" |
| ③ | business-doc-extract | core | 原型/详设/字段资料 → 结构化业务文档（语义级触发） | 语义识别 |
| ④ | api-contract | core | 生成 `api.md` 前后端接口约定，双方零成本对齐 | "接口约定" |
| ⑤ | page-codegen | core | page-spec + api.md → 4 文件/页 + Mock + 菜单注册 | "生成页面" |
| ⑥ | convention-audit | core | 14 条规范全量扫描 → 双报告（AUDIT_AI + AUDIT_HUMAN） | "规范审计" |
| ⑦ | template-extract | core | 从标杆页面提取领域专属模板（TPL-\*.md 复用资产） | "提取模板" |
| ⑧ | menu-sync | sync | MCP 驱动菜单同步，0 次手动点击 | "同步菜单" |
| ⑨ | dict-sync | sync | 字典基线拉取/推送/审计 | "同步字典" |
| ⑩ | permission-sync | sync | 角色 + 菜单授权 + 动作权限闭环 | "角色授权" |
| ⑪ | code-fix | ops | 受控自动修复 🟡/🟢 偏差 + 强制复扫 | "自动修复" |
| ⑫ | standard-env-config | ops | 环境扫描 → dry-run → apply → verify（客户迁移） | "切环境" |
| ⑬ | status-column-audit | core | 存量字典列纯文本 → 语义自动判色 Tag：审计 → `--fix` 转换 → `--init-bridge` 一键桥接 `renderAutoTagByLabel`（v2.17.0） | "字典列 Tag 化" |

> ⑬ 的转换目标 `dictAutoTag(dictRef, value, fieldName)` 桥接 `@agile-team/wl-skills-ui >= 1.10.0` 的语义判色能力；dict 与字段名取自源码中的 const 定义（无歧义来源），即使误判，最坏结果也只是维持原样（中性文案仍按纯文本展示），不改写业务逻辑。

### 7.4 独立 API 契约（v2.16+）

没有后端契约也能先行锁定本项目接口事实，前后端并行不被阻塞：

```bash
# 默认只预览，不写文件
wl-skills contract init --contract-id mdm-task --service mdm --resource mdmTask \
  --module task --permission-prefix mdm_task --output contracts/mdm-task.json

# 确认写入，补齐字段/操作后将 contractStatus 改为 confirmed
wl-skills contract init ... --output contracts/mdm-task.json --confirm
wl-skills contract validate --input contracts/mdm-task.json --strict

# 后端契约（wl-skills-bd 产出）存在时做完整握手
wl-skills contract compare --left contracts/mdm-task.json \
  --right contracts/mdm-task.backend-contract.json --strict
```

---

## 八、接入流程

### 8.1 新项目接入

```bash
# 0. 工程化前置（强制）
npx @robot-admin/git-standards init

# 1. 安装规范体系（14 规范 + 13 Skill + 23 MCP + 10 编辑器配置）
npx @agile-team/wl-skills-kit

# 2. AI 编辑器自动识别规范，开始生成代码
# 3. 提交前 husky 自动拦截违规
# 4. CI 中 validate 自动卡门
```

### 8.2 存量项目接入

```bash
# 1. 安装规范
npx @agile-team/wl-skills-kit

# 2. 审计现有代码
npx @agile-team/wl-skills-kit validate

# 3. 根据审计报告整改
#    🔴 阻断项：用 page-codegen 重新生成或人工修改
#    🟡 应遵项：用 code-fix 自动修复
#    🟢 建议项：按计划逐步消化

# 4. 冻结基线，后续增量卡门
#    存量字典列 Tag 化改造：status-column-audit 审计 → --fix → --init-bridge
```

### 8.3 增量更新

```bash
# 规范升级时增量覆盖
npx @agile-team/wl-skills-kit@latest update
```

---

## 九、问题归属判断：到底改公共包还是改业务项目

后续遇到规范/代码问题时，统一按以下顺序判断：

```text
是否属于 14 条规范或平台通用约定？
  ├─ 否 → 评估是否为真实业务特例
  └─ 是
      ↓
是否在多个项目或同一页面模式重复出现？
  ├─ 是 → 归口 wl-skills-kit 修复并发版（规范/Skill/模板/检测规则）
  └─ 否
      ↓
公共包是否已有能力但项目接入错误？
  ├─ 是 → 修复项目依赖、入口或版本（对照 update + diff）
  └─ 否
      ↓
是否能以确定性规则（AST/契约）检测和修复？
  ├─ 是 → 补充 K 系列规则或 D/S 门禁 + 模板 + 文档
  └─ 否 → 形成最小业务特例或登记豁免（.wl-skills-validate.json）
```

判断原则：

- 公共问题不在十余个项目重复打补丁；
- 项目接入问题不通过扩大公共规则解决；
- 能机器判定的不留给 AI 自觉，能确定性检测的不依赖人工走查；
- 规则升级走 `npm version` 自动同步全部版本锚点（README / 架构文档 / CLI 头注释），避免包版本与文档脱节；
- 无法自动判断的业务语义必须人工确认。

---

## 十、全员执行要求

### 10.1 必须执行

1. 所有业务项目统一依赖 `@agile-team/wl-skills-kit`，版本升级同时更新锁文件；
2. 新项目优先全量接入，存量项目渐进式审计整改；
3. 所有页面遵循三文件分离（`index.vue` / `data.ts` / `index.scss` / `api.md`）；
4. 新增代码必须通过 `validate` 扫描和项目构建；
5. API 路径统一集中在 `API_CONFIG`，不散落在模板或方法内部；
6. 提交统一走 `git cz`，禁止 `-m` 直接提交；
7. 遇到公共问题统一反馈，由 `wl-skills-kit` 评估、修复、测试和发版。

### 10.2 明确禁止

- 禁止在 `index.vue` 写业务逻辑；
- 禁止直接使用 `axios`（用 `getAction`/`postAction`）；
- 禁止手写查询表单/工具栏/分页（用平台封装组件）；
- 禁止硬编码 IP/域名/端口/API 路径；
- 禁止生产代码残留 `console.*`；
- 禁止 `::v-deep`/`/deep/`（统一 `:deep()`）；
- 禁止 `git commit -m "xxx"` 绕过提交规范；
- 禁止业务字段默认使用 `any` 类型。

### 10.3 允许但需评审

- 客户明确要求的专项页面交互；
- 大屏、地图、流程设计器等与标准 B 端页面差异明显的场景；
- `as any` 的三个允许场景（外部 SDK / createPage 返回值 / 确无法确定 + TODO）；
- 公共包暂未覆盖的新组件、新 DOM 结构。

---

## 十一、角色与职责

| 角色 | 主要职责 |
|------|---------|
| 前端负责人 / 规范负责人 | 维护规范基线、公共包路线、版本策略和争议裁决 |
| `wl-skills-kit` 维护人员 | 规范更新、Skill 迭代、MCP 工具开发、审计规则增强 |
| 项目负责人 | 确保项目正确接入、锁定版本、组织整改和最终验收 |
| 模块负责人 | 确认审计报告、识别业务特例、推动模块修复 |
| 前端开发 | 按规范开发，不新增局部补丁和风格漂移 |
| 测试人员 | 按验收清单验证功能、组件状态和回归影响 |

---

## 十二、项目验收清单

### 12.1 接入验收

- [ ] `package.json` 和锁文件中的 `wl-skills-kit` 版本一致；
- [ ] `.wl-skills/standards/` 目录存在且包含 14 条规范；
- [ ] `.wl-skills/skills/` 目录存在且包含 13 个 Skill；
- [ ] `npx @agile-team/wl-skills-kit validate` 通过；
- [ ] husky pre-commit 钩子正常工作。

### 12.2 代码质量验收

- [ ] 所有页面遵循三文件分离；
- [ ] `index.vue` 无业务逻辑（纯模板）；
- [ ] API 路径全部集中在 `API_CONFIG`；
- [ ] 无硬编码 IP/域名/端口；
- [ ] 无生产 `console.*` 残留；
- [ ] 无 `::v-deep`/`/deep/`；
- [ ] 表格/查询/工具栏/分页均使用平台封装组件；
- [ ] Git 提交记录全部遵循 `type(scope): 描述` 格式。

### 12.3 工程验收

- [ ] `validate` 零阻断项（K1-K19 通过）；
- [ ] ESLint 0 error；
- [ ] `pnpm build` 构建通过；
- [ ] TypeScript `tsc --noEmit` 无致命错误。

---

## 十三、特殊场景反馈与持续迭代

### 13.1 反馈时必须提供的信息

```text
项目名称：
页面路由：
wl-skills-kit 实际版本：
问题代码片段：
违反的规范编号（01-14）：
期望行为：
是否可稳定复现：
```

### 13.2 公共包修复要求

每次公共包修复必须做到：
1. 先定位真实根因；
2. 明确规范条目和影响范围；
3. 优先修复最小作用域；
4. 增加 AST 检测规则防止回归；
5. 更新规范文档和审计规则；
6. 发布 patch 版本，向各项目提供升级提示。

---

## 十四、方案落地价值

1. **统一代码风格**：14 条规范覆盖全部代码维度，十余个项目保持一致；
2. **降低开发心智负担**：开发人员无需记忆大量约定，AI 自动门控 + CI 卡门保证；
3. **AI 代码质量**：AI 生成的代码与人工代码遵循同一套规范，无需二次人工调整；
4. **减少重复修复**：通用规范统一复用，公共问题只解决一次；
5. **提高变更可控性**：通过 validate + husky + CI 三层卡门防止新问题回流；
6. **提升交付效率**：三文件分离 + 13 Skill + 9 模板，从原型到代码全链路加速。

---

## 十五、宣贯会议后建议输出

本次宣贯不应只停留在"大家知道了"，建议会议结束时形成以下明确输出：

1. 确认 14 条编码规范和 `wl-skills-kit` 为统一事实来源；
2. 确认各项目负责人和模块负责人名单；
3. 确认项目接入台账、目标版本（≥ 2.18.2）和接入模式；
4. 确认第一轮 `validate` 扫描时间及审计报告提交时间；
5. 确认公共问题与项目问题的归口规则（见第九章决策树）；
6. 确认存量字典列 Tag 化改造的试点项目与页面范围；
7. 确认后续 PR / CI 门禁（validate --pre-commit / 全量 validate）落地时间；
8. 确认规则编号 K 前缀切换后各项目豁免配置的核对安排。

最终目标不是让所有页面"一夜重写"，而是建立统一底座、冻结新增偏差、分批消化存量，并确保后续迭代不再回到各项目各自为政的状态。

---

## 十六、最终统一口径

> 编码统一不是要求每个人记住更多规则，而是通过公共包让正确做法成为默认做法，通过审计和 CI 让偏差能够及时被发现，通过统一反馈和发版让公共问题只解决一次。

从本次宣贯起，所有项目应共同遵循：

> 规范基线看 `wl-skills-kit`，工程实现以 14 条标准为准；公共问题归口公共包，业务特例必须显式评审；新增代码不得制造新的规范偏差，存量问题按计划持续收敛。

---

## 附录 A：项目常用接入与检查命令

```bash
# 安装
npx @agile-team/wl-skills-kit

# 预览
npx @agile-team/wl-skills-kit --dry-run

# 增量更新
npx @agile-team/wl-skills-kit@latest update

# 环境体检
npx @agile-team/wl-skills-kit doctor

# 全量审计
npx @agile-team/wl-skills-kit validate

# 提交阶段增量卡门
npx @agile-team/wl-skills-kit validate --pre-commit

# 单页面校验
npx @agile-team/wl-skills-kit validate-page <path>

# 确定性机械修复（缺 render-type、::v-deep → :deep() 等）
npx @agile-team/wl-skills-kit fix --dry-run

# 独立 API 契约（无后端依赖先行建契约）
npx @agile-team/wl-skills-kit contract init|validate|compare

# 环境标准化 / 客户迁移
npx @agile-team/wl-skills-kit standard-env

# Mock 清理（按域或全量）
npx @agile-team/wl-skills-kit mock-clean --domain <name>

# 升级前对比 / 卸载预览
npx @agile-team/wl-skills-kit diff
npx @agile-team/wl-skills-kit clean --dry-run
```

---

## 附录 B：规范与工程能力对应关系

| 规范编号 | 规范名称 | 工程落地方式 | 当前状态 |
|---------|---------|------------|---------|
| 01 | 工具链 | 三件套检测 + ESLint 规则 | 已工程化 |
| 02 | 代码结构 | AI 门控 + validate 4 文件检测 | 已工程化 |
| 03 | 注释 | koroFileHeader + ESLint 规则 | 已工程化 |
| 04 | 基础编码 | ESLint + Prettier + AI 门控 | 已工程化 |
| 05 | 日志 | husky pre-commit 清理 console | 已工程化 |
| 06 | 安全 | ESLint 安全规则 + AI 门控 | 已工程化 |
| 07 | 配置 | VITE_ 前缀检测 + AI 门控 | 已工程化 |
| 08 | Git 提交 | commitizen + commitlint + husky | 已工程化 |
| 09 | TypeScript | tsc --noEmit + AI 门控 | 已工程化 |
| 10 | Pinia | 架构约定 + AI 门控 | 已工程化 |
| 11 | 表单校验 | 组件内置 + 标准校验库 + K17 仅必填/K18 校验库检查 | 已工程化 |
| 12 | BaseTable | AGGrid 模式 + cid 唯一性检测 + K19 弹窗 v-if 门禁 | 已工程化 |
| 13 | 平台组件 | 组件对照表 + 阻断式扫描 | 已工程化 |
| 14 | 布局容器 | jh-drag-col / jh-drag-row 强制 + lint 阻断 | 已工程化 |
| — | 字典字段绑定 | D3 契约级确定性门禁 | 已工程化 |
| — | 进阶查询回填 | S7 lookupFlows 确定性门禁 | 已工程化 |
| — | 存量字典列 Tag 化 | status-column-audit（审计/fix/init-bridge） | 已工程化 |
