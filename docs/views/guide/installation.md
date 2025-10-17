# 安装配置

工欲善其事，必先利其器。本章节介绍如何配置和优化金恒科技信息化部前端团队的开发环境。

## 编辑器配置

### VS Code（团队推荐编辑器）

金恒科技信息化部前端团队推荐安装以下扩展：

#### 必装扩展

- **Vue - Official** - Vue 3 官方支持
- **TypeScript Vue Plugin (Volar)** - Vue TypeScript 支持
- **ESLint** - 代码检查
- **Prettier** - 代码格式化

#### 推荐扩展

- **UnoCSS** - UnoCSS 智能提示
- **GitLens** - Git 增强
- **Error Lens** - 错误高亮
- **Auto Rename Tag** - 自动重命名标签
- **Path Intellisense** - 路径智能提示
- **Import Cost** - 导入包大小提示

### ♥️ 一键配置工具 <Badge type="tip" text="推荐" />

为了让团队成员快速统一开发环境,我们提供了 **VSCode Configuration Installer** 工具。

<div style="display: flex; align-items: center; gap: 8px;">
  <a href="https://www.npmjs.com/package/@agile-team/vscode-config">
    <img src="https://img.shields.io/npm/v/@agile-team/vscode-config.svg" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/@agile-team/vscode-config">
    <img src="https://img.shields.io/npm/dt/@agile-team/vscode-config.svg" alt="npm downloads" />
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" />
  </a>
</div>

📦 **NPM 地址**:[https://www.npmjs.com/package/@agile-team/vscode-config](https://www.npmjs.com/package/@agile-team/vscode-config)

#### ✨ 核心特性

- 🚀 **一键安装** - 团队标准的 VSCode 配置（扩展、设置、快捷键、代码片段）
- 🌐 **双源加速** - GitHub 主源 + Gitee 备用源，智能切换确保下载成功
- 💾 **智能备份** - 自动备份现有配置，支持一键恢复
- 🔄 **双模式安装** - 覆盖模式或扩展模式，满足不同需求
- 🛡️ **容错设计** - 部分失败不影响整体安装
- 🌍 **跨平台** - 支持 Windows、macOS 和 Linux
- 🎨 **美化输出** - 清晰的进度提示和彩色状态显示
- 🧹 **备份管理** - 自动清理旧备份，释放磁盘空间

#### 🚀 快速开始

```bash
# 全局安装配置工具
npm install -g @agile-team/vscode-config

# 一键安装团队配置（交互式选择安装模式）
vscode-config install
```

就这么简单！🎉

::: details 💡 查看更多安装方式

```bash
# 使用扩展模式，保留个人设置
vscode-config install --mode merge

# 使用国内镜像源（网络环境较差时推荐）
vscode-config install --source gitee

# 网络较慢时增加超时时间
vscode-config install --timeout 120

# 强制安装，跳过备份确认
vscode-config install --force

# 预览模式，不实际安装
vscode-config install --dry-run
```

:::

#### 🔧 安装模式说明

工具支持两种安装模式，首次运行会交互式提示选择：

::: details 📖 覆盖模式（默认）- 完全一致的团队配置

**特点**
- 🔁 完全替换现有配置文件
- 🛡️ 确保团队配置完全一致
- 💾 自动备份现有配置，可随时恢复
- ⚡ 简单直接，无冲突风险

**适用场景**
- 新设备首次配置
- 团队标准化要求严格
- 需要重置为标准配置

**使用示例**
```bash
# 交互式选择安装模式（推荐）
vscode-config install

# 显式指定覆盖模式
vscode-config install --mode override
```

:::

::: details 📖 扩展模式 - 保留个人设置

**特点**
- 🔄 保留现有个人配置
- ➕ 添加团队标准配置
- 🎯 智能合并，避免冲突
- 🛠️ 更灵活，适应个人习惯

**适用场景**
- 已有个人自定义配置
- 只想获取部分团队配置
- 渐进式采用团队标准

**使用示例**
```bash
# 交互式选择扩展模式（推荐）
vscode-config install

# 直接指定扩展模式
vscode-config install --mode merge
```

**模式对比**

| 特性 | 覆盖模式 | 扩展模式 |
|------|---------|---------|
| 个人设置保留 | ❌ 完全替换 | ✅ 智能保留 |
| 团队一致性 | ✅ 完全一致 | ⚠️ 部分一致 |
| 配置冲突 | ❌ 无冲突 | ⚠️ 可能需要解决 |
| 适用场景 | 新设备、重置 | 已有配置、渐进式 |
| 恢复难度 | ✅ 简单（一键恢复） | ⚠️ 较复杂（需手动调整） |

:::

#### 📖 完整命令参考

::: details � 查看所有可用命令和选项

**主要命令**

| 命令 | 功能 | 示例 |
|------|------|------|
| `install` | 安装/更新 VSCode 配置 | `vscode-config install` |
| `status` | 检查配置状态 | `vscode-config status` |
| `restore` | 恢复备份配置 | `vscode-config restore` |
| `clean` | 清理旧备份 | `vscode-config clean` |

**安装选项**

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `--source <name>` | 指定配置源 (github/gitee) | 自动选择 |
| `--timeout <seconds>` | 扩展安装超时时间 | 30 |
| `--force` | 强制安装，跳过备份确认 | false |
| `--dry-run` | 预览模式，不实际安装 | false |
| `--mode <mode>` | 安装模式 (override/merge) | override |

**备份管理选项**

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `--list` | 列出所有可用备份 | - |
| `--backup <path>` | 指定备份路径恢复 | 最新备份 |
| `--older-than <days>` | 清理指定天数前的备份 | 30 |

**常用命令示例**

```bash
# 查看配置状态和已安装扩展
vscode-config status

# 恢复最新备份
vscode-config restore

# 查看所有可用备份
vscode-config restore --list

# 恢复指定备份
vscode-config restore --backup ~/path/to/backup

# 清理 30 天前的旧备份
vscode-config clean

# 清理 7 天前的旧备份
vscode-config clean --older-than 7
```

:::

#### 📦 配置内容

工具会自动配置以下内容：

::: details 📁 查看详细配置列表

**配置文件**
- `settings.json` - 编辑器设置和首选项
  - 代码格式化配置
  - 编辑器行为设置
  - 语言特定配置
  - 主题和外观
- `keybindings.json` - 自定义快捷键绑定
  - 常用操作快捷键
  - 多光标编辑
  - 代码导航
- `snippets/` - 各种语言的代码片段
  - Vue 3 组件模板
  - TypeScript 类型定义
  - JavaScript 常用代码块
  - CSS/SCSS 样式片段
  - HTML 标签模板

**团队扩展**
- 自动安装团队推荐的所有扩展
- 并发安装，提高效率
- 自动跳过已安装扩展
- 详细的安装统计报告

**安装内容**
```
配置目录/
├── settings.json           # 编辑器设置
├── keybindings.json       # 快捷键绑定
├── snippets/              # 代码片段
│   ├── vue.json          # Vue 片段
│   ├── typescript.json   # TypeScript 片段
│   ├── javascript.json   # JavaScript 片段
│   ├── css.json          # CSS 片段
│   └── html.json         # HTML 片段
└── extensions.json        # 扩展列表
```

:::

#### 🎯 使用场景

::: details 💼 查看典型使用场景

**场景一：新机器快速配置**
```bash
# 全新安装
npm install -g @agile-team/vscode-config
vscode-config install  # 交互式选择安装模式

# 检查安装结果
vscode-config status
```

**场景二：团队配置同步**
```bash
# 获取最新团队配置（交互式选择安装模式）
vscode-config install

# 获取团队配置但保留个人设置（扩展模式）
vscode-config install --mode merge

# 查看已安装扩展
vscode-config status
```

**场景三：网络环境差**
```bash
# 使用国内源 + 延长超时
vscode-config install --source gitee --timeout 120
```

**场景四：配置回滚**
```bash
# 查看所有备份
vscode-config restore --list

# 恢复最新备份
vscode-config restore

# 恢复指定备份
vscode-config restore --backup ~/path/to/backup
```

**场景五：维护清理**
```bash
# 清理 30 天前的备份
vscode-config clean

# 清理 7 天前的备份
vscode-config clean --older-than 7
```

:::

#### 💾 智能备份系统

::: details 🔒 查看备份机制和管理

**自动备份策略**
```
配置目录/
├── settings.json
├── keybindings.json
├── snippets/
├── backup-1635648000000/    # 自动备份
│   ├── settings.json
│   ├── keybindings.json
│   └── snippets/
└── backup-1635734400000/    # 更早备份
    ├── settings.json
    ├── keybindings.json
    └── snippets/
```

**备份位置**
- **macOS**: `~/Library/Application Support/Code/User/`
- **Linux**: `~/.config/Code/User/`
- **Windows**: `%APPDATA%\Code\User\`

**备份管理**
```bash
# 查看备份状态
vscode-config status

# 列出所有备份
vscode-config restore --list

# 清理旧备份
vscode-config clean --older-than 30
```

:::

#### 🌐 双源加速

::: details ⚡ 查看智能源切换机制

**配置源**

| 源 | 用途 | 速度 |
|------|------|------|
| GitHub | 主源，最新更新 | 国外快 |
| Gitee | 备用源，国内镜像 | 国内快 |

**智能切换**
```bash
# 自动选择最佳源（推荐）
vscode-config install

# 手动指定源
vscode-config install --source github  # 使用 GitHub
vscode-config install --source gitee   # 使用 Gitee
```

**故障转移流程**
```
尝试 GitHub → 超时/失败 → 自动切换到 Gitee → 成功
```

:::

#### 📊 状态检查

::: details 🔍 查看状态检查输出示例

运行 `vscode-config status` 会显示：

```bash
📊 VSCode 配置状态检查
=======================================

✓ VSCode 已安装
   版本: 1.84.2
   架构: x64

📁 配置文件状态:
   配置目录: /Users/username/.config/Code/User
   ✓ settings.json (2.1 KB, 修改于 2 小时前)
   ✓ keybindings.json (0.5 KB, 修改于 2 小时前)
   ✓ snippets (目录, 修改于 2 小时前)

🧩 已安装扩展 (显示前10个):
   • ms-python.python@2023.20.0
   • esbenp.prettier-vscode@10.1.0
   • bradlc.vscode-tailwindcss@0.10.5
   ... 还有 47 个扩展

💾 配置备份:
   • backup-1698765432000 (156.2 KB, 2 小时前)
   • backup-1698679032000 (154.8 KB, 1 天前)
   ... 还有 3 个备份

💻 系统信息:
   操作系统: Darwin 23.1.0
   架构: arm64
   Node.js: v18.18.0
```

:::

#### 🆘 故障排除

::: details 🔧 查看常见问题和解决方案

**网络问题**
```bash
# 症状：下载超时或失败
# 解决方案：
vscode-config install --source gitee --timeout 120
```

**VSCode 未找到**
```bash
# 症状：code command not found
# 解决方案：
# 1. 重新安装 VSCode
# 2. 添加到 PATH：
#    - macOS: Command Palette → "Shell Command: Install 'code' command in PATH"
#    - Windows: 安装时勾选 "Add to PATH"
```

**扩展安装失败**
```bash
# 症状：部分扩展安装失败
# 这是正常的！可能原因：
# - 网络问题
# - 扩展需要登录
# - 扩展已下架

# 解决方案：
# 1. 重新运行安装
vscode-config install

# 2. 手动安装特定扩展
code --install-extension ms-python.python
```

**权限问题**
```bash
# Linux/macOS 权限错误
sudo chown -R $(whoami) ~/.config/Code/User/
sudo chown -R $(whoami) ~/.vscode/

# Windows 管理员权限
# 以管理员身份运行命令提示符
```

**系统要求**
- Node.js: >= 14.0.0
- Git: 任意版本
- VSCode: 已安装并添加到 PATH

**验证环境**
```bash
# 一键检查所有依赖
vscode-config status

# 手动验证
node --version    # >= 14.0.0
git --version     # 任意版本
code --version    # 任意版本
```

:::

::: warning ⚠️ 注意事项
- 首次安装会备份你的现有配置到 `backup-<时间戳>/` 目录
- 可以随时使用 `vscode-config restore` 恢复备份
- 扩展模式可能需要手动解决配置冲突
:::

::: tip 💡 小贴士
- 配置工具已集成团队开发规范、常用代码片段和最佳实践
- 强烈建议新成员使用**覆盖模式**确保配置一致性
- 已有个人配置的成员建议使用**扩展模式**
- 定期运行 `vscode-config clean` 清理旧备份释放空间
- 如有特殊配置需求，请联系团队负责人
:::


## 下一步

配置完成后,你可以:

- 📖 熟悉 [项目结构](/views/guide/project-structure)
- 🎨 掌握 [规范约定](/views/guide/development-standards) 
- 🛠️ 了解 [元配置](/views/guide/project-config)

