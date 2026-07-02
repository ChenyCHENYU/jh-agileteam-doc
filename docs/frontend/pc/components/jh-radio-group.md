# jh-radio-group - 单选框组组件

> 平台统一的单选框组组件，支持静态选项、字典/接口数据源、按钮/边框风格，适用于性别、类型、状态等单选场景

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

## 📦 组件位置

> 来源：`@jhlc/common-core`

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-radio-group />`。

---

## 基本用法

### 1️⃣ 静态选项（最常用）

```vue
<template>
  <jh-radio-group
    v-model="form.gender"
    label="性别"
    datasource-type="static"
    :items="[
      { label: '男', value: 1 },
      { label: '女', value: 2 }
    ]"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

const form = ref({ gender: 1 });
</script>
```

---

### 2️⃣ 按钮风格

```vue
<jh-radio-group v-model="form.status" label="状态" type="button" :items="statusItems" />
```

`type="button"` 渲染为按钮组样式，`type="border"` 为带边框样式。

---

### 3️⃣ 接口数据源

```vue
<jh-radio-group
  v-model="form.typeId"
  label="类型"
  datasource-type="interface"
  :_options-ds-id="dsId"
  :_options-value-attr="['id']"
  :_options-label-attr="['name']"
/>
```

接口数据源通过 `_optionsDsId` 等以 `_options` 开头的属性配置。

---

## Props 属性

### 基础属性

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 标题名称 | `string` | `单选框组` |
| showColon | 冒号，标题与输入框之间加英文冒号 | `boolean` | `true` |
| prop | 字段属性，用于表单校验，确定是哪个字段，选择字段后自动会设置数据绑定 | `Array` | - |
| modelValue / v-model | 数据绑定 | `number \| string \| boolean` | - |
| type | 显示样式 | `string` | - |
| tip | 描述性文案 | `string` | - |
| defaultValue | 默认值 | `string` | - |
| status | 状态 | `string` | `default` |
| size | 尺寸 | `string` | `default` |
| labelWidth | 标签宽度，styleY样式，比如500px,100%,默认450px | `string` | - |
| maxWidth | 最大宽度，styleY样式，比如500px,100%,默认450px | `string` | `450px` |
| viewer | 阅读模式，阅读模式将输入框渲染为span | `boolean` | `false` |
| labelClass | 标签样式 | `Array` | `[]` |
| appendText | 后缀 | `string` | - |
| ctrlHidden | 控件隐藏 | `string` | - |

### 数据配置

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| dataType | 数据类型 | `string` | `number` |
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
> ⚠️ **选项数据源**：静态用 `datasource-type="static"` + `items`；接口用 `datasource-type="interface"` + `_options*` 系列属性。

---

## Events 事件

| 事件名            | 说明               | 回调参数                                     |
| ----------------- | ------------------ | -------------------------------------------- |
| update:modelValue | v-model 更新时触发 | `(value: number \| string \| boolean) => void` |

> 仅声明 `update:modelValue`，无 `change` 事件。值变化请用 `v-model` 或 `@update:model-value`。

---

## 常见场景

### 场景 1：性别单选（静态）

```vue
<jh-radio-group
  v-model="form.gender"
  label="性别"
  datasource-type="static"
  :items="[{ label: '男', value: 1 }, { label: '女', value: 2 }]"
/>
```

### 场景 2：状态按钮组

```vue
<jh-radio-group v-model="form.status" label="状态" type="button" :items="statusItems" />
```

### 场景 3：只读查看

```vue
<jh-radio-group v-model="form.type" label="类型" status="readonly" :items="typeItems" />
```

---

## 注意事项

1. **状态用 `status`，无 `disabled`**
   - `status="disabled"` 禁用，`status="readonly"` 只读，统一用 `status`

2. **值变化只通过 `v-model`**
   - 组件仅声明 `update:modelValue`，没有独立 `change` 事件

3. **数据源两种模式**
   - 静态：`datasource-type="static"` + `items`（`{ label, value }`）
   - 接口：`datasource-type="interface"` + `_optionsDsId` + `_optionsValueAttr`/`_optionsLabelAttr`

4. **label 默认带冒号**
   - `showColon` 默认 `true`，不需冒号传 `:show-colon="false"`

5. **绑定值类型用 `dataType` 控制**
   - `"string"` / `"number"`，影响 v-model 的值类型

**推荐作为平台统一的单选组件使用！**
