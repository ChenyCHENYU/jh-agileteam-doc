/**
 * 后端团队成员数据配置
 * 顺序按工号先后排列
 */

export interface BackendTeamMember {
  name: string;
  avatar: string;
  role: string;
  employeeId?: string;
  department?: string;
  bio?: string;
  /** 代表贡献 */
  spotlight?: string;
  skills?: string[];
}

export const BACKEND_TEAM_MEMBERS: BackendTeamMember[] = [
  {
    name: "何光明",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_HeGuangMing",
    role: "高级开发工程师",
    employeeId: "022193",
    department: "共享技术中心",
  },
  {
    name: "戴安",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_DaiAn",
    role: "高级开发工程师",
    employeeId: "026827",
    department: "信息化中心",
  },
  {
    name: "张祥",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_ZhangXiang",
    role: "高级开发工程师",
    employeeId: "026828",
    department: "信息化中心",
  },
  {
    name: "钟文",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_ZhongWen",
    role: "高级开发工程师",
    employeeId: "408967",
    department: "信息化中心",
  },
  {
    name: "杨天广",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_YangTianGuang",
    role: "高级开发工程师",
    employeeId: "409102",
    department: "信息化中心",
  },
  {
    name: "张杰",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_ZhangJie",
    role: "开发工程师",
    employeeId: "409336",
    department: "共享技术中心",
  },
  {
    name: "罗栋楠",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_LuoDongNan",
    role: "开发工程师",
    employeeId: "409337",
    department: "共享技术中心",
  },
  {
    name: "肖斌",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_XiaoBin",
    role: "高级开发工程师",
    employeeId: "409339",
    department: "共享技术中心",
  },
  {
    name: "马钧",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_MaJun",
    role: "开发工程师",
    employeeId: "409342",
    department: "共享技术中心",
  },
  {
    name: "王云一",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_WangYunYi",
    role: "开发工程师",
    employeeId: "409352",
    department: "共享技术中心",
  },
  {
    name: "奚文",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_XiWen",
    role: "高级开发工程师",
    employeeId: "409668",
    department: "信息化中心",
  },
  {
    name: "丁世泰",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=backend_DingShiTai",
    role: "高级开发工程师",
    employeeId: "409946",
    department: "信息化中心",
  },
];
