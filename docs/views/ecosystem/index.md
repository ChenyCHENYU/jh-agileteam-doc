# 工程生态全景

<AuthorTag :authors="['CHENY']" />

> 团队在 **@agile-team** scope 下共维护 **14 个 npm 包**，合计月下载约 **17.4 万次**，覆盖 AI 工程化、企业数据表格、工程工具链与基础库四层。本板块是生态的官方索引：每个包"是什么、什么时候用、和五包什么关系"。

::: tip 📊 数据说明
下载量与版本数据来自 npm registry，**截至 2026-09-17**（版本列为最新发版，下载量为 09-16 采样）。各包逐版本变更以各自仓库 CHANGELOG 为准。
:::

---

## 生态分层地图

```text
┌─ AI 工程五包（设计 → 前端 → 视觉 → 后端 → 测试）─────────────┐
│  wl-skills-design · kit · ui · bd · test                      │
│  13+13+13 个 Skill · 77 个 MCP · K/R/B/T 四族审计规则          │
└──────────────────────────┬────────────────────────────────────┘
                           │ 消费 / 被引用
┌──────────────────────────┴────────────────────────────────────┐
│ 基础设施库                                                       │
│  @jhlc/common-core（平台组件）· @robot-admin/git-standards      │
│  （Git 规范）· @robot-admin/form-validate（表单校验）·           │
│  @robot-h5/core（H5 桥接）· @agile-team/naive-ui-components     │
└──────────────────────────┬────────────────────────────────────┘
                           │ 服务于
┌──────────────────────────┴────────────────────────────────────┐
│ 企业数据表格                                                    │
│  MachTable 四件套：core / vue / react / xlsx（16 万月下载）      │
├────────────────────────────────────────────────────────────────┤
│ 工程工具链                                                      │
│  vscode-config（五编辑器标准化）· vscode-config-extensions      │
│  （离线扩展）· robot-cli（多栈脚手架）· jh4j-cloud-cli（企业版） │
└────────────────────────────────────────────────────────────────┘
```

---

## npm 数据看板

| 包 | 版本 | 月下载 | 许可证 |
|----|------|-------:|--------|
| **@agile-team/mach-table** | 0.29.2 | **160,399** | Source-Available（商用需授权） |
| @agile-team/mach-table-vue | 0.29.2 | 2,394 | 同上 |
| @agile-team/mach-table-react | 0.29.2 | 2,289 | 同上 |
| @agile-team/mach-table-xlsx | 0.29.2 | 1,810 | 同上 |
| @agile-team/wl-skills-kit | 2.21.0 | 2,365 | UNLICENSED |
| @agile-team/wl-skills-ui | 1.12.0 | 1,810 | UNLICENSED |
| @agile-team/wl-skills-bd | 0.26.0 | 1,523 | UNLICENSED |
| @agile-team/jh4j-cloud-cli | 0.6.3 | 369 | — |
| @agile-team/wl-skills-test | 0.25.0 | 1,011 | UNLICENSED |
| @agile-team/robot-cli | 3.2.0 | 272 | MIT |
| @agile-team/vscode-config | 3.14.5 | 247 | MIT |
| @agile-team/wl-skills-design | 0.11.1 | 727 | Apache-2.0 |
| @agile-team/vscode-config-extensions | 1.1.0 | 17 | MIT |
| @agile-team/naive-ui-components | 0.1.4 | 23 | MIT |

> mach-table 系列另有 **28 个外部依赖方**——是生态中唯一已被第三方项目规模复用的包。

---

## 生态原则

1. **契约同源**：包与包之间不靠口口相传——`wl-api-contract` / `page-spec` / design-model 都是机器可校验的 JSON；
2. **门禁前置**：每条规范必须同时给出机器执行方式（validate / audit / verify / gate），不能机器判定的规则不进基线；
3. **零依赖边界**：核心层不引运行时依赖（mach-table core 为 0 依赖），可选能力一律拆子入口；
4. **独立可用，联动增强**：任何包单独安装即可工作，联动是增强不是前置条件。

---

## 分区导航

| 分区 | 内容 |
|------|------|
| [MachTable 企业数据表格](./mach-table) | 四件套矩阵、领域化 API、虚拟化与编辑能力、授权说明 |
| [工程工具链](./toolchain) | 五编辑器标准化配置、内网离线扩展、多栈脚手架 |
| [基础设施库](./foundation) | 平台组件、Git 规范、表单校验、H5 桥接核心 |

---

## 与其他板块的分工

- 五包的**完整能力文档**在各包板块（[设计](/views/ai-workflow/design-skills) · [前端](/frontend/pc/skills/) · [视觉](/views/styling/wl-skills-ui) · [后端](/backend/skills/) · [测试](/views/testing/)）；
- 本板块只做**生态索引与选型**，不重复包文档内容；
- 版本数据每月刷新一次；安装体验以 npm 实时为准。
