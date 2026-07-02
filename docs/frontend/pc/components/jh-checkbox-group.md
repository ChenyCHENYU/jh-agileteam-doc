# jh-checkbox-group - 多选框组组件

> 平台统一的多选框组组件，支持静态选项、接口数据源、全选、按钮/边框风格，适用于权限、标签、多类型选择等场景

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

## 📦 组件位置

> 来源：`@jhlc/common-core`

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-checkbox-group />`。

---

## 基本用法

### 1️⃣ 静态选项（最常用）

```vue
<template>
  <jh-checkbox-group
    v-model="form.roles"
    label="角色"
    datasource-type="static"
    :items="[
      { label: '管理员', value: 'admin' },
      { label: '编辑', value: 'editor' },
      { label: '访客', value: 'guest' }
    ]"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

const form = ref({ roles: ['admin'] });
</script>
```

---

### 2️⃣ 带全选

```vue
<jh-checkbox-group v-model="form.perms" label="权限" :has-select-all="true" :items="permItems" />
```

`has-select-all` 开启「全选」选项。

---

### 3️⃣ 按钮风格 + 字符串格式

```vue
<jh-checkbox-group
  v-model="form.tags"
  label="标签"
  type="button"
  data-format="string"
  :items="tagItems"
/>
```

`data-format="string"` 时 v-model 为逗号分隔字符串，`"array"` 时为数组。

---

## Props 属性

### 基础属性

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 标题名称 | `string` | `复选框组` |
| showColon | 冒号，标题与输入框之间加英文冒号 | `boolean` | `true` |
| prop | 字段属性，用于表单校验，确定是哪个字段，选择字段后自动会设置数据绑定 | `Array` | - |
| modelValue / v-model | 数据绑定 | `Array \| string \| number` | - |
| type | 显示样式 | `string` | - |
| tip | 描述性文案 | `string` | - |
| status | 状态 | `string` | `default` |
| size | 尺寸 | `string` | `default` |
| labelWidth | 标签宽度，styleY样式，比如500px,100%,默认450px | `string` | - |
| maxWidth | 最大宽度，styleY样式，比如500px,100%,默认450px | `string` | `450px` |
| viewer | 阅读模式，阅读模式将输入框渲染为span | `boolean` | `false` |
| labelClass | 标签样式 | `Array` | `[]` |
| appendText | 后缀 | `string` | - |
| hasSelectAll | 可全选，提供全选选项工具 | `boolean` | - |

### 数据配置

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| dataFormat | 数据格式 | `string` | `array` |
| dataType | 数据类型 | `string` | `string` |
| datasourceType | 数据来源 | `string` | `static` |
| items | 选项 | `Array` | - |
| _optionsDsId | 查询接口 | `string` | - |
| _optionsDataAttr | 数据属性 | `Array \| string` | `[""]` |
| _optionsValueAttr | 值属性 | `Array \| string` | `[""]` |
| _optionsValueExpr | 值表达式 | `Function` | - |
| _optionsLabelAttr | 标签属性 | `Array \| string` | `[""]` |
| _optionsLabelExpr | 标签表达式 | `Function` | - |
| _fixQueryParam | 固定查询参数 | `object` | `{}` |
| fetchDataCb | 数据获取回调 | `Function` | - |
| _optionsQuery | 接口查询参数 | `Array` | `[]` |
| _optionsQueryAttr | 查询参数字段 | `Array` | - |

> ⚠️ **禁用/只读用 `status`**（`"disabled"` / `"readonly"`），不是 `disabled`。
> ⚠️ **没有 `defaultValue` 属性**（声明层未声明，与单选组不同）。
> ⚠️ **数据源**：静态用 `datasource-type="static"` + `items`；接口用 `datasource-type="interface"` + `_options*` 系列属性。

---

## Events 事件

| 事件名            | 说明               | 回调参数                                  |
| ----------------- | ------------------ | ----------------------------------------- |
| update:modelValue | v-model 更新时触发 | `(value: array \| string \| number) => void` |

> 仅声明 `update:modelValue`，无 `change` 事件。值变化请用 `v-model` 或 `@update:model-value`。

---

## 常见场景

### 场景 1：角色多选（静态）

```vue
<jh-checkbox-group
  v-model="form.roles"
  label="角色"
  datasource-type="static"
  :items="[{ label: '管理员', value: 'admin' }, { label: '编辑', value: 'editor' }]"
/>
```

### 场景 2：权限选择（带全选）

```vue
<jh-checkbox-group v-model="form.perms" label="权限" :has-select-all="true" :items="permItems" />
```

### 场景 3：标签按钮组（字符串格式）

```vue
<jh-checkbox-group
  v-model="form.tags"
  label="标签"
  type="button"
  data-format="string"
  :items="tagItems"
/>
```

### 场景 4：只读查看

```vue
<jh-checkbox-group v-model="form.types" label="类型" status="readonly" :items="typeItems" />
```

---

## 注意事项

1. **状态用 `status`，无 `disabled`**
   - `status="disabled"` 禁用，`status="readonly"` 只读

2. **绑定值格式用 `dataFormat`**
   - `"array"`（默认推荐，v-model 为数组）或 `"string"`（逗号分隔字符串）

3. **全选用 `has-select-all`**
   - 设为 `true` 自动添加「全选」选项

4. **值变化只通过 `v-model`**
   - 组件仅声明 `update:modelValue`，没有独立 `change` 事件

5. **label 默认带冒号**
   - `showColon` 默认 `true`，不需冒号传 `:show-colon="false"`

6. **与单选组差异**
   - `jh-checkbox-group` 多选，绑定值可为数组；`jh-radio-group` 单选
   - 多选组有 `hasSelectAll`/`dataFormat`，单选组有 `defaultValue`

**推荐作为平台统一的多选组件使用！**
