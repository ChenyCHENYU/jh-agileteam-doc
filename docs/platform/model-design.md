# 模型设计

> 系统管理 → 低代码 → 模型管理

模型是一组图形化或可视化的接口，用于展示业务需求和解决方案。平台支持两种设计模式。

---

## 单表模型

单表模型又叫基础模型，对应数据库的一个表，用于单个表就能解决问题的场景。

### 操作说明


![新增模型](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/02.png)
1. **新增模型**：填写模型编码、模型名称、模型概述（表名依据模型编码创建）
2. **配置数据源**：选择模型表所在数据库
3. **配置服务**：选择接口挂载的服务
4. **新增字段**：在右侧抽屉中维护字段信息
5. **提交并执行 SQL**：生成数据库表及模型接口

### 字段业务类型

| 业务类型 | 说明 |
|---------|------|
| 数据字典（dict） | 关联字典 |
| 枚举（enums） | 固定枚举值 |
| 用户（user） | 用户选择器 |
| 公司（company） | 公司选择器 |
| 部门（dept） | 部门选择器 |
| 日期（date） | `yyyy-MM-dd` |
| 日期时间（datetime） | `yyyy-MM-dd HH:mm:ss` |
| 时间（time） | `HH:mm:ss` |
| 文本（text） | 单行文本 |
| 长文本（textarea） | 多行文本 |
| 数字（number） | 数值 |
| 自动编码（auto_no） | 自动生成编码 |
| 布尔值（boolean） | 是/否 |

---

## 多表模型

多表模型又叫关系模型，对应数据库的多个表，适用于需要多个表配合才能完成任务的场景。

### 操作说明

1. 选择主表和关联表
2. 配置表间关系（一对多、多对多等）
3. 配置关联字段
4. 提交生成多表模型和接口

![选择最底层的菜单，可以在对应的页面新增或导入模型。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/01.png)

![填写模型基本信息后即可通过点击“提交并执行sql”按钮保存模...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/03.png)

![3）查看sql](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/04.png)


![编辑](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/15.png)
![编辑](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/05.png)

![复制模型](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/06.png)

![删除模型](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/07.png)

![数据校验](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/08.png)

![默认接口生成](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/09.png)


![数据权限配置](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/16.png)
![数据权限配置](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/10.png)


![之后可以选择将该权限授权给某个用户或某类角色，被授权的用户或...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/17.png)
![之后可以选择将该权限授权给某个用户或某类角色，被授权的用户或...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/11.png)

![点击两个模型之间的图标，设置两个模型的关联条件。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/12.png)
![点击模型，设置它们的角色、别名、编码以及要展示的字段。对于角...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/13.png)
![设置完成后点击提交即可保存关系模型。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/model-design/14.png)


