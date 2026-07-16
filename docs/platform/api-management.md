# 接口管理


![系统](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/28.png)
> 系统管理 → 低代码 → 接口管理

接口管理提供接口收集、接口生成和接口设计能力，是低代码开发的核心后端能力。

---

## 接口收集

自动收集已注册微服务的接口信息。

### 操作说明

1. 确保服务已在 Nacos 注册成功

![路径](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/18.png)
2. 在系统字典 → 服务信息中配置该服务（路径需与网关一致）
3. 本地开发使用**「无感收集」**，服务器上使用**「收集」**
4. 收集后可在接口管理中查询到新生成接口

::: tip 使用路径查询
使用路径查询接口，不要使用服务名查询。
:::

---

## 接口生成

基于模型自动生成增删改查接口。

### 操作说明

1. 在模型设计中提交并执行 SQL 后，自动生成对应接口
2. 在接口管理中查看生成的接口
3. 接口可在权限管理中挂载到菜单

---

## 接口设计

### 逻辑编排设计

通过可视化拖拽方式编排接口逻辑，支持：
- 数据库操作节点（增删改查）
- 条件判断节点
- 循环节点
- 变量赋值节点
- HTTP 请求节点
- 消息发送节点



![敏捷接口设计](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/40.png)
![敏捷接口设计](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/39.png)
### 敏捷接口设计

通过配置式方式快速生成接口，填写 SQL 和参数映射即可。



![外部接口设计](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/46.png)
![外部接口设计](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/45.png)
### 外部接口设计

注册外部系统接口，供平台内部调用。

### 黑名单管理

将不需要的接口加入黑名单，禁止访问。

---

## 常见问题

### 接口收集未成功

1. 检查该服务是否在 Nacos 上注册成功
2. 检查系统字典 → 服务信息中是否配置该服务
3. 本地开发使用「无感收集」，收集后查看控制台打印是否成功
4. 重启服务确保接口生效

![配置本地服务与服务器服务父子关系](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/01.png)

![其中parentService配置服务器上主服务的服务名称，...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/02.png)

![切换模型类型，填写模型编码，进行搜索；](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/03.png)
![选择模型，点击下一步；](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/04.png)

![删除或者禁用不需要的默认接口；](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/05.png)
![设置接口的校验规则及排序规则，如上编码接口；](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/06.png)

![关系名称：关系模型的名称；](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/07.png)

![勾选主模型字段](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/08.png)
![设置关联模型及勾选字段](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/09.png)
![设置连接关系](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/10.png)
![保存关系模型](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/11.png)
![生成关系模型接口，如上单模型生成，选择模型类型时，切换成关系...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/12.png)

![逻辑流程管理新增（注意：逻辑流程只能在具体的菜单动作上创建，...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/13.png)
![流程信息填写](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/14.png)

![业务类型分为三种，如增删改类动作可以选择业务操作、单个查询选...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/15.png)
![流程状态默认为启用。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/16.png)

![也可以自定义入参](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/17.png)

![当我们选择模型入参时，默认生成路径为 /code/模型名称/...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/19.png)
![流程搭建](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/20.png)

![节点信息填写](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/21.png)

![根据选择的模型，生成相应模型下的查询数据接口getById。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/22.png)

![可选值：可以选择流程的入参，或者其他任务节点的出参](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/23.png)
![系统值：系统提供了当前用户编号和当前用户公司别ID两个参数值](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/24.png)
![其余的插入数据、更新数据、删除数据、自由任务等节点的信息填写...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/25.png)

![流程选择如下图所示：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/26.png)
![参数值选择如下图所示：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/27.png)


![互斥网关：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/30.png)
![互斥网关：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/29.png)

![通过互斥网关控制流程分支的走向，点击互斥网关与分支下一节点的...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/31.png)
![条件类型中支持以下几种条件判断方式：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/32.png)
![并行网关：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/33.png)

![socket](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/34.png)

![编解码配置中，支持字符串，Base64，字节，自定义groo...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/35.png)
![任务信息中，需要填写任务编码、任务描述、ip地址、监听端口、...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/36.png)

![注意：监听端与发送端的编解码配置，ip地址和监听端口，消息头...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/37.png)

![接口测试](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/38.png)

![编写脚本，运行测试脚本](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/41.png)
![设置入参](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/42.png)

![设置出参](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/43.png)
![保存接口](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/44.png)

![规则名称：路由规则的名称，需唯一。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/47.png)

![也可在系统管理目录→资源管理菜单→外部接口页面中进行外部接口...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/48.png)

![详情：详情为该接口的详细信息描述。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/49.png)



![修改黑名单](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/52.png)
![修改黑名单](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/51.png)
![修改黑名单](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/50.png)

![分配黑名单给服务](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/53.png)

![全量分配](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/54.png)

![删除黑名单](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/55.png)


![删除分配给的服务](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/57.png)
![删除分配给的服务](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/56.png)

![日志监控](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/api-management/58.png)
