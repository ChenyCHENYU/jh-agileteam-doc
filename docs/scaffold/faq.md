# 常见问题

## 模板拉取失败

```bash
jh4j doctor
jh4j create jh4j-ui-orders --no-cache
```

先检查 GitHub、Gitee 或自定义模板源是否可访问，再检查本地 Git 代理和凭据配置。`--no-cache` 可强制刷新本地缓存，排除缓存陈旧问题。

---

## 手动安装依赖

项目生成完成后，确认 `.npmrc` 和内部 Registry 网络，再手动执行：

```bash
pnpm install
```

::: warning 企业定制包
PC 模板包含 `element-plus` 企业定制版本等**非 scope 依赖**，默认 npm Registry 必须能够提供这些包，不能只把 `@jhlc` 指向内部源。
:::

---

## 只生成文件，不初始化 Git

```bash
jh4j create jh4j-ui-orders --yes --skip-git
```

---

## 强制使用指定模板源

```bash
jh4j create jh4j-ui-orders \
  --source ./jh4j-ui-template \
  --ref main \
  --no-cache
```

指定 `--source` 后该来源作为强制来源，不再自动尝试 Catalog 中的备用源。

---

## 关闭完整 Git 与代码质量规范

```bash
jh4j create jh4j-ui-orders --yes --no-standards
```

会移除 `@robot-admin/git-standards` 对应的配置、开发依赖和模板 lockfile；随后 `pnpm install` 会按精简后的 `package.json` 生成新的 lockfile。

---

## 查看项目由哪个模板生成

```bash
jh4j info .
jh4j info . --json
```

项目元数据位于 `.jhlc/project.json`，记录模板 ID、模板版本、CLI 版本和创建参数。

---

## 在 CI 中批量初始化

使用 `--yes` 跳过交互，配合 `--config` 读取参数文件，或直接传全部参数：

```bash
jh4j create jh4j-ui-orders \
  --yes \
  --category frontend \
  --template web.jh4j-mf-remote \
  --module orders \
  --title "订单中心" \
  --port 8123 \
  --skip-install
```
