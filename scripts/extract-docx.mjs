/**
 * docx 图文映射提取脚本
 * 用法: node scripts/extract-docx.mjs <docx文件路径>
 * 输出: docs/.docx-image-map.json（图文流 + 模块归属）
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const docxPath = process.argv[2];
if (!docxPath || !existsSync(docxPath)) {
  console.error('用法: node extract-docx.mjs <docx文件路径>');
  process.exit(1);
}

// 1. 解压 docx 到临时目录
const extractDir = join(tmpdir(), 'kilo', 'docx-extract-' + Date.now());
execSync(`powershell -Command "New-Item -ItemType Directory -Path '${extractDir}' -Force | Out-Null"`);
execSync(
  `powershell -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::ExtractToDirectory('${docxPath.replace(/\\/g, '\\\\')}', '${extractDir.replace(/\\/g, '\\\\')}')"`,
);

const xmlPath = join(extractDir, 'word', 'document.xml');
const relsPath = join(extractDir, 'word', '_rels', 'document.xml.rels');

if (!existsSync(xmlPath)) {
  console.error('找不到 document.xml');
  process.exit(1);
}

const xml = readFileSync(xmlPath, 'utf-8');
const rels = readFileSync(relsPath, 'utf-8');

// 2. 构建 rId → imageFile 映射
const relMap = {};
const relRegex = /Id="(rId\d+)"[^>]*Target="(media\/[^"]+)"/g;
let m;
while ((m = relRegex.exec(rels)) !== null) {
  relMap[m[1]] = m[2];
}
console.log(`rels 图片映射: ${Object.keys(relMap).length} 条`);

// 3. 按顺序解析段落（<w:p>...</w:p>）
// 每个段落提取: pStyle、文字(合并所有 w:t)、图片 rId 列表
const paragraphs = [];
const pRegex = /<w:p\b[\s>]/g;
const pCloseRegex = /<\/w:p>/g;
const positions = [];
let pm;
while ((pm = pRegex.exec(xml)) !== null) {
  positions.push(pm.index);
}
let closeIdx = 0;
for (let i = 0; i < positions.length; i++) {
  const start = positions[i];
  let end = xml.indexOf('</w:p>', start);
  if (end === -1) continue;
  const block = xml.slice(start, end);

  // 提取 pStyle
  let style = null;
  const styleMatch = block.match(/<w:pStyle\s+w:val="([^"]+)"/);
  if (styleMatch) style = styleMatch[1];

  // 提取文字（合并所有 w:t，去掉标签）
  const texts = [];
  const tRegex = /<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g;
  let tm;
  while ((tm = tRegex.exec(block)) !== null) {
    texts.push(tm[1]);
  }
  const text = texts.join('').trim();

  // 提取图片 embed (r:embed="rIdX")
  const images = [];
  const embedRegex = /r:embed="(rId\d+)"/g;
  let em;
  while ((em = embedRegex.exec(block)) !== null) {
    if (relMap[em[1]]) images.push(relMap[em[1]]);
  }

  // 只有有内容（文字或图片）的段落才记录
  if (text || images.length > 0) {
    paragraphs.push({ style, text, images });
  }
}

console.log(`有效段落: ${paragraphs.length}`);

// 4. 样式统计（识别标题样式）
const styleCount = {};
for (const p of paragraphs) {
  if (p.style) {
    styleCount[p.style] = (styleCount[p.style] || 0) + 1;
  }
}
console.log('\n样式分布:');
for (const [s, c] of Object.entries(styleCount).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${s}: ${c} 个段落`);
}

// 5. 图片总数
const totalImages = paragraphs.reduce((sum, p) => sum + p.images.length, 0);
console.log(`\n图片引用总数: ${totalImages}`);

// 6. 输出图文流摘要（前 40 条有图或有标题的段落）
console.log('\n===== 图文流摘要（标题 + 图片位置，前 40 条）=====');
let shown = 0;
for (const p of paragraphs) {
  if (p.images.length > 0 || (p.style && p.text)) {
    const imgStr = p.images.length > 0 ? ` 【图:${p.images.join(',')}】` : '';
    const styleStr = p.style ? `[${p.style}] ` : '';
    const preview = p.text.length > 50 ? p.text.slice(0, 50) + '...' : p.text;
    console.log(`  ${styleStr}${preview || '(无文字)'}${imgStr}`);
    shown++;
    if (shown >= 40) break;
  }
}

// 7. 保存完整映射 JSON
const output = {
  extractedAt: new Date().toISOString(),
  docxPath,
  totalParagraphs: paragraphs.length,
  totalImages,
  relMap,
  styleCount,
  paragraphs,
};
const outPath = join(process.cwd(), 'docs', '.docx-image-map.json');
writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf-8');
console.log(`\n完整映射已保存: ${outPath}`);
