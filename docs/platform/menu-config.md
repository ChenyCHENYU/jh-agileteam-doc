# 菜单配置

> 菜单是平台内部进行功能管理的入口，包含领域管理、子系统管理、菜单管理和独立页面。

---

菜单是平台内部进行功能管理的入口，能够通过点击进入对应的页面或者进入系统。包含：菜单管理、子系统管理、领域管理、独立页面。

领域管理

领域是平台提供的业务领域的总称，也是子系统入口

区分不同的领域功能

需要管理系统功能菜单时

提供领域的基本增删改查，隐藏等功能以及对领域的全量导入导出功能

系统管理→菜单程序配置→领域管理

领域管理列表

![新增领域](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/menu-config/01.png)

### 新增领域

![填写相关信息后点击确定即可新增领域。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/menu-config/02.png)

填写相关信息后点击确定即可新增领域。

编辑领域

![可对领域的信息进行修改，控制领域的隐藏等。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/menu-config/03.png)

可对领域的信息进行修改，控制领域的隐藏等。

领域导入导出

领域自动随应用导入导出，无需特殊操作。

子系统管理

子系统是平台提供的系统描述的总称，也是菜单入口

区分不同的系统功能

需要新增系统功能菜单时

支持增加、修改、删除操作

系统管理→菜单程序配置→子系统管理

子系统管理列表

新建子系统后挂上菜单之后具有系统菜单权限的人进入系统之后首页可见系统入口。

![修改管理](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/menu-config/04.png)

### 修改管理

对于子系统都是统一上级菜单根模块，图标是首页展示的图标可通过图片上传，路由是用于页面能够识别此子系统的唯一标识，可自定义，不重复。系统名称自定义 如果勾选隐藏 系统不可见。

![菜单管理](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/menu-config/05.png)

### 菜单管理

菜单是单独的功能，菜单挂载在系统内部，在系统中统一风格位于左侧，模块级功能左侧会挂载菜 单，具有功能划分位置的作用。

页面动态配置菜单

需要新增菜单目录，或者页面时

支持增加、修改、删除操作

系统管理→菜单程序配置→菜单管理

菜单管理列表

![编辑管理](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/menu-config/06.png)

### 编辑管理

点击列表右侧操作栏编辑按钮，弹出编辑框，分为目录、菜单、动作编辑框。

目录编辑框：

![菜单编辑框：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/menu-config/07.png)

菜单编辑框：

![动作编辑框：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/menu-config/08.png)

动作编辑框：

![字段](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/menu-config/09.png)

### 字段

### 释义

### 图标

菜单图标设置可从系统选择也可以自定义

显示排序

在父级菜单展示的顺序 从上到下 数字从小到大

是否隐藏

菜单在父级下是否隐藏的功能设定 默认为否

是否使用缓存

前端当前页面的配置是否使用前端缓存

权限标识

必填全局唯一的标识 字符串，系统内部接口等功能划分的标识

组件路径

可以为空 前端的组件路径地址

绑定页面

对于低代码平台设计角度来说，菜单和页面是绑定的关系，两者可以绑定无先后顺序。

独立页面

独立页面是平台提供的独立访问页面资源管理模块，用于动态的定义页面路由及组件映射关系，实现页面的动态注册与访问控制。支持一级路由及二级嵌套路由结构，并可通过访问路径进行页面预览验证。

系统管理→菜单程序配置→独立页面

独立页面管理列表

进入独立页面模块后，默认展示独立页面管理列表。支持按领域、路径、菜单名称进行查询，并提供新增、修改、删除操作。

![列表字段包括：领域、路径、是否白名单、菜单名称、组件路径及操作。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/menu-config/10.png)

列表字段包括：领域、路径、是否白名单、菜单名称、组件路径及操作。

新增 / 编辑独立页面

点击新增或修改按钮，弹出页面配置窗口，填写相关信息后保存即可生效。

![一级路由预览效果](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/menu-config/11.png)

### 一级路由预览效果

当仅配置组件路径时，生成一级路由页面，可通过访问路径直接访问。

![二级路由预览效果](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/menu-config/12.png)

### 二级路由预览效果

当同时配置组件路径与二级路由组件路径时，生成嵌套路由结构，一级页面作为容器展示二级页面内容。

![删除独立页面](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/menu-config/13.png)

### 删除独立页面

点击删除按钮后可删除对应独立页面数据，删除后页面路由访问失效。
