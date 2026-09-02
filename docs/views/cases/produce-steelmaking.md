# 炼钢模块 · 全栈 AI 实践（produce 域）

> 案例①：4 份说明书进 → 32 页面 + 后端 7 模块出。本文只记事实与命令，过程叙事从略。

## 数据面板

| 维度 | 数据 |
|------|------|
| 输入 | 需求设计说明书 ×4 · 流程总图 V2.1 drawio · WBS 清单 · 物料综合信息表 |
| 前端产出 | `steelmaking/` 32 个页面 · 8 个业务子域（planning/billet/refractory/master/smelting-time/base-data/history/performance） |
| 后端产出 | wl-produce 7 模块 · db-spec 文档镜像 · MES 对接文档 ×3（QMS/L2/MPS）· 外部系统对接清单 |
| 质量门 | kit `validate`（K1~K19）· bd `review run`（canary 仅扫 pl 模块）· db-spec 对账 |
| 效率 | 待业务确认（人天对比） |

## AI 参与度（环节 → 包）

| 环节 | 包 | 产物 |
|------|-----|------|
| 需求/数据库/接口设计校验 | design | `verify db` / `verify api`（[M] 项机械判定） |
| 页面生成 | kit | prototype-scan → page-codegen（4 文件 + Mock） |
| 菜单/字典/权限 | kit | menu-sync / dict-sync / permission-sync（MCP 驱动，0 手动点击） |
| 后端服务 | bd | codegen 三段式（validate → plan → apply，planHash 留痕） |
| 后端审计 | bd | `review run --module pl`（真实限制扫描范围） |
| 测试 | test | 消费契约生成用例 → E2E 工程（见[案例②](./produce-e2e)） |

## 踩坑与沉淀

| 坑 | 沉淀 |
|----|------|
| 说明书写"系统自动处理"，开发只能猜 | design 包 GB1–GB8 颗粒度基线：命令按钮必须步骤化 |
| 数据库新旧版并存，口径不清 | db-spec 文档镜像 + B31 四方对账（改名走 naming-waivers） |
| MES 外部系统接口无标准 | 集成投递机器契约（StableBusinessId / PayloadHash 审计） |

## 可复现路径

```bash
npx @agile-team/wl-skills-design && npx @agile-team/wl-skills-design verify db   # 设计侧
npx @agile-team/wl-skills-kit                                                    # 前端侧
npx @agile-team/wl-skills-bd init && wl-skills-bd codegen plan wl-contract.json --json
```

业务数据（人天对比、缺陷率）由项目组补充后更新本页。
