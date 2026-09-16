# 发版同步清单（SYNC CHECKLIST）

> 任何 `wl-skills-*` / 模板 / 基座 / CLI 发版后，按下表同步文档站。逐项打勾，全部完成后 `pnpm build` 验证并提交推送。
> 本清单是维护经验的固化：历史上发生过三次漏改（test MCP 派生值 77→78、wl 根宣贯头部停在旧版、packages.ts 版本跳版），全部因同步点多且分散。

## 一、单一数据源（必改，改这里其余自动）

| 文件 | 改什么 | 自动影响范围 |
|------|--------|-------------|
| `docs/.vitepress/components/PackagesTable/data.ts` | 对应包 `version`；若 Skill/MCP 数量变化同步 `siteStats`（skills/mcp/rules 及注释算式） | 指南五包表、首页统计卡、首页卡片文案 |
| `docs/.vitepress/components/LevelsTable/data.ts` | 仅当 L 级状态变化（如 L5 转正） | 指南、最佳实践总览三处 |

## 二、硬编码同步点（按包逐个改）

| 位置 | 改什么 |
|------|--------|
| `README.md` | 五包能力矩阵（版本/MCP/规则列）+ 对应包小节的版本号与数字 |
| 对应包板块首页 | tip 的"npm 已发布 vX"、核心能力表、五包对标表（testing/index） |
| 对应包 usage-guide / quick-start | 头部版本行 |
| `docs/views/rollout/<pkg>.md` **与** `D:\office-project\wl\<包名宣贯文档>.md` | **两份都要**：核对版本行、版本演进速览表（新增一行）、正文计数（Skill/MCP/测试数/CLI 数）、验收清单 |
| 版本演进亮点表 | testing/index 的 0.1x 演进表；kit 在 rollout 演进表 |
| `docs/views/guide/index.md` | "最近更新"表补一行（日期 + 一句话） |
| 其他包的五包对标表 | test/bd 变更时互查（README / testing / guide 由组件或矩阵覆盖的不用手改） |

## 三、能力口径新增时（新 Skill / 新规则 / 新命令）

1. 权威清单页更新（pc/skills/index 的 Skill 表与 29 Tool 表、cli.md 命令表、backend skills、testing usage-guide 的 MCP 表）——**清单只此一处，其他页面链接过来，不要复制表**；
2. 演进亮点表加行（" vX | 主题 | 对使用者的意义"三段式）；
3. 若新增 MCP/规则改变了总数：`siteStats`、README 矩阵、各五包对标、ecosystem 数据看板的计数口径一起对齐。

## 四、验证（必跑）

```bash
pnpm build        # 含 sidebar 校验（导航坏链失败）+ 死链检查 + 锚点校验（构建后自动）
```

构建产物抽查（必要时）：`dist/views/<板块>/index.html` 搜关键数字确认渲染。

## 五、npm 发布相关（test 等包）

- 发布前：确认 `package.json` version 已 bump、CHANGELOG 有对应条目、工作区干净；
- 发布：`npm.cmd publish --access public`（`prepublishOnly` 自动跑全量测试作发布门）；
- 发布后：`npm.cmd view <pkg> version` 验证 `dist-tags.latest`；本清单第一节起逐项同步；
- 生态数据看板（ecosystem/index.md）：月下载/版本列按 registry 实测刷新并更新"数据截至"日期。

## 六、已知的历史漏改（引以为戒）

| 漏改 | 教训 |
|------|------|
| test MCP 18→19 时 `siteStats.mcp` 77 未到 78 | 派生数字也要跟着改，注释里的算式写清楚 |
| wl 根宣贯头部停在 0.21.0（站内已 0.24） | rollout 双份副本必须成对改 |
| packages.ts test 版本 0.11.0 直接跳到写 0.21 之间漏 0.22 | 改完 grep 旧版本号全站扫一遍再提交 |
