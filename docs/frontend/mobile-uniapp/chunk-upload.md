# 断点续传能力（弱网上传）

<AuthorTag :authors="['CHENY']" />

> 📦 来源：`wl-mbase` v1.0.6 `docs/断点续传能力设计与接入.md`。切片上传 + 服务端合片，弱网/大文件上传不重来。
> 版本：v1.1 · 更新：2026-07-29
> 适用范围：Android PDA App、钉钉 H5 子应用、普通 H5 / App WebView
> 目标：断网时可靠排队，网络恢复后从服务端确认偏移并继续上传

> 文档分工：子应用开发应先阅读[H5 子应用集成方案 — 断点续传章节](/frontend/mobile-uniapp/integration)，其中包含可直接使用的 App/钉钉/H5 调用代码、状态处理、验证步骤和故障排查。本篇主要面向平台与后端负责人，定义架构边界、服务端协议、安全和完整验收要求。

## 一、结论与边界

断点续传是**新增的可选能力**，不会替换现有上传：

- `takePhoto`、`takePhotoAndUpload`：保持原行为，只拍照。
- `chooseImage`、`chooseImageAndUpload`：保持原行为，仍走整文件上传。
- 只有显式调用 `resumable*` 或加载 `portal-resumable-upload.js` 的页面才进入续传链路。
- 没有网络时无法实际发送数据；“断网可用”指文件和任务先安全落盘，恢复网络后继续。
- 客户端和服务端必须共同实现上传会话协议。服务端未上线前只能验证排队与客户端状态，不能完成真实附件入库。

平台实现不同，但服务端协议统一：

| 宿主        | 文件持久化位置                     | 续传执行方       | 恢复能力                                                |
| ----------- | ---------------------------------- | ---------------- | ------------------------------------------------------- |
| Android App | App 私有 `_doc/mbase-upload-queue` | wl-mbase 原生桥  | 断网恢复自动续传；App 重启后由子应用补充新 Token 再续传 |
| 钉钉 H5     | 子应用 WebView 的 IndexedDB        | 子应用续传 SDK   | 当前页面网络恢复自动续传；页面重载后重新配置 Token 续传 |
| 普通 H5     | 浏览器 IndexedDB                   | 子应用续传 SDK   | 与钉钉 H5 相同                                          |
| 微信小程序  | 本期不开放续传能力                 | 继续原整文件上传 | 微信包不携带续传 SDK，后续立项后单独设计与真机验收      |

钉钉官方 `uploadFile` 接口接收虚拟文件路径并整文件上传，不提供 `uploadId`、分片偏移或暂停/恢复参数。因此，钉钉真续传不能复用虚拟路径，而是由独立 SDK 使用标准 `File/Blob + IndexedDB + fetch` 完成。原钉钉整文件上传继续保留，适合小图片和网络稳定场景。

## 二、总体架构

```text
业务页面交互
  ├─ 普通上传
  │    └─ WLPortalMedia.chooseImageAndUpload
  │         └─ 原 multipart / 钉钉 uploadFile（完全不变）
  │
  └─ 断点续传（业务显式选择）
       ├─ App：mbase App bridge
       │    ├─ 复制文件到 App 私有目录
       │    ├─ uni.storage 持久化任务元数据
       │    └─ ArrayBuffer 分片 + uni.request
       │
       └─ 钉钉/H5：WLPortalResumableUpload
            ├─ 标准文件选择器获取 File/Blob
            ├─ IndexedDB 持久化文件与任务
            └─ Blob.slice + fetch

两端共同访问业务后端续传协议：
创建会话 → 查询服务端偏移 → PUT 分片 → 完成会话
```

关键原则：

1. **以服务端偏移为准**：每次恢复先查询会话，不相信客户端单边记录。
2. **初始化与完成幂等**：使用稳定 `clientRequestId / Idempotency-Key`，重复请求不能生成重复附件。
3. **鉴权不落盘**：Authorization 或自定义 Token 只保存在当前运行内存；页面/App 重启后由业务重新提供。
4. **文件与任务隔离**：App 任务按 `userKey + appId + origin` 隔离，不同账号或子应用都不能互查互删。
5. **顺序分片**：当前单任务按偏移串行上传，避免 PDA 弱网下并发放大和服务端乱序合并。

## 三、服务端协议（必须实现）

以下 `endpoint` 示例为：

```text
https://业务域名/api/resumable-upload
```

### 3.1 创建或恢复会话

```http
POST {endpoint}/sessions
Content-Type: application/json
Idempotency-Key: app-upload-xxx
Authorization: Bearer ...
```

```json
{
  "clientRequestId": "app-upload-xxx",
  "fileName": "inspection.jpg",
  "fileSize": 7340032,
  "mimeType": "image/jpeg",
  "chunkSize": 2097152,
  "metadata": {
    "businessType": "inspection",
    "businessId": "123"
  }
}
```

成功响应：

```json
{
  "uploadId": "server-upload-id",
  "chunkSize": 2097152,
  "uploadedBytes": 0
}
```

服务端要求：

- `(userId, clientRequestId)` 建唯一约束；重复初始化返回同一会话。
- 校验文件大小、MIME、扩展名、业务权限和可用存储空间。
- `chunkSize` 可由服务端调整，范围建议 256 KiB～8 MiB。

### 3.2 查询权威偏移

```http
GET {endpoint}/sessions/{uploadId}
Authorization: Bearer ...
```

上传中：

```json
{
  "status": "uploading",
  "uploadedBytes": 2097152
}
```

已完成：

```json
{
  "status": "completed",
  "uploadedBytes": 7340032,
  "result": {
    "attachmentId": "A10001",
    "url": "/files/A10001"
  }
}
```

会话过期可返回 `404`。客户端会用同一 `clientRequestId` 重新初始化；服务端仍需保证不产生重复业务附件。

### 3.3 上传分片

```http
PUT {endpoint}/sessions/{uploadId}/chunks/{chunkIndex}
Content-Type: application/octet-stream
Content-Range: bytes 2097152-4194303/7340032
X-Upload-Id: server-upload-id
X-Upload-Offset: 2097152
Authorization: Bearer ...

<原始二进制分片>
```

成功响应：

```json
{
  "uploadedBytes": 4194304
}
```

服务端要求：

- 校验 `Content-Range`、`X-Upload-Offset` 与会话当前偏移。
- 已接收的同一分片重复提交必须幂等。
- 偏移冲突返回 `409`；客户端会重新查询服务端偏移。
- 分片写入临时对象，未完成前不能生成正式业务附件记录。
- `408 / 429 / 5xx` 可由客户端有限重试；`4xx` 参数或权限错误不应无限重试。

### 3.4 完成会话

```http
POST {endpoint}/sessions/{uploadId}/complete
Content-Type: application/json
Idempotency-Key: app-upload-xxx:complete
Authorization: Bearer ...
```

```json
{
  "clientRequestId": "app-upload-xxx",
  "fileSize": 7340032,
  "metadata": {
    "businessType": "inspection",
    "businessId": "123"
  }
}
```

成功响应应返回最终附件对象。服务端在完成前必须校验：

- 所有字节已接收，文件总大小一致。
- 分片合并后的摘要、文件类型和安全扫描通过。
- 当前用户仍有提交该业务附件的权限。
- 完成接口重复调用返回同一个附件，不生成重复记录。

## 四、钉钉 / H5 子应用接入

### 4.1 加载与类型

```html
<script src="/mbase/sdk/portal-resumable-upload.js"></script>
```

TypeScript 项目复制：

```text
wl-mbase/public/sdk/portal-resumable-upload.d.ts
  → 子应用/src/types/portal-resumable-upload.d.ts
```

### 4.2 页面初始化

必须在业务登录态就绪后配置最新请求头，并主动恢复历史任务：

```ts
const getToken = () => sessionStorage.getItem('access_token') || ''
// 按子应用实际登录 Store 调整，必须返回稳定工号/用户 ID。
const getUserKey = () => sessionStorage.getItem('user_no') || ''

window.WLPortalResumableUpload.configure({
  getUserKey,
  getHeaders: () => {
    const token = getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  },
  onEvent: job => {
    // 用 job.status / job.progress 更新业务自己的进度 UI。
    console.log('upload state', job.id, job.status, job.progress)
  },
})

// 登录态恢复后调用；SDK 会先向服务端查询 uploadedBytes。
await window.WLPortalResumableUpload.resumeAll()
```

Token 不会写入 IndexedDB。任务同时绑定稳定的 `userKey`，`list/resume/resumeAll/pause/cancel` 都只能操作当前账号任务。若页面重载后没有重新执行 `configure`，任务会停在 `waiting_auth`，不会携带过期 Token 盲目重试；旧版没有账号归属的任务不会自动迁移给当前用户。

退出登录前可调用 `suspendCurrentUser()`；收到基座转发的 `portal-logout` 时 SDK 也会自动暂停当前账号任务并清除运行时鉴权。文件和服务端偏移仍保留，只有同一 `userKey` 再次登录后才能继续。

### 4.3 选择并上传

```ts
const result = await window.WLPortalResumableUpload.chooseAndUpload({
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

const [job] = result.jobs
// 在线成功：completed；断网：offline；鉴权待刷新：waiting_auth。
```

也可把业务已有 `<input type="file">` 得到的文件加入队列：

```ts
const job = await window.WLPortalResumableUpload.enqueue(file, {
  endpoint: import.meta.env.VITE_RESUMABLE_UPLOAD_ENDPOINT,
  metadata: { businessId: formId },
  header: { Authorization: `Bearer ${getToken()}` },
})
```

暂停、继续、取消：

```ts
// 分别绑定到子应用自己的“暂停 / 继续 / 取消”按钮。
const pauseUpload = (jobId: string) =>
  window.WLPortalResumableUpload.pause(jobId)
const resumeUpload = (jobId: string) =>
  window.WLPortalResumableUpload.resume(jobId, {
    header: { Authorization: `Bearer ${getToken()}` },
  })
const cancelUpload = (jobId: string) =>
  window.WLPortalResumableUpload.cancel(jobId)
```

钉钉续传使用标准文件选择器，不使用 `dd.uploadFile` 的虚拟路径。页面按钮、底部弹层、预览和删除仍由子应用实现。

## 五、App 子应用接入

App 使用基座原生桥能力，文件会从临时路径复制到 App 私有目录，并由基座按 `userKey + appId + origin` 隔离。账号退出只暂停其任务并撤销内存鉴权，不删除文件，也不会让下一账号看到或恢复。以下 `callAppBridge` 指子应用按照《APP集成与发布》2.3 节封装的 v1 桥调用。

### 5.1 选择并进入续传队列

```ts
const result = await callAppBridge('resumableChooseAndUpload', {
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

console.log(result.jobs)
```

桥调用在文件成功进入私有队列后即返回，不会等待大文件全部上传完成，避免 WebView 桥超时。子应用通过 `resumableList` 轮询或在页面重新进入时读取最新进度。

App 会校验 `endpoint` 与当前注册子应用同源。跨域上传不会被放行；如需统一文件域名，应由子应用同源后端做代理或先经过平台安全评审调整可信域配置。

### 5.2 查询与控制任务

```ts
const { jobs } = await callAppBridge('resumableList', {})

// 分别绑定到子应用自己的“暂停 / 继续 / 取消”按钮。
const pauseUpload = (jobId: string) =>
  callAppBridge('resumablePause', { jobId })
const resumeUpload = (jobId?: string) =>
  callAppBridge('resumableResume', {
    jobId, // 省略表示恢复当前子应用全部未完成任务
    header: { Authorization: `Bearer ${getToken()}` },
  })
// 仅在用户明确确认后调用。
const cancelUpload = (jobId: string) =>
  callAppBridge('resumableCancel', { jobId })
```

App 被系统回收后，任务元数据与文件仍在私有目录；重新进入对应子应用后，先取得最新 Token，再调用 `resumableResume`。基座不会把业务 Token 持久化到本地。

## 六、任务状态

| 状态           | 含义                               | 业务处理                                              |
| -------------- | ---------------------------------- | ----------------------------------------------------- |
| `queued`       | 已持久化，等待调度                 | 展示“等待上传”                                        |
| `offline`      | 当前无网络                         | 展示“网络恢复后继续”，不要重复选文件                  |
| `uploading`    | 正在分片上传                       | 展示 `progress`                                       |
| `paused`       | 用户或业务主动暂停                 | 由用户点击继续                                        |
| `waiting_auth` | 页面/App 重启或服务端返回 401/403  | 刷新登录态后携带新请求头调用 `resume/resumableResume` |
| `failed`       | 参数、协议或不可自动恢复的服务错误 | 展示 `lastError`，排查后手动继续或取消                |
| `completed`    | 服务端完成接口已成功               | 保存 `result` 中的正式附件 ID                         |

业务表单应保存服务端 `complete` 返回的附件 ID，不保存任务 ID、临时文件路径或钉钉虚拟路径。

## 七、安全与运维要求

- 只允许 HTTPS；生产环境不得关闭证书校验。
- App 端强制子应用白名单、当前 WebView URL 和同源上传地址校验。
- 钉钉/H5 跨域上传需要服务端正确配置 CORS，允许 `PUT`、`Content-Range`、`X-Upload-Id`、`X-Upload-Offset`、`Idempotency-Key` 和实际鉴权头。
- Token 不进入 IndexedDB、`uni.storage`、任务事件、错误日志或文档示例值。
- 服务端必须限制单文件大小、单用户并发会话数、未完成临时文件 TTL 和总存储配额。
- 完成、取消或过期后及时清理临时分片；App 完成/取消会删除私有文件，H5 完成会清空 IndexedDB 中的 Blob。
- 监控至少包含：创建会话数、完成率、平均重试次数、404 过期恢复、409 偏移冲突、401/403、临时分片容量与超期清理数。

## 八、验证清单

### 自动验证

```bash
pnpm test:resumable
pnpm exec tsc --noEmit
pnpm build:h5
pnpm build:wx -- --env sit
pnpm package:app -- --env sit
pnpm check:platform-isolation
```

`test:resumable` 使用模拟服务端验证：离线排队、首个分片成功、后续分片连续失败、重新查询服务端偏移、从断点继续、连续 409 冲突熔断、完成和取消。

子应用出现 SDK 未加载、CORS、鉴权等待、存储丢失、持续 409 或 App 白名单问题时，按[H5 子应用集成方案 — 常见问题与排查](/frontend/mobile-uniapp/integration)逐项定位，并按其中的问题采集字段提供日志。

### 服务端联调

1. 重复调用初始化接口，确认返回同一 `uploadId`。
2. 上传一个分片后断网，服务端 `uploadedBytes` 保持已确认偏移。
3. 恢复网络，确认客户端先 `GET session`，且不重复写入已确认分片。
4. 人工制造 `409`，确认客户端重新同步偏移。
5. 令会话过期返回 `404`，确认用相同 `clientRequestId` 恢复且不生成重复附件。
6. Token 过期返回 `401/403`，任务进入 `waiting_auth`，刷新 Token 后继续。
7. 完成接口重复调用，业务附件表仍只有一条记录。

### 真机回归

- Android PDA：断网、飞行模式、Wi-Fi/5G 切换、锁屏/切后台、进程回收、重启 App 后补 Token 继续。
- 钉钉 Android/iOS：上传中断网、恢复网络、刷新页面后继续、清理钉钉缓存后的文件丢失提示。
- 大文件：至少覆盖跨 3 个分片、最后分片不足 `chunkSize` 的场景。
- 旧链路：拍照、相册和普通 `chooseImageAndUpload` 仍走原接口，返回结构和操作体验不变。
- 隔离：未加入能力白名单的子应用返回 `capability_denied`；同域不同 `appId` 不能查看或取消对方任务。

## 九、官方能力依据

- [uni.request：App 支持 ArrayBuffer 请求体与 PUT](https://uniapp.dcloud.net.cn/api/request/request)
- [uni.onNetworkStatusChange：监听断网与恢复](https://uniapp.dcloud.net.cn/api/system/network.html)
- [HTML5+ IO：私有文件复制、File.slice 与 FileReader](https://www.html5plus.org/specification/IO.html)
- [钉钉 uploadFile：整文件上传参数与客户端版本要求](https://open.dingtalk.com/tools/explorer/jsapi?id=10281)

上述官方能力只提供底层文件和网络原语；真正的断点续传由本项目定义的服务端会话、偏移确认、幂等和客户端持久化共同完成。
