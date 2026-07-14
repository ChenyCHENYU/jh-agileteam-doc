# 设备管理模板

> 设备管理页面标准模板，适用于设备台账、维护保养、运行状态监控。

<AuthorTag author="CHENY" />

---

## 适用场景

- 设备台账管理（设备档案、位置、参数）
- 维护保养计划与执行记录
- 设备运行状态监控（运行/停机/维修）
- 备品备件关联管理

## 推荐页面模式

**`TREE_LIST`（左树右列表）** — 左侧按车间/区域树形筛选，右侧设备列表

设备按车间区域组织，左侧 `C_Tree` 提供层级筛选，右侧标准列表管理设备明细。

## 文件结构

```text
views/produce/equipment/
├── list/
│   ├── index.vue       # 视图层：jh-drag-col 包裹左树 + 右列表
│   ├── data.ts         # 逻辑层：createPage + createTreePage
│   └── index.scss      # 样式层
└── detail/
    ├── index.vue       # 设备详情页（独立路由）
    └── data.ts         # 详情数据逻辑
```

## 左侧树配置

| 数据源 | 节点层级 | 说明 |
|--------|---------|------|
| 车间/区域树 | 厂区 → 车间 → 区域 | 点击节点过滤右侧设备列表 |

## 查询区配置（右侧）

| 字段 | 中文名 | 类型 | 说明 |
|------|--------|------|------|
| equipmentCode | 设备编码 | input | 模糊查询 |
| equipmentName | 设备名称 | input | 模糊查询 |
| equipmentType | 设备类型 | dict(`equipment_type`) | 下拉选择 |
| status | 运行状态 | dict(`equipment_status`) | 运行/停机/维修/报废 |

## 工具栏按钮

| 按钮 | 类型 | 权限 | 动作 |
|------|------|------|------|
| 新增 | primary | `produce:equipment:add` | 打开新增弹窗 |
| 导入 | plain | `produce:equipment:import` | 批量导入 |
| 导出 | plain | `produce:equipment:export` | 导出台账 |

## 表格列定义

| 字段 | 中文名 | 宽度 | 特殊处理 |
|------|--------|------|---------|
| equipmentCode | 设备编码 | 160 | — |
| equipmentName | 设备名称 | 200 | — |
| equipmentType | 设备类型 | 120 | dict 渲染 |
| location | 安装位置 | 150 | — |
| manufacturer | 生产厂商 | 150 | — |
| status | 运行状态 | 100 | dict + TagStatus 渲染 |
| lastMaintenanceDate | 上次保养日期 | 150 | — |

## 操作列

| 按钮 | 权限 | 动作 |
|------|------|------|
| 详情 | `produce:equipment:view` | 跳转详情页 |
| 编辑 | `produce:equipment:edit` | 打开编辑弹窗 |
| 保养记录 | `produce:equipment:maintain` | 查看维护历史 |

## API 接口约定

```text
GET    /produce/equipment/tree          车间区域树
GET    /produce/equipment/list          设备列表（分页，支持区域筛选）
GET    /produce/equipment/{id}          设备详情
POST   /produce/equipment               新增设备
PUT    /produce/equipment               编辑设备
DELETE /produce/equipment/{ids}         批量删除
GET    /produce/equipment/export        导出台账
GET    /produce/equipment/{id}/maintain 保养记录列表
```

## 关联组件

- [jh-drag-col](/frontend/pc/components/jh-drag-col) — 左右分栏
- [C_Tree](/frontend/pc/components/c-tree) — 左侧区域树
- [BaseTable](/frontend/pc/components/base-table) — 设备表格
- [C_TagStatus](/frontend/pc/components/c-tag-status) — 运行状态标签

## 关联 Skill

- [page-codegen](/frontend/pc/skills/page-codegen) — 基于此模板配置生成页面代码
