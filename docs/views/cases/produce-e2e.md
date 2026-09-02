# 37 spec 的 E2E 工程化（wl-ui-produce）

> 案例②：手工回归不可持续 → 7 层 Playwright 编排；实战约束反推成 test 包能力。

## 数据面板

| 维度 | 数据 |
|------|------|
| 规模 | 37 个 spec · 7 个 project 编排 · 覆盖 steelmaking 32 页 |
| 编排 | auth-setup → round1-readonly → round1-detail → ui-contract → round2-controlled-write → business-flow-quarantine → cleanup |
| 红线 | 用例归属强校验（加载即断言）· page.route 拦截写请求 · 受控写入安全标记 · 高风险默认隔离 |
| 沉淀 | 归属校验 / 显式路由映射 / 选择器适配层 / 工位模板 → 固化为 `@agile-team/wl-skills-test` |
| 效率 | 待业务确认（替代手工回归时长） |

## 七层编排（每层只做一类事）

| project | 职责 |
|---------|------|
| auth-setup | 登录态准备（storageState 复用） |
| round1-readonly | 首轮只读：列头渲染 / 搜索收敛 / 字典翻译 |
| round1-detail | 详情页断言 |
| ui-contract | page.route 拦截写请求，断言端点 + payload（零污染） |
| round2-controlled-write | 受控真实写入（需安全标记） |
| business-flow-quarantine | 高风险业务流（默认 skip + 准入声明） |
| cleanup | 数据清理，回归零污染 |

## 踩坑与沉淀

| 坑 | 沉淀（test 包能力） |
|----|---------------------|
| 文件写了但从未被执行（假闭环） | 用例归属强校验，未归类/重复归属拒绝运行（`e2e-check`） |
| 路由推导与实际页面错配 | `--routes routes.json` 显式映射 + 双向一致性校验 |
| 换组件库全量改选择器 | 选择器适配层 `support/selectors.js`（`--ui element-plus\|steel\|ant-design`） |
| 写测试污染 SIT 数据 | ui-contract 拦截 + round2 隔离 + cleanup 兜底 |

## 可复现路径

```bash
npx @agile-team/wl-skills-test run-gen --contract ./page-spec.json --type e2e --routes ./routes.sit.json
npx @agile-team/wl-skills-test e2e-check --target ./e2e/
```

参考实现：`wl-ui-produce/e2e/`（37 spec + 3 篇配套文档：自动化测试指南 / 零污染核验清单 / 可视化运行方案）。
