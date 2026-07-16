# 页面设计

> 系统管理 → 低代码 → 页面设计

页面设计器是低代码平台的核心可视化工具，通过拖拽组件、配置属性、绑定数据源来构建页面。

---


![页面组件](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/21.png)
## 页面组件

页面中可使用组件分为三层：**基础组件、高级组件、页面组件**。

| 类型 | 说明 | 示例 |
|------|------|------|
| 基础组件（原子组件） | 最小功能单位，最高复用性 | 按钮、输入框、下拉框 |
| 高级组件 | 由原子组件组合的复杂组件 | 表格、表单、查询区 |
| 页面组件 | 页面上的独立功能模块 | 导航栏、页眉、页脚、卡片 |

---

## 平台组件

平台内置组件，由平台统一维护和升级。

---

## 组件库

### 基础组件

包含表单输入类、按钮类、展示类等原子组件。

### 高级组件

根据业务场景抽离的复合组件，如数据表格、查询表单、工具栏等。

### 页面组件

页面级功能模块，如列表页、详情页、表单页等模板组件。

---

## 大纲树

展示整个页面的构成树形结构，支持：
- 拖拽调整组件层级和顺序
- 选中组件快速定位
- 删除/复制组件

---


![组件变量](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/27.png)
## 组件变量

| 属性 | 说明 |
|------|------|
| 命名（name） | 以英文字母开头，不可为中文，建议有业务含义（如 `userList`） |
| 描述（label） | 中文名称 |
| 数据类型 | string / number / boolean / array / object / function / date |
| 默认值 | 变量初始值 |
| 业务类型 | 对应的业务数据类型 |
| 业务值 | 业务数据类型下的枚举值 |

---

## 数据源


![接口](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/29.png)
数据源提供对数据操作接口的查看与维护入口。

### 操作说明

1. 选择模型或接口作为数据源
2. 绑定到组件（如表格、下拉框）
3. 配置请求参数和响应映射

---


![画布](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/37.png)
## 画布

可视化拖拽区域，所见即所得。

::: warning 编辑态 vs 预览态
组件有两种状态：编辑态和预览态。组件的最终实现效果**以预览画面为准**，不以画布中为准。
:::

### 画布操作

| 操作 | 说明 |
|------|------|
| 拖拽组件 | 从组件库拖拽到画布 |
| 选中组件 | 点击选中，右侧显示属性面板 |

![布局](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/12.png)
| 调整布局 | 拖拽调整大小和位置 |
| 撤销/重做 | 快捷操作区 |
| 预览 | 预览构建完成的页面 |
| 保存 | 保存发布页面 |

### 滚动条设计

样式配置中设置 `overflow-auto` 样式。

![一个标准的组件应该做到：功能职责单一、可复用性高、可维护性高...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/01.png)
![页面组件属性](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/02.png)

![在组件属性区域点击新增，创建一个组件属性，如下图：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/03.png)
![在父组件页面设计中，选中子组件，右侧就多出了一个mainId...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/04.png)
![页面组件事件](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/05.png)

![然后在设计器中就可以监听子组件的事件了，如下图所示：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/06.png)
![子组件抛送事件给父组件，子组件通过this.$emit('事...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/07.png)
![获取组件实例](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/08.png)

![在页面设计页面中，分为左、中、右三个区域，左侧区域通过点击组...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/09.png)

![样式：支持基础样式修改以及自定义样式修改](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/10.png)

![高级：提供高级配置功能，如是否渲染、是否显示、操作权限、逻辑...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/11.png)








![组件名称](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/20.png)
![组件名称](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/19.png)
![组件名称](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/18.png)
![组件名称](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/17.png)
![组件名称](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/16.png)
![组件名称](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/15.png)
![组件名称](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/14.png)
![组件名称](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/13.png)

![然后通过this.$refs.table获取组件实例。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/22.png)

![查看可访问的组件方法和属性：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/23.png)
![调用组件方法、属性](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/24.png)

![调整组件顺序、结构](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/25.png)

![任意层级移动。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/26.png)

![该组件中包含两个动作：view和remove，分别表示查看和...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/28.png)

![接口调用函数](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/30.png)
![调用方法：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/31.png)
![接口清空入参、出参函数](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/32.png)
![平台组件的属性配置均可直接绑定接口生成的变量上。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/33.png)

![新增接口](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/34.png)
![删除接口](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/35.png)

![更新接口](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/36.png)

![样式配置面板](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/38.png)

![事件处理面板](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/39.png)

![页面内操作权限即为数据源的动作权限分组，在高级面板中，配置操...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/40.png)

![撤销、恢复](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/41.png)

![门户页设计](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/page-design/42.png)
