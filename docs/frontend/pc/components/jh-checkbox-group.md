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

| 参数             | 说明                          | 类型                                            | 默认值 |
| ---------------- | ----------------------------- | ----------------------------------------------- | ------ |
| modelValue / v-model | 绑定值                    | `array \| string \| number`                     | -      |
| label            | label 文本                    | `string`                                        | `""`   |
| showColon        | label 是否显示冒号            | `boolean`                                       | `true` |
| prop             | 表单字段（校验用）            | `array`                                         | -      |
| type             | 风格类型                      | `"" \| "button" \| "border"`                    | -      |
| size             | 控件尺寸                      | `"small" \| "default" \| "large"`               | `""`   |
| tip              | 提示信息                      | `string`                                        | -      |
| status           | 控件状态                      | `"default" \| "disabled" \| "readonly"`         | `""`   |
| labelWidth       | label 宽度                    | `string`                                        | -      |
| maxWidth         | 最大宽度                      | `string`                                        | `""`   |
| labelClass       | label 自定义类名              | `array`                                         | `[]`   |
| appendText       | 后置文本                      | `string`                                        | -      |
| ctrlHidden       | 控件隐藏表达式                | `string`                                        | -      |
| hasSelectAll     | 是否显示全选项                | `boolean`                                       | -      |
| dataFormat       | 绑定值格式                    | `"string" \| "array"`                           | `""`   |
| dataType         | 绑定值类型                    | `"string" \| "number" \| "boolean"`             | `""`   |
| viewer           | 是否为只读查看态              | `boolean`                                       | -      |
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
