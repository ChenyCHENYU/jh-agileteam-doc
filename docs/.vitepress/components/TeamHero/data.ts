/*
 * @Author: ChenYu ycyplus@gmail.com
 * @Date: 2026-02-01 23:49:07
 * @LastEditors: ChenYu ycyplus@gmail.com
 * @LastEditTime: 2026-02-04 14:02:47
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
  /** 代表贡献 */
  spotlight?: string;
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
    role: "全栈工程师",
    employeeId: "025877",
    department: "信息化中心",
    bio: "专注于前端架构设计与性能优化",
    spotlight: "主导平台前端架构设计，落地低代码与性能优化体系",
    skills: ["平台架构", "低代码", "性能优化"],
  },
  {
    name: "胥庆玉",
    avatar:
      "https://api.dicebear.com/8.x/notionists/svg?seed=LongHair06&beardProbability=0",
    role: "前端工程师",
    employeeId: "026117",
    department: "信息化中心",
    bio: "专注于业务理解与高效开发",
    spotlight: "深耕成本、采购、园区多模块，业务覆盖面广",
    skills: ["成本", "采购", "园区"],
  },
  {
    name: "仲于",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=ZhongYu",
    role: "全栈工程师",
    employeeId: "026397",
    department: "信息化中心",
    bio: "熟悉销售、质量领域，3D可视化技术钻研中",
    spotlight: "负责销售模块全链路，探索 3D 可视化技术落地",
    skills: ["销售"],
  },
  {
    name: "谢飞",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=XieFei",
    role: "前端工程师",
    employeeId: "026789",
    department: "信息化中心",
    bio: "热衷于组件化开发与工程化实践",
    spotlight: "主导基础组件库建设，推进前端工程化实践",
    skills: ["组件库", "工程化"],
  },
  {
    name: "尹华",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=YinHua",
    role: "前端工程师",
    employeeId: "028129",
    department: "信息化中心",
    bio: "他说，这个人很懒，什么也没留下",
    spotlight: "专注生产域业务开发",
    skills: ["生产"],
  },
  {
    name: "张东",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=RuiHan",
    role: "前端工程师",
    employeeId: "409321",
    department: "信息化中心",
    bio: "只要拼不死，就往死里拼",
    spotlight: "深耕物流仓储领域，推进 3D 可视化技术落地",
    skills: ["物流", "仓储", "3D可视化"],
  },
  {
    name: "杨晨誉",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=YangChenYuNew6",
    role: "全栈工程师",
    employeeId: "409322",
    department: "信息化中心",
    bio: "聚焦于能效同时热爱开源与技术沉淀",
    spotlight: "主导 AI 工程化体系设计，建立团队规范与效能体系",
    skills: ["业务架构", "规范体系"],
  },
  {
    name: "赵成刚",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=QingYao",
    role: "前端工程师",
    employeeId: "409324",
    department: "信息化中心",
    bio: "快乐编码，快乐捞钱",
    spotlight: "覆盖物流、仓储、采购、供应链多域稳定交付",
    skills: ["物流", "仓储", "采购", "供应链"],
  },
  {
    name: "曹翔",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=LinaZhao",
    role: "前端工程师",
    employeeId: "409333",
    department: "信息化中心",
    bio: "人若有志，万事可为",
    spotlight: "专注采购仓储与供应链模块开发",
    skills: ["采购", "仓储", "供应链"],
  },
  {
    name: "董亚婷",
    avatar:
      "https://api.dicebear.com/8.x/notionists/svg?seed=LongHair05&beardProbability=0",
    role: "前端工程师",
    employeeId: "409334",
    department: "信息化中心",
    bio: "爱敲代码，糊涂时读书，独处时思考",
    spotlight: "负责设备、PMS 与供应链系统全链路开发",
    skills: ["设备", "PMS", "供应链"],
  },
  {
    name: "马佳瑞",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=SophiaLady",
    role: "全栈工程师",
    employeeId: "409338",
    department: "信息化中心",
    bio: "融合AI赋能业务全链路，兼顾前后端一体化落地",
    spotlight: "融合 AI 赋能业务链路，前后端一体化落地实践",
    skills: ["质量", "供应链", "物流", "仓储"],
  },
  {
    name: "赵保山",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=choice008",
    role: "全栈工程师",
    employeeId: "409345",
    department: "信息化中心",
    bio: "专注于写优雅的代码",
    spotlight: "覆盖生产、供应链、人资多域，注重代码质量与可维护性",
    skills: ["生产", "供应链", "人资", "仓储"],
  },
  {
    name: "陈晶华",
    avatar:
      "https://api.dicebear.com/8.x/notionists/svg?seed=LongHair09&beardProbability=0",
    role: "前端工程师",
    employeeId: "409347",
    department: "信息化中心",
    bio: "所有的胜利都是有备而来",
    spotlight: "横跨物流、采销、生产多域，迭代效率稳定高效",
    skills: ["物流", "采销", "生产", "供应链"],
  },
];
