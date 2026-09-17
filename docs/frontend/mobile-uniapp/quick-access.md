# 移动端门户 · 子应用 10 分钟快速接入

> 📦 来源：`wl-mbase` 仓库 `docs/子应用10分钟快速接入.md`——第一次接入跑通最小闭环，完整协议见 [H5 子应用集成方案](./integration)。

<AuthorTag :authors="['CHENY']" />

> 适用对象：首次接入 `wl-mbase` 的子应用开发者、项目技术负责人和联调人员。
>
> 本文只给出可运行的最短路径。完整原理、分端差异、媒体、断点续传、公司上下文、错误码和排障说明见 [子应用集成文档](./integration)。

## 1. 先确认接入边界

门户负责统一登录、当前公司、子应用入口、宿主导航和设备能力；子应用负责自己的菜单、按钮、数据权限、业务接口和页面状态。

当前项目约定：已注册的内部子应用直接复用 URL 中的 `portal_token`，不要求子应用后端提供换 Token 接口。子应用必须始终用本次 URL 的 Token 覆盖本地旧 Token。

开始前向平台组确认：

- `appId` 和部署路径，例如 `quality`、`/mbase/zl/`。
- 应用开放的环境和宿主端：H5/钉钉、微信小程序、App/PDA。
- 需要调用的宿主能力，例如拍照、相册、扫码、定位。
- 子应用域名、上传域名已加入相应平台白名单。

## 2. 配置部署路径

以 `/mbase/zl/` 为例：

```ts
// vite.config.ts
export default defineConfig({
  base: '/mbase/zl/',
  build: { outDir: 'zl' },
})

// router.ts
createRouter({
  history: createWebHistory('/mbase/zl/'),
  routes,
})
```

服务端应允许门户嵌入。不要返回 `X-Frame-Options: DENY`；使用 CSP 时把各环境门户来源加入 `frame-ancestors`。

## 3. 在应用启动最前面接收门户上下文

这一步必须早于用户、菜单、权限、字典和业务数据请求：

```ts
export interface PortalContext {
  fromPortal: boolean
  token: string
  userId: string
  companyId: string
  companyName: string
  host: string
}

export function readPortalContext(): PortalContext {
  const params = new URLSearchParams(window.location.search)
  return {
    fromPortal: params.get('from') === 'portal',
    token: params.get('portal_token') || '',
    userId: params.get('user_id') || '',
    companyId: params.get('companyId') || '',
    companyName: params.get('companyName') || '',
    host: params.get('mbase_host') || '',
  }
}

export async function bootstrapPortalSession() {
  const context = readPortalContext()
  if (!context.fromPortal) return context // 独立访问继续走子应用原登录链路

  if (!context.token) throw new Error('缺少 portal_token，请从移动门户重新进入')
  if (!context.companyId)
    throw new Error('缺少公司上下文，请从移动门户重新进入')

  // 本次 URL 是权威来源：即使本地已有 Token，也必须覆盖旧值。
  authStore.setToken(context.token)
  authStore.clearUserAndPermissionCache()
  companyStore.setPortalCompany(context.companyId, context.companyName)

  // 存量后端若依赖“当前公司”，先同步公司；显式 companyId 接口无需此调用。
  // await api.post(`/hrms/user/changeCompany?companyId=${encodeURIComponent(context.companyId)}`)

  await authStore.loadUser()
  await permissionStore.loadMenus({ companyId: context.companyId })
  return context
}
```

业务接口推荐显式传递 `companyId`。服务端仍需使用 `portal_token + companyId` 校验用户是否有该公司权限，不能把 URL 参数本身当成权限证明。

## 4. 权限失败绝不能留下空白页

子应用必须在根节点准备 `loading / ready / access-denied / unavailable` 四种状态。路由和菜单初始化失败时不能只 `return`，也不能跳到不存在的首个菜单。

```ts
const pageState = ref<'loading' | 'ready' | 'access-denied' | 'unavailable'>(
  'loading'
)
const stateMessage = ref('')

async function startApplication() {
  try {
    await bootstrapPortalSession()
    const firstRoute = permissionStore.resolveFirstAccessibleRoute()
    if (!firstRoute) {
      showAccessDenied('当前公司下未配置可访问菜单', 'NO_MENU')
      return
    }
    await router.replace(firstRoute)
    pageState.value = 'ready'
    reportPortalPageState({
      status: 'ready',
      title: String(router.currentRoute.value.meta.title || ''),
    })
  } catch (error: any) {
    if (Number(error?.status || error?.code) === 401) {
      reportPortalLogout()
      return
    }
    if (Number(error?.status || error?.code) === 403) {
      showAccessDenied('当前账号暂无该页面权限', 'HTTP_403')
      return
    }
    showUnavailable('应用初始化失败，请稍后重试', 'BOOTSTRAP_FAILED')
  }
}
```

`access-denied` 页面至少显示原因、重新校验和返回入口；`unavailable` 页面至少显示重试、返回和可供排障的错误编号。空列表是正常业务状态，不能误判为无权限。

页面状态上报完整代码见 [集成文档：权限与异常页面协同](./integration#四、h5-子应用侧改造清单)。基座收到后会在 H5/钉钉和 App/PDA 展示统一兜底；微信原生 `web-view` 的消息存在触发时机限制，因此子应用自己的状态页始终是第一责任层。

## 5. 接入标题和返回

- 独立访问：显示子应用自己的头部。
- 从门户进入：隐藏子应用头部，把路由标题上报给基座。
- App/PDA：同时上报是否还能在子应用内部返回，并响应基座返回指令。

Robot_H5 与 `@robot-h5/core` 已提供宿主识别、标题和 App/PDA 返回协议。其它项目复制完整实现前请阅读 [集成文档：H5/App/PDA 导航](./integration#_4-2-可选接入-体验更好)。

## 6. 按需接入拍照、相册、扫码等能力

子应用只接入实际需要的能力，交互界面仍由业务实现：

```html
<script src="/mbase/sdk/portal-media.js"></script>
```

```ts
const files = await window.WLPortalMedia.chooseImage({
  source: 'album',
  max: 3,
})

const uploaded = await window.WLPortalMedia.chooseImageAndUpload({
  source: 'camera',
  max: 1,
  url: import.meta.env.VITE_MEDIA_UPLOAD_URL,
  header: { Authorization: `Bearer ${authStore.token}` },
  formData: { companyId: companyStore.companyId },
})
```

拍照与相册、无业务 ID 临时图片、断点续传、水印、定位、扫码和 App 专属能力有不同边界，正式接入前按 [完整能力说明](./integration#五、桥接通信协议) 逐项确认。

## 7. 最小验收清单

- [ ] 独立访问仍走子应用原登录和原头部。
- [ ] 从门户进入不出现子应用登录页，URL Token 总是覆盖本地旧 Token。
- [ ] 切换公司后重新进入，用户、菜单、按钮和业务数据全部属于新公司。
- [ ] 有权限进入正确首页；无菜单和 HTTP 403 均显示完整状态页，不出现空白。
- [ ] HTTP 401 上报 `logout`，由基座校验和恢复会话。
- [ ] H5/钉钉、微信 WebView、App/PDA 的标题和返回符合各端约定。
- [ ] 拍照、相册、扫码等能力分别验证成功、取消、拒绝权限和接口失败。
- [ ] 控制台、埋点、错误上报和截图中均不输出完整 Token 或带 Token 的完整 URL。

完成最小验收后，再按 [完整集成文档](./integration) 执行分端验收和生产发布检查。
