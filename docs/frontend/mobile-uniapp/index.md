# 移动端 uniApp — 概览 & 技术选型

## 项目简介

`wl-mbase`（华新移动端门户）是基于 **Vue 3 + UniApp + TypeScript** 的华新企业跨平台移动入口，一套代码同时编译为 **H5 / 微信小程序 / App**，并可作为钉钉微应用运行。

核心定位：**统一移动门户基座**，通过 OAuth2 完成一次登录，以 `iframe`（H5/App端）或 `web-view`（小程序端）嵌入各业务子系统（智慧安全、智慧安防、智慧环保等），实现免登 SSO 集成。

---

## 技术栈总览

### 核心框架

| 方向           | 技术选型                   | 版本              |
| -------------- | -------------------------- | ----------------- |
| 框架           | Vue 3                      | ^3.5.30           |
| 跨端引擎       | UniApp（@dcloudio）        | 3.0.0-407xxx      |
| 语言           | TypeScript                 | ~5.7.3            |
| 构建工具       | Vite + @dcloudio/vite-plugin-uni | ^5.x        |
| 路由           | UniApp pages.json          | 内置              |
| 状态管理       | Pinia + persistedstate     | 2.3.1 / 3.2.3     |
| UI 组件库      | wot-design-uni             | ^1.14.0           |
| 样式方案       | UnoCSS + SCSS              | ^66.5.1           |
| 国际化         | vue-i18n                   | ^11.3.0           |
| 密码加密       | jsencrypt（RSA）           | ^3.5.4            |
| 中文转换       | opencc-js（繁简互转）      | ^1.3.1            |

### 开发工具链

| 工具                    | 版本      | 用途                                |
| ----------------------- | --------- | ----------------------------------- |
| pnpm                    | >=10.x    | 包管理器（强制锁定）                |
| Node.js                 | >=18      | 运行时                              |
| oxlint + ESLint 10      | ^1.56.0   | 代码质量（Flat Config）             |
| Prettier                | ^3.8.1    | 格式化                              |
| Husky 9 + lint-staged   | 9.x/16.x  | Git Hooks + 暂存区 lint             |
| commitizen + commitlint | 4.x/20.x  | 交互式规范提交                      |
| vite-plugin-mock-dev-server | ^2.1.0 | 开发阶段 Mock 数据               |

### 多端编译目标

| 平台         | 编译指令                | 说明                                  |
| ------------ | ----------------------- | ------------------------------------- |
| H5           | `uni -p h5`             | 运行于移动浏览器/钉钉WebView          |
| 微信小程序   | `uni -p mp-weixin`      | 上线前需配置微信公众平台业务域名白名单|
| App（全平台）| `uni -p app`            | 同时支持 Android / iOS                |
| App-Android  | `uni -p app-android`    | 独立 Android 包                       |
| App-iOS      | `uni -p app-ios`        | 独立 iOS 包                           |

---

## 快速开始

```bash
# 安装依赖（强制使用 pnpm）
pnpm install

# H5 开发（端口 1999，自动打开浏览器）
pnpm dev:h5

# 微信小程序开发（在 HBuilderX / 微信开发者工具中打开 dist/dev/mp-weixin）
pnpm dev:wx

# App 开发
pnpm dev:app
```

> **注意**：首次运行需确保内网可访问 `172.28.99.172:9000`，或修改 `env/.env.development` 中的 `VITE_API_BASE_URL` 指向可用服务。

---

## 目录结构

```
wl-mbase/
├── docs/
│   └── 集成文档.md              # H5 子应用 SSO 完整集成手册（必读）
├── env/                         # 多环境变量配置
│   ├── .env                     # 公共基础变量
│   ├── .env.development         # 开发（内网 172.28.99.172:9000）
│   ├── .env.test                # 测试环境
│   ├── .env.staging             # 预发布环境
│   └── .env.production          # 生产（HTTPS 域名）
├── mock/                        # 开发阶段 Mock 数据（vite-plugin-mock-dev-server）
├── scripts/                     # 构建辅助脚本（postbuild-mp-weixin.cjs 等）
├── src/
│   ├── api/                     # 接口层（uni.request 封装 + 业务模块）
│   ├── components/
│   │   └── global/              # 全局自动注册组件（easycom）
│   │       ├── C_Header/        # 自定义导航栏（玻璃态，支持多端适配）
│   │       ├── C_Layout/        # 页面布局容器
│   │       ├── C_Logo/          # 品牌 Logo 组件
│   │       ├── C_Tabbar/        # 底部 Tab 导航
│   │       └── C_VirtualStatusBar/ # 虚拟状态栏（用于 App/H5 安全区域）
│   ├── composables/             # 组合式函数
│   │   ├── index.ts             # 统一导出
│   │   └── locale.ts            # 语言切换（中/繁/英）
│   ├── config/
│   │   ├── env.ts               # 运行时环境变量读取
│   │   └── portal-apps.ts       # 子应用注册表（维护所有 H5 入口配置）
│   ├── constants/               # 全局常量（app 标识、OAuth 参数等）
│   ├── data/                    # 静态基础数据
│   ├── directives/              # 自定义 Vue 指令
│   ├── pages/                   # 主包页面（easycom 自动注册）
│   │   ├── index/               # 工作台首页（子应用入口图标列表）
│   │   ├── login/               # 登录页（OAuth2 密码模式 + RSA 加密）
│   │   ├── message/             # 消息中心
│   │   └── profile/             # 个人中心
│   ├── pages/                   # 分包页面（subPackages）
│   │   ├── scan/                # 扫码（分包）
│   │   ├── settings/            # 设置/修改密码（分包）
│   │   └── webview/             # H5 子应用容器（分包，核心集成点）
│   ├── static/                  # 静态资源（图片/字体）
│   ├── stores/                  # Pinia 状态模块
│   │   └── modules/
│   │       ├── app.ts           # 应用状态（主题/语言/网络）
│   │       ├── user.ts          # 用户状态（token/userInfo/roles/权限）
│   │       └── message.ts       # 消息未读数
│   ├── styles/                  # 全局样式 & mixins
│   ├── types/                   # TypeScript 类型定义
│   ├── utils/
│   │   ├── http.ts              # uni.request 封装（去重/重试/401拦截/页面级取消）
│   │   ├── router.ts            # 路由封装（页面跳转 + 路由守卫）
│   │   ├── permission.ts        # 权限检查（hasPermission/hasRole）
│   │   ├── rsa.ts               # RSA 非对称加密（登录密码加密）
│   │   ├── platform.ts          # 平台检测（mp-weixin/dingtalk/h5/app）
│   │   ├── dingtalk.ts          # 钉钉 JSAPI 集成工具
│   │   ├── error-handler.ts     # 全局错误处理
│   │   └── v_verify.ts          # 表单验证规则
│   ├── manifest.json            # 多端平台配置（小程序 AppID / H5 路由 / App 权限）
│   └── pages.json               # 页面路由 & tabbar 配置（主包+分包）
├── 上线调整清单.md               # 上线前必做检查项（域名/HTTPS/微信配置等）
├── vite.config.js               # Vite 构建配置
├── uno.config.ts                # UnoCSS 配置（含 uni-helper 预设）
└── package.json
```

---

## 多环境配置

| 环境       | 文件                | Mock | API 地址                     | 说明                  |
| ---------- | ------------------- | ---- | ---------------------------- | --------------------- |
| 开发       | `.env.development`  | 开启 | `http://172.28.99.172:9000`  | Vite DevProxy 代理    |
| 测试       | `.env.test`         | 关闭 | `http://172.28.99.172:9000`  | 内网测试服务器        |
| 预发布     | `.env.staging`      | 关闭 | 待配置                       | 发布前灰度验证        |
| 生产       | `.env.production`   | 关闭 | `https://your-domain.com`    | 必须 HTTPS（小程序要求）|

> H5 开发环境下请求通过 Vite Proxy 转发到 `/api/*`，小程序/App 环境直接使用 `VITE_API_BASE_URL` 完整地址。

---

## 常用命令

```bash
# ── 开发 ─────────────────────────────────────────
pnpm dev:h5           # H5 开发（端口 1999）
pnpm dev:wx           # 微信小程序开发
pnpm dev:app          # App 开发

# ── 测试 / 预发布 ─────────────────────────────────
pnpm test             # H5 测试环境
pnpm test:wx          # 小程序测试环境
pnpm staging          # H5 预发布环境
pnpm staging:wx       # 小程序预发布环境

# ── 生产构建 ─────────────────────────────────────
pnpm build:h5         # H5 生产包
pnpm build:wx         # 小程序生产包（含 WXSS 后处理）
pnpm build:app        # App 全平台包
pnpm build:app-android # Android 包
pnpm build:app-ios    # iOS 包

# ── 代码质量 ─────────────────────────────────────
pnpm lint             # oxlint + ESLint 自动修复
pnpm format           # Prettier 格式化

# ── Git ───────────────────────────────────────────
pnpm cz               # 规范提交（commitizen 交互式）
pnpm push             # 同步推送 origin/gitee/gitcode
```

---

## 服务架构

```
用户（移动端）
  │
  ▼
UniApp 门户（wl-mbase）
  ├─ OAuth2 登录 ──────────────► 后端网关 :9000 ──► 认证服务
  │                                                 ──► 用户/权限服务
  │
  └─ 工作台 → 点击子应用
       │
       ▼
    拼接跳转 URL（含 portal_token）
       │
       ├─ H5/App：iframe 全屏嵌入
       └─ 小程序：<web-view> 组件

       ▼
    子应用 H5（智慧安全 / 智慧安防 / 智慧环保 …）
       └─ 检测 portal_token → 写入登录态 → 直接进首页（免登录）
```

---

## 平台检测与钉钉集成

项目通过 `src/utils/platform.ts` 在运行时自动识别平台，配合 UniApp 条件编译实现差异化处理：

```
getPlatform() 返回值
  ├─ 'mp-weixin'  — UniApp #ifdef MP-WEIXIN 编译期确定
  ├─ 'app'        — UniApp #ifdef APP-PLUS 编译期确定
  ├─ 'dingtalk'   — H5 运行时，UA 包含 DingTalk
  ├─ 'h5'         — 普通移动浏览器
  └─ 'unknown'    — 未知环境
```

### 钉钉微应用

`src/utils/dingtalk.ts` 封装了钉钉 JSAPI 能力，**非钉钉环境下所有 API 自动 no-op**，不影响其他平台：

| API                      | 作用                              |
| ------------------------ | --------------------------------- |
| `initDingTalk()`         | 在 `App.vue#onLaunch` 初始化      |
| `setDingTalkTitle(title)`| 同步页面标题到钉钉原生导航栏      |
| `isDingTalkEnv()`        | 检测是否在钉钉内运行              |

> 钉钉微应用上线前需在钉钉开放平台配置：**微应用首页 URL** 和 **JSAPI 安全域名**。

---

## 核心功能页面

| 页面               | 路径                        | 包类型 | 说明                                           |
| ------------------ | --------------------------- | ------ | ---------------------------------------------- |
| 工作台首页         | `pages/index/index`         | 主包   | 子应用图标入口列表，支持角色过滤                |
| 登录页             | `pages/login/index`         | 主包   | OAuth2 密码模式 + RSA 加密，支持多平台登录      |
| 消息中心           | `pages/message/index`       | 主包   | 系统消息列表与已读/未读状态                     |
| 个人中心           | `pages/profile/index`       | 主包   | 用户信息、语言切换、退出登录                    |
| H5 子应用容器      | `pages/webview/index`       | 分包   | 核心：iframe/web-view 嵌入，SSO Token 自动注入  |
| 扫码               | `pages/scan/index`          | 分包   | 调用设备摄像头扫码                              |
| 设置 / 修改密码    | `pages/settings/index`      | 分包   | 主题/语言/密码修改等个人设置                    |

---

## 全局组件（C_ 系列）

所有全局组件通过 `easycom` 规则（`^C_(.*) → @/components/global/C_$1/index.vue`）**自动注册**，无需手动导入：

| 组件                  | 功能                                              |
| --------------------- | ------------------------------------------------- |
| `<C_Header />`        | 自定义导航栏，玻璃态效果，支持多端（含钉钉适配）  |
| `<C_Layout />`        | 页面通用布局容器，处理安全区域 padding            |
| `<C_Tabbar />`        | 底部 Tab 导航（工作台/消息/个人中心）             |
| `<C_Logo />`          | 品牌 Logo，支持主题切换                           |
| `<C_VirtualStatusBar />`| H5/App 虚拟状态栏，补偿原生状态栏高度           |

---

## 后端服务地址（内网）

| 服务          | 地址                                     | 说明                             |
| ------------- | ---------------------------------------- | -------------------------------- |
| 移动端网关    | `http://172.28.99.172:9000`              | OAuth2 登录 / JWT Token          |
| 智慧安全 H5   | `http://172.28.99.172:81/hxaqtest/app`   | 子应用，iframe/web-view 嵌入    |
| 智慧安防 H5   | `http://172.28.99.172:81/hxaftest/app`   | 子应用，iframe/web-view 嵌入    |
| 智慧环保 H5   | `http://172.28.99.172:81/hxhbtest/app`   | 子应用，占位待确认               |

> 上线前的完整切换步骤见 `上线调整清单.md`，包含域名替换、HTTPS 配置、微信公众平台白名单设置等。
