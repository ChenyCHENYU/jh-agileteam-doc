# SCSS 样式方案

> 本项目采用 **SCSS** 作为样式方案，提供强大的样式预处理能力

## 📦 技术栈

| 工具     | 版本   | 用途                           |
| -------- | ------ | ------------------------------ |
| SCSS     | Latest | CSS 预处理器，嵌套、变量、混合 |
| Naive UI | 2.x    | 组件库基础样式                 |

---

## 🎯 核心原则

### 什么时候用 SCSS？

✅ **推荐场景**

- 组件内部样式封装
- 复杂的伪类和嵌套选择器
- 全局样式覆盖（如 Naive UI）
- 复杂动画和过渡效果

---

## 🛠️ 配置文件

### Vite 配置

```typescript
// vite.config.ts
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler", // ✅ 使用现代编译器
        silenceDeprecations: "import", // ✅ 静默废弃警告
      },
    },
  },
});
```

### SCSS 文件组织

```
src/styles/
├── index.scss              # 📌 入口文件，统一导入
├── custom.scss             # 🔧 全局自定义样式
├── element-plus.scss  # 🎛️ 组件库样式覆盖
└── mixins.scss             # 🔀 混合宏（可选）
```

**入口文件统一导入**：

```scss
// src/styles/index.scss
@use "./custom.scss";
@use "./naive-ui-override.scss";
@use "./antv-common.scss";
@use "./mixins.scss";
```

**在 main.ts 中引入**：

```typescript
// src/main.ts
import "@/styles/index.scss";
```

---

## 📐 实战最佳实践

### 场景 1：组件样式封装

```vue
<template>
  <div class="custom-card">
    <div class="card-header">
      <div class="icon-wrapper">
        <i class="card-icon">🎨</i>
      </div>
      <h3>卡片标题</h3>
    </div>
    <div class="card-body">
      <p>卡片内容</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* ✅ 推荐：复杂样式封装 */
.custom-card {
  position: relative;
  border-radius: 12px;
  background: #f4f7f9;
  transition: all 0.3s ease;

  /* 顶部装饰条 */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #18a058, #2080f0, #f0a020);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

    &::before {
      opacity: 1;
    }
  }
}
</style>
```

**优势**：

- 样式逻辑集中管理
- 嵌套结构清晰
- 支持复杂伪类和动画

---

### 场景 2：响应式设计

```vue
<template>
  <div class="responsive-layout">
    <div class="content-item">内容 1</div>
    <div class="content-item">内容 2</div>
    <div class="content-item">内容 3</div>
  </div>
</template>

<style scoped lang="scss">
.responsive-layout {
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 24px;
  }

  @media (min-width: 1024px) {
    gap: 32px;
  }
}
</style>
```

---

### 场景 3：混合使用

```vue
<template>
  <!-- 外层布局用 UnoCSS -->
  <div class="flex items-center gap-4 p-6">
    <span class="text-lg font-bold">标题</span>
  </div>

  <!-- 复杂卡片用 SCSS -->
  <div class="custom-card">
    <div class="card-content">
      <p>卡片内容</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.custom-card {
  position: relative;
  border-radius: 12px;
  background: #f4f7f9;
  transition: all 0.3s ease;

  /* 顶部装饰条 */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #18a058, #2080f0, #f0a020);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
}
</style>
```

**规则**：

- 外层布局 → UnoCSS
- 组件容器 → SCSS
- 简单元素 → UnoCSS
- 复杂交互 → SCSS

---

## 📋 样式编写规范

### 命名规范

```scss
/* ✅ 推荐：BEM 命名 */
.block {
  /* 块级元素 */
}

.block__element {
  /* 元素 */
}

.block--modifier {
  /* 修饰符 */
}

.block__element--modifier {
  /* 元素 + 修饰符 */
}

/* 示例 */
.user-card {
  /* 卡片容器 */
}

.user-card__header {
  /* 卡片头部 */
}

.user-card__avatar {
  /* 头像 */
}

.user-card--active {
  /* 激活状态 */
}
```

---

### 文件组织

```vue
<template>
  <!-- 模板 -->
</template>

<script setup lang="ts">
// 逻辑
</script>

<style scoped lang="scss">
/* 1. 变量定义（如果有） */
$card-padding: 20px;

/* 2. 根元素样式 */
.component-root {
  /* ... */
}

/* 3. 子元素样式（嵌套） */
.component-root {
  .header {
    /* ... */
  }

  .content {
    /* ... */
  }

  .footer {
    /* ... */
  }
}

/* 4. 状态样式 */
.component-root {
  &:hover {
    /* ... */
  }

  &.active {
    /* ... */
  }

  &.disabled {
    /* ... */
  }
}

/* 5. 响应式样式 */
@media (min-width: 768px) {
  .component-root {
    /* ... */
  }
}

/* 6. 动画定义 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
```

---

## 🚀 性能优化建议

**1. 减少嵌套层级**

```scss
/* ❌ 避免：嵌套过深 */
.a {
  .b {
    .c {
      .d {
        .e {
          color: red; /* 选择器权重过高 */
        }
      }
    }
  }
}

/* ✅ 推荐：扁平化结构 */
.a {
  /* ... */
}
.a-b {
  /* ... */
}
.a-b-c {
  /* ... */
}
```

**2. 避免通配符选择器**

```scss
/* ❌ 避免 */
* {
  box-sizing: border-box;
}

/* ✅ 推荐：精确选择 */
.component * {
  box-sizing: border-box;
}
```

**3. 使用 GPU 加速属性**

```scss
/* ✅ 触发 GPU 加速的属性 */
.animated-element {
  transform: translateZ(0); /* 开启硬件加速 */
  will-change: transform; /* 提前通知浏览器优化 */

  &:hover {
    transform: translateY(-4px) translateZ(0);
  }
}
```

---

## 🔍 调试技巧

### 1. 查看编译后的 CSS

```bash
# 查看编译后的 CSS
npm run build
cat dist/assets/*.css
```

---

## 📚 学习资源

### 官方文档

- [SCSS 官方文档](https://sass-lang.com/documentation/)

### 工具推荐

- [VS Code 扩展](https://marketplace.visualstudio.com/items?itemName=scss-vscode-formatter)
- [SCSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=scss-intellisense)

---

## 📌 快速参考

### 常用 SCSS 类名

| 功能 | 类名                          | 示例                                |
| ---- | ----------------------------- | ----------------------------------- |
| 布局 | `flex` `grid` `block`         | `flex items-center`                 |
| 间距 | `p-{n}` `m-{n}` `gap-{n}`     | `p-4 m-2 gap-4`                     |
| 尺寸 | `w-{n}` `h-{n}` `min-w-{n}`   | `w-full h-screen`                   |
| 文本 | `text-{size}` `font-{weight}` | `text-lg font-bold`                 |
| 颜色 | `bg-{color}` `text-{color}`   | `bg-blue-500 text-white`            |
| 边框 | `border` `rounded`            | `border border-gray-300 rounded-lg` |
| 阴影 | `shadow` `shadow-{size}`      | `shadow-md`                         |
| 过渡 | `transition` `duration-{n}`   | `transition duration-300`           |

## 🔧 项目配置检查清单

- [x] Vite 已配置 SCSS 预处理器
- [x] SCSS 文件已创建
- [x] 全局样式入口已配置
- [x] Naive UI 样式覆盖已配置

---

## 总结

### 核心思想

> **SCSS 负责深度定制**，提供强大的样式预处理能力

### 使用原则

1. **复杂样式**：优先 SCSS
2. **组件覆盖**：SCSS + :deep()
3. **响应式**：SCSS 媒体查询

### 避免陷阱

- ❌ 不要在 SCSS 中滥用 `@import`
- ❌ 不要过度嵌套选择器（≤3 层）
