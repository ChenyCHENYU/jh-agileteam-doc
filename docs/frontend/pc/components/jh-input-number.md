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

### 基础属性

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / v-model | 数据绑定 | `number \| string` | - |
| label | 标题名称 | `string` | `数字输入框` |
| showColon | 标题与输入框之间加英文冒号 | `boolean` | `true` |
| prop | 字段属性，用于表单校验确定字段，选择字段后自动设置数据绑定 | `array` | - |
| placeholder | 占位提示 | `string` | `请输入` |
| tip | 描述性文案 | `string` | - |
| defaultValue | 默认值 | `string` | - |
| status | 状态 | `string` | `default` |
| size | 尺寸 | `string` | `default` |
| labelWidth | 标签宽度（styleY 样式，如 500px、100%，默认 450px） | `string` | - |
| maxWidth | 最大宽度（styleY 样式，如 500px、100%，默认 450px） | `string` | `450px` |
| controlsPosition | 数字选择样式 | `string` | `right` |
| textAlign | 数字对齐方式 | `string` | `left` |
| viewer | 阅读模式，将输入框渲染为 span | `boolean` | `false` |
| labelClass | 标签样式 | `array` | `[]` |
| appendText | 后缀 | `string` | - |
| ctrlHidden | 控件隐藏表达式 | `string` | - |
| step | 间隔（步进值） | `number` | - |
| min | 最小值 | `number` | - |
| max | 最大值 | `number` | - |
| precision | 精度，控制小数点后保留位数 | `number` | - |
| inputType | 后置标签，输入框显示的单位 | `string` | `""` |
| unitOptions | 单位列表 | `array` | - |
| unitValueType | 单位数据绑定方式（separate 分离 / combine 组合绑定数字与单位） | `string` | `separate` |
| unitValue | 单位数据绑定 | `string` | - |

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
