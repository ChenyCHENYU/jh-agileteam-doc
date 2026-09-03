# 测试 Skills 使用指南

<AuthorTag author="ChangXing" />

> `@agile-team/wl-skills-test` v0.21.0 — 从安装到日常使用的完整指南。

---

## 安装与初始化

```bash
# 安装（11 规范 + 12 Skill + 模板 + 9 编辑器配置）
npx @agile-team/wl-skills-test init

# 预览
npx @agile-team/wl-skills-test --dry-run

# 体检
npx @agile-team/wl-skills-test doctor
```

安装后，AI 编辑器自动识别 `.github/skills/` 下 12 个 Skill 和 `.github/standards/` 下 11 条规范。

---

## 工作流 A：从需求文档生成测试方案和用例

适用场景：需求评审后，快速输出测试方案和用例。

```
1. 需求文档 → test-plan-generator → 测试方案.md（7 章）
2. 需求文档 → test-scenario-analyzer → 业务场景清单（10 类）
3. 场景清单 → test-case-generator → 测试用例（P0~P3）
4. 测试用例 → test-case-reviewer → 评审报告
```

在 AI 编辑器中说：
- "生成测试方案" → 触发 test-plan-generator
- "分析业务场景" → 触发 test-scenario-analyzer
- "生成测试用例" → 触发 test-case-generator
- "评审测试用例" → 触发 test-case-reviewer

---

## 工作流 B：从契约自动生成用例（契约驱动）

适用场景：已有 kit/bd 机器契约，一键生成测试用例。

```bash
# 生成测试用例 Markdown
npx @agile-team/wl-skills-test run-gen --contract ./wl-contract.json

# 生成 Playwright 脚本
npx @agile-team/wl-skills-test run-gen --contract ./page-spec.json --type playwright

# 生成 JMeter jmx 脚本
npx @agile-team/wl-skills-test run-gen --contract ./wl-contract.json --type jmeter --threads 200
```

| 契约来源 | 格式 | 自动生成 |
|---------|------|---------|
| kit | `wl-api-contract.json` | CRUD 用例矩阵 + 权限 + 必填校验 |
| bd | `wl-contract.json` | 5 标准操作 + customOperations + 必填 |
| kit | `page-spec.json` | 页面 CRUD 推断 + Playwright 选择器 |

---

## 工作流 C：冒烟测试执行

适用场景：开发提测前，执行冒烟套件验证。

```bash
# 1. 筛选冒烟套件
#    在 AI 编辑器说"筛选冒烟用例" → smoke-test-selector

# 2. 执行 API 接口测试（从契约自动发请求）
npx @agile-team/wl-skills-test run-api --contract ./wl-contract.json --base-url http://localhost:8080

# 3. 执行 Playwright 自动化测试
npx @agile-team/wl-skills-test run-playwright --test-dir ./tests/

# 4. 执行 JMeter 性能测试
npx @agile-team/wl-skills-test run-jmeter --jmx ./perf-test.jmx --threads 200
```

run-api 执行后统一产出到 `test-reports/`（`api-报告.md` + `api-result.json`），含 DAG 步骤明细、四层断言结果、负例/权限/契约漂移章节与转测判定；二次执行后 `report --trend` 可查看历史趋势。

---

## 工作流 D：测试代码审计与修复

适用场景：检查已有测试代码的质量问题。

```bash
# 审计测试代码（T1-T25 确定性规则）
npx @agile-team/wl-skills-test audit --target ./tests/

# 自动修复反模式（F1-F6）
npx @agile-team/wl-skills-test fix --target ./tests/
```

| 修复项 | 说明 |
|--------|------|
| F1 | `::v-deep` → `:deep()` |
| F2 | 补齐 `beforeEach` 模板 |
| F3 | `waitForTimeout` → `waitForSelector` |
| F4 | 硬编码 URL → `BASE_URL` 环境变量 |
| F5 | 补齐 `afterEach` 数据清理 |
| F6 | 测试名规范化（加 should 前缀） |

### 示例（示意）：一轮审计 + 修复的典型输出

```text
$ wl-skills-test audit --target ./tests/
audit: 12 files scanned
  ✗ T2  hardcoded-url     tests/login.spec.ts:8     "http://172.28.99.172:9000"
  ✗ T12 hard-wait         tests/order.spec.ts:41     waitForTimeout(3000)
  ⚠ F6  test-name         tests/smoke.spec.ts:15     缺少 should 前缀
summary: 2 error / 1 warning

$ wl-skills-test fix --target ./tests/
fix: F3 修复 order.spec.ts:41（waitForTimeout → waitForSelector）
fix: F4 修复 login.spec.ts:8（URL → BASE_URL）
fix: F6 规范化 1 个测试名
复扫: 0 error / 0 warning ✅
```

> 输出为示意格式，实际以命令执行结果为准。error 未清零不进入合入。

---

## 工作流 E：DI 质量门（CI 集成）

适用场景：CI/CD 中卡门，阻断不合格的上线。

```bash
# CI 质量门（退出码 0=通过 / 1=阻断）
node quality-gate.js \
  --defects defects.json \
  --cases 150 \
  --audit-dir ./tests/
```

4 指标上线判定：

| # | 指标 | 阈值 |
|---|------|------|
| 1 | DI 密度 | < 0.3 |
| 2 | 致命缺陷关闭率 | 100% |
| 3 | 严重缺陷关闭率 | 100% |
| 4 | 最差模块缺陷收敛 | ≤20% |

---

## MCP 工具（18 个）

| 工具 | 用途 |
|------|------|
| `wls_test_standards` | 查询测试规范 |
| `wls_test_contract_read` | 读取 kit/bd 契约 |
| `wls_test_case_generate` | 生成测试用例（`granularity: "field"` 支持字段级细粒度） |
| `wls_test_smoke_select` | 筛选冒烟套件 |
| `wls_test_env_check` | 校验环境连通性 |
| `wls_test_quality_analyze` | DI 质量评估 |
| `wls_test_jmeter_validate` | 校验 JMeter jmx |
| `wls_test_audit` | 审计测试代码（T1-T25） |
| `wls_test_fix` | 自动修复反模式 |
| `wls_test_run_api` | 执行深度 API 测试（DAG + 四层断言 + 负例 + 契约漂移） |
| `wls_test_run_playwright` | 执行 Playwright |
| `wls_test_run_jmeter` | 执行 JMeter |
| `wls_test_e2e_generate` | 从 page-spec 生成 7 层 project 编排 E2E 工程（含工位/子表页签模板） |
| `wls_test_report_generate` | 聚合 test-reports/ 生成规范报告 + 上线判定（`--trend` 趋势） |
| `wls_test_e2e_check` | 对任意 E2E 工程独立执行归属闭环 + 静态安全扫描（CI 卡门） |
| `wls_test_dict_sync` | 拉取系统字典归一化为 dict.json（三形态自动识别） |
| `wls_test_gate` | 一键聚合质量门（审计 + e2e-check + 冒烟 + DI + 性能基线） |
| `wls_test_contract_diff` | 契约变更影响面：操作/字段级变更 + 受影响用例清单（内容哈希精确到条） |

---

## 五包协作

```
design(产品) → kit(前端) → ui(样式) → bd(后端) → test(测试)
                                              ↑
                              消费上游契约 → 生成用例 → 执行 → 质量评估
```

test 是五包中**唯一具备实际执行能力**的包（API/Playwright/JMeter 三种执行器）。
