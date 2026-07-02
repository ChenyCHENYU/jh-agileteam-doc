# jh-text - 文本显示组件

> 平台统一的文本显示组件，支持富文本渲染、多行省略、字号字重控制，适用于列表、详情等需要展示文本的场景

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

## 📦 组件位置

> 来源：`@jhlc/common-core`

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-text />`。

---

## 基本用法

### 1️⃣ 基本显示（最常用）

```vue
<template>
  <jh-text :content="detail.customerName" />
</template>
```

---

### 2️⃣ 多行省略

```vue
<!-- 超过 2 行自动省略 -->
<jh-text :content="detail.description" :rows="2" format="ellipsis" />
```

---

### 3️⃣ 富文本渲染

```vue
<jh-text :content="richTextHtml" format="html" />
```

---

## Props 属性

| 参数    | 说明                                       | 类型                                                          | 默认值     |
| ------- | ------------------------------------------ | ------------------------------------------------------------- | ---------- |
| content | 显示内容                                   | `string \| number \| date \| array`                           | -          |
| format  | 渲染格式                                   | `"default" \| "ellipsis" \| "html"`                           | `"default"`|
| rows    | 多行省略行数（format="ellipsis" 时生效）   | `number`                                                      | `1`        |
| fontSize | 字号                                      | `"extra-small" \| "small" \| "base" \| "medium" \| "large" \| "extra-large"` | -  |
| fontWeight | 字重                                     | `"light" \| "regular" \| "medium" \| "semi"`                  | -          |

> ⚠️ **没有 `maxLength`/`ellipsis`(boolean)/`tooltip`/`copyable`/`type`/`tag` 属性**。
> - 文本省略用 `format="ellipsis"` + `rows`（多行），不是 `maxLength` + `ellipsis`（boolean）
> - 富文本用 `format="html"`，不是单独属性
> - 字号字重用 `fontSize`/`fontWeight`，不是 `type`（颜色）

---

## Events 事件

> 无事件。`jh-text` 是纯展示组件，不向外抛事件（没有 `copy` 等事件）。

---

## 常见场景

### 场景 1：详情页文本展示

```vue
<jh-text :content="detail.remark" />
```

### 场景 2：长文本多行省略

```vue
<jh-text :content="detail.description" :rows="3" format="ellipsis" />
```

### 场景 3：富文本内容渲染

```vue
<jh-text :content="notice.content" format="html" />
```

### 场景 4：列表单元格展示（BaseTable 配合）

```typescript
// 在 TableColumnDesc 中用 formatter 展示纯文本
{
  name: "remark",
  label: "备注",
  formatter: (row) => row.remark || "-",
}
```

---

## 注意事项

1. **文本省略用 `format="ellipsis"` + `rows`**
   - 不是 `maxLength`（不存在）或 `ellipsis`（boolean，不存在）
   - `rows` 控制显示行数，超出部分省略

2. **富文本用 `format="html"`**
   - 会解析 HTML 标签渲染，注意 XSS 风险（确保内容可信）

3. **content 支持多类型**
   - `string` / `number` / `date` / `array`，组件内部做相应格式化

**推荐作为平台统一的文本展示组件使用！**
