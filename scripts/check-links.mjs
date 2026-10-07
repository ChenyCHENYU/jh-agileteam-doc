/**
 * 站内链接全量校验
 * 用法：node scripts/check-links.mjs
 * 已挂入 build 前钩子：正文中的站内相对链接（侧边栏/锚点之外的盲区）
 * 指向不存在的页面将构建失败。
 *
 * 规则：markdown 链接目标以 "/" 开头按站内绝对路径解析，
 * 以 "./" "../" 开头按相对当前文件解析；忽略外链/锚点/图片/代码块。
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { dirname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const docsRoot = join(root, "docs");

function walkMd(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (name === "dist" || name === "node_modules" || name.startsWith(".")) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkMd(p, acc);
    else if (name.endsWith(".md")) acc.push(p);
  }
  return acc;
}

const MD_LINK = /(?<!!)\[[^\]]*\]\(([^)]+)\)/g;
const files = walkMd(docsRoot);
const missing = [];
let total = 0;

for (const file of files) {
  const rel = file.slice(docsRoot.length + 1);
  const lines = readFileSync(file, "utf8").split("\n");
  let inCode = false;
  let lineNo = 0;
  for (const line of lines) {
    lineNo++;
    if (line.trim().startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    // 剥离行内代码（`...`），避免把语法示例当真实链接
    const codeStripped = line.replace(/`[^`]*`/g, "");
    for (const m of codeStripped.matchAll(MD_LINK)) {
      let target = m[1].trim();
      if (/^(https?:|mailto:|#|tel:)/i.test(target)) continue;
      target = target.split("#")[0]; // 去锚点（锚点由 check-anchors 负责）
      if (!target) continue;
      if (!/^\//.test(target)) target = resolve(dirname(file), target); // 相对路径
      const clean = target.replace(/\/$/, "");
      const candidates =
        clean.startsWith(docsRoot)
          ? [clean + ".md", join(clean, "index.md")]
          : [join(docsRoot, clean + ".md"), join(docsRoot, clean, "index.md")];
      total++;
      if (!candidates.some((c) => existsSync(normalize(c)))) {
        missing.push(`${rel}:${lineNo}  ${m[1].slice(0, 80)}`);
      }
    }
  }
}

console.log(`正文站内链接总数：${total}`);
if (missing.length) {
  console.error("失效链接：");
  missing.forEach((l) => console.error("  ✗", l));
  process.exit(1);
}
console.log("全部有效 ✓");
