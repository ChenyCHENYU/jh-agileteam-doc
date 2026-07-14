# 命令参考

脚手架提供 7 类命令：`create`（见 [创建项目](./create)）、`list`、`doctor`、`info`、`template validate`、`config`、`cache`。除 `create` 外均可加 `--json` 输出结构化结果，便于脚本消费。

---

## list — 查看模板 Catalog

```bash
jh4j list
jh4j list --json
```

列出当前可用模板（内置 + 外部 Catalog 合并后的结果）。`--json` 输出完整模板定义，便于在 CI 或文档中解析。

---

## doctor — 环境体检

```bash
jh4j doctor
jh4j doctor --json
```

检查 Node、pnpm、Git 版本与模板环境是否满足要求。**新成员接手或模板拉取失败时的第一步。**

---

## info — 项目元数据

```bash
jh4j info .
jh4j info . --json
```

读取生成项目中的 `.jhlc/project.json`，用于确认该项目由哪个模板版本、CLI 版本和创建参数生成。业务开发者不应手动修改其中的模板来源字段。

---

## template validate — 校验模板契约

```bash
jh4j template validate ../jh4j-ui-template
jh4j template validate ../../Robot_H5
```

校验模板目录是否满足接入规范：`template.manifest.json` 字段完整、初始化脚本存在、生成元数据符合声明。模板维护者在发版前执行。

---

## config — 用户配置

用户配置默认保存在 `~/.jh4j/config.json`。

```bash
jh4j config list
jh4j config get autoInstall
jh4j config set autoInstall true
jh4j config set autoGit false
jh4j config set cacheTtlMinutes 120
jh4j config unset cacheTtlMinutes
jh4j config reset
```

| 配置项 | 说明 |
| --- | --- |
| `catalogFile` | 外部 Catalog JSON 文件 |
| `templateSource` | 全局模板源覆盖；设置后不再自动尝试 Catalog 备用源 |
| `npmRegistry` | npm Registry，必须能提供项目使用的企业定制包 |
| `jhlcRegistry` | `@jhlc` 私有 Registry |
| `autoInstall` | 创建后是否自动安装依赖，默认 `false`；通常保持默认 |
| `autoGit` | 创建后是否初始化 Git 仓库 |
| `cacheTtlMinutes` | 模板缓存有效期；`0` 表示每次刷新 |

### 环境变量

| 变量 | 作用 |
| --- | --- |
| `JH4J_HOME` | 修改 CLI 数据根目录（默认 `~/.jh4j`），影响 config 与 cache 位置 |
| `JH4J_CATALOG_FILE` | 加载外部 Catalog，等价于配置项 `catalogFile` |
| `JH4J_UI_TEMPLATE_SOURCE` | PC 模板专属源覆盖 |

---

## cache — 模板缓存

远程 Git 和压缩包模板缓存在：

```text
~/.jh4j/cache/templates
```

默认缓存有效期 60 分钟。缓存键由模板 `source + ref` 计算，不同镜像和不同分支互不覆盖。

```bash
jh4j cache list
jh4j cache list --json
jh4j cache clear
jh4j create jh4j-ui-orders --no-cache
```

> 缓存根目录跟随 `JH4J_HOME`。模板源站切换、或怀疑拉到旧版本时，用 `--no-cache` 强制刷新。

---

## 下一步

- 模板从哪些源拉取、如何容灾：[模板来源 & Catalog](./templates)
- 自己维护一个模板需要做什么：[模板接入规范](./template-spec)
- 遇到拉取失败、依赖问题：[常见问题](./faq)
