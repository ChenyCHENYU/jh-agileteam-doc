# 流程管理

> 系统管理 → 流程管理

JH4J-CODE 平台自研流程引擎，支持动态审批人、会签非会签、版本化管理、转办、数据权限等流程功能，提供自定义监听事件、抄送、分支判断等扩展。

---


![名词解释](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/01.png)
## 名词解释

| 术语 | 说明 |
|------|------|

![流程图](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/02.png)
| 流程模板 | 包含流程编码、名称、参数、表单、流程图等信息，是一种业务类型的流程集合 |
| 流程参数 | 对流程实例的数据描述，用户发起流程时将业务数据传递给流程引擎 |
| 流程表单 | 查看/处理审批页面中的表单 |
| 流程图 | 描述流程流转方向，谁来审批、审批后回调、驳回后回调等 |

![流程发起](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/17.png)
| 流程实例 | 流程发起后生成，有唯一的流程号 |

---

## 流程模板管理

> 系统管理 → 流程管理 → 流程模板管理


![创建流程模板](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/03.png)
### 创建流程模板

| 字段 | 说明 |
|------|------|
| 流程编码 | 一般为表名 + `Apply`，如请假表 `oa_leave` → `oa_leave_apply` |
| 流程名称 | 自定义 |
| 抄送人 | 流程审批完成后抄送给一个或多个人 |
| 撤回 RPC | 发起人撤回操作后的事件处理 |
| 终止 RPC | 发起人终止操作后的事件处理 |
| 驳回事件 | 驳回至发起人后的事件处理 |
| 模型 | 绑定相关模型 |

![流程详情](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/22.png)
| 详情组件 | 流程详情面板渲染内容（低代码配置形式），需对外提供 `initFlow` 方法 |

---


![流程模板参数](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/07.png)
## 流程模板参数

在流程基本信息面板的「参数配置」中添加、编辑、删除参数。

流程参数的数据类型和模型的逻辑类型一致。如选择了「用户」逻辑类型，表单设计中会自动生成用户挑选框组件。

---

## 流程表单设计

配置流程表单显示数据项，辅助审批人判断节点是否审批通过。

---

## 流程详情设计

流程详情配置采用低代码配置形式，流程详情组件必须对外提供 `initFlow` 方法（参数为流程参数）。

---

## 流程图

设计流程流转方向，包括审批节点、分支判断、回调等。

---

## 流程发起

填写流程表单数据，提交后生成流程实例，流转到第一个审批节点。

---

## 流程查看

查看流程实例的审批进度、当前节点、历史记录等。

---

## 常见调试

### 本地开发事件回调接口调试

**场景一：服务器可访问本地服务** — 无需任何配置。

**场景二：服务器不可访问本地服务**：

1. 下载 flow 服务 jar 包到 `D:\project\JH4J-CODE`
2. 启动：`java -jar -DNACOS_HOST={nacosId} -DAPP_NAME=JH4J-CODE-flow-{工号} -DNACOS_DISCOVERY_NAMESPACE=u`
3. 配置网关转发规则（编辑 `gateway.yml`）
4. 修改接口服务为 `JH4J-CODE-hrms-{工号}`（调试完后需改回主服务）

![填写必要参数](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/04.png)

![流程详情组件必须对外提供一个initFlow方法，其中par...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/05.png)
![在组件列表中创建一个流程详情组件（一般可以复制表单组件或者直...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/06.png)

![流程参数的数据类型和模型的逻辑类型一致，如：当选择了申请人逻...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/08.png)

![数据来源](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/09.png)

![在页面启动时，流程引擎会自动注入流程参数到this.form...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/10.png)

![从流程图形状来看，流程图节点分为：起始节点、审批节点和连接线...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/11.png)

![接口配置](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/12.png)

![接口规范：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/13.png)
![审批组配置](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/14.png)

![rpc配置](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/15.png)

![事件处理接口](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/16.png)

![启动类设置feign扫描。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/18.png)

![编写发起流程service代码。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/19.png)
![自定义流程详情两种模式](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/20.png)

![写Vue代码模式](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/21.png)

![data是在流程发起的时候传递的参数，如：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/23.png)
![人事管理](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/24.png)

