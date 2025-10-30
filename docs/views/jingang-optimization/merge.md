# 安全合并流程（UAT / Master）

> 目标：在多人高频提交的团队中，保证把变更安全合并到 `uat` 与 `master`，最小化冲突与回滚风险。

<AuthorTag author="CHENY" />

根据晋钢项目合并规范 => （`optimiza` → `uat` → `master`）


## 精简要点（2 行总结）

- 在临时合并分支上做 squash/合并并完整回归测试后再合并到 `uat`/`master`。
- 任何可能导致历史污染或风险的 rebase/强推不允许在公共分支上执行。

## 快速命令参考（常用）

- 拉取目标分支最新：
  ```bash
  git checkout uat
  git pull origin uat
  ```
- 从目标分支创建临时合并分支（本地）：
  ```bash
  git checkout -b hotfix/merge-<your-branch>-to-uat uat
  ```
- 将待合并分支 squash 合并到临时分支（不会保留原分支历史）：
  ```bash
  git merge --squash feature/your-branch
  git status
  # 处理冲突 -> git add <file> -> 继续
  git commit -m "chore: squash merge feature/your-branch -> uat (resolve conflicts)"
  ```
- 本地回归与构建测试（务必执行）：
  ```bash
  # 安装/启动/运行项目相关命令（示例）
  pnpm install
  pnpm dev       # 本地 dev 回归
  pnpm build     # CI/本地生产构建检查
  ```
- 切换回目标分支并合并临时分支（使用 no-ff 保持合并记录）：
  ```bash
  git checkout uat
  git merge hotfix/merge-<your-branch>-to-uat --no-ff -m "merge: 合并 feature/your-branch 到 uat"
  git push origin uat
  ```

## 必检清单（合并前后）

- [ ] 确认本地与远程目标分支已同步（`git pull origin <target>`）。
- [ ] 确认变更范围（`git diff --stat uat..feature/your-branch`）。
- [ ] 处理并记录冲突决策（哪个分支优先，业务/配置/样式策略）。
- [ ] 完整运行本地回归（关键功能、样式、构建）。
- [ ] 如果改动影响依赖或构建配置，通知 CI/运维预留验证窗口。

## 合并策略与冲突规则（建议团队约定）

- 业务/核心逻辑冲突：以 `target` 分支（`uat`/`master`）为准，除非变更有明确业务负责人并经批准。
- 性能/构建/工具优化：优先保留有明确 benchmark/测试的变更。
- 样式/主题/第三方工具（如 UnoCSS/Windi）类冲突：统一框架（例如只保留 UnoCSS），避免并存引发运行时错误。

## 回滚与紧急处理

- 如果合并后发现严重问题（回归失败、运行时错误）：
  1. 在目标分支上创建回滚分支：
     ```bash
     git checkout -b hotfix/rollback-<timestamp> uat
     git revert <merge_commit_sha> --no-edit
     git push origin hotfix/rollback-<timestamp>
     git checkout uat && git merge hotfix/rollback-<timestamp> --no-ff && git push origin uat
     ```
  2. 立即通知团队并按 priority 处理根因。

## 额外建议（流程管理）

- 对于大型或长久分支，定期基于主线创建同步分支并做小步合并，减少冲突面。
- 代码审查（PR）里必须包含：变更范围摘要、已执行的回归 checklist、冲突解决说明。
- 不要在公共分支上强制 push（force push），任何需要 rewrite 历史的操作应在私有临时分支完成。

---
