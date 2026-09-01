# @agile-team/wl-skills-ui — 企业级 UI 风格对齐框架

> 版本：v1.12.0 · 让 Vue + Element Plus 业务系统获得一致的视觉，可被 AI 精确识别和修复。

::: tip 能力 Profile 体系（v1.12.0）
按项目形态选择接入档位，统一声明 adapter、扫描规则、SCSS preset 与 runtime guard：

| Profile | 适用 | 说明 |
|---|---|---|
| `native-element` | 原生 Element Plus 新项目 | `installCommonPreset()` **默认档**；无 AG Grid、无 `jh-*` 遗留适配 |
| `legacy-jh-element` | jh-ui 存量项目 | Element Plus 2.2 + jh-ui 适配 |
| `legacy-jh-ag` | BaseTable AG Grid 存量 | 仅此档启用 R021、AG 样式与分屏/空态 observers；非 AG 档编译产物零 `.ag-*` 选择器 |

项目内以 `.wl-ui-profile.json` 声明，`wl-ui profiles` 查看与切换，依赖自动识别。旧 `runtime/auto` 与 `styles/skin` 入口保留 full legacy 兼容。
:::

---

## 这是什么？

一套 "**设计令牌 + 控件对齐 + 封装组件化妆 + 页面骨架 + 业务渲染 + 自动化扫描修复 + AI Skills**" 的全栈式风格框架。

解决的核心问题：团队多个 Vue 项目新老共存，封装组件各异（`Base*` / `jh-*` / `C_*` / `c_*`），如何在 **不改业务代码** 的前提下做到全项目视觉一致。

---

## 五层模型（L0 → L4）

```
L0  Design Tokens          颜色 / 间距 / 圆角 / 字号 / 阴影（"宪法"）
L1  Element Plus 原子层    el-button / el-input / el-table ...
L2  Vendors 封装组件层 ⭐  Base* / jh-* / C_*/c_* / custom / AG Grid（老项目化妆主战场，无源码也能覆盖）
L3  Page Layouts 骨架层    list-page / tree-list / form-dialog
L4  Runtime 业务渲染层     defineColumns / renderOps / preset
```

## 两种运行模式

| 模式 | 适用 | 包含层 | 接入方式 |
|---|---|---|---|
| **Native** | 新项目、完全可控 | L0+L1+L2+L3+L4 | `@use '.../styles' as *;` + `installCommonPreset()` |
| **Skin** | 老项目、无源码 | L0+L1+L2 | `@use '.../styles/presets/skin' as *;` + `import ".../runtime/auto"`（不动业务代码） |

> **主题锁与逃生口（v1.9.2+）**：`installCommonPreset()` 会自动安装品牌主题锁，防止平台动态主题覆盖。需要定制视觉的页面可加 `.wl-ui-skin-exempt` 或 `[data-wl-ui-skin="off"]` 退出品牌锁定（登录页 `.lp-root` 自动识别豁免）。

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

```ts
// src/main.ts：安装包级保护（主题锁 + 普通表格长文本兜底），不接管页面布局或业务列定义
import "@agile-team/wl-skills-ui/runtime/auto";
```

---

## CLI 速查

```bash
wl-ui init      [--mode native|skin] [--editor <e>]   # 初始化
wl-ui update    [--editor all] [--force]              # 增量更新
wl-ui scan      --target src [--layer L0,L1,L2] [--vendor base-table,jh] [--mode skin|native]  # 扫描偏差
wl-ui fix       --target src [--dry-run]              # 自动修复
wl-ui check     --project .                           # 接入完整性检查
wl-ui doctor    [--project .] [--print-overrides]     # 环境体检
wl-ui diff      [--project .]                         # 升级前对比
wl-ui clean     [--project .] [--dry-run]             # 卸载清理
wl-ui audit     --target src [--output json] [--refresh-baseline]  # 全量审计 + 维护基线
wl-ui drift     --baseline <file> --current <file>    # 基线漂移对比
wl-ui exempt    init --project . --target src          # 智能豁免脚手架
wl-ui snapshot  list|diff|rollback|clean              # 修复快照/回退
wl-ui add-preset <name>                               # 业务 preset 脚手架
wl-ui prompts                                         # AI 触发提示
wl-ui all       --project .                           # 一键全流程（scan→fix→check）
```

---

## 扫描规则（39 条，R001–R043）

| 规则 | 层级 | 说明 |
|---|---|---|
| R001-R015 | L1 | Element Plus 控件对齐（表格/表单/按钮/Tag/弹窗/分页） |
| R016-R018 | L0 | 硬编码颜色检测（template/style/script） |
| R019-R020 | L2 | 脚本式 columnsDef 编号/字典列缺渲染函数检测（renderBadge/renderDictClassifyTag） |
| R021-R022 | L2 | BaseTable 必须 `render-type="agGrid"` + 唯一 `cid`（仅 `legacy-jh-ag` Profile 启用） |
| R025-R027 | L2 | 语义合规 + 原生 HTML 拦截 + loading 遮罩 |
| R028 | L0 | 业务 `<style>` 硬编码 `border-radius` 检测（提示改用 token） |
| R031-R037 | L1 | 扩展组件族（card/tabs/descriptions/drawer/upload/steps/feedback） |
| R038 | L1 | 新建类按钮必须用 `primary` 主色填充（可自动修复） |
| R039 | L1 | 普通数据列必须支持省略号 + hover 提示（可自动修复） |
| R040 | L2 | 未知复合控件结构审查（要求人工核对后再增加精准适配） |
| R041（v1.10.3） | L1 | 按钮尺寸：`el-button` / `ElButton` / `BaseToolbar` 无显式 `size` 时告警并建议 `small`（已纳入 fixer） |
| R042（v1.11.0） | L1 | Element Plus 日期/时间弹层几何隔离，阻断裸 `.el-date-picker` 宽高/定位样式误伤 Teleport 面板 |
| R043（v1.12.0） | L1 | 静态已知按钮文案到语义 icon 的确定性映射（含 fixer 与一致性门禁） |

> `standards/rules.json` 是 category / severity / layer / vendor / Profile / fixability 的运行期事实源（39 条元数据与 39 个实现一一对应，14 条可修规则与 fixer 集合一致）。scanner v1.11.0 起支持 `--changed --base <ref>` Git 增量扫描、`--parser auto|fast|sfc`（优先复用目标项目本地 `@vue/compiler-sfc`）与 `wl-ui-mcp` 可执行入口；v1.12.0 起 CLI 与 MCP 共享同一 `scanner/engine.mjs` 实现（MCP 不再逐次起 Node 子进程），报告协议升级 `summary.v1` / 可分页 `compact.v2`（规则公共字段集中 `ruleCatalog`，`limit/cursor` 续取），fixer 支持 `profile/only/skip` 范围约束、逐规则改动统计与 SHA-256 `planHash`（预览后 `--plan-hash` 拒绝漂移计划）。

---

## 复合控件结构契约（v1.9.12）

`standards/component-structures.json` 登记了 common-core 复合控件（多标签、人员/部门/树选择、多选、混合数字输入、BaseToolbar 分裂按钮）的结构契约：

| 契约项 | 说明 |
|--------|------|
| 边框所有者 | 只由最合理的外层容器绘制，内部层无描边 |
| 高度策略 | 组合根统一 26px，左右图标统一 14px，纯图标附加段统一 32px |
| 状态覆盖 | 五态（default/hover/focus/error/disabled）始终只有一层边框 |
| Teleport 出口 | 多选/下拉类控件的弹出层出口位置 |

R040 基于此契约扫描：已登记结构正常通过，**疑似新结构要求人工核对**后再增加精准适配，不执行机械修复。

---

## Runtime API

| API | 说明 |
|---|---|
| `defineColumns(cols)` | 列定义，自动应用 `COLUMN_AUTO_MAP`（普通文本列自动省略号 + hover 提示，R039） |
| `renderOps(items)` | 操作列图标按钮组（view/edit/del/log/ok/send 预设） |
| `renderTagNode(v, map)` | 状态 Tag 渲染 |
| `renderClassifyTag(v, map)` | 分类 Tag 渲染 |
| `renderBadge(v)` / `renderCountBadge(v)` | 编号 / 计数徽标 |
| `renderRatingLevel(v)` | 评级颜色 |
| `installCommonPreset()` | 安装通用业务预设（含主题锁 + 普通表格长文本包级保护） |
| `installUiRuntimeGuards()` | 主题锁 + 普通表格长文本包级保护（auto 保护入口） |
| `installOverflowTooltipGuard()` | 单独安装真实溢出 Tooltip 兜底 |
| `installSplitGridResizeGuard()` | 上下分屏拖动后 AG Grid 宿主自动沿 pane 收缩（v1.9.16；v1.11.1 修复空态守护导致的手柄拖不动） |
| `normalizeColumnAlignment(s)` | 把业务 `align/headerAlign` 桥接为 BaseTable/AG Grid 可消费的 `cellStyle/headerClass`，递归覆盖分组列（v1.9.16） |
| `normalizeColumnAlignmentsWith(cols, { defaultAlign: "center" })` | 无显式对齐的列默认补齐居中（含表头 class 桥接，递归分组 children），`defaultAlign: null` 可退出（v1.10.0） |
| `renderAutoTag(v, dictKey, fieldName?)` / `renderAutoTagByLabel(label, fieldName?)` | 文案语义自动判色 Tag：状态词实心、分类/形态词镂空、中性词纯文本兜底，零配色表覆盖上百字典列（v1.10.0，来源 wl-ui-ep 存量改造实战） |
| AG Grid 空态守护 | 测量真实数据区为完整空态保留 160px，支持上下/左右分屏受控撑高与卸载清理（v1.10.3 runtime/ag-grid-empty-state） |
| `createPreset(config)` / `installPreset(config)` | 自定义 preset 工厂 |
| `registerColumnAutoMap(field, config)` | 注册新字段自动渲染 |
| `setDictResolver(fn)` | 解耦动态字典查询 |

---

## 发布门禁：Chromium 视觉回归（v1.9.12）

npm 发布前强制通过真实浏览器视觉回归测试，覆盖 8 个维度：

| 回归维度 | 说明 |
|---------|------|
| 主题防反覆盖 | 品牌主色不被平台动态主题覆盖 |
| 按钮圆角 | 五态（default/hover/focus/error/disabled）一致 |
| textarea focus | 品牌色边框 + 轻焦点环 |
| 数字输入单描边 | 始终一层边框，无双描边 |
| 复合输入自然增高 | 多标签/人员选择换行时自然增高 |
| 长文本提示 | 真实溢出时省略号 + hover 可查看 |
| 表格行状态 | hover/selected 优先级正确 |
| 定制豁免 | 登录页/显式豁免区域保持自身设计 |
| 字体链统一（v1.9.14） | Element Table / BaseTable / AG Grid 中英文数字字体链一致 |
| jh-input-number 五态（v1.9.14） | 复合数字框 26px 高度链 + 单描边 + controls 语义正确 |
| 列对齐桥接（v1.9.16） | 业务 `align/headerAlign` 正确桥接为 `cellStyle/headerClass` |
| AG Grid 空态（v1.10.3） | 单层/分组表头、上下双空表滚动、数据区中心误差与数据恢复清理 |
| 选择框对轴（v1.11.0） | AG Grid 选择列表头/行复选框横向几何对齐（5 项几何回归） |
| 日期弹层隔离（v1.11.0） | Teleport 日期/时间面板不受业务样式误伤（R042 契约） |

---

## MCP 工具（13 个）

| Tool | 作用 |
|---|---|
| `wl_ui_check` | 检查 tokens/styles/runtime 接入完整性 |
| `wl_ui_scan` | 扫描 UI 风格偏差（默认 compact 分组 JSON） |
| `wl_ui_fix_dry_run` | 预览自动修复 |
| `wl_ui_detect_skin` | 检测项目 vendor 版本配对 |
| `wl_ui_route_intent` | 自然语言识别 UI 治理意图 |
| `wl_ui_recommend_flow` | 推荐 nextActions 和 kit 桥接 |
| `wl_ui_skill_prompt` | 生成 UI 治理 Skill 提示词 |
| `wl_ui_list_rules` | 列出全部扫描规则及说明 |
| `wl_ui_describe_rule` | 查询单条规则详情 |
| `wl_ui_drift` | 对比基线漂移 |
| `wl_ui_contract_extract`（v1.11.0） | 将成熟 Vue 页面提取为按领域/场景分类的脱敏 `wl-ui-contract.v1` |
| `wl_ui_contract_validate`（v1.11.0） | 校验页面契约结构与脱敏边界 |
| `wl_ui_contract_match`（v1.11.0） | 契约匹配复用（不保存源码/真实接口/业务字段值） |

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
| `@agile-team/wl-skills-ui` | `^1.12.0` | 已对齐上述组合 |

---

## 设计令牌

客户规范主色：`#002a8f` → `--el-color-primary`

详见包内 `design/spec/`：color / typography / spacing 三份规范文档。
