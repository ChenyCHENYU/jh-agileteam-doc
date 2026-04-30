# ESLint & Prettier 规范约定

> 本页说明团队在 ESLint、Prettier 上约定了哪些规则、为什么这样约定，以及各工具的职责边界。工具链安装与配置见 [① 工具链检测规范](./01-toolchain)。

::: info 适用范围
所有 Robot_Admin 系体项目 · 完整模式（`@robot-admin/git-standards` full preset）
:::

<AuthorTag :authors="['ZhuXiang','CHENY','ZhongYu','XuQingYu']" />

---

## ESLint 规则体系

团队使用 **Vue 3 + TypeScript + Oxlint 完整模式**，三层规则叠加：

| 规则层 | 来源 | 说明 |
| ------ | ---- | ---- |
| Oxlint 推荐 | `oxlint.configs["flat/recommended"]` | 高性能基础规则，覆盖 no-unused-vars、no-undef 等 |
| Vue 基础 | `pluginVue.configs["flat/essential"]` | Vue 模板语法、组件命名、指令用法 |
| TypeScript 推荐 | `vueTsConfigs.recommended` | TS 类型安全、导入规范、接口约定 |
| Prettier 互排 | `skipFormatting` | **关闭** ESLint 中所有格式化类规则，格式全权交给 Prettier |

---

### 关键规则详解

#### `vue/multi-word-component-names` — error

**规则**：组件名必须由多个单词组成，`index` 命名豁免（路由入口页约定）。

```vue
<!-- ✗ 禁止：单词命名 -->
<!-- 文件: Table.vue -->
<!-- 文件: Button.vue -->

<!-- ✓ 正确：多词命名 -->
<!-- 文件: BaseTable.vue -->
<!-- 文件: SearchButton.vue -->
<!-- 文件: index.vue   ← 豁免，路由入口 -->
```

**为什么**：防止与原生 HTML 元素命名冲突（`<input>` `<table>`），Vue 官方推荐规范。

---

#### `@typescript-eslint/no-explicit-any` — off（关闭）

ESLint 层面**不阻断** `any`，但须遵守 [⑨ TypeScript 类型规范](./09-typescript) 的约定（有条件使用，需注释说明）。

```typescript
// ✓ 允许（但需配合类型注释说明原因，见 09 号规范）
const res: any = await fetch(url)

// ✗ 不合理（能用具体类型就不用 any）
const name: any = 'Alice'
```

---

#### `no-undef` — off（关闭）

由 **TypeScript 编译器**接管 undefined 变量检查，ESLint 不重复。

---

#### `@typescript-eslint/no-unused-vars` — warn（来自 recommended）

声明后未使用的变量会产生警告，以 `_` 开头的参数名豁免。

```typescript
// ✗ 警告
const unusedHelper = () => {}

// ✓ 豁免（有意忽略的回调参数）
arr.forEach((_item, index) => {
  console.log(index)
})
```

---

#### `@typescript-eslint/no-require-imports` — error（来自 recommended）

禁止 CommonJS `require()`，统一使用 ESM `import`。

```typescript
// ✗ 禁止
const fs = require('fs')

// ✓ 正确
import fs from 'fs'
```

---

#### JSDoc 强制注释（完整模式 · `eslint-plugin-jsdoc`）

所有导出函数**必须**有 JSDoc 注释，具体格式见 [③ 注释规范](./03-comments)。

---

## Prettier 格式化规范

`.prettierrc.js` 的六项配置，每项均有明确的团队理由：

| 配置项 | 值 | 效果 | 约定原因 |
| ------ | -- | ---- | -------- |
| `singleQuote` | `true` | 字符串用**单引号** | 与 Vue template 内属性的双引号做视觉区分 |
| `semi` | `false` | 语句末尾**不加分号** | 减少视觉噪音，TypeScript 类型错误比缺分号更重要 |
| `printWidth` | `80` | 单行**最多 80 字符** | 标准可读宽度，超出自动换行 |
| `trailingComma` | `"all"` | 多行末尾加**逗号** | git diff 更干净（增减行不影响前一行） |
| `arrowParens` | `"avoid"` | 单参数箭头函数**省括号** | `x => x + 1` 比 `(x) => x + 1` 更简洁 |
| `endOfLine` | `"auto"` | 换行符跟随系统 | Windows（CRLF）和 Mac/Linux（LF）均可正常工作 |

### 格式化前后对比

```typescript
// ✗ 提交前（未格式化）
const getFullName = (firstName: string, lastName: string) => { return firstName + " " + lastName };

const config = {a: 1, b: 2, c: 3}

// ✓ Prettier 格式化后
const getFullName = (firstName: string, lastName: string) => {
  return firstName + ' ' + lastName  // ← semi: false，singleQuote: true
}

const config = {
  a: 1,
  b: 2,
  c: 3,  // ← trailingComma: "all"
}
```

```typescript
// ✗ 未格式化
const double = (x: number) => { return x * 2 }

// ✓ 格式化后
const double = x => x * 2  // ← arrowParens: "avoid"，单参数省括号
```

---

## ESLint 与 Prettier 的职责边界

两者**不互相冲突**，通过 `skipFormatting` 完全分工：

| 维度 | ESLint + Oxlint | Prettier |
| ---- | --------------- | -------- |
| **关注点** | 代码逻辑质量（潜在 bug、类型安全、规范违规） | 代码外观格式（缩进、引号、换行、逗号） |
| **执行时机** | pre-commit 全量检查 + IDE 实时标红 | pre-commit 暂存区格式化 + IDE 保存时自动 |
| **冲突处理** | 引入 `skipFormatting`，关闭全部格式化类规则 | 最终格式化结果由 Prettier 独家决定 |
| **修复方式** | `eslint --fix`（逻辑修复，不改外观） | `prettier --write`（重写外观，不改逻辑） |

> **记忆规则**：代码写得对不对 → ESLint 管；代码看起来整不整 → Prettier 管。

---

## 自定义扩展规则

如需追加项目专属规则，**追加在 `eslint.config.ts` 末尾**（不要修改已有部分）：

```typescript
export default defineConfigWithVueTs(
  // ...已有配置（保持不动）

  // ↓ 追加项目专属规则
  {
    rules: {
      // 禁止 console.log，只允许 warn/error（替代 05 号规范的手工约束）
      'no-console': ['error', { allow: ['warn', 'error'] }],

      // 未使用变量严格模式，_前缀豁免
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
    },
  },
)
```

Prettier 直接修改 `.prettierrc.js` 对应选项即可，无需其他操作。
