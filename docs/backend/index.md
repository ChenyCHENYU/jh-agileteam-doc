# 后端 — 概览 & 技术选型

<AuthorTag :authors="['YangTianGuang','DaiAn','ZhangXiang','ZhangJie','PanChaoYue']" />

::: tip ✅ 已落地
后端方向基于 **`@agile-team/wl-skills-bd`（v0.18.0）** 形成可安装、可验证、可回放的工程闭环，覆盖契约驱动生成、模块目录与精准上下文、配置分层与多环境、任务驱动、数据安全护栏、行为契约测试、生产保障、质量门与 MCP 全链路。
:::

## 技术栈

| 方向 | 团队基线 |
|---|---|
| 语言 | Java 8 |
| 框架 | Spring Boot 2 + jh4j-cloud 3.1 |
| ORM | MyBatis-Plus（继承 `JhBaseMapper<T>`）+ 原生 XML |
| 数据库 | MySQL（业务项目）/ Oracle（mdm-service 等主数据项目） |
| 缓存 | Redis（带 TTL / Redisson 锁） |
| 接口规范 | RESTful + **OpenAPI 3**（新代码统一；Swagger 2 存量保留） |
| 返回包装 | `ApiResult.success(msg, data)`，`code=2000` |
| 构建 | Maven |

## 版块内容

- [开发规范](./standards) — 命名、编程、性能、漏洞隐患四大类规范
- [Skills 集合](./skills/) — 后端 AI 工作流（`wl-skills-bd`，28 规范 + 12 Skill + 16 MCP）
