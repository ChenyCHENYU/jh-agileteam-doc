# 文件服务

> 文件服务提供文件索引管理和文件管理能力。

---

文件服务为系统提供文件存储、文件预览、文件下载功能。

索引管理

索引指的是elasticsearch中的索引概念，对应的是文件服务的relativeType字段，即文件分组。

索引名称由：小写字母+下划线+数字组成。

创建了索引后，该索引（业务类型）的文本文件会自动创建索引，支持文件全文检索。

提供文件检索功能

运行时期

支持查看

运维部门

运维人员

![文件管理](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/file-service/01.png)

### 文件管理

文件管理页面如下图所示：

![该页面列出系统所有文件，文件分类表示业务类型（relativeType）；文件业](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/file-service/02.png)

该页面列出系统所有文件，文件分类表示业务类型（relativeType）；文件业务id表示业务数据id（relativeId），一般为业务表的主键id，是全局唯一的。

提供文件管理能力

运行时期

支持查看删除授权

用户

用户

文件上传

提供文件上传入口，用来上传文件

![逻辑删除](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/file-service/03.png)

### 逻辑删除

逻辑删除是在store_attach表标记该文件逻辑删除，但是在文件系统中不做删除。

物理删除

物理删除是在store_attach表标记该文件物理删除，在文件系统中做同步删除。

授权

将某个文件授权给人员或者角色，使该人员或该角色拥有打开该文件的权限。

![批量授权](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/file-service/04.png)

### 批量授权

勾选多个文件，进行批量授权人员或者角色。

分享

针对某个文件进行分享，使其他人员能够查看该文件。

选择需要分享的文件，点击该记录的【分享】按钮，弹出分享弹出框，设置有效期，点击【应用】，生成分享链接，点击【复制】，复制链接给外部使用。

![2.4文件检索](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/file-service/05.png)

### 2.4文件检索

文件检索菜单在：日常办公》文件系统》文件检索，该页面可以根据文件文本关键字检索文件。前提是这些文件的业务类型创建了索引。
