/**
 * 测试团队成员数据
 * bio 字段为个人座右铭名言
 */

export interface TestTeamMember {
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
  /** 技能标签 */
  skills?: string[];
}

export const TEST_TEAM_MEMBERS: TestTeamMember[] = [
  {
    name: "胡波",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=HuBo",
    role: "测试工程师",
    employeeId: "025269",
    department: "共享技术中心",
    skills: ["测试工程"],
  },
  {
    name: "李星辉",
    avatar: "https://api.dicebear.com/8.x/lorelei/svg?seed=LiXingHui",
    role: "测试工程师",
    employeeId: "025271",
    department: "共享技术中心",
    skills: ["测试工程"],
  },
  {
    name: "王超",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=WangChao",
    role: "测试工程师",
    employeeId: "409351",
    department: "共享技术中心",
    skills: ["测试工程"],
  },
  {
    name: "常兴",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=ChangXing",
    role: "测试工程师 · wl-skills-test 维护者",
    employeeId: "025192",
    department: "共享技术中心",
    skills: ["测试工程", "自动化", "性能测试"],
  },
];
