# 25 · 配置分层与多环境管理（✅ 已落地）

> 📦 来源：`wl-skills-bd` v0.24.0 · `standards/25-config-layering.md` · 本文可判定条目由 `wl-skills-bd validate`（B 系列）与 `mvn verify -Pwl-quality` 自动执行。


> 一个业务项目从内网→华新→下一个客户，每次迁移最痛的是改配置。本规范把"配置"固化为三层分层模型 + 单一事实源，让任何业务项目套用同一套模式：一处声明、全工程应用、一键体检、一键迁移。
>
> 强制度：🔴 必遵。`wl-skills-bd config doctor/init/migrate/fix` + `troubleshoot` 闭环。
>
> **依据**：Spring Boot 官方 Externalized Configuration、Kubernetes ConfigMap/Secret 官方、Nacos 官方 Namespace 隔离、12-Factor App III. Config、SRE《SRE Book》§7 Configuration。

---

## 1. 三层分层模型（核心架构）

```
┌─────────────────────────────────────────────────────┐
│ L1 环境无关骨架（代码库 git，零硬编码）              │
│  ─ bootstrap.yml     仅 ${VAR} 占位符               │
│  ─ application.yml   仅 ${VAR} 占位符               │
│  ─ logback-spring.xml                                 │
│  ─ K8s: Deployment/Service 模板（全 ${VAR}）        │
└─────────────────────────────────────────────────────┘
              ↓ 环境变量注入（K8s ConfigMap/Secret 或 .env）
┌─────────────────────────────────────────────────────┐
│ L2 环境变量层（部署侧，不进 git）                    │
│  ─ K8s ConfigMap + Secret（生产）                   │
│  ─ .env / IDE Run Configuration（本地开发）         │
│  ─ CI/CD 流水线变量                                  │
└─────────────────────────────────────────────────────┘
              ↓ Nacos 按 namespace 拉取
┌─────────────────────────────────────────────────────┐
│ L3 Nacos 动态配置（运行时，namespace 隔离）          │
│  ─ application-{env}.yml                             │
│  ─ datasource-{type}-{cluster}-{env}.yml            │
│  ─ redis-{env}.yml / mq-{env}.yml                   │
│  ─ 业务动态配置                                      │
└─────────────────────────────────────────────────────┘
```

### 1.1 铁律（必遵）

| 编号 | 铁律 | 检测 |
|---|---|---|
| **L0** | 代码库（git）零硬编码敏感信息，全 `${VAR}` 占位 | doctor config-secret |
| **L1** | 跨环境差异只在 L2（环境变量）声明，不在代码层分支 | doctor config-branching |
| **L2** | L2 环境变量是唯一差异源，跨客户只改这一层 | env-matrix 单一事实源 |
| **L3** | L3 Nacos 按 namespace 隔离，配置内容不进代码库 | doctor nacos-namespace |

### 1.2 占位符规范

```yaml
# ✅ L1 代码库全占位符（环境无关）
spring:
  cloud:
    nacos:
      config:
        server-addr: ${NACOS_HOST}                    # 占位
        namespace: ${NACOS_CONFIG_NAMESPACE}          # 占位
        username: ${NACOS_USERNAME}                   # 占位
        password: ${NACOS_PASSWORD}                   # 占位
  datasource:
    url: jdbc:oracle:thin:@${DB_HOST}:${DB_PORT}:${DB_SID}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}

# ❌ L1 代码库硬编码（L0 违规）
spring:
  datasource:
    password: DO_NOT_COMMIT                           # 任意明文 secret 都会进 git 历史
  cloud:
    nacos:
      config:
        server-addr: 172.17.8.57:8848                 # 跨客户不一致
```

### 1.3 L2 环境变量清单（5 套）

| 变量 | 用途 | dev 默认 | prod 来源 |
|---|---|---|---|
| `PROFILES_ACTIVE` | Spring profile | dev | K8s ConfigMap |
| `NACOS_HOST` | Nacos 地址 | 本地 nacos | K8s ConfigMap |
| `NACOS_USERNAME` | Nacos 账号 | nacos | K8s ConfigMap |
| `NACOS_PASSWORD` | Nacos 密码 | *** | K8s Secret |
| `NACOS_CONFIG_NAMESPACE` | 配置 namespace | dev | K8s ConfigMap |
| `NACOS_DISCOVERY_NAMESPACE` | 服务发现 namespace | dev | K8s ConfigMap |
| `DATASOURCE` | 数据源类型 oracle/mysql | oracle | K8s ConfigMap |
| `DB_CLUSTER` | 数据库集群 cx/non_cx/pt | 按业务域确定 | K8s ConfigMap |
| `DB_HOST` / `DB_PORT` / `DB_SID` | 数据库连接 | 本地 | K8s Secret |
| `DB_USERNAME` / `DB_PASSWORD` | 数据库账号 | dev | K8s Secret |
| `REDIS_HOST` / `REDIS_PORT` / `REDIS_PASSWORD` | Redis 连接 | 本地 | K8s Secret |
| `APP_NAME` | 应用名 | wl-xxx | K8s ConfigMap |

> 每个业务项目用 `wl-skills-bd config init` 生成标准 `.env.example` ×5（dev/sit/uat/pre/prod），部署侧按环境填充。

### 1.4 L3 Nacos dataId 命名约定

| dataId | 内容 | namespace |
|---|---|---|
| `application-{env}.yml` | 环境通用配置 | 按 env |
| `datasource-{type}-{cluster}-{env}.yml` | 数据源（mysql/oracle + cx/non_cx/pt）| 按 env |
| `redis-{env}.yml` | Redis 配置 | 按 env |
| `mq-{env}.yml` | MQ 配置 | 按 env |

> doctor 校验 bootstrap.yml 声明的 `shared-configs` dataId 模式必须同时包含 `${DATASOURCE}`、`${DB_CLUSTER}` 与 `${spring.profiles.active}`，并与 env-matrix/K8s `DB_CLUSTER` 一致。`config init` 只对已登记业务域自动判定集群；无法判定时要求显式 `--db-cluster`，禁止默认落到 pt。

---

## 2. 环境差异矩阵（单一事实源）

每个业务项目在代码库维护一份 `.wl-skills-bd/env-matrix.yml`，记录所有客户×所有环境的差异：

```yaml
schemaVersion: 1
project: wl-mdm
module: mdm
current: huaxin                      # 当前激活客户

customers:
  internal:                          # 内网
    nacos:
      host: "172.17.8.57:8848"
      username: "nacos"
      namespaces: { dev: dev, sit: sit, uat: uat, pre: pre, prod: prod }
    datasource:
      cluster: pt
      type: mysql
      dev: { host: "db-dev.internal", port: 3306, sid: "hx_ptdb", username: "ptuser" }
      prod: { host: "db-prod.internal", port: 3306, sid: "hx_ptdb", username: "ptuser" }
    redis:
      dev: { host: "r-dev.internal", port: 6379 }
      prod: { host: "r-prod.internal", port: 6379 }
    k8s:
      registry: "harbor.internal/hx-digital"
      namespace: "micro-services"
      port: 9101
    secrets:                          # 占位，实际值在 K8s Secret / .env，不进 git
      nacos_password: "K8s Secret: micro-services-secret/password"
      db_password: "K8s Secret: db-secret/password"
      redis_password: "K8s Secret: redis-secret/password"

  huaxin:                             # 华新（当前）
    nacos:
      host: "nacos.basic-services"    # K8s 服务名
      username: "nacos"
      namespaces: { dev: dev, sit: sit, uat: uat, pre: pre, prod: prod }
    datasource:
      cluster: pt
      type: mysql
      dev: { host: "mysql.basic-services", port: 3306, sid: "hx_ptdb", username: "ptuser" }
      prod: { host: "mysql.basic-services", port: 3306, sid: "hx_ptdb", username: "ptuser" }
    redis:
      dev: { host: "redis.basic-services", port: 6379 }
      prod: { host: "redis.basic-services", port: 6379 }
    k8s:
      registry: "harbor.walsin.com.cn/hx-digital"
      namespace: "micro-services"
      port: 9101
    secrets:
      nacos_password: "K8s Secret: micro-services-secret/password"
      db_password: "K8s Secret: db-secret/password"
      redis_password: "K8s Secret: redis-secret/password"
```

**铁律**：
- `env-matrix.yml` 进 git，但 **secrets 只写占位**（实际值在 K8s Secret / .env）
- `current` 字段标识当前激活客户（doctor 读取做体检）
- 迁移时只改 `current` + 重新生成 L2 配置，L1 代码零改动

---

## 3. 迁移工作流（内网 → 华新 → 下一个）

```bash
# 1. 声明新客户（编辑 env-matrix.yml 加 newCustomer 段）
# 2. 切换当前客户
wl-skills-bd config migrate --to newCustomer --plan
# 3. 评审生成的差异（5 套 .env + K8s ConfigMap + Nacos dataId 清单）
# 4. 应用
wl-skills-bd config migrate --to newCustomer --apply --plan-hash <hash> --confirm
# 5. 体检
wl-skills-bd config doctor
wl-skills-bd config doctor --probe    # 连通性探测（DB/Redis/Nacos）
```

**生成产物**：
- `.env.{customer}.{env}` ×5（部署侧环境变量，不进 git）
- `deploy/{customer}/k8s-configmap-{env}.yaml` ×5
- `deploy/{customer}/k8s-secret-{env}.yaml.example` ×5（占位，实际值人工填）
- `docs/config-migration-{from}-to-{to}.md`（迁移差异报告）

> L1 代码（bootstrap.yml/application.yml）零改动，因为全是占位符。

---

## 4. 一键体检（doctor config，按优先级）

`wl-skills-bd config doctor` 按 L0~L8 优先级体检，每项失败给出"下一步查哪里"的可执行指引：

| 级别 | 检查项 | 通过条件 | 失败指引 |
|---|---|---|---|
| **L0** | config-skeleton | bootstrap.yml 存在 + profiles.active | 创建 bootstrap.yml（config init） |
| **L0** | config-secret | password/token/secret 等敏感键无明文字面量 | 改 `${VAR}` 占位符（config fix） |
| **L0** | config-security-posture | 禁止 Bean 覆盖、Actuator `*` 全暴露、env/configprops 值和错误堆栈无条件展示 | 使用最小端点白名单并让重复 Bean fail-fast |
| **L1** | config-placeholder | 敏感字段用 `${VAR}` 而非字面量 | config fix 自动替换 |
| **L2** | env-matrix | env-matrix.yml 存在 + current 客户有效 | config init 生成矩阵 |
| **L2** | env-completeness | 5 环境变量齐全（PROFILES/NACOS/DB/REDIS） | 补 .env |
| **L3** | nacos-config | bootstrap.yml 声明 server-addr/namespace/group | 补 nacos 配置 |
| **L4** | db-cluster | env-matrix 的 datasource.cluster 在 cx/non_cx/pt | 修正 cluster |
| **L5** | k8s-manifest | K8s yaml 的 PROFILES_ACTIVE/NAMESPACE 合规 | 补 ConfigMap 字段 |
| **L6** | port-range | server.port 在模块端口范围 | 修正端口 |
| **L7** | env-consistency | bootstrap profile = env-matrix.current env = K8s PROFILES_ACTIVE | 三方对齐 |
| **L8** | protected-write-guard | 非 pre/prod/production，或评审同一 planHash 后显式授权 | 确认环境与变更计划 |

可选 `--probe`：
| **P1** | db-probe | DB 端口 TCP 可达 | 检查 DB 地址/网络/防火墙 |
| **P2** | redis-probe | Redis 端口 TCP 可达 | 检查 Redis 地址/网络 |
| **P3** | nacos-probe | Nacos 端口 TCP 可达 | 检查 Nacos 可达性 |

> 连通性探测默认关闭（`--probe` 开启），用 TCP socket 探测端口可达性，不持有真实凭据，不执行 SQL/PING 命令。提供凭据时（.env）做更深握手。

---

## 5. 故障排查导引（troubleshoot）

`wl-skills-bd troubleshoot "<错误关键字>"` 按官方错误码诊断：

```bash
$ wl-skills-bd troubleshoot "Communications link failure"
🔍 匹配诊断：数据库连接失败
─ 可能原因：
  1. DB 地址/端口错误（检查 DB_HOST/DB_PORT）
  2. DB 服务未启动（联系 DBA）
  3. 网络不通（VPN/防火墙）
  4. 账号密码错误（检查 DB_USERNAME/DB_PASSWORD）
─ 排查步骤：
  1. telnet ${DB_HOST} ${DB_PORT}（验证网络）
  2. 检查 .env 的 DB_* 变量
  3. 查看 Nacos datasource-{env}.yml 的 url
  4. 运行 wl-skills-bd config doctor --probe（自动探测）
```

内置诊断树覆盖：DB 连接、Redis 连接、Nacos 连接、K8s Pod、端口占用、Bean 创建、Profile 未激活、Flyway 迁移等常见错误。

---

## 6. 与其他规范的关系

| 规范 | 25 的边界 |
|---|---|
| 24-multi-env | 24 是“5 环境隔离规范层”，25 是“三层配置/矩阵/体检/迁移工具层”；二者均不管理 Git 分支 |
| 21-sensitive-write | 21 是"代码层"敏感写，25 是"配置层"敏感信息（明文密码）|
| 12-database-ddl | 12 的 dbCluster 在 25 的 env-matrix.datasource.cluster 固化 |
| 02-project-structure | 02 的端口范围在 25 的 env-matrix.k8s.port 校验 |

---

## 7. 工程闭环

```
config init          → 生成标准骨架（L1 占位符 + L2 .env.example + L3 nacos dataId 清单）
       ↓
env-matrix.yml       → 声明客户差异（单一事实源）
       ↓
config migrate       → 切换客户（生成 L2 .env + K8s + 迁移报告）
       ↓
config doctor        → L0~L8 全链路体检（每项失败给指引）
       ↓
config doctor --probe→ 连通性探测（DB/Redis/Nacos TCP 可达）
       ↓
config fix           → 安全修复（仅把可确定的明文敏感值改为占位符并复扫）
       ↓
troubleshoot "<错误>"→ 故障关键字诊断（错误码→排查步骤）
```

所有写步骤（init/migrate/fix）都先生成包含当前文件哈希的 planHash；apply 前重算，只有 `--confirm + --plan-hash` 一致才原子写入，失败自动回滚并复验。`pre/prod/production` 还需显式授权。只读 doctor/troubleshoot 不需要确认。

---

## 8. 正反例

### ✅ 标准三层分层

```yaml
# bootstrap.yml（L1，git，零硬编码）
spring:
  application:
    name: ${APP_NAME:wl-mdm}
  cloud:
    nacos:
      config:
        server-addr: ${NACOS_HOST}
        namespace: ${NACOS_CONFIG_NAMESPACE}
        username: ${NACOS_USERNAME}
        password: ${NACOS_PASSWORD}
  profiles:
    active: ${PROFILES_ACTIVE}
```

```bash
# .env.dev（L2，不进 git，.gitignore 排除）
PROFILES_ACTIVE=dev
DB_CLUSTER=pt
NACOS_HOST=172.17.8.57:8848
NACOS_CONFIG_NAMESPACE=dev
NACOS_USERNAME=nacos
NACOS_PASSWORD=***
DB_HOST=db-dev.internal
DB_PORT=3306
```

> 任何环境都显式提供 `PROFILES_ACTIVE`。本地开发通过 IDEA Run Configuration 或 `.env.dev` 注入；部署通过按模块独立的 ConfigMap 注入。禁止靠修改 `bootstrap.yml` 切环境。

### ❌ 反例（mdm-service 历史模式）

```yaml
# bootstrap.yml（L1，git，硬编码）—— L0 违规
spring:
  cloud:
    nacos:
      username: ${NACOS_USERNAME:nacos}          # 部分占位 OK
      password: ${NACOS_PASSWORD:DO_NOT_COMMIT}  # ❌ 任意默认密码都会进入 git
```

> `${NACOS_PASSWORD:DO_NOT_COMMIT}` 是典型反例：即使示例值不是实际密码，默认 secret 仍会进入 git。正确写法是 `${NACOS_PASSWORD}`（无默认值）。

---

## 变更记录

- 2026-08-31 v0.23：doctor 增加 Bean 覆盖、Actuator 全暴露与错误详情泄露检查；移除未实现的 config diff 能力描述。
- 2026-07-28 v0.17.8：集群化 datasource dataId、未知业务域 fail-closed、profile 显式注入及 matrix/K8s 三方一致性检查。
- 2026-07-18 v0.14：init/migrate/fix 统一 preview→planHash→confirm→原子写→回滚→复验；pre/prod/production 默认阻断。
- 2026-07-18 v0.12：新增配置分层与多环境管理规范，落地三层分层模型 + env-matrix + config doctor/init/migrate/fix/diff + troubleshoot 工程闭环。
