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
  ↓
进入登录页 /pages/login/index
  ↓
H5 + 钉钉 UA + DINGTALK_SSO_ENABLED=true + 当前未登录
  ↓
getDingTalkAuthCode(corpId)
通过 dd.runtime.permission.requestAuthCode 获取一次性 code
  ↓
GET /auth/dingtalk/login?code={code}
  ↓
后端用 code 换钉钉身份 → 匹配系统用户 → 签发系统 token
  ↓
前端写入 token → 补拉 /hrms/user/getCurUser
  ↓
跳转工作台 → 读取 userOrganizeInfo
```

关键点：
- `requestAuthCode` 是钉钉免鉴权 JSAPI，不需要先走 `dd.config` 签名
- 免登只在 H5 构建内执行，且必须命中钉钉 UA；微信小程序、App、普通浏览器 H5 不触发
- 免登失败保留在钉钉失败提示态，不展示账号密码登录框

## 2. 前端开关

文件 `src/constants/app.ts`：

```ts
export const DINGTALK_SSO_ENABLED = true
```

| 值 | 行为 |
|----|------|
| `true` | 钉钉 H5 内自动免登；钉钉内不展示账号密码登录框；退出按钮变为「退出应用」 |
| `false` | 所有场景走原手动登录，钉钉里也显示登录页 |

## 3. 获取免登码

文件 `src/utils/dingtalk/config.ts`：

```ts
const code = await getDingTalkAuthCode(DINGTALK_CORP_ID)
```

实现要点：
- 动态加载钉钉 JSAPI
- 优先在 `dd.ready` 后调用 `dd.runtime.permission.requestAuthCode`
- 1 秒后兜底直接调用一次（部分钉钉版本未 `dd.config` 时 `ready` 不回调）
- 6 秒未拿到结果返回 `null`，登录页展示免登失败提示

## 4. 后端接口约定

### 接口定义

```http
GET /auth/dingtalk/login?code={code}
```

| 参数 | 必填 | 说明 |
|------|------|------|
| `code` | 是 | `requestAuthCode` 返回的一次性免登码（约 5 分钟内有效） |

### 成功响应

```json
{ "code": 2000, "message": "成功", "data": "eyJhbGciOi..." }
```

`data` 必须是系统 access token 字符串。前端写入后：
- 置空 `refreshToken`
- `tokenExpiresAt` 设为当前时间后 8 小时
- 调用 `/hrms/user/getCurUser` 补全用户信息

### 失败响应

```json
{ "code": 4001, "message": "无效token!", "data": null }
```

### 推荐错误码

| 错误码 | 前端提示 |
|--------|---------|
| `DINGTALK_USER_NOT_BOUND` | 未匹配到系统账号，请联系管理员维护绑定关系 |
| `SYSTEM_USER_DISABLED` | 关联系统账号已禁用 |
| `DINGTALK_CODE_INVALID` | 免登凭证无效或已过期，请从钉钉重新进入 |
| `DINGTALK_CONFIG_ERROR` | 应用配置不可用，请联系管理员 |
| `DINGTALK_API_ERROR` | 网络或服务异常，请稍后重试 |

### 后端处理步骤

1. AppKey / AppSecret 换钉钉 access_token（服务端缓存）
2. 用 `code` 调钉钉接口换 `userid`
3. 按 `userid` / 手机号 / 工号匹配系统用户
4. 签发系统 access token 返回

## 5. 多端隔离

| 端 | 触发免登 | 登录态存储 |
|----|---------|-----------|
| 钉钉 H5 | ✅ | 钉钉 WebView 域名本地存储 |
| 普通浏览器 H5 | ❌ 走手动登录 | 浏览器同源存储 |
| 微信小程序 | ❌ 条件编译隔离 | 小程序独立 storage |
| App | ❌ | App 独立 storage |

## 6. 联调步骤

1. 确认 SIT/UAT/PRD 钉钉后台首页地址和安全域名正确
2. 用 `dd-auth-test.html` 在钉钉内确认能拿到 `authCode`
3. 用真实 `authCode` 请求 `GET /auth/dingtalk/login?code=...`，确认返回 token
4. 清一次钉钉内 mbase H5 缓存（避免历史 token 影响）
5. 确认 `DINGTALK_SSO_ENABLED` 为 `true`
6. 钉钉真机验证：工作台入口 → 免登遮罩 → 工作台 → 子应用 → 退出
7. 用未绑定/禁用账号验证失败态：不出现登录框，只有错误提示

---

# 第二部分：钉钉 JSAPI 鉴权

> 调用拍照、定位等敏感 JSAPI 前必须先 `dd.config` 签名鉴权，否则报 `No permission info for action: ...`。

## 1. 为什么需要后端

签名 `signature` 依赖 `jsapi_ticket`，`jsapi_ticket` 依赖 `access_token`，都需要 **AppKey / AppSecret** 去钉钉换取。**AppSecret 绝不能放前端**，所以签名必须由后端计算。

```text
前端(mbase)                         后端                         钉钉服务端
   │  GET /dingtalk/jsapi-signature    │                              │
   │      ?url=当前页面URL              │                              │
   │─────────────────────────────────►│                              │
   │                        (缓存)    │── gettoken(AppKey/Secret) ──►│
   │                                  │◄────── access_token ─────────│
   │                        (缓存)    │── get_jsapi_ticket ─────────►│
   │                                  │◄────── jsapi_ticket ─────────│
   │                                  │  SHA1 计算 signature          │
   │◄── {agentId,corpId,timeStamp,    │                              │
   │      nonceStr,signature} ───────│                              │
   │  dd.config(...) → dd.ready → 调拍照/定位                         │
```

## 2. 后端接口

```http
GET /dingtalk/jsapi-signature?url={当前页面URL}
```

| 项 | 内容 |
|----|------|
| 方法 | `GET`（POST 亦可） |
| 入参 | `url`：前端当前页面 URL（已 URL 编码） |
| 鉴权 | 复用现有登录态 |

### 返回体（成功）

```json
{
  "code": 0,
  "data": {
    "agentId": "微应用 AgentId",
    "corpId": "企业 CorpId",
    "timeStamp": "1717123456",
    "nonceStr": "Wm3WZYTPz0wzccnW",
    "signature": "f4d9a1c0b2e3...（sha1，40位小写十六进制）"
  }
}
```

::: warning 字段名不可改
`data` 内 5 个字段名前端按这些 key 取值。`timeStamp/nonceStr` 必须是**本次签名计算用的同一份**，不能另算。
:::

## 3. 签名计算（务必按此实现）

### Step 1 获取 access_token（缓存）

```http
GET https://oapi.dingtalk.com/gettoken?appkey={AppKey}&appsecret={AppSecret}
```

有效期 7200 秒，**必须服务端缓存**（建议 7000 秒刷新）。

### Step 2 获取 jsapi_ticket（缓存）

```http
GET https://oapi.dingtalk.com/get_jsapi_ticket?access_token={access_token}
```

有效期 7200 秒，同样必须缓存。

### Step 3 计算 signature

按**固定顺序**拼接明文串（参数名全小写，值用原始值，**不做 URL 转义**）：

```text
jsapi_ticket={ticket}&noncestr={nonceStr}&timestamp={timeStamp}&url={url}
```

对明文串做 **SHA1**，得到 40 位小写十六进制字符串。

### 高频错误（务必避免）

| 错误 | 正确做法 |
|------|---------|
| 用了 SHA256 | 必须用 **SHA1** |
| 后端自己拼 URL | `url` 用前端传来的**原值**参与计算，不 decode、不归一化 |
| nonceStr/timeStamp 另算一份 | 用于签名的值必须**原样返回**给前端 |
| 钉钉 gettoken 判断 errcode | 成功时不返回 errcode，判断成败看是否拿到 access_token |

## 4. 钉钉后台配置

| 配置 | 说明 |
|------|------|
| AppKey / AppSecret | 应用唯一标识和密钥（AppSecret 仅后端） |
| AgentId | 微应用 ID |
| CorpId | 企业 ID |
| 安全域名白名单 | 含各环境域名（SIT/UAT/PRD） |
| JSAPI 权限 | 开通拍照、定位权限 |

## 5. 前端模块

`src/utils/dingtalk/` 按职责拆分 5 个子模块：

| 子模块 | 文件 | 职责 |
|--------|------|------|
| 共享工具 | `shared.ts` | 环境检测 `isDingTalkEnv()`、JSAPI 动态加载、通用调用封装 |
| 鉴权初始化 | `config.ts` | `dingtalkConfig()`：拉签名 → `dd.config` → `dd.ready`，按 URL 缓存复用 |
| 拍照选图 | `photo.ts` | 拍照/选图（含 iOS 降级策略） |
| 文件上传 | `upload.ts` | 文件上传/拍照直传（安卓双路 + iOS 单路） |
| 设备能力 | `device.ts` | 定位（需鉴权）/ 扫码（免鉴权） |

### 鉴权 API 列表

```ts
[
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

- 用户**首次点击拍照/定位**时惰性触发 `dingtalkConfig()`
- webview 容器页 `onMounted` 时预鉴权一次
- 鉴权结果按签名 URL 缓存，同一 URL 不重复签名
- 非敏感 API（扫码 `biz.util.scan`）无需鉴权

---

# 第三部分：钉钉真机调试

> 调试钉钉微应用中的 JSAPI 功能（拍照、定位、上传等），无需本地起服务，无需发版。

## 1. 核心原则

```text
本地 dev server    ❌  JSAPI 签名域名不匹配，拍照/定位全部失效
ngrok 内网穿透     ❌  同上，签名域名不匹配
dingtalk-h5-remote-debug  ✅  调已部署的 UAT/SIT，签名域名完全一致
```

> 根本原因：钉钉 JSAPI 签名绑定注册域名（如 `ytiop-uat.walsin.com.cn`），换任何其他 URL 都无法通过签名校验。

## 2. 工作原理

```text
真机（手机钉钉）
  访问 UAT 已部署的 wl-mbase
  dingtalk-h5-remote-debug SDK 已内嵌（休眠状态）
    │ 通过调试平台链接激活 SDK
    ▼
调试平台（电脑浏览器）
  https://open-dev.dingtalk.com/fe/api-tools#/debug/h5
  实时接收：Console 日志 / Network 请求 / Elements
```

关键特性：
- SDK 仅在「通过调试平台链接打开」时激活，正常用户访问完全无感
- 可将调试代码发布到线上，永久有效，**不需要再次发版**
- 支持 Android / iOS 双端

## 3. 接入步骤（一次性）

SDK已在 `index.html` 引入：

```html
<script src="https://g.alicdn.com/code/npm/@ali/dingtalk-h5-remote-debug/0.1.3/index.js"></script>
```

只需确保部署包包含该 `index.html` 即可，无需额外初始化。

## 4. 每次调试流程

```
1. 打开调试平台 https://open-dev.dingtalk.com/fe/api-tools#/debug/h5
2. 选择应用 → 点击「开始调试」→ 复制调试链接
3. 在手机钉钉发送/打开该链接
4. 手机端正常操作（拍照、定位等）
5. 电脑端实时查看 Console + Network
```

## 5. 调试内容对照

| 调试目标 | 看什么 | 关键 log |
|---------|--------|---------|
| 拍照是否成功 | Console | `[DingTalk:takePhoto] platform:` |
| 上传参数 | Console + Network | `[DingTalk:uploadFile] request:` |
| 上传返回值 | Console + Network | `[DingTalk:uploadFile] raw response:` |
| 签名是否通过 | Console | `签名校验失败(signUrl=...)` |
| iOS 降级 | Console | `[DingTalk:uploadFile] 新版API失败，降级旧版` |
| 安卓文件类型非法 | Network | HTTP 200 + `{"code":5000,"message":"文件类型非法!"}` |

## 6. 各方案对比

| 方案 | 需本地服务 | iOS JSAPI | Android JSAPI | Console | Network | 推荐度 |
|------|:---------:|:---------:|:------------:|:-------:|:-------:|:------:|
| dingtalk-h5-remote-debug | ❌ | ✅ | ✅ | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| vConsole 注入 | ❌ | ✅ | ✅ | ✅ | ❌ | ⭐⭐⭐ |
| 本地 dev + ngrok | ✅ | ❌ 签名失败 | ❌ 签名失败 | ✅ | ✅ | ❌ |
| USB Chrome inspect | ❌ | ❌ | ⚠️ 有限 | ✅ | ✅ | ⭐⭐ |

---

## 免登与 JSAPI 鉴权的关系

| 维度 | 免登（`requestAuthCode`） | JSAPI 鉴权（`dd.config`） |
|------|--------------------------|--------------------------|
| 解决什么 | 钉钉身份 → 平台 token（你是谁） | 应用凭证 + URL + ticket → 签名（能不能调设备能力） |
| 需要 dd.config | ❌ 免鉴权 JSAPI | ✅ |
| 依赖 | AppKey + CorpId | AppKey + AppSecret + jsapi_ticket |
| 改动影响 | 改免登方式不影响鉴权 | 鉴权不依赖登录方式 |
