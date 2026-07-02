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
| modelValue / v-model | 绑定值（文件信息）   | `string \| array \| object`             | `[]`         |
| readyList            | 已就绪文件列表       | `Array`                                 | -            |
| relativeType         | 业务类型标识         | `string`                                | -            |
| relativeId           | 业务主键 ID          | `string`                                | -            |
| refreshId            | 刷新 ID              | `string`                                | -            |
| accept               | 接受的文件类型       | `string`                                | -            |
| multiple             | 是否多选             | `boolean`                               | -            |
| limit                | 最大上传数量         | `number`                                | -            |
| fileSizeLimit        | 单文件大小限制       | `string`                                | -            |
| showFileSize         | 是否显示文件大小     | `boolean`                               | `true`       |
| addable              | 是否允许添加         | `boolean`                               | `true`       |
| deletable            | 是否允许删除         | `boolean`                               | `true`       |
| downloadable         | 是否允许下载         | `boolean`                               | `true`       |
| disabled             | 是否禁用             | `boolean`                               | -            |
| drag                 | 是否支持拖拽上传     | `boolean`                               | `true`       |
| autoUpload           | 是否自动上传         | `boolean`                               | `false`      |
| listType             | 文件列表类型         | `"picture" \| "picture-card" \| "no-list"` | -         |
| uploadUrl            | 上传地址             | `string`                                | 平台默认接口 |
| listUrl              | 文件列表查询地址     | `string`                                | -            |
| listParam            | 列表查询参数         | `object`                                | -            |
| uploadParam          | 上传额外参数         | `object`                                | -            |
| pathPrefix           | 路径前缀             | `string`                                | -            |
| cardWidth            | 卡片宽度             | `number`                                | -            |
| cardHeight           | 卡片高度             | `number`                                | -            |
| saveBase64           | 是否保存 base64      | `boolean`                               | -            |
| customDownload       | 自定义下载           | `boolean`                               | -            |
| buttonSize           | 按钮尺寸             | `string`                                | -            |
| rules                | 校验规则             | `Array`                                 | -            |

> ⚠️ **没有 `maxSize`/`action`/`showFileList`/`beforeUpload`/`onSuccess`/`onError`/`readonly` 属性**。
> - 文件大小限制用 `fileSizeLimit`（非 maxSize）
> - 上传地址用 `uploadUrl`（非 action）
> - 列表显示由 `listType` 控制（非 showFileList）
> - **`drag` 默认 `true`**（默认已支持拖拽，不是 false）
> - **`autoUpload` 默认 `false`**（默认不自动上传，不是 true）
> - `listType` 无 `"text"`，枚举为 `picture`/`picture-card`/`no-list`

---

## Events 事件

| 事件名              | 说明               | 回调参数 |
| ------------------- | ------------------ | -------- |
| update:modelValue   | v-model 更新时触发 | -        |
| update:readyList    | readyList 更新     | -        |
| success             | 文件上传成功时触发 | -        |
| failed              | 文件上传失败时触发 | -        |
| exceed              | 文件超出限制时触发 | -        |
| remove              | 删除文件时触发     | -        |

> ⚠️ **没有 `change`/`error` 事件**。上传失败监听 `@failed`（不是 `@error`）。

---

## 常见场景

### 场景 1：单图片上传（推荐）

```vue
<jh-file-upload
  v-model="form.avatar"
  accept="image/*"
  list-type="picture-card"
  :file-size-limit="2"
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
  :file-size-limit="20"
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
        fileSizeLimit: "2MB",
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
  :upload-url="uploadUrl"
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
<jh-file-upload v-model="form.fileUrl" :file-size-limit="10" />
```

单文件最大 10MB

---

### 3️⃣ 图片上传推荐配置

```vue
<jh-file-upload
  v-model="form.image"
  accept="image/*"
  list-type="picture-card"
  :file-size-limit="2"
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
  :file-size-limit="2"
/>
```

### 示例 2：附件上传

```vue
<jh-file-upload v-model="form.attachments" multiple :limit="5" :file-size-limit="20" />
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
