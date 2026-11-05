---
description: "MachTable 高频场景食谱：服务端分页与跨页选择（useMachTableQuery）、单元格/整行编辑与批量保存冲突、树形懒加载、分组聚合、主从明细嵌套子表、XLSX 导入导出、状态持久化…"
---

# 场景示例

<AuthorTag :authors="['CHENY']" />

[[toc]]

> 适用于 <NpmVersion pkg="@agile-team/mach-table" fallback="0.38.0" />。以下食谱按使用频率精选；仓库 [docs/recipes](https://github.com/ChenyCHENYU/MachTable/tree/main/docs/recipes) 有 30+ 个完整场景。

## ① 服务端分页、排序与跨页选择

`useMachTableQuery`（`/workflows` 子入口）把 B 端列表最容易重复出错的部分收拢为一个类型安全控制器：请求分页、服务端排序/过滤、请求取消、乱序响应保护、加载/错误状态和跨页选择。

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { selectionColumn, type ColDef } from "@agile-team/mach-table-vue";
import { useMachTableQuery } from "@agile-team/mach-table-vue/workflows";

interface Order { orderId: string; customer: string; amount: number }

const query = reactive({ keyword: "", status: "" });
const table = useMachTableQuery<Order, typeof query>({
  query,
  rowKey: "orderId",
  pageSize: 20,
  pageSizeOptions: [20, 50, 100, 200],
  debounceMs: 200,
  selectionScope: "preserve",        // 跨页保留选择
  request: async ({ page, pageSize, query, sortModel, filterModel, advancedFilterModel, signal }) => {
    const response = await orderApi.page({
      ...query, page, size: pageSize,
      sort: sortModel, filters: filterModel, expression: advancedFilterModel
    }, { signal });
    return { rows: response.records, total: response.total };
  },
  onError: (error) => telemetry.captureException(error)
});

const { bindings, error, retry } = table;

const columns: ColDef<Order>[] = [
  selectionColumn(),
  { field: "orderId", headerName: "订单号", pinned: "left" },
  { field: "customer", headerName: "客户", flex: 1 },
  { field: "amount", headerName: "金额", type: "money" }
];
</script>

<template>
  <MachTable preset="list" v-bind="bindings" :column-defs="columns">
    <template #empty>
      <AppError v-if="error" :error="error" @retry="retry" />
      <AppEmpty v-else description="暂无订单" />
    </template>
  </MachTable>
</template>
```

要点：

- 默认 `mode: "auto"`（筛选即时请求）；表单页用 `mode: "manual"` + 显式 `table.reload({ resetPage: true })`；
- 新查询自动中止旧请求；即使请求库忽略 `AbortSignal`，晚到的旧响应也不会覆盖新数据；
- `retry()` 重放失败状态；`reset()` 清空表格排序/过滤并回第一页；
- 百万级"全选当前查询"用 `selectionScope: "query"`：`table.selectAllMatching()` 后 `table.selectionState.value` 是紧凑规则 `{ mode: "allMatching", excludedKeys: [...] }`，直接提交给批量接口，不下载全部 ID。

不使用 Vue composable 时，Core 受控服务端分页：

```ts
pagination: { mode: "server", page: 3, pageSize: 20, total: 1280 }
```

## ② 单元格与整行编辑

| 进入编辑 | 配置 |
| --- | --- |
| 双击（默认）/ Enter / F2 | 列 `editable: true` |
| 单击 | 全局或列级 `singleClickEdit: true` |
| 编程式 | `api.editing.startCell({ rowIndex: 0, colId: "name" })` |

校验返回字符串即拦截（红框 + 不落库 + 不发事件），支持异步服务端规则：

```ts
const columns = [
  {
    field: "score", headerName: "评分", editable: true,
    validate: (value) =>
      typeof value === "number" && value >= 0 && value <= 100 ? true : "请输入 0-100"
  },
  {
    field: "code", headerName: "编码", editable: true,
    validate: async (value) => {
      const available = await businessApi.checkCode(value);
      return available ? true : "编码已存在";
    }
  },
  {
    field: "price", headerName: "单价", editable: true,
    valueSetter: (p) => {
      if (p.newValue < 0) return false;        // 返回 false = 未变更
      p.data.price = p.newValue;
      p.data.total = p.data.qty * p.newValue;  // 联动其他字段
      return true;
    }
  }
];
```

整行编辑（`editType: "fullRow"`）暂存整行草稿、全部校验通过后事务式写入，任意字段失败整行保持编辑；跨字段规则用 `rowEditValidator`（可返回 `{ [colId]: message }` 同时标红多个字段）：

```ts
editType: "fullRow",
rowEditValidator: async ({ values, data }) => {
  if (new Date(String(values.startAt)) > new Date(String(values.endAt))) {
    return { startAt: "开始时间不能晚于结束时间", endAt: "请调整时间范围" };
  }
  return (await permissionApi.canEdit(data.id)) ? true : "当前记录已被锁定";
}
```

## ③ 脏数据、批量保存与版本冲突

成功写值自动进入变更跟踪，无需业务层另建 diff：

```ts
const result = await api.editing.save(async (changes) => {
  const response = await orderApi.saveBatch(changes);
  return {
    savedRowIds: response.savedIds,   // 部分成功：只确认成功行，失败行保持脏
    failures: response.failures,      // [{ rowId, code, message, colIds, retryable }]
    conflicts: response.conflicts     // [{ rowId, code, serverData, serverVersion }]
  };
});
```

- 保存以稳定快照为边界：请求期间用户继续编辑产生的新改动不会被旧请求误清除；
- 乐观锁冲突必须显式选择：`resolveSaveConflict(api, conflict, "acceptServer" | "keepLocal")`；
- Vue/React 用 `useMachTableEditing(table, { guardBeforeUnload: true })`：模板直接绑定 `edit.dirty/saving/saveError/failedRowIds`，`edit.reveal(rowId, colId)` 定位失败单元格。

## ④ 分组聚合与树形数据

任意列声明 `rowGroup: true` 即分组（多列 = 多级），`aggFunc` 列自动聚合：

```ts
createGrid(host, {
  columnDefs: [
    { field: "workshop", headerName: "车间", rowGroup: true },   // 一级
    { field: "line", headerName: "产线", rowGroup: true },       // 二级
    { field: "product", headerName: "产品" },
    { field: "output", headerName: "产量", aggFunc: "sum" },
    { field: "rate", headerName: "合格率", aggFunc: "avg" }
  ],
  aggFuncs: { p90: (values) => quantile(values, 0.9) },  // 自定义聚合
  rowData
});
```

树形数据：`treeData: true` + 嵌套 `children` 字段；过滤命中子树自动保留祖先链，排序仅同级兄弟间，勾选父行级联子孙（父复选框三态）。懒加载子节点用可取消的 `loadTreeChildren`：

```ts
createGrid(host, {
  treeData: true,
  rowKey: "id",                       // 树形必须提供稳定 id
  isTreeRowExpandable: (p) => p.data.hasChildren,
  loadTreeChildren: async ({ data, signal }) => {
    const rows = await orgApi.children(data.id, { signal });
    return rows;
  },
  columnDefs: [{ field: "name", headerName: "名称" }, { field: "qty", headerName: "数量" }]
});
```

> `treeData` 与 `rowGroup` / `masterDetail` 不支持同时启用；树形 + 无限滚动不支持。

## ⑤ 主从明细（嵌套子表格）

```ts
import { createGrid } from "@agile-team/mach-table";

createGrid(host, {
  masterDetail: true,
  detailRowHeight: 260,
  detailToggleColumn: true,   // 自动插入左侧 ▶ 展开列
  columnDefs: [
    { field: "orderNo", headerName: "订单号", width: 140 },
    { field: "customer", headerName: "客户", flex: 1 }
  ],
  rowData: orders,
  rowKey: "id",
  // 推荐返回 { el, destroy }：明细行被虚拟滚动回收时保证释放嵌套表格
  detailRowRenderer: (params) => {
    const hostEl = document.createElement("div");
    hostEl.style.height = "100%";
    const childApi = createGrid<OrderItem>(hostEl, {
      columnDefs: [
        { field: "sku", headerName: "物料", width: 120 },
        { field: "qty", headerName: "数量", width: 90 }
      ],
      rowData: params.data.items,
      size: "compact"
    });
    return { el: hostEl, destroy: () => childApi.destroy() };
  }
});

// Vue 组件作明细：vueDetailRenderer(OrderDetailPanel)（/adapters 入口）
```

## ⑥ XLSX 导入导出（可选扩展）

XLSX 不进 Core、不随适配包下载；只有需要 Excel 的页面安装并动态导入：

```bash
pnpm add @agile-team/mach-table-xlsx xlsx
```

```ts
import { createXlsxExtension } from "@agile-team/mach-table-xlsx";

const excel = createXlsxExtension(() => import("xlsx"));

await excel.export(api, { fileName: "订单明细.xlsx", sheetName: "订单", onlySelected: false });

const file = input.files?.[0];
if (file) {
  await excel.import(api, await file.arrayBuffer(), {
    sheet: 0,
    mode: "replace",      // replace | append | paste
    headerRowIndex: 0,
    coerceNumbers: true   // 前导零与超安全整数编号保留字符串
  });
}
```

- 导出走 `api.io.exportMatrix({ target: "xlsx" })`，保留 number/boolean/Date 类型，默认公式注入防护；
- 扩展只转换浏览器已加载的数据——服务端分页的全量导出走服务端接口，不要依赖本地桥接；
- 每次矩阵装载上限 10000 数据行 / 100000 单元格；`columns` 可按矩阵顺序指定目标列。

## ⑦ 列状态与偏好持久化

```ts
createGrid(host, {
  persistence: {
    key: "tenant:user:orders",     // 含应用/租户/用户/场景，避免身份间共享
    sections: ["columns"],          // 只保存列偏好；也可含 sort/filter/pagination/selection/expansion
    debounceMs: 160
  },
  columnDefs,
  rowData
});

const state = api.state.get();       // 版本化 GridState 快照
api.state.apply(state, { sections: ["columns", "sort"] });
```

未提供 `store` 时使用安全的 localStorage；可接后端或 IndexedDB（实现 `GridStateStore`）。

## ⑧ 高级过滤与快速搜索

```ts
// 跨列快速搜索（工具栏搜索框绑定）
api.filtering.setQuickText("pending");

// 可序列化 AND/OR/NOT 表达式树（可存后端、可恢复）
await api.filtering.setAdvancedModel({
  op: "and",
  children: [
    { field: "status", op: "eq", value: "pending" },
    { field: "amount", op: "gt", value: 10000 }
  ]
});
```

## 更多食谱

仓库 [docs/recipes](https://github.com/ChenyCHENYU/MachTable/tree/main/docs/recipes) 另有：范围选择与填充柄、复制粘贴、列工作台、保存视图（saved views）、schema 驱动列、固定行、无限滚动、随机块数据源、可变行高、撤销重做、导入预览、行外观、水印、企业偏好等 30+ 个完整场景。
