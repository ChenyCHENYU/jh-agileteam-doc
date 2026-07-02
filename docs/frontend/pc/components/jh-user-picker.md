# jh-user-picker - 用户选择组件

> 平台统一的用户选择组件，适用于任务分配、审批配置等需要选择用户的场景

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

## 📦 组件位置

> 来源：`@jhlc/common-core`

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-user-picker />`。

---

## 基本用法

### 1️⃣ 单选用户（最常用）

```vue
<template>
  <jh-user-picker v-model="form.userId" placeholder="请选择负责人" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const form = ref({
  userId: "",
});
</script>
```

---

### 2️⃣ BaseQuery 配置式用法（推荐）

通过 `logicType: BusLogicDataType.user` 自动映射为 jh-user-picker：

```ts
import { BusLogicDataType } from "@jhlc/types/src/logical-data";

export const queryItems: BaseQueryItemDesc<any>[] = [
  {
    name: "createBy",
    label: "创建人",
    logicType: BusLogicDataType.user,
  },
];
```

> **源码映射规则**（`getFormItemByLogicType`）：`BusLogicDataType.user` → `UserPickerComponent`

---

## Props 属性

> 以下属性以 `props.ts` 为唯一权威源，共 26 项。

#### 基础

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |
| forPick | 隐藏，提供选择 | `boolean` | - |
| suppressBatchSelect | 禁止批量选择 | `boolean` | - |
| isTreeSelector | 树形选择器 | `boolean` | - |
| teleported | 弹出层传送 | `boolean` | - |
| label | 标题名称 | `string` | `""` |
| showColon | 冒号 | `boolean` | `true` |
| placeholder | 占位提示 | `string` | `"请选择或输入"` |
| prop | 字段属性（用于表单校验，确定是哪个字段，选择字段后自动会设置数据绑定） | `Array` | - |
| modelValue / v-model | 数据绑定 | `string \| Array` | - |
| defaultValue | 默认值 | `string` | - |
| status | 状态 | `string` | `"default"` |
| size | 尺寸 | `string` | `"default"` |
| labelWidth | 标签宽度（styleY 样式，比如 500px、100%，默认 450px） | `string` | - |
| maxWidth | 最大宽度（styleY 样式，比如 500px、100%，默认 450px） | `string` | `"450px"` |
| labelClass | 标签样式 | `Array` | `[]` |
| dialogTitle | 弹框标题名称 | `string` | - |
| dialogWidth | 弹框宽度 | `string` | `"835px"` |
| searchPlaceholder | 弹框搜索提示 | `string` | `"搜索用户名或工号"` |
| multiple | 可多选 | `boolean` | `false` |
| maxCollapseTags | 最多显示标签数 | `number` | `5` |
| disabled | 禁用 | `boolean` | `null` |
| viewer | 阅读模式 | `boolean` | - |
| dataType | 数据类型（多选时，字段数据类型，如果是字符串，则是逗号隔开） | `string` | `"array"` |
| clearable | 可清除 | `boolean` | - |
| optionList | 可选值列表 | `Array` | - |
| queryMethod | 自定义搜索 | `Function` | - |

---

## Events 事件

| 事件名            | 说明               | 回调参数 |
| ----------------- | ------------------ | -------- |
| confirm           | 确认选择时触发     | -        |
| clear             | 清空时触发         | -        |
| blur              | 失去焦点时触发     | -        |
| closed            | 弹窗关闭时触发     | -        |
| remove            | 移除选项时触发     | -        |

> ⚠️ **没有 `update:modelValue`/`change` 事件**（声明层未声明）。值变化监听请用 `confirm`/`remove`。

---

## 常见场景

### 场景 1：任务分配（单选）

```vue
<jh-user-picker v-model="form.assigneeId" placeholder="请选择负责人" />
```

### 场景 2：BaseQuery 查询条件

```ts
export const queryItems: BaseQueryItemDesc<any>[] = [
  {
    name: "createBy",
    label: "创建人",
    logicType: BusLogicDataType.user,
  },
];
```

---

## 注意事项

1. **v-model 绑定用户 ID**
   - 单选: `string`
   - 多选: `string[]`

2. **推荐用 logicType 配置式**
   - 在 BaseQuery/BaseForm 中用 `logicType: BusLogicDataType.user`，自动映射为 jh-user-picker，无需手写 `component`

3. **事件用 confirm/clear/remove**
   - 组件确认选择后触发 `confirm`；清空触发 `clear`；移除单条触发 `remove`

**推荐作为平台统一的用户选择组件使用！**
