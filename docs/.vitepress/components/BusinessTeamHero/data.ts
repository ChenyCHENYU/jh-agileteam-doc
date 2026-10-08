/**
 * 业务团队成员数据配置
 * 领域顺序：生产 → 销售 → 质量 → 成本 → 安全 → 安防 → 物流
 * 各领域内按工号先后排列
 * bio 字段为个人座右铭名言
 */

export interface BusinessTeamMember {
  name: string;
  avatar: string;
  /** 职位/角色 */
  role: string;
  employeeId?: string;
  /** 所属业务领域 */
  domain: string;
  /** 座右铭 */
  bio?: string;
}

export const BUSINESS_TEAM_MEMBERS: BusinessTeamMember[] = [
    {
    name: "章劲柏",
    avatar: "/avatars/d8-483874990632.svg",
    role: "生产领域专家",
    employeeId: "002181",
    domain: "生产领域",
    bio: "骐骥一跃，不能十步；驽马十驾，功在不舍。",
  },
  {
    name: "王强",
    avatar: "/avatars/d8-34de16a20fb7.svg",
    role: "高级项目经理",
    employeeId: "012176",
    domain: "采购领域",
    bio: "博学之，审问之，慎思之，明辨之，笃行之。",
  },
  {
    name: "杨孔政",
    avatar: "/avatars/d8-fc2b67412089.svg",
    role: "高级项目经理",
    employeeId: "017503",
    domain: "安防领域",
    bio: "凡事预则立，不预则废。",
  },
  {
    name: "杨国栋",
    avatar: "/avatars/d8-8a64a7f7373d.svg",
    role: "项目经理",
    employeeId: "018986",
    domain: "销售领域",
    bio: "千磨万击还坚劲，任尔东西南北风。",
  },
  {
    name: "蔡正华",
    avatar: "/avatars/d8-515b5ea8591e.svg",
    role: "项目经理",
    employeeId: "018996",
    domain: "质量领域",
    bio: "勿以恶小而为之，勿以善小而不为。",
  },
  {
    name: "高钰",
    avatar: "/avatars/d8-d9906a4ef323.svg",
    role: "业务经理",
    employeeId: "020900",
    domain: "生产领域",
    bio: "尺有所短，寸有所长；物有所不足，智有所不明。",
  },
  {
    name: "朱鹏",
    avatar: "/avatars/d8-f7c9d54f9387.svg",
    role: "业务经理",
    employeeId: "020920",
    domain: "生产领域",
    bio: "路遥知马力，日久见人心。",
  },
  {
    name: "张凯",
    avatar: "/avatars/d8-b9b6c8b0107b.svg",
    role: "项目经理",
    employeeId: "021523",
    domain: "物流领域",
    bio: "不畏浮云遮望眼，自缘身在最高层。",
  },
  {
    name: "龚熠",
    avatar: "/avatars/d8-f16adf5733a0.svg",
    role: "初级项目经理",
    employeeId: "022294",
    domain: "安防领域",
    bio: "宜未雨而绸缪，毋临渴而掘井。",
  },
  {
    name: "史福荣",
    avatar: "/avatars/d8-80bb9ca82d43.svg",
    role: "业务经理",
    employeeId: "023893",
    domain: "生产领域",
    bio: "地势坤，君子以厚德载物。",
  },
  {
    name: "陈小小",
    avatar: "/avatars/d8-45fe85660eb1.svg",
    role: "项目经理",
    employeeId: "027116",
    domain: "物流领域",
    bio: "海阔凭鱼跃，天高任鸟飞。",
  },
  {
    name: "丁云",
    avatar: "/avatars/d8-1073b06b72cf.svg",
    role: "高级项目经理",
    employeeId: "027264",
    domain: "物流领域",
    bio: "仰天大笑出门去，我辈岂是蓬蒿人。",
  },
  {
    name: "许峰",
    avatar: "/avatars/d8-56b12c50b682.svg",
    role: "项目经理",
    employeeId: "027707",
    domain: "安全领域",
    bio: "居安思危，思则有备，有备无患。",
  },
  {
    name: "陶夺旗",
    avatar: "/avatars/d8-da714e933756.svg",
    role: "初级项目经理",
    employeeId: "409328",
    domain: "物流领域",
    bio: "莫听穿林打叶声，何妨吟啸且徐行。",
  },
  {
    name: "白彬彬",
    avatar: "/avatars/d8-df356ea6d35a.svg",
    role: "项目经理",
    employeeId: "409353",
    domain: "采购领域",
    bio: "咬定青山不放松，立根原在破岩中。",
  },
  {
    name: "樊聪",
    avatar: "/avatars/d8-11a61c9082fa.svg",
    role: "业务经理",
    employeeId: "409354",
    domain: "综合管理",
    bio: "见贤思齐焉，见不贤而内自省也。",
  },
  {
    name: "潘灵连",
    avatar: "/avatars/d8-c39b502982bc.svg",
    role: "业务经理",
    employeeId: "409667",
    domain: "销售领域",
    bio: "绳锯木断，水滴石穿。",
  },
  {
    name: "柏旭",
    avatar: "/avatars/d8-1178f8305b37.svg",
    role: "联席部长",
    employeeId: "409753",
    domain: "成本领域",
    bio: "不积小流，无以成江海；不积跬步，无以至千里。",
  },
  {
    name: "周礼文",
    avatar: "/avatars/d8-62adfa85a3df.svg",
    role: "技术副总监",
    employeeId: "410236",
    domain: "成本领域",
    bio: "运筹帷幄之中，决胜千里之外。",
  },
];

/** 所有业务领域（按展示顺序） */
export const DOMAINS = [
  "生产领域",
  "销售领域",
  "质量领域",
  "成本领域",
  "采购领域",
  "安全领域",
  "安防领域",
  "物流领域",
  "综合管理",
] as const;
