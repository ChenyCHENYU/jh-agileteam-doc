# 模板库

> 本模板库提供了各业务领域的常用页面模板，帮助开发者快速搭建标准化的业务页面。每个模板标注了对应的 page-codegen 页面模式，可直接用于代码生成。

<AuthorTag author="CHENY" />

---

## 模板分类

- [生产领域](./produce/) — 生产计划、工艺管理、设备管理
- [质量领域](./quality/) — 质量检验、质量跟踪、质量报表
- [销售领域](./sale/) — 订单管理、客户管理、销售分析
- [成本领域](./cost/) — 成本核算、成本分析、成本报表

---

## 模板 → 页面模式对照表

每个模板对应 [page-codegen](/frontend/pc/skills/page-codegen) 的一种页面模式（pattern），AI 生成代码时会按此模式选择对应的 `TPL-*.md`：

| 领域 | 模板 | 页面模式 | 说明 |
|------|------|---------|------|
| 生产 | [【棒线材】精整实绩](./produce/production-plan) | RECORD_FORM | 查询 + 表单录入 + 明细表（无分页） |
| 生产 | [工艺管理](./produce/process-management) | LIST | 查询 + 工具栏 + 表格 + 分页 |
| 生产 | [设备管理](./produce/equipment-management) | TREE_LIST | 左树（区域）+ 右列表 |
| 质量 | [质量检验](./quality/quality-inspection) | LIST | 标准列表 + 结果录入弹窗 |
| 质量 | [质量跟踪](./quality/quality-tracking) | MASTER_DETAIL | 上下分栏（问题列表 + 整改记录） |
| 质量 | [质量报表](./quality/quality-report) | TEMPLATE_DRIVEN | 配置驱动（图表 + KPI） |
| 销售 | [订单管理](./sale/order-management) | LIST + FORM_ROUTE | 列表 + 复杂表单独立路由 |
| 销售 | [客户管理](./sale/customer-management) | LIST + DETAIL_TABS | 列表 + 多 Tab 详情 |
| 销售 | [销售分析](./sale/sales-analysis) | TEMPLATE_DRIVEN | 配置驱动（图表 + 明细） |
| 成本 | [成本核算](./cost/cost-accounting) | RECORD_FORM | 查询 + 录入表单 + 工序明细 |
| 成本 | [成本分析](./cost/cost-analysis) | TEMPLATE_DRIVEN | 配置驱动（图表 + KPI） |
| 成本 | [成本报表](./cost/cost-report) | TEMPLATE_DRIVEN | 配置驱动（树形报表 + 导出） |

---

## 使用说明

1. 选择对应的业务领域模板
2. 根据实际需求进行定制修改
3. 遵循项目的编码规范和架构设计
4. 通过 [page-codegen](/frontend/pc/skills/page-codegen) Skill 基于模板配置生成页面代码
