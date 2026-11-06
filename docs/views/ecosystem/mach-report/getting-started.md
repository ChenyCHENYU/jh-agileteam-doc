---
description: "MachReport 快速上手：一个包按需入口（核心//vue//pdf//xlsx//designer//codes//server）、Vue 插件一次注册页面只传 ID、宽表与标准纸张、useMachReport 句柄、原生 TS 引擎与配置中心…"
---

# 快速上手

<AuthorTag :authors="['CHENY']" />

[[toc]]

> 适用于 <NpmVersion pkg="@agile-team/mach-report" fallback="2.21.1" />。一个 npm 包，按需入口：Vue 组件要求 Vue `^3.2.47`；只使用引擎、PDF 或 XLSX 时，Vue 是可选的（不导入 `/vue` 即不加载）。发布包 Node.js `>= 18`。

## 安装与入口地图

```bash
pnpm add @agile-team/mach-report
```

| 入口 | 内容 |
|------|------|
| `@agile-team/mach-report` | 模板 DSL、分页、校验、编辑事务、DOM/Canvas 渲染（零依赖零框架） |
| `/vue` | 预览组件、插件、配置中心、`useMachReport`、编辑与数据工具侧栏 |
| `/pdf` · `/xlsx` · `/sql` | PDF 编码 · Excel 导入导出 · 动态 SQL 编译校验 |
| `/designer` | 可视化模板设计器（画布/绑定向导/规则/验收） |
| `/codes` | 工业标签 QR/条码 PNG 渲染 |
| `/analytics` | 交叉表、数据集聚合、动态矩阵与图表组件 |
| `/worker` | 浏览器 Worker 执行器（大报表后台生成） |
| `/server` · `/server/node` | 服务端 Runtime、任务队列、持久任务与流式 Excel |

所有代码入口提供 ESM/CJS 与类型声明；仅 Node 入口引用线程/文件系统。

## Vue：注册一次，页面只传 ID 和参数

模板与业务取数集中注册；分页、校验、参数面板、多报表合并及请求生命周期交给包内：

```ts
import { machReportPlugin, defineReport, defineMachReportConfig } from "@agile-team/mach-report/vue";
import "@agile-team/mach-report/vue/style.css";

app.use(machReportPlugin, {
  reports: {
    outbound: defineReport({
      template,                                             // 见下文 createTableTemplate
      load: ({ params, signal }) => orderApi.report(params, { signal }),
      mapData: (data) => ({ detail: data.items })
    })
  },
  config: defineMachReportConfig({
    defaults: { pdfFontUrl: "/fonts/NotoSansSC-Regular.ttf" }
  })
});
```

```vue
<MachReportPreview report-id="outbound" :params="{ orderId }" height="70vh" />
```

要点：

- `orderApi` 是项目现有请求客户端（须消费 `signal` 才能真实取消）；包内不内置网关地址或鉴权；
- 接口已返回数据集时直接 `load`，无需 `mapData`；静态数据用 `{ template, datasets }`；
- 模板 `params` 自动生成查询面板（校验类型/范围/日期/枚举/Unicode 长度），`paramDefs` 可覆盖；
- 多报表合并：`:report-id="['outbound', 'process-card']"` 按顺序拼接页面。

## 标准明细：只定义业务列

```ts
import { createTableTemplate } from "@agile-team/mach-report/vue";

export const outboundTemplate = createTableTemplate({
  title: "出库单",
  columns: [
    { header: "物料", field: "name", flex: 3 },
    { header: "数量", field: "qty", style: { align: "right" } }
  ]
});
```

默认 A4、各 10mm 页边距、`detail` 数据集；未指定宽度的列按 `flex` 权重分配余量。支持 `paper`、`landscape`、`margins`、`params`，`listOptions` 沿用重复表头、分组、小计、总计和格式化。多区块、签字栏或精确定位单据用 `createTemplate()` 自由排版。

## 完整宽表 vs 标准纸张

| 使用目标 | 配置 |
| --- | --- |
| 完整宽表预览 + 连续 Excel | 模板 `layout: "wide"`；导出无需额外配置 |
| 宽表的 Excel 另选打印纸型 | 应用配置 `xlsx: { paperSize: "a3" }`，只影响打印设置 |
| 按标准纸张排版预览 / PDF / 打印 | 模板 `paper: "a3", landscape: true`（保持默认 `layout: "page"`） |

```ts
const template = createTableTemplate({
  layout: "wide",                    // 列数增加时表格随之展开，横向滚动
  columnWidthMm: 30,                 // 自动列基准宽度；单列 widthMm 优先，flex 为倍数
  title: "炼钢生产日报",
  columns: [
    { header: "日期", field: "date", widthMm: 32 },
    { header: "班组", field: "team", widthMm: 24 },
    { header: "产量", field: "output", format: { kind: "number", digits: 3 } }
    // 继续声明全部业务列，列宽不受 A3/A4 限制
  ]
});
```

`wide` 与 `paper / landscape` 分别表达自然列宽和固定纸张，不同时设置。宽表默认 100% 预览；Excel 默认把同一逻辑表还原为一张连续 Sheet，重复页头只写一次。

## 父页面控制：`useMachReport()` 一个句柄

```vue
<script setup lang="ts">
import { useMachReport } from "@agile-team/mach-report/vue";

const report = useMachReport();
const { state } = report;             // 只读响应式，模板中直接读字段

async function exportExcel() {
  await report.exportAs("xlsx");
}
</script>

<template>
  <button :disabled="!state.canExport" @click="exportExcel">导出 Excel</button>
  <span v-if="state.loading">正在加载报表</span>
  <MachReportPreview :ref="report.ref" report-id="outbound" :params="{ orderId }" />
</template>
```

句柄方法：`reload()`、`print()`、`exportAs(format)`、`openPdfWindow()`、`gotoPage(page)`、`setParams(values, { reload? })`；编辑态另有 `undo()/redo()/focusField()/getSelection()/copySelection()/pasteSelection()`。`state` 字段速查：

| 字段 | 含义 |
|------|------|
| `loading` / `hasPlan` | 正在查询 / 已加载非空页面计划 |
| `pageCount` / `currentPage` | 总页数 / 当前页（从 1 开始） |
| `exporting` / `printing` | 导出中（显示名称或 null）/ 打印准备中 |
| `canExport` / `canPrint` | 已有页面且空闲 |
| `error` | `{ code, message, cause? }`，新操作清空 |
| `pdfFont` | 字体预检状态（不阻塞预览、打印或 Excel） |
| `editing` / `saving` / `importing` / `dirty` / `changeCount` | 编辑、保存、导入状态与净差异 |

PDF 窗口方法保持同步调用，保留浏览器点击手势的弹窗权限。

## 原生 TypeScript：生成并渲染页面

```ts
import { createTemplate, paginateTemplate, renderPlan } from "@agile-team/mach-report";

const template = createTemplate()
  .page("a4")
  .text("第一张报表", { leftMm: 20, topMm: 20, widthMm: 100, heightMm: 10 })
  .list("detail", { leftMm: 12, topMm: 30, widthMm: 186 }, [
    { header: "物料", field: "name", widthMm: 120 },
    { header: "数量", field: "qty", widthMm: 66 }
  ])
  .build();

const { plan, warnings } = paginateTemplate(template, {
  detail: [{ name: "物料 A", qty: 3 }]
});

// 页面中提供 <div id="report"></div>
document.querySelector("#report")!.replaceChildren(renderPlan(plan, document));
```

`paginateTemplate` 可在客户端或服务端运行；`renderPlan` 需要 DOM。大量页面使用页窗口或 Vue 预览组件，避免一次创建全部页面节点。

## 配置中心与优先级

```ts
defineMachReportConfig({
  defaults: {
    gapPx: 18,
    pdfFontUrl: "/fonts/NotoSansSC-Regular.ttf",
    showParams: true,
    editable: false,
    excelImport: false,
    preview: { overscanPages: 1, searchDebounceMs: 200 },
    xlsx: { valueMode: "raw", paperSize: "auto" }
  },
  presets: { previewOnly: { showExport: false, showPrint: false } }
});
```

优先级：**组件属性 > 路由级 `provideMachReportConfig` > preset > 应用 defaults > 内置缺省**。中文 PDF 使用前部署支持所需字符的字体并设置 `pdfFontUrl`；缺字会阻止下载残缺文件。

## 下一步

- [API 参考](./api)——入口速查、RenderPlan、`createTableTemplate` 选项、预览组件契约；
- [场景示例](./recipes)——宽表日报、工业标签、Excel 导入、编辑核对、后端复用；
- 仓库完整文档：[项目接入指南](https://github.com/ChenyCHENYU/MachReport/blob/main/docs/INTEGRATION.md) · [参数](https://github.com/ChenyCHENYU/MachReport/blob/main/docs/PARAMETERS.md) · [PDF 字体](https://github.com/ChenyCHENYU/MachReport/blob/main/docs/PDF.md)。
