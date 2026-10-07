/**
 * 兜底版本漂移哨兵（仅告警，不阻断）
 * 用法：node scripts/check-fallback.mjs [--strict]
 *
 * 扫描 md 中 <NpmVersion fallback="..."> 与组件数据源的静态 version，
 * 对比 npm registry 实际版本序列：兜底值落后 ≥5 个版本时告警，
 * 提示更新 fallback（兜底值只影响断网/首屏，落太多版本仍值得跟进）。
 * --strict 时落后即退出 1（CI 可选用）。
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const strict = process.argv.includes("--strict");
const THRESHOLD = 5;

// 1) 收集所有 (pkg, fallback) 对
const pairs = new Map(); // pkg -> Set(fallback)
function collect(pkg, fallback) {
  if (!pkg || !fallback) return;
  if (!pairs.has(pkg)) pairs.set(pkg, new Set());
  pairs.get(pkg).add(fallback);
}
function scanText(txt, rel) {
  for (const m of txt.matchAll(/<NpmVersion\s+pkg="([^"]+)"\s+fallback="([^"]+)"/g)) {
    collect(m[1], m[2]);
  }
}
function walk(dir, cb) {
  for (const name of readdirSync(dir)) {
    if (name === "dist" || name === "node_modules" || name.startsWith(".")) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, cb);
    else if (/\.(md|ts|vue)$/.test(name)) cb(p);
  }
}
walk(join(root, "docs"), (p) => scanText(readFileSync(p, "utf8"), p));
// 组件数据源的静态 version（EcosystemTable / PackagesTable）
{
  const eco = readFileSync(join(root, "docs/.vitepress/components/EcosystemTable/data.ts"), "utf8");
  for (const m of eco.matchAll(/name:\s*"(@[^"]+)":[\s\S]{0,120}?version:\s*"([^"]+)"/g)) collect(m[1], m[2]);
  const pkgs = readFileSync(join(root, "docs/.vitepress/components/PackagesTable/data.ts"), "utf8");
  for (const m of pkgs.matchAll(/"wl-skills-(\w+)"[\s\S]{0,400}?version:\s*"([^"]+)"/g)) collect(`@agile-team/wl-skills-${m[1]}`, m[2]);
}

// 2) 对比 registry
let stale = 0;
const report = [];
await Promise.all(
  [...pairs.entries()].map(async ([pkg, fallbacks]) => {
    try {
      const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(pkg)}`, {
        headers: { Accept: "application/vnd.npm.install-v1+json" },
      });
      if (!res.ok) return;
      const versions = Object.keys((await res.json()).versions || {});
      const latest = versions[versions.length - 1];
      for (const fb of fallbacks) {
        if (fb === "—" || !/^\d/.test(fb)) continue;
        const idx = versions.indexOf(fb);
        const behind = idx === -1 ? null : versions.length - 1 - idx;
        if (behind === null || behind >= THRESHOLD) {
          stale++;
          report.push(`  ⚠ ${pkg} 兜底 ${fb}（${behind === null ? "未在版本序列中" : `落后 ${behind} 版`}，最新 ${latest}）`);
        }
      }
    } catch {
      /* registry 不可达时静默跳过 */
    }
  })
);

console.log(`兜底版本哨兵：${pairs.size} 个包受检`);
if (stale) {
  console.log("落后较多，建议更新 fallback：");
  report.forEach((r) => console.log(r));
  if (strict) process.exit(1);
} else {
  console.log("兜底值均新鲜 ✓");
}
