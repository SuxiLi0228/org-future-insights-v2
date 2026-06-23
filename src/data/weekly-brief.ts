import { dailyReports } from './daily-reports';
import { companyUpdates } from './companies';
import { events } from './events';
import { transformCases } from './cases';

/** 本周关键词（用于引发思考） */
export const weeklyKeywords = [
  { label: 'AI 招聘军备竞赛', tag: 'AI扩招', path: '/companies?tab=hiring' },
  { label: 'Agent 安全边界', tag: 'Agent', path: '/companies' },
  { label: '业务+AI 复合人才', tag: 'hybrid', path: '/research' },
  { label: '柔性供应链重构', tag: 'AI供应链', path: '/cases' },
  { label: '欧盟 DSA 合规', tag: '合规', path: '/events' },
];

/** 本周信号统计 */
export const weeklyStats = {
  reportCount: dailyReports.filter((r) => r.date >= '2026-06-17').length,
  companyMoveCount: companyUpdates.filter((c) => c.date >= '2026-06-17').length,
  newCasesCount: transformCases.filter((c) => c.date >= '2026-06-17').length,
  upcomingEventsCount: events.filter((e) => e.date >= '2026-06-23' && e.date <= '2026-06-30').length,
  aiJobPostingsCount: companyUpdates.reduce((sum, c) => sum + (c.jobPostings?.length || 0), 0),
};

/** 本周核心判断 */
export const weeklyInsight = `本周（6.17-6.23）组织与 AI 领域呈现三个明确趋势：

1. **AI 岗位招聘进入"军备竞赛"阶段**：Anthropic 60+ AI 研究岗、Amazon 扩招 8,000 AI/ML 岗的同时裁撤 12,000 运营岗，AI 人才争夺从"增量补充"升级为"结构性换血"。

2. **电商 AI 竞争从"价格战"转向"供应链+合规"双战场**：Shein 100 亿投资智能供应链、Temu 重金招聘 DSA 合规专家、Zalando 首创"AI 服装设计师"岗位，说明欧洲市场的合规门槛和柔性制造能力正在重塑竞争格局。

3. **复合型人才成为稀缺资源**："业务 + AI"岗位（AI 供应链经理、AI 制造总监、AI 时尚设计师）大量出现，传统 HR 的招聘框架难以匹配这类新角色。`;

/** 本周 HR 启示（含跨境电商延伸） */
export const weeklyInsights = [
  {
    id: 'wi-1',
    theme: 'AI 招聘军备竞赛',
    hrInsight: 'AI 人才争夺已从"增量补充"升级为"结构性换血"。Amazon 裁 12,000 运营岗同时招 8,000 AI/ML 岗，说明企业不是多招几个人，而是在重新定义岗位结构。',
    ecommerceExtension: '对跨境电商而言，核心战场不是招多少 AI 研究员，而是把 AI 能力嵌入到运营、供应链、合规等关键岗位。建议从"业务 + AI"复合人才入手，而不是盲目追高薪抢纯 AI 研究员。',
    link: '/companies?tab=hiring',
    linkText: '查看 AI 招聘动态',
  },
  {
    id: 'wi-2',
    theme: '复合型人才成为稀缺资源',
    hrInsight: 'Shein 的"AI 制造总监"、Zalando 的"AI 服装设计师"表明，未来稀缺的不是单一技术人才，而是能同时理解业务语言和 AI 能力边界的"双语人才"。',
    ecommerceExtension: '跨境电商的 AI 复合岗位应该集中在：AI 供应链经理、AI 买手/选品经理、AI 内容运营、AI 合规专员。JD 设计要把"业务 KPI"和"AI 协作能力"并列，而不是只写工具技能。',
    link: '/cases',
    linkText: '参考转型案例',
  },
  {
    id: 'wi-3',
    theme: 'AI 培训的首要障碍是心态',
    hrInsight: '某制造企业投入百万做全员 AI 培训，3 个月后采用率仅 15%。员工抗拒的不是工具，而是"学了就被替代"的恐惧。心理安全比技能训练更优先。',
    ecommerceExtension: '跨境电商团队普遍年轻化、流动性高，更需要在培训前明确"AI 是帮你做更多事，不是替代你"。可以先从减少重复性工作（如自动上架、智能客服）切入，让员工尝到甜头。',
    link: '/cases',
    linkText: '查看失败教训',
  },
  {
    id: 'wi-4',
    theme: 'AI 招聘工具的偏见风险被低估',
    hrInsight: '欧洲银行引入 AI 简历筛选后效率提升 60%，但审计发现女性通过率比男性低 18%。AI 工具会继承历史数据中的偏见，供应商的承诺不能替代独立审计。',
    ecommerceExtension: '跨境电商招聘常涉及多语言、多文化背景候选人，AI 筛选更容易产生地域、性别、语言偏见。建议在上线前做样本审计，并保留人工复核机制，尤其是在全球化扩张期。',
    link: '/cases',
    linkText: '查看案例',
  },
  {
    id: 'wi-5',
    theme: 'Agent 时代需要新的合规人才',
    hrInsight: 'Anthropic 在 Agent 岗位 JD 中明确要求"行为边界审计机制"，说明 AI Agent 越自主，越需要有人负责定义和监控它的行为边界。',
    ecommerceExtension: '跨境电商如果引入 AI Agent 做自动定价、客服、内容生成，必须同步配备"AI 合规 + 业务规则"人才。例如：Agent 自动降价不能低于成本价，AI 客服不能承诺无法兑现的物流时效。',
    link: '/companies?tab=hiring',
    linkText: '查看 Agent 岗位',
  },
  {
    id: 'wi-6',
    theme: '合规成本正在重塑竞争格局',
    hrInsight: 'Temu 在波兰/爱尔兰大量招聘 DSA 合规专家，说明进入欧盟市场时，合规不再是法务部门的边缘工作，而是需要专门团队和组织能力支撑的核心竞争力。',
    ecommerceExtension: '跨境电商从"铺货模式"转向"合规运营"，HR 需要提前储备：税务合规、数据隐私（GDPR）、产品安全、平台政策解读等人才。这些岗位未来会越来越像"业务合作伙伴"。',
    link: '/companies',
    linkText: '查看 Temu 动态',
  },
];

/** 本周重要信号来源 */
export const weeklySources = [
  'SHRM / HR Tech / Bersin 等 HR 大会动态',
  'Anthropic / OpenAI / Amazon / Temu / Shein 等公司动向',
  'NBER / McKinsey / Deloitte 等机构研究',
  'LinkedIn / 各公司官网 Career 板块招聘数据',
];
