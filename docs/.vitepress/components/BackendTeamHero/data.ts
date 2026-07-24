/**
 * 后端团队成员数据配置
 * 顺序按工号先后排列
 * skills 字段标注负责的业务领域
 * bio 字段为个人座右铭名言
 */

export interface BackendTeamMember {
  name: string;
  avatar: string;
  role: string;
  employeeId?: string;
  department?: string;
  /** 座右铭 */
  bio?: string;
  skills?: string[];
}

export const BACKEND_TEAM_MEMBERS: BackendTeamMember[] = [
  {
    name: "何光明",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_HeGuangMing",
    role: "高级开发工程师",
    employeeId: "022193",
    department: "共享技术中心",
    bio: "三人行，必有我师焉。",
    skills: ["销售", "质量"],
  },
  {
    name: "谷茂彧",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_GuMaoYu&glasses=variant01&glassesProbability=100",
    role: "开发工程师",
    employeeId: "026266",
    department: "共享技术中心",
    bio: "君子坦荡荡，小人长戚戚。",
    skills: ["设备"],
  },
  {
    name: "冀振威",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_JiZhenWei&glasses=variant01&glassesProbability=100",
    role: "开发工程师",
    employeeId: "026526",
    department: "共享技术中心",
    bio: "言必信，行必果。",
    skills: ["安防"],
  },
  {
    name: "戴安",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_DaiAn",
    role: "高级开发工程师",
    employeeId: "026827",
    department: "共享技术中心",
    bio: "学而不思则罔，思而不学则殆。",
    skills: ["销售"],
  },
  {
    name: "张祥",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_ZhangXiang",
    role: "高级开发工程师",
    employeeId: "026828",
    department: "共享技术中心",
    bio: "知之者不如好之者，好之者不如乐之者。",
    skills: ["质量"],
  },
  {
    name: "黄鹏飞",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_HuangPengFei&glasses=variant01&glassesProbability=100",
    role: "开发工程师",
    employeeId: "027489",
    department: "共享技术中心",
    bio: "苟日新，日日新，又日新。",
    skills: ["安全"],
  },
  {
    name: "邓守彬",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_DengShouBin",
    role: "开发工程师",
    employeeId: "028134",
    department: "共享技术中心",
    bio: "知者不惑，仁者不忧，勇者不惧。",
    skills: ["生产"],
  },
  {
    name: "钟文",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_ZhongWen",
    role: "高级开发工程师",
    employeeId: "408967",
    department: "共享技术中心",
    bio: "海纳百川，有容乃大；壁立千仞，无欲则刚。",
    skills: ["综合"],
  },
  {
    name: "杨天广",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_YangTianGuang",
    role: "高级开发工程师",
    employeeId: "409102",
    department: "信息化中心",
    bio: "穷则独善其身，达则兼济天下。",
    skills: ["生产"],
  },
  {
    name: "潘超越",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=PanChaoYueBig",
    role: "开发工程师",
    employeeId: "409332",
    department: "共享技术中心",
    bio: "读万卷书，行万里路。",
    skills: ["主数据"],
  },
  {
    name: "张杰",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_ZhangJie",
    role: "开发工程师",
    employeeId: "409336",
    department: "共享技术中心",
    bio: "敏而好学，不耻下问。",
    skills: ["成本"],
  },
  {
    name: "罗栋楠",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_LuoDongNan",
    role: "开发工程师",
    employeeId: "409337",
    department: "共享技术中心",
    bio: "玉不琢，不成器；人不学，不知道。",
    skills: ["质量"],
  },
  {
    name: "肖斌",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_XiaoBin",
    role: "高级开发工程师",
    employeeId: "409339",
    department: "共享技术中心",
    bio: "泰山不让土壤，故能成其大；河海不择细流，故能就其深。",
    skills: ["生产", "成本"],
  },
  {
    name: "马钧",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_MaJun",
    role: "开发工程师",
    employeeId: "409342",
    department: "共享技术中心",
    bio: "欲穷千里目，更上一层楼。",
    skills: ["工程", "供应链", "综合"],
  },
  {
    name: "王云一",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_WangYunYi",
    role: "开发工程师",
    employeeId: "409352",
    department: "共享技术中心",
    bio: "不愤不启，不悱不发。",
    skills: ["工程"],
  },
  {
    name: "奚文",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_XiWen",
    role: "高级开发工程师",
    employeeId: "409668",
    department: "共享技术中心",
    bio: "纸上得来终觉浅，绝知此事要躬行。",
    skills: ["成本"],
  },
  {
    name: "李杰",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_LiJie",
    role: "开发工程师",
    employeeId: "409821",
    department: "共享技术中心",
    bio: "临渊羡鱼，不如退而结网。",
    skills: ["成本"],
  },
  {
    name: "丁世泰",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_DingShiTai",
    role: "高级开发工程师",
    employeeId: "409946",
    department: "共享技术中心",
    bio: "操千曲而后晓声，观千剑而后识器。",
    skills: ["生产"],
  },
  {
    name: "吴多粒",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_WuDuoLi",
    role: "开发工程师",
    employeeId: "410094",
    department: "共享技术中心",
    bio: "青，取之于蓝而青于蓝；冰，水为之而寒于水。",
    skills: ["成本"],
  },
];
