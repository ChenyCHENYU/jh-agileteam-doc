# App 集成与发布

> 📦 来源：`wl-mbase` 仓库 `docs/APP集成与发布.md`（2026-09 版，含统一头部与返回、构建与签名全流程）。

<AuthorTag :authors="['CHENY']" />

> 对应项目：移动端门户（wl-mbase）。
> 本文面向**子应用开发者和安卓发布人员**，说明 App 原生基座如何承载远程 H5 子应用、如何统一头部与返回、子应用如何调用宿主能力（拍照/定位/扫码）、如何真机调试、如何打包签名。
> H5 iframe 桥接方案见 [H5 子应用集成方案](./integration)。

---

## 一、方案定位

wl-mbase App 采用**原生基座 + 远程 H5 子应用**形态：

```text
子应用业务代码（useLocation / useCamera / useQrScanner）
  ↓ @robot-h5/core（子应用依赖）
  ↓ uni.webview SDK（uni.webview.1.5.8.js）
  ↓ uni.postMessage（子 → 基座）
  ↓ wl-mbase App 能力白名单校验 + 定位/选图/扫码/持久化续传（基座原生调用）
  ↓ evalJS 派发 mbase:bridge-result（基座 → 子）
  ↓ @robot-h5/core 返回统一结果给业务代码
```

### 与 H5 方案的区别

| 维度        | 钉钉 H5（iframe）                  | App（原生 web-view）                                 |
| ----------- | ---------------------------------- | ---------------------------------------------------- |
| 子应用容器  | iframe                             | uni-app `<web-view>` 组件                            |
| 子→基座通信 | `window.parent.postMessage`        | `uni.postMessage`                                    |
| 基座→子通信 | `iframe.contentWindow.postMessage` | `childWebView.evalJS()`                              |
| URL 标记    | 无特殊标记                         | 自动追加 `mbase_host=app` + `mbase_bridge_version=1` |
| 能力调用    | 钉钉 JSAPI（`dd.*`）               | uni 原生 API + App 私有文件队列                      |
| 鉴权        | dd.config 签名                     | 无需鉴权（基座原生环境直接调用）                     |

> 子应用**不需要区分**当前运行在哪个容器。`@robot-h5/core` 会自动识别 `mbase_host=app` 参数，App 走 `uni.postMessage`，钉钉 H5 走 `window.parent.postMessage`，业务代码完全一致。

App 主界面不注册底部 `tabBar`，工作台头部直接提供消息和统一设置入口；H5 与小程序继续保留现有 `tabBar`，设置内容统一复用 `pages/settings/index`。

### 官方依据

- [uni-app web-view](https://uniapp.dcloud.net.cn/component/web-view) — App 远程网页使用 `uni.webview.1.5.8.js`，网页通过 `uni.postMessage` 发消息，App 通过子 WebView `evalJS` 回传
- [uni.getLocation](https://uniapp.dcloud.net.cn/api/location/location) — App 获取 GCJ-02 需配置定位 SDK；`isHighAccuracy` 和 `highAccuracyExpireTime` 用于高精度定位
- [Geolocation 定位](https://uniapp.dcloud.net.cn/tutorial/app-geolocation) — 国内 Android 正式包需配置企业自己的高德或腾讯定位资质
- [App 功能模块](https://uniapp.dcloud.net.cn/tutorial/app-modules) — 扫码、相机和定位必须在 manifest 中显式启用
- [完整 manifest](https://uniapp.dcloud.net.cn/tutorial/app-manifest.html) — 系统定位、Android 权限和 iOS 隐私用途描述的配置定义
- [App 图标配置](https://uniapp.dcloud.net.cn/tutorial/app-icons.html) — Android/iPhone/iPad 图标尺寸及 iOS 无 Alpha 要求
- [input 软键盘](https://uniapp.dcloud.net.cn/component/input.html) — App 登录页使用 `adjustPan`，避免 `adjustResize` 重设 WebView 高度
- [uni.request](https://uniapp.dcloud.net.cn/api/request/request) — App 支持 PUT 与 ArrayBuffer 请求体，用于发送原始二进制分片
- [网络状态](https://uniapp.dcloud.net.cn/api/system/network.html) — `uni.onNetworkStatusChange` 用于断网排队和恢复调度
- [HTML5+ IO](https://www.html5plus.org/specification/IO.html) — 私有目录复制、`File.slice` 和文件读取用于 App 任务持久化
- [App WebView 错误页面](https://uniapp.dcloud.net.cn/tutorial/app-webview-error.html) — 网络资源无法访问时用本地页面接管系统默认错误页

---

## 二、子应用接入（开发者必读）

### 2.1 升级依赖

Robot_H5 子应用升级 `@robot-h5/core` 到 `1.2.0+`：

```bash
pnpm add @robot-h5/core@^1.2.0
```

同时在 `h5.config.ts` 配置精确的门户 `origin` 与业务域名自托管的 `appSdkUrl`。不要在 `index.html` 静态注入 SDK；Core 只会在 App/PDA 首次通信时加载，普通 H5、微信与钉钉不下载、不执行。完整配置见[集成文档：App/PDA 双向返回导航](./integration#四、h5-子应用侧改造清单)。

### 2.2 业务调用方式（零改动）

原有业务调用**完全不变**，core 自动适配容器：

```ts
import { useLocation, useCamera, useQrScanner } from '@robot-h5/core'

// 定位
const { getCurrentPosition } = useLocation()
const location = await getCurrentPosition()
// → { latitude, longitude, accuracy, coordinateSystem, provider, sampleCount, ... }

// 拍照
const { takePhoto } = useCamera()
const { images } = await takePhoto({ max: 1 })
// → { images: string[] }（base64 dataURI）

// 扫码
const { scan } = useQrScanner()
const { text } = await scan({ type: 'qrCode' })
// → { text: string }
```

上面“零改动”仅指原有定位、拍照和扫码。相册与断点续传是新增的显式能力：未调用时不影响旧页面；需要使用时通过 `@robot-h5/core/bridge` 的 `invokeMbaseCapability` 调用 2.3/2.6 节所列 v1 能力。页面交互、业务上传接口与任务状态仍由子应用负责。

::: warning 禁止事项

- **禁止**子应用自行判断 Android/iOS 平台
- **禁止**子应用自行执行 WGS-84 → GCJ-02 坐标转换（基座已处理）
- **禁止**子应用直接调用 `plus.*` 或 `uni.*` 原生 API（全部走桥接）
  :::

### 2.3 底层桥接协议

如果子应用不使用 `@robot-h5/core`（如非 Vue 项目），可直接按协议调用：

**请求（子 → 基座）**：

```ts
// 子应用通过 uni.webview SDK 发送
uni.postMessage({
  data: {
    source: 'mbase-bridge',
    type: 'capability:invoke',
    id: '唯一请求ID', // 格式：[A-Za-z0-9:_-]{1,100}
    api: 'takePhoto', // 具体能力见 2.4；续传能力使用同一 v1 协议
    payload: { max: 1 }, // 请求参数，UTF-8 字节 ≤ 64KB
    protocol: 1, // 协议版本
    host: 'app', // 宿主标识
  },
})
```

**响应（基座 → 子）**：

基座通过 `evalJS` 派发 `mbase:bridge-result` 自定义事件，子应用监听：

```ts
window.addEventListener('mbase:bridge-result', (event: CustomEvent) => {
  const result = event.detail
  // {
  //   source: 'mbase-bridge',
  //   type: 'capability:result',
  //   id: '与请求一致的ID',
  //   ok: true | false,
  //   data?: unknown,             // ok=true 时的返回数据
  //   error?: string,             // ok=false 时的错误码
  //   reason?: string             // ok=false 时的错误描述
  // }
})
```

### 2.4 能力详解

| api                        | 说明                          | 主要 payload / 返回                                                           |
| -------------------------- | ----------------------------- | ----------------------------------------------------------------------------- |
| `takePhoto`                | 兼容拍照（最大3张）           | `{ max? }` → `{ images: dataURI[] }`                                          |
| `takePhotoAndUpload`       | 兼容拍照整文件直传            | `{ max?, url, formData?, header? }` → `{ results }`                           |
| `chooseImage`              | 明确选择相机或相册            | `{ source, max? }` → `{ source, images }`                                     |
| `chooseImageAndUpload`     | 选择后整文件直传              | `{ source, max?, url, formData?, header? }` → `{ source, uploaded, results }` |
| `resumableChooseAndUpload` | 持久化文件并分片上传          | `{ source, max?, endpoint, metadata?, header?, chunkSize? }` → `{ jobs }`     |
| `resumableList`            | 查询当前子应用续传任务        | `{}` → `{ jobs }`                                                             |
| `resumableResume`          | 恢复一个或全部任务            | `{ jobId?, header? }` → `{ jobs }`                                            |
| `resumablePause`           | 暂停任务                      | `{ jobId }` → `{ job }`                                                       |
| `resumableCancel`          | 取消任务并清理 App 私有文件   | `{ jobId }` → `{ cancelled, jobId }`                                          |
| `getLocation`              | 获取定位（多采样 + 坐标转换） | `{ coordinateSystem?, ... }` → 坐标、精度、提供方和采样元数据                 |
| `scan`                     | 扫一扫                        | `{ type?: 'qrCode'\|'barCode'\|'all' }` → `{ text }`                          |
| `debugInfo`                | 获取诊断信息                  | `{}` → App 版本、环境、平台和定位提供方                                       |

`chooseImagePersist / takePhotoPersist / uploadPendingPhotos / previewPendingPhoto / releasePendingPhotos` 是钉钉 iframe 保存虚拟路径的 H5 专用契约，不进入 App 能力白名单。App 新增页可直接持有原生选择得到的文件；需要跨断网或跨重启保留时使用 `resumable*` 私有文件队列。

### 2.5 定位坐标系说明（务必理解）

```text
子应用请求 GCJ-02
  ↓
基座检测 VITE_APP_LOCATION_PROVIDER
  ├─ system（默认）：uni.getLocation 返回 WGS-84 → 基座本地转 GCJ-02
  └─ amap/tencent：SDK 原生返回 GCJ-02，无需转换
  ↓
返回 coordinateSystem + rawCoordinateSystem + converted
```

**业务距离判定规则**：

- `coordinateSystem` 必须与点位库一致，不一致先转换再算距离
- `accuracy` 缺失或大于业务阈值时，提示用户移至开阔处重试
- 距离算法统一用 WGS84 椭球 Haversine，输入两点必须同一坐标系
- `accuracy=24m` 是设备估计范围，不代表实际只差 24 米，不能保证 Android/iOS 完全重合

### 2.6 断点续传与离线队列

App 的续传能力与原整文件上传完全隔离：

1. 子应用显式调用 `resumableChooseAndUpload` 后，基座才复制文件到 App 私有 `_doc/mbase-upload-queue`。
2. 在线时按服务端确认的偏移顺序上传分片；断网时任务进入 `offline`。
3. 当前 App 进程内恢复网络会自动尝试续传。
4. App 被回收或重启后文件和任务仍保留，但业务 Token 不落盘；重新进入子应用后需携带新 Token 调用 `resumableResume`。
5. 完成或取消后清理 App 私有文件；业务只保存服务端完成接口返回的正式附件 ID。

选择或恢复桥调用在任务进入队列后立即返回，不等待大文件传完；子应用使用 `resumableList` 获取最新进度，避免桥调用超时。

`endpoint` 必须与当前注册子应用同源，并且后端必须实现上传会话协议。子应用调用封装、状态处理、验证步骤和错误排查见[集成文档：断点续传](./integration#断点续传-断网排队)；服务端完整协议、安全边界和真机矩阵见[移动端断点续传能力设计与接入](./chunk-upload)。

### 2.7 App/PDA 单头部与动态标题

App/PDA 的头部统一由基座原生导航栏显示。子应用识别 `mbase_host=app` 后隐藏自己的 `C_NavBar`，并通过 v1 导航协议上报 `title / canGoBack / seq`；基座原生返回键下发 `navigation:back`，子应用执行 `router.back()` 后用 `ackRequestId` 确认。

未上报协议的存量子应用仍走原生 WebView 历史返回，不会被强制切换。完整可复制代码、路由根页约定、组件改法和验收清单见[集成文档：App/PDA 单头部导航](./integration#四、h5-子应用侧改造清单)。

> 只允许用 `mbase_host=app` 隐藏子应用头部。`from=portal` 同时存在于 H5/钉钉入口，用它判断会误伤其他端。

---

## 三、能力白名单配置（基座侧）

每个子应用能调用的能力**必须显式声明**，在 `src/config/portal-apps.ts` 的 `capabilities` 字段配置：

```ts
{
  id: 'safety',
  name: '智慧安全',
  capabilities: [
    'takePhoto',
    'takePhotoAndUpload',
    'chooseImage',
    'chooseImageAndUpload',
    'resumableChooseAndUpload',
    'resumableList',
    'resumableResume',
    'resumablePause',
    'resumableCancel',
    'getLocation',
    'debugInfo',
  ],
  //                                ↑ 不含 'scan' → 该应用无法扫码
}
```

**当前各应用白名单**：

| 应用     | 拍照/相册 | 整文件上传 | 断点续传 | 定位 | 扫码 | 诊断 |
| -------- | :-------: | :--------: | :------: | :--: | :--: | :--: |
| 智慧安全 |    ✅     |     ✅     |    ✅    |  ✅  |  ❌  |  ✅  |
| 智慧安防 |    ✅     |     ✅     |    ✅    |  ✅  |  ✅  |  ✅  |
| 智慧设备 |    ✅     |     ✅     |    ✅    |  ✅  |  ✅  |  ✅  |
| 智慧环保 |    ❌     |     ❌     |    ❌    |  ❌  |  ❌  |  ✅  |

> 新增能力必须按应用显式增加，**不能改为全局放开**。未声明 `capabilities` 的应用只能调用 `debugInfo`。

---

## 四、安全边界（基座强制校验）

基座对每次能力调用执行以下检查：

| #   | 检查项                                            | 失败结果                        |
| --- | ------------------------------------------------- | ------------------------------- |
| 1   | 子 WebView URL 必须匹配已注册 `mpPath` 和 `appId` | 拒绝调用                        |
| 2   | `source/type/id/api/protocol/host` 必须合法       | 丢弃消息                        |
| 3   | 请求载荷 UTF-8 字节 ≤ 64 KiB                      | 丢弃消息                        |
| 4   | 应用只能调用白名单内能力                          | 返回 `capability_denied`        |
| 5   | 重复请求 ID 复用同一结果（防重复拍照/定位）       | 返回缓存结果                    |
| 6   | 拍照直传只允许子应用同源地址                      | 返回 `upload_origin_denied`     |
| 7   | 每次调用复核 WebView 当前 URL                     | 跳出注册路径立即停止            |
| 8   | 扫码得到外部网址交给系统浏览器                    | 不进入受信 WebView              |
| 9   | 续传任务按 `userKey + appId + origin` 隔离        | 不能读取/控制其它账号或应用任务 |
| 10  | 续传鉴权头只保存在运行内存                        | 重启后进入 `waiting_auth`       |

> 标准 App `<web-view>` 不是不可信沙箱。官方说明远程页面处于 5+ 环境；若改用 `plusrequire: 'none'` 自建 WebView 会切断 `uni.postMessage` 通道。因此**只能承载同域受控的第一方子应用**，外部网页不得注册。

---

## 五、原生入口扩展（appTarget）

当前所有应用默认打开远程 H5。未来可按应用切换入口类型：

```ts
// 类型1：基座内 UniApp 原生页面
appTarget: { type: 'native', route: '/pages/example/index' }

// 类型2：已安装的外部 Android/iOS 应用（未安装回退 H5）
appTarget: {
  type: 'external',
  androidPackage: 'com.example.app',
  iosScheme: 'example://open',
  fallbackToWeb: true,           // 默认 true
}
```

::: warning

- 原生页面必须先加入 `pages.json`
- 外部应用需另行设计一次性票据或 App Link
- **禁止**把长期 token 裸传到自定义 Scheme
  :::

---

## 六、Android 真机调试

### 6.1 前置条件

- HBuilderX 已安装（建议 `D:\development\HBuilderX`）
- Android 手机已开启「开发者选项」+「USB 调试」
- `adb devices -l` 必须显示 `device`（不能是 `unauthorized`）

### 6.2 标准基座快速调试

1. HBuilderX 登录 DCloud，导入 `wl-mbase` 项目
2. 菜单「运行 → 运行到 Android App 基座」
3. 首次运行自动安装 DCloud 标准基座，再同步项目资源
4. 验证清单：登录 → 远程 H5 → 返回 → 定位 → 拍照 → 扫码 → 断网 → 权限拒绝

::: warning 标准基座局限
标准基座使用 DCloud 的包名、证书和三方 SDK 配置，**不能证明正式包的定位 SDK、权限、签名和升级链正确**。仅适合功能调试，不能替代正式包验收。
:::

### 6.3 指定环境调试（SIT）

HBuilderX 直接对 CLI 源项目执行云打包时会走默认 production 编译，不能用进程环境变量可靠替代 `--mode sit`。项目现已在非开发 App 构建中加入根目录保护，选错源码项目会直接报错，不再静默生成生产包。SIT 真机包必须先生成已固化环境的独立打包目录：

```powershell
pnpm package:app -- --env sit
```

然后在 HBuilderX 中导入 `dist/package/app-sit`，按 5+ App 项目执行「发行 → 原生 App-云打包」。不要再选择源码根目录 `wl-mbase` 打 SIT 包。

若 HBuilderX 打包状态显示 `项目名 []`，或报错 `[Error] App Id parse failed`，说明本地安装包生成阶段没有取得 AppID。先确认源码位于包含 App 能力的分支，再重新执行 `pnpm package:app -- --env sit`，并只导入新生成的 `dist/package/app-sit`。该目录的 `manifest.json` 应包含 `"id": "__UNI__..."`；不要手工删除、改名或把源码字段 `appid` 机械替换为 `id`。打包准备脚本会在云端上传前校验最终 AppID，校验失败时禁止继续打包。

「快速安心打包」包含云端生成原生包和本地合成签名包两个阶段。提交后直到本地 APK 生成完成，不要切换源码根目录分支、重建或删除当前打包目录；否则第二阶段可能重新读到另一个分支的空 AppID，形成 `_cm.apk` 缓存并报上述错误。使用独立的 `dist/package/app-sit` 可避免源码分支切换影响打包输入。若已经失败，重新生成并导入该目录后重试；仍受旧缓存影响时，首次改用「传统打包」建立新基线，后续再恢复快速安心打包。

该命令会通过专用脚本锁定 `sit` 编译，再修正编译态图标路径，并校验唯一环境指纹、激活 API 指纹、升级清单地址和全部图标。生成失败时禁止继续打包。HBuilderX 打包状态中的项目名必须是 `app-sit`；若显示 `wl-mbase`，应立即停止。安装后仍应通过页面右侧 `SIT` 徽章及 `debugInfo` 的 `environment`/`domain` 复核运行环境。

### 6.4 调试技巧

- 子应用调用 `debugInfo` 能力可获取基座环境诊断：`{ bridge, protocol, appVersion, environment, domain, platform, locationProvider }`
- 连续定位采样至少 10 次，记录 `coordinateSystem`/`accuracy`/`sampleCount`/距点位米数
- 权限拒绝后检查：Android 设置 → 应用 → wl-mbase → 权限 → 定位/相机
- WebView 控制台日志可通过 HBuilderX 的「调试 → 调试 WebView」

子应用首屏打不开时按以下顺序判断，不要仅凭“网络不可用”提示归因：

1. 基座只对**主页面加载失败**自动重试 1 次；仍失败会显示“重新加载 / 返回工作台”，不会再展示 Android 默认英文错误页。
2. 先在同一台设备、同一网络的系统浏览器打开不含 `portal_token` 的子应用根地址，区分 DNS/TLS/服务不可达与基座问题。
3. 检查 Android System WebView 版本、设备时间、5G/Wi-Fi 切换、VPN/MDM、内网证书链；PDA 尤其要记录这些信息。
4. HBuilderX WebView 日志中检查 `[mbase:app-webview] 主页面加载失败`；排查日志不得粘贴完整 token URL。
5. 页面能打开但业务接口报错属于子应用 API/鉴权问题，不是 WebView 主页面失败，不应触发整页重载。

---

## 七、构建与打包

### 7.1 三类产物

| 产物               | 用途                       |    可独立安装     | 当前状态               |
| ------------------ | -------------------------- | :---------------: | ---------------------- |
| App 资源（wgt）    | 编译验证、离线 SDK 输入    |        ❌         | ✅ 已具备              |
| HBuilderX 标准基座 | Android 热调试             | 由 HBuilderX 安装 | ✅ 需连接设备          |
| 独立 APK           | 内部测试、PDA/MDM/USB 分发 |        ✅         | 需确定 AppID/包名/签名 |

### 7.2 CLI 构建命令

```bash
# 前置检查（Barcode/Camera/Geolocation 模块 + Android 权限 + iOS 隐私描述 + 定位提供方）
pnpm check:app

# 构建资源并生成 HBuilderX 可直接云打包的独立目录
pnpm package:app -- --env dev  # dist/package/app-dev
pnpm package:app -- --env sit  # dist/package/app-sit
pnpm package:app -- --env uat  # dist/package/app-uat
pnpm package:app -- --env pre  # dist/package/app-pre
pnpm package:app -- --env prd  # dist/package/app-prd

# 本地开发调试
pnpm dev:app
```

> 通用的 `build:app`、`build:app-plus`、`build:app-android`、`build:app-ios` 已作为源码误打包保护入口，执行时会主动失败。App/PDA 必须通过 `package:app` 显式选择环境（本地交互选择或 `--env`），避免默认 production 覆盖测试环境。

> `dist/build/app` 是最后一次构建产生的原始 App 资源；`dist/package/app-*` 是按目标环境固化并完成唯一环境指纹、API、升级地址、版本、图标、启动图及关键修复指纹校验的 HBuilderX 打包输入，两者都不是 APK/IPA。独立安装包仍由 HBuilderX 云打包或原生离线 SDK 生成。DEV/SIT/UAT/PRE 包会在个人卡片右侧显示对应徽章，生产包不显示；看到的徽章必须与打包目录名一致。

> Android 原生启动层使用标准 RGB PNG 渐变背景，不承载圆环、文字等易受屏幕比例影响的内容；完整玻璃质感、格言与加载动画由 Vue/CSS 启动页绘制。不要把未经 Android Studio 校验的 `.9.png` 放入云打包目录。

### 7.3 独立 Android 测试 APK（公共证书）

先在 HBuilderX 登录 DCloud，从 `src/manifest.json` 获取并固化 DCloud AppID。测试包用独立包名后缀避免冲突：

```powershell
$env:ANDROID_PACKAGE_NAME = '<企业反向域名>.mbase.sit'
$env:ANDROID_CERT_MODE = 'public'
pnpm check:app:package
pnpm package:app -- --env sit

$project = (Resolve-Path 'dist/package/app-sit').Path
& "$env:HBUILDERX_HOME\cli.exe" project open --path $project
& "$env:HBUILDERX_HOME\cli.exe" pack `
  --project $project `
  --platform android `
  --safemode true `
  --android.packagename $env:ANDROID_PACKAGE_NAME `
  --android.androidpacktype 1
```

::: danger 公共证书限制
`androidpacktype=1` 是公共证书，**只适合一次性内部验证**。不能与未来企业私有证书形成覆盖升级链，绝不能作为 PDA 批量部署包或生产包。
:::

### 7.4 正式内部分发与 PDA（私有证书）

PDA、MDM、企业内网下载从第一版就固定包名和私有签名：

```powershell
$env:ANDROID_CERT_MODE = 'private'
$env:ANDROID_PACKAGE_NAME = '<企业反向域名>.mbase'
$env:ANDROID_KEYSTORE_PATH = '<受控目录>\mbase.jks'
$env:ANDROID_CERT_ALIAS = '<alias>'
$env:ANDROID_CERT_PASSWORD = '<由密钥平台注入>'
$env:ANDROID_STORE_PASSWORD = '<由密钥平台注入>'
pnpm check:app:release
```

私有证书云打包用 `androidpacktype=0`，传入 `certfile/certalias/certpassword/storepassword`。**每次升级保持包名和签名不变，递增 `versionCode`**；SIT 与 PRD 用不同包名可在同一 PDA 共存。

### 7.5 正式打包前置条件

打包前**必须补齐**：

- [x] DCloud AppID（当前为 `__UNI__140E7AC`；正式发布前确认企业账号归属）
- [ ] Android Application ID + 签名证书 + 证书摘要
- [ ] iOS Bundle ID + 开发者证书 + provisioning profile
- [ ] 企业隐私政策 + 首次启动隐私同意流程
- [ ] 高德/腾讯定位商业资质（key 需与包名/证书匹配）
- [x] Android/iPhone/iPad 全尺寸 App 图标
- [x] Android 自定义启动图、iOS storyboard、版本号和整包升级策略

> 证书密码、私钥、真实 SDK 密钥**不提交仓库**，由发布平台受控密钥配置注入。
> 源码 `src/manifest.json` 的图标使用 `src/static/...`，Android 启动图使用 `resources/app-splash/...`；编译后的 5+ App 项目分别转换为 `static/...` 和 `app-splash/...`。`package:app` 会复制并逐个验证资源，同时校验 `env.json`、版本和关键修复指纹，避免错误环境、旧资源或缺失文件进入安装包。
> 修改 App 名称、图标、包名或签名后，第一次必须使用 HBuilderX **传统打包**重建原生包，避免“快速安心打包”复用旧原生壳。新包验证通过后，后续未改动原生配置的版本可恢复安心打包。

### 7.6 当前阻断项

| 项目                        | 状态                                        |
| --------------------------- | ------------------------------------------- |
| DCloud AppID                | ✅ `__UNI__140E7AC`，正式发布前确认企业归属 |
| Android/iOS 全尺寸应用图标  | ✅ 已配置并纳入构建自检                     |
| 企业 Android 包名与私有签名 | ❌ 未确认                                   |
| iOS Bundle ID 与发布证书    | ❌ 未确认                                   |
| 真实隐私政策与首次同意流程  | ❌ 未提供                                   |

> 代码和 App 资源构建已就绪，但在这些应用身份资产确定前，**不生成看似可装、实际无法稳定升级的临时 APK**。

---

## 八、整包升级闭环

### 8.1 当前方案

基座采用**环境隔离的远程清单 + 原生整包安装**，不依赖 uniCloud：

```text
App 启动完成后延迟检查 / 设置页手动检查
  → 请求当前环境 app-updates/manifest.json（禁用缓存）
  → 校验通道、平台、versionCode、HTTPS 与允许域名
  → Android：原生下载 APK → 大小校验 → 分块 SHA-256 → 系统覆盖安装
  → iOS：打开受控的企业分发 / TestFlight HTTPS 地址
  → 新版本首次启动：清理安装包并展示一次升级完成通知
```

| 能力         | 行为                                                            |
| ------------ | --------------------------------------------------------------- |
| 自动检查     | 应用初始化完成后延迟执行，失败不阻断登录和工作台                |
| 手动检查     | 设置页点击“版本”，明确提示最新版本或失败原因                    |
| 可选升级     | 用户可稍后处理，同一版本 24 小时内不重复自动提醒                |
| 强制升级     | 隐藏返回入口并拦截物理返回；下载失败可重试或取消后重下          |
| 最低支持版本 | 当前 `versionCode < minSupportedVersionCode` 时自动转为强制升级 |
| 安全边界     | 清单和安装地址必须 HTTPS；安装地址必须属于预编译允许域名        |
| 完整性       | Android APK 必须同时匹配发布清单中的字节数和 SHA-256            |
| 平台隔离     | 升级页面、状态机和原生 API 仅编译到 App；清单只随 H5 部署       |

微信小程序继续使用官方 `uni.getUpdateManager()`；H5 和钉钉由服务器静态资源发布覆盖，不执行 App 安装逻辑。首期不启用 WGT 热更新，因为 WGT 与原生运行时、模块和权限存在版本耦合，整包升级更适合当前包含定位、相机、扫码及后续原生能力的基座。

### 8.2 清单与环境

源码清单位于 `public/app-updates/manifest.json`，H5 构建后发布到：

```text
SIT  https://ytiop-sit.walsin.com.cn/mbase/app-updates/manifest.json
UAT  https://ytiop-uat.walsin.com.cn/mbase/app-updates/manifest.json
PRE  https://ytiop-pre.walsin.com.cn/mbase/app-updates/manifest.json
PRD  https://ytiop-prd.walsin.com.cn/mbase/app-updates/manifest.json
```

清单包含 `development/sit/uat/pre/production` 五个通道和 Android/iOS 两个平台。仓库默认全部为 `enabled: false`，因此首次部署不会误触发升级。各环境 App 只读取自己的 `VITE_ENV` 通道；开发基座默认关闭在线升级。

部署后必须确认该 URL 返回 JSON，而不是门户 `index.html`：

```powershell
$response = Invoke-WebRequest `
  'https://ytiop-sit.walsin.com.cn/mbase/app-updates/manifest.json' `
  -UseBasicParsing
$response.Headers['Content-Type']
$response.Content | ConvertFrom-Json
```

如果返回 HTML，说明静态清单未部署或被 SPA fallback 重写。此时客户端会明确提示“升级清单尚未正确发布”，应修复网关/静态资源发布；不能把 HTML 当成“已是最新版”。

如 APK 使用独立下载域名，必须在 `scripts/build-environment.mjs` 对应环境的 `appUpdateAllowedOrigins` 中预先加入该 HTTPS Origin 并重新出包。建议从第一版就固定企业下载域名，安装包使用不可变版本路径，例如 `/app/android/1.0.1/wl-mbase.apk`，不要复用 `latest.apk`。

### 8.3 标准发布步骤

1. 同时更新 `package.json.version`、`src/manifest.json.versionName`，并严格递增 `src/manifest.json.versionCode`。
2. 使用固定包名和固定私有签名生成正式 APK；执行 `pnpm check:app:release`。
3. 先上传 APK 到目标环境 HTTPS 地址，确认真机可下载且服务端未替换、重定向到未允许域名或返回登录页。
4. 生成清单。脚本会从本地 APK 计算字节数和 SHA-256，并拒绝版本不一致、域名越界、非法参数或版本倒退。
5. 复核 `public/app-updates/manifest.json` 后构建并部署对应环境 H5，使远程清单最后生效。
6. 用旧正式签名包完成检查、下载、校验、覆盖安装、保留登录态和升级完成通知的真机回归。

Android 可选升级示例：

```powershell
pnpm app:update:release -- `
  --channel sit `
  --platform android `
  --version 1.0.1 `
  --code 101 `
  --url https://ytiop-sit.walsin.com.cn/mbase/app/android/1.0.1/wl-mbase.apk `
  --file D:\release\wl-mbase-sit-1.0.1.apk `
  --notes "修复定位稳定性|优化应用加载体验"
```

只强制过旧版本升级，在命令后追加 `--min-code 100`；强制所有旧版本升级则追加 `--mandatory`。iOS 发布不传 `--file`，`--url` 填受控 HTTPS 安装页或 TestFlight 链接。

发布前可追加 `--dry-run`，仅计算和校验、不修改清单。紧急停用示例：

```powershell
pnpm app:update:release -- --channel sit --platform android --disable
```

停用只把目标通道改为 `enabled: false`，并保留上一版元数据。应立即部署清单；已经下载并进入系统安装器的设备无法被远程撤回，因此必须坚持“先上传并验证包，最后启用清单”的顺序。若安装包本身有问题，发布修复版时只能递增 `versionCode`，不能向旧版本回退。

### 8.4 Android 与 iOS 发布约束

- Android 覆盖安装必须保持 Application ID 和签名证书完全一致，且 `versionCode` 递增。
- `REQUEST_INSTALL_PACKAGES` 仅用于当前企业内网、PDA、MDM 等非应用市场分发；未来若进入 Google Play 等市场，需要按市场规则改用商店升级并重新评估该权限。
- Android 8+ 设备可能要求用户或 MDM 为本应用开放“安装未知应用”权限；这属于系统策略，代码不能静默绕过。
- iOS 企业分发、TestFlight 或 MDM 必须使用企业受控地址和有效证书；基座不尝试静默安装。
- 清单不可代替服务端版本治理。若未来要求“清单不可达也禁止旧版调用接口”，应由网关按版本头执行最低版本策略。

### 8.5 升级专项验收

每个环境至少保留“旧版 → 新版”的正式签名测试链：

1. [ ] 无更新、可选更新、`--mandatory`、`--min-code` 四种清单行为正确
2. [ ] 弱网、断网、下载取消、超时、重试均不破坏登录态和其他页面
3. [ ] 篡改 APK、错误 SHA、错误包大小会被阻止安装并删除本地文件
4. [ ] Android 覆盖安装后 token、公司上下文和用户设置保留
5. [ ] 新版本首次启动只提示一次，旧 APK 被清理
6. [ ] Android 8+、主流厂商系统和目标 PDA 的未知来源安装策略已验证
7. [ ] iOS 安装地址、证书、版本识别和返回基座流程已验证
8. [ ] H5/钉钉/微信小程序回归通过，产物不包含 App 原生升级代码
9. [ ] 停用通道后旧版本不再收到更新，CDN/反向代理未缓存旧清单

> CLI 构建和静态检查只能验证代码与资源。真正的覆盖安装、签名一致性、系统安装权限、企业分发证书和升级后数据保留必须使用正式签名真机包验收。

---

## 九、PDA 专项注意事项

PDA 设备除常规验证外，还需单独确认：

| 维度          | 检查项                                                                                        |
| ------------- | --------------------------------------------------------------------------------------------- |
| 系统兼容      | Android 版本、CPU ABI、系统 WebView 版本、TLS/内网证书、MDM 安装策略                          |
| 硬件扫码      | 硬件扫描头若输出键盘事件/广播 Intent/厂商 SDK，需按型号增加适配器，**不能假设与相机扫码等价** |
| 预装 App 拉起 | 包可见性、Intent action、失败回退，按设备白名单配置                                           |
| 定位          | 权限开关、室内/室外冷启动、弱网、进程回收、前后台切换                                         |
| 升级          | 连续升级安装、保留登录数据                                                                    |
| 弱网续传      | 断网排队、网络切换、进程回收后补 Token 续传、完成/取消后私有文件清理                          |
| 合规          | 补齐真实隐私政策，未同意前不调用定位/相机等敏感能力                                           |

---

## 十、定位 SDK 配置

### 当前默认（系统模式）

```dotenv
# env/.env（所有环境共享）
VITE_APP_LOCATION_PROVIDER=system
```

系统模式流程：

1. `uni.getLocation({ type: 'wgs84', isHighAccuracy: true })` 获取原始坐标
2. 默认采样 2 次，精度 ≤ 30m 提前结束，否则取 `accuracy` 最小样本
3. 子应用请求 GCJ-02 时，基座本地执行 WGS-84 → GCJ-02 转换
4. 返回完整字段：`coordinateSystem`/`rawCoordinateSystem`/`converted`/`provider`/`sampleCount`/`locatedAt`

### 正式包推荐（商业定位 SDK）

1. 申请企业高德或腾讯定位授权
2. 固定 Android 包名、iOS Bundle ID、Android 签名证书摘要
3. 在 `manifest.json > app-plus.distribute.sdkConfigs.geolocation` 配置 key
4. 将 `VITE_APP_LOCATION_PROVIDER` 改为实际服务商（如 `amap`）
5. 重新制作自定义基座/正式包，Android + iOS 同点回归

> 第三方 SDK 配置后 GCJ-02 由 SDK 原生返回；系统模式保留为无商业 key 时的兜底，不混淆原始坐标系。

---

## 十一、验收清单

### 自动验证

- [ ] `pnpm test:build-env`（环境映射、分支锁和 App 显式选环境）
- [ ] `pnpm check:app`（App 资源前置）
- [ ] `pnpm check:app:package`（独立测试包前置）
- [ ] `pnpm check:app:release`（正式/PDA 分发前置）
- [ ] `pnpm check:platform-isolation`（三端构建后的产物隔离）
- [ ] `pnpm test:resumable`（离线排队、服务端偏移续传、完成和取消）
- [ ] `pnpm test:app-navigation`（App/PDA 导航协议、有限重试和本地错误页）
- [ ] `pnpm exec tsc --noEmit`（TypeScript）
- [ ] App: SIT/UAT/PRE/PRD 构建
- [ ] H5: SIT/UAT/PRE/PRD 构建
- [ ] 微信小程序: SIT/UAT/PRE/PRD 构建
- [ ] ESLint: 改动文件 0 error
- [ ] H5/小程序产物不含 App 原生能力实现
- [ ] App 产物包含 v1 桥接和宿主标记

### 真机验证

Android + iOS 各选 ≥ 2 台设备，室外开阔/室内/弱网三种条件：

1. [ ] 首次拒绝、再次授权、永久拒绝后的提示和恢复路径
2. [ ] 拍照、相册、普通上传、扫码、返回、刷新、网络断开、子应用超时
3. [ ] 同一点连续采样 ≥ 10 次，记录坐标系/accuracy/sampleCount/距点位米数
4. [ ] 点位坐标与定位结果用同一 GCJ-02 地图服务展示
5. [ ] **正式签名包**验证定位（标准基座自带厂商 key，不能替代）
6. [ ] PDA 验证相机扫码与硬件扫描头两条路径 + MDM/ADB 首装/覆盖升级/保留登录
7. [ ] 续传至少跨 3 个分片：中途断网、恢复、App 进程回收后补充新 Token、服务端不产生重复附件
8. [ ] 未调用 `resumable*` 的旧页面仍走原 `uni.uploadFile`，返回结构和交互无变化
9. [ ] 已接入导航协议的子应用仅显示基座头部，动态标题、逐级返回、根页回工作台均正确
10. [ ] 未接入导航协议的旧子应用仍可用 WebView 历史返回；H5/钉钉/小程序头部与返回不变
11. [ ] 断网打开子应用显示基座错误态；恢复网络点“重新加载”可进入，页面不出现英文系统错误页或完整 token URL

> 只有取得正式 AppID、签名和定位 SDK key 后，才能完成 APK/IPA 与真实精度的最终验收。**代码构建通过不能替代真机、企业分发和隐私合规验证。**
