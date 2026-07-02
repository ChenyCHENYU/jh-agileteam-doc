# jh-icon - 图标组件

> 平台统一的图标组件，支持图标名、颜色、尺寸、圆形背景及交互行为（hover 填充等），适用于行内图标操作、状态图标、装饰图标等场景

<AuthorTag :authors="['ZhuXiang', 'XieFei']" />

## 📦 组件位置

> 来源：`@jhlc/common-core`

```ts
import "@jhlc/common-core";
```

组件已全局注册，可直接在模板中使用 `<jh-icon />`。

---

## 基本用法

### 1️⃣ 基础图标（最常用）

```vue
<template>
  <jh-icon icon-name="Search" />
</template>
```

通过 `icon-name` 指定图标，`icon-color` 控制颜色，`icon-size` 控制尺寸。

---

### 2️⃣ 圆形背景图标按钮

```vue
<jh-icon icon-name="Edit" icon-color="#1989fa" radius="50%" behave="hoverFill" />
```

`radius` 设置圆角（如 `"50%"` 圆形），`behave="hoverFill"` 控制 hover 时背景填充。

---

### 3️⃣ 危险删除图标

```vue
<jh-icon icon-name="Delete" hover-bg-color="danger" desc="删除" />
```

`hover-bg-color="danger"` 使 hover 时背景变红色，适合删除类图标。

---

## Props 属性

**基础**

| 参数         | 说明           | 类型      | 默认值        |
| ------------ | -------------- | --------- | ------------- |
| iconName     | 图标           | `string`  | -             |
| iconColor    | 颜色           | `string`  | -             |
| iconSize     | 大小           | `string`  | `"16px"`      |
| radius       | 圆角           | `string`  | `"2"`         |
| behave       | 填充色         | `string`  | `"hoverFill"` |
| hoverBgColor | 悬停态背景颜色 | `string`  | `"info"`      |
| bgColor      | 背景色         | `string`  | -             |
| borderColor  | 边框色         | `string`  | -             |
| desc         | 提示信息       | `string`  | -             |
| disabled     | 禁用           | `boolean` | -             |

> ⚠️ **没有 `name`/`size`/`color` 属性**。属性名为 `iconName`/`iconSize`/`iconColor`（带 `icon` 前缀）。

---

## Events 事件

> 无事件。图标点击使用原生 `@click`。

---

## 常见场景

### 场景 1：工具栏图标操作

```vue
<jh-icon icon-name="Plus" icon-color="#1989fa" behave="hoverFill" @click="onAdd" />
<jh-icon icon-name="Refresh" icon-color="#909399" behave="hoverFill" @click="onRefresh" />
```

### 场景 2：删除行内图标（hover 变红）

```vue
<jh-icon icon-name="Delete" hover-bg-color="danger" behave="hoverFill" @click="onDelete" />
```

### 场景 3：圆形状态图标

```vue
<jh-icon icon-name="Edit" icon-color="#fff" bg-color="#1989fa" radius="50%" icon-size="16px" />
```

---

## 注意事项

1. **属性名带 `icon` 前缀**
   - 用 `iconName` / `iconColor` / `iconSize`，不要写 `name` / `color` / `size`

2. **交互行为用 `behave`**
   - `"hoverFill"`：hover 时填充背景（最常用）
   - `"alwaysFill"`：常驻填充
   - `"borderColor"`：hover 时显示边框

3. **危险操作配 `hover-bg-color="danger"`**
   - 删除类图标建议搭配，hover 时红色背景提示危险

4. **点击用原生 `@click`**
   - 组件未声明自定义事件，直接 `<jh-icon @click="...">`

**推荐作为平台统一的图标组件使用！**
