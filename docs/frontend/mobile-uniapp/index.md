# 移动端 uniApp — 概览 & 技术选型

## 基座定位

`wl-mbase`（华新移动端门户基座）是基于 **Vue 3 + UniApp + TypeScript** 的企业移动端**统一入口**——不是业务应用，而是承载所有业务子应用的基础平台。一套源码通过 UniApp 条件编译，同时运行于**微信小程序 / 钉钉 H5 / 普通浏览器 H5 / App** 四端。

核心定位：用户在基座登录一次，即可免登进入各业务子系统（智慧安全、智慧安防、智慧环保等），实现 SSO 集成。

### 三端运行架构

| 端            | 容器方案               | 子应用加载                        | 钉钉 JSAPI  | 导航栏           |
| ------------- | ---------------------- | --------------------------------- | ----------- | ---------------- |
| 微信小程序    | `<web-view>` 组件      | URL 拼接 token                    | 不可用      | 系统自带         |
| 钉钉 H5       | iframe 嵌入 + 基座桥接 | URL 拼接 token + postMessage 桥接 | ✅ 全量可用 | 钉钉原生         |
| 普通浏览器 H5 | iframe 嵌入            | URL 拼接 token                    | 不可用      | 基座自定义玻璃态 |

> 同一套源码通过 UniApp 条件编译（`#ifdef MP-WEIXIN` / `#ifdef H5`）+ 运行时 UA 检测（`isDingTalkEnv`）自动适配各端差异。

---

## 技术栈

| 技术                        | 版本   | 职责                          |
| --------------------------- | ------ | ----------------------------- |
| Vue                         | 3.5.30 | 响应式 + 组合式               |
| UniApp（@dcloudio）         | 3.0.0  | 跨端核心框架（H5/小程序/App） |
| TypeScript                  | 5.7.3  | 类型安全                      |
| Vite + vite-plugin-uni      | 5.x    | 构建工具                      |
| Pinia + persistedstate      | 2.3.1 / 3.2.3 | 状态管理 + 持久化（uni.storage） |
| wot-design-uni              | 1.14.0 | 跨平台 UI 组件库              |
| UnoCSS + SCSS               | 66.5.1 | 原子化 CSS                    |
| jsencrypt                   | 3.5.4  | RSA 密码加密传输              |
| opencc-js                   | 1.3.1  | 简繁中文转换                  |
| oxlint + ESLint             | —      | 代码质量（Flat Config）       |
| husky + lint-staged         | —      | Git 提交校验                  |
| commitizen + commitlint     | —      | 交互式规范提交                |

> 环境要求：Node.js >= 18、pnpm >= 10。

---

## 基座核心能力

### 统一登录

- OAuth2 密码模式（Password Grant）+ RSA 非对称加密传输密码
- 钉钉 H5 微应用内自动免登：`requestAuthCode` 换系统 token，失败时不露出账号密码登录框
- 登录一次，所有子应用免登（SSO）
- **访客模式**：OAuth2 `client_credentials` 换取受限 token，外部人员免账号密码进入（仅微信小程序端）

### 子应用免登集成

```
基座登录 → 读取当前公司上下文
         → 拼接 URL（含 portal_token + user_id + from=portal + companyId + companyName）
         → iframe/web-view 加载子应用
         → 子应用检测 portal_token → 写入登录态 → 跳过登录页
```

### 钉钉消息单点跳转

钉钉消息点击后，不先落工作台，而是完成基座免登并直达子应用具体页面。由静态中转页 `public/relay.html` 承接，不依赖 uni-app 路由初始化与 Nginx 深路径 fallback。审批流消息单独走 `FLOW_` 模板分流。详见 [H5 子应用集成方案](./integration)。

### 公司上下文

工作台通过 `/hrms/user/getCurUser` → `/hrms/user/getById` 读取 `userOrganizeInfo`，用户选择当前公司后，打开子应用时透传 `companyId/companyName`；子应用后端必须用 `portal_token + companyId` 再次校验权限。

### 钉钉 JSAPI 鉴权与桥接

- 进入子应用时惰性 `dd.config` 签名鉴权（拍照/定位为敏感 API，必须鉴权），按 URL 缓存
- 52013 签名错误自动重试；非敏感 API（扫码）免鉴权
- 子应用 iframe 受限无法直调 JSAPI，由基座统一代理，通过 `mbase-bridge` postMessage 桥接回传（拍照/上传/定位/扫码）

### HTTP 请求层

请求去重、路由切换自动取消、401 防抖（只弹一次）、refresh_token 静默续期。

---

## 多端编译目标

| 平台         | 编译指令           | 说明                                  |
| ------------ | ------------------ | ------------------------------------- |
| H5           | `uni -p h5`        | 运行于移动浏览器 / 钉钉 WebView       |
| 微信小程序   | `uni -p mp-weixin` | 上线前需配置微信公众平台业务域名白名单 |
| App（全平台）| `uni -p app`       | 同时支持 Android / iOS                |
| App-Android  | `uni -p app-android` | 独立 Android 包                     |
| App-iOS      | `uni -p app-ios`   | 独立 iOS 包                           |

---

## 快速开始

```bash
pnpm install          # 安装依赖
pnpm dev:h5           # H5 开发（端口 1999，走本地 Mock）
pnpm dev:wx           # 微信小程序开发
pnpm dev:app          # App 开发
```

> 首次运行需确保内网可访问 `172.28.99.172:9000`，或修改 `env/.env.development` 中的 `VITE_API_BASE_URL` 指向可用服务。

---

## 常用命令

命令分两类：**联调**（dev server，不出包、实时编译、可连不同后端）与**构建**（build，压缩出包、产物 `dist/build/`）。环境共 5 套：`dev` / `sit` / `uat` / `pre` / `prd`。

### 本地联调（dev server 直连后端）

| 命令            | 联调目标  | 说明                                         |
| --------------- | --------- | -------------------------------------------- |
| `pnpm dev:h5`   | 本地 Mock | 纯前端开发，`vite-plugin-mock-dev-server`    |
| `pnpm sit`      | SIT 后端  | dev server 直连 SIT 接口（端口 1999）        |
| `pnpm uat`      | UAT 后端  | dev server 直连 UAT 接口                     |
| `pnpm pre`      | PRE 后端  | dev server 直连 PRE 接口                     |

> PRD 生产环境不提供本地联调命令（不随意直连生产调试）。

### 生产构建

| 命令                               | 环境 | 平台       |
| ---------------------------------- | ---- | ---------- |
| `pnpm build:h5:dev`                | dev  | H5         |
| `pnpm build:h5:sit`                | sit  | H5         |
| `pnpm build:h5:uat`                | uat  | H5         |
| `pnpm build:h5:pre`                | pre  | H5         |
| `pnpm build:h5`（或 `pnpm build`） | prd  | H5         |
| `pnpm build:wx:sit`                | sit  | 微信小程序 |
| `pnpm build:wx:uat`                | uat  | 微信小程序 |
| `pnpm build:wx:pre`                | pre  | 微信小程序 |
| `pnpm build:wx`                    | prd  | 微信小程序 |
| `pnpm build:app` / `build:app-android` / `build:app-ios` | prd | App |

### 其他

```bash
pnpm lint    # oxlint + ESLint 自动修复
pnpm format  # Prettier 格式化
pnpm cz      # 规范提交（commitizen 交互式）
pnpm push    # 推送到 origin / gitee / gitcode
```

---

## 目录结构

```
wl-mbase/
├── docs/                        # 项目文档（集成文档/钉钉免登/JSAPI鉴权/真机调试/审批流/消息中心）
├── public/
│   └── relay.html               # 钉钉消息单点跳转静态中转页
├── env/                         # 多环境配置（Vite 编译时注入）
│   ├── .env                     # 公共基础变量
│   ├── .env.development         # 开发环境
│   ├── .env.sit                 # SIT 测试环境
│   ├── .env.uat                 # UAT 预发布环境
│   ├── .env.pre                 # PRE 预生产环境
│   └── .env.production          # PRD 生产环境
├── mock/                        # Mock 数据（vite-plugin-mock-dev-server）
├── scripts/                     # 构建辅助脚本（postbuild-mp-weixin.cjs 等）
├── src/
│   ├── api/                     # 接口层
│   │   ├── factory.ts           #   请求实例工厂
│   │   └── modules/             #   业务模块（user/company/message/dingtalk/approval/wechat）
│   ├── components/global/       # 全局组件（easycom 自动注册）
│   │   ├── C_Header/            #   顶部导航栏（钉钉/通用自适应）
│   │   ├── C_Layout/            #   页面骨架布局
│   │   ├── C_Tabbar/            #   底部标签栏
│   │   ├── C_Logo/              #   企业 Logo
│   │   └── C_VirtualStatusBar/  #   虚拟状态栏（钉钉环境适配）
│   ├── composables/             # 组合式函数（locale.ts 语言切换 / use-logout.ts 统一退出）
│   ├── config/
│   │   ├── env.ts               # 运行时环境变量（VITE_* 优先，硬编码兜底）
│   │   └── portal-apps.ts       # 子应用注册表（名称/图标/URL/角色/排序/平台/访客）
│   ├── constants/               # 全局常量（应用标识、OAuth 凭据等）
│   ├── directives/              # 自定义 Vue 指令
│   ├── pages/
│   │   ├── index/               # 工作台首页（子应用入口列表）
│   │   ├── login/               # 登录页（OAuth2 密码模式 + RSA + 访客入口）
│   │   ├── launch/              # 冷启动停留页（消费 redirect，避免被默认跳转覆盖）
│   │   ├── relay/               # 旧 SPA 中转入口（兼容历史消息配置）
│   │   ├── approval/            # 基座内置审批详情页（FLOW_COMMENTS 通过/驳回）
│   │   ├── message/             # 消息中心
│   │   ├── profile/             # 个人中心
│   │   ├── scan/                # 扫码（分包，调钉钉原生扫码）
│   │   ├── settings/            # 设置 / 修改密码（分包）
│   │   └── webview/             # H5 子应用容器（分包，核心集成点）
│   │       ├── index.vue        #   容器组件 + 消息分发
│   │       ├── mp-webview.vue   #   小程序 <web-view> 组件
│   │       ├── bridge-capabilities.ts # 能力桥接处理（拍照/定位/扫码）
│   │       ├── photo-utils.ts   #   图片归一化（dataURI/fetch/base64）
│   │       └── data.ts          #   常量（超时/进度/动画时长）
│   ├── static/                  # 静态资源（图片 / 字体）
│   ├── stores/modules/          # Pinia 状态
│   │   ├── app.ts               #   应用全局状态（系统信息/加载状态）
│   │   ├── company.ts           #   公司上下文（组织关系/选择/错误态）
│   │   ├── user.ts              #   用户状态（token/权限/角色/登录态）
│   │   └── message.ts           #   消息中心状态
│   ├── styles/                  # 全局样式 & mixins
│   ├── types/                   # TypeScript 类型定义
│   ├── utils/
│   │   ├── http.ts              # HTTP 封装（去重/取消/重试/401防抖）
│   │   ├── http-helpers.ts / http-types.ts  # HTTP 辅助与类型
│   │   ├── router.ts            # 路由守卫（鉴权/权限/已登录拦截）
│   │   ├── rsa.ts               # RSA 密码加密
│   │   ├── dingtalk/            # 钉钉 JSAPI 工具集（按职责拆分）
│   │   │   ├── shared.ts        #   环境检测/JSAPI加载/通用调用/类型
│   │   │   ├── config.ts        #   dd.config 鉴权/初始化/导航栏/诊断
│   │   │   ├── photo.ts         #   拍照/选图（渐进增强）
│   │   │   ├── upload.ts        #   文件上传/拍照直传（安卓/iOS 双路）
│   │   │   └── device.ts        #   定位/扫码（非敏感API免鉴权）
│   │   ├── dingtalk-redirect.ts # 钉钉消息 redirect 捕获/白名单/跳转消费
│   │   ├── flow-message.ts      # 审批流消息分流
│   │   ├── visitor-auth.ts      # 访客模式（client_credentials 换 token）
│   │   ├── wechat-openid.ts     # 微信 openid 获取（访客身份识别）
│   │   ├── user-identity.ts     # 用户账号标识归一化
│   │   ├── app-layout-prefs.ts  # 布局偏好
│   │   ├── logger.ts            # 日志
│   │   └── error-handler.ts     # 全局错误处理
│   ├── manifest.json            # 多端平台配置（AppID / 权限 / H5 路由）
│   └── pages.json               # 页面路由 & tabbar 配置（主包+分包）
├── vite.config.js
├── uno.config.ts
└── package.json
```

---

## 多环境配置

| 环境   | 文件              | Mock | API 地址                                    | 说明            |
| ------ | ----------------- | ---- | ------------------------------------------- | --------------- |
| 开发   | `.env.development`| 开启 | `http://172.28.99.172:9000`                 | Vite DevProxy   |
| SIT    | `.env.sit`        | 关闭 | `https://ytiop-sit.walsin.com.cn/sit-api`   | 测试环境        |
| UAT    | `.env.uat`        | 关闭 | `https://ytiop-uat.walsin.com.cn/uat-api`   | 预发布环境      |
| PRE    | `.env.pre`        | 关闭 | `https://ytiop-pre.walsin.com.cn/pre-api`   | 预生产环境      |
| 生产   | `.env.production` | 关闭 | `https://ytiop-prd.walsin.com.cn/prd-api`   | 必须 HTTPS      |

> 切换环境只改 env 文件（`VITE_API_BASE_URL` / `VITE_DOMAIN`），无需改代码。H5 开发环境请求通过 Vite Proxy 转发，小程序/App 直接使用完整地址。

---

## 平台检测与钉钉集成

平台检测无独立 `platform.ts`，统一通过 UniApp 条件编译 + 钉钉 `isDingTalkEnv()`（基于 UA）实现：

| 平台          | 检测方式                           | 特殊处理                                    |
| ------------- | ---------------------------------- | ------------------------------------------- |
| 微信小程序    | UniApp 条件编译 `#ifdef MP-WEIXIN` | `<web-view>` 嵌入子应用，无自定义导航栏     |
| App           | UniApp 条件编译 `#ifdef APP-PLUS`  | webview 组件 + 自定义玻璃态导航栏           |
| 钉钉 H5       | `isDingTalkEnv()`（UA 含 DingTalk）| 隐藏自定义导航栏，注入 JSAPI 桥接           |
| 普通浏览器 H5 | 默认 fallback                      | 完整自定义导航栏，Vite devServer 代理调试   |

`src/utils/dingtalk/` 封装钉钉 JSAPI 能力，**非钉钉环境下所有 API 安全 no-op**，不影响其他平台。主要导出：

| API                          | 作用                                   |
| ---------------------------- | -------------------------------------- |
| `initDingTalk()`             | `App.vue#onLaunch` 初始化              |
| `dingtalkConfig()` / `dingtalkReady()` | dd.config 签名鉴权 / ready 等待 |
| `setDingTalkTitle(title)`    | 同步页面标题到钉钉原生导航栏           |
| `getDingTalkAuthCode()`      | 获取免登 authCode                      |
| `dingtalkTakePhoto()` / `dingtalkChooseImage()` | 拍照 / 选图（含 iOS 降级） |
| `dingtalkTakePhotoAndUpload()` | 拍照直传后端                         |
| `dingtalkGetLocation()`      | 定位（gcj02，需鉴权）                  |
| `dingtalkScan()`             | 扫一扫（免鉴权）                       |
| `getDingTalkDebugInfo()`     | 签名诊断信息                           |

> 钉钉微应用上线前需在钉钉开放平台配置：**微应用首页 URL** 和 **JSAPI 安全域名**。

---

## 已注册子应用

| 应用     | mpPath      | 说明             | 钉钉 JSAPI          |
| -------- | ----------- | ---------------- | ------------------- |
| 智慧安全 | `/mbase/aq` | 安全生产管理系统 | 拍照/上传/定位      |
| 智慧安防 | `/mbase/af` | 安防监控管理系统 | 拍照/上传/定位/扫码 |
| 智慧环保 | `/mbase/hb` | 环保监测管理系统 | -                   |

> `mpPath` 运行时与 `VITE_DOMAIN` 动态拼接，切换环境只改 env 文件。新增子应用时必须同步维护 `src/config/portal-apps.ts` 与 `public/relay.html` 的消息跳转白名单。

详细集成方案（SSO 免登、消息单点跳转、JSAPI 桥接、访客模式、公司上下文、openid 分发）请参阅 [H5 子应用集成方案](./integration)。

---

## 核心功能页面

| 页面               | 路径                        | 包类型 | 说明                                           |
| ------------------ | --------------------------- | ------ | ---------------------------------------------- |
| 工作台首页         | `pages/index/index`         | 主包   | 子应用图标入口列表，支持角色/平台过滤          |
| 登录页             | `pages/login/index`         | 主包   | OAuth2 密码模式 + RSA + 微信访客入口           |
| 冷启动停留页       | `pages/launch/index`        | 主包   | 已登录冷启动消费 redirect，避免默认跳转覆盖    |
| 旧 SPA 中转入口    | `pages/relay/index`         | 主包   | 兼容历史消息配置（新消息首选 `relay.html`）    |
| 审批详情页         | `pages/approval/index`      | 主包   | FLOW_COMMENTS 审批，支持通过/驳回              |
| 消息中心           | `pages/message/index`       | 主包   | 系统消息列表与已读/未读状态                     |
| 个人中心           | `pages/profile/index`       | 主包   | 用户信息、语言切换、退出登录                    |
| H5 子应用容器      | `pages/webview/index`       | 分包   | 核心：iframe/web-view 嵌入，SSO Token 自动注入 |
| 扫码               | `pages/scan/index`          | 分包   | 调用设备摄像头扫码                              |
| 设置 / 修改密码    | `pages/settings/index`      | 分包   | 主题/语言/密码修改等个人设置                    |

---

## 全局组件（C_ 系列）

所有全局组件通过 `easycom` 规则（`^C_(.*) → @/components/global/C_$1/index.vue`）**自动注册**，无需手动导入：

| 组件                     | 功能                                              |
| ------------------------ | ------------------------------------------------- |
| `<C_Header />`           | 自定义导航栏，玻璃态效果，支持多端（含钉钉适配）  |
| `<C_Layout />`           | 页面通用布局容器，处理安全区域 padding            |
| `<C_Tabbar />`           | 底部 Tab 导航（工作台/消息/个人中心）             |
| `<C_Logo />`             | 品牌 Logo，支持主题切换                           |
| `<C_VirtualStatusBar />` | H5/App 虚拟状态栏，补偿原生状态栏高度             |

---

## 多环境地址对照

### 线上环境

| 环境 | 域名                      | API 前缀   |
| ---- | ------------------------- | ---------- |
| SIT  | `ytiop-sit.walsin.com.cn` | `/sit-api` |
| UAT  | `ytiop-uat.walsin.com.cn` | `/uat-api` |
| PRE  | `ytiop-pre.walsin.com.cn` | `/pre-api` |
| PRD  | `ytiop-prd.walsin.com.cn` | `/prd-api` |

> ⚠️ PRE 域名 / API 前缀为按规律推断的占位值，上线前需确认替换。

### 开发环境（内网直连）

| 服务        | 地址                        | 说明                |
| ----------- | --------------------------- | ------------------- |
| 移动端网关  | `http://172.28.99.172:9000` | OAuth2 / JWT Token  |
| 智慧安全 H5 | 本地 Vite 代理 `/mbase/aq`  | 子应用，iframe 嵌入 |
| 智慧安防 H5 | 本地 Vite 代理 `/mbase/af`  | 子应用，iframe 嵌入 |
| 智慧环保 H5 | 本地 Vite 代理 `/mbase/hb`  | 子应用，iframe 嵌入 |
