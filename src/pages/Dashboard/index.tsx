import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { dashboardSnapshot } from '@/data/dashboard';
import type { DetailTable } from '@/types';

export default function DashboardPage() {
  const { kpis, trends, detailTables } = dashboardSnapshot;
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    detailTables?.forEach((t) => { init[t.id] = true; });
    return init;
  });

  const toggleTable = (id: string) => {
    setExpandedTables((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">📈 数据看板</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          AI 投资 / 全球裁员 / 工具采用率等关键数字速查 · 更新于 {dashboardSnapshot.date}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`kpi-card ${kpi.color}`}
          >
            <span className="text-xs opacity-80">{kpi.label}</span>
            <span className="mt-1 text-2xl font-bold tabular-nums">{kpi.value}</span>
            <span className="text-xs opacity-70">{kpi.unit}</span>
            {kpi.change !== undefined && kpi.change !== 0 && (
              <div className="mt-2 flex items-center gap-1 text-xs">
                {kpi.change > 0 ? <TrendingUp size={12} /> : kpi.change < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
                <span>{Math.abs(kpi.change)}% {kpi.changeLabel}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Trend Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {trends.map((trend, i) => (
          <motion.div
            key={trend.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="rounded-xl border border-slate-200 bg-white p-5 dark:border-surface-700 dark:bg-surface-800"
          >
            <h3 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">{trend.label}</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trend.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="数值"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        ))}
      </div>

      {/* Detail Tables */}
      {detailTables && detailTables.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">📋 明细数据</h2>
          {detailTables.map((table, i) => (
            <DetailTableCard
              key={table.id}
              table={table}
              expanded={expandedTables[table.id] ?? true}
              onToggle={() => toggleTable(table.id)}
              delay={0.4 + i * 0.1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DetailTableCard({
  table,
  expanded,
  onToggle,
  delay,
}: {
  table: DetailTable;
  expanded: boolean;
  onToggle: () => void;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-xl border border-slate-200 bg-white dark:border-surface-700 dark:bg-surface-800"
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
          {table.emoji} {table.title}
        </h3>
        {expanded ? (
          <ChevronUp size={18} className="text-slate-400" />
        ) : (
          <ChevronDown size={18} className="text-slate-400" />
        )}
      </button>

      {/* Table */}
      {expanded && (
        <div className="overflow-x-auto px-5 pb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-surface-600">
                {table.columns.map((col) => (
                  <th
                    key={col}
                    className="whitespace-nowrap px-3 py-2 text-left font-medium text-slate-500 dark:text-slate-400"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-100 last:border-0 dark:border-surface-700"
                >
                  <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">
                    {row.indicator}
                  </td>
                  <td className="px-3 py-2 tabular-nums text-slate-700 dark:text-slate-300">
                    {row.value}
                  </td>
                  <td className="px-3 py-2">
                    {row.yoyChange && (
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          row.yoyChange.startsWith('+')
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : row.yoyChange.startsWith('-')
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {row.yoyChange}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
                    {row.source}
                  </td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                    {row.impact}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* HR Insight */}
          {table.hrInsight && (
            <div className="mt-3 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
              <span className="font-semibold">💡 HR 洞察：</span>{table.hrInsight}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
