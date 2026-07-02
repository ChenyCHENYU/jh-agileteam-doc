# jh-dept-picker - 部门选择组件

> 平台统一的部门选择组件，支持单选/多选、组织机构树选择，适用于人员归属部门选择、权限部门绑定等场景

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

## 📦 组件位置

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-dept-picker />`。

---

## 基本用法

### 1️⃣ 单选部门（最常用）

```vue
<template>
  <jh-dept-picker v-model="form.deptId" placeholder="请选择所属部门" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const form = ref({
  deptId: "",
});
</script>
```

---

### 2️⃣ 多选部门

```vue
<jh-dept-picker v-model="form.deptIds" multiple placeholder="请选择授权部门" />
```

---

## Props 属性

> 以下属性以 `props.ts` 为唯一权威源。

#### 基本属性 · 基础

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |
| forPick | 隐藏，提供选择 | `boolean` | - |
| label | 标题名称 | `string` | `""` |
| showColon | 冒号 | `boolean` | `true` |
| placeholder | 占位提示 | `string` | `"请选择"` |
| prop | 字段属性（用于表单校验，确定是哪个字段，选择字段后自动会设置数据绑定） | `Array` | - |
| modelValue / v-model | 数据绑定 | `string \| Array` | - |
| defaultValue | 默认值 | `string` | - |
| status | 状态 | `string` | `"default"` |
| size | 尺寸 | `string` | `"default"` |
| labelWidth | 标签宽度（styleY 样式，比如 500px、100%，默认 450px） | `string` | - |
| maxWidth | 最大宽度（styleY 样式，比如 500px、100%，默认 450px） | `string` | `"450px"` |
| labelClass | 标签样式 | `Array` | `[]` |
| multiple | 可多选 | `boolean` | `false` |
| dataType | 数据类型（多选时，字段数据类型，如果是字符串，则是逗号隔开） | `string` | `"array"` |
| disabled | 禁用 | `boolean` | `false` |
| filterDept | 过滤初始部门 | `Function` | - |

#### 基本属性 · 弹窗

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |
| dialogTitle | 标题名称 | `string` | - |
| dialogWidth | 弹框宽度 | `string` | `"1050px"` |
| searchPlaceholder | 搜索提示 | `string` | `"搜索部门"` |

> ⚠️ **没有 `clearable`/`checkStrictly`/`filterable`/`loadData` 属性**。父子节点关联由组件内部树控件决定，没有 `checkStrictly` 开关。

---

## Events 事件

| 事件名            | 说明               | 回调参数 |
| ----------------- | ------------------ | -------- |
| update:modelValue | v-model 更新时触发 | -        |
| confirm           | 确认选择时触发     | -        |
| clear             | 清空时触发         | -        |
| closed            | 弹窗关闭时触发     | -        |
| remove            | 移除选项时触发     | -        |

> ⚠️ **没有 `change`/`blur` 事件**。值变化监听请用 `confirm`/`remove`。

---

## 常见场景

### 场景 1：表单录入（单选）

```vue
<jh-dept-picker v-model="form.deptId" placeholder="请选择所属部门" />
```

---

### 场景 2：权限配置（多选）

```vue
<jh-dept-picker
  v-model="form.authDeptIds"
  multiple
  placeholder="请选择授权部门"
/>
```

---

### 场景 3：BaseQuery 配置式用法（推荐）

```ts
// data.ts 查询项配置
export const queryItemsConfig: BaseQueryItemDesc<any>[] = [
  {
    name: "deptId",
    label: "部门",
    component: () => {
      return {
        tag: "jh-dept-picker",
        placeholder: "请选择部门",
      };
    },
  },
];

// query.deptId = "1001"
```

---

### 场景 4：严格模式（禁止父子联动）

```vue
<jh-dept-picker
  v-model="form.deptId"
  check-strictly
  placeholder="选择单个部门（不联动）"
/>
```

当 `checkStrictly=true` 时，父子节点互不关联，适用于必须选择具体部门而不是部门组的场景。

---

### 场景 5：自定义数据源

```vue
<jh-dept-picker v-model="form.deptId" :load-data="loadCustomDeptTree" />

<script setup lang="ts">
const loadCustomDeptTree = async () => {
  const res = await request({ url: "/api/dept/tree" });
  return res.data; // 返回树形结构
};
</script>
```

---

## 数据格式说明

### 标准树节点格式

```ts
interface TreeNode {
  id: string; // 部门ID
  label: string; // 部门名称
  children?: TreeNode[]; // 子节点
  disabled?: boolean; // 是否禁用
}
```

### 返回值说明

- **单选模式**: 返回 `string` 类型的部门 ID
- **多选模式**: 返回 `string[]` 类型的部门 ID 数组

---

## 与普通 el-tree-select 对比

### 使用 jh-dept-picker（推荐）

```vue
<jh-dept-picker v-model="form.deptId" />
```

✅ 统一部门数据源  
✅ 简化配置  
✅ 风格一致  
✅ 默认支持搜索

### 使用 el-tree-select（不推荐）

```vue
<el-tree-select
  v-model="form.deptId"
  :data="deptTree"
  filterable
  placeholder="请选择部门"
/>
```

❌ 需要自己维护数据源  
❌ 配置繁琐  
❌ 风格不统一

---

## 最佳实践

### 1️⃣ 统一使用部门 ID（推荐）

```vue
<jh-dept-picker v-model="form.deptId" />
```

v-model 绑定部门 ID，不要绑定整个对象

---

### 2️⃣ 多选时使用数组字段

```vue
<jh-dept-picker v-model="form.deptIds" multiple />
```

单选用 `deptId: string`，多选用 `deptIds: string[]`

---

### 3️⃣ 表单/查询建议 always clearable

```vue
<jh-dept-picker v-model="query.deptId" clearable />
```

---

### 4️⃣ 权限场景建议关闭严格模式

```vue
<jh-dept-picker v-model="form.authDeptIds" multiple :check-strictly="false" />
```

默认允许父子联动，选择父节点自动包含所有子节点

---

## 注意事项

1. **v-model 绑定部门 ID**
   - 单选: `string`
   - 多选: `string[]`

2. **数据源说明**
   - 默认使用平台统一的部门树接口
   - 也可以通过 `loadData` 自定义

3. **清空时返回值**
   - 单选: 空字符串 `""`
   - 多选: 空数组 `[]`

4. **checkStrictly 使用场景**
   - `false`（默认）: 父子联动，适合权限场景
   - `true`: 严格模式，适合必须选择具体部门的场景

---

## 🎯 真实项目示例

### 示例 1：人员归属部门

```vue
<jh-dept-picker v-model="form.deptId" placeholder="请选择所属部门" />
```

### 示例 2：角色授权部门（多选）

```vue
<jh-dept-picker
  v-model="form.authDeptIds"
  multiple
  placeholder="请选择授权部门"
/>
```

---

## 🚀 快速开始

1. 单选绑定 `string` 字段（如 `deptId`）
2. 多选绑定 `string[]` 字段（如 `deptIds`）
3. 默认使用平台统一部门树数据源
4. 支持搜索、清空、禁用等常用功能

**推荐作为平台统一的部门选择组件使用！**
