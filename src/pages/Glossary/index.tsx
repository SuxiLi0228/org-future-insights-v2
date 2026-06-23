import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { glossaryTerms } from '@/data/glossary';

export default function GlossaryPage() {
  const [query, setQuery] = useState('');
  const filtered = glossaryTerms.filter((g) =>
    !query || g.term.toLowerCase().includes(query.toLowerCase()) ||
    g.chinese.includes(query) || g.definition.includes(query)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">🧭 HR 词典</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {glossaryTerms.length} 个 HR/组织新概念中英对照
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索术语（中英文均可）..."
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-surface-700 dark:bg-surface-800 dark:text-slate-100 dark:focus:ring-primary-900/30"
        />
      </div>

      {/* Terms Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((g, i) => (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className="rounded-xl border border-slate-200 bg-white p-5 dark:border-surface-700 dark:bg-surface-800"
          >
            <div className="flex items-baseline justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">{g.term}</h3>
              <span className="text-sm text-primary-600 dark:text-primary-400">{g.chinese}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{g.definition}</p>
            <div className="mt-3 rounded-lg bg-slate-50 p-3 dark:bg-surface-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">💡 示例</p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{g.example}</p>
            </div>
            {g.relatedTerms.length > 0 && (
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>关联:</span>
                {g.relatedTerms.map((t) => (
                  <span key={t} className="rounded-full bg-primary-50 px-2 py-0.5 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400">{t}</span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
          没有找到匹配的术语
        </div>
      )}
    </div>
  );
}
