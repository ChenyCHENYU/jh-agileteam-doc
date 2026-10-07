/**
 * 测试团队成员数据
 * bio 字段为个人座右铭名言（测试质量主题）
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
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=test_HuBo&beardProbability=30",
    role: "测试工程师",
    employeeId: "025269",
    department: "共享技术中心",
    bio: "质量不是测出来的，是构建出来的。",
    skills: ["功能测试", "用例设计"],
  },
  {
    name: "李星辉",
    avatar: "https://api.dicebear.com/8.x/lorelei/svg?seed=LiXingHuiFemale",
    role: "测试工程师",
    employeeId: "025271",
    department: "共享技术中心",
    bio: "测试不止于发现缺陷，更在于建立对质量的信心。",
    skills: ["测试方案", "场景分析"],
  },
  {
    name: "王超",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=test_WangChao&beardProbability=30",
    role: "测试工程师",
    employeeId: "409351",
    department: "共享技术中心",
    bio: "发现缺陷越早，修复代价越小。",
    skills: ["自动化测试", "Playwright"],
  },
  {
    name: "常兴",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=test_ChangXing&beardProbability=30",
    role: "测试工程师 · wl-skills-test 维护者",
    employeeId: "025192",
    department: "共享技术中心",
    bio: "程序测试可以证明缺陷存在，却无法证明缺陷不存在。",
    skills: ["自动化", "性能测试", "质量门禁"],
  },
];
