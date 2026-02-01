/*
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2026-02-01 23:49:07
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2026-02-02 01:33:58
 * @FilePath: \jh-agileteam-doc\docs\.vitepress\components\TeamHero\data.ts
 * @Description:
 * Copyright (c) 2026 by CHENY, All Rights Reserved 😎.
 */
/**
 * 团队成员数据配置
 */

export interface TeamMember {
  /** 成员名称 */
  name: string;
  /** 头像 URL */
  avatar: string;
  /** 职位/角色 */
  role: string;
  /** 工号 */
  employeeId?: string;
  /** 所属部门 */
  department?: string;
  /** 个人简介 */
  bio?: string;
  /** GitHub 用户名 */
  github?: string;
  /** 邮箱 */
  email?: string;
  /** 技能标签 */
  skills?: string[];
}

/**
 * 团队成员列表
 */
export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "朱祥",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=ZhuXiang",
    role: "高级开发工程师",
    employeeId: "025877",
    department: "研发部",
    bio: "专注于前端架构设计与性能优化",
    skills: ["Vue", "React", "TypeScript", "性能优化"],
  },
  {
    name: "谢飞",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=XieFei",
    role: "高级开发工程师",
    employeeId: "026789",
    department: "研发部",
    bio: "热衷于组件化开发与工程化实践",
    skills: ["Vue3", "组件库", "Vite", "工程化"],
  },
  {
    name: "杨晨誉",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=choice006",
    role: "资深开发工程师",
    employeeId: "409322",
    department: "信息化部",
    bio: "全栈开发，热爱开源与技术分享",
    skills: ["Vue", "Node.js", "TypeScript", "全栈"],
  },
  {
    name: "赵保山",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=choice008",
    role: "前端开发工程师",
    department: "信息化部",
    bio: "专注于用户体验与交互设计",
    skills: ["Vue", "UI/UX", "动画", "Sass"],
  },
  {
    name: "马佳瑞",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=choice003",
    role: "前端开发工程师",
    department: "信息化部",
    bio: "致力于打造高质量的前端应用",
    skills: ["Vue", "Element Plus", "Echarts", "业务开发"],
  },
  {
    name: "仲于",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=ZhongYu",
    role: "前端开发工程师",
    department: "信息化部",
    bio: "追求代码质量与最佳实践",
    skills: ["JavaScript", "Vue", "代码规范", "测试"],
  },
  {
    name: "尹华",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=YinHua",
    role: "前端开发工程师",
    department: "信息化部",
    bio: "热爱学习新技术与创新",
    skills: ["Vue", "TypeScript", "微前端", "新技术"],
  },
  {
    name: "胥庆玉",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=XuQingYu",
    role: "前端开发工程师",
    department: "信息化部",
    bio: "专注于业务理解与高效开发",
    skills: ["Vue", "业务开发", "快速交付", "沟通协作"],
  },
];
