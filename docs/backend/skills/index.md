# 后端 Skill

<AuthorTag :authors="['YangTianGuang','ZhangXiang','DaiAn','ZhangJie','PanChaoYue']" />

::: tip � 骨架阶段
后端 Skills 包（`@agile-team/wl-skills-bd`，当前 v0.0.2）正在进行 PoC 验证，当前结构已定、内容持续完善中。
:::

## 概述

`wl-skills-bd` 是与前端 `wl-skills-kit` 镜像对称的**后端 AI Skills 模板包**，面向集团 Spring Boot + MyBatis-Plus + jh4j-cloud 体系，覆盖从接口设计到代码生成、数据库迁移、单测、规范审计的全链路。

> **三包协作关系**：`wl-skills-kit`（前端规范+Skills）· `wl-skills-ui`（视觉一致性）· `wl-skills-bd`（后端规范+Skills）**三包独立、契约对齐**，共同消费同一份 `api.md`。

## 五层架构

```
L0  契约层 (api.md)              前端 wl-skills-kit 已产出，前后端共同消费
L1  接口设计层 (api-design-be)   RESTful 路径 / DTO 字段映射 / 错误码
L2  代码骨架层 (codegen-be)      Controller / Service / Mapper
L3  数据层 (db-migration)        Entity / DDL / 回滚脚本（Oracle/MySQL）
L4  质量层 (test + audit + fix)  单测 / 集成测试 / 审计 / 修复
```

## 后端工作流 ①→⑩

```
① 前端 api.md（wl-skills-kit 产出）/ 产品 input-spec
         ↓
② api-design-be        接口设计审查（RESTful 命名、字段映射、错误码）
         ↓
③ entity-codegen       Entity / DTO / VO / Query 类生成
         ↓
④ service-codegen      Controller + Service + ServiceImpl + Mapper 接口
         ↓
⑤ mapper-xml-gen       XML 映射（动态条件 / 分页 / 批量 / 多表 join）
         ↓
⑥ db-migration         DDL + 回滚脚本（⚠️ 写库前强制人工确认）
         ↓
⑦ unit-test-gen        单元测试 + 集成测试
         ↓
⑧ convention-audit-be  后端规范审计（分层 / 命名 / 异常 / 事务 / 日志）
         ↓
⑨ code-fix-be          可选自动修复 → 复扫确认
         ↓
⑩ 输出：可部署服务 + 测试套件 + DDL 脚本 + 审计报告
```

## 9 个核心 Skill

| # | Skill | 触发词 | 状态 |
|---|-------|--------|------|
| ① | `api-design-be` | 接口设计 / 接口审查 / RESTful 校验 / 字段映射 / 错误码 | 🟡 骨架 |
| ② | `entity-codegen` | 生成实体 / Entity / DTO / VO / Query / 数据模型 | 🟡 骨架 |
| ③ | `service-codegen` | 生成服务 / Controller / 写后端 / 后端代码生成 / 按 api.md 生成 | 🟡 骨架 |
| ④ | `mapper-xml-gen` | Mapper XML / SQL / 动态查询 / 分页 SQL / 批量 SQL | 🟡 骨架 |
| ⑤ | `convention-audit-be` | 后端审计 / 后端规范检查 / 分层违规 / 后端体检 | 🟡 骨架 |
| ⑥ | `business-doc-extract-be` | 后端业务沉淀 / 接口语义整理 / 领域模型提取 | 🟡 骨架 |
| ⑦ | `db-migration` | DDL / 建表 / 改表 / 加字段 / 迁移脚本 / 回滚脚本 | 🟡 骨架 |
| ⑧ | `unit-test-gen` | 单元测试 / 集成测试 / 接口测试 / 单测生成 | 🟡 骨架 |
| ⑨ | `code-fix-be` | 修复后端偏差 / 后端 code fix / 按审计报告整改 | 🟡 骨架 |

## 14 条后端规范

| # | 规范 | 说明 |
|---|------|------|
| 01 | 工具链 | Maven / JDK 1.8 / Lombok 检查 |
| 02 | 项目结构 | 包结构 + 分层职责 + 禁止跨层 |
| 03 | 命名 | 类 / 方法 / 字段 / 包 / 常量 / 路径 |
| 04 | Controller | Controller 模板 + 权限注解 + 返回值 |
| 05 | Service | Service 接口 + 实现 + 状态变更模板 |
| 06 | Mapper XML | 禁止 `SELECT *` + 动态条件 + 分页 + foreach |
| 07 | Entity/DTO/VO | 审计字段 + DTO 校验 + Query |
| 08 | 异常处理 | 全局异常 + Assert + 业务码 |
| 09 | 日志 | SLF4J 占位符 + 级别 + 敏感信息脱敏 |
| 10 | 事务 | `@Transactional` 粒度 + 禁止事项 |
| 11 | 安全权限 | 权限注解 + 租户隔离 |
| 12 | 数据库 DDL | 建表规范 + 索引 + 序列 + 字段命名 |
| 13 | API 文档 | Swagger `@Api` / `@ApiOperation` |
| 14 | 测试覆盖 | 单测覆盖红线 + Mock 规范 |

## 技术栈基线

| 类别 | 团队基线 |
|------|---------|
| JDK | 1.8 |
| 框架 | Spring Boot + jh4j-cloud 3.x |
| ORM | MyBatis-Plus（继承 `JhBaseMapper<T>`）+ 原生 XML |
| 数据库 | MySQL（业务项目）/ Oracle（mdm-service 等主数据项目）|
| 分页 | `JhPage`（jh4j-cloud 提供）|
| 返回包装 | `ApiResult.success(msg, data)` |
| 权限 | Spring Security + `@PreAuthorize("@pms.hasPermission(x)")` |
| 工具库 | Hutool 5.x · Apache Commons · FastJSON 2.0 · Lombok |
| API 文档 | Springfox Swagger |

## 演进路线

| 阶段 | 目标 | 状态 |
|------|------|------|
| v0.0.2 | 骨架完善：14 条 standards + 9 个 SKILL 骨架 + pipeline | ✅ 完成 |
| v0.1.x | PoC：跑通 mdm-service 一个真实模块 ②→⑨ 全链路 | 🎯 进行中 |
| v0.2.x | CLI `init/update/check/diff/doctor` 实现 + npm 发布 | 🔜 规划中 |
| v0.3.x | MCP 集成（DB schema / Git diff / 飞书任务）| 🔜 规划中 |
