# 安装配置

本章节介绍如何配置和优化你的开发环境。

## 编辑器配置

### VS Code（推荐）

推荐安装以下扩展：

#### 必装扩展

- **Vue - Official** - Vue 3 官方支持
- **TypeScript Vue Plugin (Volar)** - Vue TypeScript 支持
- **ESLint** - 代码检查
- **Prettier** - 代码格式化

#### 推荐扩展

- **UnoCSS** - UnoCSS 智能提示
- **GitLens** - Git 增强
- **Error Lens** - 错误高亮
- **Auto Rename Tag** - 自动重命名标签
- **Path Intellisense** - 路径智能提示
- **Import Cost** - 导入包大小提示

### VS Code 设置

在项目根目录创建 `.vscode/settings.json`：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue"
  ],
  "typescript.tsdk": "node_modules/typescript/lib",
  "volar.takeOverMode.enabled": true
}
```

## 项目配置

### TypeScript 配置

`tsconfig.json` 配置示例：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path Mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Vite 配置

`vite.config.ts` 基础配置：

```typescript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import UnoCSS from "unocss/vite";

export default defineConfig({
  plugins: [vue(), UnoCSS()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3000,
    host: true,
    open: true,
  },
  build: {
    target: "es2015",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
  },
});
```

### ESLint 配置

`.eslintrc.cjs` 配置示例：

```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: "latest",
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  plugins: ["vue", "@typescript-eslint"],
  rules: {
    "vue/multi-word-component-names": "off",
    "@typescript-eslint/no-unused-vars": "warn",
  },
};
```

### Prettier 配置

`.prettierrc.json` 配置：

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

## Git 配置

### Git Hooks

使用 husky 配置 Git hooks：

```bash
# 安装 husky
pnpm add -D husky

# 初始化 husky
npx husky init
```

`.husky/pre-commit`：

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
```

### lint-staged

`package.json` 中配置：

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,vue}": ["eslint --fix", "prettier --write"],
    "*.{css,scss,less}": ["stylelint --fix", "prettier --write"],
    "*.{md,json}": ["prettier --write"]
  }
}
```

### commitlint

安装并配置 commitlint：

```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional
```

`commitlint.config.js`：

```javascript
module.exports = {
  extends: ["@commitlint/config-conventional"],
};
```

## 环境变量

### 开发环境 `.env.development`

```bash
# 应用标题
VITE_APP_TITLE=AGILE TEAM

# API 基础路径
VITE_API_BASE_URL=http://localhost:3000/api

# 是否开启 Mock
VITE_USE_MOCK=true
```

### 生产环境 `.env.production`

```bash
# 应用标题
VITE_APP_TITLE=AGILE TEAM

# API 基础路径
VITE_API_BASE_URL=https://api.example.com

# 是否开启 Mock
VITE_USE_MOCK=false
```

### 使用环境变量

```typescript
// 在代码中使用
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const appTitle = import.meta.env.VITE_APP_TITLE;
```

## UnoCSS 配置

`uno.config.ts` 配置示例：

```typescript
import { defineConfig, presetAttributify, presetIcons } from "unocss";

export default defineConfig({
  presets: [
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
  ],
  theme: {
    colors: {
      primary: "#667eea",
    },
  },
});
```

## 浏览器支持

项目默认支持以下浏览器：

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

可以在 `package.json` 中配置 `browserslist`：

```json
{
  "browserslist": ["> 1%", "last 2 versions", "not dead"]
}
```

## 下一步

配置完成后，你可以：

- 📖 了解 [项目结构](/views/guide/project-structure)
- 🎨 学习 [UnoCSS](/views/unocss-guide) 的使用
- 🛠️ 查看 [工程化配置](/views/engineering/scaffold)

::: tip 提示
这些配置都已经集成在脚手架中，使用脚手架创建项目可以省去大部分配置工作！
:::
