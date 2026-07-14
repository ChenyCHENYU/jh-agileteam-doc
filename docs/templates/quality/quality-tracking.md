# 质量跟踪模板

> 质量跟踪页面标准模板，适用于质量追溯、问题跟踪、整改管理。

<AuthorTag author="MaJiaRui" />

---

## 适用场景

- 产品质量全生命周期追溯（原料 → 生产 → 检验 → 出厂）
- 质量问题跟踪与闭环管理
- 整改通知单下发与验收
- 质量异常统计分析

## 推荐页面模式

**`MASTER_DETAIL`（上下分栏主从表）** — 上方质量问题列表，下方选中问题的整改记录

上方主表展示质量问题清单，双击行后下方从表加载该问题的整改记录与处理流程。

## 文件结构

```text
views/quality/tracking/
├── index.vue       # 视图层：jh-drag-row 包裹上下两区
├── data.ts         # 逻辑层：createPage（主表） + createBottomPage（从表）
└── index.scss      # 样式层
```

## 主表查询区配置

| 字段 | 中文名 | 类型 | 说明 |
|------|--------|------|------|
| heatNo | 炉号/批次号 | input | 模糊查询 |
| defectType | 缺陷类型 | dict(`defect_type`) | 表面/尺寸/性能 |
| severity | 严重程度 | dict(`defect_severity`) | 一般/严重/致命 |
| status | 处理状态 | dict(`track_status`) | 待处理/处理中/已闭环 |
| reportDate | 上报日期 | daterange | 日期范围 |

## 主表表格列

| 字段 | 中文名 | 宽度 | 特殊处理 |
|------|--------|------|---------|
| heatNo | 炉号 | 140 | 可点击跳转追溯链 |
| productType | 产品类型 | 120 | — |
| defectType | 缺陷类型 | 120 | dict 渲染 |
| severity | 严重程度 | 100 | dict + TagStatus（颜色分级） |
| status | 处理状态 | 100 | dict + TagStatus |
| reportUser | 上报人 | 100 | — |
| reportDate | 上报日期 | 150 | — |

## 从表（整改记录）

选中主表某条质量问题后，下方展示该问题的整改记录列表：

| 字段 | 中文名 | 说明 |
|------|--------|------|
| step | 整改步骤 | 流程节点 |
| action | 整改措施 | 具体处理内容 |
| handler | 处理人 | 责任人 |
| handleDate | 处理日期 | — |
| result | 处理结果 | dict 渲染 |

## API 接口约定

```text
GET    /quality/tracking/list          质量问题列表（分页）
GET    /quality/tracking/{id}/records  整改记录列表
POST   /quality/tracking               新增质量问题
POST   /quality/tracking/rectify       下发整改通知
PUT    /quality/tracking/close/{id}    闭环确认
GET    /quality/tracking/trace/{heatNo} 全链路追溯
```

## 关联组件

- [jh-drag-row](/frontend/pc/components/jh-drag-row) — 上下分栏
- [BaseTable](/frontend/pc/components/base-table) — 主表 + 从表
- [C_TagStatus](/frontend/pc/components/c-tag-status) — 严重程度/状态标签

## 关联 Skill

- [page-codegen](/frontend/pc/skills/page-codegen) — 基于 MASTER_DETAIL 模式生成
