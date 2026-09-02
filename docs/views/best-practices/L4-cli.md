# L4 — CLI（命令行工具）

> 把 AI 体系的高频操作固化为可复现命令：无 AI 依赖、零推理 Token、可进 CI/CD。整个体系中**可预测性最高**的一层。

<AuthorTag :authors="['CHENY']" />

## 它解决什么问题

| 没有 L4 | 有 L4 |
|---------|-------|
| 新人接手项目，靠文档口述装规范，装漏装错没人知道 | `npx @agile-team/wl-skills-kit init` 一条命令，manifest 可追溯 |
| AI 生成的代码能不能合入，靠 Reviewer 记忆把关 | `validate` 进 CI，K1~K19 不过就阻断合并 |
| 每次发版同步规范靠人工比对 | `diff` 一条命令看本地与最新 kit 的全部差异 |

**判断标准**：这件事需要 AI 判断吗？不需要判断、只要可复现结果的，就该沉到 CLI——省 Token、可进流水线、结果稳定。

## 命令清单（权威版）

kit（v2.20.1）共 **18 个命令字**，按场景分四组：

| 场景 | 命令 |
|------|------|
| 装与升级 | `init` · `update` · `diff` · `clean` · `check` |
| 质量卡门 | `validate` · `validate-page` · `fix` · `doctor-ui` |
| 数据与协作 | `export` · `mock-clean` · `contract` · `component` · `standard-env`（`env` 为兼容别名） |
| 资产与场景 | `template` · `snapshot` · `scenario` |

> 每条命令的参数与示例，唯一权威在 **[CLI 命令参考](/frontend/pc/skills/cli)**（含 `--dry-run` 预览、`--pre-commit` 增量卡门等细节），本页不再重复。

## 什么时候用 CLI，而不是让 AI 做

| 场景 | 用 CLI | 用 AI Skill |
|------|:------:|:-----------:|
| 装规范 / 升级版本 / 清理文件 | ✅ 结果必须可复现 | — |
| 提交前卡门、CI 阻断 | ✅ 零 Token、无推理 | — |
| 生成一个新页面（要理解业务语义） | — | ✅ `page-codegen` |
| 菜单同步时判断"这个页面挂哪个目录" | — | ✅ `menu-sync` |
| 全量审计后批量修复已知反模式 | ✅ `fix` | ✅ `code-fix`（语义级修复） |

一句话：**确定性执行交给 CLI，语义判断交给 AI**——两者是分工，不是替代。

## CLI 与 AI 的分工实例

| 能力 | CLI 做 | AI 做 |
|------|--------|-------|
| 安装/更新规范文件 | ✅ `init` / `update` | — |
| 页面完整性校验 | ✅ `validate` / `validate-page` | ✅ `convention-audit`（语义级审计） |
| 反模式修复 | ✅ `fix`（机械修复：`::v-deep`→`:deep()` 等） | ✅ `code-fix`（需要判断的修复） |
| 生成页面代码 | — | ✅ `page-codegen` Skill |
| 菜单/字典同步 | — | ✅ `menu-sync` / `dict-sync` Skill |

> CLI 是"无 AI 时的兜底执行节点"，也是 L5 Agent Pipeline 的可靠底座——Pipeline 串联的每个节点，最终都以 CLI 的确定性退出码为准。当前 L5 已进入试运行（`_pipeline.md` Skill 间 I/O 契约已落地）。

## 场景实践：一次被 CI 拦下来的手改

场景：开发者觉得 scenario 渲染出来的页面某列顺序不理想，直接手改了 `index.vue` 并提交。

```text
git commit → pre-commit validate
  → 检测到 scenarioRef 页面内容与 Blueprint fingerprint 不一致（W1 防漂移）
  → 阻断提交，提示：该页面由 wl-scenario 管理，请修改 wl-scenario JSON 后重新渲染
```

开发者改 JSON → `wl-skills scenario render --confirm` 重渲染（单页 0.4~1ms、模型 token 恒为 0）→ 再次提交通过。**想绕过门禁的手改，被流程结构拦在了合入之前**——这就是 L4"把规范变成机器执行"的意义。

第二个场景是新人第一天：`init` 装规范 → `check` 环境体检 → `validate` 首轮基线体检。三步之后，他本地与团队基线的差距是一份明确的清单，而不是口口相传。

## 受保护路径

| 命令 | 保护路径 | 说明 |
|------|----------|------|
| `init` / `update` | `.wl-skills/reports/*.md` | 已存在则跳过，不覆盖累积数据 |
| `clean`（默认） | `src/components/` + `src/types/` | 业务代码必需，永不删除 |
| `clean --keep-reports` | + `.wl-skills/reports/` | 额外保留菜单/字典/权限基线 |

## 业界实践参考

> CLI 工具化是大厂 AI 工程落地的标配路径，以下案例均来自公开技术博客或官方文档。

| 公司 | 项目/工具 | 描述 |
|------|---------|------|
| **美团** | [ai-cli](https://tech.meituan.com/2024/11/29/the-evolution-and-prospect-of-meituan-agentic-ai.html) | 将 AI 能力封装为内部 CLI，支持代码生成、API Mock、规范检查等 CI 集成场景 |
| **飞书（字节）** | [MCP + CLI 工程化](https://www.feishu.cn/articles/7467851562698424371) | 将 AI 工具链封装为 CLI，支持 init / dev / deploy 全流程，并提供 MCP Server 插件扩展 |
| **Shopify** | [shopify-cli](https://shopify.dev/docs/apps/tools/cli) | 行业内最成熟的 CLI + AI 结合案例，支持 scaffold / deploy / ai-assist，与 GitHub Actions 深度集成 |
| **Vercel** | [v0 CLI](https://vercel.com/docs/cli) | 将 AI 生成组件能力封装为 CLI 命令，支持 `vercel generate` 从描述直接生成并部署 |
| **Nx（Nrwl）** | [nx generate + AI](https://nx.dev/features/generate-code) | monorepo 工程化 CLI，结合 AI 插件实现脚手架 + 依赖图分析 |

## 延伸阅读

- [CLI 命令参考（权威清单）](/frontend/pc/skills/cli)
- [L5 — Agent Pipeline](./L5-agent-pipeline) — CLI 之上的下一个层级
- [PC Skills 使用指南](/frontend/pc/skills/usage-guide) — 完整工作流
