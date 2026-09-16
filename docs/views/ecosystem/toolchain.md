# 工程工具链

> 把"环境标准化"和"项目创建"做成一条命令——三个工具覆盖编辑器配置、离线扩展与多栈脚手架。

## 工具矩阵

| 包 | 版本 | 定位 |
|----|------|------|
| `@agile-team/vscode-config` | 3.14.5 | 一键安装团队标准编辑器配置（VS Code / Cursor / Windsurf / Kiro / Qoder） |
| `@agile-team/vscode-config-extensions` | 1.1.0 | 配套离线扩展包（vsix，不含 AI 类扩展）——云桌面 / 内网环境 |
| `@agile-team/robot-cli` | 3.2.0 | 多栈通用脚手架（vue / react / node / h5-vant / webview / electron），bun 优先兼容 npm/pnpm/yarn |

---

## vscode-config — 五编辑器一键标准化

新人入职第一天装环境：

```bash
npx @agile-team/vscode-config
```

- 统一安装团队标准 `settings.json`、推荐扩展列表与代码片段；
- 支持 VS Code / Cursor / Windsurf / Kiro / Qoder 五种目标，按已安装编辑器自动适配；
- 与 `@agile-team/vscode-config-extensions` 配合，可在**无外网的云桌面**用离线 vsix 完成扩展安装。

::: tip 与 wl-skills 编辑器配置的分工
`vscode-config` 装**编辑器本身**（设置/扩展/片段）；wl-skills-kit / bd / test `init` 生成的是**项目内**的指令文件与 MCP 配置。两者先后执行、互不替代。
:::

---

## robot-cli — 多栈通用脚手架

```bash
npx @agile-team/robot-cli create
```

- 技术栈模板：Vue / React / Node / H5（Vant）/ WebView / Electron；
- **bun 优先**，自动兼容 npm / pnpm / yarn；
- 适合快速验证想法、内部工具与小项目。

::: warning 企业项目请用 jh4j-cloud-cli
面向 jh4j-cloud 体系的生产项目（PC 子系统 / 移动端 H5）统一走 [`@agile-team/jh4j-cloud-cli`](/scaffold/)——结构一致性、门禁与可追溯性由它保证；robot-cli 用于非企业基线的快速原型。
:::

---

## 三者关系

```text
入职第一天      vscode-config ──► 编辑器就绪
起一个原型      robot-cli ──────► 多栈快速项目
企业正式项目    jh4j-cloud-cli ──► PC / 移动端 H5 标准工程
                    ↓
        wl-skills-* init（AI 体系注入）
```
