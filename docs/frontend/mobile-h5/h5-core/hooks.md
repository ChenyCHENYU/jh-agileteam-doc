# Hooks — 15 个组合函数

所有 Hook 遵循统一设计模式：

- 返回 `Ref` 响应式状态（`loading` / `error` / 业务数据）
- 提供异步操作方法（返回 `Promise`）
- 支持通过 `h5.config.ts` 全局配置
- 支持 `before` / `after` 扩展钩子

---

## 媒体捕获

### useCamera — 拍照/相册 + 自动压缩 {#useCamera}

```ts
import { useCamera } from '@robot-h5/core';

const { photo, preview, loading, error, capture, clear } = useCamera();

// 拍照
const file = await capture({ source: 'camera' });

// 从相册选择
const file = await capture({ source: 'album' });

// 清除
clear();
```

**Options**

| 参数 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `source` | `'camera' \| 'album' \| 'both'` | `'both'` | 来源 |
| `maxSize` | `number` | 配置值 | 最大文件大小（KB） |
| `quality` | `number` | 配置值 | 压缩质量 0-1 |

**Returns**

| 属性 | 类型 | 说明 |
|---|---|---|
| `photo` | `Ref<File \| null>` | 拍照文件 |
| `preview` | `Ref<string>` | 预览 URL |
| `loading` | `Ref<boolean>` | 加载中 |
| `error` | `Ref<Error \| null>` | 错误信息 |
| `capture` | `(options?) => Promise<File \| null>` | 执行拍照 |
| `clear` | `() => void` | 清除照片 |

---

### useLocation — GPS 单次/持续定位 {#useLocation}

```ts
import { useLocation } from '@robot-h5/core';

const { position, loading, getCurrentPosition, watchPosition, stopWatch } = useLocation();

// 单次定位
const pos = await getCurrentPosition();
console.log(`${pos.latitude}, ${pos.longitude}`);

// 持续监听
watchPosition();
// ...
stopWatch();
```

**Options**

| 参数 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `timeout` | `number` | `10000` | 超时时间（ms） |
| `enableHighAccuracy` | `boolean` | `true` | 高精度模式 |

**Coordinates**

```ts
interface Coordinates {
  longitude: number;    // 经度
  latitude: number;     // 纬度
  altitude?: number;    // 海拔
  accuracy: number;     // 精度（米）
  timestamp: number;    // 时间戳
}
```

::: tip 坐标系
默认使用 GCJ-02（火星坐标/高德/腾讯），可通过配置切换为 WGS-84（GPS/国际）。
:::

---

### useQrScanner — 二维码/条形码扫描 {#useQrScanner}

```ts
import { useQrScanner } from '@robot-h5/core';

const { result, loading, scan } = useQrScanner();

const text = await scan({ type: 'qrcode' });
console.log(text); // 扫码内容
```

**Options**

| 参数 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `type` | `'qrcode' \| 'barcode' \| 'all'` | `'all'` | 扫码类型 |

::: warning 平台差异
浏览器端需 `jsQR` 库降级实现，推荐在 APP/钉钉/微信环境中使用原生扫码。
:::

---

### useNfc — NFC 读写 {#useNfc}

```ts
import { useNfc } from '@robot-h5/core';

const { data, loading, read, write } = useNfc();

// 读取
const nfcData = await read();

// 写入
await write({
  id: 'tag-001',
  type: 'text',
  records: [{ type: 'text', data: '设备编号：EQ-2024-001' }],
});
```

**NFCData**

```ts
interface NFCData {
  id: string;
  type: string;
  records: Array<{ type: string; data: string }>;
}
```

::: danger 平台限制
浏览器完全不支持 NFC，必须通过 Native Bridge 调用。
:::

---

## 文件操作

### useFileUpload — 分片上传 + 断点续传 {#useFileUpload}

```ts
import { useFileUpload } from '@robot-h5/core';

const { progress, uploading, upload, abort } = useFileUpload();

// 上传文件
await upload(file);
console.log(`进度：${progress.value.percent}%`);

// 中止上传
abort();
```

**Options**

| 参数 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `action` | `string` | 配置值 | 上传接口 URL |
| `chunkSize` | `number` | `2097152` | 分片大小（2MB） |
| `headers` | `Record \| () => Record` | 配置值 | 请求头 |
| `maxRetries` | `number` | `3` | 失败重试次数 |
| `resumable` | `boolean` | `false` | 启用断点续传 |

**UploadProgress**

```ts
interface UploadProgress {
  loaded: number;   // 已上传字节数
  total: number;    // 总字节数
  percent: number;  // 百分比 0-100
}
```

::: tip 断点续传
启用 `resumable: true` 后，已上传分片信息记录在 `localStorage`，页面刷新后可续传。
:::

---

### useFilePreview — PDF/Office/图片预览 {#useFilePreview}

```ts
import { useFilePreview } from '@robot-h5/core';

const { loading, preview } = useFilePreview();

// 预览文件
await preview('https://example.com/report.pdf', '月度报告.pdf');
```

**Options**

| 参数 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `previewServer` | `string` | — | Office 预览服务地址 |

---

### useFileDownload — 文件下载 + 进度 {#useFileDownload}

```ts
import { useFileDownload } from '@robot-h5/core';

const { progress, downloading, download, abort } = useFileDownload();

await download('https://example.com/file.zip', '数据导出.zip');
console.log(`下载进度：${progress.value.percent}%`);
```

**Returns**

| 属性 | 类型 | 说明 |
|---|---|---|
| `progress` | `Ref<DownloadProgress>` | 下载进度 |
| `downloading` | `Ref<boolean>` | 下载中 |
| `download` | `(url, filename?) => Promise<File \| null>` | 执行下载 |
| `abort` | `() => void` | 中止下载 |

---

## 媒体处理

### useSignature — Canvas 手写签名 {#useSignature}

```ts
import { useSignature } from '@robot-h5/core';

const { isEmpty, bindCanvas, clear, save, undo } = useSignature();

// 绑定 Canvas 元素
onMounted(() => {
  bindCanvas(canvasRef.value);
});

// 保存签名为 File
const file = await save('image/png', 0.92);

// 撤销上一笔
undo();

// 清除画布
clear();
```

**Options**

| 参数 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `lineWidth` | `number` | `2` | 笔划宽度 |
| `strokeColor` | `string` | `'#000'` | 笔色 |
| `backgroundColor` | `string` | `'#fff'` | 背景色 |

---

### useAudioRecorder — 录音 + 暂停恢复 {#useAudioRecorder}

```ts
import { useAudioRecorder } from '@robot-h5/core';

const { isRecording, isPaused, duration, start, stop, pause, resume } = useAudioRecorder();

// 开始录音
await start();

// 暂停/恢复
pause();
resume();

// 停止并获取音频文件
const blob = await stop();
```

**Returns**

| 属性 | 类型 | 说明 |
|---|---|---|
| `isRecording` | `Ref<boolean>` | 是否录音中 |
| `isPaused` | `Ref<boolean>` | 是否已暂停 |
| `duration` | `Ref<number>` | 录音时长（ms） |
| `start` | `() => Promise<void>` | 开始 |
| `stop` | `() => Promise<Blob \| null>` | 停止并返回 Blob |
| `pause` | `() => void` | 暂停 |
| `resume` | `() => void` | 恢复 |

---

### useVideoRecorder — 视频录制 + 实时预览 {#useVideoRecorder}

```ts
import { useVideoRecorder } from '@robot-h5/core';

const { isRecording, duration, stream, start, stop } = useVideoRecorder();

// 绑定视频预览
// <video :srcObject="stream" autoplay muted />

await start();
const blob = await stop();
```

**Options**

| 参数 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `facingMode` | `'user' \| 'environment'` | `'environment'` | 前/后摄像头 |
| `audio` | `boolean` | `true` | 是否启用音轨 |

---

## 连接/存储

### useBluetooth — 蓝牙设备连接 {#useBluetooth}

```ts
import { useBluetooth } from '@robot-h5/core';

const { device, connected, connect, disconnect } = useBluetooth();

// 连接设备
const info = await connect('device-id-001');
console.log(info.name);

// 断开连接
await disconnect();
```

::: warning 平台限制
Web Bluetooth 仅 Chrome 系浏览器支持，**iOS Safari 完全不可用**。生产环境建议配合 Native Bridge 使用。
:::

---

### useOfflineStorage — IndexedDB 离线存储 + 同步 {#useOfflineStorage}

```ts
import { useOfflineStorage } from '@robot-h5/core';

const { get, set, remove, keys, pendingCount, flush } = useOfflineStorage({
  dbName: 'my-app',
  storeName: 'cache',
  sync: {
    endpoint: '/api/sync',
    autoSync: true,   // 网络恢复后自动同步
  },
});

// 本地存取
await set('user-profile', { name: '张三', role: 'admin' });
const profile = await get('user-profile');

// 手动推送待同步队列
await flush();
console.log(`待同步操作：${pendingCount.value} 条`);
```

**SyncConfig**

| 参数 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `endpoint` | `string` | — | 同步接口 URL |
| `headers` | `Record \| () => Record` | — | 请求头 |
| `autoSync` | `boolean` | `true` | 网络恢复后自动推送 |

**Returns**

| 属性 | 类型 | 说明 |
|---|---|---|
| `get` | `<T>(key) => Promise<T \| null>` | 读取 |
| `set` | `(key, value) => Promise<void>` | 写入 |
| `remove` | `(key) => Promise<void>` | 删除 |
| `clear` | `() => Promise<void>` | 清空 |
| `keys` | `() => Promise<string[]>` | 获取所有 key |
| `pendingCount` | `Ref<number>` | 待同步操作数 |
| `syncStatus` | `Ref<'idle' \| 'syncing' \| 'error'>` | 同步状态 |
| `flush` | `() => Promise<void>` | 立即推送队列 |

::: warning Safari 隐私模式
Safari 隐私模式下 IndexedDB 有 50MB 存储限制。
:::

---

## 系统

### usePushNotification — 推送通知 {#usePushNotification}

```ts
import { usePushNotification } from '@robot-h5/core';

const { messages, register, onMessage, clearMessages } = usePushNotification();

// 注册推送 token
await register('device-push-token-xxx');

// 监听新消息
onMessage((msg) => {
  console.log(`${msg.title}: ${msg.body}`);
});
```

**PushMessage**

```ts
interface PushMessage {
  title: string;
  body: string;
  data?: Record<string, any>;
  timestamp: number;
}
```

---

### useWatermark — 图片水印 {#useWatermark}

```ts
import { useWatermark } from '@robot-h5/core';

const { addWatermark } = useWatermark();

const watermarkedFile = await addWatermark(originalFile, {
  text: '张三 2024-03-20 14:30',
  position: 'bottomRight',
  fontSize: 16,
  fontColor: 'rgba(255,255,255,0.6)',
  opacity: 0.8,
});
```

**Options**

| 参数 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `text` | `string` | — | 水印文字 |
| `fontSize` | `number` | `14` | 字号 |
| `fontColor` | `string` | `'rgba(0,0,0,0.3)'` | 字色 |
| `position` | `'topLeft' \| 'topRight' \| 'bottomLeft' \| 'bottomRight' \| 'center'` | `'bottomRight'` | 位置 |
| `opacity` | `number` | `0.5` | 透明度 |
| `quality` | `number` | `0.92` | 输出质量 |

---

### usePermission — 系统权限查询/请求 {#usePermission}

```ts
import { usePermission } from '@robot-h5/core';

const { state, query, request, watch } = usePermission();

// 查询权限
const status = await query('camera');
console.log(status); // 'granted' | 'denied' | 'prompt'

// 请求权限
const granted = await request('geolocation');

// 监听权限变化
const stop = watch('microphone');
// ...
stop(); // 取消监听
```

**支持的权限名**

| 权限 | 说明 |
|---|---|
| `camera` | 摄像头 |
| `microphone` | 麦克风 |
| `geolocation` | 地理位置 |
| `notifications` | 通知推送 |
| `clipboard-read` | 剪贴板读取 |
| `clipboard-write` | 剪贴板写入 |
