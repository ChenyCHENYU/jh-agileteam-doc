# 成本报表模板

> 成本报表页面标准模板，适用于成本统计报表、跨期对比与多维度汇总导出。

<AuthorTag author="XuQingYu" />

---

## 适用场景

- 成本汇总报表（按产品/工序/周期维度）
- 跨期成本对比报表（月报/季报/年报）
- 成本构成明细表（树形展开：总成本 → 分项 → 工序）
- 报表导出（Excel 多 Sheet / PDF）

## 推荐页面模式

**`TEMPLATE_DRIVEN`（配置驱动）** — 页面极简，报表逻辑由模板组件封装

## 文件结构

```text
views/cost/report/
├── index.vue       # 视图层：1-3 行，引用报表模板组件
└── data.ts         # 导出报表配置对象
```

```vue
<template>
  <div class="app-container app-page-container">
    <CostReportTemplate :config="reportConfig" />
  </div>
</template>
```

## 报表配置（data.ts）

```typescript
export const reportConfig = {
  query: {
    items: [
      { name: "reportType", label: "报表类型", type: "dict", dictCode: "cost_report_type" },
      { name: "period", label: "统计周期", type: "dict", dictCode: "report_period" },
      { name: "dateRange", label: "日期范围", type: "daterange" },
      { name: "productLine", label: "产线", type: "dict", dictCode: "product_line" },
    ],
  },
  // 汇总指标
  summary: [
    { key: "totalCost", label: "成本总额", unit: "万元" },
    { key: "outputWeight", label: "产出总量", unit: "吨" },
    { key: "unitCost", label: "单位成本", unit: "元/吨" },
    { key: "yoyChange", label: "同比变化", unit: "%" },
  ],
  // 报表表格（支持树形分组）
  table: {
    api: "/cost/report/list",
    tree: true, // 启用树形展开
    columns: [
      { field: "itemName", label: "成本项目", treeColumn: true },
      { field: "currentPeriod", label: "本期金额", format: "amount" },
      { field: "lastPeriod", label: "上期金额", format: "amount" },
      { field: "yoyChange", label: "同比(%)", format: "percent" },
      { field: "proportion", label: "占比(%)", format: "percent" },
    ],
  },
  // 辅助图表
  charts: [
    {
      type: "bar",
      title: "各产线成本对比",
      api: "/cost/report/lineComparison",
    },
  ],
  export: {
    api: "/cost/report/export",
    formats: ["xlsx"],
    multiSheet: true, // 多 Sheet 导出
  },
}
```

## API 接口约定

```text
GET    /cost/report/summary            汇总指标
GET    /cost/report/list               报表明细（树形结构）
GET    /cost/report/lineComparison     产线对比
GET    /cost/report/export             导出（多 Sheet Excel）
```

## 关联组件

- [BaseTable](/frontend/pc/components/base-table) — 报表表格（支持树形展开）
- [ECharts](/frontend/pc/components/ag-grid) — 对比柱状图
- [jh-pagination](/frontend/pc/components/jh-pagination) — 分页

## 关联 Skill

- [page-codegen](/frontend/pc/skills/page-codegen) — TEMPLATE_DRIVEN 模式
- [export](/frontend/pc/skills/cli) — wl-skills-kit 的 export 命令可导出基线
