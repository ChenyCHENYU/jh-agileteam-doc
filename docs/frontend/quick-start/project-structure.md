# 项目结构

了解金恒科技信息化中心前端团队的项目目录结构有助于你更好地组织和管理代码，适应不同的业务场景。

## 标准目录结构

金恒科技信息化中心前端团队推荐以下标准目录结构：

```
my-project/
├── 📁 .husky/                    # Git Hooks 配置
├── 📁 docs/                       # 项目文档
├── 📁 mock/                       # Mock 模拟数据
├── 📁 public/                     # 静态资源
├── 📁 public-sub/                 # 子应用静态资源
├── 📁 scripts/                    # 脚本工具
├── 📁 src/                        # 源代码目录（核心）
│   ├── 📁 api/                    # API 接口定义
│   │   ├── login.ts               # 登录接口
│   │   └── hrms.ts                # 人力资源接口
│   ├── 📁 assets/                 # 静态资源
│   │   ├── logo/                  # Logo 图片
│   │   └── style/                 # 全局样式
│   ├── 📁 components/             # 公共组件
│   │   ├── 📁 global/             # 全局组件 (C_ 前缀)
│   │   │   └── 📁 C_Tree/        # 树形组件
│   │   ├── 📁 local/              # 本地通用组件 (c_ 前缀)
│   │   │   ├── 📁 c_actionModal/ # 操作模态框
│   │   │   ├── 📁 c_formModal/   # 表单模态框
│   │   │   └── 📁 c_spliterTitle/# 分割标题
│   │   ├── 📁 remote/             # 远程组件引用
│   │   │   ├── 📁 AGGrid/        # AG Grid 表格
│   │   │   ├── 📁 BaseForm/      # 基础表单
│   │   │   ├── 📁 BaseQuery/     # 基础查询
│   │   │   ├── 📁 BaseTable/     # 基础表格
│   │   │   └── 📁 BaseToolbar/   # 基础工具栏
│   │   ├── 📁 ParentView/         # 父级视图组件
│   │   ├── 📁 RightToolbar/       # 右侧工具栏
│   │   ├── 📁 Splitter/           # 分割器
│   │   └── 📁 SvgIcon/            # SVG 图标
│   ├── 📁 composables/            # 组合式函数（Vue3）
│   ├── 📁 enums/                  # 枚举定义
│   │   ├── columns.ts             # 表格列枚举
│   │   └── dict.ts                # 字典枚举
│   ├── 📁 mixins/                 # 混入（Vue2 风格）
│   │   ├── BaseMixins.ts          # 基础混入
│   │   ├── ListMixins.js           # 列表混入
│   │   └── TableMixins.js          # 表格混入
│   ├── 📁 mock/                   # Mock 数据
│   │   └── index.ts              # Mock 入口
│   ├── 📁 types/                  # TypeScript 类型定义
│   │   ├── jh4j-cloud.ts         # 云服务类型
│   │   └── page.ts               # 页面类型
│   ├── 📁 util/                   # 工具函数
│   │   ├── validate.ts            # 验证工具
│   │   ├── download.ts            # 下载工具
│   │   └── ...                   # 其他工具
│   ├── 📁 views/                  # 页面视图
│   │   ├── 📁 demo-module/         # 演示模块
│   │   ├── 📁 produce/            # 生产模块
│   │   │   ├── 📁 production-mmwr/# 轧钢生产
│   │   │   ├── 📁 production-omom/# 作业订单
│   │   │   ├── 📁 production-order/# 生产订单
│   │   │   └── 📁 production-wms/  # 仓储管理
│   │   └── 📁 sale/               # 销售模块
│   │       └── 📁 demo/          # 销售演示
│   ├── App.vue                    # 根组件
│   ├── main.ts                    # 应用入口
│   ├── main-core.ts               # 核心模块入口
│   ├── permission.ts              # 权限控制
│   └── settings.ts                # 应用设置
├── 📁 vite/                       # Vite 构建配置
│   ├── 📁 plugins/                # Vite 插件配置
│   │   ├── auto-import.js         # 自动导入
│   │   ├── compression.js         # 压缩插件
│   │   ├── svg-icon.js            # SVG 图标
│   │   ├── windi-css/             # Windi CSS 配置
│   │   └── 📁 shared/            # 共享模块
│   └── environment.ts             # 环境变量处理
├── 📄 .env                        # 通用环境变量
├── 📄 .env.dev                    # 开发环境变量
├── 📄 .env.uat                    # UAT 环境变量
├── 📄 .env.prod                   # 生产环境变量
├── 📄 .eslintrc.cjs               # ESLint 配置
├── 📄 .prettierrc                 # Prettier 配置
├── 📄 commitlint.config.cjs        # Git 提交规范配置
├── 📄 index.html                  # HTML 模板
├── 📄 package.json                # 项目配置
├── 📄 tsconfig.json               # TypeScript 配置
├── 📄 vite.config.ts              # Vite 配置
├── 📄 windi.config.ts             # Windi CSS 配置
└── 📄 README.md                   # 项目说明
```

### 目录说明

| 目录 | 说明 |
|------|------|
| `.husky/` | Git Hooks 配置，用于代码提交前检查 |
| `docs/` | 项目文档，存放组件使用说明等 |
| `mock/` | Mock 模拟数据，用于开发环境 |
| `public/` | 静态资源，不会被 Webpack/Vite 处理 |
| `public-sub/` | 子应用静态资源 |
| `scripts/` | 脚本工具，用于构建、部署等 |
| `src/api/` | API 接口定义，按模块组织 |
| `src/components/global/` | 全局组件，使用 `C_` 前缀命名 |
| `src/components/local/` | 本地通用组件，使用 `c_` 前缀命名 |
| `src/components/remote/` | 远程组件引用，如 BaseForm、BaseTable 等 |
| `src/composables/` | Vue3 组合式函数 |
| `src/enums/` | 枚举定义，如表格列、字典等 |
| `src/mixins/` | Vue2 风格混入，仅作为参考，不推荐使用 |
| `src/types/` | TypeScript 类型定义 |
| `src/util/` | 工具函数，如验证、下载等 |
| `src/views/` | 页面视图，按业务模块组织 |
| `vite/plugins/` | Vite 插件配置，统一管理 |

## 📦 文件组织规范

### 页面组件组织模式

页面组件按业务模块组织，每个模块可包含多个子模块。

```
views/
├── demo-module/         # 演示模块
├── produce/             # 生产模块
│   ├── production-mmwr/ # 轧钢生产
│   ├── production-omom/ # 作业订单
│   ├── production-order/# 生产订单
│   └── production-wms/  # 仓储管理
└── sale/                # 销售模块
    └── demo/           # 销售演示
```

### 组件库组织模式

#### 全局组件 (C_ 前缀)

全局组件使用 `C_` 前缀，表示可以在整个项目中使用。

```
components/global/
└── 📁 C_Tree/          # 树形组件
    ├── 📄 index.vue
    └── 📄 index.scss
```

#### 本地通用组件 (c_ 前缀)

本地通用组件使用 `c_` 前缀，在项目内通用但非全局注册。

```
components/local/
├── 📁 c_actionModal/   # 操作模态框
├── 📁 c_formModal/     # 表单模态框
└── 📁 c_spliterTitle/  # 分割标题
```

#### 远程组件引用

远程组件引用来自其他项目或组件库，统一放在 `remote/` 目录。

```
components/remote/
├── 📁 AGGrid/          # AG Grid 表格
├── 📁 BaseForm/        # 基础表单
├── 📁 BaseQuery/       # 基础查询
├── 📁 BaseTable/       # 基础表格
└── 📁 BaseToolbar/     # 基础工具栏
```

#### 特殊组件

一些特殊用途的组件直接放在 `components/` 根目录。

```
components/
├── 📁 ParentView/      # 父级视图组件
├── 📁 RightToolbar/    # 右侧工具栏
├── 📁 Splitter/        # 分割器
└── 📁 SvgIcon/         # SVG 图标
```

### 类型定义组织

类型定义按模块组织，便于维护和复用。

```
types/
├── jh4j-cloud.ts      # 云服务类型
└── page.ts            # 页面类型
```

### 枚举定义组织

枚举定义统一放在 `enums/` 目录。

```
enums/
├── columns.ts         # 表格列枚举
└── dict.ts            # 字典枚举
```

## 🎨 命名约定

### 文件命名规范

| 类型 | 命名规范 | 示例 | 说明 |
|------|----------|------|------|
| Vue 组件 | PascalCase | `UserManagement.vue` | 组件文件名使用大驼峰 |
| 组件目录 | PascalCase | `C_Tree/` | 组件目录名使用大驼峰 |
| 工具函数 | camelCase | `validate.ts` | 函数文件名使用小驼峰 |
| 常量文件 | UPPER_SNAKE_CASE | `API_CONSTANTS.ts` | 常量文件名使用大写下划线 |
| 样式文件 | kebab-case | `user-management.scss` | 样式文件名使用短横线 |
| 类型文件 | camelCase + .ts | `page.ts` | 类型文件名使用小驼峰 |

### 组件命名规范

| 类型 | 前缀/规范 | 示例 | 说明 |
|------|----------|------|------|
| 全局组件 | C_ 前缀 | `C_Tree` | 可在整个项目中使用 |
| 本地通用组件 | c_ 前缀 | `c_actionModal`, `c_formModal` | 在项目内通用但非全局注册 |
| 远程组件 | PascalCase | `AGGrid`, `BaseForm` | 来自其他项目或组件库 |
| 特殊组件 | PascalCase | `ParentView`, `RightToolbar` | 特殊用途的组件 |
| 页面组件 | PascalCase | `ProductionMmwr` | 路由页面组件 |

### 代码命名规范

| 类型 | 命名规范 | 示例 |
|------|----------|------|
| 变量/函数 | camelCase | `userName`, `getUserInfo()` |
| 常量 | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_COUNT` |
| 类/接口 | PascalCase | `UserService`, `UserInfo` |
| 私有成员 | _camelCase | `_privateMethod` |
| 事件处理 | handle + camelCase | `handleSubmit`, `handleClick` |

## 核心目录说明

### `/src/api` - API 接口层

按模块组织 API 接口，支持内部基类方式作为特殊扩展。

```
api/
├── login.ts           # 登录接口
└── hrms.ts            # 人力资源接口
```

**基类方式说明：**

项目使用内部基类封装 API 请求，提供统一的请求处理、错误处理、权限验证等功能。

```typescript
// 基类示例
class BaseApi {
  protected request<T>(config: RequestConfig): Promise<T> {
    // 统一请求处理
    // 错误处理
    // 权限验证
  }
}

// 使用基类
class UserApi extends BaseApi {
  async getUserInfo(id: string) {
    return this.request<UserInfo>({
      url: `/user/${id}`,
      method: 'GET',
    })
  }
}

export const userApi = new UserApi()
```

> **注意**：基类方式作为特殊扩展方式使用，适用于需要统一处理复杂业务逻辑的场景。对于简单接口，可直接使用常规方式定义。

### `/src/assets` - 静态资源

存放项目所需的静态资源。

```
assets/
├── logo/              # Logo 图片
└── style/             # 全局样式
```

### `/src/components` - 组件库

按全局、本地通用、远程引用分类组织组件。

```
components/
├── global/            # 全局组件 (C_ 前缀)
│   └── C_Tree/
├── local/             # 本地通用组件 (c_ 前缀)
│   ├── c_actionModal/
│   ├── c_formModal/
│   └── c_spliterTitle/
├── remote/            # 远程组件引用
│   ├── AGGrid/
│   ├── BaseForm/
│   ├── BaseQuery/
│   ├── BaseTable/
│   └── BaseToolbar/
├── ParentView/        # 父级视图组件
├── RightToolbar/      # 右侧工具栏
├── Splitter/          # 分割器
└── SvgIcon/           # SVG 图标
```

### `/src/composables` - 组合式函数

存放 Vue3 组合式函数。

```
composables/
├── useTable.ts        # 表格逻辑
├── useForm.ts         # 表单逻辑
└── usePermission.ts   # 权限控制
```

### `/src/enums` - 枚举定义

存放枚举定义。

```
enums/
├── columns.ts         # 表格列枚举
└── dict.ts            # 字典枚举
```

### `/src/mixins` - 混入（不推荐）

存放 Vue2 风格混入，**仅作为参考，不推荐使用**。

> **注意**：混入（Mixins）存在"黑匣子"问题，代码来源不清晰，难以追踪和维护。推荐使用 Vue3 的组合式函数（Composables）替代。

```
mixins/
├── BaseMixins.ts      # 基础混入
├── ListMixins.js      # 列表混入
└── TableMixins.js     # 表格混入
```

**推荐替代方案：**

```typescript
// ❌ 不推荐：使用 Mixins
export default {
  mixins: [ListMixins, TableMixins],
  mounted() {
    this.fetchData()
  }
}

// ✅ 推荐：使用 Composables
import { useListData } from '@/composables/useListData'

const { fetchData } = useListData()
onMounted(() => {
  fetchData()
})
```

### `/src/types` - 类型定义

存放 TypeScript 类型定义。

```
types/
├── jh4j-cloud.ts     # 云服务类型
└── page.ts           # 页面类型
```

### `/src/util` - 工具函数

存放工具函数。

```
util/
├── validate.ts        # 验证工具
├── download.ts        # 下载工具
└── ...               # 其他工具
```

### `/src/views` - 页面视图

存放路由页面组件，按业务模块组织。

```
views/
├── demo-module/       # 演示模块
├── produce/          # 生产模块
│   ├── production-mmwr/# 轧钢生产
│   ├── production-omom/# 作业订单
│   ├── production-order/# 生产订单
│   └── production-wms/  # 仓储管理
└── sale/             # 销售模块
    └── demo/        # 销售演示
```

### `/vite` - Vite 构建配置

存放 Vite 构建配置和插件。

```
vite/
├── plugins/          # Vite 插件配置
│   ├── auto-import.js    # 自动导入
│   ├── compression.js    # 压缩插件
│   ├── svg-icon.js       # SVG 图标
│   ├── windi-css/        # Windi CSS 配置
│   └── shared/           # 共享模块
└── environment.ts     # 环境变量处理
```

## 配置文件说明

### 环境变量配置

| 文件 | 说明 |
|------|------|
| `.env` | 通用环境变量 |
| `.env.dev` | 开发环境变量 |
| `.env.uat` | UAT 环境变量 |
| `.env.prod` | 生产环境变量 |

### 项目配置文件

| 文件 | 说明 |
|------|------|
| `package.json` | 项目依赖和脚本配置 |
| `vite.config.ts` | Vite 构建工具配置 |
| `tsconfig.json` | TypeScript 编译配置 |
| `windi.config.ts` | Windi CSS 配置 |
| `.eslintrc.cjs` | ESLint 代码检查配置 |
| `.prettierrc` | Prettier 代码格式化配置 |
| `commitlint.config.cjs` | Git 提交规范配置 |

### package.json 脚本示例

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build:prod": "vite build",
    "build:uat": "vite build --mode uat",
    "preview": "vite preview"
  }
}
```

## 最佳实践

### 1. 模块化组织

按业务模块组织代码，便于维护和协作：

```
views/
├── produce/          # 生产模块
├── sale/             # 销售模块
└── demo-module/      # 演示模块
```

### 2. 组件分层

- **全局组件（C_ 前缀）**：在多个模块中使用的通用组件
- **本地通用组件（c_ 前缀）**：在项目内通用但非全局注册的组件
- **远程组件**：来自其他项目或组件库的引用组件
- **特殊组件**：特殊用途的组件，如 ParentView、RightToolbar

### 3. 自动导入

使用 Vite 插件实现组件和 API 的自动导入：

```vue
<template>
  <!-- 全局组件自动导入，无需 import -->
  <C_Tree :data="treeData" />
  <BaseTable :columns="columns" :data="data" />
</template>

<script setup lang="ts">
// Vue API 自动导入，无需 import
const loading = ref(false)
const data = computed(() => [])
</script>
```

### 4. 类型优先

优先使用 TypeScript 类型定义：

```typescript
// ✅ 推荐
interface User {
  id: string
  name: string
}

const user: User = { id: '1', name: 'John' }

// ❌ 不推荐
const user = { id: '1', name: 'John' }
```

### 5. 枚举统一管理

将表格列、字典等枚举统一放在 `enums/` 目录：

```typescript
// enums/columns.ts
export const USER_COLUMNS = [
  { title: '姓名', dataIndex: 'name' },
  { title: '年龄', dataIndex: 'age' },
]

// enums/dict.ts
export const STATUS_DICT = {
  ACTIVE: '启用',
  INACTIVE: '禁用',
}
```

## 下一步

- 🎨 学习 [UnoCSS 配置](/views/guide/unocss-config)
- 🛠️ 了解 [工程化配置](/views/engineering/scaffold)
- 📖 查看 [编码规范](/views/best-practices/coding-standards)

::: tip 提示
良好的项目结构是金恒科技信息化中心前端团队协作的基础，请遵循统一的目录规范和命名约定！如有特殊需求，请联系团队负责人或通过内部工单系统 409322 提交需求。
:::
