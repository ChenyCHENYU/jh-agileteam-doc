# jh-picker - 关联数据挑选组件

> 平台统一的关联数据挑选组件，通过弹窗 + 表格形式从业务数据源中选择一条或多条数据，适用于关联客户、商品、订单等基础资料/单据选择场景

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

## 📦 组件位置

> 来源：`@jhlc/common-core`

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-picker />`。

---

## 基本用法

### 1️⃣ 单选关联数据（最常用）

```vue
<template>
  <jh-picker
    v-model="form.customerId"
    :list-url="customerApi.list"
    :list-by-ids-url="customerApi.getByIds"
    :value-attr="['id']"
    :label-attr="['name']"
    :data-attr="['data', 'records']"
    :columns="customerColumns"
    :query="customerQueryItems"
    title="选择客户"
    start-placeholder="请选择客户"
  />
</template>

<script setup lang="ts">
const form = ref({ customerId: "" });

const customerColumns = [
  { name: "code", label: "客户编码" },
  { name: "name", label: "客户名称" },
];

const customerQueryItems = [
  { name: "keyword", label: "关键字", placeholder: "编码/名称" },
];
</script>
```

---

### 2️⃣ 多选关联数据

```vue
<jh-picker
  v-model="form.productIds"
  :single="false"
  :list-url="productApi.list"
  :value-attr="['id']"
  :label-attr="['name']"
  :columns="productColumns"
  :query="productQueryItems"
  title="选择商品"
  start-placeholder="请选择商品"
/>
```

> ⚠️ 多选用 `:single="false"`，**没有 `multiple` 属性**。

---

## Props 属性

| 参数                 | 说明                             | 类型                                                                     | 默认值     |
| -------------------- | -------------------------------- | ------------------------------------------------------------------------ | ---------- |
| modelValue / v-model | 绑定值                           | `string \| string[]`                                                     | -          |
| single               | 是否单选（**多选用 `:single="false"`**） | `boolean`                                                        | `true`     |
| placeholder          | 占位提示                         | `string`                                                                 | -          |
| status               | 控件状态                         | `"default" \| "disabled" \| "readonly"`                                  | `"default"`|
| dataType             | 多选时返回数据类型               | `"array" \| "string"`                                                    | -          |
| list                 | 本地静态数据                     | `Array`                                                                  | -          |
| listUrl              | 列表查询接口（**核心数据源配置**） | `string`                                                               | -          |
| listMethod           | 列表查询方式                     | `string`                                                                 | -          |
| listByIdsUrl         | 根据 ID 查询接口（回显）         | `string`                                                                 | -          |
| listByIdsMethod      | 回显请求方式                     | `"param" \| "body"`                                                      | -          |
| listByIdsDsId        | 回显数据源 ID                    | `string`                                                                 | -          |
| listDsId             | 列表数据源 ID                    | `string`                                                                 | -          |
| echoRequestType      | 回显请求类型                     | `"post" \| "get"`                                                        | -          |
| query                | 弹窗内查询条件配置               | `Array`                                                                  | -          |
| columns              | 弹窗内表格列配置                 | `Array`                                                                  | -          |
| title                | 弹窗标题                         | `string`                                                                 | -          |
| width                | 弹窗宽度                         | `string`                                                                 | -          |
| valueAttr            | 值字段路径                       | `string[] \| string`                                                     | -          |
| labelAttr            | 标签字段路径（回显显示）         | `string[] \| string`                                                     | -          |
| dataAttr             | 列表数据字段路径                 | `string[] \| string`                                                     | -          |
| valueExpr            | 值表达式                         | `string`                                                                 | -          |
| labelExpr            | 标签表达式                       | `string`                                                                 | -          |
| fixQueryParam        | 固定查询参数                     | `object`                                                                 | `{}`       |
| showType             | 显示类型                         | `"" \| "button"`                                                         | `""`       |
| showLabel            | 按钮文本（showType="button" 时） | `string`                                                                 | -          |
| buttonType           | 按钮类型                         | `"default" \| "primary" \| "success" \| "info" \| "warning" \| "danger"` | `"default"`|
| buttonIcon           | 按钮图标                         | `"Search" \| "Edit" \| "Delete" \| "Plus" \| "Refresh"`                  | -          |
| showSearchBtn        | 是否显示搜索按钮                 | `boolean`                                                                | `true`     |
| defaultValue         | 默认值                           | `string`                                                                 | -          |
| queryParamType       | 查询参数类型                     | `string`                                                                 | -          |
| echoParamAppends     | 回显参数追加方式                 | `"appends" \| "notAppends"`                                              | -          |

> ⚠️ **没有 `options`/`multiple`/`disabled`/`clearable`/`filterable`/`remote`/`remoteMethod`/`valueKey`/`labelKey` 属性**。数据源用 `listUrl`（接口）或 `list`（本地），字段映射用 `valueAttr`/`labelAttr`/`dataAttr`（非 valueKey/labelKey）。

---

## Events 事件

| 事件名            | 说明           | 回调参数                              |
| ----------------- | -------------- | ------------------------------------- |
| update:modelValue | v-model 更新   | `(value: string \| string[]) => void` |
| change            | 选择变化时触发 | `() => void`                          |
| ok                | 确认选择时触发 | `() => void`                          |
| clear             | 清空时触发     | `() => void`                          |

> ⚠️ **没有 `blur` 事件**。

---

## 常见场景

### 场景 1：选择关联客户（接口数据源）

```vue
<jh-picker
  v-model="form.customerId"
  :list-url="customerApi.list"
  :list-by-ids-url="customerApi.getByIds"
  :value-attr="['id']"
  :label-attr="['name']"
  :data-attr="['data', 'records']"
  :columns="customerColumns"
  :query="customerQueryItems"
  title="选择客户"
/>
```

### 场景 2：本地静态数据

```vue
<jh-picker
  v-model="form.materialId"
  :list="materialList"
  :value-attr="['id']"
  :label-attr="['name']"
  :columns="materialColumns"
  title="选择物料"
/>
```

### 场景 3：按钮模式

```vue
<jh-picker
  v-model="form.userId"
  show-type="button"
  button-type="primary"
  button-icon="Search"
  show-label="选择用户"
  :list-url="userApi.list"
  :value-attr="['id']"
  :label-attr="['name']"
  :columns="userColumns"
  title="选择用户"
/>
```

---

## 关联组件

| 组件          | 说明                           |
| ------------- | ------------------------------ |
| jh-picker     | 平铺列表数据选择（本组件）     |
| jh-tree-picker| 树形数据选择（组织树、分类树）|

---

## 注意事项

1. **数据源必须配置**
   - 接口模式：`listUrl`（列表查询）+ `listByIdsUrl`（ID 回显）+ `valueAttr`/`labelAttr`/`dataAttr`（字段映射）+ `columns`（弹窗表格列）+ `query`（查询条件）
   - 本地模式：`list`（静态数组）+ `valueAttr`/`labelAttr` + `columns`

2. **多选用 `:single="false"`**
   - 不是 `multiple`；多选返回值类型由 `dataType` 控制（`array`/`string`）

3. **字段映射用 attr 系列**
   - `valueAttr`（值）、`labelAttr`（显示标签）、`dataAttr`（列表数据路径）均为数组路径，如 `["data", "records"]`

4. **组件仅返回关联 ID**
   - 其他字段需自行处理或由后端返回

**推荐作为平台统一的关联数据选择组件使用！**
