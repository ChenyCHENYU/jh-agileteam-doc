# 工具链规范（01）

> **平台规范第 01 条** · 强制度：🔴 阻断式。检测未通过 → AI 必须暂停代码生成。

::: info 来源
`@agile-team/wl-skills-kit` · `standards/01-toolchain.md`
:::

<AuthorTag :authors="['ZhuXiang','CHENY','ZhongYu','XuQingYu']" />

---

## 一、工具链前置检测

确认项目已正确安装 `@robot-admin/git-standards`，工具链有效。

### 检测项

AI 在执行任何代码生成任务**之前**，必须检查以下三个特征文件是否存在于项目根目录：

```
✓ .prettierrc.js
✓ eslint.config.ts
✓ .husky/  （目录）
```

### 判定规则

| 状态         | 处理                        |
| ------------ | --------------------------- |
| 三者全部存在 | ✅ 工具链就绪，继续执行任务 |
| 缺任意一个   | ❌ 暂停任务，输出下方提示   |

### 暂停提示标准格式

```
❌ 工具链检测失败：未找到 .prettierrc.js / eslint.config.ts / .husky/
   → 请执行：npx @robot-admin/git-standards init
   → 或联系 CHENY（工号 409322）解决
   → ⛔ 代码生成已暂停，修复后重新触发
```

### Pre-flight 声明示例

工具链就绪：

```
✅ 工具链检测：.prettierrc.js ✓  eslint.config.ts ✓  .husky/ ✓  [全部就绪]
```

工具链缺失：

```
❌ 工具链检测：未检测到 .husky/  → 已暂停，提醒已发出
```

---

### 为什么必须前置

- `eslint.config.ts` 缺失 → 代码风格无法约束，AI 生成代码可能不通过 lint
- `.prettierrc.js` 缺失 → 格式不统一，团队协作冲突
- `.husky/` 缺失 → 提交前钩子失效，console.log / 死代码会进入仓库

---

## 二、ESLint 规则体系

::: info 适用范围
所有 Robot_Admin 系体项目 · 完整模式（`@robot-admin/git-standards` full preset）
:::

团队使用 **Vue 3 + TypeScript + Oxlint 完整模式**，三层规则叠加：

| 规则层 | 来源 | 说明 |
| ------ | ---- | ---- |
| Oxlint 推荐 | `oxlint.configs["flat/recommended"]` | 高性能基础规则，覆盖 no-unused-vars、no-undef 等 |
| Vue 基础 | `pluginVue.configs["flat/essential"]` | Vue 模板语法、组件命名、指令用法 |
| TypeScript 推荐 | `vueTsConfigs.recommended` | TS 类型安全、导入规范、接口约定 |
| Prettier 互排 | `skipFormatting` | **关闭** ESLint 中所有格式化类规则，格式全权交给 Prettier |

### 关键规则说明

#### `vue/multi-word-component-names` — error

组件名必须由多个单词组成，`index` 命名豁免（路由入口页约定）。

```vue
<!-- ✗ 禁止：单词命名 -->
<!-- 文件: Table.vue / Button.vue -->

<!-- ✓ 正确：多词命名 -->
<!-- 文件: BaseTable.vue / SearchButton.vue / index.vue（豁免） -->
```

**为什么**：防止与原生 HTML 元素命名冲突（`<input>` `<table>`），Vue 官方推荐规范。

#### `@typescript-eslint/no-explicit-any` — off

ESLint 层面不阻断 `any`，但须遵守 [⑨ TypeScript 类型规范](./09-typescript) 的约定（有条件使用，需注释说明原因）。

#### `no-undef` — off

由 **TypeScript 编译器**接管 undefined 变量检查，ESLint 不重复。

#### `@typescript-eslint/no-unused-vars` — warn

声明后未使用的变量会产生警告，以 `_` 开头的参数名豁免。

```typescript
// ✓ 豁免（有意忽略的回调参数）
arr.forEach((_item, index) => { console.log(index) })
```

#### `@typescript-eslint/no-require-imports` — error

禁止 CommonJS `require()`，统一使用 ESM `import`。

#### JSDoc 强制注释（完整模式）

所有导出函数**必须**有 JSDoc 注释，具体格式见 [③ 注释规范](./03-comments)。

### 自定义扩展规则

如需追加项目专属规则，**追加在 `eslint.config.ts` 末尾**（不要修改已有部分）：

```typescript
export default defineConfigWithVueTs(
  // ...已有配置（保持不动）

  {
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
    },
  },
)
```

---

## 三、Prettier 格式化规范

`.prettierrc.js` 六项配置：

| 配置项 | 值 | 效果 | 约定原因 |
| ------ | -- | ---- | -------- |
| `singleQuote` | `true` | 字符串用**单引号** | 与 Vue template 属性双引号做视觉区分 |
| `semi` | `false` | 末尾**不加分号** | 减少噪音，TypeScript 类型错误比缺分号更重要 |
| `printWidth` | `80` | 单行最多 **80 字符** | 标准可读宽度，超出自动换行 |
| `trailingComma` | `"all"` | 多行末尾加**逗号** | git diff 更干净（增减行不影响前一行） |
| `arrowParens` | `"avoid"` | 单参数箭头函数**省括号** | `x => x + 1` 比 `(x) => x + 1` 更简洁 |
| `endOfLine` | `"auto"` | 换行符跟随系统 | Windows（CRLF）和 Mac/Linux（LF）均可正常工作 |

### ESLint 与 Prettier 职责边界

> 代码**写得对不对** → ESLint 管；代码**看起来整不整** → Prettier 管。

两者通过 `skipFormatting` 完全分工，不互相冲突：
- ESLint：代码逻辑质量（潜在 bug、类型安全、规范违规）
- Prettier：代码外观格式（缩进、引号、换行、逗号），最终格式化结果由 Prettier 独家决定
