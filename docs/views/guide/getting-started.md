---
outline: deep
---

# 快速开始

欢迎使用金恒科技信息化部前端团队工程体系！本指南将帮助你快速上手我们的前端工程化实践。

## 环境准备

在开始之前，请确保你的开发环境满足以下要求：

### 必需工具

- **Node.js**: >= 18.0.0 （推荐使用 LTS 版本）
- **包管理器**: pnpm >= 8.0.0 （团队推荐）或 npm >= 9.0.0

### 推荐工具

- **编辑器**: [VS Code](https://code.visualstudio.com/) （团队标准编辑器）
- **终端**: Windows Terminal / iTerm2 / Warp
- **Git**: >= 2.30.0
- **企业内部工具**: 金恒科技内部开发工具集

## 安装依赖

### 安装 pnpm

如果你还没有安装 pnpm，可以通过以下命令安装：

```bash
# 通过 npm 安装
npm install -g pnpm

# 或使用脚本安装（推荐）
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### 验证安装

```bash
node -v   # 应该显示 v18.x.x 或更高版本
pnpm -v   # 应该显示 8.x.x 或更高版本
```

## 创建项目

### 方式一：使用脚手架（推荐）

使用金恒科技信息化部前端团队提供的脚手架快速创建项目：

```bash
# 使用 pnpm（团队推荐）
pnpm create jinheng-fe-app my-project

# 使用 npm
npm create jinheng-fe-app my-project

# 使用 yarn
yarn create jinheng-fe-app my-project
```

根据提示选择项目模板：

- **单体项目模板** - 适用于中小型业务系统，基于 Vue 3 + TypeScript
- **集群项目模板** - 适用于需要高可用性的大型系统，支持多环境部署
- **Monorepo项目模板** - 适用于多个相关应用共享代码的场景，基于 pnpm workspace
- **微前端项目模板** - 适用于大型复杂系统，支持独立开发和部署
- **组件库项目模板** - 适用于开发企业级组件库
- **文档站点模板** - 基于 VitePress 的文档站点模板

### 方式二：手动创建

如果你想手动配置项目：

```bash
# 创建项目目录
mkdir my-project
cd my-project

# 初始化 package.json
pnpm init

# 安装依赖
pnpm add vue
pnpm add -D vite @vitejs/plugin-vue typescript
```

## 启动项目

进入项目目录并启动开发服务器：

```bash
cd my-project

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

浏览器会自动打开 `http://localhost:5173`，你将看到项目首页。

## 项目结构

金恒科技信息化部前端团队的标准项目结构如下：

```
my-project/
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # 组件
│   │   ├── common/      # 通用组件
│   │   └── business/    # 业务组件
│   ├── views/          # 页面
│   ├── router/         # 路由配置
│   ├── store/          # 状态管理
│   ├── utils/          # 工具函数
│   ├── api/            # API 接口
│   ├── types/          # TypeScript 类型定义
│   ├── hooks/          # 自定义 Hooks
│   ├── App.vue         # 根组件
│   └── main.ts         # 入口文件
├── public/             # 公共资源
├── .env.development    # 开发环境变量
├── .env.production     # 生产环境变量
├── index.html          # HTML 模板
├── vite.config.ts      # Vite 配置
├── tsconfig.json       # TypeScript 配置
├── package.json        # 项目配置
└── README.md           # 项目说明
```

### 不同项目类型的结构差异

#### 单体项目
- 简化的目录结构，适合快速开发
- 所有功能模块集中在 `src` 目录下

#### 集群项目
- 支持多环境配置
- 包含部署相关配置文件
- 支持负载均衡和高可用性配置

#### Monorepo项目
- 使用 `packages` 目录管理多个子项目
- 共享配置和依赖管理
- 支持跨项目代码复用

#### 微前端项目
- 主应用和子应用分离的结构
- 支持独立开发和部署
- 包含微前端相关配置文件

## 开发规范

### 代码风格

项目已集成 ESLint 和 Prettier，请遵循以下规范：

- 使用 2 空格缩进
- 使用单引号
- 语句末尾不加分号
- 使用 TypeScript 严格模式

### 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
# 功能开发
git commit -m "feat: 添加用户登录功能"

# 问题修复
git commit -m "fix: 修复登录状态丢失问题"

# 文档更新
git commit -m "docs: 更新快速开始指南"

# 样式调整
git commit -m "style: 优化按钮样式"

# 代码重构
git commit -m "refactor: 重构用户模块"

# 性能优化
git commit -m "perf: 优化列表渲染性能"

# 测试相关
git commit -m "test: 添加登录单元测试"
```

## 工程化工具链

项目已预配置以下工具：

### 代码质量

- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **Stylelint** - 样式检查
- **TypeScript** - 类型检查

### 自动化

- **husky** - Git hooks
- **lint-staged** - 暂存文件检查
- **commitlint** - 提交信息检查

### 测试

- **Vitest** - 单元测试
- **Testing Library** - 组件测试
- **Playwright** - E2E 测试

## 常用命令

```bash
# 开发
pnpm dev              # 启动开发服务器
pnpm build            # 构建生产版本
pnpm preview          # 预览生产构建

# 代码质量
pnpm lint             # 运行 ESLint
pnpm lint:fix         # 修复 ESLint 问题
pnpm format           # 格式化代码
pnpm type-check       # TypeScript 类型检查

# 测试
pnpm test             # 运行单元测试
pnpm test:ui          # 运行测试 UI
pnpm test:e2e         # 运行 E2E 测试
```

## 下一步

现在你已经成功创建并启动了项目，接下来可以：

- 📚 阅读 [项目结构](/views/guide/project-structure) 了解详细的目录说明
- 🎨 查看 [组件库](/ui-components/) 学习如何使用组件
- 🛠️ 探索 [工程化配置](/views/engineering/scaffold) 深入了解项目配置
- ⚡ 学习 [UnoCSS](/views/unocss-guide) 使用原子化 CSS
- 📖 参考 [最佳实践](/views/best-practices/architecture) 编写高质量代码

## 遇到问题？

如果在使用过程中遇到问题：

1. 查看 [常见问题](/views/troubleshooting/) 寻找解决方案
2. 在 [内部工单系统](https://internal.jinheng.com/tickets/409322) 提交问题
3. 在文档页面下方的评论区留言
4. 联系团队成员获取帮助（企业微信/钉钉群）

## 参与贡献

金恒科技信息化部前端团队欢迎任何形式的贡献：

- 🐛 报告 Bug（通过内部工单系统 409322）
- 💡 提出新功能建议（团队内部评审）
- 📝 改进文档（直接在评论区留言或提交 PR）
- 🔧 提交代码（遵循团队代码规范）

请查看 [团队贡献指南](https://internal.jinheng.com/fe/contributing) 了解详情。

::: tip 提示
建议先阅读完整个快速开始指南，然后动手实践，这样能更快地掌握金恒科技信息化部前端团队的工程体系！如有疑问，请随时通过内部工单系统 409322 或评论区留言。
:::
