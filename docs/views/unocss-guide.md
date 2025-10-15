# UnoCSS 使用指南

UnoCSS 已成功集成到项目中！这是一个即时按需的原子化 CSS 引擎。

## 快速开始

### 基础工具类

UnoCSS 提供了丰富的工具类，类似 Tailwind CSS：

<div class="p-4 bg-primary text-white rounded-lg shadow-md">
  这是一个使用 UnoCSS 工具类的示例
</div>

```html
<div class="p-4 bg-primary text-white rounded-lg shadow-md">
  这是一个使用 UnoCSS 工具类的示例
</div>
```

### 常用工具类

#### 间距

- `p-4` - padding: 1rem
- `m-2` - margin: 0.5rem
- `px-4` - padding-left & padding-right: 1rem
- `mt-8` - margin-top: 2rem

#### 颜色

- `bg-primary` - 主题色背景
- `text-white` - 白色文字
- `border-gray-200` - 灰色边框

#### 布局

- `flex` - display: flex
- `grid` - display: grid
- `hidden` - display: none
- `block` - display: block

#### 响应式

- `sm:flex` - 小屏幕时使用 flex
- `md:grid` - 中等屏幕时使用 grid
- `lg:block` - 大屏幕时使用 block

## 预设功能

### 1. 属性化模式

```html
<button bg="primary hover:primary-dark" text="white center" p="x-4 y-2" rounded>
  点击我
</button>
```

### 2. 自定义快捷方式

项目中已配置的快捷方式：

- `btn` - 标准按钮样式
- `icon-btn` - 图标按钮样式
- `glass` - 玻璃态效果

<div class="glass p-6 rounded-xl">
  <h3 class="text-xl font-bold mb-2">玻璃态卡片</h3>
  <p>使用 glass 类快速创建玻璃态效果</p>
</div>

```html
<div class="glass p-6 rounded-xl">
  <h3 class="text-xl font-bold mb-2">玻璃态卡片</h3>
  <p>使用 glass 类快速创建玻璃态效果</p>
</div>
```

### 3. 图标预设

UnoCSS 支持图标集成（需要安装对应的图标集）：

```bash
pnpm add -D @iconify-json/carbon
```

使用图标：

```html
<div class="i-carbon-logo-github text-2xl" />
```

### 4. 排版预设

```html
<article class="prose prose-sm m-auto">
  <h1>标题</h1>
  <p>段落文本...</p>
</article>
```

## 主题配置

### 颜色系统

项目已配置的主题色：

```js
theme: {
  colors: {
    primary: {
      DEFAULT: '#667eea',
      dark: '#5568d3',
      light: '#7e91ff',
    },
    secondary: {
      DEFAULT: '#764ba2',
      dark: '#5f3d83',
      light: '#8d5fb8',
    },
  }
}
```

使用示例：

<div class="flex gap-4 my-4">
  <div class="w-20 h-20 bg-primary rounded-lg"></div>
  <div class="w-20 h-20 bg-primary-dark rounded-lg"></div>
  <div class="w-20 h-20 bg-primary-light rounded-lg"></div>
  <div class="w-20 h-20 bg-secondary rounded-lg"></div>
</div>

### 断点配置

```js
breakpoints: {
  'xs': '320px',
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
}
```

## 高级用法

### @apply 指令

在 CSS 中使用 UnoCSS 工具类：

```css
.custom-button {
  @apply px-4 py-2 bg-primary text-white rounded-lg;
  @apply hover:bg-primary-dark transition-colors;
}
```

### 变体组

简化多个变体的书写：

```html
<!-- 常规写法 -->
<div class="hover:bg-gray-400 hover:text-white"></div>

<!-- 变体组写法 -->
<div class="hover:(bg-gray-400 text-white)"></div>
```

## 实战示例

### 卡片组件

<div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
  <div class="glass p-6 rounded-xl hover:shadow-xl transition-shadow">
    <div class="text-4xl mb-4">🚀</div>
    <h3 class="text-lg font-bold mb-2">快速</h3>
    <p class="text-sm opacity-80">即时按需生成样式</p>
  </div>
  <div class="glass p-6 rounded-xl hover:shadow-xl transition-shadow">
    <div class="text-4xl mb-4">🎨</div>
    <h3 class="text-lg font-bold mb-2">灵活</h3>
    <p class="text-sm opacity-80">完全可定制的设计系统</p>
  </div>
  <div class="glass p-6 rounded-xl hover:shadow-xl transition-shadow">
    <div class="text-4xl mb-4">⚡</div>
    <h3 class="text-lg font-bold mb-2">高效</h3>
    <p class="text-sm opacity-80">零运行时开销</p>
  </div>
</div>

```html
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div class="glass p-6 rounded-xl hover:shadow-xl transition-shadow">
    <div class="text-4xl mb-4">🚀</div>
    <h3 class="text-lg font-bold mb-2">快速</h3>
    <p class="text-sm opacity-80">即时按需生成样式</p>
  </div>
  <!-- 更多卡片... -->
</div>
```

## 配置文件

UnoCSS 配置位于项目根目录的 `uno.config.ts`：

```typescript
import { defineConfig, presetUno, presetAttributify } from "unocss";

export default defineConfig({
  presets: [presetUno(), presetAttributify()],
  theme: {
    colors: {
      primary: "#667eea",
    },
  },
});
```

## 资源链接

- [UnoCSS 官方文档](https://unocss.dev/)
- [交互式文档](https://unocss.dev/interactive/)
- [预设列表](https://unocss.dev/presets/)
- [工具类参考](https://unocss.dev/interactive/)

## 最佳实践

1. **优先使用工具类** - 在组件中直接使用 UnoCSS 工具类
2. **使用快捷方式** - 为常用组合创建快捷方式
3. **响应式优先** - 使用断点前缀实现响应式设计
4. **性能优化** - UnoCSS 只会生成使用到的样式
5. **与 SCSS 结合** - 复杂组件可以结合 SCSS 使用

::: tip 提示
UnoCSS 与 Tailwind CSS 语法兼容，可以无缝迁移现有 Tailwind 项目！
:::
