# 质量报表模板

> 质量报表页面标准模板，适用于质量统计、趋势分析、可视化图表展示与报表导出。

<AuthorTag author="MaJiaRui" />

---

## 适用场景

- 质量合格率统计（按批次/钢种/工序维度）
- 缺陷分布与趋势分析
- 质量看板（图表 + KPI 指标）
- 报表导出（Excel / PDF）

## 推荐页面模式

**`TEMPLATE_DRIVEN`（配置驱动）** — 页面极简，业务逻辑由报表模板组件封装

index.vue 仅 1-3 行，所有图表、查询、导出逻辑由专门的报表模板组件内部处理。

## 文件结构

```text
views/quality/report/
├── index.vue       # 视图层：1-3 行，引用报表模板组件
└── data.ts         # 导出报表配置对象
```

```vue
<!-- index.vue 极简结构 -->
<template>
  <div class="app-container app-page-container">
    <QualityReportTemplate :config="reportConfig" />
  </div>
</template>
```

## 报表配置（data.ts）

```typescript
export const reportConfig = {
  // 查询条件
  query: {
    items: [
      { name: "statType", label: "统计维度", type: "dict", dictCode: "quality_stat_type" },
      { name: "dateRange", label: "统计周期", type: "daterange" },
      { name: "productLine", label: "产线", type: "dict", dictCode: "product_line" },
    ],
  },
  // KPI 指标卡
  kpi: [
    { key: "passRate", label: "合格率", unit: "%", type: "percent" },
    { key: "totalBatch", label: "检验批次", unit: "批", type: "number" },
    { key: "defectCount", label: "缺陷数量", unit: "个", type: "number" },
  ],
  // 图表配置
  charts: [
    {
      type: "line",
      title: "合格率趋势",
      api: "/quality/report/passRateTrend",
      xAxis: "date",
      yAxis: "passRate",
    },
    {
      type: "pie",
      title: "缺陷类型分布",
      api: "/quality/report/defectDistribution",
    },
    {
      type: "bar",
      title: "各工序质量对比",
      api: "/quality/report/processComparison",
    },
  ],
  // 导出
  export: {
    api: "/quality/report/export",
    formats: ["xlsx", "pdf"],
  },
}
```

## API 接口约定

```text
GET    /quality/report/kpi              KPI 指标汇总
GET    /quality/report/passRateTrend    合格率趋势数据
GET    /quality/report/defectDistribution  缺陷分布数据
GET    /quality/report/processComparison   工序对比数据
GET    /quality/report/export            导出报表
```

## 关联组件

- [ECharts](/frontend/pc/components/ag-grid) — 折线/饼图/柱状图可视化
- [jh-pagination](/frontend/pc/components/jh-pagination) — 分页

## 关联 Skill

- [page-codegen](/frontend/pc/skills/page-codegen) — TEMPLATE_DRIVEN 模式，只生成 config 配置对象
