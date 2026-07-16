# 菜单配置

> 系统入口：系统管理 → 菜单程序配置


![菜单管理](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/menu-config/05.png)
菜单是平台内部进行功能管理的入口，包含领域管理、子系统管理、菜单管理和独立页面。

---

## 领域管理

> 系统管理 → 菜单程序配置 → 领域管理

领域是平台提供的业务领域总称，也是子系统入口。

| 操作 | 说明 |
|------|------|

![新增领域](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/menu-config/01.png)
![填写相关信息后点击确定即可新增领域。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/menu-config/02.png)

| 新增领域 | 填写信息后点击确定 |
| 编辑领域 | 修改信息、控制领域隐藏 |
![可对领域的信息进行修改，控制领域的隐藏等。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/menu-config/03.png)

| 导入导出 | 领域自动随应用导入导出，无需特殊操作 |

---

## 子系统管理

> 系统管理 → 菜单程序配置 → 子系统管理

子系统是平台提供的系统描述总称，也是菜单入口。新建子系统并挂上菜单后，具有系统菜单权限的用户可在首页看到系统入口。


![字段](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/menu-config/09.png)
### 字段说明

| 字段 | 说明 |
|------|------|
| 图标 | 首页展示的图标（图片上传） |
| 路由 | 页面识别子系统的唯一标识，可自定义，不可重复 |
| 系统名称 | 自定义 |
| 隐藏 | 勾选后系统不可见 |

---

## 菜单管理

> 系统管理 → 菜单程序配置 → 菜单管理

菜单挂载在子系统内部，位于左侧。分为三种类型编辑：**目录、菜单、动作**。

### 字段说明

| 字段 | 说明 |
|------|------|
| 图标 | 菜单图标，可从系统选择或自定义 |
| 显示排序 | 在父级菜单展示的顺序（从小到大） |
| 是否隐藏 | 菜单在父级下是否隐藏 |
| 是否使用缓存 | 前端当前页面是否使用缓存 |
| 权限标识 | 必填，全局唯一标识字符串 |
| 组件路径 | 前端组件路径地址（可为空） |
| 绑定页面 | 菜单和页面绑定（可无先后顺序） |

---

## 独立页面

> 系统管理 → 菜单程序配置 → 独立页面

独立页面用于动态定义页面路由及组件映射关系，实现页面的动态注册与访问控制。支持一级路由和二级嵌套路由结构。

### 操作说明

| 操作 | 说明 |
|------|------|
| 新增/编辑 | 填写领域、路径、是否白名单、菜单名称、组件路径 |
| 一级路由 | 仅配置组件路径时，生成一级路由页面 |
| 二级路由 | 同时配置组件路径与二级路由组件路径时，生成嵌套路由结构 |
| 删除 | 删除后页面路由访问失效 |

![修改管理](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/menu-config/04.png)

![编辑管理](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/menu-config/06.png)

![菜单编辑框：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/menu-config/07.png)
![动作编辑框：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/menu-config/08.png)

![列表字段包括：领域、路径、是否白名单、菜单名称、组件路径及操...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/menu-config/10.png)

![一级路由预览效果](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/menu-config/11.png)

![二级路由预览效果](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/menu-config/12.png)

![删除独立页面](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/menu-config/13.png)
