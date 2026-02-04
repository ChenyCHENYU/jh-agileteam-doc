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
    skills: ["平台架构", "低代码", "性能优化"],
  },
  {
    name: "胥庆玉",
    avatar:
      "https://api.dicebear.com/8.x/notionists/svg?seed=LongHair06&beardProbability=0",
    role: "高级开发工程师",
    employeeId: "026117",
    department: "信息化部",
    bio: "专注于业务理解与高效开发",
    skills: ["成本", "采购", "园区"],
  },
  {
    name: "仲于",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=ZhongYu",
    role: "高级开发工程师",
    employeeId: "026397",
    department: "信息化部",
    bio: "熟悉销售、质量领域，3D可视化技术钻研中",
    skills: ["销售"],
  },
  {
    name: "谢飞",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=XieFei",
    role: "高级开发工程师",
    employeeId: "026789",
    department: "研发部",
    bio: "热衷于组件化开发与工程化实践",
    skills: ["组件库", "工程化"],
  },
  {
    name: "尹华",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=YinHua",
    role: "开发工程师",
    employeeId: "028129",
    department: "信息化部",
    bio: "他说，这个人很懒，什么也没留下",
    skills: ["生产"],
  },
  {
    name: "张东",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=RuiHan",
    role: "开发工程师",
    employeeId: "409321",
    department: "信息化部",
    bio: "只要拼不死，就往死里拼",
    skills: ["物流", "仓储", "3D可视化"],
  },
  {
    name: "杨晨誉",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=YangChenYuNew6",
    role: "资深开发工程师",
    employeeId: "409322",
    department: "信息化部",
    bio: "聚焦于能效同时热爱开源与技术沉淀",
    skills: ["业务架构", "规范体系"],
  },
  {
    name: "赵成刚",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=QingYao",
    role: "开发工程师",
    employeeId: "409324",
    department: "信息化部",
    bio: "快乐编码，快乐捞钱",
    skills: ["物流", "仓储", "采购", "供应链"],
  },
  {
    name: "曹翔",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=LinaZhao",
    role: "开发工程师",
    employeeId: "409333",
    department: "信息化部",
    bio: "人若有志，万事可为",
    skills: ["采购", "仓储", "供应链"],
  },
  {
    name: "董亚婷",
    avatar:
      "https://api.dicebear.com/8.x/notionists/svg?seed=LongHair05&beardProbability=0",
    role: "开发工程师",
    employeeId: "409334",
    department: "信息化部",
    bio: "爱敲代码，糊涂时读书，独处时思考",
    skills: ["设备", "PMS", "供应链"],
  },
  {
    name: "马佳瑞",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=SophiaLady",
    role: "开发工程师",
    employeeId: "409338",
    department: "信息化部",
    bio: "融合AI赋能业务全链路，兼顾前后端一体化落地",
    skills: ["质量", "供应链", "物流", "仓储"],
  },
  {
    name: "赵保山",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=choice008",
    role: "开发工程师",
    employeeId: "409345",
    department: "信息化部",
    bio: "专注于写优雅的代码",
    skills: ["生产", "供应链", "人资", "仓储"],
  },
  {
    name: "陈晶华",
    avatar:
      "https://api.dicebear.com/8.x/notionists/svg?seed=LongHair09&beardProbability=0",
    role: "开发工程师",
    employeeId: "409347",
    department: "信息化部",
    bio: "所有的胜利都是有备而来",
    skills: ["物流", "采销", "生产", "供应链"],
  },
];
