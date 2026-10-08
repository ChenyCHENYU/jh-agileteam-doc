/**
 * 团队数据品控（build 前钩子）
 * 用法：node scripts/check-team-data.mjs
 *
 * 检查四支团队 + AuthorTag 的成员数据：
 *  1. 头像引用必须是本地 /avatars/ 路径且文件存在（防 CDN 慢链/路径手滑如 .svgBig）
 *  2. 头像文件必须是合法 SVG（防空文件/半截下载）
 *  3. 成员按工号升序排列
 *  4. 必填字段完整：name / employeeId / role / department / bio / skills
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const compDir = join(root, "docs/.vitepress/components");
const problems = [];

const TEAM_FILES = ["TeamHero", "BackendTeamHero", "TestTeamHero", "BusinessTeamHero"];

for (const team of TEAM_FILES) {
  const file = join(compDir, team, "data.ts");
  const src = readFileSync(file, "utf8");

  // 切分成员块
  const blocks = [];
  {
    let depth = 0;
    let cur = "";
    for (const line of src.split("\n")) {
      if (depth === 0 && /^\s*\{\s*$/.test(line)) {
        depth = 1;
        cur = line;
        continue;
      }
      if (depth > 0) {
        cur += "\n" + line;
        for (const ch of line) {
          if (ch === "{") depth++;
          else if (ch === "}") depth--;
        }
        if (depth === 0) blocks.push(cur);
      }
    }
  }

  const ids = [];
  blocks.forEach((b, i) => {
    const name = (b.match(/name:\s*"([^"]+)"/) || [])[1] || `#${i}`;
    const avatar = (b.match(/avatar:\s*"([^"]+)"/) || [])[1];
    const id = (b.match(/employeeId:\s*"(\d+)"/) || [])[1];
    if (id) ids.push(id);

    if (!avatar) return problems.push(`${team}/${name}: 缺 avatar`);
    if (!avatar.startsWith("/avatars/")) {
      problems.push(`${team}/${name}: 非本地头像 ${avatar.slice(0, 60)}`);
      return;
    }
    if (!/\.svg$/.test(avatar)) problems.push(`${team}/${name}: 头像路径异常 ${avatar}`);
    const file = join(root, "docs/public", avatar);
    if (!existsSync(file)) {
      problems.push(`${team}/${name}: 头像文件不存在 ${avatar}`);
      return;
    }
    const content = readFileSync(file, "utf8");
    if (!content.startsWith("<svg")) problems.push(`${team}/${name}: 头像不是合法 SVG ${avatar}`);

    // 按队伍结构定制必填字段：业务团队为 domain 制（无 department/skills）
    const required = team === "BusinessTeamHero"
      ? ["employeeId", "role", "domain", "bio"]
      : ["employeeId", "role", "department", "bio", "skills"];
    for (const field of required) {
      if (!new RegExp(`${field}:`).test(b)) problems.push(`${team}/${name}: 缺 ${field}`);
    }
  });

  const sorted = [...ids].sort();
  if (ids.join() !== sorted.join()) {
    problems.push(`${team}: 工号乱序（${ids.join("→")}）`);
  }
}

// AuthorTag 只查头像有效性
{
  const src = readFileSync(join(compDir, "AuthorTag", "data.ts"), "utf8");
  for (const m of src.matchAll(/avatar:\s*"([^"]+)"/g)) {
    const url = m[1];
    if (url.startsWith("/avatars/")) {
      const f = join(root, "docs/public", url);
      if (!existsSync(f)) problems.push(`AuthorTag: 头像文件不存在 ${url}`);
    } else if (/^https?:/.test(url)) {
      problems.push(`AuthorTag: 非本地头像 ${url.slice(0, 60)}`);
    }
  }
}

console.log(`团队数据品控：4 队 + AuthorTag`);
if (problems.length) {
  console.error("发现问题：");
  problems.forEach((p) => console.error("  ✗", p));
  process.exit(1);
}
console.log("全部通过 ✓");
