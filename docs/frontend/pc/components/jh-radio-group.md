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

| 参数             | 说明                          | 类型                                            | 默认值 |
| ---------------- | ----------------------------- | ----------------------------------------------- | ------ |
| modelValue / v-model | 绑定值                    | `number \| string \| boolean`                   | -      |
| label            | label 文本                    | `string`                                        | `""`   |
| showColon        | label 是否显示冒号            | `boolean`                                       | `true` |
| prop             | 表单字段（校验用）            | `array`                                         | -      |
| type             | 风格类型                      | `"" \| "button" \| "border"`                    | -      |
| size             | 控件尺寸                      | `"small" \| "default" \| "large"`               | `""`   |
| tip              | 提示信息                      | `string`                                        | -      |
| defaultValue     | 默认值                        | `string`                                        | -      |
| status           | 控件状态                      | `"default" \| "disabled" \| "readonly"`         | `""`   |
| labelWidth       | label 宽度                    | `string`                                        | -      |
| maxWidth         | 最大宽度                      | `string`                                        | `""`   |
| labelClass       | label 自定义类名              | `array`                                         | `[]`   |
| appendText       | 后置文本                      | `string`                                        | -      |
| ctrlHidden       | 控件隐藏表达式                | `string`                                        | -      |
| dataType         | 绑定值类型                    | `"string" \| "number"`                          | `""`   |
| viewer           | 是否为只读查看态              | `boolean`                                       | `false` |
| datasourceType   | 数据源类型                    | `"static" \| "interface"`                       | `""`   |
| items            | 静态选项（datasourceType=static） | `array`                                     | -      |
| _optionsDsId     | 接口数据源 ID（interface）    | `string`                                        | -      |
| _optionsDataAttr | 接口数据取值路径              | `array \| string`                               | `[""]` |
| _optionsValueAttr| 选项值字段路径                | `array \| string`                               | `[""]` |
| _optionsLabelAttr| 选项标签字段路径              | `array \| string`                               | `[""]` |
| _optionsValueExpr| 选项值表达式                  | -                                               | -      |
| _optionsLabelExpr| 选项标签表达式                | -                                               | -      |
| _optionsQuery    | 接口查询参数                  | `array`                                         | `[]`   |
| _optionsQueryAttr| 查询参数字段                  | `array`                                         | -      |
| _fixQueryParam   | 固定查询参数                  | `object`                                        | `{}`   |
| fetchDataCb      | 数据获取回调                  | -                                               | -      |

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
