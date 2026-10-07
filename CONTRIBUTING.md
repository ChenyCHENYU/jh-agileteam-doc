# 贡献指南

感谢为 AGILE TEAM 文档站贡献内容！本文帮你快速定位"改哪里、怎么验证"。

## 环境与命令

```bash
pnpm install   # Node.js ≥ 20 / pnpm ≥ 10
pnpm dev       # 本地开发 → http://localhost:8866
pnpm build     # 全量校验 + 构建（提交前务必本地跑通）
```

`pnpm build` 依次执行：

| 步骤 | 脚本 | 拦截内容 |
|------|------|---------|
| 数据生成 | `scripts/gen-site-data.mjs` | 首页累计发版数、更新日志（git log） |
| 侧边栏检查 | `scripts/check-sidebar.mjs` | 导航/侧边栏指向不存在的页面 |
| 写死版本检查 | `scripts/check-data.mjs` | 正文写死包"当前版本"（应改用 `<NpmVersion>`） |
| 死链检查 | `scripts/check-links.mjs` | 正文站内相对链接 404 |
| 构建 | `vitepress build` | SSG 渲染错误 |
| 锚点检查 | `scripts/check-anchors.mjs` | 站内锚点跳转失效 |

任何一步失败都会中断——**不要用跳过检查的方式绕过**，按报错修。

## 常见修改的入口

| 要改什么 | 去哪里 |
|---------|--------|
| 顶部导航 / 侧边栏 | `docs/.vitepress/config/nav.ts` / `sidebar.ts` |
| 团队成员（英雄墙） | `docs/.vitepress/components/*TeamHero/data.ts` |
| 五包基础信息（版本兜底/链接） | `docs/.vitepress/components/PackagesTable/data.ts` |
| 生态看板包清单 | `docs/.vitepress/components/EcosystemTable/data.ts` |
| 全局样式 | `docs/.vitepress/theme/custom.css` |

## 硬性约定

1. **版本号一律用 `<NpmVersion pkg="@agile-team/xxx" fallback="当前值" />`**，不写死——`check-data` 会拦截。历史变更表述（"v2.18.0 起…"）不受限。
2. **新增包**：在 `EcosystemTable/data.ts` 追加一行（npm 已无匿名 scope 枚举接口，无法全自动）。
3. **数字口径**：Skill/MCP/规范数等以包实测为准（`npm pack` 下载 tarball 数文件），不凭记忆写。
4. **提交规范**：Conventional Commits（`docs(scope): 描述`），推 main 自动触发 Vercel 部署与 CI。
5. 发版同步流程见 `scripts/SYNC-CHECKLIST.md`。
