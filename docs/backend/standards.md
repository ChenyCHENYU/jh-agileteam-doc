# 后端开发规范

<AuthorTag :authors="['YangTianGuang','ZhangXiang','DaiAn','ZhangJie','PanChaoYue']" />

::: info 📋 规范说明
本文档持续沉淀后端开发规范与约定，基于 **Java 8 + Spring Boot + jh4j-cloud 3.x + MyBatis-Plus** 技术栈。
:::

## 目录

- [一、字符串与包装类型比较](#一、字符串与包装类型比较)
- [二、操作符误用规范](#二、操作符误用规范)
- [三、包结构 & 分层约定](#三、包结构--分层约定)
- [四、命名规范](#四、命名规范)
- [五、接口设计规范](#五、接口设计规范)
- [六、异常处理规范](#六、异常处理规范)

---

## 一、字符串与包装类型比较

### 规则

> **String 和包装类型（Integer、Long、Boolean 等）的比较必须使用 `equals()`，禁止使用 `==`。**
>
> `==` 比较的是**内存地址（引用）**，而非对象值。

### ❌ 错误示例

```java
String firstName = getFirstName();
String lastName  = getLastName();

// 非合规：即使两个字符串值相同，也可能返回 false
if (firstName == lastName) {
    // ...
}
```

```java
Integer a = 200;
Integer b = 200;

// 非合规：超出 [-128, 127] 缓存范围后，== 返回 false
if (a == b) {
    // ...
}
```

### ✅ 正确示例

```java
String firstName = getFirstName();
String lastName  = getLastName();

// 合规：先判空，再用 equals() 比较值
if (firstName != null && firstName.equals(lastName)) {
    // ...
}

// 或使用 Objects.equals()，自动处理 null
if (Objects.equals(firstName, lastName)) {
    // ...
}
```

```java
Integer a = 200;
Integer b = 200;

// 合规：包装类型使用 equals()
if (a.equals(b)) {
    // ...
}
```

### 说明

| 类型 | 推荐写法 | 说明 |
|------|---------|------|
| `String` | `Objects.equals(a, b)` 或 `a != null && a.equals(b)` | 字符串字面量可用 `"constant".equals(var)` 避免 NPE |
| `Integer` / `Long` 等包装类 | `.equals()` | JVM 对 [-128, 127] 有缓存，超出范围 `==` 不可靠 |
| 基本类型 `int` / `long` | `==` | 基本类型直接比较值，无此问题 |
| 枚举 | `==` | 枚举是单例，`==` 安全 |

---

## 二、操作符误用规范

### 规则

> **禁止误用操作符对（`=+`、`=-`、`=!`），应使用复合赋值操作符（`+=`、`-=`、`!=`）。**
>
> `=+` / `=-` / `=!` 在语法上合法（赋正值 / 赋负值 / 赋取反值），可以编译通过，但**不产生预期的累加/递减/不等效果**，属于隐蔽 Bug。

### ❌ 错误示例

```java
int total = 0;
total =+ count;   // 非合规：等价于 total = (+count)，不是 total += count

int price = 100;
price =- discount; // 非合规：等价于 price = (-discount)，不是 price -= discount

if (status =! expected) { // 非合规：赋值表达式，不是 status != expected
    // ...
}
```

### ✅ 正确示例

```java
int total = 0;
total += count;    // 合规：累加

int price = 100;
price -= discount; // 合规：递减

if (status != expected) { // 合规：不等比较
    // ...
}
```

### 说明

这类错误在 **Code Review** 中极易被忽略，建议配置静态分析工具（FindBugs / SonarQube）对此类写法进行扫描告警。

---

## 三、包结构 & 分层约定

> 🚧 内容持续补充中

遵循 `jh4j-cloud 3.x` 标准分层：

```
com.jhlc.<module>
├── controller    # REST 接口层，仅做参数校验与转发
├── service       # 业务逻辑层（接口 + impl）
├── mapper        # MyBatis-Plus Mapper 接口
├── entity        # 数据库实体（@TableName）
├── dto           # 请求/响应 DTO
├── vo            # 视图对象（仅对外展示用）
└── config        # 模块级配置
```

---

## 四、命名规范

> 🚧 内容持续补充中

| 元素 | 规范 | 示例 |
|------|------|------|
| 类名 | UpperCamelCase | `OrderController` |
| 方法名 | lowerCamelCase | `getOrderById` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 数据库表 | snake_case | `wl_order_info` |
| 接口 URL | 全小写 kebab-case | `/api/order-info/list` |

---

## 五、接口设计规范

> 🚧 内容持续补充中

- 遵循 RESTful 风格，使用标准 HTTP 方法（GET / POST / PUT / DELETE）
- 统一响应格式使用平台 `R<T>` 封装
- 分页查询统一使用 `Page<T>` + `IPage` 返回

---

## 六、异常处理规范

> 🚧 内容持续补充中

- 业务异常统一使用平台 `ServiceException` 抛出
- 禁止在 Controller 层捕获异常后返回 `null`
- 全局异常由 `GlobalExceptionHandler` 统一处理
