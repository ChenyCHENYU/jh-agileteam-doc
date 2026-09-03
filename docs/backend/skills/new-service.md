# new-service — 新服务全链路

> 任务模式 `full`：从空目录到"契约 → 代码 → DDL → 单测 → 审计 → 质量门"的最短路径。规则子集：B1~B31 + J1~J8。

## 什么时候用

新建一个微服务，或给现有仓库补一个完整业务模块（全套 CRUD + 部署配置）。

## 全链路步骤

```bash
# 0. 环境体检（JDK/Maven/Profile/质量门探针）
wl-skills-bd doctor

# 1. 模块登记（Catalog：重复契约/路由/Flyway 版本从此阻断）
wl-skills-bd catalog plan --module <模块名> && wl-skills-bd catalog apply

# 2. 准备契约并校验
cp .github/templates/examples/feature-category.contract.json wl-contract.json
wl-skills-bd codegen validate wl-contract.json

# 3. 三段式生成（17 个产物）
wl-skills-bd codegen plan    wl-contract.json --json
wl-skills-bd codegen apply   wl-contract.json --plan-hash <sha256> --confirm

# 4. 审计 + 质量门
wl-skills-bd validate src/main --format sarif --output reports/backend.sarif
mvn verify -Pwl-quality
```

## 产物清单（标准 CRUD）

| 组 | 产物 |
|----|------|
| 模型 ×6 | Entity / CreateDTO / UpdateDTO / PageDTO / VO / PageVO |
| 服务持久层 ×4 | Controller / 直接 Service / Mapper.java / Mapper.xml |
| DDL ×3 | 正向 migration / 人工恢复说明 / 风险审批预览 |
| 测试 ×2 | ServiceTest / ControllerTest（行为契约骨架） |
| 协作 ×2 | backend-contract.json / api.md |

## 红线

- 契约缺外部路径、权限、数据库信息或字段语义 → **阻断生成**，不用模板默认值掩盖
- apply 后二次修改契约 → 重新 plan（planHash 漂移即拦截）
- 生成的 DDL 只是预览文件，**不连接数据库**——执行走[数据库治理](/backend/skills/db-governance)

## 延伸阅读

- [契约流水线](/backend/skills/skill-pipeline) · [架构设计](/backend/architecture) · 实战参照 `wl-produce`（炼钢服务，bd review canary 试点模块）
