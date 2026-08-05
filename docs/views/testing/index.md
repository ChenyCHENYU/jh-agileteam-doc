# 测试工程技能包（wl-skills-test）

<AuthorTag :authors="['ChangXing','CHENY']" />

::: tip npm 已发布 v0.5.0
```bash
npx @agile-team/wl-skills-test        # 安装（11 规范 + 12 Skill + 模板）
npx @agile-team/wl-skills-test doctor # 环境体检
npx @agile-team/wl-skills-test audit  # 审计测试代码（T1-T20）
```
[npm 包地址](https://www.npmjs.com/package/@agile-team/wl-skills-test) · [GitHub](https://github.com/ChenyCHENYU/wl-skills-test) · 作者：常兴、杨晨誉
:::

---

## 定位

`@agile-team/wl-skills-test` 是五包生态的**第五个包**，补齐测试验证环节，形成设计→开发→测试的完整闭环：

```
design(产品设计) → kit(前端代码) → ui(视觉对齐) → bd(后端代码) → test(测试验证)
     ↓                ↓                               ↓              ↑
  需求文档      page-spec/api.md              wl-contract.json   消费上游契约
                                                   +                 → 生成用例
                                             ServiceTest.java         → 自动化脚本
                                                                      → 执行 + 质量评估
```

**独立可用**：不依赖其他包也能从需求文档独立工作。联动只是增强（从契约自动生成用例），不是前置条件。

---

## 核心能力（v0.5.0）

| 维度 | 数量 | 说明 |
|------|:----:|------|
| 测试规范 | 11 | 对齐在线 QC 流程规范（01-流程 ~ 11-数据安全） |
| AI Skill | 12 | 功能链 9 + 性能链 3 |
| MCP 工具 | 12 | wls_test_* 前缀，全部实现并有测试覆盖 |
| 审计规则 | 20 | T1-T20 确定性扫描器（Playwright/JMeter/用例/覆盖率） |
| 自动修复 | 6 | F1-F6（v-deep/beforeEach/waitForTimeout/硬编码/afterEach/测试名） |
| 执行器 | 3 | API 接口测试 + Playwright 自动化 + JMeter 性能 |
| CLI 命令 | 11 | init/update/doctor/validate/run-gen/audit/fix/run-api/run-playwright/run-jmeter/clean |
| 单元测试 | 48 | 全部通过 |

---

## 12 个 Skill 流水线

### 功能测试链（9 个）

```text
需求文档
  │
  ├─→ ① test-plan-generator ──── 测试方案（7 章标准化）
  ├─→ ② test-scenario-analyzer ── 业务场景（10 类全覆盖）
  └─→ ③ test-case-generator ───── 功能+流程用例（P0~P3）
        │
        ├─→ ④ test-case-reviewer ── 5 维评审（重读需求）
        ├─→ ⑤ smoke-test-selector ─ 冒烟套件（≤8/15/25）
        │     └─→ ⑥ smoke-test-executor ── 执行+报告
        ├─→ ⑦ test-script-generator ─ Playwright 脚本
        │     └─→ ⑧ universal-test-rules ── 自动化规则基座
        └─→ ⑨ test-quality-analyzer ── DI 质量评估+上线判定
```

| 步骤 | Skill | 用途 | 关键能力 |
|:----:|-------|------|---------|
| ① | test-plan-generator | 测试方案 | 自动读取需求/详设，输出 7 步标准测试方案 |
| ② | test-scenario-analyzer | 场景分析 | 10 类场景（主流程/分支/异常/权限/状态机/回滚/跨周期/批量/多源） |
| ③ | test-case-generator | 用例生成 | 等价类/边界值/场景法/决策表，P0-P3 分级 |
| ④ | test-case-reviewer | 用例评审 | 5 维度：业务覆盖/规范符合/可执行性/数据完整性/边界异常 |
| ⑤ | smoke-test-selector | 冒烟筛选 | 纳入/排除规则、定量套件、可追溯性 |
| ⑥ | smoke-test-executor | 冒烟执行 | 通过/失败判定、重试逻辑、阻断检测 |
| ⑦ | test-script-generator | Playwright 脚本 | 元素识别、动作模式、等待策略、断言标准 |
| ⑧ | universal-test-rules | 通用规则 | 测试流程/断言/异常处理/页面闭环/数据生命周期 |
| ⑨ | test-quality-analyzer | 质量评估 | DI 缺陷分析、模块级通过率、多轮趋势、go/no-go |

### 性能测试链（3 个）

| 步骤 | Skill | 用途 | 关键能力 |
|:----:|-------|------|---------|
| ⑩ | perf-plan-generator | 性能方案 | 场景设计、梯度并发策略、SLA 阈值、环境与监控 |
| ⑪ | perf-script-generator | JMeter 脚本 | .jmx + 参数化 CSV + CLI 命令，含登录鉴权/Token/断言 |
| ⑫ | perf-report-analyzer | 性能报告 | 解析 jtl/监控 CSV，瓶颈诊断、优化建议、3 版本趋势对比 |

---

## 审计引擎（T1-T20）

对标 kit R1-R16 / bd B1-B29 / ui R001-R039 的**确定性规则扫描器**（不靠 AI 自觉，脚本直接检测）：

| 规则范围 | 对象 | 检测内容 |
|---------|------|---------|
| T1-T5, T12 | Playwright | beforeEach 缺失 / 硬编码 URL / 缺少断言 / 测试名 / 数据清理 / 硬等待 |
| T6-T9, T13-T18 | JMeter | 聚合报告 / ConfigTestElement 致命坑 / SteppingThreadGroup / CSV / LoopController / Header / SLA / PerfMon / ramp |
| T10-T11, T19-T20 | 用例 | P0 覆盖 / 预期结果 / 数量不足 / 异常场景缺失 |

```bash
# 审计测试代码
npx @agile-team/wl-skills-test audit --target ./tests/

# 自动修复反模式（F1-F6）
npx @agile-team/wl-skills-test fix --target ./tests/
```

---

## 执行能力（五包中唯一）

| 执行器 | 命令 | 说明 |
|--------|------|------|
| API 接口测试 | `run-api` | 从契约自动发 HTTP 请求 + 冒烟报告 |
| Playwright | `run-playwright` | 调用 `playwright test` + 解析 passed/failed/skipped |
| JMeter | `run-jmeter` | 调用 `jmeter -n -t` + 解析 jtl（P50/P95/P99/错误率/SLA） |

```bash
# 执行 API 接口测试
npx @agile-team/wl-skills-test run-api --contract ./wl-contract.json --base-url http://localhost:8080

# 执行 Playwright 自动化
npx @agile-team/wl-skills-test run-playwright --test-dir ./tests/

# 执行 JMeter 性能测试
npx @agile-team/wl-skills-test run-jmeter --jmx ./perf-test.jmx --threads 200
```

---

## DI 质量门（CI 集成）

```bash
# CI 中运行质量门（退出码 0=通过 / 1=阻断）
node quality-gate.js --defects defects.json --cases 150 --audit-dir ./tests/
```

4 指标上线判定：DI 密度 < 0.3 · 致命关闭率 100% · 严重关闭率 100% · 模块收敛 ≤20%

---

## 契约驱动

| 契约来源 | 格式 | 自动生成 |
|---------|------|---------|
| kit | `wl-api-contract.json` | CRUD 用例矩阵 + 权限 + 必填校验 |
| bd | `wl-contract.json` | 5 标准操作 + customOperations + 必填 |
| kit | `page-spec.json` | 页面 CRUD 推断 + Playwright 选择器 |

```bash
npx @agile-team/wl-skills-test run-gen --contract ./wl-contract.json
npx @agile-team/wl-skills-test run-gen --contract ./page-spec.json --type playwright
npx @agile-team/wl-skills-test run-gen --contract ./wl-contract.json --type jmeter --threads 200
```

---

## 五包能力对标

| 能力维度 | design | kit | ui | bd | **test** |
|---------|:------:|:---:|:--:|:--:|:--------:|
| 版本 | v0.8.0 | v2.15.0 | v1.9.10 | v0.18.0 | **v0.5.0** |
| 审计规则 | — | R1-R16 | R001-R039 | B1-B29 | **T1-T20** |
| 自动修复 | — | F1-F5 | 12 条 | B3/B5 | **F1-F6** |
| 执行能力 | ❌ | ❌ | ❌ | ❌ | **✅ API+PW+JMeter** |
| MCP 工具 | 0 | 23 | 10 | 16 | **12** |

---

## 详细 Skill 文档

- [功能测试](./functional) — 测试计划 / 场景分析 / 用例生成 / 评审 / 质量评估
- [自动化测试](./automation) — Playwright 脚本 / 通用规则 / 冒烟筛选与执行
- [性能测试](./performance) — 压测方案 / JMeter 脚本 / 报告分析
