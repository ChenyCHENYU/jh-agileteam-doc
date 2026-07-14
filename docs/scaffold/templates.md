# 模板来源 & Catalog

脚手架支持本地、Git、压缩包等多种模板来源，内置模板按 GitHub → Gitee 主备源拉取并自动降级，远程模板按 `source + ref` 缓存。可通过外部 Catalog 覆盖或追加模板定义。

---

## 支持的来源类型

- 本地模板目录
- Git HTTP、HTTPS、SSH 和 `file://` 地址
- 本地 `.tgz`、`.tar.gz`、`.tar` 文件
- HTTP(S) 模板压缩包

### 来源解析顺序

```text
--source
→ 模板专属环境变量（如 JH4J_UI_TEMPLATE_SOURCE）
→ 用户配置 templateSource
→ Catalog defaultSource + sources
```

::: warning 强制来源
一旦通过 `--source`、环境变量或用户配置 `templateSource` 指定来源，该来源将作为**强制来源**，不再自动尝试 Catalog 中的备用源。
:::

---

## 内置模板源

从 npm 安装后，PC 模板按以下顺序尝试远程源：

```text
https://github.com/ChenyCHENYU/jh4j-ui-template.git
→ https://gitee.com/ycyplus163/jh4j-ui-template.git
```

移动端模板按以下顺序尝试，并默认固定到 `v1.6.0`：

```text
https://github.com/ChenyCHENYU/Robot_H5.git
→ https://gitee.com/ycyplus163/robot_-h5.git
```

::: tip 本地联调
CLI 源码开发时会优先读取工作区中的 PC、移动端模板目录，便于联调，不从远端拉取。
:::

### 固定模板版本

PC 模板当前默认读取 `main`。可通过 `--ref` 明确固定模板版本：

```bash
jh4j create jh4j-ui-orders --ref <template-tag>
```

临时指定其他来源：

```bash
jh4j create jh4j-ui-orders \
  --source https://git.example.com/templates/jh4j-ui-template.git \
  --ref main
```

---

## 模板缓存

远程 Git 和压缩包模板缓存在 `~/.jh4j/cache/templates`，默认有效期 60 分钟，缓存键由 `source + ref` 计算。详见 [命令参考 — cache](./commands#cache-模板缓存)。

---

## 外部 Catalog

通过 `JH4J_CATALOG_FILE` 或用户配置中的 `catalogFile` 加载外部 Catalog。**相同模板 ID 会覆盖内置定义**，其他 ID 会追加到模板列表。

```json
{
  "schemaVersion": 1,
  "templates": [
    {
      "id": "web.jh4j-mf-remote",
      "name": "JH4J PC 微前端业务模板",
      "description": "企业 PC 业务子系统",
      "category": "frontend",
      "defaultSource": "https://git.example.com/templates/jh4j-ui-template.git",
      "sources": [
        "https://git-backup.example.com/templates/jh4j-ui-template.git"
      ],
      "sourceEnvironment": "JH4J_UI_TEMPLATE_SOURCE",
      "defaultRef": "main",
      "status": "stable",
      "tags": ["vue", "vite", "module-federation"]
    }
  ]
}
```

Catalog JSON Schema 位于 [`catalog.schema.json`](https://github.com/ChenyCHENYU/jh4j-cloud-cli/blob/main/catalog.schema.json)，关键字段：

| 字段 | 说明 |
| --- | --- |
| `schemaVersion` | 固定 `1` |
| `id` | 模板 ID，匹配 `^[a-z][a-z0-9.-]+$`，如 `web.jh4j-mf-remote` |
| `category` | `frontend` / `backend` / `mobile` |
| `defaultSource` | 默认模板源（Git / 压缩包 / 本地路径） |
| `sources` | 备用源列表，主源不可用时依次降级 |
| `sourceEnvironment` | 覆盖该模板源的专属环境变量名 |
| `defaultRef` | 默认分支或标签 |
| `status` | `stable` / `beta` |

---

## 自己维护模板？

新增或定制模板的接入规范（manifest、初始化脚本、元数据）见 [模板接入规范](./template-spec)。
