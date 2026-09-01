# 后端 — 快速上手

> 面向新加入后端团队的开发者：从环境准备到跑通"契约 → 生成 → 审计 → 质量门"最小闭环，约 30 分钟。

::: tip 前置知识
- 基线：**Java 8 + Spring Boot 2 + jh4j-cloud 3.1 + MyBatis-Plus**，交付 profile `jh4j3-openapi3@1.0`
- 工具包：`@agile-team/wl-skills-bd`（当前 v0.24.0），完整能力见 [Skills 集合](/backend/skills/)
:::

---

## 一、环境准备

| 工具 | 版本要求 | 用途 |
|------|---------|------|
| Node.js | **≥ 22** | 运行 wl-skills-bd CLI / MCP |
| JDK | 8（目标工程） | 编译与质量门 |
| Maven | 3.6+ | 构建、J1~J8 质量门（`mvn verify -Pwl-quality`） |
| Git | — | 提交规范（commitlint 校验） |

```bash
# 一条命令安装（规范 + 模板 + 编辑器/MCP 配置；先预览可加 --dry-run）
npx @agile-team/wl-skills-bd init

# 环境体检：JDK/Maven/Profile/质量门探针
wl-skills-bd doctor
```

安装由受管 manifest 管理，不覆盖本地修改；任一步失败自动回滚，不留半安装状态。

---

## 二、第一条生成链路（新服务全链路）

### 1. 准备契约

契约是唯一的生成事实。可直接复制包内示例改造：

```bash
cp .github/templates/examples/feature-category.contract.json wl-contract.json
```

契约要素：资源名、字段（长度/精度/必填/枚举，标注约束来源）、数据分级、customOperations（submit 等）。**契约缺外部路径、权限、数据库信息或字段语义时会阻断生成**——这是刻意设计，不用模板默认值掩盖未知事实。

### 2. 三段式生成（所有写操作必须走此流程）

```bash
wl-skills-bd codegen validate wl-contract.json                    # 校验契约
wl-skills-bd codegen plan    wl-contract.json --json              # 产出计划 + planHash
wl-skills-bd codegen apply   wl-contract.json --plan-hash <sha256> --confirm   # 确认后落盘
```

标准 CRUD 一次生成 **17 个产物**：模型 ×6（Entity/CreateDTO/UpdateDTO/PageDTO/VO/PageVO）、服务持久层 ×4（Controller/直接 Service/Mapper.java/Mapper.xml）、DDL 资产 ×3、测试骨架 ×2（ServiceTest/ControllerTest）、协作产物 ×2（backend-contract.json / api.md）。失败全量回滚。

### 3. 审计与质量门

```bash
wl-skills-bd validate src/main --format sarif --output reports/backend.sarif
mvn verify -Pwl-quality        # J1~J8：ArchUnit/Checkstyle/PMD/SpotBugs/Spotless/P3C/OpenAPI/JaCoCo
```

---

## 三、日常增量（不重跑全链路）

```bash
wl-skills-bd task "加个查询接口"      # → add-api，自动加载对应规则子集
wl-skills-bd task "加字段落库"        # → add-field
wl-skills-bd task "改个空指针bug"     # → fix-bug（safe-fix 仅 B3/B5 自动修复）
wl-skills-bd task --list              # 8 种任务一览
```

增量改动**先改契约再生成**；`task` 只读路由不写文件。

---

## 四、数据库变更流程（红线）

```bash
wl-skills-bd db preview wl-contract.json                          # DDL 预览 + 基线门禁
wl-skills-bd db drift --snapshot snapshot.json                    # 与线上快照对账
wl-skills-bd db executed --table t_xxx --approval-ref JIRA-123    # 现场 DDL 执行回执入账本
wl-skills-bd db ledger                                            # 审计执行账本
```

- 事实源顺序：**文档（docs/db-spec）→ 契约 → Flyway 迁移**，任何环节缺失都会被对账检出
- dev/sit：一次 planHash 审批后连续执行；**pre/prod 默认零写入**，走 DBA/CD 与变更窗口
- 字段改名需在 `.wl-skills-bd/naming-waivers.json` 登记并审批，warn 标识永久保留

---

## 五、提交与协作

- 提交格式：`type(scope): 功能点-具体内容`（`wl-skills-bd commit check` 可校验）
- 前后端握手：`wl-skills-bd contract diff wl-contract.json --strict`，支持对比前端 api.md / OpenAPI / 权限清单
- 权限码导出：`wls_be_export_permissions` 产出 kit `SYS_PERMISSION_INFO.md` 片段，供菜单/权限同步直接消费

---

## 六、常见问题

| 问题 | 处理 |
|------|------|
| codegen apply 提示 planHash 漂移 | 契约或数据库事实源在 plan 之后变更过，重新 `plan` 再 `apply` |
| 生成被阻断"缺少数据库信息" | 契约补全 dataSource / schema 字段，不要依赖模板默认值 |
| review 报"新增问题"但行号没改过 | v0.24 起 fingerprint 稳定（source/rule/file/message），确认是同文件第二次同类违规则属真实新增 |
| Maven 质量门本机通过 CI 失败 | 检查本机 Maven settings 是否注入了高版本 compiler（质量夹具锁定 Java 8 参数） |
| 手工直改了库 | 尽快 `db executed` 补账，否则下轮 `drift` 会以"无主变更"暴露 |

更多排查见 [使用指南](/backend/skills/usage-guide) 与 [疑难杂症](/views/troubleshooting/)。
