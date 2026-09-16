# 样式方案

<AuthorTag :authors="['CHENY']" />

> 前端样式的四件套：**怎么写**（UnoCSS / SCSS 规范）、**长什么样**（设计系统原则）、**怎么管一致性**（wl-skills-ui 视觉对齐框架）。

## 四页导航

| 页面 | 定位 | 回答的问题 |
|------|------|-----------|
| [UnoCSS 最佳实践](./unocss-best-practices) | 原子化 CSS 引擎使用规范 | 布局/间距/颜色的原子类怎么写 |
| [SCSS 最佳实践](./scss-best-practices) | CSS 预处理器规范 | 复杂样式、组件样式、主题变量怎么组织 |
| [UI 设计系统](./ui-design-system) | 设计系统原则 | 页面视觉结构（卡片/留白/层次）长什么样 |
| [wl-skills-ui](./wl-skills-ui) | **视觉对齐框架**（v1.12.0） | 存量/新项目怎么被机器管住视觉一致：39 条 R 规则扫描 + fixer + Profile 体系 |

## 定位区分（一句话版）

- **UnoCSS / SCSS** = 写样式时的**手工规范**（人遵守）；
- **wl-skills-ui** = 视觉一致性的**机器门禁**（39 条 R001~R043 扫描 + 自动修复 + 能力 Profile）；
- **UI 设计系统** = 两者之上的**审美基线**（结构、层次、密度原则）。

## 快速开始

```html
<!-- UnoCSS：布局/间距/颜色用原子类 -->
<div class="flex items-center justify-center p-4 bg-blue-500 text-white">Hello</div>
```

```scss
// SCSS：组件复杂样式与主题变量
.button {
  $primary-color: #3b82f6;
  padding: 0.5rem 1rem;
  background: $primary-color;
  &:hover { background: darken($primary-color, 10%); }
}
```

新项目接入 wl-skills-ui：`npx @agile-team/wl-skills-ui`（默认 native-element Profile），详见 [wl-skills-ui 文档](./wl-skills-ui)。
