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

---

## doctor 报 pnpm 版本不满足

doctor 要求 pnpm >= 11.8.0。升级方式：

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

或 
pm i -g pnpm@latest。项目内 preinstall 只允许 pnpm，用 npm/yarn 安装会被直接拒绝。

---

## Node 版本不满足（22.12+ / 24.x）

CLI 与 PC 模板 engines 都要求 Node ^22.12.0 || ^24.0.0。用 nvm-windows / fnm / volta 切换：

```bash
nvm install 22.12.0
nvm use 22.12.0
```

注意 22.x 的早期小版本（< 22.12）不满足范围，doctor 会如实报红。

---

## 企业 Registry 报 401 / 私有包 404

PC 模板包含 element-plus 企业定制版本等**非 scope 依赖**，默认 Registry 必须能提供这些包：

1. 项目 .npmrc 已指向内部 Registry，确认该文件未被忽略提交；
2. @jhlc scope 与非 scope 依赖**都要**能从该源获取；
3. 401 通常是凭据过期：重新 pnpm login 或更新 .npmrc 的 authToken。

---

## 自定义了 JH4J_HOME 后缓存"丢了"

缓存与配置都在 JH4J_HOME（默认 ~/.jh4j）下。设置过该环境变量的终端才有同一份缓存——换终端/换用户时要么统一环境变量，要么接受重新拉取模板。

---

## --force 覆盖目录，旧项目还能找回吗

能。--force 会**先备份旧目录**再生成；模板初始化失败时旧目录保持不变。备份位置在创建输出的结果面板中有提示。

---

## 想试用比 Catalog 更新的模板版本

Catalog 固定了每个模板的默认 ref（如移动端 1.7.1）。模板仓库已发布更新版本时，可用 --ref 覆盖先行试跑：

```bash
jh4j create my-app --category mobile --template mobile.robot-h5 --ref v1.8.0 --yes
```

试跑稳定后等 Catalog 跟进；详见[版本说明与升级](./upgrade)。