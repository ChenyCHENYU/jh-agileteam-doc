# 使用指南

## 工作流 A：Axure 原型 -> 代码（最常用）

> 最推荐。一个模块 5-8 个页面，约 5-10 分钟出完整代码。

```
Step 1  发送 Axure HTML 文件夹路径
        "帮我扫描 c:\Users\xxx\原型包\ 下的所有 HTML"

Step 2  AI 执行 prototype-scan -> 输出 page-spec JSON

Step 3  确认 page-spec（检查字段数量，注意 notes 中的歧义项）

Step 4  AI 执行 api-contract -> 输出每个页面的 api.md

Step 5  确认接口（服务缩写、资源名是否正确）

Step 6  AI 执行 page-codegen -> 输出：
        - index.vue + data.ts + index.scss + api.md（每页 4 文件）
        - pages.ts 注册片段
        - mock/[页面名].ts
        - 写入 SYS_MENU_INFO.md（覆盖/追加模式）

Step 7  AI 输出校验报告

Step 8  菜单注册（二选一）
        方式 A - 自动：对 AI 说「帮我创建菜单」
        方式 B - 手动：按 SYS_MENU_INFO.md 在后台手动创建

Step 9  启动开发验证
        pnpm run dev -> 打开页面，mock 数据自动生效
```

## 工作流 B：详设文档 -> 代码（更高精度）

```
Step 1  发送详设文档（MD/Word/表格）
        "按照这份详设文档帮我生成页面"

Step 2  AI 执行 prototype-scan 模式B -> 输出 page-spec JSON
        （字段英文名、字典code 直接读取，无需推断）

Step 3  其余步骤同工作流 A 的 Step 3-9
```

**精度对比**：
- Axure -> 90-95%（英文名/字典需推断）
- **详设文档（规范格式）-> 95-100%（字段名直接读取）**

## 前置声明

只需 3 个必填项，AI 自动推导目录结构、pages.ts 注册语法和命名前缀：

```markdown
## 前置声明

- 业务域/模块：生产 > 生产棒线材 > AI流程
- 服务前缀：/mmwr/
- 页面清单：客户档案、临时客户档案、客户申请新增、客户申请变更、客户详情
```

按需补充：
- 参考样例路径
- 共享组件说明
- 特殊约定

> AI 推导规则：业务域 -> 注册函数（生产=`gProd` / 销售=`gSale`），模块 -> 目录名（kebab-case）。

## 精度提升技巧

### 技巧 1：一次只处理一个模块

- :x: 同时发 30 个 HTML -> AI 上下文压力大，容易遗漏
- :white_check_mark: 按业务模块分批（每批 5-8 页面）-> 精度更高

### 技巧 2：提前说明约定

```
帮我扫描这些原型：
- 服务缩写统一用 sale
- 所有带 _1 后缀的文件是同一组件在不同上下文（不重复生成）
- productLine 字典 code 用 product_line
```

### 技巧 3：确认 page-spec 再生成代码

**不要让 AI 跳过确认直接生成代码。**

page-spec JSON 是唯一可以低成本修正的节点：
- page-spec 有误 -> 改一行 JSON -> 重新生成代码（秒级）
- 代码生成后发现遗漏 -> 找具体文件/函数/字段 -> 修复成本 x10

### 技巧 4：subTables 要明确交互意图

- :x: 含糊："页面有一个业务信息表"
- :white_check_mark: 明确："业务信息表可以新增删除行（editable: true），但不能行内编辑"

### 技巧 5：共享组件提前识别

```
基本信息/联系人/银行信息 等 8 个 Tab 在新增、变更、详情 3 个页面共用，
请提取到 src/components/local/c_customerTabs/
```

## 移植到新项目

### 第 1 步：复制 Skill 文件

```
目标项目/
  .github/
    copilot-instructions.md   第2步生成
    skills/
      prototype-scan/SKILL.md   直接复制，不改
      api-contract/SKILL.md     直接复制，微调命名规范
      page-codegen/SKILL.md     需要重写代码模板
      convention-extract/SKILL.md  直接复制
```

### 第 2 步：建立编码规范

复制 `copilot-instructions.md` 作为基础模板，按新项目实际情况修改：
- 路由注册方式
- 组件库（如仍是 Element Plus + @jhlc/jh-ui 则不改）
- 页面目录层级、服务缩写前缀

### 第 3 步：改写 page-codegen 模板

| 需改写的部分 | 当前写法 | 新项目要替换为 |
|-------------|---------|--------------|
| 基类 | `AbstractPageQueryHook` | 新项目的页面基类或 Composition API |
| 查询组件 | `BaseQuery` | 新项目的查询封装 |
| 表格组件 | `BaseTable` | `el-table` 或自定义封装 |
| 分页组件 | `jh-pagination` | `el-pagination` 或自定义 |
| API 调用 | `getAction / postAction` | 项目封装的请求方法 |
| 字典翻译 | `BusLogicDataType.dict` | 项目的字典方案 |
| 路由注册 | `pages.ts + gSale()` | 项目的路由配置方式 |

> page-codegen 为多文件结构（SKILL.md + 9 个 TPL-*.md），移植时需同时复制所有模板文件。

### 第 4 步：验证

拿一个中等复杂度的 Axure 页面走一遍完整流程，确认校验无遗漏。

## 触发词速查

| 操作 | 触发方式 |
|------|---------|
| 扫描 Axure 原型 | "扫描这些原型"、"解析 axure"、"页面清单" |
| 解析详设文档 | "按详设生成"、"从这份文档生成"、"详设文档" |
| 生成接口约定 | "接口约定"、"生成 api.md"、"api contract" |
| 生成页面代码 | "生成页面"、"代码生成"、"按原型生成"、"生成 vue 页面" |
| 同步菜单 | "帮我创建菜单"、"同步菜单"、"补菜单"、"注册菜单" |
| 审计规范 | "审计项目规范"、"规范检查"、"代码审计" |

## 已知局限与应对

| 局限 | 应对 |
|------|------|
| Axure 导出 HTML 结构不统一 | 团队统一 Axure 9.0+ 和导出设置 |
| 静态 HTML 看不出交互行为 | 检查 page-spec 的 notes 字段，补充交互说明 |
| 联动逻辑需人工补充 | 在 api.md 或详设文档中写明联动关系 |
