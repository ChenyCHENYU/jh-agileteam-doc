/**
 * Markdown 锚点校验（构建后运行，基于 dist 实际渲染的 heading id——不猜测 slug 规则）
 * 用法：node scripts/check-anchors.mjs（需先完成 vitepress build）
 * 已挂入 build 后钩子。
 *
 * 校验对象：docs 目录全部 md 中指向站内页面的锚点链接（含 /path#锚 与 #锚 两种）。
 * 解析方式：把源 md 的锚点映射到对应 dist html 中的 id 集合，锚点不存在即报错。
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const docsDir = join(root, "docs");
const distDir = join(root, "docs/.vitepress/dist");
const base = "/"; // 站点 base

const mdFiles = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === "node_modules" || name === ".vitepress") continue;
      walk(p);
    } else if (name.endsWith(".md")) mdFiles.push(p);
  }
})(docsDir);

/** md 路径 -> dist html 路径（index.md -> 目录/index.html；foo.md -> foo.html） */
function distHtmlFor(mdPath) {
  const rel = relative(docsDir, mdPath).replace(/\\/g, "/");
  if (rel === "index.md") return join(distDir, "index.html");
  if (rel.endsWith("/index.md")) return join(distDir, rel.slice(0, -"index.md".length), "index.html");
  return join(distDir, rel.slice(0, -3) + ".html");
}

const idsCache = new Map();
function headingIds(htmlPath) {
  if (idsCache.has(htmlPath)) return idsCache.get(htmlPath);
  let ids = null;
  if (existsSync(htmlPath)) {
    const html = readFileSync(htmlPath, "utf8");
    ids = new Set([...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]));
  }
  idsCache.set(htmlPath, ids);
  return ids;
}

const broken = [];
let checked = 0;

for (const md of mdFiles) {
  const src = readFileSync(md, "utf8");
  // 去掉代码块，避免误读示例中的链接
  const stripped = src.replace(/```[\s\S]*?```/g, "");
  for (const m of stripped.matchAll(/\[[^\]]*\]\(([^)]*#[^)]*)\)/g)) {
    const raw = m[1];
    if (/^(https?:|mailto:)/.test(raw)) continue;
    const hashIdx = raw.indexOf("#");
    const pathPart = raw.slice(0, hashIdx);
    const anchor = decodeURIComponent(raw.slice(hashIdx + 1));
    if (!anchor) continue;

    let targetMd = md;
    if (pathPart) {
      const clean = pathPart.replace(/\.md$/, "");
      const resolved = resolve(dirname(md), clean);
      targetMd = resolved.endsWith(".md") ? resolved : resolved + ".md";
      const asIndex = join(resolved, "index.md");
      if (!existsSync(targetMd) && existsSync(asIndex)) targetMd = asIndex;
      if (!existsSync(targetMd)) {
        // 以 / 开头的站内绝对路径
        const abs = join(docsDir, clean.replace(/^\//, ""));
        const absMd = abs.endsWith(".md") ? abs : abs + ".md";
        if (existsSync(absMd)) targetMd = absMd;
        else if (existsSync(join(abs, "index.md"))) targetMd = join(abs, "index.md");
        else continue; // 页面级死链由 vitepress 死链检查负责，这里跳过
      }
    }
    const html = distHtmlFor(targetMd);
    const ids = headingIds(html);
    if (!ids) continue; // 目标未构建（如 external），跳过
    checked++;
    if (!ids.has(anchor)) {
      broken.push(`${relative(root, md)} -> ${raw}`);
    }
  }
}

console.log(`锚点检查：${checked} 个站内锚点链接`);
if (broken.length) {
  console.error(`断锚 ${broken.length} 处：`);
  broken.forEach((b) => console.error("  ✗", b));
  process.exit(1);
}
console.log("全部有效 ✓");
