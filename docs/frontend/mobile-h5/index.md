# 移动端 H5 — 概览 & 技术选型

## 项目简介

`Robot H5` 是基于 **Vue 3 + Vite 7 + TypeScript** 的企业级移动端 H5 应用框架，采用 **Apple HIG Liquid Glass** 设计语言，遵循 Linear 现代工具美学。项目内置权限体系、主题系统、原生桥接能力，可同时运行于移动浏览器、钉钉/微信 WebView、原生 App 内嵌等多端场景。

::: tip 项目仓库
`Robot_H5` — 与 PC 端 `Robot_Admin` 共用后端网关，前端独立部署。
:::

---

## 技术栈总览

### 核心框架

| 方向 | 技术选型 | 版本 |
|---|---|---|
| 框架 | Vue 3 | ^3.5.21 |
| 构建工具 | Vite 7 | ^7.1.5 |
| 语言 | TypeScript | ~5.9.2 |
| 路由 | Vue Router 4 | ^4.5.1 |
| 状态管理 | Pinia 3 + persistedstate | ^3.0.3 |
| UI 组件库 | Vant 4 | ^4.9.14 |
| 样式方案 | UnoCSS + SCSS | ^66.5.1 |
| 图表 | ECharts 6 | ^6.0.0 |
| 图标 | Iconify (Phosphor + Material) | 5.0.0 |
| 工具库 | VueUse | ^13.9.0 |

### 基础能力包

| 包 | 说明 |
|---|---|
| `@miracle-web/utils` | HTTP 请求封装（MAxios）、AES 加密、自定义指令 |
| `@robot-h5/core` | H5 通用能力包 — 拍照/定位/扫码/NFC/文件上传下载/签名/录音/蓝牙/离线存储等 15 个 Hooks |
| `@vant/touch-emulator` | 桌面端触摸模拟，开发调试用 |

### 开发工具链

| 工具 | 版本 | 用途 |
|---|---|---|
| pnpm | >=10.0.0 | 包管理器（preinstall 强制锁定） |
| Node.js | ^20.0.0 \|\| >=22.0.0 | 运行时 |
| ESLint 10 | 10.2.0 | Flat Config 代码检查 |
| vue-tsc | ^3.0.7 | Vue TS 类型检查（构建前强制执行） |
| Husky 9 + lint-staged | 9.1.7 / 16.4.0 | Git Hooks + 暂存区 lint |
| Commitizen + Commitlint | 4.3.1 / 20.5.0 | 交互式规范提交 |

### 构建 & 部署

| 方向 | 配置 |
|---|---|
| 部署平台 | Vercel |
| 构建压缩 | esbuild（生产自动 drop console/debugger）+ Gzip/Brotli |
| 旧浏览器兼容 | `@vitejs/plugin-legacy` |
| 移动端适配 | `postcss-mobile-forever`（px → vw 自动转换） |
| 代码分割 | `vendor-vue` / `vendor-vant` / `vendor-echarts` 三路分包 |
| Sourcemap | 生产关闭 |

---

## 环境配置

| 环境 | 文件 | Mock | API 地址 | 基础路径 |
|---|---|---|---|---|
| 开发 | `.env.development` | 开启 | Proxy → `172.28.99.172:9000` | `/robot-h5/` |
| 测试 | `.env.test` | 关闭 | `http://172.28.99.172:9000` | `/robot-h5/` |
| 生产 | `.env.production` | 关闭 | `http://172.28.99.172:9000` | `/` |

---

## 服务架构

```
┌─────────────┐     /api/*      ┌──────────────────────┐
│  Robot H5   │ ──────────────► │  后端网关             │ ──► 各微服务
│  (前端 SPA) │                 │  172.28.99.172:9000   │
└─────────────┘                 └──────────────────────┘
```

- **单一网关**：前端只对接一个后端地址，复用 PC 端已有微服务
- **Token 统一**：登录获取，MAxios 拦截器自动携带
- **权限同步**：PC 端管理系统创建应用 `robot-h5` 并绑定菜单权限，H5 端动态获取

---

## 项目结构

```
Robot_H5/
├── build/                    # 构建配置
│   ├── utils.ts              #   环境变量包装、时间戳、路径解析
│   └── vite/
│       ├── build.ts          #   Rollup 输出（manualChunks / 资源分类）
│       ├── proxy.ts          #   开发代理生成
│       └── plugin/           #   11 个 Vite 插件配置
├── mock/                     # Mock 数据
│   ├── permission.ts         #   菜单树 + 权限码
│   └── user/user.ts          #   登录 + 用户信息
├── public/                   # 静态资源
├── types/                    # 全局类型定义
│   ├── global.d.ts           #   ViteEnv / 通用工具类型
│   ├── Permission/type.ts    #   菜单 & 权限类型
│   ├── Form/type.ts          #   CForm 组件类型
│   └── Table/type.ts         #   CTable 组件类型
├── src/
│   ├── main.ts               # 应用入口
│   ├── App.vue               # 根组件（VanConfigProvider + 主题 + 过渡动画）
│   ├── h5.config.ts           # @robot-h5/core 配置
│   ├── api/                  # 接口层
│   │   ├── user.ts           #   登录 / 用户信息 / 登出
│   │   └── permission.ts     #   菜单树 / 权限码
│   ├── router/               # 路由系统
│   │   ├── index.ts          #   创建 Router（Hash/History 可切换）
│   │   ├── base.ts           #   基础路由（Root / Login / 404）
│   │   ├── menu.ts           #   TabBar 路由（Dashboard / Demo / Chart / Mine）
│   │   ├── modules.ts        #   子页面路由（25+ 条）
│   │   └── router-guards.ts  #   路由守卫（NProgress / Token / 权限校验）
│   ├── store/modules/        # 状态管理
│   │   ├── user.ts           #   Token + 用户信息（AES 加密持久化）
│   │   ├── permission.ts     #   菜单树 + 按钮权限
│   │   ├── route.ts          #   路由列表 + KeepAlive
│   │   ├── theme.ts          #   主题系统（亮/暗 + 字体缩放）
│   │   └── app.ts            #   全局状态（Eruda 调试开关）
│   ├── components/           # 全局组件（C_ 前缀，自动注册）
│   │   ├── C_Form/           #   配置式表单
│   │   ├── C_Table/          #   移动端卡片式表格
│   │   ├── C_NavBar/         #   导航栏
│   │   ├── C_PullRefreshList/#   下拉刷新 + 无限滚动
│   │   ├── C_Icon/           #   UnoCSS 图标封装
│   │   ├── C_SvgIcon/        #   自定义 SVG 图标
│   │   ├── C_Logo/           #   Logo
│   │   ├── C_VirtualStatusBar/ # 桌面端虚拟状态栏
│   │   └── C_WebSite/        #   WebView 容器
│   ├── hooks/                # 组合式函数
│   │   ├── useECharts/       #   ECharts 封装
│   │   ├── useEnv/           #   环境配置读取
│   │   ├── usePermission/    #   权限校验 + v-permission 指令
│   │   ├── useScrollCache/   #   滚动位置缓存
│   │   ├── useTheme/         #   主题切换（亮/暗 + Vant 变量同步）
│   │   └── useOpeninstall/   #   OpenInstall 集成
│   ├── plugins/              # 插件注册
│   │   ├── miracleComponents.ts # Vant 按需注册
│   │   ├── devtool.ts        #   disable-devtool
│   │   ├── updater.ts        #   版本更新检测
│   │   └── iconify.ts        #   图标集预注册
│   ├── services/             # 原生桥接
│   │   ├── jsCallNative.ts   #   JS → 原生
│   │   └── nativeCallJs.ts   #   原生 → JS
│   ├── utils/                # 工具函数
│   │   ├── http/             #   HTTP 封装（get/post/put/del）
│   │   ├── directives/       #   10 个自定义指令
│   │   ├── emit.ts           #   mitt 事件总线
│   │   ├── updater.ts        #   版本更新检测
│   │   └── landscape.ts      #   横屏检测
│   ├── styles/               # 全局样式
│   │   ├── variables.scss    #   设计令牌声明
│   │   ├── theme.scss        #   主题系统
│   │   ├── mixin.scss        #   SCSS Mixin
│   │   └── common.scss       #   公共样式
│   └── views/                # 页面视图
│       ├── dashboard/        #   首页
│       ├── chart/            #   图表页
│       ├── demo/             #   13 个 Demo 页面
│       ├── mine/             #   我的（含 8 个子页面）
│       ├── login/            #   登录
│       └── exception/        #   404
├── .husky/                   # Git Hooks
├── vite.config.ts            # Vite 主配置
├── uno.config.ts             # UnoCSS 配置
├── eslint.config.ts          # ESLint Flat Config
├── tsconfig.json             # TypeScript 配置
└── vercel.json               # 部署配置
```

---

## 设计系统

### 设计语言

**Apple HIG Liquid Glass** + Linear 现代工具美学，核心原则：**克制、层次、一致、呼吸**。

### 颜色令牌（亮/暗双模式）

| 令牌 | 亮色 | 暗色 | 用途 |
|---|---|---|---|
| `--ds-bg` | #F5F5F7 | #000000 | 主背景 |
| `--ds-bg-secondary` | #FFFFFF | #1C1C1E | 次级背景 |
| `--ds-surface` | rgba(255,255,255,0.8) | rgba(44,44,46,0.8) | 卡片表面 |
| `--ds-text-primary` | #1D1D1F | #F5F5F7 | 主文字 |
| `--ds-text-secondary` | #6E6E73 | #A1A1A6 | 辅助文字 |
| `--ds-accent` | #0071E3 | #0A84FF | 品牌强调色 |
| `--ds-success` | #34C759 | #30D158 | 成功 |
| `--ds-warning` | #FF9500 | #FF9F0A | 警告 |
| `--ds-danger` | #FF3B30 | #FF453A | 危险 |

### 毛玻璃效果令牌

| 令牌 | 值 |
|---|---|
| `--ds-glass-bg` | rgba(255,255,255,0.72) / rgba(44,44,46,0.72) |
| `--ds-glass-blur` | 40px |
| `--ds-glass-saturate` | 210% |
| `--ds-glass-border` | rgba(255,255,255,0.18) |

### 排版

- **字体栈**：`-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Helvetica, Arial, sans-serif`
- **字号梯度**：11 / 13 / 15 / 16 / 17 / 20 / 22 / 28 / 34 px

### 间距 & 圆角

| 间距（4px 网格） | 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 |
|---|---|
| **圆角** | sm(8px) / md(12px) / lg(16px) / xl(20px) / full(9999px) |

### 动画

- 标准时长：200ms ~ 300ms
- 标准缓动：`cubic-bezier(0.25, 0.1, 0.25, 1)`
- 弹性缓动：`cubic-bezier(0.34, 1.56, 0.64, 1)`

---

## 全局组件

9 个全局组件，统一 `C_` 前缀命名，通过 `unplugin-vue-components` 自动注册。

| 组件 | 用途 | 说明 |
|---|---|---|
| `C_Form` | 配置式表单 | 支持 text/password/number/select/switch/checkbox/radio 等 |
| `C_Table` | 卡片式表格 | 移动端专用，支持标签映射、操作按钮、状态渲染 |
| `C_NavBar` | 导航栏 | 统一顶部导航 |
| `C_PullRefreshList` | 下拉刷新列表 | 下拉刷新 + 触底无限滚动 |
| `C_Icon` | 图标 | UnoCSS 图标封装 |
| `C_SvgIcon` | SVG 图标 | 自定义 SVG 雪碧图 |
| `C_Logo` | Logo | 品牌标识组件 |
| `C_VirtualStatusBar` | 虚拟状态栏 | 桌面端调试时模拟手机状态栏 |
| `C_WebSite` | WebView 容器 | 内嵌第三方网页 |

---

## 自定义指令

10 个自定义指令，位于 `src/utils/directives/`：

| 指令 | 用途 |
|---|---|
| `v-copy` | 复制文本到剪贴板 |
| `v-debounce` | 防抖点击 |
| `v-throttle` | 节流点击 |
| `v-long-press` | 长按事件 |
| `v-ripple` | Material Design 水波纹效果 |
| `v-slide-in` | 滑入动画 |
| `v-draggable` | 拖拽 |
| `v-lazy-image` | 图片懒加载 |
| `v-watermark` | 水印 |
| `v-permission` | 按钮权限控制（通过 `usePermission` Hook） |

---

## @robot-h5/core 通用能力包

内置 15 个 Hooks，覆盖移动端常见原生能力：

| Hook | 能力 |
|---|---|
| `useCamera` | 拍照 / 相册选图 |
| `useLocation` | 定位（GCJ-02 坐标，10s 超时） |
| `useQrScanner` | 二维码扫描 |
| `useNfc` | NFC 读写 |
| `useFileUpload` | 文件上传（最大 1024KB，0.8 质量压缩） |
| `useFileDownload` | 文件下载 |
| `useFilePreview` | 文件预览 |
| `useSignature` | 电子签名 |
| `useAudioRecorder` | 录音 |
| `useVideoRecorder` | 录像 |
| `useBluetooth` | 蓝牙连接 |
| `useOfflineStorage` | 离线存储 |
| `usePushNotification` | 推送通知 |
| `useWatermark` | 水印 |
| `usePermission` | 原生权限请求 |

**Bridge 适配器**：Browser / Native / Dingtalk / Wechat — 同一 API 多端适配。

---

## 权限体系

### 架构流程

```
打开 H5
  ↓
无 Token → 登录页 → 获取 Token
  ↓
GetUserInfo + loadPermissions
  ↓
解析菜单树 → allowedPaths + buttonPermissions + tabBarMenus
  ↓
路由守卫校验 → TabBar 动态渲染
```

### 菜单类型

| menuType | 说明 |
|---|---|
| D | 目录（分组容器） |
| M | 菜单（页面路由） |
| B | 按钮（权限点） |

### 权限校验方式

- **路由级**：路由守卫 `isRouteAllowed(path)` 校验访问权限
- **按钮级**：`v-permission="'order:add'"` 指令 或 `usePermission().hasPermission()` Hook
- **降级策略**：权限数据为空时默认放行（Mock / 未对接场景不白屏）

---

## 快速开始

```bash
# 环境要求
node >= 20.0.0
pnpm >= 10.0.0

# 安装依赖
pnpm install

# 本地开发（Mock 模式）
pnpm dev

# 本地开发（对接生产 API）
pnpm dev:prod

# 类型检查
pnpm type-check

# 代码检查
pnpm lint

# 构建测试环境
pnpm build:test

# 构建生产环境
pnpm build:prod

# 预览构建产物
pnpm preview
```

---

## 版块导航

- [开发规范](./standards) — 编码约定、文件组织、样式规范、提交规范
- [Skills 集合](./skills) — 7 个 AI 辅助研发 Skill
