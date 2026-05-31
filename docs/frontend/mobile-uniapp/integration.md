# 移动端门户 · H5 子应用集成方案

> 版本：v1.1 · 更新：2026-05-29
> 适用范围：移动端门户（wl-mbase）对接 H5 子应用的 SSO 免登集成全流程

---

## 一、现状与过渡计划

### 当前状态

| 项目        | 路径规范    | SIT 完整地址                               | 说明                         |
| ----------- | ----------- | ------------------------------------------ | ---------------------------- |
| 移动端门户  | `/mbase/`   | `https://ytiop-sit.walsin.com.cn/mbase/`   | OAuth2 登录，JWT Token       |
| 智慧安全 H5 | `/mbase/aq` | `https://ytiop-sit.walsin.com.cn/mbase/aq` | 统一路径规范，iframe 嵌入    |
| 智慧安防 H5 | `/mbase/af` | `https://ytiop-sit.walsin.com.cn/mbase/af` | 同上                         |
| 智慧环保 H5 | `/mbase/hb` | `https://ytiop-sit.walsin.com.cn/mbase/hb` | 同上                         |

### 集成方式

```
移动端门户登录（OAuth2）
  → 获取 portal_token（access_token）
  → 用户点击工作台子应用图标
  → 拼接 URL：https://{VITE_DOMAIN}/mbase/aq?portal_token=xxx&user_id=yyy&from=portal
  → H5/App 端：原生 <iframe> 嵌入（position:fixed，全屏覆盖导航栏以下区域）
  → 小程序端：<web-view> 组件加载
```

### 过渡原则

- **所有环境**统一使用 `/mbase/{子应用缩写}` 路径规范，通过 `VITE_DOMAIN` 动态拼接域名
- **外网就绪后**：只需修改 env 文件中的 `VITE_DOMAIN`，无需改代码

---

## 二、整体架构方案

### 推荐架构（服务隔离）

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
  └─ 透传业务请求 → 复用 PC 后端服务（hrms / safety / security 等）

子应用 H5（智慧安全、智慧安防、智慧环保）
  └─ 接收 portal_token → 换取本系统 Token（或直接用）→ 调用自己业务接口
```

### 方案可行性分析

| 关注点   | 结论    | 说明                                                  |
| -------- | ------- | ----------------------------------------------------- |
| 域名隔离 | ✅ 推荐 | `mobile.xxx.com` vs. `pc.xxx.com`，互不干扰           |
| 网关隔离 | ✅ 推荐 | 移动网关独立部署，Token scope 不同，防越权            |
| 服务复用 | ✅ 可行 | 业务接口（hrms、safety 等）移动/PC 共用，无需重复开发 |
| 权限隔离 | ✅ 必须 | 移动端菜单权限独立维护（移动端功能集是 PC 的子集）    |
| 外网扩展 | ✅ 平滑 | Nginx 加外网入口，网关逻辑不变，只改证书/域名         |

> **当前阶段（内网）**：直连 IP，跳过 Nginx 分流这层，其余逻辑完全一致，方便后续平滑切换。

---

## 三、H5 子应用免登（SSO）原理

### 完整流程

```
① 用户在移动端门户完成 OAuth2 登录
     ↓ 获得 access_token（portal_token）

② 用户点击工作台子应用图标
     ↓
③ 门户（portal-apps.ts + buildAppUrl）拼接跳转 URL
     https://{VITE_DOMAIN}/mbase/aq?portal_token=<token>&user_id=<id>&from=portal
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
> 子应用自己的登录页对内部用户来说完全废弃，不展示、不提示。

### Token 使用方式

> 集成的 H5 是我们自己开发的，**优先选方式 A**；只有第三方 H5（认证体系与门户完全独立）才考虑方式 B。

**方式 A：直接复用（推荐，最简单）**

子应用后端与门户共用同一套认证服务，直接把 `portal_token` 当 Bearer Token 用。H5 解析出用户信息后直接进首页。

```javascript
// 子应用 login 页
const urlParams = new URLSearchParams(window.location.search)
const portalToken = urlParams.get('portal_token')
const userId = urlParams.get('user_id')

if (portalToken) {
  store.setToken(portalToken)
  store.setUserId(userId)
  router.replace('/home')
  return // 阻止登录组件继续渲染
}
```

**方式 B：Token 交换（第三方 H5 适用）**

子应用后端提供一个专用接口，与门户 Token 解耦：

```
POST /auth/exchange
Body:     { portal_token: "xxx" }
Response: { token: "子应用自己的token", expires_in: 3600 }
```

---

## 四、门户侧配置（mbase 负责）

### 4.1 子应用注册 `portal-apps.ts`

新增子应用仅需在 `src/config/portal-apps.ts` 追加一条配置：

```typescript
export const PORTAL_APPS: PortalApp[] = [
  {
    id: 'safety',
    name: '智慧安全',
    description: '安全生产管理系统',
    icon: '🔒',
    iconBg: 'linear-gradient(135deg, #667eea, #764ba2)',
    url: 'https://ytiop-sit.walsin.com.cn/mbase/aq',  // SIT 环境
    mpPath: '/mbase/aq',                               // 线上环境，动态拼接 VITE_DOMAIN
    devProxyPath: '/mbase/aq',                         // 本地 Vite 代理
    roles: ['*'],                                      // 可见角色，'*' 全部
    enabled: true,
    sort: 1,
  },
  // ... 更多子应用
]
```

### 4.2 各配置项说明

| 字段          | 说明                                                       |
| ------------- | ---------------------------------------------------------- |
| `id`          | 唯一标识，用于路由参数和日志                               |
| `url`         | H5 首页地址（SIT/生产），App/H5 端使用                     |
| `mpPath`      | 线上路径，运行时与 `VITE_DOMAIN` 动态拼接完整 HTTPS 地址   |
| `devProxyPath`| 开发代理路径，Vite DevServer 转发并剔除 X-Frame-Options    |
| `roles`       | 可见角色列表，`['*']` 全部可见，支持精确角色控制           |
| `enabled`     | 是否显示在工作台，false 则隐藏                             |
| `sort`        | 排序权重，数字越小越靠前                                   |

门户会通过 `buildAppUrl()` 自动追加认证参数：

```
{mpPath}?portal_token={access_token}&user_id={userId}&from=portal
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

- [x] `src/config/portal-apps.ts`：配置子应用列表（url、mpPath、name、enabled）
- [x] `buildAppUrl(app, token, userId)`：自动拼接 `portal_token`、`user_id`、`from=portal`
- [x] `src/pages/index/index.vue`：点击应用图标 → 传参跳转 webview 页
- [x] `src/pages/webview/index.vue`：原生 `<iframe>` 全屏嵌入，支持 postMessage 双向通信

### 4.5 后续待完成

| 任务               | 优先级 | 说明                                                          |
| ------------------ | ------ | ------------------------------------------------------------- |
| Token 过期自动刷新 | 高     | 子应用 iframe 内收到 401 → 通知门户刷新 token → 重新加载      |
| 子应用白名单校验   | 中     | 防止通过 url 参数嵌入任意第三方页面                           |

---

## 五、子应用侧改造清单（H5 负责）

> **核心思路：登录入口只有一个，就是门户。**
> H5 子应用的登录页对内部用户完全废弃。用户进入 H5 时已经是登录状态，
> 子应用只需认证头部（token），不需要再论登录。

### 5.1 必须改（否则免登不生效）

#### ① 移动端入口路径：子应用统一部署在 `/mbase/{缩写}` 路径下

基座统一命名规范，所有子应用的移动端入口路径为：

```
/mbase/{项目缩写}
```

| 子应用   | mpPath      | SIT 完整地址                               |
| -------- | ----------- | ------------------------------------------ |
| 智慧安全 | `/mbase/aq` | `https://ytiop-sit.walsin.com.cn/mbase/aq` |
| 智慧安防 | `/mbase/af` | `https://ytiop-sit.walsin.com.cn/mbase/af` |
| 智慧环保 | `/mbase/hb` | `https://ytiop-sit.walsin.com.cn/mbase/hb` |

**子应用 vite 构建配置要求：**

- `vite.config` 的 `base` 设置为 `/mbase/{缩写}`（如 `/mbase/aq`）
- `vue-router` 的 `createWebHistory` base 设置为 `/mbase/{缩写}`
- `build.outDir` 设置为子应用缩写（如 `aq`），部署时放到 `/mbase/` 目录下

#### ② Login 入口：检测到 `portal_token` 就直接进首页，不展示登录界面

```javascript
// 在 login 页面或入口页面的 mounted / created 生命周期中
// 「第一件事」就是检测 portal_token，存在则立即换到首页，登录组件根本不渲染
const urlParams = new URLSearchParams(window.location.search)
const portalToken = urlParams.get('portal_token')
const userId = urlParams.get('user_id')

if (portalToken) {
  // 方式A：直接用 portal_token 设置本系统认证状态
  store.setToken(portalToken)
  store.setUserId(userId)
  router.replace('/home') // 进首页，登录页内容不显示
  return // 防止登录页组件继续执行（不渲染登录表单）
}
// portalToken 不存在时，正常展示内部登录界面（内部调试用）
```

#### ③ 路由守卫：深链接进入时不强制跳登录页

```javascript
router.beforeEach((to, from, next) => {
  const hasPortalToken = new URLSearchParams(window.location.search)
    .has('portal_token')
  if (!store.token && !hasPortalToken) {
    next('/login')
  } else {
    next()
  }
})
```

#### ④ 允许被 iframe 嵌入（nginx 配置）

确保子应用 nginx 不发送 `X-Frame-Options: DENY` 或 `SAMEORIGIN`：

```nginx
# 删除或注释掉以下行
# add_header X-Frame-Options SAMEORIGIN;

# 如果需要限制只允许门户域名嵌入，改为：
add_header Content-Security-Policy "frame-ancestors 'self' http://172.28.99.172:1999 https://ytiop-sit.walsin.com.cn";
```

### 5.2 建议改（体验更好）

#### ⑤ Token 优先存入 `sessionStorage`

避免跨域 iframe 第三方 Cookie 失效（iOS Safari 等场景）：

```javascript
// 推荐：sessionStorage 优先，Cookie 兜底
sessionStorage.setItem('token', portalToken)
// 不建议仅依赖 Cookie（第三方 Cookie 在 iOS Safari 等场景下会被阻止）
```

#### ⑥ 页面标题同步给门户

门户 webview 页面会监听 `postMessage`，子应用可以把当前页面标题传过去：

```javascript
router.afterEach(to => {
  window.parent.postMessage({ title: to.meta.title || document.title }, '*')
})
```

#### ⑦ 会话过期通知门户

```javascript
// 接口返回 401 时，通知门户处理
window.parent.postMessage({ action: 'logout' }, '*')
// 门户收到后：提示"子应用会话过期"并返回工作台，不清除门户登录态
```

### 5.3 不需要改

- 子应用自己的业务接口 — 无需改造，继续走自己的接口
- 子应用自己的 UI/样式 — 门户只是 iframe 嵌入，完全样式隔离
- 子应用内部路由 — 照常工作，门户不感知子应用内页面切换

---

## 六、门户 webview 容器行为说明

`src/pages/webview/index.vue` 是子应用的统一容器，不同平台渲染方式不同：

| 平台       | 嵌入方式            | 特殊处理                                          |
| ---------- | ------------------- | ------------------------------------------------- |
| 微信小程序 | `<web-view>` 独占页 | 无自定义导航栏，系统自带返回按钮                  |
| App        | `<web-view>` 组件   | 自定义玻璃态导航栏 + 进度条                       |
| H5/钉钉   | 原生 `<iframe>`     | 自定义导航栏；钉钉环境隐藏导航栏（原生提供）      |

**webview 容器监听以下 postMessage 消息：**

| 消息类型                  | 门户行为                                            |
| ------------------------- | --------------------------------------------------- |
| `{ title: '...' }`       | 更新导航栏标题                                      |
| `{ action: 'logout' }`   | 提示"子应用会话过期"并返回工作台，不清除门户登录态  |

---

## 七、特殊情况：早期 H5 只用平台角色、自管权限

> 针对"角色用咱平台的，但权限是它们自己内部管控"的早期 H5 应用。

### 特征

- 登录身份（用户是谁）来自门户
- 但菜单、按钮、数据权限由子应用自己决定，不接入门户的权限体系

### 改造范围

| 改造项                        | 是否需要   | 说明                                |
| ----------------------------- | ---------- | ----------------------------------- |
| 移动端入口路径 `/mbase/{缩写}` | **需要**   | 基座统一规范，必须配                |
| Login 入口检测 `portal_token` | **需要**   | 免登的最低要求，必须做              |
| Token 换取 / 直接复用         | 视情况     | 至少能知道"当前用户是谁"（user_id） |
| 向门户同步页面标题            | 可选       | 建议做，体验更好                    |
| 接入门户菜单权限接口          | **不需要** | 子应用自己管控，门户不干涉          |
| 修改业务接口                  | **不需要** | 照常                                |

### 最小改造示例（仅免登，权限完全自管）

```javascript
// 入口页 mounted
mounted() {
  const p = new URLSearchParams(location.search)
  if (p.get('from') === 'portal' && p.get('portal_token')) {
    // 只需知道是哪个用户，权限由本系统根据 user_id 自行决定
    this.$store.commit('SET_USER_ID', p.get('user_id'))
    this.$store.commit('SET_TOKEN', p.get('portal_token'))
    this.$router.replace('/home')
  }
}
```

---

## 八、内网 → 外网切换配置指引

### 8.1 门户配置变更

修改 `env/.env.production`：

```ini
# 内网
VITE_API_BASE_URL=http://172.28.99.172:9000

# 外网（当前 SIT 环境）
VITE_API_BASE_URL=https://ytiop-sit.walsin.com.cn/sit-api
```

修改 `src/config/portal-apps.ts`：

```typescript
// 所有环境统一使用 mpPath，通过 VITE_DOMAIN 动态拼接
{ id: 'safety', url: 'https://ytiop-sit.walsin.com.cn/mbase/aq', mpPath: '/mbase/aq', devProxyPath: '/mbase/aq', ... }
```

> **说明**：`mpPath` 用于所有线上环境（SIT/UAT/PRD），运行时通过 `VITE_DOMAIN` 动态拼接完整 HTTPS 地址。`url` 字段仅用于开发环境 fallback。

修改 `src/manifest.json`（小程序发布时）：

```json
"mp-weixin": {
  "setting": { "urlCheck": true }  // 发布时必须开启
}
```

### 8.2 微信公众平台配置

| 配置项               | 需要添加的域名                                          |
| -------------------- | ------------------------------------------------------- |
| request 合法域名     | `https://ytiop-sit.walsin.com.cn`（API 域名）           |
| webview 业务域名     | 各子应用域名（安全、安防、环保等）                      |
| downloadFile 合法域名| `https://at.alicdn.com`（wot-design-uni 图标字体）      |

### 8.3 钉钉开放平台配置

- **微应用首页 URL**：`https://ytiop-sit.walsin.com.cn/mbase/`（H5 部署地址）
- **JSAPI 安全域名**：与微应用首页同域名

### 8.4 Nginx 外网入口示例

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

    # 门户 H5 静态资源
    location /mbase/ {
        alias /path/to/dist/build/h5/;
        index index.html;
        try_files $uri $uri/ /mbase/index.html;
    }

    # 子应用（智慧安全）
    location /mbase/aq/ {
        alias /path/to/aq/;
        index index.html;
        try_files $uri $uri/ /mbase/aq/index.html;
    }

    # 子应用（智慧安防）
    location /mbase/af/ {
        alias /path/to/af/;
        index index.html;
        try_files $uri $uri/ /mbase/af/index.html;
    }

    # 子应用（智慧环保）
    location /mbase/hb/ {
        alias /path/to/hb/;
        index index.html;
        try_files $uri $uri/ /mbase/hb/index.html;
    }
}
```

### 8.5 CORS 配置

外网环境下，子应用后端需允许门户域名跨域：

```
Access-Control-Allow-Origin: https://ytiop-sit.walsin.com.cn
Access-Control-Allow-Credentials: true
```

---

## 九、安全注意事项

| 风险点                    | 建议                                                                                         |
| ------------------------- | -------------------------------------------------------------------------------------------- |
| `portal_token` 明文在 URL | 内网可接受；外网建议改为 HTTPS + 短期一次性 code 换取（参考 OAuth2 Authorization Code Flow） |
| iframe 嵌入任意 URL       | 门户 `webview/index.vue` 应在白名单内校验 `url` 参数，防止 XSS                               |
| postMessage 来源校验      | 子应用接收门户消息时加 `event.origin` 白名单校验                                             |
| Token 有效期              | 建议移动端 Token 有效期短（2h），配合静默刷新；子应用 token 同步刷新                         |
| 子应用登出不同步          | 建议通过 postMessage `action: logout` 触发门户一起清理状态                                   |
| HTTPS 强制                | 外网全链路强制 HTTPS；小程序审核要求所有网络请求使用 HTTPS                                   |
| Client Secret 安全性      | UniApp 编译产物中 client_secret 可见，属于"公开客户端"固有限制，建议后续改为 public client   |

---

## 附录：钉钉 SSO 免登完整调用流程

> 适用场景：用户在钉钉客户端内打开 H5 应用，后端通过钉钉身份识别完成免登录。
> 前端只负责获取 `authCode` 并传给后端，AppKey / AppSecret 只存在后端，不经过前端。

### 整体流程图

```
前端（钉钉客户端内）              后端                        钉钉服务器
       │                           │                              │
       │  JSAPI 获取 authCode       │                              │
       │──────── authCode ─────────►│                              │
       │                           │                              │
       │                    Step 1 │── POST /oauth2/accessToken ──►│
       │                           │◄── { accessToken } ──────────│
       │                           │                              │
       │                    Step 2 │── POST /user/getuserinfo ────►│
       │                           │◄── { userid, name, ... } ────│
       │                           │                              │
       │                    Step 3 │  查本系统账号，签发系统 JWT    │
       │◄──── 系统 token ──────────│                              │
```

### Step 1：获取应用 accessToken

后端调用，与前端无关。建议缓存结果，有效期内不重复调用。

```
POST https://api.dingtalk.com/v1.0/oauth2/accessToken
Content-Type: application/json
```

请求体：

```json
{
  "appKey": "<应用的 AppKey>",
  "appSecret": "<应用的 AppSecret>"
}
```

成功响应：

```json
{
  "accessToken": "<应用级访问凭证>",
  "expireIn": 7200
}
```

> - `accessToken` 有效期 **7200 秒（2 小时）**，有效期内重复调用返回同一个值并自动续期
> - 建议后端缓存，设置 **7000 秒**过期触发刷新，避免频繁请求被限流
> - 此接口**无需额外权限**，应用创建后默认可调用

### Step 2：用 authCode 换取用户身份

前端每次登录时传来一个新的 `authCode`，后端收到后立即调用。

```
POST https://oapi.dingtalk.com/topapi/v2/user/getuserinfo?access_token=<Step1的accessToken>
Content-Type: application/json
```

请求体：

```json
{
  "code": "<前端传来的 authCode>"
}
```

成功响应：

```json
{
  "errcode": 0,
  "errmsg": "ok",
  "result": {
    "userid": "<用户在企业内的唯一 ID>",
    "sys_level": 0,
    "associated_unionid": "<unionId>",
    "name": "张三",
    "sys": false
  }
}
```

> - `authCode` **一次性有效**，前端每次登录都会生成新的，后端收到后必须立即使用，不可缓存
> - 此接口需要应用已开通 **`open_app_api_base`** 权限（默认已开通）
> - 若后续还需查询手机号、头像等详细信息，需额外开通 **`Contact.User.Read`** 权限

### Step 3：查本系统账号，签发系统 JWT

后端拿到 `userid`（或 `name`）后：

1. 用 `userid` 或手机号在本系统数据库中匹配对应账号
2. 匹配成功则签发本系统的登录凭证（JWT 或 Session）
3. 将凭证返回给前端
4. 前端存储该凭证，后续所有业务请求携带此凭证，与普通账号密码登录完全一致

### 权限清单

| 权限点 Code         | 权限名称                               | 是否需要审批 | 用途                                             |
| ------------------- | -------------------------------------- | ------------ | ------------------------------------------------ |
| `open_app_api_base` | 获取钉钉开放接口用户访问凭证的基础权限 | 无需审批     | Step 1 换 token、Step 2 换用户信息（必须开通）   |
| `Contact.User.Read` | 通讯录个人信息读权限                   | 无需审批     | 查询用户手机号、头像、邮箱等详细信息（按需开通） |

### 开通权限步骤

1. 登录 [open-dev.dingtalk.com](https://open-dev.dingtalk.com)
2. 进入对应应用 → **权限管理**
3. 搜索框输入权限点 Code（如 `Contact.User.Read`）
4. 点击**申请权限**，无需审批，即时生效
5. 权限变更后需后端**重新获取** accessToken，旧 token 不会感知新权限

---

## 多环境地址对照

| 环境 | 域名                      | API 前缀   | 基座 H5 入口                             |
| ---- | ------------------------- | ---------- | ---------------------------------------- |
| SIT  | `ytiop-sit.walsin.com.cn` | `/sit-api` | `https://ytiop-sit.walsin.com.cn/mbase/` |
| UAT  | `ytiop-uat.walsin.com.cn` | `/uat-api` | `https://ytiop-uat.walsin.com.cn/mbase/` |
| PRD  | `ytiop.walsin.com.cn`     | `/api`     | `https://ytiop.walsin.com.cn/mbase/`     |

子应用地址由 `VITE_DOMAIN` + `mpPath` 动态拼接，切换环境只改 env 文件：

```text
SIT: https://ytiop-sit.walsin.com.cn/mbase/aq  (安全)
     https://ytiop-sit.walsin.com.cn/mbase/af  (安防)
     https://ytiop-sit.walsin.com.cn/mbase/hb  (环保)
```
