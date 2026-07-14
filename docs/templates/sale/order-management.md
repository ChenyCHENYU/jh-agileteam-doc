# 订单管理模板

> 订单管理页面标准模板，适用于销售订单的创建、编辑、审核与发货跟踪。

<AuthorTag author="ZhongYu" />

---

## 适用场景

- 销售订单全生命周期管理（创建 → 审核 → 生产 → 发货 → 结算）
- 订单状态跟踪与流程控制
- 订单明细管理（多规格、多批次）
- 订单价格与折扣审批

## 推荐页面模式

**`LIST`（标准列表页）** — 查询 + 工具栏 + 表格 + 分页

订单列表使用标准列表页，复杂订单维护（含多 Tab 子表）使用独立路由表单页。

## 文件结构

```text
views/sale/order/
├── list/
│   ├── index.vue       # 视图层：BaseQuery + BaseToolbar + BaseTable
│   ├── data.ts         # 逻辑层：AbstractPageQueryHook 子类
│   └── index.scss      # 样式层
└── form/
    ├── index.vue       # 订单维护表单（独立路由，FORM_ROUTE 模式）
    └── data.ts         # useOrderForm Composable（含多 Tab 子表）
```

## 查询区配置

| 字段 | 中文名 | 类型 | 说明 |
|------|--------|------|------|
| orderNo | 订单编号 | input | 精确/模糊查询 |
| customerName | 客户名称 | input | 模糊查询 |
| orderStatus | 订单状态 | dict(`order_status`) | 待审/已审/生产中/已发货/已完成 |
| orderDate | 下单日期 | daterange | 日期范围筛选 |

## 工具栏按钮

| 按钮 | 类型 | 权限 | 动作 |
|------|------|------|------|
| 新增订单 | primary | `sale:order:add` | 跳转订单表单页 |
| 批量审核 | plain | `sale:order:audit` | 批量审核 |
| 导出 | plain | `sale:order:export` | 导出订单列表 |
| 打印 | plain | `sale:order:print` | 打印订单 |

## 表格列定义

| 字段 | 中文名 | 宽度 | 特殊处理 |
|------|--------|------|---------|
| orderNo | 订单编号 | 160 | 可点击跳转表单页 |
| customerName | 客户名称 | 200 | — |
| steelGrade | 钢种 | 100 | — |
| spec | 规格 | 120 | — |
| weight | 重量(吨) | 120 | 数值格式化（千分位） |
| totalAmount | 总金额(元) | 140 | 金额格式化 |
| orderStatus | 订单状态 | 100 | dict + TagStatus（流程色） |
| orderDate | 下单日期 | 150 | — |

## 操作列

| 按钮 | 权限 | 动作 |
|------|------|------|
| 编辑 | `sale:order:edit` | 跳转订单表单（编辑模式） |
| 审核 | `sale:order:audit` | 弹窗审核 |
| 打印 | `sale:order:print` | 打印预览 |

## 订单表单页（FORM_ROUTE）

复杂订单维护使用独立路由，含多 Tab 子表：

| Tab | 说明 | 组件 |
|-----|------|------|
| 基本信息 | 订单头信息（客户、交期、付款方式） | BaseForm |
| 订单明细 | 订单行项（钢种、规格、数量、单价） | BaseTable（可编辑行） |
| 发货计划 | 分批发货安排 | BaseTable |
| 附件 | 合同/技术协议上传 | jh-file-upload |

## API 接口约定

```text
GET    /sale/order/list                订单列表（分页）
GET    /sale/order/{id}                订单详情（含明细）
POST   /sale/order                     新增订单
PUT    /sale/order                     编辑订单
POST   /sale/order/audit               批量审核
DELETE /sale/order/{ids}               批量删除
GET    /sale/order/export              导出
GET    /sale/order/{id}/print          打印数据
```

## 关联组件

- [BaseTable](/frontend/pc/components/base-table) — 订单列表 + 明细子表
- [BaseForm](/frontend/pc/components/base-form) — 订单表单
- [C_TagStatus](/frontend/pc/components/c-tag-status) — 订单状态流程标签
- [jh-file-upload](/frontend/pc/components/jh-file-upload) — 附件上传

## 关联 Skill

- [page-codegen](/frontend/pc/skills/page-codegen) — 列表用 LIST，表单用 FORM_ROUTE
- [menu-sync](/frontend/pc/skills/menu-sync) — 列表与表单需分别注册菜单
