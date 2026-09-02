# 五个子应用上基座（wl-mbase）

> 案例④：安全 / 安防 / 环保 / 质量 / iemp 五个 H5 子应用，一套免登、桥接、水印、断点续传协议。

## 数据面板

| 维度 | 数据 |
|------|------|
| 子应用 | 安全 wl-app-safe（v1.1.1）· 安防 wl-app-security · 环保 wl-app-ep · 质量 wl-app-quality · iemp |
| 基座 | wl-mbase v1.0.6（小程序 / 钉钉 H5 / 浏览器 H5 / App·PDA 四端） |
| 能力 | 免登（portal_token + companyId）· 跨端桥接（钉钉 JSAPI / App postMessage）· 水印服务端契约 · 断点续传 |
| 兜底 | 消息跳转白名单 · 严格 origin 校验 · 多端安全构建 · `test:contracts` 协议回归 |

## 接入要点（子应用视角）

| 事项 | 说明 |
|------|------|
| 免登 | 接收 `portal_token + companyId`，后端二次校验权限；新 token 覆盖旧账号态 |
| 能力调用 | `@robot-h5/core` 自动识别宿主：App 走 `uni.postMessage`，钉钉 H5 走 `window.parent.postMessage`，业务代码不分端 |
| 水印 | `watermarkPolicy` + `buildWatermarkFormData`（core v1.2.0+）：拍照/相册/既有图片统一，`failureMode: 'throw'` 防静默上传原图 |
| 弱网上传 | 断点续传（切片 + 服务端合片），契约见 mbase `docs/断点续传能力设计与接入.md` |
| 登记 | `portal-apps.ts` 注册 + `relay.html` 消息白名单，两处必须同步 |

## 踩坑与沉淀

| 坑 | 沉淀 |
|----|------|
| 子应用 iframe 直调钉钉 JSAPI 被安全策略拦截 | 基座统一代理 + `postMessage` 回传；跨端媒体 SDK `/mbase/sdk/portal-media.js` |
| 第三方 iframe 被误判为基座 | 严格 origin + 宿主标记（`from=portal` / `mbase_host=app`）双重校验 |
| App SDK 被打进普通 H5 主包 | `bridge.mbase.appSdkUrl` 运行时按需加载；缺失返回稳定错误码 `app_sdk_url_missing` |
| 通知设置页开关写了不生效 | 设置项尚未接入提醒服务——文档如实标注已知限制，不作为验收项 |

## 可复现路径

```bash
# 子应用侧（Robot_H5 模板已内置）
pnpm build:integrated        # mbase 子应用模式构建
# 基座侧
pnpm sit                     # 基座 H5 直连 SIT
```

完整协议与验收清单：[H5 子应用集成](/frontend/mobile-uniapp/integration) · [App 集成与发布](/frontend/mobile-uniapp/app-integration)。
