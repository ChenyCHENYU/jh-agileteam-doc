# 创建项目

`jh4j create` 是脚手架的核心命令，支持交互式创建、明确参数、JSON 配置文件以及预览生成计划。所有路径都支持 `--dry-run` 预览。

---

## 交互创建

```bash
jh4j create
```

也可以把项目名作为参数直接传入：`jh4j create jh4j-ui-orders`。交互流程先选模板（PC 管理端 / 移动端 H5），再选创建方式：

| 创建方式 | 行为 |
| --- | --- |
| **快速创建（推荐）** | 直接使用模板推荐项目名与配置，立即生成，不再提问 |
| **自定义创建** | 展开项目名、标题、端口、联调地址等输入框；每个都带可编辑默认值，回车接受、输入覆盖 |

自定义创建中模块标识会自动从项目名推导为小写短横线格式；标题、端口、URL 在输入时就地校验。

创建完成后会显示**结果面板**，分区列出技术栈、核心包、Git 与代码质量规范、多环境配置、开发地址、联调地址、依赖状态和下一步命令。需要后续调整时，直接修改项目中的 `project.config.json`、`.npmrc` 和 `.env*` 文件。

---

## 使用明确参数创建

PC 业务子系统：

```bash
jh4j create jh4j-ui-orders \
  --yes \
  --category frontend \
  --template web.jh4j-mf-remote \
  --module orders \
  --title "订单中心" \
  --port 8123
```

移动端 H5：

```bash
jh4j create jh4j-mobile-orders \
  --yes \
  --category mobile \
  --template mobile.robot-h5 \
  --title "移动订单中心" \
  --port 8888 \
  --local-backend http://localhost:10010
```

---

## 使用 JSON 参数文件

```json
{
  "moduleName": "orders",
  "title": "订单中心",
  "devServerPort": 8123,
  "features": ["git-standards"],
  "localBackendUrl": "http://localhost:18080",
  "environments": {
    "sit": {
      "webUrl": "https://sit.example.internal",
      "apiPrefix": "sit-api"
    }
  }
}
```

```bash
jh4j create jh4j-ui-orders --yes --config ./project-input.json
```

::: tip 参数优先级
命令行参数的优先级**高于** JSON 文件中的同名配置。`--yes` 表示跳过所有交互确认，适合 CI。
:::

---

## 预览生成计划

```bash
jh4j create jh4j-ui-orders --yes --dry-run
```

`--dry-run` 会完成模板解析和参数校验，但**不会创建项目目录**，便于在发版或批量初始化前确认将要生成的内容。

---

## 安装依赖与可选步骤

```bash
# 默认只生成项目，依赖由开发者手动安装
jh4j create jh4j-ui-orders --yes

# 确实需要创建后自动安装时显式指定
jh4j create jh4j-ui-orders --yes --install

# 跳过 Git 初始化
jh4j create jh4j-ui-orders --yes --skip-git

# 不启用模板提供的完整 Git 与代码质量规范
jh4j create jh4j-ui-orders --yes --no-standards
```

PC 与移动端模板默认启用 `git-standards` 能力（Commitizen、Commitlint、Husky、ESLint、Prettier、lint-staged）。创建时不再重复确认；需要关闭时使用 `--no-standards`。

---

## 常用参数

| 参数 | 说明 |
| --- | --- |
| `-c, --category <category>` | 项目类型：`frontend`、`backend`、`mobile` |
| `-t, --template <id>` | 指定模板 ID |
| `--module <name>` | 平台模块标识、部署目录及 Federation 页面前缀 |
| `--title <title>` | 浏览器标题与平台运行时标题 |
| `--port <port>` | 本地开发端口 |
| `--features <ids>` | 启用的模板能力，多个 ID 使用逗号分隔 |
| `--no-standards` | 禁用模板提供的 Git 与代码质量规范 |
| `--source <path-or-url>` | 强制使用指定模板目录、Git 地址或压缩包 |
| `--ref <branch-or-tag>` | 覆盖 Catalog 为模板配置的默认分支或标签 |
| `--config <json-file>` | 从 JSON 文件读取创建参数 |
| `--dry-run` | 校验并展示生成计划，不写入项目目录 |
| `--install` | 创建完成后自动安装依赖；默认不安装 |
| `--skip-install` | 明确不安装依赖，兼容旧命令 |
| `--skip-git` | 跳过 Git 初始化 |
| `--force` | 替换已存在的同名目录 |
| `--no-cache` | 不读取已有远程模板缓存 |
| `--yes` | 跳过所有交互确认（CI / 批量初始化） |

完整参数以命令输出为准：

```bash
jh4j create --help
```

---

## 生成安全性

CLI **不会**直接在目标目录边下载边修改。创建过程先在当前目录生成隐藏的 staging 目录，依次完成：

1. 模板 Manifest 校验。
2. 模板初始化脚本执行。
3. 生成元数据校验（`.jhlc/project.json`）。
4. staging 目录原子提升为目标目录。
5. Git 初始化，以及显式 `--install` 时的依赖安装。

目标目录已存在时默认拒绝覆盖；使用 `--force` 后会先备份旧目录，模板初始化失败时旧目录保持不变。默认不安装依赖，避免网络或 Registry 问题阻塞项目生成。

---

## 下一步

- 项目生成后如何对接模板：[PC 模板概览](/frontend/pc/) / [移动端 H5 概览](/frontend/mobile-h5/)
- 查看命令全集：[命令参考](./commands)
- 模板从哪来、如何缓存：[模板来源 & Catalog](./templates)
