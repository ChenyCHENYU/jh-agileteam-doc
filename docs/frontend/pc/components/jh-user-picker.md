# jh-user-picker - 用户选择组件

> 平台统一的用户挑选组件，用于选择单个或多个用户，内置用户数据加载与回显逻辑

## 📦 组件位置

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
  userId: ""
});
</script>
```

---

### 2️⃣ 多选用户

```vue
<jh-user-picker v-model="form.userIds" multiple placeholder="请选择相关人员" />
```

---

## Props 属性

| 参数                 | 说明                   | 类型                  | 默认值           |
| -------------------- | ---------------------- | --------------------- | ---------------- |
| modelValue / v-model | 绑定值                 | `string \| string[]`  | -                |
| multiple             | 是否多选               | `boolean`             | `false`          |
| placeholder          | 占位提示               | `string`              | `"请选择用户"`   |
| disabled             | 是否禁用               | `boolean`             | `false`          |
| clearable            | 是否可清空             | `boolean`             | `true`           |
| dataType             | 返回数据类型（多选时） | `"array" \| "string"` | `"array"`        |
| dialogTitle          | 弹窗标题               | `string`              | `"选择用户"`     |
| dialogWidth          | 弹窗宽度               | `string`              | `"800px"`        |
| searchPlaceholder    | 搜索框占位文本         | `string`              | `"请输入用户名"` |

> **重点**: 多选时,`dataType="string"` 会返回逗号分隔的字符串,`dataType="array"` 返回数组。

---

## Events 事件

| 事件名            | 说明                     | 回调参数                              |
| ----------------- | ------------------------ | ------------------------------------- |
| update:modelValue | v-model 更新             | `(value: string \| string[]) => void` |
| confirm           | 确认选择时触发           | `() => void`                          |
| clear             | 清空时触发               | `() => void`                          |
| blur              | 失去焦点时触发           | `() => void`                          |
| closed            | 弹窗关闭时触发           | `() => void`                          |
| remove            | 移除选中项时触发（多选） | `() => void`                          |

---

## 常见场景

### 场景 1：表单负责人选择

```vue
<jh-user-picker v-model="form.ownerId" placeholder="请选择负责人" />
```

---

### 场景 2：查询条件（多选）

```vue
<jh-user-picker v-model="query.userIds" multiple placeholder="请选择用户" />
```

---

### 场景 3：详情页只读展示（配合 jh-text）

```vue
<jh-text type="user" :value="detail.userId" />
```

> ⚠️ `jh-user-picker` 仅用于选择，展示请使用 `jh-text`

### 场景 4：BaseQuery 配置式用法（推荐）

```ts
import { BusLogicDataType } from "@jhlc/types/src/logical-data";

export const queryItems: BaseQueryItemDesc<any>[] = [
  {
    name: "createUserId",
    label: "创建人",
    logicType: BusLogicDataType.user,
    // 自动渲染为 UserPickerComponent
  },
];
```

> **源码映射**: `BusLogicDataType.user` → `UserPickerComponent`

---

## 与手动实现对比

### 使用 jh-user-picker（推荐）

```vue
<jh-user-picker v-model="form.userId" />
```

### 手动实现（不推荐）

```vue
<el-select v-model="form.userId">
  <el-option
    v-for="user in userList"
    :key="user.id"
    :label="user.name"
    :value="user.id"
  />
</el-select>
```

❌ 需要自己加载用户列表  
❌ 需要处理回显  
❌ 每个页面重复实现

---

## 最佳实践

### 1️⃣ 编辑 & 展示分离

| 场景 | 编辑           | 展示    |
| ---- | -------------- | ------- |
| 用户 | jh-user-picker | jh-text |

---

### 2️⃣ 表单中直接使用 v-model

```vue
<jh-user-picker v-model="form.userId" />
```

避免手动监听 `change` 事件

---

### 3️⃣ 多选返回值说明

```ts
// 单选
userId: "u001";

// 多选
userIds: ["u001", "u002"];
```

---

## 注意事项

1. **组件内部已处理用户数据加载**
   - 不需要手动请求接口
   - 支持自动回显

2. **仅返回用户 ID**
   - 展示用户名称请使用 `jh-text`

3. **多选时注意字段类型**
   - 必须使用数组接收

---

## 🎯 真实项目示例

### 示例 1：新增页面

```vue
<jh-user-picker v-model="form.createUserId" />
```

### 示例 2：查询条件

```vue
<jh-user-picker v-model="query.userIds" multiple />
```

---

## 🚀 快速开始

- **单选**：直接使用 v-model
- **多选**：添加 `multiple`
- **展示**：统一使用 `jh-text type="user"`

**推荐作为平台统一的用户选择组件使用！**
