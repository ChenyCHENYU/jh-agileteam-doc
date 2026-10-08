/**
 * 头像本地化（构建前钩子）
 * 用法：node scripts/localize-avatars.mjs
 *
 * 背景：dicebear CDN 国内访问慢/不稳（1-3s/张或超时失败），导致作者卡片
 * 与团队墙头像不显示或布局位移。头像 URL 由 seed 确定性生成，拉回本地
 * 静态托管即可：首次下载后缓存于 docs/public/avatars/，源文件中的 URL
 * 不会被改动（运行时由 404 兜底不可行，故直接重写源文件为本地路径）。
 *
 * 策略：本脚本只负责下载缺失的 SVG 到 public/avatars/（幂等）；
 * 源码 URL → 本地路径的重写由 --rewrite 参数一次性执行。
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "docs/public/avatars");
mkdirSync(outDir, { recursive: true });
const doRewrite = process.argv.includes("--rewrite");

// 1) 扫描源码中的所有 dicebear URL
const urls = new Set();
function walk(dir, cb) {
  for (const name of readdirSync(dir)) {
    // 注意：.vitepress 必须进入（头像数据都在 components/*/data.ts）
    if (name === "dist" || name === "node_modules" || name === "public") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, cb);
    else if (/\.(ts|vue|md)$/.test(name)) cb(p);
  }
}
const files = [];
walk(join(root, "docs"), (p) => {
  const s = readFileSync(p, "utf8");
  files.push(p);
  for (const m of s.matchAll(/https:\/\/api\.dicebear\.com[^\s"'`)]+/g)) urls.add(m[0]);
});

console.log(`dicebear URL：${urls.size} 个`);

// 2) 下载缺失的（幂等，已有则跳过）
let downloaded = 0;
let failed = 0;
const localMap = new Map(); // url -> /avatars/xxx.svg
for (const url of urls) {
  const hash = createHash("md5").update(url).digest("hex").slice(0, 12);
  const name = `d8-${hash}.svg`;
  const file = join(outDir, name);
  localMap.set(url, `/avatars/${name}`);
  if (existsSync(file)) continue;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const svg = await res.text();
    if (!svg.startsWith("<svg")) throw new Error("not svg");
    writeFileSync(file, svg);
    downloaded++;
  } catch (err) {
    failed++;
    console.warn(`  ⚠ 下载失败（跳过，保持 CDN）：${url.slice(0, 80)} ${err.message}`);
  }
}
console.log(`下载 ${downloaded} 个，失败 ${failed} 个`);

// 3) 可选：重写源码为本地路径
if (doRewrite) {
  let rewritten = 0;
  for (const p of files) {
    let s = readFileSync(p, "utf8");
    const orig = s;
    for (const [url, local] of localMap) {
      if (failed && !existsSync(join(root, "docs/public", local))) continue; // 失败的保留 CDN
      s = s.split(url).join(local);
    }
    if (s !== orig) {
      writeFileSync(p, s);
      rewritten++;
    }
  }
  console.log(`重写源文件：${rewritten} 个`);
}
