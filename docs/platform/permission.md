# 权限管理

> 平台权限管理包括角色管理、接口管理、客户端管理、数据权限管理及数据权限授权查询。

---

平台权限管理相关部分，包含角色管理、接口管理、客户端管理、数据权限管理及数据权限授权查询。

角色管理

系统用户都有不同的角色，不同的角色访问不同的菜单，系统管理员可以管理系统角色，包含角色的增、删、改、查，为角色分配菜单权限，快速给角色增加用户等。

为系统用户分配不同的角色，通过角色来管控权限

支持增加、修改、删除操作，为角色分配菜单，通过角色反查用户

系统管理→权限设置→角色管理

新增角色

点击新增按钮增加角色，相关信息维护完成后，点击“确定”，角色新增成功。

![分配权限](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/01.png)

### 分配权限

分配权限是为当前角色分配菜单访问的权限和部分操作权限。在操作栏点击分配权限。选择需要分配的子系统，勾选对应子系统下菜单及操作权限进行分配。

![角色绑定](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/02.png)

### 角色绑定

角色绑定操作是给权限批量分配岗位、用户、用户组。点击操作栏角色绑定按钮，弹出角色绑定操作框，默认显示此角色已分配的岗位、用户、用户组，可进行新增或移除操作。

![移动端授权](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/03.png)

![移动端授权](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/04.png)

### 移动端授权

移动端查看菜单的授权。

![操作日志](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/05.png)

![操作日志](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/06.png)

### 操作日志

操作日志记录了对角色的相关操作的日志，点击操作栏操作日志按钮，弹出操作日志记录信息

![接口管理](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/07.png)

![接口管理](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/08.png)

### 接口管理

系统平台中有很多接口，分为四个类型的接口、通用接口、编码接口、敏捷接口以及逻辑编排接口，接口统一管理在此处。这部分只介绍接口管理中和权限相关的部分，其余部分在后面介绍

通过接口挂载到菜单实现对接口的权限管控

对接口进行权限控制时

接口挂载、取消挂载、数据规则、行权限、列权限

系统管理→权限设置→接口管理

接口查询

接口管理查询页面

![接口挂载](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/09.png)

### 接口挂载

点击挂载按钮将接口挂载到指定的菜单上

![用户如果要访问接口就需要有接口挂载的菜单的权限，接口可以挂载到多个菜单，用户只需](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/10.png)

![用户如果要访问接口就需要有接口挂载的菜单的权限，接口可以挂载到多个菜单，用户只需](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/11.png)

用户如果要访问接口就需要有接口挂载的菜单的权限，接口可以挂载到多个菜单，用户只需要有其中一个菜单的权限即可访问。

数据规则

点击数据规则可以设置对接口参数的校验规则：

![列权限](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/12.png)

![列权限](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/13.png)

### 列权限

点击列权限可以设置接口过滤掉某些列的数据：

![行权限](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/14.png)

![行权限](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/15.png)

### 行权限

点击行权限可以设置接口只返回符合某些规则的数据：

![客户端管理](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/16.png)

![客户端管理](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/17.png)

### 客户端管理

访问系统入口的客户端管理的页面。

配置访问系统入口的客户端信息

配置客户端信息时

客户端信息增删改查、配置权限等

系统管理→权限设置→客户端管理

查看客户端列表

![新增客户端](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/18.png)

### 新增客户端

![表单释义](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/19.png)

### 表单释义

### 标签

### 释义

### 客户端ID

### 设置客户端ID

### 客户端密钥

### 设置客户端密钥

### 客户端权限集

能否访问的系统和菜单的授权

授权模式

选择不同的授权模式进行客户端授权

令牌时效

设定登录之后有效访问时间 就是距离登录到登录失效的时间

回调地址

登录授权失败之后的回调地址

数据权限管理

提供数据权限配置及管理功能。

通过配置数据权限规则进行数据权限管控

对数据进行权限控制时

数据权限规则新增、编辑、授权、删除

系统管理→权限设置→数据权限管理

![权限配置](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/20.png)

### 权限配置

![授权](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/21.png)

### 授权

用户/角色只授权其中一个即可，表示当前数据权限规则的作用范围。

接口必须授权，只有授权的接口才会受当前规则管控。

![数据权限授权查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/22.png)

### 数据权限授权查询

查看系统中受数据权限管控的接口。

![启用/禁用](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/23.png)

### 启用/禁用

可以临时关闭接口的权限管控。
