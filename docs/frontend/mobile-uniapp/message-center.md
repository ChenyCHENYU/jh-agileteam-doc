# 移动端消息中心架构设计

> 对应项目：移动端门户（wl-mbase）。本文是 mbase 移动端消息中心的权威说明，覆盖消息分类、审批流策略、全局提醒、接口约定和验证流程。
>
> 消息中心是基座的**独立一级能力**，不是钉钉消息卡片的附属页面。

---

## 一、定位

钉钉、未来泛微、基座首页入口、子应用入口都只是进入消息体系的不同入口，最终复用同一套消息列表、消息路由、状态同步和审批详情能力。

核心目标：

- 移动端覆盖 PC 消息中心核心能力：全部 / 审批流 / 通用业务，未读 / 已读 / 待办 / 已办，搜索、筛选、刷新、分页、计数、置顶、批量已读
- FLOW 类消息进入统一的流程详情能力；只有真正待审批的 `FLOW_COMMENTS` 展示处理按钮
- 普通业务消息、驳回通知、审批结束通知等按消息记录携带的移动端业务地址跳转子应用
- 外部消息卡片与内部消息中心点击使用同一套路由判断，保证状态和跳转一致

---

## 二、入口与路由

### 2.1 内部入口

基座内部从首页、快捷入口或消息角标进入：

```text
消息中心 → OAMS 消息列表 → message-router → 审批详情 / 子应用页面 / 配置错误提示
```

内部点击消息时：

- `type=1` 讯息类消息打开前可标记已读
- `type=2` 待办类消息不能因查看改成已办，只有业务处理完成后才由后端更新 `handled`
- 缺少必要地址或参数时留在消息中心，展示配置错误提示

### 2.2 钉钉入口

标准入口通过 `relay.html`，由钉钉入口处理器消费：

```text
dingtalk://...redirect_url={encodeURIComponent(https://domain/mbase/relay.html?...)}
relay.html → /mbase/ → dingtalk-redirect → 审批详情 / 子应用页面 / 配置错误提示
```

外部入口由 `dingtalk-redirect.ts` 负责 SSO 后消费，内部消息由 `message-router.ts` 负责点击处理。两者共同复用 `flow-message.ts` 的 FLOW 模板策略和同源子应用校验规则。

### 钉钉卡片推荐参数

| 参数 | 说明 |
|------|------|
| `target=flow` | 标识流程消息 |
| `provider=platform` | 流程提供方 |
| `templateCode=FLOW_COMMENTS` | FLOW 模板编码 |
| `id={flowInstanceId}` | 流程实例 ID |
| `commentId={flowCommentId}` | 流程评论 ID |
| `messageId={oaMessageId}` | 消息 ID（建议后端补充，便于状态同步） |
| `returnUrl={mobileBusinessUrl}` | 非基座审批处理类消息的移动端业务地址 |
| `businessType={domainCode}` | 仅用于过渡兼容或领域校验 |

---

## 三、消息分类与状态

### 业务分类

来自字典 `businessType`：

| resourceType | 含义 |
|---|---|
| `2` | 审批流 |
| `1` | 通用业务 |
| `all` | 全部 |

### 状态维度

| 状态 | 条件 | 说明 |
|------|------|------|
| 未读 | `type=1&hasRead=false` | 讯息阅读状态 |
| 已读 | `type=1&hasRead=1` | 讯息阅读状态 |
| 待办 | `type=2&handled=0` | 办理状态 |
| 已办 | `type=2&handled=1` | 办理状态 |

::: warning 状态不能混用
未读/已读属于**讯息阅读状态**，待办/已办属于**办理状态**。查看待办消息不会改为已办，只有业务处理完成后才由后端更新 `handled`。
:::

---

## 四、审批流消息策略

### 4.1 模板策略

| 模板编码 | 行为 |
|---------|------|
| `FLOW_COMMENTS` | 新的待审批通知 → 基座审批详情，接口返回可处理时展示「通过/驳回/沟通/加签/转审」 |
| `FLOW_REFUSE` | 流程被驳回 → 跳转业务子应用处理页；消息中心内可只读查看流程详情 |
| `FLOW_PASS` | 只读消息，展示流程信息或按业务地址跳子应用 |
| `FLOW_RECALL` | 只读消息 |
| `FLOW_CC` | 只读抄送通知 |
| `FLOW_OTHERS_REFUSE` | 只读，他人驳回通知 |
| `FLOW_OTHERS_PASS` | 只读，他人通过通知 |
| 其它 `FLOW_*` | 默认只读，必须由消息记录提供 `returnUrl/mobileBusinessUrl` |

### 4.2 审批详情能力

移动端详情采用分段结构：

| 段 | 内容 |
|----|------|
| 当前审批 | 流程时间线、当前沟通状态、审批路线 |
| 历史驳回 | 优先展示版本历史接口返回；无版本时展示节点 backs 驳回记录；无数据时空态 |
| 详细信息 | 流程表单字段、申请人、业务编号、业务页面入口 |

人员展示统一为 `姓名(账号)`，例如 `超级管理员(admin)`。人员接口不可用时保留账号，不阻断审批主流程。

### 4.3 操作按钮

| 操作 | 校验 | 说明 |
|------|------|------|
| 通过 | 必填审批意见 | 支持快捷意见「同意/已核实」 |
| 驳回 | 必填驳回意见 | 提交成功后如有 `returnUrl` 可跳转业务子应用 |
| 沟通 | 选择沟通人 | 发起后可取消沟通；参与人可提交沟通意见 |
| 加签 | 选择一个或多个被加签人 | 必填加签意见 |
| 转审 | 单选被转审人 | 必填转审意见 |

> 按钮只在 `FLOW_COMMENTS` 且详情接口返回可处理时展示。已办、已读、驳回通知、抄送通知均**不展示处理按钮**。

---

## 五、子应用跳转原则

子应用跳转必须来自后端消息记录携带的移动端业务地址，**优先级**：

1. `returnUrl`（最优）
2. `mobileBusinessUrl`
3. `showUrl`（兼容历史）

前端只做领域校验和 webview 参数注入，**不根据标题或模板硬猜页面**。地址未配置或未匹配到已注册子应用时，展示配置错误提示，**不进入工作台**。

---

## 六、生产过渡方案

以下规则仅用于安全域生产过渡。待后端模板补齐标准移动端地址、业务子应用完成迁移并通过 UAT 回归后删除：

| 条件 | 临时目标 |
|------|---------|
| `FLOW_COMMENTS & businessType=101` | `/mbase/aq/message?tab=todo` |
| `FLOW_REFUSE & businessType=101` | `/mbase/aq/ehs/work-license` |

::: warning 不得扩展
在此之前保持兼容，但不得继续新增同类临时硬编码规则。
:::

---

## 七、全局消息提醒层

全局消息提醒是消息中心的**轻量触达层**，不是独立消息体系。它只负责把关键新消息推到用户眼前，数据归属、状态同步和点击跳转仍以消息中心为准。

### 轮询策略

当前采用前台自适应轮询（`src/services/message-reminder.ts`）：

| 条件 | 间隔 |
|------|------|
| 启动延迟 | 1200ms（首次只建立 baseline，不弹历史） |
| 有新消息后 | 60s（活跃轮询） |
| 正常态 | 90s |
| 长时间无变化 | 180s（退避） |
| 接口失败 | 180s（退避） |

**启停条件**：

- 只在用户已登录、应用前台、非访客模式时启动
- 应用切后台、标签页隐藏、页面不可见时暂停
- 用户位于消息中心页面时不弹全局提醒，避免和列表刷新互相打扰

### 去重策略

- 使用 `messageId/id` 去重，同一消息不会因页面切换、HMR、网络重试重复弹出
- 最多记录 80 个已知 ID（`MAX_KNOWN_IDS`）
- 轮询先刷新轻量计数，只有计数变化或间隔探测到期时才拉 5 条候选消息

### 提醒展示策略

| 模板编码 | 提醒色 |
|---------|--------|
| `FLOW_REFUSE` / `FLOW_RECALL` | 危险色（驳回/撤回） |
| `FLOW_PASS` / `FLOW_OTHERS_PASS` | 成功色（通过） |
| `FLOW_COMMENTS` | 主色（新待审批） |
| 其它 `FLOW_*` | 提醒色（流程通知） |

提醒弹出不自动标已读；用户点击提醒并进入消息详情或业务页面后，才按消息中心既有规则同步阅读状态。点击提醒**必须复用 `message-router`**，不另写跳转规则。

### 未来实时化方向

统一为 WebSocket：

```text
后端推送轻量事件 { messageId, tempNo, type, resourceType, createDateTime }
  → 前端收到后调用 notifyMessageReminder(record) 或按 messageId 拉单条详情
  → 进入同一套提醒队列
```

WebSocket 只替换事件来源，不改变消息中心 store、提醒组件、审批详情和消息路由。断开或鉴权失败时自动降级为当前前台轮询。

---

## 八、前端模块清单

| 模块 | 文件 | 职责 |
|------|------|------|
| 消息中心页面 | `src/pages/message/index.vue` | 分类/状态/搜索/筛选/分页/计数/批量选择/置顶 |
| 消息状态管理 | `src/stores/modules/message.ts` | 分类、状态、分页、计数、批量选择、置顶 |
| 消息接口 | `src/api/modules/message.ts` | OAMS 消息接口封装 |
| 消息路由 | `src/utils/message-router.ts` | 统一消息路由（内部入口） |
| 钉钉跳转 | `src/utils/dingtalk-redirect.ts` | 钉钉外部消息参数捕获、SSO 后消费和跳转 |
| FLOW 策略 | `src/utils/flow-message.ts` | FLOW 模板策略 |
| 门户跳转校验 | `src/utils/portal-redirect.ts` | 同源子应用地址校验与门户参数注入 |
| 审批详情 | `src/pages/approval/detail/index.vue` | 审批详情、历史驳回、详细信息、审批动作 |
| 审批接口 | `src/api/modules/approval.ts` | 流程详情、历史驳回、审批动作、沟通、加签、转审 |
| 人员接口 | `src/api/modules/user.ts` | 沟通、加签、转审使用的人员查询 |
| 全局提醒组件 | `src/components/global/C_MessageNotice/index.vue` | 顶部消息提醒 |
| 提醒状态 | `src/stores/modules/message-reminder.ts` | 提醒展示队列和当前状态 |
| 提醒服务 | `src/services/message-reminder.ts` | 轮询、baseline、去重、退避、WebSocket 接入点 |
| 中转页 | `public/relay.html` | 钉钉外部入口转交 SPA |

---

## 九、接口附录

### 9.1 消息中心

**业务分类**：

```http
GET /system/dictDtl/list?current=1&size=-1&dictId=BJ0MOBIHM057ELODU677Q4MP1IJPPGJI
```

**消息列表**（四状态）：

```http
GET /oams/oaMessage/listMy?hasRead=false&title=&type=1&current=1&size=15&total=0   # 未读
GET /oams/oaMessage/listMy?hasRead=1&title=&type=1&current=1&size=15&total=0       # 已读
GET /oams/oaMessage/listMy?handled=0&title=&type=2&current=1&size=15&total=0       # 待办
GET /oams/oaMessage/listMy?handled=1&title=&type=2&current=1&size=15&total=0       # 已办
```

可追加：`resourceType=2`（审批流）/ `resourceType=1`（通用业务）/ `beginDate` / `endDate`（日期筛选）

**计数**：

```http
GET /oams/oaMessage/allRelativeMsgStatusNumber       # 全部计数
GET /oams/oaMessage/allMsgStatusNumber               # 各状态计数
GET /oams/oaMessage/allMsgStatusNumber?resourceType=2 # 审批流计数
GET /oams/oaMessage/allMsgStatusNumber?resourceType=1 # 通用业务计数
```

**全局提醒轻量轮询**：

```http
GET /oams/oaMessage/allMsgStatusNumber
GET /oams/oaMessage/listMy?handled=0&type=2&current=1&size=5&total=0
GET /oams/oaMessage/listMy?hasRead=0&type=1&current=1&size=5&total=0
```

**动作**：

```http
POST /oams/oaMessage/readBatch          # 批量已读
POST /oams/oaMessage/finishBatch        # 批量已办
POST /oams/oaMessage/removeBatch        # 批量删除
PUT  /oams/oaMessage/allRead            # 全部已读
PUT  /oams/oaMessage/star?id={id}       # 置顶
PUT  /oams/oaMessage/unStar?id={id}     # 取消置顶
```

### 9.2 审批详情

**流程详情**：

```http
GET /flow/flowComment/getFlowCommentInfo?id={instanceId}&commentId={commentId}
```

**历史驳回**：

```http
GET /flow/personalFlow/getFlowHandleHistory?id={instanceId}&version={version}
```

**流程沟通状态**：

```http
GET  /flow/flowInstanceCommentTalk/getByCommentId?commentId={commentId}
POST /flow/flowInstanceCommentTalk/getByCommentIds
```

**审批动作**：

```http
PUT  /flow/flowComment/approve                                                    # 通过
PUT  /flow/flowComment/refuse                                                     # 驳回
POST /flow/flowInstanceCommentTalk/startTalk                                      # 发起沟通
POST /flow/flowInstanceCommentTalk/cancelTalk?commentId={commentId}               # 取消沟通
POST /flow/flowInstanceCommentTalk/commitTalk                                     # 提交沟通意见
POST /flow/flowInstance/addSignature                                             # 加签
PUT  /flow/flowComment/relay?comment={意见}&relayUserNo={工号}&id={commentId}      # 转审
```

**人员选择**：

```http
GET /hrms/user/list?strNameOrAccount={keyword}&size=20
```

### 9.3 关键字段要求

消息单条记录建议稳定携带：

| 字段 | 说明 |
|------|------|
| `id` | 消息 ID |
| `tempNo` | 消息模板编码，如 `FLOW_COMMENTS` |
| `title` / `content` | 列表展示 |
| `type` | `1` 讯息 / `2` 待办 |
| `handled` / `hasRead` | 办理状态 / 阅读状态 |
| `resourceType` | 业务分类 |
| `relativeId` | 关联业务或待办 ID |
| `showUrl` | 兼容历史路径 |
| `returnUrl` / `mobileBusinessUrl` | 移动端最终业务地址 |
| `businessType` / `domainCode` / `appCode` | 领域标识 |
| `detailList` | 不同终端发送配置（不应依赖敏感字段做前端逻辑） |

---

## 十、验证流程

### H5 本地验证

1. 进入消息中心，验证分类、四状态、搜索、筛选、刷新、分页
2. 打开普通消息，确认已读状态刷新，不误改待办状态
3. 打开 `FLOW_COMMENTS`，确认进入审批详情并展示处理按钮
4. 打开 `FLOW_REFUSE/FLOW_PASS/FLOW_CC`，确认只读展示，不出现处理按钮
5. 打开缺少业务地址的消息，确认停留消息中心并提示配置问题
6. 审批详情验证当前审批、历史驳回、详细信息、审批路线
7. 验证通过、驳回、沟通、加签、转审的必填校验和失败提示
8. 在非消息中心页面等待新 `FLOW_*` 消息，确认顶部提醒只弹新增消息
9. 点击顶部提醒，确认复用消息路由进入审批详情或子应用

### 钉钉真机验证

1. 后端推送标准 `FLOW_COMMENTS` 卡片，确认免登后直达目标页面
2. 清理钉钉缓存后首次进入，确认不会因旧 token 抢跑出现会话超时
3. 网络较差时，确认登录失败重试后有明确提示
4. 验证临时 `businessType=101` 跳转仍可用，但不新增同类规则

### 小程序 / App 验证

1. 消息中心页面可正常打开、返回、刷新、搜索
2. 审批详情可正常查看三段信息
3. 操作按钮、人员选择、底部弹层在窄屏下不遮挡内容

---

## 十一、维护边界

- 不新增「按模板猜页面」的临时规则
- 不把消息状态和业务办理状态混用
- 不让配置错误降级到工作台
- 不让外部入口和内部入口各自维护一套路由逻辑
- 文档、接口字段和模板参数变更必须同步更新本文
