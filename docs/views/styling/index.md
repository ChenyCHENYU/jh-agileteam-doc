# 样式方案

<AuthorTag author="CHENY" />

## 📖 关于样式方案

本模块介绍金恒科技信息化部前端团队的样式开发方案，包括 UnoCSS 和 SCSS 的使用规范和最佳实践。

## 🎨 核心技术栈

- **UnoCSS**：即时按需原子化 CSS 引擎
- **SCSS**：CSS 预处理器，用于复杂样式和组件样式

## 📚 文档导航

- [UnoCSS 最佳实践](./unocss-best-practices) - UnoCSS 使用规范和最佳实践
- [SCSS 最佳实践](./scss-best-practices) - SCSS 使用规范和最佳实践

## 🚀 快速开始

### UnoCSS

UnoCSS 是一个即时按需的原子化 CSS 引擎，类似于 Tailwind CSS，但更轻量、更灵活。

```html
<div class="flex items-center justify-center p-4 bg-blue-500 text-white">
  Hello UnoCSS
</div>
```

### SCSS

SCSS 是 CSS 的预处理器，提供了变量、嵌套、混合等功能。

```scss
.button {
  $primary-color: #3b82f6;

  padding: 0.5rem 1rem;
  background-color: $primary-color;
  color: white;
  border-radius: 0.25rem;

  &:hover {
    background-color: darken($primary-color, 10%);
  }
}
```

## 💡 使用建议

- **原子化样式**：优先使用 UnoCSS 处理布局、间距、颜色等原子化样式
- **组件样式**：使用 SCSS 编写组件的复杂样式和主题样式
- **主题变量**：使用 SCSS 变量定义主题色、尺寸等设计规范

---

**开始探索** 👉 从[UnoCSS 最佳实践](./unocss-best-practices)开始学习！
