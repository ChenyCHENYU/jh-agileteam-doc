# 质量检验模板

> 质量检验页面标准模板，适用于检验任务分配、结果录入、不合格品处理。

<AuthorTag author="MaJiaRui" />

---

## 适用场景

- 检验任务分配与接收
- 检验结果录入（合格/不合格/让步接收）
- 检验标准与判定规则管理
- 不合格品处置流程（返工/降级/报废）

## 推荐页面模式

**`LIST`（标准列表页）** — 查询 + 工具栏 + 表格 + 分页

检验记录以批次/炉号为核心，通过标准列表页管理检验数据，结果录入使用弹窗表单。

## 文件结构

```text
views/quality/inspection/
├── list/
│   ├── index.vue       # 视图层：BaseQuery + BaseToolbar + BaseTable
│   ├── data.ts         # 逻辑层：AbstractPageQueryHook 子类
│   └── index.scss      # 样式层
└── record/
    ├── index.vue       # 检验结果录入弹窗
    └── data.ts         # 表单逻辑（含检验项列表）
```

## 查询区配置

| 字段 | 中文名 | 类型 | 说明 |
|------|--------|------|------|
| heatNo | 炉号 | input | 模糊查询 |
| inspectionType | 检验类型 | dict(`inspection_type`) | 化验/物理/外观 |
| result | 检验结果 | dict(`inspection_result`) | 合格/不合格/让步 |
| inspectDate | 检验日期 | daterange | 日期范围筛选 |

## 工具栏按钮

| 按钮 | 类型 | 权限 | 动作 |
|------|------|------|------|
| 录入结果 | primary | `quality:inspection:record` | 打开录入弹窗 |
| 批量审核 | plain | `quality:inspection:audit` | 批量审核 |
| 导出报告 | plain | `quality:inspection:export` | 导出检验报告 |

## 表格列定义

| 字段 | 中文名 | 宽度 | 特殊处理 |
|------|--------|------|---------|
| heatNo | 炉号 | 140 | 可点击跳转详情 |
| steelGrade | 钢种 | 100 | — |
| spec | 规格 | 120 | — |
| inspectionType | 检验类型 | 120 | dict 渲染 |
| result | 检验结果 | 100 | dict + TagStatus（合格绿/不合格红） |
| inspector | 检验员 | 100 | — |
| inspectDate | 检验日期 | 150 | — |

## 操作列

| 按钮 | 权限 | 动作 |
|------|------|------|
| 录入 | `quality:inspection:record` | 打开结果录入 |
| 查看 | `quality:inspection:view` | 查看检验明细 |
| 审核 | `quality:inspection:audit` | 审核确认 |

## API 接口约定

```text
GET    /quality/inspection/list        检验记录列表（分页）
GET    /quality/inspection/{id}        检验明细（含检验项）
POST   /quality/inspection/record      录入检验结果
POST   /quality/inspection/audit       批量审核
GET    /quality/inspection/export      导出检验报告
```

## 关联组件

- [BaseQuery](/frontend/pc/components/base-query) — 查询区
- [BaseTable](/frontend/pc/components/base-table) — 检验记录表格
- [C_TagStatus](/frontend/pc/components/c-tag-status) — 检验结果状态标签
- [c_formModal](/frontend/pc/components/c-form-modal) — 结果录入弹窗

## 关联 Skill

- [page-codegen](/frontend/pc/skills/page-codegen) — 基于此模板配置生成页面代码
