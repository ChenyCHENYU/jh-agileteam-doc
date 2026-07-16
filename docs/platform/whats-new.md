# 新特性（V3.1.0）

> FSI2 低代码平台 V3.1.0 版本新增功能。

---

### 防重提交

### 操作日志

### 高代码数据权限

### 熔断限流

### 参考

### 常见问题参考

### 页面搭建相关

页面设计时，拖拽组件进画布后，功能无法正常使用。

需绑定对应数据源。

![页面设计时，新增接口后，接口不生效。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/whats-new/01.png)

页面设计时，新增接口后，接口不生效。

需要在数据源新增对应动作。

![页面设计过程中，画面误关闭导致设计画面内容丢失。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/whats-new/02.png)

页面设计过程中，画面误关闭导致设计画面内容丢失。

需要及时点击右上角保存按钮，避免画面误关闭导致设计画面内容丢失。

![当页面设计过程中，组件太多，无法定位到某一组件时？](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/whats-new/03.png)

当页面设计过程中，组件太多，无法定位到某一组件时？

可通过大纲树定位。

![当接口发生变化时，接口数据不生效。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/whats-new/04.png)

当接口发生变化时，接口数据不生效。

需要在数据源中同步该接口

![当模型字段修改后，接口不生效。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/whats-new/05.png)

当模型字段修改后，接口不生效。

需手动再提交执行SQL，重新生成接口

![如何自定义组件css样式。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/whats-new/06.png)

如何自定义组件css样式。

平台画布页支持自定义css样式，也支持tailwindcss库

![审批流节点配置时，出口条件从百分比修改为人数时调用异常。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/whats-new/07.png)

![审批流节点配置时，出口条件从百分比修改为人数时调用异常。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/whats-new/08.png)

审批流节点配置时，出口条件从百分比修改为人数时调用异常。

出口条件从百分比修改为人数时，需注意后面数字，要对应修改

![拖拽页面组件内容至画布中，页面响应超时。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/whats-new/09.png)

拖拽页面组件内容至画布中，页面响应超时。

页面设计时建议实时保存编辑状态

![高级属性中的切换组件展示异常。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/whats-new/10.png)

高级属性中的切换组件展示异常。

高级属性中的切换组件时需注意组件变量数据格式，建议不要频繁切换

![快速搭建时，审批流操作不了](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/whats-new/11.png)

快速搭建时，审批流操作不了

快速搭建时，模型信息折页中勾选了审批流，第四折页审批流才可打开

![页面设计中，多个相同组件数据覆盖](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/whats-new/12.png)

页面设计中，多个相同组件数据覆盖

需注意组件唯一标识不能重复

![页面设计新增页面时提示模型已存在](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/whats-new/13.png)

页面设计新增页面时提示模型已存在

模型编码对应表名，如果模型已存在，可以在快速搭建页面绑定模型

![删除已存在数据源中的接口信息，页面接口异常报错](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/whats-new/14.png)

删除已存在数据源中的接口信息，页面接口异常报错

数据源中的接口信息删除后，接口生成的接口变量、接口函数都会被删除，需要重新绑定数据

![页面设计中组件画布页和预览页效果不同](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/whats-new/15.png)

页面设计中组件画布页和预览页效果不同

平台页面设计中组件有两种状态，编辑态和预览态，组件的最终实现效果不以画布中为准，以预览画面中为准。

![页面设计时，如何设计滚动条](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/whats-new/16.png)

页面设计时，如何设计滚动条

样式配置中设置overflow-auto样式

![数据权限相关](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/whats-new/17.png)

### 数据权限相关

### 数据权限配置未生效

第一查看当前数据权限实例是否启用

第二查看当前数据权限实例是否授权给对应登录人或者其所属的角色

使用前置条件：下游系统管理用户部门公司数据hrms服务需要同平台的hrms服务建表一级后台接口保持一致。角色服务、管理员角色类型建表数据等和平台保持一致。

角色、用户、部门拦截的前提：nacos开关和白名单固定配置。

![系统设置相关](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/whats-new/18.png)

### 系统设置相关

系统管理员在子系统管理页面新增子系统之后，子系统不可见问题

确认下登录的角色是否有配置菜单可见。

系统管理－权限设置－角色管理，查看对应角色的菜单是否授权。

当前创建的子系统下是否有子级菜单，没有子级菜单系统不展示一个空白系统的菜单。

接口相关问题

接口收集未成功可能问题

该服务未在nacos上注册成功，查看nacos服务状况。

字典中未配置该服务，在系统字典－〉服务信息－〉服务列表中，添加该服务信息；注意：配置该服务的路径需要跟网关中配置的一致；是否配置父子关系。

本地开发，需要使用【无感收集】，服务器上可使用【收集】。

本地开发完成，重启该服务，确保该接口生效。

【无感收集】后，查看控制台打印收集成功，再次查询接口，可以看到新生成接口。

使用路径查询接口，不要使用服务名查询。

流程引擎相关

本地开发事件回调接口如何调试

本地可以访问服务器服务，同时服务器的flow服务也可以访问本地服务，这种情况很少。

这种网络环境下，不需要做任何配置，即可进行本地开发调试。

服务器不可访问本地服务

下载flow服务jar包，并启动。

下载flow服务的jar包到目录：D:project/JH4J-CODE下；

执行命令：java-jar-DNACOS_HOST=nacosId-DAPP_NAME=JH4J-CODE-flow-工号-DNACOS_DISCOVERY_NAMESPACE=u；

配置网关转发规则

编辑D:project/env/JH4J-CODE/gateway.yml，JH4J-CODE为你的项目名：

![修改接口服务](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/whats-new/19.png)

### 修改接口服务

flow服务调用事件处理接口，是通过GET;http://JH4J-CODE-hrms-工号/user/approve，这种服务名+请求接口的形式发起的，因此本地调试还需修改接口的所在服务，注意：调试完后还需修改回主服务，否则影响线上运行。

打开接口管理页面，筛选接口：

![点击修改，修改接口服务为： JH4J-CODE-hrms-工号](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/whats-new/20.png)

点击修改，修改接口服务为： JH4J-CODE-hrms-工号

![手册使用者](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/whats-new/21.png)

### 手册使用者

本操作手册面向所有低代码平台系统使用者。主要如下：

序号

角色

1

使用平台构建业务员系统的开发人员、业务人员

2

系统管理员、运维人员

参考文档

暂无

术语定义

术语/缩略词

说明

应用

是项目目标在某一个终端类型上的具体实现，是指为完成某项或多项特定工作的计算机程序。它运行在用户端，可以和用户进行交互，一般情况下具有可视的用户界面。目前JH4J-CODE平台支持的终端类型包括Web、iOS、Android。

WEB应用

WEB应用是指基于互联网的应用程序，通过浏览器作为用户界面，通过网络与服务器进行交互。它是建立在Web技术（包括HTML、CSS、JavaScript等）上的应用程序，能够在各种设备上使用。WEB应用不需要在用户设备上安装，而是通过访问特定的URL链接，通过浏览器进行访问和使用。这带来了许多优势，如跨平台兼容性、便捷的更新和维护，以及可扩展性等。JH4J-CODE平台支持几乎所有的Web应用形式，包括且不限于：用于管理软件系统数据的管理后台；门户网站。JH4J-CODE平台所搭建的应用使用了流行的Vue.js框架实现。如果你想了解更多关于Vue.js框架的知识，可以查看Vue.js

移动端应用

移动端应用是指在移动设备上运行的应用程序，如手机应用、平板电脑应用等，它充分利用移动设备的特性和功能，并具有便捷的操作界面和良好的用户体验。JH4J-CODE平台采用流行的跨平台方案，搭建一次便可成功在iOS和Android上正常运行。

页面

JH4J-CODE平台的页面构成要素包括：

页面编码。用来标识页面的唯一性，不可为中文标识。

页面名称。页面的中文名称。

组件描述。

模型

模型指的是一组图形化或可视化的接口，用于展示业务需求和解决方案，同时帮助开发人员从复杂的编程语言中抽离出来，使团队中的每个人能够专注于更高级别的概念和解决方案。JH4J-CODE平台支持两种设计模式：

单表模型。单表模型又叫基础模型，对应数据库的一个表，主要用于用单个表就能解决问题的场景。

多表模型。多表模型又叫关系模型，对应数据库的多个表，适用于需要多个表配合才能完成任务的场景。

组件

JH4J-CODE平台的组件分为以下三种：

原子组件。具有最小功能单位和最高复用性的组件。它们被设计成独立、可组合和可重用的部件，可以在不同的上下文中被引用和组装，以构建更复杂和完整的应用程序。原子组件可以是各种类型的组件，比如UI组件、功能组件、数据处理组件等。例如，在前端开发中，按钮、输入框、列表项等可以被视为原子组件，它们具有特定的功能和显示样式，并且可以被不同的页面或应用程序复用。

高级组件。根据业务场景抽离出来的由不同原子组件组成的复杂组件。

页面组件。页面组件代表页面上的一个独立的部分或功能，每个页面组件都可以自行处理自己的样式、行为和数据逻辑，可以复用和组合，更好地管理和组织页面的结构和逻辑。页面组件通常包括但不限于导航栏、页眉、页脚、卡片、表格、表单等。

业务类型

JH4J-CODE平台根据业务场景中实际需要的数据类型归类分为：数据字典（dict）、枚举（enums）、用户（user）、公司（company）、部门（dept）、yyyy-MM-dd（date）、yyyy-MM-dd HH:mm:ss（datetime）、HH:mm:ss（time）、文本（text）、长文本（textarea）、数字（number）、自动编码（auto_no）、布尔值（boolean）。

变量

定义：变量在JH4J-CODE平台页面搭建中扮演着重要角色，页面中视图的更新是通过组件绑定变量实现的，变量的改变则是通过重新赋值。

命名（name）：变量命名遵循以大小写英文字母开头，后面可以跟任意数量的字母、数字、特殊字符等，不可为中文。我们一般建议以具有业务含义的英文单词进行命名，如果单个单词无法表达，可以通过下划线或者驼峰式进行命名，比如 user_list/userList（用户列表）。

描述（label）：变量的中文名称。

数据类型：JH4J-CODE平台的数据类型遵循Javascript 语言的类型设计，包括字符串（string）、数字（number）、真假值（boolean）、数组（array）、对象（object）、方法（function）、日期（date）。

默认值：变量初始默认值。

业务类型：变量对应的业务数据类型。

业务值：变量对应的业务数据类型下的枚举值。

角色

角色是针对数据权限的分组方式，控制拥有该角色的用户可查看的业务数据。

页面路由

页面跳转路由，为需要跳转的页面配置路由规则，当满足路由规则时，由当前页面跳转到目标页面。
