# 提交规范

本文档介绍金恒科技信息化部前端团队的 Git 提交规范，确保提交信息清晰、一致且易于追踪。

## 提交信息格式

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范，提交信息格式如下：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 格式说明

- **type**（必需）：提交的类型
- **scope**（可选）：影响范围
- **subject**（必需）：简短描述
- **body**（可选）：详细描述
- **footer**（可选）：脚注信息

### 示例

```
feat(user): add user login functionality

Add user login with email and password authentication.
Implement JWT token generation and validation.

Closes #123
```

## 提交类型

### feat

新功能或特性

```bash
# 添加新功能
git commit -m "feat(auth): add OAuth login support"
git commit -m "feat(user): add user profile page"
```

### fix

修复 Bug

```bash
# 修复问题
git commit -m "fix(login): resolve token expiration issue"
git commit -m "fix(form): fix validation error display"
```

### docs

文档更新

```bash
# 更新文档
git commit -m "docs(readme): update installation guide"
git commit -m "docs(api): add API documentation"
```

### style

代码格式化（不影响代码运行的变动）

```bash
# 格式化代码
git commit -m "style(button): fix button styling"
git commit -m "style(layout): adjust spacing between components"
```

### refactor

重构（既不是新增功能，也不是修改 Bug 的代码变动）

```bash
# 重构代码
git commit -m "refactor(auth): simplify authentication flow"
git commit -m "refactor(utils): extract common functions"
```

### perf

性能优化

```bash
# 性能优化
git commit -m "perf(list): optimize list rendering performance"
git commit -m "perf(api): reduce API response time"
```

### test

测试相关

```bash
# 测试相关
git commit -m "test(login): add unit tests for login component"
git commit -m "test(api): add integration tests for user API"
```

### chore

构建过程或辅助工具的变动

```bash
# 构建工具相关
git commit -m "chore(deps): update dependencies"
git commit -m "chore(build): optimize build configuration"
```

### ci

CI/CD 相关配置

```bash
# CI/CD 配置
git commit -m "ci(github): add automated deployment"
git commit -m "ci(docker): update Dockerfile"
```

## 影响范围（scope）

scope 用于说明本次提交的影响范围，常见的 scope 包括：

### 项目模块

```
feat(auth): add two-factor authentication
fix(user): fix user profile update issue
docs(api): update API documentation
```

### 组件名称

```
feat(button): add loading state
fix(modal): fix modal positioning issue
style(table): improve table styling
```

### 文件或目录

```
feat(utils): add date formatting utility
fix(config): fix environment variable parsing
docs(readme): update project description
```

## 主题（subject）

主题是对本次提交的简短描述，遵循以下规范：

- 使用动词开头（使用现在时态）
- 首字母小写
- 不以句号结尾
- 简明扼要，一般不超过 50 个字符

```bash
# ✅ 正确
git commit -m "feat(auth): add user registration"
git commit -m "fix(api): handle network errors"
git commit -m "docs(readme): update installation steps"

# ❌ 错误
git commit -m "feat(auth): Added user registration."
git commit -m "fix(api): Fixed network errors"
git commit -m "docs(readme): Updated installation steps"
```

## 正文（body）

正文是对本次提交的详细描述，可以包括：

- 变更的动机
- 实现的方法
- 与之前行为的对比
- 注意事项

```bash
feat(auth): add password reset functionality

Implement password reset flow with email verification.
Users can now request a password reset link from the login page.
The link expires after 24 hours for security reasons.

This change addresses the security requirement for password recovery
and improves user experience by allowing self-service password reset.
```

## 脚注（footer）

脚注用于记录额外的元信息，常见用途：

### 关闭 Issue

使用 `Closes`、`Fixes` 或 `Resolves` 关键字自动关闭 Issue：

```bash
fix(login): resolve session timeout issue

Implement session refresh mechanism to prevent automatic logout.
Add warning notification before session expires.

Closes #123
Fixes #456
```

### 破坏性变更

标记破坏性变更，使用 `BREAKING CHANGE:`：

```bash
feat(api): update user API response format

Update user API response to include additional fields.
Add email verification status and last login timestamp.

BREAKING CHANGE: The user API response format has changed.
Client applications need to update their response handling.
```

### 引用相关提交

引用相关的提交或 PR：

```bash
feat(auth): implement OAuth integration

Add OAuth 2.0 support for Google and GitHub login.
Implement token exchange and user profile retrieval.

Related to #789
PR #456
```

## 提交工具

### Commitizen

我们推荐使用 [Commitizen](https://github.com/commitizen/cz-cli) 来生成符合规范的提交信息：

```bash
# 安装 commitizen
pnpm add -D commitizen @commitlint/cli @commitlint/config-conventional

# 初始化 commitizen
echo '{ "path": "@commitlint/cz-commitlint" }' > .czrc

# 提交代码
pnpm cz
```

### Git Hooks

使用 husky 和 lint-staged 自动检查提交信息：

```bash
# 安装 husky
pnpm add -D husky lint-staged

# 初始化 husky
npx husky install

# 添加 commit-msg hook
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'

# 添加 pre-commit hook
npx husky add .husky/pre-commit 'npx lint-staged'
```

### commitlint 配置

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'ci',
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 72],
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
  },
}
```

### lint-staged 配置

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,vue}": ["eslint --fix", "prettier --write"],
    "*.{css,scss,less}": ["stylelint --fix", "prettier --write"],
    "*.{md,json}": ["prettier --write"]
  }
}
```

## 常见错误

### 错误的提交类型

```bash
# ❌ 错误：使用不明确的提交类型
git commit -m "update: add new feature"
git commit -m "modify: fix bug"

# ✅ 正确：使用明确的提交类型
git commit -m "feat: add user profile feature"
git commit -m "fix: resolve login issue"
```

### 错误的提交格式

```bash
# ❌ 错误：提交信息格式不规范
git commit -m "Added new feature for user authentication"
git commit -m "Fixed bug in login component."

# ✅ 正确：提交信息格式规范
git commit -m "feat(auth): add user authentication"
git commit -m "fix(login): resolve login component issue"
```

### 过于笼统的提交信息

```bash
# ❌ 错误：提交信息过于笼统
git commit -m "fix: fix some bugs"
git commit -m "feat: add some features"

# ✅ 正确：提交信息具体明确
git commit -m "fix(form): fix validation error message display"
git commit -m "feat(user): add user profile editing feature"
```

### 一次提交包含多个不相关的变更

```bash
# ❌ 错误：一次提交包含多个不相关的变更
git commit -m "feat: add user profile and fix login bug"

# ✅ 正确：将不相关的变更分开提交
git commit -m "feat(user): add user profile feature"
git commit -m "fix(login): resolve authentication issue"
```

## 最佳实践

### 1. 原子提交

每个提交应该是一个逻辑上的原子单元，只包含一个相关的变更：

```bash
# ✅ 正确：原子提交
git add auth.service.ts
git commit -m "feat(auth): add JWT token service"

git add user.service.ts
git commit -m "feat(user): add user profile service"

# ❌ 错误：非原子提交
git add auth.service.ts user.service.ts
git commit -m "feat: add auth and user services"
```

### 2. 及时提交

频繁提交，保持每个提交的变更量小且集中：

```bash
# ✅ 正确：及时提交
git commit -m "feat(component): create button component"
# ... 继续开发 ...
git commit -m "style(button): improve button styling"
# ... 继续开发 ...
git commit -m "fix(button): fix button hover state"

# ❌ 错误：长时间不提交
# ... 开发一周后 ...
git commit -m "feat: implement complete button component with all features"
```

### 3. 清晰的提交历史

使用交互式 rebase 整理提交历史：

```bash
# 整理最近 3 次提交
git rebase -i HEAD~3

# 合并提交
pick f7f3f6d feat: add user authentication
squash 310154e fix: resolve auth issue
squash a5f4a0d style: improve auth form styling

# 保存后编辑提交信息
feat: add user authentication

Add user authentication with email and password.
Implement JWT token generation and validation.
```

### 4. 分支策略

遵循 Git Flow 分支策略：

```bash
# 功能分支
git checkout -b feature/user-authentication main
# ... 开发功能 ...
git commit -m "feat(auth): add user authentication"
git commit -m "test(auth): add authentication tests"
git checkout main
git merge --no-ff feature/user-authentication

# 修复分支
git checkout -b fix/login-issue main
# ... 修复问题 ...
git commit -m "fix(login): resolve session timeout"
git checkout main
git merge --no-ff fix/login-issue
```

## 提交检查清单

在提交代码前，请检查以下事项：

- [ ] 提交类型是否正确
- [ ] 提交范围是否明确
- [ ] 主题描述是否简明扼要
- [ ] 是否需要详细的正文描述
- [ ] 是否需要关闭相关 Issue
- [ ] 是否包含破坏性变更
- [ ] 代码是否通过所有检查
- [ ] 测试是否全部通过
- [ ] 提交是否是原子的
- [ ] 提交历史是否清晰

---

遵循以上提交规范，可以确保团队提交信息清晰、一致且易于追踪。如有疑问，请通过内部工单系统 409322 联系我们。