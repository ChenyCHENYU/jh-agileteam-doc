# 移动端 H5 — 概览 & 技术选型

## 项目简介

移动端有两个项目：

| 项目 | 定位 | 框架 | UI 库 |
|------|------|------|-------|
| **Robot_H5** | 企业级 H5 应用框架（主力） | Vue 3.5 + Vite 7 | Vant 4 |
| **wl-mbase** | Uniapp 跨端应用（H5 + 小程序） | Vue 3.5 + Vite 5（Uniapp） | uv-ui / Uniapp 内置 |

`Robot_H5` 采用 **Apple HIG Liquid Glass** 设计语言，遵循 Linear 现代工具美学。项目内置权限体系、主题系统、原生桥接能力，可同时运行于移动浏览器、钉钉/微信 WebView、原生 App 内嵌等多端场景。

::: tip 项目仓库
`Robot_H5` — 与 PC 端共用后端网关，前端独立部署。支持 **standalone（独立运行）** 和 **integrated（mbase 子应用）** 双模式。

`wl-mbase` — 基于 Uniapp 的跨端项目，编译产物可同时部署到 H5 / 微信小程序 / 钉钉小程序等多端。通过 `src/manifest.json` + `src/pages.json` 配置式管理。
:::

---

## 技术栈总览

### 核心框架

| 方向 | 技术选型 | 版本 |
|---|---|---|
| 框架 | Vue 3 Composition API | ^3.5.21 |
| 构建工具 | Vite 7 | ^7.1.5 |
| 语言 | TypeScript | ~5.9.2 |
| 路由 | Vue Router 4 | ^4.5.1 |
| 状态管理 | Pinia 3 + persistedstate | ^3.0.3 |
| UI 组件库 | Vant 4（自动导入） | ^4.9.14 |
| 样式方案 | UnoCSS + SCSS + CSS @layer | ^66.5.1 |
| 图表 | ECharts 6 | ^6.0.0 |
| 图标 | Iconify (Phosphor + Material) | 5.0.0 |
| 工具库 | VueUse | ^13.9.0 |
| HTTP | Axios（MAxios 封装） | — |
| Mock | vite-plugin-mock + MockJS | — |

### wl-mbase（Uniapp 跨端）技术栈

| 方向 | 技术选型 | 说明 |
|------|---------|------|
| 框架 | Uniapp（@dcloudio） | 一套代码，多端编译 |
| 构建 | Vite 5 | Uniapp Vite 模式 |
| UI 库 | uv-ui + Uniapp 内置组件 | `<view>`/`<text>` 跨端标签 |
| 页面注册 | `src/pages.json` | Uniapp 配置式路由（非 vue-router） |
| 路由跳转 | `uni.navigateTo()` / `uni.switchTab()` | Uniapp API |
| 网络请求 | `uni.request` 封装 | 非 axios |
| 条件编译 | `#ifdef H5` / `#ifdef MP-WEIXIN` | 平台差异化代码 |
| 状态管理 | Pinia | 与 Robot_H5 一致 |

### 基础能力包

| 包 | 说明 |
|---|---|
| `@miracle-web/utils` | HTTP 请求封装（MAxios）、AES 加密、自定义指令 |
| `@robot-h5/core` | H5 通用能力包 — 拍照/定位/扫码/NFC/文件上传下载/签名/录音/蓝牙/离线存储等 15 个 Hooks |
| `@robot-admin/git-standards` | Git 提交规范（commitizen + commitlint） |
| `@vant/touch-emulator` | 桌面端触摸模拟，开发调试用 |

### 开发工具链

| 工具 | 版本 | 用途 |
|---|---|---|
| pnpm | >=10.0.0 | 包管理器（preinstall 强制锁定） |
| Node.js | >=20.0.0 | 运行时 |
| ESLint 10 | 10.2.0 | Flat Config 代码检查 |
| vue-tsc | ^3.0.7 | Vue TS 类型检查（构建前强制执行） |
| Husky 9 + lint-staged | 9.1.7 / 16.4.0 | Git Hooks + 暂存区 lint |
| Commitizen + Commitlint | 4.3.1 / 20.5.0 | 交互式规范提交 |
| vite-plugin-mock | ^2.9.8 | 开发阶段 Mock 数据 |

### 构建 & 部署

| 方向 | 配置 |
|---|---|
| 部署平台 | Vercel / Nginx |
| 构建压缩 | esbuild（生产自动 drop console/debugger）+ Gzip |
| 移动端适配 | `postcss-mobile-forever`（px → vw 自动转换，基准 375px） |
| 代码分割 | `vendor-vue` / `vendor-vant` / `vendor-echarts` 三路分包 |
| CSS 层级 | `@layer base, components, utilities` 级联控制 |
| Sourcemap | 生产关闭 |

---

## 五大模块

底部 TabBar 提供 **5 大功能模块**，覆盖开发全流程：

| Tab | 模块 | 说明 |
|-----|------|------|
| 🏠 首页 | Dashboard | 问候语 + 快捷入口 + 每日金句 + 核心能力卡片 |
| 📦 组件 | 组件中心 | 16 个交互示例 + 开发工具（暗黑模式 / Eruda） |
| 📋 模板 | 模板中心 | 10 大业务领域模板入口 |
| ⚡ 能力 | 能力中心 | 15 个 @robot-h5/core 设备能力 Hook 可交互演示 |
| 👤 我的 | 个人中心 | 账号设置 / 主题外观 / 关于 / 退出登录 |

### 组件中心（16 个示例）

| 示例 | 路由 | 亮点 |
|------|------|------|
| 主题设置 | `/themeSetting` | 暗黑/跟随系统、主题色、字体缩放、动画开关 |
| 状态缓存 | `/keepAliveDemo` | keep-alive 计数器 + 表单 + 生命周期日志 |
| 404 页面 | `/404` | Liquid Glass 毛玻璃动画 |
| 自定义指令 | `/directives` | v-long-press、v-ripple 等 |
| SVG 图标 | `/svgIcon` | 本地 SVG + Iconify 在线图标 |
| UnoCSS 样式 | `/unoCss` | 原子 CSS 能力展示 |
| 滚动位置缓存 | `/scrollCache` | 返回页面自动恢复滚动位置 |
| 下拉刷新列表 | `/pullRefreshList` | CPullRefreshList 组件封装 |
| 渲染性能优化 | `/requestAnimationFrame` | rAF 动画帧对比 |
| 弹出层组合 | `/popupDemo` | ActionSheet / Popup 5 方位 / Dialog |
| 手势交互 | `/gestureDemo` | SwipeCell 删除、长按菜单、多按钮滑动 |
| 骨架屏 | `/skeletonDemo` | 基础骨架、商品卡片、联系人列表 |
| 表单验证 | `/formDemo` | C_Form 异步校验、动态规则、多步骤表单 |
| 表格组件 | `/tableDemo` | C_Table 虚拟滚动、排序、多选 |
| 客户档案 | `/customerArchive` | 完整 CRUD 业务模板 |
| ECharts 图表 | `/chart` | 折线/饼图/仪表盘可视化 |

### 模板中心（10 大领域）

| 领域 | 代码 | 说明 |
|------|------|------|
| 客户管理 | CRM | 客户档案 / 跟进记录 / 商机 |
| 设备巡检 | INSPECT | 巡检计划 / 故障报修 / 备件 |
| 物流配送 | LOGISTICS | 运单 / 签收 / 轨迹 |
| 合同管理 | CONTRACT | 合同模板 / 审批流 / 归档 |
| 安全管理 | SAFETY | 隐患排查 / 应急预案 |
| 能源管理 | ENERGY | 能耗监控 / 碳排放 |
| 视频监控 | VIDEO | 实时流 / 回放 / AI 告警 |
| 质量管理 | QUALITY | 质检记录 / 不良追溯 |
| 营销活动 | MARKETING | 活动管理 / 优惠券 / 推送 |
| 运维管理 | OPS | 工单系统 / 值班排班 |

### 能力中心（15 个 Hook 演示）

| 分类 | Hooks | 说明 |
|------|-------|------|
| 📸 影像采集 | useCamera · useVideoRecorder · useAudioRecorder | 拍照/录像/录音 + 实时预览 |
| 📍 定位扫描 | useLocation · useQrScanner · useNfc | GPS 定位 + 二维码 + NFC |
| 📁 文件处理 | useFileUpload · useFileDownload · useFilePreview | 分片上传 + 下载 + 预览 |
| ⚙️ 系统能力 | useBluetooth · useOfflineStorage · usePushNotification · usePermission | 蓝牙 / 离线 / 推送 / 权限 |
| ✨ 创意工具 | useSignature · useWatermark | 手写签名 + 图片水印 |

---

## 环境配置

| 环境 | 文件 | Mock | 模式 | 用途 |
|---|---|---|---|---|
| 开发 | `.env.development` | 开启 | standalone | 本地开发调试（Mock 数据） |
| SIT 测试 | `.env.test` | 关闭 | standalone | 对接测试环境后端 |
| UAT 预发布 | `.env.uat` | 关闭 | standalone | 预发布验证 |
| 生产 | `.env.production` | 关闭 | standalone | 正式上线 |
| 集成模式 | `.env.integrated` | 关闭 | integrated | 作为 mbase 子应用构建 |
| 演示 | `.env.vercel` | 开启 | standalone | Vercel 静态演示站 |

### 双模式运行机制

项目支持两种运行模式，通过 `VITE_APP_MODE` 环境变量切换：

| 维度 | standalone（默认） | integrated |
|---|---|---|
| 登录 | 独立登录页 | 从 mbase 获取 Token |
| 部署路径 | `/robot-h5/` | `/mbase/robot-h5/` |
| 网关 | 自有后端网关 | 共用 mbase 网关 |
| 权限 | 完整权限体系 | 权限由 mbase 统一管控 |

---

## 服务架构

```
┌─────────────┐     /api/*      ┌──────────────────────┐
│  Robot H5   │ ──────────────► │  后端网关             │ ──► 各微服务
│  (前端 SPA) │                 │  172.28.99.172:9000   │
└─────────────┘                 └──────────────────────┘
```

- **单一网关**：前端只对接一个后端地址，复用 PC 端已有微服务
- **Token 统一**：登录获取，MAxios 拦截器自动携带，401 自动跳转登录
- **权限同步**：PC 端管理系统创建应用 `robot-h5` 并绑定菜单权限，H5 端动态获取
- **HTTP 重试**：自动重试 2 次（间隔 1s），GET 请求加时间戳防缓存

---

## 权限体系

### 架构流程

```
打开 H5
  ↓
无 Token → 登录页 → 获取 Token
  ↓
GetUserInfo + loadPermissions(appId='robot-h5')
  ↓
解析菜单树 → allowedPaths + buttonPermissions + tabBarMenus
  ↓
路由守卫校验 → TabBar 动态渲染
```

### 菜单类型

| menuType | 说明 | 示例 |
|---|---|---|
| D | 目录（TabBar 容器） | 底部导航分组 |
| M | 菜单（页面路由） | /dashboard、/order |
| B | 按钮（权限点） | order:add、order:edit |

### 权限校验方式

- **路由级**：路由守卫 `isRouteAllowed(path)` 校验访问权限
- **按钮级**：`v-permission="'order:add'"` 指令 或 `usePermission().hasPermission()` Hook
- **TabBar 动态渲染**：优先使用权限接口返回的菜单，兜底使用本地路由定义
- **降级策略**：权限数据为空时默认放行（Mock / 未对接场景不白屏）

---

## 设计系统

### 设计语言

**Apple HIG Liquid Glass** + Linear 现代工具美学，核心原则：**克制、层次、一致、呼吸**。

### 颜色令牌（亮/暗双模式）

| 令牌 | 亮色 | 暗色 | 用途 |
|---|---|---|---|
| `--ds-bg` | #FFFFFF | #000000 | 主背景 |
| `--ds-bg-secondary` | #F5F5F7 | #1C1C1E | 次级背景 |
| `--ds-surface` | #FFFFFF | #1C1C1E | 浮层背景 |
| `--ds-text-primary` | #1D1D1F | #F5F5F7 | 主文字 |
| `--ds-text-secondary` | #6E6E73 | #98989D | 辅助文字 |
| `--ds-accent` | #0071E3 | #0A84FF | 品牌强调色 |
| `--ds-glass-bg` | rgba(255,255,255,0.52) | rgba(30,30,35,0.68) | 毛玻璃背景 |
| `--ds-glass-blur` | 40px | 40px | 毛玻璃模糊值 |

### CSS @layer 优先级体系

```
@layer base         ← UnoCSS preflight（reset），最低
@layer components   ← 组件 SCSS（vite.config.ts 自动包裹），中
@layer utilities    ← UnoCSS 工具类（flex / mb-4），最高
```

### 排版 & 间距

- **字号梯度**：11 / 12 / 13 / 14 / 15 / 16 / 17 / 20 / 22 / 28 / 34 px
- **间距（4px 网格）**：4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64
- **圆角**：sm(8px) / md(12px) / lg(16px) / xl(20px) / full(9999px)

---

## 全局组件

9 个全局组件，统一 `C_` 前缀命名，通过 `unplugin-vue-components` 自动注册：

| 组件 | 用途 |
|---|---|
| `<CNavBar>` | 导航栏 |
| `<CIcon>` | UnoCSS 图标封装 |
| `<CSvgIcon>` | 自定义 SVG 图标 |
| `<CPullRefreshList>` | 下拉刷新 + 无限滚动 |
| `<C_Form>` | 配置式表单（支持异步校验、动态规则） |
| `<C_Table>` | 移动端卡片式表格（虚拟滚动、排序、多选） |
| `<C_Logo>` | 品牌标识 |
| `<C_VirtualStatusBar>` | 桌面端虚拟状态栏 |
| `<C_WebSite>` | WebView 容器 |

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

# 集成模式调试
pnpm dev:integrated

# 类型检查
pnpm type-check

# 构建各环境
pnpm build:test       # SIT
pnpm build:uat        # UAT
pnpm build:prod       # 生产
pnpm build:integrated # mbase 子应用
```

**默认账号**：`admin` / `123456`

---

## 版块导航

- [扩展规范](./standards) — 编码约定、文件组织、样式规范、提交规范
- [Skills 集合](./skills) — 7 个 AI 辅助研发 Skill（prototype-scan / api-spec / api-contract / page-codegen / route-register / mock-gen / convention-audit）
- [AI Skill 流水线](./skill-pipeline) — 从原型到代码的完整自动化流程（含 Robot_H5 与 wl-mbase 双端对比）
- [@robot-h5/core](./h5-core/) — 通用能力包详细文档
