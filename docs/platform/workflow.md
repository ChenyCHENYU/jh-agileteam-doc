# 流程管理

> 系统管理 → 流程管理

JH4J-CODE 平台自研流程引擎，支持动态审批人、会签非会签、版本化管理、转办、数据权限等流程功能，提供自定义监听事件、抄送、分支判断等扩展，使得流程中无需干预，更加易用。

**审批流的作用**：节省员工时间提升效率、审批流程合规合理、提供决策依据、审批过程透明化便于监管、全程可留档可追溯。

一个完整的审批流操作流程图如下：

![完整审批流操作流程图](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/01.png)

---

## 名词解释

| 术语 | 说明 |
|------|------|
| 流程模板 | 包含流程编码、流程名称、流程参数、流程表单、流程图等信息，是一种业务类型的流程集合 |
| 流程参数 | 对流程实例的数据描述，用户在发起流程时将业务数据作为流程参数传递给流程引擎 |
| 流程表单 | 查看/处理审批页面中的表单 |
| 流程图 | 描述流程流转方向，谁来审批、审批后回调、驳回后回调等 |
| 流程实例 | 流程发起后生成一个流程实例，有唯一的流程号 |

流程参数有如下特性：在流程表单中显现；在流程图中用作条件分支判断、参与者选择、RPC 参数、接口参数等；流程详情的参数来源；在流程流转过程中审批人可修改流程参数；流程参数和业务数据相对独立。

流程表单是在查看审批、处理审批页面中的表单，如下图：

![流程表单示例](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/02.png)

---

## 流程模板管理

> 系统管理 → 流程管理 → 流程模板管理

管理员用户进入「系统管理」应用，在「流程管理」目录下「流程模板管理」菜单中打开流程模板管理页面。

![流程模板管理页面](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/03.png)

### 创建流程模板

在流程模板管理页面中，点击新增按钮，显示如下页面：

![新增流程模板](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/04.png)

**填写必要参数**

流程编码和流程名称，流程编码一般为表名 + `Apply`，如请假表 `oa_leave` 对应的流程编码为 `oa_leave_apply`。

**其他属性**

- **抄送人**：流程审批完成后抄送给一个或多个人
- **撤回 RPC**：发起人进行撤回操作后事件处理
- **终止 RPC**：发起人进行终止操作后事件处理
- **驳回事件**：驳回至发起人操作后事件处理
- **模型**：绑定相关模型
- **详情组件**：流程详情面板渲染的内容，这里的配置是采用低代码配置形式

详情组件的配置方式：在页面管理中，点击组件按钮（注意：该组件一般放置在对应的页面中，如：请假流程页面）。

![组件按钮入口](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/05.png)

流程详情组件必须对外提供一个 `initFlow` 方法，其中 `param` 为流程参数。

![initFlow 方法](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/06.png)

在组件列表中创建一个流程详情组件（一般可以复制表单组件或者直接复用表单组件作为流程详情）。

![组件列表创建流程详情](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/07.png)

---

## 流程模板参数

在流程基本信息面板中，参数配置属性是用来配置流程的参数的，提供添加、编辑、删除参数的功能：

![流程模板参数配置](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/08.png)

流程参数的数据类型和模型的逻辑类型一致。如：当选择了申请人逻辑类型为用户时，在后面的表单设计中会自动生成用户挑选框组件。

---

## 流程表单设计

配置流程表单显示数据项，显示流程中重要数据，辅助审批人判断节点是否审批通过。

### 样式配置

流程表单使用网格列做成了类似表格的样式，是在普通表单元素的基础上配置三处：最大宽度、高度、标签样式。一般情况下流程表单只需要显示流程中非常重要的几个字段即可。

![流程表单样式配置](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/09.png)

### 数据来源

每个流程都会生成自定义变量：流程参数变量、流程参数（在流程图节点中配置）是否只读变量，如下图所示：

![流程表单数据来源](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/10.png)

在页面启动时，流程引擎会自动注入流程参数到 `this.form` 和 `this.viewer` 变量中。

---

## 流程详情设计

配置流程详情显示数据项，显示流程详细数据。详细操作与流程表单设计功能一致。

---

## 流程图

对流程各节点属性、走向、扩展功能和相应规则进行配置。

在流程模板管理页面中，点击流程设计，进入流程图设计页面：

![流程图设计页面](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/11.png)

从流程图形状来看，流程图节点分为：起始节点、审批节点和连接线。

### 结束节点

结束节点通常用来配置监听流程审批结束（通过）后的事件。点击活动后事件绑定，选择接口类型，配置参数即可。

### 审批节点

流程节点用于配置：流程审批人、同意否决出口、数据权限、操作事件处理等。

### 连接线

连接线将各个节点串联，形成一个有向的、非环形的树形图，当出现条件分支时，可以配置连接线进行条件判断。

### 参与者配置

参与者可选择用户列表、RPC、接口、审批组、岗位进行配置：

![参与者配置](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/12.png)

**接口配置**：编写参与者接口，接口编写完成后通过接口收集功能收集接口。

![参与者接口代码](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/13.png)

接口规范：

![接口规范](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/14.png)

### 审批组配置

配置入口：系统管理 → 流程管理 → 审批组管理

列表页面：

![审批组管理列表](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/15.png)

### RPC 配置

配置入口：系统管理 → 流程管理 → RPC 管理

配置页面：

![RPC 管理配置页面](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/16.png)

### 事件处理接口

编写事件处理接口，其他操作同参与者接口。

![事件处理接口](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/17.png)

---

## 流程发起

对流程进行发起。

### 后端集成步骤

在 service 模块中引入 `flow-api`：

![引入 flow-api 依赖](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/18.png)

启动类设置 feign 扫描：

```java
@EnableFeignClients({"com.jhict.flow.api.feign"})
```

编写 `startFlow` 接口 controller：

![编写 startFlow controller](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/19.png)

编写发起流程 service 代码：

![编写发起流程 service 代码](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/20.png)

### 自定义流程详情两种模式

**低代码模式（推荐）**：

```java
query.setBusinessUrl("lowcode");
```

低代码模式固定 url 为 `lowcode`，注意这里不需要传递参数，流程引擎会自动调用详情组件的 `initFlow()` 方法，传递流程参数给组件。

![低代码模式配置](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/21.png)

**写 Vue 代码模式**：

```java
query.setBusinessUrl("hrms/user/flow-details.vue?id=" + id);
```

写代码方式需要指定 vue 文件路径，从 views 下开始计算路径，参数在组件 url 的后面追加。

---

## 流程查看

查看发起的流程相关信息。

### 流程查看全局组件

使用方式：

![流程查看全局组件](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/22.png)

### 流程详情

这里讲解写代码方式，低代码拖拽方式上面已经描述。编写 Vue 文件，模板如下：

![Vue 文件模板](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/23.png)

`data` 是在流程发起的时候传递的参数，如：

![data 参数示例](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/workflow/24.png)
