# 移动端消息中心使用与架构说明

> 适用对象：项目经理、技术经理、业务后端开发、移动端开发、测试与运维人员。
> 适用范围：`wl-mbase` 移动端消息中心，以及与其共用数据和状态的 PC 消息中心、OAMS 服务。
> 文档定位：团队接入、配置、使用、验收和排障的统一依据。架构说明与操作手册合并维护，避免同一字段和状态出现两套口径。

阅读导航：

- 项目经理：先读第 0～3 节，再看第 10、11、14 节。
- 技术经理：重点读第 4～10 节和第 13、14 节。
- 业务开发：按第 5～8 节接入。
- 测试与运维：按第 11、12 节验收和排障。

使用说明快速入口：

| 谁来使用       | 直接阅读           | 能解决什么问题                                         |
| -------------- | ------------------ | ------------------------------------------------------ |
| 最终用户       | 第 3 节            | 如何进入、筛选、阅读、办理、置顶消息和处理打开失败     |
| 平台管理员     | 第 4 节            | 如何创建模板、选择推送端、填写终端参数和检查敏感信息   |
| 业务开发       | 第 5～8 节         | 如何发送、完成、撤销消息，以及配置移动地址和钉钉直达   |
| 测试人员       | 第 11 节           | 如何准备数据并验证消息、审批、提醒、钉钉和多终端主链路 |
| 运维与支持人员 | 第 12、13 节       | 如何定位消息缺失、钉钉未送达、路由错误和接口问题       |
| 项目/技术经理  | 第 0～2、10、14 节 | 如何确定使用方式、职责边界、改进优先级和发布检查范围   |

如果只想知道“团队应该怎么使用”，依次阅读第 2～5、11、12 节即可；第 6～10、13、14 节用于解释技术契约、架构边界和维护依据。

## 0. 先看结论

### 0.1 移动端与 PC 端“相同”和“不同”的部分

移动端与 PC 端复用的是同一套 OAMS 消息数据、消息模板、四类状态和业务完成接口，因此消息事实源和业务语义相同；移动端没有再建设一套独立消息后台。

不同之处只在交互和打开方式：

| 对比项   | PC 端                                                     | 移动端                                       |
| -------- | --------------------------------------------------------- | -------------------------------------------- |
| 数据源   | `/oams/oaMessage/listMy`                                  | `/oams/oaMessage/listMy`                     |
| 状态     | 未读 / 已读 / 待办 / 已办                                 | 未读 / 已读 / 待办 / 已办                    |
| 分类     | `businessType` 字典                                       | `businessType` 字典                          |
| 详情打开 | `showUrl` 动态加载 PC 组件，如 `flowHandle`、`flowViewer` | 基座审批详情或已注册子应用 webview           |
| 审批处理 | PC 流程组件                                               | 移动端原生审批详情                           |
| 外部触达 | 可选钉钉、企业微信等推送端                                | 可从钉钉工作通知进入基座，再打开审批或子应用 |
| 页面形态 | 侧边消息中心、全屏详情                                    | 一级 Tab、卡片列表、顶部轻提醒、窄屏审批页   |

一句话概括：**后端消息和状态完全复用 PC，移动端只补齐移动交互、统一路由和移动业务地址。**

### 0.2 推荐的团队使用方式

1. 所有业务消息先进入 OAMS，OAMS 是唯一消息事实源。
2. 模板必须选择 `pc` 推送端，才能同时进入 PC 和当前移动端消息中心。
3. 需要更强触达时，可按项目约束追加钉钉外部通道；钉钉是提醒通道，不是第二套消息中心。华新客户项目不启用个人账号方式，不配置 `DingTalkPersonal`。
4. 讯息使用 `type=1`，只维护已读 / 未读。
5. 需要业务处理的任务使用 `type=2`，只由业务完成动作更新待办 / 已办。
6. FLOW 消息复用平台审批详情；普通业务消息必须提供可落到已注册子应用的移动端地址。
7. 验收必须同时验证“消息记录、状态变化、点击路由、业务完成”；配置了钉钉通道时再验证钉钉触达，不能只看外部通知是否收到。

### 0.3 当前最重要的配置提醒

- `/listMy` 在服务端固定按 `terminals` 包含 `pc` 过滤。模板只选钉钉、不选 `pc` 时，用户可能收到钉钉通知，但 PC 和移动消息中心都看不到。
- PC 模板页面的“详情页组件”面向 PC；普通业务如果要在移动端直达页面，还需要消息记录提供 `returnUrl/mobileBusinessUrl`，或在兼容阶段提供可识别的移动 `showUrl`。
- FLOW 的 `showUrl` 可以同时服务 PC 和移动端，例如 `flowHandle?commentId=...&id=...`，移动端会解析其中的流程参数。
- `FLOW_REFUSE` 在当前移动代码中不是一律只读。它属于可处理模板，满足后端 `handle=true` 等条件时可显示“重新发起”。

## 1. 能力边界：统一消息中心与钉钉的区别

### 1.1 两者不是替代关系

| 维度       | 统一消息中心                             | 钉钉群机器人 / 工作通知                 |
| ---------- | ---------------------------------------- | --------------------------------------- |
| 核心定位   | 企业业务消息事实源和处理入口             | 外部触达通道                            |
| 数据留存   | OAMS 持久化，可查询、分页、筛选          | 依赖钉钉会话展示                        |
| 状态语义   | 已读、未读、待办、已办                   | 只能证明推送或查看，不能代表业务已完成  |
| 跨终端     | PC、H5、钉钉内 H5、小程序、App 可复用    | 主要在钉钉客户端                        |
| 业务处理   | 可进入审批详情或子应用并同步状态         | 点击后仍需进入基座或业务系统            |
| 检索追踪   | 可按类型、时间、标题和用户追踪           | 容易被聊天流淹没                        |
| 权限上下文 | 复用基座 token、公司上下文和子应用白名单 | 依赖钉钉 userid、应用凭据和工作通知权限 |
| 可扩展性   | 可追加泛微、企业微信、WebSocket 等入口   | 每种外部渠道都需要独立适配              |

### 1.2 统一使用的优势

- 一个消息 ID 对应一条事实记录，PC 与移动端看到的是同一状态。
- 阅读和办理分离，避免“点开钉钉消息就被认为任务已完成”。
- 消息列表和顶部提醒已复用同一点击路由；外部入口完成策略收敛后也可统一进入同一审批详情或子应用。
- 钉钉不可用、用户换终端或通知被清理后，消息仍能在消息中心找回。
- 业务系统只调用 OAMS，不需要分别对接 PC、移动端、钉钉和未来泛微。
- 模板、终端和消息参数集中配置，项目可按同一验收表回归。

### 1.3 推荐组合

| 场景                               | 推荐推送端                | 原因                                   |
| ---------------------------------- | ------------------------- | -------------------------------------- |
| 仅站内通知                         | `pc`                      | 同时进入当前 PC 与移动消息中心         |
| 华新客户正式消息                   | `pc`，按需追加 `DingTalk` | 不使用个人账号方式；群通道仅作加强触达 |
| 项目群广播                         | `pc` + `DingTalk`         | 消息中心留痕，同时推送到指定群         |
| 个人工作通知（仅限允许的其他项目） | `pc` + `DingTalkPersonal` | 消息中心留痕，钉钉加强个人触达         |
| 仅测试钉钉群通道                   | `DingTalk`                | 只验证通道，不作为正式业务配置         |

正式业务不建议只配置钉钉终端，否则会形成“收到提醒但消息中心无记录入口”的割裂体验。

`DingTalkPersonal` 是选配能力。仅当客户制度允许个人工作通知时才启用，并在启用前确认账号映射；华新客户项目不启用该通道，也不将个人账号映射纳入当前项目验收范围。

## 2. 使用说明：角色分工与标准交付流程

### 2.1 角色职责

| 角色             | 必须确认的事项                                                              |
| ---------------- | --------------------------------------------------------------------------- |
| 项目经理         | 消息场景、接收人、是否需要办理、送达渠道、验收证据、失败兜底                |
| 技术经理         | 模板编码、业务分类、状态模型、移动地址、子应用注册、终端与安全              |
| 业务后端         | 调用统一发送接口；写入关联 ID；业务完成后调用 `finish`；撤销时调用 `remove` |
| 平台/OAMS 管理员 | 维护消息模板、推送端、终端参数和字典                                        |
| 移动端负责人     | 维护消息路由、子应用白名单、审批详情和外部入口                              |
| 测试人员         | 按状态、入口、模板、终端、设备和异常场景完成矩阵验证                        |
| 运维人员         | 检查 OAMS、RocketMQ、钉钉接口、Nginx 静态中转页和日志                       |

### 2.2 一条消息的完整生命周期

```text
业务事件发生
  -> 业务服务调用 MessageServiceUtil / RemoteOaMessageService
  -> OAMS 按 tempNo 读取模板
  -> 合并模板默认值与本次消息覆盖值
  -> 生成 oa_message 记录
  -> 按 terminals 投递 RocketMQ 外部通道
  -> PC / 移动端从 /listMy 查询同一消息记录
  -> 用户阅读讯息，OAMS 更新 hasRead
  -> 用户处理待办，业务成功后调用 finish(relativeId, relativeType)
  -> OAMS 更新 handled
```

关键原则：

- 发送成功不等于外部通道送达成功，外部通道通过 RocketMQ 异步执行。
- 打开待办不等于完成待办。
- 审批或业务动作成功后，才允许更新 `handled=true`。
- 钉钉推送失败不能删除 OAMS 记录，用户仍可在消息中心处理。

## 3. 使用说明：最终用户操作

### 3.1 进入消息中心

用户可以从以下入口进入：

- 底部“消息”Tab。
- 首页消息入口或消息角标。
- 全局顶部新消息提醒。
- 钉钉工作通知中的详情链接。

消息 Tab 和顶部通知角标显示：

```text
总未处理数 = 未读讯息数 + 待办数
```

### 3.2 分类与四类状态

顶部业务分类来自 `businessType` 字典。当前常见配置为：

- `resourceType=2`：审批流。
- `resourceType=1`：通用业务。
- `all`：全部。

具体编码与名称以部署环境字典为准，不要在业务代码中硬编码分类名称。

四类状态的查询规则：

| 页面状态 | OAMS 查询条件      | 用户动作               |
| -------- | ------------------ | ---------------------- |
| 未读     | `type=1&hasRead=0` | 查看后可标记已读       |
| 已读     | `type=1&hasRead=1` | 只表示已阅读           |
| 待办     | `type=2&handled=0` | 需要完成审批或业务动作 |
| 已办     | `type=2&handled=1` | 业务已经完成           |

未读 / 已读是阅读状态，待办 / 已办是办理状态，不能互相替代。

### 3.3 搜索、筛选、刷新和分页

- 搜索同时匹配标题与内容。
- 日期筛选按消息创建时间传递 `beginDate/endDate`。
- 下拉刷新同时刷新列表、分类计数和四状态计数。
- 滚动到底部按 15 条一页继续加载。
- 切换业务分类会刷新分类计数、状态计数和当前列表。
- 切换四类状态只刷新当前列表。

### 3.4 已读与批量操作

- 打开未读讯息时，移动端先调用 `readBatch` 标记已读，再打开详情。
- “一键已读”只处理当前业务分类下的未读讯息，不处理待办。
- “批量标记”只在“未读”页出现，只允许选择当前已加载的未读讯息。
- 待办被查看后仍保持待办，只有业务完成后才进入已办。

当前代码在“全部”分类执行一键已读时会把 `resourceType=all` 传给后端，且参数通过 PUT Body 发送，而服务端接口按 RequestParam 接收；该链路需要修正后再按“全部未读均被标记”验收。其它具体业务分类也需在联调时确认 RequestParam 绑定。

### 3.5 置顶

每条消息可置顶或取消置顶，对应：

```http
PUT /oams/oaMessage/star?id={messageId}
PUT /oams/oaMessage/unStar?id={messageId}
```

当前 `/listMy` 默认按置顶、置顶时间、创建时间倒序返回。

### 3.6 无法打开消息时

移动端不会把配置错误静默降级到工作台，而是停留在消息中心并显示：

- 缺少流程参数。
- 缺少移动端业务地址。
- 地址未匹配到已注册子应用。

错误弹层可复制模板编码、消息 ID、关联 ID、业务分类和失败原因，提交给平台管理员排查。

### 3.7 顶部新消息提醒

顶部提醒是消息中心的轻量触达层，不是独立消息体系：

- 仅提醒新出现的 `FLOW_*` 消息。
- 第一次启动只建立基线，不弹历史未读或历史待办。
- 默认 90 秒巡检；发现新消息后 60 秒；长时间无变化或失败后 180 秒。
- 先查四状态计数，仅在计数变化或定期探测时拉取少量候选消息。
- 每次最多加入 3 条新提醒，单条默认展示 8 秒。
- 位于消息中心、应用在后台、页面隐藏、访客模式或未登录时不弹。
- 点击提醒才按既有规则标记讯息已读并打开目标；弹出本身不标已读。
- 同一用户最多持久化 80 个已提醒消息 ID，避免页面切换和网络重试重复弹出。

当前“通知设置”页面只把开关写入本机 `portal_notif_prefs`，提醒服务尚未读取这些配置。因此“接收通知、免打扰、按应用订阅”目前不能作为已生效能力验收，见第 10 节已知限制。

## 4. 使用说明：平台管理员配置消息模板与推送端

### 4.1 配置入口

在平台 PC 管理端进入：

```text
消息中心管理
  ├─ 消息模板
  ├─ 推送端
  └─ 消息记录
```

### 4.2 新建模板

在“消息模板”新增或编辑时按下表配置：

| 字段                    | 填写规则                                               | 移动端影响                                             |
| ----------------------- | ------------------------------------------------------ | ------------------------------------------------------ |
| 模板编号 `tempNo`       | 大写字母开头，数字、大写字母和下划线组合；创建后不修改 | FLOW 路由和提醒样式依赖该值                            |
| 标题                    | 简短描述消息结果或动作                                 | 列表、顶部提醒、钉钉展示                               |
| 标题编码                | 不含中文，供国际化解析                                 | OAMS 查询时解析为展示标题                              |
| 内容                    | 支持 `${name}` 占位符                                  | 列表与外部通知正文                                     |
| 内容编码                | 不含中文                                               | OAMS 查询时解析为展示内容                              |
| 详情页组件 `showUrl`    | PC 组件路径；发送时可被本次消息覆盖                    | FLOW 可从中解析 `id/commentId`；普通业务需另配移动地址 |
| 类型 `type`             | `1` 讯息；`2` 待办                                     | 决定使用 `hasRead` 还是 `handled`                      |
| 业务类型 `resourceType` | 从 `businessType` 字典选择                             | 决定消息中心分类                                       |
| 图标                    | 从 PC 图标库选择                                       | OAMS 返回模板图标，移动端 FLOW 仍使用统一流程图标      |
| 推送端                  | 正式业务至少选 `pc`                                    | 决定消息中心可见性和外部触达                           |
| 推送端参数              | 按所选终端填写                                         | 只用于对应外部通道                                     |

保存前必须检查：

1. 模板编号没有与现有模板冲突。
2. 类型与业务语义一致。
3. 业务分类存在于当前环境字典。
4. 至少选择 `pc`。
5. 所有终端必填参数已填写。
6. 内容和标题中的占位符都能由发送方提供。
7. FLOW 模板的 `showUrl` 或发送参数能够提供流程实例 ID。
8. 普通业务明确提供移动端目标地址。

### 4.3 推送端配置

#### `pc`

`pc` 是当前 PC 与移动端共用的站内消息终端。当前 `/listMy` 查询会在服务端附加：

```text
terminals contains "pc"
```

因此：

- 正式消息模板必须勾选 `pc`。
- 不需要为移动端再建一个独立 `mobile` 终端。
- 只选 `DingTalkPersonal` 时，钉钉可能收到，但消息中心查询不到。

#### `DingTalkPersonal`（按项目选配）

用途：通过钉钉企业内部应用向个人发送工作通知。

华新客户不允许个人账号方式，因此当前项目不启用、不配置也不验收该通道。以下说明仅供其他明确允许个人工作通知的项目按需使用。

当前发送器读取：

| 参数         | 要求                                        |
| ------------ | ------------------------------------------- |
| `app_key`    | 必填                                        |
| `app_secret` | 必填                                        |
| `agent_id`   | 必填，数字                                  |
| `msgtype`    | 可选，`text` 或 `markdown`，默认 `markdown` |
| `corp_id`    | 配置模型中保留，当前发送主链路未读取        |

如启用该通道，当前实现会直接把 `OaMessage.userNo` 作为钉钉 `userid_list`。仅在工号与钉钉 userid 不一致且项目确需个人通道时，才需要建立服务端账号映射；业务侧不得自行猜测或拼接 userid。

钉钉 token 使用 Redis 缓存和 Redisson 分布式锁，失效时清缓存并重试一次；再次失败后交由 RocketMQ 重试。

当前发送器把 `OaMessage.showUrl` 原样追加为“点击查看详情”，不会自动转换为 `/mbase/relay.html`。如果 PC 使用 `flowHandle?...`、钉钉需要完整移动链接，应扩展发送器按模板和流程参数生成 relay URL，或增加终端专用 `mobile_click_url`；不要为了钉钉把 PC 的 `showUrl` 改成不可加载的地址。

#### `DingTalk`

用途：通过群机器人 Webhook 向钉钉群广播。

| 参数          | 要求                                        |
| ------------- | ------------------------------------------- |
| `webhook_url` | 必填                                        |
| `secret`      | 机器人启用加签时填写                        |
| `msgtype`     | 可选，`text` 或 `markdown`，默认 `markdown` |

群机器人不能替代个人待办。它只能证明群内收到广播，不能表达某位用户的待办状态。

### 4.4 终端参数的安全要求

`app_secret`、机器人 Webhook 和签名密钥不得返回 PC 或移动客户端。

当前 OAMS `listMy` 直接返回 `OaMessage` 实体，而实体中的 `detailList` 可能包含模板终端参数；`@ApiModelProperty(hidden=true)` 只隐藏 Swagger 字段，不等于 JSON 脱敏。上线前应使用列表 DTO、`@JsonIgnore` 或服务端字段过滤，确认抓包中不存在：

- `app_secret`
- `webhook_url`
- `secret`
- 外部应用 token 或其它终端凭据

该项涉及敏感凭据保护，建议在启用外部终端前优先核查。

## 5. 使用说明：业务开发如何发送和完成消息

### 5.1 先判断用讯息还是待办

| 判断问题                               | 选择                       |
| -------------------------------------- | -------------------------- |
| 用户只需知道结果，不需要在系统完成动作 | `type=1` 讯息              |
| 用户必须审批、确认、补录或处理业务     | `type=2` 待办              |
| 流程平台生成审批任务                   | 使用既有 `FLOW_COMMENTS`   |
| 流程被驳回且发起人需要重新提交         | 使用既有 `FLOW_REFUSE`     |
| 流程通过、撤回、抄送等结果通知         | 使用对应 `FLOW_*` 讯息模板 |

不要用“标题里写了待办”代替 `type=2`，也不要把普通结果通知配置为待办。

### 5.2 推荐 Java 调用

业务服务优先依赖 `MessageServiceUtil`，由它调用 `RemoteOaMessageService`：

```java
messageServiceUtil.send(
    new OaMessageBuilder()
        .setTempNo("BUSINESS_TASK_TODO")
        .setUserNo(approverUserNo)
        .setContentMap(Maps.of(
            "businessNo", workLicenseNo,
            "applicantName", applicantName
        ))
        .setShowUrl("/mbase/example/task/detail?id=" + businessId)
        .setRelativeId(businessId)
        .setRelativeType(DefaultMsgRelativeType.DEFAULT)
);
```

多人发送：

```java
messageServiceUtil.send(
    new OaMessageBuilder()
        .setTempNo("BUSINESS_ALERT_NOTICE")
        .setContentMap(Maps.of("alarmNo", alarmNo))
        .setRelativeId(alarmId)
        .setRelativeType(DefaultMsgRelativeType.DEFAULT),
    receiverUserNos
);
```

说明：

- 模板已经定义的标题、内容、类型、业务分类和推送端会自动复制到消息。
- Builder 中的非空字段覆盖模板值。
- `contentMap/titleMap` 替换 `${key}` 占位符。
- `userNo/userNos` 决定接收人。
- `relativeId + relativeType` 是后续完成、删除和转办消息的业务关联键。
- `terminals` 通常由模板决定；只有明确的临时场景才在 Builder 覆盖。

### 5.3 直接接口

Feign 最终调用：

```http
POST /oams/oaMessage/send
Content-Type: application/json
```

标准 Builder 请求示例：

```json
{
  "tempNo": "BUSINESS_TASK_TODO",
  "userNo": "test_user_001",
  "contentMap": {
    "businessNo": "WL-20260723-001",
    "applicantName": "张三"
  },
  "showUrl": "/mbase/example/task/detail?id=123",
  "relativeId": "123",
  "relativeType": 1
}
```

优先使用 Feign/`MessageServiceUtil`，避免业务服务自行拼 OAMS 网关地址。

### 5.4 待办完成

业务动作成功后调用：

```java
messageServiceUtil.finish(businessId, DefaultMsgRelativeType.DEFAULT);
```

对应 OAMS：

```http
POST /oams/oaMessage/finish?relativeId={businessId}&relativeType={relativeType}
```

完成动作必须放在业务事务成功之后。建议：

1. 业务数据先成功落库。
2. 再发送完成消息或调用 `finish`。
3. 失败时记录补偿任务或通过事件最终一致。
4. 不允许前端在“打开详情”时直接调用 `finishBatch`。

### 5.5 取消、作废与转办

业务记录取消或作废：

```java
messageServiceUtil.remove(businessId, DefaultMsgRelativeType.DEFAULT);
```

待办转给新处理人：

```java
messageServiceUtil.updateUserNo(
    relativeIds,
    DefaultMsgRelativeType.DEFAULT,
    newUserNo,
    originalUserNo
);
```

转办时必须同时更新业务权限，不能只修改消息接收人。

### 5.6 幂等要求

当前 OAMS `send` 未在 Builder 中提供显式幂等键。业务侧应避免事件重放造成重复消息，推荐至少做到一项：

- 使用业务事件表记录“模板编码 + 接收人 + 业务 ID”发送结果。
- 发送前按业务状态判断是否已产生同类消息。
- MQ 或定时补偿时使用唯一业务事件 ID 去重。
- 对流程消息沿用唯一 `commentId` 作为 `relativeId`。

## 6. 移动端地址与消息路由契约

### 6.1 普通业务消息

移动端按以下优先级取目标地址：

1. `returnUrl`
2. `mobileBusinessUrl`
3. `showUrl`

目标必须满足：

- `http/https`。
- 与基座同源。
- 路径命中 `src/config/portal-apps.ts` 中已启用应用的 `mpPath`。
- 相对地址必须以 `/` 开头。

命中后基座会注入或覆盖：

```text
portal_token
from=portal
user_id
companyId
```

不允许根据消息标题或模板编码硬猜业务页面。

### 6.2 当前后端字段现实

`wl-mbase` 已识别：

- `returnUrl`
- `mobileBusinessUrl`
- `businessType`
- `domainCode`
- `appCode`

但当前 OAMS 消息契约中的通用字段仍以 `showUrl` 为主，`OaMessage/OaMessageBuilder` 尚未完整声明这些移动专用字段。

因此项目接入有两种方式：

1. 推荐：扩展 OAMS 实体、Builder、表结构和查询 DTO，正式提供 `mobileBusinessUrl` 或 `returnUrl`。
2. 兼容：普通业务消息把移动端同源地址写入 `showUrl`。这种方式可能与 PC 动态组件路径冲突，只适合 PC 不需要独立详情组件的消息。

如果同一条普通业务消息既需要 PC 组件详情，又需要移动子应用详情，必须采用第一种方式，不能让一个 `showUrl` 同时承担两种格式。

### 6.3 新增子应用

新增消息可直达子应用时必须同步：

1. 在 `src/config/portal-apps.ts` 注册 `id/name/mpPath/url/roles/enabled`。
2. 在 `public/relay.html` 的 `APP_PATHS` 增加相同 `mpPath`。
3. 确认子应用可接收 `portal_token/from/user_id/companyId`。
4. 子应用后端用 token 校验用户对 `companyId` 的权限，不信任 URL 参数本身。
5. 验证普通消息、FLOW `returnUrl` 和钉钉 `redirect_url` 三条链路。

只改 `portal-apps.ts` 不改 `relay.html` 时，基座内部可打开，钉钉静态中转页仍会拦截。

## 7. FLOW 审批消息

### 7.1 PC 与移动共用的 `showUrl`

流程服务当前发送格式：

```text
待处理：flowHandle?commentId={commentId}&handled=0&id={instanceId}
只读：  flowViewer?id={instanceId}
```

PC 端按 `flowHandle/flowViewer` 加载不同组件；移动端解析：

- `id`：流程实例 ID。
- `commentId`：审批意见 / 待办 ID。
- `flowMode=handle|view`：由显式参数、`showUrl` 最后一段或模板默认值推导。

### 7.2 模板策略

| 模板                 | 当前移动端默认模式 | 主要行为                               |
| -------------------- | ------------------ | -------------------------------------- |
| `FLOW_COMMENTS`      | `handle`           | 待审批、沟通参与、加签或转审后的新待办 |
| `FLOW_REFUSE`        | `handle`           | 发起人查看驳回并在满足条件时重新发起   |
| `FLOW_PASS`          | `view`             | 查看已通过流程                         |
| `FLOW_RECALL`        | `view`             | 查看撤回结果；缺实例 ID 时提示配置错误 |
| `FLOW_CC`            | `view`             | 只读查看                               |
| `FLOW_OTHERS_PASS`   | `view`             | 只读查看                               |
| `FLOW_OTHERS_REFUSE` | `view`             | 只读查看                               |
| 其它 `FLOW_*`        | `view`             | 有实例 ID 则查看详情，否则提示配置错误 |

当前 `flow-message.ts` 将所有 `FLOW_*` 视为可读审批详情，不再按标题猜页面。

### 7.3 审批详情

处理模式调用：

```http
GET /flow/flowComment/getFlowCommentInfo?id={instanceId}&commentId={commentId}
```

只读模式调用：

```http
GET /flow/flowComment/getFlowInfo?instanceId={instanceId}
```

页面分为：

- 当前审批：摘要、流程时间线、审批路线和沟通状态。
- 历史驳回：优先按版本加载历史，没有版本时展示节点 `backs`。
- 详细信息：流程参数、申请人、业务编号、可编辑授权字段和业务页面入口。

人员统一显示为 `姓名(账号)`。人员查询失败时保留账号，不阻断流程详情。

### 7.4 处理按钮的真实判断

页面可处理必须同时满足：

```text
flowMode = handle
AND 详情接口 handle = true
AND flowComment.handled != true
AND 页面不在加载中
```

在此基础上：

- 当前为起始节点、不是加签意见且没有沟通中任务：显示“重新发起”。
- 普通审批节点：显示“通过 / 驳回”，并可发起沟通、加签、转审。
- 沟通中：发起人可取消沟通；待反馈的沟通参与人可提交意见。
- 已处理、后端无权限、只读模式均不显示处理按钮。

因此不能再用“只有 `FLOW_COMMENTS` 才有按钮”作为判断；最终以模板模式、后端 `handle` 和意见处理状态共同决定。

### 7.5 审批动作

| 动作         | 校验                                   | 接口                                            |
| ------------ | -------------------------------------- | ----------------------------------------------- |
| 通过         | 意见必填；支持“同意 / 已核实”          | `PUT /flow/flowComment/approve`                 |
| 驳回         | 意见必填                               | `PUT /flow/flowComment/refuse`                  |
| 重新发起     | 意见必填；复用通过接口并携带可编辑字段 | `PUT /flow/flowComment/approve`                 |
| 发起沟通     | 至少选择一人；意见必填                 | `POST /flow/flowInstanceCommentTalk/startTalk`  |
| 提交沟通意见 | 意见必填                               | `POST /flow/flowInstanceCommentTalk/commitTalk` |
| 取消沟通     | 二次确认                               | `POST /flow/flowInstanceCommentTalk/cancelTalk` |
| 加签         | 可多选；意见必填                       | `POST /flow/flowInstance/addSignature`          |
| 转审         | 单选；意见必填                         | `PUT /flow/flowComment/relay`                   |

动作成功后：

- 已打开过消息中心时刷新列表与计数。
- 驳回且存在 `returnUrl` 时，可在短暂提示后进入业务子应用。
- 消息中心刷新失败不回滚已成功的审批动作。

## 8. 钉钉消息直达

### 8.1 普通业务消息

标准中转地址：

```text
https://{domain}/mbase/relay.html
  ?redirect_url={encodeURIComponent(同源且已注册的子应用完整URL)}
```

链路：

```text
钉钉通知
  -> /mbase/relay.html
  -> 校验同源、http(s)、APP_PATHS
  -> /mbase/?redirect_url=...
  -> 钉钉免登 / token 校验 / 公司加载
  -> dingtalk-redirect
  -> 子应用 webview
```

### 8.2 `FLOW_COMMENTS`

标准地址：

```text
https://{domain}/mbase/relay.html
  ?target=flow
  &provider=platform
  &templateCode=FLOW_COMMENTS
  &id={flowInstanceId}
  &commentId={flowCommentId}
  &messageId={oaMessageId}
  &returnUrl={encodeURIComponent(移动业务URL)}
```

参数说明：

| 参数                | 是否必需     | 用途                       |
| ------------------- | ------------ | -------------------------- |
| `target=flow`       | 推荐         | 明确进入 FLOW 解析         |
| `provider=platform` | 推荐         | 审批提供方，预留泛微       |
| `templateCode`      | 必需         | 模板策略                   |
| `id`                | 处理模式必需 | 流程实例 ID                |
| `commentId`         | 处理模式必需 | 审批意见 ID                |
| `messageId`         | 推荐         | 消息追踪和后续状态联动     |
| `returnUrl`         | 按场景       | 驳回后或非标准通知跳业务页 |
| `businessType`      | 仅兼容       | 当前安全域 `101` 过渡判断  |

### 8.3 外部入口当前差异

`public/relay.html` 当前只把 `FLOW_COMMENTS` 直接交给基座审批详情。其它 `FLOW_*`：

- 命中 `businessType=101` 临时规则时跳安全子应用。
- 否则要求提供 `returnUrl` 并跳已注册子应用。
- 缺少地址时显示配置错误。

而基座内部 `message-router.ts` 会优先把所有具有可解析流程参数的 `FLOW_*` 打开为审批详情。两条入口当前并未完全同策，项目验收时必须分别测试，见第 10 节。

### 8.4 当前安全域过渡

| 条件                             | 临时目标                     |
| -------------------------------- | ---------------------------- |
| `FLOW_COMMENTS&businessType=101` | `/mbase/aq/message?tab=todo` |
| `FLOW_REFUSE&businessType=101`   | `/mbase/aq/ehs/work-license` |

该规则同时存在于部分入口代码中，但执行优先级并不完全一致，只用于生产过渡，不得复制到其它业务域。后端补齐标准流程参数和移动业务地址、完成 UAT 后应删除。

## 9. 架构与代码职责

### 9.1 分层

```text
业务服务
  -> OAMS 模板 / 消息记录 / 状态
  -> /listMy
  -> message store
  -> 消息中心页面
      ├─ FLOW -> 移动审批详情
      └─ 普通业务 -> 已注册子应用 webview

OAMS
  -> RocketMQ 终端主题
      ├─ DingTalkPersonal
      ├─ DingTalk
      └─ WeCom

前台轻量计数轮询
  -> FLOW 新消息候选
  -> 顶部提醒
  -> 复用 message-router
```

### 9.2 移动端模块

| 模块                                              | 职责                                                       |
| ------------------------------------------------- | ---------------------------------------------------------- |
| `src/pages/message/index.vue`                     | 消息列表、分类、状态、搜索、日期、批量、置顶和配置错误诊断 |
| `src/stores/modules/message.ts`                   | 列表、分页、计数、筛选和状态动作                           |
| `src/api/modules/message.ts`                      | OAMS 消息接口                                              |
| `src/utils/message-router.ts`                     | 消息中心与顶部提醒的统一点击入口                           |
| `src/utils/flow-message.ts`                       | FLOW 参数、模式、审批路由和临时规则                        |
| `src/pages/approval/detail/index.vue`             | 移动审批详情、历史、沟通、加签、转审和重新发起             |
| `src/api/modules/approval.ts`                     | 审批详情和动作接口                                         |
| `src/api/modules/user.ts`                         | 人员查询与姓名解析                                         |
| `src/utils/portal-redirect.ts`                    | 同源校验、应用匹配、门户参数注入                           |
| `src/config/portal-apps.ts`                       | 子应用注册表                                               |
| `src/services/message-reminder.ts`                | 前台轮询、基线、去重和退避                                 |
| `src/stores/modules/message-reminder.ts`          | 顶部提醒队列                                               |
| `src/components/global/C_MessageNotice/index.vue` | 顶部提醒展示和点击                                         |
| `src/utils/dingtalk-redirect.ts`                  | 钉钉参数捕获、SSO 后消费和跳转                             |
| `public/relay.html`                               | 钉钉静态中转、第一层白名单和 FLOW 分流                     |

### 9.3 PC 端能力边界

| 能力            | 职责                                                         |
| --------------- | ------------------------------------------------------------ |
| 消息模板管理    | 维护模板、业务类型、消息类型、图标、推送端及参数             |
| 推送端管理      | 维护站内、钉钉等终端及其参数定义                             |
| PC 消息中心     | 展示业务分类和未读、已读、待办、已办四类状态                 |
| PC 消息详情加载 | 按 `showUrl` 打开 `flowHandle/flowViewer` 等已注册的详情组件 |

### 9.4 OAMS 关键行为

- 发送时先读取模板，再由 Builder 非空值覆盖。
- 每个接收人生成一条消息记录。
- 模板终端参数与本次 `detailList` 合并，本次值覆盖模板值。
- 待办初始化为 `handled=false, hasRead=null`。
- 讯息初始化为 `hasRead=false, handled=null`。
- 消息记录先保存，再异步投递外部终端。
- `/listMy` 只查询当前登录人，并按 `pc` 终端过滤。
- 列表层将国际化编码解析为实际标题与内容。

### 9.5 WebSocket 演进

未来可用 WebSocket 替换轮询事件来源，但不改变消息事实源：

```json
{
  "messageId": "OA_MESSAGE_ID",
  "tempNo": "FLOW_COMMENTS",
  "type": "2",
  "resourceType": "2",
  "createDateTime": "2026-07-23 10:30:00"
}
```

前端收到事件后按 `messageId` 拉取记录或调用 `notifyMessageReminder(record)`，继续复用提醒队列和 `message-router`。WebSocket 断开时降级为当前前台轮询。

## 10. 当前实现限制与改进建议

以下内容是代码核对后的真实现状，不应写成已完成能力。表中优先级仅供项目排期和范围评估参考，不代表统一的上线门禁要求。

| 建议优先级 | 现状                                                                           | 影响                                                      | 改进建议                                       |
| ---------- | ------------------------------------------------------------------------------ | --------------------------------------------------------- | ---------------------------------------------- |
| P0         | OAMS 列表实体可能返回含终端密钥的 `detailList`                                 | 客户端抓包可能看到钉钉凭据                                | 改列表 DTO 或 JSON 忽略后再上线外部终端        |
| P0         | 标准 OAMS 实体没有 `returnUrl/mobileBusinessUrl`                               | 普通业务 PC 与移动详情地址可能冲突                        | 扩展后端字段与表结构                           |
| P1         | 钉钉发送器直接使用 PC `showUrl`，不自动生成 relay URL                          | `flowHandle?...` 等 PC 组件路径在钉钉中不能正确直达移动端 | 增加终端专用点击地址或服务端 URL 构造          |
| P1         | `relay.html` 只直达 `FLOW_COMMENTS`，内部路由可查看所有 `FLOW_*`               | 外部与内部点击策略不完全一致                              | 统一策略并做双入口回归                         |
| P1         | `relay.html` 与 `flow-message.ts` 的安全域临时规则执行顺序不同                 | 同一消息可能从不同入口落到不同页面                        | 迁移标准参数后删除临时规则                     |
| P1         | 通知设置页未被提醒服务读取                                                     | 开关、免打扰和按应用订阅不生效                            | 接入 `portal_notif_prefs` 后再开放入口         |
| P1         | 顶部提醒只提醒 `FLOW_*`                                                        | 普通业务新消息无顶部弹层                                  | 由产品确认是否扩展模板范围                     |
| P1         | `/listMy` 固定使用 `pc` 终端                                                   | “移动终端”概念与实际配置不一致                            | 文档和模板统一把 `pc` 解释为站内终端           |
| P1         | 状态计数接口未按 `pc` 终端过滤，但列表会过滤                                   | 钉钉专属消息可能计入角标却不出现在列表                    | 计数与列表统一终端条件                         |
| P1         | “全部”分类一键已读传 `resourceType=all`，PUT Body 与后端 RequestParam 也不一致 | 操作提示成功但实际可能未更新                              | 全部分类传空参数，并统一请求参数位置           |
| P1         | 未读讯息在路由成功前先标已读                                                   | 地址配置错误时也可能进入已读                              | 路由校验成功后再标已读，或明确产品规则         |
| 按需       | 个人通道直接把 `userNo` 当 userid                                              | 允许并启用个人通道的项目中，账号不一致时无法送达          | 确需个人通道时建立服务端账号映射；华新不适用   |
| P1         | 移动 API 封装了 `/removeBatch`，当前服务端未提供该接口                         | 后续启用删除功能会 404                                    | 删除未使用封装或补齐服务端接口                 |
| P2         | 消息模块没有自动化测试                                                         | 路由和状态规则依赖人工回归                                | 增加 store、flow-message、portal-redirect 单测 |
| P2         | `public/relay.html` 应用白名单与 `portal-apps.ts` 重复维护                     | 新应用容易漏配                                            | 构建时生成静态白名单或共享配置                 |

## 11. 使用说明：测试与业务验收

### 11.1 测试前准备

为每个场景准备：

- 一个测试模板。
- 一个接收用户；仅在允许并启用个人通道的项目中准备对应钉钉 userid。
- 一条 `type=1` 讯息。
- 一条 `type=2` 待办。
- 一条 `FLOW_COMMENTS`。
- 一条 `FLOW_REFUSE`。
- 一条只读 `FLOW_PASS`。
- 一个合法子应用地址。
- 一个缺参数或未注册地址的异常消息。

保留以下证据：

- 发送请求或业务事件 ID。
- `oa_message.id`、`tempNo`、`relativeId`、`terminals`。
- `/listMy` 响应。
- PC 和移动页面截图。
- 处理前后四状态计数。
- 钉钉消息截图和 OAMS/RocketMQ 日志。

### 11.2 核心主链路

| 编号    | 场景      | 操作                             | 预期                                 |
| ------- | --------- | -------------------------------- | ------------------------------------ |
| CORE-01 | 讯息发送  | 发送 `type=1`                    | PC 与移动未读均出现，钉钉按配置送达  |
| CORE-02 | 讯息阅读  | 从移动端打开                     | `hasRead` 变为 1，未读减 1，待办不变 |
| CORE-03 | 待办查看  | 打开 `type=2`                    | 仍为 `handled=0`                     |
| CORE-04 | 待办完成  | 在业务页完成并调用 `finish`      | 待办减 1，已办加 1                   |
| CORE-05 | FLOW 审批 | 打开 `FLOW_COMMENTS` 并通过      | 审批成功，消息与流程状态同步         |
| CORE-06 | FLOW 驳回 | 驳回后由发起人打开 `FLOW_REFUSE` | 满足权限时显示重新发起               |
| CORE-07 | 外部直达  | 点击钉钉 `FLOW_COMMENTS`         | 免登后进入正确审批实例和 comment     |
| CORE-08 | 权限隔离  | 用非接收人访问消息 ID            | 后端拒绝或列表不可见                 |
| CORE-09 | 凭据保护  | 抓取 `/listMy`                   | 响应不包含外部终端密钥               |
| CORE-10 | 公司权限  | 修改 URL 中 `companyId`          | 子应用后端拒绝越权                   |

### 11.3 消息中心功能

1. 全部、审批流、通用业务分类计数正确。
2. 未读、已读、待办、已办与数据库状态一致。
3. 标题和内容都能被搜索。
4. 日期起止边界包含当日 `00:00:00` 到 `23:59:59`。
5. 下拉刷新、加载更多和无数据空态正常。
6. 置顶后重新进入仍在前面，取消置顶恢复。
7. 修复参数问题后，一键已读只影响当前分类的讯息；修复前记录为已知缺陷。
8. 批量已读只处理已选未读讯息。
9. 点开待办不误改已办。
10. 配置错误弹层可复制完整诊断信息。

### 11.4 FLOW 详情

1. `flowHandle` 同时带 `id/commentId` 时进入处理模式。
2. `flowViewer` 带 `id` 时进入只读模式。
3. 缺 `id` 提示审批参数缺失。
4. 处理模式缺 `commentId` 提示审批参数缺失。
5. 详情展示当前审批、历史驳回和详细信息。
6. 有版本时可切换历史版本；无版本时展示节点 `backs`。
7. 通过、驳回和重新发起校验必填意见。
8. 沟通、加签和转审校验人员选择与单/多选规则。
9. 后端 `handle=false` 或 comment 已处理时不显示动作。
10. 人员接口失败时保留账号，页面仍可查看。

### 11.5 顶部提醒

1. 首次登录不弹历史消息。
2. 非消息中心页面新增 `FLOW_*` 后，在轮询窗口内弹出。
3. 同一消息关闭、页面切换或网络重试后不重复弹。
4. 点击未读讯息提醒后才标已读。
5. 点击待办提醒不标已办。
6. 消息中心页面、后台、访客和未登录状态不弹。
7. 连续消息按队列展示，不遮挡页面关键操作。
8. 当前通知设置开关不会改变提醒行为，记录为已知限制而非测试失败。

### 11.6 钉钉真机

1. 清理钉钉缓存后首次点击，能重新免登，不使用旧 token 快跳。
2. 已登录冷启动仍消费本次 `redirect_url`，不先落工作台。
3. 弱网或免登失败时给明确提示，可重新进入。
4. 普通地址跨域或不在 `APP_PATHS` 时被拦截。
5. `FLOW_COMMENTS` 缺 `id/commentId` 时显示模板配置错误。
6. 仅对允许并启用个人通道的项目，验证钉钉工作通知接收人与内部账号映射；华新客户跳过此项。
7. token 失效时服务端刷新并重试一次。
8. 钉钉送达但消息中心不存在时，检查模板是否漏选 `pc`。

### 11.7 设备矩阵

| 终端          | 必测内容                               |
| ------------- | -------------------------------------- |
| 普通浏览器 H5 | 列表、搜索、日期、审批、子应用 webview |
| 钉钉 H5       | 免登、外部直达、缓存清理、返回行为     |
| 微信小程序    | 消息页、审批详情、底部弹层、人员选择   |
| App           | 消息页、审批详情、窄屏和返回栈         |
| PC            | 同一消息记录和状态与移动端一致         |

## 12. 使用说明：排障手册

### 12.1 钉钉收到，但消息中心没有

按顺序检查：

1. 模板是否勾选 `pc`。
2. `oa_message.terminals` 是否实际包含 `"pc"`。
3. `/oams/oaMessage/listMy` 的登录用户是否与 `userNo` 一致。
4. 当前分类、状态和日期筛选是否过滤了消息。
5. 消息是讯息还是待办，是否查询错状态。

### 12.2 消息中心有，但钉钉没收到

1. 模板是否选 `DingTalkPersonal` 或 `DingTalk`。
2. `detailList` 是否生成对应终端参数。
3. 对应钉钉终端的 RocketMQ 消费是否异常。
4. AppKey、AppSecret、AgentId 或 Webhook 是否有效。
5. 仅在项目允许并启用个人通道时，检查 `userNo` 是否等于钉钉 userid；不一致时检查服务端账号映射。
6. 钉钉接口返回的 `errcode/errmsg`。
7. `showUrl` 是否已经是可在钉钉中打开的完整 relay URL；当前发送器不会自动包装。

### 12.3 消息打开后仍是待办

这是正确行为。只有业务动作成功并调用：

```text
finish(relativeId, relativeType)
```

才会变为已办。继续检查发送与完成使用的 `relativeId/relativeType` 是否一致。

### 12.4 点击消息提示配置错误

FLOW：

- 检查 `tempNo` 是否以 `FLOW_` 开头。
- 检查 `showUrl` 或消息参数是否含 `id`。
- 处理模式检查 `commentId`。
- 检查流程实例和 comment 是否属于当前用户。

普通业务：

- 检查 `returnUrl/mobileBusinessUrl/showUrl`。
- 地址是否同源。
- 路径是否命中 `portal-apps.ts` 的 `mpPath`。
- 钉钉入口是否也加入 `relay.html` 的 `APP_PATHS`。

### 12.5 顶部提醒不弹

1. 当前是否第一次启动；第一次只建基线。
2. 是否为 `FLOW_*`；普通业务当前不提醒。
3. 用户是否已登录且非访客。
4. 应用是否在前台、页面是否可见。
5. 当前是否正位于消息中心。
6. 消息 ID 是否已进入本机去重集合。
7. 等待当前 60/90/180 秒轮询周期。

不要通过切换“通知设置”判断提醒服务，当前设置尚未接入。

### 12.6 PC 能打开，移动端不能

- PC `showUrl` 可能只是组件名，例如 `someBusinessDetail?id=1`。
- 移动端普通业务要求同源、以 `/` 开头且匹配已注册子应用。
- FLOW 的 `flowHandle/flowViewer` 可以由移动端专门解析，普通业务组件名不可以。
- 为普通业务补充 `mobileBusinessUrl/returnUrl`，不要增加按标题猜页面的前端硬编码。

## 13. 接口附录

### 13.1 消息中心

业务分类：

```http
GET /system/dictDtl/list
  ?current=1
  &size=-1
  &dictId=BJ0MOBIHM057ELODU677Q4MP1IJPPGJI
```

列表：

```http
GET /oams/oaMessage/listMy?hasRead=0&type=1&current=1&size=15&total=0
GET /oams/oaMessage/listMy?hasRead=1&type=1&current=1&size=15&total=0
GET /oams/oaMessage/listMy?handled=0&type=2&current=1&size=15&total=0
GET /oams/oaMessage/listMy?handled=1&type=2&current=1&size=15&total=0
```

可追加：

```text
resourceType
title
beginDate
endDate
```

计数：

```http
GET /oams/oaMessage/allRelativeMsgStatusNumber
GET /oams/oaMessage/allMsgStatusNumber
GET /oams/oaMessage/allMsgStatusNumber?resourceType={resourceType}
```

用户动作：

```http
POST /oams/oaMessage/readBatch
PUT  /oams/oaMessage/allRead?resourceType={resourceType}
PUT  /oams/oaMessage/star?id={messageId}
PUT  /oams/oaMessage/unStar?id={messageId}
```

服务端提供 `finishBatch`，但当前移动消息页不把“打开待办”作为完成动作。移动 API 中虽有 `/removeBatch` 封装，当前服务端未提供对应接口，且当前页面未使用。

### 13.2 业务发送与生命周期

```http
POST   /oams/oaMessage/send
POST   /oams/oaMessage/finish?relativeId={id}&relativeType={type}
DELETE /oams/oaMessage/remove?relativeId={id}&relativeType={type}
POST   /oams/oaMessage/updateUserNo
```

### 13.3 审批

```http
GET  /flow/flowComment/getFlowCommentInfo?id={instanceId}&commentId={commentId}
GET  /flow/flowComment/getFlowInfo?instanceId={instanceId}
GET  /flow/personalFlow/getFlowHandleHistory?id={instanceId}&version={version}
GET  /flow/flowInstanceCommentTalk/getByCommentId?commentId={commentId}
POST /flow/flowInstanceCommentTalk/getByCommentIds
PUT  /flow/flowComment/approve
PUT  /flow/flowComment/refuse
POST /flow/flowInstanceCommentTalk/startTalk
POST /flow/flowInstanceCommentTalk/cancelTalk?commentId={commentId}
POST /flow/flowInstanceCommentTalk/commitTalk
POST /flow/flowInstance/addSignature
PUT  /flow/flowComment/relay
GET  /hrms/user/list?strNameOrAccount={keyword}&size=20
```

### 13.4 消息字段契约

| 字段                              | 用途                             | 当前服务端                |
| --------------------------------- | -------------------------------- | ------------------------- |
| `id`                              | OAMS 消息 ID、去重与追踪         | 已支持                    |
| `tempNo`                          | 模板编码和 FLOW 策略             | 已支持                    |
| `title/content`                   | 列表和外部通知展示               | 已支持                    |
| `type`                            | `1` 讯息、`2` 待办               | 已支持                    |
| `hasRead/handled`                 | 阅读和办理状态                   | 已支持                    |
| `resourceType`                    | 消息业务分类                     | 已支持                    |
| `relativeId/relativeType`         | 业务完成、删除、转办关联         | 已支持                    |
| `showUrl`                         | PC 详情；FLOW 参数；移动兼容地址 | 已支持                    |
| `terminals`                       | 站内与外部推送端                 | 已支持                    |
| `detailList`                      | 终端参数                         | 已支持，但列表必须脱敏    |
| `star/starTime`                   | 置顶                             | 已支持                    |
| `returnUrl/mobileBusinessUrl`     | 移动业务地址                     | mbase 已识别，OAMS 待扩展 |
| `businessType/domainCode/appCode` | 领域和过渡判断                   | mbase 已识别，OAMS 待扩展 |

## 14. 发布检查表与维护边界

### 14.1 发布检查表

- [ ] 模板编码、类型和业务分类已评审。
- [ ] 正式模板已选 `pc`。
- [ ] 外部终端参数已通过服务端验证且不会返回客户端。
- [ ] 普通业务移动地址已落到标准字段。
- [ ] FLOW 参数包含正确 `id/commentId`。
- [ ] `relativeId/relativeType` 的发送、完成和删除口径一致。
- [ ] 子应用同时注册到 `portal-apps.ts` 与 `relay.html`。
- [ ] PC 与移动端使用同一测试消息完成回归；配置钉钉通道时一并验证钉钉入口。
- [ ] 未读 / 已读与待办 / 已办没有混用。
- [ ] 异常地址、越权、弱网和重复发送已验证。
- [ ] 客户端响应和日志中不包含外部终端密钥。
- [ ] 项目经理、技术经理和测试负责人完成验收签字。

### 14.2 维护边界

- 不为每个业务域再建一套移动消息列表。
- 不把钉钉会话状态当作业务消息状态。
- 不新增“根据标题或模板猜页面”的临时前端规则。
- 不因用户打开待办就调用完成接口。
- 不把跨域或未注册地址降级到工作台。
- 不在客户端响应和日志中暴露终端密钥。
- 不让 `relay.html` 与内部路由长期维持两套模板策略。
- 新增子应用必须同步两处白名单。
- 模板、字段、接口、终端参数和路由变化必须同步更新本文。
