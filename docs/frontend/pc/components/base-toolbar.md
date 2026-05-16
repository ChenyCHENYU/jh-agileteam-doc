# BaseToolbar 工具栏组件

> 来源：`@jhlc/common-core` 远程组件

BaseToolbar 是一个灵活的工具栏组件，用于放置操作按钮，支持左侧和右侧按钮区域、下拉菜单、权限控制、加载状态等功能。

## 📦 导入方式

```typescript
// 全局注册（已在项目中配置）
// 直接使用 <BaseToolbar /> 即可

// 类型导入
import type { ActionButtonDesc, ActionType } from "@jhlc/common-core/src/components/toolbar/type";
```

## 🚀 基本用法

```vue
<template>
  <BaseToolbar :items="toolbarItems" />
</template>

<script setup lang="ts">
import { computed } from "vue";

const toolbarItems = computed(() => [
  {
    name: "add",
    type: "add",
    onClick: () => handleAdd()
  },
  {
    name: "delete",
    type: "delete",
    onClick: () => handleDelete()
  }
]);

const handleAdd = () => console.log("新增");
const handleDelete = () => console.log("删除");
</script>
```

---

## 📋 Props 属性

| 属性名       | 类型                              | 默认值      | 说明           |
| ------------ | --------------------------------- | ----------- | -------------- |
| `items`      | `ActionButtonDesc[]`              | `[]`        | 左侧按钮配置   |
| `rightItems` | `ActionButtonDesc[]`              | `[]`        | 右侧按钮配置   |
| `size`       | `'small' \| 'default' \| 'large'` | `'default'` | 按钮尺寸       |

---

## 📋 ActionType 按钮类型

使用 `type` 属性可以快速设置按钮的图标和样式：

| 类型       | 说明     | 图标             | 样式    |
| ---------- | -------- | ---------------- | ------- |
| `add`      | 新增     | `Plus`           | primary |
| `edit`     | 编辑     | `Edit`           | warning |
| `delete`   | 删除     | `Delete`         | danger  |
| `batchDel` | 批量删除 | `Delete`         | danger  |
| `import`   | 导入     | `Upload`         | info    |
| `export`   | 导出     | `Download`       | warning |
| `query`    | 查询     | `Search`         | primary |
| `reset`    | 重置     | `Refresh`        | -       |
| `print`    | 打印     | `Printer`        | warning |
| `submit`   | 提交     | `CircleCheck`    | primary |
| `finish`   | 完成     | `CircleCheck`    | primary |
| `close`    | 关闭     | `CircleClose`    | info    |
| `cancel`   | 取消     | `CircleClose`    | info    |
| `rollback` | 退回     | `RefreshLeft`    | warning |
| `back`     | 返回     | `ArrowLeft`      | -       |
| `copy`     | 复制     | `CopyDocument`   | -       |
| `view`     | 查看     | `View`           | -       |
| `refresh`  | 刷新     | `Refresh`        | -       |
| `save`     | 保存     | `Document`       | primary |
| `collapse` | 收起     | `DArrowLeft`     | -       |
| `expand`   | 展开     | `DArrowRight`    | -       |
| `log`      | 日志     | `Document`       | -       |
| `prev`     | 上一步   | `ArrowLeftBold`  | warning |
| `next`     | 下一步   | `ArrowRightBold` | primary |
| `confirm`  | 确认     | `Select`         | primary |

---

## 📋 ActionButtonDesc 按钮配置

```typescript
interface ActionButtonDesc {
  // 按钮唯一标识（必填）
  name: string;
  // 按钮类型，会自动设置图标和样式
  type?: ActionType;
  // 自定义标签文本
  label?: string;
  // 自定义图标
  icon?: string;
  // 是否禁用
  disabled?: boolean | (() => boolean);
  // 是否显示
  show?: boolean | (() => boolean);
  // 加载状态
  loading?: boolean | (() => boolean);
  // 点击事件
  onClick?: () => void | Promise<void>;
  // 权限标识
  permission?: string;
  // 下拉子按钮
  children?: ActionButtonDesc[];
  // 是否朴素按钮
  plain?: boolean;
  // 是否自动管理加载状态（点击后自动 loading）
  autoLoading?: boolean;
  // 自定义渲染
  renderNode?: () => VNode;
  // 更多样式
  style?: any;
  // 下拉按钮（当存在 children 时）
  split?: boolean;
}
```

---

## 💡 使用示例

### 基础工具栏

```vue
<template>
  <BaseToolbar :items="toolbarItems" />
</template>

<script setup lang="ts">
import { computed } from "vue";

const toolbarItems = computed(() => [
  {
    name: "add",
    type: "add",
    onClick: handleAdd
  },
  {
    name: "edit",
    type: "edit",
    disabled: () => selectedRows.value.length !== 1,
    onClick: handleEdit
  },
  {
    name: "delete",
    type: "delete",
    disabled: () => selectedRows.value.length === 0,
    onClick: handleDelete
  }
]);
</script>
```

### 左右布局

```vue
<template>
  <BaseToolbar
    :items="leftItems"
    :rightItems="rightItems"
  />
</template>

<script setup lang="ts">
const leftItems = computed(() => [
  { name: "add", type: "add", onClick: handleAdd },
  { name: "delete", type: "batchDel", onClick: handleBatchDelete }
]);

const rightItems = computed(() => [
  { name: "export", type: "export", onClick: handleExport },
  { name: "import", type: "import", onClick: handleImport }
]);
</script>
```

### 自定义图标和标签

```vue
<script setup lang="ts">
const toolbarItems = computed(() => [
  {
    name: "approve",
    label: "审批通过",
    icon: "Select",
    onClick: handleApprove
  },
  {
    name: "reject",
    label: "审批退回",
    icon: "CloseBold",
    onClick: handleReject
  }
]);
</script>
```

### 下拉菜单按钮

```vue
<script setup lang="ts">
const toolbarItems = computed(() => [
  {
    name: "add",
    type: "add",
    onClick: handleAdd
  },
  {
    name: "more",
    label: "更多操作",
    icon: "More",
    children: [
      {
        name: "copy",
        type: "copy",
        label: "复制",
        onClick: handleCopy
      },
      {
        name: "export",
        type: "export",
        label: "导出",
        onClick: handleExport
      },
      {
        name: "print",
        type: "print",
        label: "打印",
        onClick: handlePrint
      }
    ]
  }
]);
</script>
```

### 分裂式下拉按钮

```vue
<script setup lang="ts">
const toolbarItems = computed(() => [
  {
    name: "save",
    type: "save",
    label: "保存",
    split: true,   // 分裂式下拉
    onClick: handleSave,
    children: [
      {
        name: "saveAndNew",
        label: "保存并新增",
        onClick: handleSaveAndNew
      },
      {
        name: "saveAndCopy",
        label: "保存并复制",
        onClick: handleSaveAndCopy
      }
    ]
  }
]);
</script>
```

### 权限控制

```vue
<script setup lang="ts">
const toolbarItems = computed(() => [
  {
    name: "add",
    type: "add",
    permission: "sale:order:add",   // 需要此权限才显示
    onClick: handleAdd
  },
  {
    name: "edit",
    type: "edit",
    permission: "sale:order:edit",
    onClick: handleEdit
  },
  {
    name: "delete",
    type: "delete",
    permission: "sale:order:delete",
    onClick: handleDelete
  }
]);
</script>
```

### 加载状态

```vue
<script setup lang="ts">
import { ref } from "vue";

const saving = ref(false);

const toolbarItems = computed(() => [
  {
    name: "save",
    type: "save",
    loading: () => saving.value,   // 响应式加载状态
    onClick: async () => {
      saving.value = true;
      await save();
      saving.value = false;
    }
  },
  {
    name: "submit",
    type: "submit",
    autoLoading: true,   // 自动管理加载状态
    onClick: async () => {
      await submit();   // 点击后自动 loading，完成后自动恢复
    }
  }
]);
</script>
```

### 动态显示/禁用

```vue
<script setup lang="ts">
import { ref } from "vue";

const selectedRows = ref([]);
const isEditing = ref(false);

const toolbarItems = computed(() => [
  {
    name: "add",
    type: "add",
    show: () => !isEditing.value,   // 编辑时隐藏
    onClick: handleAdd
  },
  {
    name: "edit",
    type: "edit",
    show: () => !isEditing.value,
    disabled: () => selectedRows.value.length !== 1,   // 只选中一条时可用
    onClick: handleEdit
  },
  {
    name: "save",
    type: "save",
    show: () => isEditing.value,   // 编辑时显示
    onClick: handleSave
  },
  {
    name: "cancel",
    type: "cancel",
    show: () => isEditing.value,
    onClick: handleCancel
  }
]);
</script>
```

### 自定义渲染

```vue
<script setup lang="ts">
import { h } from "vue";
import { ElSwitch } from "element-plus";

const autoRefresh = ref(false);

const rightItems = computed(() => [
  {
    name: "autoRefresh",
    renderNode: () => h("div", { class: "flex items-center gap-2" }, [
      h("span", "自动刷新"),
      h(ElSwitch, {
        modelValue: autoRefresh.value,
        "onUpdate:modelValue": (val) => autoRefresh.value = val
      })
    ])
  },
  {
    name: "refresh",
    type: "refresh",
    onClick: handleRefresh
  }
]);
</script>
```

---

## 🎨 与其他组件配合

### 配合 BaseQuery

```vue
<template>
  <div class="page">
    <BaseQuery
      :form="queryParam"
      :items="queryItems"
      @select="handleSearch"
      @reset="handleReset"
    />
    <BaseToolbar :items="toolbarItems" />
    <BaseTable :data="tableData" :columns="columns" />
  </div>
</template>
```

### 在 BaseTable 中使用操作列

```typescript
// 表格列配置中的操作列
{
  name: "",
  label: "操作",
  width: 150,
  actions: [
    { name: "edit", type: "edit" },
    { name: "delete", type: "delete" }
  ]
}
```

---

## ⚠️ 注意事项

1. **使用 computed 包装按钮配置**

   ```typescript
   // ✅ 正确
   const toolbarItems = computed(() => [...]);

   // ❌ 避免
   const toolbarItems = [...];
   ```

2. **disabled/show 使用函数形式**

   ```typescript
   // ✅ 响应式
   disabled: () => selectedRows.value.length === 0

   // ❌ 非响应式（只在初始化时计算一次）
   disabled: selectedRows.value.length === 0
   ```

3. **autoLoading 适用于异步操作**

   ```typescript
   {
     name: "submit",
     autoLoading: true,   // 点击后自动 loading
     onClick: async () => {
       await submitApi();   // 完成后自动恢复
     }
   }
   ```

4. **permission 需要后端配合**

   - 权限标识需要与后端菜单权限配置一致

5. **下拉按钮的 children 中也可以有权限控制**

   ```typescript
   {
     name: "more",
     label: "更多",
     children: [
       { name: "export", permission: "sale:order:export" },
       { name: "print", permission: "sale:order:print" }
     ]
   }
   ```

---

## 📚 相关文档

- [BaseTable 表格组件](../BaseTable/README.md) - 表格操作列按钮
- [BaseQuery 查询组件](../BaseQuery/README.md) - 查询区按钮
- [BaseForm 表单组件](../BaseForm/README.md) - 表单提交按钮
