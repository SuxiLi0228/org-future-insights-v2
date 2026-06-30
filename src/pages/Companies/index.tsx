import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Building2, ShoppingCart, Briefcase, MapPin, Sparkles, ExternalLink, Target, Users, TrendingUp, Linkedin, Globe, RefreshCw } from 'lucide-react';
import { companyUpdates } from '@/data/companies';
import { generatedJobs } from '@/data/generated/fetched-data';
import type { CompanyUpdate, JobPosting } from '@/types';

type PartKey = 'ai' | 'ecommerce' | 'hiring';

// 前端实时刷新 RemoteOK 岗位用的 AI 关键词与技能匹配（与 scripts/fetchers/jobs.ts 保持一致）
const AI_KEYWORDS = [
  'ai', 'artificial intelligence', 'machine learning', 'ml', 'llm', 'large language model',
  'generative ai', 'agent', 'algorithm', 'deep learning', 'recommendation', 'search', 'nlp',
  'computer vision', 'data scientist', 'applied scientist', 'research scientist',
];

const SKILL_KEYWORDS = [
  'Python', 'PyTorch', 'TensorFlow', 'LLM', 'RAG', 'Agent', 'Kubernetes', 'AWS', 'GCP', 'SQL',
  'Spark', 'Hugging Face', 'OpenAI', 'LangChain', 'MLOps', 'Deep Learning', 'NLP', 'Computer Vision',
];

function isAiJob(title: string, description: string): { category: 'pure_ai' | 'hybrid_ai'; skills: string[] } {
  const text = `${title} ${description}`.toLowerCase();
  const matchedSkills = SKILL_KEYWORDS.filter((skill) => text.includes(skill.toLowerCase()));
  const isPureAi =
    text.includes('research scientist') ||
    text.includes('research engineer') ||
    text.includes('ai scientist') ||
    text.includes('machine learning engineer') ||
    text.includes('llm engineer');
  return { category: isPureAi ? 'pure_ai' : 'hybrid_ai', skills: matchedSkills };
}

async function fetchRemoteOkJobs(): Promise<JobPosting[]> {
  const response = await fetch('https://remoteok.com/api', {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; OrgFutureInsights/1.0)' },
  });
  if (!response.ok) throw new Error(`RemoteOK ${response.status}`);

  const data = (await response.json()) as any[];
  const jobs = data.slice(1);

  const seen = new Set<string>();
  return jobs
    .filter((job) => job.position && job.company)
    .map((job) => {
      const title = job.position as string;
      const description = (job.description || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const { category, skills } = isAiJob(title, description);
      const postedAt = job.date ? new Date(job.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
      return {
        id: `job-remoteok-live-${job.id || Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title,
        company: job.company as string,
        category,
        responsibilities: description
          .split(/[.!?。！？]\s+/)
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 10 && s.length < 200)
          .slice(0, 4),
        skills,
        location: job.location || 'Remote',
        source: 'company_career' as const,
        sourceUrl: (job.apply_url || job.url || '').toString(),
        postedAt,
        isNew: new Date().getTime() - new Date(postedAt).getTime() < 7 * 24 * 60 * 60 * 1000,
      };
    })
    .filter((job) => {
      const text = `${job.title} ${job.responsibilities.join(' ')}`.toLowerCase();
      return AI_KEYWORDS.some((kw) => text.includes(kw.toLowerCase()));
    })
    .filter((job) => {
      const key = `${job.company}-${job.title}`.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => b.postedAt.localeCompare(a.postedAt))
    .slice(0, 30);
}

const sourceLabels: Record<JobPosting['source'], { label: string; color: string; icon: typeof Linkedin }> = {
  linkedin: { label: 'LinkedIn', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Linkedin },
  company_career: { label: '官网', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: Globe },
  greenhouse: { label: 'Greenhouse', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: Globe },
  ashby: { label: 'Ashby', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: Globe },
};

export default function CompaniesPage() {
  const [activePart, setActivePart] = useState<PartKey>('ai');
  const [liveJobs, setLiveJobs] = useState<JobPosting[] | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [lastRefreshAt, setLastRefreshAt] = useState<string | null>(null);

  const aiCompanies = companyUpdates.filter((c) => c.category === 'ai');
  const ecommerceCompanies = companyUpdates.filter((c) => c.category === 'ecommerce');

  const handleRefreshJobs = async () => {
    setIsRefreshing(true);
    setRefreshError(null);
    try {
      const jobs = await fetchRemoteOkJobs();
      setLiveJobs(jobs);
      setLastRefreshAt(
        new Date().toLocaleString('zh-CN', {
          timeZone: 'Asia/Shanghai',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    } catch (err) {
      setRefreshError(err instanceof Error ? err.message : '刷新失败');
    } finally {
      setIsRefreshing(false);
    }
  };

  // 合并静态岗位与自动抓取的岗位（优先使用实时刷新的数据）
  const hiringCompanies = useMemo(() => {
    const staticHiring = companyUpdates.filter((c) => c.jobPostings && c.jobPostings.length > 0);
    const jobsToUse = liveJobs ?? generatedJobs;

    // 按公司名分组生成岗位
    const generatedByCompany = jobsToUse.reduce<Record<string, JobPosting[]>>((acc, job) => {
      const company = job.company || '其他公司';
      if (!acc[company]) acc[company] = [];
      acc[company].push(job);
      return acc;
    }, {});

    const generatedCompanies: CompanyUpdate[] = Object.entries(generatedByCompany).map(([company, jobs]) => ({
      id: `generated-hiring-${company.toLowerCase().replace(/\s+/g, '-')}`,
      date: new Date().toISOString().slice(0, 10),
      company,
      title: `${company} 最新 AI 招聘岗位`,
      summary: `自动抓取到 ${jobs.length} 个 AI 相关岗位`,
      content: '',
      tags: ['ai-hr', 'talent'],
      category: 'ai',
      jobPostings: jobs,
      strategicSignal: `近期在招 ${jobs.filter((j) => j.category === 'pure_ai').length} 个纯 AI 岗、${jobs.filter((j) => j.category === 'hybrid_ai').length} 个业务+AI 复合岗，显示 ${company} 正在持续投入 AI 人才。`,
    }));

    // 合并：静态公司优先，生成的公司补充
    const merged = [...staticHiring];
    for (const gen of generatedCompanies) {
      const existing = merged.find((c) => c.company.toLowerCase() === gen.company.toLowerCase());
      if (existing) {
        existing.jobPostings = [...(existing.jobPostings || []), ...(gen.jobPostings || [])];
      } else {
        merged.push(gen);
      }
    }

    return merged;
  }, [liveJobs]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">🏢 竞对 & AI 公司</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          AI 原生公司 + 电商竞争对手 + 在招岗位，追踪业务动向、组织变化和 AI 招聘
        </p>
      </div>

      {/* Part Tabs */}
      <div className="flex flex-wrap gap-2 rounded-2xl bg-slate-100 p-1.5 dark:bg-surface-800">
        <PartTab
          active={activePart === 'ai'}
          onClick={() => setActivePart('ai')}
          icon={Building2}
          label="AI 原生公司"
          count={aiCompanies.length}
          activeColor="bg-white text-blue-600 shadow-sm dark:bg-surface-700 dark:text-blue-400"
          inactiveColor="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        />
        <PartTab
          active={activePart === 'ecommerce'}
          onClick={() => setActivePart('ecommerce')}
          icon={ShoppingCart}
          label="电商竞对"
          count={ecommerceCompanies.length}
          activeColor="bg-white text-amber-600 shadow-sm dark:bg-surface-700 dark:text-amber-400"
          inactiveColor="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        />
        <PartTab
          active={activePart === 'hiring'}
          onClick={() => setActivePart('hiring')}
          icon={Briefcase}
          label="AI 招聘动态"
          count={hiringCompanies.reduce((sum, c) => sum + (c.jobPostings?.length || 0), 0)}
          activeColor="bg-white text-purple-600 shadow-sm dark:bg-surface-700 dark:text-purple-400"
          inactiveColor="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        />
      </div>

      {activePart === 'ai' && <AiCompaniesPart companies={aiCompanies} />}
      {activePart === 'ecommerce' && <EcommercePart companies={ecommerceCompanies} />}
      {activePart === 'hiring' && (
        <HiringPart
          companies={hiringCompanies}
          onRefresh={handleRefreshJobs}
          isRefreshing={isRefreshing}
          refreshError={refreshError}
          lastRefreshAt={lastRefreshAt}
        />
      )}
    </div>
  );
}

function PartTab({
  active,
  onClick,
  icon: Icon,
  label,
  count,
  activeColor,
  inactiveColor,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Building2;
  label: string;
  count: number;
  activeColor: string;
  inactiveColor: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
        active ? activeColor : inactiveColor
      }`}
    >
      <Icon size={16} />
      {label}
      <span className={`rounded-full px-2 py-0.5 text-xs ${
        active ? 'bg-black/5 text-current dark:bg-white/10' : 'bg-slate-200/50 text-slate-500 dark:bg-surface-700 dark:text-slate-400'
      }`}>
        {count}
      </span>
    </button>
  );
}

// ============== AI 原生公司 ==============
function AiCompaniesPart({ companies }: { companies: CompanyUpdate[] }) {
  return (
    <div className="space-y-3">
      {companies.map((c, i) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-surface-700 dark:bg-surface-800"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <Building2 size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{c.company}</h3>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {c.tags[0]}
                </span>
                <span className="text-xs text-slate-400">{c.date}</span>
              </div>
              <h4 className="mt-1.5 text-sm font-medium text-slate-800 dark:text-slate-200">{c.title}</h4>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{c.summary}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ============== 电商竞对 ==============
function EcommercePart({ companies }: { companies: CompanyUpdate[] }) {
  return (
    <div className="space-y-3">
      {companies.map((c, i) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-surface-700 dark:bg-surface-800"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <ShoppingCart size={20} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{c.company}</h3>
                <span className="text-xs text-slate-400">{c.date}</span>
              </div>
              <h4 className="mt-1.5 text-sm font-medium text-slate-800 dark:text-slate-200">{c.title}</h4>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{c.summary}</p>
            </div>
          </div>

          {/* Three-layer card */}
          <div className="mt-4 space-y-2">
            {c.bizImpact && (
              <LayerCard icon={TrendingUp} color="blue" label="业务动向" content={c.bizImpact} />
            )}
            {c.orgImpact && (
              <LayerCard icon={Users} color="amber" label="组织&人才" content={c.orgImpact} />
            )}
            {c.aiEffort && (
              <LayerCard icon={Sparkles} color="purple" label="AI 转型尝试" content={c.aiEffort} />
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function LayerCard({
  icon: Icon,
  color,
  label,
  content,
}: {
  icon: typeof TrendingUp;
  color: 'blue' | 'amber' | 'purple';
  label: string;
  content: string;
}) {
  const colorMap = {
    blue: 'bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400',
    amber: 'bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400',
    purple: 'bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-400',
  };
  return (
    <div className={`rounded-lg p-3 ${colorMap[color]}`}>
      <div className="flex items-center gap-1.5 text-xs font-semibold">
        <Icon size={14} />
        {label}
      </div>
      <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{content}</p>
    </div>
  );
}

// ============== AI 招聘动态 ==============
function HiringPart({
  companies,
  onRefresh,
  isRefreshing,
  refreshError,
  lastRefreshAt,
}: {
  companies: CompanyUpdate[];
  onRefresh: () => void;
  isRefreshing: boolean;
  refreshError: string | null;
  lastRefreshAt: string | null;
}) {
  if (companies.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-surface-700 dark:bg-surface-800">
        <Briefcase size={48} className="mx-auto text-slate-300 dark:text-slate-600" />
        <p className="mt-4 text-sm text-slate-500">暂无 AI 招聘动态数据</p>
      </div>
    );
  }

  // Aggregated stats
  const totalJobs = companies.reduce((sum, c) => sum + (c.jobPostings?.length || 0), 0);
  const pureAiJobs = companies.reduce(
    (sum, c) => sum + (c.jobPostings?.filter((j) => j.category === 'pure_ai').length || 0),
    0
  );
  const hybridJobs = totalJobs - pureAiJobs;

  return (
    <div className="space-y-4">
      {/* Refresh control */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-surface-700 dark:bg-surface-800">
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">AI 招聘动态实时刷新</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lastRefreshAt ? `上次刷新：${lastRefreshAt}` : '点击按钮从 RemoteOK 获取最新 AI 岗位'}
          </p>
          {refreshError && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{refreshError}</p>}
        </div>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          {isRefreshing ? '刷新中...' : '刷新岗位'}
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="总岗位数" value={totalJobs} color="purple" />
        <StatCard label="纯 AI 岗" value={pureAiJobs} color="blue" />
        <StatCard label="业务+AI 复合" value={hybridJobs} color="amber" />
      </div>

      {/* Company-by-company */}
      {companies.map((c, i) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-surface-700 dark:bg-surface-800"
        >
          {/* Company Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {c.company}
              </h3>
              <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{c.title}</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-purple-100 px-3 py-1.5 dark:bg-purple-900/30">
              <Briefcase size={14} className="text-purple-700 dark:text-purple-400" />
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                {c.jobPostings?.length} 个 AI 岗位
              </span>
            </div>
          </div>

          {/* Strategic Signal */}
          {c.strategicSignal && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 p-3 dark:from-purple-900/20 dark:to-blue-900/20">
              <Target size={16} className="mt-0.5 shrink-0 text-purple-600 dark:text-purple-400" />
              <div>
                <div className="text-xs font-semibold text-purple-700 dark:text-purple-400">🎯 战略信号</div>
                <p className="mt-0.5 text-sm text-slate-700 dark:text-slate-300">{c.strategicSignal}</p>
              </div>
            </div>
          )}

          {/* Job Postings */}
          <div className="mt-4 space-y-2">
            {c.jobPostings?.map((job) => <JobPostingCard key={job.id} job={job} />)}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: 'purple' | 'blue' | 'amber' }) {
  const colorMap = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    amber: 'from-amber-500 to-amber-600',
  };
  return (
    <div className={`rounded-xl bg-gradient-to-br ${colorMap[color]} p-4 text-white shadow-sm`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="mt-0.5 text-xs opacity-90">{label}</div>
    </div>
  );
}

function JobPostingCard({ job }: { job: JobPosting }) {
  const src = sourceLabels[job.source];
  const SourceIcon = src.icon;
  const isHybrid = job.category === 'hybrid_ai';

  return (
    <a
      href={job.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-lg border border-slate-200 bg-slate-50 p-3 transition-all hover:border-primary-300 hover:bg-white hover:shadow-sm dark:border-surface-700 dark:bg-surface-900 dark:hover:bg-surface-800"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <h4 className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400">
              {job.title}
            </h4>
            {job.isNew && (
              <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                NEW
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 ${
              isHybrid ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            }`}>
              {isHybrid ? '🔀 业务+AI' : '🤖 纯 AI'}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={11} /> {job.location}
            </span>
            <span className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 ${src.color}`}>
              <SourceIcon size={11} /> {src.label}
            </span>
            {job.postedAt && <span className="text-slate-400">{job.postedAt}</span>}
          </div>
        </div>
        <ExternalLink size={14} className="shrink-0 text-slate-400 group-hover:text-primary-600" />
      </div>

      {/* Responsibilities preview */}
      <ul className="mt-2 space-y-0.5">
        {job.responsibilities.slice(0, 2).map((r, ri) => (
          <li key={ri} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
            <span className="line-clamp-1">{r}</span>
          </li>
        ))}
      </ul>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {job.skills.slice(0, 4).map((s) => (
            <span key={s} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-surface-700 dark:text-slate-400">
              {s}
            </span>
          ))}
        </div>
      )}
    </a>
  );
}
