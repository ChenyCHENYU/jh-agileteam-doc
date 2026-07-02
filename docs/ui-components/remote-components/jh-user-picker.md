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

> ⚠️ **声明层说明**：`UserPickerComponent.d.ts` 的 props 块为空（`ExtractPropTypes<{}>`），仅通过 `& Record<string, any>` 透传运行时属性。以下为运行时通用透传属性，具体可用性以实际组件为准：

| 参数                 | 说明              | 类型                    | 默认值 |
| -------------------- | ----------------- | ----------------------- | ------ |
| modelValue / v-model | 绑定值（用户 ID） | `string \| string[]`    | -      |
| placeholder          | 占位提示          | `string`                | -      |
| multiple             | 是否多选          | `boolean`               | -      |
| disabled             | 是否禁用          | `boolean`               | -      |

> 说明：`filterable`/`deptId`/`showAvatar`/`loadData` 等属性**未在类型声明中**，但运行时可能由组件内部实现支持。如需使用，请先在项目中验证有效性。

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
