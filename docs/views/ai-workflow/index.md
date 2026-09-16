# AI 工作流

<AuthorTag :authors="['ZhuXiang','CHENY','YangTianGuang']" />

> 五包按阶段协同的叙事页：**谁在什么时候做什么、契约怎么流动、现在跑到哪了**。各包能力详情在对应板块，本页只讲"串起来"。

## 全链路总览

```text
 需求        设计阶段              开发阶段（前后端并行）           测试阶段              上线
  │   wl-skills-design     kit（前端） ∥ bd（后端）        wl-skills-test        gate / review
  │        │                   │              │                  │                  │
  └──► 需求说明书 ──► page-spec / api.md ──► wl-contract.json ──► 用例矩阵 ──► 质量门
       原型标注 D1-D3    （前后端共享契约）   （机器契约）      （消费双方契约）   （DI 4 指标）
           │                   │              │                  │
        verify 四域      validate K1~K19   validate B1~B31     audit T1~T25
```

**契约从左到右单向流动、逐段机器校验**——上游改契约，下游 `diff` 即知受影响用例与页面（test `contract_diff` / kit `contract compare --strict`）。

## 阶段导航

| 阶段 | 页面 | 负责包 | 关键产出 |
|------|------|--------|---------|
| **设计** | [详设输入标准](./detail-design) · [设计 Skills](./design-skills) · [原型标注](./prototype) | `wl-skills-design` | 需求说明书（IPO 按钮级）/ 原型 D1-D3 / db-spec / 接口设计 |
| **开发** | [契约驱动协作](./fullstack-dev) | `wl-skills-kit` ∥ `wl-skills-bd` | page-spec → api.md ↔ wl-contract → 双端代码 + 门禁报告 |
| **测试** | [测试阶段工作流](./testing) | `wl-skills-test` | 用例矩阵 / 深度执行报告 / gate 上线判定 |

> 各阶段内部的 Skill 流水线细节，见权威页：[前端 Skill 流水线](/frontend/pc/skills/skill-pipeline) · [后端契约流水线](/backend/skills/skill-pipeline)——本板块不重复展开。

## 状态一览

| 环节 | 包 | 版本 | 状态 |
|------|-----|------|------|
| 设计 | wl-skills-design | v0.11.1 | ✅ 已落地（verify 四域机械校验） |
| 前端 | wl-skills-kit | v2.20.4 | 🟡 全链路践行中（scenario 确定性渲染已上线） |
| 后端 | wl-skills-bd | v0.24.0 | ✅ 已落地（review 统一质量门） |
| 测试 | wl-skills-test | v0.25.0 | ✅ 已落地（真实执行引擎 + gate） |
| L5 Pipeline | — | — | 🟡 `_pipeline.md` 协议试运行 |
| L6 Multi-Agent | — | — | ▶ L5 稳定后规划 |

## 与其他板块的分工

- **能力详情**：五包各自板块（[设计](/views/ai-workflow/design-skills) · [前端](/frontend/pc/skills/) · [视觉](/views/styling/wl-skills-ui) · [后端](/backend/skills/) · [测试](/views/testing/)）；
- **方法论与层级**：[AI 最佳实践](/views/best-practices/)（L0-L7 技术栈层级 × 部门 L0-L5 定级）；
- **落地宣贯**：[宣贯方案](/views/rollout/)；
- **本板块**：只回答"端到端怎么串"。
