# @robot-h5/core

企业级移动端 H5 通用能力包 — **厚组合层架构**。

> 包做厚、项目做薄。业务项目只需「配置 + 引用」，即获完整能力。

---

## 设计理念

```
┌──────────────────────────────────────────────────────┐
│  业务项目（配置 + 引用）                               │
├──────────────────────────────────────────────────────┤
│  @robot-h5/core                                      │
│  ┌──────────┐ ┌──────────┐ ┌────────┐ ┌───────────┐ │
│  │ 15 Hooks │ │ Bridge   │ │ Utils  │ │ Config    │ │
│  │ 组合函数  │ │ 适配层   │ │ 工具库  │ │ 配置系统  │ │
│  └──────────┘ └──────────┘ └────────┘ └───────────┘ │
├──────────────────────────────────────────────────────┤
│  Vue 3 + TypeScript（peerDependency）                 │
└──────────────────────────────────────────────────────┘
```

---

## 包信息

| 属性 | 值 |
|---|---|
| 包名 | `@robot-h5/core` |
| 版本 | `1.0.0` |
| 构建产物 | ESM（`dist/index.mjs`） |
| 类型声明 | `dist/index.d.ts` |
| 前置依赖 | `vue@^3.3.0` |
| 副作用 | `sideEffects: false`（支持 Tree-shaking） |

---

## 多入口导出

```ts
// 主入口 — 全量导出
import { useCamera, useLocation, ... } from '@robot-h5/core';

// 仅 Hooks
import { useCamera } from '@robot-h5/core/hooks';

// 单个 Hook（最小引入）
import { useCamera } from '@robot-h5/core/hooks/useCamera';

// Bridge 适配层
import { useBridge, createBridge } from '@robot-h5/core/bridge';

// 工具函数
import { compressImage, formatDate } from '@robot-h5/core/utils';

// 单个工具模块
import { compressImage } from '@robot-h5/core/utils/image';
```

---

## 快速开始

### 1. 安装

```bash
pnpm add @robot-h5/core
```

### 2. 创建配置文件

```ts
// src/h5.config.ts
import { defineH5Config } from '@robot-h5/core';

export default defineH5Config({
  // 上传接口
  upload: {
    action: '/api/file/upload',
    headers: () => ({ Authorization: `Bearer ${getToken()}` }),
  },
  // 图片压缩
  image: { maxSize: 1024, quality: 0.8 },
  // GPS 定位
  location: { coordType: 'gcj02', timeout: 10000 },
});
```

### 3. 注册插件（一行搞定）

```ts
// main.ts
import { createApp } from 'vue';
import { h5Core } from '@robot-h5/core';
import h5Config from './h5.config';
import App from './App.vue';

createApp(App)
  .use(h5Core, h5Config)   // ← 一行完成全部初始化
  .mount('#app');
```

### 4. 在组件中使用

```vue
<script setup>
import { useCamera, useLocation, useFileUpload } from '@robot-h5/core';

const { photo, capture } = useCamera();
const { position, getCurrentPosition } = useLocation();
const { upload, progress } = useFileUpload();

const handleCapture = async () => {
  const file = await capture({ source: 'camera' });
  if (file) await upload(file);
};
</script>
```

::: tip 零配置也能用
不传配置时使用内置默认值，所有 Hook 均可独立使用。
:::

---

## 模块依赖关系

```
Hooks（15 个）
  │
  ├──→ Bridge（平台适配）
  ├──→ Utils（工具函数）
  └──→ Config（配置系统）
         │
         └──→ Types（类型定义）
```

**单向依赖**：Hooks → Bridge / Utils / Config → Types，无循环依赖。

---

## 能力矩阵

| 分类 | Hook | 功能 | 浏览器 | APP | 钉钉 | 微信 |
|---|---|---|:---:|:---:|:---:|:---:|
| 媒体捕获 | `useCamera` | 拍照/相册 + 压缩 | ✅ | ✅ | ✅ | ✅ |
| | `useLocation` | GPS 单次/持续定位 | ✅ | ✅ | ✅ | ✅ |
| | `useQrScanner` | 二维码/条形码扫描 | ⚠️ | ✅ | ✅ | ✅ |
| | `useNfc` | NFC 读写 | ❌ | ✅ | ❌ | ❌ |
| 文件操作 | `useFileUpload` | 分片上传 + 断点续传 | ✅ | ✅ | ✅ | ✅ |
| | `useFilePreview` | PDF/Office/图片预览 | ✅ | ✅ | ✅ | ✅ |
| | `useFileDownload` | 文件下载 + 进度 | ✅ | ✅ | ✅ | ✅ |
| 媒体处理 | `useSignature` | Canvas 手写签名 | ✅ | ✅ | ✅ | ✅ |
| | `useAudioRecorder` | 录音 + 暂停恢复 | ✅ | ✅ | ✅ | ⚠️ |
| | `useVideoRecorder` | 视频录制 + 预览 | ✅ | ✅ | ⚠️ | ⚠️ |
| 连接/存储 | `useBluetooth` | 蓝牙设备连接 | ⚠️ | ✅ | ❌ | ❌ |
| | `useOfflineStorage` | IndexedDB 离线存储 | ✅ | ✅ | ✅ | ⚠️ |
| 系统 | `usePushNotification` | 推送通知 | ✅ | ✅ | ✅ | ✅ |
| | `useWatermark` | 图片水印 | ✅ | ✅ | ✅ | ✅ |
| | `usePermission` | 系统权限查询/请求 | ✅ | ✅ | ⚠️ | ⚠️ |

> ✅ 完整支持 &nbsp; ⚠️ 部分支持/降级 &nbsp; ❌ 不可用（需 Native Bridge）

---

## 目录结构

```
@robot-h5/core
├── plugin          ← Vue Plugin 入口
├── config/         ← 配置系统
│   ├── define      ← defineAppConfig / useAppConfig
│   ├── defaults    ← 内置默认配置
│   └── types       ← 配置类型定义
├── bridge/         ← Bridge 适配层
│   ├── detector    ← 平台自动检测
│   ├── registry    ← 适配器注册表
│   └── adapters/   ← 4 个内置适配器
│       ├── browser    浏览器（降级）
│       ├── native     APP WebView
│       ├── dingtalk   钉钉
│       └── wechat     微信/企微
├── hooks/          ← 15 个组合函数
│   ├── extend      ← Hook 扩展机制
│   └── use*/       ← 各 Hook 独立目录
├── utils/          ← 工具函数库
│   ├── image       ← 图片压缩/转码
│   ├── coord       ← 坐标系转换
│   ├── device      ← 设备信息
│   ├── file        ← 文件操作
│   ├── validate    ← 数据验证
│   └── format      ← 日期/金额格式化
└── types/          ← 类型汇总导出
```
