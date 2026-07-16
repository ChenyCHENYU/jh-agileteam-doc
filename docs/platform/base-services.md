# 基础服务

> 平台的应用基础设施，包括微服务、云原生和 CICD。

---

主要介绍了平台的应用基础设施，包括微服务、云原生和CICD，

微服务

与传统的单体架构相比，微服务将更大的应用程序拆分成多个可独立部署的小服务，每个服务都可以独立开发和升级。这些小服务可以使用不同的编程语言、框架和技术来实现，而不会影响其他服务。 由于每个服务都是相互独立的，因此可以更快速地开展部署、扩展和维护。

服务治理

服务治理是所有服务的统一管理中心，通过容器化集群部署的方式实现服务中心高可用，服务中心维护所有服务的状态信息，调用服务与服务中心交互获得可用的服务实例并执行服务运算和数据接收。

![远程配置](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/base-services/01.png)

### 远程配置

远程配置中心一方面保证多个环境之间的配置一致性以及多个集群实例的配置一致性，另一方面支持配置的动态变化，可以实时推送最新配置到集群实例，实例根据配置无需重启服务就实现配置异动。

![链路追踪](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/base-services/02.png)

### 链路追踪

链路追踪通过一张图以网络拓扑图的方式展示所有服务之间的调用关系，据此分析出哪些是核心服务，哪些是边缘服务，判断服务的重要性和优先级。同时可以显示节点服务器的运行状态、内存、吞吐量等。当单个请求的链路过长，出现请求响应慢的情况，需要定位具体的问题服务。通过单个请求的链路分析，可以分析出服务链路中的问题节点，并针对性优化解决整体的链路缓慢问题。

![流量控制](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/base-services/03.jpeg)

### 流量控制

流量控制服务从流量控制、熔断降级、系统负载保护等多个维度保护服务的稳定性，防止出现因为某个服务的不可用引发整个服务雪崩的问题。

![服务监控](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/base-services/04.png)

### 服务监控

服务监控可以实时地查看各个服务的状态，可以通过采集服务端的actuator健康信息实现jvm、内存、线程等监控信息可视化，可以可视化地动态查看所有服务的运行状态。同时在一些服务异常时，可以用于问题线上排查，如配置属性不一致、内存溢出、线程池过大等。

![消息队列](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/base-services/05.png)

### 消息队列

平台使用rocketmq为消息队列，通过发布－订阅消息模型实现系统的异步、削峰、解耦等功能，提高系统的并发处理能力和系统稳定性。

![分布式日志](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/base-services/06.png)

### 分布式日志

平台使用log4j2高性能日志组件实现日志记录，通过lombok插件简化日志记录开发。在服务端部署fluentd收集日志并推送至elasticsearch搜索引擎，在日志详情中查询具体日志。

![分布式调度](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/base-services/07.png)

![分布式调度](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/base-services/08.png)

### 分布式调度

平台支持分布式场景下的任务调度，可视化配置简单易用，支持多种路由策略、任务处理策略、故障策略等。

![分布式事务](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/base-services/09.png)

### 分布式事务

平台支持分布式事务控制，包括 AT、TCC、SAGA 和 XA 多种事务模式，针对不同的业务场景有不同的模式支持，如对性能要求不高但是对开发效率要求高的情况下可以使用AT模式，通过一个注解就可以实现分布式事务控制。

![云原生](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/base-services/10.png)

### 云原生

### 服务编排

针对平台部署，将采用最流行的容器技术进行有效部署，编写服务编排文件对众多微服务模块进行部署，之后部署到Kubernetes集群上，利用容器集群特性，使应用具有自我恢复、滚动更新、负载均衡等功能，在高并发状态下，提供强劲而有力的服务支持。平台提供的容器编排支持可视化操作和无感知发布。

![弹性伸缩](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/base-services/11.jpeg)

### 弹性伸缩

开发人员可以根据系统并发情况通过可视化操作对某个服务进行快速扩容，扩容后服务会自动被微服务集群注册发现并提供服务。

![网络隔离](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/base-services/12.jpeg)

### 网络隔离

为保障系统架构的安全性，将容器网络与宿主机网络进行有效隔离，同时建立覆盖网络保障集群之间可以互相通信。外界访问服务时，必须通过网关进行流量转发、认证鉴权，才可到达具体的微服务模块，外界无法直接访问，这在一定程度上保障了每个微服务模块的安全性，防止服务因受到攻击而崩溃。

CICD

CI/CD提供一站式代码交付流程，从代码的编译打包到运行，开发人员只需通过web页面点击相关项目，即可实现代码的快速上线，同时也提供代码回滚、权限管理、流水线管理等功能，多方面简化代码交付流程，降低运维人员部署复杂度，提高运维效率。
