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

> 以下属性以 `props.ts` 为唯一权威源。

#### 基本属性 · 基础

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |
| forPick | 提供选择 | `boolean` | - |
| showMultiEcho | 多选回显 | `boolean` | `true` |
| customLabel | 自定义标签 | `Function \| string` | - |
| label | 标题名称 | `string` | `""` |
| showColon | 冒号（标题与输入框之间加英文冒号） | `boolean` | `true` |
| prop | 字段属性（用于表单校验，确定是哪个字段，选择字段后自动会设置数据绑定） | `Array` | - |
| modelValue / v-model | 数据绑定 | `string \| Array` | - |
| placeholder | 占位提示 | `string` | `"请选择"` |
| tip | 描述性文案 | `string` | - |
| list | 列表绑定 | `Array` | - |
| defaultValue | 默认值 | `string` | - |
| status | 状态 | `string` | `"default"` |
| size | 尺寸 | `string` | `"default"` |
| labelWidth | 标签宽度（styleY 样式，比如 500px、100%，默认 450px） | `string` | - |
| maxWidth | 最大宽度（styleY 样式，比如 500px、100%，默认 450px） | `string` | `"450px"` |
| viewer | 阅读模式（阅读模式将输入框渲染为 span） | `boolean` | `false` |
| labelClass | 标签样式 | `Array` | `[]` |
| appendText | 后缀 | `string` | - |
| single | 是否单选 | `boolean` | `true` |
| dataType | 数据类型（多选时，字段数据类型，如果是字符串，则是逗号隔开） | `string` | `"array"` |
| validFun | 数据校验（用于校验数据项是否可选，不合法调用 cb(false)，否则调用 cb(true)） | `Function` | - |
| equals | 相等比较 | `Function` | - |
| showType | 显示类型 | `string` | `""` |
| inputable | 显示类型 | `boolean` | `false` |
| showLabel | 按钮名称 | `string` | `"按钮"` |
| buttonType | 按钮类型 | `string` | `"primary"` |
| buttonIcon | 按钮图标 | `string` | - |
| listUrl | 列表接口 | `string` | - |
| listMethod | 列表接口 | `string` | `"get"` |
| listByIdsUrl | 回显接口 | `string \| Function` | - |

#### 基本属性 · 弹窗

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |
| title | 标题名称 | `string` | - |
| width | 弹框宽度 | `string` | - |
| customClass | 弹框自定义类名 | `string` | - |
| showSearchBtn | 是否展示搜索按钮 | `boolean` | `true` |

#### 数据配置 · 数据接口

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |
| tableRenderType | 表格渲染类型 | `string` | - |
| \_ct | 配置方式 | `number` | `1` |
| \_modelSelector | 模型配置（配置模型的默认接口，查询接口为 list，回显接口为 listByKeys） | `string` | - |
| fixQueryParam | 固定查询参数 | `object` | `{}` |
| tableProps | 表格属性 | `object` | - |
| listUrl | 查询接口 | `string` | - |
| listDsId | 查询接口 | `string` | - |
| dataAttr | 数据属性 | `Array \| string` | `[""]` |
| valueAttr | 值属性（将该字段的值绑定到组件上） | `Array \| string` | `[""]` |
| valueExpr | 值表达式（优先级高于属性） | `Function \| string` | - |
| labelAttr | 标签属性（将显示该字段到挑选框输入框中） | `Array \| string` | `[""]` |
| labelExpr | 标签表达式（优先级高于值属性） | `Function \| string` | - |
| listByIdsUrl | 回显接口 | `string \| Function` | - |
| listByIdsDsId | 回显接口（用于在表单编辑页中，显示值属性对应的标签属性值） | `string` | - |
| echoRequestType | 请求方式（回显接口请求方式） | `string` | `"post"` |
| listByIdsMethod | 回显请求（请求体：`["id","id"]`；请求参数：`id="id,id"` 或 `ids="id,id"`） | `string` | `"body"` |
| echoParamAppends | 参数名（回显参数名后是否追加 s：追加 s 为 `ids=xxx`，不追加 s 为 `id=xxx`） | `string` | `"appends"` |

#### 数据配置 · 查询条件

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |
| queryParamType | 参数属性（单个变量如 `username=xxx`，多层变量如 `user.username=xxx`） | `string` | `"singleWord"` |
| query | 查询条件 | `Array` | - |
| queryColumns | 查询列数 | `number` | - |

#### 数据配置 · 显示列

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |
| columns | 显示列 | `Array` | - |

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
