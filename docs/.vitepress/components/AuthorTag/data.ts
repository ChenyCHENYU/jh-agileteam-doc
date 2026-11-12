/**
 * AuthorTag 组件数据配置
 * 成员身份信息（头像/工号/部门等）从 components/roster.ts 派生——
 * 团队 data.ts 是唯一事实源，这里只维护"别名 → 成员"映射与少量扩展字段。
 */
import { AUTHOR_ALIAS, findMember } from "../roster";

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
  /** 作者名称或作者别名（单个作者） */
  author?: string | Author;
  /** 多个作者（数组形式） */
  authors?: (string | Author)[];
  /** 职位/角色（可选，会覆盖预定义的 role） */
  role?: string;
  /** 工号（可选） */
  employeeId?: string;
  /** 所属部门（可选） */
  department?: string;
  /** 是否显示头像 */
  showAvatar?: boolean;
}

/** 别名扩展字段（仅个别人有，如 GitHub 链接） */
const AUTHOR_EXTRAS: Record<string, Pick<Author, "github" | "email">> = {
  CHENY: { github: "ChenyCHENYU", email: "ycyplus@gmail.com" },
  ChenYu: { github: "ChenyCHENYU", email: "ycyplus@gmail.com" },
};

/**
 * 预定义作者列表：别名 → 花名派生（ChenYu 为 CHENY 的大小写变体，等价）
 */
export const AUTHORS: Record<string, Author> = Object.fromEntries(
  Object.entries(AUTHOR_ALIAS).map(([alias, key]) => {
    const member = findMember(key);
    if (!member) throw new Error(`AuthorTag: 别名 ${alias} 指向的成员不存在（键：${key}）`);
    return [alias, { ...member, ...AUTHOR_EXTRAS[alias] }];
  })
);

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
