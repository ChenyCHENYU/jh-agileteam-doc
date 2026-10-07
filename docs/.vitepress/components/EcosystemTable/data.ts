/**
 * 生态 npm 看板单一数据源（团队全部包，跨 scope）
 * version 为构建时兜底值；页面加载后自动从 npm registry 拉取最新。
 * 新增包时在此追加一行（internal 包跳过实时拉取）。
 */

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
const LTOOL = "工程工具链";

export const ecoPackages: EcoPkg[] = [
  // ---- AI 工程五包 ----
  { name: "@agile-team/wl-skills-kit", layer: L5, version: "2.25.0", license: "UNLICENSED" },
  { name: "@agile-team/wl-skills-ui", layer: L5, version: "1.15.0", license: "UNLICENSED" },
  { name: "@agile-team/wl-skills-bd", layer: L5, version: "0.32.0", license: "UNLICENSED" },
  { name: "@agile-team/wl-skills-test", layer: L5, version: "0.25.0", license: "UNLICENSED" },
  { name: "@agile-team/wl-skills-design", layer: L5, version: "0.11.1", license: "Apache-2.0" },
  // ---- 基础设施库 ----
  { name: "@jhlc/common-core", layer: LBASE, version: "—", license: "—", internal: true },
  { name: "@robot-admin/git-standards", layer: LBASE, version: "1.0.5", license: "MIT" },
  { name: "@robot-admin/form-validate", layer: LBASE, version: "3.4.2", license: "MIT" },
  { name: "@robot-h5/core", layer: LBASE, version: "1.2.0", license: "UNLICENSED" },
  { name: "@agile-team/naive-ui-components", layer: LBASE, version: "0.1.4", license: "MIT" },
  // ---- 企业数据表格（MachTable 四件套） ----
  { name: "@agile-team/mach-table", layer: LGRID, version: "0.29.2", license: "Source-Available（商用需授权）", featured: true },
  { name: "@agile-team/mach-table-vue", layer: LGRID, version: "0.29.2", license: "Source-Available（商用需授权）" },
  { name: "@agile-team/mach-table-react", layer: LGRID, version: "0.29.2", license: "Source-Available（商用需授权）" },
  { name: "@agile-team/mach-table-xlsx", layer: LGRID, version: "0.29.2", license: "Source-Available（商用需授权）" },
  // ---- 工程工具链 ----
  { name: "@agile-team/jh4j-cloud-cli", layer: LTOOL, version: "0.6.3", license: "—" },
  { name: "@agile-team/robot-cli", layer: LTOOL, version: "3.2.0", license: "MIT" },
  { name: "@agile-team/vscode-config", layer: LTOOL, version: "3.14.5", license: "MIT" },
  { name: "@agile-team/vscode-config-extensions", layer: LTOOL, version: "1.1.0", license: "MIT" },
];
