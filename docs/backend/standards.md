# 后端开发规范

<AuthorTag :authors="['YangTianGuang','ZhangXiang','DaiAn','ZhangJie','PanChaoYue']" />

::: info 📋 规范说明
本文档基于 **Java 8 + Spring Boot + jh4j-cloud 3.x + MyBatis-Plus** 技术栈，汇总命名、编程、性能、漏洞隐患四大类规范。
:::

## 目录

**命名规范**
- [1. 包命名规范](#_1-包命名规范)
- [2. 抽象类命名规范](#_2-抽象类命名规范)
- [3. 类命名规范](#_3-类命名规范)
- [4. 异常类命名规范](#_4-异常类命名规范)
- [5. Controller CRUD 命名规范](#_5-controller-crud-命名规范)
- [6. 测试类命名规范](#_6-测试类命名规范)
- [7. 数组类型声明规范](#_7-数组类型声明规范)

**多线程**
- [8. 禁止显式创建线程，使用线程池](#_8-禁止显式创建线程使用线程池)

**编程规范**
- [9. 禁止使用过时的方法和类](#_9-禁止使用过时的方法和类)
- [10. public static 应声明为常量](#_10-public-static-应声明为常量)
- [11. 枚举字段必须有注释](#_11-枚举字段必须有注释)
- [12. 条件判断中禁止执行复杂语句](#_12-条件判断中禁止执行复杂语句)
- [13. long/Long 赋值使用大写 L](#_13-long-long-赋值使用大写-l)
- [14. 方法代码长度不应超过 80 行](#_14-方法代码长度不应超过-80-行)
- [15. 控制结构必须使用大括号](#_15-控制结构必须使用大括号)
- [16. POJO 类必须重写 toString()](#_16-pojo-类必须重写-tostring)
- [17. POJO 类字段使用包装类型](#_17-pojo-类字段使用包装类型)
- [18. 字符串字面值禁止重复出现](#_18-字符串字面值禁止重复出现)
- [19. 单行注释置于代码行前](#_19-单行注释置于代码行前)
- [20. switch case 结尾必须加 break](#_20-switch-case-结尾必须加-break)
- [21. 删除非必要 import](#_21-删除非必要-import)
- [22. 使用 += 而不是 =+](#_22-使用-而不是)

**性能优化**
- [23. 禁止使用 Apache BeanUtils 拷贝属性](#_23-禁止使用-apache-beanutils-拷贝属性)
- [24. 获取毫秒数使用 System.currentTimeMillis()](#_24-获取毫秒数使用-systemcurrenttimemillis)
- [25. 集合初始化指定容量](#_25-集合初始化指定容量)
- [26. 正则表达式使用预编译](#_26-正则表达式使用预编译)
- [27. 循环内字符串拼接使用 StringBuilder](#_27-循环内字符串拼接使用-stringbuilder)

**漏洞隐患**
- [28. 禁止 new BigDecimal(float/double)](#_28-禁止-new-bigdecimalfloatdouble)
- [29. 布尔型变量名不以 is 开头](#_29-布尔型变量名不以-is-开头)
- [30. 禁止在 Stream forEach 中修改集合](#_30-禁止在-stream-foreach-中修改集合)
- [31. foreach 循环中禁止 remove/add](#_31-foreach-循环中禁止-removeadd)
- [32. equals 使用常量在前](#_32-equals-使用常量在前)
- [33. String/包装类型比较使用 equals()](#_33-string-包装类型比较使用-equals)
- [34. 原子类比较使用 .get()](#_34-原子类比较使用-get)
- [35. 禁止 float/double 等值判断](#_35-禁止-floatdouble-等值判断)
- [36. 基本类型返回值注意自动拆箱 NPE](#_36-基本类型返回值注意自动拆箱-npe)
- [37. Arrays.asList() 不可修改](#_37-arraysaslist-不可修改)
- [38. 随机数获取规范](#_38-随机数获取规范)
- [39. finally 中禁止 break/return/throw](#_39-finally-中禁止-breakreturnthrow)
- [40. SimpleDateFormat 线程安全问题](#_40-simpledateformat-线程安全问题)
- [41. toArray 需传入类型数组](#_41-toarray-需传入类型数组)
- [42. 删除未使用的私有变量](#_42-删除未使用的私有变量)
- [43. ThreadLocal 使用后必须清除](#_43-threadlocal-使用后必须清除)
- [44. 日期格式化 y/Y 区分](#_44-日期格式化-yy-区分)

---

## 一、命名规范

### 1. 包命名规范

包名统一使用小写，点分隔符之间有且仅有一个自然语义的英语单词。包名统一使用单数形式，但是类名如果有复数含义，类名可以使用复数形式。

```java
// ❌ 错误
package org.exAmple;

// ✅ 正确
package org.ex.ample;
```

---

### 2. 抽象类命名规范

抽象类类名应该以 `Abstract` 开始。

```java
// ❌ 错误
abstract class MyClass { }

// ✅ 正确
abstract class AbstractClass { }
```

---

### 3. 类命名规范

Java 类命名应该使用大驼峰（UpperCamelCase）命名规范。领域相关类（VO、DTO 等）除外。

```java
// ❌ 错误
class my_class { ... }

// ✅ 正确
class MyClass { ... }
class StudentVO { ... }
```

---

### 4. 异常类命名规范

异常类必须以 `Exception` 结尾，非异常类不允许以 `Exception` 结尾。

```java
// ❌ 错误
public class FruitException {       // 与异常无关，不应以 Exception 结尾
    private Fruit expected;
}
public class CarException {         // 忘记了 extends Exception
    public CarException(String message, Throwable cause) { }
}

// ✅ 正确
public class FruitSport {
    private Fruit expected;
}
public class CarException extends Exception {
    public CarException(String message, Throwable cause) { }
}
```

---

### 5. Controller CRUD 命名规范

为了统一，CRUD 方法统一使用以下命名：

| 操作 | 命名规范 |
|------|---------|
| 查询 | `getByXxx`、`list`（禁止使用 `select`、`find`）|
| 修改 | `update`、`updateXxx` |
| 删除 | `remove`、`removeXxx` |
| 新增 | `save` |

**方法级 URL 最多不超过 3 层：**

```java
// ❌ 错误
@GetMapping(value = "aa/bb/cc/22")   // 超过 3 级

// ✅ 正确
@GetMapping(value = "aa/bb/cc")      // 最多 3 级
```

- Controller 方法必须声明为 `public`
- REST 方法应加 Swagger 接口注解（`@ApiOperation` 等），标注参数类型、是否必选、用途

---

### 6. 测试类命名规范

测试类命名以它要测试的类的名称开始，以 `Test` 结尾。

```java
// ❌ 错误
class Foo {
    @Test void check() { }
}

// ✅ 正确
class FooTest {
    @Test void check() { }
}
class BarIT {
    @Nested
    class PositiveCase {
        @Test void check() { }
    }
}
```

---

### 7. 数组类型声明规范

`[]` 是数组类型的一部分，不可与方法名拆分。

```java
// ❌ 错误
public int getVector()[] { ... }
public int[] getMatrix()[] { ... }

// ✅ 正确
public int[] getVector() { ... }
public int[][] getMatrix() { ... }
```

---

## 二、多线程

### 8. 禁止显式创建线程，使用线程池

线程资源必须通过线程池提供，不允许在应用中自行显式创建线程。使用线程池可减少线程创建/销毁的开销，避免系统资源耗尽。

```java
// ❌ 错误
Thread th = new Thread();

// ✅ 正确
import com.google.common.util.concurrent.ThreadFactoryBuilder;

ThreadFactory namedThreadFactory = new ThreadFactoryBuilder()
    .setNameFormat("demo-pool-%d").build();
ExecutorService singleThreadPool = new ThreadPoolExecutor(
    1, 1, 0L, TimeUnit.MILLISECONDS,
    new LinkedBlockingQueue<Runnable>(1024),
    namedThreadFactory,
    new ThreadPoolExecutor.AbortPolicy()
);
singleThreadPool.execute(() -> System.out.println(Thread.currentThread().getName()));
singleThreadPool.shutdown();
```

---

## 三、编程规范

### 9. 禁止使用过时的方法和类

过时方法可能存在安全漏洞，或在未来版本被删除。过时方法和类使用 `@Deprecated` 标记：

```java
/**
 * @deprecated As of release 1.3, replaced by {@link #Fee}. Will be dropped with release 1.4.
 */
@Deprecated
public class Foo { ... }
```

---

### 10. public static 应声明为常量

`public static` 字段应声明为常量，标识符使用大写字母以 `_` 分隔。

```java
// ❌ 错误
public class Greeter {
    public static Foo foo = new Foo();
}

// ✅ 正确
public class Greeter {
    public static final Foo FOO_NAME = new Foo();
}
```

---

### 11. 枚举字段必须有注释

所有枚举类型字段必须要有注释，说明每个数据项的用途。

```java
// ✅ 正确
public enum TestEnum {
    /** agree */
    agree("agree"),
    /** reject */
    reject("reject");

    private String action;
    TestEnum(String action) { this.action = action; }
    public String getAction() { return action; }
}
```

---

### 12. 条件判断中禁止执行复杂语句

将复杂逻辑判断的结果赋值给一个有意义的布尔变量，提高可读性。

```java
// ❌ 错误
if (((condition1 && condition2) || (condition3 && condition4)) && condition5) { ... }

// ✅ 正确
if ((myFirstCondition() || mySecondCondition()) && myLastCondition()) { ... }
```

---

### 13. long/Long 赋值使用大写 L

`long` 或 `Long` 初始赋值时，必须使用大写 `L`，不能使用小写 `l`（易与数字 `1` 混淆）。

```java
// ❌ 错误
Long warn = 1l;

// ✅ 正确
Long warn = 1L;
```

---

### 14. 方法代码长度不应超过 80 行

一个优秀的方法应目的明确、职责单一、嵌套层数少、代码行数少。

---

### 15. 控制结构必须使用大括号

在 `if/else/for/while/do` 语句中必须使用大括号，即使只有一行代码。

```java
// ❌ 错误
if (isTrue())
    System.out.println("hello world");

// ✅ 正确
if (isTrue()) {
    System.out.println("hello world");
}
```

---

### 16. POJO 类必须重写 toString()

POJO 类（Entity、VO、DO、DTO、PO、Query 等）增加 `toString()` 方法，方便调试日志打印对象属性值。

```java
// ✅ 正确
class DemoEntity {
    private String firstName;

    @Override
    public String toString() {
        return "DemoEntity{firstName='" + firstName + "'}";
    }
}
```

---

### 17. POJO 类字段使用包装类型

POJO 类不应该使用基本类型，而要声明为包装类型。包装类可以区分 `0` 和 `null`，基本类型默认值为 `0`。

```java
// ❌ 错误
public class DemoDO {
    String str;
    int a;
}

// ✅ 正确
public class DemoDO {
    String str;
    Integer a;
}
```

---

### 18. 字符串字面值禁止重复出现

同一字符串字面值出现多次时，应提取为常量（小于 5 个字符的字面值除外）。

```java
// ❌ 错误
public void run() {
    prepare("action1");
    execute("action1");
    release("action1");
}

// ✅ 正确
private static final String ACTION_1 = "action1";
public void run() {
    prepare(ACTION_1);
    execute(ACTION_1);
    release(ACTION_1);
}
```

---

### 19. 单行注释置于代码行前

尾随注释难以保持可读性，单行注释应置于代码行前的空行。

```java
// ❌ 错误
int a1 = b + c; // This is a trailing comment that can be very very long

// ✅ 正确
// This very long comment is better placed before the line of code
int a2 = b + c;
```

---

### 20. switch case 结尾必须加 break

switch case 末尾必须显式 `break`，防止意外穿透执行。

```java
// ❌ 错误
switch (myVariable) {
    case 2:                // doSomething() 和 doSomethingElse() 都会执行
        doSomething();
    default:
        doSomethingElse();
        break;
}

// ✅ 正确
switch (myVariable) {
    case 1:
        foo();
        break;
    case 2:
        doSomething();
        break;
    default:
        doSomethingElse();
        break;
}
```

以下情况可以放宽（空 case 用于分组、return/throw/continue 显式结束）：

```java
switch (myVariable) {
    case 0:               // 空 case，与 case 1 共享行为
    case 1:
        doSomething();
        break;
    case 2:
        return;
    case 3:
        throw new IllegalStateException();
    case 4:
        continue;
    default:
        doSomethingElse();
}
```

---

### 21. 删除非必要 import

文件的导入应由 IDE 管理，禁止保留无用导入：

```java
// ❌ 错误
import java.lang.String;       // java.lang 始终隐式导入
import my.company.SomeClass;   // 同包文件始终隐式导入
import java.io.File;           // File 未被使用
import my.company2.SomeType;
import my.company2.SomeType;   // 重复导入

// ✅ 正确 — 仅保留实际使用的外部类导入
import my.company2.SomeType;
```

---

### 22. 使用 += 而不是 =+

`=+` / `=-` 在语法上合法但语义不同，会造成误解。

```java
// ❌ 错误
int target = -5;
int num = 3;
target =- num;  // 等价于 target = (-num) = -3，而非 target -= num
target =+ num;  // 等价于 target = (+num) = 3，而非 target += num

// ✅ 正确
target = -num;  // 明确赋负值
target += num;  // 明确累加
```

---

## 四、性能优化

### 23. 禁止使用 Apache BeanUtils 拷贝属性

Apache BeanUtils 性能较差，使用 Spring BeanUtils 或 Cglib BeanCopier 替代。

```java
// ❌ 错误
org.apache.commons.beanutils.BeanUtils.copyProperties(dest, src);

// ✅ 正确
org.springframework.beans.BeanUtils.copyProperties(src, dest);
```

---

### 24. 获取毫秒数使用 System.currentTimeMillis()

`new Date()` 本质上还是调用了 `System.currentTimeMillis()`，直接调用可减少内存开销。

```java
// ❌ 错误
long t = new Date().getTime();

// ✅ 正确
long t = System.currentTimeMillis();
```

---

### 25. 集合初始化指定容量

初始化集合时推荐指定初始化大小，避免频繁 resize 重构 hash 表影响性能。

```java
// ❌ 错误
Map<String, String> map = new HashMap<String, String>();

// ✅ 正确
Map<String, String> map = new HashMap<String, String>(16);
```

---

### 26. 正则表达式使用预编译

`Pattern.compile()` 具有显著性能代价，应将其声明为静态常量，避免在方法体内重复编译。

```java
// ❌ 错误
public class XxxClass {
    public Pattern getNumberPattern() {
        Pattern localPattern = Pattern.compile("[0-9]+");  // 每次调用都重新编译
        return localPattern;
    }
}

// ✅ 正确
public class XxxClass {
    private static final Pattern NUMBER_PATTERN = Pattern.compile("[0-9]+");
}
```

---

### 27. 循环内字符串拼接使用 StringBuilder

循环内使用 `+` 拼接字符串，每次循环都会创建新的 `StringBuilder` 对象，造成内存浪费。

```java
// ❌ 错误
String result = "";
for (String string : tagNameList) {
    result = result + string;
}

// ✅ 正确
StringBuilder sb = new StringBuilder();
for (String string : tagNameList) {
    sb.append(string);
}
String result = sb.toString();
```

---

## 五、漏洞隐患

### 28. 禁止 new BigDecimal(float/double)

`new BigDecimal(float/double)` 会造成精度丢失，使用 `BigDecimal.valueOf()` 或 `new BigDecimal(String)` 替代。

```java
// ❌ 错误
double d = 1.1;
BigDecimal bd1 = new BigDecimal(d);    // 精度丢失
BigDecimal bd2 = new BigDecimal(1.1);  // 同上

// ✅ 正确
double d = 1.1;
BigDecimal bd1 = BigDecimal.valueOf(d);
BigDecimal bd2 = new BigDecimal("1.1"); // String 构造保留精确值
```

---

### 29. 布尔型变量名不以 is 开头

POJO 类中的布尔类型变量不要以 `is` 开头，否则部分框架（如 MyBatis、Jackson）解析时会引起序列化错误。

```java
// ❌ 错误
public class DemoVO {
    Boolean isSuccess;
}

// ✅ 正确
public class DemoVO {
    Boolean success;
    Boolean deleted;
}
```

---

### 30. 禁止在 Stream forEach 中修改集合

不要在 `forEach(list::add)` 中修改外部集合，改用 `collect(Collectors.toList())`，自动线程安全且可并行化。

```java
// ❌ 错误
List<String> bookNames = new ArrayList<>();
books.stream()
    .filter(book -> book.getIsbn().startsWith("0"))
    .map(Book::getTitle)
    .forEach(bookNames::add);  // 非合规

// ✅ 正确
List<String> bookNames = books.stream()
    .filter(book -> book.getIsbn().startsWith("0"))
    .map(Book::getTitle)
    .collect(Collectors.toList());
```

---

### 31. foreach 循环中禁止 remove/add

foreach 循环里进行元素的 remove/add 会抛出 `ConcurrentModificationException`。需删除元素请使用 `Iterator`，并发操作时需对 Iterator 加锁。

```java
// ❌ 错误
for (String item : originList) {
    list.add("bb");  // 抛出异常
}

// ✅ 正确
Iterator<Integer> it = list.iterator();
while (it.hasNext()) {
    Integer temp = it.next();
    if (delCondition) {
        it.remove();
    }
}
```

---

### 32. equals 使用常量在前

当变量和常量字符串比较时，调用常量的 `equals()` 方法，可避免变量为 `null` 时的空指针异常。

```java
// ❌ 错误（inner 为 null 时抛 NPE）
String inner = "hi";
if (inner.equals("hello")) { ... }

// ✅ 正确（常量在前，inner 为 null 时安全返回 false）
String inner = "hi";
if ("hello".equals(inner)) { ... }
```

---

### 33. String/包装类型比较使用 equals()

`==` 比较的是内存地址，String 和包装类型（Integer、Long 等）必须使用 `equals()` 比较值。

```java
// ❌ 错误
String firstName = getFirstName();
String lastName  = getLastName();
if (firstName == lastName) { ... }  // 即使值相同也可能返回 false

// ✅ 正确
if (firstName != null && firstName.equals(lastName)) { ... }
// 或
if (Objects.equals(firstName, lastName)) { ... }
```

---

### 34. 原子类比较使用 .get()

原子类（`AtomicInteger` 等）的 `equals()` 比较的是对象引用，应使用 `.get()` 取值后再比较。

```java
// ❌ 错误
AtomicInteger a = new AtomicInteger(0);
AtomicInteger b = new AtomicInteger(0);
if (a.equals(b)) { ... }  // 比较引用，永远 false

// ✅ 正确
if (a.get() == b.get()) { ... }
```

---

### 35. 禁止 float/double 等值判断

浮点数（`float`、`double`）存在精度问题，禁止使用 `==` 或 `!=` 等值判断，推荐使用 `BigDecimal` 进行比较。

```java
// ❌ 错误
float myNumber = 3.146f;
if (myNumber == 3.146f) { ... }   // 因浮点精度，可能为 false
if (zeroFloat == 0) { ... }       // 计算结果可能接近但不等于 0

// ✅ 正确
float f1 = 1.2f;
double d1 = 2.3;
BigDecimal.valueOf(f1).compareTo(BigDecimal.valueOf(d1)) < 0;
// 或直接使用 BigDecimal 定义变量
```

---

### 36. 基本类型返回值注意自动拆箱 NPE

方法返回值类型为基本数据类型时，若返回 `null` 会触发自动拆箱抛出 `NullPointerException`。

```java
// ❌ 错误（返回 null 时自动拆箱抛 NPE）
public int fun() {
    Integer abc = null;
    return abc;  // NPE
}

// ✅ 正确
public Integer fun() {
    Integer abc = null;
    return abc;  // 返回 null 安全
}
```

---

### 37. Arrays.asList() 不可修改

`Arrays.asList()` 返回的 List 是固定大小的，调用 `add`/`remove`/`clear` 会抛出 `UnsupportedOperationException`。

```java
// ❌ 错误
List<String> t = Arrays.asList("a", "b", "c");
t.add("22");  // 抛出 UnsupportedOperationException

// ✅ 正确
List<String> t = new ArrayList<>(Arrays.asList("a", "b", "c"));
t.add("22");
```

---

### 38. 随机数获取规范

`Math.random()` 返回 `double` 类型，范围 `[0, 1)`，注意强转截断和除零问题。获取整数随机数优先使用 `Random.nextInt(n)`。

```java
// ❌ 错误
Random r = new Random();
int rand = (int) r.nextDouble() * 50;  // 截断后永远为 0
int rand2 = (int) r.nextFloat();       // 永远为 0

// ✅ 正确
Random r = new Random();
int rand = r.nextInt(50);  // 返回 [0, 50) 的整数
```

---

### 39. finally 中禁止 break/return/throw

`finally` 块中的 `return` 会导致方法提前结束，抑制 `try` 块中抛出的异常。

```java
// ❌ 错误
public static void doSomething() {
    try {
        throw new RuntimeException();
    } finally {
        return;  // 阻止 RuntimeException 向外传播
    }
}
```

---

### 40. SimpleDateFormat 线程安全问题

`SimpleDateFormat` 是线程不安全的类，不要定义为 `static` 变量，或使用以下方式保证线程安全：

```java
// ❌ 错误
private static SimpleDateFormat format = new SimpleDateFormat("HH-mm-ss");

// ✅ 方案 1：每次调用时创建新实例
private static final String FORMAT = "yyyy-MM-dd HH:mm:ss";
public String getFormat(Date date) {
    return new SimpleDateFormat(FORMAT).format(date);
}

// ✅ 方案 2：synchronized 加锁
private static final SimpleDateFormat SDF = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
public void getFormat() {
    synchronized (SDF) {
        SDF.format(new Date());
    }
}

// ✅ 方案 3：ThreadLocal 隔离
private static final ThreadLocal<DateFormat> DATE_FORMATTER = ThreadLocal.withInitial(
    () -> new SimpleDateFormat("yyyy-MM-dd")
);
```

---

### 41. toArray 需传入类型数组

`toArray()` 默认返回 `Object[]`，强转时会抛 `ClassCastException`，应传入类型数组。

```java
// ❌ 错误
public String[] getStringArray(List<String> strings) {
    return (String[]) strings.toArray();  // ClassCastException
}

// ✅ 正确
public String[] getStringArray(List<String> strings) {
    return strings.toArray(new String[0]);
}
```

---

### 42. 删除未使用的私有变量

未使用的 `private` 字段属于死代码，应删除，提高可维护性。

```java
// ❌ 错误
public class MyClass {
    private int foo = 42;  // 从未使用
    public int compute(int a) { return a * 42; }
}

// ✅ 正确
public class MyClass {
    public int compute(int a) { return a * 42; }
}
```

---

### 43. ThreadLocal 使用后必须清除

必须回收自定义的 `ThreadLocal` 变量，尤其在线程池场景下，避免内存泄漏和业务污染。在代码中使用 `try-finally` 确保调用 `remove()`。

```java
// ❌ 错误
public void incorrectCleanup() {
    DELEGATE.set(null);  // 没有 remove()，ThreadLocal 内存未释放
}

// ✅ 正确
public void unload() {
    DELEGATE.remove();  // 彻底清除
}
```

---

### 44. 日期格式化 y/Y 区分

日期格式化时，`yyyy` 表示当天所在的年，大写 `YYYY` 代表 "week in which year"，跨年周会返回下一年。**除特殊需求外，统一使用小写 `yyyy`。**

```java
// ❌ 错误（跨年时 YYYY 返回下一年）
SimpleDateFormat format = new SimpleDateFormat("YYYY-MM-dd HH:mm:ss");

// ✅ 正确
SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
```
