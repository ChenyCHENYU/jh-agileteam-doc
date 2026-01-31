# jh-file-upload - 文件上传组件

> 平台统一的文件上传组件，支持图片/文件上传、拖拽上传、多文件上传、大文件分片上传等功能

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

## 📦 组件位置

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-file-upload />`。

---

## 基本用法

### 1️⃣ 单文件上传（最常用）

```vue
<template>
  <jh-file-upload v-model="form.fileUrl" placeholder="点击上传文件" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const form = ref({
  fileUrl: "",
});
</script>
```

---

### 2️⃣ 多文件上传

```vue
<jh-file-upload
  v-model="form.fileUrls"
  multiple
  :limit="5"
  placeholder="最多上传5个文件"
/>
```

---

## Props 属性

| 参数                 | 说明                 | 类型                                    | 默认值       |
| -------------------- | -------------------- | --------------------------------------- | ------------ |
| modelValue / v-model | 绑定值（文件 URL）   | `string \| string[]`                    | -            |
| accept               | 接受的文件类型       | `string`                                | `"*"`        |
| multiple             | 是否多选             | `boolean`                               | `false`      |
| limit                | 最大上传数量         | `number`                                | `1`          |
| maxSize              | 单文件最大大小（MB） | `number`                                | `10`         |
| disabled             | 是否禁用             | `boolean`                               | `false`      |
| showFileList         | 是否显示文件列表     | `boolean`                               | `true`       |
| drag                 | 是否支持拖拽上传     | `boolean`                               | `false`      |
| autoUpload           | 是否自动上传         | `boolean`                               | `true`       |
| listType             | 文件列表类型         | `"text" \| "picture" \| "picture-card"` | `"text"`     |
| action               | 上传地址             | `string`                                | 平台默认接口 |
| beforeUpload         | 上传前钩子           | `(file) => boolean \| Promise`          | -            |
| onSuccess            | 上传成功钩子         | `(response, file) => void`              | -            |
| onError              | 上传失败钩子         | `(error, file) => void`                 | -            |

---

## Events 事件

| 事件名            | 说明               | 回调参数                              |
| ----------------- | ------------------ | ------------------------------------- |
| update:modelValue | v-model 更新时触发 | `(value: string \| string[]) => void` |
| change            | 文件状态改变时触发 | `(file, fileList) => void`            |
| success           | 文件上传成功时触发 | `(response, file, fileList) => void`  |
| error             | 文件上传失败时触发 | `(error, file, fileList) => void`     |
| exceed            | 文件超出限制时触发 | `(files, fileList) => void`           |

---

## 常见场景

### 场景 1：单图片上传（推荐）

```vue
<jh-file-upload
  v-model="form.avatar"
  accept="image/*"
  list-type="picture-card"
  :max-size="2"
  placeholder="上传头像"
/>
```

---

### 场景 2：多图片上传

```vue
<jh-file-upload
  v-model="form.images"
  accept="image/*"
  multiple
  :limit="9"
  list-type="picture-card"
  placeholder="最多上传9张图片"
/>
```

---

### 场景 3：文档上传（带限制）

```vue
<jh-file-upload
  v-model="form.docUrl"
  accept=".pdf,.doc,.docx,.xls,.xlsx"
  :max-size="20"
  placeholder="上传文档（最大20MB）"
/>
```

---

### 场景 4：拖拽上传（推荐）

```vue
<jh-file-upload
  v-model="form.fileUrl"
  drag
  placeholder="将文件拖到此处，或点击上传"
/>
```

---

### 场景 5：上传前校验

```vue
<jh-file-upload v-model="form.fileUrl" :before-upload="beforeUpload" />

<script setup lang="ts">
const beforeUpload = (file) => {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    ElMessage.error("只能上传图片文件！");
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage.error("图片大小不能超过 2MB！");
    return false;
  }
  return true;
};
</script>
```

---

### 场景 6：BaseForm 配置式用法（推荐）

```ts
// data.ts 表单项配置
export const formItemsConfig: BaseFormItemDesc<any>[] = [
  {
    name: "avatar",
    label: "头像",
    component: () => {
      return {
        tag: "jh-file-upload",
        accept: "image/*",
        listType: "picture-card",
        maxSize: 2,
      };
    },
  },
];

// form.avatar = "https://example.com/avatar.jpg"
```

---

## 返回值说明

### 单文件上传

```ts
form.fileUrl = "https://example.com/file.pdf";
```

### 多文件上传

```ts
form.fileUrls = [
  "https://example.com/file1.pdf",
  "https://example.com/file2.pdf",
];
```

---

## 与 el-upload 对比

### 使用 jh-file-upload（推荐）

```vue
<jh-file-upload v-model="form.fileUrl" accept="image/*" />
```

✅ 统一上传接口  
✅ 自动处理返回值  
✅ 简化配置  
✅ 风格一致

### 使用 el-upload（不推荐）

```vue
<el-upload
  :action="uploadUrl"
  :on-success="handleSuccess"
  :before-upload="beforeUpload"
  accept="image/*"
>
  <el-button>点击上传</el-button>
</el-upload>

<script setup lang="ts">
const handleSuccess = (response) => {
  form.fileUrl = response.data.url;
};
</script>
```

❌ 需要手动处理返回值  
❌ 需要手动配置接口地址  
❌ 配置繁琐

---

## 最佳实践

### 1️⃣ 限制文件类型（强烈推荐）

```vue
<jh-file-upload
  v-model="form.fileUrl"
  accept=".pdf,.doc,.docx"
  :before-upload="validateFileType"
/>
```

前后端都要校验文件类型

---

### 2️⃣ 限制文件大小（强烈推荐）

```vue
<jh-file-upload v-model="form.fileUrl" :max-size="10" />
```

单文件最大 10MB

---

### 3️⃣ 图片上传推荐配置

```vue
<jh-file-upload
  v-model="form.image"
  accept="image/*"
  list-type="picture-card"
  :max-size="2"
/>
```

---

### 4️⃣ 多文件上传限制数量

```vue
<jh-file-upload
  v-model="form.files"
  multiple
  :limit="5"
  @exceed="handleExceed"
/>

<script setup lang="ts">
const handleExceed = () => {
  ElMessage.warning("最多上传5个文件");
};
</script>
```

---

## 注意事项

1. **v-model 绑定文件 URL**
   - 单文件: `string`
   - 多文件: `string[]`

2. **文件大小限制**
   - 默认单文件最大 10MB
   - 可通过 `maxSize` 调整

3. **文件类型限制**
   - 推荐使用 `accept` 限制
   - 配合 `beforeUpload` 二次校验

4. **上传接口说明**
   - 默认使用平台统一上传接口
   - 可通过 `action` 自定义

5. **大文件上传**
   - 超过 100MB 建议使用分片上传
   - 组件内置分片上传支持

---

## 🎯 真实项目示例

### 示例 1：头像上传

```vue
<jh-file-upload
  v-model="form.avatar"
  accept="image/*"
  list-type="picture-card"
  :max-size="2"
/>
```

### 示例 2：附件上传

```vue
<jh-file-upload v-model="form.attachments" multiple :limit="5" :max-size="20" />
```

### 示例 3：拖拽上传

```vue
<jh-file-upload v-model="form.fileUrl" drag accept=".pdf,.doc,.docx" />
```

---

## 🚀 快速开始

1. 单文件绑定 `string` 字段（如 `fileUrl`）
2. 多文件绑定 `string[]` 字段（如 `fileUrls`）
3. 推荐配置 `accept` 限制文件类型
4. 推荐配置 `maxSize` 限制文件大小
5. 图片上传推荐使用 `list-type="picture-card"`

**推荐作为平台统一的文件上传组件使用！**
