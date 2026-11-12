/**
 * 团队成员共享类型（单一类型源）
 * 四个团队 data.ts 与 AuthorTag 共用，避免同一"成员"形状被重复定义。
 */

/** 成员基型：所有团队数据与作者标签的公共形状 */
export interface WallMember {
  /** 成员名称 */
  name: string;
  /** 头像本地路径（/avatars/*.svg，由 localize-avatars 生成） */
  avatar: string;
  /** 职位/角色 */
  role: string;
  /** 工号 */
  employeeId?: string;
  /** 所属部门 */
  department?: string;
  /** 座右铭 */
  bio?: string;
  /** 技能标签 */
  skills?: string[];
}
