/**
 * 平台手册 md 重建脚本
 * 直接从 docx 段落流生成每个模块的 md，图片精确放置在原文位置
 *
 * 用法: node scripts/rebuild-platform-md.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const MAP_PATH = join(process.cwd(), 'docs', '.docx-image-map.json');
const OUT_DIR = join(process.cwd(), 'docs', 'platform');
const BASE_URL = 'https://cheny-chenyu.oss-cn-chengdu.aliyuncs.com/jh/platform';

const data = JSON.parse(readFileSync(MAP_PATH, 'utf-8'));
const ps = data.paragraphs;

// 模块定义（文档顺序）
const MODULES = [
  { name: '基础服务', file: 'base-services', title: '基础服务', intro: '平台的应用基础设施，包括微服务、云原生和 CICD。' },
  { name: '公共配置', file: 'common-config', title: '公共配置', intro: '低代码平台的公共配置包括数据字典、国际化配置、个性化配置及安全管理。' },
  { name: '权限管理', file: 'permission', title: '权限管理', intro: '平台权限管理包括角色管理、接口管理、客户端管理、数据权限管理及数据权限授权查询。' },
  { name: '菜单配置', file: 'menu-config', title: '菜单配置', intro: '菜单是平台内部进行功能管理的入口，包含领域管理、子系统管理、菜单管理和独立页面。' },
  { name: '通知中心', file: 'notification', title: '通知中心', intro: '通知中心服务名称为 JH4J-CODE-OAMS，提供消息推送端、系统通知模板、系统消息查询、消息发送等功能。' },
  { name: '人事管理', file: 'hr', title: '人事管理', intro: '人事管理包括用户管理、部门管理、公司管理、用户组管理、岗位管理和个人中心。' },
  { name: '模型设计', file: 'model-design', title: '模型设计', intro: '模型是一组图形化或可视化的接口，平台支持单表模型和多表模型两种设计模式。' },
  { name: '页面设计', file: 'page-design', title: '页面设计', intro: '页面设计器是低代码平台的核心可视化工具，通过拖拽组件、配置属性、绑定数据源来构建页面。' },
  { name: '门户页设计', file: 'portal-design', title: '门户页设计', intro: '门户页设计用于构建系统的首页门户，包括模板市场、门户组件和门户自定义。' },
  { name: '可视化大屏', file: 'dashboard', title: '可视化大屏', intro: '可视化大屏用于构建数据可视化展示页面。' },
  { name: '接口管理', file: 'api-management', title: '接口管理', intro: '接口管理提供接口收集、接口生成和接口设计能力。' },
  { name: '日志监控', file: 'log-monitor', title: '日志监控', intro: '平台日志监控包括安全审计、日志查询、SQL记录、数据备份、请求看板和热配置日志级别。' },
  { name: '文件服务', file: 'file-service', title: '文件服务', intro: '文件服务提供文件索引管理和文件管理能力。' },
  { name: '低代码应用市场', file: 'app-market', title: '低代码应用市场', intro: '应用市场提供预置的低代码应用，可一键安装到当前平台实例。' },
  { name: '资源管理', file: 'resource', title: '资源管理', intro: '资源管理包括图标库管理和图片库管理。' },
  { name: 'AI助手', file: 'ai-assistant', title: 'AI 助手', intro: '平台内置 AI 助手功能，提供提示词管理、对话记录、智能搭建和智能问答能力。' },
  { name: '新特性', file: 'whats-new', title: '新特性（V3.1.0）', intro: 'FSI2 低代码平台 V3.1.0 版本新增功能。' },
];

// 需要过滤的 boilerplate 段落（功能描述标准表格）
const BOILERPLATE = new Set([
  '功能描述','项目','说明信息','备注','目的','时机','操作功能','操作单位','操作人员',
  '系统管理员','业务部门','项目部门','系统管理员、开发人员、业务人员','业务人员','开发人员',
  '操作说明','入口路径','菜单入口','系统入口',
]);

// 清洗标题：去掉编号前缀和页码后缀
function cleanHeading(text) {
  return text.replace(/^\d+(\.\d+)*\s*/, '').replace(/\d+$/, '').trim();
}

// 判断是否是 boilerplate
function isBoilerplate(text) {
  if (!text) return true;
  if (BOILERPLATE.has(text.trim())) return true;
  // 单独的"系统管理员"等角色描述
  if (/^(系统管理员|业务部门|项目部门|系统管理员、开发人员、业务人员|业务人员|开发人员)$/.test(text.trim())) return true;
  // 表格表头行
  if (text === '功能描述' || text === '操作说明') return true;
  return false;
}

// 生成模块 md
function buildModule(mod, startIdx, endIdx) {
  const lines = [];
  lines.push(`# ${mod.title}`);
  lines.push('');
  if (mod.intro) {
    lines.push(`> ${mod.intro}`);
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  let imgSeq = 0;
  let lastWasImg = false;
  let sectionLevel = 0;

  for (let i = startIdx; i < endIdx; i++) {
    const p = ps[i];

    // 跳过模块名本身
    if (i === startIdx && p.text === mod.name) continue;

    // 处理图片
    if (p.images.length > 0) {
      for (const img of p.images) {
        imgSeq++;
        const ext = img.split('.').pop();
        const num = String(imgSeq).padStart(2, '0');
        const url = `${BASE_URL}/${mod.file}/${num}.${ext}`;
        // 取下文作为 alt
        let alt = '';
        for (let j = i + 1; j < endIdx && j < i + 5; j++) {
          if (ps[j].text && !isBoilerplate(ps[j].text)) {
            alt = ps[j].text.slice(0, 40);
            break;
          }
        }
        if (!alt) alt = '截图';
        lines.push('');
        lines.push(`![${alt}](${url})`);
        lines.push('');
        lastWasImg = true;
      }
      continue;
    }

    // 跳过 boilerplate
    if (isBoilerplate(p.text)) continue;

    // 跳过空段落
    if (!p.text || !p.text.trim()) continue;

    const text = p.text.trim();

    // 检测标题模式
    // 一级标题：如 "数据字典"、"角色管理"（短文本，可能是 ## ）
    // 子标题：如 "新增类别"、"参数编辑"
    // 编号标题：如 "3.2.1 数据字典"、"3.2.1.1 功能描述"

    const numberedMatch = text.match(/^(\d+(\.\d+)+)\s+(.+)/);
    if (numberedMatch) {
      const parts = numberedMatch[1].split('.').length;
      const title = numberedMatch[3].replace(/\d+$/, '').trim();
      if (isBoilerplate(title)) continue;
      lines.push('');
      lines.push(`${'#'.repeat(Math.min(parts + 1, 4))} ${title}`);
      lines.push('');
      lastWasImg = false;
      continue;
    }

    // 短文本（≤12字，不含标点）可能是标题
    if (text.length <= 12 && !/[，。：；！？\.,]$/.test(text) && !isBoilerplate(text)) {
      // 检查前一段是否是空行或标题
      const prevLine = lines[lines.length - 1];
      if (!prevLine || prevLine === '' || prevLine.startsWith('#')) {
        lines.push('');
        lines.push(`### ${text}`);
        lines.push('');
        lastWasImg = false;
        continue;
      }
    }

    // 普通文本段落
    // 避免连续空行
    if (lastWasImg && lines[lines.length - 1] === '') {
      // 图片后已有空行，直接加文字
    } else if (lines[lines.length - 1] !== '' && lines.length > 0) {
      lines.push('');
    }
    lines.push(text);
    lastWasImg = false;
  }

  // 清理连续空行
  const result = [];
  let prevEmpty = false;
  for (const line of lines) {
    if (line === '') {
      if (!prevEmpty) result.push(line);
      prevEmpty = true;
    } else {
      result.push(line);
      prevEmpty = false;
    }
  }

  return result.join('\n').trim() + '\n';
}

// 找模块边界
function findBounds() {
  let searchFrom = 100;
  const bounds = [];
  for (const mod of MODULES) {
    let idx = -1;
    for (let i = searchFrom; i < ps.length; i++) {
      if (ps[i].text === mod.name) { idx = i; break; }
    }
    if (idx >= 0) {
      bounds.push({ mod, idx });
      searchFrom = idx + 1;
    }
  }
  // 计算结束位置
  for (let i = 0; i < bounds.length; i++) {
    bounds[i].end = i < bounds.length - 1 ? bounds[i + 1].idx : ps.length;
  }
  return bounds;
}

// 主流程
const bounds = findBounds();
let rebuilt = 0;
let totalImgs = 0;

for (const b of bounds) {
  const content = buildModule(b.mod, b.idx, b.end);
  const imgCount = (content.match(/!\[/g) || []).length;
  totalImgs += imgCount;

  // 检测堆积
  const lines = content.split('\n');
  let streak = 0, maxStreak = 0;
  for (const line of lines) {
    if (line.trim().startsWith('![')) {
      streak++;
      if (streak > maxStreak) maxStreak = streak;
    } else if (line.trim() !== '') {
      streak = 0;
    }
  }

  const outPath = join(OUT_DIR, b.mod.file + '.md');
  writeFileSync(outPath, content, 'utf-8');
  rebuilt++;

  const status = maxStreak >= 3 ? `⚠ 最大连续${maxStreak}张` : '✓ 无堆积';
  console.log(`${b.mod.file.padEnd(22)} ${imgCount}张  ${status}`);
}

console.log(`\n重建完成: ${rebuilt} 个页面, ${totalImgs} 张图片`);
