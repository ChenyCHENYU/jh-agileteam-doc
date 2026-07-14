# 成本分析模板

> 成本分析页面标准模板，适用于成本结构分析、趋势对比与优化建议。

<AuthorTag author="XuQingYu" />

---

## 适用场景

- 成本结构分析（原料/能源/人工/制造费用占比）
- 成本变化趋势（环比/同比/跨期对比）
- 成本对标分析（目标成本 vs 实际成本）
- 成本优化建议（偏差识别 + 降本方向）

## 推荐页面模式

**`TEMPLATE_DRIVEN`（配置驱动）** — 页面极简，业务逻辑由分析模板组件封装

## 文件结构

```text
views/cost/analysis/
├── index.vue       # 视图层：1-3 行，引用分析模板组件
└── data.ts         # 导出分析配置对象
```

```vue
<template>
  <div class="app-container app-page-container">
    <CostAnalysisTemplate :config="analysisConfig" />
  </div>
</template>
```

## 分析配置（data.ts）

```typescript
export const analysisConfig = {
  query: {
    items: [
      { name: "analysisType", label: "分析类型", type: "dict", dictCode: "cost_analysis_type" },
      { name: "dateRange", label: "统计周期", type: "daterange" },
      { name: "productLine", label: "产线", type: "dict", dictCode: "product_line" },
    ],
  },
  kpi: [
    { key: "totalCost", label: "总成本", unit: "万元", type: "amount" },
    { key: "unitCost", label: "单位成本", unit: "元/吨", type: "amount" },
    { key: "costVariance", label: "成本偏差", unit: "%", type: "percent" },
    { key: "savingPotential", label: "降本空间", unit: "万元", type: "amount" },
  ],
  charts: [
    {
      type: "pie",
      title: "成本结构占比",
      api: "/cost/analysis/structure",
    },
    {
      type: "line",
      title: "单位成本趋势",
      api: "/cost/analysis/unitCostTrend",
      compare: true,
    },
    {
      type: "bar",
      title: "目标 vs 实际成本对比",
      api: "/cost/analysis/targetComparison",
    },
  ],
  table: {
    api: "/cost/analysis/detail",
    columns: [
      { field: "heatNo", label: "炉号" },
      { field: "productType", label: "产品类型" },
      { field: "targetCost", label: "目标成本" },
      { field: "actualCost", label: "实际成本" },
      { field: "variance", label: "偏差(%)" },
    ],
  },
  export: { api: "/cost/analysis/export", formats: ["xlsx"] },
}
```

## API 接口约定

```text
GET    /cost/analysis/kpi              KPI 指标
GET    /cost/analysis/structure        成本结构（饼图数据）
GET    /cost/analysis/unitCostTrend    单位成本趋势
GET    /cost/analysis/targetComparison 目标对比
GET    /cost/analysis/detail           明细列表（分页）
GET    /cost/analysis/export           导出
```

## 关联组件

- [ECharts](/frontend/pc/components/ag-grid) — 饼图/折线/柱状图
- [BaseTable](/frontend/pc/components/base-table) — 明细表格

## 关联 Skill

- [page-codegen](/frontend/pc/skills/page-codegen) — TEMPLATE_DRIVEN 模式
