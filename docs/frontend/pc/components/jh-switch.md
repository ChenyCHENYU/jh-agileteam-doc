# jh-switch - 开关组件

> 平台统一的开关组件，支持自定义开关值、文字/图标描述、加载态，适用于启用/禁用、是/否等二态切换场景

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

## 📦 组件位置

> 来源：`@jhlc/common-core`

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-switch />`。

---

## 基本用法

### 1️⃣ 基础开关（最常用）

```vue
<template>
  <jh-switch v-model="form.enabled" label="启用" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const form = ref({ enabled: 1 });
</script>
```

> 默认开关值：开 = `1`，关 = `0`（`activeValue`/`inactiveValue` 默认 `1`/`0`）。

---

### 2️⃣ 自定义开关值（布尔）

```vue
<jh-switch
  v-model="form.locked"
  label="锁定"
  data-type="boolean"
  :active-value="true"
  :inactive-value="false"
/>
```

通过 `dataType`/`activeValue`/`inactiveValue` 控制开关值的类型与具体值。

---

### 3️⃣ 带文字描述

```vue
<jh-switch
  v-model="form.notify"
  label="通知"
  text-type="text"
  active-text="开"
  inactive-text="关"
/>
```

`text-type="text"` 显示开关文字（`active-text`/`inactive-text`）。

---

## Props 属性

| 参数           | 说明                          | 类型                                            | 默认值 |
| -------------- | ----------------------------- | ----------------------------------------------- | ------ |
| modelValue / v-model | 绑定值                  | `string \| number \| boolean`                   | -      |
| label          | label 文本                    | `string`                                        | `""`   |
| showColon      | label 是否显示冒号            | `boolean`                                       | `true` |
| prop           | 表单字段（校验用）            | `array`                                         | -      |
| tip            | 提示信息                      | `string`                                        | -      |
| defaultValue   | 默认值                        | `string`                                        | -      |
| status         | 控件状态                      | `"default" \| "disabled" \| "readonly"`         | `""`   |
| size           | 控件尺寸                      | `"small" \| "default" \| "large"`               | `""`   |
| labelWidth     | label 宽度                    | `string`                                        | -      |
| maxWidth       | 最大宽度                      | `string`                                        | `""`   |
| labelClass     | label 自定义类名              | `array`                                         | `[]`   |
| appendText     | 后置文本                      | `string`                                        | -      |
| width          | 开关宽度                      | `string`                                        | -      |
| ctrlHidden     | 控件隐藏表达式                | `string`                                        | -      |
| openDesc       | 是否显示开关描述              | `boolean`                                       | `true` |
| textType       | 描述类型                      | `"text" \| "icon"`                              | `""`   |
| activeText     | 打开时文字                    | `string`                                        | `""`   |
| inactiveText   | 关闭时文字                    | `string`                                        | `""`   |
| activeIcon     | 打开时图标                    | `string`                                        | `""`   |
| inactiveIcon   | 关闭时图标                    | `string`                                        | `""`   |
| loading        | 是否加载中                    | `boolean`                                       | `false` |
| dataType       | 绑定值类型                    | `"string" \| "number" \| "boolean"`             | `""`   |
| activeValue    | 打开时的值                    | `string \| number \| boolean`                   | `1`    |
| inactiveValue  | 关闭时的值                    | `string \| number \| boolean`                   | `0`    |

> ⚠️ **禁用/只读用 `status`**（`"disabled"` / `"readonly"`），不是 `disabled`。
> ⚠️ **没有 `disabled` 属性**（声明层未声明），统一用 `status`。
> ⚠️ **默认开关值为数字 `1`/`0`**，需布尔值请设 `:active-value="true" :inactive-value="false"`。

---

## Events 事件

| 事件名            | 说明               | 回调参数                                     |
| ----------------- | ------------------ | -------------------------------------------- |
| update:modelValue | v-model 更新时触发 | `(value: string \| number \| boolean) => void` |

> 仅声明 `update:modelValue`，无独立 `change` 事件。值变化请用 `v-model` 或 `@update:model-value`。

---

## 常见场景

### 场景 1：启用/禁用（数字 1/0）

```vue
<jh-switch v-model="form.enabled" label="启用" />
```

### 场景 2：布尔开关

```vue
<jh-switch
  v-model="form.required"
  label="必填"
  data-type="boolean"
  :active-value="true"
  :inactive-value="false"
/>
```

### 场景 3：带文字描述

```vue
<jh-switch
  v-model="form.status"
  label="状态"
  text-type="text"
  active-text="启用"
  inactive-text="停用"
/>
```

### 场景 4：加载中 + 禁用

```vue
<jh-switch v-model="form.sync" label="同步" :loading="syncing" status="disabled" />
```

---

## 注意事项

1. **状态用 `status`，无 `disabled`**
   - `status="disabled"` 禁用，`status="readonly"` 只读
   - 组件未声明 `disabled`，统一用 `status`

2. **默认开关值是数字 `1`/`0`**
   - `activeValue` 默认 `1`，`inactiveValue` 默认 `0`
   - 后端若是布尔字段，务必设 `:active-value="true" :inactive-value="false"`，否则存数字

3. **绑定值类型用 `dataType` 配合**
   - `"string"` / `"number"` / `"boolean"`，需与 `activeValue`/`inactiveValue` 类型一致

4. **值变化只通过 `v-model`**
   - 组件仅声明 `update:modelValue`，没有独立 `change` 事件

5. **label 默认带冒号**
   - `showColon` 默认 `true`，不需冒号传 `:show-colon="false"`

6. **文字/图标描述**
   - `text-type="text"` 显示 `active-text`/`inactive-text`
   - `text-type="icon"` 显示 `active-icon`/`inactive-icon`

**推荐作为平台统一的开关组件使用！**
