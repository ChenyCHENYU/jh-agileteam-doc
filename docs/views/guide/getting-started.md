<!-- 组件已自动导入，无需手动 import -->

# 快速开始

欢迎使用金恒科技信息化部前端团队工程体系！本指南将帮助你快速上手我们的前端工程化实践。

<AuthorTag author="CHENY" />


## 环境准备

闲话少叙，在开始之前，请确保你的开发环境满足以下要求：

### 必需工具

- **Node.js**: >= 22.13.0 （推荐使用 LTS 版本）
- **包管理器**: pnpm >= 10.16.1 （团队推荐）或 npm >= 9.0.0

### 推荐工具

- **编辑器**: [VS Code](https://code.visualstudio.com/) （团队标准编辑器）
- **终端**: `git bash` / `cmder` 
- **Git**: `>= 2.30.0`
- **企业内部工具**: 金恒科技内部开发工具集

## 安装依赖

### 安装 pnpm

如果你还没有安装 pnpm，可以通过以下命令安装：

```bash
# 通过 npm 安装
npm install -g pnpm

# 或使用脚本安装（推荐）
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### 验证安装

```bash
node -v   # 应该显示 v22.x.x 或更高版本
pnpm -v   # 应该显示 10.x.x 或更高版本
```

## 启动项目

进入项目目录并启动开发服务器：

```bash
cd your-office-project

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

浏览器会自动打开 `http://localhost:xxxx`，你将看到项目首页。

:::warning :eyes: 这里你要注意：

因为项目存在本地私有包的依赖，你需要设置使用脚本或者设置npm源为本地依赖地址

```bash
- npm config set registry http://172.17.8.54/
- npm install --force or --legacy-peer-deps
```
**或者直接使用脚本（推荐）**

```bash
# .npmrc

strict-peer-dependencies=false
auto-install-peers=true
shamefully-hoist=true

# —— 私有 scope & 私服配置 ——
@jhlc:registry=http://172.17.8.54/

# —— 私服鉴权（写死 token） ——
always-auth=true
//172.17.8.54/:_authToken=MzQ4MjM3ODJkZjg5ZmNmZWUyNTU4ZGFkYzExZjc3MmM6ODQzNjkzMTNkYWU3NTZhMDgwMGY2NWU1ZTM1ODViODQ=

# —— 公共包依旧走官方源 ——
registry=https://registry.npmjs.org/

```

然后执行 `pnpm install` 即可，一般项目会预配置.npmrc，若没有在项目根目录请手动添加该文件

:::


## 常用命令

```bash
# 开发
pnpm dev              # 启动开发服务器
pnpm build            # 构建生产版本
pnpm preview          # 预览生产构建
# 其他命令维护完插件等依赖后补
```

## 下一步

现在你已经成功创建并启动了项目，接下来可以：

- 📚 阅读 [项目结构](/views/guide/project-structure) 了解详细的目录说明
- 🎨 查看 [组件库](/ui-components/) 学习如何使用组件
- 🛠️ 探索 [工程化配置](/views/engineering/scaffold) 深入了解项目配置
- ⚡ 学习 [UnoCSS](/views/unocss-guide) 使用原子化 CSS
- 📖 参考 [最佳实践](/views/best-practices/architecture) 编写高质量代码

## 遇到问题？

如果在使用过程中遇到问题：

1. 查看 [疑难杂症](/views/troubleshooting/) 寻找解决方案
2. 在文档页面下方的评论区留言
3. 联系团队成员获取帮助（企业微信/微信）

## 参与贡献

金恒科技信息化部前端团队欢迎任何形式的贡献：

- 🐛 报告 Bug（直接联系 409322）   
- 💡 提出新功能建议（团队内部评审）
- 📝 改进文档（直接在评论区留言或提交 PR）
- 🔧 提交代码（遵循团队代码规范）

请查看 [贡献指南](/views/guide/contributing) 了解详细的贡献流程和规范。

::: tip 提示
建议先阅读完整个指南版块，然后动手实践，这样能更快地掌握金恒科技信息化部前端团队的工程体系！如有疑问，请随时通过内部工号 409322取得联系或直接评论区留言。
:::



