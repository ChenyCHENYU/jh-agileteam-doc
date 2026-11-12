/**
 * 全员花名单一数据源
 * 以四个团队 data.ts 为权威来源（团队墙是头像/角色的第一展示位），
 * AuthorTag 按"别名 → 工号"从这里派生，杜绝同一人两处数据漂移
 * （历史上胥庆玉/杨晨誉/马佳瑞/常兴/杨天广的头像曾各自漂移）。
 * 新增成员：只需在对应团队 data.ts 加一条，这里登记别名即可。
 */
import type { WallMember } from "./types";
import { TEAM_MEMBERS } from "./TeamHero/data";
import { BACKEND_TEAM_MEMBERS } from "./BackendTeamHero/data";
import { TEST_TEAM_MEMBERS } from "./TestTeamHero/data";

/** 全员（按团队顺序扁平化；业务团队为领域专家制，不参与作者标签） */
export const ROSTER: WallMember[] = [...TEAM_MEMBERS, ...BACKEND_TEAM_MEMBERS, ...TEST_TEAM_MEMBERS];

/** 工号 → 成员 */
const BY_ID = new Map(ROSTER.filter((m) => m.employeeId).map((m) => [m.employeeId as string, m]));

/** 姓名 → 成员（同名兜底：后出现的覆盖，团队数据目前无同名） */
const BY_NAME = new Map(ROSTER.map((m) => [m.name, m]));

/** AuthorTag 别名 → 工号（md 中 author="..." 用的键） */
export const AUTHOR_ALIAS: Record<string, string> = {
  CHENY: "409322",
  ChenYu: "409322",
  ZhuXiang: "025877",
  XieFei: "026789",
  ZhongYu: "026397",
  XuQingYu: "026117",
  MaJiaRui: "409338",
  ZhaoBaoShan: "409345",
  YinHua: "028129",
  YangTianGuang: "409102",
  ZhangXiang: "026828",
  DaiAn: "026827",
  ZhangJie: "409336",
  PanChaoYue: "409332",
  ChangXing: "025192",
  HeGuangMing: "022193",
};

/** 按工号或姓名查成员 */
export function findMember(key: string): WallMember | undefined {
  return BY_ID.get(key) ?? BY_NAME.get(key);
}
