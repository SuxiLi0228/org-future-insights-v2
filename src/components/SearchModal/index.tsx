import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import Fuse from 'fuse.js';
import { dailyReports } from '@/data/daily-reports';
import { companyUpdates } from '@/data/companies';
import { researchPapers } from '@/data/research';
import { transformCases } from '@/data/cases';
import { readings } from '@/data/readings';
import { glossaryTerms } from '@/data/glossary';
import { useNavigate } from 'react-router-dom';

interface SearchItem {
  id: string;
  title: string;
  section: string;
  path: string;
  content: string;
}

function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];
  dailyReports.forEach((r) => {
    r.signals.forEach((s) => {
      items.push({ id: s.id, title: s.title, section: '每日日报', path: '/daily', content: s.summary + ' ' + s.detail });
    });
  });
  companyUpdates.forEach((c) => {
    items.push({ id: c.id, title: c.title, section: '竞对 & AI 公司', path: '/companies', content: c.summary });
  });
  researchPapers.forEach((p) => {
    items.push({ id: p.id, title: p.title, section: '研究 & 阅读', path: '/research', content: p.summary + ' ' + p.hrImplications });
  });
  transformCases.forEach((c) => {
    items.push({ id: c.id, title: c.title, section: '转型案例', path: '/cases', content: c.summary });
  });
  readings.forEach((r) => {
    items.push({ id: r.id, title: r.title, section: '研究 & 阅读', path: '/research', content: r.summary + ' ' + r.editorNote });
  });
  glossaryTerms.forEach((g) => {
    items.push({ id: g.id, title: `${g.term} · ${g.chinese}`, section: 'HR 词典', path: '/glossary', content: g.definition });
  });
  return items;
}

export default function SearchModal() {
  const { searchOpen, setSearchOpen } = useAppStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const fuse = new Fuse(buildSearchIndex(), {
    keys: ['title', 'content'],
    threshold: 0.4,
    includeMatches: true,
  });

  const results = query.trim() ? fuse.search(query).slice(0, 10) : [];

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [searchOpen]);

  const handleSelect = (path: string) => {
    navigate(path);
    setSearchOpen(false);
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-surface-800"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 dark:border-surface-700">
              <Search size={20} className="text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索信号、公司、研究、案例..."
                className="flex-1 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-700"
              >
                <X size={18} />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {results.length > 0 ? (
                <ul className="p-2">
                  {results.map((result) => (
                    <li key={result.item.id}>
                      <button
                        onClick={() => handleSelect(result.item.path)}
                        className="flex w-full flex-col rounded-lg px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-surface-700"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                            {result.item.section}
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm font-medium text-slate-900 dark:text-slate-100">
                          {result.item.title}
                        </p>
                        {result.matches && result.matches[0] && (
                          <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                            {result.matches[0].value?.slice(0, 100)}...
                          </p>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : query.trim() ? (
                <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                  没有匹配结果
                </div>
              ) : (
                <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                  输入关键词开始搜索
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
