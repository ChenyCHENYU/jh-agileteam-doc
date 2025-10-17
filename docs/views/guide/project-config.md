# 项目配置

本章节介绍金恒科技信息化部前端团队的项目配置规范。

## TypeScript 配置

::: warning ⚠️ 注意
以下配置为团队统一的基线配置，**不建议开发者随意修改**。如需调整，请联系项目 Code Master。
:::

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

### 配置说明

- **target**: 编译目标为 ES2020，支持现代浏览器
- **moduleResolution**: 使用 bundler 模式，适配 Vite
- **strict**: 启用严格类型检查
- **paths**: 配置路径别名，`@` 指向 `src` 目录

## Vite 配置

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

### 配置说明

- **plugins**: 集成 Vue 和 UnoCSS 插件
- **alias**: 配置 `@` 路径别名
- **server**: 开发服务器配置，默认端口 3000
- **build**: 构建配置，代码分割和体积警告

## ESLint 配置

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

### 配置说明

- **extends**: 继承推荐配置和 Prettier
- **parser**: 使用 vue-eslint-parser 解析 Vue 文件
- **rules**: 自定义规则，允许单词组件名

## Prettier 配置

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

### 配置说明

- **semi**: 不使用分号
- **singleQuote**: 使用单引号
- **printWidth**: 每行最大字符数 100
- **trailingComma**: ES5 风格的尾逗号

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

::: tip 💡 提示
这些配置都已经集成在团队脚手架中，使用脚手架创建项目可以省去大部分配置工作！
:::
