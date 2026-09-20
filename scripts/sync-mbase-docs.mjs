/**
 * mbase 文档站内化同步（4 份：integration / message-center / app-integration / quick-access）
 * 用法：node scripts/sync-mbase-docs.mjs [--mbase <wl-mbase 目录>]
 * 规则：以 mbase 仓库 docs 为单一事实源——全量替换 + 来源横幅 + 仓库内链映射到站内路径。
 * 已含横幅的文件同样会被刷新（幂等：横幅不重复插入）。
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const argIdx = process.argv.indexOf("--mbase");
const mbaseDocs = resolve(
  argIdx > -1 ? process.argv[argIdx + 1] : join(root, "..", "wl-mbase", "docs")
);
if (!existsSync(mbaseDocs)) {
  console.error(`mbase docs 目录不存在：${mbaseDocs}`);
  process.exit(1);
}

const siteDir = join(root, "docs/frontend/mobile-uniapp");

// 仓库内链 -> 站内路径
const linkMap = [
  [/\.\/集成文档\.md/g, "./integration"],
  [/\.\/APP集成与发布\.md/g, "./app-integration"],
  [/\.\/图片水印能力与服务端接入\.md/g, "./watermark"],
  [/\.\/断点续传能力设计与接入\.md/g, "./chunk-upload"],
  [/\.\/移动端消息中心使用与架构说明\.md/g, "./message-center"],
  [/\.\/子应用10分钟快速接入\.md/g, "./quick-access"],
  [/\.\/钉钉免登方案\.md/g, "./dingtalk"],
  [/\.\/多端构建与环境说明\.md/g, "/frontend/mobile-uniapp/"],
];

// 仓库锚 -> VitePress 实际 heading id（仓库 TOC 锚格式与 VitePress slug 规则不一致，
// 此映射来自构建产物 dist 实测 id；仓库自身渲染不受影响，仅站内修正）
const anchorMap = [
  ["#零阅读路径与接入边界", "#零、阅读路径与接入边界"],
  ["#一整体架构", "#一、整体架构"],
  ["#二免登sso实现原理", "#二、免登-sso-实现原理"],
  ["#三门户侧已完成内容", "#三、门户侧已完成内容"],
  ["#四h5-子应用侧改造清单", "#四、h5-子应用侧改造清单"],
  ["#五桥接通信协议", "#五、桥接通信协议"],
  ["#六钉钉-jsapi-鉴权", "#六、钉钉-jsapi-鉴权"],
  ["#七访客模式接入免账号密码", "#七、访客模式接入-免账号密码"],
  ["#八微信小程序-openid-分发访客身份识别", "#八、微信小程序-openid-分发-访客身份识别"],
  ["#九公司上下文透传", "#九、公司上下文透传"],
  ["#十多环境配置", "#十、多环境配置"],
  ["#十一安全注意事项", "#十一、安全注意事项"],
  ["#推荐使用跨端媒体-sdk", "#推荐-使用跨端媒体-sdk"],
  ["#断点续传断网排队", "#断点续传-断网排队"],
  ["./message-center#73-审批详情", "./message-center#_7-3-审批详情"],
  ["./app-integration#23-底层桥接协议", "./app-integration#_2-3-底层桥接协议"],
  ["./chunk-upload#三服务端协议必须实现", "./chunk-upload#三、服务端协议-必须实现"],
  ["#⑦-权限与异常页面协同避免子应用空白", "#_7-权限与异常页面协同-避免子应用空白"],
  ["#4.2-可选接入体验更好", "#_4-2-可选接入-体验更好"],
  ["#⑥-apppda-双向返回导航单头部规则适用于所有宿主", "#_6-app-pda-双向返回导航-单头部规则适用于所有宿主"],
  ["#⑥-apppda-单头部导航", "#_6-app-pda-双向返回导航-单头部规则适用于所有宿主"],
];

const jobs = [
  { src: "集成文档.md", dst: "integration.md", banner: "来源：`wl-mbase` 仓库 `docs/集成文档.md`——本页以仓库为单一事实源，基座发版后同步刷新。" },
  { src: "移动端消息中心使用与架构说明.md", dst: "message-center.md", banner: "来源：`wl-mbase` 仓库 `docs/移动端消息中心使用与架构说明.md`。" },
  { src: "APP集成与发布.md", dst: "app-integration.md", banner: "来源：`wl-mbase` 仓库 `docs/APP集成与发布.md`。" },
  { src: "子应用10分钟快速接入.md", dst: "quick-access.md", banner: "来源：`wl-mbase` 仓库 `docs/子应用10分钟快速接入.md`——第一次接入跑通最小闭环，完整协议见 [H5 子应用集成方案](./integration)。" },
];

for (const job of jobs) {
  const srcPath = join(mbaseDocs, job.src);
  if (!existsSync(srcPath)) {
    console.error("skip（仓库源不存在）:", job.src);
    continue;
  }
  let c = readFileSync(srcPath, "utf8");
  for (const [re, to] of linkMap) c = c.replace(re, to);
  for (const [from, to] of anchorMap) c = c.split(from).join(to);
  const lines = c.split("\n");
  let insertAt = 1;
  while (insertAt < lines.length && lines[insertAt].trim() === "") insertAt++;
  const inject = [`> 📦 ${job.banner}`, ``, `<AuthorTag :authors="['CHENY']" />`, ``];
  lines.splice(insertAt, 0, ...inject);
  writeFileSync(join(siteDir, job.dst), lines.join("\n"), "utf8");
  console.log("ok", job.dst);
}
