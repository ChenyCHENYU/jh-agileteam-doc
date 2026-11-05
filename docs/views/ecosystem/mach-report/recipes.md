---
description: "MachReport 场景示例：生产日报完整宽表、工业标签 ReportLabelStudio 与 defineLabelReport、Excel 模板导入绑定、单元格编辑与数据核对、后端返回 RenderPlan、服务端复用与持久任务…"
---

# 场景示例

<AuthorTag :authors="['CHENY']" />

[[toc]]

> 适用于 <NpmVersion pkg="@agile-team/mach-report" fallback="2.21.1" />。以下按业务场景精选；仓库 [docs](https://github.com/ChenyCHENYU/MachReport/tree/main/docs) 与 [examples](https://github.com/ChenyCHENYU/MachReport/tree/main/examples) 有完整专题。

## ① 生产日报：完整宽表

列数很多时用宽表，避免把所有列挤进一张纸：

```ts
import { createTableTemplate, defineReport, machReportPlugin } from "@agile-team/mach-report/vue";

const dailyReport = createTableTemplate({
  layout: "wide",
  title: "炼钢生产日报",
  columns: [
    { header: "日期", field: "date", widthMm: 32 },
    { header: "班组", field: "team", widthMm: 24 },
    { header: "钢种", field: "grade", widthMm: 36 },
    { header: "产量(t)", field: "output", format: { kind: "number", digits: 3 } },
    { header: "合格率", field: "yieldRate", format: { kind: "percent", digits: 2 } }
    // 继续声明全部业务列，列宽不受 A3/A4 限制
  ]
});

app.use(machReportPlugin, {
  reports: {
    "daily-report": defineReport({
      template: dailyReport,
      load: ({ params, signal }) => productionApi.daily(params, { signal }),
      mapData: (data) => ({ detail: data.rows })
    })
  }
});
```

行为要点：宽表默认 100% 预览、横向滚动；Excel 导出自动把同一逻辑表还原为**一张连续 Sheet**（保留全部列、行与原始值，重复页头只写一次）；宽表 Excel 打印纸型在配置 `xlsx: { paperSize: "a3" }` 中选配，不改变数据列宽。

## ② 工业标签与材料标识

成品样式和自由设计共用同一工作台——直接传记录与字段契约，包内完成标签设计、真实码图、逐记录预览与原尺寸输出：

```vue
<script setup lang="ts">
import { ReportLabelStudio } from "@agile-team/mach-report/vue";
import "@agile-team/mach-report/vue/style.css";
</script>

<template>
  <ReportLabelStudio
    :rows="materials"
    :schema="materialContract"
    identity-field="id"
    :brand="{ name: 'MACH STEEL', tagline: '材料追溯' }"
  />
</template>
```

固定标签批量交付用报表定义（数据来源 `rows` 或 `load` 二选一）：

```ts
app.use(machReportPlugin, {
  reports: {
    "material-labels": defineLabelReport({
      template: labelTemplate,                 // 必须是带有效 repeat 的静态固定布局
      load: ({ params, signal }) => labelApi.rows(params, { signal }),
      dataSchema: materialContract             // 单数据集契约，自动按 template.repeat.dataset 映射
    })
  }
});
```

标签模板支持逐记录字段绑定、多版相邻与份数；QR/条码经 `/codes` 入口用 BWIPP 生成**真实码图** PNG（静区/模块/载荷有界，禁止假码）。

## ③ Excel 模板导入：业务报表变模板

把业务部门维护的 Excel 直接转换为可版本化模板：

```ts
import { importExcelTemplate } from "@agile-team/mach-report/xlsx";

const file = input.files?.[0];
if (file) {
  const result = await importExcelTemplate(await file.arrayBuffer(), {
    sheet: 0,                       // 多 Sheet 会话可复用、可取消预检
    binding: {
      title: "A1:H1",               // 标题区
      header: "A3:H3",              // 表头区
      detail: "A4:H100",            // 明细区 → detail 数据集
      footer: "A101:H102"           // 页尾区
    }
  });
  // result.template 可注册进 reports，或交给设计器继续调整
}
```

支持混合字体与只读富文本、PNG/JPEG Logo、完整索引色、合并样式与缓存公式值转换；预览组件也可用 `excelImport: true` 开启工具栏入口，或编程式 `report.importExcel(input, options)`。成功导入替换当前预览并发出 `template-import` 事件，**不调用业务写接口**——是否持久化模板由应用决定。

## ④ 单元格编辑与数据核对

默认只读；开启编辑后走"原子事务 + 差异审阅"闭环：

```vue
<MachReportPreview
  ref="report"
  report-id="outbound"
  :editable="{
    canEdit: (cell) => cell.datasetId === 'detail' && userCanEdit(cell.field),
    validate: async (value, cell) => (await checkQty(value) ? true : '数量超出库存'),
    save: async (changes) => { await outboundApi.saveCells(changes); }
  }"
  @cell-edit="onEdit"
/>
```

配套数据工具（`/vue` 侧栏能力，同一份模板与数据源）：

- **安全预填**：`createReportPrefill`——只补空白、稳定业务身份、应用前冲突检查；
- **期间对比**：`compareReportData`——两份快照按键增删变化、精确差额/容差/比率；
- **整批校验**：`validateReportDataset / assertReportValidation`——整批候选检查；
- 状态：`state.dirty`（本次计划有净修改）、`state.saving`、`report.undo() / redo()`、差异审阅定位 `focusField({ tableId?, datasetId?, field })`。

## ⑤ 后端返回渲染计划（PlanFetcher）

后端已用引擎生成 `RenderPlan`（或异构后端自行排版）时，前端只做展示：

```ts
import { machReportPlugin, type PlanFetcher } from "@agile-team/mach-report/vue";

const fetcher: PlanFetcher = async ({ reportIds, params, signal }) => {
  const response = await fetch("/api/report-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reportIds, params }),
    signal
  });
  if (!response.ok) throw new Error(`报表加载失败：HTTP ${response.status}`);
  return response.json();
};

app.use(machReportPlugin, { fetcher });
```

## ⑥ 服务端复用与持久任务

同一套计划与受控输出路径在 Node 侧复用（`/server`、`/server/node`）：

| 能力 | API | 说明 |
|------|-----|------|
| 共用 Runtime | `createReportRuntime` | 预算/队列/逐页生成，浏览器与 Node 同一契约 |
| 持久任务 | `createReportJobService` + `ReportJobStore` | 租约、幂等、取消、失败重试、有界终态归档；多实例原子 CAS 由宿主实现 |
| 文件适配器 | `openFileReportJobStore` | 单进程文件实现；输出摘要 `reportArtifactSha256` |
| 流式 Excel | `writeRowsToXlsx`（`/xlsx/node`） | 大数据量逐行写出，不在内存攒全量 |
| 发布验收 | `reviewReportPublication` | 显式样例的真实 PDF/XLSX 编码验收，不隐式发布 |

Java 后端可按 [OpenAPI 契约 + Java 参考客户端](https://github.com/ChenyCHENYU/MachReport/tree/main/examples/server-java-node) 直连 Node 执行器；真实 HTTP 验证覆盖精度、错误、取消、下载与混合并发。

## ⑦ 查询参数：级联与远程字典

模板 `params` 自动生成查询面板；多选、完整叶节点级联与数值范围保留规范 JSON wire：

```ts
const template = createTemplate()
  .params([
    { field: "plant", label: "厂别", type: "enum", defaultValue: "ALL",
      cascader: { source: "plants" } },           // 厂别 → 产线级联
    { field: "dateRange", label: "日期范围", type: "dateRange" },
    { field: "qty", label: "数量范围", type: "numberRange" }
  ])
  .page("a4")
  .build();
```

首次缺少必填条件时显示填写引导并等待查询；提交后标明具体字段并聚焦首个问题项；原始 `fetcher + paramDefs` 与编程式 `setParams` 同样在请求前校验。

## 更多专题

仓库文档另有：可视化设计器与草稿恢复、复杂报表（主从/树形/动态矩阵）、声明式聚合图表、模板包跨项目搬运、批量生成与打印校准、深层验证与 Office 设备验收等完整专题。
