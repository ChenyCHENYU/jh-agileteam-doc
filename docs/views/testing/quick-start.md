# 测试快速上手

> 30 分钟跑通"安装 → 接入 → 用例生成 → 审计 → 深度执行 → 质量门"最小闭环。前置：Node.js ≥ 20、pnpm。

---

## 一、安装与体检（3 分钟）

```bash
npx @agile-team/wl-skills-test init     # 11 规范 + 13 Skill + 18 MCP + 编辑器配置
npx @agile-team/wl-skills-test doctor   # Node / Playwright / JMeter / 目录结构体检
```

`doctor` 报缺什么装什么：Playwright 浏览器 `pnpm dlx playwright install`；JMeter 5.6.3 配置进 PATH。

---

## 二、接入与用例生成（8 分钟）

### 有上游契约（kit / bd）

```bash
# CRUD 用例矩阵
npx @agile-team/wl-skills-test run-gen --contract ./wl-contract.json
# E2E 工程（7 层编排）
npx @agile-team/wl-skills-test run-gen --contract ./page-spec.json --type playwright
```

### 没有契约（v0.21.0 新路径：从后端 Swagger 直接提取）

```bash
# 1. 接入探测：项目形态 + 接口来源 + 生成 wl-test.config.json 骨架 + 输出给 AI 的接入指令
npx @agile-team/wl-skills-test setup --base-url http://localhost:8080

# 2. OpenAPI/Swagger → 契约（required/maxLength/枚举全保留，五操作自动映射）
npx @agile-team/wl-skills-test gen-contract --swagger http://localhost:8080/v3/api-docs

# 3. 契约校验（error 级阻断，不过不往下走）
npx @agile-team/wl-skills-test validate-contract ./wl-contract.json

# 4. 生成用例
npx @agile-team/wl-skills-test run-gen --contract ./wl-contract.json
```

或者对 AI 说一句"**接入测试**"——`test-onboarding` Skill 按六步 SOP 编排以上全部步骤。

---

## 三、审计与修复（3 分钟）

```bash
npx @agile-team/wl-skills-test audit --target ./tests/    # T1-T25 确定性扫描
npx @agile-team/wl-skills-test fix  --target ./tests/     # F1-F6 自动修复反模式
```

零 error 是合入底线；E2E 工程另加 `e2e-check`（归属闭环 + 安全标记校验）。**fix 后自动复验**：对修改文件 re-audit 并给出"剩余致命/错误"计数（v0.20.0+），修没修干净不再无人知晓。

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
