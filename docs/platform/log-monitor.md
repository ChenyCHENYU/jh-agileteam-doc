# 日志监控

> 系统管理 → 日志监控


![安全审计](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/01.png)

![日志查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/24.png)

![数据备份](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/51.png)

![请求看板](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/55.png)

![热配置日志级别](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/56.png)
平台日志监控包括安全审计、日志查询、SQL 记录、数据备份、请求看板和热配置日志级别。

---

## 安全审计

> 系统管理 → 日志监控 → 安全审计

记录系统中的安全相关操作，包括登录日志、操作日志、异常日志等。

### 操作说明

- 按时间、用户、操作类型等条件筛选审计日志
- 查看操作详情（请求参数、响应结果、IP 地址等）
- 导出审计日志

---

## 日志查询

> 系统管理 → 日志监控 → 日志查询

查询微服务运行时日志（基于 Elasticsearch），支持：
- 按服务名、日志级别、关键字、时间范围筛选
- 查看日志详情
- 日志导出

---

## SQL 记录

> 系统管理 → 日志监控 → SQL 记录

记录系统执行的 SQL 语句，用于排查数据问题和性能优化。

- 按服务、SQL 类型（查询/更新/删除）、执行时间筛选
- 查看完整 SQL 和执行耗时
- 慢 SQL 标记

---

## 数据备份

> 系统管理 → 日志监控 → 数据备份

定时备份系统数据库数据。

| 操作 | 说明 |
|------|------|
| 创建备份任务 | 配置备份频率、保留份数 |
| 手动备份 | 立即执行一次备份 |
| 恢复 | 从备份恢复数据 |

---

## 请求看板

> 系统管理 → 日志监控 → 请求看板

实时展示系统请求监控数据：
- 请求 QPS 趋势图
- 接口响应时间分布
- 错误率统计
- 服务健康状态

---

## 热配置日志级别

> 系统管理 → 日志监控 → 热配置日志级别

无需重启服务即可动态调整微服务日志级别（DEBUG / INFO / WARN / ERROR）。

![点击某条日志记录“全链路ID”属性中的图标，可查看对应日志记...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/02.png)

![日志具体信息：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/03.png)
![点击某条日志记录最右侧的详情，可查看对应日志记录请求的详细信...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/04.png)

![日志记录详情所展示的内容：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/05.png)
![根据消息查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/06.png)

![根据错误消息查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/07.png)

![全部：全部的日志，如下图所示：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/08.png)
![是：消息字段不为空字符串的日志记录，即错误请求对应的日志记录...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/09.png)
![否：消息字段为空字符串的日志记录，即正常请求对应的日志记录，...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/10.png)
![根据CODE码查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/11.png)

![根据错误请求查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/12.png)

![全部：查询所有类型CODE码（2000，400X，500X）...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/13.png)
![是：仅查询非2000的CODE码（400X，500X）的日志...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/14.png)
![否：仅查询2000的CODE码的日志记录，如下图所示：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/15.png)
![根据访问账号查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/16.png)

![搜索指定用户：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/17.png)
![根据用户进行查询如下图所示：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/18.png)

![根据访问时间查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/29.png)
![根据访问时间查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/19.png)

![根据路径查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/20.png)

![根据耗时时间查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/21.png)

![根据访问者IP查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/22.png)

![多条件组合查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/23.png)

![根据访问人查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/25.png)

![选择指定用户：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/26.png)
![根据用户进行查询日志如下图所示：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/27.png)
![根据访问路径查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/28.png)

![注意，由于日志详情信息数据量巨大，因此查询有以下限制：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/30.png)

![根据日志级别查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/31.png)

![根据服务名称查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/32.png)

![根据全链路ID查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/33.png)

![根据获取的全链路ID查询对应的具体日志信息：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/34.png)
![注意：由于全链路ID的生成策略与日期时间相关，在安全审计页面...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/35.png)

![超出日期范围的全链路ID查询结果：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/36.png)
![安全审计页面直接查看超出日期范围的全链路ID对应日志信息：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/37.png)
![查询失败提示：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/38.png)
![根据多条件组合查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/39.png)

![钻取查询](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/40.png)

![查看钻取日志上下文：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/41.png)
![日志配置](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/42.png)

![日志打印效果如下图所示：](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/43.png)
![注：这里为了便于查看，省略了xml文件中部分内容并对其格式进...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/44.png)

![根据SQL关键字查询sql记录](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/45.png)

![根据全链路ID查询sql记录](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/46.png)

![根据时间范围字查询sql记录](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/47.png)

![根据耗时范围查询sql记录](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/48.png)

![根据查询记录数范围查询sql记录](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/49.png)

![多条件复合查询sql记录](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/50.png)

![筛选需要的表，点击【编辑】进入表设计；](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/52.png)
![勾选备份数据保存。](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/53.png)

![查看备份记录](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/54.png)

![注意：假设要修改开发环境下系统服务的日志级别，那么需要在na...](https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform/log-monitor/57.png)
