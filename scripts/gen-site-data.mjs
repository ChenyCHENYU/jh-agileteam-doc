/**
 * 站点动态数据生成（build 前钩子）
 * 用法：node scripts/gen-site-data.mjs
 *
 * 产物（docs/public/data/，随站点静态发布）：
 *  - release-count.json  团队 14 个公共 npm 包的累计发版次数（首页标语用）
 *  - changelog.json       最近 60 条提交（更新日志页用）
 *
 * 全部容错：registry/git 任一失败时保留上一次产物，绝不阻塞构建。
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "docs/public/data");
mkdirSync(outDir, { recursive: true });

// ---------- 1) 累计发版次数（npm registry 汇总） ----------
const PACKAGES = [
  "mach-table", "mach-table-vue", "mach-table-react", "mach-table-xlsx",
  "wl-skills-kit", "wl-skills-ui", "wl-skills-bd", "jh4j-cloud-cli",
  "wl-skills-test", "robot-cli", "vscode-config", "wl-skills-design",
  "vscode-config-extensions", "naive-ui-components",
];

async function genReleaseCount() {
  try {
    const counts = await Promise.all(
      PACKAGES.map(async (name) => {
        const res = await fetch(
          `https://registry.npmjs.org/${encodeURIComponent(`@agile-team/${name}`)}`,
          { headers: { Accept: "application/vnd.npm.install-v1+json" } }
        );
        if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
        const data = await res.json();
        return Object.keys(data.versions || {}).length;
      })
    );
    const total = counts.reduce((a, b) => a + b, 0);
    writeFileSync(join(outDir, "release-count.json"), JSON.stringify({ total, generatedAt: new Date().toISOString() }));
    console.log(`release-count.json：累计发版 ${total} 次（14 包）`);
  } catch (err) {
    console.warn(`⚠ 发版数汇总失败（保留旧产物）：${err.message}`);
    if (!existsSync(join(outDir, "release-count.json"))) {
      writeFileSync(join(outDir, "release-count.json"), JSON.stringify({ total: null }));
    }
  }
}

// ---------- 2) 更新日志（git log 最近 60 条） ----------
function genChangelog() {
  try {
    const raw = execSync(
      `git log -60 --date=short --pretty=format:"%h|%ad|%s"`,
      { cwd: root, encoding: "utf8" }
    ).trim();
    const items = raw
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [hash, date, ...rest] = line.split("|");
        return { hash, date, subject: rest.join("|") };
      });
    writeFileSync(join(outDir, "changelog.json"), JSON.stringify({ items }, null, 2));
    console.log(`changelog.json：${items.length} 条提交`);
  } catch (err) {
    console.warn(`⚠ changelog 生成失败（保留旧产物）：${err.message}`);
    if (!existsSync(join(outDir, "changelog.json"))) {
      writeFileSync(join(outDir, "changelog.json"), JSON.stringify({ items: [] }));
    }
  }
}

await genReleaseCount();
genChangelog();
