# CLI 工具

`@agile-team/wl-skills-kit` 提供 3 个 CLI 子命令：`init`（默认）、`update`、`clean`。

## init（默认）

首次安装或完整重装 — 全量写入所有文件。

```bash
npx @agile-team/wl-skills-kit              # 等同于 init
npx @agile-team/wl-skills-kit init
npx @agile-team/wl-skills-kit --dry-run    # 预览模式
```

执行后写入 117 个文件到项目中，同时生成 `.wl-skills-manifest.json` 清单文件。

## update

增量更新 — 基于 MD5 比对，仅覆盖有变化的文件，跳过未变化的文件。

```bash
npx @agile-team/wl-skills-kit@latest update
npx @agile-team/wl-skills-kit update --dry-run
```

输出示例：

```
完成!
  新增: 3 个文件
  更新: 5 个文件
  未变: 109 个文件
```

> 需要先执行过 `init` 才能使用 `update`（依赖 `.wl-skills-manifest.json` 清单文件）。

## clean

构建前清理 — 移除 AI 开发辅助文件（Skill、文档、样例、编辑器配置），**保留组件代码**。

```bash
npx @agile-team/wl-skills-kit clean
npx @agile-team/wl-skills-kit clean --dry-run
```

**保护路径**（永远不会被清理）：
- `src/components/` — 全局/局部/远程组件
- `src/types/` — 类型桶文件

**清理范围**：
- `.github/` — Skill 文件 + 设计文档
- `docs/` — 组件 API 文档
- `demo/` — 领域样例
- 编辑器配置 — `.cursorrules` / `AGENTS.md` / `CLAUDE.md` 等 8 个文件
- `.wl-skills-manifest.json` — 清单文件自身

> 适用于 CI/CD 构建流程：`npx @agile-team/wl-skills-kit clean && npm run build`

## Manifest 清单文件

`init` 和 `update` 执行后会在项目根目录生成 `.wl-skills-manifest.json`，记录所有写入的文件路径及 MD5 哈希。用途：

- `update` 命令的增量比对（跳过未变化的文件）
- `clean` 命令的精准删除（只删除 Skill 体系写入的文件）

> 建议将 `.wl-skills-manifest.json` 加入 `.gitignore`（每台开发机独立维护即可）。

## 安装行为说明

| 会做 | 不会做 |
|------|--------|
| 写入 `.github/` `docs/` `src/` `demo/` | 不修改 `package.json` |
| 已存在的同名文件会被覆盖 | 不修改 `node_modules/` |
| 自动创建不存在的目录 | 不执行 postinstall |
| 生成 `.wl-skills-manifest.json` 清单 | 不删除任何文件（init/update） |

## 安全路径

以下路径不在分发范围，本地修改永远安全：

```
.github/skills/my-domain-skill/   自定义 Skill
.github/docs/my-domain-doc.md     自定义文档
src/components/local/my_custom/    自定义组件
src/views/                         业务页面代码
mock/                              Mock 数据
```

## 更新策略

```bash
# 方式一：增量更新（推荐 — 仅覆盖变化的文件）
npx @agile-team/wl-skills-kit@latest update

# 方式二：全量重装（适合版本跨度大、或清单文件丢失）
npx @agile-team/wl-skills-kit@latest
```

- **通用改进** — 提 PR 到 wl-skills-kit 仓库，合并后所有项目受益
- **领域专有** — 放在安全路径下，永远不会被覆盖

## 前置依赖

Skill 生成代码依赖以下包，**首次使用前请确认已安装**：

### 核心依赖

| 包名 | 用途 | 说明 |
|------|------|------|
| `vue` | 框架 | 新项目一定有 |
| `vue-router` | 路由 | 新项目一定有 |
| `element-plus` | UI 组件 | 新项目一定有 |
| `@jhlc/common-core` | 平台核心 | 同平台项目一定有 |
| `lodash-es` | debounce 防连点 | 易遗漏：必须是 `lodash-es` 而非 `lodash` |
| `xlsx` | 导出/导入功能 | 仅有此功能时需要 |

### 开发依赖

```bash
pnpm add -D mockjs vite-plugin-mock
```

### Vite 配置

```typescript
import { viteMockServe } from "vite-plugin-mock";

export default defineConfig(({ command }) => ({
  plugins: [
    viteMockServe({
      mockPath: "./mock",
      enable: command === "serve",
    }),
  ],
}));
```
