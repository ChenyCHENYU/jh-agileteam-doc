# 测试工程技能包（wl-skills-test）

> `@agile-team/wl-skills-test` v0.5.0 — 11 条测试规范 · 12 个 AI Skill · 12 个 MCP 工具 · 20 条审计规则 · 契约驱动生成

::: tip npm 已发布
```bash
npx @agile-team/wl-skills-test        # 安装
npx @agile-team/wl-skills-test doctor # 体检
```
[npm 包地址](https://www.npmjs.com/package/@agile-team/wl-skills-test) · [GitHub](https://github.com/ChenyCHENYU/wl-skills-test)
:::

---

## 定位

五包生态的**第五个包**，补齐测试验证环节，形成设计→开发→测试的完整闭环：

```
design(产品设计) → kit(前端代码) → ui(视觉对齐) → bd(后端代码) → test(测试验证)
```

**独立可用**：不依赖其他包也能从需求文档独立工作。联动只是增强（从契约自动生成用例），不是前置条件。

---

## 核心能力

| 维度 | 数量 | 说明 |
|------|:----:|------|
| 测试规范 | 11 | 对齐在线 QC 流程规范（01-流程 ~ 11-数据安全） |
| AI Skill | 12 | 功能链 9（方案/场景/用例/评审/冒烟/执行/脚本/规则/质量）+ 性能链 3 |
| MCP 工具 | 12 | wls_test_* 前缀，全部实现并有测试覆盖 |
| 审计规则 | 20 | T1-T20 确定性扫描器（Playwright/JMeter/用例/覆盖率） |
| 自动修复 | 6 | F1-F6（v-deep/beforeEach/waitForTimeout/硬编码/afterEach/测试名） |
| 执行器 | 3 | API 接口测试 + Playwright 自动化 + JMeter 性能 |
| CLI 命令 | 11 | init/update/doctor/validate/run-gen/audit/fix/run-api/run-playwright/run-jmeter/clean |
| 单元测试 | 48 | 全部通过 |

---

## 12 个 Skill 流水线

### 功能测试链（9 个）

| 步骤 | Skill | 产出 |
|:----:|-------|------|
| ① | test-plan-generator | 测试方案（7 章标准化） |
| ② | test-scenario-analyzer | 业务场景清单（10 类全覆盖） |
| ③ | test-case-generator | 功能+流程用例（P0~P3） |
| ④ | test-case-reviewer | 5 维评审报告 |
| ⑤ | smoke-test-selector | 冒烟套件（≤8/15/25） |
| ⑥ | smoke-test-executor | 冒烟执行报告 |
| ⑦ | test-script-generator | Playwright 脚本 |
| ⑧ | universal-test-rules | 自动化规则基座 |
| ⑨ | test-quality-analyzer | DI 质量报告 + 上线判定 |

### 性能测试链（3 个）

| 步骤 | Skill | 产出 |
|:----:|-------|------|
| ⑩ | perf-plan-generator | 性能方案（三场景+SLA） |
| ⑪ | perf-script-generator | JMeter jmx 脚本 |
| ⑫ | perf-report-analyzer | 性能报告（瓶颈诊断） |

---

## 审计引擎（T1-T20）

对标 kit R1-R16 / bd B1-B29 / ui R001-R039 的确定性规则扫描器：

| 规则 | 对象 | 检测内容 |
|------|------|---------|
| T1-T5, T12 | Playwright | beforeEach 缺失/硬编码 URL/缺少断言/测试名/数据清理/硬等待 |
| T6-T9, T13-T18 | JMeter | 聚合报告/ConfigTestElement 致命坑/SteppingThreadGroup/CSV/LoopController/Header/SLA/PerfMon/ramp |
| T10-T11, T19-T20 | 用例 | P0 覆盖/预期结果/数量不足/异常场景缺失 |

```bash
# 审计测试代码
npx @agile-team/wl-skills-test audit --target ./tests/

# 自动修复反模式
npx @agile-team/wl-skills-test fix --target ./tests/
```

---

## 执行能力（五包中唯一）

| 执行器 | 命令 | 说明 |
|--------|------|------|
| API 接口测试 | `run-api` | 从契约自动发 HTTP 请求 + 冒烟报告 |
| Playwright | `run-playwright` | 调用 `playwright test` + 解析 passed/failed |
| JMeter | `run-jmeter` | 调用 `jmeter -n -t` + 解析 jtl（P50/P95/P99/错误率/SLA） |

---

## DI 质量门（CI 集成）

```bash
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
