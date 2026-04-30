# PC 端扩展规范

<AuthorTag :authors="['ZhuXiang','CHENY','ZhongYu','XuQingYu']" />

::: info 说明
本版块收录 PC 端专属扩展规范（平台规范系列 12–13 条），是通用工程规范（01–11 条）之上、针对 Robot_Admin 平台架构和 `@jhlc/jh-ui` 组件体系的专项约定。

通用工程规范（01–11）请参阅 [快速上手 — 规范约定](/frontend/quick-start/)。
:::

## 规范列表

| 编号 | 规范名称 | 强制度 | 摘要 |
| ---- | -------- | ------ | ---- |
| [12](/frontend/pc/12-base-table) | BaseTable 渲染与 AGGrid cid 唯一性规范 | 🔴 必遵 | AGGrid 渲染模式、cid 全局唯一命名规则（base-36 时间戳） |
| [13](/frontend/pc/13-platform-components) | 平台组件合规规范 | 🔴 阻断式 | 强制使用平台封装组件对照表，禁止直接使用 `el-*` 原生组件 |

## 扩展说明

- **编号延续**：本版块规范编号从 12 起，接续快速上手中的 01–11，统一归属 `@agile-team/wl-skills-kit` 平台规范体系
- **未来扩展**：PC 端新增规范在此追加，编号顺延（14、15…）

