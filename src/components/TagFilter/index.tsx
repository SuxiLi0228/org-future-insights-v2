import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

interface Props {
  allTags: string[];
}

export default function TagFilter({ allTags }: Props) {
  const { activeTags, toggleTag, clearTags } = useAppStore();

  if (allTags.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">标签筛选</h3>
        {activeTags.length > 0 && (
          <button
            onClick={clearTags}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <X size={12} /> 清除全部
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => {
          const isActive = activeTags.includes(tag);
          return (
            <motion.button
              key={tag}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleTag(tag)}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-surface-700 dark:text-slate-400 dark:hover:bg-surface-600'
              }`}
            >
              {tag}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
