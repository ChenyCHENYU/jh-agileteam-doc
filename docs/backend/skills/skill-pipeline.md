# 后端 AI Skills 流水线

<AuthorTag :authors="['HeGuangMing','YangTianGuang','ZhangXiang']" />

> `@agile-team/wl-skills-bd` v0.18.0 — 契约驱动代码生成的完整链路：从需求评审 → 契约设计 → 代码生成 → 数据库迁移 → 单元测试 → 规范审计 → 安全修复。

---

## 流水线全景

```text
① 前端 wl-contract.json（kit 产出）/ 产品评审需求
         ↓
② api-design-be        接口设计审查（RESTful 命名、字段映射、错误码）
         ↓
③ entity-codegen       Entity / DTO / VO / Query 类生成
         ↓
④ service-codegen      Controller + Service + ServiceImpl + Mapper 接口
         ↓
⑤ mapper-xml-gen       XML 映射（动态条件 / 分页 / 批量 / 多表 join）
         ↓
⑥ db-migration         DDL + Flyway 回滚脚本（⚠️ 写库前强制人工确认）
         ↓
⑦ unit-test-gen        行为契约测试（正常路径/前置拒绝/状态转移/batch）
         ↓
⑧ convention-audit-be  后端规范审计（B1~B29 + J1~J8）
         ↓
⑨ code-fix-be          可选自动修复（B3/B5）→ 复扫确认
         ↓
⑩ 输出：可部署服务 + 测试套件 + DDL 脚本 + 审计报告
```

---

## 12 个 Skill 衔接关系

### 核心生成链（① → ⑤）

| 步骤 | Skill | 输入 | 输出 | 产物 |
|:----:|-------|------|------|------|
| ① | api-design-be | 需求文档 / page-spec | 接口设计建议 | `wl-contract.json` 更新 |
| ② | entity-codegen | 契约 fields[] | Entity/DTO/VO/Query | `entity/` + `dto/` + `vo/` |
| ③ | service-codegen | 契约 operations | Controller+Service+Mapper | `controller/` + `service/` |
| ④ | mapper-xml-gen | 契约 fields + queryMode | MyBatis XML | `mapper/xml/` |

> **Controller → 直接 Service → Mapper**（不生成无业务价值的 IService+ServiceImpl 双层；J1 阻断 Controller→Mapper）。

### 数据与测试链（⑥ → ⑦）

| 步骤 | Skill | 输入 | 输出 | 特殊约束 |
|:----:|-------|------|------|---------|
| ⑤ | db-migration | 契约 entity + database | DDL + Flyway V{version}__{desc}.sql + 回滚 | ⚠️ 只生成不执行，DBA/CD 卡口 |
| ⑥ | unit-test-gen | 契约 customOperations | 行为契约测试类 | 测行为不测镜像，避免冗余 |

### 审计与修复链（⑧ → ⑨）

| 步骤 | Skill | 输入 | 输出 | 状态 |
|:----:|-------|------|------|:----:|
| ⑦ | convention-audit-be | 项目源码 | B1~B29 偏差报告 + SARIF | ✅ |
| ⑧ | code-fix-be | 审计报告 | B3（SELECT \*→include）/ B5（@Transactional）修复 | ✅ |
| ⑨ | data-safety | Redis/缓存/敏感写 | B13~B19 护栏校验 | ✅ |
| ⑩ | standard-env-config-be | 配置文件 | L0~L8 体检 + 环境迁移 | ✅ |

---

## 任务驱动模式（精准触发）

不是每次都跑全链路。bd 支持 **8 种任务类型**，只加载相关 Skill 和规范子集：

```bash
wl-skills-bd task "新开发完整CRUD服务"   # → new-service（全链路）
wl-skills-bd task "加个查询接口"         # → add-api（增量契约）
wl-skills-bd task "加字段落库"           # → add-field
wl-skills-bd task "加submit审批"         # → add-business-cmd
wl-skills-bd task "改个空指针bug"        # → fix-bug
wl-skills-bd task "重构优化"             # → refactor
wl-skills-bd task "审计体检"             # → audit
wl-skills-bd task "连不上redis"          # → config-op
```

| 任务 | 模式 | 加载规则子集 | 涉及 Skill |
|------|------|------------|-----------|
| new-service | 全链路 | B1-B29 子集 + J | ①→⑩ 全链路 |
| add-api | 增量契约 | B1/B2/B5/B8/B12/B20/B24/B25/B26 | ②③④⑦ |
| add-field | 增量契约 | B3/B4/B7/B18/B25/B26 | ②⑤⑦ |
| add-business-cmd | 增量契约 | B5/B8/B17/B20/B24/B25/B26 | ②③④⑥⑦ |
| fix-bug | 修复 | B3/B5/B7/B8/B17/B18/B24/B25/B26/B28 | ⑦⑧ |
| refactor | 修复 | B5-B12/B23/B24/B25/B26/B28 | ⑦⑧ |
| audit | 只读 | B1-B29 全量 | ⑦ |
| config-op | 配置 | config-doctor | ⑩ |

---

## 前后端协作衔接

bd 与 kit 通过 **delivery profile + wl-api-contract** 对齐：

```text
kit（前端）                          bd（后端）
    │                                   │
    ├─ page-spec.json                   ├─ wl-contract.json
    ├─ api.md（前端契约）               ├─ OpenAPI 3
    │                                   ├─ permissions.json
    │                                   │
    └──── contract compare ─────────────┘
         （strict 模式：路径/方法/字段/权限码/revision 对齐）
```

```bash
# 后端导出权限码给前端
wl-skills-bd export-permissions --output docs/SYS_PERMISSION_INFO.md
# 前端读取权限码同步菜单/动作
wl-skills contract compare --frontend api.md --strict
```

---

## 与测试包的衔接

bd 生成的 `ServiceTest.java`（行为契约测试）和 `wl-contract.json` 可直接被 `wl-skills-test` 消费：

```text
bd wl-contract.json ──→ test consumeContract ──→ 测试用例矩阵
bd ServiceTest.java ──→ test quality-analyze  ──→ DI 质量评估
```

详见 [测试工程技能包](/views/testing/)。

---

## 独立闭环

即使没有前端 kit，bd 也能从**已评审需求**独立生成完整后端代码：

```bash
# 1. 初始化
npx @agile-team/wl-skills-bd init

# 2. 编写 wl-contract.json（从需求抽取实体+操作+字段）

# 3. 代码生成（三段式安全确认）
wl-skills-bd codegen validate wl-contract.json
wl-skills-bd codegen plan     wl-contract.json
wl-skills-bd codegen apply    wl-contract.json --plan-hash <hash> --confirm

# 4. 质量门
mvn verify -Pwl-quality

# 5. 审计
wl-skills-bd validate src/main --format sarif
```
