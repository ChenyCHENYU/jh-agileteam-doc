import { init } from "@waline/client";
import type { WalineInitOptions } from "@waline/client";
import "@waline/client/style";

export interface WalineCommentsOptions extends Omit<WalineInitOptions, "el"> {
  el?: string | HTMLElement;
  mountDelay?: number;
}

export function useWalineComments(options: WalineCommentsOptions) {
  return {
    name: "vitepress-plugin-waline-comments",
    enhanceApp() {
      if (typeof window === "undefined") return;

      let walineInstance: any = null;
      let target: HTMLElement | null = null;
      let currentPath = "";

      const mount = () => {
        const path = window.location.pathname;
        if (path === '/' || path === '/index.html') return;

        const pageData = (window as any).__VP_HASH_MAP__?.[path];
        if (pageData?.frontmatter?.comment === false) return;

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

        const newPath = window.location.pathname;
        const isDark = document.documentElement.classList.contains("dark");

        if (walineInstance) {
          if (currentPath !== newPath) {
            currentPath = newPath;
          }
          walineInstance.update({ dark: isDark });
          return;
        }

        currentPath = newPath;
        
        try {
          walineInstance = init({
            el: target,
            dark: isDark,
            login: "enable",
            pageSize: 10,
            ...options,
          });
        } catch (error) {
          console.error("[Waline] 初始化失败:", error);
        }
      };

      const scheduleMount = () => {
        setTimeout(mount, options.mountDelay || 800);
      };

      if (typeof window !== "undefined") {
        window.addEventListener("vitepress:route-change", scheduleMount);
        window.addEventListener("popstate", scheduleMount);
      }

      if (document.readyState === "complete") {
        scheduleMount();
      } else {
        window.addEventListener("load", scheduleMount);
      }

      const darkModeObserver = new MutationObserver(() => {
        if (walineInstance) {
          const isDark = document.documentElement.classList.contains("dark");
          walineInstance.update({ dark: isDark });
        }
      });

      darkModeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    },
  };
}
