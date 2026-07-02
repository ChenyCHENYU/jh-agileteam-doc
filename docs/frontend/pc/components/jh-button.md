# jh-button - 按钮组件

> 平台统一的按钮组件，支持类型、形状、图标、链接模式，适用于表单提交、工具栏操作、列表行内操作等场景

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

## 📦 组件位置

> 来源：`@jhlc/common-core`

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-button />`。

---

## 基本用法

### 1️⃣ 主要按钮（最常用）

```vue
<template>
  <jh-button type="primary" @click="onSave">保存</jh-button>
  <jh-button @click="onCancel">取消</jh-button>
</template>
```

---

### 2️⃣ 带图标的按钮

```vue
<jh-button type="primary" icon="Plus">新增</jh-button>
<jh-button type="danger" icon="Delete">删除</jh-button>
```

`icon` 仅支持内置枚举：`"Search" | "Edit" | "Delete" | "Plus" | "Refresh"`。

---

### 3️⃣ 链接按钮 / 跳转

```vue
<jh-button link type="primary" href="https://example.com" target="_blank">
  查看文档
</jh-button>
```

---

## Props 属性

| 参数     | 说明                       | 类型                                                                                       | 默认值 |
| -------- | -------------------------- | ------------------------------------------------------------------------------------------ | ------ |
| text     | 按钮文本（也可用默认插槽） | `string`                                                                                   | -      |
| type     | 按钮类型                   | `"primary" \| "default" \| "success" \| "info" \| "warning" \| "danger"`                   | `""`   |
| size     | 按钮尺寸                   | `"small" \| "default" \| "large"`                                                          | `""`   |
| icon     | 内置图标                   | `"Search" \| "Edit" \| "Delete" \| "Plus" \| "Refresh"`                                    | -      |
| shape    | 形状                       | `"none" \| "round" \| "circle"`                                                            | `""`   |
| round    | 是否圆角                   | `boolean`                                                                                  | -      |
| circle   | 是否圆形                   | `boolean`                                                                                  | -      |
| link     | 是否为链接模式             | `boolean`                                                                                  | -      |
| isText   | 是否为文字按钮             | `boolean`                                                                                  | -      |
| href     | 跳转地址（链接模式生效）   | `string`                                                                                   | -      |
| target   | 跳转方式                   | `"_blank" \| "_self"`                                                                      | `""`   |
| disabled | 是否禁用                   | `boolean`                                                                                  | -      |

> ⚠️ **没有 `loading`/`plain`/`nativeType` 属性**（声明层未声明）。
> - 禁用用 `disabled`
> - 图标仅限内置枚举，自定义图标请用插槽或 jh-icon

---

## Events 事件

> 无事件。按钮点击使用原生 `@click`，组件本身不抛自定义事件。

---

## 常见场景

### 场景 1：表单底部操作

```vue
<jh-button type="primary" @click="onSave">保存</jh-button>
<jh-button @click="onReset">重置</jh-button>
<jh-button type="danger" @click="onDelete">删除</jh-button>
```

### 场景 2：工具栏操作（带图标）

```vue
<jh-button type="primary" icon="Plus">新增</jh-button>
<jh-button icon="Refresh">刷新</jh-button>
<jh-button icon="Search">查询</jh-button>
```

### 场景 3：列表行内文字操作

```vue
<jh-button link type="primary" icon="Edit">编辑</jh-button>
<jh-button link type="danger" icon="Delete">删除</jh-button>
```

---

## 注意事项

1. **type 决定颜色**
   - `primary`（主操作）/ `danger`（危险/删除）/ `success` / `warning` / `info` / `default`
   - 不传 `type` 即默认样式

2. **图标仅限内置枚举**
   - `icon` 取值 `"Search" | "Edit" | "Delete" | "Plus" | "Refresh"`
   - 需要其它图标请用 `<jh-icon />` 配合或插槽

3. **点击事件用原生 `@click`**
   - 组件未声明自定义事件，直接 `<jh-button @click="...">`

4. **链接模式用 `link` + `href`**
   - `link` 开启链接样式，`href`/`target` 控制跳转

**推荐作为平台统一的按钮组件使用！**
