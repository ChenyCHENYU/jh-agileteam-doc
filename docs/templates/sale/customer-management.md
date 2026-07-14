# 客户管理模板

> 客户管理页面标准模板，适用于客户档案、分类管理、跟进记录与客户详情。

<AuthorTag author="ZhongYu" />

---

## 适用场景

- 客户档案管理（企业信息、联系人、资质）
- 客户分类与等级（VIP/普通/黑名单）
- 客户跟进记录（拜访、沟通、商机）
- 客户详情多维度展示（基本信息 + 联系人 + 订单 + 跟进）

## 推荐页面模式

**`DETAIL_TABS`（详情 Tab + 子表页）** — 上方多 Tab 表单，下方关联子表

客户列表用标准 `LIST`，客户详情页用 `DETAIL_TABS` 展示客户全维度信息。

## 文件结构

```text
views/sale/customer/
├── list/
│   ├── index.vue       # 客户列表（LIST 标准列表）
│   ├── data.ts
│   └── index.scss
└── detail/
    ├── index.vue       # 客户详情（DETAIL_TABS）
    ├── data.ts         # reactive + ref（不用 AbstractPageQueryHook）
    └── index.scss
```

## 客户列表查询区

| 字段 | 中文名 | 类型 | 说明 |
|------|--------|------|------|
| customerName | 客户名称 | input | 模糊查询 |
| customerCode | 客户编码 | input | 精确查询 |
| customerType | 客户类型 | dict(`customer_type`) | 直供/代理/加工 |
| level | 客户等级 | dict(`customer_level`) | VIP/A/B/C |
| enableStatus | 启用状态 | dict(`enable_status`) | 启用/停用 |

## 客户列表工具栏

| 按钮 | 类型 | 权限 | 动作 |
|------|------|------|------|
| 新增客户 | primary | `sale:customer:add` | 打开新增弹窗 |
| 导入 | plain | `sale:customer:import` | 批量导入 |
| 导出 | plain | `sale:customer:export` | 导出客户档案 |

## 客户列表表格列

| 字段 | 中文名 | 宽度 | 特殊处理 |
|------|--------|------|---------|
| customerName | 客户名称 | 200 | 可点击跳转详情页 |
| customerCode | 客户编码 | 140 | — |
| customerType | 客户类型 | 120 | dict 渲染 |
| level | 客户等级 | 100 | dict + TagStatus（VIP金色/A蓝色/B灰色） |
| contactPerson | 联系人 | 100 | — |
| contactPhone | 联系电话 | 140 | — |
| enableStatus | 状态 | 80 | dict + TagStatus |

## 客户详情页（DETAIL_TABS）

| Tab | 说明 | 数据来源 |
|-----|------|---------|
| 基本信息 | 企业名称、统一社会信用代码、地址 | 客户主表 |
| 联系人 | 多联系人管理 | 联系人子表 |
| 订单记录 | 该客户历史订单列表 | 订单表（关联查询） |
| 跟进记录 | 拜访/沟通/商机记录 | 跟进记录子表 |
| 资质附件 | 营业执照、协议等 | jh-file-upload |

## API 接口约定

```text
GET    /sale/customer/list             客户列表（分页）
GET    /sale/customer/{id}             客户详情（含 Tab 子表数据）
POST   /sale/customer                  新增客户
PUT    /sale/customer                  编辑客户
DELETE /sale/customer/{ids}            批量删除
GET    /sale/customer/{id}/orders      客户订单记录
GET    /sale/customer/{id}/followups   客户跟进记录
GET    /sale/customer/export           导出
```

## 关联组件

- [BaseTable](/frontend/pc/components/base-table) — 列表 + Tab 子表
- [BaseForm](/frontend/pc/components/base-form) — 基本信息 Tab
- [C_TagStatus](/frontend/pc/components/c-tag-status) — 客户等级标签
- [jh-file-upload](/frontend/pc/components/jh-file-upload) — 资质附件

## 关联 Skill

- [page-codegen](/frontend/pc/skills/page-codegen) — 列表用 LIST，详情用 DETAIL_TABS
