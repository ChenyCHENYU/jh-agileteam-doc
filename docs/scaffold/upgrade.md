# 版本说明与升级

<AuthorTag :authors="['CHENY']" />

> 当前 CLI：`@agile-team/jh4j-cloud-cli@0.6.3`。完整变更见仓库 `CHANGELOG.md`，本页只讲**使用者需要知道的事**。

---

## 一、CLI 版本与模板版本是解耦的

脚手架有**两个会变的版本号**，升级策略不同：

| 版本 | 当前 | 谁决定 | 升级方式 |
|------|------|--------|---------|
| CLI 版本 | `0.6.3` | 脚手架仓库发版 | `pnpm add -g @agile-team/jh4j-cloud-cli@latest`（全局安装）或 npx 每次拉最新 |
| 模板版本 | Catalog 固定 **`v1.7.1`**（mobile.robot-h5） | Catalog `defaultRef` | CLI 升级 Catalog 后自动跟进；也可 `--ref` 提前覆盖试用 |

- PC 模板（`jh4j-ui-template`）跟随 main 分支，无独立 pin；
- 模板仓库本身可能领先于 Catalog 固定值（如 Robot_H5 已发布 `v1.8.0`：公司上下文闭环、core ^1.2.0 水印契约）——**想提前用**：`jh4j create --ref v1.8.0` 覆盖默认 ref 试跑，稳定后等 Catalog 跟进；
- 已生成项目不受影响：项目内通过 `pnpm update` 自主升级，与脚手架无关。

---

## 二、版本演进（0.5.0 → 0.6.3 使用者视角）

| 版本 | 你能感知到的变化 |
|------|----------------|
| 0.6.3 | 移动端模板基线升级 Robot_H5 `v1.7.1`（`@robot-h5/core@^1.1.4`：wl-mbase 宿主识别、App/PDA SDK 按需加载） |
| 0.6.1~0.6.2 | JH4J 品牌终端主题（真彩渐变、`NO_COLOR` 兼容）；完成态结果面板分区重排；移动端基线 v1.7.0（PDA 兼容构建、动态标题、单头部导航） |
| 0.6.0 | 模板直选（PC/移动端互不混淆）；**快速创建 vs 自定义创建**两种方式；创建完成结果面板；移动端模板接入 |
| 0.5.x | 交互精简：单模板自动选择、模块标识自动推导、默认不安装依赖（`--install` 显式开启） |

更早版本见仓库 `CHANGELOG.md`。

---

## 三、升级操作

```bash
# 全局安装方式：升级 CLI
pnpm add -g @agile-team/jh4j-cloud-cli@latest
jh4j doctor                 # 确认环境仍满足

# npx 方式：无需升级，每次拉最新
npx @agile-team/jh4j-cloud-cli@latest create my-app

# 升级后建议
jh4j list --json            # 确认 Catalog/模板版本
jh4j cache list             # 需要时 cache clear 强制刷新
```

**回退**：全局安装指定版本即可 `pnpm add -g @agile-team/jh4j-cloud-cli@0.6.2`；已生成项目与 CLI 版本解耦，不受回退影响。

---

## 四、升级检查清单

- [ ] `jh4j doctor` 全绿（Node 22.12+/24.x、pnpm ≥ 11.8、Git）
- [ ] `jh4j list --json` 确认模板与 ref 符合预期
- [ ] 缓存怀疑陈旧时 `jh4j cache clear` 或创建时加 `--no-cache`
- [ ] 已生成项目按需手动升级（与 CLI 升级解耦）
- [ ] `--ref` 试用的项目，在 Catalog 跟进后去掉 `--ref` 覆盖重新生成验证
