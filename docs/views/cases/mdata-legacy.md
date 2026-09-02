# 存量项目接入 kit（wl-mdata）

> 案例③：老项目不停机接入 kit——先快照、再增量装、沉淀文档 17 篇。

## 数据面板

| 维度 | 数据 |
|------|------|
| 项目 | wl-mdata v1.0.0（主数据前端，produce / sale 双域） |
| 接入 | kit 安装至 `.wl-skills/` · 项目快照 `.wl-snapshot` · demo 双域样例 |
| 沉淀 | docs 17 篇：jh-* 平台组件文档 ×11 · page-query-hook 最佳实践 · request 封装 · 本地开发指南 |
| 兜底 | `diff` 核对本地修改 · `update` 增量升级（LF 内容身份，CRLF 不误报）· `validate` 冻结基线 |

## 接入步骤（存量项目通用）

```bash
wl-skills init            # 安装（manifest 管理，不覆盖本地修改）
wl-skills diff            # 核对本地改动与 kit 版本差异
wl-skills validate        # 首轮全量体检，拿基线报告
wl-skills update          # 后续升级：MD5 增量，仅覆盖变化文件
```

## 踩坑与沉淀

| 坑 | 沉淀 |
|----|------|
| 本地改过的文件被升级覆盖 | manifest + LF 内容身份识别；真实改动自动备份 `.bak` |
| 接入后规范口径不统一 | `validate` 冻结基线：历史问题按计划消化，新增违规 CI 阻断 |
| 组件用法靠口口相传 | 11 篇 jh-* 组件文档随项目沉淀（本站 PC 端组件文档亦引用此体系） |

## 可复现路径

存量项目接入三件事：**先 diff、再冻结、后增量**。完整命令见 [CLI 工具](/frontend/pc/skills/cli)。
