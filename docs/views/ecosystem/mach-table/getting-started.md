---
description: "MachTable 安装与接入：Vue 3 / React 18+ / 原生 Core 三种宿主的安装矩阵与最小示例、四条接入约定、配置中心 defaults/presets、useMachTable 句柄与按需子入口…"
---

# 快速上手

<AuthorTag :authors="['CHENY']" />

[[toc]]

> 适用于 <NpmVersion pkg="@agile-team/mach-table" fallback="0.38.0" />。Vue/React 项目优先使用官方适配包；只有无框架或自研框架宿主才直接安装 Core。适配包会自动安装 Core，不需要写两个依赖。

```bash
pnpm add @agile-team/mach-table-vue     # Vue 3（≥ 3.2）
pnpm add @agile-team/mach-table-react   # React 18+
pnpm add @agile-team/mach-table         # 原生 TypeScript / JS
```

## 四条接入约定

1. 默认虚拟布局的容器必须有明确高度，例如 `height: 600px`、`flex: 1` 或 `calc(...)`；
2. 主题 CSS 必须在应用入口引入一次；
3. 生产表格应提供稳定唯一的 `rowKey`——简单字段传路径，派生规则传函数；
4. 原生宿主卸载时调用 `api.destroy()`；Vue/React 适配器会自动销毁。

## 原生 TypeScript 最小示例

```html
<div id="grid" style="height: 600px"></div>
```

```ts
import { createGrid, type ColDef } from "@agile-team/mach-table";
import "@agile-team/mach-table/styles/mach-table.css";

interface Machine {
  id: string;
  code: string;
  status: "运行中" | "待机" | "故障";
  temperature: number;
}

const columnDefs: ColDef<Machine>[] = [
  { colId: "select", width: 46, checkboxSelection: true, pinned: "left" },
  { field: "code", headerName: "设备编号", width: 130, pinned: "left", filter: "text" },
  { field: "status", headerName: "状态", width: 110, filter: "set" },
  {
    field: "temperature",
    headerName: "温度",
    width: 110,
    filter: "number",
    align: "right",
    valueFormatter: ({ value }) => `${value} ℃`
  }
];

const api = createGrid<Machine>(document.querySelector("#grid")!, {
  columnDefs,
  rowData: machines,
  rowKey: "id",
  rowSelection: "multiple",
  stripedRows: true
});

// 常用操作
api.rows.setData(nextRows);                  // 全量替换
api.rows.transact({ update: [changedRow] }); // 增量事务
const selected = api.selection.getRows();    // 已选行
const csv = api.io.exportCsv({ prependBOM: true });
api.view.refreshLayout();                    // 弹窗/隐藏容器可见后重测
```

## Vue 3 接入

`@agile-team/mach-table-vue` 要求 Vue ≥ 3.2。规范组件名只有 `<MachTable>`。

```ts
// main.ts：只引入一次
import "@agile-team/mach-table-vue/styles.css";
```

### 三种接入模式

| 模式 | 适用 | 要点 |
|------|------|------|
| 局部导入 | 少量路由使用 | 页面正常 import；路由懒加载时表格自然进入路由 chunk |
| 同步全局插件 | 大多数页面使用 | `app.use(MachTablePlugin, config)` 注册一次 |
| 异步全局插件 | 中后台平台保持首屏轻量 | `import AsyncMachTablePlugin from ".../async"`，首次渲染才加载组件与 Core |

```ts
// 异步全局插件（样式仍应同步引入，避免首次无样式闪烁）
import AsyncMachTablePlugin, { preloadMachTable } from "@agile-team/mach-table-vue/async";

app.use(AsyncMachTablePlugin, {
  asyncComponentOptions: { delay: 120, timeout: 15_000 }
});

// 可选：路由 hover 时预取；重复调用安全
void preloadMachTable();
```

### 页面用法与 `useMachTable()`

```vue
<script setup lang="ts">
import { h } from "vue";
import { MachTable, defineVueColumns, defineVueTableConfig, useMachTable } from "@agile-team/mach-table-vue";

interface Order { id: string; product: string; amount: number; status: "paid" | "pending" }

const table = useMachTable<Order>();
const columns = defineVueColumns<Order>([
  { field: "product", headerName: "产品", flex: 1, editable: true },
  { field: "amount", headerName: "金额", width: 140, filter: "number" },
  {
    field: "status",
    headerName: "状态",
    // Vue 业务列推荐自定义方式：可直接返回 h() VNode
    render: (row) => h("span", { class: `order-status--${row.status}` }, row.status === "paid" ? "已支付" : "待支付")
  }
]);
const tableConfig = defineVueTableConfig<Order>({ rowKey: "id", enableColumnResize: true, stripedRows: true });

function exportCsv() {
  table.api.value?.io.exportCsv({ prependBOM: true });
}
</script>

<template>
  <div style="height: 600px">
    <MachTable v-bind="tableConfig" :ref="table.ref" :column-defs="columns" :row-data="rows" />
  </div>
</template>
```

`useMachTable()` 返回：`ref`（绑定组件）、`api`（挂载后的响应式领域 API，卸载自动置空）、`ready`（首个布局帧完成后 `true`）。

### Props、事件与插槽

- 所有 `GridOptions` 都可作为 props，模板使用 kebab-case（如 `:column-defs`、`enable-column-resize`）；
- Core 事件以 Vue kebab-case 监听，如 `@selection-changed`、`@grid-error`；
- 组件暴露 `getApi()`、`getResolvedConfig()` 与 `explainOption()`；
- 插槽按 `colId`/`field` 匹配 `#cell-*`、`#header-*`、`#editor-*`；另有通用 `#cell/#header/#editor` 与 `#loading/#empty/#error/#detail/#actions`。

```vue
<MachTable :column-defs="columns" :row-data="rows" :loading="loading">
  <template #cell-status="{ value }">
    <ElTag :type="value === 'done' ? 'success' : 'warning'">{{ value }}</ElTag>
  </template>
  <template #editor-amount="{ value, setValue, commit, cancel }">
    <ElInputNumber :model-value="value" @update:model-value="setValue"
      @keyup.enter="commit" @keyup.esc="cancel" />
  </template>
  <template #empty><AppEmpty description="暂无订单" /></template>
</MachTable>
```

## React 18+ 接入

```tsx
import { useMemo } from "react";
import { MachTable, useMachTable, type ColDef } from "@agile-team/mach-table-react";
import "@agile-team/mach-table-react/styles.css";

export function Employees({ rows }: { rows: Employee[] }) {
  const table = useMachTable<Employee>();
  const columns = useMemo<ColDef<Employee>[]>(() => [
    { colId: "select", width: 46, checkboxSelection: true },
    { field: "name", headerName: "姓名", flex: 1, editable: true },
    { field: "salary", headerName: "薪资", width: 140, filter: "number", align: "right" }
  ], []);

  return (
    <div style={{ height: 600 }}>
      <MachTable<Employee>
        apiRef={table.apiRef}
        columnDefs={columns}
        rowData={rows}
        rowKey="id"
        rowSelection="multiple"
        enableColumnResize
        persistence={{ key: "tenant:user:employees" }}
        onSelectionChanged={(e) => console.log(e.selectedRows.length)}
      />
    </div>
  );
}
```

- `useMachTable()` 返回 `apiRef`（传给组件，不触发多余渲染）、`api`、`ready`；
- 应用配置用 `<MachTableProvider config={config}>`，可按路由/布局嵌套覆盖；
- 独立懒加载边界：`const MachTable = lazy(() => import("@agile-team/mach-table-react"))`；
- React 组件 renderer 从 `/adapters` 导入：`reactCellRenderer(SalaryCell)`。

## 配置中心（defaults / presets）

```ts
// src/config/mach-table.config.ts
import { defineMachTableConfig, defineMachTablePreset } from "@agile-team/mach-table-vue";

export default defineMachTableConfig({
  defaults: {
    size: "compact",
    columnLayout: "fit",
    enableColumnResize: true,
    defaultColDef: { sortable: true, filter: true, resizable: true }
  },
  defaultPreset: "list",
  presets: {
    list: defineMachTablePreset({ stripedRows: true }),
    crud: defineMachTablePreset({ rowSelection: "multiple", editType: "fullRow" })
  }
});
```

优先级：**应用配置 → 路由/布局叠加（`provideMachTableConfig`）→ 命名预设 → 当前表格 props**。Vue 侧响应式叠加：

```ts
provideMachTableConfig(() => ({ defaults: { theme: dark.value ? "dark" : "light" } }));
```

## 可选子入口

| 入口 | 内容 |
|------|------|
| `/workflows` | `useMachTableQuery`（服务端分页/取消/跨页选择）、`useMachTableEditing`（脏数据/部分成功/冲突）、`useMachTableController`（页面控制器） |
| `/ui` | `MachTableToolbar` 工具栏（需 `app.use(MachTableUiPlugin)` 全局注册） |
| `/adapters` | `vueCellRenderer` / `vueDetailRenderer`（React 同名 `react*`） |
| `/editors` | `vueCellEditor`、`createElementPlusEditors()` 工厂 |
| `/worker` | `createWorkerDataProcessor`——大型本地排序/过滤的 Worker 处理器 |

```ts
import { useMachTableController } from "@agile-team/mach-table-vue/workflows";

const controller = useMachTableController({
  config: tableConfig,
  loading,
  theme: () => (dark.value ? "dark" : "light"),
  onGridError: reportGridError
});
// 模板：<MachTable v-bind="controller.bindings.value" ... />
```

## 下一步

- [API 参考](./api)——GridOptions / ColDef / GridApi / Events；
- [场景示例](./recipes)——服务端分页、编辑保存、树形分组、导入导出；
- 仓库完整文档：[企业接入手册](https://github.com/ChenyCHENYU/MachTable/blob/main/docs/guide/enterprise-integration.md) · [Element Plus 集成](https://github.com/ChenyCHENYU/MachTable/blob/main/docs/guide/element-plus.md) · [SSR](https://github.com/ChenyCHENYU/MachTable/blob/main/docs/guide/ssr.md)。
