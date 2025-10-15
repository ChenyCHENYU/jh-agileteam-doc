# AuthorTag 组件使用指南

作者标签组件用于在文档中展示作者信息、发布日期和阅读时间等元数据。

## 基础用法

### 方式一：使用预定义作者

在 Markdown 文件中直接使用（组件已自动导入）：

```vue
<!-- 无需导入，直接使用 -->
<AuthorTag author="ChenYu" date="2025-10-15" />
```

<!-- 组件已自动导入，无需手动 import -->
<AuthorTag author="ChenYu" date="2025-10-15" :reading-time="5" />

### 方式二：自定义作者信息

```vue
<AuthorTag
  :author="{
    name: '张三',
    role: '前端开发',
    avatar: '/avatars/zhangsan.png',
  }"
  date="2025-10-15"
/>
```

<AuthorTag 
  :author="{ 
    name: '张三', 
    role: '前端开发工程师',
    bio: '专注于 Vue 生态和工程化实践' 
  }" 
  date="2025-10-15"
  :reading-time="8"
/>

## 样式变体

### 默认样式（default）

适合常规文档页面：

<AuthorTag 
  author="ChenYu" 
  date="2025-10-15" 
  update-date="2025-10-15"
  :reading-time="5"
  variant="default"
/>

### 卡片样式（card）

适合重点展示作者信息：

<AuthorTag 
  :author="{ 
    name: 'Chen Yu',
    avatar: 'https://github.com/ChenyCHENYU.png',
    role: '前端架构师',
    bio: '专注于前端工程化、性能优化和团队协作，致力于提升开发效率和代码质量。',
    email: 'ycyplus@gmail.com',
    github: 'ChenyCHENYU'
  }" 
  date="2025-10-15"
  :reading-time="10"
  variant="card"
/>

### 简洁样式（minimal）

适合文章顶部或底部的简要信息：

<AuthorTag 
  author="ChenYu" 
  date="2025-10-15" 
  :reading-time="3"
  variant="minimal"
/>

## 属性说明

### AuthorTag Props

| 属性          | 类型                               | 默认值      | 说明                         |
| ------------- | ---------------------------------- | ----------- | ---------------------------- |
| `author`      | `string \| Author`                 | -           | 作者名称（预定义）或作者对象 |
| `date`        | `string`                           | -           | 发布日期                     |
| `updateDate`  | `string`                           | -           | 更新日期                     |
| `readingTime` | `number`                           | -           | 阅读时间（分钟）             |
| `showAvatar`  | `boolean`                          | `true`      | 是否显示头像                 |
| `variant`     | `'default' \| 'card' \| 'minimal'` | `'default'` | 显示样式                     |

### Author 对象

```typescript
interface Author {
  name: string; // 作者名称（必需）
  avatar?: string; // 头像 URL
  email?: string; // 邮箱
  github?: string; // GitHub 用户名
  bio?: string; // 简介
  role?: string; // 角色/职位
  link?: string; // 自定义链接
}
```

## 预定义作者

在 `data.ts` 中已预定义以下作者：

- `ChenYu` - Chen Yu（前端架构师）
- `TeamLead` - 团队负责人（技术总监）
- `Developer` - 开发者（前端工程师）

你可以在 `docs/.vitepress/components/AuthorTag/data.ts` 中添加更多团队成员。

## 使用场景

### 1. 文章顶部

```markdown
---
outline: deep
---

<!-- 组件已自动导入，无需手动 import -->

<AuthorTag 
  author="ChenYu" 
  date="2025-10-15" 
  :reading-time="5"
  variant="default"
/>

# 文章标题

文章内容...
```

### 2. 文章底部

```markdown
文章内容...

---

<AuthorTag 
  author="ChenYu" 
  date="2025-10-15" 
  update-date="2025-10-15"
  variant="minimal"
/>
```

### 3. 作者卡片

```markdown
## 关于作者

<AuthorTag 
  :author="{ 
    name: 'Chen Yu',
    avatar: 'https://github.com/ChenyCHENYU.png',
    role: '前端架构师',
    bio: '专注于前端工程化和性能优化',
    email: 'ycyplus@gmail.com',
    github: 'ChenyCHENYU'
  }" 
  variant="card"
/>
```

## 高级用法

### 添加新的预定义作者

编辑 `docs/.vitepress/components/AuthorTag/data.ts`：

```typescript
export const AUTHORS: Record<string, Author> = {
  // ...现有作者
  YourName: {
    name: "你的名字",
    avatar: "/avatars/yourname.png",
    email: "your@email.com",
    github: "yourgithub",
    role: "你的职位",
    bio: "你的简介",
  },
};
```

### 自动计算阅读时间

使用提供的工具函数：

```typescript
import { calculateReadingTime } from "./data";

const content = `你的文章内容...`;
const readingTime = calculateReadingTime(content);
```

### 自定义样式

组件支持通过 CSS 变量自定义样式：

```css
:root {
  --vp-c-brand-1: #667eea;
  --vp-c-brand-2: #764ba2;
  --vp-c-bg-soft: #f6f6f7;
}
```

## 最佳实践

1. **统一使用预定义作者** - 便于维护和更新
2. **合理选择样式** - 根据页面类型选择合适的 variant
3. **提供完整信息** - 尽量填写日期和阅读时间
4. **保持一致性** - 在同类型文档中使用相同的展示方式

## 响应式设计

组件已针对不同设备优化：

- **桌面端**：完整展示所有信息
- **平板端**：适当调整间距和字体
- **移动端**：卡片样式改为垂直布局，文字居中

## 示例效果对比

### 不同变体对比

**Default 样式：**
<AuthorTag author="ChenYu" date="2025-10-15" :reading-time="5" variant="default" />

**Card 样式：**
<AuthorTag 
  :author="{ 
    name: 'Chen Yu',
    avatar: 'https://github.com/ChenyCHENYU.png',
    role: '前端架构师',
    bio: '专注于前端工程化和性能优化',
    github: 'ChenyCHENYU'
  }" 
  date="2025-10-15"
  variant="card"
/>

**Minimal 样式：**
<AuthorTag author="ChenYu" date="2025-10-15" :reading-time="3" variant="minimal" />

---

::: tip 提示
建议在团队文档规范中明确 AuthorTag 的使用场景和样式选择标准！
:::
