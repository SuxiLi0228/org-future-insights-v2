import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, CheckCircle2, XCircle, AlertCircle, FlaskConical, Rocket, Waves } from 'lucide-react';
import { transformCases } from '@/data/cases';
import type { TransformCase, CaseStage, CaseOutcome } from '@/types';

const stageConfig: Record<CaseStage, { label: string; emoji: string; icon: typeof FlaskConical; color: string; desc: string }> = {
  exploring: { label: '探索期', emoji: '', icon: FlaskConical, color: 'text-green-600 dark:text-green-400', desc: '试点 / POC 阶段' },
  scaling: { label: '扩展期', emoji: '🟡', icon: Rocket, color: 'text-amber-600 dark:text-amber-400', desc: '部门级推广' },
  deep: { label: '深水区', emoji: '', icon: Waves, color: 'text-red-600 dark:text-red-400', desc: '全组织转型' },
};

const outcomeConfig: Record<CaseOutcome, { label: string; icon: typeof CheckCircle2; color: string }> = {
  success: { label: '成功', icon: CheckCircle2, color: 'text-green-600 dark:text-green-400' },
  failure: { label: '失败', icon: XCircle, color: 'text-red-600 dark:text-red-400' },
  mixed: { label: 'Mixed', icon: AlertCircle, color: 'text-amber-600 dark:text-amber-400' },
};

const stageOrder: CaseStage[] = ['deep', 'scaling', 'exploring'];

export default function CasesPage() {
  const [expandedCase, setExpandedCase] = useState<string | null>(null);
  const [activeStage, setActiveStage] = useState<CaseStage | 'all'>('all');

  const casesByStage = stageOrder.map((stage) => ({
    stage,
    cases: transformCases.filter((c) => c.stage === stage),
  }));

  const filteredCases = activeStage === 'all'
    ? transformCases
    : transformCases.filter((c) => c.stage === activeStage);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">📊 AI 转型案例库</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          真实企业 AI 转型实践，按成熟度分阶段，可直接复用经验教训
        </p>
      </div>

      {/* Stage Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveStage('all')}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            activeStage === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-surface-700 dark:text-slate-400 dark:hover:bg-surface-600'
          }`}
        >
          全部 ({transformCases.length})
        </button>
        {stageOrder.map((stage) => {
          const cfg = stageConfig[stage];
          const StageIcon = cfg.icon;
          const count = transformCases.filter((c) => c.stage === stage).length;
          return (
            <button
              key={stage}
              onClick={() => setActiveStage(stage)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                activeStage === stage
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-surface-700 dark:text-slate-400 dark:hover:bg-surface-600'
              }`}
            >
              <StageIcon size={14} />
              {cfg.label}
              <span className={`rounded-full px-1.5 py-0.5 text-xs ${
                activeStage === stage ? 'bg-white/20' : 'bg-slate-200 dark:bg-surface-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cases grouped by stage */}
      <div className="space-y-8">
        {casesByStage
          .filter((g) => activeStage === 'all' || g.stage === activeStage)
          .map((group) => {
            const cfg = stageConfig[group.stage];
            const StageIcon = cfg.icon;
            return (
              <div key={group.stage}>
                {/* Stage Header */}
                <div className="mb-4 flex items-center gap-2">
                  <StageIcon size={18} className={cfg.color} />
                  <h2 className={`text-lg font-semibold ${cfg.color}`}>
                    {cfg.emoji} {cfg.label}
                  </h2>
                  <span className="text-xs text-slate-400">{cfg.desc}</span>
                </div>

                <div className="space-y-4">
                  {group.cases.map((caseItem, i) => (
                    <CaseCard
                      key={caseItem.id}
                      caseItem={caseItem}
                      index={i}
                      expanded={expandedCase === caseItem.id}
                      onToggle={() => setExpandedCase(expandedCase === caseItem.id ? null : caseItem.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

function CaseCard({
  caseItem,
  index,
  expanded,
  onToggle,
}: {
  caseItem: TransformCase;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const outcomeCfg = outcomeConfig[caseItem.outcome];
  const OutcomeIcon = outcomeCfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-xl border border-slate-200 bg-white p-5 dark:border-surface-700 dark:bg-surface-800"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{caseItem.title}</h3>
            <span className={`flex items-center gap-1 text-xs font-medium ${outcomeCfg.color}`}>
              <OutcomeIcon size={14} />
              {outcomeCfg.label}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300">{caseItem.company}</span>
            {caseItem.industry && <span>· {caseItem.industry}</span>}
            {caseItem.companySize && <span>· {caseItem.companySize}</span>}
            <span>· {caseItem.date}</span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{caseItem.summary}</p>

      {/* Metrics Preview */}
      {caseItem.metrics && caseItem.metrics.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {caseItem.metrics.slice(0, 3).map((m, mi) => (
            <span key={mi} className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs text-slate-700 dark:bg-surface-700 dark:text-slate-300">
              {m}
            </span>
          ))}
          {caseItem.metrics.length > 3 && (
            <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs text-slate-400 dark:bg-surface-700">
              +{caseItem.metrics.length - 3} 更多
            </span>
          )}
        </div>
      )}

      {/* Expand */}
      <button
        onClick={onToggle}
        className="mt-3 flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
      >
        {expanded ? '收起详情' : '展开详情'}
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 space-y-4 overflow-hidden"
          >
            {/* Timeline */}
            {caseItem.timeline && (
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-surface-700">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">📅 转型时间线</span>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{caseItem.timeline}</p>
              </div>
            )}

            {/* All Metrics */}
            {caseItem.metrics && caseItem.metrics.length > 0 && (
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/10">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">📊 量化结果</span>
                <ul className="mt-2 space-y-1">
                  {caseItem.metrics.map((m, mi) => (
                    <li key={mi} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* What Worked */}
            {caseItem.whatWorked.length > 0 && (
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/10">
                <span className="text-xs font-semibold text-green-700 dark:text-green-400">✅ 成功因素</span>
                <ul className="mt-2 space-y-1">
                  {caseItem.whatWorked.map((w, wi) => (
                    <li key={wi} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-green-600 dark:text-green-400" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* What Failed */}
            {caseItem.whatFailed.length > 0 && (
              <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/10">
                <span className="text-xs font-semibold text-red-700 dark:text-red-400">❌ 失败教训</span>
                <ul className="mt-2 space-y-1">
                  {caseItem.whatFailed.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <XCircle size={14} className="mt-0.5 shrink-0 text-red-600 dark:text-red-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* HR Lessons */}
            <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/10">
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400"> HR 可复用经验</span>
              <ul className="mt-2 space-y-1">
                {caseItem.hrLessons.map((l, li) => (
                  <li key={li} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    {l}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {caseItem.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-surface-700 dark:text-slate-400">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
