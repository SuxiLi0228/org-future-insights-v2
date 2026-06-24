import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Calendar, TrendingUp, Lightbulb, FileText, Shield, LightbulbIcon, Globe, ArrowUpRight } from 'lucide-react';
import { weeklyKeywords, weeklyStats, weeklyInsights, weeklySources, weeklyRange } from '@/data/weekly-brief';

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-primary-900 to-indigo-900 p-8 text-white shadow-2xl md:p-12"
      >
        {/* Decorative orbs */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-32 w-32 rounded-full bg-amber-400/10 blur-2xl" />

        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs text-white/80 backdrop-blur-sm"
          >
            <Calendar size={12} />
            {weeklyRange.fullLabel}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
          >
            本周，HR 该关注什么？
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mx-auto mt-4 max-w-xl text-base text-white/70 md:text-lg"
          >
            基于本周 {weeklyStats.reportCount} 条信号、{weeklyStats.companyMoveCount} 家公司动向、{weeklyStats.aiJobPostingsCount} 个 AI 招聘岗位提炼的 HR 启示
          </motion.p>
        </div>
      </motion.section>

      {/* Today's Keywords */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <Lightbulb size={16} className="text-amber-500" />
          今日关键词 · 点击探索
        </div>
        <div className="flex flex-wrap gap-2">
          {weeklyKeywords.map((kw, i) => (
            <motion.div
              key={kw.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              <Link
                to={kw.path}
                className="group flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 hover:shadow-md dark:border-surface-700 dark:bg-surface-800 dark:text-slate-300 dark:hover:border-primary-700 dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary-400 transition-colors group-hover:bg-primary-600" />
                {kw.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Weekly Action Brief */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-surface-700 dark:bg-surface-800"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
            <Zap size={18} className="text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">本周 HR 启示 · 跨境电商延伸</h2>
        </div>

        <div className="space-y-3">
            {weeklyInsights.map((insight, i) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg dark:border-surface-700 dark:bg-surface-800"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/20">
                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{i + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{insight.theme}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      {insight.hrInsight}
                    </p>

                    <div className="mt-4 rounded-xl border-l-4 border-amber-400 bg-gradient-to-r from-amber-50 to-orange-50 p-4 shadow-sm dark:border-amber-500 dark:from-amber-900/20 dark:to-orange-900/10">
                      <div className="flex items-center gap-2 text-sm font-bold text-amber-800 dark:text-amber-300">
                        <Globe size={16} />
                        对跨境电商的延伸
                        <ArrowUpRight size={14} />
                      </div>
                      <p className="mt-2 text-base leading-relaxed text-slate-800 dark:text-slate-200">
                        {insight.ecommerceExtension}
                      </p>
                    </div>

                    <Link
                      to={insight.link}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
                    >
                      {insight.linkText} <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
      </motion.section>

      {/* Mini Stats */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MiniStat value={weeklyStats.reportCount} label="本周日报" icon={FileText} gradient="from-blue-500 to-cyan-500" />
          <MiniStat value={weeklyStats.companyMoveCount} label="公司动向" icon={TrendingUp} gradient="from-purple-500 to-pink-500" />
          <MiniStat value={weeklyStats.aiJobPostingsCount} label="AI 在招岗位" icon={Zap} gradient="from-amber-500 to-orange-500" />
          <MiniStat value={weeklyStats.upcomingEventsCount} label="下周议程" icon={Calendar} gradient="from-green-500 to-emerald-500" />
        </div>
      </motion.section>

      {/* Source Line */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-surface-700 dark:bg-surface-800"
      >
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
          <Shield size={14} />
          本周信号来源
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
          {weeklySources.join(' · ')}
        </p>
      </motion.section>
    </div>
  );
}

function MiniStat({ value, label, icon: Icon, gradient }: { value: number; label: string; icon: typeof FileText; gradient: string }) {
  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md dark:border-surface-700 dark:bg-surface-800"
    >
      <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-sm`}>
        <Icon size={20} />
      </div>
      <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
    </motion.div>
  );
}
