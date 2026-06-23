import { GlossaryTerm } from '@/types';

export const glossaryTerms: GlossaryTerm[] = [
  { id: 'g-1', term: 'Agentic AI', chinese: '智能体式 AI', definition: '能够自主规划、决策和执行多步骤任务的 AI 系统，超越简单的问答式交互。', example: 'HR 使用 Agentic AI 自动完成从简历筛选到面试安排的全流程。', relatedTerms: ['AI Agent', 'Orchestrator'], firstSeen: '2026-06-14' },
  { id: 'g-2', term: 'AI Orchestrator', chinese: 'AI 编排师', definition: 'HR 新角色——不再直接使用 AI 工具，而是设计和编排多个 AI Agent 之间的协作流程。', example: 'AI Orchestrator 协调招聘 Agent、培训 Agent 和绩效 Agent 形成端到端 HR 工作流。', relatedTerms: ['Agentic AI', 'HR Business Partner'], firstSeen: '2026-06-14' },
  { id: 'g-3', term: 'AI Mindset', chinese: 'AI 心态', definition: '组织和个人对 AI 的底层信念和态度，决定 AI 工具能否真正被采用。区别于 AI Skillset（技能）。', example: '一个有 AI Mindset 的团队不会问"AI 会不会替代我"，而是问"AI 能帮我做什么新的事情"。', relatedTerms: ['Mindset > Skillset'], firstSeen: '2026-06-14' },
  { id: 'g-4', term: 'Human-in-the-Loop', chinese: '人在回路中', definition: 'AI 系统在执行关键决策时，必须有人类审核和干预的机制。', example: 'AI 生成的绩效评估结果必须经过直属管理者审核后才能生效。', relatedTerms: ['AI Agent'], firstSeen: '2026-06-14' },
  { id: 'g-5', term: 'Talent-to-Value', chinese: '人才价值转化', definition: '将员工的 AI 技能和学习能力转化为可衡量的业务价值的框架。', example: '通过 Talent-to-Value 框架，HR 可以量化 AI 培训投入的 ROI。', relatedTerms: ['AI Mindset'], firstSeen: '2026-06-14' },
  { id: 'g-6', term: 'AI Shadow Usage', chinese: 'AI 影子使用', definition: '员工在工作中使用 AI 工具但不向组织报告的现象，类似于"影子 IT"。', example: '调研发现 72% 的员工在用 AI，但自报率仅 38%——差距就是 AI Shadow Usage。', relatedTerms: ['AI Mindset'], firstSeen: '2026-06-14' },
  { id: 'g-7', term: 'Care Squeeze', chinese: '看护挤压', definition: '员工因家庭看护责任（子女/老人）导致工作时间弹性化、隐性缺勤增加的现象。', example: '35-45 岁员工因看护责任导致的隐性缺勤增加了 18%，HR 需要将看护时间纳入 PTO 弹性池。', relatedTerms: [], firstSeen: '2026-06-14' },
  { id: 'g-8', term: 'Copilot Stage', chinese: '副驾驶阶段', definition: '企业 AI 应用的第 1 阶段——AI 作为个人助手辅助工作，但不改变工作流程。', example: '85% 的企业仍处于 Copilot 阶段，员工各自使用 ChatGPT 辅助写作和编程。', relatedTerms: ['Agent Stage', 'Orchestrator Stage'], firstSeen: '2026-06-14' },
  { id: 'g-9', term: 'Agent Stage', chinese: '智能体阶段', definition: '企业 AI 应用的第 2 阶段——AI Agent 能自主完成多步骤任务，需要重新设计工作流程。', example: '进入 Agent 阶段的企业仅占 3%，需要专职 AI 工程团队支持。', relatedTerms: ['Copilot Stage', 'Orchestrator Stage', 'AI Orchestrator'], firstSeen: '2026-06-14' },
  { id: 'g-10', term: 'J-Curve Effect', chinese: 'J 曲线效应', definition: 'AI 投资初期生产力下降（学习成本），中期（3-5 年）才开始兑现的现象。', example: 'NBER 研究显示 AI 部署前 18 个月生产力下降 5-8%，第 5 年才达到 15-25% 提升。', relatedTerms: ['Talent-to-Value'], firstSeen: '2026-06-14' },
  { id: 'g-11', term: 'Multi-Source Baseline', chinese: '多源基线', definition: '每份报告必须覆盖至少 3 类不同来源（咨询/学术/VC/媒体等），以确保视角多元、避免偏见。', example: '本站要求每份日报命中 >= 3 类来源，5 类为达标基线。', relatedTerms: [], firstSeen: '2026-06-14' },
  { id: 'g-12', term: 'Counter-Signal', chinese: '反方信号', definition: '对每个强主张必须配对反方实证，避免单一视角偏见。', example: 'VC 预测"2027 年 AI 替代 30% 工作"，反方信号是 NBER 的"2031-2033 才能兑现"。', relatedTerms: ['Multi-Source Baseline'], firstSeen: '2026-06-14' },
];
