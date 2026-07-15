# App 集成与发布

> 对应项目：移动端门户（wl-mbase）。本文面向**子应用开发者和安卓发布人员**，说明 App 原生基座如何承载远程 H5 子应用、子应用如何调用宿主能力（拍照/定位/扫码）、如何真机调试、如何打包签名。
>
> H5 iframe 桥接方案见 [H5 子应用集成方案](./integration)。

---

## 一、方案定位

wl-mbase App 采用**原生基座 + 远程 H5 子应用**形态：

```text
子应用业务代码（useLocation / useCamera / useQrScanner）
  ↓ @robot-h5/core（子应用依赖）
  ↓ uni.webview SDK（uni.webview.1.5.8.js）
  ↓ uni.postMessage（子 → 基座）
  ↓ wl-mbase App 能力白名单校验 + uni.getLocation/chooseImage/scanCode（基座原生调用）
  ↓ evalJS 派发 mbase:bridge-result（基座 → 子）
  ↓ @robot-h5/core 返回统一结果给业务代码
```

### 与 H5 方案的区别

| 维度 | 钉钉 H5（iframe） | App（原生 web-view） |
|------|-------------------|---------------------|
| 子应用容器 | iframe | uni-app `<web-view>` 组件 |
| 子→基座通信 | `window.parent.postMessage` | `uni.postMessage` |
| 基座→子通信 | `iframe.contentWindow.postMessage` | `childWebView.evalJS()` |
| URL 标记 | 无特殊标记 | 自动追加 `mbase_host=app` + `mbase_bridge_version=1` |
| 能力调用 | 钉钉 JSAPI（`dd.*`） | uni 原生 API（`uni.getLocation/chooseImage/scanCode`） |
| 鉴权 | dd.config 签名 | 无需鉴权（基座原生环境直接调用） |

::: tip 子应用无需区分容器
`@robot-h5/core` 会自动识别 `mbase_host=app` 参数，App 走 `uni.postMessage`，钉钉 H5 走 `window.parent.postMessage`，**业务代码完全一致**。
:::

### 官方依据

- [uni-app web-view](https://uniapp.dcloud.net.cn/component/web-view) — App 远程网页使用 `uni.webview.1.5.8.js`，网页通过 `uni.postMessage` 发消息，App 通过子 WebView `evalJS` 回传
- [uni.getLocation](https://uniapp.dcloud.net.cn/api/location/location) — App 获取 GCJ-02 需配置定位 SDK
- [Geolocation 定位](https://uniapp.dcloud.net.cn/tutorial/app-geolocation) — 国内 Android 正式包需配置企业定位资质
- [App 功能模块](https://uniapp.dcloud.net.cn/tutorial/app-modules) — 扫码/相机/定位必须在 manifest 显式启用
- [完整 manifest](https://uniapp.dcloud.net.cn/tutorial/app-manifest.html) — 系统定位、Android 权限和 iOS 隐私描述配置

---

## 二、子应用接入（开发者必读）

### 2.1 升级依赖

```bash
pnpm add @robot-h5/core@^1.1.1
```

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

::: warning 禁止事项
- **禁止**子应用自行判断 Android/iOS 平台
- **禁止**子应用自行执行 WGS-84 → GCJ-02 坐标转换（基座已处理）
- **禁止**子应用直接调用 `plus.*` 或 `uni.*` 原生 API（全部走桥接）
:::

### 2.3 底层桥接协议

不使用 `@robot-h5/core` 的项目（如非 Vue），可直接按协议调用：

**请求（子 → 基座）**：

```ts
uni.postMessage({
  data: {
    source: 'mbase-bridge',
    type: 'capability:invoke',
    id: '唯一请求ID',              // 格式：[A-Za-z0-9:_-]{1,100}
    api: 'takePhoto',              // takePhoto | takePhotoAndUpload | getLocation | scan | debugInfo
    payload: { max: 1 },           // 请求参数，UTF-8 字节 ≤ 64KB
    protocol: 1,
    host: 'app',
  }
})
```

**响应（基座 → 子）**：基座通过 `evalJS` 派发 `mbase:bridge-result` 事件：

```ts
window.addEventListener('mbase:bridge-result', (event: CustomEvent) => {
  const result = event.detail
  // { source, type, id, ok: boolean, data?, error?, reason? }
})
```

### 2.4 五个能力详解

| api | 说明 | payload | 返回 data |
|-----|------|---------|-----------|
| `takePhoto` | 拍照（含压缩 + base64） | `{ max?: number }`（默认1，最大3） | `{ images: string[] }`（dataURI） |
| `takePhotoAndUpload` | 拍照直传后端 | `{ max?, url, formData?, header? }` | `{ results: any[] }`（上传响应） |
| `getLocation` | 获取定位（多采样 + 坐标转换） | `{ coordinateSystem?, enableHighAccuracy?, sampleCount?, timeout? }` | `{ latitude, longitude, accuracy, coordinateSystem, rawCoordinateSystem, converted, provider, platform, sampleCount, locatedAt }` |
| `scan` | 扫一扫 | `{ type?: 'qrCode'\|'barCode'\|'all' }` | `{ text: string }` |
| `debugInfo` | 诊断信息（调试用） | 无 | `{ bridge, protocol, appVersion, environment, domain, platform, locationProvider, sourceApi }` |

### 2.5 定位坐标系说明

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
- `accuracy=24m` 是设备估计范围，不代表实际只差 24 米

---

## 三、能力白名单配置

每个子应用能调用的能力**必须显式声明**，在基座 `src/config/portal-apps.ts` 的 `capabilities` 字段：

```ts
{
  id: 'safety',
  name: '智慧安全',
  capabilities: ['takePhoto', 'takePhotoAndUpload', 'getLocation', 'debugInfo'],
  // 不含 'scan' → 该应用无法扫码
}
```

**当前各应用白名单**：

| 应用 | takePhoto | takePhotoAndUpload | getLocation | scan | debugInfo |
|------|:---------:|:------------------:|:-----------:|:----:|:---------:|
| 智慧安全 | ✅ | ✅ | ✅ | ❌ | ✅ |
| 智慧安防 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 智慧环保 | ❌ | ❌ | ❌ | ❌ | ✅ |

> 新增能力必须按应用显式增加，**不能全局放开**。未声明 `capabilities` 的应用只能调用 `debugInfo`。

---

## 四、安全边界（基座强制校验）

| # | 检查项 | 失败结果 |
|---|--------|---------|
| 1 | 子 WebView URL 必须匹配已注册 `mpPath` 和 `appId` | 拒绝调用 |
| 2 | `source/type/id/api/protocol/host` 必须合法 | 丢弃消息 |
| 3 | 请求载荷 UTF-8 字节 ≤ 64 KiB | 丢弃消息 |
| 4 | 应用只能调用白名单内能力 | 返回 `capability_denied` |
| 5 | 重复请求 ID 复用同一结果（防重复拍照/定位） | 返回缓存结果 |
| 6 | 拍照直传只允许子应用同源地址 | 返回 `upload_origin_denied` |
| 7 | 每次调用复核 WebView 当前 URL | 跳出注册路径立即停止 |
| 8 | 扫码外部网址交给系统浏览器 | 不进入受信 WebView |

> 标准 App `<web-view>` 不是不可信沙箱。改用 `plusrequire: 'none'` 会切断 `uni.postMessage` 通道，因此**只能承载同域受控的第一方子应用**。

---

## 五、原生入口扩展（appTarget）

当前所有应用默认打开远程 H5。未来可按应用切换入口：

```ts
// 基座内 UniApp 原生页面
appTarget: { type: 'native', route: '/pages/example/index' }

// 已安装的外部应用（未安装回退 H5）
appTarget: {
  type: 'external',
  androidPackage: 'com.example.app',
  iosScheme: 'example://open',
  fallbackToWeb: true,
}
```

::: warning
- 原生页面必须先加入 `pages.json`
- 外部应用需设计一次性票据或 App Link
- **禁止**把长期 token 裸传到自定义 Scheme
:::

---

## 六、Android 真机调试

### 6.1 前置条件

- HBuilderX 已安装（建议 `D:\development\HBuilderX`）
- Android 手机开启「开发者选项」+「USB 调试」
- `adb devices -l` 显示 `device`（不能是 `unauthorized`）

### 6.2 标准基座快速调试

1. HBuilderX 登录 DCloud，导入 `wl-mbase` 项目
2. 菜单「运行 → 运行到 Android App 基座」
3. 首次运行自动安装 DCloud 标准基座，再同步项目资源
4. 验证：登录 → 远程 H5 → 返回 → 定位 → 拍照 → 扫码 → 断网 → 权限拒绝

::: warning 标准基座局限
使用 DCloud 的包名、证书和三方 SDK 配置，**不能证明正式包的定位 SDK、权限、签名和升级链正确**。仅适合功能调试。
:::

### 6.3 指定环境调试（SIT）

HBuilderX 默认用 production 模式。需指向 SIT 时，**先完全退出 HBuilderX**，在新 PowerShell 注入环境变量后启动：

```powershell
$env:HBUILDERX_HOME = 'D:\development\HBuilderX'
Get-Content env/.env.sit | ForEach-Object {
  if ($_ -match '^\s*(VITE_[A-Za-z0-9_]+)=(.*)$') {
    [Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
  }
}
Start-Process "$env:HBUILDERX_HOME\HBuilderX.exe"
```

### 6.4 调试技巧

- 调用 `debugInfo` 能力获取基座诊断：`{ bridge, protocol, appVersion, environment, domain, platform, locationProvider }`
- 连续定位采样 ≥ 10 次，记录 `coordinateSystem`/`accuracy`/`sampleCount`/距点位米数
- 权限拒绝后检查：Android 设置 → 应用 → wl-mbase → 权限
- WebView 控制台日志通过 HBuilderX「调试 → 调试 WebView」

---

## 七、构建与打包

### 7.1 三类产物

| 产物 | 用途 | 可独立安装 | 状态 |
|------|------|:---------:|------|
| App 资源（wgt） | 编译验证、离线 SDK 输入 | ❌ | ✅ |
| HBuilderX 标准基座 | Android 热调试 | 由 HBuilderX 安装 | ✅ 需连接设备 |
| 独立 APK | 内部测试、PDA/MDM/USB 分发 | ✅ | 需确定 AppID/包名/签名 |

### 7.2 CLI 构建命令

```bash
# 前置检查（模块 + 权限 + 隐私描述 + 定位提供方）
pnpm check:app

# 各环境 App 资源
pnpm build:app:sit    # SIT
pnpm build:app:uat    # UAT
pnpm build:app:pre    # PRE
pnpm build:app:prd    # 生产

# 本地开发
pnpm dev:app
```

> 产物位于 `dist/build/app`，**不是 APK/IPA**。独立安装包需 HBuilderX 云打包或原生离线 SDK 生成。

### 7.3 独立测试 APK（公共证书）

```powershell
$env:ANDROID_PACKAGE_NAME = '<企业反向域名>.mbase.sit'
$env:ANDROID_CERT_MODE = 'public'
pnpm check:app:package

$project = (Resolve-Path '.').Path
& "$env:HBUILDERX_HOME\cli.exe" project open --path $project
& "$env:HBUILDERX_HOME\cli.exe" pack `
  --project $project --platform android --safemode true `
  --android.packagename $env:ANDROID_PACKAGE_NAME `
  --android.androidpacktype 1
```

::: danger 公共证书限制
`androidpacktype=1` 是公共证书，**只适合一次性验证**。不能与私有证书形成覆盖升级链，绝不能作为 PDA 部署或生产包。
:::

### 7.4 正式分发与 PDA（私有证书）

```powershell
$env:ANDROID_CERT_MODE = 'private'
$env:ANDROID_PACKAGE_NAME = '<企业反向域名>.mbase'
$env:ANDROID_KEYSTORE_PATH = '<受控目录>\mbase.jks'
$env:ANDROID_CERT_ALIAS = '<alias>'
$env:ANDROID_CERT_PASSWORD = '<由密钥平台注入>'
$env:ANDROID_STORE_PASSWORD = '<由密钥平台注入>'
pnpm check:app:release
```

> **每次升级保持包名和签名不变，递增 `versionCode`**；SIT 与 PRD 用不同包名可在同一 PDA 共存。证书密码不提交仓库，由密钥管理注入。

### 7.5 正式打包前置条件

- [ ] DCloud AppID（当前 `manifest.json.appid` 为空）
- [ ] Android Application ID + 签名证书 + 证书摘要
- [ ] iOS Bundle ID + 开发者证书 + provisioning profile
- [ ] 企业隐私政策 + 首次启动隐私同意流程
- [ ] 高德/腾讯定位商业资质（key 需与包名/证书匹配）
- [ ] App 图标、启动图、版本号、升级策略

---

## 八、PDA 专项注意

| 维度 | 检查项 |
|------|--------|
| 系统兼容 | Android 版本、CPU ABI、系统 WebView、TLS/内网证书、MDM 安装策略 |
| 硬件扫码 | 扫描头输出键盘事件/广播 Intent/厂商 SDK 需按型号增加适配器，**不能假设与相机扫码等价** |
| 预装 App | 包可见性、Intent action、失败回退，按设备白名单配置 |
| 定位 | 权限开关、室内/室外冷启动、弱网、进程回收、前后台切换 |
| 升级 | 连续升级安装、保留登录数据 |
| 合规 | 补齐隐私政策，未同意前不调用敏感能力 |

---

## 九、定位 SDK 配置

### 系统模式（当前默认）

```dotenv
VITE_APP_LOCATION_PROVIDER=system
```

1. `uni.getLocation({ type: 'wgs84', isHighAccuracy: true })` 获取原始坐标
2. 采样 2 次，精度 ≤ 30m 提前结束，否则取 `accuracy` 最小样本
3. 请求 GCJ-02 时基座本地执行 WGS-84 → GCJ-02 转换

### 商业 SDK（正式包推荐）

1. 申请企业高德/腾讯定位授权
2. 固定 Android 包名、iOS Bundle ID、签名证书摘要
3. `manifest.json > app-plus.distribute.sdkConfigs.geolocation` 配置 key
4. `VITE_APP_LOCATION_PROVIDER` 改为 `amap` 等
5. 重新制作基座/正式包，Android + iOS 同点回归

---

## 十、验收清单

### 自动验证

- [ ] `pnpm check:app` / `pnpm check:app:package` / `pnpm check:app:release`
- [ ] `pnpm exec tsc --noEmit`
- [ ] App / H5 / 小程序: SIT/UAT/PRE/PRD 构建
- [ ] ESLint: 0 error
- [ ] H5/小程序产物不含 App 原生能力；App 产物含 v1 桥接和宿主标记

### 真机验证

Android + iOS 各 ≥ 2 台，开阔/室内/弱网三条件：

1. [ ] 权限拒绝/再次授权/永久拒绝的提示和恢复
2. [ ] 拍照/上传/扫码/返回/刷新/断网/超时
3. [ ] 同点采样 ≥ 10 次，记录坐标系/accuracy/sampleCount/距点位米数
4. [ ] 坐标与定位结果用同一 GCJ-02 地图服务展示
5. [ ] **正式签名包**验证定位（标准基座不能替代）
6. [ ] PDA 验证相机扫码与硬件扫描头 + MDM/ADB 首装/升级/保留登录

> 代码构建通过**不能替代**真机、企业分发和隐私合规验证。
