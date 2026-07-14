# 工程脚手架 — 概览 & 快速开始

`@agile-team/jh4j-cloud-cli`（当前 `0.6.1`）是 JH4J Cloud 企业内部标准化项目脚手架，用于从受控模板快速创建**结构一致、配置完整、可追溯**的工程。一条命令即可生成 PC 业务子系统或移动端 H5 应用，避免手工复制目录再逐文件查找替换。

::: tip 与 Skills Kit 的区别
本板块讲的是**项目脚手架** `@agile-team/jh4j-cloud-cli`（命令 `jh4j`，用于 `create / list / doctor / info`）。
前端 Skills 安装器 `@agile-team/wl-skills-kit`（`init / update / validate / fix / clean`）是另一个工具，文档见 [PC 端 — wl-skills-kit 工具](/frontend/pc/skills/cli)。
:::

---

## 它解决什么问题

| 痛点 | 脚手架做法 |
|------|-----------|
| 复制旧项目改不干净，残留他业务目录 / 标题 / 端口 | 模板 + 非交互初始化，只改结构化配置 |
| 各项目目录结构、命名、规范参差 | 统一受控模板，配置契约一致 |
| 私有 Registry、微前端版本对齐易错 | 模板内置推荐值，版本对齐表约束 |
| 远程模板拉取不稳定 | GitHub → Gitee 主备源自动降级 + 本地缓存 |
| 生成中途失败留下半成品 | staging 事务化生成，成功才原子提升 |

---

## 核心能力

| 能力 | 说明 |
| --- | --- |
| 模板直选 | 直接展示 PC 管理端与移动端 H5，技术栈提示互不混淆 |
| 两种方式 | 快速创建直接用模板推荐配置；自定义创建才展开必要参数 |
| 品牌终端 | 青色到靛蓝的 JH4J 品牌主题，并兼容 `NO_COLOR` 与非 TTY |
| 结果面板 | 分区展示模板版本、实际配置、预设能力、下一步命令 |
| 非交互创建 | 支持命令行参数和 JSON 配置文件，适用于 CI 与批量初始化 |
| 多源拉取 | 支持本地目录、Git、HTTP 压缩包和离线压缩包 |
| 源站容灾 | 内置模板按 GitHub → Gitee 顺序拉取，主源不可用时自动切换 |
| 模板缓存 | 按 `source + ref` 缓存远程模板，支持查看、清理和强制刷新 |
| 安全生成 | 在临时目录完成初始化与校验，成功后再原子写入目标目录 |
| 工程初始化 | 默认不安装依赖；可初始化 `main` 分支并创建首次提交 |
| 来源追踪 | 生成 `.jhlc/project.json`，记录模板版本、CLI 版本和创建参数 |

### 生成链路

```text
jh4j create
  → 读取 Catalog
  → 选择 PC 管理端或移动端 H5 模板
  → 选择快速创建或自定义创建
  → 解析可用模板源
  → 拉取或读取缓存
  → 校验 template.manifest.json
  → 在 staging 目录执行模板初始化
  → 生成项目并初始化 Git
  → 开发者按需修改配置并手动安装依赖
```

---

## 环境要求

- Node.js `^22.12.0 || ^24.0.0`，推荐 Node.js 24
- pnpm `>=11.8.0`
- Git

建议先体检本机环境：

```bash
npx @agile-team/jh4j-cloud-cli doctor
```

---

## 快速开始

无需全局安装：

```bash
npx @agile-team/jh4j-cloud-cli create jh4j-ui-orders
```

或全局安装：

```bash
pnpm add -g @agile-team/jh4j-cloud-cli
jh4j create jh4j-ui-orders
```

默认交互提供「快速创建 / 自定义创建」两种方式：

```text
选择项目模板
├─ PC 管理端      Vue 3 · Vite · 微前端
└─ 移动端 H5      Vue 3 · Vite 7 · Vant 4

选择创建方式
├─ 快速创建（推荐）  使用模板推荐配置并立即生成
└─ 自定义创建        设置项目名、标题、端口和联调地址
```

快速创建不再提问：PC 使用 `jh4j-ui-app`、移动端使用 `jh4j-mobile-app`，标题、端口、联调地址、Registry、模块标识和各套环境配置全部采用模板推荐值。创建完成后默认**不安装依赖**，由开发者执行 `pnpm install`。详见 [创建项目](./create)。

---

## 当前可用模板

| 类型 | 模板 ID | 模板 | 文档 |
| --- | --- | --- | --- |
| 前端 | `web.jh4j-mf-remote` | Vue 3 + Vite + Module Federation PC 业务子系统 | [PC 模板概览](/frontend/pc/) |
| 移动端 | `mobile.robot-h5` | Vue 3 + Vite 7 + Vant 4 企业级 H5 应用 | [移动端 H5 概览](/frontend/mobile-h5/) |
| 后端 | — | 暂未接入 | — |

---

## 命令总览

```text
jh4j create [name]                    创建项目
jh4j list [--json]                    查看模板 Catalog
jh4j doctor [--json]                  检查 Node、pnpm、Git 与模板环境
jh4j info [path] [--json]             查看生成项目元数据
jh4j template validate [path]         校验模板契约
jh4j config list|get|set|unset|reset  管理用户配置
jh4j cache list|clear                 管理模板缓存
```

详细参数与用法见 [命令参考](./commands)。

---

## 版块导航

- [创建项目](./create) — 交互 / 明确参数 / JSON 配置文件 / 预览计划 / 生成安全性
- [命令参考](./commands) — list / doctor / info / template validate / config / cache
- [模板来源 & Catalog](./templates) — 来源解析、源站容灾、模板缓存、外部 Catalog
- [模板接入规范](./template-spec) — manifest 契约、project.config、初始化脚本、元数据
- [常见问题](./faq) — 模板拉取失败、手动安装依赖、强制指定模板源

<AuthorTag author="CHENY" />
