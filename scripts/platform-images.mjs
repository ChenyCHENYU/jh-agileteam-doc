/**
 * 平台手册图片 — 端到端处理脚本
 *
 * 功能：docx 提取 → 按模块归类命名 → 断点续传上传 OSS → md 精确插入
 *
 * 用法:
 *   OSS_AK_ID=xxx OSS_AK_SECRET=xxx \
 *   node scripts/platform-images.mjs \
 *     --docx "路径/手册.docx" \
 *     --step upload          # 只上传
 *     --step insert          # 只插入 md
 *     --step all             # 全部（默认）
 *
 * 环境变量:
 *   OSS_AK_ID / OSS_AK_SECRET （upload/all 时必需）
 *
 * 断点续传:
 *   上传清单保存在 docs/.platform-image-manifest.json
 *   重跑时已上传的自动跳过
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { createHmac } from 'node:crypto';
import { request as httpsRequest } from 'node:https';

// ── 参数 ────────────────────────────────────────
const args = process.argv.slice(2);
const get = (k, d) => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 ? args[i + 1] : d;
};
const DOCX = get('docx');
const STEP = get('step', 'all');
const BUCKET = 'cheny-chenyu';
const REGION = 'oss-cn-chengdu';
const OSS_PREFIX = 'jh/platform';
const BASE_URL = `https://${BUCKET}.${REGION}.aliyuncs.com/${OSS_PREFIX}`;
const AK_ID = process.env.OSS_AK_ID;
const AK_SECRET = process.env.OSS_AK_SECRET;
const DOCS_DIR = join(process.cwd(), 'docs');
const MANIFEST_PATH = join(DOCS_DIR, '.platform-image-manifest.json');

if (!DOCX) {
  console.error('用法: node platform-images.mjs --docx <路径> [--step upload|insert|all]');
  process.exit(1);
}

// ── 模块定义（按文档顺序，与 md 文件名一致）─────────
const MODULES = [
  { name: '快速搭建', file: 'quick-start' },
  { name: '基础服务', file: 'base-services' },
  { name: '公共配置', file: 'common-config' },
  { name: '权限管理', file: 'permission' },
  { name: '菜单配置', file: 'menu-config' },
  { name: '通知中心', file: 'notification' },
  { name: '流程管理', file: 'workflow' },
  { name: '人事管理', file: 'hr' },
  { name: '模型设计', file: 'model-design' },
  { name: '页面设计', file: 'page-design' },
  { name: '门户页设计', file: 'portal-design' },
  { name: '可视化大屏', file: 'dashboard' },
  { name: '接口管理', file: 'api-management' },
  { name: '日志监控', file: 'log-monitor' },
  { name: '文件服务', file: 'file-service' },
  { name: '低代码应用市场', file: 'app-market' },
  { name: '资源管理', file: 'resource' },
  { name: 'AI助手', file: 'ai-assistant' },
  { name: '新特性', file: 'whats-new' },
];

// ── MIME ────────────────────────────────────────
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp' };

// ── Manifest（断点续传）──────────────────────────
function loadManifest() {
  if (existsSync(MANIFEST_PATH)) {
    return JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'));
  }
  return { uploaded: {} }; // { "image4.png": { module, ossKey, url, uploadedAt } }
}
function saveManifest(m) {
  writeFileSync(MANIFEST_PATH, JSON.stringify(m, null, 2), 'utf-8');
}

// ── 解压 docx ──────────────────────────────────
function extractDocx(docxPath) {
  const dir = join(tmpdir(), 'kilo', 'docx-platform-' + Date.now());
  execSync(`powershell -NoProfile -Command "New-Item -ItemType Directory -Path '${dir.replace(/\\/g, '\\\\')}' -Force | Out-Null"`);
  execSync(
    `powershell -NoProfile -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::ExtractToDirectory('${docxPath.replace(/\\/g, '\\\\')}', '${dir.replace(/\\/g, '\\\\')}')"`,
  );
  return dir;
}

// ── 解析图文流 ──────────────────────────────────
function parseDocx(extractDir) {
  const xml = readFileSync(join(extractDir, 'word', 'document.xml'), 'utf-8');
  const rels = readFileSync(join(extractDir, 'word', '_rels', 'document.xml.rels'), 'utf-8');

  // rId → imageFile
  const relMap = {};
  for (const m of rels.matchAll(/Id="(rId\d+)"[^>]*Target="(media\/[^"]+)"/g)) {
    relMap[m[1]] = m[2];
  }

  // 段落解析
  const paragraphs = [];
  let lastEnd = 0;
  for (const pm of xml.matchAll(/<w:p\b[\s>]/g)) {
    const start = pm.index;
    if (start < lastEnd) continue;
    const end = xml.indexOf('</w:p>', start);
    if (end === -1) break;
    lastEnd = end;
    const block = xml.slice(start, end);

    const text = (block.match(/<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g) || [])
      .map((t) => t.replace(/<[^>]+>/g, ''))
      .join('')
      .trim();

    const images = [];
    for (const em of block.matchAll(/r:embed="(rId\d+)"/g)) {
      if (relMap[em[1]]) images.push(relMap[em[1]]);
    }
    if (text || images.length) paragraphs.push({ text, images });
  }
  return { paragraphs, extractDir };
}

// ── 按模块边界分配图片 ──────────────────────────
function assignImages(paragraphs) {
  // 顺序搜索模块边界
  let searchFrom = 100;
  const bounds = [];
  for (const mod of MODULES) {
    let idx = -1;
    for (let i = searchFrom; i < paragraphs.length; i++) {
      if (paragraphs[i].text === mod.name) {
        idx = i;
        break;
      }
    }
    if (idx >= 0) {
      bounds.push({ ...mod, idx });
      searchFrom = idx + 1;
    }
  }

  // 每张图分配到所属模块 + 模块内序号 + 上下文文字
  const imageList = [];
  for (let bi = 0; bi < bounds.length; bi++) {
    const start = bounds[bi].idx;
    const end = bi < bounds.length - 1 ? bounds[bi + 1].idx : paragraphs.length;
    let seq = 0;
    for (let i = start; i < end; i++) {
      for (const img of paragraphs[i].images) {
        seq++;
        // 找前文和后文
        let before = '';
        for (let j = i - 1; j >= 0 && j > i - 6; j--) {
          if (paragraphs[j].text) {
            before = paragraphs[j].text;
            break;
          }
        }
        let after = '';
        for (let j = i + 1; j < paragraphs.length && j < i + 6; j++) {
          if (paragraphs[j].text) {
            after = paragraphs[j].text;
            break;
          }
        }
        imageList.push({
          sourceFile: img, // media/image4.png
          module: bounds[bi].file,
          moduleSeq: seq,
          before,
          after,
        });
      }
    }
  }
  return imageList;
}

// ── OSS HEAD 检查是否已存在 ──────────────────────
function ossExists(key) {
  return new Promise((resolve) => {
    const host = `${BUCKET}.${REGION}.aliyuncs.com`;
    const date = new Date().toUTCString();
    const stringToSign = `HEAD\n\n\n${date}\n/${BUCKET}/${key}`;
    const signature = createHmac('sha1', AK_SECRET).update(stringToSign).digest('base64');
    const req = httpsRequest(
      {
        hostname: host,
        path: '/' + key,
        method: 'HEAD',
        headers: { Date: date, Authorization: `OSS ${AK_ID}:${signature}` },
      },
      (res) => {
        res.resume();
        resolve(res.statusCode === 200);
      },
    );
    req.on('error', () => resolve(false));
    req.end();
  });
}

// ── OSS PUT 上传 ────────────────────────────────
function ossPut(key, filePath, contentType) {
  return new Promise((resolve, reject) => {
    const body = readFileSync(filePath);
    const date = new Date().toUTCString();
    const stringToSign = `PUT\n\n${contentType}\n${date}\n/${BUCKET}/${key}`;
    const signature = createHmac('sha1', AK_SECRET).update(stringToSign).digest('base64');
    const host = `${BUCKET}.${REGION}.aliyuncs.com`;
    const req = httpsRequest(
      {
        hostname: host,
        path: '/' + key,
        method: 'PUT',
        headers: {
          'Content-Type': contentType,
          Date: date,
          Authorization: `OSS ${AK_ID}:${signature}`,
          'Content-Length': body.length,
        },
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          if (res.statusCode === 200) resolve({ url: `https://${host}/${key}`, size: body.length });
          else reject(new Error(`HTTP ${res.statusCode}`));
        });
      },
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Step 1: 上传 ────────────────────────────────
async function doUpload(imageList, extractDir) {
  if (!AK_ID || !AK_SECRET) {
    console.error('需要 OSS_AK_ID 和 OSS_AK_SECRET');
    process.exit(1);
  }
  const manifest = loadManifest();
  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < imageList.length; i++) {
    const img = imageList[i];
    const ossName = String(img.moduleSeq).padStart(2, '0') + '.' + img.sourceFile.split('.').pop();
    const ossKey = `${OSS_PREFIX}/${img.module}/${ossName}`;

    // 1) Manifest 已记录 → 跳过
    if (manifest.uploaded[img.sourceFile]) {
      skipped++;
      continue;
    }

    // 2) OSS HEAD 检查是否已存在（防重复）
    const exists = await ossExists(ossKey);
    if (exists) {
      manifest.uploaded[img.sourceFile] = {
        module: img.module,
        ossKey,
        url: `${BASE_URL}/${img.module}/${ossName}`,
        uploadedAt: new Date().toISOString(),
      };
      saveManifest(manifest);
      skipped++;
      console.log(`  [${i + 1}/${imageList.length}] ⊙ 跳过(已存在) ${img.module}/${ossName}`);
      continue;
    }

    // 3) 上传
    const localPath = join(extractDir, 'word', img.sourceFile);
    const mime = MIME['.' + img.sourceFile.split('.').pop()] || 'image/png';
    try {
      const res = await ossPut(ossKey, localPath, mime);
      manifest.uploaded[img.sourceFile] = {
        module: img.module,
        ossKey,
        url: res.url,
        uploadedAt: new Date().toISOString(),
      };
      saveManifest(manifest);
      uploaded++;
      console.log(`  [${i + 1}/${imageList.length}] ✓ ${img.module}/${ossName} (${(res.size / 1024).toFixed(0)}KB)`);
    } catch (e) {
      failed++;
      console.error(`  [${i + 1}/${imageList.length}] ✗ ${img.module}/${ossName}: ${e.message}`);
    }

    // 限速
    await new Promise((r) => setTimeout(r, 80));
  }

  console.log(`\n上传完成: ${uploaded} 新传, ${skipped} 跳过, ${failed} 失败`);
  return manifest;
}

// ── Step 2: md 插入 ─────────────────────────────
function doInsert(imageList, manifest) {
  // 按模块分组
  const byModule = {};
  for (const img of imageList) {
    const entry = manifest.uploaded[img.sourceFile];
    if (!entry) continue;
    if (!byModule[img.module]) byModule[img.module] = [];
    byModule[img.module].push(img);
  }

  let inserted = 0;
  let skipped = 0;

  for (const [modFile, imgs] of Object.entries(byModule)) {
    const mdPath = join(DOCS_DIR, 'platform', modFile + '.md');
    if (!existsSync(mdPath)) {
      console.log(`  ⚠ ${modFile}.md 不存在，跳过 ${imgs.length} 张图`);
      skipped += imgs.length;
      continue;
    }
    let content = readFileSync(mdPath, 'utf-8');

    // 检查是否已插入过（防止重复）
    const hasImages = content.includes(`${BASE_URL}/${modFile}/`);
    if (hasImages) {
      console.log(`  ⊙ ${modFile}.md 已含图片，跳过（如需重插请先移除）`);
      skipped += imgs.length;
      continue;
    }

    for (const img of imgs) {
      const entry = manifest.uploaded[img.sourceFile];
      if (!entry) continue;
      const ossName = String(img.moduleSeq).padStart(2, '0') + '.' + img.sourceFile.split('.').pop();
      const url = `${BASE_URL}/${modFile}/${ossName}`;

      // 构造 alt 文字（取后文或前文片段）
      const alt = img.after || img.before || '截图';
      const altText = alt.length > 30 ? alt.slice(0, 30) + '...' : alt;

      // 定位插入点：在包含 before/after 关键字的行后插入
      const imgMd = `\n![${altText}](${url})\n`;
      let insertPos = -1;

      // 优先用 after 文字定位（图片后面跟着的文字）
      if (img.after) {
        const searchKey = img.after.slice(0, Math.min(img.after.length, 20));
        const lines = content.split('\n');
        for (let li = 0; li < lines.length; li++) {
          if (lines[li].includes(searchKey)) {
            insertPos = content.indexOf(lines[li]);
            // 插在包含 searchKey 的行之前
            content = content.slice(0, insertPos) + imgMd + content.slice(insertPos);
            inserted++;
            insertPos = -2; // 标记已插入
            break;
          }
        }
      }

      // after 找不到 → 用 before 文字定位（插在该行后）
      if (insertPos === -1 && img.before) {
        const searchKey = img.before.slice(0, Math.min(img.before.length, 20));
        const lines = content.split('\n');
        for (let li = 0; li < lines.length; li++) {
          if (lines[li].includes(searchKey)) {
            const lineEnd = content.indexOf(lines[li]) + lines[li].length;
            content = content.slice(0, lineEnd) + imgMd + content.slice(lineEnd);
            inserted++;
            insertPos = -2;
            break;
          }
        }
      }

      // 都找不到 → 追加到模块末尾
      if (insertPos === -1) {
        content = content.replace(/\n*$/, '') + '\n' + imgMd;
        inserted++;
      }
    }

    writeFileSync(mdPath, content, 'utf-8');
    console.log(`  ✓ ${modFile}.md 插入 ${imgs.length} 张图`);
  }

  console.log(`\nmd 插入完成: ${inserted} 张插入, ${skipped} 张跳过`);
}

// ── 主流程 ─────────────────────────────────────
async function main() {
  console.log('=== 平台手册图片处理 ===\n');
  console.log('Step 0: 解压 docx...');
  const extractDir = extractDocx(DOCX);
  console.log(`  解压到: ${extractDir}`);

  console.log('\nStep 0: 解析图文流...');
  const { paragraphs } = parseDocx(extractDir);
  console.log(`  段落数: ${paragraphs.length}`);

  console.log('\nStep 0: 按模块分配图片...');
  const imageList = assignImages(paragraphs);
  console.log(`  图片总数: ${imageList.length}`);
  const byMod = {};
  for (const img of imageList) byMod[img.module] = (byMod[img.module] || 0) + 1;
  for (const [m, c] of Object.entries(byMod)) console.log(`    ${m}: ${c} 张`);

  if (STEP === 'upload' || STEP === 'all') {
    console.log('\n=== Step 1: 上传 OSS ===\n');
    const manifest = await doUpload(imageList, extractDir);
    if (STEP === 'upload') {
      console.log(`\nManifest: ${MANIFEST_PATH}`);
      return;
    }

    console.log('\n=== Step 2: md 插入 ===\n');
    doInsert(imageList, manifest);
  } else if (STEP === 'insert') {
    console.log('\n=== Step 2: md 插入 ===\n');
    const manifest = loadManifest();
    doInsert(imageList, manifest);
  }

  console.log('\n=== 完成 ===');
}

main().catch((e) => {
  console.error('执行失败:', e);
  process.exit(1);
});
