# L4 — CLI（命令行工具）

> 将 AI 体系的安装/更新/清理固化为可复现的命令，无 AI 依赖即可执行，适合 CI/CD 集成。

<AuthorTag :authors="['CHENY']" />

## 能力概览

CLI 层是体系的**固化执行层**——将高频 AI 操作聚合成可重复执行的命令，无需 AI 推理，适合 CI/CD 集成和批量自动化。

```
CLI 能力
│
├── 1. 工程化批量指令
│   ├── 一键同步：菜单 / 字典 / 接口 / 路由批量 sync
│   ├── 一键審计：工程规范、代码、目录合规 audit
│   ├── 批量修复：规范问题、格式问题 --fix 自动修复
│   └── 全局扫描：全项目 / 指定目录结构化扫描
│
├── 2. 模板化一键生成
│   ├── 页面级生成：列表 / 表单 / 详情标准页面
│   ├── 模块级生成：完整业务 CRUD 模块脚手架
│   ├── 文档生成：批量产出 api.md、详设片段
│   └── 配置生成：工程基础配置、脚本配置初始化
│
├── 3. 工作流编排执行
│   ├── 自定义 workflow 任务编排
│   ├── YAML 流程定义、顺序 / 串行任务执行
│   ├── 多步骤串联：解析 → 生成 → 格式化 → 校验
│   └── 任务日志、执行结果标准化输出
│
├── 4. CI/CD 无人値守适配
│   ├── 无交互静默执行、exit-code 状态返回
│   ├── 流水线集成、构建前规范校验
│   ├── 增量检测、仅变更内容处理
│   └── 机器可读 JSON / 结构化输出
│
├── 5. 项目基线管控
│   ├── 部门基线规则统一落地执行
│   ├── 版本对齐、规范基线版本校验
│   ├── 新人项目初始化、基线一键植入
│   └── 统一输出口径，标准化交付物
│
└── 6. 轻量人机交互
    ├── 简单参数传参、指令简写、别名兼容
    ├── 彩色终端日志、执行进度、结果汇总
    └── 错误友好提示、问题定位指引
```

> **核心特征**：极简 Token（不需要 AI 推理）、零人工干预、可 CI/CD 集成。是整个 AI 体系中**可预测性最高**的一层。

## 前端示例 — 当前已实现的命令

```bash
# 全量安装（默认）
npx @agile-team/wl-skills-kit

# 增量更新（仅覆盖有变化的文件，自动保护 reports/）
npx @agile-team/wl-skills-kit update

# 构建前清理（保留 src/components + src/types）
npx @agile-team/wl-skills-kit clean

# 清理但保留 reports/（菜单/字典/权限累积数据）
npx @agile-team/wl-skills-kit clean --keep-reports

# 任何命令都可加 --dry-run 预览，不实际写入
npx @agile-team/wl-skills-kit update --dry-run
```

> 全局安装后也可直接用 `wl-skills` 命令（如 `wl-skills update`）。

## CLI 命令功能详解

| 命令 | 功能 | 典型使用场景 |
|------|------|------------|
| `init`（默认） | 全量安装 + 多编辑器配置 + MCP 配置生成 | 新项目接入 |
| `update` | MD5 比对增量更新，保护 `reports/` | kit 版本升级 |
| `clean` | 移除 AI 文件（保留 components + types） | 构建前清理 |
| `--dry-run` | 预览模式，不实际写入任何文件 | 确认变更范围 |
| `--keep-reports` | clean 时额外保留 `reports/` | 保护菜单/字典积累数据 |

## 受保护路径

| 命令 | 保护路径 | 说明 |
|------|----------|------|
| `init` / `update` | `.github/reports/*.md` | 已存在则跳过，不覆盖累积数据 |
| `clean`（默认） | `src/components/` + `src/types/` | 业务代码必需，永不删除 |
| `clean --keep-reports` | + `.github/reports/` | 额外保留菜单/字典/权限基线 |

## v2.4 计划扩展命令

| 命令 | 优先级 | 价值 |
|------|--------|------|
| `wl-skills check` | P0 | 一键环境预检：Node 版本 / 工具链 / `env.local.json` 填写状态 / MCP server 连通性。新成员接手项目第一步就跑这个，节省 30 分钟排查时间 |
| `wl-skills diff` | P0 | 比对业务项目已安装文件与最新 kit 版本的差异，让 `update` 决策有据可依 |
| `wl-skills export` | P1 | 把 `reports/SYS_MENU_INFO.md` + `SYS_DICT_INFO.md` 导出为 Excel（`xlsx` 包已在 devDependencies）|
| `wl-skills validate` | P1 | 无 AI、纯静态扫描 `src/views/`：检查每模块 4 文件完整性，适合 CI 阶段卡门 |

## CLI 与 AI 的分工

| 能力 | CLI 做 | AI 做 |
|------|--------|-------|
| 安装/更新规范文件 | ✅ `init` / `update` | — |
| 清理临时文件 | ✅ `clean` | — |
| 生成页面代码 | — | ✅ `page-codegen` Skill |
| 菜单/字典同步 | — | ✅ `menu-sync` / `dict-sync` Skill |
| 规范检查 | ✅（v2.4 `validate`） | ✅ `convention-audit` Skill |

> CLI 是"无 AI 时的兜底执行节点"。更高阶是 L5 Agent Pipeline：让 AI 自主串联多个 Skill，CLI 和 Agent Pipeline 并不冲突，前者是后者的可靠底座。

## 延伸阅读

- [L5 — Agent Pipeline](./L5-agent-pipeline) — CLI 之上的下一个层级
- [PC Skills 使用指南](/frontend/pc/skills/usage-guide) — 完整工作流

## 业界实践参考

> CLI 工具化是大厂 AI 工程落地的标配路径，以下案例均来自公开技术博客或官方文档。

| 公司 | 项目/工具 | 描述 |
|------|---------|------|
| **美团** | [ai-cli](https://tech.meituan.com/2024/11/29/the-evolution-and-prospect-of-meituan-agentic-ai.html) | 美团 AI 工程化落地，将 AI 能力封装为内部 CLI，支持代码生成、API Mock、规范检查等 CI 集成场景 |
| **飞书（字节）** | [MCP + CLI 工程化](https://www.feishu.cn/articles/7467851562698424371) | 飞书开放平台将 AI 工具链封装为 CLI，支持 init / dev / deploy 全流程，并提供 MCP Server 插件扩展 |
| **Shopify** | [shopify-cli](https://shopify.dev/docs/apps/tools/cli) | 行业内最成熟的 CLI + AI 结合案例，支持 scaffold / deploy / ai-assist，与 GitHub Actions 深度集成 |
| **Vercel** | [v0 CLI](https://vercel.com/docs/cli) | v0 将 AI 生成组件能力封装为 CLI 命令，支持 `vercel generate` 直接从描述生成并部署组件 |
| **Nx（Nrwl）** | [nx generate + AI](https://nx.dev/features/generate-code) | monorepo 工程化 CLI，结合 AI 插件实现代码脚手架 + 依赖图分析，在大型前端团队中广泛使用 |

## 参考资料

| 资源 | 说明 |
|------|------|
| [美团 AI 工程化演进与展望](https://tech.meituan.com/2024/11/29/the-evolution-and-prospect-of-meituan-agentic-ai.html) | 美团技术博客，AI CLI 与 Agent 工程化实践 |
| [飞书开放平台 MCP & CLI](https://www.feishu.cn/articles/7467851562698424371) | 飞书将 AI 工具链 CLI 化的官方方案 |
| [Shopify CLI 官方文档](https://shopify.dev/docs/apps/tools/cli) | 成熟的 CLI+AI 脚手架参考实现 |
| [Nx Code Generation](https://nx.dev/features/generate-code) | monorepo CLI + AI 代码生成，大规模团队参考 |
| [npm — @anthropic-ai/claude-code](https://www.npmjs.com/package/@anthropic-ai/claude-code) | Claude 官方 CLI，AI + CLI 融合的最新形态 |

