/**
 * 团队成员数据配置
 * bio 字段为个人座右铭名言
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
  /** 座右铭 */
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
    name: "李嘉诚",
    avatar: "/avatars/d8-6ce59dd8c6d4.svg",
    role: "前端工程师",
    employeeId: "027015",
    department: "共享技术中心",
    bio: "操千曲而后晓声，观千剑而后识器。",
    skills: ["前端开发", "PC 端"],
  },
  {
    name: "朱祥",
    avatar: "/avatars/d8-58ae4a4f51c6.svg",
    role: "全栈工程师",
    employeeId: "025877",
    department: "平台室",
    bio: "大道至简",
    skills: ["平台架构", "低代码", "性能优化"],
  },
  {
    name: "胥庆玉",
    avatar: "/avatars/d8-4639a74e1e21.svg",
    role: "前端工程师",
    employeeId: "026117",
    department: "共享技术中心",
    bio: "世上无难事，只要肯登攀。",
    skills: ["成本", "采购", "园区"],
  },
  {
    name: "仲于",
    avatar: "/avatars/d8-ebc222b9e809.svg",
    role: "全栈工程师",
    employeeId: "026397",
    department: "共享技术中心",
    bio: "千里之行，始于足下。",
    skills: ["销售"],
  },
  {
    name: "谢飞",
    avatar: "/avatars/d8-c3bb95264a17.svg",
    role: "前端工程师",
    employeeId: "026789",
    department: "平台室",
    bio: "工欲善其事，必先利其器。",
    skills: ["组件库", "工程化"],
  },
  {
    name: "尹华",
    avatar: "/avatars/d8-66ab1c162928.svg",
    role: "前端工程师",
    employeeId: "028129",
    department: "共享技术中心",
    bio: "天行健，君子以自强不息。",
    skills: ["生产"],
  },
  {
    name: "陈竹林",
    avatar: "/avatars/d8-45f9d06ae18a.svg",
    role: "前端工程师",
    employeeId: "028130",
    department: "共享技术中心",
    bio: "长风破浪会有时，直挂云帆济沧海。",
    skills: ["环保"],
  },
  {
    name: "袁茂超",
    avatar: "/avatars/d8-404b5f112c47.svg",
    role: "前端工程师",
    employeeId: "028138",
    department: "共享技术中心",
    bio: "业精于勤，荒于嬉；行成于思，毁于随。",
    skills: ["设备"],
  },
  {
    name: "张东",
    avatar: "/avatars/d8-fcff9d2a61bd.svg",
    role: "前端工程师",
    employeeId: "409321",
    department: "共享技术中心",
    bio: "宝剑锋从磨砺出，梅花香自苦寒来。",
    skills: ["物流", "仓储", "3D可视化"],
  },
  {
    name: "杨晨誉",
    avatar: "/avatars/d8-a368c6ca2233.svg",
    role: "全栈工程师",
    employeeId: "409322",
    department: "共享技术中心",
    bio: "会当凌绝顶，一览众山小。",
    skills: ["业务架构", "规范体系"],
  },
  {
    name: "赵成刚",
    avatar: "/avatars/d8-f77f90f3d873.svg",
    role: "前端工程师",
    employeeId: "409324",
    department: "共享技术中心",
    bio: "路漫漫其修远兮，吾将上下而求索。",
    skills: ["物流", "仓储", "采购", "供应链"],
  },
  {
    name: "曹翔",
    avatar: "/avatars/d8-af3c86b0acbe.svg",
    role: "前端工程师",
    employeeId: "409333",
    department: "共享技术中心",
    bio: "志当存高远。",
    skills: ["采购", "仓储", "供应链"],
  },
  {
    name: "董亚婷",
    avatar:
      "/avatars/d8-c717dcab35e6.svg",
    role: "前端工程师",
    employeeId: "409334",
    department: "共享技术中心",
    bio: "静以修身，俭以养德。",
    skills: ["设备", "PMS", "供应链"],
  },
  {
    name: "马佳瑞",
    avatar: "/avatars/d8-eb49f2bc7fd1.svg",
    role: "全栈工程师",
    employeeId: "409338",
    department: "共享技术中心",
    bio: "博观而约取，厚积而薄发。",
    skills: ["质量", "供应链", "物流", "仓储"],
  },
  {
    name: "赵保山",
    avatar: "/avatars/d8-899e176b5eb5.svg",
    role: "全栈工程师",
    employeeId: "409345",
    department: "共享技术中心",
    bio: "锲而不舍，金石可镂。",
    skills: ["生产", "供应链", "人资", "仓储"],
  },
  {
    name: "陈晶华",
    avatar:
      "/avatars/d8-63455b4f1003.svg",
    role: "前端工程师",
    employeeId: "409347",
    department: "共享技术中心",
    bio: "百丈竿头须进步，十方世界是全身。",
    skills: ["物流", "采销", "生产", "供应链"],
  },
];
