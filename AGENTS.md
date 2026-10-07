# AGENTS.md — AI 协作改本文档站的规则

给在此仓库工作的 AI 助手（Copilot / Cursor / Claude Code 等）的操作约定。

## 必跑命令

- 改动任何内容后：`pnpm build`（六步全量校验，通过才算完成）
- 本地起服务预览：`pnpm dev`（端口 8866）

## 数据单一事实源

| 数据 | 唯一来源 | 禁止 |
|------|---------|------|
| 包版本 | npm registry（页面用 `<NpmVersion>` 实时拉取） | 在 md 里写死"当前版本" |
| 五包基础信息 | `docs/.vitepress/components/PackagesTable/data.ts` | 在多处复制版本/规则数 |
| 生态包清单 | `docs/.vitepress/components/EcosystemTable/data.ts` | 手写包数量散落各页 |
| 团队成员 | `docs/.vitepress/components/*TeamHero/data.ts` | 在页面 md 里手写成员表 |
| Skill/MCP/规则计数 | 包 tarball 实测（`npm pack` 后数文件） | 凭记忆或旧文档抄数字 |

## 写作约定

- 中文文档；代码/命令/路径用反引号
- 历史变更用" vX.Y.Z 起…"表述（允许保留），当前状态禁止写死版本号
- 新页面：加入 `sidebar.ts`（无侧边栏入口的页面是孤儿页，check 不拦但审查会拦）
- 提交：Conventional Commits；不使用 `--no-verify` 跳过检查

## 已知陷阱

- `pnpm-workspace.yaml` 的 `allowBuilds` 已固化，勿回退为占位符（会导致每次构建需手动审批）
- Vercel 部署由推 main 触发；CI（GitHub Actions）与 Vercel 并行跑同一套 `pnpm build`
- `docs/public/data/*.json` 由构建脚本生成，勿手工编辑、勿提交生成物变更（除首次）
