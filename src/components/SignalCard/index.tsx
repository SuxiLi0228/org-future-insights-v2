import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Bookmark, BookmarkCheck, Building2, FileText, BarChart3 } from 'lucide-react';
import { Signal } from '@/types';
import { useAppStore } from '@/stores/appStore';

export interface RelatedContent {
  papers?: { id: string; title: string }[];
  cases?: { id: string; title: string }[];
}

interface Props {
  signal: Signal;
  index?: number;
  related?: RelatedContent;
}

const priorityColors = {
  high: 'border-signal-high',
  medium: 'border-signal-medium',
  low: 'border-signal-low',
};

const priorityBadgeColors = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

const priorityLabels = { high: '高', medium: '中', low: '低' };

export default function SignalCard({ signal, index = 0, related }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { toggleFavorite, isFavorite } = useAppStore();
  const fav = isFavorite(signal.id);

  const hasRelated = related && ((related.papers && related.papers.length > 0) || (related.cases && related.cases.length > 0));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`signal-card ${priorityColors[signal.priority]}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{signal.emoji}</span>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{signal.title}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className={`priority-badge ${priorityBadgeColors[signal.priority]}`}>
                {priorityLabels[signal.priority]}优先级
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {signal.sourceName}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => toggleFavorite(signal.id)}
          className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-surface-700"
        >
          {fav ? <BookmarkCheck size={18} className="text-primary-500" /> : <Bookmark size={18} />}
        </button>
      </div>

      {/* Summary */}
      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {signal.summary}
      </p>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {signal.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-surface-700 dark:text-slate-400"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Expandable detail */}
      {signal.detail && (
        <div className="mt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            {expanded ? '收起详情' : '展开详情'}
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-2 rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 dark:bg-surface-700 dark:text-slate-300"
            >
              {signal.detail}
            </motion.div>
          )}
        </div>
      )}

      {/* Cross-links: Related Companies + Research + Cases */}
      {(signal.relatedCompanies.length > 0 || hasRelated) && (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          {/* Related Companies */}
          {signal.relatedCompanies.length > 0 && (
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <Building2 size={12} />
              <span className="text-slate-400 dark:text-slate-500">关联公司:</span>
              {signal.relatedCompanies.map((company, ci) => (
                <span key={company}>
                  {ci > 0 && <span className="mr-1 text-slate-300 dark:text-slate-600">·</span>}
                  <Link
                    to="/companies"
                    className="font-medium text-primary-600 hover:text-primary-700 hover:underline dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    {company}
                  </Link>
                </span>
              ))}
            </div>
          )}

          {/* Related Research Papers */}
          {related?.papers && related.papers.length > 0 && (
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <FileText size={12} />
              <span className="text-slate-400 dark:text-slate-500">相关研究:</span>
              {related.papers.map((paper, pi) => (
                <span key={paper.id}>
                  {pi > 0 && <span className="mr-1 text-slate-300 dark:text-slate-600">·</span>}
                  <Link
                    to="/research"
                    className="font-medium text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {paper.title.length > 20 ? paper.title.slice(0, 20) + '…' : paper.title}
                  </Link>
                </span>
              ))}
            </div>
          )}

          {/* Related Cases */}
          {related?.cases && related.cases.length > 0 && (
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <BarChart3 size={12} />
              <span className="text-slate-400 dark:text-slate-500">相关案例:</span>
              {related.cases.map((c, ci) => (
                <span key={c.id}>
                  {ci > 0 && <span className="mr-1 text-slate-300 dark:text-slate-600">·</span>}
                  <Link
                    to="/cases"
                    className="font-medium text-purple-600 hover:text-purple-700 hover:underline dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    {c.title.length > 20 ? c.title.slice(0, 20) + '…' : c.title}
                  </Link>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
