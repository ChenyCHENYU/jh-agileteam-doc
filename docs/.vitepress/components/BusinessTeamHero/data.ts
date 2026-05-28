/**
 * 业务团队成员数据配置
 * 按工号先后排列，domain 字段区分业务领域
 */

export interface BusinessTeamMember {
  name: string;
  avatar: string;
  /** 职位/角色 */
  role: string;
  employeeId?: string;
  /** 所属业务领域 */
  domain: string;
  bio?: string;
}

export const BUSINESS_TEAM_MEMBERS: BusinessTeamMember[] = [
  // ── 销售领域 ──
  {
    name: "杨国栋",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=biz_YangGuoDong",
    role: "业务专员",
    employeeId: "018986",
    domain: "销售领域",
  },
  {
    name: "蔡正华",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=biz_CaiZhengHua",
    role: "业务专员",
    employeeId: "018996",
    domain: "质量领域",
  },
  // ── 生产领域 ──
  {
    name: "章劲柏",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=biz_ZhangJinBai",
    role: "生产领域专家",
    employeeId: "002181",
    domain: "生产领域",
  },
  {
    name: "高钰",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=biz_GaoYu",
    role: "业务专员",
    employeeId: "020900",
    domain: "生产领域",
  },
  {
    name: "朱鹏",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=biz_ZhuPeng",
    role: "业务专员",
    employeeId: "020920",
    domain: "生产领域",
  },
  {
    name: "史福荣",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=biz_ShiFuRong",
    role: "业务专员",
    employeeId: "023893",
    domain: "生产领域",
  },
  {
    name: "邓守彬",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=biz_DengShouBin",
    role: "业务专员",
    employeeId: "028134",
    domain: "生产领域",
  },
  // ── 销售领域（续）──
  {
    name: "潘灵连",
    avatar: "https://api.dicebear.com/8.x/notionists/svg?seed=biz_PanLingLian&beardProbability=0",
    role: "业务专员",
    employeeId: "409667",
    domain: "销售领域",
  },
];

/** 所有业务领域（按展示顺序） */
export const DOMAINS = ["生产领域", "质量领域", "销售领域"] as const;
