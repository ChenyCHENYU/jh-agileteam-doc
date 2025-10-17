# UnoCSS 配置

本章节介绍金恒科技信息化部前端团队的 UnoCSS 配置规范。

## 什么是 UnoCSS

UnoCSS 是一个即时按需的原子化 CSS 引擎，具有以下特点：

- ⚡️ **即时按需** - 只生成你使用的样式
- 🎨 **高度可定制** - 预设、规则、快捷方式等
- 🔥 **性能优异** - 比 Tailwind CSS 快 200 倍
- 🌈 **完全可控** - 没有核心工具类，所有功能都通过预设提供

## 基础配置

`uno.config.ts` 配置示例：

```typescript
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
} from "unocss";

export default defineConfig({
  presets: [
    presetUno(), // 默认预设
    presetAttributify(), // 属性化模式
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  theme: {
    colors: {
      primary: "#667eea",
      secondary: "#764ba2",
    },
  },
});
```

## 预设说明

### presetUno

默认预设，包含常用的工具类：

```html
<div class="m-4 p-2 bg-blue-500 text-white rounded">内容</div>
```

### presetAttributify

属性化模式，让样式更清晰：

```html
<!-- 传统方式 -->
<button
  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
>
  按钮
</button>

<!-- 属性化方式 -->
<button
  bg="blue-500 hover:blue-700"
  text="white"
  font="bold"
  p="y-2 x-4"
  rounded
>
  按钮
</button>
```

### presetIcons

图标预设，支持多种图标集：

```html
<!-- 使用 Material Design Icons -->
<div class="i-mdi-account" />

<!-- 使用 Carbon Icons -->
<div class="i-carbon-edit" />

<!-- 自定义大小和颜色 -->
<div class="i-mdi-heart text-red-500 text-2xl" />
```

## 自定义主题

### 颜色配置

```typescript
export default defineConfig({
  theme: {
    colors: {
      // 品牌色
      primary: {
        DEFAULT: "#667eea",
        light: "#a0aff4",
        dark: "#5568d3",
      },
      secondary: {
        DEFAULT: "#764ba2",
        light: "#a47bc8",
        dark: "#5e3c82",
      },
      // 功能色
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
  },
});
```

### 断点配置

```typescript
export default defineConfig({
  theme: {
    breakpoints: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
});
```

## 自定义规则

### 添加自定义工具类

```typescript
export default defineConfig({
  rules: [
    // 自定义规则：glass 玻璃态效果
    [
      "glass",
      {
        background: "rgba(255, 255, 255, 0.7)",
        "backdrop-filter": "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
      },
    ],
    // 动态规则：btn-[颜色]
    [
      /^btn-(.+)$/,
      ([, color]) => ({
        background: color,
        color: "white",
        padding: "0.5rem 1rem",
        "border-radius": "0.25rem",
      }),
    ],
  ],
});
```

使用：

```html
<div class="glass">玻璃态卡片</div>
<button class="btn-blue-500">按钮</button>
```

## 快捷方式

定义常用的样式组合：

```typescript
export default defineConfig({
  shortcuts: {
    // 静态快捷方式
    btn: "px-4 py-2 rounded inline-block bg-primary text-white cursor-pointer hover:bg-primary-dark disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50",
    "btn-primary": "btn bg-primary hover:bg-primary-dark",
    "btn-secondary": "btn bg-secondary hover:bg-secondary-dark",

    // 动态快捷方式
    card: "p-4 rounded-lg shadow-md bg-white dark:bg-gray-800",
    input:
      "px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary",
  },
});
```

使用：

```html
<button class="btn-primary">主按钮</button>
<div class="card">卡片内容</div>
<input class="input" type="text" />
```

## Vite 集成

在 `vite.config.ts` 中引入：

```typescript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(), // 添加 UnoCSS 插件
  ],
});
```

在 `main.ts` 中引入样式：

```typescript
import { createApp } from "vue";
import App from "./App.vue";

// 引入 UnoCSS
import "virtual:uno.css";

createApp(App).mount("#app");
```

## VS Code 支持

安装 UnoCSS 扩展获得智能提示：

- **UnoCSS** - 官方扩展，提供自动补全和悬停预览

::: tip 💡 提示
UnoCSS 配置已集成在团队脚手架中，开箱即用！更多用法请参考 [UnoCSS 官方文档](https://unocss.dev/)。
:::
