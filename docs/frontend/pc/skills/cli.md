# wl-skills-kit 工具

::: tip 这是哪个 CLI？
本页讲的是 **Skills 体系安装器** `@agile-team/wl-skills-kit`（`init / update / validate / fix / clean` 等 11 个子命令），用于把规范、Skill、组件文档导入**已有项目**。
从零**创建新项目**用的是另一个工具 —— 项目脚手架 [`@agile-team/jh4j-cloud-cli`](/scaffold/)（命令 `jh4j create`）。
:::

`@agile-team/wl-skills-kit`（v2.13.0）提供 11 个 CLI 子命令，覆盖安装、升级、清理、校验、修复、体检、导出全生命周期。所有命令默认作用于当前工作目录，均可加 `--dry-run` 预览。

## 命令速查

| 命令 | 用途 |
|------|------|
| `init`（默认） | 全量安装（14 规范 + 12 Skill + 17 MCP + 10 编辑器配置 + 组件文档） |
| `update` | 增量更新（MD5 比对，仅覆盖变化文件，保护 reports/） |
| `check` | 环境预检（Node / 工具链 / MCP / manifest） |
| `diff` | 对比已安装文件与最新 kit 版本差异 |
| `validate` | 静态校验页面完整性 + AST 语义级 R1~R14（CI 卡门） |
| `validate-page` | 单页 / 指定目录校验 |
| `fix` | 确定性机械修复（幂等安全，如缺 `render-type`、`::v-deep`→`:deep()`） |
| `doctor-ui` | 检查 wl-skills-ui 接入完整性 |
| `export` | 导出菜单/字典/权限基线为 xlsx |
| `clean` | 构建前清理（保留 `src/components` + `src/types`） |
| `mock-clean` | 清理 mock 文件（按域或全量，保留 `_utils.ts`） |

> 全局安装后也可直接用 `wl-skills` 命令（如 `wl-skills update`）。

## init（默认）

首次安装或完整重装 — 全量写入所有文件，写入 `.wl-skills/` 统一隔离目录。

```bash
npx @agile-team/wl-skills-kit              # 等同于 init
npx @agile-team/wl-skills-kit init
npx @agile-team/wl-skills-kit --dry-run    # 预览模式
```

执行后写入完整 AI 体系到 `.wl-skills/`，同时生成 `.wl-skills-manifest.json` 清单。

## update

增量更新 — 基于 MD5 比对，仅覆盖有变化的文件，跳过未变化的文件，自动保护 `reports/` 累积数据。

```bash
npx @agile-team/wl-skills-kit@latest update
npx @agile-team/wl-skills-kit update --dry-run
```

> 需要先执行过 `init` 才能使用 `update`（依赖 `.wl-skills-manifest.json` 清单文件）。

## check

环境预检 — 新成员接手项目的第一步。

```bash
npx @agile-team/wl-skills-kit check
```

检查 Node 版本、工具链、MCP 配置、manifest 和工程化配置。

## validate / validate-page

静态校验页面文件完整性（4 文件、AGGrid、cid、mock、api.md），含 AST 语义级 R1~R14 检测。R13 圈复杂度 / R14 类型错误需 `--typecheck` 开启。

```bash
npx @agile-team/wl-skills-kit validate                      # 全量校验
npx @agile-team/wl-skills-kit validate --typecheck --strict # 含类型检查（CI / 发版前）
npx @agile-team/wl-skills-kit validate-page src/views/mdata/model/mdata-model-config
```

## fix

确定性机械修复 — 对幂等、零语义判断的偏差做自动修复（缺 `render-type`、`::v-deep`→`:deep()`、行尾空白、文件末尾换行等），AI 只处理需语义判断的部分。

```bash
npx @agile-team/wl-skills-kit fix
npx @agile-team/wl-skills-kit fix --dry-run
```

## doctor-ui

检查 `wl-skills-ui` 是否真正接入（tokens、styles、`installCommonPreset()`）。

```bash
npx @agile-team/wl-skills-kit doctor-ui
```

## export

导出菜单 / 字典 / 权限基线为 xlsx，用于交付和归档。

```bash
npx @agile-team/wl-skills-kit export
```

## clean

构建前清理 — 移除 AI 开发辅助文件（Skill、文档、样例、编辑器配置），**保留组件代码**。

```bash
npx @agile-team/wl-skills-kit clean                       # 保留 src/components + src/types
npx @agile-team/wl-skills-kit clean --keep-reports        # 额外保留 reports/（菜单/字典/权限基线）
npx @agile-team/wl-skills-kit mock-clean --domain mdata   # 按域清理 mock（保留 _utils.ts）
npx @agile-team/wl-skills-kit mock-clean --all            # 全量清理 mock（保留 _utils.ts）
```

**保护路径**（永远不会被清理）：
- `src/components/` — 全局/局部/远程组件
- `src/types/` — 类型桶文件

> 适用于 CI/CD 构建流程：`npx @agile-team/wl-skills-kit clean && npm run build`

## Manifest 清单文件

`init` 和 `update` 执行后会在项目根目录生成 `.wl-skills-manifest.json`，记录所有写入的文件路径及 MD5 哈希。用途：

- `update` 命令的增量比对（跳过未变化的文件）
- `clean` 命令的精准删除（只删除 Skill 体系写入的文件）
- `diff` 查看当前项目与最新 kit 内容差异

> 建议将 `.wl-skills-manifest.json` 加入 `.gitignore`（每台开发机独立维护即可）。

## 安装行为说明

| 会做 | 不会做 |
|------|--------|
| 写入 `.wl-skills/` `docs/` `src/` `demo/` `mock/` | 不修改 `package.json` |
| 已存在的同名文件会被覆盖 | 不修改 `node_modules/` |
| 自动创建不存在的目录 | 不执行 postinstall |
| 生成 `.wl-skills-manifest.json` 清单 | 不删除任何文件（init/update） |

## 安全路径

以下路径不在分发范围，本地修改永远安全：

```
.wl-skills/skills/domain/      自定义 Skill
src/components/local/my_custom/ 自定义组件
src/views/                      业务页面代码
mock/                           Mock 数据
.wl-skills/reports/             AI 生成的累积报告
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
