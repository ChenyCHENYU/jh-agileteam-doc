# 谛听小队
<AuthorTag :authors="['ChangXing']" />

> 测试验证环节的建设方：以 [wl-skills-test](/views/testing/) 补齐设计 → 开发 → 测试的完整闭环。

<TestTeamHero />

## 负责领域

| 方向 | 内容 |
|------|------|
| 功能测试 | [测试工程 Skills](/views/testing/)：测试方案 / 场景分析 / 用例生成（P0~P3）/ 用例评审 / 冒烟筛选与执行 |
| 自动化测试 | Playwright 脚本生成与执行、[通用自动化规则](/views/testing/automation)、T1~T25 确定性审计 |
| 性能测试 | JMeter 压测方案 / 脚本 / [报告分析](/views/testing/performance)，基线对比与劣化判定 |
| 质量门禁 | [gate 一键聚合质量门](/views/testing/metrics)：审计 + e2e-check + 冒烟 + DI + 性能基线，任一失败阻断 |
| 契约联动 | 消费 kit `wl-api-contract` / bd `wl-contract` 自动生成用例，[无契约也能开始](/views/testing/quick-start) |

## 文档贡献

[测试板块](/views/testing/)（快速上手 / 测试规范 / 度量与质量门 / 使用指南 / 功能·自动化·性能三链详解）。

## 协作机制

- 测试资产由 `wl-skills-test` 统一管理（`init` 安装、`audit` 审计、`gate` 卡门），规范随包发版；
- 上线判定以四指标口径为准（DI 密度 / 致命关闭率 / 严重关闭率 / 模块收敛），机器度量不靠口头汇报；
- 与前后端的契约对齐见 [契约驱动](/views/testing/#契约驱动)。
