import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ChevronDown, ChevronUp } from 'lucide-react';
import SignalCard, { type RelatedContent } from '@/components/SignalCard';
import { dailyReports } from '@/data/daily-reports';
import { generatedDailyReports } from '@/data/generated/daily-reports';
import { researchPapers } from '@/data/research';
import { transformCases } from '@/data/cases';
import type { Session, Signal } from '@/types';

const sessionLabels: Record<Session, string> = {
  am: '上午基线',
  pm: 'PM 精读',
  auto: '自动版',
  visual: '可视化',
};

const sessionOrder: Session[] = ['pm', 'auto', 'visual', 'am'];

/** 按 tag 匹配相关研究和案例 */
function findRelated(signal: Signal): RelatedContent {
  const signalTags = new Set(signal.tags);
  const papers = researchPapers
    .filter((p) => p.tags.some((t) => signalTags.has(t)))
    .map((p) => ({ id: p.id, title: p.title }));
  const cases = transformCases
    .filter((c) => c.tags.some((t) => signalTags.has(t)))
    .map((c) => ({ id: c.id, title: c.title }));
  return { papers, cases };
}

const priorityBadgeColors = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};
const priorityLabels = { high: '高', medium: '中', low: '低' };

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
const MONTH_NAMES = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月',
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function DailyReportPage() {
  const allReports = useMemo(
    () => [...dailyReports, ...generatedDailyReports],
    []
  );
  const allDates = useMemo(
    () => [...new Set(allReports.map((r) => r.date))].sort((a, b) => b.localeCompare(a)),
    [allReports]
  );
  const latestDate = allDates[0];

  const [selectedDate, setSelectedDate] = useState(latestDate);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarYear, setCalendarYear] = useState(() => {
    const d = new Date(latestDate);
    return d.getFullYear();
  });
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date(latestDate);
    return d.getMonth();
  });

  const dateSet = useMemo(() => new Set(allDates), [allDates]);

  const dayReports = useMemo(
    () =>
      allReports
        .filter((r) => r.date === selectedDate)
        .sort((a, b) => sessionOrder.indexOf(a.session) - sessionOrder.indexOf(b.session)),
    [selectedDate, allReports]
  );

  const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
  const firstDay = getFirstDayOfWeek(calendarYear, calendarMonth);

  const prevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((y) => y - 1);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((y) => y + 1);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  };

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  // Compact date strip: show dates with reports around selected date
  const sortedDates = useMemo(() => [...allDates].sort(), [allDates]);
  const selectedIndex = sortedDates.indexOf(selectedDate);
  const visibleDates = sortedDates.slice(Math.max(0, selectedIndex - 3), selectedIndex + 4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">📅 每日日报</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          每天 ~3000 字深度报告，3 条核心信号 + HR 行动速查
        </p>
      </div>

      {/* Collapsible Calendar Selector */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-surface-700 dark:bg-surface-800">
        {/* Compact Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/20">
              <CalendarIcon size={20} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {selectedDate}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                共 {allDates.length} 天有日报
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200 dark:bg-surface-700 dark:text-slate-300 dark:hover:bg-surface-600"
          >
            {isCalendarOpen ? '收起日历' : '展开日历'}
            {isCalendarOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Compact Date Strip (collapsed) */}
        {!isCalendarOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 flex gap-2 overflow-x-auto pb-1"
          >
            {visibleDates.map((date) => {
              const d = new Date(date);
              const isSelected = date === selectedDate;
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`flex shrink-0 flex-col items-center justify-center rounded-xl px-3 py-2 text-sm transition-all ${
                    isSelected
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-slate-50 text-slate-600 hover:bg-primary-50 dark:bg-surface-700 dark:text-slate-300 dark:hover:bg-primary-900/20'
                  }`}
                >
                  <span className="text-[10px] opacity-80">{d.getMonth() + 1}月</span>
                  <span className="font-semibold">{d.getDate()}</span>
                </button>
              );
            })}
          </motion.div>
        )}

        {/* Full Calendar (expanded) */}
        {isCalendarOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            {/* Month Navigation */}
            <div className="mb-3 flex items-center justify-between">
              <button
                onClick={prevMonth}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-surface-700"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {calendarYear} 年 {MONTH_NAMES[calendarMonth]}
              </span>
              <button
                onClick={nextMonth}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-surface-700"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="mb-1 grid grid-cols-7 gap-1">
              {WEEKDAYS.map((d) => (
                <div key={d} className="py-1 text-center text-xs font-medium text-slate-400 dark:text-slate-500">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} />;
                }
                const dateKey = formatDateKey(calendarYear, calendarMonth, day);
                const hasReport = dateSet.has(dateKey);
                const isSelected = dateKey === selectedDate;
                const isToday = dateKey === new Date().toISOString().slice(0, 10);

                return (
                  <button
                    key={dateKey}
                    onClick={() => hasReport && setSelectedDate(dateKey)}
                    disabled={!hasReport}
                    className={`relative flex h-9 items-center justify-center rounded-lg text-sm transition-colors ${
                      isSelected
                        ? 'bg-primary-600 font-semibold text-white shadow-sm'
                        : hasReport
                        ? 'text-slate-900 hover:bg-primary-50 dark:text-slate-100 dark:hover:bg-primary-900/20'
                        : 'cursor-default text-slate-300 dark:text-slate-600'
                    } ${isToday && !isSelected ? 'ring-1 ring-primary-400 dark:ring-primary-500' : ''}`}
                  >
                    {day}
                    {hasReport && !isSelected && (
                      <span className="absolute bottom-1 h-1 w-1 rounded-full bg-primary-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* Selected Date Header */}
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{selectedDate}</h2>
        <span className="text-xs text-slate-400">
          共 {dayReports.length} 份报告
        </span>
      </div>

      {/* Reports for selected date */}
      {dayReports.map((report, ri) => (
        <motion.div
          key={report.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: ri * 0.08 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-surface-700 dark:bg-surface-800"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {report.title}
            </h3>
            <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
              {sessionLabels[report.session]}
            </span>
          </div>

          {/* Source Coverage */}
          <div className="mb-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>信源: {report.sourceCoverage.total} 个</span>
            <span>·</span>
            <span>覆盖: {report.sourceCoverage.types.length} 类</span>
            <span>·</span>
            <span className={report.sourceCoverage.passed ? 'text-green-600' : 'text-red-600'}>
              {report.sourceCoverage.passed ? '✅ 达标' : '❌ 未达标'}
            </span>
          </div>

          {/* Signals */}
          <div className="space-y-4">
            {report.signals.map((signal, i) => (
              <SignalCard key={signal.id} signal={signal} index={i} related={findRelated(signal)} />
            ))}
          </div>

          {/* Action Plan */}
          {report.actionPlan.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 font-semibold text-slate-900 dark:text-slate-100">💼 行动速查</h3>
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-surface-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-surface-700">
                      <th className="px-4 py-2 text-left font-medium text-slate-600 dark:text-slate-400">优先级</th>
                      <th className="px-4 py-2 text-left font-medium text-slate-600 dark:text-slate-400">行动</th>
                      <th className="hidden px-4 py-2 text-left font-medium text-slate-600 dark:text-slate-400 sm:table-cell">时间窗</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-surface-700">
                    {report.actionPlan.map((action) => (
                      <tr key={action.id}>
                        <td className="px-4 py-2">
                          <span className={`priority-badge ${priorityBadgeColors[action.priority]}`}>
                            {priorityLabels[action.priority]}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-slate-700 dark:text-slate-300">{action.action}</td>
                        <td className="hidden px-4 py-2 text-slate-500 dark:text-slate-400 sm:table-cell">{action.timeWindow}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      ))}

      {dayReports.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center text-sm text-slate-400 dark:border-slate-600">
          该日期暂无日报数据
        </div>
      )}
    </div>
  );
}
