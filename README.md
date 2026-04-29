# AGILE TEAM — AI 工程体系文档站

> AI工程体系 · 提升交付效率 · 赋能团队协作

基于 [VitePress](https://vitepress.dev/) 构建的团队知识文档站，沉淀前后端研发的 AI 辅助工作流、Skills 集合、组件库、模板库与规范文档。

---

## 技术栈

| 方向 | 技术 |
|---|---|
| 文档框架 | VitePress 2.x |
| 语言 | TypeScript |
| 样式 | UnoCSS + SCSS |
| 包管理 | pnpm |
| 部署 | Vercel |

---

## 快速开始

```bash
# 安装依赖
pnpm install

# 本地开发
pnpm dev

# 构建生产
pnpm build

# 预览构建产物
pnpm preview
```

---

## 文档结构

```
docs/
  frontend/
    pc/               # PC 端前端：概览、规范、Skills 集合
    mobile/           # 移动端前端（规划中）
  backend/            # 后端：概览、规范、Skills 集合
  views/
    guide/            # 上手指南
    best-practices/   # AI 最佳实践
    ai-workflow/      # AI 工作流
    team/             # 团队介绍
    styling/          # 样式方案
  ui-components/      # 组件库文档
  templates/          # 页面模板库
```

---

## PC 端 Skills 集合

5 个 AI 辅助研发 Skill，覆盖从原型到代码的完整链路：

| # | Skill | 说明 |
|---|---|---|
| ① | 原型扫描 | 解析 Axure 原型，提取字段与交互信息 |
| ② | 接口约定 | 根据原型自动生成前后端接口约定文档 |
| ③ | 页面代码生成 | 基于约定一键生成可运行页面代码 |
| ④ | 菜单同步 | 同步菜单配置到路由与权限系统 |
| ⑤ | 规范审计 | 检查生成代码是否符合团队规范 |

```bash
# 在前端项目根目录执行（无需安装，直接运行）
npx @agile-team/wl-skills-kit
```

---

## 贡献指南

1. 所有文档均在 `docs/` 目录下，Markdown 编写
2. 导航配置：`docs/.vitepress/config/nav.ts`
3. 侧边栏配置：`docs/.vitepress/config/sidebar.ts`
4. 自定义样式：`docs/.vitepress/theme/custom.css`

---

## License

Copyright © 2026 金恒科技 AGILE TEAM · All Rights Reserved
