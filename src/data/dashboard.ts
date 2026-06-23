import { DashboardSnapshot } from '@/types';

export const dashboardSnapshot: DashboardSnapshot = {
  date: '2026-06-23',
  kpis: [
    { id: 'kpi-1', label: '全球 AI 投资 (Q2)', value: 28, unit: '亿美元', change: -15, changeLabel: '同比', color: 'bg-blue-500', date: '2026-06-23' },
    { id: 'kpi-2', label: '科技行业裁员 (H1)', value: 23, unit: '% 增长', change: 23, changeLabel: '同比', color: 'bg-red-500', date: '2026-06-23' },
    { id: 'kpi-3', label: 'AI 工具采用率', value: 72, unit: '%', change: 18, changeLabel: '环比', color: 'bg-green-500', date: '2026-06-23' },
    { id: 'kpi-4', label: 'AI 自报率', value: 38, unit: '%', change: 5, changeLabel: '环比', color: 'bg-amber-500', date: '2026-06-23' },
    { id: 'kpi-5', label: 'Agent 阶段企业', value: 3, unit: '%', change: 1.5, changeLabel: '环比', color: 'bg-purple-500', date: '2026-06-23' },
    { id: 'kpi-6', label: 'AI 生产力兑现期', value: 2031, unit: '年', change: 0, changeLabel: 'NBER 预估', color: 'bg-indigo-500', date: '2026-06-23' },
  ],
  trends: [
    {
      label: 'AI 投资趋势 (季度/亿美元)',
      data: [
        { date: '2025 Q1', value: 35 }, { date: '2025 Q2', value: 38 }, { date: '2025 Q3', value: 42 },
        { date: '2025 Q4', value: 40 }, { date: '2026 Q1', value: 33 }, { date: '2026 Q2', value: 28 },
      ],
    },
    {
      label: 'AI 工具采用率 vs 自报率 (%)',
      data: [
        { date: '2025 Q1', value: 45 }, { date: '2025 Q2', value: 52 }, { date: '2025 Q3', value: 58 },
        { date: '2025 Q4', value: 63 }, { date: '2026 Q1', value: 68 }, { date: '2026 Q2', value: 72 },
      ],
    },
  ],
  detailTables: [
    {
      id: 'dt-investment',
      title: '全球 AI 投资明细 (2026 Q2)',
      emoji: '💰',
      columns: ['指标', '数值', '同比变化', '数据来源', 'HR 影响'],
      rows: [
        { indicator: '生成式 AI', value: '9.2 亿', yoyChange: '-22%', source: 'CB Insights', impact: 'AI 岗位需求激增，传统内容团队缩编' },
        { indicator: 'AI 基础设施', value: '7.5 亿', yoyChange: '+8%', source: 'PitchBook', impact: '云计算/芯片工程师薪资上涨 30%' },
        { indicator: 'AI 安全与治理', value: '3.8 亿', yoyChange: '+45%', source: 'Stanford HAI', impact: '新兴岗位：AI 伦理官、模型审计师' },
        { indicator: '企业 AI 应用', value: '4.1 亿', yoyChange: '-18%', source: 'Gartner', impact: 'HR SaaS 整合加速，HRIS 岗位转型' },
        { indicator: '自动驾驶/机器人', value: '2.6 亿', yoyChange: '-35%', source: 'Crunchbase', impact: '硬件工程师需求回暖，但规模有限' },
        { indicator: 'AI 医疗/生物', value: '0.8 亿', yoyChange: '+12%', source: 'Rock Health', impact: '跨学科人才竞争加剧' },
      ],
      hrInsight: '投资重心从"广撒网"转向"深聚焦"——生成式 AI 和 AI 安全是两大增长极，HR 需重点关注 AI 伦理、模型审计等新兴岗位的招聘与培养。',
    },
    {
      id: 'dt-layoff',
      title: '科技行业裁员明细 (2026 H1)',
      emoji: '📉',
      columns: ['公司', '裁员人数', '占员工比', '数据来源', 'HR 启示'],
      rows: [
        { indicator: 'Meta', value: '3,600', yoyChange: '5%', source: '公开声明', impact: '重组 AI 部门，"效率年"战略延续' },
        { indicator: 'Google', value: '2,800', yoyChange: '3%', source: 'Bloomberg', impact: '裁减支持岗，增招 AI 工程师' },
        { indicator: 'Microsoft', value: '1,900', yoyChange: '2%', source: 'Reuters', impact: '游戏部门整合，非核心业务剥离' },
        { indicator: 'Amazon', value: '2,100', yoyChange: '4%', source: 'TechCrunch', impact: '仓储自动化替代 + 管理层扁平化' },
        { indicator: 'Salesforce', value: '1,200', yoyChange: '6%', source: 'CNBC', impact: 'AI-first 战略下岗位重新配置' },
        { indicator: 'Intel', value: '4,500', yoyChange: '8%', source: 'WSJ', impact: '代工业务收缩，聚焦先进制程' },
        { indicator: '其他 (合计)', value: '6,900', yoyChange: '—', source: 'Layoffs.fyi', impact: '中小企业 AI 转型中的结构性调整' },
      ],
      hrInsight: '裁员并非"缩减"而是"换血"——科技巨头同步扩招 AI 岗位。HR 的关键任务是内部技能重塑 (reskilling) 和人才结构转型，而非简单的增减员。',
    },
    {
      id: 'dt-adoption',
      title: 'AI 工具采用率明细 (按职能)',
      emoji: '🤖',
      columns: ['职能领域', '采用率', '环比变化', '数据来源', 'HR 行动建议'],
      rows: [
        { indicator: '软件工程', value: '89%', yoyChange: '+5pp', source: 'GitHub/Stack Overflow', impact: 'Copilot 类工具已成标配' },
        { indicator: '客户服务', value: '76%', yoyChange: '+8pp', source: 'Gartner', impact: 'AI 客服坐席替代率持续提升' },
        { indicator: '市场营销', value: '71%', yoyChange: '+12pp', source: 'HubSpot', impact: '内容生成/SEO 优化自动化加速' },
        { indicator: '人力资源', value: '52%', yoyChange: '+9pp', source: 'Josh Bersin', impact: '招聘筛选、员工分析是主要场景' },
        { indicator: '财务/审计', value: '64%', yoyChange: '+7pp', source: 'Deloitte', impact: '自动化报表、异常检测普及' },
        { indicator: '法务/合规', value: '41%', yoyChange: '+11pp', source: 'Thomson Reuters', impact: '合同审查 AI 增长最快' },
        { indicator: '高管决策', value: '28%', yoyChange: '+6pp', source: 'McKinsey', impact: 'AI 辅助战略分析仍处于早期' },
      ],
      hrInsight: 'HR 自身采用率 (52%) 低于工程和市场部门，但增速可观。建议优先在招聘和员工分析场景深化 AI 应用，同时关注全员 AI 素养培训。',
    },
  ],
};
