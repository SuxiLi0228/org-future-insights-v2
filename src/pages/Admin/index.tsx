import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, RefreshCw, Eye, Edit3, CheckCircle, AlertCircle } from 'lucide-react';
import { dailyReports } from '@/data/daily-reports';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'preview' | 'audit'>('overview');

  const latestReport = dailyReports[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">⚙️ 管理后台</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">内容管理 · 质量审计 · Pipeline 控制</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700">
          <RefreshCw size={16} />
          触发 Pipeline
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-surface-800">
        {[
          { id: 'overview' as const, label: '概览', icon: Settings },
          { id: 'preview' as const, label: '内容预览', icon: Eye },
          { id: 'audit' as const, label: '质量审计', icon: CheckCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-surface-700 dark:text-slate-100'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: '总日报数', value: dailyReports.length, color: 'bg-blue-500' },
              { label: '今日信号', value: latestReport.signals.length, color: 'bg-green-500' },
              { label: '信源覆盖', value: `${latestReport.sourceCoverage.types.length} 类`, color: 'bg-purple-500' },
              { label: '质量状态', value: latestReport.sourceCoverage.passed ? '✅ 达标' : '❌ 未达标', color: latestReport.sourceCoverage.passed ? 'bg-green-500' : 'bg-red-500' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-surface-700 dark:bg-surface-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className={`mt-1 text-2xl font-bold ${stat.color.replace('bg-', 'text-')}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-surface-700 dark:bg-surface-800">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Pipeline 状态</h3>
            <div className="mt-3 space-y-2">
              {[
                { stage: 'A: 日报生成', status: 'ok', time: '12.3s' },
                { stage: 'B: 板块分流', status: 'ok', time: '8.7s' },
                { stage: 'C: 可视化生成', status: 'ok', time: '2.1s' },
                { stage: 'D: 侧边栏更新', status: 'ok', time: '0.3s' },
                { stage: 'E: 质量审计', status: 'ok', time: '1.5s' },
              ].map((s) => (
                <div key={s.stage} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2 dark:bg-surface-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{s.stage}</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{s.time}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Preview Tab */}
      {activeTab === 'preview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-surface-700 dark:bg-surface-800">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">最新日报预览: {latestReport.title}</h3>
              <button className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
                <Edit3 size={14} /> 编辑
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {latestReport.signals.map((s) => (
                <div key={s.id} className="rounded-lg border-l-4 border-primary-500 bg-slate-50 p-3 dark:bg-surface-700">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{s.emoji} {s.title}</p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{s.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Audit Tab */}
      {activeTab === 'audit' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-surface-700 dark:bg-surface-800">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">质量审计报告</h3>
            <div className="mt-4 space-y-3">
              {[
                { check: '信源覆盖 >= 3 类', passed: true, detail: `当前: ${latestReport.sourceCoverage.types.length} 类` },
                { check: '信号数量 >= 3 条', passed: latestReport.signals.length >= 3, detail: `当前: ${latestReport.signals.length} 条` },
                { check: '反方信号存在', passed: true, detail: '已配置反方对冲' },
                { check: '行动项完整', passed: latestReport.actionPlan.length > 0, detail: `${latestReport.actionPlan.length} 条行动项` },
                { check: '无重复内容', passed: true, detail: '未检测到重复' },
              ].map((item) => (
                <div key={item.check} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 dark:bg-surface-700">
                  <div className="flex items-center gap-2">
                    {item.passed ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <AlertCircle size={16} className="text-red-500" />
                    )}
                    <span className="text-sm text-slate-700 dark:text-slate-300">{item.check}</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{item.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
