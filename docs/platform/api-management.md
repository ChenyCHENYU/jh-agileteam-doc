# 接口管理

> 接口管理提供接口收集、接口生成和接口设计能力。

---

接口管理中心主要用来显示本系统中所有接口，并且管理接口的权限；比如面登白名单接口可以不携带token直接访问，白名单接口携带正确token就可以访问；

接口来源包括编码接口、通用接口、逻辑编排接口、敏捷接口，其中编码接口指程序员编写java代码的接口，通用接口指根据模型生成默认的增删改查导入导出接口，逻辑编排接口指通过编排多个接口生成一个新的接口，敏捷接口指通过编写sql脚本快速生成接口；

接口收集

为了动态管理程序员编写java代码接口权限，将编码接口进行接口收集，统一管理接口权限。

收集项目中所有接口，进行统一管控

开发人员开发阶段

支持接口一键收集

通用属性

接口名称：接口的名称。

类型：接口请求类型；GET/POST等。

路径：接口的访问路径，网关访问该路径转发到真实路径。

真实路径：接口的真实访问路径。

服务名称：表示该接口属于哪个服务的。

菜单动作：该接口挂载到哪些菜单动作上，用于权限校验。

白名单：只要有正确的token就能访问的接口。

免登白名单：无需token即可访问的接口，注意，携带错误token访问会被限制，携带请求头username、companyId、tenantId、dataSourceCode这四个参数也会被限制访问。

是否覆盖：若为是，接口收集时，将更新该接口成新的结果；若为否，接口收集时跳过。

启用状态：默认为启用状态，若存在多个接口虚拟路径及请求类型一致时，有且仅能设置其中一个接口为启用状态。

外部接口：外部接口表示该接口可被前端访问；内部接口表示该接口只能在服务之间访问。

服务英文名：表示该接口属于哪个服务。

接口来源：表示该接口是怎么产生的，如上2.接口来源。

详情：详情描述该接口作用。

入参结构：该接口的入参结构。

出参结构：该接口的出参结构。

检查字典配置

在系统字典中配置服务信息，如图所示

![配置本地服务与服务器服务父子关系](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/01.png)

配置本地服务与服务器服务父子关系

在服务器的nacos上配置父子服务关系，在nacos上jh4j-cloud-system-dev.yml上配置如下，示例：

![其中parentService配置服务器上主服务的服务名称，childrenSe](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/02.png)

其中parentService配置服务器上主服务的服务名称，childrenService配置本地开发服务的服务名称，多人开发，需配置多个，配置完立即生效，再次收集接口即可。

接口收集

选择相应服务，点击【无感收集】，进行收集接口。

接口重新加载

选择需要重新加载的接口，点击【异步加载】，选择服务，进行接口重新加载。

接口挂载

将收集上来的接口挂载到对应的菜单动作上，若多个页面引用了同一个接口，可以将该接口挂载到对应的多个页面菜单动作上。

一键解除

接口挂载到多个菜单动作上，若需要解除所有页面对此接口的引用，可以使用一键解除，若只需要解除个别页面对此接口的引用，可以切换到挂载详情，进行单个解除引用关系。

修改

设置接口属性，白名单、免登白名单、是否覆盖、启用状态、外部接口是否、详情、入参结构、出参结构。

删除

删除无用的接口，若接口被页面引用时，存在接口与菜单动作关系，无法删除接口；需手动删除关联关系，才可以删除接口；一般不允许删除接口。

数据规则

数据规则中包括校验规则与排序规则，其中校验规则包括校验请求参数及请求体，排序规则只有通用接口会生效；校验规则设置，选择请求参数/请求体，点击新增，选择对应的参数，设置规则，填写规定值，设置提示信息，点击保存，保存校验规则；排序规则，点击新增，选择需要排序的字段，选择升序或者降序，可以设置多个字段，多个字段时设置优先级，点击确定，保存排序规则，通用接口将根据此排序规则查询数据。

批量操作

可以批量选择多个接口，对选择中接口进行批量修改属性、批量挂载到菜单动作、批量一键解除、批量重新加载、批量异步加载、批量删除。

校验存在

可以校验缓存中是否存在接口。若数据库中存在缓存中不存在，可能是直接操作数据库导致。注意：服务器上可以使用重新加载，进行接口重新加载，本地开发只能使用异步加载。

接口生成

低代码支持模型生成默认增删改查接口，其中单模型生成的默认接口有：新增单条记录、批量新增、 删除单条记录、批量删除、修改记录、根据ID查询、列表查询、键值查询、导入、导出、导出模板、聚合查询，共12个默认接口，关系模型生成的默认接口有：列表查询、键值查询、聚合查询、导出，共4个默认接口。

为模型提供默认接口功能，比如简单地增删改查，分页查询等12个接口

开发阶段

支持模型默认接口一键生产，重新加载

开发部门

单模型

创建菜单；

选择对应菜单，导入/创建模型；

点击新增接口、选择通用接口；

点击选择模型；

![切换模型类型，填写模型编码，进行搜索；](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/03.png)

切换模型类型，填写模型编码，进行搜索；

![选择模型，点击下一步；](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/04.png)

选择模型，点击下一步；

点击确定，生成接口；

![删除或者禁用不需要的默认接口；](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/05.png)

删除或者禁用不需要的默认接口；

![设置接口的校验规则及排序规则，如上编码接口；](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/06.png)

设置接口的校验规则及排序规则，如上编码接口；

关系模型

创建关系模型，选择系统管理--〉低代码--〉模型管理--〉关系模型，点击新增创建关系模型；

如下图，填写相应信息

![关系名称：关系模型的名称；](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/07.png)

关系名称：关系模型的名称；

编码：关系模型的英文编码；

服务名称：关系模型挂载到对应服务上，后期可以生成接口，负载均衡；

关系描述：具体描述此关系模型；

拖拽单模型组合成关系模型（注意：先拖主模型）

![勾选主模型字段](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/08.png)

### 勾选主模型字段

![设置关联模型及勾选字段](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/09.png)

### 设置关联模型及勾选字段

![设置连接关系](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/10.png)

### 设置连接关系

![保存关系模型](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/11.png)

### 保存关系模型

![生成关系模型接口，如上单模型生成，选择模型类型时，切换成关系模型；](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/12.png)

生成关系模型接口，如上单模型生成，选择模型类型时，切换成关系模型；

接口设计

接口设计包括逻辑编排接口设计、敏捷接口设计，具体查看编排接口设计、敏捷接口设计。

逻辑编排设计

逻辑流程管理，是一个对系统现有接口进行逻辑编排以适配模型生成的默认接口无法满足的业务场景的功能模块。

将多个接口编排成一个接口使用

低代码开发阶段

支撑新增修改删除

新增流程

可通过接口管理和逻辑流程管理两种路径新增流程：

接口管理新增：

![逻辑流程管理新增（注意：逻辑流程只能在具体的菜单动作上创建，需先选中左侧节点中的](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/13.png)

逻辑流程管理新增（注意：逻辑流程只能在具体的菜单动作上创建，需先选中左侧节点中的动作，否则新增按钮将会被禁用）：

![流程信息填写](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/14.png)

### 流程信息填写

进入逻辑编排设计器后，点击空白处，可填写流程相关信息，包括流程编码，流程名称，业务类型，流程入参等，其中，带*号的为必填项。

![业务类型分为三种，如增删改类动作可以选择业务操作、单个查询选择查询、需要分页则选](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/15.png)

业务类型分为三种，如增删改类动作可以选择业务操作、单个查询选择查询、需要分页则选择分页查询

![流程状态默认为启用。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/16.png)

流程状态默认为启用。

流程入参类型分为两种：

可选择系统中已有模型作为入参

![也可以自定义入参](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/17.png)

### 也可以自定义入参

![路径](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/18.png)

### 路径

当我们选择自定义入参时，默认生成路径为 /code/logicalFlowApi/流程编码

![当我们选择模型入参时，默认生成路径为 /code/模型名称/流程编码](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/19.png)

当我们选择模型入参时，默认生成路径为 /code/模型名称/流程编码

![流程搭建](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/20.png)

### 流程搭建

选择需要的任务节点，通过拖拽的形式将节点拉取到设计器上，点击当前节点，选中节点右侧的箭头，可以将当前节点与下一节点进行连接（注意：所有分支中的最后节点都必须要连接到流程结束节点，以流程结束节点作为流程分支的终点）。

![节点信息填写](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/21.png)

### 节点信息填写

逻辑编排中提供了四种类型的任务节点，分别是数据，流程，系统，socket，点击当前节点，可在右侧界面进行节点的信息填写

数据

查询数据节点信息填写过程如下图所示：

![根据选择的模型，生成相应模型下的查询数据接口getById。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/22.png)

根据选择的模型，生成相应模型下的查询数据接口getById。

入参选择完成后，需要选择参数值，系统中提供了固定值，可选值，系统值三种选择。

固定值：手动输入一个固定的入参值。

![可选值：可以选择流程的入参，或者其他任务节点的出参](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/23.png)

可选值：可以选择流程的入参，或者其他任务节点的出参

![系统值：系统提供了当前用户编号和当前用户公司别ID两个参数值](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/24.png)

系统值：系统提供了当前用户编号和当前用户公司别ID两个参数值

![其余的插入数据、更新数据、删除数据、自由任务等节点的信息填写过程与查询数据类似。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/25.png)

其余的插入数据、更新数据、删除数据、自由任务等节点的信息填写过程与查询数据类似。

流程

发起流程节点信息填写过程如下图所示：

![流程选择如下图所示：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/26.png)

流程选择如下图所示：

![参数值选择如下图所示：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/27.png)

参数值选择如下图所示：

![系统](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/28.png)

### 系统

脚本任务：

当前脚本任务支持groovy语言，当流程执行到脚本任务时，自动执行脚本内容。脚本示例内容如下图所示，核心代码为：

![互斥网关：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/29.png)

![互斥网关：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/30.png)

互斥网关：

互斥网关的搭建如下图所示：

![通过互斥网关控制流程分支的走向，点击互斥网关与分支下一节点的连线，配置条件信息](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/31.png)

通过互斥网关控制流程分支的走向，点击互斥网关与分支下一节点的连线，配置条件信息

![条件类型中支持以下几种条件判断方式：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/32.png)

条件类型中支持以下几种条件判断方式：

![并行网关：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/33.png)

并行网关：

并行网关没有额外的属性配置，如果同一并行网关有多个传入和传出序列流，网关将首先连续所有传入的序列流，然后再分割成多个并发的执行路径，并行网关与其他网关的一个重要区别是，并行网关不会判断条件是否为真。

提示信息

当流程走到该节点，会输出提示信息中设置的内容

![socket](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/34.png)

### socket

### socket监听

监听节点为启动服务端，配置信息如下图所示：

![编解码配置中，支持字符串，Base64，字节，自定义groovy脚本几种类型](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/35.png)

编解码配置中，支持字符串，Base64，字节，自定义groovy脚本几种类型

![任务信息中，需要填写任务编码、任务描述、ip地址、监听端口、消息头长度、消息总长](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/36.png)

任务信息中，需要填写任务编码、任务描述、ip地址、监听端口、消息头长度、消息总长度、消息头起始标志，消息头终止标志、消息体长度位数、消息体终止表示、协议、路径选择信息。目前，socket中支持TCP协议和UDP协议的通信。

socket发送

发送节点为启动客户端配置信息与socket监听服务端配置相似，需额外配置socketMessage发送信息参数

![注意：监听端与发送端的编解码配置，ip地址和监听端口，消息头和消息体，通信协议必](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/37.png)

注意：监听端与发送端的编解码配置，ip地址和监听端口，消息头和消息体，通信协议必须相互对应，否则会出现通信异常或者信息乱码的问题。

保存、发布、接口覆盖

逻辑流程设计完成后，点击保存并发布，保存流程，并生成逻辑编排接口，点击接口覆盖，可以指定覆盖所选定的模型下的相关接口。

流程查询、更改、删除

注意：逻辑流程在启用的状态下无法删除。

![接口测试](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/38.png)

### 接口测试

![敏捷接口设计](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/39.png)

![敏捷接口设计](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/40.png)

### 敏捷接口设计

为了快速响应接口需求，我们可以编写动态sql，以及动态脚本，来快速生成接口，大大提高了开发效率。

为了快速响应接口需求，快速生成接口

运行阶段

支持新增修改删除

创建接口

![编写脚本，运行测试脚本](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/41.png)

### 编写脚本，运行测试脚本

![设置入参](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/42.png)

### 设置入参

注意，设置出入参不会影响接口实际的出入参，仅供查询接口属性用，故在设置出入参时，需要按实际设置。

![设置出参](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/43.png)

### 设置出参

![保存接口](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/44.png)

### 保存接口

### 点击保存，保存接口

### 测试接口

![外部接口设计](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/45.png)

![外部接口设计](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/46.png)

### 外部接口设计

外部接口管理，是一个对系统外部接口进行配置和管理的功能模块。

配置和管理系统外部接口

低代码开发阶段

支撑新增修改删除

创建路由

在系统管理目录→资源管理菜单→路由规则管理页面中维护外部接口路由信息。点击新增按钮，录入相关信息后生成一条路由规则数据。

![规则名称：路由规则的名称，需唯一。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/47.png)

规则名称：路由规则的名称，需唯一。

规则uri：规则路由的uri，为其他服务gateway暴露的地址或服务的ip地址加端口号，如http://127.0.0.1:9000。

规则前缀：路由规则的前缀，需唯一。

详情：路由规则的详细信息描述。

创建接口

点击新增外部接口，弹出外部接口新增页面，如下图：

![也可在系统管理目录→资源管理菜单→外部接口页面中进行外部接口数据维护。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/48.png)

也可在系统管理目录→资源管理菜单→外部接口页面中进行外部接口数据维护。

接口名称：外部接口的名称，需唯一。

方法类型：外部接口的类型，如GET、POST、PUT等。

路由规则：在路由规则管理页面中新增的路由规则。

路径：路径分两个部分，第一个部分为路由规则前缀，在选择完路由规则后会自动带出，第二部分为接口的路径，接口路径可在接口管理中查看，如下图：（注意：外部接口只能配置免登白名单的接口路径）

![详情：详情为该接口的详细信息描述。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/49.png)

详情：详情为该接口的详细信息描述。

入参：同敏捷接口。

出参：同敏捷接口。

点击保存后会在接口管理中有新增的外部接口生成，可进行编辑和测试。

黑名单管理

动态脚本存在很多不可控因素，可能引起系统安全问题，需要对动态脚本语言进行安全管控，进行黑名单管理。由于多项目共同使用groovy动态语言，需要同时使用黑名单进行管理，由于不同的项目可能存在使用不同的黑名单列表，需要提供一个黑名单工具，供不同项目使用

系统在运行groovy动态语言脚本时提供安全策略

开发阶段

支持新增修改删除

创建黑名单

点击系统管理－〉低代码－〉接口设计-〉黑名单管理，进入黑名单管理页面。

点击【新增】按钮，弹出新增黑名单对话框；

选择“类”“普通方法”“静态方法”三个类别，分别填写相应的信息；

其中类名为类的全路径；

方法名为该方法的名称；

描述为该黑名单的描述；

点击【确定】，新增一条黑名单记录。

![修改黑名单](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/50.png)

![修改黑名单](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/51.png)

![修改黑名单](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/52.png)

### 修改黑名单

点击【编辑】对描述进行修改

![分配黑名单给服务](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/53.png)

### 分配黑名单给服务

选择一条或者多条黑名单记录，点击【分配】，弹出服务列表对话框，勾选需要分配的服务，将该黑名单应用在该服务上。

![全量分配](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/54.png)

### 全量分配

点击【全量分配】，弹出服务列表，勾选需要分配的服务，将黑名单列表中的所有黑名单都分配给对应服务。

![删除黑名单](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/55.png)

### 删除黑名单

对于无效的黑名单，进行删除，勾选需要删除的黑名单，点击【删除】按钮进行删除。注意，如黑名单已分配给某服务，则无法直接删除，需要先解除分配给服务的关系。

![删除分配给的服务](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/56.png)

![删除分配给的服务](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/57.png)

### 删除分配给的服务

勾选不需要使用的黑名单记录，点击【删除服务】，进行服务的删除，仅删除黑名单对应的服务，而不删除黑名单。

![截图](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/58.png)
