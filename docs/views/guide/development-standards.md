# 开发规范

本文档介绍金恒科技信息化部前端团队的开发规范，确保团队代码风格一致性和项目可维护性。

<AuthorTag author="CHENY" />

## 命名规范

### 项目命名

全部采用小写方式，以中线分隔

**正例：** `mall-management-system`
**反例：** `mall_management-system`、`mallManagementSystem`

### 目录命名

全部采用小写方式，以中划线分隔，有复数结构时，要采用复数命名法，缩写不用复数。

**正例：** `scripts`、`styles`、`components`、`demo-scripts`、`img`、`doc`
**反例：** `script`、`style`、`demo_script`、`demoStyle`、`imgs`、`docs`

#### 页面目录结构

| 类型 | 规则 | 示例 | 说明 |
|---|---|---|---|
| 领域目录 | 小写英文 | `sale` / `produce` | 一个应用通常只包含一个领域目录 |
| 子系统目录 | 小写英文；长词用连字符 | `order` / `material-management` | 业务子系统 |
| 模块目录（可选） | 小写英文；长词用连字符 | `domestic` / `quality-inspection` | 大型模块拆分 |
| 功能目录 | 固定值 | `list` / `form` / `detail` | 不使用连字符 |
| 私有组件目录 | PascalCase | `SearchForm` / `OrderItems` | 页面内部组件 |

**禁止：**
- 不使用驼峰目录：`materialManagement`
- 不使用下划线：`material_management`

**推荐结构：**
```
src/views/{domain}/{subsystem}/{feature}/
  ├── index.vue
  ├── data.ts
  ├── index.scss
  └── components/          # 可选：页面私有组件
      └── SearchForm/
          ├── index.vue
          ├── data.ts
          └── index.scss
```

### 文件命名

JS、vue、ts、tsx、jsx、CSS、SCSS、HTML、PNG 等文件全部采用小写方式，以中划线分隔。

### 文件拆分规范（三文件分离）

#### 强制结构
每个功能页目录内必须具备：
- `index.vue`（视图层）
- `data.ts`（逻辑层）
- `index.scss`（样式层）

#### 文件职责边界
- `index.vue`：只写模板/组件组合、事件绑定、少量页面级 glue code（如 onMounted 调一次 fetchList）
- `data.ts`：页面状态、类型、API 调用、业务方法、组合式逻辑
- `index.scss`：页面专属样式（能用原子化类优先用，复杂样式再落到 scss）

## 变量命名规范

### 1. 小驼峰

方法名、参数名、成员变量、局部变量采用小写驼峰命名 `lowerCamelCase`，代码中的命名均不能以下划线，也不能以下划线或美元符号结束。

其中 method 方法命名必须是 **动词** 或者 **动词+名词** 形式。

**正例：** `saveShopCarData`、`openShopCarInfoDialog`

**特此说明：** 增删查改，详情统一使用如下 5 个单词，不得使用其他：`add` / `update` / `delete` / `detail` / `get`

### 常用动词列表

| 动词 | 含义 | 动词 | 含义 |
| ------ | ------ | ------ | ------ |
| `get` | 获取 | `set` | 设置 |
| `add` | 增加 | `remove` | 删除 |
| `create` | 创建 | `destroy` | 销毁 |
| `start` | 启动 | `stop` | 停止 |
| `open` | 打开 | `close` | 关闭 |
| `read` | 读取 | `write` | 写入 |
| `load` | 载入 | `save` | 保存 |
| `begin` | 开始 | `end` | 结束 |
| `backup` | 备份 | `restore` | 恢复 |
| `import` | 导入 | `export` | 导出 |
| `split` | 分割 | `merge` | 合并 |
| `inject` | 注入 | `extract` | 提取 |
| `attach` | 附着 | `detach` | 脱离 |
| `bind` | 绑定 | `separate` | 分离 |
| `view` | 查看 | `browse` | 浏览 |
| `edit` | 编辑 | `modify` | 修改 |
| `select` | 选取 | `mark` | 标记 |
| `copy` | 复制 | `paste` | 粘贴 |
| `undo` | 撤销 | `redo` | 重做 |
| `insert` | 插入 | `delete` | 移除 |
| `add` | 加入 | `append` | 添加 |
| `clean` | 清理 | `clear` | 清除 |
| `index` | 索引 | `sort` | 排序 |
| `find` | 查找 | `search` | 搜索 |
| `increase` | 增加 | `decrease` | 减少 |
| `play` | 播放 | `pause` | 暂停 |
| `launch` | 启动 | `run` | 运行 |
| `compile` | 编译 | `execute` | 执行 |
| `debug` | 调试 | `trace` | 追踪 |
| `observe` | 观察 | `listen` | 监听 |
| `build` | 构建 | `publish` | 发布 |
| `input` | 输入 | `output` | 输出 |
| `encode` | 编码 | `decode` | 解码 |
| `encrypt` | 加密 | `decrypt` | 解密 |
| `compress` | 压缩 | `decompress` | 解压缩 |
| `pack` | 打包 | `unpack` | 解包 |
| `parse` | 解析 | `emit` | 生成 |
| `connect` | 连接 | `disconnect` | 断开 |
| `send` | 发送 | `receive` | 接收 |
| `download` | 下载 | `upload` | 上传 |
| `refresh` | 刷新 | `synchronize` | 同步 |
| `update` | 更新 | `revert` | 复原 |
| `lock` | 锁定 | `unlock` | 解锁 |
| `check out` | 签出 | `check in` | 签入 |
| `submit` | 提交 | `commit` | 交付 |
| `push` | 推 | `pull` | 拉 |
| `expand` | 展开 | `collapse` | 折叠 |
| `enter` | 进入 | `exit` | 退出 |
| `abort` | 放弃 | `quit` | 离开 |
| `obsolete` | 废弃 | `depreciate` | 废旧 |
| `collect` | 收集 | `aggregate` | 聚集 |

### 2. 常量

常量命名全部大写，单词间用下划线隔开，力求语义表达完整清楚，不要嫌名字长。

**正例：** `MAX_STOCK_COUNT`
**反例：** `MAX_COUNT`

## 代码缩进

### 1. Vue、HTML 等模板类 XML 代码、JavaScript、TypeScript 脚本语言

tabs and indents 统一缩进 2 个空格

**WebStorm 设置：**
- 设置 → Editor → Code Style → JavaScript → Tabs and Indents
- Tab size: 2
- Indent: 2 spaces
- Use tab character: 取消勾选

### 2. JavaScript、TypeScript 脚本语言

统一缩进 2 个空格

## 字符串规范

- **JavaScript**：统一使用单引号
- **TypeScript**：使用双引号

## 大括号规范

代码块必须使用大括号包裹，即使只有一行代码。

**正例：**
```javascript
if (condition) {
  doSomething();
}
```

**反例：**
```javascript
if (condition) doSomething();
```

## 编程规范

条件判断和循环最多三层。条件判断能使用三目运算符和逻辑运算符解决的，就不要使用条件判断，但是尽量不要写太长的三目运算符。如果超过三层抽成函数，并写清注释。

## this 的转换命名

对于上下文 this 的引用只能使用 `self` 来命名。

## 谨慎使用 console.log

因 `console.log` 大量使用会有性能问题，所以在非开发环境应移除或使用工具进行统一管理。

## Vue 代码规范

### 组件规范

#### 组件名规范

组件名始终是多个单词（大于等于 2 个单词），并且命名规范为 `KebabCase` 格式。这样可以避免跟现有的以及未来的 HTML 元素相冲突，因为所有的 HTML 元素名称都是单个单词的。

**正例：**
```javascript
export default {
  name: "TodoItem",
}
```

**反例：**
```javascript
export default {
  name: "Todo",
}

export default {
  name: "todo-item",
}
```

#### 组件文件名规范

组件文件名为 `PascalCase` 格式。

**正例：**
```bash
components/
└── my-component.vue
```

**反例：**
```bash
components/
└── myComponents.vue
└── MyComponents.vue
```

#### 组件命名规范（可一眼识别）

| 组件类型 | 前缀 | 命名方式 | 放置位置 |
|---|---|---|---|
| 全局公共组件 | `C_` | `C_PascalCase` | `src/components/` |
| 业务域共享组件 | `c_` | `c_pascalCase`（首字母小写） | `src/views/{domain}/components/` |
| 页面私有组件 | 无 | `PascalCase` | `.../page/components/` |

**补充说明：**
- 复杂组件：建议"文件夹 + 三文件分离"
- 简单组件（<100 行）：可用单文件 `.vue`（仍需遵循代码组织顺序）

#### 和父组件紧密耦合的子组件命名

和父组件紧密耦合的子组件应该以父组件名作为前缀命名。

**正例：**
```bash
components/
├── todo-list.vue
├── todo-list-item.vue
├── todo-list-item-button.vue
└── user-profile-options.vue  # 完整单词
```

**反例：**
```bash
components/
├── TodoList.vue
├── TodoItem.vue
├── TodoButton.vue
└── UProfOpts.vue  # 使用了缩写
```

### Template 模板规范

#### 在 Template 模版中使用组件

应使用 `PascalCase` 模式，并且使用自闭合组件。

**正例：**
```vue
<!-- 在单文件组件、字符串模板和 JSX 中 -->
<MyComponent />
<Row><table :column="data"/></Row>
```

**反例：**
```vue
<my-component />
<row><table :column="data"/></row>
```

#### Prop 定义规范

Prop 定义应该尽量详细：
- 必须使用 `camelCase` 驼峰命名
- 必须指定类型
- 必须加上注释，表明其含义
- 必须加上 `required` 或者 `default`，两者二选一
- 如果有业务需要，必须加上 `validator` 验证

**正例：**
```typescript
props: {
  // 组件状态，用于控制组件的颜色
  status: {
    type: String,
    required: true,
    validator: function (value) {
      return ['success', 'info', 'error'].indexOf(value) !== -1
    }
  },
  // 用户级别，用于显示皇冠个数
  userLevel: {
    type: String,
    required: true
  }
}
```

#### 为组件样式设置作用域

**正例：**
```vue
<template>
  <button class="btn btn-close">X</button>
</template>

<!-- 使用 `scoped` 特性 -->
<style scoped>
.btn-close {
  background-color: red;
}
</style>
```

**反例：**
```vue
<template>
  <button class="btn btn-close">X</button>
</template>

<!-- 没有使用 `scoped` 特性 -->
<style>
.btn-close {
  background-color: red;
}
</style>
```

#### 模板中使用简单的表达式

组件模板应该只包含简单的表达式，复杂的表达式则应该重构为计算属性或方法。复杂表达式会让你的模板变得不那么声明式。我们应该尽量描述应该出现的是什么，而非如何计算那个值。而且计算属性和方法使得代码可以重用。

**正例：**
```vue
<template>
  <p>{{ normalizedFullName }}</p>
</template>

<script setup lang="ts">
// 复杂表达式已经移入一个计算属性
const normalizedFullName = computed(() => {
  return fullName.value.split(' ').map((word) => {
    return word[0].toUpperCase() + word.slice(1)
  }).join(' ')
})
</script>
```

**反例：**
```vue
<template>
  <p>
    {{
      fullName.split(' ').map((word) => {
        return word[0].toUpperCase() + word.slice(1)
      }).join(' ')
    }}
  </p>
</template>
```

#### 指令都使用缩写形式

指令推荐都使用缩写形式（用 `:` 表示 `v-bind:`、用 `@` 表示 `v-on:` 和用 `#` 表示 `v-slot:`）。

**正例：**
```vue
<input
  @input="onInput"
  @focus="onFocus"
/>
```

**反例：**
```vue
<input
  v-on:input="onInput"
  @focus="onFocus"
/>
```

#### 标签顺序保持一致

单文件组件应该总是让标签顺序保持为 `<template>` → `<script>` → `<style>`。

**正例：**
```vue
<template>...</template>
<script>...</script>
<style>...</style>
```

**反例：**
```vue
<template>...</template>
<style>...</style>
<script>...</script>
```

#### 必须为 v-for 设置键值 key

```vue
<template>
  <div v-for="item in list" :key="item.id">
    {{ item.name }}
  </div>
</template>
```

#### v-show 与 v-if 选择

- 如果运行时，需要非常频繁地切换，使用 `v-show`
- 如果在运行时，条件很少改变，使用 `v-if`

### Script 标签内部结构顺序

`components` > `props` > `data` > `computed` > `watch` > `filter` > `生命周期钩子`（钩子函数按其执行顺序）> `methods`

### Vue 3 `<script setup>` 代码组织顺序（强烈建议统一）

在 `index.vue`、组件 `index.vue` 中，建议严格按以下 **9 个部分**从上到下组织。
好处：任何人打开文件都能快速定位问题与扩展点。

#### 标准顺序（9 段式）
1. **类型定义**：`interface` / `type`
2. **组件配置**：`defineOptions` / `defineProps` / `defineEmits`
3. **路由与 Store**：`useRoute` / `useRouter` / `useXXXStore`
4. **响应式数据**：`ref` / `reactive`
5. **计算属性**：`computed`
6. **监听器**：`watch` / `watchEffect`
7. **生命周期**：`onMounted` / `onBeforeUnmount` 等
8. **方法定义**：API 调用 / 事件处理 / 工具方法
9. **暴露方法**：`defineExpose`（可选）

#### 示例骨架（可复制）
```vue
<script setup lang="ts">
// ==================== 1. 类型定义 ====================
interface RowItem {
  id: string;
  name: string;
}

// ==================== 2. 组件配置（宏） ====================
defineOptions({ name: "DemoList" });

const props = defineProps<{
  readonly?: boolean;
}>();

const emit = defineEmits<{
  (e: "submit", payload: any): void;
}>();

// ==================== 3. 路由 & Store ====================
import { useRoute, useRouter } from "vue-router";
// import { useUserStore } from "@/stores/user";

const route = useRoute();
const router = useRouter();

// ==================== 4. 响应式数据 ====================
import { ref, reactive, computed, watch, onMounted } from "vue";

const loading = ref(false);
const tableData = ref<RowItem[]>([]);

const form = reactive({
  keyword: ""
});

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
});

// ==================== 5. 计算属性 ====================
const hasData = computed(() => tableData.value.length > 0);

// ==================== 6. 监听器 ====================
watch([() => pagination.page, () => pagination.pageSize], () => {
  fetchList();
});

// ==================== 7. 生命周期 ====================
onMounted(() => {
  fetchList();
});

// ==================== 8. 方法定义 ====================
async function fetchList() {
  loading.value = true;
  try {
    // TODO: 调接口
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  pagination.page = 1;
  fetchList();
}

// ==================== 9. 暴露方法（可选） ====================
defineExpose({
  fetchList
});
</script>
```

### 页面结构建议（统一观感与可维护性）

#### 常见页面骨架
- 页面容器：统一 `page-container`（或项目内约定的同类容器）
- 常见分区：搜索区 / 表格区 / 分页区
- 建议用两个 card 分区（上：搜索，下：表格+分页）

示例（仅示意）：
```vue
<template>
  <div class="page-container">
    <!-- 搜索区 -->
    <el-card shadow="never">
      <el-form :model="form" inline>
        <el-form-item label="关键字">
          <el-input v-model="form.keyword" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区 -->
    <el-card shadow="never">
      <el-table v-loading="loading" :data="tableData">...</el-table>
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        @current-change="handleSearch"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { form, tableData, pagination, loading, fetchList, handleSearch } from "./data";

onMounted(fetchList);
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
```

### 样式规范（简版）

- 优先使用原子化类（项目现状 WindiCSS；后续若切 UnoCSS 仍兼容）
- 复杂样式再落到 `index.scss`
- 动态 class 若被裁剪，需要加入 safelist（具体规则以项目配置为准）

### Mixins 使用说明（建议性）

- 项目存在 Mixins（列表/树/弹窗列表等）作为历史能力
- **建议**：优先使用 Composition API / hooks 方式替代；Mixins 仅在不得不兼容旧代码时使用

## Vue Router 规范

### 1. 页面跳转数据传递

页面跳转，例如 A 页面跳转到 B 页面，需要将 A 页面的数据传递到 B 页面，推荐使用路由参数进行传参，而不是将需要传递的数据保存 vuex，然后在 B 页面取出 vuex 的数据，因为如果在 B 页面刷新会导致 vuex 数据丢失，导致 B 页面无法正常显示数据。

### 2. 使用路由懒加载（延迟加载）机制

```typescript
{
  path: '/uploadAttachment',
  name: 'uploadAttachment',
  meta: {
    title: '上传附件'
  },
  component: () => import('@/view/components/uploadAttachment/index.vue')
}
```

### 3. Router 中的命名规范

- `path`、`children` 命名规范采用 `kebab-case` 命名规范（尽量跟 vue 文件的目录结构保持一致，因为目录、文件名都是 `kebab-case`，这样很方便找到对应的文件）
- `name` 命名规范采用 `KebabCase` 命名规范且和 `component` 组件名保持一致！（因为要保持 `keep-alive` 特性，`keep-alive` 按照 `component` 的 `name` 进行缓存，所以两者必须高度保持一致）

### 4. Router 中的 path 命名规范

`path` 除了采用 `kebab-case` 命名规范以外，必须以 `/` 开头，即使是 `children` 里的 `path` 也要以 `/` 开头。

**目的：** 经常有这样的场景：某个页面有问题，要立刻找到这个 vue 文件，如果不用以 `/` 开头，`path` 为 `parent` 和 `children` 组成的，可能经常需要在 router 文件里搜索多次才能找到，而如果以 `/` 开头，则能立刻搜索到对应的组件。

## 安全隐患

### 【强制】禁止使用 for in 做对象属性遍历

**反例：**
```javascript
for (const key in object) {
  // ...
}
```

**正例：**
```javascript
Object.keys(object).forEach((key) => {
  // ...
});
```

### 【强制】永远不要直接使用 undefined 进行变量判断

使用 `typeof` 和字符串 `undefined` 对变量进行判断。

**正例：**
```javascript
if (typeof variable !== 'undefined') {
  // ...
}
```

**反例：**
```javascript
if (variable !== undefined) {
  // ...
}
```

## 代码质量

### TypeScript 使用

- 优先使用 TypeScript
- 开启严格模式
- 定义明确的类型
- 避免使用 `any` 类型

**正例：**
```typescript
interface User {
  id: string
  name: string
  age: number
}

const getUser = (id: string): Promise<User> => {
  return api.get(`/users/${id}`)
}
```

**反例：**
```typescript
const getUser = (id) => {
  return api.get(`/users/${id}`)
}
```

### 错误处理

- 使用 `try-catch` 捕获异常
- 定义明确的错误类型
- 提供友好的错误提示

**正例：**
```typescript
try {
  const user = await getUser(userId)
  return user
} catch (error) {
  console.error('获取用户信息失败:', error)
  throw new Error('获取用户信息失败，请稍后重试')
}
```

**反例：**
```typescript
const user = await getUser(userId)
return user
```

### 性能优化

- 使用懒加载
- 避免不必要的重新渲染
- 合理使用计算属性和缓存

**正例：**
```typescript
const UserList = defineAsyncComponent(() => import('./UserList.vue'))

const filteredUsers = computed(() => {
  return users.value.filter(user => user.active)
})
```

**反例：**
```typescript
import UserList from './UserList.vue'

const filteredUsers = users.value.filter(user => user.active)
```

## 测试规范

### 单元测试

- 使用 Vitest 进行单元测试
- 测试文件命名：`*.spec.ts`
- 测试覆盖率要求：> 80%

**示例：**
```typescript
// user.service.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { getUserInfo } from './user.service'

describe('UserService', () => {
  it('should get user info', async () => {
    const mockUser = { id: '1', name: 'John' }
    vi.spyOn(api, 'get').mockResolvedValue(mockUser)

    const result = await getUserInfo('1')

    expect(result).toEqual(mockUser)
  })
})
```

### 组件测试

- 使用 Testing Library 测试组件
- 测试用户交互行为
- 避免测试实现细节

**示例：**
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

遵循以上开发规范，可以确保团队代码风格一致，提高代码质量和可维护性。如有疑问，请通过内部工单系统 409322 联系我们。
