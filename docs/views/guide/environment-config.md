# 环境配置

本章节介绍金恒科技信息化部前端团队的环境变量配置规范。

## 环境变量说明

Vite 使用 `.env` 文件来管理不同环境下的配置。环境变量必须以 `VITE_` 开头才能在客户端代码中访问。

## 开发环境

`.env.development` - 开发环境配置：

```bash
# 应用标题
VITE_APP_TITLE=金恒科技前端项目

# API 基础路径
VITE_API_BASE_URL=http://localhost:3000/api

# 是否开启 Mock
VITE_USE_MOCK=true

# 企业内部配置
VITE_ENTERPRISE_MODE=true
VITE_INTERNAL_TOOLS_ENABLED=true
```

### 配置说明

- **VITE_APP_TITLE**: 应用标题，显示在浏览器标签页
- **VITE_API_BASE_URL**: API 基础路径，开发环境使用本地地址
- **VITE_USE_MOCK**: 是否开启 Mock 数据，开发环境建议开启
- **VITE_ENTERPRISE_MODE**: 企业内部模式标识
- **VITE_INTERNAL_TOOLS_ENABLED**: 是否启用内部工具

## 测试环境

`.env.test` - 测试环境配置：

```bash
# 应用标题
VITE_APP_TITLE=金恒科技前端项目(测试)

# API 基础路径
VITE_API_BASE_URL=https://test-api.jinheng.com/api

# 是否开启 Mock
VITE_USE_MOCK=false

# 企业内部配置
VITE_ENTERPRISE_MODE=true
VITE_INTERNAL_TOOLS_ENABLED=true
```

### 配置说明

- 测试环境使用真实的测试服务器地址
- 关闭 Mock 数据，使用真实后端接口
- 保留内部工具功能用于调试

## 生产环境

`.env.production` - 生产环境配置：

```bash
# 应用标题
VITE_APP_TITLE=金恒科技前端项目

# API 基础路径
VITE_API_BASE_URL=https://api.jinheng.com/api

# 是否开启 Mock
VITE_USE_MOCK=false

# 企业内部配置
VITE_ENTERPRISE_MODE=true
VITE_INTERNAL_TOOLS_ENABLED=false
```

### 配置说明

- 生产环境使用正式的服务器地址
- 关闭 Mock 数据
- **关闭内部工具**，避免暴露敏感功能

## 使用环境变量

### 在代码中访问

```typescript
// 获取环境变量
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const appTitle = import.meta.env.VITE_APP_TITLE;
const useMock = import.meta.env.VITE_USE_MOCK === "true";

// 判断当前环境
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;
const mode = import.meta.env.MODE;

console.log("当前环境:", mode);
console.log("API 地址:", apiUrl);
```

### 类型定义

在 `src/vite-env.d.ts` 中定义环境变量类型：

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_USE_MOCK: string;
  readonly VITE_ENTERPRISE_MODE: string;
  readonly VITE_INTERNAL_TOOLS_ENABLED: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## 安全建议

::: warning ⚠️ 安全注意事项

1. **不要在环境变量中存储敏感信息**（如密钥、密码）
2. **`.env.local` 文件不要提交到 Git**
3. **生产环境关闭调试工具**
4. **定期审查环境变量配置**

:::

### .gitignore 配置

确保本地环境变量文件不被提交：

```gitignore
# 本地环境变量
.env.local
.env.*.local
```

::: tip 💡 提示
团队脚手架已经配置好了常用的环境变量，可以根据实际需求修改！
:::
