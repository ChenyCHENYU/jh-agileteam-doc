# 模型设计

> 模型是一组图形化或可视化的接口，平台支持单表模型和多表模型两种设计模式。

---

模型用于保存系统业务中产生的数据，主要有两种：单表模型和多表模型。单表模型对应数据库的一个表，多表模型对应数据库中有联系的多个表。

单表模型

单表模型又叫基础模型，主要用于用单个表就能解决问题的场景。

创建单表模型，为构建低代码页面做准备，用于处理简单的业务场景

处理简单业务场景时

增删改查、导入、复制、生成sql、在线对比、数据校验、默认接口生成、默认java代码生成、数据权限配置

顺序进入系统管理－低代码－模型管理页面，进入模型管理页面后，左边是菜单，支持搜索，点击菜单，右边显示该菜单及其子菜单下的所有模型，支持通过模型编码，模型名称和服务名进行搜索。

![选择最底层的菜单，可以在对应的页面新增或导入模型。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/01.png)

选择最底层的菜单，可以在对应的页面新增或导入模型。

模型导入

点击“导入”按钮，选择数据源，可以从该数据源下所有的表中选择并导入所处菜单生成基础模型。

![新增模型](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/02.png)

### 新增模型

点击“新增按钮”，可跳转到新增模型界面。

![填写模型基本信息后即可通过点击“提交并执行sql”按钮保存模型。此外新增模型时还](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/03.png)

填写模型基本信息后即可通过点击“提交并执行sql”按钮保存模型。此外新增模型时还可进行以下操作：

新增字段。

点击“新增字段”按钮，填写字段的名称、逻辑类型等信息。

引入字段

点击“引入”按钮，可以选择其他模型的字段并引入到当前模型中

![3）查看sql](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/04.png)

### 3）查看sql

点击sql栏，可以查看当前模型的建表、删除表、建索引、删除索引的sql，支持MySQL、Oracle、sqlserver三种数据库。

对模型的其他操作

对于模型，可以进行以下操作：

![编辑](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/05.png)

### 编辑

点击“编辑”，跳转到编辑模型界面，可以对模型的部分基本信息、字段等进行修改。

![复制模型](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/06.png)

### 复制模型

点击“复制”选项，可以在当前菜单下创建一个内容和当前模型一样的新模型，新模型的编码和名称由用户定义。

![删除模型](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/07.png)

### 删除模型

点击“删除”选项，可以删除选择的模型。

挂载模型

点击“挂载”选项，可以选择将此模型加入哪些菜单下。

一键解除挂载

点击“一键解除”选项，可以解除当前模型的所有挂载。

生成sql

点击“生成sql”选项，可以生成当前模型的建表语句。

在线对比

点击“在线对比”选项，展示模型和数据库中类型不一致的字段，可以选择将模型的字段同步给数据库或将数据库的字段同步给模型。

![数据校验](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/08.png)

### 数据校验

点击“数据校验”选项，可以设置增、删、改的条件，只有满足了对应条件，才能正常执行增、删、改操作。

![默认接口生成](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/09.png)

### 默认接口生成

点击“默认接口生成”选项，系统自动生成该模型的默认接口。

默认java代码生成

点击“默认java代码”选项，填写包名和微服务模块路径后，可以生成该模型的基础代码，方便直接复制到后端使用。

![数据权限配置](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/10.png)

### 数据权限配置

点击“数据权限配置”选项，可以配置模型的数据权限。

![之后可以选择将该权限授权给某个用户或某类角色，被授权的用户或角色只能查看权限下的](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/11.png)

之后可以选择将该权限授权给某个用户或某类角色，被授权的用户或角色只能查看权限下的数据。

多表模型

多表模型又叫关系模型，适用于需要多个表配合才能完成任务的场景。

创建多表模型，为构建低代码页面做准备，用于处理较复杂的业务场景

处理较复杂的业务时

增删改查、接口生成、数据权限配置

系统管理－低代码－关系模型。

新增关系模型

点击“新增按钮”，进入新增关系模型页面。

填写关系模型基本信息。

从左侧拖入需要建立关系的模型，将要建立关系的两个表重合放置即可建立关系。

![点击两个模型之间的图标，设置两个模型的关联条件。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/12.png)

点击两个模型之间的图标，设置两个模型的关联条件。

![点击模型，设置它们的角色、别名、编码以及要展示的字段。对于角色类型，一个关系模型](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/13.png)

点击模型，设置它们的角色、别名、编码以及要展示的字段。对于角色类型，一个关系模型只能有一个主模型，其他模型中如果是一对一的关系就是单个关联，是一对多的关系就是集合关联。

![设置完成后点击提交即可保存关系模型。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/14.png)

设置完成后点击提交即可保存关系模型。

关系模型的其他操作

对关系模型还能进行以下操作：

![编辑](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/15.png)

### 编辑

点击“编辑”选项，进入编辑关系模型页面，可以编辑关系模型的部分信息。

![数据权限配置](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/16.png)

### 数据权限配置

点击“数据权限配置”选项，可以配置模型的数据权限。

![之后可以选择将该权限授权给某个用户或某类角色，被授权的用户或角色只能查看权限下的](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/17.png)

之后可以选择将该权限授权给某个用户或某类角色，被授权的用户或角色只能查看权限下的数据。

默认接口生成

点击“接口生成”选项，系统自动生成该关系模型的默认接口。

删除

点击“删除”选项，删除该关系模型。
