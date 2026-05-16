# jh-select - 字典下拉选择组件

> 集成平台数据字典的下拉选择组件，只需传入字典名称即可自动加载选项，统一字典使用方式

## 📦 组件位置

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-select />`。

## 基本用法

### 根据字典名称加载

```vue
<template>
  <jh-select
    v-model="form.status"
    dict="order_status"
    placeholder="请选择订单状态"
    clearable
  />
</template>

<script setup lang="ts">
import { ref } from "vue";

const form = ref({
  status: ""
});
</script>
```

## Props 属性

| 参数                 | 说明                      | 类型                                                     | 默认值     |
| -------------------- | ------------------------- | -------------------------------------------------------- | ---------- |
| modelValue / v-model | 绑定值                    | `string \| number \| Array<string \| number> \| boolean` | -          |
| dict                 | 字典名称（平台字典 code） | `string`                                                 | -          |
| items                | 静态数据选项              | `Array<{label: string, value: any}>`                     | `[]`       |
| placeholder          | 占位提示                  | `string`                                                 | `"请选择"` |
| clearable            | 是否可清空                | `boolean`                                                | `true`     |
| disabled             | 是否禁用                  | `boolean`                                                | `false`    |
| multiple             | 是否多选                  | `boolean`                                                | `false`    |
| filterable           | 是否可搜索                | `boolean`                                                | `false`    |
| datasourceType       | 数据源类型                | `"static" \| "interface"`                                | `"static"` |
| multiDataFormat      | 多选时的数据格式          | `"string" \| "array"`                                    | `"array"`  |
| collapseTag          | 多选时是否折叠 Tag        | `boolean`                                                | `false`    |
| teleported           | 是否将下拉面板插入 body   | `boolean`                                                | `true`     |

> **重点**:
> - 当 `dict` 属性存在时，组件会自动加载对应字典数据，无需手动设置 `items`
> - 源码中 `BusLogicDataType.dict` 和 `BusLogicDataType.company` 都映射为 `SelectComponent`，即公司选择也使用同一组件

## Events 事件

| 事件名            | 说明         | 回调参数          |
| ----------------- | ------------ | ----------------- |
| change            | 选中值变化   | `(value) => void` |
| update:modelValue | v-model 更新 | `(value) => void` |

## 常见场景

### 场景 1：列表查询条件

```vue
<jh-select v-model="query.status" dict="order_status" placeholder="订单状态" />
```

### 场景 2：表单编辑

```vue
<jh-select v-model="form.type" dict="order_type" :disabled="isView" />
```

### 场景 3：多选字典

```vue
<jh-select v-model="form.tags" dict="order_tag" multiple />
```

### 场景 4：BaseQuery 配置式用法（推荐）

#### 方式一：使用 logicType 自动映射（推荐）

```ts
import { BusLogicDataType } from "@jhlc/types/src/logical-data";

export const queryItems: BaseQueryItemDesc<any>[] = [
  {
    name: "status",
    label: "状态",
    logicType: BusLogicDataType.dict,
    logicValue: "order_status",
    // 自动渲染为 jh-select，自动加载字典 order_status 的选项
  },
  {
    name: "companyId",
    label: "公司",
    logicType: BusLogicDataType.company,
    logicValue: "companyId",
    // BusLogicDataType.company 同样映射为 SelectComponent
  },
];
```

> **源码映射规则**（`getFormItemByLogicType`）：
> - `BusLogicDataType.dict` → `SelectComponent`
> - `BusLogicDataType.company` → `SelectComponent`
> - `BusLogicDataType.enums` → `SelectComponent`

#### 方式二：使用 component 自定义

```ts
export const queryItems: BaseQueryItemDesc<any>[] = [
  {
    name: "orderStatus",
    label: "操作类型",
    placeholder: "请选择操作类型",
    component: () => {
      return {
        tag: "jh-select",
        items: [
          { label: "是", value: 1 },
          { label: "否", value: 0 }
        ]
      };
    }
  },
];
```

#### historyTop 个人偏好（仅对 jh-select 生效）

```ts
{
  name: "customerId",
  label: "客户",
  logicType: BusLogicDataType.dict,
  logicValue: "customer_type",
  historyTop: true,
  // 启用后，用户近期选择过的选项会置顶显示
}
```

### 场景 5：静态 items 方式

```vue
<jh-select
  v-model="form.gender"
  :items="[
    { label: '男', value: 1 },
    { label: '女', value: 2 }
  ]"
  placeholder="请选择性别"
/>
```

---

## 最佳实践

1. **优先使用 logicType + logicValue**
   - 配置式优于模板式，保证字典来源统一
   - `logicType: BusLogicDataType.dict` 自动渲染 jh-select
   - 只有静态选项时才使用 `component` + `items`

2. **配合 jh-text 使用**
   - 列表展示用 `jh-text`
   - 表单编辑用 `jh-select`

3. **字典值以字符串为主**
   - 避免 number/string 混用

## 注意事项

- 字典数据来自平台缓存
- 字典名称必须是平台已配置的 code
- 多选时返回数组

---

✅ **推荐作为平台统一的字典下拉组件使用**
