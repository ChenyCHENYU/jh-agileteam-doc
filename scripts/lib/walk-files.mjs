/**
 * scripts 共享工具：递归遍历收集文件路径
 * 统一各 check/gen 脚本的目录遍历逻辑（原先 8+ 个脚本各自复制一份）
 */
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * @param {string} dir 起始目录
 * @param {object} opts
 * @param {string[]} [opts.ignore] 目录名忽略清单（默认 ["dist","node_modules"]）
 * @param {boolean} [opts.ignoreHidden] 是否忽略点开头的目录/文件（默认 true；需进入 .vitepress 时传 false）
 * @param {(name: string) => boolean} [opts.test] 文件名谓词（默认全部收集）
 * @param {string[]} [acc] 累积数组（内部递归用）
 * @returns {string[]} 命中的文件绝对路径列表
 */
export function walkFiles(dir, opts = {}, acc = []) {
  const { ignore = ["dist", "node_modules"], ignoreHidden = true, test = () => true } = opts;
  for (const name of readdirSync(dir)) {
    if (ignore.includes(name)) continue;
    if (ignoreHidden && name.startsWith(".")) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkFiles(p, opts, acc);
    else if (test(name)) acc.push(p);
  }
  return acc;
}
