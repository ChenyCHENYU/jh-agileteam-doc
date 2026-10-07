/**
 * 生态 npm 看板单一数据源
 * version 为构建时兜底值；页面加载后自动从 npm registry 拉取最新。
 * 新增包时在此追加一行即可。
 */

export interface EcoPkg {
  /** 完整包名（含 scope） */
  name: string;
  /** 构建时兜底版本 */
  version: string;
  /** 许可证 */
  license: string;
  /** 重点包（加粗展示） */
  featured?: boolean;
}

export const ecoPackages: EcoPkg[] = [
  { name: "@agile-team/mach-table", version: "0.29.2", license: "Source-Available（商用需授权）", featured: true },
  { name: "@agile-team/mach-table-vue", version: "0.29.2", license: "Source-Available（商用需授权）" },
  { name: "@agile-team/mach-table-react", version: "0.29.2", license: "Source-Available（商用需授权）" },
  { name: "@agile-team/mach-table-xlsx", version: "0.29.2", license: "Source-Available（商用需授权）" },
  { name: "@agile-team/wl-skills-kit", version: "2.21.0", license: "UNLICENSED" },
  { name: "@agile-team/wl-skills-ui", version: "1.12.0", license: "UNLICENSED" },
  { name: "@agile-team/wl-skills-bd", version: "0.26.0", license: "UNLICENSED" },
  { name: "@agile-team/jh4j-cloud-cli", version: "0.6.3", license: "—" },
  { name: "@agile-team/wl-skills-test", version: "0.25.0", license: "UNLICENSED" },
  { name: "@agile-team/robot-cli", version: "3.2.0", license: "MIT" },
  { name: "@agile-team/vscode-config", version: "3.14.5", license: "MIT" },
  { name: "@agile-team/wl-skills-design", version: "0.11.1", license: "Apache-2.0" },
  { name: "@agile-team/vscode-config-extensions", version: "1.1.0", license: "MIT" },
  { name: "@agile-team/naive-ui-components", version: "0.1.4", license: "MIT" },
];
