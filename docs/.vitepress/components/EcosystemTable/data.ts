/**
 * 生态 npm 看板单一数据源（团队全部包，跨 scope）
 * version 为构建时兜底值；页面加载后自动从 npm registry 拉取最新。
 * 新增包时在此追加一行（internal 包跳过实时拉取）。
 * 注意：五包版本从 PackagesTable/data.ts 派生（发版只改那一处）。
 */
import { packages as FIVE_PKGS } from "../PackagesTable/data";

export interface EcoPkg {
  /** 完整包名（含 scope） */
  name: string;
  /** 生态分层（与页面分层地图一致） */
  layer: string;
  /** 构建时兜底版本 */
  version: string;
  /** 许可证 */
  license: string;
  /** 重点包（加粗展示） */
  featured?: boolean;
  /** 未发布到公共 npm 的内部源包：跳过实时拉取 */
  internal?: boolean;
}

const L5 = "AI 工程五包";
const LBASE = "基础设施库";
const LGRID = "企业数据表格";
const LREPORT = "报表引擎";
const LQG = "质量门（Gate）";
const LTOOL = "工程工具链";

/** 五包名 → 兜底版本（单一数据源：PackagesTable） */
const FIVE_VERSIONS = new Map<string, string>(
  FIVE_PKGS.map((p) => [`@agile-team/${p.name}`, p.version] as const)
);

/** 五包兜底版本派生（不在此文件维护第二份版本号） */
const five = (name: string): string => FIVE_VERSIONS.get(name) ?? "0.0.0";

export const ecoPackages: EcoPkg[] = [
  // ---- AI 工程五包 ----
  { name: "@agile-team/wl-skills-kit", layer: L5, version: five("@agile-team/wl-skills-kit"), license: "UNLICENSED" },
  { name: "@agile-team/wl-skills-ui", layer: L5, version: five("@agile-team/wl-skills-ui"), license: "UNLICENSED" },
  { name: "@agile-team/wl-skills-bd", layer: L5, version: five("@agile-team/wl-skills-bd"), license: "UNLICENSED" },
  { name: "@agile-team/wl-skills-test", layer: L5, version: five("@agile-team/wl-skills-test"), license: "UNLICENSED" },
  { name: "@agile-team/wl-skills-design", layer: L5, version: five("@agile-team/wl-skills-design"), license: "Apache-2.0" },
  // ---- 质量门（Gate） ----
  { name: "@agile-team/wl-skills-gate", layer: LQG, version: "0.13.19", license: "Source-Available（商用需授权）", featured: true },
  // ---- 基础设施库 ----
  { name: "@jhlc/common-core", layer: LBASE, version: "—", license: "—", internal: true },
  { name: "@robot-admin/git-standards", layer: LBASE, version: "1.0.6", license: "MIT" },
  { name: "@robot-admin/form-validate", layer: LBASE, version: "3.4.4", license: "MIT" },
  { name: "@robot-h5/core", layer: LBASE, version: "1.2.0", license: "UNLICENSED" },
  { name: "@agile-team/naive-ui-components", layer: LBASE, version: "0.1.4", license: "MIT" },
  // ---- 企业数据表格（MachTable 四件套） ----
  { name: "@agile-team/mach-table", layer: LGRID, version: "0.38.0", license: "Source-Available（商用需授权）", featured: true },
  { name: "@agile-team/mach-table-vue", layer: LGRID, version: "0.38.0", license: "Source-Available（商用需授权）" },
  { name: "@agile-team/mach-table-react", layer: LGRID, version: "0.38.0", license: "Source-Available（商用需授权）" },
  { name: "@agile-team/mach-table-xlsx", layer: LGRID, version: "0.38.0", license: "Source-Available（商用需授权）" },
  // ---- 报表引擎 ----
  { name: "@agile-team/mach-report", layer: LREPORT, version: "2.21.1", license: "Source-Available（商用需授权）", featured: true },
  // ---- 工程工具链 ----
  { name: "@agile-team/jh4j-cloud-cli", layer: LTOOL, version: "0.6.3", license: "—" },
  { name: "@agile-team/robot-cli", layer: LTOOL, version: "3.2.0", license: "MIT" },
  { name: "@agile-team/vscode-config", layer: LTOOL, version: "3.15.0", license: "MIT" },
  { name: "@agile-team/vscode-config-extensions", layer: LTOOL, version: "1.1.0", license: "MIT" },
  // ---- 独立小工具（研发提效，公共 npm） ----
  { name: "git-branch-check-diff-commits", layer: LTOOL, version: "1.4.2", license: "MIT" },
  { name: "git-log-formatter", layer: LTOOL, version: "1.2.0", license: "MIT" },
  { name: "ts-type-cleaner", layer: LTOOL, version: "6.1.0", license: "MIT" },
  { name: "vite-console-plugin", layer: LTOOL, version: "2.1.0", license: "MIT" },
  { name: "vite-plugin-preloader", layer: LTOOL, version: "2.3.0", license: "MIT" },
];
