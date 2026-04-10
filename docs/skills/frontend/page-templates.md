# 9 种页面模板

page-codegen Skill 支持 9 种页面模板，每种模板对应一个独立的 `TPL-*.md` 文件，AI 会根据 page-spec 中的 `pattern` 自动选择对应模板生成代码。

## 模板总览

| 模板 | 模式 | 说明 | data.ts 模式 |
|------|------|------|-------------|
| TPL-LIST | `LIST` | 查询 + 工具栏 + 表格 + 分页 | `AbstractPageQueryHook` |
| TPL-FORM-ROUTE | `FORM_ROUTE` | 复杂表单（多 Tab、多子表）独立路由 | `useXxx` Composable |
| TPL-MASTER-DETAIL | `MASTER_DETAIL` | jh-drag-row 上下分栏主从表 | `AbstractPageQueryHook` + createBottomPage |
| TPL-TREE-LIST | `TREE_LIST` | C_Splitter 左树 + 右列表 | `AbstractPageQueryHook` |
| TPL-DETAIL-TABS | `DETAIL_TABS` | 上方 Tab 表单 + 下方子表 | 直接导出 reactive + ref |
| TPL-CHANGE-HISTORY | `CHANGE_HISTORY` | 左变更时间线 + 右字段比对 | composable + mock |
| TPL-RECORD-FORM | `RECORD_FORM` | 查询 + 表单录入（无分页） | 直接 ref + 函数 |
| TPL-OPERATION-STATION | `OPERATION_STATION` | 待处理 + 已处理联动操作 | 多个 createXxxPage |
| TPL-DRIVEN | `TEMPLATE_DRIVEN` | 配置驱动模板识别参考 | 仅 config 对象 |

## LIST：标准列表页

最常见的页面模板，适用于标准 CRUD 列表场景。

**布局**：BaseQuery 查询区 + BaseToolbar 工具栏 + BaseTable 表格 + jh-pagination 分页

**data.ts 结构**：

```typescript
class XxxPage extends AbstractPageQueryHook {
  queryDef(): BaseQueryItemDesc[] { /* 查询字段配置 */ }
  toolbarDef(): ActionButtonDesc[] { /* 工具栏按钮配置 */ }
  columnsDef(): TableColumnDesc[] { /* 表格列配置 */ }
}
```

**生成文件**：

```
[kebab-name]/
  index.vue     纯模板 + createPage 解构
  data.ts       AbstractPageQueryHook 子类
  index.scss    样式
  api.md        接口约定
```

## FORM_ROUTE：复杂表单独立路由

复杂表单（多 Tab、多子表）使用独立路由而非弹窗。

**特点**：
- data.ts **不继承 AbstractPageQueryHook**，改为导出 `useXxx` Composable
- 需在 pages.ts 单独注册路由
- 支持 add/edit/view 三种模式
- 内置 `router.back()` 返回上级列表

## MASTER_DETAIL：主从表页

上方主表 + 下方明细表，使用 `jh-drag-row` 上下分栏拖拽组件。

**布局**：jh-drag-row 包裹上下两个区域
- 上区：主表（查询 + 工具栏 + 表格 + 分页）
- 下区：从表（表格 + 分页）

**交互**：双击主表行 -> 加载从表数据

**data.ts 额外导出**：`createPage` + `createBottomPage` + `handleRowDblclick`

## TREE_LIST：左树右列表

左侧树形面板 + 右侧列表，使用 `C_Splitter` 左右分割组件。

**布局**：C_Splitter 包裹左右两个区域
- 左区：`C_Tree`（含搜索 + Tab 切换）
- 右区：标准列表（查询 + 工具栏 + 表格 + 分页）

**交互**：点击树节点 -> 过滤右侧列表数据

## DETAIL_TABS：详情 Tab + 子表页

上半区为多 Tab 表单（基本信息/客户信息/其他信息），下半区为子项表格。

**布局**：`C_Splitter direction="vertical"` 垂直分割
- 上区：el-card 包裹页头工具栏 + el-tabs 表单区
- 下区：子表表格

**data.ts**：直接导出 reactive + ref（不用 AbstractPageQueryHook）

## CHANGE_HISTORY：变更历史查询

左侧为变更历史时间线列表，右侧为变更详情（复用业务域组件，view 模式只读）。

**识别规则**：
- 左窄右宽双栏布局
- 左侧为时间线/历史记录列表（含彩色圆点 + 类型 + 时间 + 人员）
- 右侧为详情区域（只读 view 模式）
- 页面为隐藏菜单，由表单页跳转而来

**data.ts**：`useChangeHistory` composable + mock 数据

## RECORD_FORM：录入型实绩页

通过 BaseQuery 选定主记录（如炉号、生产计划号），展示可编辑的 BaseForm 字段区 + BaseTable 明细行，**无分页**。

**典型场景**：生产域实绩录入（转炉实绩、精炼实绩、连铸实绩等）

**识别规则**：
- 顶部 BaseQuery 仅用于"选择主记录"（1-3 个字段）
- 中部 BaseForm（editable），随查询结果填充
- 底部 BaseTable（明细行），无分页
- 用 `c_spliterTitle` 将表单字段按业务分区

**data.ts**：直接导出 ref + 函数（Composable 风格，不用 AbstractPageQueryHook）

## OPERATION_STATION：工序操作站

生产域工序操作页，有"待处理清单"与"已完成清单"两个联动表格，选中行后填写操作表单执行动作。

**识别特征**：
- 双清单联动：待处理/已处理两个列表，共享同一套查询条件
- 操作表单内联：表单字段直接展示在页面操作区域（非弹窗）
- 条件按钮：主操作按钮的 disabled 状态取决于选中行 + 表单字段
- 状态切换：执行操作后两个清单同时刷新

**data.ts**：导出多个 `createXxxPage()`，不使用 c_formModal

> 此模板 index.vue 包含大量业务逻辑（computed、watch、多列表协调），不同于标准模板的薄 index.vue 风格。

## TEMPLATE_DRIVEN：配置驱动模板

::: warning 识别参考
本模板为识别参考，不是代码生成模板。配置驱动页面已由现有业务模板组件封装，AI **只需生成 config 配置对象**。
:::

页面的 index.vue 极为简单（1-3 行），所有业务逻辑由模板组件内部处理：

```vue
<template>
  <div class="app-container app-page-container">
    <XxxTemplate :config="xxxConfig" />
  </div>
</template>
```

data.ts 只需导出一个 config 对象。

## 领域样例

wl-skills-kit 内置 13 个真实领域样例页面，供 AI 学习和开发参考：

**生产域（8 页）**：
- mmwr-customer-archive — LIST + Tabs + c_formModal
- mmwr-temp-customer-archive — LIST
- mmwr-customer-apply-add — LIST
- mmwr-customer-apply-add-form — FORM_ROUTE
- mmwr-customer-apply-change — LIST
- mmwr-customer-apply-change-form — FORM_ROUTE
- mmwr-customer-apply-change-history — CHANGE_HISTORY
- mmwr-customer-detail — DETAIL_TABS

**销售域（5 页）**：
- domestic-trade-order — LIST 标准列表
- metallurgical-spec — MASTER_DETAIL 上下分栏
- add-demo — FORM_ROUTE 表单页
- billet-flame-cut-plan — LIST 变体
- heat-batch-return — LIST + 自定义弹窗
