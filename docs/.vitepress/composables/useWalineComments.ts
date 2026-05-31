import type { WalineInitOptions } from "@waline/client";

export interface WalineCommentsOptions extends Omit<WalineInitOptions, "el"> {
  el?: string | HTMLElement;
  mountDelay?: number;
}

/**
 * Waline 评论系统 — 懒加载版本
 * 使用 IntersectionObserver 检测评论区域进入视口后再加载 Waline 资源，
 * 避免阻塞首屏渲染和不必要的网络请求。
 */
export function useWalineComments(options: WalineCommentsOptions) {
  return {
    name: "vitepress-plugin-waline-comments",
    enhanceApp() {
      if (typeof window === "undefined") return;

      let walineInstance: any = null;
      let target: HTMLElement | null = null;
      let observer: IntersectionObserver | null = null;
      let walineLoaded = false;

      const loadAndMount = async () => {
        if (!target) return;

        const isDark = document.documentElement.classList.contains("dark");

        // 已初始化则只更新
        if (walineInstance) {
          walineInstance.update({ dark: isDark });
          return;
        }

        // 动态导入 Waline（首次触发时才加载 JS + CSS）
        if (!walineLoaded) {
          const [{ init }] = await Promise.all([
            import("@waline/client"),
            import("@waline/client/style"),
          ]);
          walineLoaded = true;

          try {
            walineInstance = init({
              ...options,
              el: target,
              dark: isDark,
            });
          } catch (error) {
            console.error("[Waline] 初始化失败:", error);
          }
        }
      };

      const createTarget = (): HTMLElement | null => {
        const path = window.location.pathname;
        if (path === "/" || path === "/index.html") return null;

        if (!target) {
          target = document.createElement("div");
          target.id = "waline";
          target.className = "waline-wrapper";

          const container =
            document.querySelector(".VPDoc .content-container") ||
            document.querySelector(".VPDoc .content") ||
            document.querySelector("main");

          if (!container) return null;

          const footer = Array.from(container.children).find(
            (el) =>
              el.classList.contains("prev-next") ||
              el.classList.contains("page-footer")
          );

          if (footer) {
            container.insertBefore(target, footer);
          } else {
            container.appendChild(target);
          }
        }

        return target;
      };

      const setupObserver = () => {
        // 清理旧实例
        if (walineInstance) {
          walineInstance.destroy?.();
          walineInstance = null;
        }
        if (target) {
          target.remove();
          target = null;
        }
        if (observer) {
          observer.disconnect();
          observer = null;
        }

        setTimeout(() => {
          const el = createTarget();
          if (!el) return;

          // IntersectionObserver: 评论区进入视口 200px 范围内时触发加载
          observer = new IntersectionObserver(
            (entries) => {
              if (entries[0]?.isIntersecting) {
                loadAndMount();
                observer?.disconnect();
              }
            },
            { rootMargin: "200px" }
          );
          observer.observe(el);
        }, 300);
      };

      // 路由变化时重新挂载
      window.addEventListener("vitepress:route-change", setupObserver);
      window.addEventListener("popstate", setupObserver);

      if (document.readyState === "complete") {
        setupObserver();
      } else {
        window.addEventListener("load", setupObserver);
      }

      // 暗色模式切换同步
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
