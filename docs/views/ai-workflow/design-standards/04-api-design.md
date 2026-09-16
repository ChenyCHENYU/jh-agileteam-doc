# 04 · 接口设计规范

> 📦 来源：`wl-skills-design` v0.11.1 · `standards/04-api-design.md` · 可判定条目由 `verify`（[M] 机械项）自动执行。


> 本规范覆盖 HTTP API、系统集成消息和可选 OpenAPI 3.1 契约。示例均为匿名合成内容，不对应任何组织、系统或线上流量。

## §一 接口 profile 与分类

设计前记录 profile；未确认项标记 Pending，不得从样例继承。

| 决策 | 可选值示例 | 约束 |
|------|-----------|------|
| `contract` | Markdown / OpenAPI 3.1 / both | OpenAPI 必须可解析并与文档一致 |
| `protocol` | HTTPS / message broker / other | 记录版本与序列化格式 |
| `auth` | OAuth2/OIDC / mTLS / signed request / internal | 未声明不得判“已安全” |
| `responseModel` | HTTP body / envelope | 与客户端处理一致 |
| `errorModel` | RFC 9457 / team schema | 覆盖状态码与稳定错误标识 |
| `pagination` | page-size / offset-limit / cursor / none | 统一请求、响应和排序语义 |
| `versioning` | URL / header / media type / none | 记录兼容策略 |
| `idempotency` | key / business key / naturally idempotent / NA | 写操作逐接口说明 |
| `dateTime` | RFC 3339 + 时区偏移 | 不使用无时区本地时间 |
| `decimal` | JSON number / decimal string | 按精度和客户端能力选择 |
| `batch` | atomic / partial success | 明确失败与重试语义 |

接口分为：

- HTTP API：资源查询、命令或服务调用；
- 系统集成：跨边界消息、事件、批量文件或请求响应交换。

接口清单必须记录稳定 ID、编码、类型、协议、提供方、消费方、关联功能 ID、字段 ID 和数据落点。

## §二 命名与稳定标识

系统集成编码推荐 `[SRC]_[DST]_[KIND]_[NN]`，其中系统代号来自词典，`KIND` 由项目注册，序号在同一前缀内唯一递增。HTTP API 使用稳定 `operationId`；显示名称变化不得导致稳定 ID 重建。

| 对象 | 推荐格式 | 合成示例 |
|------|---------|---------|
| 集成编码 | `[SRC]_[DST]_[KIND]_[NN]` | `SRC_DST_EVT_01` |
| operationId | lowerCamelCase | `submitRequest` |
| schema | UpperCamelCase | `SubmitRequestInput` |
| 字段 | lowerCamelCase | `requestStatus` |
| 错误标识 | 项目 profile | `REQ-VALIDATION-001` |

禁止用组织、产品或人员名称充当系统代号。编码、operationId 和 schema 名称在契约范围内唯一。

## §三 HTTP API

### 3.1 资源、方法与状态

- URI 使用稳定资源名，不暴露数据库表名或实现技术。
- GET/HEAD 安全且幂等；PUT/DELETE 应具备幂等语义；POST/PATCH 是否幂等由契约说明。
- 创建成功通常返回 201 和资源位置；异步受理可返回 202；无响应体成功可返回 204。
- 4xx 表示可归因于请求或权限，5xx 表示服务端失败；不得把所有结果都压成 HTTP 200。
- 资源路径版本只是一种 profile，不能被静默强制。

### 3.2 查询、排序与分页

列表接口必须声明排序稳定性和分页模型：

| 模型 | 必须说明 |
|------|---------|
| page-size | 起始页、最大页长、总数是否精确 |
| offset-limit | 上限、稳定排序、深分页限制 |
| cursor | cursor 生命周期、方向、失效和重复/遗漏语义 |
| none | 数据量上界或流式策略 |

参数名由 profile 决定；同一 API 域不得混用多个未声明别名。过滤字段必须有类型、操作符、大小写和空值语义。

### 3.3 并发与条件请求

存在并发更新风险时，声明版本字段、ETag/If-Match 或等价机制。冲突结果必须可区分于校验失败，并告诉调用方是否应刷新、重试或人工处理。

## §四 契约与消息结构

### 4.1 集成触发条件

系统集成接口使用六项表，内容可按协议扩展但不得缺少语义：

| 项 | 内容 |
|----|------|
| 业务触发 | 事件、前置状态和边界 |
| 频次与容量 | 实时/定时/批量、峰值与大小上限 |
| 协议与版本 | HTTPS、消息协议或文件交换版本 |
| 序列化 | JSON/XML/CSV/Avro 等及字符集 |
| 数据通道 | 已登记源代号 → 目标代号 |
| 结构与投递 | 单笔/批量/主从、顺序、至少一次/至多一次等 |

### 4.2 字段表

| 序号 | 字段稳定 ID | 中文字段 | 英文字段 | 契约类型 | 必填/可空 | 描述与约束 |
|------|------------|---------|---------|---------|----------|-----------|

契约类型使用 JSON Schema/OpenAPI 逻辑类型，例如 `string(date-time)`、`integer(int64)`、`number(decimal profile)`、`boolean`、`array<Schema>`、`object<Schema>`。不得把某编程语言类型当成跨语言契约。

主档/明细档只是一种结构；实际嵌套、数组和引用必须与 JSON Schema 一致。

### 4.3 序列化

| 类型 | 默认语义 |
|------|---------|
| 日期 | ISO 8601 `full-date` |
| 日期时间 | RFC 3339，必须含 `Z` 或时区偏移 |
| 布尔 | JSON `true` / `false` |
| 枚举 | 稳定存储值；显示标签另字段或客户端词典 |
| 高精度小数 | 按 decimal profile 使用 number 或字符串，并声明格式 |
| 空值 | 区分字段缺失、`null` 和空字符串 |
| 标识符 | 字符串；不要让客户端依赖超出安全整数范围的 number |

### 4.4 请求、响应与示例

- 每个方向至少提供一个语法有效且与 schema 一致的合成示例。
- JSON 代码块不得包含注释、尾逗号或秘密值。
- 响应采用 HTTP 原生 body、envelope 或消息回执，必须服从 profile。
- envelope 字段名和成功标识不是跨项目固定值。
- 示例标识使用 `DEMO-*`，不使用业务单号、地址、账号、令牌或线上 payload。

### 4.5 批量与部分成功

批量 profile 必须明确原子性、单项错误、顺序、最大条数、重复项和重试单位。部分成功响应至少能将每个失败项映射回输入稳定 ID；字段名称由 profile 定义，不强制固定为某套包装。

## §五 错误模型

错误响应包含：稳定错误标识、人可读摘要、可选字段级问题、追踪 ID 和是否可重试。采用 RFC 9457 时使用 `application/problem+json` 并维护稳定 `type` URI；采用团队 schema 时也必须映射 HTTP 状态并保持向后兼容。

不得在错误中返回堆栈、SQL、秘密、个人信息或内部拓扑。错误文案不是客户端流程判断的唯一依据。

## §六 安全与隐私

- 认证和授权分开描述；每个敏感操作声明 scope/role/策略。
- 只允许加密传输；是否需要 mTLS、签名、防重放或来源限制由威胁模型决定。
- 日志、追踪和示例执行最小化与脱敏，不记录秘密或完整敏感 payload。
- OpenAPI security scheme 与运行契约一致；不能只写“需要 Token”。
- CORS、CSRF、速率限制、文件上传、回调 URL 和 webhook 各按实际暴露面评估。

## §七 可靠性与演进

每个跨边界写操作声明：超时、重试主体、退避、最大次数、幂等、重复消息、乱序、死信/补偿和人工恢复。只有具备幂等或可证明安全时才能自动重试。

破坏性变更需新版本或迁移窗口；兼容性检查至少覆盖字段删除、必填收紧、类型变化、枚举收窄、默认值和语义变化。弃用需记录替代接口和截止日期。

## §八 文档与文件

```text
docs/api/
├── 00-api-overview.md
├── 01-{module}.md
├── openapi.yaml            # profile 要求时
└── reports/                # 仅用户要求保存验证报告时
```

每个接口包含：元信息/触发、请求契约、成功响应、错误响应、合成示例、安全、可靠性与追溯。Markdown 和 OpenAPI 重复信息必须自动或人工比对，不能各自漂移。

## §九 跨文档追溯

```text
spec 功能 ID → API 稳定 ID / operationId
spec/词典字段 ID → 请求/响应字段 → DB 字段 ID
IPO 触发事件 → API/消息触发条件
原型操作 → operationId → 权限策略
```

并非每个 UI 功能都必须有网络接口；X01 只检查 spec 明确标注“需接口”或有服务端行为的功能。无数据库落点的派生字段、外部字段或瞬时字段应有说明，不得被 X03 误判。

## §十 验证清单（38 项）

> 执行方式标记：[M] 机械可判、[J] 语义判断。四域 [M] 项均由 `wl-skills-design verify` 执行（未覆盖时输出 skip）；Agent 先取机械结论，再判 [J] 项，合并为同一编号的报告。

### IF-A 命名与语义（6 项）

- [ ] A01 [M] — 集成编码符合已声明格式，系统代号已登记
- [ ] A02 [M] — 编码、稳定 ID、operationId 和 schema 名称唯一
- [ ] A03 [M] — HTTP URI 使用稳定资源语义且符合 versioning profile
- [ ] A04 [J] — HTTP 方法、安全性、幂等性和状态码语义一致
- [ ] A05 [J] — 集成 KIND/type 码已在词典注册，无临时自造值
- [ ] A06 [J] — 接口名称和 operationId 清晰、稳定、无实现泄露

### IF-B 契约完整性（11 项）

- [ ] B01 [M] — 集成接口六项触发与投递语义完整
- [ ] B02 [M] — 请求、成功响应和错误响应 schema 齐全
- [ ] B03 [M] — 字段表包含稳定 ID、名称、逻辑类型、必填/可空和约束
- [ ] B04 [M] — 使用 OpenAPI/JSON Schema 逻辑类型，不使用语言专属类型
- [ ] B05 [J] — 响应和错误模型已在 profile 声明，文档、示例和 OpenAPI 一致
- [ ] B06 [M] — 请求与响应合成示例语法有效且符合 schema
- [ ] B07 [M] — required、nullable/可空、缺失和默认值语义明确
- [ ] B08 [J] — object/array/引用层级与 schema 和示例一致
- [ ] B09 [J] — 列表接口符合已声明分页、排序和过滤 profile
- [ ] B10 [M] — 日期时间、布尔、枚举、小数、标识符和空值符合序列化 profile
- [ ] B11 [J] — 批量接口明确原子性/部分成功、限制、单项映射和重试单位

### IF-C 安全与可靠性（5 项）

- [ ] C01 [J] — 认证、授权和 security scheme 明确且一致
- [ ] C02 [J] — 传输保护以及按威胁模型需要的签名/防重放已说明
- [ ] C03 [J] — 敏感字段的最小化、脱敏、日志和导出策略明确
- [ ] C04 [J] — 写操作逐一声明幂等与并发冲突策略
- [ ] C05 [J] — 超时、重试、退避、补偿和人工恢复策略完整

### IF-D 文档与演进（8 项）

- [ ] D01 [M] — 元信息、契约、示例、安全、可靠性和追溯章节齐全
- [ ] D02 [M] — 接口清单含稳定 ID、类型、协议、提供/消费方和关联 ID
- [ ] D03 [M] — 错误清单含 HTTP 状态、稳定标识、触发和处理建议
- [ ] D04 [M] — 错误标识符合已声明 profile 且唯一
- [ ] D05 [M] — 协议、版本、序列化和内容类型明确
- [ ] D06 [J] — 数据通道使用已登记源/目标代号
- [ ] D07 [M] — 频次、容量、顺序和投递语义明确
- [ ] D08 [M] — OpenAPI profile 下契约可解析，operationId 唯一且 `$ref` 有效

### IF-X 跨文档一致性（8 项）

- [ ] X01 [J] — spec 中明确需服务端接口的功能均有 API 承载
- [ ] X02 [J] — 每个 API 都能追溯到功能、集成事件或有证据的架构能力
- [ ] X03 [J] — 持久化接口字段 ID 能映射到词典和 DB 字段；例外有说明
- [ ] X04 [J] — 接口字段中文语义与 spec/词典一致
- [ ] X05 [J] — 接口逻辑类型与词典/DB 逻辑类型兼容
- [ ] X06 [J] — API/消息触发条件能追溯到 IPO 或集成事件
- [ ] X07 [J] — 接口清单的功能、字段和数据落点引用存在
- [ ] X08 [J] — API 稳定 ID、编码和 operationId 集合无重复

## §十一 集合比对

```text
SET_SPEC_SERVER_FN ⊆ SET_API_FN
SET_API_FN ⊆ SET_SPEC_FN ∪ SET_INTEGRATION_EVENT ∪ SET_ARCH_EXCEPTION
SET_API_PERSIST_FIELD ⊆ SET_GLOSSARY_FIELD ∩ SET_DB_FIELD
|SET_API_ID| = |unique(SET_API_ID)|
|SET_OPERATION_ID| = |unique(SET_OPERATION_ID)|
```

缺少 spec、词典或 DB 时，相关 X 项标 Pending；确认不持久化或不适用时记录 NotApplicable 和证据。不得把缺文档判通过。

## §十二 验证闭环

验证报告逐项记录规则 ID、`Pass/Fail/Pending/NotApplicable`、证据路径与锚点、差异和建议。验证/review 默认只读；repair 需要明确授权。创建模式只修复本轮新产物。

修复后重跑受影响规则、全部 X 组以及 OpenAPI 解析；任何计数都必须满足 `Pass + Fail + Pending + NotApplicable = 38`。
