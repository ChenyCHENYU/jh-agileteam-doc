# AI Skill 流水线

完整的 AI 辅助研发流程，7 个 Skill 按序串联：

```
① 原型扫描 → 结构化原型分析
    ↓
② 接口规格 → 字段规格文档
    ↓
③ 接口约定 → TypeScript API 定义
    ↓
④ 页面代码生成 → 三文件分离的完整页面
    ↓
⑤ 路由注册 → 自动注册路由
    ↓
⑥ Mock 生成 → 配套 Mock 数据
    ↓
⑦ 规范审计 → 最终质量检查
```

---

## 流水线特点

### 与 PC 端的差异

| 对比项 | PC 端（5 个 Skill） | 移动端 H5（7 个 Skill） |
|---|---|---|
| 接口规格 | 合并在接口约定中 | ② 独立 Skill |
| 路由注册 | ④ 菜单同步 | ⑤ 路由注册（Hash/History 双模式） |
| Mock 生成 | 手动编写 | ⑥ 独立 Skill，自动生成 |
| 文件规范 | 无 style 分离要求 | 三文件分离（.vue 禁止 style 块） |
| 组件体系 | Element Plus（BaseTable / BaseForm） | Vant 4（C_Table / C_Form） |
| 样式体系 | UnoCSS + SCSS | UnoCSS + SCSS + 设计令牌 + CSS Layers |

### 自动调度机制

所有 Skill 均通过触发词自动调度，无需手动选择：

```
用户输入 "扫描原型"
  → AI 自动匹配 prototype-scan Skill
  → 加载 .github/skills/prototype-scan/skills.md
  → 按规则执行
```

支持的 AI 编辑器：Copilot / Cursor / Windsurf / Claude Code — 五个规则文件同源。
