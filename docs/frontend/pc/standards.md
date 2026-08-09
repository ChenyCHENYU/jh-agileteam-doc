# PC 端扩展规范

<AuthorTag :authors="['ZhuXiang','CHENY','ZhongYu','XuQingYu','MaJiaRui']" />

::: info 说明
本版块收录 PC 端专属扩展规范（平台规范系列 12–14 条），是通用工程规范（01–11 条）之上、针对微服务平台架构和 `@jhlc/common-core` 组件体系的专项约定。

通用工程规范（01–11）请参阅 [快速上手 — 规范约定](/frontend/quick-start/)。
:::

---

## 规范全景

前端编码规范共 **14 条**，由 `@agile-team/wl-skills-kit` 统一分发（`.github/standards/` 目录），按职责分为 8 大类，是 AI 生成代码、规范审计与 CI 卡门的唯一基线。

| 分类 | 规范编号 | 覆盖范围 |
|------|---------|---------|
| 🛠️ 工具链 | 01 | pnpm / ESLint / Prettier / Husky 前置检测 |
| 📁 工程结构 | 02 | 三文件分离、9 段式组织顺序、目录层级 |
| 📝 命名与注释 | 03、04 | 注释规范、基础编码（命名/缩进/字符串/大括号） |
| 🔒 安全 | 06 | `v-html` 防护、禁 `eval`、禁直连 `axios`、密钥管理 |
| ⚙️ 配置与协作 | 05、07、08 | 日志管控、`VITE_` 环境变量、Git 分支与提交规范 |
| 🗄️ 数据层 | 09、10 | TypeScript 类型约束、Pinia Store 结构 |
| 🖼️ 视图层 | 11、14 | 表单校验、布局容器（规划中） |
| 🧩 组件层 | 12、13 | BaseTable + AGGrid、平台封装组件合规 |

---

## 规范列表

### 通用工程规范（01–11）

| 编号 | 规范名称 | 强制度 | 摘要 |
| ---- | -------- | ------ | ---- |
| [01](/frontend/quick-start/01-toolchain) | 工具链规范 | 🔴 阻断式 | `.prettierrc.js` / `eslint.config.ts` / `.husky/` 三件套前置检测，未通过则 AI 暂停生成 |
| [02](/frontend/quick-start/02-code-structure) | 代码结构与顺序规范 | 🔴 必遵 | 四文件分离、`<script setup>` 9 段式组织顺序 |
| [03](/frontend/quick-start/03-comments) | 注释规范 | 🟡 应遵 | 文件头注释、JSDoc、杜绝显而易见的注释 |
| [04](/frontend/quick-start/04-coding-basics) | 基础编码规范 | 🟡 应遵 | 命名/缩进/字符串/大括号/`for...in` 禁用等 13 条 |
| [05](/frontend/quick-start/05-logging) | 日志输出规范 | 🟡 应遵 | `console.*` 残留管控，生产环境统一处理 |
| [06](/frontend/quick-start/06-security) | 安全规范 | 🔴 必遵 | `v-html` 需注释、禁 `eval`、禁直连 `axios`、密钥不入库 |
| [07](/frontend/quick-start/07-config) | 配置管理规范 | 🔴 必遵 | `VITE_` 前缀环境变量、禁硬编码 `http://` IP、`baseURL` 标准化 |
| [08](/frontend/quick-start/08-git) | Git 分支 & 提交规范 | 🔴 阻断式 | Conventional Commits + commitlint，husky 自动拦截 |
| [09](/frontend/quick-start/09-typescript) | TypeScript 类型规范 | 🟡 应遵 | 严格模式、禁滥用 `any`、明确类型定义 |
| [10](/frontend/quick-start/10-pinia) | Pinia 状态管理规范 | 🔴 必遵 | Store 模块划分、`data.ts` 内禁 import Store |
| [11](/frontend/quick-start/11-form-validation) | 表单与校验规范 | 🔴 必遵 | 表单 `validate` / `resetFields` 必备、异步校验约定 |

### PC 端扩展规范（12–14）

| 编号 | 规范名称 | 强制度 | 摘要 |
| ---- | -------- | ------ | ---- |
| [12](/frontend/pc/12-base-table) | BaseTable 渲染与 AGGrid cid 唯一性规范 | 🔴 必遵 | AGGrid 渲染模式、cid 全局唯一命名规则（base-36 时间戳） |
| [13](/frontend/pc/13-platform-components) | 平台组件合规规范 | 🔴 阻断式 | 强制使用平台封装组件对照表，禁止直接使用 `el-*` 原生组件 |
| 14 | 布局容器规范 | 📋 规划中 | 页面布局容器（`page-container` / `jh-drag-*`）约定，编号顺延 |

---

## 规范执行机制

14 条规范并非"贴在墙上的文档"，而是通过**三层强制机制**落地，确保 AI 生成代码与人工提交代码均对齐基线。

### 第一层：AI 自动门控（生成阶段）

`.github/standards/index.md` 是规范的门控中枢。AI 在执行任何代码生成任务**之前**，按**任务类型**自动加载相关规范子集（而非全量加载，节省上下文）：

```
任务类型 → 门控规则 → 加载哪几条规范
─────────────────────────────────────
page-codegen（页面生成）  → 02 + 04 + 06 + 09 + 12 + 13
api-contract（接口生成）  → 02 + 06 + 09
code-fix（自动修复）      → 全量（01–13）
```

::: tip 单一数据源
14 条规范的唯一来源是 `.github/standards/01 ~ 14`，不接受"旧代码一直这么写"的辩解。规范升级时通过 `wl-skills-kit update` 增量覆盖。
:::

### 第二层：validate CI 卡门（提交阶段）

`wl-skills-kit` 提供 `validate` 子命令，作为 CI 流水线的**硬性卡门**：

```bash
# 静态校验页面完整性（4 文件、AGGrid、cid、mock、api.md）
# + AST 语义级 R1~R18 检测（圈复杂度、分页边界、运行时边界等）
npx @agile-team/wl-skills-kit validate

# 单页面校验
npx @agile-team/wl-skills-kit validate-page <path>
```

CI 中校验未通过 → **构建中止**，偏差代码无法进入主干。`code-fix` 完成修复后会**强制复扫** `validate`，形成闭环。

### 第三层：husky / lint-staged 拦截（本地阶段）

提交前由 `.husky/pre-commit` 触发 lint-staged，对暂存区文件执行 ESLint + Prettier + commitlint，规范 08（Git 提交）在本地即被拦截，无需等待 CI。

```
本地 husky 拦截（08 提交规范）
    → CI validate 卡门（02/12/13 等）
        → convention-audit 体检（全量 01–13）
```

---

## 与 convention-audit Skill 的关系

[`convention-audit`](./skills/convention-audit) Skill 是 14 条规范的**执行引擎**：以 `.github/standards/` 为唯一基线，扫描项目源码，输出偏差报告与组件提取建议，写入 `reports/` 目录。

| 维度 | 规范本身 | convention-audit |
|------|---------|-----------------|
| 角色 | 标准（应然） | 扫描器（实然 vs 应然） |
| 产出 | `.github/standards/*.md` | `reports/规范审查报告.md` + `reports/组件提取建议.md` |
| 动作 | 静态文本 | 发现偏差 + 给出整改建议，**不自动修复** |
| 配合 Skill | — | `code-fix`（自动修 🟡🟢）· `page-codegen`（重生成 🔴）· `template-extract`（提取组件） |

::: warning 审计不修复，修复不审计
`convention-audit` 只负责**发现**偏差；实际修复由 [`code-fix`](./skills/code-fix) Skill 完成（受控整改 🟡🟢 等级偏差），严重偏差（🔴）需人工介入或用 `page-codegen` 重新生成。
:::

**典型闭环**：`page-codegen` 生成代码 → 后置自动跑一次 `convention-audit` → 偏差入 `reports/` → 触发 `code-fix` 整改 → 强制复扫 `validate` → ✅ 交付。

---

## 扩展说明

- **编号延续**：本版块规范编号从 12 起，接续快速上手中的 01–11，统一归属 `@agile-team/wl-skills-kit` 平台规范体系
- **未来扩展**：PC 端新增规范在此追加，编号顺延（14、15…）；移动端 H5 独有规范见 [移动端扩展规范](../mobile-h5/standards)
