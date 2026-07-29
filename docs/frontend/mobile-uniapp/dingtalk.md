# 钉钉集成方案

> 对应项目：移动端门户（wl-mbase）。本文整合钉钉三大集成场景：**免登（SSO）**、**JSAPI 鉴权（拍照/定位/扫码）**、**真机调试**。
>
> 三个场景相互独立：免登解决「你是谁」，JSAPI 鉴权解决「能不能调设备能力」，真机调试解决「怎么排查线上问题」。

---

# 第一部分：钉钉免登（SSO）

> 钉钉 H5 内只走免登，不展示账号密码登录框；免登失败时展示原因提示和「我已知晓」按钮。

## 1. 整体流程

```text
用户在钉钉工作台打开 mbase H5 微应用
        │
        ▼
进入登录页 /pages/login/index
        │
        ▼
H5 + 钉钉 UA + DINGTALK_SSO_ENABLED=true + 当前未登录
        │
        ▼
getDingTalkAuthCode(corpId)
通过 dd.runtime.permission.requestAuthCode 获取一次性 code
        │
        ▼
GET /auth/dingtalk/login?code={code}
        │
        ▼
后端用 code 换钉钉身份，匹配系统用户，签发系统 token
        │
        ▼
前端写入 userStore.token，补拉 /hrms/user/getCurUser
        │
        ▼
跳转工作台 /pages/index/index
        │
        ▼
工作台使用当前用户 ID 调用 /hrms/user/getById，读取 userOrganizeInfo
```

关键点：

- `requestAuthCode` 是钉钉免鉴权 JSAPI，不需要先走 `dd.config` 签名。
- 免登只在 H5 构建内执行，并且必须命中钉钉 UA。微信小程序、App、普通浏览器 H5 不会触发。
- 免登失败会保留在钉钉失败提示态，不展示账号密码登录框，避免钉钉用户手动登录其它系统账号。

## 2. 前端现状

### 2.1 开关

文件：`src/constants/app.ts`

```ts
export const DINGTALK_SSO_ENABLED = true
```

- `false`：所有场景走原手动登录，钉钉里也显示登录页。
- `true`：钉钉 H5 内自动免登；钉钉内不展示账号密码登录框；设置页/我的页的退出按钮变为"退出应用"，调用钉钉关闭当前微应用。

### 2.2 触发位置

文件：`src/pages/login/index.vue`

当前实现是在登录页触发免登，而不是在 `App.vue` 里提前拦截：

```ts
if (DINGTALK_SSO_ENABLED) {
  attemptDingTalkSSO()
}
```

`attemptDingTalkSSO()` 的触发条件：

- H5 平台；
- `isDingTalkEnv()` 为 true；
- `userStore.isLoggedIn` 为 false；
- `VITE_DINGTALK_CORP_ID` 已配置。

### 2.3 获取免登码

文件：`src/utils/dingtalk/config.ts`

```ts
const code = await getDingTalkAuthCode(DINGTALK_CORP_ID)
```

实现要点：

- 动态加载钉钉 JSAPI；
- 优先在 `dd.ready` 后调用 `dd.runtime.permission.requestAuthCode`；
- 1 秒后兜底直接调用一次，避免部分钉钉版本在未 `dd.config` 时 `ready` 不回调；
- 6 秒未拿到结果则返回 `null`，登录页展示钉钉免登失败提示。

### 2.4 写入登录态

文件：`src/stores/modules/user.ts`

```ts
await userStore.loginByDingTalk(code)
```

前端期望后端成功返回项目统一业务包：

```json
{
  "code": 2000,
  "message": "成功",
  "data": "系统 access_token 字符串"
}
```

HTTP 封装会把 `data` 解出来，所以 `loginByDingTalk()` 拿到的是 token 字符串。随后前端会：

- 写入 `token`；
- 置空 `refreshToken`；
- 将 `tokenExpiresAt` 设为当前时间后 8 小时；
- 调用 `/hrms/user/getCurUser` 补全用户信息、权限和角色；
- 工作台再用当前用户 ID 调用 `/hrms/user/getById`，从 `userOrganizeInfo` 获取公司与部门展示信息。

## 3. 后端接口约定

### 3.1 当前前端调用

```http
GET /auth/dingtalk/login?code={code}
```

| 参数   | 必填 | 说明                                                                |
| ------ | ---- | ------------------------------------------------------------------- |
| `code` | 是   | `requestAuthCode` 返回的一次性免登码，约 5 分钟内有效，只能使用一次 |

免登登录接口不传 `companyId`；登录成功进入工作台后，前端通过 `/hrms/user/getCurUser` 与 `/hrms/user/getById` 获取该用户维护在平台里的 `userOrganizeInfo`，再选择主公司或用户上次选择的公司作为当前公司上下文。详见 [H5 子应用集成方案 · 公司上下文透传](/frontend/mobile-uniapp/integration#十-公司上下文透传)。

### 3.2 成功响应

```json
{
  "code": 2000,
  "message": "成功",
  "data": "eyJhbGciOi..."
}
```

说明：

- `data` 必须是系统 access token 字符串；
- 后续请求统一由前端带 `Authorization: Bearer {token}`；
- 当前免登 token 没有 `refreshToken`，前端按 8 小时本地过期时间处理。

### 3.3 失败响应

失败也返回项目统一业务包，HTTP 状态通常保持 200：

```json
{
  "code": 4001,
  "message": "无效token!",
  "data": null
}
```

前端会抛出 `{ code, message }`，登录页捕获后展示钉钉免登失败提示，不再露出账号密码登录框。

### 3.4 推荐错误码

为了让前端能精准提示，建议后端尽量返回稳定错误码：

| 错误码                    | 前端提示                                                                         |
| ------------------------- | -------------------------------------------------------------------------------- |
| `DINGTALK_USER_NOT_BOUND` | 当前钉钉用户未匹配到系统账号，请联系管理员维护手机号、工号或钉钉 userid 绑定关系 |
| `SYSTEM_USER_DISABLED`    | 当前钉钉用户关联的系统账号已被禁用或停用，请联系管理员处理                       |
| `DINGTALK_CODE_INVALID`   | 钉钉免登凭证无效或已过期，请从钉钉工作台重新进入应用                             |
| `DINGTALK_CONFIG_ERROR`   | 钉钉应用配置暂不可用，请联系管理员检查应用配置和服务白名单                       |
| `DINGTALK_API_ERROR`      | 网络或服务暂时异常，请稍后从钉钉工作台重新进入应用                               |

当前前端也会对常见中文错误信息做兜底识别，例如"未绑定/未匹配/禁用/无效/过期/白名单"等；但最佳实践仍是后端返回明确错误码。

### 3.5 后端处理步骤

1. 用 AppKey / AppSecret 换钉钉 access_token，并在服务端缓存。
2. 用前端传入的 `code` 调钉钉接口换 `userid`。
3. 按 `userid`、手机号或工号匹配系统用户。
4. 匹配成功后签发系统 access token。
5. 按 3.2 的结构返回 token 字符串。

## 4. 环境配置

`VITE_DINGTALK_CORP_ID` 已放在 `env/.env`，各 mode 会继承：

```env
VITE_DINGTALK_CORP_ID=ding20410a13904f00c74ac5d6980864d335
```

钉钉开放平台还需要确认：

| 配置项             | 作用                                       | 负责人      |
| ------------------ | ------------------------------------------ | ----------- |
| AppKey / AppSecret | 后端换钉钉 access_token                    | 后端        |
| CorpId             | 前端 requestAuthCode 入参                  | 前端+后端   |
| 应用首页地址       | 钉钉工作台入口，如 `https://{域名}/mbase/` | 前端        |
| 安全域名           | JSAPI 可用域名白名单                       | 前端/管理员 |
| 服务器出口 IP      | 后端访问钉钉服务端接口白名单               | 后端        |

## 5. 历史登录态与多端隔离

### 5.1 历史手动登录 token

如果钉钉 WebView 里之前手动登录过，并且本地仍保留有效 token，打开 `DINGTALK_SSO_ENABLED` 后首次进入时，前端会认为已经登录，直接进工作台，不会再立即发起钉钉免登。

切换正式免登前，建议清一次钉钉内 mbase H5 缓存或本地登录态。清理后，钉钉内没有旧手动登录 token，后续未登录进入登录页时会自动走免登。

### 5.2 后续是否还会出现

清理一次后，正常情况下不会再出现"历史手动登录 token 抢先命中"的问题，因为：

- 钉钉免登开启后，钉钉内未登录会自动免登；
- 免登场景的"退出"是关闭微应用，不再引导用户手动登录；
- token 过期或 401 后会回到登录页，再自动走免登。

仍需注意两个边界：

- 如果人为关闭免登开关并在钉钉里再次手动登录，后续再打开开关，仍可能留下新的手动登录 token。
- 如果同一台设备的钉钉切换了账号，而 mbase 旧 token 仍未过期，当前实现不会每次启动都强制重新取钉钉身份。若将来要求"永远以当前钉钉账号为准"，需要增加登录来源标记或启动强制 SSO 校验。

### 5.3 多端隔离

| 端             | 是否触发钉钉免登               | 登录态存储关系                              |
| -------------- | ------------------------------ | ------------------------------------------- |
| 钉钉 H5 微应用 | 是，需 H5 + 钉钉 UA + 开关开启 | 存在钉钉 WebView 当前域名的本地存储中       |
| 普通浏览器 H5  | 否，仍走手动登录               | 浏览器自己的同源存储，不与钉钉 WebView 共享 |
| 微信小程序     | 否，条件编译隔离               | 小程序独立 storage，不与 H5/DingTalk 共享   |
| App            | 否，当前不走钉钉免登           | App 独立 storage                            |

因此，放开钉钉免登不会影响微信小程序访客入口、微信小程序登录、App 登录，也不会影响普通浏览器 H5 的手动登录入口。

## 6. 联调与放开步骤

1. 确认 SIT/UAT/PRD 钉钉后台首页地址和安全域名正确。
2. 用 `dd-auth-test.html` 在钉钉内确认能拿到 `authCode`。
3. 用真实 `authCode` 请求 `GET /auth/dingtalk/login?code=...`，确认成功返回 `{ code: 2000, data: "<token>" }`。
4. 清一次钉钉内 mbase H5 缓存或登录态，避免历史手动登录 token 影响首次验证。
5. 确认 `src/constants/app.ts` 中 `DINGTALK_SSO_ENABLED` 为 `true`。
6. 在钉钉真机验证：打开工作台入口 → 免登遮罩 → 进入工作台 → 打开子应用 → 退出应用返回钉钉工作台。
7. 用未绑定/禁用账号验证失败态：不出现账号密码登录框，只出现错误提示和"我已知晓"按钮。

## 7. 与钉钉 JSAPI 鉴权的关系

- 免登解决"当前用户是谁"：`requestAuthCode` → 后端换系统 token。
- JSAPI 鉴权解决"能不能调用拍照/定位等能力"：`dd.config` → `dd.ready`。
- 两者独立。免登不依赖 `dd.config`，拍照/定位仍需要按 `src/utils/dingtalk/config.ts` 走签名鉴权。

---

# 第二部分：钉钉 JSAPI 鉴权

> 版本：v2.1 · 更新：2026-07-25
>
> 适用场景：移动端门户（mbase）在钉钉内调用拍照/定位等敏感 JSAPI 报错 `No permission info for action: biz.util.uploadImageFromCamera`，需要后端提供一个 **JSAPI 签名接口**，前端调用 `dd.config` 完成鉴权后即可使用。

## 1. 为什么需要后端

钉钉规定：调用拍照、定位等敏感 JSAPI 前，前端必须先执行 `dd.config(...)` 做签名鉴权。签名 `signature` 的计算依赖 `jsapi_ticket`，`jsapi_ticket` 依赖 `access_token`，都需要应用的 **AppKey / AppSecret** 去钉钉服务端换取。

**AppSecret 绝不能放前端**，所以签名必须由后端计算。前端只负责把「当前页面 URL」传给后端，拿到签名后调用 `dd.config`。

```text
前端(mbase)                         后端                         钉钉服务端
   │   GET 签名接口(?url=当前页URL)   │                              │
   │────────────────────────────────►│                              │
   │                          (缓存) │── gettoken(AppKey/Secret) ──►│
   │                                 │◄──────── access_token ───────│
   │                          (缓存) │── get_jsapi_ticket ─────────►│
   │                                 │◄──────── jsapi_ticket ───────│
   │                                 │  sha1 计算 signature          │
   │◄── {agentId,corpId,timeStamp,   │                              │
   │      nonceStr,signature} ───────│                              │
   │  dd.config(...) → dd.ready 调拍照/定位                          │
```

## 2. 后端需要实现的接口

### 接口定义

| 项   | 内容                                                                  |
| ---- | --------------------------------------------------------------------- |
| 方法 | `GET`（POST 亦可，前端按 GET 对接）                                   |
| 路径 | `/dingtalk/jsapi-signature`（最终路径以后端为准，定好通知前端）       |
| 入参 | `url`：String，必填。前端传来的**当前页面 URL**（已 URL 编码）        |
| 鉴权 | 复用现有登录态（`Authorization: Bearer <token>`），与其他业务接口一致 |

### 返回体（成功）

```json
{
  "code": 0,
  "data": {
    "agentId": "微应用的 AgentId",
    "corpId": "企业的 CorpId",
    "timeStamp": "1717123456",
    "nonceStr": "Wm3WZYTPz0wzccnW",
    "signature": "f4d9a1c0b2e3...（sha1 计算结果，40位小写十六进制）"
  }
}
```

> `data` 内 5 个字段名**不可改**（前端按这些 key 取值）。
> `timeStamp/nonceStr` 必须是**本次签名计算用的同一份**，不能另算。
> 成功码用项目约定即可（0 / 2000 / success=true 前端均能识别）。

## 3. 签名计算（务必按此实现）

### Step 1 获取 access_token（需缓存）

```http
GET https://oapi.dingtalk.com/gettoken?appkey={AppKey}&appsecret={AppSecret}
```

有效期 7200 秒，**必须服务端缓存**（建议 7000 秒过期刷新），禁止每次请求都拉取。

### Step 2 获取 jsapi_ticket（需缓存）

```http
GET https://oapi.dingtalk.com/get_jsapi_ticket?access_token={access_token}
```

有效期 7200 秒，同样**必须缓存**。

### Step 3 计算 signature

1. 后端生成 `nonceStr`（随机串）与 `timeStamp`（时间戳）。
2. 按**固定顺序**拼接明文串（参数名全小写，值用原始值，**不做 URL 转义**）：

```text
jsapi_ticket={ticket}&noncestr={nonceStr}&timestamp={timeStamp}&url={url}
```

3. 对明文串做 **SHA1**，得到 40 位小写十六进制字符串，即 `signature`。

### 高频错误（务必避免）

| 错误 | 正确做法 |
|------|---------|
| 用了 SHA256 | 必须用 **SHA1** |
| 后端自己拼 URL | `url` 用前端传来的**原值**参与计算，不 decode、不归一化 |
| nonceStr/timeStamp 另算一份 | 用于签名的值必须**原样返回**给前端 |
| 钉钉 gettoken 判断 errcode | 成功时不返回 errcode，判断成败看是否拿到 access_token |

### 签名明文示例

```
jsapi_ticket=abcdef123456&noncestr=Wm3WZYTPz0wzccnW&timestamp=1717123456&url=https://ytiop-uat.walsin.com.cn/mbase/
```

## 4. 需要的配置项

| 配置        | 说明                       | 来源                    |
| ----------- | -------------------------- | ----------------------- |
| `AppKey`    | 应用唯一标识               | 钉钉开放平台 → 应用详情 |
| `AppSecret` | 应用密钥（**仅后端持有**） | 同上                    |
| `AgentId`   | 微应用 ID                  | 同上                    |
| `CorpId`    | 企业 ID                    | 钉钉开放平台/企业信息   |

钉钉后台确认：

1. 该企业内部 H5 微应用已**开通拍照、定位** JSAPI 权限。
2. 安全域名白名单含各环境域名（SIT/UAT/PRD）。

## 5. 前端已完成部分

### API 封装

`src/api/modules/dingtalk.ts`：签名接口调用封装（`getDingTalkJsapiSignature`）。

### JSAPI 鉴权模块

`src/utils/dingtalk/` 按职责拆分为 5 个子模块：

| 子模块     | 文件        | 职责                                                                                                                                                  |
| ---------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 共享工具   | `shared.ts` | 环境检测 `isDingTalkEnv()`、JSAPI 动态加载 `loadJSAPI()`、通用调用封装 `invokeDingTalkApi()`                                                          |
| 鉴权初始化 | `config.ts` | `dingtalkConfig()`：拉签名 → `dd.config({ jsApiList })` → `dd.ready`，按签名 URL 缓存复用                                                             |
| 拍照选图   | `photo.ts`  | 拍照 `dingtalkTakePhoto()`、按 `camera/album` 来源选图 `dingtalkChooseImage()`，含 iOS 降级策略                                                       |
| 文件上传   | `upload.ts` | 原生上传 `dingtalkUploadFile()`（安卓双路 + iOS 单路）、兼容拍照直传 `dingtalkTakePhotoNativeUpload()`、新增选图直传 `dingtalkChooseImageAndUpload()` |
| 设备能力   | `device.ts` | 定位 `dingtalkGetLocation()`（需鉴权）、扫码 `dingtalkScan()`（免鉴权）                                                                               |

### 鉴权 API 列表

```ts
// config.ts 中 JS_API_LIST
const JS_API_LIST = [
  'biz.util.chooseImage',
  'biz.util.chooseMedia',
  'biz.util.uploadFile',
  'biz.util.uploadImage',
  'biz.util.uploadImageFromCamera',
  'device.geolocation.get',
  'device.geolocation.start',
  'biz.util.previewImage',
]
```

### 调用时机

- 进入钉钉子应用 webview 容器页后，`onMounted` 会预鉴权一次；进入门户首页本身不会触发。
- 拍照、相册或定位调用复用预鉴权结果；预鉴权尚未完成或缓存失效时，能力调用会再次等待/触发鉴权。
- 鉴权结果按签名 URL 缓存，同一 URL 不重复签名。
- 非敏感 API（扫码 `biz.util.scan`）无需鉴权。

兼容说明：原有 `takePhoto/takePhotoAndUpload` 链路仍固定使用 `camera`。新增相册能力通过 `chooseImage/chooseImageAndUpload` 调用，并要求子应用显式传入 `source: 'album'`，两条链路互不替换。子应用推荐直接接入跨端媒体 SDK（`window.WLPortalMedia`），详见 [H5 子应用集成方案 · 桥接通信协议](/frontend/mobile-uniapp/integration#六-桥接通信协议)。

## 6. 联调约定

1. 签名接口的**最终路径**（前端默认按 `/dingtalk/jsapi-signature` 对接，不一致请告知）。
2. 返回字段名是否与第二节一致。
3. 确认 `signature` 用 **SHA1**、`url` 已按前端原值参与计算。

## 7. 自测建议

1. 用 Android、iOS 真机钉钉打开 mbase，分别验证拍照、相册选择、取消和原生上传；建议以钉钉 7.0.10 及以上作为 `uploadFile` 验收基线，版本说明见[钉钉官方 JSAPI Explorer](https://open.dingtalk.com/tools/explorer/jsapi?id=10281)。
2. 原生上传传完整 HTTPS 地址，不依赖 `/api/...` 相对路径；确认上传域名符合企业钉钉安全域名/白名单策略。
3. 若仍报 `No permission info for action`，排查：
   - signature 是否用 SHA1
   - 明文里的 url 是否与前端当前 URL（去 hash 后）完全一致
   - nonceStr/timeStamp 是否返回了「参与签名的同一份」
   - 钉钉后台该 JSAPI 权限是否已开通

## 8. 与免登的关系

- **免登**（`requestAuthCode`）：钉钉身份 → 平台 token，解决「你是谁」。免鉴权 JSAPI，无需 `dd.config`。
- **JSAPI 鉴权**（`dd.config`）：应用凭证 + 页面 URL + jsapi_ticket → 签名，解决「能不能调设备能力」。
- 两者**独立**：改免登方式不影响鉴权，鉴权不依赖登录方式。

---

# 第三部分：钉钉真机调试

> 适用场景：调试钉钉微应用中 JSAPI 相关功能（拍照、定位、上传等），无需本地起服务，无需发版即可随时调试。
> 适用项目：`wl-mbase`（门户基座）及各子应用。

## 1. 核心原则

```text
本地 dev server    ❌  JSAPI 签名域名不匹配，拍照/定位全部失效
ngrok 内网穿透     ❌  同上，签名域名不匹配
dingtalk-h5-remote-debug  ✅  调已部署的 UAT/SIT，签名域名完全一致
```

> **根本原因**：钉钉 JSAPI 签名绑定注册域名（如 `ytiop-uat.walsin.com.cn`），换任何其他 URL（localhost、ngrok）都无法通过签名校验。

## 2. 工作原理

```text
┌─────────────────────────────────────────────────────────┐
│  真机（手机钉钉）                                         │
│  访问 UAT 已部署的 wl-mbase                               │
│  dingtalk-h5-remote-debug SDK 已内嵌（休眠状态）          │
└────────────────────┬────────────────────────────────────┘
                     │  通过调试平台链接激活 SDK
                     ▼
┌─────────────────────────────────────────────────────────┐
│  调试平台（电脑浏览器）                                    │
│  https://open-dev.dingtalk.com/fe/api-tools#/debug/h5   │
│  实时接收：Console 日志 / Network 请求 / Elements         │
└─────────────────────────────────────────────────────────┘
```

关键特性：

- SDK 仅在「通过调试平台链接打开」时激活，正常用户访问完全无感。
- 可以将调试代码发布到线上，永久有效，**不需要再次发版**。
- 支持 Android / iOS 双端。
- 支持 Console / Network / Elements 调试。

## 3. 接入步骤（一次性）

### Step 1：确认远程调试 SDK 已内嵌

当前项目已在 `index.html` 引入远程调试 SDK：

```html
<script src="https://g.alicdn.com/code/npm/@ali/dingtalk-h5-remote-debug/0.1.3/index.js"></script>
```

SDK 仅在通过钉钉调试平台链接打开时激活，正常用户访问不进入调试态。

### Step 2：确认入口页面已随 H5 构建发布

无需在 `App.vue` 额外调用初始化方法，也无需安装 npm 包。只要部署包里包含当前 `index.html`，调试 SDK 就已具备。

### Step 3：构建并部署 UAT

```bash
pnpm build:h5:uat
# 部署 dist/ 到 UAT 服务器
```

> ✅ 完成后无需再改代码、再次发版，SDK 永久有效。

## 4. 每次调试流程（5 步）

```
1. 打开调试平台
   https://open-dev.dingtalk.com/fe/api-tools#/debug/h5

2. 选择应用 → 点击「开始调试」→ 复制调试链接

3. 在手机钉钉发送/打开该链接（发给自己的聊天也行）

4. 手机端：正常操作（拍照、定位等）

5. 电脑端：实时查看 Console 日志 + Network 请求
```

## 5. 调试内容对照

| 调试目标                | 看什么            | 关键 log                                               |
| ----------------------- | ----------------- | ------------------------------------------------------ |
| 拍照 JSAPI 是否调用成功 | Console           | `[DingTalk:takePhoto] platform:`                       |
| 上传文件参数是否正确    | Console + Network | `[DingTalk:uploadFile] request:`                       |
| 上传接口返回值          | Console + Network | `[DingTalk:uploadFile] raw response:`                  |
| JSAPI 签名是否通过      | Console           | `签名校验失败(signUrl=...)`                            |
| iOS 降级逻辑是否触发    | Console           | `[DingTalk:uploadFile] 新版API失败，降级旧版`          |
| 安卓文件类型非法        | Network           | HTTP 200 + `{"code":5000,"message":"文件类型非法!"}` |

## 6. 各平台调试能力对比

| 方案                       | 需要本地服务 | iOS JSAPI   | Android JSAPI | Console | Network | 推荐度     |
| -------------------------- | ------------ | ----------- | ------------- | ------- | ------- | ---------- |
| `dingtalk-h5-remote-debug` | ❌ 不需要    | ✅          | ✅            | ✅      | ✅      | ⭐⭐⭐⭐⭐ |
| vConsole 注入              | ❌ 不需要    | ✅          | ✅            | ✅      | ❌      | ⭐⭐⭐     |
| 本地 dev + ngrok           | ✅ 需要      | ❌ 签名失败 | ❌ 签名失败   | ✅      | ✅      | ❌         |
| RC 版调试工具              | —            | —           | —             | —       | —       | ❌ 已停服  |
| Android USB Chrome inspect | ❌ 不需要    | ❌          | ⚠️ 有限       | ✅      | ✅      | ⭐⭐       |

## 7. 常见问题

**Q：调试 SDK 会不会影响线上用户？**
A：不会。SDK 内部检测是否通过调试平台链接打开，普通用户访问时 SDK 完全休眠。

**Q：UAT 代码改了还要重新走接入流程吗？**
A：不需要。接入一次永久有效，后续只需正常发 UAT 版本即可。

**Q：vConsole 和 dingtalk-h5-remote-debug 哪个更好用？**
A：`dingtalk-h5-remote-debug` 能看 Network 请求（抓包），vConsole 看不到 Network，对于调试上传问题首选前者。

**Q：项目已有 `ENABLE_VCONSOLE` 配置但未接入，要不要补全？**
A：可以作为补充。vConsole 适合快速看日志，dingtalk-h5-remote-debug 适合需要看 Network 的深度调试，两者可以并存。

## 8. 相关文档

- [H5 子应用集成方案](/frontend/mobile-uniapp/integration)
- [移动端消息中心使用与架构说明](/frontend/mobile-uniapp/message-center)
- 调试平台：https://open-dev.dingtalk.com/fe/api-tools#/debug/h5
- npm 包：https://www.npmjs.com/package/dingtalk-h5-remote-debug

---

## 免登与 JSAPI 鉴权的关系

| 维度 | 免登（`requestAuthCode`） | JSAPI 鉴权（`dd.config`） |
|------|--------------------------|--------------------------|
| 解决什么 | 钉钉身份 → 平台 token（你是谁） | 应用凭证 + URL + ticket → 签名（能不能调设备能力） |
| 需要 dd.config | ❌ 免鉴权 JSAPI | ✅ |
| 依赖 | AppKey + CorpId | AppKey + AppSecret + jsapi_ticket |
| 改动影响 | 改免登方式不影响鉴权 | 鉴权不依赖登录方式 |
