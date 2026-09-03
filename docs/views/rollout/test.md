# 测试工程规范落地宣贯文档（多项目集群管控方案）

> 文档用途：项目组会宣贯、测试侧接入执行、存量测试代码整改和后续验收依据
> 适用对象：项目负责人、测试负责人、测试开发、前端/后端负责人及相关协作人员
> 工程载体：`@agile-team/wl-skills-test`
> 工程目录：`D:\office-project\wl\wl-skills-test`
> 上游契约：`wl-skills-kit`（page-spec / wl-api-contract）· `wl-skills-bd`（wl-contract）
> 当前核对版本：`0.21.0`（2026-09-03）

---

## 一、宣贯目标与核心结论

本次宣贯需要全员达成一个统一认识：

> 测试不再是"开发提测后才开始的手工环节"，`wl-skills-test` 是测试工程的工程化执行载体；通过契约驱动生成、确定性审计、真实执行引擎和统一报告体系，把测试左移到需求评审、把执行交给机器、把判定交给数据，形成"**方案 → 用例 → 脚本 → 执行 → 质量门 → 上线判定**"全链路闭环。

本次会议结束后，各项目和测试人员应明确以下事项：

1. 为什么测试必须工程化，以及当前问题对转测质量和上线风险的影响；
2. `wl-skills-test` 的 12 个 Skill、17 个 MCP 工具、25 条审计规则、3 个执行器各管什么；
3. 契约驱动的三种输入（kit 契约 / bd 契约 / page-spec）分别怎么消费；
4. 如何通过"生成 → 审计 → 执行 → 质量门 → 报告"形成闭环，并接入 CI；
5. `test-reports/` 统一报告体系与趋势追踪怎么用；
6. 测试代码出现反模式或执行异常时，如何反馈和归口解决。

一句话概括本方案：

> 一套测试规范、一个工程化事实源、契约驱动生成、三层执行引擎、25 条确定性审计、一条"生成到上线判定"闭环。

### 版本演进速览（v0.5.0 → v0.11.0）

| 版本 | 落地能力 | 对使用者的意义 |
|------|---------|--------------|
| v0.8.0 | E2E 工程化做深：7 层 project 编排、用例归属强校验、显式路由映射、`e2e-check` 独立卡门、T21-T25 规则 | 从 page-spec 批量生成工程级 Playwright 工程；"文件写了但从未被执行"的假闭环由机器检出 |
| v0.9.0 | run-api 深度执行引擎：DAG 编排 + 四层断言 + 负例 + 契约漂移检测 + 权限双账号 | 接口测试从"成功码冒烟"升级为"深度测试"——安全缺口可被精确检出并定位到字段 |
| v0.10.0 | 选择器适配层（element-plus/steel/ant-design）、沙箱模拟跑、工位模板、`dict-sync`、`gate` 聚合质量门、webhook 推送 | 换组件库只改一个文件；在真实项目 32 个页面上完成端到端验证；一条命令聚合全部质量判定 |
| v0.11.0 | **test-reports 统一报告体系**（7 类产物自动发现 + history.jsonl 历史趋势）；`run-gen --granularity field` 字段级细粒度用例 | 所有报告集中一处、二次执行出趋势表、跨版本质量可追踪；用例颗粒度细化到字段和操作 |

> 单元测试 48 → **248 个**全部通过（含 mock 后端集成测试与正反例回归），覆盖 0.12~0.21 十个版本的架构地基/引擎层/生成器/安全收口/可用性/有效性/性能工程化/报告门户/闭环收口/AI 接入迭代。

---

## 二、落地背景与现存问题

### 2.1 当前项目特点

平台采用多项目集群架构，十余个子系统并行迭代，提测频率高、回归范围大。测试团队同时面对：需求文档颗粒度不一、前后端接口契约口头约定、Playwright/JMeter 脚本各自为政、测试报告格式五花八门、上线判定缺少数据依据。

### 2.2 主要问题

长期以来，测试工程主要依赖人工经验和零散脚本，容易产生以下问题：

- 测试方案和用例各模块格式不一，P0/P1 分级靠感觉，覆盖缺口说不清；
- 用例只覆盖"正常路径"，必填校验、超长、非法枚举、重复提交等负例系统性缺失；
- Playwright 脚本硬等待、硬编码 URL、缺断言、`test.only` 假闭环、测试数据不清理；
- JMeter 脚本缺聚合报告、CSV 参数化缺失、线程 ramp 配置不当，压测结论不可信；
- 接口测试只看"返回 200"，后端必填不校验、类型宽恕、超长放行、权限不拦截统统发现不了；
- 测试数据污染环境：跑一次测试留下脏数据，下次跑挂掉；
- e2e 工程文件写了但从未被执行，归属清单与实际 spec 漂移无人发现；
- 测试报告散落各处，格式不统一，历史趋势无从对比，上线判定缺数据支撑；
- 相同反模式在多个项目重复出现，修复不沉淀。

### 2.3 根因判断

| 层面 | 过去的状态 | 需要建立的机制 |
|------|-----------|--------------|
| 方案与用例 | 人工编写，颗粒度参差 | Skill 契约驱动生成 + P0-P3 分级 |
| 脚本 | 各自手写，反模式遍地 | 工程化模板 + T1-T25 确定性审计 + F1-F6 修复 |
| 执行 | 点点点 + 跑脚本看控制台 | DAG 执行引擎 + 四层断言 + 零污染清理 |
| 判定 | 经验判断，缺数据支撑 | DI 4 指标 + gate 聚合 + 上线判定 |
| 报告 | 散文件，无趋势 | test-reports 统一体系 + history.jsonl |
| 演进 | 反模式重复出现 | 规则化沉淀 + 版本化升级 |

---

## 三、方案定位与统一原则

### 3.1 方案定位

`wl-skills-test` 不是用例模板库，也不是只能跑脚本的执行器集合。在五包分工中，它承担"真实执行"环节——其余包产出规范与代码，它对产物发起真实请求、驱动真实浏览器、执行真实压测。包内包含：

- 11 条测试规范（`.github/standards/01~11`，对齐在线 QC 流程规范）；
- 12 个 AI Skill（功能链 9 + 性能链 3）；
- 18 个 MCP 工具（`wls_test_*` 前缀，全部实现并有测试覆盖，v0.17 新增 contract_diff）；
- 25 条审计规则（T1-T25 确定性扫描器）；
- 6 个自动修复（F1-F6）；
- 3 个执行器（API / Playwright / JMeter）；
- 16 条 CLI 命令；
- 179 个单元测试。

**独立可用**：不依赖其他包也能从需求文档独立工作；联动是增强（消费上游契约自动生成用例），不是前置条件。

### 3.2 三层事实来源

| 优先级 | 事实来源 | 作用 |
|--------|---------|------|
| 1 | 11 条测试规范（01-流程 ~ 11-数据安全） | 测试流程、用例、自动化、数据、安全的唯一基线 |
| 2 | 上游机器契约 | kit `wl-api-contract.json` / bd `wl-contract.json` / kit `page-spec.json`——用例与脚本从契约生成，不人工转录 |
| 3 | 测试项目特殊约定 | 仅承载公共规范暂未覆盖且经确认的业务特例 |

### 3.3 三种管控方式

| 管控方式 | 适用内容 | 示例 |
|---------|---------|------|
| 契约驱动生成 | 可从机器契约推导的用例与脚本 | run-gen 从 wl-contract 生成 CRUD 用例矩阵 + Playwright 工程 |
| 确定性审计 | 必须从源码判定的反模式 | T1-T25 扫描（Playwright/JMeter/用例/E2E 工程）+ F1-F6 修复 |
| 真实执行与门禁 | 必须真实运行才能判定的问题 | run-api 四层断言、gate 聚合质量门、e2e-check CI 卡门 |

### 3.4 与兄弟包的分工

```
design(产品设计) → kit(前端代码) → ui(视觉对齐) → bd(后端代码) → test(测试验证)
      ↓                ↓                              ↓               ↑
  需求说明书      page-spec/api.md              wl-contract.json   消费上游契约
                                                                → 用例矩阵 → 自动化脚本
                                                                → 执行 + 质量门 → 上线判定
```

---

## 四、整体工程架构

```text
需求文档 / 上游契约（kit · bd · page-spec）
        │
        ▼
11 条测试规范（唯一基线）
        │
        ▼
13 个 AI Skill（意图触发 → 契约消费 → 生成，含 test-onboarding 接入编排）
    ├── 功能链 9 个：方案 → 场景 → 用例 → 评审 → 冒烟筛选 → 冒烟执行 → 脚本 → 规则基座 → 质量评估
    └── 性能链 3 个：压测方案 → JMeter 脚本 → 报告分析
        │
        ▼
确定性审计（T1-T25）+ 自动修复（F1-F6）
        │
        ▼
真实执行引擎
    ├── run-api        DAG 编排 + 四层断言 + 负例 + 契约漂移 + 权限双账号
    ├── run-playwright 7 层 E2E 工程 + 归属强校验 + 拦截零污染
    └── run-jmeter     JMeter 5.6.3 + jtl 解析 + P50/P95/P99/SLA
        │
        ▼
test-reports/ 统一报告体系（7 类产物 + history.jsonl 趋势）
        │
        ▼
gate 聚合质量门 → DI 4 指标 → 上线判定（go/no-go）
```

---

## 五、`wl-skills-test` 统一管控覆盖维度

### 5.1 测试流程规范（11 条基线）

| 编号 | 域 | 核心约束 |
|------|-----|---------|
| 01 | 测试流程 | 7 步标准测试方案、出入口准则、四级缺陷分级 |
| 02-03 | 用例 | 编号/优先级/前置/步骤/预期结构化；P0-P3 分布统计 |
| 04-06 | 自动化 | Playwright 规范、通用规则基座、数据生命周期 |
| 07 | 性能 | JMeter 5.6.3、三场景、P99 < 500ms、11 条 XML 强制规则 |
| 08-10 | 质量 | DI 分析、模块收敛、评审规则 |
| 11 | 数据安全 | 测试数据脱敏、清理、隔离 |

### 5.2 用例生成：三种输入 × 两个粒度

| 契约来源 | 格式 | 自动生成 |
|---------|------|---------|
| kit | `wl-api-contract.json` | CRUD 用例矩阵 + 权限 + 必填校验 |
| bd | `wl-contract.json` | 5 标准操作 + customOperations + 必填 |
| kit | `page-spec.json` | 页面 CRUD 推断 + Playwright 选择器 |

```bash
# 基线矩阵生成
npx @agile-team/wl-skills-test run-gen --contract ./wl-contract.json
npx @agile-team/wl-skills-test run-gen --contract ./page-spec.json --type playwright
npx @agile-team/wl-skills-test run-gen --contract ./wl-contract.json --type jmeter --threads 200

# 细粒度生成（v0.11.0）：字段级 + 操作级
npx @agile-team/wl-skills-test run-gen --granularity field
```

**细粒度用例清单（颗粒度到字段，闭环可执行）**：

| 级别 | 用例 | 优先级 |
|------|------|:------:|
| 字段级 | 必填置空 / 非法枚举 / 非数值类型 | P0 |
| 字段级 | 超长 / 数值 min·min-1·max·max+1 边界 | P1 |
| 字段级 | 特殊字符 XSS · SQL 注入探测 | P2 |
| 字段级 | 前后空格 | P3 |
| 操作级 | 重复提交 / 无权限（每个写操作） | P0 |
| 操作级 | 不存在主键 / 重复删除 / 分页边界 | P1-P2 |
| 操作级 | 组合查询收敛 | P3 |

> 每条用例标注 `dimension` 与 `autoExec`——与 run-api DAG 步骤一一对应的自动执行，其余**诚实标注**为人工/待扩展，不虚标覆盖率。

### 5.3 深度接口测试引擎（run-api · v0.9.0+）

从"成功码冒烟"（L2）升级为"深度接口测试"（L3+）：

| 能力 | 说明 |
|------|------|
| **DAG 编排** | 列表冒烟 → 新增 → 写后读回 → 更新 → 详情 → 负例×3 → 重复提交 → 权限拒绝 → 分页边界 → 清理 → 零污染复查；前置失败级联 skip 并标注原因 |
| **四层断言** | L1 成功信封（HTTP + 契约 successCode）→ L2 结构（records/total/字段类型）→ L3 数据正确性（写后读回逐字段比对）→ L4 负例与安全 |
| **负例执行** | 按契约 required/type/maxLength 自动构造三类负例；意外成功的负例自动登记清理（零污染兜底） |
| **契约漂移检测** | 响应实际字段 vs 契约 models 全量 diff：声明但缺失 / 未声明 / 类型不符 |
| **权限双账号** | `--token-no-perm` 读探针 + `--perm-write-probe` 写探针；权限未拦截判失败 |
| **报文快照留证** | 每步请求/响应体（截断）进 JSON 报告，失败可回溯到具体报文 |
| **字典注入** | `--dict-file` 提供枚举字段真实合法值 |
| **网络错误防假通过** | 超时/连不上（status=0）记 error，绝不判为"被拒绝" |

```bash
npx @agile-team/wl-skills-test run-api --contract ./wl-contract.json \
  --base-url http://localhost:8080 --token-no-perm --dict-file ./dict.json
```

### 5.4 E2E 工程化（v0.8.0+，源自 wl-ui-produce 32 页实战约束的模板化固化）

| 能力 | 说明 |
|------|------|
| 7 层 project 编排 | auth-setup → round1-readonly → round1-detail → ui-contract → round2-write → quarantine → cleanup，A/B/C 风险分层 |
| **用例归属强校验** | 归属清单加载即断言：未归类/重复归属/缺安全标记/Bearer 截断/隔离声明漂移/UI 契约缺 page.route——任一命中拒绝运行 |
| 显式路由映射 | `--routes routes.json`（pageId→路由）优先于目录推导，双向一致性校验 |
| 登录双模式 | 默认人工登录（兼容验证码/SSO/MFA，最长 4 分钟等待），配置账号自动填表 |
| 逐页深度用例 | 列头渲染断言、搜索收敛、重置恢复、字典翻译（dict 列显示中文）；SIT 无数据优雅 skip |
| UI 契约拦截 | page.route 拦截全部写请求返回成功信封，断言端点+payload——无安全测试数据、任意环境可跑 |
| 高风险隔离 | quarantine 默认 skip + 隔离准入准则 + 种子数据声明；解除需移出清单 |
| 选择器适配层 | `--ui element-plus\|steel\|ant-design` 生成 `support/selectors.js` 集中管理页面选择器（steel 即 wl-ui-produce 形态的 AG Grid + 自研组件），换组件库只改一个文件 |
| 工位页/子表模板 | workstation 查看态断言、进阶查询回填、save/submit 契约；subTables 逐页签用例 |
| e2e-check | 对任意 e2e 工程独立执行归属闭环 + 静态安全扫描，CI 非零退出 |

**沙箱模拟跑验证链**：只读消费 wl-ui-produce 真实 page-spec（32 个页面目录）+ 真实路由映射 → 生成 → 进程内 mock 前后端 → 真实浏览器逐页执行首轮只读校验 → 32/32 通过 → 沙箱即删，源项目零写入。验证过程曾暴露并修复 3 个落地问题（ESM 加载崩溃、ffmpeg 依赖、浏览器 channel 兼容），这类问题在使用方项目中不会再出现。

### 5.5 确定性审计引擎（T1-T25）

不靠 AI 自觉，脚本直接检测（对标 kit K1-K19 / bd B1-B31 / ui R001-R042）：

| 规则范围 | 对象 | 检测内容 |
|---------|------|---------|
| T1-T5, T12 | Playwright | beforeEach 缺失 / 硬编码 URL / 缺少断言 / 测试名 / 数据清理 / 硬等待 |
| T6-T9, T13-T18 | JMeter | 聚合报告 / ConfigTestElement 致命坑 / SteppingThreadGroup / CSV / LoopController / Header / SLA / PerfMon / ramp |
| T10-T11, T19-T20 | 用例 | P0 覆盖 / 预期结果 / 数量不足 / 异常场景缺失 |
| T21-T25 | E2E 工程 | test.only 假闭环 / 受控写入缺安全标记 / 隔离声明漂移 / Bearer 截断 / UI 契约缺 page.route |

```bash
npx @agile-team/wl-skills-test audit --target ./tests/    # 审计
npx @agile-team/wl-skills-test fix --target ./tests/      # 自动修复（F1-F6）
```

| 修复项 | 内容 |
|--------|------|
| F1-F3 | `::v-deep`→`:deep()` / 补 beforeEach 模板 / `waitForTimeout`→`waitForSelector` |
| F4-F6 | 硬编码 URL→BASE_URL 环境变量 / 补 afterEach 数据清理 / 测试名加 should 前缀 |

### 5.6 性能测试链（3 Skill）

JMeter 5.6.3 兼容：`.jmx` + 参数化 CSV + CLI 命令（含登录鉴权/Token/断言）；三场景梯度并发（日常 10→50→100 / 峰值 100→300→500 / 突发 500→1000→2000）；P99 < 500ms、错误率 < 0.5%；报告解析 jtl 输出 P50/P95/P99/错误率/SLA + 瓶颈诊断 + 3 版本趋势对比；`perf-compare` 对基线劣化即非零退出。

### 5.7 test-reports 统一报告体系（v0.11.0）

所有报告统一产出到 `test-reports/`（`--reports-dir` 可改），**报告产出到使用项目**而非包内：

| 产物 | 来源命令 |
|------|---------|
| `api-报告.md` + `api-result.json` | run-api |
| `e2e-报告.md` + `playwright-result.json` | run-playwright（解析原生 results.json 提取失败明细） |
| `perf-报告.md` + `perf-result.json` | run-jmeter |
| `audit-报告.md` + `audit-result.json` | audit（规则分布 + 文件明细 + 修复入口） |
| `测试报告.md` + `index.md` | report |
| `perf-compare-报告.md` | perf-compare |
| `history.jsonl` | 每次执行（kind/time/pass/通过率） |

- **自动发现**：`report` 不传参时扫描约定文件聚合各维度，生成规范 10 章报告 + 上线判定；
- **历史趋势**：`report --trend` 追加最近 5 次趋势表，支持跨版本质量追踪；gate 亦写入历史（kind=gate）；
- **推送**：`report --webhook <url>` / `gate --webhook` 推送企微/钉钉/raw（失败明细 Markdown，推送失败仅告警）。

### 5.8 DI 质量门与上线判定

```bash
# 一键聚合：审计 T1-T25 + e2e-check + 冒烟通过率 + DI 质量门 + 性能基线，任一失败 exit 1
npx @agile-team/wl-skills-test gate
npx @agile-team/wl-skills-test gate --webhook <url>
```

4 指标上线判定：**DI 密度 < 0.3 · 致命缺陷关闭率 100% · 严重缺陷关闭率 100% · 最差模块缺陷收敛 ≤ 20%**。输入无效 fail-closed，不静默放行。

---

## 六、Skill 与工具全景

### 6.1 13 个 AI Skill 流水线

**功能测试链（9 个）**：

```
需求文档
  ├─→ ① test-plan-generator ──── 测试方案（7 章标准化）
  ├─→ ② test-scenario-analyzer ── 业务场景（10 类全覆盖）
  └─→ ③ test-case-generator ───── 功能+流程用例（P0~P3，支持字段级细粒度）
        ├─→ ④ test-case-reviewer ── 5 维评审（业务覆盖/规范/可执行/数据完整/边界异常）
        ├─→ ⑤ smoke-test-selector ─ 冒烟套件（≤8/15/25 定量）
        │     └─→ ⑥ smoke-test-executor ── 执行+报告+转测判定
        ├─→ ⑦ test-script-generator ─ Playwright 脚本
        │     └─→ ⑧ universal-test-rules ── 自动化规则基座
        └─→ ⑨ test-quality-analyzer ── DI 质量评估+多轮趋势+go/no-go
```

**性能测试链（3 个）**：⑩ perf-plan-generator（方案/梯度/SLA）→ ⑪ perf-script-generator（.jmx+CSV+CLI）→ ⑫ perf-report-analyzer（jtl 解析/瓶颈诊断/3 版本趋势）。

### 6.2 18 个 MCP 工具

`wls_test_standards` / `contract_read` / `case_generate`（含 granularity:field）/ `smoke_select` / `env_check` / `quality_analyze` / `jmeter_validate` / `audit` / `fix` / `run_api`（透传全部深度参数）/ `run_playwright` / `run_jmeter` / `e2e_generate` / `report_generate` / `e2e_check` / `dict_sync` / `gate`——AI 编辑器内一句话即可触发，CLI 与 MCP 复用同一 `lib/` 核心。

### 6.3 16 条 CLI 命令

`init` / `update` / `doctor` / `validate` / `run-gen` / `audit` / `fix` / `run-api` / `run-playwright` / `run-jmeter` / `perf-compare` / `e2e-check` / `dict-sync` / `gate` / `report` / `clean`

---

## 七、接入流程

### 7.1 新项目 / 新模块接入

```bash
# 1. 安装（11 规范 + 12 Skill + 17 MCP + 编辑器配置）
npx @agile-team/wl-skills-test init

# 2. 环境体检（Node/Playwright/JMeter/浏览器通道）
npx @agile-team/wl-skills-test doctor

# 3. 从契约生成用例与脚本（有上游契约时）
npx @agile-team/wl-skills-test run-gen --contract ./wl-contract.json

# 4. 审计生成的脚本（T1-T25）
npx @agile-team/wl-skills-test audit --target ./tests/

# 5. 执行 + 报告 + 质量门
npx @agile-team/wl-skills-test run-api --contract ./wl-contract.json --base-url ...
npx @agile-team/wl-skills-test report --trend
npx @agile-team/wl-skills-test gate
```

### 7.2 存量测试代码整改

```bash
# 1. 审计存量脚本反模式
npx @agile-team/wl-skills-test audit --target ./tests/

# 2. 自动修复 F1-F6（先预览后执行）
npx @agile-team/wl-skills-test fix --target ./tests/

# 3. E2E 工程强校验（归属闭环 + 安全扫描）
npx @agile-team/wl-skills-test e2e-check --target ./e2e/

# 4. 冻结基线：历史问题按计划消化，新增违规 CI 阻断
```

### 7.3 CI 集成

```yaml
# PR 阶段：审计 + e2e-check + gate（任一失败阻断合并）
- run: npx @agile-team/wl-skills-test audit --target tests/
- run: npx @agile-team/wl-skills-test e2e-check --target e2e/
- run: npx @agile-team/wl-skills-test gate
```

---

## 八、问题归属判断：改公共包、改测试代码还是改被测系统

```text
问题属于测试资产质量（脚本反模式/假闭环）？
  ├─ 是 → audit 定位 → fix 自动修复或人工整改（测试侧）
  └─ 否
      ↓
执行失败属于被测系统真实缺陷/安全缺口？
  ├─ 是 → 提缺陷，附报文快照/证据附件定位到字段（系统侧）
  └─ 否
      ↓
契约与实际行为不一致（漂移检测命中）？
  ├─ 是 → 先改契约（kit/bd 侧同步修订），再重跑（契约侧）
  └─ 否
      ↓
反模式/规则在多个项目重复出现？
  ├─ 是 → 归口 wl-skills-test：新增 T 规则 + F 修复 + 回归测试（包侧）
  └─ 否 → 评估是否为业务特例，显式登记豁免与原因
```

判断原则：

- 安全缺口（必填不校验/类型宽恕/权限不拦截）**默认是系统缺陷**，不是"测试太严格"；
- 网络故障绝不伪装成"被拒绝"（防假通过是引擎底线）；
- 测试数据零污染是硬要求：意外成功的负例自动登记清理；
- 公共反模式不在多个项目重复手修，沉淀为 T/F 规则统一发版。

---

## 九、全员执行要求

### 9.1 必须执行

1. 测试项目统一安装 `@agile-team/wl-skills-test`，版本升级同时更新锁文件；
2. 有上游契约的项目必须从契约生成用例（不人工转录接口字段）；
3. 新增自动化脚本必须通过 audit（T1-T25 零 error）；
4. E2E 工程必须通过 e2e-check（归属闭环 + 安全标记）；
5. 接口测试执行 run-api 四层断言（不接受只看成功码）；
6. 所有报告统一产出到 `test-reports/`，验收以聚合报告 + DI 指标为准；
7. 上线判定必须走 gate（或 report 上线判定章节），留档 history.jsonl；
8. 写操作测试数据统一 `AT_` 前缀并闭环清理。

### 9.2 明确禁止

- 禁止 `test.only` / `describe.only` 上库（T21 阻断）；
- 禁止受控写入 spec 缺安全标记（requireWriteApproval / RunLedger / finally 清理）；
- 禁止硬编码 URL / `waitForTimeout` 硬等待 / 缺断言脚本（T1-T5）；
- 禁止 Bearer token 截断、隔离声明与实际不符；
- 禁止压测脚本无聚合报告、无 CSV 参数化、无 SLA 断言；
- 禁止跑完测试留脏数据不清理；
- 禁止用"环境问题"解释未拦截的权限缺口而不提缺陷；
- 禁止绕过 test-reports 私发格式不统一的报告。

### 9.3 允许但需评审

- 验证码/SSO/MFA 登录走人工登录模式（4 分钟等待窗口）；
- 高风险用例进 quarantine 隔离组（须声明准入准则与种子数据）;
- SIT 环境无数据时优雅 skip（须在报告中标注）；
- 组件库不在三种适配之内的新选择器集（登记后扩展适配层）。

---

## 十、角色与职责

| 角色 | 主要职责 |
|------|---------|
| 测试负责人 / 规范负责人 | 维护测试规范基线、公共包路线、版本策略和争议裁决 |
| `wl-skills-test` 维护人员 | 规则增强、执行引擎迭代、报告体系演进、发版 |
| 测试开发 | 按 Skill 生成与维护用例脚本，跑 audit/fix，管理 test-reports |
| 测试人员 | 执行冒烟/回归，维护缺陷数据（DI 输入），确认上线判定 |
| 前端/后端负责人 | 契约漂移问题协同定位与修订 |
| 项目负责人 | 确认质量门标准、gate 结果与上线决策 |

---

## 十一、项目验收清单

### 11.1 接入验收

- [ ] `package.json` 和锁文件中的 `wl-skills-test` 版本一致；
- [ ] `.github/skills/` 含 13 个 Skill、`.github/standards/` 含 11 条规范；
- [ ] `doctor` 通过（Node / Playwright / JMeter / 浏览器通道）；
- [ ] MCP 配置随 init 正确生成。

### 11.2 资产质量验收

- [ ] 用例覆盖 P0-P3 分级且分布统计完整；
- [ ] 字段级负例用例（必填/超长/边界/非法枚举/注入探测）已生成；
- [ ] `audit` 零 error（T1-T25）；
- [ ] `fix` 后复扫通过，F1-F6 反模式清零；
- [ ] E2E 工程归属清单与实际 spec 一致（e2e-check 通过）。

### 11.3 执行与判定验收

- [ ] run-api 四层断言全部通过（含负例、权限、零污染复查）；
- [ ] 契约漂移检测零未处理项；
- [ ] `test-reports/` 聚合报告生成，趋势表可追溯；
- [ ] `gate` 通过（或失败项均有缺陷跟踪与豁免登记）；
- [ ] 上线判定结论留档（go/no-go + DI 4 指标数值）。

---

## 十二、特殊场景反馈与持续迭代

### 12.1 反馈时必须提供的信息

```text
项目名称：
wl-skills-test 实际版本：
场景：run-gen / audit / fix / run-api / run-playwright / run-jmeter / gate / report
契约文件（如涉及，可脱敏）：
命令完整参数与退出码：
test-reports/ 对应产物路径：
期望行为与实际偏差：
是否可稳定复现（mock 后端/沙箱可复现优先）：
```

### 12.2 公共包修复要求

每次公共包修复必须做到：

1. 先在 mock 后端或沙箱复现（包内自带 mock 集成测试基建）；
2. 明确影响维度（生成/审计/执行/报告/门禁）与规则编号；
3. 新增规则必须同时提供正例（全部通过）与负例（必须被检出）回归测试；
4. 执行引擎修复必须验证"网络错误防假通过"底线不被破坏；
5. 更新 README 与 CHANGELOG，保持既有单元测试全部通过；
6. 发布版本并提供升级说明与验收清单。

---

## 十三、方案落地价值

1. **测试左移**：从需求评审即生成方案与用例，不等提测才开始；
2. **深度而非冒烟**：四层断言 + 负例 + 权限 + 漂移检测，安全缺口可定位到具体字段；
3. **工程级 E2E**：归属强校验堵住"文件写了但从未执行"的假闭环，已在真实项目 32 个页面上验证通过；
4. **零污染执行**：DAG 清理链 + 意外成功负例自动回收，测试不再给环境留脏数据；
5. **数据化判定**：DI 4 指标 + gate 聚合 + 历史趋势，上线判定从经验判断变为数据依据；
6. **反模式沉淀**：T1-T25 + F1-F6 规则化，同类问题只解决一次；
7. **全链路验证关口**：消费 design/kit/bd 全部上游契约，设计与代码的质量问题在测试环节集中暴露、闭环归位。

---

## 十四、宣贯会议后建议输出

1. 确认 11 条测试规范和 `wl-skills-test` 为测试侧统一事实来源；
2. 确认各项目测试负责人名单；
3. 确认接入台账与目标版本（≥ 0.21.0）；
4. 确认第一批试点（建议 1 个项目走"契约→用例→执行→gate"全链路 + 1 批存量脚本 audit/fix）；
5. 确认 gate 接入 CI 与阻断级别（建议 PR 阶段 audit+e2e-check 阻断、合并前 gate 阻断）；
6. 确认 test-reports 归档位置与 webhook 推送群；
7. 确认 DI 缺陷数据的录入责任人与口径；
8. 确认豁免登记与评审流程。

---

## 附录 A：项目常用命令

```bash
# 安装 / 体检 / 更新
npx @agile-team/wl-skills-test init
npx @agile-team/wl-skills-test doctor
npx @agile-team/wl-skills-test update

# 生成
npx @agile-team/wl-skills-test run-gen --contract ./wl-contract.json
npx @agile-team/wl-skills-test run-gen --contract ./page-spec.json --type playwright
npx @agile-team/wl-skills-test run-gen --contract ./wl-contract.json --type jmeter --threads 200
npx @agile-team/wl-skills-test run-gen --granularity field

# 审计与修复
npx @agile-team/wl-skills-test audit --target ./tests/
npx @agile-team/wl-skills-test fix --target ./tests/
npx @agile-team/wl-skills-test e2e-check --target ./e2e/

# 执行
npx @agile-team/wl-skills-test run-api --contract ./wl-contract.json \
  --base-url http://localhost:8080 --token-no-perm --dict-file ./dict.json
npx @agile-team/wl-skills-test run-playwright --test-dir ./tests/
npx @agile-team/wl-skills-test run-jmeter --jmx ./perf.jmx --threads 200
npx @agile-team/wl-skills-test perf-compare --jtl ./result.jtl --baseline ./base.json

# 报告与质量门
npx @agile-team/wl-skills-test report --trend
npx @agile-team/wl-skills-test report --webhook <url>
npx @agile-team/wl-skills-test gate
npx @agile-team/wl-skills-test gate --webhook <url>

# 字典同步（三形态自动识别）
npx @agile-team/wl-skills-test dict-sync --map 字段=字典码
```

## 附录 B：能力与工程载体对应关系

| 能力 | 工程载体 | 规模 | 当前状态 |
|------|---------|------|---------|
| 测试规范 | standards 01-11 | 11 条 | 已工程化 |
| 方案/用例/评审/质量 Skill | 功能链 9 个 | 9 个 | 已工程化 |
| 性能方案/脚本/报告 Skill | 性能链 3 个 | 3 个 | 已工程化 |
| 确定性审计 | T1-T25 | 25 条 | 已工程化 |
| 自动修复 | F1-F6 | 6 项 | 已工程化 |
| 深度接口执行 | run-api DAG + 四层断言 | 1 引擎 | 已工程化 |
| E2E 工程生成与校验 | run-gen e2e + e2e-check | 7 层编排 | 已工程化 |
| 性能执行与基线 | run-jmeter + perf-compare | 1 引擎 | 已工程化 |
| 统一报告 | test-reports/ 7 类产物 + 趋势 | 1 体系 | 已工程化 |
| 聚合质量门 | gate + DI 4 指标 | 1 命令 | 已工程化 |
| MCP 工具 | wls_test_* | 17 个 | 已工程化 |
| 单元测试 | 包内回归 | 179 个 | 全部通过 |

---

## 十五、最终统一口径

> 测试工程化不是要求每个人写得更多脚本，而是通过契约生成让用例不再手工转录，通过确定性审计让反模式无处藏身，通过真实执行引擎让安全缺口精确到字段，通过统一报告和质量门让上线判定有数可依。

从本次宣贯起，测试侧共同遵循：

> 规范基线看 11 条标准，工程实现以 `wl-skills-test` 为准；用例从契约生成，脚本过审计，执行走引擎，判定看 gate；公共反模式归口公共包，业务特例必须显式评审；测试数据零污染，上线判定必留档。
