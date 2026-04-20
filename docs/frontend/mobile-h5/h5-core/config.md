# 配置系统

`@robot-h5/core` 通过集中式配置驱动所有行为，业务项目无需修改源码。

---

## 配置流程

```
h5.config.ts                 main.ts                      组件
    │                           │                           │
    │  defineH5Config()         │  app.use(h5Core, config)  │  useAppConfig()
    │  ─────────────────→       │  ─────────────────→       │  ─────────────→
    │  类型安全的配置对象        │  注入 provide/inject       │  读取合并后配置
```

---

## defineH5Config — 定义配置

```ts
// src/h5.config.ts
import { defineH5Config } from '@robot-h5/core';

export default defineH5Config({
  // 上传配置
  upload: {
    action: '/api/file/upload',
    chunkSize: 2 * 1024 * 1024,  // 2MB 分片
    headers: () => ({
      Authorization: `Bearer ${getToken()}`,
    }),
  },

  // 图片压缩
  image: {
    maxSize: 1024,      // 最大 1MB
    quality: 0.8,       // 压缩质量
    maxWidth: 1920,
    maxHeight: 1080,
  },

  // GPS 定位
  location: {
    coordType: 'gcj02',   // 坐标系
    timeout: 10000,        // 超时 10s
  },

  // Bridge 平台适配
  bridge: {
    platform: 'auto',     // 自动检测
    nativeUA: 'MyApp',    // 自研 APP UA 特征
    dingtalk: { corpId: 'ding_xxx' },
    wechat: { appId: 'wx_xxx', jsApiList: ['scanQRCode'] },
    overrides: { /* 平台 SDK 能力覆盖 */ },
  },

  // Hook 扩展
  extensions: {
    useCamera: {
      after: async (file, ctx) => {
        ctx.meta.ossUrl = await uploadToOss(file);
        return file;
      },
    },
  },
});
```

---

## 完整类型定义

### AppConfig

```ts
interface AppConfig {
  bridge?: BridgeConfig;
  upload?: UploadConfig;
  image?: ImageConfig;
  location?: LocationConfig;
}
```

### BridgeConfig

```ts
interface BridgeConfig {
  /** 平台类型，'auto' 为自动检测 */
  platform?: 'auto' | 'native' | 'dingtalk' | 'wechat' | 'browser' | string;
  /** APP 端自定义 UA 特征字符串 */
  nativeUA?: string;
  /** 钉钉配置 */
  dingtalk?: { corpId: string };
  /** 微信/企微配置 */
  wechat?: { appId: string; jsApiList?: string[] };
  /** 项目侧 SDK 能力覆盖 */
  overrides?: BridgeAdapterOverrides;
}
```

### UploadConfig

```ts
interface UploadConfig {
  /** 上传接口 URL */
  action: string;
  /** 分片大小，默认 2MB */
  chunkSize?: number;
  /** 请求头（支持函数动态生成） */
  headers?: Record<string, string> | (() => Record<string, string>);
}
```

### ImageConfig

```ts
interface ImageConfig {
  /** 最大文件大小（KB） */
  maxSize?: number;
  /** 压缩质量 0-1 */
  quality?: number;
  /** 最大宽度（px） */
  maxWidth?: number;
  /** 最大高度（px） */
  maxHeight?: number;
}
```

### LocationConfig

```ts
interface LocationConfig {
  /** 坐标系：gcj02（高德/腾讯）或 wgs84（GPS） */
  coordType?: 'gcj02' | 'wgs84';
  /** 超时时间（ms） */
  timeout?: number;
}
```

---

## useAppConfig — 读取配置

在任何组件或 Hook 内部读取当前配置：

```ts
import { useAppConfig } from '@robot-h5/core';

const config = useAppConfig();
console.log(config.upload?.action);    // '/api/file/upload'
console.log(config.location?.coordType); // 'gcj02'
```

---

## 默认值

未配置的项使用内置默认值：

| 配置项 | 默认值 |
|---|---|
| `bridge.platform` | `'auto'` |
| `upload.chunkSize` | `2097152`（2MB） |
| `image.quality` | `0.8` |
| `image.maxSize` | `undefined`（不限制） |
| `location.coordType` | `'gcj02'` |
| `location.timeout` | `10000` |

配置合并规则：`deepMerge(defaults, userConfig)`，用户配置覆盖默认值。

---

## Hook 扩展机制

通过 `extensions` 在配置中声明式扩展 Hook 行为，无需修改 Hook 源码。

### 扩展接口

```ts
interface HookExtension {
  /** Hook 核心逻辑执行前调用 */
  before?: (...args: any[]) => any[] | Promise<any[]>;
  /** Hook 核心逻辑执行后调用 */
  after?: (result: any, context: ExtensionContext) => any | Promise<any>;
}

interface ExtensionContext {
  hookName: string;                // 当前 Hook 名称
  meta: Record<string, any>;      // 自定义元数据（跨扩展传递）
}
```

### 使用示例

```ts
export default defineH5Config({
  extensions: {
    // 拍照后自动上传到 OSS
    useCamera: {
      after: async (file, ctx) => {
        const url = await uploadToOss(file);
        ctx.meta.ossUrl = url;
        return file;
      },
    },

    // 定位前记录日志
    useLocation: {
      before: async (...args) => {
        console.log('[GPS] 开始定位...');
        return args;
      },
    },

    // 上传前压缩图片
    useFileUpload: {
      before: async (file) => {
        if (file.type.startsWith('image/')) {
          file = await compressImage(file, { maxSize: 500 });
        }
        return [file];
      },
    },
  },
});
```

### 编程式扩展

也可以在运行时动态注册扩展：

```ts
import { extendHook, clearExtensions } from '@robot-h5/core';

// 注册扩展
extendHook('useCamera', {
  after: async (file) => {
    console.log('拍照完成', file.name);
    return file;
  },
});

// 清除所有扩展（测试用）
clearExtensions();
```

---

## 典型集成模式

### 最小配置（仅上传）

```ts
export default defineH5Config({
  upload: { action: '/api/file/upload' },
});
```

### 钉钉应用

```ts
export default defineH5Config({
  upload: { action: '/api/file/upload', headers: () => ({ token: getToken() }) },
  image: { maxSize: 1024, quality: 0.8 },
  location: { coordType: 'gcj02' },
  bridge: {
    platform: 'dingtalk',
    dingtalk: { corpId: 'ding_xxx' },
    overrides: { /* dingtalk-jsapi 能力 */ },
  },
});
```

### 零配置

```ts
// main.ts — 不传配置，使用全部默认值
import { h5Core } from '@robot-h5/core';
createApp(App).use(h5Core).mount('#app');
```
