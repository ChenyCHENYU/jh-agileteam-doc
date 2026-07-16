# 权限管理

> 系统入口：系统管理 → 权限设置



![接口管理](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/08.png)
![接口管理](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/07.png)


![客户端管理](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/17.png)
![客户端管理](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/16.png)

![授权](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/21.png)

![数据权限授权查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/22.png)
平台权限管理包括角色管理、接口管理、客户端管理、数据权限管理及数据权限授权查询。

---

## 角色管理

> 系统管理 → 权限设置 → 角色管理

系统用户有不同的角色，不同角色访问不同菜单。系统管理员可管理系统角色（增删改查）、为角色分配菜单权限、快速给角色增加用户。


![操作说明](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/23.png)
### 操作说明

| 操作 | 说明 |
|------|------|
| 新增角色 | 填写角色信息，点击确定 |

![分配权限](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/01.png)
| 分配权限 | 选择子系统，勾选菜单及操作权限 |

![角色绑定](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/02.png)
| 角色绑定 | 批量分配岗位、用户、用户组 |


![移动端授权](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/04.png)
![移动端授权](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/03.png)
| 移动端授权 | 移动端查看菜单的授权 |


![操作日志](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/06.png)
![操作日志](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/05.png)
| 操作日志 | 查看角色操作日志 |

---

## 接口管理

> 系统管理 → 权限设置 → 接口管理

系统接口分为四类：通用接口、编码接口、敏捷接口、逻辑编排接口。此处只介绍权限相关部分。

### 操作说明

| 操作 | 说明 |
|------|------|

![接口挂载](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/09.png)
| 接口挂载 | 将接口挂载到指定菜单，用户需有该菜单权限才能访问接口 |
| 数据规则 | 设置接口参数校验规则 |


![列权限](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/13.png)
![列权限](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/12.png)
| 列权限 | 过滤掉某些列的数据 |


![行权限](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/15.png)
![行权限](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/14.png)
| 行权限 | 只返回符合规则的数据 |

> 接口可挂载到多个菜单，用户有其中一个菜单权限即可访问。

---

## 客户端管理

> 系统管理 → 权限设置 → 客户端管理

管理访问系统入口的客户端信息。

### 字段说明

| 字段 | 说明 |
|------|------|
| 客户端 ID | 设置客户端标识 |
| 客户端密钥 | 设置密钥 |
| 客户端权限集 | 能访问的系统和菜单的授权 |
| 授权模式 | 选择不同授权模式 |
| 令牌时效 | 登录有效时间 |
| 回调地址 | 登录授权失败后的回调地址 |

---

## 数据权限管理

> 系统管理 → 权限设置 → 数据权限管理

### 操作说明


![权限配置](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/20.png)
1. **权限配置**：配置数据权限规则
2. **授权**：
   - 用户/角色只授权其中一个即可（当前规则作用范围）
   - 接口必须授权（只有授权接口才受当前规则管控）

---

## 数据权限授权查询

查看系统中受数据权限管控的接口。可**启用/禁用**接口的权限管控（临时关闭）。


![用户如果要访问接口就需要有接口挂载的菜单的权限，接口可以挂载...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/11.png)
![用户如果要访问接口就需要有接口挂载的菜单的权限，接口可以挂载...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/10.png)

![新增客户端](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/18.png)
![表单释义](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/permission/19.png)

