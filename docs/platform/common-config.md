# 公共配置

> 系统入口：系统管理 → 公共配置



![个性化配置](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/12.png)
![个性化配置](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/11.png)

![安全管理](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/28.png)
低代码平台的公共配置包括数据字典、国际化配置、个性化配置及安全管理。

---

## 数据字典

> 系统管理 → 公共配置 → 系统字典

数据字典分为**系统字典**和**业务字典**，系统管理员可见可配，用于给系统或业务配置公共属性（功能模块描述、服务信息、数据源类型等）。

### 操作说明

1. **新增类别**：鼠标置于系统字典上点击「新增」可新建类别，类别作为菜单进行分组管理

![新增字典](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/01.png)
2. **新增字典**：在类别下新增字典，**模块编码自定义后不可修改**，建议使用英文
3. **新增字典项**：字典和字典项通过唯一不可更改的 `字典code` 关联
4. **字典值**：每个字典项有 3 个 value 值，可约束是否必填

![字典排序](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/04.png)
5. **字典排序**：编辑时可设定排序字段和升降序，供查询排序使用

::: tip 三个 value 值
字典项有 3 个 value 值可供使用，不一定都需要有值。系统使用时根据配置取出所需值。
:::

---

## 国际化配置

> 系统管理 → 公共配置 → 国际化配置

平台默认支持简体中文和美式英语，可通过在线配置动态增加语言。

### 操作说明

| 操作 | 说明 |
|------|------|
| 新增翻译字段 | 填写 CODE 码（唯一不可重复，建议加前缀如 `menu`/`sysDict`）、中文、英文 |
| 修改/删除 | 在记录中操作；菜单/消息模板/字典字段被使用时不可直接删除 |


![表数据初始化](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/08.png)
![表数据初始化](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/07.png)
| 表数据初始化 | 初始化时将菜单名称、字典 value1、消息模板等存入国际化表（`sys_i18n_config`），支持增量存储 |
| 国际化数据同步 | 翻译未同步时手动补偿（如修改中文后页面仍显示旧值） |
| 新增语言类型 | 语言类型需满足规范（如日语 `JA_JP`），创建后不可修改，只能删除 |

---

## 个性化配置

> 系统管理 → 公共配置 → 个性化配置

### 主题风格

平台提供 5 个内置主题，支持用户自定义主题。

| 操作 | 说明 |
|------|------|
| 新增主题 | 配置导航颜色、侧边栏颜色、页面颜色、功能颜色（主要/危险/成功/警告） |

![使用主题](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/14.png)
| 使用主题 | 悬浮卡片点击操作按钮，使用成功后显示「使用中」标签 |


![编辑主题](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/16.png)
![编辑主题](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/15.png)
| 编辑主题 | 仅可编辑自建主题 |


![复制主题](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/18.png)
![复制主题](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/17.png)
| 复制主题 | 复制目标配置，名称变为 `#主题名称#副本` |

![删除主题](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/19.png)
| 删除主题 | 仅可删除自建主题 |


![全局功能](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/20.png)
### 全局功能

| 配置项 | 说明 |
|--------|------|
| 菜单展示方式 | 单选切换菜单展示风格 |
| 导航栏通用功能 | 复选框控制各功能是否显示 |
| AI 助手显示 | 复选框控制 AI 助手是否显示 |

![预览](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/25.png)

![下载](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/26.png)

![上传](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/27.png)
| 菜单 Logo | 可预览、下载、重新上传展开 logo 和收起的 logo |

---

## 安全管理

> 系统管理 → 公共配置 → 安全管理

平台级功能，提供系统账号密码安全配置。

### 密码安全设置

| 配置项 | 说明 |
|--------|------|
| 初始密码配置 | 配置系统所有账号的初始密码 |
| 错误密码设置 | 配置允许输错次数、达到上限后的锁定时间及提示语 |
| 密码复杂度设置 | 设置修改密码时新密码的复杂度要求 |
| 密码过期时间 | 设置系统用户密码过期时间，要求定期更新 |


![解除密码锁定](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/29.png)
### 解除密码锁定

用户输错多次密码账号被锁定后，管理员可点击解锁。


![系统设置](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/30.png)
### 系统设置

前端全局设置：子系统是否开启加载、组件大小、自研数据表格与 AGGrid 表格切换。

![最后新增字典项 字典和字典项通过唯一不可更改的字典code关...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/02.png)
![新增字典值](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/03.png)

![表单释义](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/05.png)

![删除翻译字段](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/06.png)

![新增国际化语言类型](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/09.png)

![删除国际化语言类型](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/10.png)

![命名新增的主题，可以配置导航颜色，侧边栏颜色，页面颜色，功能...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/13.png)


![导航栏通用展示](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/22.png)
![导航栏通用展示](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/21.png)

![AI助手显示](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/23.png)

![菜单Logo](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/24.png)

![权限管理](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/common-config/31.png)
