<script lang="ts" setup>
import TeamWall from "../TeamWall/index.vue";
import { BUSINESS_TEAM_MEMBERS, DOMAINS } from "./data";

/**
 * 业务团队英雄墙：TeamWall 的领域分组变体
 * 领域徽章配色 + 按领域分组 + 角色行展示。
 */
const domainColor: Record<string, string> = {
  生产领域: "var(--vp-c-brand-1, #3b82f6)",
  销售领域: "var(--vp-c-yellow-1, #d97706)",
  质量领域: "var(--vp-c-green-1, #16a34a)",
  成本领域: "var(--vp-c-indigo-1, #6366f1)",
  安全领域: "var(--vp-c-red-1, #dc2626)",
  安防领域: "var(--vp-c-orange-1, #ea580c)",
  物流领域: "var(--vp-c-teal-1, #0d9488)",
  采购领域: "var(--vp-c-purple-1, #9333ea)",
  综合管理: "var(--vp-c-slate-1, #64748b)",
};
</script>

<template>
  <TeamWall
    :members="BUSINESS_TEAM_MEMBERS"
    :group-by="(m) => m.domain ?? '其他'"
    :group-order="[...DOMAINS]"
    :group-color="domainColor"
    title="团队英雄墙"
    note="📢 未知或者信息错漏的请相关伙伴告知补充，目前顺序按工号先后排列"
  />
</template>
