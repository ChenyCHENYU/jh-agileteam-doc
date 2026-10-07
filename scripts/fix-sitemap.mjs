/**
 * sitemap 净化（build 后钩子）
 * 用法：node scripts/fix-sitemap.mjs
 *
 * 背景：迁移桩页已加 noindex，但 VitePress 生成的 sitemap.xml 仍包含它们，
 * 与 noindex 语义自相矛盾。本脚本从 sitemap 中剔除所有带
 * `robots: noindex` frontmatter 的页面。
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sitemapPath = join(root, "docs/.vitepress/dist/sitemap.xml");
const docsRoot = join(root, "docs");

if (!existsSync(sitemapPath)) {
  console.log("sitemap.xml 不存在，跳过");
  process.exit(0);
}

// 1) 找出所有 noindex 源页 → URL 路径集合
const noindexPaths = new Set();
function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name === "dist" || name === "node_modules" || name.startsWith(".")) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith(".md")) {
      const txt = readFileSync(p, "utf8");
      if (txt.startsWith("---") && /name:\s*robots[\s\S]{0,80}?content:\s*noindex/.test(txt)) {
        const url = "/" + p.slice(docsRoot.length + 1).replace(/\.md$/, "").replace(/\/index$/, "/");
        noindexPaths.add(url.replace(/\/$/, ""));
      }
    }
  }
}
walk(docsRoot);

// 2) 从 sitemap 剔除
const xml = readFileSync(sitemapPath, "utf8");
const before = (xml.match(/<loc>/g) || []).length;
let removed = 0;
const cleaned = xml.replace(/<url>[\s\S]*?<\/url>\n?/g, (block) => {
  const loc = (block.match(/<loc>([^<]+)<\/loc>/) || [])[1] || "";
  const path = new URL(loc).pathname.replace(/\/$/, "").replace(/\.html$/, "");
  if ([...noindexPaths].some((np) => path === np || path.startsWith(np + "/"))) {
    removed++;
    return "";
  }
  return block;
});
writeFileSync(sitemapPath, cleaned);
console.log(`sitemap：${before} 条 → ${before - removed} 条（剔除 noindex 页 ${removed} 条）`);
