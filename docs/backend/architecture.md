# 后端架构设计

<AuthorTag :authors="['YangTianGuang','CHENY']" />

> 以 wl-produce（生产域）为实例拆解 jh4j-cloud 微服务的模块划分、服务接入三类注册、代码分层与平台扩展点。规范约束见[开发规范](/backend/standards)，机器门禁见 [bd Skills](/backend/skills/)。

---

## 一、微服务拆分模型

后端按**业务域**拆分服务，每个服务独立 Git 仓库、独立部署。以 wl-produce 为例：

| 模块 | 说明 |
|------|------|
| `wl-produce-base` | jh4j-cloud 样例基座（新服务从它起步） |
| `wl-produce-pb` / `pc` / `pj` / `pm` / `pz` | 按业务域拆分的子服务（命名 = 业务域缩写） |
| `wl-produce-pl` | 炼钢服务（当前主力，bd review canary 试点模块） |

每个子服务内部再分两层：

```text
wl-produce-pl/
├── wl-produce-pl-entity/     ← API/实体子模块（供其他服务依赖，不含实现）
└── wl-produce-pl-service/    ← 可启动子模块（Controller/Service/Mapper）
```

**拆分约定**：实体与实现分离（跨服务只依赖 entity 包）；应用名 = Maven 模块名；根包 `com.jhict.produce.<域>`；Gateway 外部前缀 = 域缩写（如 `/pl`），服务内部路径**不带**前缀。

---

## 二、服务接入的三类"注册"

新服务从前端可访问，要过三道互相独立、不可替代的注册（缺任何一道的表现见下表）——这是 `service.md` 固化的接入检查清单核心：

| 层次 | 事实源 | 作用 | 缺失时的表现 |
|------|--------|------|-------------|
| 平台服务目录 | 系统字典 `serviceInfo` | 告诉平台服务名、Java 包和 URL 前缀 | 模型、低代码或平台服务选择器找不到服务 |
| 服务发现 | Nacos Service Discovery | 记录运行实例的 IP、端口、健康状态 | Gateway 用 `lb://` 找不到健康实例 |
| 流量路由 | Nacos `jh4j-cloud-gateway-{env}.yml` | 把外部前缀转发到目标服务 | 请求无法由 Gateway 命中目标服务 |

> 成功读取 Nacos 配置 ≠ 服务已注册；出现在 Nacos 列表 ≠ Gateway 已有 `/pl/**` 路由。

### 炼钢服务实例卡（wl-produce-pl）

| 项 | 值 |
|----|-----|
| 可启动子模块 | `wl-produce-pl-service` |
| 启动类 | `com.jhict.produce.pl.WlProducePlApplication` |
| Gateway 前缀 | `/pl`（内部路径不带，如 `/base-data/material/queryPage`） |
| 端口 / Nacos Group | `10301` / `JH4J` |
| 数据源 DataId | `datasource-mysql-cx-sit.yml`（bootstrap.yml 拼接） |

完整接入步骤见 `wl-produce/docs/service.md`。

---

## 三、技术栈基线与代码分层

| 类别 | 基线 |
|------|------|
| 运行时 | Java 8 · Spring Boot 2 · jh4j-cloud 3.1 |
| ORM | MyBatis-Plus（继承 `JhBaseMapper<T>`）+ 原生 XML |
| 注册/配置 | Nacos（服务发现 + 配置中心，5 环境矩阵 dev/sit/uat/pre/prod） |
| 文档 | 新代码统一 OpenAPI 3（springdoc + Knife4j） |
| 包管理 | 父 BOM 统一管版本（业务模块禁止私锁，B27） |

**分层强制**：Controller → 直接 Service → Mapper，不设 `IService + ServiceImpl` 双层；Controller 直调 Mapper 由 J1（ArchUnit）在构建期阻断。租户一律取自 `AuthUtil`，SQL 显式 `COMPANY_ID`（除非存在 doctor 可验证的统一拦截器证据）。

---

## 四、平台扩展点机制（B28）

jh4j-cloud 平台已提供的 Spring 扩展点（如 `MetaObjectHandler` 的 `insertFill / updateFill`），**业务侧不得复刻同类 Bean**：

1. 同类 Bean 必须唯一：业务自定义实现须显式声明并**委托平台实现**（先执行平台逻辑再叠加业务逻辑）；
2. 每个扩展点 Bean 必须配**最小 Spring 容器装配测试**作为装配证据——只直接 new 业务类的单测不算数；
3. 平台能做的事（字段自动填充、软删过滤、分页默认值）由平台做，业务代码不重复实现。

> 这条规则解决的真实事故：两处 `MetaObjectHandler` 同时存在时，注入顺序不确定导致填充行为漂移。B28 让它成为启动前可检出的确定性错误。

---

## 五、治理基建在架构中的位置

| 基建 | 作用 | 入口 |
|------|------|------|
| Catalog 模块目录 | 模块级增量扫描、身份去重、重复契约/路由/Flyway 版本阻断 | [project-context-governance](/backend/skills/) |
| review 变更审查 | Git 变更 + B 规则 + 基线 + 豁免 + 断言 + 供应链 + 覆盖率的统一门禁 | [convention-audit-be](/backend/skills/convention-audit-be) |
| 数据库事实源 | docs/db-spec ↔ 契约 ↔ Flyway ↔ 线上快照四方对账 | [数据库治理实操](/backend/skills/db-governance) |
| 集成适配器 | 项目声明真实 MQ/HTTP 封装，不假设平台 | [integration-adapter-be](/backend/skills/integration-adapter-be) |
