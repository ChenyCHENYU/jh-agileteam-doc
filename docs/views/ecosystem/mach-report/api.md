---
description: "MachReport API 速查：九个能力入口（核心//vue//server//xlsx//designer//analytics//codes）、RenderPlan 数据模型与校验、createTableTemplate 全选项、MachReportPreview Props/事件/Ref 方法、数据契约与导出入口…"
---

# API 参考

<AuthorTag :authors="['CHENY']" />

[[toc]]

> 适用于 <NpmVersion pkg="@agile-team/mach-report" fallback="2.21.1" />。MachReport 是独立报表引擎：应用提供模板和业务数据（或直接返回 `RenderPlan`），包内统一校验、分页、预览与输出。

## 能力入口速查

| 入口 | 主要 API |
| --- | --- |
| 核心 | `createTableTemplate` / `createTemplate` / `paginateTemplate` / `renderPlan` / `createReportSource` / `columnsFromContract` / `validateRenderPlan` / 模板管理 / 编辑事务 |
| `/vue` | `ReportPreview` / `MachReportPreview` / `machReportPlugin` / `defineReport` / `useMachReport` / `defineMachReportConfig` / `ReportLabelStudio` |
| `/server` · `/server/node` | `createReportRuntime` / `createReportTaskQueue` / `createReportJobService`（租约/幂等/取消/重试）/ Node 线程与文件适配器 |
| `/worker` | `createBrowserReportExecutor` / `serveReportWorker`（浏览器 Worker 工厂） |
| `/xlsx` · `/xlsx/node` | `renderPlanToXlsx` / `importExcelTemplate` / `bindExcelTemplate` / `inspectExcelWorkbook`；Node `writeRowsToXlsx` 流式导出 |
| `/pdf` | `renderPlanToPdf`、字体加载与缓存、`OutputFidelityError` 严格门禁 |
| `/designer` | `ReportTemplateEditor` / `ExcelBindingWizard` / `RuleEditor` / `TemplateReviewPanel` |
| `/analytics` | `createCrossTable` / `computeDataset` / `aggregateRows` / `createMatrixTable` / `createChartComponents` |
| `/codes` | `createCodeAssetRenderers` / `renderCodeImage`（BWIPP 真实 QR/条码 PNG） |
| `/sql` | 动态 SQL 编译与单 SELECT 校验（不连接数据库） |

## RenderPlan — 核心数据模型

`RenderPlan` 是模板与输出的统一中间表示：`pages` 为输出页列表，页面与组件几何尺寸以**毫米**为单位。应用可以直接生成这个 JSON，也可以用模板分页器生成：

```ts
import { RENDER_PLAN_SCHEMA_VERSION, validateRenderPlan, type RenderPlan } from "@agile-team/mach-report";

const plan: RenderPlan = {
  schemaVersion: RENDER_PLAN_SCHEMA_VERSION,
  pages: [{
    pageWidthMm: 210,
    pageHeightMm: 297,
    components: [{
      kind: "text",
      leftMm: 20, topMm: 20, widthMm: 100, heightMm: 10,
      text: "报表标题"
    }]
  }]
};

const result = validateRenderPlan(plan);
if (!result.ok) throw new Error(result.errors[0]?.message ?? "报表格式错误");
```

## createTableTemplate — 标准明细工厂选项

| 选项 | 行为 |
| --- | --- |
| `layout` | 默认 `page` 标准纸张；`wide` 按全部列自然宽度展开（与 `paper` 互斥） |
| `columns` | 必填非空列数组，沿用 `ListColumn` 字段、样式与格式化 |
| 列 `widthMm` / `flex` | 固定毫米宽优先；page 中其余列按权重分配余量，wide 中为基准宽度的倍数 |
| `columnWidthMm` | 仅 wide：自动列基准宽度，默认 30mm |
| `paper` / `landscape` | page 默认 A4，支持预设或 `{ widthMm, heightMm }`、横向 |
| `margins` | 默认各 10mm（`marginTopMm` / `marginBottomMm` / `marginLeftMm` / `marginRightMm`） |
| `title` / `titleStyle` / `titleHeightMm` / `titleGapMm` | 首页标题，默认居中加粗 16pt、占高 10mm |
| `dataset` / `params` | 默认 `detail` 数据集 / 模板查询参数 |
| `listOptions` | 行高、字号、重复表头、分组、小计与总计、`rowKey`/`revisionField`/`sourceTokenField`、多层合并表头 `headerGrid` |
| 列/`listOptions.align` | `auto/left/center/right/justify`；auto 按内容类型对齐，`semanticRole` 可声明语义（measure 居右等） |

非法尺寸、无可用空间或 page 固定列溢出同步抛错；输入不被修改。

## 共用数据契约（前后端一致）

- `ReportDefinition.dataSchema` 按数据集名接收 `DatasetContract`：字段支持 `text/number/boolean/date/decimal`、必填、可空、枚举、范围、语义与单位；`rowKey` 验证非空唯一；
- `columnsFromContract(contract, overrides?)` 从契约生成表头/语义；`datasetJsonSchema(contract)` 导出 JSON Schema；
- `reportParamsJsonSchema` / `validateReportParams` 导出并校验查询参数（必填参数在**取数前**验证）；
- `ReportProvider.query(context)` 返回 `{ datasets, revision?, sourceToken?, diagnostics? }`，可选 `save / export / templates`；
- 固定标签用 `defineLabelReport({ template, rows | load, dataSchema?, params? })`，返回同一 `ReportDefinition`。

## MachReportPreview — 预览组件契约

| 属性 | 作用 |
| --- | --- |
| `reportId` | 报表 ID：字符串、逗号分隔或数组；多 ID 按顺序合并页 |
| `params` | 查询参数，传给数据源；宿主更新时同步参数面板 |
| `fetcher` | 当前组件数据源，优先于插件注入 |
| `paramDefs` / `showParams` | 参数面板定义（prop 优先，`[]` 禁用自动定义）/ 显隐 |
| `height` / `autoLoad` | 容器高度 / 自动加载 |
| `showExport` / `showPrint` / `showPdfWindow` | 工具栏操作显隐 |
| `gapPx` / `messages` / `preset` | 页间距、文案与配置预设 |
| `editable` | 默认 `false`；`true` 本地双击编辑，或 `{ canEdit, validate, save }` 配置业务权限与保存 |
| `excelImport` | 默认 `false`；`true` 显示 Excel 模板导入入口，或传 `ExcelImportOptions` |

事件：`loaded(pageCount)`、`error(message, { code, cause? })`、`warning(message)`、`cell-edit(edit)`、`template-import(result)`。`error.code` 为稳定枚举：`param / fetch / validate / render / pdf / print / export / edit / import / config`。

Ref 方法：`reload()`、`print()`、`exportAs(format)`、`openPdfWindow()`、`gotoPage(page)`、`setParams(values, { reload? })`、`getPlan()`、`getChanges()`、`importExcel(input, options?)`。`exportAs` 支持 `html / pdf / xlsx(excel) / png(image) / word(doc)`。

数据源优先级：**组件 `fetcher` → 插件显式 `fetcher` → 插件 `reports`**；全部缺失时显示配置错误，不发隐式网络请求。

```ts
// PlanFetcher 签名（后端直接返回渲染计划时）
type PlanFetcher = (input: {
  reportIds: string[];
  params: Record<string, string>;
  signal?: AbortSignal;
  onWarning?: (message: string) => void;
}) => Promise<RenderPlan>;

// 本地模板：createLocalFetcher({ [reportId]: { template, datasets } })
// 请求工具：createFetchRequest({ baseUrl, headers, credentials, timeoutMs })
```

## 模板管理 API

- `defineReportTemplate({ id, name, revision?, description?, template })` 创建版本化纯 JSON 文档；
- `parseReportTemplate(unknown)` / `serializeReportTemplate(document)` 持久化往返；
- `validateReportTemplate` / `validateReportTemplateDocument` 返回 `{ ok, errors, warnings }`；
- `createTemplateRegistry(documents?)` 提供 `get/list/register/remove`；重复 ID 拒绝，更新用 `register(doc, { replace: true })`；
- 报表 `template` 可为静态模板或异步加载函数 `({ reportId, params, signal }) => template`（动态模板每次重读、无隐式缓存）。

## 输出与质量门禁

| 出口 | 说明 |
|------|------|
| `renderPlanToPdf(plan, { fidelity })` | `strict` 对缺字、坏图片、版式降级抛 `OutputFidelityError`；默认 `warn` 保留文件与诊断 |
| `renderPlanToXlsx(plan)` | `sheetMode: "auto"` 宽表还原连续 Sheet；`valueMode: "raw"` 保留原始数值/布尔/文本与数字格式 |
| Canvas / PNG | 等待包括格内子图片在内的资源解码后绘制；支持混合字体与格内子组件 |
| Word | 兼容 HTML `.doc`（不是 `.docx`） |
| 图片预算 | `maxImageBytes / maxTotalImageBytes / maxImages / maxImagePixels` 等，超限始终失败 |

渲染树统一拒绝循环引用、超过 64 层嵌套或 100 万个组件；`diagnostics` 提供稳定错误码与页/组件位置。

## 深入阅读

- 场景代码见[场景示例](./recipes)；
- 仓库完整文档：[API](https://github.com/ChenyCHENYU/MachReport/blob/main/docs/API.md) · [交互](https://github.com/ChenyCHENYU/MachReport/blob/main/docs/INTERACTION.md) · [单元格编辑](https://github.com/ChenyCHENYU/MachReport/blob/main/docs/CELL_EDITING.md) · [服务端](https://github.com/ChenyCHENYU/MachReport/blob/main/docs/SERVER.md) · [API 稳定性](https://github.com/ChenyCHENYU/MachReport/blob/main/docs/API_STABILITY.md)。
