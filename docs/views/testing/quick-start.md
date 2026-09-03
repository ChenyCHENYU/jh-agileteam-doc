# 测试快速上手

> 30 分钟跑通"安装 → 用例生成 → 审计 → 深度执行 → 质量门"最小闭环。前置：Node.js ≥ 20、pnpm。

---

## 一、安装与体检（3 分钟）

```bash
npx @agile-team/wl-skills-test init     # 11 规范 + 12 Skill + 17 MCP + 编辑器配置
npx @agile-team/wl-skills-test doctor   # Node / Playwright / JMeter / 浏览器通道体检
```

`doctor` 报缺什么装什么：Playwright 浏览器 `pnpm dlx playwright install`；JMeter 5.6.3 配置进 PATH。

---

## 二、从契约生成用例（5 分钟）

有上游契约（kit `wl-api-contract.json` / bd `wl-contract.json` / kit `page-spec.json`）时，**不要人工转录接口字段**：

```bash
# CRUD 用例矩阵（接口契约）
npx @agile-team/wl-skills-test run-gen --contract ./wl-contract.json

# 字段级细粒度（v0.11.0：必填置空/超长/边界/非法枚举/注入探测，P0~P3 标注）
npx @agile-team/wl-skills-test run-gen --granularity field

# E2E 工程（从 page-spec，7 层编排）
npx @agile-team/wl-skills-test run-gen --contract ./page-spec.json --type playwright
```

没有契约也能用：把需求文档给 AI，`test-plan-generator` → `test-case-generator` 照样出方案与用例。

---

## 三、审计生成物（3 分钟）

```bash
npx @agile-team/wl-skills-test audit --target ./tests/    # T1-T25 确定性扫描
npx @agile-team/wl-skills-test fix  --target ./tests/     # F1-F6 自动修复反模式
```

零 error 是合入底线；E2E 工程另加 `e2e-check`（归属闭环 + 安全标记校验）。

---

## 四、深度执行（10 分钟）

```bash
# 深度接口测试：DAG 编排 + 四层断言 + 负例 + 权限双账号 + 契约漂移
npx @agile-team/wl-skills-test run-api --contract ./wl-contract.json \
  --base-url http://localhost:8080 --token-no-perm --dict-file ./dict.json

# 自动化 + 性能
npx @agile-team/wl-skills-test run-playwright --test-dir ./tests/
npx @agile-team/wl-skills-test run-jmeter --jmx ./perf.jmx --threads 200
```

报告统一落 `test-reports/`（`api-报告.md` + `api-result.json`，含报文快照与失败定位）。

---

## 五、质量门与上线判定（2 分钟）

```bash
npx @agile-team/wl-skills-test report --trend        # 聚合报告 + 最近 5 次趋势
npx @agile-team/wl-skills-test gate                  # 审计+e2e-check+冒烟+DI+性能，任一失败 exit 1
npx @agile-team/wl-skills-test gate --webhook <url>  # 结果推送企微/钉钉
```

上线判定 4 指标：**DI 密度 < 0.3 · 致命关闭率 100% · 严重关闭率 100% · 模块收敛 ≤ 20%**。

---

## 下一步

- [使用指南](/views/testing/usage-guide) — 各命令完整参数
- [测试规范](/views/testing/standards/) — 11 条规范详解
- [度量与质量门](/views/testing/metrics) — DI 指标口径与指标解读
- [自动化 E2E 工程化](/views/testing/automation#e2e-工程化生成-v0-8-0-run-gen-type-e2e) — 7 层编排细节
