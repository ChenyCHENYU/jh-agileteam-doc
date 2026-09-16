# 基础设施库

> 被五包与业务项目共同依赖的底层库：平台组件、Git 规范、表单校验、H5 桥接。它们不在业务代码里直接"调用功能"，而是以**配置、约束与桥接**的方式生效。

## 库矩阵

| 库 | 生效方式 | 被谁依赖 |
|----|---------|---------|
| `@jhlc/common-core` | 全局注册 `jh-*` 平台组件 | kit 体系全部 PC 页面 |
| `@robot-admin/git-standards` | `init` 安装 Husky/Commitlint/ESLint/Prettier/lint-staged | 新项目工程化前置（强制） |
| `@robot-admin/form-validate` | 表单 rules 校验函数库 | PC 表单（K18 校验其版本与用法） |
| `@robot-h5/core` | H5 运行时：宿主识别/桥接/15 Hooks/水印 | Robot_H5 模板与移动端子应用 |
| `@agile-team/naive-ui-components` | Vue 3 组件库（Naive UI 基座） | 早期项目（孵化中） |

---

## @jhlc/common-core — 平台组件基座

- `jh-button` / `jh-select` / `jh-date` / `jh-drag-row` 等 **35+ 平台组件**的来源（组件文档见 [PC 组件中心](/frontend/pc/components/jh-button)）；
- 全局注册一次即可，模板直接使用 `<jh-*>`；
- kit 的 13 条组件合规规范与 R 系扫描都以它为基线。

---

## @robot-admin/git-standards — Git 工程化前置

```bash
npx @robot-admin/git-standards init
```

- 安装 Husky + Commitlint + lint-staged + ESLint + Prettier（完整预设可叠加 Oxlint 快速 lint）；
- `jh4j-cloud-cli` 创建的 PC 模板默认已启用该能力（`--no-standards` 可关闭）；
- 提交流程：`type(scope): 功能点-具体内容`，与 bd `commit` 校验同口径。

---

## @robot-admin/form-validate — 表单校验函数库

- 团队标准表单校验规则集（必填 / 长度 / 数值边界 / 枚举 / 正则），声明在 `data.ts` 的 rules 中复用；
- kit **v2.16.x 起的标准校验库**：K18 检查其版本与用法（缺失依赖 / 废弃拆包 / Naive API 误用即报错）；
- "仅必填"切换（K17）与它配合实现大表单必填态一键切换。

---

## @robot-h5/core — H5 运行时核心

- wl-mbase 严格宿主识别、可信来源校验、App/PDA SDK 按需加载；
- **15 个 Hooks**（`useBridge` / `useWatermark` / `useUpload` 等）+ 统一请求（Bearer、`2000/4001` 兼容）；
- v1.2.0：水印服务端契约 `watermarkPolicy` / `buildWatermarkFormData`，`failureMode: 'throw'` 防静默上传原图。

详见 [@robot-h5/core 文档](/frontend/mobile-h5/h5-core/)。

---

## naive-ui-components — Naive UI 组件库（孵化中）

- 基于 Naive UI 的 Vue 3 组件库（v0.1.4），用于非 jh4j 技术基线的项目；
- 早期阶段：API 未冻结，暂不建议新项目直接依赖。

---

## 版本与依赖原则

1. 基础库**不依赖**五包；五包与业务项目按需依赖基础库——依赖方向永远单向；
2. 平台升级（jh4j-cloud / Element Plus / Naive UI）引发的 breaking，由基础库先行吸收；
3. 机器门禁引用的版本口径（K18 的 form-validate 范围、B27 的父 BOM 清单）以各包 rules 为单一事实源。
