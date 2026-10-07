---
description: "本项目采用 UnoCSS 作为主要样式方案，提供快速开发体验"
---

# UnoCSS 样式方案

> 本项目采用 **UnoCSS** 作为主要样式方案，提供快速开发体验

## 📦 技术栈

| 工具      | 版本   | 用途                             |
| ------------- | ------ | -------------------------------- |
| UnoCSS        | Latest | 原子化 CSS，快速布局和通用样式   |

---

## 🎯 核心原则

### 什么时候用 UnoCSS？

✅ **推荐场景**

- 快速布局：`flex` `grid` `p-4` `m-2`
- 响应式设计：`md:flex` `lg:grid-cols-3`
- 通用工具类：`text-center` `bg-white` `rounded`
- 快速原型开发

❌ **不推荐场景**

- 复杂组件内部样式（嵌套超过 3 层）
- 业务特定的样式逻辑
- 需要频繁维护的复杂动画

---

## 🛠️ 配置文件

### UnoCSS 配置

```typescript
// unocss.config.ts
import {
  defineConfig,
  presetWind3,
  presetAttributify,
  presetIcons,
} from 'unocss'

export default defineConfig({
  presets: [
    presetWind3(), // ✅ Tailwind 兼容模式
    presetAttributify(), // ✅ 属性化模式（可选）
    presetIcons({
      // ✅ 图标集成
      scale: 1.2,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],

  // 自定义 Shortcuts（快捷类）
  shortcuts: {
    'icon-container': 'flex flex-wrap items-center w-full',
    'custom-card': 'rounded-lg shadow-md hover:shadow-lg transition-shadow',
    'btn-primary': 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600',
    'btn-ghost': 'px-4 py-2 border border-gray-300 rounded hover:bg-gray-50',

    // 布局
    'page-container': 'max-w-7xl mx-auto px-4 py-8',
    'section-title': 'text-2xl font-bold mb-4 text-gray-900 dark:text-white',
  },
})
```

**关键特性**：

- `shortcuts`：封装常用组合为语义化类名
- `safelist`：强制包含动态使用的类名（如动态图标）

---

## 📋 常用类名

### 布局类

| 功能     | 类名                          | 示例                                |
| -------- | ----------------------------- | ----------------------------------- |
| 布局     | `flex` `grid` `block`         | `flex items-center`                 |
| 间距     | `p-{n}` `m-{n}` `gap-{n}`   | `p-4 m-2 gap-4`                           |
| 尺寸     | `w-{n}` `h-{n}` `min-w-{n}` | `w-full h-screen`                   |
| 文本     | `text-{size}` `font-{weight}` | `text-lg font-bold`                 |
| 颜色     | `bg-{color}` `text-{color}` | `bg-blue-500 text-white`            |
| 边框     | `border` `rounded` `border-{color}` | `border border-gray-300 rounded-lg` |
| 阴影     | `shadow-{size}`                   | `shadow-md`                         |
| 圆角     | `rounded-{size}`                   | `rounded-lg rounded-full`               |
| 过渡     | `transition` `duration-{n}`   | `transition duration-300`           |
| 定位     | `absolute` `relative` `fixed` | `absolute top-0 left-0`             |
| Flex     | `flex-{direction}` `justify-{align}` `items-{align}` | `flex items-center justify-between` |

### 功能类

| 功能     | 类名                          | 示例                                |
| -------- | ----------------------------- | ----------------------------------- |
| 显示隐藏 | `hidden` `block` `invisible` | `hidden md:block`                  |
| 溢浮     | `overflow` `overflow-{direction}` | `overflow-hidden overflow-auto`          |
| 交互     | `cursor` `pointer-events` `cursor-not-allowed` | `cursor-pointer`            |
| 滚动     | `scroll` `resize` | `snap` | `overflow-x-auto`              |
| 状态     | `disabled` `group-hover` `group-focus` | `disabled opacity-50`            |

### 响应式前缀

| 断点     | 前缀   | 说明     |
| -------- | ------- | -------- |
| `sm:`    | ≥640px  | 小屏幕   |
| `md:`    | ≥768px  | 中等屏幕 |
| `lg:`    | ≥1024px | 大屏幕   |
| `xl:`    | ≥1280px | 超大屏幕 |
| `2xl:`    | ≥1536px | 2K 屏幕  |

---

## 🎨 状态修饰

| 状态     | 类名前缀                  | 示例                                |
| -------- | ----------------------------- | ----------------------------------- |
| 悬浮     | `hover:` `focus:` | `hover:bg-blue-600 focus:ring-2`                   |
| 激活     | `active:` | `active:bg-blue-600 active:ring-2`                     |

---

## 📐 实战示例

### 示例 1：基础卡片

```vue
<template>
  <div class="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-bold">卡片标题</h2>
    <p class="text-gray-600">卡片内容</p>
  </div>
</template>
```

### 示例 2：按钮组

```vue
<template>
  <div class="flex gap-2">
    <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      主要按钮
    </button>
    <button class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
      次要按钮
    </button>
  </div>
</template>
```

### 示例 3：响应式布局

```vue
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div
      v-for="item in items"
      :key="item.id"
      class="p-4 bg-white rounded-lg shadow-md"
    >
      {{ item.name }}
    </div>
  </div>
</template>
```

---

## 🚫 常见错误

### 错误 1：过度嵌套

```vue
<!-- ❌ 错误：嵌套过深 -->
<div class="w-full">
  <div class="p-4">
    <div class="bg-white rounded-lg">
      <div class="p-4">
        <div class="p-4">
          内容
        </div>
      </div>
    </div>
  </div>
</template>

<!-- ✅ 正确：扁平化结构 -->
<div class="w-full">
  <div class="p-4 bg-white rounded-lg">
    <div class="p-4">
      内容
    </div>
  </div>
</div>
```

### 错误 2：滥用 @apply

```scss
/* ❌ 不推荐：在 SCSS 中滥用 @apply */
.my-button {
  @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600;
}

/* ✅ 推荐：直接在 HTML 中使用 */
<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
  按钮
</button>
```

---

## 📚 学习资源

### 官方文档

- [UnoCSS 官方文档](https://unocss.dev/)
- [UnoCSS 交互式文档](https://unocss.dev/interactive/)
- [VS Code 扩展](https://marketplace.visualstudio.com/items?itemName=antfu.unocss)

---

## 🔧 项目配置检查清单

- [x] UnoCSS 已安装并配置 `unocss.config.ts`
- [x] VS Code 扩展已安装（UnoCSS + SCSS）
- [x] shortcuts 已配置（如需要）
