# 后端 — 概览 & 技术选型

<AuthorTag :authors="['YangTianGuang','DaiAn','ZhangXiang','ZhangJie','PanChaoYue']" />

::: tip v0.18.2 已落地
后端方向基于 **`@agile-team/wl-skills-bd`（v0.18.2）** 形成可安装、可验证、可回放的工程闭环，覆盖契约驱动生成、模块目录与精准上下文、配置分层与多环境、任务驱动、数据安全护栏、行为契约测试、生产保障、质量门与 MCP 全链路。
:::

---

## 项目简介

后端业务微服务标准模板基于 **Java 8 + Spring Boot 2 + jh4j-cloud 3.1**，采用 MyBatis-Plus + 原生 XML 双轨 ORM。每个微服务对应一个业务领域，独立 Git 仓库、独立部署，通过 Nacos 服务注册、Feign 远程调用、RocketMQ 异步消息组成分布式系统。

```bash
# 安装后端 Skills（Node.js >= 22）
npx @agile-team/wl-skills-bd init
npx @agile-team/wl-skills-bd doctor
```

---

## 技术栈

| 分类 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 语言 | Java | 1.8 | 团队统一基线 |
| 框架 | Spring Boot + jh4j-cloud | 2.x + 3.1 | 微服务基础框架 |
| ORM | MyBatis-Plus | — | 继承 `JhBaseMapper<T>` + 原生 XML |
| 数据库 | MySQL / Oracle | — | MySQL（业务）/ Oracle（主数据） |
| 缓存 | Redis | — | 带 TTL + Redisson 分布式锁 |
| 消息队列 | RocketMQ | — | 异步解耦 / 削峰 |
| 服务注册 | Nacos | — | 服务发现 + 动态配置 |
| 接口规范 | OpenAPI 3 | — | 新代码统一；Swagger 2 存量保留 |
| 返回包装 | ApiResult | — | `code=2000`，`{code, message, data}` |
| 权限 | Spring Security | — | `@PreAuthorize("@pms.hasPermission(x)")` |
| 工具库 | Hutool / Commons / Lombok | — | 5.x / FastJSON 2.0 |
| 构建 | Maven | — | `mvn verify -Pwl-quality` |

---

## 核心能力（v0.18.2）

| 维度 | 数量 | 说明 |
|------|:----:|------|
| AI Skill | 12 | 契约设计→代码生成→DDL→单测→审计→修复 全链路 |
| MCP 工具 | 16 | wls_be_* 前缀，全部实现 |
| 后端规范 | 29 | B1~B30 确定性扫描（工程基线→安全护栏→稳定性→生产保障） |
| Java 质量门 | 8 | J1~J8（ArchUnit/Checkstyle/PMD/SpotBugs/Spotless/P3C/JaCoCo） |
| 代码模板 | 16 | Entity/DTO/VO/Controller/Service/Mapper XML/DDL/Flyway/Test |
| 任务驱动 | 8 种 | new-service/add-api/add-field/add-business-cmd/fix-bug/refactor/audit/config-op |

---

## 开发模式

| 场景 | 工作流 | 说明 |
|------|--------|------|
| 新开发完整服务 | 全链路 | 契约→生成17产物→质量门→审计 |
| 加接口 | add-api | 增量契约→只生成变化文件→子集审计 |
| 改 Bug | fix-bug | 审计定位→safe-fix（B3/B5）→复扫确认 |
| 配置管理 | config-op | 三层配置→体检→环境迁移→故障诊断 |

详见 [使用指南](./skills/usage-guide)。

---

## AI Skills 流水线

```
① api-design-be → ② entity-codegen → ③ service-codegen → ④ mapper-xml-gen
      ↓                                                              ↓
⑤ db-migration（DDL+Flyway）←───────────────────────────────────── ⑦ unit-test-gen
      ↓                                                              ↓
⑥ convention-audit-be（B1-B30 + J1-J8）←───────────────────────── ⑧ code-fix-be
```

详见 [AI Skills 流水线](./skills/skill-pipeline)。

---

## 版块内容

| 内容 | 入口 | 说明 |
|------|------|------|
| [开发规范](./standards) | 44 条规范 | 命名 / 编程 / 性能 / 漏洞隐患 四大类 |
| [Skills 集合](./skills/) | 12 Skill + 16 MCP | 契约驱动代码生成全链路 |
| [AI Skills 流水线](./skills/skill-pipeline) | 12 Skill 衔接 | 生成链→数据链→审计链 + 任务驱动 |
| [使用指南](./skills/usage-guide) | 5 种工作流 | 新开发/加接口/改Bug/配置/模块目录 |

---

## 伴生工程

- 前端 Skills：[wl-skills-kit](/frontend/pc/skills/)
- 前端视觉：[wl-skills-ui](/views/styling/wl-skills-ui)
- 测试工程：[wl-skills-test](/views/testing/)
