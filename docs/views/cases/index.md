# 实战案例库

<AuthorTag :authors="['CHENY']" />

> 一案例一屏。数字先行，命令可复制；过程叙事一律不写。业务数据标注"待确认"的以项目组实际统计为准。

```text
案例地图
├── ① produce-steelmaking   炼钢模块全栈 AI 实践（design → kit → bd → review）
├── ② produce-e2e           37 spec 的 E2E 工程化（test 包能力反推地）
├── ③ mdata-legacy          存量项目接入 kit（.wl-snapshot 实证）
├── ④ mbase-subapps         五个子应用上基座（免登/桥接/水印/断点续传）
└── 反模式合集               8 条事故，每条 5 行（[anti-patterns](./anti-patterns)）
```

---

### ① 炼钢模块 · 全栈 AI 实践（produce 域）

> 4 份说明书进 → 32 页面 + 后端 7 模块出，AI 参与全链路。

| 输入 | 需求设计说明书 ×4（系统需求/数据库新旧版/接口设计）· 流程总图 drawio · WBS · 物料表 |
| 产出 | 前端 32 页 / 8 子域 · 后端 7 模块（base/pb/pc/pj/pl/pm/pz）· db-spec 镜像 · MES 对接文档 ×3 |
| 兜底 | kit `validate`（K1~K19）· bd `review run`（canary 仅扫 pl）· db-spec 四方对账 |
| 复现 | [design verify](/views/ai-workflow/design-skills) → [page-codegen](/frontend/pc/skills/page-codegen) → [bd codegen](/backend/quick-start) |

→ [详情与踩坑](./produce-steelmaking)

---

### ② 37 spec 的 E2E 工程化（wl-ui-produce）

> 手工回归不可持续，7 层 Playwright 编排替代；实战约束反推成 test 包能力。

| 规模 | 37 个 spec · 7 个 project（auth → 只读 → 详情 → UI 契约 → 受控写 → 隔离 → 清理） |
| 红线 | 用例归属强校验 · page.route 拦截写请求（零污染）· 受控写入需安全标记 |
| 沉淀 | 归属校验/路由映射/选择器适配/工位模板 → 固化为 test 包 `run-gen --type e2e` 与 `e2e-check` |
| 复现 | [E2E 工程化](/views/testing/automation#e2e-工程化生成-v0-8-0-run-gen-type-e2e) |

→ [详情与踩坑](./produce-e2e)

---

### ③ 存量项目接入 kit（wl-mdata）

> 老项目不停机接入：先快照、再增量装，沉淀 17 篇组件/实践文档。

| 接入 | kit 安装（.wl-skills）· 项目快照 .wl-snapshot · demo：produce / sale 双域 |
| 沉淀 | docs 17 篇：jh-* 平台组件文档 ×11 · page-query-hook 最佳实践 · request 封装 · 本地开发 |
| 兜底 | `diff` 核对本地修改 · `update` 增量升级 · validate 全量基线 |
| 复现 | [存量项目接入](/frontend/pc/skills/cli) |

→ [详情与踩坑](./mdata-legacy)

---

### ④ 五个子应用上基座（wl-mbase）

> 安全/安防/环保/质量/iemp 五个 H5 子应用，一套免登/桥接/水印协议。

| 子应用 | 安全 wl-app-safe · 安防 wl-app-security · 环保 wl-app-ep · 质量 wl-app-quality · iemp |
| 能力 | 基座免登（portal_token）· 跨端桥接（钉钉 JSAPI / App postMessage）· 水印契约 · 断点续传 |
| 兜底 | 子应用消息白名单登记 · 严格 origin 校验 · 多端安全构建 |
| 复现 | [H5 子应用集成](/frontend/mobile-uniapp/integration) · [App 集成与发布](/frontend/mobile-uniapp/app-integration) |

→ [详情与踩坑](./mbase-subapps)

---

## 反模式合集

- [8 条事故复盘](./anti-patterns) — 每条 5 行：现象 / 根因 / 沉淀规则 / 一行命令

## 写作约束（本板块所有页面遵守）

1. 每页第一行是结论或数字；2. 数字一律表格化；3. 命令可直接复制；4. 超过 500 字的过程内容折叠或不写。
