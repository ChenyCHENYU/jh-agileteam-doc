/**
 * AuthorTag 组件数据配置
 */

/**
 * 作者信息接口
 */
export interface Author {
  /** 作者名称 */
  name: string;
  /** 作者头像 URL（可选） */
  avatar?: string;
  /** 作者邮箱（可选） */
  email?: string;
  /** GitHub 用户名（可选） */
  github?: string;
  /** 作者角色/职位（可选） */
  role?: string;
  /** 工号（可选） */
  employeeId?: string;
  /** 所属部门（可选） */
  department?: string;
  /** 自定义链接（可选） */
  link?: string;
}

/**
 * 组件属性接口
 */
export interface AuthorTagProps {
  /** 作者名称或作者 ID */
  author: string | Author;
  /** 职位/角色（可选，会覆盖预定义的 role） */
  role?: string;
  /** 工号（可选，默认 409322） */
  employeeId?: string;
  /** 所属部门（可选，默认 信息化部） */
  department?: string;
  /** 是否显示头像 */
  showAvatar?: boolean;
}

/**
 * 预定义作者列表
 * 可以根据团队成员进行配置
 */
export const AUTHORS: Record<string, Author> = {
  ChenYu: {
    name: "Chen Yu",
    avatar: "https://github.com/ChenyCHENYU.png",
    email: "ycyplus@gmail.com",
    github: "ChenyCHENYU",
    role: "资深开发工程师",
    employeeId: "409322",
    department: "信息化部",
  },
  ZhangSan: {
    name: "张三",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ZhangSan",
    role: "高级前端工程师",
    employeeId: "409323",
    department: "信息化部",
  },
};

/**
 * 获取作者信息
 * @param author - 作者名称或作者对象
 * @returns 作者信息对象
 */
export function getAuthorInfo(author: string | Author): Author {
  if (typeof author === "string") {
    return AUTHORS[author] || { name: author };
  }
  return author;
}

/**
 * 格式化日期
 * @param date - 日期字符串或 Date 对象
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * 计算阅读时间
 * @param content - 文章内容
 * @param wordsPerMinute - 每分钟阅读字数（默认 300）
 * @returns 预估阅读时间（分钟）
 */
export function calculateReadingTime(
  content: string,
  wordsPerMinute: number = 300
): number {
  // 移除 Markdown 标记
  const plainText = content
    .replace(/```[\s\S]*?```/g, "") // 代码块
    .replace(/`[^`]*`/g, "") // 行内代码
    .replace(/#{1,6}\s/g, "") // 标题
    .replace(/[*_~`]/g, ""); // 其他标记

  // 分别计算中文和英文字数
  const chineseChars = plainText.match(/[\u4e00-\u9fa5]/g)?.length || 0;
  const englishWords = plainText.match(/[a-zA-Z]+/g)?.length || 0;

  const totalWords = chineseChars + englishWords;
  return Math.ceil(totalWords / wordsPerMinute);
}
