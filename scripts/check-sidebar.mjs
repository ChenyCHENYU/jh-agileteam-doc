/**
 * sidebar 链接全量校验
 * 用法：node scripts/check-sidebar.mjs
 * 已挂入 build 前钩子：导航指向不存在的页面将直接构建失败。
 *
 * 规则：link 以 "/" 开头时，去掉 # 锚点后须能解析到 docs 下真实文件：
 *   /xxx/     -> docs/xxx/index.md
 *   /xxx/yyy  -> docs/xxx/yyy.md 或 docs/xxx/yyy/index.md
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sidebarSrc = readFileSync(join(root, "docs/.vitepress/config/sidebar.ts"), "utf8");

const links = [...sidebarSrc.matchAll(/link:\s*"([^"]+)"/g)].map((m) => m[1]);
const docsRoot = join(root, "docs");
const missing = [];

for (const link of new Set(links)) {
  if (/^https?:/.test(link) || link === "" || link.includes("#")) continue;
  const clean = link.replace(/\/$/, "");
  if (!clean) continue; // 首页
  const asIndex = join(docsRoot, clean, "index.md");
  const asFile = join(docsRoot, clean + ".md");
  if (!existsSync(asIndex) && !existsSync(asFile)) {
    missing.push(link);
  }
}

console.log(`sidebar 链接总数（去重）：${new Set(links).size}`);
if (missing.length) {
  console.error("失效链接：");
  missing.forEach((l) => console.error("  ✗", l));
  process.exit(1);
}
console.log("全部有效 ✓");
