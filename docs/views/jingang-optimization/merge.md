# 分支合并与发布建议

> 本文是团队 Git 合并与发布的统一流程，适用于 **独立子系统分支**（如 `cost/dev/xxxx`）。  
> 目标：**UAT 测哪个版本，生产就上线哪个版本**，保证稳定、可回滚。

<AuthorTag author="CHENY" />

根据晋钢项目合并规范 => （`optimiza` → `uat` → `master`）

## 发布流程总览

下面以优化分支 `optimiza` 为例:

| 阶段     | 目标                     | 分支       | 操作人     |
| -------- | ------------------------ | ---------- | ---------- |
| 开发完成 | 提交最新代码             | `optimiza` | 开发者     |
| 对齐主干 | 与 master 同步，解决冲突 | `optimiza` | 开发者     |
| 提交候选 | 生成候选 tag / SHA       | `optimiza` | 开发者     |
| UAT 验证 | 验证功能稳定             | `uat`      | 测试人员   |
| 上线发布 | 合入生产分支             | `master`   | 发布负责人 |
| 打版本号 | 建立回滚锚点             | `master`   | 发布负责人 |

---

## 一步步操作

### 0️⃣ 更新远端信息

```bash
git fetch origin
```

**作用**：同步远端引用（`origin/master`、`origin/uat` 等）。
**价值**：确保基线是最新的，防止基于旧代码合并。

---

### 1️⃣ 让 `optimiza` 对齐 `master`（提前解冲突）

```bash
git checkout master
git pull --ff-only origin master

git checkout optimiza
git rebase origin/master
# 有冲突：编辑 -> git add <文件> -> git rebase --continue
# 放弃 rebase：git rebase --abort
```

**作用**：把你的工作分支重放到最新的 master 之上。
**价值**：

- 在自己分支上解决冲突，不污染 UAT。
- 历史线性，日志清晰。

> ⚠️ 如果 `optimiza` 已推送到远端，rebase 后需强推：
> `git push -f origin optimiza`

---

### 2️⃣ 固定发布版本（生成候选 tag）

```bash
git tag -a rc-optimiza-$(date +%m%d-%H%M) -m "UAT优化候选"
git push origin --tags
```

**作用**：给当前提交打上时间戳候选标签。
**价值**：

- 明确“UAT 测试的具体版本”；
- UAT、生产、回滚都能用同一个标识。

> 例如生成的 tag：`rc-optimiza-0323-1045`

---

### 3️⃣ 合入 UAT 进行验证

```bash
git checkout uat
git pull --ff-only origin uat
git merge --no-ff rc-optimiza-0323-1045 -m "UAT: rc-optimiza-0323-1045"
git push origin uat
```

**作用**：把候选版本合入 UAT 测试环境。
**价值**：

- `--no-ff` 保留一个合并节点，方便审计与回滚。
- 确保测试环境版本唯一且可追溯。

> ✅ 验证通过 → 进入生产发布阶段。

---

### 4️⃣ 上生产（master 合同一个版本）

```bash
git checkout master
git pull --ff-only origin master
git merge --no-ff rc-optimiza-0323-1045 -m "Release: rc-optimiza-0323-1045"
git push origin master
```

**作用**：让生产与 UAT 一致。
**价值**：避免“UAT 测 A，生产上 B”的漂移问题。

---

### 5️⃣ 打正式版本标签（生产锚点）

```bash
REL=v$(date +%Y.%m.%d-%H%M)-optimiza
git tag -a "$REL" -m "prod release ($REL)"
git push origin "$REL"
```

**作用**：记录本次生产发布版本。
**价值**：

- 版本清晰可查；
- 任何问题可快速回滚到上一个 tag。

---

## 🧱 回滚方式

### A. 撤销这次合并（保持历史）

```bash
git checkout master
git log --oneline
git revert -m 1 <merge-commit-hash>
git push origin master
```

### B. 直接回退到上一个稳定版本（通过 tag）

```bash
git checkout v2025.03.23-1045-optimiza
# 或让部署系统使用该版本镜像/包
```

---

## 🧹 RC 标签清理策略

### 1️⃣ 仅保留最近 20 个 RC tag

```bash
git tag --list 'rc-optimiza-*' --sort=-creatordate | tail -n +21 | xargs -r -n 1 git tag -d
git tag --list 'rc-optimiza-*' --sort=-creatordate | tail -n +21 | xargs -r -I {} git push origin :refs/tags/{}
```

### 2️⃣ 或定期删除 30 天前的 RC 标签

```bash
git for-each-ref refs/tags --format='%(refname:short) %(creatordate:iso8601)' \
| awk '/^rc-optimiza-/ {cmd="date -d \""$2" "$3" "$4"\" +%s";
```
