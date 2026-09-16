# 后端团队

<AuthorTag :authors="['YangTianGuang','DaiAn','ZhangXiang','ZhangJie','PanChaoYue']" />

> 共享技术中心后端组：jh4j-cloud 微服务体系与 wl-skills-bd 工程闭环的建设方。

## 职责范围

| 方向 | 内容 |
|------|------|
| 微服务架构 | [架构设计](/backend/architecture)：七模块拆分、服务接入三类注册、平台扩展点机制 |
| 工程闭环 | [wl-skills-bd](/backend/skills/)：13 Skill / 17 MCP / 30 条规范 / B1~B31 + J1~J8 门禁 |
| 数据治理 | [数据库治理实操](/backend/skills/db-governance)：四方对账、执行账本、环境分级 |
| 外部集成 | [MES 三路对接](/backend/integration-mes)（QMS / L2 / MPS）与集成适配器治理 |
| 生产域落地 | wl-produce（炼钢等业务服务，bd review canary 试点） |

## 文档贡献

[后端快速上手](/backend/quick-start) · [规范详解 10 篇](/backend/standards/11-security-permission) · 5 个 Skill 独立页 · [MES 集成实战](/backend/integration-mes)

## 协作机制

- 代码从契约生成（三段式 planHash），偏差由 `validate` + `review run` 机器拦；
- 与前端通过 `wl-api-contract` 对齐（[契约驱动协作](/views/ai-workflow/fullstack-dev)），权限码经 `export-permissions` 流转；
- 数据库变更先文档后迁移，改名走豁免审批留痕。

---

- [业务团队](./business) · [前端团队](./)
