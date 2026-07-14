# 工艺管理模板

> 工艺管理页面标准模板，适用于工艺路线、工艺参数、工艺标准的管理。

<AuthorTag author="CHENY" />

---

## 适用场景

- 工艺路线定义与维护
- 工艺参数配置（温度、压力、速度等）
- 工艺标准制定与版本控制
- 工艺流程审批与发布

## 推荐页面模式

**`LIST`（标准列表页）** — 查询 + 工具栏 + 表格 + 分页

工艺管理以"工艺路线"为核心实体，通过标准列表页管理工艺数据，复杂工艺参数维护使用弹窗表单。

## 文件结构

```text
views/produce/process/
├── list/
│   ├── index.vue       # 视图层：BaseQuery + BaseToolbar + BaseTable
│   ├── data.ts         # 逻辑层：AbstractPageQueryHook 子类
│   └── index.scss      # 样式层
└── form/
    ├── index.vue       # 工艺参数维护表单（弹窗或独立路由）
    └── data.ts         # 表单数据逻辑
```

## 查询区配置

| 字段 | 中文名 | 类型 | 说明 |
|------|--------|------|------|
| processCode | 工艺编码 | input | 支持模糊查询 |
| processName | 工艺名称 | input | 支持模糊查询 |
| productLine | 产线 | dict(`product_line`) | 下拉选择 |
| status | 状态 | dict(`process_status`) | 启用/停用/草稿 |

## 工具栏按钮

| 按钮 | 类型 | 权限 | 动作 |
|------|------|------|------|
| 新增 | primary | `produce:process:add` | 打开新增弹窗 |
| 删除 | danger | `produce:process:delete` | 批量删除 |
| 导出 | plain | `produce:process:export` | 导出 Excel |

## 表格列定义

| 字段 | 中文名 | 宽度 | 特殊处理 |
|------|--------|------|---------|
| processCode | 工艺编码 | 160 | — |
| processName | 工艺名称 | 200 | — |
| productLine | 产线 | 120 | dict 渲染 |
| version | 版本号 | 100 | — |
| status | 状态 | 100 | dict + Tag 渲染 |
| updateTime | 更新时间 | 180 | — |

## 操作列

| 按钮 | 权限 | 动作 |
|------|------|------|
| 编辑 | `produce:process:edit` | 打开编辑弹窗 |
| 删除 | `produce:process:delete` | 单条删除 |
| 复制 | `produce:process:copy` | 复制为新版本 |

## API 接口约定

```text
GET    /produce/process/list          列表查询（分页）
POST   /produce/process               新增工艺
PUT    /produce/process               编辑工艺
DELETE /produce/process/{ids}         批量删除
GET    /produce/process/export        导出
POST   /produce/process/copy/{id}     复制版本
```

## 关联组件

- [BaseQuery](/frontend/pc/components/base-query) — 查询区
- [BaseToolbar](/frontend/pc/components/base-toolbar) — 工具栏
- [BaseTable](/frontend/pc/components/base-table) — 表格
- [c_formModal](/frontend/pc/components/c-form-modal) — 新增/编辑弹窗

## 关联 Skill

- [page-codegen](/frontend/pc/skills/page-codegen) — 基于此模板配置生成页面代码
- [convention-audit](/frontend/pc/skills/convention-audit) — 生成后规范审计
