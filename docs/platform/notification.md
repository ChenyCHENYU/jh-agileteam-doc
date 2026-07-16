# 通知中心

> 通知中心服务名称为 JH4J-CODE-OAMS，提供消息推送端、系统通知模板、系统消息查询、消息发送等功能。

---

通知中心是微服务中的一个服务，服务名称为：JH4J-CODE-OAMS，该服务提供消息推送端、系统通知模板、系统消息查询、消息发送等功能。

推送端管理

系统默认提供两个消息推送端，分别为：PC端、企业微信端。用户可拓展更多推送端，拓展推送端在本章最后一节自定义消息推送端进行讲解。

配置消息推送端的基本信息和参数

需要配置或新增推送端时

消息推送端增删改查、设置参数

系统管理→通知配置→消息推送端

列表页面

消息推送端列表页面如下：

![新增推送端](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/01.png)

### 新增推送端

点击新增可在填写推送端基本信息后新增一个推送端：

![参数编辑](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/02.png)

### 参数编辑

选择一个推送端点击参数编辑按钮，可配置推送端的参数：

![消息模板](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/03.png)

### 消息模板

设置发送的消息模板，方便使用

需要发送固定格式的消息时

消息模板增删改查

系统管理→通知配置→系统通知模板

列表页面

系统内置了如下通知模板，包含审批流的消息待办模板等。

![新增编辑](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/04.png)

### 新增编辑

点击新增或编辑按钮，弹框显示如下：

![类型字段按照通知类型消息可以分为：讯息和待办。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/05.png)

类型字段按照通知类型消息可以分为：讯息和待办。

消息可以根据业务类型进行分类，业务类型可在数据字典中配置，字典的strSn为：businessType，如下图：

![短信内容中可按照系统内置消息模板进行配置，通过配置占位符形式进行自定义传参，参数](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/06.png)

短信内容中可按照系统内置消息模板进行配置，通过配置占位符形式进行自定义传参，参数在调用平台消息发送接口时传入。具体参考本章中消息发送章节。

消息查询

消息查询分为系统消息查询及个人通知中心，管理员可在系统消息查询页面进行系统中所有消息的查询，普通用户可在个人通知中心中查询与自己相关的消息

查询消息信息

查询消息信息

系统消息查询：系统管理员。

个人通知中心：普通用户

系统管理员或普通用户

系统消息查询：系统管理→通知配置→系统消息查询

个人通知中心：日常办公→协同办公→个人通知中心

列表页面

系统消息查询：

![个人通知中心：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/07.png)

个人通知中心：

![消息发送](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/08.png)

### 消息发送

### 发送消息

流程审批等需要发送消息的场景

发送消息

pom中引入通知中心sdk:

![开启oams的feign扫描：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/09.png)

开启oams的feign扫描：

在启动类中加注解：

@EnableFeignClients({com.jhict.oams.api.feign&quot;})

定义枚举：

![发送消息](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/10.png)

### 发送消息

![完成待办](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/11.png)

### 完成待办

当待办完成后，可以调用该接口标记待办完成

![自定义消息详情](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/12.png)

### 自定义消息详情

在消息发送的时候设置了setShowUrl('xxx.vue?id=xxx'），那么在vue文件中可以通过this.data.id读取到id参数，如：

![自定义消息推送端](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/13.png)

### 自定义消息推送端

增加消息推送端，满足个性化需求

平台自带的推送端不满足需求、需要扩展的时候

自定义消息推送端

新增消息推送端数据

消费主题：jhcloud_message_+推送端编码

![新增一个短信推送](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/14.png)

### 新增一个短信推送

### 实现消息消费

![流程管理](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/15.png)

![流程管理](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/16.png)

### 流程管理

流程引擎是指为提供流程处理而开发设计的底层支撑平台。它主要解决的是如何自动进行在多个参与者之间按照某种预定义的规则传递文档、信息或任务的过程，从而实现某个预期的业务目标，或者促使此目标的实现。JH4J-CODE平台自研流程引擎，支持动态审批人、会签非会签、版本化管理、转办、数据权限等流程功能，提供自定义监听事件、抄送、分支判断等扩展，使得流程中无需干预，更加易用。

审批流的作用：

节省员工时间，提升工作效率。

审批流程合规、合理。

提供强有力的决策依据。

审批过程透明化，便于监管。

全程可留档、可追溯。

一个完整的审批流操作流程图如下：

![名词解释](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/17.png)

### 名词解释

### 流程模板

流程模板包括：流程编码、流程名称、流程参数、流程表单、流程图等信息，是一种业务类型的流程集合。

流程参数

在流程模板编辑中，可以创建流程参数信息，流程参数是对流程实例的数据描述，用户在发起流程时将业务数据作为流程参数传递给流程引擎。

流程参数有如下特性：

在流程表单中显现。

在流程图中用作条件分支判断、参与者选择、RPC参数、接口参数等。

流程详情的参数来源。

在流程流转过程中，审批人可以修改流程参数。

流程参数和业务数据相对独立。

流程表单

流程表单是在查看审批、处理审批页面中的表单，如下图：

![流程图](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/18.png)

### 流程图

流程图描述了流程流转的方向，谁来审批、审批后回调、驳回后回调等。

流程实例

流程发起后生成一个流程实例，流程实例有唯一的流程号。

流程模板管理

配置管理流程模板

新增或修改流程模板时

提供新增流程模板和修改流程模板配置的功能

管理员用户进入“系统管理”应用，在“流程管理”目录下“流程模板管理”菜单中打开“流程模板管理”页面。

![创建流程模板](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/19.png)

### 创建流程模板

在流程模板管理页面中，点击新增按钮，显示如下页面：

![填写必要参数](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/20.png)

### 填写必要参数

流程编码和流程名称，流程编码一般为表名+Apply，如请假表：oa_leave对应的流程编码为：oa_leave_apply。

其他属性

抄送人：流程审批完成后抄送给一个或多个人。

撤回rpc：发起人进行撤回操作后事件处理。

终止rpc：发起人进行终止操作后事件处理。

驳回事件：驳回至发起人操作后事件处理。

模型：绑定相关模型。

详情组件：流程详情面板渲染的内容，这里的配置是采用低代码配置形式：

在页面管理中，点击组件按钮（注意：该组件一般放置在对应的页面中，如：请假流程页面）

![流程详情组件必须对外提供一个initFlow方法，其中param为流程参数。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/21.png)

流程详情组件必须对外提供一个initFlow方法，其中param为流程参数。

![在组件列表中创建一个流程详情组件（一般可以复制表单组件或者直接复用表单组件作为流](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/22.png)

在组件列表中创建一个流程详情组件（一般可以复制表单组件或者直接复用表单组件作为流程详情）。

![流程模板参数](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/23.png)

### 流程模板参数

### 配置流程的参数

### 新增或修改流程模板时

提供添加、编辑、删除流程模板参数功能

如下图所示，在流程基本信息面板中，参数配置属性是用来配置流程的参数的，提供添加、编辑、删除参数的功能：

![流程参数的数据类型和模型的逻辑类型一致，如：当选择了申请人逻辑类型为用户时，在后](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/24.png)

流程参数的数据类型和模型的逻辑类型一致，如：当选择了申请人逻辑类型为用户时，在后面的表单设计中会自动生成用户挑选框组件。

流程表单设计

配置流程表单显示数据项，显示流程中重要数据，辅助审批人判断节点是否审批通过。

配置流程表单显示数据项。

样式配置

流程表单使用网格列做成了类似表格的样式，是在普通表单元素的基础上配置三处：最大宽度、高度、标签样式。一般情况下流程表单只需要显示流程中非常重要的数据。能够在一定情况下让审批人判断是否通过与否。而在流程详情面板中则是可以提供流程的业务画面和数据，对审批人判断通过起到辅助作用。

![数据来源](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/25.png)

### 数据来源

每个流程都会生成自定义变量：流程参数变量、流程参数（在流程图节点中配置）是否只读变量，如下图所示：

![在页面启动时，流程引擎会自动注入流程参数到this.form和this.view](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/26.png)

在页面启动时，流程引擎会自动注入流程参数到this.form和this.viewer变量中。

流程详情设计

配置流程详情显示数据项，显示流程中详细数据

配置流程详情显示数据项。

详细操作与流程表单设计功能一致。

流程图

对流程各节点属性、走向、扩展功能和相应规则进行配置

提供对流程各节点属性、走向、扩展功能和相应规则配置功能

基本功能

在流程模板管理页面中，点击流程设计，进入流程图设计页面：

![从流程图形状来看，流程图节点分为：起始节点、审批节点和连接线。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/27.png)

从流程图形状来看，流程图节点分为：起始节点、审批节点和连接线。

结束节点

结束节点通常用来配置监听流程审批结束（通过）后的事件。点击活动后事件绑定，选择接口类型，配置参数即可。

审批节点

流程节点用于配置：流程审批人、同意否决出口、数据权限、操作事件处理等。

连接线

连接线将各个节点串联，形成一个有向的、非环形的树形图，当出现条件分支时，可以配置连接线进行条件判断。

参与者配置

参与者可选择用户列表、RPC、接口、审批组、岗位进行配置

![接口配置](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/28.png)

### 接口配置

编写参与者接口，接口编写完成后通过接口收集功能收集接口。

![接口规范：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/29.png)

接口规范：

![审批组配置](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/30.png)

### 审批组配置

配置入口：系统管理→流程管理→审批组管理

列表页面：

![rpc配置](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/31.png)

### rpc配置

配置入口：系统管理→流程管理→RPC管理

配置页面：

![事件处理接口](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/32.png)

### 事件处理接口

编写事件处理接口，其他操作同参与者接口。

![流程发起](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/33.png)

### 流程发起

### 对流程进行发起

### 提供流程发起入口

### 流程发起

在service模块中引入flow-api。

![启动类设置feign扫描。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/34.png)

启动类设置feign扫描。

@EnableFeignClients({&quot;com.jhict.flow.api.feign&quot;})

编写startFlow接口controller。

![编写发起流程service代码。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/35.png)

编写发起流程service代码。

![自定义流程详情两种模式](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/36.png)

### 自定义流程详情两种模式

### 低代码模式（推荐）

query.setBusinessUrl(&quot;lowcode&quot;);

低代码模式固定url为：lowcode，注意这里不需要传递参数，流程引擎会自动调用详情组件的initFlow(）方法，传递流程参数给组件。

![写Vue代码模式](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/37.png)

### 写Vue代码模式

query.setBusinessUrl(&quot;hrms/user/flow-details.vue?id=&quot; + id);

写代码方式需要指定vue文件路径，从views下开始计算路径，参数在组件url的后面追加。

流程查看

查看发起的流程

提供查看发起的流程相关信息的功能

流程查看全局组件

使用方式：

![流程详情](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/38.png)

### 流程详情

这里讲解写代码方式，低代码拖拽方式上面已经描述。

编写Vue文件，模板如下：

![data是在流程发起的时候传递的参数，如：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/39.png)

data是在流程发起的时候传递的参数，如：

![截图](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/40.png)
