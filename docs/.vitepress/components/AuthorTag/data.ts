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
  /** 作者名称或作者 ID（单个作者） */
  author?: string | Author;
  /** 多个作者（数组形式） */
  authors?: (string | Author)[];
  /** 职位/角色（可选，会覆盖预定义的 role） */
  role?: string;
  /** 工号（可选，默认 409322） */
  employeeId?: string;
  /** 所属部门（可选，默认 共享技术中心） */
  department?: string;
  /** 是否显示头像 */
  showAvatar?: boolean;
}

/**
 * 预定义作者列表
 * 可以根据团队成员进行配置
 */
export const AUTHORS: Record<string, Author> = {
  CHENY: {
    name: "杨晨誉",
    avatar: "/avatars/d8-ab910605f593.svg",
    email: "ycyplus@gmail.com",
    github: "ChenyCHENYU",
    role: "资深开发工程师",
    employeeId: "409322",
    department: "共享技术中心",
  },
  YangTianGuang: {
    name: "杨天广",
    avatar: "/avatars/d8-968c3640cced.svg",
    role: "高级开发工程师",
    employeeId: "409102",
    department: "信息化中心",
  },
  ZhuXiang: {
    name: "朱祥",
    avatar: "/avatars/d8-58ae4a4f51c6.svg",
    role: "高级开发工程师",
    employeeId: "025877",
    department: "平台室",
  },
  XieFei: {
    name: "谢飞",
    avatar: "/avatars/d8-c3bb95264a17.svg",
    role: "高级开发工程师",
    employeeId: "026789",
    department: "平台室",
  },
  MaJiaRui: {
    name: "马佳瑞",
    avatar: "/avatars/d8-186da52e2c2b.svg",
    role: "开发工程师",
    employeeId: "409338",
    department: "共享技术中心",
  },
  ZhongYu: {
    name: "仲于",
    avatar: "/avatars/d8-ebc222b9e809.svg",
    role: "高级开发工程师",
    employeeId: "026397",
    department: "共享技术中心",
  },
  XuQingYu: {
    name: "胥庆玉",
    avatar: "/avatars/d8-d520b77f0419.svg",
    role: "高级开发工程师",
    employeeId: "026117",
    department: "共享技术中心",
  },
  ZhaoBaoShan: {
    name: "赵保山",
    avatar: "/avatars/d8-899e176b5eb5.svg",
    role: "开发工程师",
    employeeId: "409345",
    department: "共享技术中心",
  },
  YinHua: {
    name: "尹华",
    avatar: "/avatars/d8-66ab1c162928.svg",
    role: "开发工程师",
    employeeId: "028129",
    department: "共享技术中心",
  },
  ZhangXiang: {
    name: "张祥",
    avatar: "/avatars/d8-c41a5c29333a.svg",
    role: "高级开发工程师",
    employeeId: "026828",
    department: "共享技术中心",
  },
  DaiAn: {
    name: "戴安",
    avatar: "/avatars/d8-2508c1f9b762.svg",
    role: "高级开发工程师",
    employeeId: "026827",
    department: "共享技术中心",
  },
  ZhangJie: {
    name: "张杰",
    avatar: "/avatars/d8-b3b03f40ccec.svg",
    role: "开发工程师",
    employeeId: "409336",
    department: "共享技术中心",
  },
  PanChaoYue: {
    name: "潘超越",
    avatar: "/avatars/d8-31775c1614ce.svg",
    role: "开发工程师",
    employeeId: "409332",
    department: "共享技术中心",
  },
  ChangXing: {
    name: "常兴",
    avatar: "/avatars/d8-26d73ff23ba4.svg",
    role: "测试工程师",
    employeeId: "025192",
    department: "共享技术中心",
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

