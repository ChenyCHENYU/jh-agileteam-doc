# 测试阶段工作流

> 设计与代码之后，测试不是"再检查一遍"，而是**消费双方契约做真实执行**——用例从契约生成、深度断言靠引擎跑、上线判定看数据。

## 阶段流程

```text
上游契约（三源任一）                生成                      执行与判定
─────────────────        ─────────────────        ─────────────────────
kit wl-api-contract  ─┐                          run-api 深度执行
bd  wl-contract.json ─┼──► run-gen ──► 用例矩阵   （DAG + 四层断言 +
kit page-spec.json   ─┘        │      + 细粒度      负例 + 权限 + 漂移）
                              │                    run-playwright / run-jmeter
没有契约？                      ▼                          │
setup 探测 + gen-contract   audit T1-T25                 ▼
（OpenAPI → 契约）          fix F1-F6 + 复验        gate 上线判定
                                                  （审计+e2e+冒烟+DI+性能）
```

## 关键命令

```bash
# 生成：有契约直连，没契约从后端 Swagger 提取（v0.21+）
npx @agile-team/wl-skills-test run-gen --contract ./wl-contract.json
npx @agile-team/wl-skills-test setup --base-url http://localhost:8080   # 探测+引导
npx @agile-team/wl-skills-test gen-contract --swagger http://localhost:8080/v3/api-docs

# 审计与修复（T1-T25 / F1-F6，修复后强制复验）
npx @agile-team/wl-skills-test audit --target ./tests/
npx @agile-team/wl-skills-test fix  --target ./tests/

# 深度执行与上线判定
npx @agile-team/wl-skills-test run-api --contract ./wl-contract.json --base-url http://localhost:8080
npx @agile-team/wl-skills-test gate
```

## 在全链路中的位置

| 输入 | 来源 | 输出 | 去向 |
|------|------|------|------|
| wl-contract / api-contract / page-spec | bd / kit | 用例矩阵 + 细粒度用例 | 测试资产 + `plan-input.json`（AI 写计划的数据侧） |
| 双方代码 | 前端 / 后端 | 审计报告 / 执行报告 / 质量分 | CI 卡点 + 飞书/企微推送 |
| 契约变更 | 任意方 | `diff` 受影响用例清单 | 回归范围决策 |

## 深入阅读

命令全参、11 条规范、DI 指标口径与指标解读指南，见 **[测试工程板块](/views/testing/)**（[快速上手](/views/testing/quick-start) · [度量与质量门](/views/testing/metrics)）。
