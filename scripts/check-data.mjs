/**
 * 写死包版本号检查
 * 用法：node scripts/check-data.mjs
 * 已挂入 build 前钩子：文档中出现"当前版本"式写死的包版本将构建失败，
 * 强制使用 <NpmVersion> 实时组件（页面运行时从 npm registry 拉取）。
 *
 * 放行场景：
 *  - 历史变更语境（"v2.18.0 起" / "v2.18.0 前为" 等，行内含时间锚词）
 *  - 代码块内的安装/回退命令（pin 版本是合法操作）
 *  - install 命令的 @latest
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PKG = String.raw`@?agile-?team/?(wl-skills-(?:kit|ui|bd|test|design)|jh4j-cloud-cli)`;
// "当前版本"句式：包名后 30 字符内紧跟 vX.Y.Z / X.Y.Z（含中文括号包裹）
const CURRENT_VER = new RegExp(`${PKG}[^\\n]{0,30}\\(?v?\\d+\\.\\d+\\.\\d+\\)?`, "i");
// 历史语境放行词
const HISTORICAL = /起|前为|前是|新增|升级到|更名|改名|回退|已落地|发布于|发布历史|CHANGELOG|迁移/i;
// 版本约束放行：≥/>=/^/~ 开头的是兼容范围声明，非"当前版本"
const CONSTRAINT = /([≥≤]|>=|<=|\^|~)\s*v?\d+\.\d+/g;

function walkMd(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (name === "dist" || name === "node_modules" || name.startsWith(".")) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkMd(p, acc);
    else if (name.endsWith(".md")) acc.push(p);
  }
  return acc;
}

const files = [join(root, "README.md"), ...walkMd(join(root, "docs"))];
const offenders = [];

for (const file of files) {
  const rel = file.slice(root.length + 1);
  const lines = readFileSync(file, "utf8").split("\n");
  let inCode = false;
  lines.forEach((line, i) => {
    if (line.trim().startsWith("```")) {
      inCode = !inCode;
      return;
    }
    if (inCode) return; // 代码块内放行
    if (line.includes("<NpmVersion")) return; // 已使用实时组件，合规
    if (HISTORICAL.test(line)) return; // 历史变更语境放行
    if (/@latest/i.test(line)) return; // latest 引用放行
    const testLine = line.replace(CONSTRAINT, ""); // 版本约束范围放行
    if (CURRENT_VER.test(testLine)) {
      offenders.push(`${rel}:${i + 1}  ${line.trim().slice(0, 90)}`);
    }
  });
}

console.log(`写死版本检查：${files.length} 个文件`);
if (offenders.length) {
  console.error("发现写死的包版本号（请改用 <NpmVersion pkg=\"...\" fallback=\"...\" />）：");
  offenders.forEach((l) => console.error("  ✗", l));
  process.exit(1);
}
console.log("无写死当前版本 ✓");
