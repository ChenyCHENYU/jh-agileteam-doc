# Git 配置

本章节介绍金恒科技信息化部前端团队的 Git 相关配置规范。

## Git Hooks

使用 husky 配置 Git hooks，确保代码提交前的质量检查。

### 安装 husky

```bash
# 安装 husky
pnpm add -D husky

# 初始化 husky
npx husky init
```

### pre-commit 钩子

`.husky/pre-commit`：

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
```

这个钩子会在提交前运行 lint-staged，自动格式化和检查代码。

## lint-staged

lint-staged 可以对暂存的文件运行 linters，提高效率。

### 配置

在 `package.json` 中配置：

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,vue}": ["eslint --fix", "prettier --write"],
    "*.{css,scss,less}": ["stylelint --fix", "prettier --write"],
    "*.{md,json}": ["prettier --write"]
  }
}
```

### 说明

- **JavaScript/TypeScript/Vue**: 运行 ESLint 修复 + Prettier 格式化
- **样式文件**: 运行 stylelint 修复 + Prettier 格式化
- **Markdown/JSON**: 运行 Prettier 格式化

## commitlint

commitlint 用于检查提交信息格式，确保提交信息规范。

### 安装

```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional
```

### 配置

`commitlint.config.js`：

```javascript
module.exports = {
  extends: ["@commitlint/config-conventional"],
};
```

### commit-msg 钩子

`.husky/commit-msg`：

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
```

## 提交信息规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

- **feat**: 新功能
- **fix**: 修复 bug
- **docs**: 文档更新
- **style**: 代码格式调整（不影响代码运行）
- **refactor**: 重构（既不是新增功能，也不是修复 bug）
- **perf**: 性能优化
- **test**: 测试相关
- **chore**: 构建过程或辅助工具的变动

### 示例

```bash
# 新功能
git commit -m "feat(auth): 添加用户登录功能"

# 修复 bug
git commit -m "fix(button): 修复按钮点击无响应问题"

# 文档更新
git commit -m "docs(readme): 更新安装说明"

# 代码格式
git commit -m "style(components): 统一组件代码格式"
```

## .gitignore

推荐的 `.gitignore` 配置：

```bash
# Logs
logs
*.log
npm-debug.log*
pnpm-debug.log*

# Dependencies
node_modules/
.pnp
.pnp.js

# Build
dist/
dist-ssr/
*.local

# Editor
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local
.env.*.local

# Cache
.cache/
.temp/
.tmp/
```

::: tip 💡 提示
团队脚手架已经配置好了 Git Hooks，使用脚手架创建的项目开箱即用！
:::
