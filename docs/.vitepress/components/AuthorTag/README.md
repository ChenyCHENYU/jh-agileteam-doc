# AuthorTag 组件

一个优雅的作者信息展示组件，用于在文档中标注作者、日期和阅读时间等元数据。

## ✨ 特性

- 🎨 **三种样式变体**：default、card、minimal
- 👤 **预定义作者**：支持团队成员预配置
- 📅 **日期格式化**：自动格式化显示日期
- ⏱️ **阅读时间**：显示预估阅读时长
- 🔗 **社交链接**：支持 GitHub、邮箱等链接
- 📱 **响应式设计**：完美适配各种设备
- 🌙 **暗色模式**：自适应主题模式
- 💎 **TypeScript**：完整的类型支持

## 📦 文件结构

```
AuthorTag/
├── index.vue       # 组件主文件
├── index.scss      # 样式文件
└── data.ts         # 数据配置和工具函数
```

## 🚀 快速开始

### 1. 在 Markdown 中使用

```vue
<!-- 组件已自动导入，无需手动 import -->
<AuthorTag author="ChenYu" date="2025-10-15" :reading-time="5" />
```

### 2. 使用预定义作者

```vue
<AuthorTag author="ChenYu" date="2025-10-15" />
```

### 3. 自定义作者信息

```vue
<AuthorTag
  :author="{
    name: '张三',
    role: '前端工程师',
    avatar: '/avatars/zhangsan.png',
    bio: '专注于前端开发',
  }"
  date="2025-10-15"
/>
```

## 📖 API 文档

### Props

| 属性        | 类型                               | 默认值      | 说明                       |
| ----------- | ---------------------------------- | ----------- | -------------------------- |
| author      | `string \| Author`                 | -           | 作者名称或作者对象（必需） |
| date        | `string`                           | -           | 发布日期（可选）           |
| updateDate  | `string`                           | -           | 更新日期（可选）           |
| readingTime | `number`                           | -           | 阅读时间（分钟）（可选）   |
| showAvatar  | `boolean`                          | `true`      | 是否显示头像               |
| variant     | `'default' \| 'card' \| 'minimal'` | `'default'` | 显示样式                   |

### Author 接口

```typescript
interface Author {
  name: string; // 作者名称
  avatar?: string; // 头像 URL
  email?: string; // 邮箱地址
  github?: string; // GitHub 用户名
  bio?: string; // 个人简介
  role?: string; // 角色/职位
  link?: string; // 自定义链接
}
```

## 🎨 样式变体

### Default（默认）

标准样式，适合常规文档页面

### Card（卡片）

卡片样式，适合突出展示作者信息

### Minimal（简洁）

简洁样式，适合文章底部或摘要信息

## 🔧 配置预定义作者

在 `data.ts` 中添加团队成员：

```typescript
export const AUTHORS: Record<string, Author> = {
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

## 🛠️ 工具函数

### getAuthorInfo

获取作者信息（自动处理字符串和对象）

```typescript
import { getAuthorInfo } from "./data";

const author = getAuthorInfo("ChenYu");
```

### formatDate

格式化日期为中文显示

```typescript
import { formatDate } from "./data";

const formatted = formatDate("2025-10-15");
// 输出: "2025年10月15日"
```

### calculateReadingTime

计算文章阅读时间

```typescript
import { calculateReadingTime } from "./data";

const content = "文章内容...";
const time = calculateReadingTime(content);
// 输出: 5 (分钟)
```

## 💡 使用场景

### 场景一：文章顶部

展示作者和发布信息

```vue
<AuthorTag author="ChenYu" date="2025-10-15" :reading-time="5" />
```

### 场景二：作者简介

卡片形式展示详细信息

```vue
<AuthorTag :author="fullAuthorInfo" variant="card" />
```

### 场景三：文章底部

简洁显示元信息

```vue
<AuthorTag author="ChenYu" date="2025-10-15" variant="minimal" />
```

## 🎯 最佳实践

1. **统一管理作者**

   - 使用预定义作者，便于维护
   - 集中管理团队成员信息

2. **合理选择样式**

   - 教程文档：使用 default
   - 作者介绍：使用 card
   - 简要信息：使用 minimal

3. **提供完整信息**

   - 必填：author
   - 推荐：date、readingTime
   - 可选：updateDate

4. **保持一致性**
   - 同类文档使用相同样式
   - 统一日期格式

## 🌈 样式定制

组件使用 CSS 变量，可以轻松定制：

```css
:root {
  --vp-c-brand-1: #667eea; /* 主题色 */
  --vp-c-brand-2: #764ba2; /* 辅助色 */
  --vp-c-bg-soft: #f6f6f7; /* 背景色 */
}
```

## 📱 响应式支持

- **>768px**: 完整布局
- **≤768px**:
  - Card 变为垂直布局
  - 文字居中显示
  - 适当缩小间距

## 🌙 暗色模式

组件自动适配 VitePress 暗色主题，无需额外配置。

## 📝 示例

查看完整示例：[AuthorTag 使用指南](/components/author-tag-demo)

## 🤝 贡献

欢迎提出改进建议或提交 PR！

## 📄 License

MIT

---

Made with ❤️ by AGILE TEAM
