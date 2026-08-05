# 移动端 H5 Skills 使用指南

<AuthorTag :authors="['XieFei','MaJiaRui']" />

> `@robot-h5/core` + `wl-skills-kit` — 移动端 H5 Skill 的安装和使用指南。

## 安装与初始化

移动端 Skill 体系以 **Robot_H5** 项目（Vue 3.5 + Vite 7 + Vant 4）为参考实现。与 PC 端共用同一套 `wl-skills-kit` 安装器，但规则文件、模板产物按移动端特性裁剪。

### 环境前置

```bash
node >= 20.0.0
pnpm >= 10.0.0
```

### 安装 Skill 体系

```bash
# 工程化前置（Git 提交规范）
npx @robot-admin/git-standards init

# 导入移动端规则文件 + 7 个 Skill（在 Robot_H5 根目录执行）
npx @agile-team/wl-skills-kit
```

安装后生成 `.github/skills/` 7 个 Skill 目录，并写入 `.github/copilot-instructions.md`、`.cursorrules`、`.windsurfrules`、`CLAUDE.md`、`AGENTS.md` 五个同源规则文件，Copilot / Cursor / Windsurf / Claude Code 均可自动加载。

### 与 PC 端初始化的关键差异

| 维度 | PC 端 | 移动端 H5 |
|------|-------|----------|
| 组件库依赖 | Element Plus + `@jhlc/common-core` | **Vant 4**（`unplugin-vue-components` 自动引入） |
| 能力包 | `@jhlc/common-core` 平台能力 | **`@robot-h5/core`** — 15 个设备 Hook（拍照/定位/扫码/NFC/签名…） |
| 文件规范 | 四文件分离（含 `api.md`） | **三文件分离**（`.vue` 禁止 `<style>` 块，样式独立到 `index.scss`） |
| 页面布局 | 表格行布局（BaseTable + AGGrid） | **卡片布局**（Vant 卡片 + primary/secondary/tags/meta 分层） |
| 样式体系 | Windi CSS + SCSS | **UnoCSS + SCSS + `--ds-*` 设计令牌**（禁止硬编码颜色） |
| 环境模式 | 单一部署 | **standalone / integrated 双模式**（`VITE_APP_MODE` 切换） |

::: tip 钉钉 / 微信 WebView
Robot_H5 可运行于钉钉、微信 WebView 及原生 App 内嵌。钉钉 JSAPI 桥接与鉴权细节参见 [钉钉集成](../mobile-uniapp/dingtalk)。
:::

---

## 工作流 A：从原型生成 H5 页面（最常用）

> 一个移动端模块（3-5 个页面），约 5-8 分钟出完整代码（含 Mock）。

```
Step 1  发送 Axure HTML / 设计稿 / 截图描述
        "帮我扫描这些原型，生成移动端页面"

Step 2  prototype-scan → 输出 page-spec.json（移动端卡片布局骨架）

Step 3  确认 page-spec（检查字段、卡片层级、交互意图）

Step 4  api-spec → 输出 docs/api-spec/{module}.md（接口规格文档）
        移动端独有步骤：前后端字段/类型/示例对齐

Step 5  api-contract → 输出 src/api/{module}.ts（TypeScript 调用代码）

Step 6  mock-gen → 输出 mock/{module}.ts + data.ts 常量
        双产物：data.ts 类型常量 + vite-plugin-mock 端点

Step 7  page-codegen → 输出 views/{domain}/{module}/ 三文件组
        index.vue（模板+逻辑）+ index.scss（BEM+令牌）+ data.ts（类型+常量）

Step 8  route-register → 注册到 router/modules.ts 或 menu.ts
        Hash/History 双模式；Uniapp 项目写 pages.json

Step 9  启动验证：pnpm dev → Mock 数据自动生效（VITE_USE_MOCK=true）
```

> **与 PC 端的差异**：移动端将 PC 端的 `api-contract` 拆为 **api-spec（规格文档）+ api-contract（代码）** 两步，并把 **mock-gen、route-register** 各独立为一步。

---

## 工作流 B：接口 Mock 与联调

> 后端接口未就绪时，先用 Mock 联调，再切换真实接口。

```
Step 1  生成 Mock
        "生成 mock" / "补充模拟数据" → ⑥ mock-gen
        产出 mock/{module}.ts（端点）+ data.ts 常量池

Step 2  本地开发联调
        .env.development 保持 VITE_USE_MOCK=true
        pnpm dev → 页面请求被 vite-plugin-mock 拦截，返回常量池数据

Step 3  切换真实接口
        修改 .env.{test|uat} 中 VITE_USE_MOCK=false
        确认 VITE_API_BASE_URL 指向后端网关（如 172.28.99.172:9000）
        pnpm build:test → 对接测试环境
```

::: warning Mock 数据规范
- Mock 端点必须引用 `dataPool` 常量，**禁止硬编码响应**
- API 路径须与 `src/api/*.ts` 完全一致（审计 P0 项）
- 数据量 6-10 条，需覆盖所有状态枚举值
:::

---

## 工作流 C：规范审计

> 对已生成或存量代码执行三级审计：**P0 Error → P1 Warning → P2 Info**。

```
Step 1  触发审计
        "审计规范" / "代码检查" → ⑦ convention-audit

Step 2  AI 扫描目标目录下所有 .vue / .scss / .ts 文件

Step 3  逐项检查：
        P0  三文件分离 / defineOptions / 接口路径 / 类型定义 / Mock 数据池 / 路由注册 / 组件导入
        P1  设计令牌（禁止硬编码颜色）/ BEM 命名 / 安全区 / 枚举覆盖 / keepAlive 策略
        P2  间距网格（4px）/ 字号梯度 / import 顺序 / JSDoc / 文件命名

Step 4  输出审计报告 + 结论（✅ 通过 / ❌ 存在 P0）
```

移动端审计相比 PC 端额外强化：**设计令牌检查**（`var(--ds-*)`）、**底部安全区**（`env(safe-area-inset-bottom)`）、**字号/间距梯度**。详见 [⑦ 规范审计](./convention-audit)。

---

## 与 PC 端的差异

| 维度 | PC 端 | 移动端 H5 |
|------|-------|----------|
| Skill 数量 | 12 个 | **7 个**（聚焦代码生成链路） |
| 双线入口 | prototype-scan + spec-doc-parse | 仅 prototype-scan |
| 接口处理 | api-contract 一步到位 | **api-spec + api-contract 两步** |
| Mock 生成 | page-codegen 内置 | **mock-gen 独立 Skill**（双产物） |
| 路由/菜单 | menu-sync（对接后端权限系统） | **route-register**（本地路由注册） |
| 数据同步 | menu / dict / permission-sync | 无（移动端不走后端权限系统） |
| 组件库 | Element Plus + `@jhlc/common-core` | **Vant 4** |
| 路由 | vue-router + Module Federation | vue-router（Hash/History）/ pages.json（Uniapp） |
| 状态管理 | Pinia（federation shared） | **Pinia + persistedstate**（user/theme 持久化加密） |
| 样式 | Windi CSS + SCSS | **UnoCSS + SCSS + `--ds-*` 令牌** |
| 页面布局 | 表格行布局 | **卡片布局**（Liquid Glass 设计语言） |
| 文件规范 | 四文件分离 | **三文件分离**（禁 `<style>` 块） |

---

## 7 个 Skill 触发词速查

| 操作 | 触发方式 | Skill |
|------|---------|-------|
| 扫描移动端原型 | "扫描原型"、"解析设计稿" | ① prototype-scan |
| 生成接口规格文档 | "生成 api-spec"、"接口字段说明" | ② api-spec |
| 生成 API 调用代码 | "生成接口"、"生成 api 代码" | ③ api-contract |
| 生成移动端页面 | "生成页面"、"帮我写页面" | ④ page-codegen |
| 注册路由 | "注册路由"、"添加菜单" | ⑤ route-register |
| 生成 Mock 数据 | "生成 mock"、"补充模拟数据" | ⑥ mock-gen |
| 规范审计 | "审计规范"、"代码检查" | ⑦ convention-audit |

---

## 钉钉集成

Robot_H5 支持以 standalone 独立运行，也可作为 `wl-mbase`（Uniapp 跨端）子应用集成运行。当 H5 页面嵌入**钉钉**容器时，需处理 JSAPI 鉴权、容器适配与原生能力桥接。

钉钉 JSAPI 接入、鉴权流程、容器差异化代码等详细约定，请参阅：

- [钉钉集成](../mobile-uniapp/dingtalk) — JSAPI 鉴权、容器适配、原生桥接
- [Uniapp 应用集成](../mobile-uniapp/app-integration) — mbase 子应用集成模式

::: tip 跨端适配
`wl-mbase` 基于 Uniapp，编译产物可同时部署到 H5 / 微信小程序 / 钉钉小程序。条件编译 `#ifdef H5` / `#ifdef MP-WEIXIN` 用于平台差异化代码。详见 [Uniapp 跨端适配要点](./skill-pipeline#wl-mbase-uniapp-跨端-适配要点)。
:::

---

> 📚 完整流水线对照参见 [AI Skill 流水线](./skill-pipeline) · 各 Skill 详细文档见左侧导航子页面
