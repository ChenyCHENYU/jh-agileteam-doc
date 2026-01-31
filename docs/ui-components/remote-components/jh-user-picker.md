# jh-user-picker - 用户选择组件

> 平台统一的用户选择组件，支持单选/多选、部门筛选、远程搜索，适用于任务分配、权限配置等需要选择用户的场景

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

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
  userId: "",
});
</script>
```

---

### 2️⃣ 多选用户

```vue
<jh-user-picker v-model="form.userIds" multiple placeholder="请选择参与人员" />
```

---

## Props 属性

| 参数                 | 说明              | 类型                    | 默认值         |
| -------------------- | ----------------- | ----------------------- | -------------- |
| modelValue / v-model | 绑定值（用户 ID） | `string \| string[]`    | -              |
| placeholder          | 占位提示          | `string`                | `"请选择用户"` |
| multiple             | 是否多选          | `boolean`               | `false`        |
| disabled             | 是否禁用          | `boolean`               | `false`        |
| clearable            | 是否可清空        | `boolean`               | `true`         |
| filterable           | 是否可搜索        | `boolean`               | `true`         |
| deptId               | 限定部门 ID       | `string`                | -              |
| showAvatar           | 是否显示头像      | `boolean`               | `true`         |
| loadData             | 自定义数据源      | `() => Promise<User[]>` | -              |

---

## Events 事件

| 事件名            | 说明               | 回调参数                              |
| ----------------- | ------------------ | ------------------------------------- |
| update:modelValue | v-model 更新时触发 | `(value: string \| string[]) => void` |
| change            | 选中值改变时触发   | `(value, user) => void`               |
| blur              | 失去焦点时触发     | `() => void`                          |

---

## 常见场景

### 场景 1：任务分配（单选）

```vue
<jh-user-picker v-model="form.assigneeId" placeholder="请选择负责人" />
```

---

### 场景 2：审批流程（多选）

```vue
<jh-user-picker
  v-model="form.approverIds"
  multiple
  placeholder="请选择审批人"
/>
```

---

### 场景 3：BaseQuery 配置式用法（推荐）

```ts
// data.ts 查询项配置
export const queryItemsConfig: BaseQueryItemDesc<any>[] = [
  {
    name: "createBy",
    label: "创建人",
    component: () => {
      return {
        tag: "jh-user-picker",
        placeholder: "请选择创建人",
      };
    },
  },
];

// query.createBy = "1001"
```

---

### 场景 4：限定部门选择用户

```vue
<jh-user-picker
  v-model="form.userId"
  :dept-id="currentDeptId"
  placeholder="选择本部门用户"
/>
```

---

### 场景 5：自定义数据源

```vue
<jh-user-picker v-model="form.userId" :load-data="loadCustomUsers" />

<script setup lang="ts">
const loadCustomUsers = async () => {
  const res = await request({ url: "/api/user/list" });
  return res.data; // 返回用户列表
};
</script>
```

---

## 数据格式说明

### 标准用户格式

```ts
interface User {
  id: string; // 用户ID
  name: string; // 用户名称
  avatar?: string; // 头像URL
  deptName?: string; // 部门名称
  disabled?: boolean; // 是否禁用
}
```

### 返回值说明

- **单选模式**: 返回 `string` 类型的用户 ID
- **多选模式**: 返回 `string[]` 类型的用户 ID 数组

---

## 与普通 el-select 对比

### 使用 jh-user-picker（推荐）

```vue
<jh-user-picker v-model="form.userId" />
```

✅ 统一用户数据源  
✅ 自动显示头像  
✅ 简化配置  
✅ 风格一致  
✅ 默认支持搜索

### 使用 el-select（不推荐）

```vue
<el-select v-model="form.userId" filterable placeholder="请选择用户">
  <el-option
    v-for="user in userList"
    :key="user.id"
    :label="user.name"
    :value="user.id"
  >
    <img :src="user.avatar" style="width: 20px; margin-right: 8px;" />
    {{ user.name }}
  </el-option>
</el-select>
```

❌ 需要自己维护数据源  
❌ 需要手动处理头像显示  
❌ 配置繁琐  
❌ 风格不统一

---

## 最佳实践

### 1️⃣ 统一使用用户 ID（推荐）

```vue
<jh-user-picker v-model="form.userId" />
```

v-model 绑定用户 ID，不要绑定整个对象

---

### 2️⃣ 多选时使用数组字段

```vue
<jh-user-picker v-model="form.userIds" multiple />
```

单选用 `userId: string`，多选用 `userIds: string[]`

---

### 3️⃣ 表单/查询建议 always clearable

```vue
<jh-user-picker v-model="query.userId" clearable />
```

---

### 4️⃣ 限定部门时使用 deptId

```vue
<jh-user-picker
  v-model="form.userId"
  :dept-id="form.deptId"
  placeholder="选择部门内用户"
/>
```

---

## 注意事项

1. **v-model 绑定用户 ID**
   - 单选: `string`
   - 多选: `string[]`

2. **数据源说明**
   - 默认使用平台统一的用户列表接口
   - 也可以通过 `loadData` 自定义

3. **清空时返回值**
   - 单选: 空字符串 `""`
   - 多选: 空数组 `[]`

4. **显示头像**
   - 默认显示用户头像
   - 可通过 `showAvatar=false` 关闭

5. **部门筛选**
   - 通过 `deptId` 限定部门范围
   - 适用于只能选择特定部门用户的场景

---

## 🎯 真实项目示例

### 示例 1：任务分配

```vue
<jh-user-picker v-model="form.assigneeId" placeholder="请选择负责人" />
```

### 示例 2：审批流程（多选）

```vue
<jh-user-picker
  v-model="form.approverIds"
  multiple
  placeholder="请选择审批人（可多选）"
/>
```

### 示例 3：限定部门选择

```vue
<jh-user-picker
  v-model="form.userId"
  :dept-id="form.deptId"
  placeholder="选择本部门用户"
/>
```

---

## 🚀 快速开始

1. 单选绑定 `string` 字段（如 `userId`）
2. 多选绑定 `string[]` 字段（如 `userIds`）
3. 默认使用平台统一用户数据源
4. 默认显示头像和搜索功能
5. 可通过 `deptId` 限定部门范围

**推荐作为平台统一的用户选择组件使用！**
