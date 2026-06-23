import { Section } from '@/types';

export const sections: Section[] = [
  { id: 'daily', emoji: '📅', title: '每日日报', description: '每天 ~3000 字深度报告，3 条核心信号 + HR 行动速查', path: '/daily', count: 20 },
  { id: 'companies', emoji: '', title: '竞对 & AI 公司', description: 'AI 原生公司 + 电商竞争对手，业务与组织联动追踪', path: '/companies', count: 13 },
  { id: 'research', emoji: '🎓', title: '研究 & 阅读', description: '研究报告 + 延伸阅读，一手信源深度解读', path: '/research', count: 11 },
  { id: 'cases', emoji: '📊', title: '转型案例', description: 'AI 转型实践案例库，按探索/扩展/深水区分阶段', path: '/cases', count: 7 },
  { id: 'glossary', emoji: '🧭', title: 'HR 词典', description: '12 个 HR/组织新概念中英对照', path: '/glossary', count: 12 },
  { id: 'dashboard', emoji: '📈', title: '数据看板', description: 'AI 投资 / 全球裁员 / 工具采用率等关键数字速查', path: '/dashboard', count: 6 },
  { id: 'events', emoji: '📅', title: '行业议程', description: 'HR/AI/未来工作中高端会议，按区域组织', path: '/events', count: 19 },
];
