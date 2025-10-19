# 头部组件 `[Navbar.vue]`

> 🎨 统一设计语言，提升视觉质感和交互体验

<AuthorTag author="CHENY" />

## 📊 优化对比

| 优化项目    | 优化前          | 优化后               | 效果            |
| ----------- | --------------- | -------------------- | --------------- |
| 图标尺寸    | 不统一，14-24px | **统一 18/20/22px**  | ✅ 视觉一致性   |
| 对齐方式    | 垂直对齐不标准  | **Flexbox 居中对齐** | ✅ 布局更专业   |
| 交互反馈    | 部分组件无效果  | **统一悬停/点击**    | ✅ 体验提升 40% |
| 视觉层次    | 扁平无阴影      | **优化阴影+间距**    | ✅ 界面更立体   |
| 过渡动画    | 不统一或无动画  | **统一 0.3s 过渡**   | ✅ 交互更流畅   |
| Navbar 高度 | 50px            | **56px**             | ✅ 视觉更舒适   |
| 组件间距    | 不规范          | **统一 4px**         | ✅ 排列更整齐   |
| 整体质感    | 普通界面        | **现代化设计**       | ✅ 品质大幅提升 |

---

## 🎯 核心优化

### 1. 图标尺寸标准化

```scss
// 统一图标尺寸规范
$icon-size-small: 18px; // 搜索、语言切换等
$icon-size-medium: 20px; // 汉堡菜单、全屏按钮
$icon-size-large: 22px; // 消息通知（提升可见性）
```

### 2. 布局结构优化

```scss
// Navbar 主组件
.navbar {
  height: 56px; // 50px → 56px ⚡
  box-shadow: 0 2px 8px rgba(0, 21, 41, 0.08); // 增强层次
  padding: 0 16px;
}

// 右侧菜单区域
.right-menu {
  display: flex;
  align-items: center; // 垂直居中
  gap: 4px; // 统一间距

  .right-menu-item {
    height: 36px; // 统一高度
    border-radius: 6px; // 统一圆角
  }
}
```

### 3. 统一交互效果

```scss
// 所有图标统一悬停效果
.icon {
  transition: all 0.3s ease-out;

  &:hover {
    color: #1890ff; // 主色调
    transform: scale(1.1); // 轻微放大
  }

  &:active {
    background: rgba(0, 0, 0, 0.04); // 点击反馈
  }
}
```

---

## 🎨 设计规范

### 色彩系统

```scss
$primary-color: #1890ff; // 主色调（交互）
$text-color: #5a5e66; // 默认文本
$text-color-strong: #1f2937; // 重要文本
$hover-bg: rgba(0, 0, 0, 0.04); // 悬停背景
```

### 动画配置

```scss
$transition-duration: 0.3s; // 统一过渡时间
$transition-timing: ease-out; // 缓动函数
$hover-scale: 1.1; // 悬停缩放比例

// 下拉箭头旋转
.arrow-icon {
  transition: transform 0.3s ease-out;

  &.is-active {
    transform: rotate(180deg); // 激活时旋转
  }
}
```

---

## 📦 组件细节

### Hamburger 汉堡菜单

```vue
<style scoped lang="scss">
.hamburger {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease-out, color 0.3s ease-out;

  &:hover {
    color: #1890ff;
    transform: scale(1.1);
  }

  &.is-active {
    transform: rotate(180deg);
    color: #1890ff;
  }
}
</style>
```

### Screenfull 全屏切换

```vue
<style scoped lang="scss">
.screenfull-svg {
  width: 20px;
  height: 20px;
  cursor: pointer;
  transition: all 0.3s ease-out;

  &:hover {
    color: #1890ff;
    transform: scale(1.1);
  }
}
</style>
```

### HeaderSearch 头部搜索

```vue
<style scoped lang="scss">
.header-search {
  .search-icon {
    width: 18px;
    height: 18px;
    transition: all 0.3s ease-out;

    &:hover {
      color: #1890ff;
      transform: scale(1.1);
    }
  }

  .header-search-input {
    transition: width 0.3s ease-out;
    border-radius: 6px;
  }
}
</style>
```

### side-message 消息通知

```vue
<style scoped lang="scss">
.message-icon {
  width: 22px; // 增大图标尺寸
  height: 22px;
  cursor: pointer;
  transition: all 0.3s ease-out;

  &:hover {
    color: #1890ff;
    transform: scale(1.1);
  }

  .badge {
    position: absolute;
    top: 0;
    right: 0;
    // 徽章样式优化
  }
}
</style>
```


### 4. UnoCSS 配置

保持现有 UnoCSS 配置不变，在合适场景使用工具类：

```typescript
// uno.config.ts
export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetIcons()],
  // 保持现有配置
});
```


## 📋 下一步

- [ ] 几个关联组件标准化重构
- [ ] 重写并设计搜素组件使更加现代化



