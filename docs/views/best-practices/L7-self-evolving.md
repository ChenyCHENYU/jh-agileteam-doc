# L7 — 自演化体系（Self-Evolving）

::: tip 🔭 终极形态
高质量产出反哺规范/模板，形成精度持续提升的正向飞轮。条件成熟后规划。
:::

## 是什么

自演化体系是指 **AI 系统能够以自身的产出来改善未来的产出**——使用过程中积累的质量数据（生成代码、审计报告、人工修正记录）自动反哺规范和模板，形成越用越准的正向飞轮。

这不是"AI 自动写规范"，而是**量化产出质量 → 识别高频偏差 → 自动强化对应规则**的闭环机制。

## 三大飞轮机制

| 机制 | 数据来源 | 反哺目标 | 效果 |
|------|---------|---------|------|
| **模板蒸馏** | 高质量生成代码 → `template-extract` | 新领域模板 | 相似场景生成精度提升 |
| **规则强化** | `convention-audit` 偏差报告积累 | Skill Pre-flight 警告权重 | 高频偏差被更早拦截 |
| **工作流优化** | 人工修正记录、步骤重跑频率 | `_pipeline.md` 步骤描述 | 流水线减少人工干预次数 |

## 核心能力（通用）

| 能力 | 说明 |
|------|------|
| **质量度量** | 自动化指标衡量产出质量（lint 通过率、审计分数、人工修改次数）|
| **反馈回路** | 高质量产出 → 自动推荐更新规范/模板 |
| **知识积累** | 每次运行都向共享知识库添加数据 |
| **版本演进** | 规范和模板有版本历史，可追溯改进来源 |
| **跨项目聚合** | 多个业务项目的偏差数据汇聚，识别系统性问题 |

> **进入门槛**：需要 L5 流水线稳定运转提供足够的样本量，以及结构化存储审计数据的基础设施。

## 前端示例 — 本项目的 L7 规划

### 飞轮模型

```
高质量生成代码（page-codegen）
        │
        ▼ [template-extract] 提炼为新领域模板
        │
        ▼ 人工 review → 合并到 files/
        │
        ▼ kit 升级发布（npx 即可获取）
        │
        ▼ 下次生成精度更高 ──────────────┐
                                         │（循环）
convention-audit 报告积累                │
        │                                │
        ▼ 偏差统计（哪条规范最常被违反） │
        │                                │
        ▼ 规范权重调整 → Skill 描述强化  │
        │                                │
        └────────────────────────────────┘
```

### 落地所需条件

| 条件 | 说明 | 当前状态 |
|------|------|----------|
| L5 Pipeline 稳定运转 | Skill 链式触发已常态化，产出量足够大 | ⏳ 未达到 |
| 审计报告数量 ≥ 50 份 | 有足够的偏差样本做统计 | ⏳ 积累中 |
| 模板提取 ≥ 3 次成功 | template-extract 流程验证可靠 | ⏳ 未达到 |
| 跨项目质量数据汇总 | 单项目偏差不足以发现系统性问题 | ⏳ 需 v4.0 基础设施 |

### 与当前项目的关系

`template-extract` Skill + `convention-audit` 报告积累机制已经是这个飞轮的雏形——**L7 不是全新建设，是现有机制的系统性放大**。

**短期飞轮（L5 稳定后即可启动）**

- 同类页面出现 ≥ 5 次 → 自动推荐 template-extract
- 某偏差出现 ≥ 3 次 → 对应 SKILL.md Pre-flight 加重警告

**中期飞轮（v4.0 基础设施就绪后）**

- convention-audit 报告结构化入库，跨项目聚合
- AI 分析高频偏差 → 生成规范修订草稿 → 人工 review 合并

**长期飞轮（AI 能力充分成熟后）**

- 模板自动生成：AI 直接从代码库提炼新模板，人工只做 review
- 规范冲突检测：新规范与现有规范的逻辑冲突由 AI 自动发现

## 延伸阅读

- [全景分析](./ai-landscape) — 完整架构蓝图
- [L5 — Agent Pipeline](./L5-agent-pipeline) — 前置阶段
- [L6 — Multi-Agent 协同](./L6-multi-agent)

## 飞轮模型

```
高质量生成代码（page-codegen）
        │
        ▼ [template-extract] 提炼为新领域模板
        │
        ▼ 人工 review → 合并到 files/
        │
        ▼ kit 升级发布（npx 即可获取）
        │
        ▼ 下次生成精度更高 ──────────────┐
                                         │（循环）
convention-audit 报告积累                │
        │                                │
        ▼ 偏差统计（哪条规范最常被违反） │
        │                                │
        ▼ 规范权重调整 → Skill 描述强化  │
        │                                │
        └────────────────────────────────┘
```

## 落地所需条件

| 条件 | 说明 | 当前状态 |
|------|------|----------|
| L5 Pipeline 稳定运转 | Skill 链式触发已常态化，产出量足够大 | ⏳ 未达到 |
| 审计报告数量 ≥ 50 份 | 有足够的偏差样本做统计 | ⏳ 积累中 |
| 模板提取 ≥ 3 次成功 | template-extract 流程验证可靠 | ⏳ 未达到 |
| 跨项目质量数据汇总 | 单项目偏差不足以发现系统性问题 | ⏳ 需 v4.0 基础设施 |

## 与当前项目的关系

`template-extract` Skill + `convention-audit` 报告积累机制已经是这个飞轮的雏形——**L7 不是全新建设，是现有机制的系统性放大**。

### 短期飞轮（L5 稳定后即可启动）

- 同类页面出现 ≥ 5 次 → 自动推荐 template-extract
- 某偏差出现 ≥ 3 次 → 对应 SKILL.md Pre-flight 加重警告

### 中期飞轮（v4.0 基础设施就绪后）

- convention-audit 报告结构化入库，跨项目聚合
- AI 分析高频偏差 → 生成规范修订草稿 → 人工 review 合并

### 长期飞轮（AI 能力充分成熟后）

- 模板自动生成：AI 直接从代码库提炼新模板，人工只做 review
- 规范冲突检测：新规范与现有规范的逻辑冲突由 AI 自动发现

## 延伸阅读

- [全景分析](./ai-landscape) — 完整架构蓝图
- [L5 — Agent Pipeline](./L5-agent-pipeline) — 前置阶段
- [L6 — Multi-Agent 协同](./L6-multi-agent)

## 业界实践参考

> 自演化体系目前处于前沿探索阶段，以下为已有公开实践的参考案例。

| 公司 | 项目/实践 | 描述 |
|------|---------|------|
| **Cursor** | [AI 反馈训练](https://www.cursor.com/blog) | Cursor 通过用户接受/拒绝代码建议的行为数据持续改善模型偏好，是商业化自演化最典型案例 |
| **GitHub Copilot** | [Copilot 自适应](https://github.blog/ai-and-ml/) | GitHub 利用代码接受率、编辑频率等指标不断调优 Copilot 建议质量 |
| **谷歌 DeepMind** | [AlphaCode 2](https://deepmind.google/discover/blog/alphacode-2-competitive-programming-with-alphageometry/) | 通过竞技编程产出自动评估和强化学习，代码质量自演化典型 |
| **SWE-agent（普林斯顿）** | [SWE-agent](https://swe-agent.com/) | AI 自动修复 GitHub Issue，产出质量通过测试套件自动评估，形成闭环 |

## 参考资料

| 资源 | 说明 |
|------|------|
| [Self-Refine 论文](https://arxiv.org/abs/2303.17651) | AI 自我反馈迭代的奠基论文 |
| [Reflexion 论文](https://arxiv.org/abs/2303.11366) | Agent 通过反思历史错误改善未来决策的经典方案 |
| [SWE-bench](https://www.swebench.com/) | 衡量 AI 修复真实代码 Bug 能力的标准 Benchmark，L7 效果量化参考 |
| [Cursor Blog](https://www.cursor.com/blog) | Cursor 产品迭代背后的 AI 工程化思考 |
| [GitHub Blog — AI & ML](https://github.blog/ai-and-ml/) | GitHub Copilot 持续改进机制的官方说明 |
