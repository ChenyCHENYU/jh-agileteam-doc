# 疑难杂症

<AuthorTag :authors="['CHENY','ZhuXiang']" />

> 本章节收录开发过程中的高频疑难问题和解决方案，按场景分类。

---

## 环境配置

### pnpm install 卡住 / esbuild 报错

**现象**：`pnpm install` 或 `pnpm build` 卡在 esbuild 安装步骤。

**原因**：pnpm 默认 `ignore-scripts` 配置跳过了 esbuild 的平台二进制下载。

**解决**：
```bash
# 方法一：用 npm 代替 pnpm 安装
npm install

# 方法二：pnpm 允许 esbuild 构建脚本
pnpm config set ignore-scripts false
pnpm install
```

### Node 版本不匹配

**现象**：构建报 `ERR_REQUIRE_ESM` 或 `Cannot use import statement`。

**解决**：项目要求 Node.js ≥ 20（文档站）/ ≥ 22（Skills 包）。用 nvm 切换：
```bash
nvm use 20
node -v  # 确认版本
```

### Git "detected dubious ownership"

**现象**：`git status` 报 `detected dubious ownership in repository`。

**解决**：
```bash
git config --global --add safe.directory <仓库绝对路径>
```

---

## 构建部署

### VitePress 构建报错 `window is not defined`

**现象**：SSR 构建阶段使用了浏览器 API。

**解决**：组件中使用 `ClientOnly` 包裹或加 `if (typeof window !== 'undefined')` 守卫。

### 微前端子应用白屏

**现象**：Federation remote 加载后白屏，控制台报 `Shared module not available`。

**原因**：依赖版本不对齐（vue/pinia/vue-router/element-plus 版本与 public 工程不一致）。

**解决**：检查 [PC 架构设计 — 版本对齐](/frontend/pc/#版本对齐) 表，确保版本完全一致。

### 钉钉 H5 JSAPI 签名失败

**现象**：`拍照/定位` 报 `No permission to current action`。

**解决**：详见 [钉钉集成方案 — JSAPI 鉴权](/frontend/mobile-uniapp/dingtalk#第二部分-钉钉-jsapi-鉴权)。关键检查：
1. 后端签名用的 `url` 必须是前端传来的**原值**
2. SHA1 而非 SHA256
3. `nonceStr/timeStamp` 必须原样返回前端

---

## 模块联邦

### 子应用路由跳转 404

**现象**：Federation 子应用独立运行正常，嵌入 Host 后路由 404。

**解决**：子应用 `createWebHistory` 的 base 必须与 Host 注册的 module path 一致。

### Pinia/VueRouter 实例不共享

**现象**：子应用 state 不与 Host 同步。

**解决**：在 `vite.config.ts` 的 `federation` 配置中确保 `pinia` 和 `vue-router` 在 `shared` 列表中，且 `optimizeDeps.exclude` 包含它们。

---

## 低代码平台

### 快速搭建提示"编码已存在"

模型编码对应表名。如果模型已存在，可以在快速搭建页面**绑定模型**。

### 接口收集未成功

1. 检查该服务是否在 Nacos 注册成功
2. 系统字典 → 服务信息 中是否配置了该服务
3. **使用路径查询接口，不要使用服务名查询**
4. 本地开发完成后重启服务确保接口生效

### 新增子系统后菜单不可见

1. 确认角色是否有**菜单可见权限**
2. 确认子系统下是否有**子级菜单**——空系统不展示

---

## 测试

### Playwright 脚本审计报 T2 硬编码 URL

使用 `wl-skills-test fix` 自动替换为环境变量：
```bash
npx @agile-team/wl-skills-test fix --target ./tests/
```

### JMeter 脚本加载失败

检查是否触犯了 11 条强制规则。最常见的是 `ConfigTestElement` 与 `TestPlanGui` 混用。详见 [性能测试规范](/views/testing/performance)。

---

## 五包工程

| 现象 | 根因 | 处理 |
|------|------|------|
| kit `update` 提示本地修改，不敢覆盖 | 受管文件被手工改过（真实改动，非 CRLF） | 先 `wl-skills diff` 逐文件核对，改完备份后 `--force` |
| Windows 下 update 报 132 个文件变更 | `core.autocrlf` 换行符差异 | kit 按 LF 计算内容身份，升级到近期版本即不再误报 |
| `validate --pre-commit` 拦截了非页面提交 | v2.18.2 前的已知误报（共享模块/definitions 目录） | 升级 kit ≥ 2.18.2；或按 `docs/validate-exempt.md` 登记目录 |
| 手改了 scenario 生成的页面又被 CI 拦截 | W1 字节级防漂移：scenarioRef 页面禁止手改 | 改 wl-scenario JSON 后 `scenario render --confirm` 重渲染 |
| bd 安装中断后目录状态可疑 | v0.18.1 前无事务安装 | 升级 bd ≥ 0.18.1（写日志 + 失败自动回滚），重跑 `init` |
| bd `codegen apply` 报 planHash 漂移 | plan 之后契约或数据库事实源变了 | 重新 `codegen plan` 取新 planHash 再 apply |
| bd `review --module` 报未知模块 | 模块名不在 Catalog 注册 | 先 `catalog plan/apply` 登记模块，再按模块审查 |
| `db drift` 冒出"无主变更"列 | 有人绕过流程手工直改了库 | 核实后 `db executed` 补登记（带审批引用）；真实废弃则走文档修订 |
| test `doctor` 报 Playwright/JMeter 缺失 | 执行器环境未装或不在 PATH | 按 doctor 输出安装：`pnpm dlx playwright install`、JMeter 5.6.3 配置 |
| design `verify` 对故意保留的旧格式报错 | 规范升级后 [M] 项口径收紧 | 按 verify 输出逐项整改；确认属业务特例再反馈归口 |

---

## 调试技巧

| 场景 | 工具/方法 |
|------|---------|
| 前端 HMR 调试 | Vite dev server + Vue DevTools |
| 钉钉真机调试 | `dingtalk-h5-remote-debug`（详见[钉钉集成](/frontend/mobile-uniapp/dingtalk#第三部分-钉钉真机调试)） |
| 微前端调试 | Chrome DevTools → Application → Shared Modules |
| 后端 API 调试 | Knife4j（OpenAPI 3）/ Apifox |
| 测试环境连通性 | `npx @agile-team/wl-skills-test doctor` |
| 后端配置排查 | `npx @agile-team/wl-skills-bd config doctor --probe` |

---

## 问题反馈

如果遇到文档未覆盖的问题：
- 前端：联系前端团队
- 后端：联系后端团队
- 测试：联系测试团队
- 提交 Issue 到对应仓库
