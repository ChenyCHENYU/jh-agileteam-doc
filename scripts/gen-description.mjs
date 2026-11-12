/**
 * 页面 description 批量生成（一次性工具，也可重复执行——已有 description 的页面跳过）
 * 用法：node scripts/gen-description.mjs
 *
 * 规则：取每页首个 blockquote 或首个纯文本段落（≤90 字）作为摘要，
 * 写入 frontmatter description；纯组件页/无合适文本页跳过。
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { walkFiles } from "./lib/walk-files.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const docsRoot = join(root, "docs");


function extractBodyDescription(body) {
  const lines = body.split("\n");
  let inCode = false;
  let paragraph = [];
  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    const t = line.trim();
    if (!t) {
      if (paragraph.length) break;
      continue;
    }
    if (t.startsWith("#")) continue; // 标题
    if (t.startsWith("<")) return null; // 组件/HTML 开头，无可靠摘要
    // blockquote：取其内容
    if (t.startsWith(">")) {
      const q = t.replace(/^>\s?/, "");
      if (q) paragraph.push(q);
      continue;
    }
    paragraph.push(t);
    if (paragraph.join("").length > 120) break;
  }
  const text = paragraph
    .join("")
    .replace(/[*`_\[\]()#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length < 8) return null;
  return text.slice(0, 88) + (text.length > 88 ? "…" : "");
}

let added = 0;
let skipped = 0;
for (const file of walkFiles(docsRoot, { test: (n) => n.endsWith(".md") })) {
  const raw = readFileSync(file, "utf8");
  if (raw.startsWith("---")) {
    const end = raw.indexOf("\n---", 3);
    if (end > 0 && /(^|\n)description:/.test(raw.slice(0, end))) continue; // 已有
  }
  let fm = "";
  let body = raw;
  if (raw.startsWith("---")) {
    const end = raw.indexOf("\n---", 3);
    if (end > 0) {
      fm = raw.slice(0, end + 4);
      body = raw.slice(end + 4).replace(/^\n+/, "");
    }
  }
  const desc = extractBodyDescription(body);
  if (!desc) {
    skipped++;
    continue;
  }
  const descLine = `description: "${desc.replace(/"/g, "'")}"\n`;
  if (fm) {
    const next = fm.replace(/^---\n/, `---\n${descLine}`);
    // frontmatter 闭合 --- 与正文之间必须留空行，否则 H1 会粘连在定界符上
    writeFileSync(file, `${next}\n\n${body}`);
  } else {
    writeFileSync(file, `---\n${descLine}---\n\n${body}`);
  }
  added++;
}

console.log(`description 生成：${added} 页，跳过 ${skipped} 页（组件页/无摘要）`);
