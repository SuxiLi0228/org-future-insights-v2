import { DashboardSnapshot } from '@/types';

export const dashboardSnapshot: DashboardSnapshot = {
    date: '2026-06-30',
    kpis: [
      {
        id: 'kpi-1',
        label: '全球 AI 投资 (Q2)',
        value: 31,
        unit: '亿美元',
        change: -10,
        changeLabel: '同比',
        color: 'bg-blue-500',
        date: '2026-06-30'
      },
      {
        id: 'kpi-2',
        label: '科技行业裁员 (H1)',
        value: 26,
        unit: '% 增长',
        change: 26,
        changeLabel: '同比',
        color: 'bg-red-500',
        date: '2026-06-30'
      },
      {
        id: 'kpi-3',
        label: 'AI 工具采用率',
        value: 74,
        unit: '%',
        change: 19,
        changeLabel: '环比',
        color: 'bg-green-500',
        date: '2026-06-30'
      },
      {
        id: 'kpi-4',
        label: 'AI 自报率',
        value: 40,
        unit: '%',
        change: 6,
        changeLabel: '环比',
        color: 'bg-amber-500',
        date: '2026-06-30'
      },
      {
        id: 'kpi-5',
        label: 'Agent 阶段企业',
        value: 4,
        unit: '%',
        change: 2,
        changeLabel: '环比',
        color: 'bg-purple-500',
        date: '2026-06-30'
      },
      {
        id: 'kpi-6',
        label: 'AI 生产力兑现期',
        value: 2031,
        unit: '年',
        change: 0,
        changeLabel: 'NBER 预估',
        color: 'bg-indigo-500',
        date: '2026-06-30'
      }
    ],
    trends: [
      {
        label: 'AI 投资趋势 (季度/亿美元)',
        data: [
          {
            date: '2025 Q1',
            value: 35
          },
          {
            date: '2025 Q2',
            value: 38
          },
          {
            date: '2025 Q3',
            value: 42
          },
          {
            date: '2025 Q4',
            value: 40
          },
          {
            date: '2026 Q1',
            value: 33
          },
          {
            date: '2026 Q2',
            value: 31
          }
        ]
      },
      {
        label: 'AI 工具采用率 vs 自报率 (%)',
        data: [
          {
            date: '2025 Q1',
            value: 45
          },
          {
            date: '2025 Q2',
            value: 52
          },
          {
            date: '2025 Q3',
            value: 58
          },
          {
            date: '2025 Q4',
            value: 63
          },
          {
            date: '2026 Q1',
            value: 68
          },
          {
            date: '2026 Q2',
            value: 74
          }
        ]
      }
    ],
    detailTables: [
      {
        id: 'dt-investment',
        title: '全球 AI 投资明细 (2026 Q2)',
        emoji: '💰',
        columns: [
          '指标',
          '数值',
          '同比变化',
          '数据来源',
          'HR 影响'
        ],
        rows: [
          {
            indicator: '生成式 AI',
            value: '10.5 亿',
            yoyChange: '-12%',
            source: 'CB Insights',
            impact: '应用层岗位扩张，基础模型团队收缩'
          },
          {
            indicator: 'AI 基础设施',
            value: '8.2 亿',
            yoyChange: '+12%',
            source: 'PitchBook',
            impact: '推理集群建设带动系统工程师需求翻倍'
          },
          {
            indicator: 'AI 安全与治理',
            value: '4.5 亿',
            yoyChange: '+52%',
            source: 'Stanford HAI',
            impact: '合规与风险管理岗位需求持续上升'
          },
          {
            indicator: '企业 AI 应用',
            value: '4.3 亿',
            yoyChange: '-15%',
            source: 'Gartner',
            impact: '企业级 AI 应用从试点进入规模化部署'
          },
          {
            indicator: '自动驾驶/机器人',
            value: '2.4 亿',
            yoyChange: '-38%',
            source: 'Crunchbase',
            impact: '资本向具身智能和工业机器人集中'
          },
          {
            indicator: 'AI 医疗/生物',
            value: '1.1 亿',
            yoyChange: '+18%',
            source: 'Rock Health',
            impact: 'AI 药物发现和临床辅助岗位增长'
          }
        ],
        hrInsight: '投资重心进一步向基础设施与治理倾斜——生成式 AI 应用层开始分化，HR 需关注 AI 产品经理、模型运维、合规审计等复合岗位。'
      },
      {
        id: 'dt-layoff',
        title: '科技行业裁员明细 (2026 H1)',
        emoji: '📉',
        columns: [
          '公司',
          '裁员人数',
          '占员工比',
          '数据来源',
          'HR 启示'
        ],
        rows: [
          {
            indicator: 'Meta',
            value: '4,200',
            yoyChange: '6%',
            source: '公开声明',
            impact: '继续精简非 AI 团队，加码智能眼镜'
          },
          {
            indicator: 'Google',
            value: '3,100',
            yoyChange: '4%',
            source: 'Bloomberg',
            impact: '搜索与广告部门重组，DeepMind 扩招'
          },
          {
            indicator: 'Microsoft',
            value: '2,400',
            yoyChange: '3%',
            source: 'Reuters',
            impact: 'Azure AI 团队扩张，传统销售岗压缩'
          },
          {
            indicator: 'Amazon',
            value: '2,500',
            yoyChange: '5%',
            source: 'TechCrunch',
            impact: 'Rivian 投资收缩，机器人仓储投入加大'
          },
          {
            indicator: 'Salesforce',
            value: '1,500',
            yoyChange: '7%',
            source: 'CNBC',
            impact: 'Agentforce 战略下岗位重新设计'
          },
          {
            indicator: 'Intel',
            value: '5,200',
            yoyChange: '9%',
            source: 'WSJ',
            impact: '芯片代工业务分拆传闻持续'
          },
          {
            indicator: '其他 (合计)',
            value: '8,300',
            yoyChange: '—',
            source: 'Layoffs.fyi',
            impact: '初创企业融资收紧导致持续调整'
          }
        ],
        hrInsight: '2026 H1 裁员规模继续扩大，但 AI 相关岗位仍是净增招聘区。HR 需要把裁员释放的预算向 AI 技能培训与核心人才保留倾斜。'
      },
      {
        id: 'dt-adoption',
        title: 'AI 工具采用率明细 (按职能)',
        emoji: '🤖',
        columns: [
          '职能领域',
          '采用率',
          '环比变化',
          '数据来源',
          'HR 行动建议'
        ],
        rows: [
          {
            indicator: '软件工程',
            value: '91%',
            yoyChange: '+6pp',
            source: 'GitHub/Stack Overflow',
            impact: 'AI 编码助手渗透率接近饱和'
          },
          {
            indicator: '客户服务',
            value: '79%',
            yoyChange: '+9pp',
            source: 'Gartner',
            impact: '语音与多模态客服 Agent 快速落地'
          },
          {
            indicator: '市场营销',
            value: '74%',
            yoyChange: '+13pp',
            source: 'HubSpot',
            impact: 'AI 内容生成与广告投放已成标配'
          },
          {
            indicator: '人力资源',
            value: '56%',
            yoyChange: '+10pp',
            source: 'Josh Bersin',
            impact: '招聘 AI 代理和员工画像分析加速'
          },
          {
            indicator: '财务/审计',
            value: '67%',
            yoyChange: '+8pp',
            source: 'Deloitte',
            impact: '智能财务助手与风险预警普及'
          },
          {
            indicator: '法务/合规',
            value: '45%',
            yoyChange: '+12pp',
            source: 'Thomson Reuters',
            impact: '合同审查与监管报告自动化增长'
          },
          {
            indicator: '高管决策',
            value: '31%',
            yoyChange: '+7pp',
            source: 'McKinsey',
            impact: 'AI 战略模拟与决策支持仍处于早期'
          }
        ],
        hrInsight: 'HR 部门 AI 采用率 (56%) 增速领先，但仍低于工程和客服。建议优先落地招聘 Agent、员工体验分析和个性化学习推荐。'
      }
    ]
  };
