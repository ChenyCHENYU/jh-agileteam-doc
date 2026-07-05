# env-config — 环境标准化 / 客户迁移

> 📦 来源：`@agile-team/wl-skills-kit` → `.github/skills/ops/env-config/SKILL.md`

> ⚠️ 高风险 Skill：执行前必须二次确认，`apply` 默认 dry-run。

---

## 用途

扫描前端项目的环境配置（`.env.*` / Vite 配置中的 baseURL / API 前缀），识别非标准命名与硬编码地址，标准化为统一的五套环境体系：

| 环境 | API 前缀 | 用途 |
|------|---------|------|
| dev | `/dev-api` | 本地开发联调 |
| sit | `/sit-api` | SIT 测试 |
| uat | `/uat-api` | UAT 预发布 |
| pre | `/pre-api` | 预生产 |
| prod | `/prod-api` | 生产 |

---

## 工作流程

```text
wls_env_scan（扫描当前配置）
       ↓
识别非标准项（硬编码 IP / 旧 172 地址 / 混乱前缀）
       ↓
ENV_CONFIG_*.md 报告（dry-run，不修改文件）
       ↓
用户确认 → wls_env_apply（写入标准化配置）
```

---

## 触发词

`环境配置` / `前端环境标准化` / `切环境` / `baseURL` / `/api` / `sit-api` / `uat-api` / `prod-api` / `172迁移` / `客户迁移` / `华新环境` / `五套环境`

---

## MCP 工具依赖

- `wls_env_scan`：扫描 env 文件与 Vite 配置
- `wls_env_apply`：应用标准化配置（默认 dry-run，需显式确认才写入）

---

## 常见场景

### 场景 1：客户环境迁移

```text
用户："我们要把项目从旧的 172.28.99.172 迁移到华新的域名环境"
  → AI 触发 env-config
  → wls_env_scan 扫描 .env / vite.config.ts
  → 识别 172 硬编码 + 非标准前缀
  → 输出 ENV_CONFIG 报告（dry-run）
  → 用户确认 → wls_env_apply 写入华新域名 + 标准前缀
```

### 场景 2：环境前缀标准化

```text
用户："baseURL 混乱，有的是 /api 有的是 /dev-api，统一一下"
  → env-config 扫描所有 env 文件
  → 按五套环境体系标准化
  → dry-run 预览 → 确认后 apply
```

---

## 安全机制

1. **默认 dry-run**：`wls_env_apply` 默认只预览不写入
2. **二次确认**：写入前必须用户显式确认
3. **备份提示**：建议先 `git commit` 再 apply
4. **配置识别范围**：仅识别 `.env.*` 文件 + Vite 配置中的 `proxy.target` / `baseURL` / `ENV_WEB_API` 等已知模式，不盲目修改

---

> 📚 详细规则见项目内 `.github/skills/ops/env-config/SKILL.md`
