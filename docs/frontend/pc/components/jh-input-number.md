# jh-input-number - 数字输入框组件

> 平台统一的数字输入框组件，支持步进、极值、精度、单位、对齐方式，适用于金额、数量、比例等数值录入场景

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

## 📦 组件位置

> 来源：`@jhlc/common-core`

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-input-number />`。

---

## 基本用法

### 1️⃣ 基础数字输入（最常用）

```vue
<template>
  <jh-input-number v-model="form.age" label="年龄" :min="0" :max="150" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const form = ref({ age: 0 });
</script>
```

---

### 2️⃣ 金额 + 精度 + 后缀

```vue
<jh-input-number
  v-model="form.amount"
  label="金额"
  :precision="2"
  :step="0.01"
  :min="0"
  append-text="元"
/>
```

---

### 3️⃣ 数值 + 单位（联动）

```vue
<jh-input-number
  v-model="form.value"
  v-model:unit-value="form.unit"
  label="时长"
  input-type="unit"
  :unit-options="[{ label: '天', value: 'd' }, { label: '小时', value: 'h' }]"
/>
```

`input-type="unit"` 开启「数值 + 单位」联动，单位通过 `v-model:unit-value` 绑定。

---

## Props 属性

| 参数             | 说明                       | 类型                                    | 默认值 |
| ---------------- | -------------------------- | --------------------------------------- | ------ |
| modelValue / v-model | 绑定值（数值）         | `number \| string`                      | -      |
| label            | label 文本                 | `string`                                | `""`   |
| showColon        | label 是否显示冒号         | `boolean`                               | `true` |
| prop             | 表单字段（校验用）         | `array`                                 | -      |
| placeholder      | 占位提示                   | `string`                                | `""`   |
| tip              | 提示信息                   | `string`                                | -      |
| defaultValue     | 默认值                     | `string`                                | -      |
| status           | 控件状态                   | `"default" \| "disabled" \| "readonly"` | `""`   |
| size             | 控件尺寸                   | `"small" \| "default" \| "large"`       | `""`   |
| labelWidth       | label 宽度                 | `string`                                | -      |
| maxWidth         | 最大宽度                   | `string`                                | `""`   |
| labelClass       | label 自定义类名           | `array`                                 | `[]`   |
| appendText       | 后置文本                   | `string`                                | -      |
| step             | 步进值                     | `number`                                | -      |
| min              | 最小值                     | `number`                                | -      |
| max              | 最大值                     | `number`                                | -      |
| precision        | 数值精度（小数位数）       | `number`                                | -      |
| controlsPosition | 步进按钮位置               | `"left" \| "right"`                     | `""`   |
| textAlign        | 文本对齐                   | `"left" \| "center" \| "right"`         | `""`   |
| inputType        | 输入类型（开启单位模式）   | `"" \| "unit"`                          | `""`   |
| unitValue        | 单位绑定值（配合 unit 模式） | `string`                              | -      |
| unitOptions      | 单位选项                   | `array`                                 | -      |
| unitValueType    | 单位值类型                 | `"separate" \| "combine"`               | `""`   |
| viewer           | 是否为只读查看态           | `boolean`                               | `false` |
| ctrlHidden       | 控件隐藏表达式             | `string`                                | -      |

> ⚠️ **禁用/只读用 `status`**（`"disabled"` / `"readonly"`），不是 `disabled`。
> ⚠️ **没有 `disabled` 属性**（声明层未声明），统一用 `status`。

---

## Events 事件

| 事件名            | 说明                  | 回调参数                         |
| ----------------- | --------------------- | -------------------------------- |
| update:modelValue | v-model 更新时触发    | `(value: number \| string) => void` |
| update:unitValue  | 单位变化时触发        | `(value: string) => void`        |
| comChange         | 值改变时触发          | `() => void`                     |
| blur              | 失去焦点时触发        | `() => void`                     |
| focus             | 获得焦点时触发        | `() => void`                     |

> 注：值变化事件为 `comChange`（组件自定义），不是普通 `change`。

---

## 常见场景

### 场景 1：数量录入（步进 + 极值）

```vue
<jh-input-number v-model="form.qty" label="数量" :min="1" :step="1" :precision="0" />
```

### 场景 2：金额录入（精度 + 后缀）

```vue
<jh-input-number
  v-model="form.price"
  label="单价"
  :precision="2"
  :step="0.01"
  :min="0"
  append-text="元"
/>
```

### 场景 3：只读查看

```vue
<jh-input-number v-model="form.total" label="合计" status="readonly" />
```

### 场景 4：数值 + 单位联动

```vue
<jh-input-number
  v-model="form.value"
  v-model:unit-value="form.unit"
  input-type="unit"
  :unit-options="[{ label: '天', value: 'd' }, { label: '小时', value: 'h' }]"
/>
```

---

## 注意事项

1. **状态用 `status`，无 `disabled`**
   - `status="disabled"` 禁用，`status="readonly"` 只读
   - 组件未声明 `disabled`，统一用 `status`

2. **值变化监听 `@com-change`**
   - 组件值改变事件名为 `comChange`，不是 `change`

3. **单位模式用 `input-type="unit"`**
   - 配合 `v-model:unit-value` 绑定单位，`unit-options` 提供单位选项

4. **label 默认带冒号**
   - `showColon` 默认 `true`，不需冒号传 `:show-colon="false"`

5. **精度与极值**
   - `precision` 控制小数位，`min`/`max` 限制范围，`step` 控制步进

**推荐作为平台统一的数字输入组件使用！**
