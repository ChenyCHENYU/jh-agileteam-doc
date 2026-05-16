# c_formModal - 通用表单弹窗组件

> 🎯 支持新增、编辑、详情三种模式的通用业务组件

## 📖 组件说明

这是一个高度可复用的表单弹窗组件，抽象了常见的 CRUD 场景中的表单交互逻辑。通过配置化的方式，快速实现新增、编辑、查看详情等功能，避免每个页面重复编写相同的弹窗代码。

## ✨ 核心特性

- ✅ **三种模式**：新增（add）、编辑（edit）、详情（view）
- ✅ **配置驱动**：通过 `modalConfig` 对象配置所有行为
- ✅ **自动标题**：根据模式自动生成标题（新增/编辑/查看 + titlePrefix）
- ✅ **智能按钮**：编辑模式显示"取消/确定"，详情模式显示"关闭"
- ✅ **表单校验**：继承 `AbstractFormHook`，自动支持表单验证
- ✅ **异步请求**：使用 async/await 扁平化异步代码
- ✅ **类型安全**：完整的 TypeScript 类型定义

## 📦 文件结构

```
c_formModal/
├── index.vue        # 视图层（模板 + Props 定义）
├── data.ts          # 数据逻辑层（Hook 创建 + 业务逻辑）
├── index.scss       # 样式层
└── README.md        # 使用文档
```

## 🚀 快速开始

### 1️⃣ 在 data.ts 中配置

```typescript
// src/views/your-module/data.ts
import type { BaseFormItemDesc } from "@jhlc/common-core/src/components/form/common/type";

export const modalConfig = {
  titlePrefix: "内贸订单", // 标题前缀
  width: "850px", // 弹窗宽度
  columns: 2, // 表单列数
  labelWidth: "110px", // 标签宽度
  formItems: [
    // 表单字段配置
    {
      name: "foreignTradeOrderNo",
      label: "外贸订单号",
      required: true,
      placeholder: "请输入外贸订单号"
    },
    {
      name: "period",
      label: "周期",
      required: true,
      placeholder: "请选择"
    }
    // ... 更多字段
  ] as BaseFormItemDesc<any>[],
  api: {
    // API 路径配置
    getById: "/api/your-module/getOneById",
    save: "/api/your-module/save",
    update: "/api/your-module/update"
  }
};
```

### 2️⃣ 在 index.vue 中使用

```vue
<template>
  <div>
    <!-- 你的列表页面 -->
    <BaseTable :data="list" />

    <!-- 表单弹窗 -->
    <c_formModal ref="modalRef" v-bind="modalConfig" @ok="select" />
  </div>
</template>

<script setup lang="ts">
import c_formModal from "@/components/local/c_formModal/index.vue";
import { modalConfig } from "./data";

const modalRef = ref<InstanceType<typeof c_formModal>>();

// 新增
function handleAdd() {
  modalRef.value?.open();
}

// 编辑
function handleEdit(id: string) {
  modalRef.value?.edit(id);
}

// 查看详情
function handleView(id: string) {
  modalRef.value?.view(id);
}

// 刷新列表
function select() {
  // 重新加载列表数据
}
</script>
```

## 🔧 Props 配置

| 参数          | 类型                 | 必填 | 默认值  | 说明             |
| ------------- | -------------------- | ---- | ------- | ---------------- |
| `formItems`   | `BaseFormItemDesc[]` | ✅   | -       | 表单字段配置数组 |
| `api`         | `ModalApi`           | ✅   | -       | API 路径配置对象 |
| `width`       | `string`             | ❌   | `850px` | 弹窗宽度         |
| `columns`     | `number`             | ❌   | `2`     | 表单列数         |
| `labelWidth`  | `string`             | ❌   | `110px` | 标签宽度         |
| `titlePrefix` | `string`             | ❌   | `数据`  | 标题前缀         |

### ModalApi 类型

```typescript
interface ModalApi {
  getById: string; // 获取详情接口
  save: string; // 新增保存接口
  update: string; // 编辑更新接口
}
```

## 📡 事件

| 事件名 | 参数 | 说明                         |
| ------ | ---- | ---------------------------- |
| `ok`   | -    | 保存成功后触发，用于刷新列表 |

## 🎯 暴露方法

| 方法名             | 参数           | 返回值          | 说明                 |
| ------------------ | -------------- | --------------- | -------------------- |
| `open()`           | -              | `void`          | 打开新增弹窗         |
| `edit(id: string)` | `id` - 数据 ID | `Promise<void>` | 打开编辑弹窗         |
| `view(id: string)` | `id` - 数据 ID | `Promise<void>` | 打开详情弹窗（只读） |

## 💡 使用场景

### 场景 1：标准 CRUD 页面

适用于大多数列表页面，包含新增、编辑、删除、查看详情功能。

```typescript
// 工具栏按钮
const toolbars = [
  { label: "新增", icon: "Plus", onClick: () => modalRef.value?.open() },
  {
    label: "编辑",
    icon: "Edit",
    onClick: () => modalRef.value?.edit(selectedId)
  },
  {
    label: "查看",
    icon: "View",
    onClick: () => modalRef.value?.view(selectedId)
  }
];
```

### 场景 2：审批流程页面

详情模式展示数据，编辑模式修改数据。

```typescript
// 查看待审批数据
modalRef.value?.view(taskId);

// 修改后重新提交
modalRef.value?.edit(taskId);
```

### 场景 3：多步骤表单

结合其他组件，实现复杂的表单交互。

## 📊 性能对比

| 项目               | 传统方式 | 使用 c_formModal | 节省               |
| ------------------ | -------- | ---------------- | ------------------ |
| **Modal.vue**      | 178 行   | **0 行**（删除） | -178 行            |
| **modalConfig**    | -        | 66 行            | +66 行             |
| **每个页面净节省** | 178 行   | 66 行            | **-112 行 (-63%)** |

## 🔍 工作原理

1. **配置解析**：通过 `v-bind="modalConfig"` 传递所有配置到组件
2. **Hook 创建**：`createFormModal()` 工厂函数创建 `AbstractFormHook` 实例
3. **模式切换**：根据 `mode` 状态（add/edit/view）调整 UI 和行为
4. **异步请求**：使用 async/await 处理表单保存和数据加载
5. **事件通知**：操作完成后通过 `emit('ok')` 通知父组件刷新列表

## ⚠️ 注意事项

1. **API 规范**：后端接口需要遵循统一的响应格式 `{code, message, data}`
2. **字段类型**：`formItems` 必须是 `BaseFormItemDesc<any>[]` 类型
3. **ID 参数**：`edit()` 和 `view()` 方法的 `id` 参数会作为查询参数传递给 `getById` 接口
4. **表单校验**：字段的 `required` 属性会自动生成必填校验规则

## 🎨 自定义扩展

### 修改样式

编辑 [index.scss](index.scss) 文件：

```scss
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 10px; // 添加内边距
}
```

### 扩展功能

在 [data.ts](data.ts) 中新增方法：

```typescript
export function createFormModal(/* ... */) {
  const Page = new (class extends AbstractFormHook {
    // 新增自定义方法
    async deleteAttachment(id: string) {
      await axios.delete(`/api/attachment/${id}`);
    }
  })();

  return Page.create();
}
```

