# 日志监控

> 平台日志监控包括安全审计、日志查询、SQL记录、数据备份、请求看板和热配置日志级别。

---

由于日志存在ElasticSearch中，对用户使用难度过大，故开发日志中心系统，以方便用户查询搜索日志。日志中心模块主要分为两个部分：【安全审计】和【日志详情】均在系统管理的系统监控下，如下图所示。用户可以在【安全审计】中通过相关信息比如时间、用户、返回消息，快速定位到指定请求，然后根据全链路id去【日志详情】中定位相关日志。

![安全审计](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/01.png)

### 安全审计

安全审计用于日志情况的总览。根据筛选条件，查看筛选条件下所有请求对应的简要日志记录。

审计查询所有访问记录，追溯历史问题

运行时期

支持查看

运维单位

运维人员

基本功能

每个请求所产生的日志都有唯一的全链路ID与之对应，如下图所示：

![点击某条日志记录“全链路ID”属性中的图标，可查看对应日志记录的具体日志信息，如](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/02.png)

点击某条日志记录“全链路ID”属性中的图标，可查看对应日志记录的具体日志信息，如下两图所示：

安全审计中日志具体信息查看位置：

![日志具体信息：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/03.png)

日志具体信息：

![点击某条日志记录最右侧的详情，可查看对应日志记录请求的详细信息（请求参数，请求体](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/04.png)

点击某条日志记录最右侧的详情，可查看对应日志记录请求的详细信息（请求参数，请求体等），如下两图所示（值得注意的是详情中所展示的请求体长度上限是1000个字符，超出长度上限的部分将被截断，不会在详情页面中展示）：

日志记录详情位置：

![日志记录详情所展示的内容：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/05.png)

日志记录详情所展示的内容：

![根据消息查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/06.png)

### 根据消息查询

只有错误请求才会有消息，正常请求消息字段为空字符串，不会显示任何内容。注意：

错误请求即请求返回CODE码为非2000的请求，关于CODE码类型详见1.2.3 根据CODE码查询

这里的消息与请求返回数据中的ApiResult.message不同，要注意区分。只有当请求发生错误抛出异常被后端错误异常处理器捕获时才会执行对消息message的赋值操作，因此只有错误请求才有消息，正常请求没有消息。

如下图所示，我们在消息输入框中输入“系统错误”，之后点击搜索按钮，便可以查询到所有请求执行结果信息为“系统错误”的日志记录。

![根据错误消息查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/07.png)

### 根据错误消息查询

错误消息与根据消息查询类似，只不过根据消息查询需要输入具体消息内容来查询日志，而错误消息则是对消息进行了分类，通过下拉框选择进行查询。错误请求下拉框中有三个选项：全部、是、否，默认为“全部”。如图所示：

![全部：全部的日志，如下图所示：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/08.png)

全部：全部的日志，如下图所示：

![是：消息字段不为空字符串的日志记录，即错误请求对应的日志记录，如下图所示：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/09.png)

是：消息字段不为空字符串的日志记录，即错误请求对应的日志记录，如下图所示：

![否：消息字段为空字符串的日志记录，即正常请求对应的日志记录，如下图所示：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/10.png)

否：消息字段为空字符串的日志记录，即正常请求对应的日志记录，如下图所示：

![根据CODE码查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/11.png)

### 根据CODE码查询

CODE码，即发出请求后所返回JSON执行结果中的code字段对应的内容，也即后端接口返回的执行结果状态码ApiResult.code。

CODE码一共有八种类型：成功（2000），请求错误（4000），未登录（4001），无权限（4003），无效请求（4004），服务器错误（5000），服务不可用（5003），证书失效（4103）。其中只有“成功（2000）”是正常请求，其余均为错误请求。

如下图所示，我们在消息输入框中输入CODE码“5000”，之后点击搜索按钮，便可以查询到所有请求执行结果状态码为“5000”的日志记录。

![根据错误请求查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/12.png)

### 根据错误请求查询

错误请求与CODE码筛选作用类似，只不过CODE码需要输入具体的CODE码来查询日志，而错误请求相当于对CODE码进行了分类，通过下拉框选择进行查询。错误请求下拉框中有三个选项：全部、是、否，默认为“全部”（关于CODE码类型详见根据CODE码查询）如下图所示。

![全部：查询所有类型CODE码（2000，400X，500X）的日志记录，如下图所](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/13.png)

全部：查询所有类型CODE码（2000，400X，500X）的日志记录，如下图所示：

![是：仅查询非2000的CODE码（400X，500X）的日志记录，如下图所示：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/14.png)

是：仅查询非2000的CODE码（400X，500X）的日志记录，如下图所示：

![否：仅查询2000的CODE码的日志记录，如下图所示：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/15.png)

否：仅查询2000的CODE码的日志记录，如下图所示：

![根据访问账号查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/16.png)

### 根据访问账号查询

选择指定的用户账号，查询该用户对应的所有日志记录，选择用户如下所示，选择指定用户：

![搜索指定用户：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/17.png)

搜索指定用户：

![根据用户进行查询如下图所示：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/18.png)

根据用户进行查询如下图所示：

![根据访问时间查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/19.png)

### 根据访问时间查询

选择起始时间和结束时间，查询该时间范围内所有的日志记录，如下图所示。

![根据路径查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/20.png)

### 根据路径查询

根据输入的请求路径，查询对应路径的所有日志记录，如下图所示。

![根据耗时时间查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/21.png)

### 根据耗时时间查询

分别输入最小耗时时间和最大耗时时间，查询该耗时时间在该区间范围内的所有日志记录，如下图所示。

![根据访问者IP查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/22.png)

### 根据访问者IP查询

输入访问者IP，查询此访问者IP的所有日志记录，如下图所示。

![多条件组合查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/23.png)

### 多条件组合查询

根据指定的多个条件，查询满足所有条件的日志记录，如下图所示。

![日志查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/24.png)

### 日志查询

日志详情用于查看指定日志记录的具体日志信息。

查询系统的日志信息

运行时期

支持查看

运维部门

运维人员

根据关键词查询

输入查询关键词，获取包含关键词的日志信息，如下图所示：

![根据访问人查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/25.png)

### 根据访问人查询

选择指定的用户，查询该用户对应的所有日志信息。选择用户如下两图所示：

选择指定用户：

![选择指定用户：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/26.png)

选择指定用户：

![根据用户进行查询日志如下图所示：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/27.png)

根据用户进行查询日志如下图所示：

![根据访问路径查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/28.png)

### 根据访问路径查询

根据输入的请求路径，查询对应路径的所有日志信息，如下图所示。

![根据访问时间查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/29.png)

### 根据访问时间查询

选择要查询日志的起始时间和截止时间，查询所选日期时间范围内的所有日志详情信息，如图2.7所示。

![注意，由于日志详情信息数据量巨大，因此查询有以下限制：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/30.png)

注意，由于日志详情信息数据量巨大，因此查询有以下限制：

不支持跨天查询，起始和截止时间的年月日要相同。例如：当前日期为9月24日，可以查询的最大范围为9月24日00:00:00至24日23:59:59，即使查询范围是24日的23:59:59至25日00:00:00也依旧无法查询。

默认保存日志有效期为3天，故可查询的最早日志日期为3天前。例如：当前日期为9月26日，那么最早只能查询到9月24日的日志信息。

由于默认保存的日志有效期为3天，若想修改日志保存有效期，首先需要联系基础架构师的相关工作人员修改ES保存日志的天数，之后需要修改Nacos配置文件JH4J-CODE-devops-monitor-xxx.yml（xxx为dev，uat等不同环境后缀）中的jh4j.logger.saveDays参数为要修改的有效期天数，最后重启moniter服务，配置内容如下代码清单所示。

![根据日志级别查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/31.png)

### 根据日志级别查询

选择指定日志级别（可多选），获取对应级别日志具体信息，如图2.8所示。可选日志级别有：FATAL(100），ERROR(200），WARN(300），INFO(400），DEBUG(500），TRACE(600)，ALL(1000)

![根据服务名称查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/32.png)

### 根据服务名称查询

选择指定服务（可多选），获取所选服务对应日志具体信息，如下图所示。

![根据全链路ID查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/33.png)

### 根据全链路ID查询

全链路ID可用于追踪服务的调用链路过程，首先在安全审计页面获取对应日志记录的全链路ID，之后在日志详情页面根据此全链路ID进行搜索，查询出对应的具体日志信息。

获取全链路ID：

![根据获取的全链路ID查询对应的具体日志信息：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/34.png)

根据获取的全链路ID查询对应的具体日志信息：

![注意：由于全链路ID的生成策略与日期时间相关，在安全审计页面选择的全链路ID对应](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/35.png)

注意：由于全链路ID的生成策略与日期时间相关，在安全审计页面选择的全链路ID对应日志的日期时间不要超出可支持查询的日期范围（默认3天），否则将会返回提示“实时数据天数不能超过3天！”。

查询并复制超出日期范围的全链路ID：

![超出日期范围的全链路ID查询结果：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/36.png)

超出日期范围的全链路ID查询结果：

![安全审计页面直接查看超出日期范围的全链路ID对应日志信息：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/37.png)

安全审计页面直接查看超出日期范围的全链路ID对应日志信息：

![查询失败提示：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/38.png)

查询失败提示：

![根据多条件组合查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/39.png)

### 根据多条件组合查询

根据指定的多个条件，查询满足所有条件的日志信息，如下图所示。

![钻取查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/40.png)

### 钻取查询

使用日志查询时，一般使用关键条件进行日志过滤查询，比如根据时间，以及错误信息查询该时间段内的记录，然后滚动查询大概日志，双击钻取某一条日志记录，进行该日志上下文的查询（查询出与所选日志时间相邻的日志记录）

双击选中某条日志记录：

![查看钻取日志上下文：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/41.png)

查看钻取日志上下文：

![日志配置](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/42.png)

### 日志配置

日志配置文件log4j2.xml的路径位置： JH4J-CODE\JH4J-CODE-xxx\JH4J-CODE-xxx-service\src\main\resources\log4j2.xml（xxx为服务名）日志输出格式：customlogstart与customlogend作为日志分割的起始与终止位置，traceId表示全链路id，parentService表示上一个服务，currentService表示当前服务，detail可用于查看错误提示，logDump用于查看方法调用堆栈信息。

日志格式配置如下代码清单所示：

![日志打印效果如下图所示：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/43.png)

日志打印效果如下图所示：

![注：这里为了便于查看，省略了xml文件中部分内容并对其格式进行了调整，请勿直接复](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/44.png)

注：这里为了便于查看，省略了xml文件中部分内容并对其格式进行了调整，请勿直接复制代码清单使用，请使用附件中提供的log4j2.xml文件。

SQL记录

Sql记录用于记录系统在运行过程中mybatis-plus产生的所有sql语句，可以追溯系统运行过程中的异常情况，结合安全升级、日志详情定位异常原因。

查询系统运行过程中的sql记录

运行时期

支持查看

运维部门

运维人员

根据操作人查询sql记录

输入操作人，查询操作人涉及的sql记录，如下图所示：

![根据SQL关键字查询sql记录](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/45.png)

根据SQL关键字查询sql记录

输入SQL关键字，查询含有关键字的sql记录，如下图所示：

![根据全链路ID查询sql记录](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/46.png)

根据全链路ID查询sql记录

输入全链路ID，查询一个请求涉及的sql记录，如下图所示：

![根据时间范围字查询sql记录](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/47.png)

根据时间范围字查询sql记录

输入时间范围，查询该时间范围内的sql记录，如下图所示：

![根据耗时范围查询sql记录](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/48.png)

根据耗时范围查询sql记录

输入耗时范围，查询耗时范围内的sql记录，如下图所示：

![根据查询记录数范围查询sql记录](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/49.png)

根据查询记录数范围查询sql记录

输入记录数范围，查询记录数范围内的sql记录，如下图所示：

![多条件复合查询sql记录](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/50.png)

### 多条件复合查询sql记录

根据填写的多个条件，查询sql记录

![数据备份](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/51.png)

### 数据备份

对于某些重要数据，在删除前，对数据进行备份，用于数据追溯。

对于某些重要表的数据，备份删除前的数据

运行时期

支持查看

运维部门

运维人员

设置需要备份的表

页面配置

进入系统管理－〉低代码－〉模型管理页面，选择需要备份删除记录的表

![筛选需要的表，点击【编辑】进入表设计；](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/52.png)

筛选需要的表，点击【编辑】进入表设计；

![勾选备份数据保存。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/53.png)

勾选备份数据保存。

代码配置

在模型的Class上添加注解@SaveDeleteRecord

![查看备份记录](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/54.png)

### 查看备份记录

进入系统管理－〉系统监控－〉备份数据，查看备份记录

![请求看板](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/55.png)

### 请求看板

### 查看所有请求分布情况

查看项目系统历史使用接口情况

运行时期

支持查看

运维部门

运维人员

功能详情：

![热配置日志级别](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/56.png)

### 热配置日志级别

热配置日志级别是指，在服务运行时，修改服务的日志级别，无需重启服务新修改后的日志级别便可生效。

为配置日志中心提供基础模块

运行阶段

支持修改

运维部门

运维人员

确定要修改日志级别的服务，利用 nacos 配置热更新，通过修改 nacos 上目标服务对应的配置文件 JH4J-CODE-xxx-xxx.yml（第一个xxx为服务名，第二个xxx为dev，uat等不同环境后缀）中日志级别的内容来实现热配置日志级别，配置如代码清单所示：

![注意：假设要修改开发环境下系统服务的日志级别，那么需要在nacos中找到系统服务](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/57.png)

注意：假设要修改开发环境下系统服务的日志级别，那么需要在nacos中找到系统服务对应的配置文件JH4J-CODE-system-dev.yml之后修改其jh4j.logger.level.console的内容。
