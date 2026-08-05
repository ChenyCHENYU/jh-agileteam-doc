# 详细设计文档标准

::: tip 本页定位
详细设计文档是 AI 工作流的核心输入。本文定义详细的**输入标准**，让 AI 能准确理解并生成高质量代码。
:::

---

## 详设文档应该包含什么

| 章节 | 必需 | 说明 |
|------|:---:|------|
| 功能描述 | ✅ | 业务场景、用户角色、核心流程 |
| 接口定义 | ✅ | URL / Method / 请求参数 / 响应结构 |
| 数据模型 | ✅ | 表名 / 字段 / 类型 / 字典 / 校验规则 |
| 页面交互 | ✅ | 查询区 / 工具栏 / 表格列 / 操作列 / 表单分区 |
| 流程图 | 推荐 | 业务流转 / 状态机 / 审批流 |
| 权限模型 | 推荐 | 角色 × 菜单 × 动作 |

---

## 从详设到代码的链路

```text
详设文档（Word/Markdown）
    ↓
prototype-scan（原型线）/ spec-doc-parse（规范线）
    ↓ page-spec JSON
api-contract → 前后端契约对齐
    ↓
page-codegen（前端）/ codegen（后端）
    ↓
convention-audit → 代码审计
```

> 如果详设是 `wl-skills-design` 产出的标准说明书，走**规范线**（精度 95-100%）；否则走**原型线**（精度 90-95%）。

---

## 与各 Skills 包的关系

| 包 | 消费详设的方式 |
|---|---|
| [wl-skills-kit](/frontend/pc/skills/)（前端） | prototype-scan / spec-doc-parse → page-codegen |
| [wl-skills-bd](/backend/skills/)（后端） | 评审需求 → wl-contract.json → codegen |
| [wl-skills-test](/views/testing/)（测试） | 需求文档 → test-plan-generator / test-case-generator |
| [wl-skills-design](/views/ai-workflow/design-skills)（设计） | **产出**标准详设文档（说明书） |
