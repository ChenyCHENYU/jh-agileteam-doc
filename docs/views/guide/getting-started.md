# 快速开始

欢迎使用 AGILE TEAM 前端工程体系！本指南将帮助你快速上手。

## 环境准备

在开始之前，请确保你的开发环境满足以下要求：

### 必需工具

- **Node.js**: >= 18.0.0 （推荐使用 LTS 版本）
- **包管理器**: pnpm >= 8.0.0 （推荐）或 npm >= 9.0.0

### 推荐工具

- **编辑器**: [VS Code](https://code.visualstudio.com/)
- **终端**: Windows Terminal / iTerm2 / Warp
- **Git**: >= 2.30.0

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

使用我们提供的脚手架快速创建项目：

```bash
# 使用 pnpm
pnpm create agile-team-app my-project

# 使用 npm
npm create agile-team-app my-project

# 使用 yarn
yarn create agile-team-app my-project
```

根据提示选择项目模板：

- **Vue 3 + TypeScript** - 标准的 Vue 3 项目模板
- **React + TypeScript** - React 18 项目模板
- **组件库项目** - 组件库开发模板
- **文档站点** - VitePress 文档站点模板

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

标准的项目结构如下：

```
my-project/
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # 组件
│   ├── views/          # 页面
│   ├── router/         # 路由配置
│   ├── store/          # 状态管理
│   ├── utils/          # 工具函数
│   ├── App.vue         # 根组件
│   └── main.ts         # 入口文件
├── public/             # 公共资源
├── index.html          # HTML 模板
├── vite.config.ts      # Vite 配置
├── tsconfig.json       # TypeScript 配置
├── package.json        # 项目配置
└── README.md           # 项目说明
```

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
2. 在 [GitHub Issues](https://github.com/ChenyCHENYU/jh-agileteam-doc/issues) 提问
3. 联系团队成员获取帮助

## 参与贡献

我们欢迎任何形式的贡献：

- 🐛 报告 Bug
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 提交代码

请查看 [贡献指南](https://github.com/ChenyCHENYU/jh-agileteam-doc/blob/main/CONTRIBUTING.md) 了解详情。

::: tip 提示
建议先阅读完整个快速开始指南，然后动手实践，这样能更快地掌握整个工程体系！
:::
