# @robot-admin/form-validate 表单校验库

<AuthorTag :authors="['CHENY']" />

::: tip v3.4.1 · Element Plus 专用指南
企业级表单验证规则库，单包同时支持 Naive UI 与 Element Plus。本文档侧重 **Element Plus** 用法，因为团队基于 Element Plus 开发。

```bash
pnpm add @robot-admin/form-validate
```
:::

---

## 设计理念

所有校验逻辑产出**框架无关的 `RuleSpec`**（一份源真相），再通过适配器输出为各框架规则。**同一套规则定义，既能喂给表单实时校验，也能在提交时批量校验，零逻辑重复。**

```text
                  ┌── toElementRule → ELEMENT_RULES / ELEMENT_COMBOS / whenElement  (Element Plus)
RuleSpec(源真相) ──┼── 原样           → SPEC_RULES / whenSpec ...                    (框架无关)
                  └── validateValue  → 提交前批量校验                                (任意场景)
```

---

## 特性

| 特性 | 说明 |
|------|------|
| 🎯 开箱即用 | 40+ 预设规则，覆盖企业常见场景 |
| 🧩 单包双框架 | 内置 Naive UI / Element Plus 双适配，零额外依赖 |
| 🔢 数据库契约 | `numeric` 对标 SQL `DECIMAL(p,s)` 精度范围校验 |
| 📊 批量校验 | `validateValue` / `validateRecord` / `validateRows`，表格提交一行搞定 |
| 🚀 高级组合 | 条件验证、跨字段比较、OR/AND 组合、防抖异步 |
| 🇨🇳 中国本地化 | 身份证、银行卡、车牌、统一社会信用代码 |
| 💪 TypeScript | 完整类型推导，Tree-shaking 友好 |
| ✅ 84 测试覆盖 | 行为有保障 |

---

## Element Plus 30 秒上手

```typescript
import { ELEMENT_RULES, ELEMENT_COMBOS } from "@robot-admin/form-validate";

const rules = {
  username: ELEMENT_COMBOS.username("用户名"),   // [必填 + 格式]
  phone: ELEMENT_COMBOS.mobile("手机号"),        // [必填 + 格式]
  email: [ELEMENT_RULES.email("邮箱")],           // 非必填，填了校验格式
};
// 直接用于 <el-form-item :rules="rules.username">
```

---

## 按场景速查（Element Plus）

### 场景 1：必填 + 格式（最常用）

```typescript
import { ELEMENT_COMBOS } from "@robot-admin/form-validate";

ELEMENT_COMBOS.username("用户名")       // 必填 + 字母数字下划线 3-20 位
ELEMENT_COMBOS.password("密码")         // 必填 + 强密码（大小写+数字）
ELEMENT_COMBOS.email("邮箱")            // 必填 + 邮箱格式
ELEMENT_COMBOS.mobile("手机号")         // 必填 + 手机号格式
ELEMENT_COMBOS.idCard("身份证号")       // 必填 + 身份证格式
ELEMENT_COMBOS.bankCard("银行卡号")     // 必填 + 银行卡格式
ELEMENT_COMBOS.url("链接")              // 必填 + URL 格式
ELEMENT_COMBOS.confirmPassword("确认密码", () => form.password)
```

### 场景 2：多规则链式校验（数组即链式）

规则数组本身就是**顺序执行**的链——前一条通过才跑下一条，失败立即停止返回错误。

```typescript
import { ELEMENT_RULES } from "@robot-admin/form-validate";

// 密码：先校验非空，通过后再校验长度，再校验强度
password: [
  ELEMENT_RULES.required("密码"),
  ELEMENT_RULES.minLength("密码", 8),
  ELEMENT_RULES.strongPassword("密码"),
]

// 工号：先校验非空，再校验长度
userNo: [
  ELEMENT_RULES.required("工号"),
  ELEMENT_RULES.length("工号", 8),
]
```

> **与手写对比**：Element 原生写法要重复写 `{ required: true, message: "密码不能为空", trigger: "blur" }`，这里一行一个语义，消息自动带字段名。

### 场景 3：非必填，填了才校验格式

```typescript
import { optional, toElementRule, SPEC_RULES } from "@robot-admin/form-validate";

// 空值放行，有值才校验
toElementRule(optional(SPEC_RULES.email("邮箱")))
```

### 场景 4：数据库数值契约（DECIMAL）

```typescript
import { numeric, toElementRule } from "@robot-admin/form-validate";

// 对标 DECIMAL(11,3)，温度 ≥ 0
toElementRule(numeric({ kind: "decimal", totalDigits: 11, fractionDigits: 3, min: 0 }, "温度"))

// 整数 + 范围
toElementRule(numeric({ kind: "integer", totalDigits: 11, min: 1 }, "处理次数"))

// 开区间（必须严格大于 min）
toElementRule(numeric({ kind: "decimal", min: 0, max: 100, minExclusive: true }, "百分比"))
```

### 场景 5：跨字段比较（结束日期不早于开始）

```typescript
import { compareWithElement } from "@robot-admin/form-validate";

compareWithElement("结束日期", () => form.startDate, "gte", "结束日期不能早于开始日期")
// 操作符：gt | gte | lt | lte | eq | ne
```

### 场景 6：条件验证（类型为公司时才校验公司名称）

```typescript
import { whenElement } from "@robot-admin/form-validate";

whenElement(
  () => form.userType,
  val => val === "company",
  [ELEMENT_RULES.required("公司名称")],   // 条件为真
  [],                                      // 条件为假
)
```

### 场景 7：表格提交前批量校验（含嵌套路径）

```typescript
import { validateRows, validateValue, numeric, SPEC_RULES } from "@robot-admin/form-validate";

const ruleMap = {
  steel_code: [SPEC_RULES.required("钢种")],
  work_time:  [numeric({ kind: "integer", min: 1 }, "作业时间")],
};

// 表格多行：校验整张表，返回第一行错误
const err = await validateRows(detailRows, ruleMap, { startIndex: 1 });
if (err) {
  ElMessage.error(`第 ${err.rowIndex} 行：${err.message}`);
  return;
}

// 主从结构：字段名支持点路径嵌套
const nestedErr = await validateValue(record, {
  "address.city":    [SPEC_RULES.required("城市")],
  "items[0].qty":    [numeric({ kind: "integer", min: 1 }, "数量")],
  "items[1].amount": [numeric({ kind: "decimal", min: 0 }, "金额")],
});
```

### 场景 8：OR 组合（手机号或邮箱任一）

```typescript
import { someElement, ELEMENT_RULES } from "@robot-admin/form-validate";

someElement(
  [ELEMENT_RULES.mobile("联系方式"), ELEMENT_RULES.email("联系方式")],
  "请填写手机号或邮箱",
)
```

---

## API 全景（Element Plus）

### 预设规则

```typescript
import { ELEMENT_RULES, ELEMENT_COMBOS } from "@robot-admin/form-validate";
```

| 类别 | 成员 |
|------|------|
| 基础 | `required` `integer` `positiveInteger` `number` `positiveNumber` `boolean` `enumValue` `pattern` `optional` |
| 字符串 | `length` `minLength` `maxLength` `startsWith` `endsWith` `includes` |
| 数字 | `range` `min` `max` `between` |
| 数组 | `array` `arrayMinLength` `arrayMaxLength` `arrayUnique` |
| 日期 | `date` `dateAfter` `dateBefore` `dateRange` |
| 格式 | `mobile` `email` `url` `ip` `ipv6` `mac` `domain` `hexColor` `username` `strongPassword` `confirmPassword` `asyncCheck` |
| 中国 | `idCard` `postalCode` `bankCard` `creditCode` `licensePlate` `qq` `wechat` |
| 数值契约 | `numeric(contract, field)` |

### 高级功能

| 功能 | Element Plus |
|------|-------------|
| 条件验证 | `whenElement` |
| 跨字段比较 | `compareWithElement` |
| 防抖异步 | `debouncedAsyncCheckElement` |
| OR 组合 | `someElement` |
| AND 组合 | `everyElement` |

### 批量校验

| 函数 | 入参 | 返回 | 场景 |
|------|------|------|------|
| `validateValue(value, rules)` | 单值 | `string \| null` | 单字段 |
| `validateRecord(record, ruleMap)` | 一条记录 | `{field, message} \| null` | 表单提交 |
| `validateRows(rows, ruleMap, opts?)` | 多行 | `{rowIndex, field, message} \| null` | 表格提交 |

### 工具

| 函数 | 说明 |
|------|------|
| `optional(rule)` | 包装为非必填（空值放行） |
| `transform(fn, rule)` | 校验前转换值（如 trim） |
| `mergeSpecs(specs)` | 串行校验，返回第一条失败 |
| `isBlank(v)` | 空值判断（null/undefined/纯空格） |
| `REGEX_PATTERNS` | 正则常量库（40+） |

---

## 动态规则（响应式）

```typescript
import { computed } from "vue";
import { ELEMENT_RULES, numeric, toElementRule } from "@robot-admin/form-validate";

const workTimeRules = computed(() => {
  if (form.value.type === "overtime") {
    return [toElementRule(numeric({ kind: "integer", min: 1, max: 10080 }, "加班时长"))];
  }
  return [toElementRule(numeric({ kind: "integer", min: 0, max: 480 }, "工时"))];
});
// :rules="workTimeRules"
```

---

## 自定义规则

```typescript
import { createSpec, toElementRule } from "@robot-admin/form-validate";

// 同步
const myRule = toElementRule(createSpec("blur", v => v?.length === 6, "必须6位"));

// 异步（如查重）
const asyncRule = toElementRule(
  createAsyncSpec("blur", async (v) => {
    const res = await checkExists(v);
    return !res.exists;
  }, "已存在"),
);
```

---

## 与 wl-skills-kit 的关系

- **kit K18** 检测项目中是否正确安装 `@robot-admin/form-validate@^3.4.1`
- **page-codegen** 生成的表单页面默认使用此库的 Element Plus 规则
- **convention-audit** 检查是否手写了 Element 原生规则而未使用此库

---

## 从旧版迁移

| 旧版（v2 / 三包） | 新版（v3.4+ 单包） |
|---|---|
| `@robot-admin/form-validate-core` | 已废弃，逻辑内联进单包 |
| `@robot-admin/form-validate-element` | 已废弃，改用 `ELEMENT_RULES` |
| `PRESET_RULES.mobile()` | **不变**（向后兼容） |
| `RULE_COMBOS.mobile()` | **不变** |
| `createRule()` | **不变** |
| element 规则 | `toElementRule(spec)` 或 `ELEMENT_RULES.mobile()` |
