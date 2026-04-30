# L2 — Skill（结构化技能文件）

> 当前项目核心。触发词驱动 → SKILL.md → 规范门控 → Pre-flight 声明 → 生成产物追加到 reports/。

<AuthorTag :authors="['CHENY']" />

## 能力概览

Skills 层是体系的**核心内核**——一组纯 TS 实现的业务原子能力，MCP Server 和 CLI 都依赖这一层的封装。

```
Skills 核心能力（Core 内核，纯 TS，MCP / CLI 共用底层）
│
├── 1. 工程元数据解析
│   ├── 原型文件解析、页面清单提取
│   ├── 路由 / 菜单 / 字典结构化提取
│   ├── 项目模块、目录、文件元信息解析
│   └── 业务模块标识、权限标识提取
│
├── 2. 代码结构化处理
│   ├── TS / JS / Vue 文件结构化读写
│   ├── 接口、类型、枚举、常量批量解析
│   ├── 组件结构、入参、事件、样式结构提取
│   └── 代码片段插入、替换、增量修改
│
├── 3. 接口与数据处理
│   ├── API 结构化生成、api.md 标准化产出
│   ├── 请求参数、响应体、枚举自动推导
│   ├── 接口批量同步、字段对齐、归一化
│   └── 模拟数据、默认结构自动生成
│
├── 4. 工程质检与修复
│   ├── 工程规范扫描、目录合规校验
│   ├── 命名、文件结构、引用依赖合规检查
│   ├── 常见不规范代码自动修复
│   └── 问题结构化上报、清单输出
│
├── 5. 模板化代码生成
│   ├── 列表 / 表单 / 详情页标准模板渲染
│   ├── 基础 CRUD 模块、基础组件批量生成
│   ├── 配置文件、脚本文件模板生成
│   └── 自定义模板变量渲染、动态填充
│
├── 6. 配置与环境管理
│   ├── 工程配置读取、解析、序列化
│   ├── 环境变量、项目全局配置统一处理
│   └── 工程依赖、基础环境信息读取
│
└── 7. 通用原子工具封装
    ├── 日期、格式化、数据转换通用方法
    ├── 路径处理、文件编码、内容编解码
    └── 通用正则、校验规则、数据清洗
```

> **核心特征**：无副作用，可被 MCP Tools 包裹后赋予“执行能力”，也可被 CLI 批量调用。v3.0 规划将此层抽离为独立 `core/` 包，MCP 和 CLI 同时依赖。

## 什么是 Skill？

Skill 是一个放在项目 `.github/skills/` 目录下的 Markdown 文件（`SKILL.md`），里面用自然语言描述：
- 何时触发（触发词）
- 执行前声明什么（Pre-flight）
- 按什么步骤执行
- 输出什么产物

AI 在对话时读取 SKILL.md，然后严格按照描述的流程执行——**不是让 AI 自由发挥，而是让 AI 执行一份"剧本"**。

## Skill 调用流程

```
用户触发 → AI 匹配 _registry.md 触发词
         → 加载 SKILL.md + 前置规范子集
         → 输出 Pre-flight 声明（可观测）
         → 按 SKILL 流程执行 → 生成产物 + reports/ 追加
```

## 前端示例 — 已启用的 9 个 Skill

| # | Skill | 路径 | 核心用途 |
|---|-------|------|---------|
| ① | `prototype-scan` | `skills/core/prototype-scan/` | 原型/详设/口述 → 页面清单 |
| ② | `api-contract` | `skills/core/api-contract/` | 生成 api.md 前后端契约 |
| ③ | `page-codegen` | `skills/core/page-codegen/` | 4 文件骨架生成 + 模板调度 |
| ④ | `convention-audit` | `skills/core/convention-audit/` | 13 条规范扫描 + 双报告 |
| ⑤ | `template-extract` | `skills/core/template-extract/` | 现有页面 → 领域模板 |
| ⑥ | `menu-sync` | `skills/sync/menu-sync/` | 菜单基线 ↔ 后端接口 |
| ⑦ | `dict-sync` | `skills/sync/dict-sync/` | 字典基线 ↔ 后端接口 |
| ⑧ | `permission-sync` | `skills/sync/permission-sync/` | 角色+菜单授权+动作（权限闭环）|
| ⑨ | `code-fix` | `skills/ops/code-fix/` | 受控自动修复偏差 |

每个启用 Skill 同目录都有 **`SKILL.md`（AI 触发用）+ `USAGE.md`（团队成员阅读）**。

## Skill 结构示例

```
.github/skills/
├── _registry.md                  ← ★ 触发词 → SKILL 路径单一数据源
├── core/
│   ├── prototype-scan/
│   │   ├── SKILL.md              ← AI 读取，描述执行流程
│   │   └── USAGE.md              ← 团队成员读取，使用说明
│   └── page-codegen/
│       ├── SKILL.md
│       ├── USAGE.md
│       └── templates/            ← 9 个页面模板（TPL-*.md）
├── sync/
│   ├── menu-sync/
│   ├── dict-sync/
│   ├── permission-sync/
│   └── env.local.json            ← 统一环境配置（不入 git）
└── ops/
    └── code-fix/
```

## 可扩展的候选 Skill

| Skill 候选 | 描述 | 前置依赖 |
|------------|------|----------|
| `prototype-diff` | 新版原型 vs 已生成代码，输出变更清单 | prototype-scan |
| `api-impact-scan` | api.md 字段变更 → 扫描受影响的 data.ts | api-contract |
| `changelog-gen` | 从 git diff 提炼 Conventional Commits 条目 | wls_git_log_extract |
| `perf-audit` | 扫描 AGGrid 列配置的性能反模式 | convention-audit |

## 延伸阅读

- [Skills 详细文档](/frontend/pc/skills/) — 9 个 Skill 的完整使用指南
- [L3 — MCP](./L3-skills-mcp) — 赋予 Skill "手和眼"（执行真实操作）
- [全景分析](./ai-landscape)
## 参考资料

| 资源 | 说明 |
|------|------|
| [@agile-team/wl-skills-kit 包（npm）](https://www.npmjs.com/package/@agile-team/wl-skills-kit) | 本项目 Skill 体系的原包 |
| [GitHub Copilot — 指令文件官方文档](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot) | Skill 触发机制的底层原理 |
| [Cursor Rules 官方文档](https://docs.cursor.com/context/rules-for-ai) | Cursor 中如何配置自动读取 SKILL.md |
| [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) | "Prompt + Tool" 结合的设计思路，Skill 模式的理论基础 |
