# Bridge 适配层

Bridge 是 `@robot-h5/core` 的平台抽象层，使 15 个 Hook 在不同宿主环境（浏览器、APP、钉钉、微信）下自动选择最佳实现。

---

## 架构

```
┌────────────────────────────────────────────────┐
│  Hooks（useCamera / useLocation / ...）          │
│  统一调用 Bridge 接口，无需关心底层平台            │
├────────────────────────────────────────────────┤
│  Bridge 接口层（BridgeAdapter）                  │
│  定义标准能力契约                                │
├────────────────────────────────────────────────┤
│  适配器选择器（Detector + Registry）              │
│  自动检测 UA → 匹配适配器 → 注入 overrides       │
├──────────┬──────────┬──────────┬──────────────┤
│ Browser  │ Native   │ Dingtalk │ Wechat       │
│ 浏览器降级│ APP 原生  │ 钉钉     │ 微信/企微     │
└──────────┴──────────┴──────────┴──────────────┘
```

---

## BridgeAdapter 接口

所有适配器必须实现统一的 `BridgeAdapter` 接口：

```ts
interface BridgeAdapter {
  readonly platform: string;

  camera: {
    capture(options?: CameraOptions): Promise<File>;
  };

  scanner: {
    scan(options?: ScanOptions): Promise<string>;
  };

  location: {
    getCurrent(options?: LocationQueryOptions): Promise<Coordinates>;
    watchPosition(callback: (pos: Coordinates) => void): () => void;
  };

  nfc: {
    read(): Promise<NFCData>;
    write(data: NFCData): Promise<void>;
  };

  bluetooth: {
    connect(deviceId: string): Promise<BluetoothDeviceInfo>;
    disconnect(): Promise<void>;
  };

  file: {
    preview(url: string, name?: string): Promise<void>;
  };

  notification: {
    register(token: string): Promise<void>;
    onMessage(callback: (msg: PushMessage) => void): () => void;
  };
}
```

---

## 4 个内置适配器

| 适配器 | 环境 | 检测条件 | 说明 |
|---|---|---|---|
| **BrowserBridge** | 浏览器 | 兜底默认 | Web 标准 API 降级实现 |
| **NativeBridge** | APP WebView | `nativeUA` 匹配 UA | 通过 `overrides` 注入 JSBridge |
| **DingtalkBridge** | 钉钉 | UA 含 `DingTalk` | 通过 `overrides` 注入 dingtalk-jsapi |
| **WechatBridge** | 微信/企微 | UA 含 `MicroMessenger` | 通过 `overrides` 注入 weixin-js-sdk |

::: info overrides 模式
除 BrowserBridge 外，其他适配器的核心实现由**项目侧**通过 `overrides` 注入（三方 SDK 不打包进 core），保持 core 包零三方依赖。
:::

---

## 平台检测

```ts
import { detectPlatform } from '@robot-h5/core/bridge';

type PlatformType = 'native' | 'dingtalk' | 'wechat' | 'browser';

// 自动检测当前平台
const platform = detectPlatform();
// → 'dingtalk'（在钉钉中打开时）

// 自定义 Native UA 特征
const platform = detectPlatform('MyApp');
// → 'native'（UA 包含 'MyApp' 时）
```

**检测优先级**：`native`（自定义 UA）→ `dingtalk` → `wechat` → `browser`

---

## 核心 API

### createBridge — 创建 Bridge 实例

```ts
import { createBridge } from '@robot-h5/core/bridge';

const bridge = createBridge(
  'dingtalk',                    // 平台（可选，默认自动检测）
  undefined,                     // nativeUA（可选）
  {                              // overrides（项目侧 SDK 能力覆盖）
    scanner: {
      scan: async () => {
        const res = await dd.biz.util.scan({ type: 'qrCode' });
        return res.text;
      },
    },
  },
);
```

### useBridge — 在组件中获取 Bridge

```ts
import { useBridge } from '@robot-h5/core';

// 在 setup 中使用
const bridge = useBridge();
const file = await bridge.camera.capture({ source: 'camera' });
```

### resetBridge — 重置 Bridge 实例

```ts
import { resetBridge } from '@robot-h5/core/bridge';

// 热更新或测试时使用
resetBridge();
```

---

## 适配器注册

支持注册**自定义适配器**，适用于自研 APP 或其他平台：

```ts
import { registerAdapter, getRegisteredAdapters, mergeAdapter } from '@robot-h5/core/bridge';

// 注册自定义适配器
registerAdapter('my-app', {
  platform: 'my-app',
  camera: {
    capture: async () => {
      // 调用自研 APP 的 JSBridge
      return await MyAppBridge.camera.take();
    },
  },
  // ...其他能力
});

// 查看已注册适配器
console.log(getRegisteredAdapters());
// → ['browser', 'native', 'dingtalk', 'wechat', 'my-app']

// 合并覆盖（基于已有适配器扩展部分能力）
const enhanced = mergeAdapter(baseBridge, {
  scanner: { scan: customScanFn },
});
```

---

## 配置示例

### 钉钉环境

```ts
// h5.config.ts
export default defineH5Config({
  bridge: {
    platform: 'dingtalk',
    dingtalk: { corpId: 'ding_xxx' },
    overrides: {
      scanner: {
        scan: async () => {
          const result = await dd.biz.util.scan({ type: 'all' });
          return result.text;
        },
      },
      location: {
        getCurrent: async () => {
          const res = await dd.device.geolocation.get({ targetAccuracy: 200 });
          return { longitude: res.longitude, latitude: res.latitude, accuracy: res.accuracy, timestamp: Date.now() };
        },
      },
    },
  },
});
```

### 微信/企微环境

```ts
export default defineH5Config({
  bridge: {
    platform: 'wechat',
    wechat: { appId: 'wx_xxx', jsApiList: ['scanQRCode', 'getLocation'] },
    overrides: {
      scanner: {
        scan: () => new Promise((resolve) => {
          wx.scanQRCode({
            needResult: 1,
            success: (res) => resolve(res.resultStr),
          });
        }),
      },
    },
  },
});
```

### 自研 APP WebView

```ts
export default defineH5Config({
  bridge: {
    platform: 'native',
    nativeUA: 'MyApp',  // UA 包含此字符串时判定为 native
    overrides: {
      camera: {
        capture: () => window.MyAppBridge.takePhoto(),
      },
      nfc: {
        read: () => window.MyAppBridge.readNfc(),
        write: (data) => window.MyAppBridge.writeNfc(data),
      },
    },
  },
});
```
