import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Globe, ExternalLink, Users } from 'lucide-react';
import { events } from '@/data/events';
import type { EventItem, EventRegion } from '@/types';

const regionConfig: Record<EventRegion, { label: string; emoji: string; color: string; bg: string }> = {
  north_america: { label: '北美', emoji: '🌎', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/10' },
  europe: { label: '欧洲', emoji: '🌍', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/10' },
  asia_pacific: { label: '亚太', emoji: '🌏', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/10' },
  online: { label: '线上', emoji: '💻', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/10' },
};

const regionOrder: EventRegion[] = ['north_america', 'europe', 'asia_pacific', 'online'];

const relevanceColors = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};
const relevanceLabels = { high: '高相关', medium: '中相关', low: '低相关' };

function daysUntil(dateStr: string, now = '2026-06-23'): number {
  const target = new Date(dateStr);
  const today = new Date(now);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function EventsPage() {
  const [activeRegion, setActiveRegion] = useState<EventRegion | 'all'>('all');

  // Group events by region
  const eventsByRegion = regionOrder
    .map((region) => ({
      region,
      events: events
        .filter((e) => e.region === region)
        .sort((a, b) => a.date.localeCompare(b.date)),
    }))
    .filter((g) => g.events.length > 0);

  const displayedGroups = activeRegion === 'all'
    ? eventsByRegion
    : eventsByRegion.filter((g) => g.region === activeRegion);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">📅 行业议程</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          HR / AI / 未来工作 相关中高端会议，按区域组织
        </p>
      </div>

      {/* Region Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveRegion('all')}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            activeRegion === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-surface-700 dark:text-slate-400 dark:hover:bg-surface-600'
          }`}
        >
          全部 ({events.length})
        </button>
        {regionOrder.map((region) => {
          const cfg = regionConfig[region];
          const count = events.filter((e) => e.region === region).length;
          if (count === 0) return null;
          return (
            <button
              key={region}
              onClick={() => setActiveRegion(region)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                activeRegion === region
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-surface-700 dark:text-slate-400 dark:hover:bg-surface-600'
              }`}
            >
              <span>{cfg.emoji}</span>
              {cfg.label}
              <span className={`rounded-full px-1.5 py-0.5 text-xs ${
                activeRegion === region ? 'bg-white/20' : 'bg-slate-200 dark:bg-surface-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Events grouped by region */}
      <div className="space-y-8">
        {displayedGroups.map((group) => {
          const cfg = regionConfig[group.region];
          return (
            <div key={group.region}>
              {/* Region Header */}
              <div className="mb-3 flex items-center gap-2">
                <span className="text-2xl">{cfg.emoji}</span>
                <h2 className={`text-lg font-semibold ${cfg.color}`}>
                  {cfg.label}
                </h2>
                <span className="text-xs text-slate-400">
                  {group.events.length} 场会议
                </span>
              </div>

              <div className="space-y-3">
                {group.events.map((evt, i) => (
                  <EventRow key={evt.id} evt={evt} index={i} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EventRow({ evt, index }: { evt: EventItem; index: number }) {
  const days = daysUntil(evt.date);
  const isPast = days < 0;
  const isUpcoming = days >= 0 && days <= 30;
  const isOnline = evt.region === 'online';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex items-center gap-4 rounded-xl border bg-white p-4 transition-shadow hover:shadow-md dark:bg-surface-800 ${
        isUpcoming ? 'border-primary-300 dark:border-primary-700' : 'border-slate-200 dark:border-surface-700'
      } ${isPast ? 'opacity-60' : ''}`}
    >
      {/* Date Badge */}
      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/20">
        <span className="text-xs text-primary-600 dark:text-primary-400">
          {new Date(evt.date).toLocaleDateString('zh-CN', { month: 'short' })}
        </span>
        <span className="text-lg font-bold text-primary-700 dark:text-primary-300">
          {new Date(evt.date).getDate()}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
            {evt.url ? (
              <a
                href={evt.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-600 dark:hover:text-primary-400"
              >
                {evt.name}
              </a>
            ) : (
              evt.name
            )}
          </h3>
          {evt.url && (
            <a
              href={evt.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-slate-400 hover:text-primary-600"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Users size={12} /> {evt.organizer}
          </span>
          <span className="flex items-center gap-1">
            {isOnline ? <Globe size={12} /> : <MapPin size={12} />} {evt.location}
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 dark:bg-surface-700">
            {evt.type}
          </span>
          <span className={`rounded-full px-2 py-0.5 ${relevanceColors[evt.relevance]}`}>
            {relevanceLabels[evt.relevance]}
          </span>
        </div>
      </div>

      {/* Countdown */}
      <div className="shrink-0 text-right">
        {isPast ? (
          <span className="text-xs text-slate-400">已结束</span>
        ) : days === 0 ? (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">今天!</span>
        ) : (
          <span className={`text-sm font-medium ${isUpcoming ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400'}`}>
            {days} 天后
          </span>
        )}
        {evt.endDate && (
          <p className="mt-0.5 text-xs text-slate-400">至 {evt.endDate}</p>
        )}
      </div>
    </motion.div>
  );
}
