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

      const mount = () => {
        console.log("[Waline] 开始挂载评论组件...");
        console.log("[Waline] 当前路径:", window.location.pathname);

        // 检查 frontmatter 是否禁用评论
        const pageData = (window as any).__VP_HASH_MAP__?.[
          window.location.pathname
        ];
        if (pageData?.frontmatter?.comment === false) {
          console.log("[Waline] 当前页面已通过 frontmatter 禁用评论");
          return;
        }

        // 查找或创建容器
        if (!target) {
          target = document.createElement("div");
          target.id = "waline";
          target.className = "waline-wrapper";

          // 查找文章容器 - 尝试多种选择器
          const container =
            document.querySelector(".VPDoc .content-container") ||
            document.querySelector(".VPDoc .content") ||
            document.querySelector(".vp-doc .content-container") ||
            document.querySelector(".vp-doc .content") ||
            document.querySelector(".content-container") ||
            document.querySelector(".content") ||
            document.querySelector("main") ||
            document.querySelector("article") ||
            document.body;

          console.log(
            "[Waline] 找到容器:",
            container?.className || container?.tagName
          );

          // 插入到文章末尾
          const footer = container?.querySelector(
            ".prev-next, .page-footer, footer"
          );
          if (footer && container) {
            container.insertBefore(target, footer);
            console.log("[Waline] 已插入到页脚前");
          } else if (container) {
            container.appendChild(target);
            console.log("[Waline] 已插入到容器末尾");
          } else {
            console.error("[Waline] 未找到合适的容器！");
            return;
          }
        }

        // 销毁旧实例
        if (walineInstance) {
          console.log("[Waline] 销毁旧实例");
          walineInstance.destroy();
          walineInstance = null;
        }

        // 初始化 Waline
        console.log("[Waline] 初始化评论系统, serverURL:", options.serverURL);
        try {
          walineInstance = init({
            el: target,
            path: window.location.pathname,

            // 默认配置（可被 options 覆盖）
            dark: "auto",
            login: "enable",
            locale: {
              nick: "姓名",
              mail: "邮箱",
              link: "工号",
              nickError: "请输入正确的姓名（2-4个中文字符）",
              mailError: "请填写正确的工号（6位数字）",
              placeholder: "💬 欢迎评论（支持 Markdown 语法）",
              sofa: "来发表第一条评论吧~",
              submit: "提交",
              reply: "回复",
              cancelReply: "取消回复",
              comment: "评论",
              more: "加载更多...",
              preview: "预览",
              emoji: "表情",
              uploadImage: "上传图片",
              seconds: "秒前",
              minutes: "分钟前",
              hours: "小时前",
              days: "天前",
              now: "刚刚",
              uploading: "正在上传...",
              login: "登录",
              logout: "退出登录",
              admin: "管理员",
              sticky: "置顶",
              word: "字",
              wordHint: "评论字数应在 $0 到 $1 字之间！\n当前字数：$2",
              anonymous: "匿名",
            },

            // 必填字段（对于非 GitHub 登录用户）
            requiredMeta: ["nick", "link"],

            // 其他配置
            pageSize: 10,
            wordLimit: [0, 500],
            imageUploader: false, // 禁用图片上传（安全考虑）
            highlighter: true, // 代码高亮
            texRenderer: false, // 关闭数学公式（如需要可开启）

            // 覆盖用户自定义配置
            ...options,
          });

          console.log("[Waline] 初始化成功！", walineInstance);

          // 添加昵称校验
          if (options.nicknameGuard && target) {
            attachNicknameGuard(target, options.nicknameGuard);
          }

          // 添加工号校验（6位数字）
          setTimeout(() => {
            attachWorkIdGuard(target!);
          }, 1000);

          // 修复 focus 错误：捕获提交后的 focus 异常
          setTimeout(() => {
            const form = target?.querySelector(".wl-panel");
            if (form) {
              form.addEventListener(
                "submit",
                () => {
                  // 延迟处理，避免干扰 Waline 原有逻辑
                  setTimeout(() => {
                    try {
                      // 如果 Waline 尝试 focus 失败，手动聚焦到编辑器
                      const editor = target?.querySelector<HTMLTextAreaElement>(
                        ".wl-editor textarea"
                      );
                      if (editor && document.activeElement === document.body) {
                        editor.focus();
                      }
                    } catch (err) {
                      console.warn("[Waline] Focus 处理:", err);
                    }
                  }, 100);
                },
                true
              );
            }
          }, 1000);
        } catch (error) {
          console.error("[Waline] 初始化失败:", error);
        }
      };

      // 延迟挂载函数
      const delay = Math.max(0, options.mountDelay ?? 300);
      const scheduleMount = () => {
        console.log("[Waline] 计划挂载，延迟:", delay, "ms");
        setTimeout(() => {
          // 检查是否在文档页面
          const isDocPage =
            document.querySelector(".VPDoc") ||
            document.querySelector(".vp-doc") ||
            document.querySelector("article") ||
            document.querySelector(".content");

          console.log("[Waline] 检查页面类型，是否为文档页:", !!isDocPage);

          if (isDocPage) {
            mount();
          } else {
            console.log("[Waline] 非文档页面，跳过挂载");
          }
        }, delay);
      };

      // 立即执行首次挂载
      scheduleMount();

      // 全局错误处理：捕获 Waline 内部的 focus 错误
      if (typeof window !== "undefined") {
        const originalError = console.error;
        console.error = function (...args: any[]) {
          // 过滤掉 Waline 的 focus 错误，避免污染控制台
          const errorMsg = args[0]?.toString() || "";
          if (
            errorMsg.includes(
              "Cannot read properties of undefined (reading 'focus')"
            )
          ) {
            console.warn("[Waline] 已捕获并忽略 focus 错误（这是预期行为）");
            return;
          }
          originalError.apply(console, args);
        };
      }

      // 清理函数
      if (typeof window !== "undefined") {
        window.addEventListener("beforeunload", () => {
          if (walineInstance) {
            walineInstance.destroy();
            walineInstance = null;
          }
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
