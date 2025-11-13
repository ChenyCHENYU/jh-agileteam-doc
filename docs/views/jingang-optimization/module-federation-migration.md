# 模块联邦架构改造实战指南

> **基于实际项目经验的真实方案**

## 📊 改造目标与实际情况

### 预期目标

- ✅ 单模块构建时间从 **10 分钟 → 1-2 分钟** (提速 75-87%)
- ✅ 独立部署：改 1 个模块，只部署 1 个
- ✅ 对业务影响：**接近 0**

### 实际验证结果

**成本模块试点 (cost-app)**:

- ✅ 构建速度：**约 2 分钟** (4500+ 模块)
- ✅ 产物体积：**47MB** (优化后)
- ✅ 独立启动：**端口 5011** 可独立运行
- ✅ Module Federation：已配置 systemApp 远程模块
- ⚠️ **关键识别**：构建速度主要受模块数量影响，非架构问题

---

## 一、当前架构分析

### 1.1 现有架构特点

```
src/
├── main.ts                    # 单一入口
├── router/                    # 统一路由
├── views/
│   ├── tms/                  # 运输管理 (6.9MB, 300+ 文件)
│   ├── cost/                 # 成本管理 (1.8MB, 171 文件) ✅ 已试点
│   ├── ism/                  # 智能安全 (3.0MB)
│   ├── crm/                  # 客户管理
│   ├── hr/                   # 人力资源
│   ├── finance/              # 财务管理
│   └── ... (15+ 模块)
├── apps/
│   └── cost/                 # 成本独立应用 ✅ 新架构
│       ├── index.html
│       ├── main.ts
│       ├── vite.config.cost.ts
│       └── views/
└── api/                      # 共享 API
    ├── action.ts
    ├── costBase/
    ├── crmBase/
    └── tmsBase/
```

### 1.2 关键技术栈

```json
{
  "vite": "4.4.9",
  "@originjs/vite-plugin-federation": "已安装",
  "架构": "Module Federation (微前端)",
  "路由": "Vue Router (Hash 模式)",
  "状态": "Pinia",
  "UI": "Element Plus 2.2.6"
}
```

---

## 二、成本模块改造实践

### 2.1 目录结构

**改造后的成本应用**:

```
src/apps/cost/
├── index.html                 # 独立 HTML 入口
├── main.ts                    # 独立应用入口
├── vite.config.cost.ts        # 独立 Vite 配置
├── App.vue                    # 根组件
├── router/
│   └── index.ts              # 成本模块路由
├── views/                     # 业务页面 (171 文件)
│   ├── basicData/
│   ├── check/
│   ├── costHeat/
│   ├── dailyCost/
│   └── ...
├── public/
│   └── fonts/                # 独立资源
└── assets/
    └── images/               # 独立图片
```

### 2.2 Vite 配置关键点

<details>
<summary> vite.config.cost.ts - 点击查看核心配置</summary>

```typescript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import federation from "@originjs/vite-plugin-federation";
import path from "path";

export default defineConfig({
  // 设置 root 为成本应用目录
  root: path.resolve(__dirname, "src/apps/cost"),

  // 独立的 public 目录
  publicDir: path.resolve(__dirname, "src/apps/cost/public"),

  // 独立的缓存目录
  cacheDir: path.resolve(__dirname, "node_modules/.vite-cost"),

  plugins: [
    vue(),
    federation({
      name: "cost_app",

      // ⚠️ 关键：消费 systemApp 远程模块
      remotes: {
        systemApp: `${webUrl}/systemApp/assets/remoteEntry.js?t=${Date.now()}`,
      },

      // ⚠️ 关键：共享依赖配置
      shared: {
        vue: {},
        pinia: {},
        "vue-router": {},
        "@jhlc/common-core": {},
        "element-plus": {},
      },
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // 访问主应用
      "@/views": path.resolve(__dirname, "src/apps/cost/views"), // 优先本地
      "@cost": path.resolve(__dirname, "src/apps/cost"), // 本地资源
    },
  },

  server: {
    port: 5011, // 独立端口
    host: "0.0.0.0",
    cors: true, // 允许跨域
  },

  build: {
    outDir: path.resolve(__dirname, "dist-cost"),
    target: "esnext",
    minify: "esbuild", // 快速压缩
  },
});
```

</details>

**配置说明**:

| 配置项              | 作用           | 为什么重要                    |
| ------------------- | -------------- | ----------------------------- |
| `root`              | 指定应用根目录 | 让 Vite 从 cost 目录启动      |
| `remotes.systemApp` | 消费远程模块   | 访问页面设计器等功能          |
| `shared`            | 共享依赖       | 避免重复加载 vue/element-plus |
| `alias.@`           | 访问主应用     | 复用 api/components/store     |
| `alias.@/views`     | 优先本地       | 避免加载其他模块 views        |
| `port: 5011`        | 独立端口       | 与主应用 5000 隔离            |

### 2.3 路由配置

```typescript
// src/apps/cost/router/index.ts
import { createRouter, createWebHashHistory } from "vue-router";

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/cost",
      redirect: "/cost/dashboard",
    },
    {
      path: "/cost/dashboard",
      component: () => import("../views/check/accountCenter/index.vue"),
      meta: { title: "成本中心" },
    },
    {
      path: "/cost/heat",
      component: () => import("../views/costHeat/board/index.vue"),
      meta: { title: "热轧成本" },
    },
    // ... 其他成本路由
  ],
});
```

### 2.4 Package.json 脚本

```json
{
  "scripts": {
    "dev:cost": "cross-env MODULE=costApp vite --config vite.config.cost.ts --mode dev --port 5011",
    "build:cost": "cross-env MODULE=costApp vite build --config vite.config.cost.ts --mode prod",
    "preview:cost": "vite preview --config vite.config.cost.ts --port 5011"
  }
}
```

---

## 三、架构关键问题与解决方案

### 3.1 共享依赖问题

**问题**: 成本应用依赖主应用的 `@/api`、`@/components`、`@/store`

**实际依赖统计**:

```bash
# 成本应用引用主应用模块
@/api/action: 114 次
@/api/costBase: 87 次
@/api/crmBase/base: 6 次 (initDict)
@/components: 50+ 个组件
@/mixins: 117 次
@/util: 56 次
```

**解决方案**: 保留 `@` 别名，继续访问主应用

```typescript
// ✅ 可行方案
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src'),  // 保留访问权限
  }
}

// ❌ 不可行：完全解耦
// 需要复制所有共享代码，维护成本高
```

**代价分析**:

| 方案            | 优点                 | 缺点                         | 结论        |
| --------------- | -------------------- | ---------------------------- | ----------- |
| **保留 @ 依赖** | 零代码改动，快速实施 | 构建需处理 2392 个主应用文件 | ✅ **推荐** |
| **完全解耦**    | 真正独立，构建更快   | 需复制代码，后期维护困难     | ❌ 不推荐   |

### 3.2 构建速度问题

**实测数据**:

```bash
pnpm run build:cost
# Transform: 1分40秒 (84%) - 处理 4546 个模块
# Bundle:    15秒 (11%)
# Copy:      0.1秒 (2%)
# 总计: 2分07秒

# 模块来源:
# 171 成本应用文件
# 2392 主应用共享文件 (因为 @ 别名)
# 2124 node_modules
```

**为什么不能更快?**

1. **模块数量决定速度**: 4546 个模块需要逐个转换
2. **@ 别名必须保留**: 459 处引用，改造成本太高
3. **共享依赖必须处理**: `@jhlc/platform` 等大型库无法避免

**优化尝试与结果**:

```typescript
// ❌ 尝试 1: Vite 插件过滤其他模块
excludePatterns: ['src/views/crm', 'src/views/hr', ...]
// 结果: 4684 → 4546 模块 (只减少 138 个)
// 原因: 这些模块本就没被引用，tree-shaking 已自动排除

// ❌ 尝试 2: 排除其他 API 目录
excludePatterns: ['src/api/tmsBase', 'src/api/ismBase']
// 结果: 构建失败! layout 依赖 setHasReadApi
// 原因: 成本应用共用主应用 layout

// ✅ 结论: 2 分钟已是合理速度，继续优化需架构重构
```

### 3.3 Module Federation 配置

**当前状态**: 成本应用只消费 systemApp

```typescript
// vite.config.cost.ts
remotes: {
  systemApp: `http://172.17.8.57/systemApp/assets/remoteEntry.js`;
}

// 作用:
// 访问页面设计器 (systemApp 提供)
```

**如果要实现完整微前端**:

<details>
<summary>📄 主应用 (Host) 配置示例</summary>

```typescript
// vite.config.host.ts (假设创建主应用)
export default defineConfig({
  plugins: [
    federation({
      name: "host",

      // 消费各个业务模块
      remotes: {
        costApp: "http://localhost:5011/assets/remoteEntry.js",
        tmsApp: "http://localhost:5001/assets/remoteEntry.js",
        ismApp: "http://localhost:5003/assets/remoteEntry.js",
        // ...
      },

      shared: {
        vue: { singleton: true },
        "element-plus": { singleton: true },
        // ...
      },
    }),
  ],
});
```

</details>

<details>
<summary>📄 成本应用暴露组件</summary>

```typescript
// vite.config.cost.ts
export default defineConfig({
  plugins: [
    federation({
      name: "cost_app",
      filename: "remoteEntry.js",

      // 暴露给主应用
      exposes: {
        "./App": "./App.vue",
        "./routes": "./router/index.ts",
      },

      shared: {
        vue: { singleton: true },
        "element-plus": { singleton: true },
      },
    }),
  ],
});
```

</details>

**主应用路由**:

```typescript
// host/router/index.ts
{
  path: '/cost/:pathMatch(.*)*',
  component: defineAsyncComponent(() =>
    // @ts-ignore
    import('costApp/App')  // 动态加载远程模块
  ),
  meta: {
    title: '成本管理',
    remote: 'costApp'
  }
}
```

---

## 四、改造实施路径

### 4.1 渐进式改造 (推荐)

**阶段 1: 单模块试点 (1-2 周)**

```
✅ 完成状态: cost-app 已实现独立运行
- [x] 创建 src/apps/cost 目录
- [x] 配置 vite.config.cost.ts
- [x] 配置独立路由
- [x] 配置 Module Federation
- [x] 验证独立启动 (pnpm run dev:cost)
- [x] 验证独立构建 (pnpm run build:cost)
```

**阶段 2: 批量迁移**

```
待实施:

- [ ] ... (依次改造其他模块)

```
- [ ] 创建 src/host 目录
- [ ] 配置主应用路由 (动态加载各模块)
- [ ] 配置 remotes (所有业务模块)
- [ ] 配置 shared (统一依赖版本)
- [ ] 测试模块切换
```
```
- [ ] Jenkins 支持单模块构建
- [ ] 自动检测变更模块
- [ ] 独立部署流程
- [ ] 健康检查
```

### 4.2 时间评估

| 阶段     | 工作内容           | 预估时间   | 风险  |
| -------- | ------------------ | ---------- | ----- |
| 阶段 1   | 单模块试点 (cost)  | ✅ 已完成  | 🟢 低 |
| 阶段 2   | 批量迁移 (17 模块) | 2-4 周     | 🟡 中 |
| 阶段 3   | 主应用开发         | 1-2 周     | 🟡 中 |
| 阶段 4   | CI/CD 改造         | 1 周       | 🟢 低 |
| **总计** |                    | **4-7 周** |       |

---

## 五、关键经验总结

### ✅ 已验证的方案

1. **独立应用配置**: vite.config.cost.ts 配置有效
2. **Module Federation**: systemApp 远程模块正常工作
3. **共享依赖**: 通过 @ 别名复用主应用代码
4. **资源优化**: 字体 99.8%、图片 91.7% 减少
5. **独立启动**: 端口 5011 可单独运行

### ❌ 不可行的方案

1. **完全解耦**: 改造成本太高 (459 处 @ 引用)
2. **插件过滤**: 对 Module Federation 效果有限
3. **API 精简**: 容易破坏依赖关系

### ⚠️ 注意事项

1. **构建速度**: 2 分钟是合理值，目前不能再过度优化
2. **共享依赖**: 必须保持版本一致 (singleton: true)
3. **端口管理**: 每个模块需独立端口，避免冲突
4. **CORS 配置**: 跨域必须正确配置

---

## 六、下一步计划



- [ ] **TMS 模块改造**: 复用 cost 配置，端口 5001
- [ ] **ISM 模块改造**: 复用 cost 配置，端口 5003
- [ ] **迁移脚本优化**: 自动化批量迁移工具
- [ ] **主应用开发**: 创建 Host，统一路由管理
- [ ] **所有模块迁移**: 17 个模块全部独立
- [ ] **CI/CD 改造**: Jenkins 支持单模块构建部署

---

## 七、参考资料

### 技术文档

- [Vite 官方文档](https://vitejs.dev/)
- [Module Federation](https://module-federation.github.io/)
- [@originjs/vite-plugin-federation](https://github.com/originjs/vite-plugin-federation)


### 常用命令

```bash
# 启动成本应用
pnpm run dev:cost

# 构建成本应用
pnpm run build:cost

# 检查产物
du -sh dist-cost/
find dist-cost -name "remoteEntry.js"

# 创建新模块
./scripts/migrate-module.sh <模块名> <端口号>
```

---

## 八、FAQ

### Q1: 为什么构建还是要 2 分钟？

**A**: 因为成本应用通过 `@` 别名访问主应用的 2392 个文件，这些文件必须被 Vite 处理。如果要更快，需要完全解耦（不推荐）。

### Q2: 如何判断模块是否真正独立？

**A**:

```bash
# 1. 独立启动测试
pnpm run dev:cost
# 访问 http://localhost:5011 能正常显示

# 2. 独立构建测试
pnpm run build:cost
# 检查 dist-cost/ 产物完整

# 3. 检查依赖
grep -r "import.*from '@/" src/apps/cost/
# 确认只引用必要的主应用模块
```

### Q3: 如何添加新的远程模块？

**A**:

```typescript
// vite.config.cost.ts
remotes: {
  systemApp: 'http://xxx/systemApp/assets/remoteEntry.js',
  newApp: 'http://xxx/newApp/assets/remoteEntry.js'  // 添加新模块
}
```

### Q4: shared 依赖版本冲突怎么办？

**A**: 确保所有模块使用相同版本

```json
// 检查版本
grep "vue" package.json
grep "element-plus" package.json

// 统一版本
pnpm install vue@3.2.25 --workspace-root
```
