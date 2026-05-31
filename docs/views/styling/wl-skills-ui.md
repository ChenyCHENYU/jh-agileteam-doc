# @agile-team/wl-skills-ui — 企业级 UI 风格对齐框架

> 版本：v1.8.13 · 让 Vue + Element Plus 业务系统获得一致的视觉，可被 AI 精确识别和修复。

---

## 这是什么？

一套 "**设计令牌 + 控件对齐 + 封装组件化妆 + 页面骨架 + 业务渲染 + 自动化扫描修复 + AI Skills**" 的全栈式风格框架。

解决的核心问题：团队多个 Vue 项目新老共存，封装组件各异（`Base*` / `jh-*` / `C_*` / `c_*`），如何在 **不改业务代码** 的前提下做到全项目视觉一致。

---

## 五层模型（L0 → L4）

```
L0  Design Tokens          颜色 / 间距 / 圆角 / 字号 / 阴影（"宪法"）
L1  Element Plus 原子层    el-button / el-input / el-table ...
L2  Vendors 封装组件层 ⭐  Base* / jh-* / C_*/c_* / AG Grid（化妆主战场）
L3  Page Layouts 骨架层    list-page / tree-list / form-dialog
L4  Runtime 业务渲染层     defineColumns / renderOps / preset
```

## 两种运行模式

| 模式 | 适用 | 包含层 | 接入方式 |
|---|---|---|---|
| **Native** | 新项目、完全可控 | L0+L1+L2+L3+L4 | `@use '.../styles' as *;` + `installCommonPreset()` |
| **Skin** | 老项目、无源码 | L0+L1+L2 | `@use '.../styles/presets/skin' as *;`（不动业务代码） |

---

## 快速开始

### 新项目（Native Mode）

```bash
npx wl-ui init --mode native
```

```scss
// src/styles/index.scss
@use "@agile-team/wl-skills-ui/styles" as *;
```

```ts
// src/main.ts
import { installCommonPreset } from "@agile-team/wl-skills-ui/runtime/common-preset";
installCommonPreset();
```

### 老项目（Skin Mode）

```bash
npx wl-ui init --mode skin
```

```scss
// 仅引入 skin preset（不引入 layouts，避免冲击老布局）
@use "@agile-team/wl-skills-ui/styles/presets/skin" as *;
```

---

## CLI 速查

```bash
wl-ui init      [--mode native|skin] [--editor <e>]   # 初始化
wl-ui update    [--editor all] [--force]              # 增量更新
wl-ui scan      --target src [--layer L0,L1,L2]       # 扫描偏差
wl-ui fix       --target src [--dry-run]              # 自动修复
wl-ui check     --project .                           # 接入完整性检查
wl-ui doctor    [--print-overrides]                   # 环境体检
wl-ui diff                                            # 升级前对比
wl-ui clean     [--dry-run]                           # 卸载清理
```

---

## 扫描规则（32 条）

| 规则 | 层级 | 说明 |
|---|---|---|
| R001-R015 | L1 | Element Plus 控件对齐（表格/表单/按钮/Tag/弹窗/分页） |
| R016-R018 | L0 | 硬编码颜色检测（template/style/script） |
| R021-R022 | L2 | BaseTable 必须 `render-type="agGrid"` + 唯一 `cid` |
| R025-R027 | L2 | 语义合规 + 原生 HTML 拦截 + loading 遮罩 |
| R031-R037 | L1 | 扩展组件族（card/tabs/descriptions/drawer/upload/steps/feedback） |

---

## Runtime API

| API | 说明 |
|---|---|
| `defineColumns(cols)` | 列定义，自动应用 `COLUMN_AUTO_MAP` |
| `renderOps(items)` | 操作列图标按钮组（view/edit/del/log 预设） |
| `renderTagNode(v, map)` | 状态 Tag 渲染 |
| `renderClassifyTag(v, map)` | 分类 Tag 渲染 |
| `installCommonPreset()` | 安装通用业务预设 |
| `registerColumnAutoMap(field, config)` | 注册新字段自动渲染 |
| `setDictResolver(fn)` | 解耦动态字典查询 |

---

## MCP 工具

| Tool | 作用 |
|---|---|
| `wl_ui_check` | 检查 tokens/styles/runtime 接入完整性 |
| `wl_ui_scan` | 扫描 UI 风格偏差 |
| `wl_ui_fix_dry_run` | 预览自动修复 |
| `wl_ui_detect_skin` | 检测项目 vendor 版本配对 |
| `wl_ui_route_intent` | 自然语言识别 UI 治理意图 |
| `wl_ui_recommend_flow` | 推荐 nextActions 和 kit 桥接 |

---

## 与 wl-skills-kit 的协同

两包独立不强耦合，但可配合形成闭环：

- `wl-skills-ui`：负责设计体系、tokens、样式风格、化妆层和 Runtime
- `wl-skills-kit`：负责 AI 生成页面的团队规范、最佳实践、mock、菜单/字典/权限同步

推荐最终页面骨架：

```
AbstractPageQueryHook + BaseQuery + BaseToolbar + BaseTable(render-type="agGrid", cid) + jh-pagination
```

---

## 项目依赖适配

| 依赖 | 推荐版本 | 备注 |
|---|---|---|
| `element-plus` | `2.2.6-prod.3` | 集团 jh- 定制版 |
| `@jhlc/jh-ui` | `3.1.0` | SCSS 皮肤包 |
| `@agile-team/wl-skills-ui` | `^1.8.0` | 已对齐上述组合 |

---

## 设计令牌

主色：`#4368ff` → `--el-color-primary`

详见包内 `design/spec/`：color / typography / spacing 三份规范文档。
