/**
 * Waline 评论插件 for VitePress
 * @description 支持通过 frontmatter 控制评论显示
 */
import { init } from "@waline/client";
import type { WalineInitOptions } from "@waline/client";
import "@waline/client/style";

export type NicknameGuard =
  | { pattern: RegExp; hint?: string }
  | { validate: (nick: string) => boolean; hint?: string };

export interface WalineCommentsOptions extends Omit<WalineInitOptions, "el"> {
  el?: string | HTMLElement;
  nicknameGuard?: NicknameGuard;
  mountDelay?: number;
}

/** 作为"插件"在 theme/index.ts 中启用 */
export function useWalineComments(options: WalineCommentsOptions) {
  return {
    name: "vitepress-plugin-waline-comments",
    enhanceApp() {
      if (typeof window === "undefined") return;

      let walineInstance: any = null;
      let target: HTMLElement | null = null;
      let currentPath = "";

      const mount = () => {
        // 排除首页（首页通常是 / 或 /index.html）
        const path = window.location.pathname;
        if (path === '/' || path === '/index.html') return;

        // 检查 frontmatter 是否禁用评论
        const pageData = (window as any).__VP_HASH_MAP__?.[path];
        if (pageData?.frontmatter?.comment === false) return;

        // 查找或创建容器
        if (!target) {
          target = document.createElement("div");
          target.id = "waline";
          target.className = "waline-wrapper";

          const container =
            document.querySelector(".VPDoc .content-container") ||
            document.querySelector(".VPDoc .content") ||
            document.querySelector(".content-container") ||
            document.querySelector("main") ||
            document.body;

          if (container) {
            // 查找页脚（必须是 container 的直接子元素）
            const footer = Array.from(container.children).find(
              (el) => el.classList.contains("prev-next") || 
                      el.classList.contains("page-footer")
            );
            
            if (footer) {
              container.insertBefore(target, footer);
            } else {
              container.appendChild(target);
            }
          } else {
            return;
          }
        }

        // 检查路径和主题变化
        const newPath = window.location.pathname;
        const isDark = document.documentElement.classList.contains("dark");

        // 如果已有实例，使用 update() 更新
        if (walineInstance) {
          if (currentPath !== newPath) {
            currentPath = newPath;
          }
          walineInstance.update({ dark: isDark });
          return;
        }

        // 首次初始化
        currentPath = newPath;
        
        try {
          walineInstance = init({
            el: target,
            dark: isDark,
            login: "enable",
            locale: {
              nick: "姓名",
              mail: "邮箱",
              link: "工号",
              nickError: "请输入正确的姓名（2-4个中文字符）",
              mailError: "请填写正确的工号（6位数字）",
              placeholder: "💬 欢迎评论（支持 Markdown 语法）",
              sofa: "来发表第一条评论吧~",
            },
            requiredMeta: ["nick", "link"],
            pageSize: 10,
            wordLimit: [0, 500],
            imageUploader: false,
            texRenderer: false,
            search: false,
            reaction: false,
            ...options,
          });

          // 监听主题变化
          const themeObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.attributeName === "class" && walineInstance?.update) {
                const isDark = document.documentElement.classList.contains("dark");
                walineInstance.update({ dark: isDark });
              }
            });
          });

          themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
          });

          // 添加字段校验
          if (options.nicknameGuard && target) {
            attachNicknameGuard(target, options.nicknameGuard);
          }
          setTimeout(() => attachWorkIdGuard(target!), 1000);
        } catch (error) {
          console.error("[Waline] 初始化失败:", error);
        }
      };

      // 延迟挂载（等待 DOM 完全渲染）
      const delay = Math.max(500, options.mountDelay ?? 800);
      const scheduleMount = () => {
        setTimeout(() => {
          // 排除首页
          const path = window.location.pathname;
          if (path === '/' || path === '/index.html') return;
          
          // 检查是否是文档页面
          const isDocPage =
            document.querySelector(".VPDoc") ||
            document.querySelector(".content");
          if (isDocPage) mount();
        }, delay);
      };

      scheduleMount();

      // 监听路由变化
      if (typeof window !== "undefined") {
        window.addEventListener("vitepress:route-change", scheduleMount);
        window.addEventListener("popstate", scheduleMount);
        window.addEventListener("beforeunload", () => {
          walineInstance?.destroy();
          walineInstance = null;
        });
      }
    },
  };
}

/** 昵称校验逻辑 - 仅对未登录用户生效 */
function attachNicknameGuard(root: HTMLElement, guard: NicknameGuard) {
  const observer = new MutationObserver(() => {
    const nickInput =
      root.querySelector<HTMLInputElement>('input[name="nick"]');
    const submitBtn = root.querySelector<HTMLButtonElement>(".wl-submit");
    const loginInfo = root.querySelector(".wl-login-info");

    if (!nickInput || !submitBtn) return;

    // 如果已登录（GitHub等），隐藏输入框并跳过验证
    if (loginInfo) {
      const inputContainer = nickInput.closest(".wl-input-container");
      if (inputContainer) {
        (inputContainer as HTMLElement).style.display = "none";
      }
      submitBtn.disabled = false;
      console.log("[Waline] 用户已登录，跳过姓名工号验证");
      return;
    }

    const hintId = "waline-nick-hint";
    let hint = root.querySelector<HTMLDivElement>("#" + hintId);

    if (!hint) {
      hint = document.createElement("div");
      hint.id = hintId;
      hint.style.cssText =
        "margin-top: 8px; font-size: 12px; display: flex; align-items: center; gap: 4px; transition: all 0.2s ease;";
      nickInput.parentElement?.appendChild(hint);
    }

    const validateNick = () => {
      const nick = (nickInput.value || "").trim();

      // 执行自定义验证
      const isValid =
        "pattern" in guard ? guard.pattern.test(nick) : guard.validate(nick);

      if (!nick) {
        hint!.innerHTML =
          '<span style="color: var(--vp-c-text-3);">💡 提示：' +
          (guard.hint || "格式：姓名 工号") +
          "</span>";
        submitBtn.disabled = false; // 让 Waline 自己处理空值
      } else if (!isValid) {
        hint!.innerHTML =
          '<span style="color: var(--vp-c-danger-1);">❌ ' +
          (guard.hint || "格式：姓名 工号（例：张三 409322）") +
          "</span>";
        submitBtn.disabled = true;
      } else {
        hint!.innerHTML =
          '<span style="color: var(--vp-c-success-1);">✅ 格式正确</span>';
        submitBtn.disabled = false;
      }
    };

    // 监听输入事件
    nickInput.removeEventListener("input", validateNick); // 避免重复绑定
    nickInput.addEventListener("input", validateNick);

    // 初始验证
    validateNick();
  });

  // 监听 DOM 变化
  observer.observe(root, {
    childList: true,
    subtree: true,
  });

  // 延长观察时间，确保捕获登录状态变化
  setTimeout(() => observer.disconnect(), 10000); // 10秒后停止观察
}

/** 工号校验逻辑 - 仅对未登录用户生效 */
function attachWorkIdGuard(root: HTMLElement) {
  const observer = new MutationObserver(() => {
    const linkInput =
      root.querySelector<HTMLInputElement>('input[name="link"]');
    const submitBtn = root.querySelector<HTMLButtonElement>(".wl-submit");
    const loginInfo = root.querySelector(".wl-login-info");

    if (!linkInput || !submitBtn) return;

    // 如果已登录，跳过验证
    if (loginInfo) {
      const inputContainer = linkInput.closest(".wl-input-container");
      if (inputContainer) {
        (inputContainer as HTMLElement).style.display = "none";
      }
      console.log("[Waline] 用户已登录，跳过工号验证");
      return;
    }

    const hintId = "waline-link-hint";
    let hint = root.querySelector<HTMLDivElement>("#" + hintId);

    if (!hint) {
      hint = document.createElement("div");
      hint.id = hintId;
      hint.style.cssText =
        "margin-top: 4px; font-size: 12px; display: flex; align-items: center; gap: 4px; transition: all 0.2s ease;";
      linkInput.parentElement?.appendChild(hint);
    }

    const validateWorkId = () => {
      const workId = (linkInput.value || "").trim();

      // 验证6位数字
      const isValid = /^\d{6}$/.test(workId);

      if (!workId) {
        hint!.innerHTML =
          '<span style="color: var(--vp-c-text-3);">💡 请输入6位工号</span>';
        submitBtn.disabled = false; // 让 Waline 自己处理空值
      } else if (!isValid) {
        hint!.innerHTML =
          '<span style="color: var(--vp-c-danger-1);">❌ 工号必须是6位数字</span>';
        submitBtn.disabled = true;
      } else {
        hint!.innerHTML =
          '<span style="color: var(--vp-c-success-1);">✅ 工号格式正确</span>';
        submitBtn.disabled = false;
      }
    };

    // 监听输入事件
    linkInput.removeEventListener("input", validateWorkId);
    linkInput.addEventListener("input", validateWorkId);

    // 初始验证
    validateWorkId();
  });

  // 监听 DOM 变化
  observer.observe(root, {
    childList: true,
    subtree: true,
  });

  setTimeout(() => observer.disconnect(), 10000);
}
