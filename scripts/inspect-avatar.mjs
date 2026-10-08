/**
 * 线上头像计算样式取证
 * 用法：node scripts/inspect-avatar.mjs [url]
 * 用系统 Chrome 打开页面，读取作者卡片/团队墙头像的最终计算样式与几何关系
 */
import puppeteer from "puppeteer-core";

const url = process.argv[2] || "https://www.jhat.tech/views/best-practices/L4-cli";

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
});
const page = await browser.newPage();
await page.setViewport({ width: 1600, height: 900 });
await page.goto(url, { waitUntil: "networkidle0", timeout: 60_000 });
await new Promise((r) => setTimeout(r, 1200));

const report = await page.evaluate(() => {
  const out = [];
  const describe = (el, label) => {
    if (!el) return;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    out.push({
      label,
      tag: el.tagName,
      classes: el.className,
      position: cs.position,
      opacity: cs.opacity,
      display: cs.display,
      width: r.width,
      height: r.height,
      top: Math.round(r.top),
      left: Math.round(r.left),
    });
  };

  // 作者卡片（单作者）
  const container = document.querySelector(".author-avatar-container");
  describe(container, "作者-容器");
  describe(document.querySelector(".author-avatar-default"), "作者-默认字母");
  const img = document.querySelector(".author-avatar-image");
  describe(img, "作者-头像图");
  if (container && img) {
    const cr = container.getBoundingClientRect();
    const ir = img.getBoundingClientRect();
    out.push({
      label: "几何判定",
      imgInContainer: ir.top >= cr.top - 2 && ir.top <= cr.bottom && Math.abs(ir.left - cr.left) < 5,
      imgTopOffset: Math.round(ir.top - cr.top),
      imgLeftOffset: Math.round(ir.left - cr.left),
    });
  }

  // 团队墙
  const wall = document.querySelector(".member-avatar");
  describe(wall, "团队墙-头像");
  describe(document.querySelector(".member-avatar-wrapper"), "团队墙-容器");
  return out;
});

console.table(report);
await page.screenshot({ path: "/tmp/avatar-live.png", fullPage: false });
console.log("截图: /tmp/avatar-live.png");
await browser.close();
