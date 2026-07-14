# PC 端前端 — 概览 & 技术选型

## 项目简介

PC 端业务子系统标准模板为 **`jh4j-ui-template`**（模板 ID `web.jh4j-mf-remote`，当前 `1.1.0`）—— 基于 **Vue 3 + Vite + Module Federation** 的金恒产品化平台 PC 业务子系统模板。每个应用对应一个业务领域，独立 Git 仓库、独立部署，通过微前端按需组装、相互调用。

::: tip 两种创建方式
模板既支持由脚手架 [`@agile-team/jh4j-cloud-cli`](/scaffold/) 拉取并非交互初始化，也支持直接 `git clone` 后运行内置 `pnpm setup` 命令；**两种方式使用同一份配置契约**，产物一致。
:::

```bash
# 方式一：脚手架创建（推荐）
npx @agile-team/jh4j-cloud-cli create my-project

# 方式二：直接 clone
git clone <jh4j-ui-template-repository> my-project
cd my-project
pnpm setup
```

---

## 技术栈

| 分类 | 技术 | 版本 | 说明 |
| --- | --- | --- | --- |
| 框架 | Vue 3 | ~3.2.25 | Composition API + `<script setup>` |
| 构建 | Vite | 4.4.9 | 开发 HMR + 构建 |
| 微前端 | @originjs/vite-plugin-federation | 1.4.1-jh.3 | Module Federation |
| 状态管理 | Pinia | ~2.0.14 | 通过 federation 共享远程实例 |
| 路由 | Vue Router | 4.4.3 | 通过 federation 共享远程实例 |
| UI 组件 | Element Plus | 2.2.6-prod.3 | 企业级 UI（federation shared） |
| CSS 工具 | WindiCSS | ^3.5.6 | 原子化 CSS |
| 国际化 | Vue I18n | 9.13.1 | 通过 federation 共享远程实例 |
| 公共包 | @jhlc/common-core | 3.1.0-prod.14 | 平台共享 Store/API/类型 |
| 语言 | TypeScript | ^5.4.0 | 类型安全 |

::: warning 版本必须对齐
`vue / pinia / vue-router / element-plus / @jhlc/common-core / vite-plugin-federation / vite` 等依赖版本必须与目标平台的 public 工程保持一致，**版本不对齐会导致 federation 共享失败**。完整对齐表见下方 [版本对齐](#版本对齐)。
:::

---

## Module Federation 架构

```text
┌──────────────────────────────────────────────────────────┐
│                    浏览器 :8001                            │
│  jh4j-ui-template（Host / 业务子应用）                      │
│                                                          │
│  静态 import（federation "main" remote）：                 │
│    ├── store / VueI18n / permission / initPlatform        │
│                                                          │
│  动态 fetchRemoteComponent（"public" remote）：            │
│    ├── plugins / router / layout                          │
│                                                          │
│  共享依赖（federation shared）：                            │
│    vue / pinia / vue-router / element-plus                │
│    @jhlc/common-core / @vueuse/core                       │
└──────────────┬───────────────────────────┬───────────────┘
               │                           │
     ┌─────────▼─────────┐     ┌───────────▼───────────┐
     │ /assets/remoteEntry│     │ /sub/public/assets/    │
     │  （完整版 main）    │     │  remoteEntry（增量版） │
     └───────────────────┘     └───────────────────────┘
```

- **store / VueI18n / permission**：静态 `import from "main/..."` 从完整版 remoteEntry 加载，确保 Pinia 实例正确共享
- **plugins / router / layout**：动态 `fetchRemoteComponent("public", ...)` 从增量版 remoteEntry 加载
- **optimizeDeps.exclude**：`pinia` 和 `vue-router` 必须排除在 Vite 预打包之外，避免产生独立副本与 federation 共享实例冲突

完整设计（产品化矩阵、应用间通信、共享依赖管理、路由权限、组件分层、API 层）见 [架构设计](./architecture)。

---

## 版本对齐

以下依赖版本必须与目标平台的 public 工程保持一致，版本不对齐会导致 federation 共享失败。

| 包 | 版本 | 说明 |
| --- | --- | --- |
| vue | ~3.2.25 | 核心框架 |
| pinia | ~2.0.14 | 状态管理（federation shared） |
| vue-router | 4.4.3 | 路由（federation shared） |
| element-plus | 2.2.6-prod.3 | UI 组件（federation shared） |
| @jhlc/common-core | 3.1.0-prod.14 | 平台共享包（federation shared） |
| @originjs/vite-plugin-federation | 1.4.1-jh.3 | 微前端插件 |
| vite | 4.4.9 | 构建工具 |
| typescript | ^5.4.0 | 类型检查 |

---

## 开发模式

本项目提供三种职责互斥的开发模式：

| 场景 | 命令 | 当前模块接口 | public |
| --- | --- | --- | --- |
| 连接远程环境 | `pnpm dev` | 远程 | 远程 |
| 联调本地后端 | `pnpm dev:local` | `localhost:10010` | 远程 |
| 联调本地 public | `pnpm dev:public` | 远程 | `localhost:8002` |

五套环境地址统一维护在 `project.config.json`，本机临时覆盖使用不提交的 `.env.local`。

### 创建业务页面

```text
src/views/xxx/
├── list/
│   ├── index.vue       # 视图层（模板 + 组件引用，不含业务逻辑）
│   ├── data.ts         # 数据层（API 调用 + 响应式数据 + 事件处理）
│   └── index.scss      # 样式层（scoped SCSS）
├── form/
└── detail/
```

页面需在 `vite/plugins/shared/pages.ts` 中注册暴露，菜单需后台配置路由后才能看到。详见 [架构设计 — 代码组织规范](./architecture#代码组织规范) 与 [页面模板](./skills/page-templates)。

---

## 环境配置

| 文件 | 用途 |
| --- | --- |
| `project.config.json` | 项目标识、标题、端口、五套环境默认值（唯一可变配置入口） |
| `.env` | 无敏感信息的跨环境运行时默认值 |
| `.env.local` | 本机地址、报表密钥等临时覆盖，不提交 |
| `vite/config/environments.ts` | 只负责读取结构化环境配置 |
| `vite/config/app.ts` | 只负责读取项目和本地联调配置 |

服务地址配置支持完整域名或 `http://IP:端口`，Vite 会统一生成 `baseApi`、`webUrl`、`runtimeEnv` 和代理规则，构建产物默认部署到 `/sub/{module}/`。

---

## 版块内容

- [架构设计](./architecture) — 产品化理念、Module Federation、领域驱动、组件分层、API 层架构
- [扩展规范](./standards) — BaseTable / AGGrid、平台组件合规等专项约定
- [Base 核心组件 / jh- 平台组件](./components/base-table) — 全量组件文档
- [Skills 集合](./skills/) — 12 个 AI 辅助研发 Skill
- [页面模板](./skills/page-templates) — page-codegen 的 9 种页面模板
- [wl-skills-kit 工具](./skills/cli) — Skills 体系安装器（init / update / validate / fix / clean）

::: tip 创建新项目用脚手架
从零创建一个 PC 业务子系统，请使用 [工程脚手架 jh4j-cloud-cli](/scaffold/)，避免手工复制目录再逐文件查找替换。
:::
