# 移动端 uniApp — H5 子应用集成方案

> 本文档说明 `wl-mbase`（移动端门户）与业务 H5 子应用的 **SSO 免登集成全流程**。

---

## 一、现状与过渡计划

### 当前状态（内网）

| 项目        | 地址                                       | 说明                                        |
| ----------- | ------------------------------------------ | ------------------------------------------- |
| 移动端门户  | `http://172.28.99.172:9000`（API 网关）    | OAuth2 登录，JWT Token                      |
| 智慧安全 H5 | `http://172.28.99.172:81/hxaqtest/app`     | nginx 无 X-Frame-Options，可 iframe 嵌入    |
| 智慧安防 H5 | `http://172.28.99.172:81/hxaftest/app`     | 同上                                        |
| 智慧环保 H5 | `http://172.28.99.172:81/hxhbtest/app`     | 占位，待上线                                |

### 集成方式

```
移动端门户登录（OAuth2）
  → 获取 portal_token（access_token）
  → 用户点击子应用图标
  → 拼接 URL：<子应用地址>?portal_token=<token>&user_id=<id>&from=portal
  → H5/App 端：iframe 全屏嵌入
  → 小程序端：<web-view> 组件加载
```

### 过渡原则

- **内网阶段**：直连 IP，仅需维护 `src/config/portal-apps.ts` 中的 `url` 字段
- **外网就绪后**：按本文"内网 → 外网切换"步骤修改环境变量和网关配置

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

子应用 H5
  └─ 接收 portal_token → 直接使用（或换取本系统 token）→ 调用业务接口
```

### 方案可行性分析

| 关注点   | 结论    | 说明                                                      |
| -------- | ------- | --------------------------------------------------------- |
| 域名隔离 | ✅ 推荐 | `mobile.xxx.com` vs. `pc.xxx.com`，互不干扰               |
| 网关隔离 | ✅ 推荐 | 移动网关独立部署，Token scope 不同，防越权                |
| 服务复用 | ✅ 可行 | 业务接口（hrms、safety 等）移动/PC 共用，无需重复开发     |
| 权限隔离 | ✅ 必须 | 移动端菜单权限独立维护（移动端功能集是 PC 的子集）        |
| 外网扩展 | ✅ 平滑 | Nginx 加外网入口，网关逻辑不变，只改证书/域名             |

---

## 三、H5 子应用免登（SSO）原理

### 完整流程

```
① 用户在移动端门户完成 OAuth2 登录
     ↓ 获得 access_token（portal_token）

② 用户点击工作台子应用图标
     ↓
③ 门户（portal-apps.ts + buildAppUrl）拼接跳转 URL
     <H5_BASE_URL>/app?portal_token=<token>&user_id=<id>&from=portal
     ↓
④ 子应用 login 页检测到 from=portal + portal_token
     ↓
     「登录组件不渲染，不提示用户输入账号密码」
     直接写入本系统登录状态 → 跳转首页
     ↓
⑤ 子应用正常加载，菜单/权限由子应用自己控制
```

> **核心原则：登录只在门户发生一次，子应用的登录界面对内部用户完全废弃。**

### Token 使用方式

**方式 A：直接复用（推荐，适用于自建 H5）**

子应用后端与门户共用同一套认证服务，直接把 `portal_token` 当 Bearer Token 用：

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

**方式 B：Token 交换（适用于第三方 H5）**

子应用后端提供换取接口，与门户 Token 解耦：

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
    url: 'http://172.28.99.172:81/hxaqtest/app',    // 生产/测试地址
    devProxyPath: '/hxaqtest/app',                   // 开发代理路径
    mpUrl: 'https://safety.yourcompany.com/app',     // 小程序专用 HTTPS 地址
    roles: ['*'],                                    // 可见角色，'*' 全部
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
| `url`         | H5 首页地址（内网/生产），App/H5 端使用                   |
| `mpUrl`       | 小程序端使用（必须 HTTPS + 已备案域名）                    |
| `devProxyPath`| 开发代理路径，Vite DevServer 转发并剔除 X-Frame-Options    |
| `roles`       | 可见角色列表，`['*']` 全部可见，支持精确角色控制           |
| `enabled`     | 是否显示在工作台，false 则隐藏                             |
| `sort`        | 排序权重，数字越小越靠前                                   |

门户会通过 `buildAppUrl()` 自动追加认证参数：

```
{url}/app?portal_token={access_token}&user_id={userId}&from=portal
```

### 4.3 开发代理配置（vite.config.js）

本地开发时，Vite DevServer 自动转发子应用请求并剔除 iframe 限制头：

```javascript
proxy: {
  '/hxaqtest': {
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

---

## 五、子应用侧改造清单（H5 负责）

### 5.1 必须改（免登生效的最低要求）

#### ① Login 页：检测到 `portal_token` 立即进首页，不展示登录界面

```javascript
// login.vue — mounted / onMounted 中「第一件事」处理 portal_token
mounted() {
  const p = new URLSearchParams(window.location.search)
  const portalToken = p.get('portal_token')
  const userId = p.get('user_id')

  if (portalToken) {
    this.$store.commit('SET_TOKEN', portalToken)
    this.$store.commit('SET_USER_ID', userId)
    this.$router.replace('/home')
    return // 阻止登录表单渲染
  }
  // portalToken 不存在：显示正常登录界面（内部调试用）
}
```

#### ② 路由守卫：有 `portal_token` 时不强制跳登录页

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

#### ③ nginx：允许被 iframe 嵌入

```nginx
# 删除或注释
# add_header X-Frame-Options SAMEORIGIN;

# 如需限制来源：
add_header Content-Security-Policy "frame-ancestors 'self' http://172.28.99.172:1999";
```

### 5.2 建议改（体验提升）

#### ④ Token 优先存入 `sessionStorage`（避免跨域 iframe Cookie 失效）

```javascript
// 推荐：sessionStorage 优先，Cookie 兜底
sessionStorage.setItem('token', portalToken)
// 不建议仅依赖 Cookie（第三方 Cookie 在 iOS Safari 等场景下会被阻止）
```

#### ⑤ 向门户同步页面标题

```javascript
// 路由变化后发送
router.afterEach(to => {
  window.parent.postMessage({ title: to.meta.title || document.title }, '*')
})
```

#### ⑥ 会话过期通知门户

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

| 消息类型             | 门户行为                                            |
| -------------------- | --------------------------------------------------- |
| `{ title: '...' }`   | 更新导航栏标题                                      |
| `{ action: 'logout' }` | 提示"子应用会话过期"并返回工作台，不清除门户登录态 |

---

## 七、内网 → 外网切换配置

### 7.1 门户配置变更

修改 `env/.env.production`：

```ini
# 内网 → 外网（替换为真实域名）
VITE_API_BASE_URL=https://mobile-api.yourcompany.com
VITE_WS_URL=wss://mobile-api.yourcompany.com/ws
```

修改 `src/config/portal-apps.ts`（各子应用的 `url` 和 `mpUrl`）：

```typescript
{ url: 'https://safety.yourcompany.com/app', mpUrl: 'https://safety.yourcompany.com/app', ... }
```

修改 `src/manifest.json`：

```json
"mp-weixin": {
  "setting": { "urlCheck": true }  // 发布时必须开启
}
```

### 7.2 微信公众平台配置

| 配置项               | 需要添加的域名                                          |
| -------------------- | ------------------------------------------------------- |
| request 合法域名     | `https://mobile-api.yourcompany.com`                    |
| webview 业务域名     | 各子应用域名（安全、安防、环保等）                      |
| downloadFile 合法域名| `https://at.alicdn.com`（wot-design-uni 图标字体）      |

### 7.3 钉钉开放平台配置

- **微应用首页 URL**：`https://mobile.yourcompany.com/`（H5 部署地址）
- **JSAPI 安全域名**：与微应用首页同域名

### 7.4 Nginx 外网入口示例

```nginx
server {
  listen 443 ssl;
  server_name mobile-api.yourcompany.com;
  location / {
    proxy_pass http://172.28.99.172:9000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}

server {
  listen 443 ssl;
  server_name safety.yourcompany.com;
  location / {
    proxy_pass http://172.28.99.172:81;
    # 不设置 X-Frame-Options，允许门户 iframe 嵌入
  }
}
```

---

## 八、安全注意事项

| 风险点                     | 处理建议                                                                                           |
| -------------------------- | -------------------------------------------------------------------------------------------------- |
| `portal_token` 明文在 URL  | 内网可接受；外网建议升级为短期一次性 `code`，用 code 换取 token（OAuth2 Authorization Code Flow） |
| iframe 嵌入任意 URL        | 门户 webview 应对 `url` 参数进行白名单校验，防止 Open Redirect / XSS                              |
| postMessage 来源校验       | 子应用接收消息时校验 `event.origin`，避免接收来自未知来源的指令                                    |
| Token 有效期               | 建议移动端 Token 有效期 2h，配合静默刷新；子应用 token 同步更新                                   |
| HTTPS 强制                 | 外网全链路强制 HTTPS；小程序审核要求所有网络请求使用 HTTPS                                        |
| Client Secret 安全性       | UniApp 编译产物中 client_secret 可见，属于"公开客户端"固有限制，建议后续改为 public client        |
