# 开发规范

本文档介绍金恒科技信息化部前端团队的开发规范，确保团队代码风格一致性和项目可维护性。

<AuthorTag author="ZhuXiang" />

## 代码风格

### JavaScript/TypeScript 规范

#### 命名规范

- **变量/函数**：使用 camelCase 命名
  ```typescript
  // ✅ 正确
  const userName = 'John';
  const getUserInfo = () => {};

  // ❌ 错误
  const user_name = 'John';
  const GetUserInfo = () => {};
  ```

- **常量**：使用 UPPER_SNAKE_CASE 命名
  ```typescript
  // ✅ 正确
  const MAX_COUNT = 10;
  const API_BASE_URL = 'https://api.example.com';

  // ❌ 错误
  const maxCount = 10;
  const apiBaseUrl = 'https://api.example.com';
  ```

- **类/接口**：使用 PascalCase 命名
  ```typescript
  // ✅ 正确
  class UserService {}
  interface UserInfo {}

  // ❌ 错误
  class userService {}
  interface userInfo {}
  ```

- **组件**：使用 PascalCase 命名
  ```typescript
  // ✅ 正确
  const UserCard = defineComponent({...});

  // ❌ 错误
  const userCard = defineComponent({...});
  ```

#### 代码格式

- 使用 2 空格缩进
- 使用单引号
- 语句末尾不加分号
- 对象和数组的最后一项不加逗号

```typescript
// ✅ 正确
const userInfo = {
  name: 'John',
  age: 30
}

const getUserInfo = (id: string) => {
  return api.get(`/users/${id}`)
}

// ❌ 错误
const userInfo = {
  name: "John",
  age: 30,
};

const getUserInfo = (id: string) => {
  return api.get(`/users/${id}`);
};
```

#### 注释规范

- 文件顶部注释：包含文件描述、作者、日期等信息
- 函数注释：描述函数功能、参数和返回值
- 复杂逻辑注释：解释代码实现思路

```typescript
/**
 * 用户服务类
 * @description 提供用户相关的业务逻辑处理
 * @author John Doe
 * @date 2023/01/01
 */
class UserService {
  /**
   * 获取用户信息
   * @param userId 用户ID
   * @returns 用户信息对象
   */
  async getUserInfo(userId: string): Promise<UserInfo> {
    // 实现获取用户信息的逻辑
    return api.get(`/users/${userId}`);
  }
}
```

### Vue 组件规范

#### 组件结构

```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup lang="ts">
  // 导入语句
  import { ref, computed } from 'vue'
  
  // 类型定义
  interface Props {
    title: string
  }
  
  // Props 定义
  const props = defineProps<Props>()
  
  // 状态定义
  const count = ref(0)
  
  // 计算属性
  const doubleCount = computed(() => count.value * 2)
  
  // 方法定义
  const increment = () => {
    count.value++
  }
</script>

<style scoped>
  /* 样式内容 */
</style>
```

#### 组件命名

- 文件名使用 PascalCase
- 组件名使用 PascalCase
- 页面组件放在 `views` 目录
- 通用组件放在 `components/common` 目录
- 业务组件放在 `components/business` 目录

### CSS 规范

#### 命名规范

- 使用 kebab-case 命名类名
- BEM 命名规范推荐

```css
/* ✅ 正确 */
.user-card {
  padding: 16px;
}

.user-card__title {
  font-size: 18px;
}

.user-card--active {
  border: 1px solid #667eea;
}

/* ❌ 错误 */
.userCard {
  padding: 16px;
}

.userCardTitle {
  font-size: 18px;
}
```

#### 样式组织

- 全局样式放在 `src/assets/styles` 目录
- 组件样式使用 scoped
- 优先使用 UnoCSS 原子化类
- 避免使用 ID 选择器

## 文件组织

### 目录结构

```
src/
├── assets/           # 静态资源
├── components/      # 组件
│   ├── common/      # 通用组件
│   └── business/    # 业务组件
├── views/          # 页面
├── router/         # 路由
├── store/          # 状态管理
├── utils/          # 工具函数
├── api/            # API 接口
├── types/          # 类型定义
└── constants/      # 常量定义
```

### 文件命名

- 组件文件：`UserCard.vue`
- 工具文件：`request.ts`
- 类型文件：`user.d.ts`
- 样式文件：`user-card.scss`

## 代码质量

### TypeScript 使用

- 优先使用 TypeScript
- 开启严格模式
- 定义明确的类型
- 避免使用 `any` 类型

```typescript
// ✅ 正确
interface User {
  id: string
  name: string
  age: number
}

const getUser = (id: string): Promise<User> => {
  return api.get(`/users/${id}`)
}

// ❌ 错误
const getUser = (id) => {
  return api.get(`/users/${id}`)
}
```

### 错误处理

- 使用 try-catch 捕获异常
- 定义明确的错误类型
- 提供友好的错误提示

```typescript
// ✅ 正确
try {
  const user = await getUser(userId)
  return user
} catch (error) {
  console.error('获取用户信息失败:', error)
  throw new Error('获取用户信息失败，请稍后重试')
}

// ❌ 错误
const user = await getUser(userId)
return user
```

### 性能优化

- 使用懒加载
- 避免不必要的重新渲染
- 合理使用计算属性和缓存

```typescript
// ✅ 正确
const UserList = defineAsyncComponent(() => import('./UserList.vue'))

const filteredUsers = computed(() => {
  return users.value.filter(user => user.active)
})

// ❌ 错误
import UserList from './UserList.vue'

const filteredUsers = users.value.filter(user => user.active)
```

## 测试规范

### 单元测试

- 使用 Vitest 进行单元测试
- 测试文件命名：`*.spec.ts`
- 测试覆盖率要求：> 80%

```typescript
// user.service.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { getUserInfo } from './user.service'

describe('UserService', () => {
  it('should get user info', async () => {
    // Arrange
    const mockUser = { id: '1', name: 'John' }
    vi.spyOn(api, 'get').mockResolvedValue(mockUser)
    
    // Act
    const result = await getUserInfo('1')
    
    // Assert
    expect(result).toEqual(mockUser)
  })
})
```

### 组件测试

- 使用 Testing Library 测试组件
- 测试用户交互行为
- 避免测试实现细节

```typescript
// UserCard.spec.ts
import { render, screen } from '@testing-library/vue'
import UserCard from './UserCard.vue'

describe('UserCard', () => {
  it('renders user information', () => {
    const user = { name: 'John', email: 'john@example.com' }
    render(UserCard, { props: { user } })
    
    expect(screen.getByText('John')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })
})
```

## 工具配置

### ESLint 配置

项目已配置 ESLint，用于代码检查：

```javascript
// .eslintrc.cjs
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
}
```

### Prettier 配置

项目已配置 Prettier，用于代码格式化：

```json
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100,
  "trailingComma": "es5",
  "arrowParens": "avoid",
  "endOfLine": "auto"
}
```

## 常见问题

### Q: 如何处理异步操作？

A: 使用 async/await 语法，配合 try-catch 进行错误处理：

```typescript
const fetchData = async () => {
  try {
    const result = await api.getData()
    return result
  } catch (error) {
    console.error('获取数据失败:', error)
    throw error
  }
}
```

### Q: 如何组织大型组件？

A: 将大型组件拆分为多个小组件，使用组合式函数组织逻辑：

```typescript
// useUser.ts
export const useUser = () => {
  const user = ref(null)
  const loading = ref(false)
  
  const fetchUser = async (id: string) => {
    loading.value = true
    try {
      user.value = await getUserInfo(id)
    } finally {
      loading.value = false
    }
  }
  
  return { user, loading, fetchUser }
}

// UserComponent.vue
<script setup lang="ts">
import { useUser } from './useUser'

const { user, loading, fetchUser } = useUser()
</script>
```

---

遵循以上开发规范，可以确保团队代码风格一致，提高代码质量和可维护性。如有疑问，请通过内部工单系统 409322 联系我们。