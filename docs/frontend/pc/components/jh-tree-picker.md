# jh-tree-picker - 树选择组件

> 平台统一的树形选择组件，弹窗式树选择，支持单选/多选、接口数据源、字段映射、查询参数，适用于组织、部门、菜单等树状数据选择场景

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

## 📦 组件位置

> 来源：`@jhlc/common-core`

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-tree-picker />`。

---

## 基本用法

### 1️⃣ 单选（最常用）

```vue
<template>
  <jh-tree-picker
    v-model="form.deptId"
    label="部门"
    placeholder="请选择部门"
    :ds-id="dsId"
    :value-attr="['id']"
    :label-attr="['name']"
    :data-attr="['data']"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

const form = ref({ deptId: "" });
</script>
```

`dsId` 指定接口数据源，`value-attr`/`label-attr`/`data-attr` 映射字段。`single` 默认 `true`（单选）。

---

### 2️⃣ 多选

```vue
<jh-tree-picker
  v-model="form.roleIds"
  label="角色"
  :single="false"
  :ds-id="dsId"
  :value-attr="['id']"
  :label-attr="['name']"
/>
```

`:single="false"` 开启多选，v-model 绑定数组。

---

### 3️⃣ 自定义弹窗标题/宽度

```vue
<jh-tree-picker
  v-model="form.userId"
  label="负责人"
  dialog-title="选择负责人"
  dialog-width="720px"
  :single="true"
  :url="apiUrl"
/>
```

---

## Props 属性

> 以下属性以 `props.ts` 为唯一权威源。

#### 基本属性 · 基础

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |
| label | 标题名称 | `string` | `""` |
| showColon | 冒号 | `boolean` | `true` |
| placeholder | 占位提示 | `string` | - |
| prop | 字段属性（用于表单校验，确定是哪个字段，选择字段后自动会设置数据绑定） | `Array` | - |
| modelValue / v-model | 数据绑定 | `string \| Array` | - |
| defaultValue | 默认值 | `string` | - |
| status | 状态 | `string` | `"default"` |
| size | 尺寸 | `string` | `"default"` |
| labelWidth | 标签宽度（styleY 样式，比如 500px、100%，默认 450px） | `string` | - |
| maxWidth | 最大宽度（styleY 样式，比如 500px、100%，默认 450px） | `string` | `"450px"` |
| labelClass | 标签样式 | `Array` | `[]` |
| single | 可多选 | `boolean` | `true` |

#### 基本属性 · 弹窗

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |
| dialogTitle | 标题名称 | `string` | `"请选择"` |
| dialogWidth | 弹框宽度 | `string` | `"856px"` |
| validFun | 数据校验 | `Function` | - |

#### 数据配置 · 数据接口

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |
| url | url | `string` | - |
| method | method | `string` | - |
| dsId | 查询接口 | `string` | - |
| dataAttr | 数据属性 | `Array` | `[""]` |
| valueAttr | 值属性 | `Array` | - |
| labelAttr | 标签属性 | `Array` | - |

#### 数据配置 · 查询条件

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |
| fixQueryParam | 固定查询参数 | `object` | `{}` |
| query | 查询条件 | `Array` | - |

> ⚠️ **禁用/只读用 `status`**（`"disabled"` / `"readonly"`），不是 `disabled`。
> ⚠️ **默认单选**（`single` 默认 `true`）；多选需显式 `:single="false"`。
> ⚠️ **`placeholder` 默认值未定**（声明为 `unknown`），建议显式传入。

---

## Events 事件

| 事件名            | 说明               | 回调参数                         |
| ----------------- | ------------------ | -------------------------------- |
| update:modelValue | v-model 更新时触发 | `(value: string \| array) => void` |
| blur              | 失去焦点时触发     | `() => void`                     |
| select            | 选中节点时触发     | `() => void`                     |

---

## 常见场景

### 场景 1：部门选择（单选）

```vue
<jh-tree-picker
  v-model="form.deptId"
  label="部门"
  placeholder="请选择部门"
  :ds-id="dsId"
  :value-attr="['id']"
  :label-attr="['name']"
/>
```

### 场景 2：角色多选

```vue
<jh-tree-picker
  v-model="form.roleIds"
  label="角色"
  :single="false"
  :ds-id="dsId"
  :value-attr="['id']"
  :label-attr="['name']"
/>
```

### 场景 3：只读查看

```vue
<jh-tree-picker v-model="form.deptName" label="部门" status="readonly" />
```

### 场景 4：带固定查询参数

```vue
<jh-tree-picker
  v-model="form.userId"
  label="负责人"
  :single="true"
  :ds-id="dsId"
  :fix-query-param="{ type: 'leader' }"
  :value-attr="['id']"
  :label-attr="['name']"
/>
```

---

## 注意事项

1. **状态用 `status`，无 `disabled`**
   - `status="disabled"` 禁用，`status="readonly"` 只读

2. **默认单选**
   - `single` 默认 `true`，多选需显式 `:single="false"`（v-model 绑定数组）

3. **数据源字段映射**
   - `dsId`/`url`/`method` 指定数据接口
   - `dataAttr` 取数据列表路径，`valueAttr`/`labelAttr` 映射节点值与标签

4. **v-model 类型**
   - 单选：`string`
   - 多选：`array`

5. **值变化监听**
   - 用 `v-model` 或 `@update:model-value`；选中节点额外可监听 `@select`

6. **label 默认带冒号**
   - `showColon` 默认 `true`，不需冒号传 `:show-colon="false"`

**推荐作为平台统一的树选择组件使用！**
