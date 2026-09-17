# 华新移动端门户 · 多端子应用集成文档

> 📦 来源：`wl-mbase` 仓库 `docs/集成文档.md`（v3.2 · 2026-09-16）——本页以仓库为单一事实源，基座发版后同步刷新。

<AuthorTag :authors="['CHENY']" />

> 版本：v3.2 · 更新：2026-09-16
> 适用范围：移动端门户（wl-mbase）对接 H5/钉钉、微信 WebView 与 App/PDA 子应用的完整参考手册

---

## 目录

0. [阅读路径与接入边界](#零、阅读路径与接入边界)
1. [整体架构](#一、整体架构)
2. [免登（SSO）实现原理](#二、免登-sso-实现原理)
   - [钉钉消息单点跳转](#钉钉消息单点跳转)
   - [审批流消息分流](#审批流消息分流)
   - [审批业务页面与移动客户端配置](#审批业务页面与移动客户端配置)
3. [门户侧已完成内容](#三、门户侧已完成内容)
4. [H5 子应用侧改造清单](#四、h5-子应用侧改造清单)
   - [App/PDA 单头部导航](#四、h5-子应用侧改造清单)
   - [权限与异常页面协同](#四、h5-子应用侧改造清单)
5. [桥接通信协议](#五、桥接通信协议)
   - [跨端媒体 SDK（拍照/相册）](#推荐-使用跨端媒体-sdk)
   - [断点续传（断网排队）](#断点续传-断网排队)
6. [钉钉 JSAPI 鉴权](#六、钉钉-jsapi-鉴权)
7. [访客模式接入](#七、访客模式接入-免账号密码)
8. [微信小程序 openid 分发](#八、微信小程序-openid-分发-访客身份识别)
9. [公司上下文透传](#九、公司上下文透传)
10. [多环境配置](#十、多环境配置)
11. [安全注意事项](#十一、安全注意事项)

---

## 零、阅读路径与接入边界

本文是完整参考手册，保留所有分端约定、代码、错误码、验收和排障细节。第一次接入不需要从头读到尾，推荐按任务阅读：

| 读者/任务                    | 先读                                         | 再读                                                |
| ---------------------------- | -------------------------------------------- | --------------------------------------------------- |
| 首次接入开发者               | [10 分钟快速接入](./quick-access) | 本文第四、五、九节                                  |
| 只接免登、公司和菜单权限     | 本文第二、四、九节                           | 权限与异常页面协同                                  |
| 接拍照、相册、水印           | 第五节“跨端媒体 SDK”                         | [图片水印服务端接入](./watermark) |
| 接断点续传                   | 第五节“断点续传”                             | 对应后端协议与排障表                                |
| App/PDA 标题、返回和原生能力 | 第四节 App/PDA 导航、第五节能力表            | [APP 集成与发布](./app-integration)                |
| 项目经理、测试和现场排障     | 各能力验收清单、第十一节                     | 设置 → 网络诊断                                     |

稳定边界如下：

- 门户负责登录、公司上下文、入口、宿主导航、平台能力和统一兜底。
- 子应用负责自己的菜单、按钮、业务数据权限、路由和页面状态。
- 当前内部平台约定直接复用 `portal_token`，不要求子应用后端提供 Token 交换接口；本次优化不改变现有 URL 参数或登录链路。
- 子应用无权限、无菜单或初始化失败时必须主动渲染状态页；基座只能通过协同协议辅助兜底，不能读取跨域子应用 DOM 并猜测空白原因。

---

## 一、整体架构

```
用户请求
  │
  ▼
Nginx 分流
  ├─ /mobile/*  → 移动端网关（外网域名隔离）
  └─ /pc/*      → PC 端网关（现有）

移动端网关
  ├─ 校验 JWT Token（移动端专属，scope=mobile）
  ├─ 菜单/权限查询（移动端权限表，独立于 PC）
  └─ 透传业务请求 → 复用 PC 后端服务（hrms / safety / security）

子应用 H5（智慧安全、智慧安防、智慧环保 ...）
  └─ 接收并直接复用 portal_token → 加载公司/菜单/权限 → 调用自己业务接口
```

当前已注册子应用：

| 应用     | mpPath      | 说明             | 钉钉 JSAPI          |
| -------- | ----------- | ---------------- | ------------------- |
| 智慧安全 | `/mbase/aq` | 安全生产管理系统 | 拍照/上传/定位      |
| 智慧安防 | `/mbase/af` | 安防监控管理系统 | 拍照/上传/定位/扫码 |
| 智慧环保 | `/mbase/hb` | 环保监测管理系统 | -                   |
| 智慧设备 | `/mbase/sb` | 设备管理系统     | 拍照/上传/定位/扫码 |
| 智慧营销 | `/mbase/xs` | 营销管理系统     | 按需接入            |
| 品质管控 | `/mbase/zl` | 品质管控管理系统 | 拍照/上传/定位/扫码 |

> 智慧营销仅配置 `platforms: ['h5']`，用于钉钉和普通 H5 调试，不会出现在微信小程序或 App 工作台。

### 应用环境可见性配置

应用「在哪个环境显示」由 `src/config/portal-apps.ts` 顶部的 `ENV_APP_WHITELIST` 统一管理，集中一处即可调整，无需为不同环境修改代码或维护分支差异：

| 环境        | 启用应用                           |
| ----------- | ---------------------------------- |
| development | 全部（本地联调）                   |
| sit         | 安全、安防、环保、设备、营销、品质 |
| uat         | 安全、安防、环保、设备             |
| pre         | 环保、设备                         |
| production  | 安全、安防、环保、设备             |

> `enabled` 字段表示「应用配置已完成」，与环境无关，恒为 `true`。
> 新应用在 SIT 测试通过后，按实际发布计划在 `ENV_APP_WHITELIST` 的 `uat`、`pre`、`production` 数组追加其 `id`；不要提前放开尚未部署的环境，所有分支代码保持一致。

---

## 二、免登（SSO）实现原理

本项目有两层“免登”，不要混在一起看：

- **基座自身登录**：用户进入 wl-mbase。钉钉 H5 场景可通过 `requestAuthCode` 换系统 token，详见 [钉钉免登方案](./dingtalk)。
- **子应用登录**：用户已经进入 wl-mbase 后，点击智慧安全/安防/环保等子应用。基座把 `portal_token` 拼到子应用 URL，子应用据此跳过自己的登录页。

### 流程

```
① 用户在移动端门户登录（OAuth2）
     ↓ 获得 access_token（portal_token）

② 用户点击子应用入口
     ↓
③ 门户拼接跳转 URL
     https://{VITE_DOMAIN}/mbase/aq?portal_token=<token>&user_id=<id>&from=portal&companyId=<id>&companyName=<name>
     ↓
④ 子应用入口页检测到 from=portal + portal_token
     ↓
     「登录页不展示，不要求用户再次输入账号密码」
     直接用 portal_token 设置本系统登录状态 → 进首页
     ↓
⑤ 子应用正常加载，菜单/权限由子应用自己控制
```

> **核心原则：登录只在门户发生一次。**
> 用户已经在移动端登录，进入子应用时不应再看到任何登录界面。

### Token 使用方式

当前接入的都是平台内部子应用，与门户共用认证服务，统一直接把 `portal_token` 当 Bearer Token 使用。该方式已经与平台约定，本项目不要求子应用后端增加 Token 交换接口。

子应用必须遵守三个约束：

1. 每次从门户进入都以当前 URL 的 `portal_token` 为权威值，覆盖本地旧 Token，不能因为本地已有 Token 就跳过。
2. 只通过 HTTPS 和已注册子应用路径传递；页面、日志、监控、错误上报不得输出完整 Token 或带 Token 的完整 URL。
3. 接口返回 401 时按本文协议向基座上报 `logout`，不要自行清空后停留在空白页。

未来如果接入不共用认证服务的第三方系统，应单独评审认证适配方案，不改变当前存量子应用协议。

### 钉钉消息单点跳转

本节只保留门户集成入口。消息模板、推送端、字段、状态、审批策略、测试和排障统一见 [移动端消息中心使用与架构说明](./message-center)，不在两份文档中重复维护。

普通业务消息统一使用静态中转页：

```text
https://{VITE_DOMAIN}/mbase/relay.html?redirect_url=<encodeURIComponent(子应用完整URL)>
```

```text
钉钉消息
  ↓
/mbase/relay.html?redirect_url=<子应用URL>
  ↓
校验同源 + http(s) + APP_PATHS
  ↓
统一交回 /mbase/ SPA
  ↓
钉钉免登 / token 校验 / 公司加载
  ↓
dingtalk-redirect 注入 portal_token/from/user_id/companyId
  ↓
子应用 webview
```

不要为新消息配置 `/mbase/pages/relay/index` 这类 SPA 深路径；该入口仅保留历史兼容。新增子应用时必须同时维护 `src/config/portal-apps.ts` 与 `public/relay.html` 的 `APP_PATHS`，子应用后端仍需校验 token 与公司权限。

### 审批流消息分流

待审批通知使用：

```text
https://{VITE_DOMAIN}/mbase/relay.html?target=flow&provider=platform&templateCode=FLOW_COMMENTS&id=<instanceId>&commentId=<commentId>&messageId=<messageId>&returnUrl=<encodeURIComponent(移动端业务URL)>
```

当前静态中转页只把 `FLOW_COMMENTS` 直接交给基座审批详情；其它 `FLOW_*` 按临时安全域规则或 `returnUrl` 处理。基座内部消息中心可读取所有带有效流程参数的 `FLOW_*`。两条入口的现状差异、`FLOW_REFUSE` 重新发起和迁移要求以消息中心说明为准。

### 审批业务页面与移动客户端配置

审批消息、审批摘要、子应用业务页面和 OAuth 客户端是四个不同层次，接入时不要混为一个配置：

```text
审批消息 showUrl
  -> 基座内置审批详情（流程实例、待办和审批动作）
  -> paramTemplate + params（基座内展示少量、稳定的业务摘要）
  -> mobileBusinessUrl（按需打开子应用完整业务页面）

wl-mbase 移动 OAuth client
  -> 给基座签发移动端 token
  -> 子应用复用 portal_token，不再单独登录或配置 client
```

#### 业务系统需要配置什么

当审批人需要查看明细表、附件、图片、完整表单、实时业务状态，或者继续办理领域业务时，流程发起方必须在发起流程时设置 `mobileBusinessUrl`，指向自己已经实现的移动端详情页面。例如：

```json
{
  "businessId": "2099385560312320001",
  "businessUrl": "PC 端原有详情地址",
  "mobileBusinessUrl": "/mbase/hb/ep/waste/transfer-internal/detail?id=2099385560312320001"
}
```

该地址必须满足以下条件：

1. 以 `/` 开头，或使用与基座同源的完整 `http/https` URL。
2. 命中已注册子应用的 `mpPath`，例如环保必须以 `/mbase/hb/` 开头；不能只传子应用内部的 `ep/...` 相对路径。
3. 子应用真实存在该详情路由，并能根据业务 ID 查询数据、展示无权限/不存在/接口失败等明确状态。
4. 网关必须把该深层路由回退到对应移动子应用的 `index.html`，不能回退到 PC 站点；在浏览器直接访问该地址也应加载移动子应用。
5. 流程服务必须持久化并由审批详情接口原样返回 `flowInstance.mobileBusinessUrl`。修改配置后应使用新发起的流程验收，历史实例不会自动补齐。
6. 子应用继续使用基座注入的 `portal_token` 和公司上下文，不得在 URL 中拼接客户端密钥，也不得因为本地已有旧 Token 而拒绝覆盖。

简单审批如果只需要流程信息、少量摘要以及通过/驳回等动作，可以全部在基座审批详情完成，不强制配置业务页面。完整分层、字段契约与排障表见 [移动端消息中心使用与架构说明 §7.3](./message-center#_7-3-审批详情)。

#### OAuth 客户端由谁配置

`mobileBusinessUrl` 是否有效与 OAuth 客户端是否创建是两项独立条件。业务系统不需要为每条审批、每个页面或每个子应用单独创建客户端；所有通过 wl-mbase 进入的移动子应用统一复用基座 Token。

SIT 当前约定如下：

| 配置位置                | 配置项                     | SIT 约定                                                               | 责任方       |
| ----------------------- | -------------------------- | ---------------------------------------------------------------------- | ------------ |
| 平台「客户端管理」      | 客户端 ID                  | `hb_ydd`                                                               | 平台认证服务 |
| 平台「客户端管理」      | 原始客户端密钥             | 与 `hb_ydd` 客户端创建时录入的原始值一致；SIT 当前约定与客户端 ID 同值 | 平台认证服务 |
| 平台「客户端管理」      | 授权模式                   | 至少开启“资源拥有者/密码模式”和“刷新 Token”                            | 平台认证服务 |
| 平台「客户端管理」      | 权限集                     | `all`，或覆盖移动门户及已接入业务所需接口的最小权限集                  | 平台认证服务 |
| `wl-mbase/env/.env.sit` | `VITE_OAUTH_CLIENT_ID`     | `hb_ydd`                                                               | 基座         |
| `wl-mbase/env/.env.sit` | `VITE_OAUTH_CLIENT_SECRET` | 平台录入的原始值；不能使用管理页面显示的 BCrypt 哈希                   | 基座         |
| 各子应用                | OAuth client               | 不配置，复用 `portal_token`                                            | 子应用       |

这套移动客户端的目的，是让移动端 Token 及其公司上下文与 PC 的 `c1` 隔离；它不会改变审批路由，也不会替代 `mobileBusinessUrl`。其他环境必须使用该环境认证服务中真实创建的移动客户端配置，不能未经确认直接复制 SIT 凭据。

钉钉免登还需额外确认：当前前端调用 `GET /auth/dingtalk/login?code=...`，请求中不传 `client_id`，因此平台后端必须确保该接口签发的 Token 归属移动客户端 `hb_ydd`，不能仍归属 PC 客户端 `c1`。

联调验收至少覆盖：

1. 全部移动端会话退出后重新登录，确认新 Token 由移动客户端签发。
2. 移动端切换公司后，PC 刷新仍保持原公司；PC 切换公司也不影响移动端。
3. Token 临近过期时可以使用 `hb_ydd` 完成刷新；若首次登录成功但到期退出，优先检查是否遗漏“刷新 Token”授权模式。
4. 从审批消息进入基座审批详情，再点击“业务页面”，能够进入正确子应用和业务单据。
5. 缺少或错误的 `mobileBusinessUrl` 应提示地址配置问题；这类错误与 `client_id/client_secret` 无关。

---

## 三、门户侧已完成内容

- [x] `src/config/portal-apps.ts`：配置子应用列表（url、mpPath、name、enabled、roles、platforms）
- [x] `ENV_APP_WHITELIST`：环境应用白名单（控制各环境上线范围，集中维护，与 enabled 解耦）
- [x] `buildAppUrl(app, token, userId, openid, isVisitor, context)`：自动拼接 `portal_token`、`user_id`、`from=portal`、`companyId`、`companyName`
- [x] `src/pages/index/index.vue`：点击应用图标 → 传参跳转 webview 页
- [x] `src/pages/webview/index.vue`：iframe / web-view 嵌入 + postMessage 双向通信 + 桥接协议
- [x] 长会话 Token 续期：子应用上报鉴权失效后，H5/钉钉和 App/PDA 由基座刷新或复用当前 token，重新签发可信子应用 URL 并强制加载；微信小程序返回工作台后再次进入时携带当前 token
- [x] `src/utils/dingtalk/`：钉钉 JSAPI 按职责拆分为 5 个子模块
- [x] `src/utils/dingtalk-redirect.ts`：钉钉消息 redirect 捕获、白名单校验、SSO 后消费跳转
- [x] `public/relay.html`：静态中转页，支持钉钉消息单点跳转和返回体验优化
- [x] `src/pages/webview/photo-utils.ts`：图片归一化工具（URL/dataURI/base64）

### 后续待做

| 任务           | 优先级 | 说明                                                 |
| -------------- | ------ | ---------------------------------------------------- |
| 子应用列表维护 | 中     | 后端不提供接口，直接维护 `src/config/portal-apps.ts` |

---

## 四、H5 子应用侧改造清单

> **核心思路：登录入口只有一个，就是门户。**

### 4.1 必须改（否则免登不生效）

#### ① 移动端入口路径：统一部署在 `/mbase/{缩写}` 路径下

```ts
// vite.config.ts
base: '/mbase/aq'     // 子应用 base path

// vue-router
createWebHistory('/mbase/aq')

// 构建输出
build.outDir: 'aq'    // 部署时放到 /mbase/ 目录下
```

#### ② Login 入口：检测到 `portal_token` 就直接进首页

```ts
const urlParams = new URLSearchParams(window.location.search)
const portalToken = urlParams.get('portal_token')
const userId = urlParams.get('user_id')
const companyId = urlParams.get('companyId')
const companyName = urlParams.get('companyName')

if (portalToken) {
  // 方式A：直接用 portal_token 设置本系统认证状态
  store.setToken(portalToken)
  store.setUserId(userId)
  store.setCompanyContext({ companyId, companyName })
  router.replace('/home') // 进首页，登录页不渲染
  return
}
```

#### ③ 路由守卫：深链接进入时不强制跳登录页

```ts
router.beforeEach((to, from, next) => {
  const hasPortalToken = new URLSearchParams(window.location.search).has(
    'portal_token'
  )
  if (!store.token && !hasPortalToken) {
    next('/login')
  } else {
    next()
  }
})
```

#### ④ 允许被 iframe 嵌入（nginx 配置）

```nginx
# 删除或注释 X-Frame-Options
# add_header X-Frame-Options SAMEORIGIN;

# 改用 CSP 限制来源（推荐）
add_header Content-Security-Policy "frame-ancestors 'self' https://ytiop-sit.walsin.com.cn";
```

### 4.2 可选接入（体验更好）

#### ⑤ H5 / 钉钉页面标题同步给门户

> 使用 **Robot_H5 v1.7.1+** 创建的 Vue 3 子应用已内置本节标题同步和第⑥节
> App/PDA 导航协议。业务只需为每个路由维护 `meta.title`，为 Tab/首页根路由维护
> `meta.mbaseRoot: true`，不要再次复制适配器。旧项目或其他技术栈按下方协议接入。

```ts
// 各环境显式配置，例如：https://ytiop-sit.walsin.com.cn
const MBASE_ORIGIN = new URL(import.meta.env.VITE_MBASE_ORIGIN).origin

router.afterEach(to => {
  window.parent.postMessage(
    { title: to.meta.title || document.title },
    MBASE_ORIGIN
  )
})
```

标题上报必须绑定在路由完成事件（如 `router.afterEach`、uni-app H5 的
`hashchange/popstate`）上，覆盖“进入新页面”和“返回已缓存页面”两个方向。
不要只在导航组件 `mounted/onMounted` 时上报：返回旧页面时组件通常不会重新挂载，
钉钉原生头部会因此保留后一页的标题。基座会在退出子应用后恢复工作台等自身页面
标题，但跨域条件下无法读取子应用内部路由，子应用仍须按当前路由重新上报。

#### ⑥ App/PDA 双向返回导航（单头部规则适用于所有宿主）

> 本节的“原生返回双向协议”只对 `mbase_host=app` 生效，覆盖普通 App 和 Android PDA；H5、钉钉和微信小程序不启用该返回协议。单头部规则则适用于所有有宿主头部的 mbase 场景：子应用确认被 mbase 托管后隐藏自己的头部，并持续上报标题。不要只使用 `from=portal` 判断 App/PDA，因为 H5/钉钉入口同样携带该参数。

目标效果：

```text
进入子应用根页：首页原生头部（基座返回 + 当前标题）
进入子应用详情页：仍只有同一个原生头部，标题随路由更新
点击原生返回：详情页 → 子应用上一页；子应用根页 → 门户工作台
独立浏览器打开子应用：保留子应用自己的 C_NavBar
```

职责固定如下：

| 职责                    | 基座         | 子应用                            |
| ----------------------- | ------------ | --------------------------------- |
| 显示 App/PDA 唯一头部   | 是           | 嵌入时隐藏自己的头部              |
| 决定页面标题            | 展示         | 用 `route.meta.title` 上报        |
| 判断是否处于业务根页    | 否           | 用 `route.meta.mbaseRoot` 上报    |
| 响应设备返回键/原生返回 | 下发返回指令 | 执行 `router.back()` 并确认新状态 |

基座自动在 App/PDA 子应用 URL 上追加：

```text
mbase_host=app&mbase_bridge_version=1
```

子应用分三步接入。Robot_H5 `v1.7.1+` 已完成以下步骤，业务项目不得再次复制；其他技术栈按协议实现。

**第一步：配置可信门户与 App SDK 按需加载。** 安装 `@robot-h5/core@^1.2.0`，将官方 `uni.webview.1.5.8.js` 放到子应用 `public/vendor/`，并在 Core 配置中声明地址：

```ts
import { defineH5Config } from '@robot-h5/core'

export default defineH5Config({
  bridge: {
    platform: 'auto',
    mbase: {
      origin: import.meta.env.VITE_MBASE_ORIGIN,
      appBridgeTimeoutMs: 6000,
      appSdkUrl: `${import.meta.env.BASE_URL}vendor/uni.webview.1.5.8.js`,
    },
  },
})
```

各环境的 `VITE_MBASE_ORIGIN` 必须是精确来源（协议、域名和可选端口），禁止为 `*`。不要在 `index.html` 静态引入 SDK：Core 仅在 `mbase_host=app` 的 App/PDA 首次通信时插入脚本；普通 H5、微信和钉钉不下载、不执行，主 JS 也不包含 SDK 实现。`appSdkUrl` 应跟随 Vite `BASE_URL`，不要硬编码某个环境域名，也不要依赖公共 CDN。

**第二步：新增通用导航适配器。** 以下代码可直接保存为 `src/platform/mbase-navigation.ts`：

```ts
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'
import {
  isMbaseAppWebView,
  postMbaseMessage,
  waitForMbaseAppBridge,
} from '@robot-h5/core/bridge'

const SOURCE = 'mbase-navigation'
const PROTOCOL = 1
const COMMAND_EVENT = 'mbase:navigation-command'

// core 同时识别 URL 参数和 window.__MBASE_BRIDGE_HOST__，应在登录逻辑清理 URL 前初始化。
export const isMbaseAppHost = isMbaseAppWebView()

let sequence = 0
let latestRoute: RouteLocationNormalizedLoaded | undefined
let pendingAckRequestId: string | undefined
let queuedState: Record<string, unknown> | undefined
let flushing = false

const isRootRoute = (route: RouteLocationNormalizedLoaded) =>
  route.meta.mbaseRoot === true

const flush = async () => {
  if (flushing) return
  flushing = true
  let sent = false
  try {
    await waitForMbaseAppBridge()
    while (queuedState) {
      const latest = queuedState
      queuedState = undefined
      await postMbaseMessage(latest)
      sent = true
    }
  } catch (error) {
    console.warn('[mbase-navigation] App/PDA 导航状态上报失败', error)
  } finally {
    flushing = false
    // 仅在发送期间又出现更新时继续；超时/失败不自旋，由就绪事件或下一次路由变化重试。
    if (sent && queuedState) void flush()
  }
}

const send = (state: Record<string, unknown>) => {
  queuedState = state // SDK 等待期间只保留最新路由状态
  void flush()
}

const report = (
  route: RouteLocationNormalizedLoaded,
  ackRequestId?: string
) => {
  const title = String(route.meta.title || document.title || '应用').trim()
  send({
    source: SOURCE,
    type: 'navigation:state',
    protocol: PROTOCOL,
    title,
    canGoBack: !isRootRoute(route),
    seq: ++sequence,
    ...(ackRequestId ? { ackRequestId } : {}),
  })
}

const isBackCommand = (
  value: unknown
): value is { id: string; type: 'navigation:back' } => {
  if (!value || typeof value !== 'object') return false
  const command = value as Record<string, unknown>
  return (
    command.source === SOURCE &&
    command.type === 'navigation:back' &&
    command.protocol === PROTOCOL &&
    typeof command.id === 'string' &&
    /^[A-Za-z0-9:_-]{1,100}$/.test(command.id)
  )
}

export const installMbaseNavigation = (router: Router) => {
  if (!isMbaseAppHost) return

  const retryFlush = () => void flush()
  document.addEventListener('UniAppJSBridgeReady', retryFlush)
  document.addEventListener('plusready', retryFlush)

  router.afterEach((to, _from, failure) => {
    if (failure) return
    latestRoute = to
    const ackRequestId = pendingAckRequestId
    pendingAckRequestId = undefined
    report(to, ackRequestId)
  })

  window.addEventListener(COMMAND_EVENT, rawEvent => {
    const command = (rawEvent as CustomEvent).detail
    if (!isBackCommand(command) || !latestRoute) return

    if (isRootRoute(latestRoute)) {
      // 状态极短暂不同步时不误退出，也要确认指令让基座解除锁定。
      report(latestRoute, command.id)
      return
    }

    pendingAckRequestId = command.id
    router.back()
  })
}
```

**第三步：在路由安装时启用，并隐藏嵌入态子头部。**

```ts
// router/routes.ts：所有“回到门户”的业务根页必须显式标记。
{
  path: '/home',
  name: 'Home',
  component: () => import('@/views/home/index.vue'),
  meta: { title: '首页', mbaseRoot: true },
}

// main.ts：在 app.mount 前安装一次。
import { installMbaseNavigation } from '@/platform/mbase-navigation'
installMbaseNavigation(router)
```

```vue
<!-- C_NavBar/index.vue：隐藏整个组件，placeholder 也会一起移除。 -->
<VanNavBar v-if="!isMbaseAppHost" ... />

<script setup lang="ts">
  import { isMbaseAppHost } from '@/platform/mbase-navigation'
</script>
```

接入约束：

- 每个路由都配置准确的 `meta.title`；不要只把标题写死在页面的 `C_NavBar title` 属性中。
- 首页、工作台、底部 Tab 根页等无法再退回子页面的路由配置 `meta.mbaseRoot: true`；详情、编辑、扫描等二级页不要配置。
- 子应用头部右侧如果有保存、筛选等业务按钮，不能随 `C_NavBar` 一起隐藏；应迁移到页面内容区或独立业务工具栏。
- 不要用 `window.history.length` 判断根页，它会混入登录跳转、重定向和 WebView 自身历史。
- 不要在子应用里直接调用 `plus.webview` 或关闭容器；返回统一由上述协议处理。

协议字段：

| 方向              | 消息/事件                                      | 必填字段                                                  |
| ----------------- | ---------------------------------------------- | --------------------------------------------------------- |
| 子应用 → 基座     | `uni.postMessage` / `navigation:state`         | `source`、`protocol: 1`、`title`、`canGoBack`、递增 `seq` |
| 基座 → 子应用     | `mbase:navigation-command` / `navigation:back` | `source`、`protocol: 1`、唯一 `id`                        |
| 子应用 → 基座确认 | 下一条 `navigation:state`                      | `ackRequestId` 等于返回指令 `id`                          |

兼容规则：只有基座收到一条合法 `navigation:state` 后才启用新协议；未接入的存量子应用继续使用原生 WebView 历史返回，原有拍照、上传、扫码、免登均不受影响。

**Robot_H5 v1.7.1+ 默认行为：** `src/platform/mbase/` 已完成宿主固化、SDK 就绪等待、
路由双向标题同步、换号时旧身份清理、根页返回保护及稳定错误信息；`C_NavBar` 只在确认被 mbase 托管时隐藏。
因此新项目不得再引入 `window.android/window.webkit/plus.webview` 等旧返回代码，也不要只在
导航组件 `mounted` 时上报标题。

验收至少覆盖：

1. App/PDA 打开根页只有一个头部，标题正确；浏览器独立打开仍显示子应用头部。
2. 根页 → 二级页 → 三级页，标题依次变化且始终只有一个返回按钮。
3. 连续点击原生返回，先逐级返回；到根页再点才回门户工作台。
4. 快速连点返回不会跳两级；子应用未确认时基座会锁住重复指令并提示重试。
5. 未接入协议的旧子应用仍可按原方式返回。

### 4.3 必须处理的页面边界

#### ⑦ 权限与异常页面协同（避免子应用空白）

子应用的菜单、按钮和业务数据权限由各自后端控制。基座可以确认子应用 URL 是否可信、网络是否可达、主文档是否加载成功，但跨域后**不能读取子应用 DOM，也不能把“页面空白”可靠地猜成无权限**。

因此采用两层协同：

1. **子应用是第一责任层**：入口必须渲染 `loading / ready / access-denied / unavailable` 四态页面，任何初始化分支都不能只 `return` 留下空节点。
2. **基座是统一兜底层**：子应用上报标准页面状态后，H5/钉钉和 App/PDA 显示统一说明、重新校验和返回工作台；微信原生 `web-view` 使用模态提示辅助兜底。

兼容保证：页面状态协议是纯新增、可选上报。没有接入的存量子应用继续按原方式加载，登录、拍照、相册、扫码、上传和导航均不改变。

**必须区分以下结果：**

| 场景                       | 子应用页面状态     | 是否上报基座                |
| -------------------------- | ------------------ | --------------------------- |
| 初始化尚未完成             | `loading`          | 否                          |
| 有权限且路由挂载完成       | `ready`            | 可选，建议上报              |
| HTTP 403 / 当前公司无菜单  | `access-denied`    | 是                          |
| 初始化接口异常、配置不可用 | `unavailable`      | 是                          |
| HTTP 401                   | 原页面保持加载提示 | 上报既有 `action: 'logout'` |
| 正常接口返回空数组         | 业务空状态         | 否，不能误判为无权限        |

标准消息：

```ts
interface PortalPageStateMessage {
  source: 'mbase-subapp'
  type: 'page:state'
  protocol: 1
  status: 'ready' | 'access-denied' | 'unavailable'
  title?: string // 最长 100 字符
  message?: string // 最长 300 字符；只给用户可理解的说明
  code?: string // 最长 64 字符；稳定错误编号，不含敏感数据
}
```

推荐在子应用平台层集中封装一次：

```ts
type PortalPageState = Omit<
  PortalPageStateMessage,
  'source' | 'type' | 'protocol'
>

function resolvePortalOrigin(): string {
  try {
    return document.referrer
      ? new URL(document.referrer).origin
      : window.location.origin
  } catch {
    return window.location.origin
  }
}

export function reportPortalPageState(state: PortalPageState): void {
  const message: PortalPageStateMessage = {
    source: 'mbase-subapp',
    type: 'page:state',
    protocol: 1,
    ...state,
  }
  const params = new URLSearchParams(window.location.search)

  // App/PDA WebView
  if (params.get('mbase_host') === 'app') {
    ;(window as any).uni?.postMessage?.({ data: message })
    return
  }

  // 钉钉/普通 H5 iframe
  if (window.parent !== window) {
    window.parent.postMessage(message, resolvePortalOrigin())
    return
  }

  // 微信小程序 WebView。消息可能在返回/销毁等时机才送达，不能替代本地状态页。
  ;(window as any).wx?.miniProgram?.postMessage?.({ data: message })
}
```

入口初始化范式：

```ts
async function bootstrap() {
  renderLoadingPage()
  try {
    await syncLatestPortalToken() // 当前 URL Token 始终覆盖本地旧值
    await syncPortalCompany()
    await loadCurrentUser()
    const menus = await loadMenusAndPermissions()

    const firstRoute = resolveFirstAccessibleRoute(menus)
    if (!firstRoute) {
      renderAccessDeniedPage({
        message: '当前公司下未配置可访问菜单',
        onRetry: bootstrap,
        onBack: backToPortal,
      })
      reportPortalPageState({
        status: 'access-denied',
        title: '暂无访问权限',
        message: '当前公司下未配置可访问菜单，请联系业务管理员开通',
        code: 'NO_MENU',
      })
      return
    }

    await router.replace(firstRoute)
    renderApplication()
    reportPortalPageState({
      status: 'ready',
      title: String(router.currentRoute.value.meta.title || ''),
    })
  } catch (error: any) {
    const status = Number(error?.status || error?.code)
    if (status === 401) {
      reportPortalLogout() // 使用既有 action: 'logout' 协议
      return
    }
    if (status === 403) {
      renderAccessDeniedPage({ onRetry: bootstrap, onBack: backToPortal })
      reportPortalPageState({
        status: 'access-denied',
        title: '暂无访问权限',
        message: '当前账号暂无该应用或页面权限',
        code: 'HTTP_403',
      })
      return
    }

    renderUnavailablePage({ onRetry: bootstrap, onBack: backToPortal })
    reportPortalPageState({
      status: 'unavailable',
      title: '应用暂不可用',
      message: '应用初始化失败，请稍后重试',
      code: 'BOOTSTRAP_FAILED',
    })
  }
}
```

页面和上报约束：

- 必须先渲染子应用本地状态页，再上报基座；不能依赖 postMessage 替自己展示页面。
- 用户提示不得包含 Token、完整带参 URL、接口响应体、堆栈或个人敏感信息。
- `code` 使用稳定枚举供排障，例如 `NO_MENU`、`HTTP_403`、`BOOTSTRAP_FAILED`。
- 不要把权限接口超时误报成“无权限”，应进入 `unavailable` 并提供重试。
- “重新校验权限”必须重新拉取用户、公司、菜单和按钮权限，不能只刷新当前空白路由。
- 独立访问子应用时也必须显示自己的状态页；基座兜底只在门户宿主中生效。

分端最终效果：

| 宿主           | 子应用本地页面 | 基座收到上报后的增强                                        |
| -------------- | -------------- | ----------------------------------------------------------- |
| 钉钉/普通 H5   | 必须           | 覆盖为统一权限/不可用说明，可重新校验或返回工作台           |
| App/PDA        | 必须           | 原生容器显示统一说明，不再停留在无内容 WebView              |
| 微信小程序     | 必须           | 在消息实际送达时显示模态提示；原生 WebView 限制下不承诺即时 |
| 浏览器独立访问 | 必须           | 无基座增强，由子应用自己完整处理                            |

验收至少覆盖：有权限、无菜单、按钮无权限、HTTP 403、HTTP 401、接口超时、服务 500、公司切换后权限变化、独立访问及三个门户宿主。所有失败场景都应有可理解文案和可执行动作，不允许白屏、无限 loading 或跳转循环。

### 4.4 不需要改

- 子应用自己的普通业务接口 — 照常工作；涉及公司数据/权限的接口需接收并校验 `companyId`
- 子应用自己的 UI/样式 — iframe 完全隔离
- 子应用内部路由 — H5/钉钉照常工作；App/PDA 仅按上述协议上报标题和是否可返回，业务路由仍由子应用自己管理

---

## 五、桥接通信协议

子应用运行在 iframe 内，受安全策略限制无法直调钉钉 JSAPI。由基座统一调用 JSAPI，通过 `postMessage` 桥接回传结果。

### 推荐：使用跨端媒体 SDK

> Robot_H5 v1.7.1+ 的拍照、扫码、定位继续直接使用 `@robot-h5/core`；相册、无 ID 暂存、
> 断点续传等尚未封装成 Hook 的能力，可通过 `@robot-h5/core/bridge` 的
> `invokeMbaseCapability(api, payload)` 统一发送。页面交互和上传接口仍由业务实现。

需要“拍摄 / 从手机相册选择”的子应用统一接入基座媒体 SDK。子应用负责按钮、底部弹层、预览、删除和业务校验；基座负责识别运行环境并完成相机、相册和上传能力调用。

#### 接入约定

1. 新接入项目推荐在子应用 `index.html` 中加载基座脚本。生产部署与基座同源时固定使用 `/mbase/sdk/portal-media.js`。
2. 已经封装 `invokeBridge()` 的存量项目可以直接调用本文能力表，不要求重复加载 SDK；**SDK 和项目自有桥接封装二选一**，不要让一次点击同时走两套调用。
3. 使用 SDK 且需要 TypeScript 类型提示时，将基座的 `public/sdk/portal-media.d.ts` 复制到子应用 `src/types/portal-media.d.ts`，并确保该目录被 `tsconfig.json` 包含。
4. 跨端直传时，`url` 必须传各环境可直接访问的**完整 HTTPS 上传地址**，不要把 `/api/files/upload` 一类相对路径作为跨端契约。
5. 业务上传接口必须支持 `POST multipart/form-data`，图片字段统一接收 `file`；`formData` 中的字段按普通表单字段接收。
6. 上传接口应返回 HTTP 2xx。建议返回 JSON，SDK 会把解析后的响应放在 `results[n].data`。
7. 不要在 `header` 中手动设置 `Content-Type: multipart/form-data`，浏览器或钉钉客户端需要自动生成 multipart boundary。
8. `max` 有效范围为 1～9，省略时默认为 1。当前多图上传采用整体成功/失败语义，首批接入建议使用 `max: 1`；如允许多选，业务后端应具备幂等或去重能力。
9. 钉钉 iframe 模式下，SDK 会从 `document.referrer` 推导基座来源。子应用不要配置 `Referrer-Policy: no-referrer`；如企业安全策略必须隐藏 referrer，应先联系平台维护人员调整桥接方案。

加载 SDK：

```html
<script src="/mbase/sdk/portal-media.js"></script>
```

> SDK 加载路径分两种情况：
>
> - **生产部署（与基座同源）**：直接用同源绝对路径 `/mbase/sdk/portal-media.js`，无需额外配置。
> - **子应用独立本地开发**：把 `/mbase/sdk/` 代理到对应环境的基座，或临时使用该环境的完整 HTTPS 地址，例如 `https://ytiop-sit.walsin.com.cn/mbase/sdk/portal-media.js`。

#### 最小调用

```ts
// 替换为子应用已有的登录态读取方法
const getAccessToken = () => sessionStorage.getItem('access_token') || ''
// 在子应用各环境文件中配置完整 HTTPS 地址
const mediaUploadUrl = import.meta.env.VITE_MEDIA_UPLOAD_URL
const token = getAccessToken()

// 拍摄一张，只选择、不上传
const result = await window.WLPortalMedia.chooseImage({
  source: 'camera',
  max: 1,
})

// 从相册选择一张并直接上传业务后端（推荐）
const uploaded = await window.WLPortalMedia.chooseImageAndUpload({
  source: 'album',
  max: 1,
  url: mediaUploadUrl, // 例如：https://业务域名/api/files/upload
  formData: { businessType: 'inspection' },
  header: token ? { Authorization: `Bearer ${token}` } : {},
})

console.log(uploaded.results)
```

#### 钉钉新增页无业务 ID

普通 `chooseImageAndUpload` 适用于已经取得 `businessId/relativeId` 的页面。如果业务允许用户在首次保存前拍照或选相册，应使用临时图片生命周期，不要伪造业务 ID，也不要尝试 `fetch` 钉钉虚拟路径：

```text
选择图片
  → chooseImagePersist(source)
  → 子应用只保存 pendingId 并显示占位缩略图
  → 保存业务主表取得真实 ID
  → uploadPendingPhotos(pendingIds + 真实 ID)
  → 成功后刷新正式附件列表
```

SDK 示例：

```ts
// 1. 新增页：拍照传 camera，相册传 album
const selected = await window.WLPortalMedia.chooseImagePersist({
  source: 'album',
  max: 1,
})
let pendingIds = selected.items.map(item => item.pendingId)

// 2. 用户删除某个临时项时主动释放，并从本地列表移除
async function removePending(pendingId: string) {
  await window.WLPortalMedia.releasePendingPhotos([pendingId])
  pendingIds = pendingIds.filter(id => id !== pendingId)
}

// 3. 主表保存成功并取得真实 ID 后上传剩余临时图片
async function uploadAfterSave(savedBusinessId: string) {
  if (!pendingIds.length) return []
  const result = await window.WLPortalMedia.uploadPendingPhotos({
    pendingIds,
    url: mediaUploadUrl,
    formData: {
      relativeType: 'inspection',
      relativeId: savedBusinessId,
    },
    header: token ? { Authorization: `Bearer ${token}` } : {},
  })
  return result.results
}
```

临时能力只适用于**钉钉 iframe**。普通 H5、微信 WebView 和 App WebView 已经能得到 `File`，新增页应由子应用在当前页面内暂存 `File`，保存后再上传。钉钉临时项还有以下边界：

- 基座只保存钉钉虚拟路径的内存引用，不保存图片字节和 Token，不会写入磁盘。
- 临时项按 `appId + origin + iframe 窗口` 隔离，子应用之间不能互相预览或上传。
- 默认有效期 30 分钟，单个页面最多暂存 20 张；刷新、重新进入或超时后应提示用户重新选择。
- `previewDataUri` 是可选兼容字段，当前可能不返回；子应用必须准备占位图，点击后调用 `previewPendingPhoto(pendingId)` 原生预览。
- 上传成功后基座短期保留结果用于幂等重试；多图部分失败时可使用原 `pendingIds` 重试，已成功项不会再次上传。
- 删除、取消表单时调用 `releasePendingPhotos`；上传过程中钉钉原生请求不能中止，业务后端仍需做附件幂等或去重。
- 历史接口 `takePhotoPersist({ max })` 继续可用，等价于 `chooseImagePersist({ source: 'camera', max })`；新代码统一使用 `chooseImagePersist`。

如果业务明确规定“没有 ID 时不允许选择附件”，可以继续采用“先保存草稿，再开放拍照/相册”的方式；临时能力不是每个页面必须接入，但基座契约已完整提供。

#### 完整 Vue 3 子应用示例

下面的组件演示业务页面自行提供“拍摄 / 从手机相册选择”交互，并统一把图片上传到业务后端。示例不依赖基座 UI 组件，可直接改造成现有上传组件的事件处理函数。

```vue
<template>
  <section class="image-upload">
    <button
      :disabled="uploading"
      @click="selectAndUpload('camera')"
    >
      拍摄
    </button>
    <button
      :disabled="uploading"
      @click="selectAndUpload('album')"
    >
      从手机相册选择
    </button>

    <p v-if="uploading">图片上传中...</p>
    <!-- prettier-ignore -->
    <p v-if="errorMessage" role="alert">{{ errorMessage }}</p>
    <p v-if="serverResults.length">
      已上传 {{ serverResults.length }} 张图片
    </p>
  </section>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  type ImageSource = 'camera' | 'album'

  const uploading = ref(false)
  const errorMessage = ref('')
  const serverResults = ref<unknown[]>([])
  // 在子应用各环境文件中配置完整 HTTPS 地址。
  const mediaUploadUrl = import.meta.env.VITE_MEDIA_UPLOAD_URL

  /** 替换为子应用既有登录态读取方式。 */
  function getBusinessToken(): string {
    return sessionStorage.getItem('access_token') || ''
  }

  async function selectAndUpload(source: ImageSource) {
    if (!window.WLPortalMedia) {
      errorMessage.value = '媒体 SDK 未加载，请检查 /mbase/sdk/portal-media.js'
      return
    }

    uploading.value = true
    errorMessage.value = ''
    try {
      const token = getBusinessToken()
      const result = await window.WLPortalMedia.chooseImageAndUpload({
        source,
        max: 1,
        url: mediaUploadUrl,
        formData: {
          businessType: 'inspection',
          businessId: 'replace-with-real-id',
        },
        header: token ? { Authorization: `Bearer ${token}` } : {},
      })

      serverResults.value = result.results
      // 示例：表单真正提交时保存服务端返回的 fileId，而不是本地 path。
    } catch (cause) {
      const error = cause as Error & { code?: string }
      if (error.code === 'cancelled') return
      errorMessage.value = error.message || '图片处理失败，请重试'
    } finally {
      uploading.value = false
    }
  }
</script>
```

如果业务只需要选择后预览、不立即上传：

```ts
const selected = await window.WLPortalMedia.chooseImage({
  source: 'album',
  max: 3,
})

if (selected.mode === 'local') {
  // 普通 H5 / 微信 WebView / App WebView：File[] 可用于本页面预览。
  const previewUrls = selected.files.map(file => URL.createObjectURL(file))
  // 预览结束后执行 URL.revokeObjectURL(url) 释放内存。
} else {
  // 钉钉 iframe：path 是钉钉本地虚拟路径，不要使用 fetch 读取。
  const dingTalkPaths = selected.files.map(file => file.path)
}
```

#### 运行策略与返回结构

| 环境               | 执行方式                    | `chooseImage` 返回            |
| ------------------ | --------------------------- | ----------------------------- |
| 钉钉 iframe        | 自动调用下文 `mbase-bridge` | 钉钉本地虚拟文件信息          |
| 微信小程序 WebView | 子应用页面内标准文件选择器  | 当前页面可直接使用的 `File[]` |
| 普通浏览器 H5      | 子应用页面内标准文件选择器  | 当前页面可直接使用的 `File[]` |
| App WebView        | 子应用页面内标准文件选择器  | 当前页面可直接使用的 `File[]` |

媒体 API 的用途：

| API                     | 推荐场景                       | 关键返回值                                   |
| ----------------------- | ------------------------------ | -------------------------------------------- |
| `chooseImage`           | 已有 ID 前的本地预览或能力探测 | `mode/source/files`                          |
| `chooseImageAndUpload`  | 已有业务 ID，选择后立即持久化  | `mode/source/uploaded/results`               |
| `chooseImagePersist`    | 钉钉无业务 ID，短期暂存        | `mode/source/items[{ pendingId }]`           |
| `uploadPendingPhotos`   | 取得业务 ID 后上传临时项       | `mode/uploaded/results`                      |
| `previewPendingPhoto`   | 钉钉原生预览临时项             | `mode/previewed`                             |
| `releasePendingPhotos`  | 删除或取消临时项               | `mode/releasedIds/missingIds`                |
| `results[n].data`       | 读取业务服务端响应             | JSON 响应会被解析；非 JSON 响应保留为字符串  |
| `results[n].statusCode` | 判断单个文件上传状态           | HTTP 状态码                                  |
| `results[n].rawData`    | 排查原始响应                   | 原始响应文本，不建议直接作为业务数据长期保存 |

本地选择结果带 `mode: 'local'`，钉钉桥结果带 `mode: 'bridge'`。已有业务 ID 时使用 `chooseImageAndUpload`；钉钉新增页没有 ID 且确需先选图时使用 `chooseImagePersist → uploadPendingPhotos`。任何场景都不要在子应用 iframe 中 `fetch` 钉钉虚拟路径。

> **上传地址 `url` 的跨端约定（重要）**
>
> `chooseImageAndUpload` 在不同容器中的上传执行方不同：
>
> - **钉钉 iframe**：由基座调用钉钉原生上传能力；相对路径会基于基座 API 配置解析。
> - **普通 H5 / 微信小程序 WebView / App WebView**：由子应用页面调用浏览器 `fetch`；相对路径会基于子应用当前页面地址解析。
>
> 两端解析基准并不相同，因此当前集成契约要求子应用通过环境变量传入**完整 HTTPS 地址**，例如 `VITE_MEDIA_UPLOAD_URL=https://业务域名/api/files/upload`。不要依赖 `/api/files/upload` 等相对路径，也不要在业务代码里硬编码 SIT/UAT/PRD 域名。
>
> 完整地址还需满足以下条件：
>
> - 普通 H5、微信 WebView 或 App WebView 跨域上传时，业务后端必须允许子应用页面来源的 CORS 预检和请求头。
> - 钉钉原生上传使用的域名必须具备有效 HTTPS 证书，并按企业钉钉应用的实际管控要求加入安全域名或相关白名单。
> - 上传鉴权、文件大小、类型、扩展名和数据权限均由业务后端校验；前端校验只能改善体验，不能代替服务端校验。

#### 错误处理

| `error.code`          | 含义                                | 子应用处理建议                         |
| --------------------- | ----------------------------------- | -------------------------------------- |
| `cancelled`           | SDK 已识别到用户主动取消            | 静默结束，不提示“系统异常”             |
| `invalid_source`      | `source` 不是规定值                 | 修正调用参数                           |
| `invalid_url`         | 上传地址为空                        | 修正业务配置                           |
| `invalid_pending_id*` | 临时 ID 为空或数组非法              | 修正调用参数，不要传空值或重复值       |
| `pending_not_found`   | 临时项已过期、已释放或不属于本页    | 清理占位项并提示用户重新选择           |
| `pending_*_limit`     | 当前页面或基座临时项达到数量上限    | 先保存、上传或删除不需要的临时项       |
| `unsupported`         | 当前页面环境不支持文件选择          | 提示用户更换支持的客户端               |
| `unsupported_pending` | 在非钉钉 iframe 调用了临时能力      | 其它容器在子应用内暂存 `File`          |
| `bridge_timeout`      | 钉钉能力桥超时                      | 允许使用同一 `pendingIds` 重试         |
| `invoke_failed`       | 钉钉 JSAPI 或原生上传失败           | 展示可读错误，结合 `debugInfo` 排查    |
| `upload_failed`       | 普通 H5 等本地模式上传不是 HTTP 2xx | 展示上传失败，检查接口、鉴权和文件限制 |

> 普通 H5 等本地模式在浏览器触发文件选择器的 `change/cancel` 事件时会返回 `cancelled`；较老的内嵌 WebView 仍需真机验证取消回调。钉钉客户端的取消返回格式也可能随版本和平台不同，无法识别为取消时可能归入 `invoke_failed`。业务只能对明确的 `cancelled` 静默处理，不要把所有 `invoke_failed` 都当作用户取消。

兼容边界：

- SDK 不生成底部弹层、预览卡片或删除按钮，不污染子应用页面。
- 只有子应用主动加载并调用 SDK 时才运行，不修改已有上传组件。
- `source` 必须明确传 `camera` 或 `album`，不会默认弹出系统二选一。
- 钉钉会严格按 `source` 调用相机或相册；普通 H5、微信 WebView 和 App WebView 最终由浏览器及操作系统解释 `capture` 属性，具体系统界面可能不同。
- 钉钉端上传字段固定为 `file`；为保证跨端一致，不建议子应用修改 `fileName`。
- `header` 可传 `Authorization` 等业务请求头，但不要手动传 multipart `Content-Type`。
- 多图使用并行上传；任意一张失败时本次调用会整体抛错，已经被服务端接收的图片不会由 SDK 自动回滚。
- 图片类型、扩展名、大小、病毒扫描和业务权限必须由服务端再次校验，不能信任客户端参数。
- 原有 `takePhoto/takePhotoAndUpload` 继续可用且始终只拍照。

#### 存量上传组件接入注意事项

已有上传组件不需要为了接入相册能力重写原拍照流程。接入时只增加新的交互入口和能力调用，并遵守以下通用规则：

1. **接入方式二选一**：新项目推荐使用 `WLPortalMedia`；已有安全 `postMessage/invokeBridge` 封装的项目可直接调用同名能力。一次用户操作不能同时调用两套封装。
2. **必须明确图片来源**：`chooseImage`、`chooseImageAndUpload` 和 `chooseImagePersist` 都必须传 `source: 'camera' | 'album'`。相册按钮固定传 `album`，拍摄按钮固定传 `camera`。
3. **不要自行判断钉钉平台差异**：已有业务 ID 时，Android 和 iOS 统一调用 `chooseImageAndUpload`；基座内部负责选择正确的钉钉 `uploadFile` 实现。
4. **先判断是否已有业务 ID**：
   - 已有 ID：使用 `chooseImageAndUpload` 直接上传并刷新正式附件列表。
   - 无 ID 且业务允许先选附件：使用 `chooseImagePersist` 保存 `pendingId`，取得真实 ID 后调用 `uploadPendingPhotos`。
   - 无 ID 且业务不允许先选附件：先保存草稿，再开放拍照或相册入口。
5. **临时项不能当普通文件处理**：`pendingId` 不是文件路径，不能放入 `FormData`，也不能执行 `fetch`、`URL.createObjectURL` 或本地文件转换。
6. **临时预览必须有兜底**：`previewDataUri` 是可选字段。没有缩略图时展示业务占位图，点击后调用 `previewPendingPhoto`。
7. **删除和取消要释放**：用户删除临时项或取消整个表单时调用 `releasePendingPhotos`，同时从页面状态中移除对应 `pendingId`。
8. **错误处理使用标准错误码**：`cancelled` 静默结束；`pending_not_found` 清理过期占位并提示重新选择；其它错误展示可读信息并保留重试入口。
9. **并发状态必须复位**：拍照和相册可以共用一个互斥状态，但必须在 `finally` 中恢复，避免取消或失败后按钮永久不可用。
10. **上传结果统一回显**：上传成功后以业务附件查询接口为准刷新列表，不要同时把本地临时项和服务端正式附件重复加入页面。

常见接入问题：

| 问题                                 | 原因                                           | 处理方式                                               |
| ------------------------------------ | ---------------------------------------------- | ------------------------------------------------------ |
| 返回 `source 必须为 camera 或 album` | 调用 `chooseImage*` 时漏传 `source`            | 根据用户点击入口显式传 `camera` 或 `album`             |
| 返回 `unknown_api`                   | 基座版本过旧，或能力名称拼写错误               | 确认已部署包含该能力的基座版本，并核对能力表           |
| 返回 `pending_not_found`             | 临时项过期、已释放、页面已重建或跨页面使用     | 清理页面占位并提示重新选择，不复用旧 `pendingId`       |
| 相册上传后出现两条附件               | 原生直传成功后又进入了普通文件上传流程         | 直传成功只刷新服务端列表，不再调用本地文件上传         |
| iOS 与 Android 可选数量不同          | 业务代码在不同平台写死了不同 `max`             | 统一按剩余可上传数量传参，由基座处理平台差异           |
| 用户取消后仍提示“上传失败”           | 未识别 `cancelled`，或把所有异常统一显示       | 对 `cancelled` 静默处理，其它错误正常提示              |
| 无 ID 时上传接口缺少关联对象         | 选择后直接调用了正式上传接口                   | 改用临时生命周期，或先保存草稿取得真实业务 ID          |
| 页面刷新后临时图片无法继续使用       | 临时项只保存于当前基座运行实例，不能长期持久化 | 提示重新选择；需要跨刷新持久化时应另用业务草稿附件方案 |

#### 子应用验收清单

| 场景               | 验收要点                                                                |
| ------------------ | ----------------------------------------------------------------------- |
| 配置检查           | 各环境使用完整 HTTPS 上传地址；没有硬编码其他环境域名；相对路径不得上线 |
| 钉钉 Android 拍摄  | 只打开相机；上传成功；服务端收到 `file` 和业务表单字段                  |
| 钉钉 Android 相册  | 只打开相册；取消不产生附件记录；上传成功                                |
| 钉钉 iOS 拍摄/相册 | 两种来源分别可用；原生上传成功；服务端正确解析 multipart                |
| 微信小程序 WebView | 选择器可打开；取消和选中行为正常；选中后上传成功                        |
| 普通浏览器 H5      | 本地选择、预览和上传正常；跨域时 CORS 预检通过                          |
| 异常与安全         | 401、超限和非图片有明确提示；服务端拒绝非法文件；日志不输出完整 Token   |
| 多图（如启用）     | 部分上传失败时可安全重试，不产生重复附件；服务端具备幂等或去重能力      |
| 旧能力回归         | 未接入 SDK 的页面不受影响；`takePhoto/takePhotoAndUpload` 仍只拍照      |

钉钉侧必须分别使用 Android 和 iOS 真机验收，不能只用桌面浏览器或钉钉开发者工具代替。建议将钉钉 7.0.10 及以上作为原生 `uploadFile` 的验收基线（参见[钉钉官方 JSAPI Explorer](https://open.dingtalk.com/tools/explorer/jsapi?id=10281)）；若项目需要支持更低版本，应先完成对应版本真机测试，再确定兼容范围。

### 可选图片水印（拍照与相册）

正式业务水印采用服务端权威处理。子应用只维护开关并把标准策略加入现有 `formData`；基座继续沿用原拍照、相册、原生直传和无 ID 延迟上传链路，不读取或修改钉钉虚拟路径。

适用范围：

- 相机新拍照片。
- 从手机相册选择的历史照片。
- 系统中已经保存的原图（使用服务端独立衍生接口）。

无污染约定：

1. 未传策略或关闭水印时，不发送 `watermarkPolicy`，原上传请求与行为保持不变。
2. 开启时，`watermarkPolicy` 必须是 JSON **字符串**，不能直接传对象；钉钉和 App 原生上传会把普通表单值转换成字符串。
3. `required=true` 时服务端水印失败必须让上传失败，不能静默返回原图。
4. 服务端保存不可变原图并生成水印衍生图；所有重试都从原图处理，禁止双重水印。
5. 登录人、公司和上传时间由服务端生成。相册历史照片使用“上传时间/上传位置”，不得伪装成可信拍摄信息。

Robot_H5/Core 子应用推荐代码：

```ts
import { buildWatermarkFormData } from '@robot-h5/core'

type ImageSource = 'camera' | 'album'

async function selectAndUpload(source: ImageSource) {
  const formData = buildWatermarkFormData(
    { businessType: 'inspection', businessId },
    watermarkEnabled.value
      ? {
          enabled: true,
          required: true,
          templateId: 'inspection-photo-v1',
          source,
          clientCapturedAt: new Date(),
          location: currentLocation.value,
          context: { businessName: '气体检测' },
        }
      : { enabled: false }
  )

  return window.WLPortalMedia.chooseImageAndUpload({
    source,
    max: 1,
    url: import.meta.env.VITE_MEDIA_UPLOAD_URL,
    formData,
    header: getUploadHeaders(),
  })
}
```

未使用 Core 的存量子应用可以按同一协议手工设置：

```ts
const formData: Record<string, unknown> = { businessType, businessId }
if (watermarkEnabled) {
  formData.watermarkPolicy = JSON.stringify({
    enabled: true,
    required: true,
    templateId: 'inspection-photo-v1',
    source,
    clientCapturedAt: new Date().toISOString(),
    context: { businessName: '气体检测' },
  })
}
```

无业务 ID 时仍先调用 `chooseImagePersist`，取得真实 ID 后在 `uploadPendingPhotos.formData` 中加入同一策略。以实际上传时的开关为准，不把策略写入 `pendingId`。

客户端 `useWatermark` 只适用于已经取得真实 `File` 的本地预览或纯 H5 客户端处理。钉钉 `chooseImage/chooseImagePersist` 返回虚拟路径，禁止使用 `fetch` 或 Canvas 读取；跨端最终结果始终以服务端返回的水印附件为准。

服务端 multipart 字段、Spring Boot DTO/Controller/Service 参考、模板可信数据、系统既有图片衍生、幂等、错误码和验收矩阵见[图片水印能力与服务端接入](./watermark)。

水印专项验收至少包括：

| 场景         | 验收要点                                          |
| ------------ | ------------------------------------------------- |
| 水印关闭     | 后端收不到 `watermarkPolicy`；旧拍照/相册响应不变 |
| 拍照开启     | 钉钉 Android/iOS、App/PDA、H5 均返回服务端水印图  |
| 相册开启     | 历史照片可用；显示“上传”信息而非伪造拍摄信息      |
| 必须水印失败 | 页面阻止提交、展示明确错误并保留重试入口          |
| 重复上传     | 只生成一份衍生图，不出现双重水印或重复附件        |
| 系统历史图   | 服务端鉴权后生成衍生图，原图和历史记录保持不变    |

### 断点续传（断网排队）

断点续传是独立的可选链路，适合 PDA 现场大文件、弱网和频繁断网场景。它不会接管上面的媒体 SDK：

- 小图片、网络稳定：继续使用 `WLPortalMedia.chooseImageAndUpload`。
- 需要断网排队、恢复后从已确认偏移继续：显式使用续传能力。
- 没有接入续传的页面、`takePhoto*` 和 `chooseImage*` 行为完全不变。

#### 接入路径选择

| 子应用运行容器 | 接入方式                                     | 文件持久化位置               | 是否调用基座桥 |
| -------------- | -------------------------------------------- | ---------------------------- | -------------- |
| App WebView    | `resumable*` v1 原生桥能力                   | App 私有目录                 | 是             |
| 钉钉微应用     | `/mbase/sdk/portal-resumable-upload.js`      | 当前子应用 WebView IndexedDB | 否             |
| 普通 H5        | `/mbase/sdk/portal-resumable-upload.js`      | 当前站点 IndexedDB           | 否             |
| 微信小程序     | 本期不开放续传能力，继续使用现有普通上传链路 | —                            | —              |

子应用只接入与当前容器对应的一条链路，不要在 App 中同时启动 H5 SDK 和 App 桥任务。开始开发前必须先确认：

1. 业务后端已实现本节约定的四类续传接口，并在当前环境可访问。
2. `VITE_RESUMABLE_UPLOAD_ENDPOINT` 是当前环境的完整 HTTPS 地址，不得写死 SIT/UAT 地址。
3. App 上传地址与注册子应用同源；钉钉/H5 跨域时后端已放行 CORS 请求头和 `PUT`。
4. 业务明确 `metadata.businessType/businessId` 以及完成后要保存的正式附件 ID 字段。
5. 页面登录态恢复后才能启动历史任务，任何 Token 都不得持久化进任务数据。

#### 钉钉 / 普通 H5

钉钉官方 `uploadFile` 是整文件上传，不提供分片偏移。真续传使用独立 SDK 的标准 `File/Blob`，文件保存在子应用 WebView 的 IndexedDB：

```html
<script src="/mbase/sdk/portal-resumable-upload.js"></script>
```

```ts
const getToken = () => sessionStorage.getItem('access_token') || ''
// 按子应用实际登录 Store 调整，必须返回稳定工号/用户 ID。
const getUserKey = () => sessionStorage.getItem('user_no') || ''

// 每次业务登录态恢复后配置稳定用户标识和最新 Token；二者均不会写入其它账号任务。
window.WLPortalResumableUpload.configure({
  getUserKey,
  getHeaders: () => {
    const token = getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  },
  onEvent: job => {
    console.log(job.status, job.progress)
  },
})

// 页面重新进入时恢复历史任务；SDK 会先查询服务端权威偏移。
await window.WLPortalResumableUpload.resumeAll()

const { jobs } = await window.WLPortalResumableUpload.chooseAndUpload({
  source: 'album',
  max: 1,
  endpoint: import.meta.env.VITE_RESUMABLE_UPLOAD_ENDPOINT,
  chunkSize: 2 * 1024 * 1024,
  metadata: {
    businessType: 'inspection',
    businessId: formId,
  },
  header: {
    Authorization: `Bearer ${getToken()}`,
  },
})

const [job] = jobs
if (job.status === 'completed') {
  // 只保存 complete 接口返回的正式附件对象或附件 ID。
  await saveBusinessAttachment(job.result)
}
```

查询、暂停、恢复和取消任务：

```ts
const currentJobs = await window.WLPortalResumableUpload.list()
const current = currentJobs.find(item => item.id === uploadJobId)
if (current) {
  console.log(current.status, current.progress, current.lastError)
}

// 分别绑定到子应用自己的“暂停 / 继续 / 取消”按钮，不要初始化时连续调用。
const pauseUpload = (jobId: string) =>
  window.WLPortalResumableUpload.pause(jobId)
const resumeUpload = (jobId: string) =>
  window.WLPortalResumableUpload.resume(jobId, {
    header: { Authorization: `Bearer ${getToken()}` },
  })
const cancelUpload = (jobId: string) =>
  window.WLPortalResumableUpload.cancel(jobId)
```

页面刷新或重新登录后，必须重新执行 `configure({ getUserKey, getHeaders })`，再调用 `resumeAll()`。SDK 只列出和恢复当前 `userKey` 的任务；退出登录前可主动调用 `suspendCurrentUser()`，收到基座 `portal-logout` 通知时 SDK 也会自动暂停当前账号任务并清除内存鉴权。`chooseAndUpload/enqueue/resume` 可能正常返回 `offline / waiting_auth / failed` 状态，业务应读取 `job.status` 和 `job.lastError`，不能只依赖 Promise 是否抛错。

`userKey` 必须采用稳定且唯一的系统用户 ID、工号或账号，禁止使用昵称、手机号掩码、临时 token 或固定常量。SDK 可从标准 `portal_token` 自动识别常见用户字段，但业务仍应显式提供 `getUserKey`，避免非标准 token 导致历史任务无法恢复。旧版未绑定用户的任务会被安全隔离，不会自动归属给当前账号。

TypeScript 子应用将 `wl-mbase/public/sdk/portal-resumable-upload.d.ts` 复制到自己的 `src/types/portal-resumable-upload.d.ts`，并确保 `tsconfig` 会包含 `src/types`。页面按钮、底部操作菜单、进度条和取消确认仍由子应用实现。

#### App

App 使用基座原生桥，文件会复制到 App 私有目录，任务按 `userKey + appId + origin` 隔离。账号退出时任务转为 `waiting_auth` 并移除运行时请求头，不删除文件；只有同一账号重新登录并由原子应用恢复后才能继续：

Robot_H5 `v1.7.1+` 直接使用 `@robot-h5/core/bridge` 的 `invokeMbaseCapability`，无需复制下面的最小桥封装。其他技术栈可按下面的 v1 协议实现；App/PDA 仍需由业务域名提供官方 `uni.webview.1.5.8.js`，但应按宿主动态加载，不得让普通 H5 静态执行。详见[App 集成与发布](./app-integration#_2-3-底层桥接协议)。

```ts
type AppBridgeResult<T> = {
  source: 'mbase-bridge'
  type: 'capability:result'
  id: string
  ok: boolean
  data?: T
  error?: string
  reason?: string
}

type ResumableJob = {
  id: string
  status:
    | 'queued'
    | 'offline'
    | 'uploading'
    | 'paused'
    | 'waiting_auth'
    | 'failed'
    | 'completed'
  progress: number
  uploadedBytes: number
  fileSize: number
  chunkSize: number
  uploadId?: string
  lastError?: string
  result?: unknown
}

function callAppBridge<T>(
  api: string,
  payload: Record<string, unknown> = {},
  timeout = 120_000
): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = `upload_${Date.now()}_${Math.random().toString(36).slice(2)}`
    let timer: ReturnType<typeof setTimeout>

    const cleanup = () => {
      clearTimeout(timer)
      window.removeEventListener('mbase:bridge-result', onResult)
    }
    const onResult = (event: Event) => {
      const result = (event as CustomEvent<AppBridgeResult<T>>).detail
      if (!result || result.id !== id) return
      cleanup()
      if (result.ok) resolve(result.data as T)
      else {
        const error = new Error(result.reason || '基座能力调用失败')
        Object.assign(error, { code: result.error || 'invoke_failed' })
        reject(error)
      }
    }

    const appUni = (window as any).uni
    if (!appUni?.postMessage) {
      reject(new Error('当前页面未建立 App 基座通信通道'))
      return
    }

    window.addEventListener('mbase:bridge-result', onResult)
    timer = setTimeout(() => {
      cleanup()
      reject(new Error(`基座能力调用超时：${api}`))
    }, timeout)
    appUni.postMessage({
      data: {
        source: 'mbase-bridge',
        type: 'capability:invoke',
        id,
        api,
        payload,
        protocol: 1,
        host: 'app',
      },
    })
  })
}
```

业务调用：

```ts
const result = await callAppBridge<{ jobs: ResumableJob[] }>(
  'resumableChooseAndUpload',
  {
    source: 'album',
    max: 1,
    endpoint: import.meta.env.VITE_RESUMABLE_UPLOAD_ENDPOINT,
    metadata: { businessType: 'inspection', businessId: formId },
    header: { Authorization: `Bearer ${getToken()}` },
  }
)

const { jobs } = await callAppBridge<{ jobs: ResumableJob[] }>('resumableList')
const [job] = jobs
if (job) {
  console.log(job.status, job.progress, job.lastError)
}

// 分别绑定到子应用自己的“暂停 / 继续 / 取消”按钮。
const pauseUpload = (jobId: string) =>
  callAppBridge('resumablePause', { jobId })
const resumeUpload = (jobId: string) =>
  callAppBridge('resumableResume', {
    jobId,
    header: { Authorization: `Bearer ${getToken()}` },
  })
// 仅在用户明确确认后调用；取消会同时清理 App 私有文件。
const cancelUpload = (jobId: string) =>
  callAppBridge('resumableCancel', { jobId })
```

`resumableChooseAndUpload` 在文件成功进入 App 私有队列后即返回，不等待大文件全部上传，避免 WebView 桥超时。子应用应使用 `resumableList` 轮询或在 `mbase:bridge-result` 返回后刷新任务列表，直到 `completed` 再保存 `result`。

App 续传相关能力：

| API                        | 用途                       |
| -------------------------- | -------------------------- |
| `resumableChooseAndUpload` | 选择文件、持久化并开始上传 |
| `resumableList`            | 查询当前子应用任务         |
| `resumableResume`          | 继续一个或全部任务         |
| `resumablePause`           | 暂停任务                   |
| `resumableCancel`          | 取消并清理本地文件         |

#### 必须先具备的后端能力

续传不是前端单方面能力。假设环境变量为：

```text
VITE_RESUMABLE_UPLOAD_ENDPOINT=https://业务域名/api/resumable-upload
```

业务后端至少实现：

| 方法   | 路径                                       | 作用                                                  |
| ------ | ------------------------------------------ | ----------------------------------------------------- |
| `POST` | `/sessions`                                | 幂等创建会话，返回 `uploadId/chunkSize/uploadedBytes` |
| `GET`  | `/sessions/{uploadId}`                     | 返回服务端权威 `uploadedBytes/status/result`          |
| `PUT`  | `/sessions/{uploadId}/chunks/{chunkIndex}` | 按 `Content-Range` 幂等接收原始二进制分片             |
| `POST` | `/sessions/{uploadId}/complete`            | 幂等合并并返回正式附件对象                            |

服务端必须把 `clientRequestId` 和 `Idempotency-Key` 作为幂等依据；重复初始化、重复分片和重复完成不能生成重复附件。完整请求响应字段见[移动端断点续传能力设计与接入](./chunk-upload#三、服务端协议-必须实现)。

#### 状态处理与业务落库

两端返回的任务核心字段一致：`id` 是客户端任务 ID，`uploadId` 是服务端会话 ID，`uploadedBytes/fileSize/progress` 用于进度展示，`lastError` 用于排查，只有 `completed.result` 才是业务附件结果。

| 状态           | 页面表现         | 子应用处理                                        |
| -------------- | ---------------- | ------------------------------------------------- |
| `queued`       | 等待上传         | 保留任务，不重复选择文件                          |
| `offline`      | 等待网络恢复     | 可提示用户，网络恢复后自动或手动继续              |
| `uploading`    | 显示 `progress`  | 允许查询、暂停；不要关闭业务表单上下文            |
| `paused`       | 已暂停           | 用户确认后调用 `resume/resumableResume`           |
| `waiting_auth` | 登录态待刷新     | 获取新 Token，并携带新 `header` 恢复              |
| `failed`       | 显示 `lastError` | 按排障表修复后继续；不可恢复时取消并重新选择      |
| `completed`    | 上传完成         | 保存 `result` 中的正式附件 ID，并允许提交业务表单 |

业务数据库只能保存 `complete` 返回的正式附件 ID/对象，不能保存任务 ID、App 临时路径、Blob 或钉钉虚拟路径。

#### 子应用验证步骤

1. **在线基线**：选择一个至少跨 3 个分片的文件，确认状态到 `completed`，业务表单保存的是 `result` 中附件 ID。
2. **断网续传**：至少成功一个分片后关闭网络，确认变为 `offline`；恢复网络后先出现会话查询，且服务端已确认分片没有重复写入。
3. **页面或 App 重启**：上传中刷新钉钉/H5 页面或杀掉 App；重新登录后注入新 Token，调用 `resumeAll/resumableResume` 并继续。
4. **鉴权恢复**：让服务端返回 401/403，确认任务进入 `waiting_auth`，刷新 Token 后从原偏移继续。
5. **偏移冲突**：人工返回一次 409，确认客户端重新查询 `uploadedBytes`；若连续返回相同冲突，任务应进入 `failed`，不能无限请求。
6. **会话过期**：人工返回 404，确认客户端使用原 `clientRequestId` 重建会话且最终只有一个附件。
7. **暂停与取消**：暂停后偏移不再增长；取消后任务消失，App 私有文件或 IndexedDB Blob 被清理。
8. **旧链路回归**：未调用续传的页面继续验证拍照、相册和普通 `chooseImageAndUpload`，接口与交互不得变化。
9. **隔离检查**：App 中不同 `appId/origin` 不能查询、恢复或取消彼此任务；微信包中不得出现续传 SDK。

平台仓库自动验证命令：

```bash
pnpm test:resumable
pnpm exec tsc --noEmit
pnpm build:h5
pnpm build:wx -- --env sit
pnpm package:app -- --env sit
pnpm check:platform-isolation
```

#### 常见问题与排查

| 现象/状态                                | 优先检查                                                                              |
| ---------------------------------------- | ------------------------------------------------------------------------------------- |
| `WLPortalResumableUpload` 为 `undefined` | H5 构建产物是否存在 `/mbase/sdk/portal-resumable-upload.js`、部署 base 路径和缓存     |
| `invalid_endpoint`                       | 是否为完整 HTTPS 地址、环境变量是否加载、末尾路径是否为续传服务根路径                 |
| `unsupported`                            | 当前 WebView 是否支持标准文件选择；App 场景是否误用了 H5 SDK                          |
| `persist_failed`                         | IndexedDB 是否被禁用、站点存储空间是否不足、浏览器隐私策略是否清理数据                |
| `file_unavailable`                       | WebView 缓存/站点数据是否被清理；取消旧任务后需要用户重新选择文件                     |
| 长时间 `offline`                         | 设备系统网络是否恢复、WebView 是否收到 `online` 事件；可手动调用 `resume`             |
| `waiting_auth`                           | 是否先 `configure({ getHeaders })`，新 Token 是否实际写入 `Authorization`             |
| 401/403                                  | Token、用户业务权限、会话归属；日志不得打印完整 Token                                 |
| 浏览器 CORS/预检失败                     | 服务端是否允许 `PUT`、鉴权头、`Content-Range`、`X-Upload-*`、`Idempotency-Key`        |
| 404                                      | 服务端会话 TTL 是否过短、幂等重建是否按 `clientRequestId` 返回同一业务结果            |
| 持续 409                                 | 比较客户端 `X-Upload-Offset` 与查询接口 `uploadedBytes`；检查并发写入和服务端偏移计算 |
| App 返回 `capability_denied`             | 子应用是否注册了续传能力白名单、`appId` 和当前 WebView URL 是否匹配                   |
| App 返回 `invalid_url`                   | `endpoint` 是否与注册子应用同源；不要直接换成未经审核的文件域名                       |
| `completed` 但业务表单没有附件           | 是否漏存 `job.result`，以及完成接口返回字段是否符合业务附件契约                       |

提交问题给平台组时至少提供：运行容器与客户端版本、环境、子应用 `appId`、任务 ID、`uploadId`、状态、`uploadedBytes/fileSize/chunkSize`、最后错误、相关接口 HTTP 状态和发生时间。**不得提供完整 Token、文件内容或用户敏感数据。**

专项协议、安全要求、监控指标和完整真机矩阵继续参见[移动端断点续传能力设计与接入](./chunk-upload)。

### 底层协议：直接调用钉钉能力桥（仅存量兼容/排查）

新接入推荐优先使用上面的媒体 SDK。已经有统一 `invokeBridge()` 封装、且明确运行在钉钉 iframe 内的存量项目，可以继续使用以下 `postMessage` 协议，不必重复加载 SDK。自行实现时必须同时满足：

- 发送消息时使用配置的基座 `origin`，禁止使用 `*`。
- 接收消息时同时校验 `event.source === window.parent` 和 `event.origin === MBASE_ORIGIN`。
- 用唯一 `id` 匹配请求和响应，并在成功、失败、超时后移除监听器。
- 透传基座返回的 `error` 错误码，不能只保留错误文案，否则业务无法识别 `cancelled`。

```
子应用 iframe                     基座 mbase
  │  postMessage(invoke)            │
  │ ───────────────────────────────>│  dd.biz.util.uploadImageFromCamera()
  │                                 │  dd.device.geolocation.get()
  │                                 │  dd.biz.util.scan()
  │  postMessage(result)            │
  │ <───────────────────────────────│
```

### 能力调用

```js
// 子应用 → 基座：请求调用钉钉能力
const MBASE_ORIGIN = new URL(import.meta.env.VITE_MBASE_ORIGIN).origin

window.parent.postMessage(
  {
    source: 'mbase-bridge',
    type: 'capability:invoke',
    id: 'unique-id', // 必填，用于结果匹配
    api: 'takePhoto', // 能力名称（见下表）
    payload: { max: 1 },
  },
  MBASE_ORIGIN
)
```

### 能力结果

```js
// 基座 → 子应用：返回能力结果
{
  source: 'mbase-bridge',
  type: 'capability:result',
  id: 'unique-id',            // 与请求 id 一一对应
  ok: true,                   // 是否成功
  data: { ... },              // 成功时返回的数据
  error: 'invoke_failed',     // 失败时的错误码
  reason: '...'               // 失败原因描述
}
```

### 支持的能力列表

| api                    | 说明                       | payload                                     | 返回 data                                               |
| ---------------------- | -------------------------- | ------------------------------------------- | ------------------------------------------------------- |
| `takePhoto`            | 拍照（含 iOS 降级策略）    | `{ max, uploadConfig? }`                    | `{ images: string[] }` 或 `{ uploaded: true, results }` |
| `takePhotoAndUpload`   | 拍照直传后端               | `{ max, url, formData?, header? }`          | `{ results: any[] }`                                    |
| `chooseImage`          | 从指定来源选择图片         | `{ source, max? }`                          | `{ source, files: { path, size?, fileType? }[] }`       |
| `chooseImageAndUpload` | 从指定来源选择并直传       | `{ source, max?, url, formData?, header? }` | `{ source, uploaded: true, results: any[] }`            |
| `chooseImagePersist`   | 钉钉无 ID 时短期暂存       | `{ source, max? }`                          | `{ source, items: { pendingId, previewDataUri? }[] }`   |
| `takePhotoPersist`     | 历史拍照暂存别名，固定相机 | `{ max? }`                                  | `{ source: 'camera', items: [...] }`                    |
| `uploadPendingPhotos`  | 取得业务 ID 后上传临时项   | `{ pendingIds, url, formData?, header? }`   | `{ uploaded: true, results: any[] }`                    |
| `previewPendingPhoto`  | 原生预览一个临时项         | `{ pendingId }`                             | `{ previewed: true }`                                   |
| `releasePendingPhotos` | 删除或取消时释放临时项     | `{ pendingIds }`                            | `{ releasedIds: string[], missingIds: string[] }`       |
| `getLocation`          | 获取定位                   | 无                                          | `{ latitude, longitude, accuracy, address }`            |
| `scan`                 | 扫一扫                     | `{ type: 'qrCode'\|'barCode'\|'all' }`      | `{ text: string }`                                      |
| `debugInfo`            | 获取诊断信息               | 无                                          | 签名 URL / 平台 / 入口 URL 等                           |

其中 `source` 必须由子应用根据自己的交互明确传入：

- `camera`：只调起相机。
- `album`：只从手机相册选择。

原有 `takePhoto`、`takePhotoAndUpload` 是兼容接口，仍固定使用相机，不会因为新增相册能力而变成系统二选一。`chooseImage` 返回的是钉钉本地虚拟路径，仅供钉钉客户端识别，不得作为持久化地址或使用 `fetch` 读取；需要提交业务附件时优先使用 `chooseImageAndUpload`，由钉钉原生 `uploadFile` 直传后端。

临时图片五个接口只注册在钉钉 H5 能力桥，不进入 App 或微信小程序能力表。`pendingId` 只在创建它的 `appId + origin + iframe` 中有效，不能跨页面、跨子应用或长期持久化使用。

> `resumable*` 不通过钉钉原生能力桥执行。钉钉直接调用这些能力会返回 `use_resumable_sdk`；应使用上面的 `WLPortalResumableUpload`。App 才通过原生桥调用 `resumableChooseAndUpload / List / Resume / Pause / Cancel`。

### iframe 普通消息

```js
const MBASE_ORIGIN = new URL(import.meta.env.VITE_MBASE_ORIGIN).origin

window.parent.postMessage({ title: '页面标题' }, MBASE_ORIGIN)
window.parent.postMessage({ action: 'logout' }, MBASE_ORIGIN)
window.parent.postMessage({ action: 'user-logout' }, MBASE_ORIGIN)
```

两个退出消息语义不同，不得混用：

- `action: 'logout'`：仅表示子应用接口返回 401、当前注入会话失效。基座会优先比较并续期 token；H5/钉钉和 App/PDA 若取得新 token，会用新的可信 URL 重载当前子应用，不会直接退出用户。
- `action: 'user-logout'`：表示用户主动点击“退出登录”。基座会清理统一登录态并进入登录页，不用于普通接口 401。

子应用重新收到 URL 中的 `portal_token` 时，必须始终以本次参数为权威来源，覆盖本地旧 token，并同步清理旧用户资料和权限缓存；不能因为本地已有 token 而跳过。Robot_H5 `v1.7.0+` 已内置该行为。

### 接入示例（子应用侧）

```ts
class MBaseBridgeError extends Error {
  constructor(
    public readonly code: string,
    message: string
  ) {
    super(message)
    this.name = 'MBaseBridgeError'
  }
}

// 各环境显式配置基座 origin，例如：https://ytiop-sit.walsin.com.cn
const MBASE_ORIGIN = new URL(import.meta.env.VITE_MBASE_ORIGIN).origin

/** 调用基座钉钉能力 */
function callBridge<T = any>(
  api: string,
  payload?: any,
  timeout = 120000
): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const timer = setTimeout(() => {
      window.removeEventListener('message', handler)
      reject(new MBaseBridgeError('bridge_timeout', `桥接超时: ${api}`))
    }, timeout)

    function handler(e: MessageEvent) {
      if (e.source !== window.parent || e.origin !== MBASE_ORIGIN) return
      const msg = e.data
      if (
        msg?.source !== 'mbase-bridge' ||
        msg?.type !== 'capability:result' ||
        msg?.id !== id
      )
        return
      clearTimeout(timer)
      window.removeEventListener('message', handler)
      msg.ok
        ? resolve(msg.data)
        : reject(
            new MBaseBridgeError(
              msg.error || 'invoke_failed',
              msg.reason || '桥接调用失败'
            )
          )
    }
    window.addEventListener('message', handler)
    window.parent.postMessage(
      { source: 'mbase-bridge', type: 'capability:invoke', id, api, payload },
      MBASE_ORIGIN
    )
  })
}

// 使用
const { images } = await callBridge<{ images: string[] }>('takePhoto', {
  max: 1,
})

// 子应用自行展示“拍摄 / 从手机相册选择”交互，点击相册后调用：
const albumResult = await callBridge<{
  source: 'album'
  files: Array<{ path: string; size?: number; fileType?: string }>
}>('chooseImage', {
  source: 'album',
  max: 1,
})

// 相册图片需要直接提交后端时，推荐使用原生直传：
const uploadedAlbum = await callBridge<{
  source: 'album'
  uploaded: true
  results: any[]
}>('chooseImageAndUpload', {
  source: 'album',
  max: 1,
  url: import.meta.env.VITE_MEDIA_UPLOAD_URL,
  formData: { businessType: 'inspection' },
  header: { Authorization: 'Bearer ...' },
})

// 新增页还没有业务 ID：先暂存，保存后再上传
const pending = await callBridge<{
  source: 'album'
  items: Array<{ pendingId: string; previewDataUri?: string }>
}>('chooseImagePersist', {
  source: 'album',
  max: 1,
})
const pendingIds = pending.items.map(item => item.pendingId)

await callBridge('uploadPendingPhotos', {
  pendingIds,
  url: import.meta.env.VITE_MEDIA_UPLOAD_URL,
  formData: {
    relativeType: 'inspection',
    relativeId: savedBusinessId,
  },
  header: { Authorization: 'Bearer ...' },
})

const loc = await callBridge<{ latitude: number; longitude: number }>(
  'getLocation'
)
const { text } = await callBridge<{ text: string }>('scan', { type: 'qrCode' })
```

### 手写签名（App 专用 `signature` 能力）

App 容器内的子应用可调用 `signature` 能力拉起基座原生签名板：用户手写确认后，基座把签名 PNG 直传到子应用指定接口，上传域名校验、`formData`/`header` 透传与 `takePhotoAndUpload` 完全一致；用户取消时返回 `cancelled` 错误码。若 `url` 省略，则不落盘上传，直接返回签名图 `image`（dataURL），由调用方自行处理。

```ts
const result = await callBridge<{
  results: Array<{ statusCode: number; data: string }>
}>('signature', {
  // 必填：子应用同源上传接口（相对路径或完整 HTTPS 地址均可）
  url: '/inspection/signature/upload',
  formData: { businessType: 'work-permit', businessId },
  header: { Authorization: 'Bearer ...' },
})
```

接入要求：

- 在 `src/config/portal-apps.ts` 的对应应用 `capabilities` 中声明 `'signature'` 后方可调用，未声明返回 `capability_denied`。
- 签名图为透明背景 PNG，建议后端按附件保存并与业务单据关联。
- 同一时刻只允许一个签名请求，重复发起返回错误；签名板 5 分钟无操作自动取消。
- H5/微信小程序端不提供该能力，子应用应降级为自有签名组件或提示到 App 内操作。

### 附件预览 / 下载 / NFC / 录音（App 专用）

以下四个能力同样走 `callBridge`，均需在应用 `capabilities` 白名单中声明后调用：

```ts
// 附件预览：基座下载后用系统文档查看器打开（PDF/Office/图片）
await callBridge('filePreview', {
  url: 'https://ytiop-prd.walsin.com.cn/prd-api/file/xxx.pdf',
  fileName: '检测报告.pdf',
})

// 附件下载：下载后经查看器「分享/存储」菜单保存
await callBridge('fileDownload', { url, fileName })

// NFC 读标签（依赖设备支持，Android 为主；不支持返回 unsupported）
const { id, tech } = await callBridge<{ id: string; tech?: string }>(
  'nfcRead',
  {
    timeoutMs: 15000,
  }
)

// 录音（三段式）：
await callBridge('audioRecord', { action: 'start', maxDuration: 60 }) // 开始
const { audio, duration } = await callBridge('audioRecord', { action: 'stop' }) // 停止并取 dataURL
await callBridge('audioRecord', { action: 'cancel' }) // 或丢弃
```

约定：

- `filePreview`/`fileDownload` 仅接受 **HTTPS 绝对地址**（文件可位于子应用源、API 网关或文件服务，不做同源限制）。
- `audioRecord` 返回 `audio` 为 `data:audio/mp3;base64,...`（format 可选 mp3/aac/wav），超过单次结果上限返回 `payload_too_large`。
- H5/微信小程序端不注册这些能力；Core 子应用会自动降级为浏览器实现。

### 子应用错误上报（report-error）

子应用可将自身未捕获错误转发给基座，汇入「网络诊断」页的错误日志，便于现场统一排障：

```ts
window.parent.postMessage(
  {
    action: 'report-error',
    message: String(error?.message || error).slice(0, 500),
    stack:
      error instanceof Error
        ? String(error.stack || '').slice(0, 1000)
        : undefined,
    page: location.pathname,
  },
  MBASE_ORIGIN
)
```

基座侧只读、脱敏（token/openid 参数打码）、限长后并入内存队列，不触发任何业务逻辑；微信小程序端暂不支持该通道。

### 现场一键诊断（设置 → 网络诊断）

设置页新增「网络诊断」入口，面向现场排障：展示运行环境、会话状态（不含 token 明文）、API 网关与各子应用源连通性耗时（小程序端因平台域名白名单限制跳过子应用探测）、本次运行捕获的错误日志，并可一键复制脱敏文本报告发给 IT。报告中的 `portal_token`/`access_token`/`openid` 等敏感参数一律打码。

---

## 六、钉钉 JSAPI 鉴权

> 适用场景：用户在钉钉客户端内使用拍照、定位等敏感 JSAPI，前端必须先 `dd.config` 签名鉴权，否则报 `No permission info for action: ...`。

### 整体流程

```
前端(mbase)                         后端                         钉钉服务端
   │   GET /dingtalk/jsapi-signature   │                              │
   │       ?url=当前页面URL             │                              │
   │──────────────────────────────────►│                              │
   │                          (缓存) │── gettoken(AppKey/Secret) ──►│
   │                                 │◄────── access_token ────────│
   │                          (缓存) │── get_jsapi_ticket ─────────►│
   │                                 │◄────── jsapi_ticket ────────│
   │                                 │  SHA1 计算 signature          │
   │◄── {agentId,corpId,timeStamp,   │                              │
   │      nonceStr,signature} ───────│                              │
   │  dd.config(...) → dd.ready → 调拍照/定位                       │
```

### 后端签名接口

| 项   | 内容                                                       |
| ---- | ---------------------------------------------------------- |
| 方法 | `GET`                                                      |
| 路径 | `/dingtalk/jsapi-signature`                                |
| 入参 | `url`：String，必填。前端传来的当前页面 URL（已 URL 编码） |
| 鉴权 | 复用现有登录态（`Authorization: Bearer <token>`）          |

返回体（项目统一格式包裹，`data` 内字段名**不可改**）：

```json
{
  "code": 0,
  "data": {
    "agentId": "4600313959",
    "corpId": "ding20410a13904f00c74ac5d6980864d335",
    "timeStamp": "1717123456",
    "nonceStr": "Wm3WZYTPz0wzccnW",
    "signature": "40位小写十六进制"
  }
}
```

### 前端鉴权模块

`src/utils/dingtalk/` 按职责拆分为 5 个子模块：

| 子模块     | 文件        | 职责                                                      |
| ---------- | ----------- | --------------------------------------------------------- |
| 共享工具   | `shared.ts` | 环境检测、JSAPI 动态加载、通用调用封装、类型定义          |
| 鉴权初始化 | `config.ts` | dd.config 签名鉴权、dd.ready 初始化、导航栏控制、诊断信息 |
| 拍照选图   | `photo.ts`  | 拍照/选图（compression 渐进增强策略）                     |
| 文件上传   | `upload.ts` | 文件上传/拍照直传（安卓双路 + iOS 单路）                  |
| 设备能力   | `device.ts` | 定位（需鉴权）/ 扫码（免鉴权）                            |

鉴权 API 列表（`config.ts` 中 `JS_API_LIST`）：

```
biz.util.chooseImage
biz.util.chooseMedia
biz.util.uploadFile
biz.util.uploadImage
biz.util.uploadImageFromCamera
device.geolocation.get
device.geolocation.start
biz.util.previewImage
```

### 调用时机

- 进入钉钉子应用 webview 容器页后，`onMounted` 会预鉴权一次；进入门户首页本身不会触发这次设备能力鉴权。
- 拍照、相册或定位调用会复用按签名 URL 缓存的鉴权结果；预鉴权尚未完成或缓存失效时，能力调用会再次等待/触发鉴权。
- 非敏感 API（扫码 `biz.util.scan`）无需鉴权，只做 `loadJSAPI() + dd.ready`

### 运维清单

1. 注入环境变量 `DINGTALK_APP_SECRET`
2. 服务器能访问外网 `https://oapi.dingtalk.com`
3. 钉钉后台：门户微应用已开通拍照、相册、文件上传和定位所需的 JSAPI 权限
4. 钉钉后台安全域名白名单包含各环境基座域名，以及原生上传目标域名（如企业策略要求）
5. Android、iOS 分别使用真机验收；建议以钉钉 7.0.10 及以上作为 `uploadFile` 验收基线，版本说明见[钉钉官方 JSAPI Explorer](https://open.dingtalk.com/tools/explorer/jsapi?id=10281)
6. 上传域名使用有效 HTTPS 证书，且业务后端按 Token 校验用户、公司和附件归属

---

## 七、访客模式接入（免账号密码）

> 适用场景：访客预约、进出厂物资登记等业务，需要**外部人员（无系统账号）**在微信端直接使用。

### 整体流程

```
① 用户在 mbase 登录页点击「访客入口」（仅微信小程序端展示）
     ↓
② mbase 用预置的访客客户端凭证 RSA 加密后请求平台
     POST /auth/oauth/token?grant_type=client_credentials&client_code=<密文>
     ↓ 返回受限 access_token（scope 仅含访客相关接口）
     ↓
③ mbase 拼接跳转 URL：
     https://{VITE_DOMAIN}/mbase/af/#/visitor-reservation/person
       ?portal_token=<受限token>&from=portal&mode=visitor
     ↓
④ 子应用入口：
     · from=portal  → 复用免登逻辑，直接登录
     · mode=visitor → 标记访客身份，控制功能图标显隐
     ↓
⑤ 访客只看到访客功能，其它图标隐藏，接口由后端 scope 兜底
```

### 两层控制

| 层级           | 手段                         | 作用                                       |
| -------------- | ---------------------------- | ------------------------------------------ |
| 安全（硬控制） | 后端访客客户端的 `scope`     | 决定**能不能调接口**，越权直接拒绝         |
| 体验（软控制） | 前端 `mode=visitor` + `v-if` | 决定**显不显示图标**，避免访客看到无关功能 |

### 门户侧已预置（子应用无需关心）

| 文件                        | 内容                                              |
| --------------------------- | ------------------------------------------------- |
| `src/pages/login/index.vue` | 微信端「访客入口」按钮（`#ifdef MP-WEIXIN`）      |
| `src/utils/visitor-auth.ts` | `client_credentials` 换 token、RSA 加密、独立存储 |

### 子应用改造（安防参考，4 处小改动）

1. 新增常量 `VISITOR_MODE_KEY = 'h5_visitor_mode'`
2. `parsePortalUrlParams()` 增加 `mode` 字段解析
3. `initPortalFromUrl()` 中记录访客模式到 `sessionStorage`
4. 导出 `isVisitorMode()` 供业务使用

```vue
<!-- 业务页面使用 -->
<van-cell v-if="!visitor" title="隐患排查" />
<!-- 访客隐藏 -->
<van-cell title="访客预约" />
<!-- 访客可见 -->
```

### 后端配合

1. 平台后台「客户端管理」新增访客专用客户端
2. scope 仅授予访客接口（如 `store_attach_view`、`store_attach_add`）
3. 将 `clientId/clientSecret` 提供给前端替换占位值

### 联调 Checklist

- [ ] 已建访客客户端，scope 仅含访客接口
- [ ] mbase `visitor-auth.ts` 凭证已替换
- [ ] 子应用 `portal.ts` 完成 4 处改动
- [ ] 微信端点击「访客入口」→ 免登 → 仅显示访客功能
- [ ] 用访客 token 越权调其他接口，后端正确拒绝

---

## 八、微信小程序 openid 分发（访客身份识别）

> 适用场景：微信小程序访客入口进入子应用（当前为智慧安防）时，子应用需要拿到微信 `openid`，用于识别同一访客并留存入场/登记记录。
>
> 该能力**仅微信小程序端生效**；钉钉/H5/App 不参与、不注入、不受影响。

### 8.1 为什么必须后端配合

小程序前端只能通过 `uni.login`（底层 `wx.login`）拿到一次性 `code`，不能直接拿到 `openid`。
`code → openid` 必须由后端携带小程序 `appid` + `appsecret` 调微信 `jscode2session` 完成。

> `appsecret` 是小程序密钥，**严禁放到前端或子应用 URL**。

> ✅ **已验证（2026-06）**：后端接口 `GET /integrated/external/wx/getOpenId?code=` 已上线，无需鉴权，调微信侧链路正常。前端已完成对齐。

### 8.2 最佳实践流程

```
微信小程序 mbase
  │  用户点击「访客入口」进入工作台
  │
  │  用户点击需要 openid 的子应用（当前：security/智慧安防）
  ▼
mbase 调 uni.login() 获取 code
  │
  │  GET /integrated/external/wx/getOpenId?code=<code>  ← 已上线，无需鉴权
  ▼
后端调微信 jscode2session(appid + appsecret + code)
  │
  │  返回 { code: 200, data: { openid, unionid? } }
  ▼
mbase 缓存 openid（独立 storage，不进入 user store）
  │
  │  打开子应用 URL 时按需追加：&openid=<openid>
  ▼
安防子应用从 URL 读取 openid，用于访客登记/入场留存
```

### 8.3 门户侧开关（防止污染其它子应用）

openid 注入是**应用级 opt-in**，只有在 `src/config/portal-apps.ts` 中显式声明的应用才会收到。

```ts
{
  id: 'security',
  name: '智慧安防',
  visitorAccessible: true,
  needWechatOpenid: true, // 仅此应用会在微信小程序端收到 &openid=
}
```

未声明 `needWechatOpenid: true` 的应用（如智慧安全、智慧环保）永远不会被追加 `openid` 参数，避免身份信息误传、互相污染或业务混淆。

### 8.4 后端接口说明（已上线）

| 项       | 实际值                                                           |
| -------- | ---------------------------------------------------------------- |
| 方法     | `GET`                                                            |
| 路径     | `/integrated/external/wx/getOpenId`                              |
| 入参     | Query：`code`，必填。值来自 `uni.login()` 返回的 `code`          |
| 鉴权     | 无需鉴权（已验证，无 token 可直接调用）                          |
| 后端配置 | 小程序 `appid`（`wx9b378d8e9d5bb30d`）、`appsecret` 已在后端配置 |
| 微信接口 | `jscode2session`（已验证后端调微信侧链路正常）                   |
| 返回     | 统一包裹格式 `{ "code": 200, "data": { "openid": "..." } }`      |
| 安全     | `session_key` 不返回前端；如需保存，由后端自行加密留存           |

实际返回体示例（成功）：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "openid": "o_xxx"
  }
}
```

实际返回体示例（失败，如 code 无效）：

```json
{
  "code": 5000,
  "message": "获取微信openid失败(40029): invalid code, rid: ...",
  "data": null
}
```

说明：

- `openid`：用户在**当前小程序**下的唯一标识，安防访客登记场景优先使用。
- `unionid`：微信开放平台统一标识，后端目前未返回（跨公众号识别时再议）。
- `session_key`：微信会返回，但前端不需要，不能下发到子应用。

### 8.5 接口未就绪时的降级策略

门户侧已做降级：

- 后端接口未上线、失败、超时、未返回 openid：**不阻断进入子应用**。
- 子应用 URL 只是不携带 `openid`，仍保留 `portal_token`、`from=portal` 等免登参数。
- 错误仅在 mbase 控制台输出 warning，不影响普通登录、访客 token、其它应用展示。

### 8.6 子应用如何获取和使用

安防子应用在入口初始化时读取自身 URL 参数：

```ts
const params = new URLSearchParams(window.location.search)
const portalToken = params.get('portal_token')
const openid = params.get('openid')

if (portalToken) {
  store.setToken(portalToken)
}

if (openid) {
  sessionStorage.setItem('visitor_wechat_openid', openid)
}
```

业务提交登记信息时带给安防后端：

```ts
await api.submitVisitorRegister({
  ...form,
  wechatOpenid: sessionStorage.getItem('visitor_wechat_openid') || undefined,
})
```

建议子应用侧也做两点隔离：

- 仅在 `mode=visitor` 或访客功能页面使用该 openid，不要写入普通用户资料。
- 如果 openid 缺失，仍允许用户继续登记，但后端可提示「微信身份未绑定」或降级为手机号/证件号识别。

### 8.7 与钉钉能力桥的边界

| 场景                | 通信方式                   | 适用能力                | 是否携带 openid      |
| ------------------- | -------------------------- | ----------------------- | -------------------- |
| 钉钉 H5/iframe      | `mbase-bridge` postMessage | 拍照、定位、扫码        | 否                   |
| 微信小程序 web-view | 打开 URL 时追加 query      | 免登 token、访客 openid | 是（仅 opt-in 应用） |

不要把微信 openid 放进钉钉 `mbase-bridge`；不要在非微信端追加 openid；不要让未声明的子应用拿到 openid。

---

## 九、公司上下文透传

> 适用场景：正式登录用户（含钉钉免登、普通 H5 登录）进入工作台后，基座获取该用户可访问的公司列表，用户在工作台选择当前公司，打开子应用时把公司上下文随 URL 一起传入。

### 9.1 门户侧公司来源

工作台进入后使用登录态获取当前用户与组织信息：

```http
GET /hrms/user/getCurUser
GET /hrms/user/getById?id=<getCurUser.data.user.id>
```

两个接口都需要携带 `Authorization: Bearer <portal_token>`。门户先通过 `getCurUser` 拿到当前用户 ID，再通过 `getById` 读取该用户维护在平台里的 `userOrganizeInfo`。`/hrms/company/getCompanyIdNameMap` 仍作为公司基础字典接口保留，用于公司 ID 名称映射、登录页字典等公共场景；移动工作台公司展示和切换以 `userOrganizeInfo` 为准。

兜底策略：

- 正常路径：`/hrms/user/getById?id=<当前用户ID>` 成功返回 `userOrganizeInfo`，门户使用该列表。
- 兜底路径：如果 `getById` 因权限或网关问题失败，但 `getCurUser` 已经在 `userStore.userInfo` 中缓存了当前用户的 `userOrganizeInfo`，门户会使用缓存恢复公司上下文，避免工作台出现“公司未获取”。
- 失败路径：如果两处都没有可用组织信息，门户仍会展示明确错误，例如 `/hrms/user/getById 获取失败：无权限访问`，便于定位后端权限配置。

`/hrms/hrUserCompanyController/listByUserNo` 仍作为 PC 登录前按账号查询公司逻辑保留，移动工作台不再使用它作为公司来源。

后端返回示例：

```json
{
  "code": 2000,
  "message": "查询成功",
  "data": {
    "id": "2067939926757871617",
    "userNo": "cheny",
    "name": "杨晨誉",
    "phone": "18993540586",
    "userOrganizeInfo": [
      {
        "companyId": "2061278439935053826",
        "companyName": "煙台華新",
        "deptId": "2066414891727589441",
        "deptName": "煙台智能應用部",
        "main": true
      },
      {
        "companyId": "2066414891673063426",
        "companyName": "煙臺冷精",
        "deptId": "2066414891723395146",
        "deptName": "技術部門(煙臺冷精)",
        "main": false
      }
    ]
  }
}
```

门户会把 `userOrganizeInfo` 转成 `{ id: companyId, name: companyName, deptId, deptName, main }[]`。公司 ID 可能超过 JS 安全整数范围，前端和子应用都必须按字符串处理，不要转成 `number`。部门信息仅用于门户展示当前公司下的所属部门，子应用权限与数据范围仍以 `token + companyId` 后端校验为准。

默认选择规则：

1. 优先使用当前用户上次选择且仍在公司列表内的公司。
2. 否则选择 `main === true` 的公司作为默认公司，展示名称以接口返回的 `companyName` 为准，不写死名称。
3. 如果后端未返回主公司，则选择当前用户 `companyId` 对应公司；仍未命中时选择列表第一项。

当前选择会按用户 ID 维度保存在本地，避免 A 用户选择的公司污染到 B 用户。若 `userOrganizeInfo` 为空，门户会提示“该账号未在平台绑定公司”；若接口异常且没有缓存可兜底，会明确提示是 `/hrms/user/getCurUser` 还是 `/hrms/user/getById` 获取失败，便于定位后端或登录态问题。

### 9.2 子应用 URL 参数

门户打开子应用时会追加：

```text
portal_token=<token>
from=portal
user_id=<userId>
companyId=<当前公司ID>
companyName=<当前公司名称>
```

完整示例：

```text
https://ytiop-sit.walsin.com.cn/mbase/aq/
  ?portal_token=xxx
  &from=portal
  &user_id=U001
  &companyId=2061278439935053827
  &companyName=%E7%83%9F%E5%8F%B0%E5%8D%8E%E9%91%AB
```

参数说明：

| 参数          | 说明                                                             |
| ------------- | ---------------------------------------------------------------- |
| `companyId`   | 当前选择的公司 ID，业务接口和权限校验应使用该值，按字符串处理    |
| `companyName` | 当前选择的公司名称，仅用于页面展示；权限、数据范围不能依赖该字段 |

### 9.3 子应用读取方式

子应用入口初始化时读取自身 URL：

```ts
const params = new URLSearchParams(window.location.search)

const portalToken = params.get('portal_token') || ''
const companyId = params.get('companyId') || ''
const companyName = params.get('companyName') || ''

if (portalToken) {
  localStorage.setItem('portal_token', portalToken)
}
if (companyId) {
  sessionStorage.setItem('portal_company_id', companyId)
}
if (companyName) {
  sessionStorage.setItem('portal_company_name', companyName)
}
```

后续调用子应用自己的业务接口时，建议显式携带公司 ID：

```ts
await request('/api/current-user/permissions', {
  headers: {
    Authorization: `Bearer ${portalToken}`,
  },
  params: {
    companyId,
  },
})
```

### 9.4 数据刷新与存量接口兼容

基座负责选择并透传公司上下文，不会替子应用调用业务接口，也不会修改子应用的菜单、权限和页面缓存。子应用必须在用户信息、权限菜单和业务列表加载前完成公司上下文初始化。

后端接口分为两类：

1. **显式上下文接口（推荐）**：每个公司级接口都携带 `companyId`，服务端使用 `portal_token + companyId` 校验权限并过滤数据，不依赖服务端可变的“当前公司”。
2. **存量当前公司接口**：接口本身没有 `companyId`，依赖平台保存的当前公司。子应用首次进入时应先调用 `POST /hrms/user/changeCompany?companyId=<本次公司>`，成功后再清理并重新获取用户、菜单、按钮权限、字典和业务数据。

公司同步失败必须阻断业务首页，不能继续展示上一公司缓存，也不能静默回退到默认公司。Pinia、KeepAlive、localStorage 和 IndexedDB 中的业务缓存应清除或按 `companyId` 分区。

Robot_H5 模板已经内置上述闭环：默认 `server` 模式兼容平台存量接口，也支持 `explicit` 模式；提供 `withMbaseCompanyContext()` 显式追加公司参数和 `getMbaseCompanyScopedKey()` 隔离业务缓存。具体配置、诊断页和验收步骤见模板 `docs/mbase-integration.md`。

### 9.5 权限边界

`companyId` 是用户在门户选择的业务上下文，不是权限证明。子应用后端必须使用 `portal_token + companyId` 再次校验该用户是否有该公司权限，并据此返回菜单、按钮和数据范围。

`companyName` 只用于展示，例如页面顶部显示当前公司名称。不要用 `companyName` 做权限判断，也不要把它当作后端可信参数。

如果子应用没有收到 `companyId`，建议阻断进入业务首页并提示“缺少公司上下文，请从移动门户重新进入”，避免用户在错误公司或默认数据下继续操作。

---

## 十、多环境配置

### 10.1 线上环境

| 环境 | 域名                      | API 前缀   |
| ---- | ------------------------- | ---------- |
| SIT  | `ytiop-sit.walsin.com.cn` | `/sit-api` |
| UAT  | `ytiop-uat.walsin.com.cn` | `/uat-api` |
| PRE  | `ytiop-pre.walsin.com.cn` | `/pre-api` |
| PRD  | `ytiop-prd.walsin.com.cn` | `/prd-api` |

### 10.2 环境切换

基座各环境的公开配置集中维护在 `scripts/build-environment.mjs`：

- `VITE_API_BASE_URL`：API 网关地址
- `VITE_DOMAIN`：子应用域名前缀（与 `mpPath` 拼接生成子应用完整 URL）

wl-mbase 与 Robot_H5 在 `dev / sit / uat / pre / main` 标准发布分支统一执行 `pnpm build:h5`，严格按分支自动选择环境；微信执行 `pnpm build:wx -- --env <环境>`；App/PDA 执行 `pnpm package:app -- --env <环境>`。生产 H5 只从 `main` 分支构建，`prd` 只是其他端可使用的生产环境参数别名。每份产物都通过根目录 `env.json` 记录环境、版本、提交和构建时间；基座产物还记录实际 API。完整维护规则见[多端构建与环境说明](/frontend/mobile-uniapp/)。

> `mpPath` 用于所有线上环境，运行时通过构建期注入的 `VITE_DOMAIN` 拼接完整 HTTPS 地址；`url` 字段仅用于开发环境 fallback。不要通过 URL 参数、运行时读取 `env.json` 或构建后文本替换来切换环境。

### 10.3 非模板 H5 统一环境构建与审计

本节只面向**没有使用 Robot_H5**、但需要进入 wl-mbase 的普通 Vite / Vue CLI H5 项目。Robot_H5 已内置同一套分支映射、`build:h5` 和 `env.json`，不要重复复制本节脚本。

#### 10.3.1 最终约定

| 项目                   | 统一规则                                                              |
| ---------------------- | --------------------------------------------------------------------- |
| CI 命令                | 只执行 `pnpm build:h5`                                                |
| 标准分支               | `dev → DEV`、`sit → SIT`、`uat → UAT`、`pre → PRE`、`main → PRD`      |
| 生产分支               | 只认 `main`；不存在 `prd` 生产分支                                    |
| API 真源               | 子应用启动时由当前 wl-mbase 通过受信 v1 协议下发                      |
| 子应用 `env.json`      | 记录子应用版本、分支、Commit、构建时间及 `environmentSource=wl-mbase` |
| 基座 `/mbase/env.json` | 记录当前基座的准确环境和 API；与子应用 `env.json` 组合完成发布审计    |
| Token / 公司上下文     | 完全沿用现有 URL 契约，本协议不读取、不复制、不改变                   |

`env.json` 是公开的产物身份证，不是运行时配置中心。子应用业务首屏不请求 `env.json`；实际环境通过已经完成来源校验的 WebView 消息返回，避免静态文件缓存、SPA fallback 或请求时序影响启动。

当前 v1 覆盖浏览器 H5、钉钉 iframe、App 和 Android PDA 中的远程 H5。微信小程序 WebView 不具备同等的即时双向消息条件；同时投放微信小程序的非模板项目暂不启用 `managed`，仍保留自身编译期环境配置。Robot_H5 不受此限制，也不需要改造。

#### 10.3.2 第一步：复制无依赖构建适配器

从 wl-mbase 复制：

```text
integrations/non-template-h5/portal-build-h5.mjs
  → 子应用/scripts/portal-build-h5.mjs

integrations/non-template-h5/portal.integration.json.example
  → 子应用/portal.integration.json
```

适配器仅使用 Node.js 标准库，不需要维护平台 npm 包。修改 `portal.integration.json`：

```json
{
  "schemaVersion": 1,
  "contractVersion": 1,
  "application": {
    "id": "quality",
    "name": "品质管控"
  },
  "build": {
    "command": ["pnpm", "run", "build:project"],
    "outputDir": "dist",
    "publicPath": "/mbase/zl/"
  }
}
```

- `application.id` 必须与 `src/config/portal-apps.ts` 中的 `PortalApp.id` 完全一致。
- `outputDir` 必须是项目内的产物目录，不能是绝对路径、`..` 路径或项目根目录。
- `publicPath` 必须与门户注册的 `mpPath` 一致。
- `build.command` 是数组参数，不经过 shell 拼接；必须调用项目原有构建，不能再次调用 `build:h5`。

修改子应用 `package.json`：

```json
{
  "scripts": {
    "build:project": "vite build",
    "build:h5": "node scripts/portal-build-h5.mjs"
  }
}
```

Vue CLI 项目使用：

```json
{
  "scripts": {
    "build:project": "vue-cli-service build",
    "build:h5": "node scripts/portal-build-h5.mjs"
  }
}
```

CI 不增加环境参数，也不需要额外校验步骤。适配器会拒绝非标准分支，先执行 `build:project`，成功后再生成并校验 `env.json`；项目构建失败时不会伪造环境身份证。

#### 10.3.3 第二步：在业务初始化前获取基座环境

在子应用 HTML 引入基座 SDK：

```html
<script src="/mbase/sdk/portal-environment.js"></script>
```

App/PDA 场景还要按 [App 集成与发布](./app-integration#_2-3-底层桥接协议) 动态加载官方 `uni.webview.1.5.8.js`；普通 H5/钉钉不要静态加载该官方 SDK。

必须在创建 API 客户端、发起首个业务请求和挂载应用**之前**等待环境就绪：

```ts
async function bootstrap() {
  const runtime = await window.WLPortalEnvironment.ready({
    appId: 'quality',
    timeout: 8000,
  })

  // axios 示例；也可把 runtime.apiBaseUrl 注入其他请求库。
  api.defaults.baseURL = runtime.apiBaseUrl
  app.provide('portalRuntime', runtime)
  app.mount('#app')
}

bootstrap().catch(error => {
  renderStartupError({
    title: '应用环境初始化失败',
    message: error.message,
    code: error.code,
  })
})
```

不要在 `ready()` 完成前创建会立即发请求的 store，不要把失败静默回退到 SIT，也不要从 `/mbase/env.json` 读取 API 后自行切换。独立访问需要由子应用保留自己的明确启动方式；托管入口初始化失败时应展示可重试错误页，禁止空白页。

iframe 下 SDK 使用 `document.referrer` 得到精确父来源，并同时校验 `event.origin + event.source`。如果子应用的 `Referrer-Policy` 禁止 referrer，才显式传入精确 `portalOrigin`；禁止传 `*`。App/PDA 通过 `uni.postMessage` 请求，基座仅向当前已注册且地址匹配的原生 WebView 用 `evalJS` 回包。

稳定错误码：

| 错误码                    | 处理方式                                                        |
| ------------------------- | --------------------------------------------------------------- |
| `not_managed`             | 当前是独立访问；进入子应用自己的独立启动流程                    |
| `portal_origin_required`  | 补充精确 `portalOrigin` 或修正 Referrer-Policy                  |
| `app_sdk_missing`         | App/PDA 按需加载官方 uni.webview SDK                            |
| `environment_timeout`     | 检查基座版本、应用注册、`appId`、消息来源与网络后允许用户重试   |
| `environment_not_enabled` | 子应用尚未由平台组开启 `environmentMode: 'managed'`             |
| `invalid_environment`     | 返回契约不完整；记录基座版本与 Commit，停止业务请求并联系平台组 |

#### 10.3.4 第三步：平台组灰度启用

子应用完成 SIT 改造并部署后，平台组才在对应 `PortalApp` 增加：

```ts
{
  id: 'quality',
  // ...既有配置
  environmentMode: 'managed',
}
```

字段不写或写为 `legacy` 时，基座不下发环境，现有子应用行为完全不变。启用后仍须满足四道校验：当前 WebView 来源可信、URL 命中注册表、请求 `appId` 与当前应用一致、应用在当前环境启用。响应只包含环境、API、基座版本和构建信息，不包含 Token、用户、公司、Cookie 或任何凭据。

推荐发布顺序：先发布支持环境请求的基座 → 部署已改造子应用 → 平台组设置 `managed` → SIT 真机验收 → 再逐环境放行。回滚子应用时可以保留 `managed`（旧子应用不会主动请求）；不要在新版子应用仍依赖托管环境时先回滚基座协议。

#### 10.3.5 验收与审计

1. 在 `dev / sit / uat / pre / main` 分支分别执行同一命令 `pnpm build:h5`，非标准分支必须失败。
2. 访问子应用 `/<子应用路径>/env.json`，确认 `application.id`、`environment`、`branch`、`commitSha`、`builtAt`、`publicPath` 正确。
3. 确认 `runtime.environmentSource=wl-mbase`、`environmentProtocol=1`，且文件中没有 Token、secret、password、私钥。
4. 访问 `/mbase/env.json`，确认其环境与子应用一致，并从 `runtime.apiBaseUrl` 核对实际 API。
5. 在 H5/钉钉和 App/PDA 中抓取首个业务请求，确认其 API 与当前基座一致；切换 SIT/UAT 时不能残留旧环境域名。
6. 独立打开子应用时应进入明确的独立模式或错误页，不能静默使用某个默认环境。
7. 运行基座 `pnpm test:managed-h5` 与 `pnpm check:quality`。

### 10.4 开发环境

| 服务       | 地址                          | 说明               |
| ---------- | ----------------------------- | ------------------ |
| 移动端网关 | `http://172.28.99.172:9000`   | OAuth2 / JWT Token |
| 子应用 H5  | 本地 Vite 代理 `/mbase/aq` 等 | iframe 嵌入        |

### 10.5 Nginx 配置示例

```nginx
server {
    listen 443 ssl;
    server_name ytiop-sit.walsin.com.cn;

    # API 转发
    location /sit-api/ {
        proxy_pass http://172.28.99.172:9000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 门户 H5
    location /mbase/ {
        alias /path/to/dist/build/h5/;
        index index.html;
        try_files $uri $uri/ /mbase/index.html;
    }

    # 钉钉消息单点跳转静态中转页
    # relay.html 是真实文件，必须能被 /mbase/relay.html 直接命中；
    # 不要把它只配置成 SPA 深路径，否则钉钉消息点击可能绕不开 Nginx fallback 问题。
    location = /mbase/relay.html {
        alias /path/to/dist/build/h5/relay.html;
    }

    # 基座产物身份证：必须返回 JSON，禁止 SPA fallback 和长缓存
    location = /mbase/env.json {
        alias /path/to/dist/build/h5/env.json;
        default_type application/json;
        add_header Cache-Control "no-cache";
    }

    # 托管子应用产物身份证：同样禁止 SPA fallback 和长缓存
    location = /mbase/zl/env.json {
        alias /path/to/zl/env.json;
        default_type application/json;
        add_header Cache-Control "no-cache";
    }

    # 子应用（按需添加）
    location /mbase/aq/ { alias /path/to/aq/; try_files $uri $uri/ /mbase/aq/index.html; }
    location /mbase/af/ { alias /path/to/af/; try_files $uri $uri/ /mbase/af/index.html; }
    location /mbase/hb/ { alias /path/to/hb/; try_files $uri $uri/ /mbase/hb/index.html; }
}
```

---

## 十一、安全注意事项

| 风险点                    | 当前策略 / 建议                                                                        |
| ------------------------- | -------------------------------------------------------------------------------------- |
| `portal_token` 明文在 URL | 内网 HTTPS 可接受；外网或更高安全级别建议改为短期一次性 code 换取                      |
| 消息 `redirect_url` 外跳  | `relay.html` 与 `dingtalk-redirect.ts` 只允许同源 + 已注册 `mpPath`，拦截跨域/未知路径 |
| iframe 嵌入任意 URL       | 工作台入口通过 `portal-apps.ts` 注册表打开；消息直达也走白名单                         |
| postMessage 来源校验      | 基座按当前 iframe origin + contentWindow 校验来源；子应用接收消息也应校验来源          |
| Token 有效期              | relay 检测过期并回基座 SSO；已打开子应用上报 401 后，基座续期并用新 URL 重新注入 token |
| 子应用登出不同步          | 通过 postMessage `action: logout` / `user-logout` 触发基座同步清理                     |
| `companyId` 被篡改        | 子应用后端必须用 `portal_token + companyId` 校验公司权限                               |
| `companyName` 被篡改      | 仅用于展示，不参与权限判断和数据范围过滤                                               |

### 维护约定

- 新增子应用时，先维护 `src/config/portal-apps.ts`，再同步 `public/relay.html` 的 `APP_PATHS`。
- 应用在各环境是否显示，统一在 `portal-apps.ts` 的 `ENV_APP_WHITELIST` 调整，不要为不同环境改 `enabled`，以保持所有分支代码一致。
- 不要在日志中打印完整带 `portal_token` 的子应用 URL；需要排查时只打印脱敏 URL 或 appId/companyId。
- 如果将来允许跨域子应用，不能简单放开 `redirect_url`，需要引入显式可信域名配置、短期 code 换 token，以及子应用侧 CSRF/来源校验。
- `src/pages/relay/index.vue` 是历史兼容入口；新消息配置统一使用 `/mbase/relay.html`。
