# 22 · 限流熔断与外部调用规范（✅ 已落地）

> 📦 来源：`wl-skills-bd` v0.24.0 · `standards/22-resilience.md` · 本文可判定条目由 `wl-skills-bd validate`（B 系列）与 `mvn verify -Pwl-quality` 自动执行。


> 微服务架构下，一个下游慢能拖垮整条调用链，最终雪崩。本规范把"超时、重试、熔断、舱壁、限流"固化为团队基线。
>
> 强制度：🔴 必遵。
>
> **依据**：Spring Cloud OpenFeign 官方、Resilience4j 官方、Sentinel 官方、Netflix Hystrix 经验总结、Google SRE《SRE Book》。

---

## 1. 外部调用必带超时（线程耗尽事故源）

```yaml
# application.yml
feign:
  client:
    config:
      default:
        connect-timeout: 2000   # 连接超时 2s
        read-timeout: 5000      # 读超时 5s
        logger-level: BASIC
```

| 调用类型 | 连接超时 | 读超时 | 依据 |
|---|---|---|---|
| 内部 RPC（Feign） | 1~2s | 3~5s | Spring Cloud 官方 |
| 外部第三方 | 3s | 10~30s | 业务评估 |
| DB（MyBatis-Plus）| 1s | 5s | 连接池 HikariCP |
| Redis | 200ms | 1s | Lettuce/Jedis |

> **禁止默认无限等待**：超时是"快速失败"的前提，没有超时就是"慢速死亡"。

## 2. 重试策略（重试风暴事故源）

| 场景 | 重试 | 策略 |
|---|---|---|
| 查询（幂等） | 允许 | 3 次，指数退避（1s/2s/4s）|
| 写（非幂等）| **禁止默认重试** | 业务层证明幂等后开启 |
| 网络抖动 | 允许 | RetryTemplate + Predicate |
| 业务异常 | **禁止重试** | 立即抛出 |

```java
// ✅ Resilience4j 重试（只对网络异常）
RetryConfig config = RetryConfig.custom()
    .maxAttempts(3)
    .waitDuration(Duration.ofMillis(500))
    .retryOnException(e -> e instanceof ResourceAccessException)
    .retryExceptions(IOException.class)
    .ignoreExceptions(ServiceException.class)  // 业务异常不重试
    .build();
Retry retry = Retry.of("orderApi", config);
```

> **重试 + 重试 = 重试风暴**：调用链上每层都重试 3 次，总重试 = 3^n。网关层应关闭重试，只在 Service 层重试。

### 2.1 跨系统集成契约

生产者、消费者或消息投递不得只写在人读说明中。契约应机器声明：方向、producer/consumer、transport、payloadVersion/contractRef、稳定 identityId、排序键、重试次数与退避、确认方式、死信、重放、操作和错误码。

- 逻辑 ID 必须固定来源字段顺序、规范化规则、字符集和算法版本；禁止各模块各写一份可能漂移的 StableBusinessId/PayloadHash。
- 出站/双向投递必须声明 orderingKey；启用重试时必须有 deadLetter，并关联 `retryable=true` 的错误码。
- `integration inspect` 检查单份契约的声明完备性；`integration audit --module <module>` 只扫描当前模块根，报告重复或实现漂移，不自动改业务算法。

### 2.2 平台封装适配

MQ/HTTP 客户端可能由不同平台二次封装。通用契约不得硬编码 RocketMQTemplate、KafkaListener 或某个公司内部注解；由项目 `integration-adapters.json` 登记真实 Maven 坐标、Producer/Consumer/配置/测试证据和方向门禁，再用 `integration adapters --module <module>` 对账。

环境、Nacos 配置、公共 starter、Inbox/Outbox 任一单独存在都不等于 Transport 已接线。成熟度按 declared/dependency/configured/wired/tested/runtime-evidenced 逐级取证；BD 不连接 Broker，也不读取远端配置猜结果。详见 standards/30。

## 3. 熔断（级联雪崩事故源）

错误率 / 慢调用达到阈值时熔断，半开探测恢复：

```java
CircuitBreakerConfig config = CircuitBreakerConfig.custom()
    .failureRateThreshold(50)              // 错误率 50% 触发
    .slowCallRateThreshold(60)             // 慢调用占比 60% 触发
    .slowCallDurationThreshold(Duration.ofSeconds(2))
    .waitDurationInOpenState(Duration.ofSeconds(30))
    .slidingWindowSize(20)                 // 滑动窗口 20 次调用
    .minimumNumberOfCalls(10)              // 最少 10 次才统计
    .permittedNumberOfCallsInHalfOpenState(5)
    .build();
```

| 状态 | 行为 | 转移条件 |
|---|---|---|
| CLOSED | 正常调用 | 错误率/慢调用率超阈值 → OPEN |
| OPEN | 直接失败（不调用）| 等待 waitDuration → HALF_OPEN |
| HALF_OPEN | 探测性放行 5 次 | 成功 → CLOSED；失败 → OPEN |

## 4. 舱壁隔离（线程耗尽事故源）

```java
// ✅ 不同下游用独立线程池
ThreadPoolExecutor orderPool = new ThreadPoolExecutor(
    10, 20, 60, TimeUnit.SECONDS, new LinkedBlockingQueue<>(100));
ThreadPoolExecutor inventoryPool = ...;
```

| 方案 | 隔离方式 | 适用 |
|---|---|---|
| 线程池隔离 | 不同下游独立线程池 | 强隔离 |
| 信号量隔离 | 共享线程池 + 计数 | 性能优先 |

> 一个下游慢不要拖垮其他下游。jh4j-cloud 默认共享线程池场景下，敏感下游（支付/库存）用独立线程池。

## 5. 限流（突发流量事故源）

| 限流维度 | 工具 | 场景 |
|---|---|---|
| 接口级 | Sentinel / Resilience4j RateLimiter | 公开接口、查询接口 |
| 用户级 | Redis + Lua | 防刷、防自动化 |
| 租户级 | 网关层 | 大租户不挤占小租户 |
| 全局 | 网关层 | 兜底保护 |

```java
// ✅ Resilience4j RateLimiter
RateLimiterConfig config = RateLimiterConfig.custom()
    .limitForPeriod(100)              // 周期内 100 次
    .limitRefreshPeriod(Duration.ofSeconds(1))
    .timeoutDuration(Duration.ofMillis(500))  // 限流后等待 500ms
    .build();

// ✅ Redis + Lua 用户级限流（防刷）
String key = "prod:sale:ratelimit:userId:" + userId;
Long count = redisTemplate.execute(rateLimitScript, Collections.singletonList(key), 60, 10);
if (count > 10) throw new ServiceException("操作过于频繁");
```

## 6. 降级（用户体验事故源）

熔断/限流触发后必须有降级策略：

| 场景 | 降级策略 |
|---|---|
| 查询类 | 返回缓存 / 默认值 / 空结果 |
| 推荐类 | 返回热门列表 |
| 写入类（非核心）| 异步队列补偿 + 友好提示 |
| 核心写入（支付）| **禁止降级**，直接失败 + 告警 |

```java
@CircuitBreaker(name = "userApi", fallbackMethod = "getUserFallback")
public UserVO getUser(String id) {
    return userFeignClient.getById(id);
}
private UserVO getUserFallback(String id, Throwable t) {
    log.warn("getUser 调用失败，降级返回缓存 id={}", id, t);
    return userCacheService.getById(id); // 缓存或默认值
}
```

## 7. Feign 客户端规范（Spring Cloud 官方）

```java
@FeignClient(
    name = "sale-service",
    configuration = SaleFeignConfig.class,
    fallbackFactory = SaleClientFallbackFactory.class  // 推荐 fallbackFactory（带异常）
)
public interface SaleClient {
    @PostMapping("/sale/order/create")
    ApiResult<String> createOrder(@RequestBody OrderDTO dto);
}

@Component
public class SaleClientFallbackFactory implements FallbackFactory<SaleClient> {
    @Override
    public SaleClient create(Throwable cause) {
        return new SaleClient() {
            @Override
            public ApiResult<String> createOrder(OrderDTO dto) {
                log.error("createOrder 熔断降级 dto={}", dto, cause);
                return ApiResult.fail("SALE-503", "订单服务暂不可用");
            }
        };
    }
}
```

- **推荐 `fallbackFactory`** 而非 `fallback`：能拿到触发异常
- **禁用 ribbon 默认重试**：`ribbon.MaxAutoRetries=0`，重试在 Service 层显式控制
- **Feign 不进事务**（见 10-transaction）

## 8. jh4j-cloud 集成

团队默认技术栈：

| 能力 | 推荐实现 | 备注 |
|---|---|---|
| Feign 超时 | `feign.client.config.default` | yml 声明式 |
| 熔断 | Resilience4j / Sentinel | 二选一，不混用 |
| 限流 | Sentinel 注解 `@SentinelResource` | 网关 + 应用层 |
| 降级 | fallbackFactory | 带异常日志 |
| 链路追踪 | SkyWalking / jaeger | traceId 透传 |

> 接入 Sentinel 或 Resilience4j 后，更新 `.wl-skills-bd/config.json` 的 `resilience.provider` 字段，doctor 体检校验。

## 9. 正反例

```java
// ✅ Feign + 超时 + 熔断 + 降级
@FeignClient(name = "sale", fallbackFactory = SaleFallback.class)
public interface SaleClient { ... }

// ✅ 限流注解
@SentinelResource(value = "createOrder", blockHandler = "blockHandler")
@PostMapping("save")
public ApiResult<String> save(@RequestBody DTO dto) { ... }

// ❌ 无超时（默认无限等待）
@FeignClient(name = "sale")  // 没有 configuration
public interface SaleClient { ... }

// ❌ Feign 进事务（长事务）
@Transactional
public void save() { saleClient.call(); } // 网络调用进事务
```

## 10. 接入检查清单（doctor 未来扩展）

| 检查项 | 风险 |
|---|---|
| Feign 客户端缺超时配置 | 🔴 线程耗尽 |
| 重试无上限或重试写操作 | 🔴 数据不一致 |
| 无熔断器 | 🔴 级联雪崩 |
| 公开接口无限流 | 🔴 被刷 |
| 降级方法吞异常（不记日志）| 🟡 隐蔽故障 |

## 变更记录

- 2026-08-31 v0.24：增加平台封装适配描述符与接线成熟度证据，禁止把特定 MQ API 固化为通用规则。
- 2026-08-31 v0.23：新增逻辑 ID、载荷版本、排序、重试/确认/死信/重放和重复工具机器审计。
- 2026-07-18 v0.10：新增限流熔断与外部调用规范，落地 Feign/Resilience4j/Sentinel 团队基线。
