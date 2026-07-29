# 移动端 uniApp — H5 子应用集成方案

> 版本：v2.4 · 更新：2026-07-25
> 对应项目：移动端门户（wl-mbase）。本文说明基座对接外部 H5 子应用的 SSO 免登、消息单点跳转、JSAPI 桥接（跨端媒体 SDK）、钉钉 JSAPI 鉴权、访客模式、公司上下文、openid 分发全流程。

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
| 智慧设备 | `/mbase/sb` | 设备管理系统     | 拍照/上传/定位/扫码 |
| 智慧营销 | `/mbase/xs` | 营销管理系统     | 按需接入            |

> 智慧营销仅配置 `platforms: ['h5']`，用于钉钉和普通 H5 调试，不会出现在微信小程序或 App 工作台。

---

## 二、免登（SSO）实现原理

本项目有两层"免登"，不要混在一起看：

- **基座自身登录**：用户进入 wl-mbase。钉钉 H5 场景可通过 `requestAuthCode` 换系统 token，详见 [钉钉集成方案](/frontend/mobile-uniapp/dingtalk)。
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

> **核心原则：登录只在门户发生一次。** 用户已经在移动端登录，进入子应用时不应再看到任何登录界面。

### Token 使用方式

> 集成的 H5 是我们自己开发的，**优先选方式 A**；只有第三方 H5 才考虑方式 B。

**方式 A：直接复用（推荐，最简单）** — 子应用后端与门户共用同一套认证服务，直接把 `portal_token` 当 Bearer Token 用。

**方式 B：Token 交换（第三方 H5 适用）**

```
POST /auth/exchange
Body:     { portal_token: "xxx" }
Response: { token: "子应用自己的token", expires_in: 3600 }
```

---

## 三、钉钉消息单点跳转

> 本节只保留门户集成入口。消息模板、推送端、字段、状态、审批策略、测试和排障统一见 [移动端消息中心使用与架构说明](/frontend/mobile-uniapp/message-center)，不在两份文档中重复维护。

普通业务消息统一使用静态中转页（不要为新消息配置 `/mbase/pages/relay/index` 这类 SPA 深路径，该入口仅保留历史兼容）：

```text
https://{VITE_DOMAIN}/mbase/relay.html?redirect_url=<encodeURIComponent(子应用完整URL)>
```

### 运行链路

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

新增子应用时必须同时维护 `src/config/portal-apps.ts` 与 `public/relay.html` 的 `APP_PATHS`，子应用后端仍需校验 token 与公司权限。

### 审批流消息分流

待审批通知使用：

```text
https://{VITE_DOMAIN}/mbase/relay.html?target=flow&provider=platform&templateCode=FLOW_COMMENTS&id=<instanceId>&commentId=<commentId>&messageId=<messageId>&returnUrl=<encodeURIComponent(移动端业务URL)>
```

当前静态中转页只把 `FLOW_COMMENTS` 直接交给基座审批详情；其它 `FLOW_*` 按临时安全域规则或 `returnUrl` 处理。基座内部消息中心可读取所有带有效流程参数的 `FLOW_*`。两条入口的现状差异、`FLOW_REFUSE` 重新发起和迁移要求以 [消息中心说明](/frontend/mobile-uniapp/message-center) 为准。

### 白名单与新增子应用

当前允许消息直达的路径：`/mbase/aq/`、`/mbase/af/`、`/mbase/hb/`、`/mbase/sb/`、`/mbase/xs/`。新增子应用时必须同步维护：

1. `src/config/portal-apps.ts`：注册子应用
2. `public/relay.html`：把新 `mpPath` 加入 `APP_PATHS`，否则钉钉消息直达会被安全拦截
3. 子应用后端：继续使用 `portal_token + companyId` 校验公司权限

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
  // 智慧营销仅配置 platforms: ['h5']，用于钉钉和普通 H5 调试
  // 更多子应用 ...
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

后续待做：

| 任务               | 优先级 | 说明                                                     |
| ------------------ | ------ | -------------------------------------------------------- |
| Token 过期自动刷新 | 高     | 子应用 iframe 内收到 401 → 通知门户刷新 token → 重新加载 |
| 子应用列表维护     | 中     | 后端不提供接口，直接维护 `src/config/portal-apps.ts`     |

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

### 5.2 可选接入（体验更好）

#### ⑤ 页面标题同步给门户

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

### 5.3 不需要改

- 子应用自己的普通业务接口 — 照常工作；涉及公司数据/权限的接口需接收并校验 `companyId`
- 子应用自己的 UI/样式 — iframe 完全隔离
- 子应用内部路由 — 照常工作，门户不感知

---

## 六、桥接通信协议

子应用运行在 iframe 内，受安全策略限制无法直调钉钉 JSAPI。由基座统一调用 JSAPI，通过 `postMessage` 桥接回传结果。**新接入优先使用下面的跨端媒体 SDK；原始 `mbase-bridge` postMessage 协议仅作存量兼容与排障。**

### 推荐：使用跨端媒体 SDK

需要"拍摄 / 从手机相册选择"的子应用统一接入基座媒体 SDK。子应用负责按钮、底部弹层、预览、删除和业务校验；基座负责识别运行环境并完成相机、相册和上传能力调用。

#### 接入约定

1. 在子应用 `index.html` 中加载基座脚本。生产部署与基座同源时固定使用 `/mbase/sdk/portal-media.js`。
2. 如需 TypeScript 类型提示，将基座的 `public/sdk/portal-media.d.ts` 复制到子应用 `src/types/portal-media.d.ts`，并确保该目录被 `tsconfig.json` 包含。
3. 跨端直传时，`url` 必须传各环境可直接访问的**完整 HTTPS 上传地址**，不要把 `/api/files/upload` 一类相对路径作为跨端契约。
4. 业务上传接口必须支持 `POST multipart/form-data`，图片字段统一接收 `file`；`formData` 中的字段按普通表单字段接收。
5. 上传接口应返回 HTTP 2xx。建议返回 JSON，SDK 会把解析后的响应放在 `results[n].data`。
6. 不要在 `header` 中手动设置 `Content-Type: multipart/form-data`，浏览器或钉钉客户端需要自动生成 multipart boundary。
7. `max` 有效范围为 1～9，省略时默认为 1。当前多图上传采用整体成功/失败语义，首批接入建议使用 `max: 1`；如允许多选，业务后端应具备幂等或去重能力。
8. 钉钉 iframe 模式下，SDK 会从 `document.referrer` 推导基座来源。子应用不要配置 `Referrer-Policy: no-referrer`；如企业安全策略必须隐藏 referrer，应先联系平台维护人员调整桥接方案。

加载 SDK：

```html
<script src="/mbase/sdk/portal-media.js"></script>
```

> SDK 加载路径分两种情况：
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

#### 完整 Vue 3 子应用示例

下面的组件演示业务页面自行提供"拍摄 / 从手机相册选择"交互，并统一把图片上传到业务后端。示例不依赖基座 UI 组件，可直接改造成现有上传组件的事件处理函数。

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

两种 API 的用途：

| API                     | 推荐场景             | 关键返回值                                   |
| ----------------------- | -------------------- | -------------------------------------------- |
| `chooseImage`           | 临时预览、业务暂存   | `mode/source/files`                          |
| `chooseImageAndUpload`  | 业务附件持久化       | `mode/source/uploaded/results`               |
| `results[n].data`       | 读取业务服务端响应   | JSON 响应会被解析；非 JSON 响应保留为字符串  |
| `results[n].statusCode` | 判断单个文件上传状态 | HTTP 状态码                                  |
| `results[n].rawData`    | 排查原始响应         | 原始响应文本，不建议直接作为业务数据长期保存 |

本地选择结果带 `mode: 'local'`，钉钉桥结果带 `mode: 'bridge'`。业务需要保存附件时统一使用 `chooseImageAndUpload`，不要尝试在子应用 iframe 中 `fetch` 钉钉虚拟路径。

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

| `error.code`     | 含义                         | 子应用处理建议                         |
| ---------------- | ---------------------------- | -------------------------------------- |
| `cancelled`      | SDK 已识别到用户主动取消     | 静默结束，不提示"系统异常"             |
| `invalid_source` | `source` 不是规定值          | 修正调用参数                           |
| `invalid_url`    | 上传地址为空                 | 修正业务配置                           |
| `unsupported`    | 当前页面环境不支持文件选择   | 提示用户更换支持的客户端               |
| `bridge_timeout` | 钉钉能力桥超时               | 允许重试，并记录客户端与页面信息       |
| `invoke_failed`  | 钉钉 JSAPI 或原生上传失败    | 展示可读错误，结合 `debugInfo` 排查    |
| `upload_failed`  | 普通 H5 等本地模式上传非 2xx | 展示上传失败，检查接口、鉴权和文件限制 |

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

#### 子应用验收清单

| 场景               | 验收要点                                                                 |
| ------------------ | ------------------------------------------------------------------------ |
| 配置检查           | 各环境使用完整 HTTPS 上传地址；没有硬编码其他环境域名；相对路径不得上线 |
| 钉钉 Android 拍摄  | 只打开相机；上传成功；服务端收到 `file` 和业务表单字段                   |
| 钉钉 Android 相册  | 只打开相册；取消不产生附件记录；上传成功                                 |
| 钉钉 iOS 拍摄/相册 | 两种来源分别可用；原生上传成功；服务端正确解析 multipart                 |
| 微信小程序 WebView | 选择器可打开；取消和选中行为正常；选中后上传成功                         |
| 普通浏览器 H5      | 本地选择、预览和上传正常；跨域时 CORS 预检通过                           |
| 异常与安全         | 401、超限和非图片有明确提示；服务端拒绝非法文件；日志不输出完整 Token    |
| 多图（如启用）     | 部分上传失败时可安全重试，不产生重复附件；服务端具备幂等或去重能力       |
| 旧能力回归         | 未接入 SDK 的页面不受影响；`takePhoto/takePhotoAndUpload` 仍只拍照       |

钉钉侧必须分别使用 Android 和 iOS 真机验收，不能只用桌面浏览器或钉钉开发者工具代替。建议将钉钉 7.0.10 及以上作为原生 `uploadFile` 的验收基线（参见[钉钉官方 JSAPI Explorer](https://open.dingtalk.com/tools/explorer/jsapi?id=10281)）；若项目需要支持更低版本，应先完成对应版本真机测试，再确定兼容范围。

### 底层协议：直接调用钉钉能力桥（仅存量兼容/排查）

新接入必须优先使用上面的媒体 SDK。只有存量项目暂时无法加载 SDK、且明确只运行在钉钉 iframe 内时，才直接使用以下 `postMessage` 协议，并与平台维护人员确认。自行实现时必须同时满足：

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

#### 能力调用

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

#### 能力结果

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

#### 支持的能力列表

| api                    | 说明                    | payload                                     | 返回 data                                               |
| ---------------------- | ----------------------- | ------------------------------------------- | ------------------------------------------------------- |
| `takePhoto`            | 拍照（含 iOS 降级策略） | `{ max, uploadConfig? }`                    | `{ images: string[] }` 或 `{ uploaded: true, results }` |
| `takePhotoAndUpload`   | 拍照直传后端            | `{ max, url, formData?, header? }`          | `{ results: any[] }`                                    |
| `chooseImage`          | 从指定来源选择图片      | `{ source, max? }`                          | `{ source, files: { path, size?, fileType? }[] }`       |
| `chooseImageAndUpload` | 从指定来源选择并直传    | `{ source, max?, url, formData?, header? }` | `{ source, uploaded: true, results: any[] }`            |
| `getLocation`          | 获取定位                | 无                                          | `{ latitude, longitude, accuracy, address }`            |
| `scan`                 | 扫一扫                  | `{ type: 'qrCode'\|'barCode'\|'all' }`      | `{ text: string }`                                      |
| `debugInfo`            | 获取诊断信息            | 无                                          | 签名 URL / 平台 / 入口 URL 等                           |

其中 `source` 必须由子应用根据自己的交互明确传入：

- `camera`：只调起相机。
- `album`：只从手机相册选择。

原有 `takePhoto`、`takePhotoAndUpload` 是兼容接口，仍固定使用相机，不会因为新增相册能力而变成系统二选一。`chooseImage` 返回的是钉钉本地虚拟路径，仅供钉钉客户端识别，不得作为持久化地址或使用 `fetch` 读取；需要提交业务附件时优先使用 `chooseImageAndUpload`，由钉钉原生 `uploadFile` 直传后端。

#### iframe 普通消息

```js
const MBASE_ORIGIN = new URL(import.meta.env.VITE_MBASE_ORIGIN).origin

window.parent.postMessage({ title: '页面标题' }, MBASE_ORIGIN)
window.parent.postMessage({ action: 'logout' }, MBASE_ORIGIN)
window.parent.postMessage({ action: 'user-logout' }, MBASE_ORIGIN)
```

#### 接入示例（子应用侧）

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

const loc = await callBridge<{ latitude: number; longitude: number }>(
  'getLocation'
)
const { text } = await callBridge<{ text: string }>('scan', { type: 'qrCode' })
```

---

## 七、钉钉 JSAPI 鉴权

> 适用场景：用户在钉钉客户端内使用拍照、定位等敏感 JSAPI，前端必须先 `dd.config` 签名鉴权，否则报 `No permission info for action: ...`。完整签名计算、高频错误与自测建议见 [钉钉集成方案](/frontend/mobile-uniapp/dingtalk)。

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

### 调用时机

- 进入钉钉子应用 webview 容器页后，`onMounted` 会预鉴权一次；进入门户首页本身不会触发这次设备能力鉴权。
- 拍照、相册或定位调用会复用按签名 URL 缓存的鉴权结果；预鉴权尚未完成或缓存失效时，能力调用会再次等待/触发鉴权。
- 非敏感 API（扫码 `biz.util.scan`）无需鉴权，只做 `loadJSAPI() + dd.ready`。

### 运维清单

1. 注入环境变量 `DINGTALK_APP_SECRET`
2. 服务器能访问外网 `https://oapi.dingtalk.com`
3. 钉钉后台：门户微应用已开通拍照、相册、文件上传和定位所需的 JSAPI 权限
4. 钉钉后台安全域名白名单包含各环境基座域名，以及原生上传目标域名（如企业策略要求）
5. Android、iOS 分别使用真机验收；建议以钉钉 7.0.10 及以上作为 `uploadFile` 验收基线，版本说明见[钉钉官方 JSAPI Explorer](https://open.dingtalk.com/tools/explorer/jsapi?id=10281)
6. 上传域名使用有效 HTTPS 证书，且业务后端按 Token 校验用户、公司和附件归属

---

## 八、访客模式接入（免账号密码）

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

## 九、微信小程序 openid 分发（访客身份识别）

> 适用场景：微信小程序访客入口进入子应用（当前为智慧安防）时，子应用需要拿到微信 `openid`，用于识别同一访客并留存入场/登记记录。
>
> 该能力**仅微信小程序端生效**；钉钉/H5/App 不参与、不注入、不受影响。

### 9.1 为什么必须后端配合

小程序前端只能通过 `uni.login`（底层 `wx.login`）拿到一次性 `code`，不能直接拿到 `openid`。`code → openid` 必须由后端携带小程序 `appid` + `appsecret` 调微信 `jscode2session` 完成。

> `appsecret` 是小程序密钥，**严禁放到前端或子应用 URL**。

> ✅ **已验证（2026-06）**：后端接口 `GET /integrated/external/wx/getOpenId?code=` 已上线，无需鉴权，调微信侧链路正常。前端已完成对齐。

### 9.2 最佳实践流程

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

### 9.3 门户侧开关（防止污染其它子应用）

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

### 9.4 后端接口说明（已上线）

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

### 9.5 接口未就绪时的降级策略

门户侧已做降级：

- 后端接口未上线、失败、超时、未返回 openid：**不阻断进入子应用**。
- 子应用 URL 只是不携带 `openid`，仍保留 `portal_token`、`from=portal` 等免登参数。
- 错误仅在 mbase 控制台输出 warning，不影响普通登录、访客 token、其它应用展示。

### 9.6 子应用如何获取和使用

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

### 9.7 与钉钉能力桥的边界

| 场景                | 通信方式                   | 适用能力                | 是否携带 openid      |
| ------------------- | -------------------------- | ----------------------- | -------------------- |
| 钉钉 H5/iframe      | `mbase-bridge` postMessage | 拍照、定位、扫码        | 否                   |
| 微信小程序 web-view | 打开 URL 时追加 query      | 免登 token、访客 openid | 是（仅 opt-in 应用） |

不要把微信 openid 放进钉钉 `mbase-bridge`；不要在非微信端追加 openid；不要让未声明的子应用拿到 openid。

---

## 十、公司上下文透传

> 适用场景：正式登录用户（含钉钉免登、普通 H5 登录）进入工作台后，基座获取该用户可访问的公司列表，用户在工作台选择当前公司，打开子应用时把公司上下文随 URL 一起传入。

### 10.1 门户侧公司来源

工作台进入后使用登录态获取当前用户与组织信息：

```http
GET /hrms/user/getCurUser
GET /hrms/user/getById?id=<getCurUser.data.user.id>
```

两个接口都需要携带 `Authorization: Bearer <portal_token>`。门户先通过 `getCurUser` 拿到当前用户 ID，再通过 `getById` 读取该用户维护在平台里的 `userOrganizeInfo`。`/hrms/company/getCompanyIdNameMap` 仍作为公司基础字典接口保留，用于公司 ID 名称映射、登录页字典等公共场景；移动工作台公司展示和切换以 `userOrganizeInfo` 为准。

兜底策略：

- 正常路径：`/hrms/user/getById?id=<当前用户ID>` 成功返回 `userOrganizeInfo`，门户使用该列表。
- 兜底路径：如果 `getById` 因权限或网关问题失败，但 `getCurUser` 已经在 `userStore.userInfo` 中缓存了当前用户的 `userOrganizeInfo`，门户会使用缓存恢复公司上下文，避免工作台出现"公司未获取"。
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

当前选择会按用户 ID 维度保存在本地，避免 A 用户选择的公司污染到 B 用户。若 `userOrganizeInfo` 为空，门户会提示"该账号未在平台绑定公司"；若接口异常且没有缓存可兜底，会明确提示是 `/hrms/user/getCurUser` 还是 `/hrms/user/getById` 获取失败，便于定位后端或登录态问题。

### 10.2 子应用 URL 参数

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

### 10.3 子应用读取方式

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

### 10.4 权限边界

`companyId` 是用户在门户选择的业务上下文，不是权限证明。子应用后端必须使用 `portal_token + companyId` 再次校验该用户是否有该公司权限，并据此返回菜单、按钮和数据范围。

`companyName` 只用于展示，例如页面顶部显示当前公司名称。不要用 `companyName` 做权限判断，也不要把它当作后端可信参数。

如果子应用没有收到 `companyId`，建议阻断进入业务首页并提示"缺少公司上下文，请从移动门户重新进入"，避免用户在错误公司或默认数据下继续操作。

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

    # 钉钉消息单点跳转静态中转页
    # relay.html 是真实文件，必须能被 /mbase/relay.html 直接命中；
    # 不要把它只配置成 SPA 深路径，否则钉钉消息点击可能绕不开 Nginx fallback 问题。
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

- 新增子应用时，先维护 `src/config/portal-apps.ts`，再同步 `public/relay.html` 的 `APP_PATHS`。
- 不要在日志中打印完整带 `portal_token` 的子应用 URL；需要排查时只打印脱敏 URL 或 appId/companyId。
- 如果将来允许跨域子应用，不能简单放开 `redirect_url`，需要引入显式可信域名配置、短期 code 换 token，以及子应用侧 CSRF/来源校验。
- `src/pages/relay/index.vue` 是历史兼容入口；新消息配置统一使用 `/mbase/relay.html`。

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
