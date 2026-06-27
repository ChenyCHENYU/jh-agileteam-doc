# 移动端 uniApp — H5 子应用集成方案

> 对应项目：移动端门户（wl-mbase）。本文说明基座对接外部 H5 子应用的 SSO 免登、消息单点跳转、JSAPI 桥接、访客模式、公司上下文、openid 分发全流程。

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
  └─ 接收 portal_token → 换取本系统 Token（或直接用）→ 调用自己业务接口
```

当前已注册子应用：

| 应用     | mpPath      | 说明             | 钉钉 JSAPI          |
| -------- | ----------- | ---------------- | ------------------- |
| 智慧安全 | `/mbase/aq` | 安全生产管理系统 | 拍照/上传/定位      |
| 智慧安防 | `/mbase/af` | 安防监控管理系统 | 拍照/上传/定位/扫码 |
| 智慧环保 | `/mbase/hb` | 环保监测管理系统 | -                   |

---

## 二、免登（SSO）实现原理

本项目有两层"免登"，不要混在一起看：

- **基座自身登录**：用户进入 wl-mbase。钉钉 H5 场景可通过 `requestAuthCode` 换系统 token。
- **子应用登录**：用户已进入基座后点击子应用，基座把 `portal_token` 拼到子应用 URL，子应用据此跳过自己的登录页。

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

> **核心原则：登录只在门户发生一次。** 用户已经在移动端登录，进入子应用时不应再看到任何登录界面。

### Token 使用方式

> 集成的 H5 是我们自己开发的，**优先选方式 A**；只有第三方 H5 才考虑方式 B。

**方式 A：直接复用（推荐）** — 子应用后端与门户共用同一套认证服务，直接把 `portal_token` 当 Bearer Token 用。

**方式 B：Token 交换（第三方 H5 适用）**

```
POST /auth/exchange
Body:     { portal_token: "xxx" }
Response: { token: "子应用自己的token", expires_in: 3600 }
```

---

## 三、钉钉消息单点跳转

> 适用场景：钉钉消息通知点击后，不先落工作台，而是完成基座免登并直达某个子应用的具体页面。

### 消息配置

消息服务统一配置静态中转页（不要优先配置 `/mbase/pages/relay/index` 这种 SPA 深路径）：

```text
https://{VITE_DOMAIN}/mbase/relay.html?redirect_url=<encodeURIComponent(子应用完整URL)>
```

示例：

```text
https://ytiop-uat.walsin.com.cn/mbase/relay.html
  ?redirect_url=https%3A%2F%2Fytiop-uat.walsin.com.cn%2Fmbase%2Faq%2Fdetail%3Fid%3D123
```

### 运行链路

```text
钉钉消息
  ↓
/mbase/relay.html?redirect_url=<子应用URL>
  ↓
校验 redirect_url：同源 + http(s) + 已注册子应用路径
  ↓
读取基座本地登录态
  ↓
已登录、token 未过期、userId/companyId 就绪
  ├─ 是：追加 portal_token/from/user_id/companyId → 跳子应用
  └─ 否：回 /mbase/?redirect_url=... → 基座 SSO / 公司加载 → 消费 redirect
```

### 关键源码

| 文件                             | 职责                                                                                |
| -------------------------------- | ----------------------------------------------------------------------------------- |
| `public/relay.html`              | 静态中转页，解决深路径 Nginx 不 fallback、已登录快速直达、异常态回基座              |
| `index.html`                     | 在 uni-app 路由初始化前捕获 `redirect_url`，新消息会覆盖旧缓存                      |
| `src/utils/dingtalk-redirect.ts` | SPA 侧捕获/消费 `redirect_url`，做同源白名单、URL 参数拼接、companyId 兜底加载      |
| `src/pages/login/index.vue`      | 钉钉 SSO 成功后消费 redirect，有则进子应用，否则进工作台                           |
| `src/App.vue`                    | 已登录冷启动停在 launch 页时消费 redirect，避免被默认工作台跳转覆盖                 |
| `src/pages/relay/index.vue`      | 旧 SPA 中转入口，保留兼容历史配置，不作为新消息首选入口                             |

### 白名单与新增子应用

当前允许消息直达的路径：`/mbase/aq/`、`/mbase/af/`、`/mbase/hb/`。新增子应用时必须同步维护：

1. `src/config/portal-apps.ts`：注册子应用
2. `public/relay.html`：把新 `mpPath` 加入 `APP_PATHS`，否则钉钉消息直达会被安全拦截
3. 子应用后端：继续使用 `portal_token + companyId` 校验公司权限

### 安全策略

- 只允许当前域名下已注册子应用路径，不允许跨域、`javascript:`、未知路径
- 参数拼接使用 `URLSearchParams`，会先清理旧的 `portal_token/from/user_id/companyId`，避免重复污染
- token 过期、未登录、缺 `userId`、缺 `companyId` 时不硬跳子应用，而是回基座走既有 SSO 和公司加载流程
- 中转页通过 `history.replaceState` 优化返回体验，从子应用返回时落工作台，不回到 relay 重复跳转
- 控制台日志不打印完整带 token 的子应用 URL

### 审批流消息分流

审批流消息使用 `FLOW_` 模板编码进入基座审批流消息路由，普通业务消息仍沿用 `redirect_url` 规则：

```text
templateCode 以 FLOW_ 开头：
  标准 FLOW_COMMENTS → 基座审批详情页（通过 / 驳回）
  其他 FLOW_*   → 按 returnUrl 跳具体子应用

  生产过渡兼容（businessType=101 安全域消息暂由安全子应用承接）：
    FLOW_COMMENTS + 101 → /mbase/aq/message?tab=todo
    FLOW_REFUSE   + 101 → /mbase/aq/ehs/work-license
    该规则仅用于移动端消息中心完成前的平滑过渡

templateCode 不以 FLOW_ 开头：
  走原 redirect_url 子应用跳转
```

待审批消息固定格式：

```text
https://{VITE_DOMAIN}/mbase/relay.html?target=flow&provider=platform&templateCode=FLOW_COMMENTS&id=<instanceId>&commentId=<commentId>&messageId=<messageId>&returnUrl=<encodeURIComponent(移动端业务URL)>
```

---

## 四、门户侧配置（mbase 负责）

### 4.1 子应用注册 `portal-apps.ts`

新增子应用仅在 `src/config/portal-apps.ts` 追加一条配置：

```typescript
export const PORTAL_APPS: PortalApp[] = [
  {
    id: 'safety',
    name: '智慧安全',
    description: '安全生产管理系统',
    icon: '🔒',
    iconBg: 'linear-gradient(135deg, #667eea, #764ba2)',
    url: 'https://ytiop-sit.walsin.com.cn/mbase/aq/',  // 开发 fallback
    mpPath: '/mbase/aq/',                                // 线上，运行时拼接 VITE_DOMAIN
    devProxyPath: '/mbase/aq/',                          // 本地 Vite 代理
    roles: ['*'],                                        // 可见角色，'*' 全部
    enabled: true,
    sort: 1,
    platforms: ['h5', 'mp-weixin', 'app'],               // 可见平台，不填则全部
    visitorAccessible: true,                             // 是否对访客开放
    needWechatOpenid: true,                              // 微信小程序端是否注入 openid
  },
  // ... 更多子应用
]
```

### 4.2 各配置项说明

| 字段                 | 说明                                                       |
| -------------------- | ---------------------------------------------------------- |
| `id`                 | 唯一标识，用于路由参数和日志                               |
| `url`                | H5 首页地址（开发环境 fallback）                           |
| `mpPath`             | 线上路径，运行时与 `VITE_DOMAIN` 动态拼接完整 HTTPS 地址   |
| `devProxyPath`       | 开发代理路径，Vite DevServer 转发并剔除 X-Frame-Options    |
| `roles`              | 可见角色列表，`['*']` 全部可见，支持精确角色控制           |
| `enabled`            | 是否显示在工作台                                           |
| `sort`               | 排序权重，数字越小越靠前                                   |
| `platforms`          | 可见平台列表（`h5` / `mp-weixin` / `app`），不填则全平台可见 |
| `visitorAccessible`  | 是否允许访客（免登）访问                                   |
| `needWechatOpenid`   | 仅微信小程序端生效，是否下发微信 openid                    |

`buildAppUrl()` 会自动追加认证参数，新签名：

```ts
buildAppUrl(app, token, userId?, openid?, isVisitor?, context?)
// → {mpPath}?portal_token={token}&from=portal&user_id={userId}[&openid=][&companyId=][&companyName=][&mode=visitor]
```

### 4.3 开发代理配置（vite.config.js）

本地开发时，Vite DevServer 自动转发子应用请求并剔除 iframe 限制头：

```javascript
proxy: {
  '/mbase/aq': {
    target: 'http://172.28.99.172:81',
    changeOrigin: true,
    configure: proxy => {
      proxy.on('proxyRes', proxyRes => {
        delete proxyRes.headers['x-frame-options']
        delete proxyRes.headers['content-security-policy']
      })
    },
  },
  // 每个子应用一条代理规则
}
```

### 4.4 门户已完成功能

- [x] `src/config/portal-apps.ts`：配置子应用列表（url、mpPath、name、enabled、roles、platforms）
- [x] `buildAppUrl(app, token, userId, openid, isVisitor, context)`：自动拼接 `portal_token`、`user_id`、`from=portal`、`companyId`、`companyName`
- [x] `src/pages/index/index.vue`：点击应用图标 → 传参跳转 webview 页
- [x] `src/pages/webview/index.vue`：iframe / web-view 嵌入 + postMessage 双向通信 + 桥接协议
- [x] `src/utils/dingtalk/`：钉钉 JSAPI 按职责拆分为 5 个子模块
- [x] `src/utils/dingtalk-redirect.ts`：钉钉消息 redirect 捕获、白名单校验、SSO 后消费跳转
- [x] `public/relay.html`：静态中转页，支持钉钉消息单点跳转和返回体验优化
- [x] `src/pages/webview/photo-utils.ts`：图片归一化工具（URL/dataURI/base64）

---

## 五、H5 子应用侧改造清单

> **核心思路：登录入口只有一个，就是门户。**

### 5.1 必须改（否则免登不生效）

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

### 5.2 建议改（体验更好）

#### ⑤ 页面标题同步给门户

```ts
router.afterEach(to => {
  window.parent.postMessage({ title: to.meta.title || document.title }, '*')
})
```

#### ⑥ 会话过期通知门户

```ts
// 接口返回 401 时，通知门户处理
window.parent.postMessage({ action: 'logout' }, '*')      // 子应用会话失效，退回工作台
window.parent.postMessage({ action: 'user-logout' }, '*') // 子应用主动退出，基座清登录态
```

### 5.3 不需要改

- 子应用普通业务接口 — 照常；涉及公司数据/权限的接口需接收并校验 `companyId`
- 子应用 UI/样式 — iframe 完全隔离
- 子应用内部路由 — 照常工作，门户不感知

---

## 六、桥接通信协议

子应用运行在 iframe 内，受安全策略限制无法直调钉钉 JSAPI。由基座统一调用 JSAPI，通过 `mbase-bridge` postMessage 桥接回传结果。

```
子应用 iframe                     基座 mbase
  │  postMessage(invoke)            │
  │ ───────────────────────────────>│  dd.biz.util.uploadImageFromCamera()
  │                                 │  dd.device.geolocation.get()
  │                                 │  dd.biz.util.scan()
  │  postMessage(result)            │
  │ <───────────────────────────────│
```

### 支持的能力列表

| api                  | 说明                    | payload                                | 返回 data                                               |
| -------------------- | ----------------------- | -------------------------------------- | ------------------------------------------------------- |
| `takePhoto`          | 拍照（含 iOS 降级策略） | `{ max, uploadConfig? }`               | `{ images: string[] }` 或 `{ uploaded: true, results }` |
| `takePhotoAndUpload` | 拍照直传后端            | `{ max, url, formData?, header? }`     | `{ results: any[] }`                                    |
| `getLocation`        | 获取定位                | 无                                     | `{ latitude, longitude, accuracy, address }`            |
| `scan`               | 扫一扫                  | `{ type: 'qrCode'\|'barCode'\|'all' }` | `{ text: string }`                                      |
| `debugInfo`          | 获取诊断信息            | 无                                     | 签名 URL / 平台 / 入口 URL 等                           |

### 接入示例（子应用侧）

```ts
/** 调用基座钉钉能力 */
function callBridge<T = any>(api: string, payload?: any, timeout = 30000): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const timer = setTimeout(() => {
      window.removeEventListener('message', handler)
      reject(new Error(`桥接超时: ${api}`))
    }, timeout)

    function handler(e: MessageEvent) {
      const msg = e.data
      if (msg?.source !== 'mbase-bridge' || msg?.type !== 'capability:result' || msg?.id !== id) return
      clearTimeout(timer)
      window.removeEventListener('message', handler)
      msg.ok ? resolve(msg.data) : reject(new Error(msg.reason || msg.error || '桥接调用失败'))
    }
    window.addEventListener('message', handler)
    window.parent.postMessage(
      { source: 'mbase-bridge', type: 'capability:invoke', id, api, payload },
      '*'
    )
  })
}

// 使用
const { images } = await callBridge<{ images: string[] }>('takePhoto', { max: 1 })
const loc = await callBridge<{ latitude: number; longitude: number }>('getLocation')
const { text } = await callBridge<{ text: string }>('scan', { type: 'qrCode' })
```

---

## 七、钉钉 JSAPI 鉴权

> 适用场景：用户在钉钉客户端内使用拍照、定位等敏感 JSAPI，前端必须先 `dd.config` 签名鉴权，否则报 `No permission info for action: ...`。

### 流程

```
前端(mbase)                         后端                         钉钉服务端
   │   GET /dingtalk/jsapi-signature   │                              │
   │       ?url=当前页面URL             │                              │
   │──────────────────────────────────►│                              │
   │                          (缓存) │── gettoken(AppKey/Secret) ──►│
   │                                 │◄────── access_token ────────│
   │                                 │  SHA1 计算 signature          │
   │◄── {agentId,corpId,timeStamp,nonceStr,signature} ─────────────│
   │  dd.config(...) → dd.ready → 调拍照/定位                       │
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

### 调用时机

- **不是进门户就鉴权**，用户首次点击拍照/定位时惰性触发 `dingtalkConfig()`
- webview 容器页 `onMounted` 时预鉴权一次，缓存复用（按签名 URL 缓存）
- 52013 签名错误自动用钉钉返回的 URL 重试；非敏感 API（扫码）无需鉴权

---

## 八、访客模式接入（免账号密码）

> 适用场景：访客预约、进出厂物资登记等业务，需要**外部人员（无系统账号）**在微信端直接使用。

### 流程

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

### 子应用改造（4 处小改动）

1. 新增常量 `VISITOR_MODE_KEY = 'h5_visitor_mode'`
2. URL 参数解析增加 `mode` 字段
3. 初始化时记录访客模式到 `sessionStorage`
4. 导出 `isVisitorMode()` 供业务控制显隐

```vue
<van-cell v-if="!visitor" title="隐患排查" /> <!-- 访客隐藏 -->
<van-cell title="访客预约" />                  <!-- 访客可见 -->
```

### 后端配合

1. 平台后台「客户端管理」新增访客专用客户端
2. scope 仅授予访客接口（如 `store_attach_view`、`store_attach_add`）
3. 将 `clientId/clientSecret` 提供给前端替换占位值

---

## 九、微信小程序 openid 分发（访客身份识别）

> 适用场景：微信小程序访客入口进入子应用（当前为智慧安防）时，子应用需要拿到微信 `openid`，用于识别同一访客并留存入场/登记记录。**仅微信小程序端生效**。

小程序前端只能通过 `uni.login` 拿到一次性 `code`，`code → openid` 必须由后端携带小程序 `appid` + `appsecret` 调微信 `jscode2session` 完成（`appsecret` 严禁放到前端或子应用 URL）。

### 流程

```
微信小程序 mbase
  │  用户点击「访客入口」进入工作台
  │  用户点击需要 openid 的子应用（当前：security/智慧安防）
  ▼
mbase 调 uni.login() 获取 code
  │
  │  GET /integrated/external/wx/getOpenId?code=<code>  ← 已上线，无需鉴权
  ▼
后端调微信 jscode2session(appid + appsecret + code)
  │  返回 { openid, unionid? }
  ▼
mbase 缓存 openid（独立 storage，不进入 user store）
  │  打开子应用 URL 时按需追加：&openid=<openid>
  ▼
安防子应用从 URL 读取 openid，用于访客登记/入场留存
```

### 应用级 opt-in（防止污染其它子应用）

openid 注入是**应用级 opt-in**，只有在 `src/config/portal-apps.ts` 中显式声明 `needWechatOpenid: true` 的应用才会收到：

```ts
{
  id: 'security',
  name: '智慧安防',
  visitorAccessible: true,
  needWechatOpenid: true, // 仅此应用会在微信小程序端收到 &openid=
}
```

未声明的应用永远不会被追加 `openid` 参数，避免身份信息误传、互相污染。

### 后端接口（已上线）

| 项   | 实际值                                                           |
| -------- | ---------------------------------------------------------------- |
| 方法     | `GET`                                                            |
| 路径     | `/integrated/external/wx/getOpenId`                              |
| 入参     | Query：`code`，必填。值来自 `uni.login()` 返回的 `code`          |
| 鉴权     | 无需鉴权（已验证）                                               |
| 返回     | 统一包裹格式 `{ "code": 200, "data": { "openid": "..." } }`      |

### 降级策略

后端接口未上线/失败/超时/未返回 openid：**不阻断进入子应用**，URL 只是不携带 `openid`，仍保留 `portal_token`、`from=portal` 等免登参数；错误仅在 mbase 控制台输出 warning。

---

## 十、公司上下文透传

> 适用场景：正式登录用户进入工作台后，基座获取该用户可访问的公司列表，用户选择当前公司，打开子应用时把公司上下文随 URL 一起传入。

### 门户侧公司来源

```http
GET /hrms/user/getCurUser
GET /hrms/user/getById?id=<getCurUser.data.user.id>
```

门户先通过 `getCurUser` 拿到当前用户 ID，再通过 `getById` 读取 `userOrganizeInfo`，转成 `{ id: companyId, name: companyName, deptId, deptName, main }[]`。

**兜底策略**：

- 正常：`getById` 返回 `userOrganizeInfo`，门户使用该列表
- 兜底：`getById` 因权限/网关失败，但 `getCurUser` 已在 `userStore.userInfo` 缓存了 `userOrganizeInfo`，门户用缓存恢复公司上下文
- 失败：两处都没有可用组织信息，门户展示明确错误（如 `/hrms/user/getById 获取失败：无权限访问`）

**默认选择规则**：优先用户上次选择且仍在列表内的公司 → 否则 `main === true` 主公司 → 否则列表第一项。当前选择按用户 ID 维度保存在本地，避免用户互相污染。

> 公司 ID 可能超过 JS 安全整数范围，前端和子应用都必须按字符串处理，不要转成 `number`。

### 子应用 URL 参数

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

### 子应用读取方式

```ts
const params = new URLSearchParams(window.location.search)

const portalToken = params.get('portal_token') || ''
const companyId = params.get('companyId') || ''
const companyName = params.get('companyName') || ''

if (portalToken) localStorage.setItem('portal_token', portalToken)
if (companyId) sessionStorage.setItem('portal_company_id', companyId)
if (companyName) sessionStorage.setItem('portal_company_name', companyName)

// 业务接口显式携带公司 ID
await request('/api/current-user/permissions', {
  headers: { Authorization: `Bearer ${portalToken}` },
  params: { companyId },
})
```

### 权限边界

`companyId` 是用户在门户选择的业务上下文，**不是权限证明**。子应用后端必须用 `portal_token + companyId` 再次校验该用户是否有该公司权限，据此返回菜单、按钮和数据范围。`companyName` 仅用于展示，不能做权限判断。如果子应用没收到 `companyId`，建议阻断进入业务首页并提示"缺少公司上下文，请从移动门户重新进入"。

---

## 十一、多环境配置

### 线上环境

| 环境 | 域名                      | API 前缀   |
| ---- | ------------------------- | ---------- |
| SIT  | `ytiop-sit.walsin.com.cn` | `/sit-api` |
| UAT  | `ytiop-uat.walsin.com.cn` | `/uat-api` |
| PRE  | `ytiop-pre.walsin.com.cn` | `/pre-api` |
| PRD  | `ytiop-prd.walsin.com.cn` | `/prd-api` |

> ⚠️ PRE 域名 / API 前缀为按规律推断的占位值，上线前需确认替换。

切换环境只需修改 `env/.env.*` 文件：

- `VITE_API_BASE_URL`：API 网关地址
- `VITE_DOMAIN`：子应用域名前缀（与 `mpPath` 拼接生成子应用完整 URL）

> `mpPath` 用于所有线上环境，运行时通过 `VITE_DOMAIN` 动态拼接完整 HTTPS 地址；`url` 字段仅用于开发环境 fallback。

### 开发环境（内网直连）

| 服务       | 地址                          | 说明               |
| ---------- | ----------------------------- | ------------------ |
| 移动端网关 | `http://172.28.99.172:9000`   | OAuth2 / JWT Token |
| 子应用 H5  | 本地 Vite 代理 `/mbase/aq` 等 | iframe 嵌入        |

### Nginx 配置示例

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

    # 钉钉消息单点跳转静态中转页（真实文件，必须能被直接命中）
    location = /mbase/relay.html {
        alias /path/to/dist/build/h5/relay.html;
    }

    # 子应用（按需添加）
    location /mbase/aq/ { alias /path/to/aq/; try_files $uri $uri/ /mbase/aq/index.html; }
    location /mbase/af/ { alias /path/to/af/; try_files $uri $uri/ /mbase/af/index.html; }
    location /mbase/hb/ { alias /path/to/hb/; try_files $uri $uri/ /mbase/hb/index.html; }
}
```

---

## 十二、安全注意事项

| 风险点                    | 当前策略 / 建议                                                                        |
| ------------------------- | -------------------------------------------------------------------------------------- |
| `portal_token` 明文在 URL | 内网 HTTPS 可接受；外网或更高安全级别建议改为短期一次性 code 换取                      |
| 消息 `redirect_url` 外跳  | `relay.html` 与 `dingtalk-redirect.ts` 只允许同源 + 已注册 `mpPath`，拦截跨域/未知路径 |
| iframe 嵌入任意 URL       | 工作台入口通过 `portal-apps.ts` 注册表打开；消息直达也走白名单                         |
| postMessage 来源校验      | 基座按当前 iframe origin + contentWindow 校验来源；子应用接收消息也应校验来源          |
| Token 有效期              | relay 检测本地 `tokenExpiresAt`，过期时回基座 SSO；长期建议接入子应用刷新协议          |
| 子应用登出不同步          | 通过 postMessage `action: logout` / `user-logout` 触发基座同步清理                     |
| `companyId` 被篡改        | 子应用后端必须用 `portal_token + companyId` 校验公司权限                               |
| `companyName` 被篡改      | 仅用于展示，不参与权限判断和数据范围过滤                                               |

### 维护约定

- 新增子应用时，先维护 `src/config/portal-apps.ts`，再同步 `public/relay.html` 的 `APP_PATHS`
- 不要在日志中打印完整带 `portal_token` 的子应用 URL；需要排查时只打印脱敏 URL 或 appId/companyId
- `src/pages/relay/index.vue` 是历史兼容入口；新消息配置统一使用 `/mbase/relay.html`

---

## 附录：钉钉 SSO 免登调用流程

> 适用场景：用户在钉钉客户端内打开 H5 应用，后端通过钉钉身份识别完成免登录。前端只负责获取 `authCode` 并传给后端，AppKey / AppSecret 只存在后端。

```
前端（钉钉客户端内）              后端                        钉钉服务器
       │                           │                              │
       │  JSAPI 获取 authCode       │                              │
       │──────── authCode ─────────►│                              │
       │                    Step 1 │── POST /oauth2/accessToken ──►│
       │                           │◄── { accessToken } ──────────│
       │                    Step 2 │── POST /user/getuserinfo ────►│
       │                           │◄── { userid, name, ... } ────│
       │                    Step 3 │  查本系统账号，签发系统 JWT    │
       │◄──── 系统 token ──────────│                              │
```

- **Step 1** `POST https://api.dingtalk.com/v1.0/oauth2/accessToken`：`{appKey, appSecret}` → `{accessToken, expireIn: 7200}`。建议后端缓存，设 7000 秒触发刷新。
- **Step 2** `POST https://oapi.dingtalk.com/topapi/v2/user/getuserinfo?access_token=<Step1>`：`{code: authCode}` → `{userid, name, ...}`。`authCode` 一次性有效，后端收到立即使用。
- **Step 3** 后端用 `userid`/手机号匹配本系统账号，签发 JWT 返回前端。

### 权限清单

| 权限点 Code         | 权限名称                               | 是否需要审批 | 用途                                             |
| ------------------- | -------------------------------------- | ------------ | ------------------------------------------------ |
| `open_app_api_base` | 获取钉钉开放接口用户访问凭证的基础权限 | 无需审批     | Step 1 换 token、Step 2 换用户信息（必须开通）   |
| `Contact.User.Read` | 通讯录个人信息读权限                   | 无需审批     | 查询用户手机号、头像、邮箱等详细信息（按需开通） |

开通：登录 [open-dev.dingtalk.com](https://open-dev.dingtalk.com) → 对应应用 → 权限管理 → 搜索权限点 Code → 申请权限（即时生效）。
