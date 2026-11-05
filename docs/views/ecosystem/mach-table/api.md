---
description: "MachTable API 速查：GridOptions 统一配置契约（数据/布局/列交互/编辑/树分组/分页远程/持久化/安全）、ColDef 列定义、GridApi 12 领域命令与 Events 事件双通道…"
---

# API 参考

<AuthorTag :authors="['CHENY']" />

[[toc]]

> 适用于 <NpmVersion pkg="@agile-team/mach-table" fallback="0.38.0" />。`GridOptions<TData>` 是 Core、Vue 与 React 的统一配置契约：Vue 模板使用 kebab-case，React/TypeScript 使用 camelCase。建议用 `defineGridOptions<T>()` 或 `satisfies GridOptions<T>` 保留完整类型推断。

```ts
const options = defineGridOptions<Order>({
  rowKey: "id",
  columnDefs,
  rowData,
  columnLayout: "fit"
});
```

## GridOptions — 数据与身份

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `columnDefs` | `(ColDef<T> \| ColDefGroup<T>)[] \| null` | `[]` | 列与分组表头定义 |
| `rowData` | `T[] \| null` | `[]` | 本地行数据；与 `datasource` 不同时使用 |
| `rowKey` | `FieldPath<T> \| (row: T) => string \| number` | 自动 ID | 稳定业务主键；编辑、选择保持、事务、树和远程数据强烈建议提供 |
| `rowNumber` | `boolean` | Vue/React `true`，Core `false` | 列加载后自动显示序号 |
| `defaultColDef` | `Partial<ColDef<T>>` | 内置默认列 | 全列默认值 |
| `columnTypes` | `Record<string, Partial<ColDef<T>>>` | `{}` | 通过 `colDef.type` 复用的语义列类型 |
| `initialState` | `GridState` | — | 列与首批数据就绪后原子恢复的 v2 状态 |

`rowKey` 支持点路径和派生函数，返回值必须稳定、非空且全数据集唯一：

```ts
rowKey: "identity.id";
// 或
rowKey: (row) => `${row.tenantId}:${row.id}`;
```

## GridOptions — 布局、主题与密度

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `size` | `"compact" \| "normal" \| "large"` | `"normal"` | 联动字号、行高和间距 |
| `theme` | `"light" \| "dark" \| "auto"` | `"light"` | 明暗主题；`auto` 跟随系统 |
| `rowHeight` / `headerHeight` | `number` | 随密度 | 行高/单层表头高度 |
| `getRowHeight` | `(params) => number` | — | 可变行高 |
| `rowBuffer` | `number` | `8` | 视口上下预渲染行数 |
| `columnLayout` | `"normal" \| "fit"` | `"normal"` | `fit` 持续填满容器 |
| `enableColumnResize` | `boolean` | `false` | 开启鼠标、触控、双击和键盘列宽调整 |
| `domLayout` | `"normal" \| "autoHeight"` | `"normal"` | 自动高度只用于小型本地表（不能与 `datasource` 混用） |
| `rowStyleRules` | `readonly RowStyleRule<T>[]` | `[]` | 条件整行颜色，首条命中 |
| `stripedRows` | `boolean` | `false` | 斑马纹 |
| `showCellBorders` | `boolean` | `false` | 纵向单元格边框 |

默认虚拟布局的宿主必须有明确高度；空态/加载态/错误态预留 180px 最小展示空间（`--mach-overlay-min-height` 可覆盖）。

## GridOptions — 列交互

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `columnMenu` | `boolean` | `false` | 表头排序、固定、宽度和显隐菜单 |
| `multiSort` | `boolean` | `true` | Shift 叠加多列排序 |
| `manualSorting` | `boolean` | `false` | 只更新排序模型和事件，由服务端执行 |
| `manualFiltering` | `boolean` | `false` | 只更新过滤模型和事件，由服务端执行 |
| `quickFilterText` | `string \| null` | `null` | 跨列快速搜索 |
| `advancedFilterModel` | `AdvancedFilterModel \| null` | `null` | 可序列化 AND/OR/NOT 表达式树 |
| `aggFuncs` | `Record<string, (values) => unknown>` | 内置函数 | 自定义聚合函数 |

## GridOptions — 选择、编辑和剪贴板

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `rowSelection` | `"none" \| "single" \| "multiple"` | `"none"` | 行选择模式 |
| `editType` | `"cell" \| "fullRow"` | `"cell"` | 单元格或原子整行编辑 |
| `editableIndicator` | `"hover" \| "always" \| "none"` | `"hover"` | 可编辑铅笔提示策略 |
| `singleClickEdit` | `boolean` | `false` | 单击开始编辑 |
| `rowEditValidator` | `(params) => result \| Promise<result>` | — | 整行跨字段校验 |
| `undoStackSize` | `number` | `100` | 撤销栈容量；`0` 关闭 |
| `enableRangeSelection` | `boolean` | `false` | Excel 式单元格范围 |
| `fillHandle` | `boolean` | `true` | 范围填充柄 |
| `suppressClipboard` | `boolean` | `false` | 禁用复制、剪切和粘贴 |
| `contextMenu` | `boolean` | `false` | 内置右键菜单 |
| `getContextMenuItems` | `(params) => items \| null` | 内置项 | 自定义菜单 |
| `flashCells` | `boolean` | `true` | 值变化后的短暂高亮 |

## GridOptions — 树、分组、详情和固定行

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `treeData` | `boolean` | `false` | 树数据模式（与 `rowGroup`/`masterDetail` 互斥） |
| `childrenKey` | `string` | `"children"` | 本地子节点字段 |
| `isTreeRowExpandable` | `(params) => boolean` | — | 标记可远程展开节点 |
| `loadTreeChildren` | `async ({ data, node, api, signal }) => rows` | — | 可取消、去重的懒加载 |
| `autoCheckedChildren` | `boolean` | `true` | 树选择父子联动 |
| `defaultExpandAll` | `boolean` | `false` | 初始展开全部 |
| `masterDetail` | `boolean` | `false` | 主从详情 |
| `detailRowHeight` | `number` | `240` | 详情行高度 |
| `detailRowRenderer` | `(params) => RenderOutput` | — | 详情 renderer |
| `isRowExpandable` | `(params) => boolean` | 全部 | 详情行展开条件 |
| `detailToggleColumn` | `boolean` | `true` | 自动详情展开列 |
| `applyRowDrag` | `boolean` | `true` | 行拖动后自动应用重排 |
| `pinnedTopRowData` / `pinnedBottomRowData` | `T[] \| null` | `[]` | 顶部/底部固定行 |

## GridOptions — 分页与远程数据

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `pagination` | `boolean \| PaginationConfig` | `true` | 默认客户端分页每页 20 条；`datasource` 无限模式自动关闭 |
| `datasource` | `GridDatasource<T>` | — | 无限/随机访问数据源 |
| `datasourceMode` | `"sequential" \| "block"` | `"sequential"` | 顺序追加或随机块模型 |
| `blockSize` | `number` | `100` | 每块行数 |
| `infiniteBufferRows` | `number` | `40` | 顺序模式预取阈值 |
| `maxBlocksInCache` | `number` | `12` | 随机块 LRU 容量 |
| `datasourceMaxConcurrentRequests` | `number` | `4` | 活动请求上限 |
| `blockPrefetch` | `number` | `1` | 相邻块预取半径 |
| `datasourceRowCount` | `number` | — | 首次响应前的已知总量 |
| `datasourceRetryCount` / `RetryDelay` / `RetryJitter` | `number` | `2` / `300` / `0.15` | 自动重试次数/首退避毫秒/抖动比例 |
| `asyncTransactionWaitMillis` | `number` | `16` | 异步事务合并窗口 |
| `dataProcessor` | `GridDataProcessor<T> \| (() => GridDataProcessor<T>)` | — | 单表独占异步过滤/排序处理器（≥ `dataProcessorMinRows` 默认 5000 行才启用） |

普通 B 端请求分页优先使用适配包 `/workflows` 的 `useMachTableQuery()`；百万级可跳转长列表再选 `datasourceMode: "block"`。

## GridOptions — 状态持久化与呈现

```ts
interface GridPersistenceOptions {
  key: string; // 应包含应用、租户、用户和表格场景
  sections?: readonly ("columns" | "sort" | "filter" | "pagination" | "selection" | "expansion")[];
  store?: GridStateStore; // 默认安全的 localStorage，可接后端/IndexedDB
  debounceMs?: number; // 默认 160
}
```

| 配置 | 默认值 | 说明 |
| --- | --- | --- |
| `persistence` | `false` | 自动加载并保存 v2 GridState；`sections: ["columns"]` 仅保存列偏好 |
| `initialState` | — | 首屏恢复，不自动保存 |
| `loading` / `error` | `false` / `null` | 加载/错误覆盖层（error 优先于空状态） |
| `overlayLoadingTemplate` / `overlayNoRowsTemplate` / `overlayErrorTemplate` | 内置 | 文本、HTMLElement 或工厂；字符串默认纯文本渲染 |
| `watermark` | `false` | Canvas 平铺水印 |
| `showSummary` / `summaryMethod` | `false` | 底部合计行与每列合计文本 |
| `statusBar` | `false` | 行数、选择数和范围聚合状态栏 |
| `locale` | 中文 | 文案覆盖；提供 `LOCALE_EN` |
| `components` / `features` | `{}` / `[]` | 实例级 renderer/editor 注册表与扩展 |
| `actionPolicy` | — | 操作列权限、确认和异常策略 |
| `suppressCellFocus` / `suppressHeaderFocus` | `false` | 关闭相应键盘焦点 |

## ColDef — 列定义

### 标识、标题与宽度

| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `colId` | `string` | `field` 或 `col_{i}` | 列唯一标识（排序/过滤/列状态都以它为键） |
| `field` | `string` | — | 数据取值字段，支持点路径 `a.b.c` |
| `headerName` | `string` | `field` | 表头文本 |
| `align` / `headerAlign` | `"left" \| "center" \| "right"` | `"center"` | 单元格/表头对齐 |
| `width` | `number` | 内容测宽 | 显式首选宽度 px |
| `autoWidth` | `boolean` | `true` | 未声明 width 时按内容抽样测宽（每列最多 100 行，默认 80–360px） |
| `minWidth` / `maxWidth` | `number` | `80` / 360 | 边界；表头完整展示不受限 |
| `flex` | `number` | `0` | 弹性权重：容器有余量时按权重分配 |
| `pinned` | `"left" \| "right" \| boolean` | — | 固定列；`true` 等价 `"left"` |
| `hide` | `boolean` | `false` | 初始隐藏 |

### 交互开关

| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `sortable` | `boolean` | `true` | 点击表头排序（asc → desc → 无） |
| `resizable` | `boolean` | `true` | 需表格级 `enableColumnResize: true` 才生效 |
| `movable` | `boolean` | `true` | 拖拽表头换位 |
| `filter` | `boolean \| "text" \| "number" \| "date" \| "set"` | `false` | 过滤器类型；`true` 等价 `"text"`，过滤摘要自动显示为表头 tag |
| `filterParams` | `{ values?, maxValues? }` | — | set 过滤器候选值；默认从数据派生（上限 500） |

### 值与渲染

| 属性 | 说明 |
| --- | --- |
| `valueGetter` | 取值（替代 field）；排序/过滤/导出一致使用 |
| `valueFormatter` | 显示格式化；返回非字符串自动 `String()` |
| `valueSetter` | 写值（编辑/粘贴/填充/撤销统一入口）；返回是否变更 |
| `valueParser` / `valueSerializer` | 同步规范输入值 / 决定剪贴板、CSV 与 XLSX 的输出值（`target: "clipboard" \| "csv" \| "xlsx"`） |
| `status` | `true` 用默认状态色；映射 `{ label, color }` 支持语义色（success/warning/danger/info/neutral）或 CSS 色 |
| `cellRenderer` | 函数返回 `string \| HTMLElement \| { el, destroy }`，或字符串查注册表（内置 `statusTag`/`progressBar`/`link`） |
| `cellRendererParams` | 渲染器参数通道 |
| `cellClass` / `cellStyle` | 附加类名 / 动态行内样式（条件标红等） |
| `tooltipValueGetter` | 覆盖默认 title |
| `wrapText` / `autoHeight` | 换行 / 内容驱动行高（canvas 测量，仅首帧） |
| `type` | 从全局 `columnTypes` 解析语义类型，可叠加 |

```ts
const columns = [
  { field: "customer", headerName: "客户", maxWidth: 280 },
  { field: "status", headerName: "状态", status: true },
  { field: "planStatus", headerName: "计划状态", status: {
    S1B: { label: "待复核", color: "danger" },
    S1C: { label: "已完成", color: "success" }
  } }
];
```

### 编辑与行

| 属性 | 说明 |
| --- | --- |
| `editable` | `boolean \| (p) => boolean`；粘贴/填充/Delete 只写可编辑格 |
| `cellEditor` | `"text" \| "number" \| "date" \| "select"`、工厂函数或注册名；内置按值类型自动推断 |
| `cellEditorParams` | select 选项：`{ values }` 或 `{ options: [{ label, value }] }` |
| `validate` | 返回字符串时显示错误并拒绝写入；支持异步（唯一性/库存/权限等服务端规则） |
| `checkboxSelection` | 复选框列（单选模式呈 radio） |
| `selectable` | 行级禁选；全选/分组级联自动跳过 |
| `rowDrag` | 行拖拽手柄列 |
| `rowGroup` | 作为分组字段（多列多级） |
| `aggFunc` | `sum/avg/count/min/max/first/last` 或 `aggFuncs` 注册的自定义 |
| `autoRowSpan` / `rowSpan` / `colSpan` | 自动合并连续相同值 / 回调式跨行 / 跨列 |
| `initialSort` | `"asc" \| "desc"` 初始排序 |
| `onCellClick` / `onCellDoubleClick` | 列级单元格事件 |

### ColDefGroup（多级表头）

```ts
{
  headerName: "业务信息",
  children: [
    { field: "name", headerName: "名称" },
    { headerName: "指标", children: [{ field: "score", headerName: "分数" }] } // 任意嵌套
  ]
}
```

表头行数自动 = 最大嵌套深度；叶子列交互不受分组影响；列状态按 `colId` 保留。

## GridApi — 12 个领域化命令

`createGrid()`、Vue/React 的 `useMachTable()` 返回同一套 API。根级只负责生命周期、配置、事件和批处理；API 与各领域对象均被冻结。

### 根级

| 方法 | 说明 |
| --- | --- |
| `batch(callback)` | 合并回调内的模型、布局和渲染更新；嵌套安全 |
| `whenReady()` | 首次布局和 `gridReady` 后返回当前 API |
| `getOption(key)` / `updateOptions(patch)` | 读取合并后当前值 / 原子校验并更新配置 |
| `on(event, listener)` | 订阅事件并返回解除函数 |
| `destroy()` / `isDestroyed()` | 释放全部资源 / 查询销毁状态 |

### `api.rows`

| 方法 | 说明 |
| --- | --- |
| `setData(rows)` | 全量替换本地数据；稳定 `rowKey` 保留选择语义 |
| `transact({ add?, addIndex?, remove?, update? })` | 同步增量事务 |
| `transactAsync(transaction, { signal? })` / `flushTransactions()` | 异步事务队列 / 立即提交 |
| `getCount()` / `getAt(index)` / `getById(id)` | 行数 / 按展示索引 / 按稳定 ID 取 RowNode |
| `forEach(callback)` / `forEachDisplayed(callback)` | 遍历全部 / 过滤排序后的展示行 |
| `reorder(fromIndex, toIndex)` | 本地行重排 |
| `isRemote()` / `reload({ signal? })` | 是否远程 / 重载远程数据 |
| `ensureLoaded(start, end)` / `purgeCache()` / `getCacheSnapshot()` | 随机块区间加载 / 清缓存 / 缓存诊断 |

### `api.columns`

| 方法 | 说明 |
| --- | --- |
| `getDefinitions()` / `setDefinitions(defs)` | 读取或替换列定义 |
| `getState()` / `setState(state)` / `resetState()` | 列状态快照、恢复和重置 |
| `setVisible(colId, visible)` / `setPinned(colId, side)` / `move(colId, toIndex)` / `setWidth(colId, width)` | 显隐 / 固定 / 顺序 / 程序化列宽（不受 `enableColumnResize` 限制） |
| `fit(width?)` / `autoSize(colId)` / `autoSizeAll()` | 缩放 / 按内容自动宽度 |
| `openWorkbench(anchor?)` / `closeWorkbench()` / `getWorkbenchItems()` | 内置列工作台 |

### `api.selection`

| 方法 | 说明 |
| --- | --- |
| `getRows()` / `getNodes()` / `getIds()` / `getVisibleRows()` | 已选行、节点、ID、可见已选行 |
| `setRows(rows, clearOthers?)` / `setById(id, selected?, clearOthers?)` | 设置选择 |
| `selectAll(filteredOnly?)` / `clear()` | 全选（可仅过滤结果）/ 清空 |
| `getMode()` / `setMode(mode)` | 单选、多选或关闭 |
| `getRange()` / `clearRange()` | 单元格范围选择 |

远程"全选全部查询结果"由 `/workflows` 的 `useMachTableQuery()` 表达为 `allMatching + excludedKeys`，不会要求客户端加载全部 ID。

### `api.editing`

| 方法 | 说明 |
| --- | --- |
| `startCell({ rowIndex, colId, keyPress? })` / `startRow(rowIndex)` | 开始单元格 / 原子整行编辑 |
| `isRowActive(rowIndex?)` / `stop({ cancel? })` | 编辑中判断 / 异步提交或取消 |
| `getChanges()` / `getDirtyRowIds()` | 待保存变更 / 脏行 ID |
| `markSaved(rowIds?)` / `rollback(rowIds?)` | 确认变更 / 回滚脏行 |
| `save(handler, rowIds?)` | 快照化保存，返回 `submitted/saved/failures/conflicts` 明细 |
| `undo()` / `redo()` / `canUndo()` / `canRedo()` | 撤销重做 |

### 其余领域

| 领域 | 关键方法 |
| --- | --- |
| `api.filtering` | `getModel()/setModel()`、`getAdvancedModel()/setAdvancedModel()`、`getQuickText()/setQuickText()`、`isPresent(colId?)` |
| `api.sorting` | `getModel()` / `setModel()` |
| `api.pagination` | `isEnabled()/setEnabled()`、`getPage()/setPage()`、`getPageSize()/setPageSize()`、`getPageCount()`、`getTotalRowCount()` |
| `api.hierarchy` | `isRowExpanded/setRowExpanded`、`isTreeRowLoading`、`loadTreeChildren(id, { force? })`、`isGroupExpanded/setGroupExpanded`、`setAllGroupsExpanded`、`setAllDetailsExpanded` |
| `api.view` | `getRoot()`、`scrollToRow(index, position?)`、`refreshCells(params?)`、`refreshLayout()`、`flush()`、`setOverlay(...)`、`getPinnedRows/setPinnedRows` |
| `api.state` | `get()` 获取版本化 GridState；`apply(state, { sections?, emitEvents? })` 原子恢复 |
| `api.io` | `exportCsv(params?)`（默认防公式注入）、`exportMatrix(params?)`（保留原始值类型）、`importCsv(text, options?)`、`importMatrix(rows, options?)`、`print()`、`copyRange()` |
| `api.diagnostics` | `get()`、`getPerformance()`、`resetPerformance()`——开发/测试/遥测用，不驱动业务状态 |

导入限制：每次矩阵装载最多 **10000 数据行、100000 单元格**（含表头），不静默截断；`mode` 支持 `"replace" | "append" | "paste"`，paste 复用交互校验与撤销管线。

## Events — 事件双通道

事件双通道：`options.onXxx` 回调与 `api.on(type, fn)`（返回取消函数）；Vue 模板用 kebab-case（`@cell-value-changed`）。所有事件对象都含 `type` 与 `api`。

### 生命周期与错误

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `gridReady` | `api` | grid 可交互 |
| `gridDestroyed` | — | `destroy()` 执行时触发 |
| `modelUpdated` | `rowCount` | 数据管道刷新后 |
| `gridError` | `code, error, source, context?` | 用户回调/数据源/持久化抛错时隔离上报；`code` 为稳定错误码（`DATA_SOURCE_ERROR`/`VALIDATION_ERROR`/`RENDERER_ERROR` 等），业务监控按 `code` 聚合 |

### 交互事件

| 分类 | 事件 | 载荷要点 |
| --- | --- | --- |
| 单元格/行 | `cellClicked` `cellDoubleClicked` `cellContextMenu` `rowClicked` `rowDoubleClicked` | `event, rowNode, rowIndex, column, colDef, value` |
| 选择 | `selectionChanged` | `selectedNodes, selectedRows`——树形级联、分组级联、API 设置均触发一次 |
| 排序/过滤 | `sortChanged` `filterChanged` | `sortModel` / `filterModel + advancedFilterModel` |
| 列 | `columnResized` `columnMoved` `columnVisibilityChanged` `displayedColumnsChanged` | 拖拽帧 `finished: false`，松手/API 提交 `true`；自动持久化只响应完成事件 |
| 编辑 | `cellEditingStarted/Stopped` `rowEditingStarted/Stopped` `cellValueChanged` `dirtyStateChanged` | `cellValueChanged` 是编辑/粘贴/填充/清除/剪切/undo/redo 的**统一写值事件** |
| 范围与拖拽 | `rangeSelectionChanged` `rowDragEnd` | 框选范围 / 行移动（`applied` 标识是否已应用） |
| 树与明细 | `detailToggled` `treeChildrenLoaded` `treeChildrenLoadFailed` | 展开状态；懒加载成功含 `children`，失败同时进 `gridError` |
| 分页 | `paginationChanged` | `page, pageSize, pageCount, total` |

```ts
// 方式一：options 回调
createGrid(host, {
  onSelectionChanged: (e) => saveDraft(e.selectedRows),
  onCellValueChanged: (e) => audit(e.colDef.field, e.oldValue, e.newValue)
});

// 方式二：api.on（返回取消函数）
const off = api.on("rangeSelectionChanged", (e) => console.log("框选", e.range));
off();
```

## 深入阅读

- 场景代码见[场景示例](./recipes)；
- 仓库完整文档：[GridOptions](https://github.com/ChenyCHENYU/MachTable/blob/main/docs/api/grid-options.md) · [ColDef](https://github.com/ChenyCHENYU/MachTable/blob/main/docs/api/col-def.md) · [GridApi](https://github.com/ChenyCHENYU/MachTable/blob/main/docs/api/grid-api.md) · [Events](https://github.com/ChenyCHENYU/MachTable/blob/main/docs/api/events.md) · [Exports](https://github.com/ChenyCHENYU/MachTable/blob/main/docs/api/exports.md)。
