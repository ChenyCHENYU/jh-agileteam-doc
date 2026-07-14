# 模板接入规范

每个模板仓库至少需要提供以下文件，才能被 `jh4j create` 识别并安全初始化。CLI 与直接 `git clone` 后运行内置初始化命令**共用同一份配置契约**。

---

## 必备文件

```text
template.manifest.json       # 模板 ID、版本、运行时、默认值和可选能力
project.config.json          # 项目默认配置
scripts/setup-project.mjs    # CLI 与直接 clone 共用的初始化入口
scripts/validate-template.mjs
```

模板初始化完成后必须生成 Manifest 声明的元数据文件（当前 PC 与移动端模板都使用 `.jhlc/project.json`）。CLI **只有在元数据存在且模板初始化成功后**才会把 staging 目录提升为目标目录。

---

## template.manifest.json

模板的「身份证」与参数契约。以 PC 模板 `web.jh4j-mf-remote`（`1.1.0`）为例：

```json
{
  "schemaVersion": 1,
  "id": "web.jh4j-mf-remote",
  "name": "JH4J PC 微前端业务模板",
  "description": "基于 Vue 3、Vite 和 Module Federation 的 JH4J 业务子系统标准模板",
  "version": "1.1.0",
  "category": "frontend",
  "runtime": {
    "node": "^22.12.0 || ^24.0.0",
    "recommendedNode": "24",
    "packageManager": "pnpm@11.8.0"
  },
  "defaults": {
    "projectName": "jh4j-ui-app",
    "moduleName": "app",
    "title": "JH4J Cloud 数字化平台",
    "devServerPort": 8001,
    "localBackendUrl": "http://localhost:10010",
    "localPublicUrl": "http://localhost:8002",
    "npmRegistry": "http://172.18.248.130/",
    "jhlcRegistry": "http://172.18.248.130/"
  },
  "features": [
    {
      "id": "git-standards",
      "name": "完整 Git 与代码质量规范",
      "description": "Commitizen、Commitlint、Husky、ESLint、Prettier 与 lint-staged",
      "defaultEnabled": true,
      "required": false,
      "package": "@robot-admin/git-standards"
    }
  ],
  "parameters": [
    { "name": "projectName", "type": "string", "required": true },
    { "name": "moduleName", "type": "string", "required": true, "pattern": "^[a-z][a-z0-9-]*$" },
    { "name": "title", "type": "string", "required": true },
    { "name": "devServerPort", "type": "number", "required": true, "minimum": 1024, "maximum": 65535 },
    { "name": "localBackendUrl", "type": "string", "required": true, "format": "uri" },
    { "name": "localPublicUrl", "type": "string", "required": true, "format": "uri" },
    { "name": "npmRegistry", "type": "string", "required": true },
    { "name": "jhlcRegistry", "type": "string", "required": true }
  ],
  "entry": {
    "interactive": "node scripts/setup-project.mjs",
    "nonInteractive": "node scripts/setup-project.mjs --yes"
  },
  "generatedMetadata": ".jhlc/project.json"
}
```

### 关键字段

| 字段 | 说明 |
| --- | --- |
| `id` / `version` | 模板标识与版本，写入生成项目的元数据用于追溯 |
| `category` | `frontend` / `backend` / `mobile`，决定交互分组 |
| `runtime` | 运行时要求，`doctor` 据此体检 |
| `defaults` | 快速创建采用的推荐值 |
| `features` | 可选能力（如 `git-standards`），`--features` / `--no-standards` 控制 |
| `parameters` | 自定义创建时的参数契约（类型、必填、校验规则） |
| `entry` | 交互与非交互初始化入口 |
| `generatedMetadata` | 初始化后必须生成的元数据文件路径 |

---

## project.config.json

项目级唯一可变配置入口，CLI 与直接 clone 的初始化脚本都会读写它。PC 模板默认值：

```json
{
  "projectName": "jh4j-ui-template",
  "moduleName": "template",
  "title": "JH4J Cloud 数字化平台",
  "devServerPort": 8001,
  "localBackendUrl": "http://localhost:10010",
  "localPublicUrl": "http://localhost:8002",
  "features": ["git-standards"],
  "environments": {
    "dev": { "apiPrefix": "api", "webUrl": "http://localhost:8080" },
    "sit": { "apiPrefix": "sit-api", "webUrl": "http://localhost:8080" },
    "uat": { "apiPrefix": "uat-api", "webUrl": "http://localhost:8080" },
    "pre": { "apiPrefix": "pre-api", "webUrl": "http://localhost:8080" },
    "prd": { "apiPrefix": "prod-api", "webUrl": "http://localhost:8080" }
  }
}
```

| 配置 | 用途 |
| --- | --- |
| `projectName` | npm 项目名称 |
| `moduleName` | 平台模块标识、部署目录及 Federation 页面前缀 |
| `title` | 浏览器标题和平台运行时标题 |
| `devServerPort` | 本地开发端口 |
| `environments` | DEV/SIT/UAT/PRE/PRD 地址与 API 前缀 |
| `features` | 脚手架选中的标准化能力 ID |

---

## scripts/setup-project.mjs

CLI（`template.manifest.json` 的 `entry`）与直接 `git clone` 后执行 `pnpm setup` **共用同一个初始化入口**，因此两种创建方式产物一致。

- 支持交互模式与 `--yes` 非交互模式
- 支持 `--config <json>` 读取创建参数、`--created-by` 记录来源
- 支持 `--no-standards` 移除 `git-standards` 对应配置、开发依赖与 lockfile
- 只修改结构化配置、项目名称、业务目录和 `.jhlc/project.json`，**不修改业务代码**

---

## 校验与查看

```bash
# 校验本地模板是否满足接入契约
jh4j template validate ../jh4j-ui-template
jh4j template validate ../../Robot_H5

# 模板列表与完整定义
jh4j list --json
```

模板列表和完整定义可通过 `jh4j list --json` 查看；项目生成后的来源信息用 `jh4j info .` 查看（见 [命令参考](./commands)）。
