# 公共配置

> 低代码平台的公共配置包括数据字典、国际化配置、个性化配置及安全管理。

---

低代码平台的公共配置主要包括数据字典、国际化配置、个性化配置及安全管理。

数据字典

数据字典分为系统字典和业务字典，系统管理员可见可配，此块功能主要是给系统或者业务配置公共属性，比如功能模块的描述信息、服务信息管理、数据源相关的字典类型等。为系统使用提供字典管理的服务。系统字典和业务字典管理功能类似，下面以系统字典为例功能介绍。

系统或者业务提供公共属性配置功能

需配置公共属性时

支持增加、修改、删除操作

系统管理→公共配置→系统字典。

新增类别

字典可以分组，以类别为菜单进行管理，鼠标置于系统字典上点击新增可以新建类别，置于类别上点 击新增按钮可以新增字典，置于字典上可以新增字典小项。

![新增字典](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/01.png)

### 新增字典

新增字典前需将类别新增完成

新增字典，字典类别模块编码自定义之后不可修改，建议使用英文。

![最后新增字典项 字典和字典项通过唯一不可更改的字典code关联。其中三个valu](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/02.png)

最后新增字典项 字典和字典项通过唯一不可更改的字典code关联。其中三个value值可以约束是否必填，内容对应就是字典项中三个value值录入的时候是否非空。

![新增字典值](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/03.png)

### 新增字典值

![字典排序](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/04.png)

### 字典排序

字典小项进行编辑的时候可以设定排序字段和排序升降序列，供查询时候排序使用。排序规则可以根 据字段进行升降序。

校验是否必填

字典项有三个value值可供使用 不一定都需要有值，字典项中对这三个值有非空描述约束。

支持多个value值

字典项有三个value值可供使用 不一定都需要有值，系统使用可根据配置取出所需

国际化配置

为适应更广泛的用户需求，平台提供了基础的国际化能力，默认支持简单中文及美式英语。可以通过在线配置的形式，进行语言的动态增加。

为适应更广泛的用户需求，提供国际化能力，适配多种国家语言

存在外国用户使用平台功能时

支持字段新增、修改、删除操作，语言类型的新增删除操作

系统管理－公共配置－国际化配置

新增翻译字段

点击【新增】按钮，弹出新增字段对话框，填写CODE码、中文字段、英文字段，点击【保存】按钮，进行保存。注意，code码不能重复。

![表单释义](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/05.png)

### 表单释义

### 标签

### 释义

### CODE码

字段的唯一映射字段，不可重复，前缀需要有一定的含义，比如menu开头表示菜单、sysDict开头表示字典

English

英文环境下显示的字段

中文

中文环境下显示的字段

修改翻译字段

点击记录中的【编辑】，弹出对话框，修改English或者中文，点击【保存】进行中英文的修改。

![删除翻译字段](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/06.png)

### 删除翻译字段

点击记录中的【删除】按钮，弹出确定删除该记录二次确认按钮，点击【确定】进行删除。

注意：若为菜单、消息模板、字典的字段，会进行相应的校验，若存在使用，则不可以直接删除，需要先删除菜单、消息模板、字典对应的记录。

![表数据初始化](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/07.png)

![表数据初始化](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/08.png)

### 表数据初始化

在初始升级时，数据库字段不存在国际化字段映射关系，点击【表数据初始化】，可以对菜单表中的菜单名称、字典详情表中的value1字段、消息模板表中的模板及主题进行数据初始化，并且将记录存储到国际化表（sys_i18n_config）中，二次点击时，会进行增量存储。

国际化数据同步

当系统中存在国际化翻译未同步时，可以点击【国际化数据同步】进行手动补偿。比如，记录中原来中文是“方向盘”，后修改成“皮质方向盘”，结果页面仍然显示“方向盘”，点击【国际化数据同步】，查看同步状态，进行国际化数据同步。

![新增国际化语言类型](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/09.png)

### 新增国际化语言类型

点击【语言配置】，点击【新增】，弹出新增对话框，填写语言类型、语言名称，点击【保存】，进行新增语言。

注意：

语言类型需满足实际规范，比如日语为：JA_JP；

语言类型不能修改，只能删除。

![删除国际化语言类型](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/10.png)

### 删除国际化语言类型

点击记录中的【删除】按钮，会弹出二次确认框，点击【确定】进行语言类型删除。注意：若字段中已配置对应语言类型翻译，表示该语言类型已使用，无法删除语言类型。

![个性化配置](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/11.png)

![个性化配置](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/12.png)

### 个性化配置

### 主题风格

为适应不同用户对于界面主题的个性化需求，平台提供了基础的主题配置能力，提供五个内置主题，支持用户自定义主题。

为适应不同用户对于界面的需求，改变系统主题

用户想要改变系统主题

切换系统主题、新增编辑自定义主题

系统管理→公共配置→个性化配置→主题风格tab页

新增主题

点击左上角添加按钮，弹出抽屉进行配置。

![命名新增的主题，可以配置导航颜色，侧边栏颜色，页面颜色，功能颜色。其中功能颜色包](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/13.png)

命名新增的主题，可以配置导航颜色，侧边栏颜色，页面颜色，功能颜色。其中功能颜色包括主要，危险，成功，警告四种情况下按钮和提示的文字颜色或背景色。新增完成后可以选择，保存并使用，或仅保存。

![使用主题](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/14.png)

### 使用主题

鼠标悬浮在卡片上，点击操作按钮，使用自行配置的主题或内置主题，使用成功后，提示用户使用成功，并在使用成功的主题卡片内会有“使用中”的标签提示。

![编辑主题](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/15.png)

![编辑主题](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/16.png)

### 编辑主题

可以在自己新建的主题的操作列表中点击编辑按钮，弹出侧边抽屉，可以编辑主题。编辑完成后可以选择保存并使用，或仅保存。

![复制主题](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/17.png)

![复制主题](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/18.png)

### 复制主题

可以对所有主题进行复制操作，点击复制弹出侧抽屉，将复制目标的配置项带出来，名称变为#主题名称#副本。复制完成后，可以选择，保存并使用，或仅保存。

![删除主题](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/19.png)

### 删除主题

对于自建的主题可以选择删除

![全局功能](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/20.png)

### 全局功能

为适应不同用户对于部分功能个性化配置的需求，平台提供了全局功能自定义配置的功能，包含菜单展示方式、导航栏通用功能显示、AI助手功能显示、系统logo等配置。

为适应更多不同用户对于界面的需求，改变界面布局

用户想要改变界面布局

配置菜单展示方式、导航栏通用功能显示、AI助手功能显示、系统logo

系统管理→公共配置→个性化配置→全局功能tab页

改变菜单展示

点击单选框，改变菜单展示风格。

![导航栏通用展示](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/21.png)

![导航栏通用展示](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/22.png)

### 导航栏通用展示

点击复选框，调整导航栏各个功能是否显示。

![AI助手显示](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/23.png)

### AI助手显示

点击复选框，调整AI助手是否显示：

![菜单Logo](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/24.png)

### 菜单Logo

在菜单logo选项，可以鼠标悬浮图片上时可以预览、下载或重新上传展开logo和收起的logo。

![预览](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/25.png)

### 预览

![下载](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/26.png)

### 下载

![上传](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/27.png)

### 上传

![安全管理](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/28.png)

### 安全管理

安全管理是平台级功能，此功能主要是提供给系统管理员对整个系统账号密码安全相关信息进行配置及操作的入口。包含密码安全设置、解除密码锁定、系统通用设置功能。

对系统账号密码安全相关信息进行配置及操作

配置

系统管理→公共配置→安全管理

密码安全设置

密码安全设置包含功能如下：

初始密码配置：配置系统所有账号的初始密码；

错误密码设置：配置用户在登录时允许输错密码的次数以及输错达到最高次数之后的锁定时间及提示语信息，防止系统账号密码被暴力破解；

密码复杂度设置：设置用户在修改密码时，新密码的复杂度要求；

密码过期时间：设置整个系统用户的密码过期时间，要求定期更新密码。

![解除密码锁定](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/29.png)

### 解除密码锁定

在用户输错多次密码账号被锁定后，管理员可再次点击解锁按钮进行账号解锁。

![系统设置](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/30.png)

### 系统设置

提供前端全局设置功能，包含前端子系统是否开启加载，组件大小以及自研数据表格和agGrid表格切换功能。

![截图](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/31.png)
