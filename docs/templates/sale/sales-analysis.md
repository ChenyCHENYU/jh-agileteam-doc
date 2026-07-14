# 销售分析模板

> 销售分析页面标准模板，适用于销售统计、趋势分析、排行榜与可视化看板。

<AuthorTag author="ZhongYu" />

---

## 适用场景

- 销售额/销售量统计（按客户/产品/区域维度）
- 销售趋势分析（环比/同比）
- 客户/产品销售排行榜
- 销售预测与目标达成率

## 推荐页面模式

**`TEMPLATE_DRIVEN`（配置驱动）** — 页面极简，业务逻辑由分析模板组件封装

index.vue 仅 1-3 行，所有图表、查询、导出逻辑由专门的分析模板组件内部处理。

## 文件结构

```text
views/sale/analysis/
├── index.vue       # 视图层：1-3 行，引用分析模板组件
└── data.ts         # 导出分析配置对象
```

```vue
<!-- index.vue 极简结构 -->
<template>
  <div class="app-container app-page-container">
    <SalesAnalysisTemplate :config="analysisConfig" />
  </div>
</template>
```

## 分析配置（data.ts）

```typescript
export const analysisConfig = {
  // 查询条件
  query: {
    items: [
      { name: "dimension", label: "分析维度", type: "dict", dictCode: "sale_dimension" },
      { name: "dateRange", label: "统计周期", type: "daterange" },
      { name: "productCategory", label: "产品类别", type: "dict", dictCode: "product_category" },
    ],
  },
  // KPI 指标卡
  kpi: [
    { key: "totalAmount", label: "销售总额", unit: "万元", type: "amount" },
    { key: "totalWeight", label: "销售总量", unit: "吨", type: "number" },
    { key: "orderCount", label: "订单数", unit: "笔", type: "number" },
    { key: "avgPrice", label: "均价", unit: "元/吨", type: "amount" },
  ],
  // 图表配置
  charts: [
    {
      type: "line",
      title: "销售额趋势",
      api: "/sale/analysis/amountTrend",
      xAxis: "month",
      yAxis: "amount",
      compare: true, // 支持环比/同比对比线
    },
    {
      type: "bar",
      title: "产品销量排行 TOP10",
      api: "/sale/analysis/productRanking",
    },
    {
      type: "pie",
      title: "客户类型占比",
      api: "/sale/analysis/customerDistribution",
    },
  ],
  // 明细表格
  table: {
    api: "/sale/analysis/detail",
    columns: [
      { field: "customerName", label: "客户名称" },
      { field: "productType", label: "产品类型" },
      { field: "weight", label: "销售量(吨)" },
      { field: "amount", label: "销售额(万元)" },
    ],
  },
  // 导出
  export: { api: "/sale/analysis/export", formats: ["xlsx"] },
}
```

## API 接口约定

```text
GET    /sale/analysis/kpi              KPI 指标汇总
GET    /sale/analysis/amountTrend      销售额趋势
GET    /sale/analysis/productRanking   产品排行
GET    /sale/analysis/customerDistribution  客户分布
GET    /sale/analysis/detail           明细列表（分页）
GET    /sale/analysis/export           导出
```

## 关联组件

- [ECharts](/frontend/pc/components/ag-grid) — 折线/柱状/饼图
- [BaseTable](/frontend/pc/components/base-table) — 明细表格

## 关联 Skill

- [page-codegen](/frontend/pc/skills/page-codegen) — TEMPLATE_DRIVEN 模式，只生成 config 配置对象
