# AuthorTag 组件

作者信息展示组件，用于在文档中标注作者（支持单/多作者），自动关联团队花名头像与工号。

## ✨ 特性

- 👤 **预定义作者**：别名自动关联团队花名（头像/工号/部门来自 `components/roster.ts` 单一数据源）
- 👥 **多作者模式**：两人及以上自动切换为胶囊横排布局
- 🔗 **社交链接**：有 GitHub 信息的作者名字可点击跳转
- 🛟 **头像降级**：图片加载失败回退姓名首字/末字头像
- 🌙 **暗色模式**：自适应主题

## 📦 文件结构

```
AuthorTag/
├── index.vue       # 组件主文件
├── index.scss      # 样式文件
└── data.ts         # 别名映射（成员数据从 roster.ts 派生）
```

## 🚀 快速开始

```vue
<!-- 组件已自动导入，无需手动 import -->
<AuthorTag author="ChenYu" />

<!-- 多作者：两人及以上自动切换为横排胶囊 -->
<AuthorTag :authors="['ZhuXiang', 'CHENY']" />

<!-- 临时作者（不在花名中）：直接渲染姓名，无头像/工号 -->
<AuthorTag author="张三" />
```

## 📖 API 文档

### Props

| 属性      | 类型                        | 默认值 | 说明                                       |
| --------- | --------------------------- | ------ | ------------------------------------------ |
| author    | `string \| Author`          | -      | 单作者：别名或作者对象                     |
| authors   | `(string \| Author)[]`      | -      | 多作者列表（与 author 二选一，优先 authors）|
| role      | `string`                    | -      | 覆盖花名中的角色                           |
| employeeId| `string`                    | -      | 覆盖花名中的工号                           |
| department| `string`                    | -      | 覆盖花名中的部门                           |
| showAvatar| `boolean`                   | `true` | 是否显示头像                               |

### Author 接口

```typescript
interface Author {
  name: string; // 作者名称
  avatar?: string; // 头像 URL（默认取花名头像）
  email?: string; // 邮箱地址
  github?: string; // GitHub 用户名
  role?: string; // 角色/职位
  employeeId?: string; // 工号
  department?: string; // 部门
  link?: string; // 自定义链接
}
```

## 🔧 配置预定义作者

成员的身份信息（头像/工号/部门/角色）**只在四个团队 `data.ts` 中维护**；本组件的 `data.ts` 只维护"别名 → 成员"映射：

1. 在对应团队目录的 `data.ts` 中添加成员（头像用本地 `/avatars/*.svg`）；
2. 在 `components/roster.ts` 的 `AUTHOR_ALIAS` 中登记别名 → 工号；
3. 如该成员有 GitHub/邮箱，在 `AuthorTag/data.ts` 的 `AUTHOR_EXTRAS` 中补充。

## 🛠️ 工具函数

### getAuthorInfo

获取作者信息（自动处理字符串别名和对象两种入参）

```typescript
import { getAuthorInfo } from "./data";

const author = getAuthorInfo("ChenYu"); // → 花名中的杨晨誉完整信息
```

## 💡 使用场景

- 文档/规范页顶部标注作者：`<AuthorTag author="ChenYu" />`
- 多人共建的页面：`<AuthorTag :authors="['ZhuXiang', 'CHENY', 'ZhongYu']" />`

## 🌙 暗色模式

组件自动适配 VitePress 暗色主题，无需额外配置。
