// composables/useWalineComments.ts
import type { EnhanceAppContext } from 'vitepress'
import { init, destroy } from '@waline/client'
import type { WalineInitOptions } from '@waline/client'
import '@waline/client/style'

export type NicknameGuard =
  | { pattern: RegExp; hint?: string }
  | { validate: (nick: string) => boolean; hint?: string }

export interface WalineCommentsOptions extends Omit<WalineInitOptions, 'el'> {
  el?: string | HTMLElement
  nicknameGuard?: NicknameGuard
  mountDelay?: number
}

/** 作为"插件"在 theme/index.ts 中启用 */
export function useWalineComments(options: WalineCommentsOptions) {
  return {
    name: 'vitepress-plugin-waline-comments',
    enhanceApp({ router }: EnhanceAppContext) {
      if (typeof window === 'undefined') return

      let walineInstance: any = null

      const mount = () => {
        // 1) 找挂载点，不存在则自动追加到正文底部
        let target: HTMLElement | null =
          typeof options.el === 'string'
            ? document.querySelector(options.el) as HTMLElement
            : (options.el as HTMLElement | null)

        if (!target) {
          target = document.createElement('div')
          target.id = 'waline'
          target.className = 'waline-wrapper'
          target.style.cssText = 'margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--vp-c-divider);'
          
          // 查找文章容器
          const container = 
            document.querySelector('.VPDoc .content') || 
            document.querySelector('.vp-doc .content') ||
            document.querySelector('.content') || 
            document.querySelector('main') ||
            document.body
          
          // 插入到文章末尾但在页脚之前
          const footer = container.querySelector('.prev-next')
          if (footer) {
            container.insertBefore(target, footer)
          } else {
            container.appendChild(target)
          }
        }

        // 2) 销毁旧实例
        if (walineInstance) {
          walineInstance.destroy()
          walineInstance = null
        }

        // 3) 初始化 Waline
        walineInstance = init({
          el: target,
          path: window.location.pathname,
          
          // 默认配置（可被 options 覆盖）
          dark: 'auto',
          login: 'enable',
          locale: {
            login: '登录评论',
            admin: '管理',
            placeholder: '欢迎评论（支持 Markdown 语法）',
            sofa: '来发表第一条评论吧~',
            nick: '姓名 工号',
            mail: '邮箱',
            link: '网址 (可选)',
            nickError: '请输入正确的姓名和工号',
            mailError: '请输入正确的邮箱',
            submit: '提交',
            reply: '回复',
            cancelReply: '取消回复',
            comment: '评论',
            more: '加载更多...',
            preview: '预览',
            emoji: '表情',
            uploadImage: '上传图片',
            seconds: '秒前',
            minutes: '分钟前',
            hours: '小时前',
            days: '天前',
            now: '刚刚',
            uploading: '正在上传...',
            login_desc: '使用 GitHub 账号快速登录',
            logout: '退出登录',
            word: '字',
            anonymous: '匿名'
          },
          
          // 必填字段（对于非 GitHub 登录用户）
          requiredMeta: ['nick', 'mail'],
          
          // 其他配置
          pageSize: 10,
          wordLimit: [0, 500],
          imageUploader: false, // 禁用图片上传（安全考虑）
          highlighter: true,    // 代码高亮
          texRenderer: false,   // 关闭数学公式（如需要可开启）
          
          // 覆盖用户自定义配置
          ...options,
        })

        // 4) 添加昵称校验
        if (options.nicknameGuard) {
          attachNicknameGuard(target, options.nicknameGuard)
        }
      }

      // 延迟挂载函数
      const delay = Math.max(0, options.mountDelay ?? 100)
      const scheduleMount = () => {
        setTimeout(() => {
          // 只在文档页面显示评论
          const isDocPage = document.querySelector('.VPDoc') || document.querySelector('.vp-doc')
          if (isDocPage) {
            mount()
          }
        }, delay)
      }

      // 首次加载
      scheduleMount()

      // 路由切换时重新加载
      router.onAfterRouteChanged = () => {
        if (walineInstance) {
          walineInstance.destroy()
          walineInstance = null
        }
        scheduleMount()
      }

      // 清理函数
      if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', () => {
          if (walineInstance) {
            walineInstance.destroy()
          }
        })
      }
    }
  }
}

/** 昵称校验逻辑 */
function attachNicknameGuard(root: HTMLElement, guard: NicknameGuard) {
  const observer = new MutationObserver(() => {
    const nickInput = root.querySelector<HTMLInputElement>('input[name="nick"]')
    const submitBtn = root.querySelector<HTMLButtonElement>('.wl-submit')
    
    if (!nickInput || !submitBtn) return

    const hintId = 'waline-nick-hint'
    let hint = root.querySelector<HTMLDivElement>('#' + hintId)
    
    if (!hint) {
      hint = document.createElement('div')
      hint.id = hintId
      hint.style.cssText = 'margin: 8px 0; color: var(--vp-c-text-3); font-size: 12px;'
      nickInput.parentElement?.appendChild(hint)
    }

    const validateNick = () => {
      const nick = (nickInput.value || '').trim()
      
      // 如果是 GitHub 登录用户，跳过验证
      const isGithubUser = root.querySelector('.wl-user')
      if (isGithubUser) {
        hint.textContent = ''
        submitBtn.disabled = false
        return
      }

      // 执行自定义验证
      const isValid = 'pattern' in guard 
        ? guard.pattern.test(nick) 
        : guard.validate(nick)

      if (!nick) {
        hint.textContent = ''
        submitBtn.disabled = false // 让 Waline 自己处理空值
      } else if (!isValid) {
        hint.textContent = guard.hint || '格式：姓名 工号（例：张三 A12345）'
        hint.style.color = 'var(--vp-c-danger-1)'
        submitBtn.disabled = true
      } else {
        hint.textContent = '✓ 格式正确'
        hint.style.color = 'var(--vp-c-success-1)'
        submitBtn.disabled = false
      }
    }

    // 监听输入事件
    nickInput.removeEventListener('input', validateNick) // 避免重复绑定
    nickInput.addEventListener('input', validateNick)
    
    // 初始验证
    validateNick()
  })

  // 监听 DOM 变化
  observer.observe(root, { 
    childList: true, 
    subtree: true 
  })

  // 清理观察器
  setTimeout(() => observer.disconnect(), 5000) // 5秒后停止观察（性能考虑）
}

// ============================================
// .vitepress/theme/index.ts
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { useWalineComments } from './composables/useWalineComments'

// 样式优化
import './styles/waline-custom.css'

const theme: Theme = {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {})
  },
  enhanceApp(ctx) {
    // 注册 Waline 评论插件
    const walinePlugin = useWalineComments({
      // Waline 服务器地址（替换为你的）
      serverURL: 'https://your-waline.vercel.app',
      
      // 昵称验证规则（姓名 + 工号）
      nicknameGuard: {
        // 示例规则：中文姓名 + 空格 + 字母开头的工号
        pattern: /^[\u4e00-\u9fa5]{2,4}\s[A-Z]\d{4,6}$/,
        hint: '请输入格式：姓名 工号（例：张三 A12345）'
      },
      
      // 或使用函数验证（更灵活）
      // nicknameGuard: {
      //   validate: (nick: string) => {
      //     const parts = nick.split(' ')
      //     if (parts.length !== 2) return false
      //     const [name, id] = parts
      //     // 验证姓名：2-4个中文字符
      //     const nameValid = /^[\u4e00-\u9fa5]{2,4}$/.test(name)
      //     // 验证工号：字母开头+4-6位数字
      //     const idValid = /^[A-Z]\d{4,6}$/.test(id)
      //     return nameValid && idValid
      //   },
      //   hint: '格式：中文姓名(2-4字) + 空格 + 工号(字母+4-6位数字)'
      // },
      
      // 评论配置
      meta: ['nick', 'mail'],      // 显示的字段
      requiredMeta: ['nick', 'mail'], // 必填字段
      login: 'enable',              // 开启登录但不强制
      
      // 界面配置
      dark: 'auto',                 // 自动切换深色模式
      wordLimit: [0, 500],          // 字数限制
      pageSize: 10,                 // 每页评论数
      imageUploader: false,         // 禁用图片上传
      search: false,                // 禁用表情搜索（简化界面）
      
      // 挂载延迟（等待页面渲染）
      mountDelay: 200,
      
      // 反垃圾配置（可选）
      recaptchaV3Key: '', // 如需要可配置 reCAPTCHA
    })
    
    walinePlugin.enhanceApp(ctx)
  }
}

export default theme

