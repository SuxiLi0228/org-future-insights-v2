import { motion } from 'framer-motion';
import { BookOpen, Quote } from 'lucide-react';
import { readings } from '@/data/readings';

export default function ReadingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">📚 延伸阅读</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">关键英文原文 + 中文翻译 + 编辑导读</p>
      </div>
      <div className="space-y-4">
        {readings.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="rounded-xl border border-slate-200 bg-white p-5 dark:border-surface-700 dark:bg-surface-800">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                <BookOpen size={20} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{r.title}</h3>
                {r.originalTitle && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">原文: {r.originalTitle}</p>}
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>{r.source}</span><span>·</span><span>{r.date}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{r.summary}</p>
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
                <div className="mt-3 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/10">
                  <p className="text-sm text-slate-700 dark:text-slate-300"><strong>📝 编辑导读:</strong> {r.editorNote}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {r.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-surface-700 dark:text-slate-400">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
