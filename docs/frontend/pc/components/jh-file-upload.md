# jh-file-upload - 文件上传组件

> 平台统一的文件上传组件，已集成平台文件系统，支持上传、回显、下载等能力，只需提供业务关联信息即可使用

## 📦 组件位置

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-file-upload />`。

---

## 基本用法

### 1️⃣ 关联业务上传（最常用）

```vue
<template>
  <jh-file-upload relative-type="order" :relative-id="form.id" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const form = ref({
  id: "order_001"
});
</script>
```

> 上传的文件将自动关联到对应业务数据，无需手动处理上传接口

---

### 2️⃣ 表单中使用（新增 / 编辑）

```vue
<jh-file-upload
  relative-type="contract"
  :relative-id="form.id"
  v-model="form.files"
/>
```

---

## Props 属性

| 参数                 | 说明               | 类型                                       | 默认值      |
| -------------------- | ------------------ | ------------------------------------------ | ----------- |
| modelValue / v-model | 文件列表           | `FileItem[] \| string`                     | `[]`        |
| relativeType         | 业务类型标识       | `string`                                   | -           |
| relativeId           | 业务主键ID         | `string \| number`                         | -           |
| limit                | 最大上传数量       | `number`                                   | `10`        |
| disabled             | 是否禁用           | `boolean`                                  | `false`     |
| readonly             | 是否只读           | `boolean`                                  | `false`     |
| listType             | 文件列表类型       | `"picture" \| "picture-card" \| "no-list"` | `"picture"` |
| accept               | 接受的文件类型     | `string`                                   | -           |
| fileSizeLimit        | 文件大小限制       | `string`                                   | -           |
| drag                 | 是否支持拖拽上传   | `boolean`                                  | `true`      |
| multiple             | 是否支持多选       | `boolean`                                  | `true`      |
| autoUpload           | 是否自动上传       | `boolean`                                  | `false`     |
| addable              | 是否允许添加       | `boolean`                                  | `true`      |
| deletable            | 是否允许删除       | `boolean`                                  | `true`      |
| downloadable         | 是否允许下载       | `boolean`                                  | `true`      |
| uploadUrl            | 自定义上传地址     | `string`                                   | -           |
| listUrl              | 自定义列表查询地址 | `string`                                   | -           |
| removeUrl            | 自定义删除地址     | `string`                                   | -           |

> **提示**: 默认使用平台文件系统,无需配置 `uploadUrl` 等参数。

---

## FileItem 数据结构

```ts
interface FileItem {
  id: string;
  name: string;
  url: string;
}
```

---

## Events 事件

| 事件名            | 说明             | 回调参数                                |
| ----------------- | ---------------- | --------------------------------------- |
| update:modelValue | v-model 更新     | `(value: FileItem[] \| string) => void` |
| success           | 文件上传成功     | `() => void`                            |
| failed            | 文件上传失败     | `() => void`                            |
| remove            | 文件删除         | `() => void`                            |
| exceed            | 超出文件数量限制 | `() => void`                            |

---

## 常见场景

### 场景 1：订单附件上传

```vue
<jh-file-upload relative-type="order" :relative-id="orderId" />
```

---

### 场景 2：编辑页文件回显

```vue
<jh-file-upload
  relative-type="order"
  :relative-id="form.id"
  v-model="form.files"
/>
```

---

### 场景 3：详情页只读展示

```vue
<jh-file-upload relative-type="order" :relative-id="detail.id" readonly />
```

---

## 与手动实现对比

### 使用 jh-file-upload（推荐）

```vue
<jh-file-upload relative-type="order" :relative-id="id" />
```

### 手动实现（不推荐）

```vue
<el-upload action="/api/upload" :on-success="handleSuccess" />
```

❌ 需要自己实现上传接口  
❌ 需要维护文件关联关系  
❌ 回显逻辑复杂

---

## 最佳实践

### 1️⃣ 始终使用 relativeType + relativeId

```vue
<jh-file-upload relative-type="order" :relative-id="form.id" />
```

确保文件与业务数据正确关联

---

### 2️⃣ 新增页与编辑页区别

- **新增页**：业务 ID 生成后再显示组件
- **编辑页**：直接传入已有 ID，自动回显

---

### 3️⃣ 只读与编辑分离

```vue
<!-- 编辑 -->
<jh-file-upload ... />

<!-- 详情 -->
<jh-file-upload ... readonly />
```

---

## 注意事项

1. **无需手动处理上传接口**
   - 上传、下载、回显均由组件内部完成

2. **relativeId 必须真实存在**
   - 否则文件无法正确关联

3. **文件删除权限**
   - 受平台权限控制

---

## 编程式调用（FormDialog 工具类）

源码中 `FormDialog` 提供了便捷的附件上传/预览方法，无需手动放置 `<jh-file-upload />`：

### uploadAttach — 上传附件弹窗

```ts
import { FormDialog } from "@jhlc/common-core/src/util/form-dialog";

const handleUpload = async () => {
  const { type, fileList } = await FormDialog.uploadAttach("上传附件", {
    relativeType: "order",
    relativeId: orderId,
    autoUpload: false,  // 点确认后才上传
    limit: 5,
    deletable: true,
    disabled: false,
  });
  if (type === "success") {
    // 上传成功
  }
};
```

### previewAttach — 预览附件弹窗（只读）

```ts
FormDialog.previewAttach("查看附件", "order", orderId);
```

### previewAttachBatch — 批量预览

```ts
FormDialog.previewAttachBatch("查看全部附件", [
  { relativeType: "order", relativeId: id1, title: "订单附件" },
  { relativeType: "contract", relativeId: id2, title: "合同附件" },
]);
```

> **源码位置**: `@jhlc/common-core/src/util/form-dialog.ts`

---

## 🎯 真实项目示例

### 示例 1：合同附件

```vue
<jh-file-upload relative-type="contract" :relative-id="form.id" />
```

### 示例 2：详情页附件

```vue
<jh-file-upload relative-type="contract" :relative-id="detail.id" readonly />
```

---

## 🚀 快速开始

1. 传入 `relativeType`
2. 传入业务主键 `relativeId`
3. 其他逻辑无需关心

**推荐作为平台统一的文件上传组件使用！**
