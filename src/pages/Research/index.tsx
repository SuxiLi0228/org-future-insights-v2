import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, Lightbulb, BookOpen, Quote, ExternalLink, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { researchPapers } from '@/data/research';
import { generatedPapers } from '@/data/generated/fetched-data';
import { readings } from '@/data/readings';
import { transformCases } from '@/data/cases';
import type { ResearchPaper } from '@/types';

const sourceColors: Record<string, string> = {
  academic: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  consulting: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  hr_media: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  tech: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  think_tank: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  vc: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
};

const sourceTypeLabels: Record<string, string> = {
  academic: '学术',
  consulting: '咨询',
  hr_media: 'HR媒体',
  tech: '科技',
  think_tank: '智库',
  vc: 'VC',
};

export default function ResearchPage() {
  const [expandedPaper, setExpandedPaper] = useState<string | null>(null);
  const [activePart, setActivePart] = useState<'research' | 'readings'>('research');

  const allResearchPapers = useMemo<ResearchPaper[]>(() => {
    const generatedResearchPapers: ResearchPaper[] = generatedPapers.map((p) => ({
      id: p.id,
      date: p.publishedAt,
      title: p.title,
      authors: p.authors,
      institution: 'arXiv',
      sourceType: 'academic',
      summary: p.summary,
      keyFindings: [p.summary.slice(0, 200)],
      hrImplications: '该论文来自 arXiv AI/ML 领域最新研究，HR 可关注其潜在的自动化与组织变革影响。',
      tags: ['ai', 'research', ...p.categories.slice(0, 3)],
      url: p.link,
    }));

    return [...researchPapers, ...generatedResearchPapers];
  }, []);

  /** 按 tag 匹配相关案例 */
  const findRelatedCases = (paper: { tags: string[] }) => {
    const paperTags = new Set(paper.tags);
    return transformCases.filter((c) => c.tags.some((t) => paperTags.has(t)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100"> 研究 & 阅读</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          研究报告 + 延伸阅读，一手信源深度解读
        </p>
      </div>

      {/* Part Tabs */}
      <div className="flex gap-2 rounded-2xl bg-slate-100 p-1.5 dark:bg-surface-800">
        <button
          onClick={() => setActivePart('research')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
            activePart === 'research'
              ? 'bg-white text-primary-600 shadow-sm dark:bg-surface-700 dark:text-primary-400'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <FileText size={16} />
          研究报告
          <span className={`rounded-full px-2 py-0.5 text-xs ${
            activePart === 'research' ? 'bg-black/5 text-current dark:bg-white/10' : 'bg-slate-200/50 text-slate-500 dark:bg-surface-700 dark:text-slate-400'
          }`}>
            {allResearchPapers.length}
          </span>
        </button>
        <button
          onClick={() => setActivePart('readings')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
            activePart === 'readings'
              ? 'bg-white text-primary-600 shadow-sm dark:bg-surface-700 dark:text-primary-400'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <BookOpen size={16} />
          延伸阅读
          <span className={`rounded-full px-2 py-0.5 text-xs ${
            activePart === 'readings' ? 'bg-black/5 text-current dark:bg-white/10' : 'bg-slate-200/50 text-slate-500 dark:bg-surface-700 dark:text-slate-400'
          }`}>
            {readings.length}
          </span>
        </button>
      </div>

      {/* Part 1: Research Papers */}
      {activePart === 'research' && (
        <div className="space-y-4">
          {allResearchPapers.map((paper, i) => (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-surface-700 dark:bg-surface-800"
            >
              <div className="flex items-start gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${sourceColors[paper.sourceType] || 'bg-slate-100'}`}>
                  <FileText size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{paper.title}</h3>
                    {paper.url && (
                      <a
                        href={paper.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        <ExternalLink size={12} />
                        原文
                      </a>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className={`rounded-full px-2 py-0.5 ${sourceColors[paper.sourceType]}`}>
                      {sourceTypeLabels[paper.sourceType]}
                    </span>
                    <span>{paper.institution}</span>
                    <span>·</span>
                    <span>{paper.authors.join(', ')}</span>
                    <span>·</span>
                    <span>{paper.date}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{paper.summary}</p>

                  {/* Key Findings */}
                  <button
                    onClick={() => setExpandedPaper(expandedPaper === paper.id ? null : paper.id)}
                    className="mt-3 flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                  >
                    <Lightbulb size={14} />
                    {expandedPaper === paper.id ? '收起核心发现' : '展开核心发现'}
                  </button>

                  {expandedPaper === paper.id && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="mt-3 space-y-3">
                      <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/10">
                        <h4 className="mb-2 text-sm font-medium text-blue-700 dark:text-blue-400">核心发现</h4>
                        <ul className="space-y-1">
                          {paper.keyFindings.map((f, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/10">
                        <h4 className="mb-1 text-sm font-medium text-green-700 dark:text-green-400">HR 启示</h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{paper.hrImplications}</p>
                      </div>
                    </motion.div>
                  )}

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {paper.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-surface-700 dark:text-slate-400">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Related Cases */}
                  {findRelatedCases(paper).length > 0 && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <BarChart3 size={12} />
                      <span className="text-slate-400 dark:text-slate-500">相关案例:</span>
                      {findRelatedCases(paper).map((c, ci) => (
                        <span key={c.id}>
                          {ci > 0 && <span className="mr-1 text-slate-300 dark:text-slate-600">·</span>}
                          <Link
                            to="/cases"
                            className="font-medium text-purple-600 hover:text-purple-700 hover:underline dark:text-purple-400 dark:hover:text-purple-300"
                          >
                            {c.title.length > 18 ? c.title.slice(0, 18) + '…' : c.title}
                          </Link>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Part 2: Readings */}
      {activePart === 'readings' && (
        <div className="space-y-4">
          {readings.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-surface-700 dark:bg-surface-800"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                  <BookOpen size={20} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">{r.title}</h3>
                      {r.originalTitle && (
                        <p className="mt-0.5 text-xs italic text-slate-500 dark:text-slate-400">
                          {r.originalTitle}
                        </p>
                      )}
                    </div>
                    {r.url && (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        <ExternalLink size={12} />
                        原文
                      </a>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className={`rounded-full px-2 py-0.5 ${sourceColors[r.sourceType] || 'bg-slate-100 text-slate-600'}`}>
                      {sourceTypeLabels[r.sourceType] || r.source}
                    </span>
                    <span>{r.source}</span>
                    <span>·</span>
                    <span>{r.date}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{r.summary}</p>

                  {/* Key Excerpts */}
                  {r.keyExcerpts.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {r.keyExcerpts.map((e, j) => (
                        <div key={j} className="flex items-start gap-2 rounded-lg bg-slate-50 p-3 dark:bg-surface-700">
                          <Quote size={14} className="mt-0.5 shrink-0 text-slate-400" />
                          <div>
                            <p className="text-sm italic text-slate-700 dark:text-slate-300">"{e.text}"</p>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">— {e.context}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Editor Note */}
                  <div className="mt-3 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/10">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      <strong>📝 编辑导读:</strong> {r.editorNote}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {r.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-surface-700 dark:text-slate-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
