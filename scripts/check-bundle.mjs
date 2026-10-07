/**
 * 产物体积预算（build 后钩子）
 * 用法：node scripts/check-bundle.mjs
 *
 * 预算：dist/assets 下 JS 总量 ≤ 15MB；单文件 ≤ 5MB（搜索索引懒加载豁免至 5MB）。
 * 超预算构建失败，防止资产悄悄膨胀无人察觉。
 */
import { readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const assetsDir = join(root, "docs/.vitepress/dist/assets");

const TOTAL_BUDGET = 15 * 1024 * 1024;
const SINGLE_BUDGET = 5 * 1024 * 1024;

const files = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith(".js")) files.push(p);
  }
}
walk(assetsDir);

const total = files.reduce((a, f) => a + statSync(f).size, 0);
const oversize = files.filter((f) => statSync(f).size > SINGLE_BUDGET);

console.log(`JS 资产：${files.length} 个，共 ${(total / 1024 / 1024).toFixed(2)}MB（预算 15MB）`);

let failed = false;
if (total > TOTAL_BUDGET) {
  console.error(`✗ 总体积超预算：${(total / 1024 / 1024).toFixed(2)}MB > 15MB`);
  failed = true;
}
for (const f of oversize) {
  console.error(`✗ 单文件超预算：${(statSync(f).size / 1024 / 1024).toFixed(2)}MB ${f.split("/").pop()}`);
  failed = true;
}
if (!failed) console.log("预算内 ✓");
process.exit(failed ? 1 : 0);
