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

| 参数          | 说明                       | 类型                                            | 默认值 |
| ------------- | -------------------------- | ----------------------------------------------- | ------ |
| modelValue / v-model | 绑定值               | `string \| array`                               | -      |
| label         | label 文本                 | `string`                                        | `""`   |
| showColon     | label 是否显示冒号         | `boolean`                                       | `true` |
| placeholder   | 占位提示                   | `string`                                        | -      |
| prop          | 表单字段（校验用）         | `array`                                         | -      |
| defaultValue  | 默认值                     | `string`                                        | -      |
| status        | 控件状态                   | `"default" \| "disabled" \| "readonly"`         | `""`   |
| size          | 控件尺寸                   | `"small" \| "default" \| "large"`               | `""`   |
| labelWidth    | label 宽度                 | `string`                                        | -      |
| maxWidth      | 最大宽度                   | `string`                                        | `""`   |
| labelClass    | label 自定义类名           | `array`                                         | `[]`   |
| single        | 是否单选                   | `boolean`                                       | `true` |
| dialogTitle   | 弹窗标题                   | `string`                                        | `""`   |
| dialogWidth   | 弹窗宽度                   | `string`                                        | `""`   |
| url           | 数据接口地址               | `string`                                        | -      |
| method        | 请求方法                   | `string`                                        | -      |
| dsId          | 数据源 ID                  | `string`                                        | -      |
| dataAttr      | 接口数据取值路径           | `array`                                         | `[""]` |
| valueAttr     | 节点值字段路径             | `array`                                         | -      |
| labelAttr     | 节点标签字段路径           | `array`                                         | -      |
| fixQueryParam | 固定查询参数               | `object`                                        | `{}`   |
| query         | 查询参数                   | `array`                                         | -      |
| validFun      | 校验函数                   | -                                               | -      |

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
