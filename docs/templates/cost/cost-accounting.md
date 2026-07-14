# 成本核算模板

> 成本核算页面标准模板，适用于生产成本录入、归集、分摊与结转。

<AuthorTag author="XuQingYu" />

---

## 适用场景

- 生产成本实绩录入（原料/能源/人工/制造费用）
- 成本归集（按炉号/工序/产品维度）
- 成本分摊（公共费用按规则分摊）
- 成本结转（在制品 → 半成品 → 成品）

## 推荐页面模式

**`RECORD_FORM`（录入型实绩页）** — 查询选定主记录 + 可编辑表单 + 明细表（无分页）

通过查询选定炉号/生产计划号，展示可编辑的成本录入表单和明细行，无分页。

## 文件结构

```text
views/cost/accounting/
├── index.vue       # 视图层：BaseQuery + BaseForm + BaseTable（无分页）
├── data.ts         # 逻辑层：直接导出 ref + 函数（Composable 风格）
└── index.scss      # 样式层
```

## 页面结构

```text
┌─────────────────────────────────────┐
│  BaseQuery（1-3 个字段，选定主记录）   │  ← 炉号/计划号查询
├─────────────────────────────────────┤
│  BaseForm（editable，分区展示）        │  ← 随查询结果填充
│  ├── 原料成本                         │
│  ├── 能源成本                         │
│  ├── 人工成本                         │
│  └── 制造费用                         │
├─────────────────────────────────────┤
│  BaseTable（明细行，无分页）           │  ← 工序级成本明细
└─────────────────────────────────────┘
```

## 查询区配置

| 字段 | 中文名 | 类型 | 说明 |
|------|--------|------|------|
| heatNo | 炉号 | input | 精确查询，选定主记录 |
| planDate | 计划日期 | date | 辅助筛选 |

## 表单字段（按业务分区）

| 分区 | 字段 | 中文名 | 类型 |
|------|------|--------|------|
| 原料成本 | materialCost | 原料费用 | number |
| 原料成本 | materialWeight | 原料用量 | number |
| 能源成本 | powerCost | 电费 | number |
| 能源成本 | gasCost | 燃气费 | number |
| 能源成本 | waterCost | 水费 | number |
| 人工成本 | laborCost | 人工费用 | number |
| 制造费用 | overheadCost | 制造费用 | number |

## 明细表（工序级成本）

| 字段 | 中文名 | 说明 |
|------|--------|------|
| processName | 工序名称 | — |
| processCode | 工序编码 | — |
| directCost | 直接成本 | 该工序直接投入 |
| allocatedCost | 分摊成本 | 公共费用分摊额 |
| totalCost | 工序总成本 | 自动计算 |

## API 接口约定

```text
GET    /cost/accounting/record         按炉号查询成本记录
POST   /cost/accounting/save           保存成本录入
POST   /cost/accounting/allocate       执行成本分摊
POST   /cost/accounting/carryover      执行成本结转
GET    /cost/accounting/{heatNo}/detail  工序级成本明细
```

## 关联组件

- [BaseQuery](/frontend/pc/components/base-query) — 主记录选择
- [BaseForm](/frontend/pc/components/base-form) — 成本录入（editable）
- [BaseTable](/frontend/pc/components/base-table) — 工序明细（无分页）
- [jh-input-number](/frontend/pc/components/jh-input-number) — 金额/数量录入

## 关联 Skill

- [page-codegen](/frontend/pc/skills/page-codegen) — RECORD_FORM 模式，直接导出 ref + 函数
