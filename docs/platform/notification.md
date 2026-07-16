# 通知中心

> 系统管理 → 通知配置


![消息发送](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/08.png)
通知中心服务名称为 `JH4J-CODE-OAMS`，提供消息推送端、系统通知模板、系统消息查询、消息发送等功能。

---

## 推送端管理

> 系统管理 → 通知配置 → 消息推送端

系统默认提供两个推送端：**PC 端**和**企业微信端**，可扩展更多推送端。

| 操作 | 说明 |
|------|------|

![新增推送端](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/01.png)
| 新增推送端 | 填写推送端基本信息 |

![参数编辑](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/02.png)
| 参数编辑 | 配置推送端参数 |

---


![消息模板](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/03.png)
## 消息模板

> 系统管理 → 通知配置 → 系统通知模板

系统内置审批流待办模板等通知模板。

### 字段说明

| 字段 | 说明 |
|------|------|
| 类型 | 按通知类型分：**讯息**和**待办** |
| 业务类型 | 在数据字典中配置，字典 `strSn` 为 `businessType` |
| 短信内容 | 按系统内置模板配置，通过占位符自定义传参 |

---

## 消息查询

分为**系统消息查询**和**个人通知中心**：

| 入口 | 面向 | 功能 |
|------|------|------|
| 系统管理 → 通知配置 → 系统消息查询 | 系统管理员 | 查询系统所有消息 |
| 日常办公 → 协同办公 → 个人通知中心 | 普通用户 | 查询与自己相关的消息 |

---

## 消息发送

### 后端集成步骤

**1. 引入 SDK**

pom 中引入通知中心 SDK，启动类加注解：

```java
@EnableFeignClients({"com.jhict.oams.api.feign"})
```

**2. 定义枚举**（消息类型）


![发送消息](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/10.png)
**3. 发送消息**：调用 OAMS Feign 接口


![完成待办](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/11.png)
**4. 完成待办**：待办完成后调用接口标记完成


![自定义消息详情](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/12.png)
**5. 自定义消息详情**：在消息发送时设置 `setShowUrl('xxx.vue?id=xxx')`，Vue 文件中通过 `this.data.id` 读取参数

---


![自定义消息推送端](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/13.png)
## 自定义消息推送端

平台自带的推送端不满足需求时可扩展：

1. **新增推送端数据**：消费主题为 `jhcloud_message_+推送端编码`
2. **实现消息消费**：新增一个消费类消费 RocketMQ 消息（如新增短信推送端）

![流程管理](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/16.png)
![流程管理](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/15.png)


![新增编辑](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/04.png)

![类型字段按照通知类型消息可以分为：讯息和待办。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/05.png)

![短信内容中可按照系统内置消息模板进行配置，通过配置占位符形式...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/06.png)

![个人通知中心：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/07.png)

![开启oams的feign扫描：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/09.png)

![新增一个短信推送](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/notification/14.png)
