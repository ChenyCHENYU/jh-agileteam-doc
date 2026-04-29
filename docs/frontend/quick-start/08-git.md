# Git 分支 & 提交规范（08）

> **平台规范第 08 条** · 强制度：🔴 必遵。本项目强制使用 `@robot-admin/git-standards` 完整模式（Commitizen + Commitlint + Husky + ESLint + Prettier + Oxlint + lint-staged）。

::: info 来源
`@agile-team/wl-skills-kit` · `standards/08-git.md` ·
工具链：[`@robot-admin/git-standards`](https://www.npmjs.com/package/@robot-admin/git-standards) v1.0.3
:::

<AuthorTag author="CHENY" />

---

## 提交方式（强制）

初始化后，两种方式均可唤醒规范化提交：

```bash
# 方式一：通过 package.json scripts（推荐，无需全局安装）
bun run cz
npm run cz

# 方式二：通过 git 子命令（需全局安装 commitizen）
npm install -g commitizen
git cz
```

::: danger 禁止
`git commit -m "xxx"` 直接提交 — 绕过 commitizen 交互，可能不符合 commitlint 规则，husky 会拦截。
:::

---

## 完整提交流程

```
bun run cz / git cz
    │
    ▼
.cz-config.js → 交互式选类型、填 scope、写描述
    │
    ▼
git commit（由 commitizen 触发）
    │
    ├─ .husky/pre-commit 触发：
    │   1. oxlint --max-warnings 0       ← 快速全量 lint
    │   2. lint-staged                   ← 增量检查暂存文件
    │       ├─ oxlint --deny-warnings
    │       ├─ eslint --fix --no-cache
    │       └─ prettier --write
    │
    ├─ .husky/commit-msg 触发：
    │   commitlint --edit "$1"           ← 校验提交信息格式
    │
    ▼
提交成功 ✅
```

---

## 提交类型（type）完整枚举

| type | emoji | 说明 |
| ---- | ----- | ---- |
| `wip` | 🚧 | 开发中（未完成的工作，临时提交） |
| `feat` | 🎯 | 新功能 |
| `fix` | 🐛 | Bug 修复 |
| `perf` | ⚡️ | 性能优化 |
| `deps` | 📦 | 依赖更新 |
| `refactor` | ♻️ | 重构（不新增功能，不修复 bug） |
| `docs` | 📚 | 文档变更 |
| `test` | 🔎 | 测试相关 |
| `style` | 💄 | 代码样式（空格、格式、缩进，不影响逻辑） |
| `build` | 🧳 | 构建 / 打包相关 |
| `chore` | 🔧 | 其他杂项（工具链配置等） |
| `revert` | 🔙 | 回退 |

---

## scope 强制填写规则

- ❌ 禁止留空（`allowEmptyScopes: false`）
- ✅ 允许自由输入（`allowCustomScopes: true`）
- 格式：`type(scope): 中文描述`，scope 建议写**模块/子模块**

```
feat(mmwr-customer): 新增客户档案页面
fix(domestic-trade): 修复订单状态切换闪烁
refactor(c_formModal): 重构表单回填逻辑
deps(package.json): 升级 vite 至 5.4
wip(quality-inspection): 质检报告页开发中
```

提交 subject（描述）限制 **88 个字符**以内（`subjectLimit: 88`）。

---

## 完整 .cz-config.js

```javascript
module.exports = {
  scopes: [],               // 默认空，可自定义添加预设 scope
  allowEmptyScopes: false,  // 不允许空 scope
  allowCustomScopes: true,  // 允许自由输入 scope

  types: [
    { value: "wip",      name: "wip:      🚧 开发中" },
    { value: "feat",     name: "feat:     🎯 新功能" },
    { value: "fix",      name: "fix:      🐛 Bug 修复" },
    { value: "perf",     name: "perf:     ⚡️ 性能优化" },
    { value: "deps",     name: "deps:     📦 依赖更新" },
    { value: "refactor", name: "refactor: ♻️  重构" },
    { value: "docs",     name: "docs:     📚 文档变更" },
    { value: "test",     name: "test:     🔎 测试相关" },
    { value: "style",    name: "style:    💄 代码样式" },
    { value: "build",    name: "build:    🧳 构建/打包" },
    { value: "chore",    name: "chore:    🔧 其他杂项" },
    { value: "revert",   name: "revert:   🔙 回退" },
  ],

  messages: {
    type:         "请选择提交类型:",
    customScope:  "请输入修改范围(必填，格式如：模块/子模块):",
    subject:      "请简要描述提交(必填，不加句号):",
    body:         "请输入更详细的说明(可选):\n",
    footer:       'Footer(可选): 例如 "Closes #123" 或 "Release-As: 1.3.1"\n',
    confirmCommit: "确认提交以上内容？(y/n/e/h)",
  },

  skipQuestions: ["body"],              // 默认跳过 body
  allowBreakingChanges: ["feat", "fix", "refactor"],
  breakingPrefix: "BREAKING CHANGE:",
  subjectLimit: 88,
};
```

---

## commitlint.config.js — 校验规则

```javascript
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2, "always",
      ["wip","feat","fix","perf","deps","refactor","docs","test","style","build","chore","revert"],
    ],
    "type-case":        [2, "always", "lower-case"],  // type 必须小写
    "subject-empty":    [2, "never"],                 // subject 不能为空
    "type-empty":       [2, "never"],                 // type 不能为空
    "subject-full-stop":[0, "never"],                 // subject 末尾不加句号（不强制）
    "header-max-length":[2, "always", 88],            // header 最长 88 字符
  },
};
```

---

## Husky Hooks

### .husky/commit-msg

```bash
# 校验提交信息格式（始终存在）
bunx --no-install commitlint --edit "$1"
# 或 npm/pnpm 环境：npx commitlint --edit "$1"
```

### .husky/pre-commit（完整模式）

```bash
# 快速全量 Oxlint（50x faster）
bunx oxlint --max-warnings 0
# 暂存区增量检查
bunx lint-staged
```

> hook 文件自动设置可执行权限（`chmod 755`），确保 Git Bash / WSL 正常运行。

---

## 分支命名规范

```
feat/xxx       新功能
fix/xxx        Bug 修复
refactor/xxx   重构
docs/xxx       文档更新
chore/xxx      构建/工具变更
perf/xxx       性能优化
test/xxx       测试相关
```

---

## AI 辅助 commit message

AI 在协助生成提交信息时，按以下格式输出建议（由开发者通过 `bun run cz` 交互式确认，**不主动执行 git commit**）：

```
feat(模块名): 中文描述（≤88字符）

- 变更点 1
- 变更点 2
```

---

## 故障排除

### Husky Hooks 未执行

**现象**：提交时没触发 lint，直接提交成功。
**原因**：Git Bash / WSL 下 hook 文件缺少执行权限。

```bash
# 检查权限（应显示 -rwxr-xr-x）
ls -la .husky/pre-commit .husky/commit-msg

# 修复权限
chmod +x .husky/pre-commit .husky/commit-msg
```

### Commitizen 提示 "git-cz command not found"

```bash
# 推荐：使用 npm scripts，无需全局安装
npm run cz  # 或 bun run cz

# 若需全局安装
npm install -g commitizen
```

### Windows 下 Husky 不工作

```bash
# 检查 hooksPath
git config core.hooksPath

# 如果不是 .husky，重置
git config --unset core.hooksPath
npm run prepare  # 重新初始化 husky
```

### Doctor 快速诊断

```bash
node node_modules/@robot-admin/git-standards/bin/robot-standards.js doctor
```
