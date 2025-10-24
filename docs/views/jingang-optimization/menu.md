# 菜单系统优化日志

> 提升侧边栏菜单和菜单导航页面的视觉体验和交互性能

<AuthorTag author="CHENY" />

---

## 一、侧边栏菜单优化

### 视觉优化

#### 1. 系统切换下拉框毛玻璃化

**文件**: `src/layout/components/SidebarUtils/Logo.vue`

**改进点**:

- 添加毛玻璃效果(`backdrop-filter: blur(24px)`)
- 圆角优化(外层 16px,内项 8px)
- 最大高度限制(520px)
- 主题logo蓝紫色渐变投影效果

**关键代码**:

```scss
.system-dropdown-menu {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 16px;
  max-height: 520px;
  overflow-y: auto;
}
```

#### 2. 下拉菜单滚动穿透修复

**问题**: 滚动下拉框时会影响右侧内容区域,导致白屏


```vue
<!-- HTML层 -->
<el-dropdown-menu @wheel.stop>

<!-- CSS层 -->
overscroll-behavior: contain;

<!-- JS层 -->
dropdown.addEventListener('wheel', (e) => e.stopPropagation(), { capture: true })
```

#### 3. 菜单头部图标优化

**文件**: `src/layout/components/SidebarUtils/Logo.vue`

**改进**:

- 在系统名称左侧添加图标
- 图标尺寸: 22x22px
- 悬停效果: 1.05 倍缩放 + 蓝紫色投影加深

**代码**:

```vue
<span class="el-dropdown-link currentSystemName">
  <img
    v-if="currentModule"
    :src="childSystemImg(currentModule)"
    @error="handleImgError"
    class="currentSystemIcon"
  />
  {{ currentSysName }}
</span>
```

#### 4. 整体背景毛玻璃优化

**文件**: `src/assets/styles/sidebar.scss`

**改进点**:

- 菜单区域背景: `linear-gradient + backdrop-filter: blur(16px)`
- 四级菜单渐进式毛玻璃(10px → 12px → 14px → 16px)
- 紫蓝渐变色系(Indigo/Purple/Light Purple)

**一级菜单样式**:

```scss
.el-menu-item {
  margin: 6px 14px;
  border-radius: 10px;
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.08),
    rgba(139, 92, 246, 0.06),
    rgba(167, 139, 250, 0.05)
  );
  backdrop-filter: blur(10px) saturate(150%);
}
```

#### 5. 菜单层级宽度优化

**改进**: 渐进式左右边距

| 层级    | 之前边距 | 优化后边距 | 视觉效果   |
| ------- | -------- | ---------- | ---------- |
| Level 1 | 统一 6px | 6px 14px   | 更窄更精致 |
| Level 2 | 统一 4px | 2px 15px   | 层次清晰   |
| Level 3 | 统一 4px | 2px 17px   | 递进感强   |
| Level 4 | 统一 4px | 2px 19px   | 深度明显   |

---

## 二、菜单导航页面优化

### 真实图标集成

**文件**: `src/views/menuNav/index.vue`

#### 1. 分类标题图标

**之前**: 固定显示三个杠(SVG)  
**现在**: 优先显示真实图标,无图标时回退到三个杠

```vue
<div class="category-indicator">
  <!-- 真实图标 -->
  <SvgIconRender 
    v-if="category.meta?.icon" 
    :icon="{ id: category.meta.icon }" 
    :title="category.meta?.title || category.name"
  />
  <!-- 默认图标 -->
  <svg v-else viewBox="0 0 24 24">
    <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
  </svg>
</div>
```

#### 2. 功能项图标

**之前**: 固定显示五角星(SVG)  
**现在**: 优先显示真实图标,无图标时回退到五角星

```vue
<div class="feature-icon">
  <!-- 真实图标 -->
  <SvgIconRender 
    v-if="feature.meta?.icon" 
    :icon="{ id: feature.meta.icon }" 
    :title="feature.meta?.title || feature.name"
  />
  <!-- 默认图标 -->
  <svg v-else viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87..."/>
  </svg>
</div>
```

#### 3. 图标样式统一

**文件**: `src/views/menuNav/index.scss`

```scss
.category-indicator {
  .category-real-icon {
    width: 20px !important;
    height: 20px !important;
    font-size: 20px !important;
    color: inherit;
  }
}

.feature-icon {
  .feature-real-icon {
    width: 18px !important;
    height: 18px !important;
    font-size: 18px !important;
    color: inherit;
  }
}
```

---

## 性能优化

### 1. 条件渲染优化

- ✅ 使用 `v-if/v-else` 避免不必要的组件创建
- ✅ 可选链 `?.` 防止空指针错误
- ✅ 逻辑短路减少无效计算

### 2. GPU 加速

- ✅ 使用 `transform` 和 `opacity` 实现动画
- ✅ `backdrop-filter` 硬件加速毛玻璃
- ✅ `will-change` 提前通知浏览器

### 3. 样式性能

- ✅ 静态渐变(无动画开销)
- ✅ `flex-shrink: 0` 防止重排
- ✅ `!important` 减少样式计算

---

## 配色方案

### 结合晋钢logo主题紫蓝渐变色系

```scss
// 主色调
$indigo: rgba(99, 102, 241, x);    // Indigo 靛蓝
$purple: rgba(139, 92, 246, x);    // Purple 紫色
$light-purple: rgba(167, 139, 250, x); // Light Purple 浅紫

// 透明度层次
默认: 0.05 - 0.08
悬停: 0.15 - 0.22
激活: 0.25 - 0.32
```

---


## 涉及文件

```
src/
├── layout/components/
│   ├── SidebarUtils/
│   │   ├── Logo.vue                    # 系统切换下拉框
│   │   ├── useSidebar.ts               # 侧边栏逻辑
│   │   └── svg-icon-render.ts          # 图标渲染组件
│   └── Sidebar/
│       └── SidebarItem.vue             # 菜单项组件
├── assets/styles/
│   └── sidebar.scss                    # 侧边栏样式(963行)
├── views/menuNav/
│   ├── index.vue                       # 菜单导航页面(618行)
│   └── index.scss                      # 导航页面样式(580行)
└── util/
    └── icon-map.ts                     # 图标映射表(1255行)
```

---

## 核心亮点

1. **毛玻璃设计系统** - 统一的视觉语言
2. **智能图标回退** - 优雅降级策略
3. **渐进式层级** - 清晰的层级感知，重点4级菜单内容过长也能较好显示（比如成本系统）
4. **性能友好** - GPU 加速 + 条件渲染
5. **Bug 修复** - 彻底解决滚动穿透问题

---

::: warning 兼容性

- 不支持 老版本IE 浏览器
  :::





  