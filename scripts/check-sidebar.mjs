/**
 * 导航链接 + 孤儿页全量校验
 * 用法：node scripts/check-sidebar.mjs
 * 已挂入 build 前钩子：
 *   1. sidebar.ts / nav.ts 中 link 指向不存在的页面 → 构建失败
 *      （nav.ts 中的链接不在 VitePress 死链检查范围内，必须在此拦截）
 *   2. 存在 md 页面既无 sidebar 入口也无 nav 入口（孤儿页）→ 构建失败
 *      豁免：首页 / 404 / 带 robots noindex 的迁移墓碑页
 *
 * 规则：link 以 "/" 开头时，去掉 # 锚点后须能解析到 docs 下真实文件：
 *   /xxx/     -> docs/xxx/index.md
 *   /xxx/yyy  -> docs/xxx/yyy.md 或 docs/xxx/yyy/index.md
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { walkFiles } from "./lib/walk-files.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const docsRoot = join(root, "docs");
const configDir = join(root, "docs/.vitepress/config");

// ---------- 1. 提取 sidebar.ts + nav.ts 全部 link ----------
const linkRegex = /link:\s*"([^"]+)"/g;
const links = [
  ...readFileSync(join(configDir, "sidebar.ts"), "utf8").matchAll(linkRegex),
  ...readFileSync(join(configDir, "nav.ts"), "utf8").matchAll(linkRegex),
].map((m) => m[1]);

const missing = [];
const registered = new Set(); // 站内可达路径集合（去锚点、去尾斜杠）

for (const link of new Set(links)) {
  if (/^https?:/.test(link) || link === "") continue;
  const clean = link.split("#")[0].replace(/\/$/, "");
  if (clean.includes("#") || !clean) {
    if (clean) registered.add(clean); // 纯锚点链接（如 troubleshooting 目录内跳转）
    if (!clean) registered.add("/"); // 首页
    continue;
  }
  registered.add(clean);
  const asIndex = join(docsRoot, clean, "index.md");
  const asFile = join(docsRoot, clean + ".md");
  if (!existsSync(asIndex) && !existsSync(asFile)) {
    missing.push(link);
  }
}

// ---------- 2. 孤儿页检测 ----------

const orphans = [];
for (const file of walkFiles(docsRoot, { test: (n) => n.endsWith(".md") })) {
  const rel = file.slice(docsRoot.length + 1);
  if (rel === "index.md" || rel === "404.md") continue; // 首页 / 404 豁免
  const txt = readFileSync(file, "utf8");
  const isNoindex =
    txt.startsWith("---") && /name:\s*robots[\s\S]{0,80}?content:\s*noindex/.test(txt);
  if (isNoindex) continue; // 迁移墓碑页豁免
  const sitePath = ("/" + rel.replace(/\.md$/, "").replace(/\/index$/, "")).replace(/\/$/, "");
  // 目录内锚点链接（/xxx/#锚）已把 /xxx 计入 registered，父级覆盖子目录 index
  if (!registered.has(sitePath) && !registered.has(sitePath.replace(/\/index$/, ""))) {
    orphans.push(rel);
  }
}

// ---------- 3. 输出 ----------
console.log(`导航链接总数（去重）：${new Set(links).size}`);
if (missing.length) {
  console.error("失效链接：");
  missing.forEach((l) => console.error("  ✗", l));
}
if (orphans.length) {
  console.error("孤儿页（无 sidebar/nav 入口，请登记 sidebar.ts 或加 noindex）：");
  orphans.forEach((p) => console.error("  ✗", p));
}
if (missing.length || orphans.length) process.exit(1);
console.log("链接全部有效，无孤儿页 ✓");
