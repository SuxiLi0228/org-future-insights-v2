import type { JobPosting } from './types';

function toAppJobPosting(
  id: string,
  title: string,
  company: string,
  location: string,
  description: string,
  link: string,
  postedAt: string,
  category: 'pure_ai' | 'hybrid_ai',
  skills: string[]
): JobPosting {
  const cleanDescription = description || '';
  const sentences = cleanDescription
    .split(/[.!?。！？]\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10 && s.length < 200)
    .slice(0, 4);

  const responsibilities = sentences.length > 0 ? sentences : [cleanDescription.slice(0, 160)];

  const isNew =
    new Date().getTime() - new Date(postedAt).getTime() < 7 * 24 * 60 * 60 * 1000;

  const source: JobPosting['source'] =
    link.includes('greenhouse.io') || link.includes('boards.greenhouse')
      ? 'greenhouse'
      : link.includes('ashbyhq.com')
      ? 'ashby'
      : link.includes('linkedin.com')
      ? 'linkedin'
      : 'company_career';

  return {
    id,
    title,
    company,
    category,
    responsibilities,
    skills,
    location,
    source,
    sourceUrl: link,
    postedAt,
    isNew,
  };
}

interface CompanyWatch {
  name: string;
  keywords: string[];
  rssUrl?: string;
  jobBoardUrl?: string;
}

// 重点监控的公司清单
const WATCHED_COMPANIES: CompanyWatch[] = [
  { name: 'Anthropic', keywords: ['ai', 'ml', 'research', 'agent'] },
  { name: 'OpenAI', keywords: ['ai', 'ml', 'research', 'engineering'] },
  { name: 'Amazon', keywords: ['ai', 'ml', 'applied scientist', 'research scientist'] },
  { name: 'Temu', keywords: ['ai', 'algorithm', 'recommendation'] },
  { name: 'Shein', keywords: ['ai', 'algorithm', 'data'] },
  { name: 'Zalando', keywords: ['ai', 'ml', 'data'] },
  { name: 'TikTok', keywords: ['ai', 'ml', 'algorithm'] },
];

const AI_KEYWORDS = [
  'ai',
  'artificial intelligence',
  'machine learning',
  'ml',
  'llm',
  'large language model',
  'generative ai',
  'agent',
  'algorithm',
  'deep learning',
  'recommendation',
  'search',
  'nlp',
  'computer vision',
  'data scientist',
  'applied scientist',
  'research scientist',
];

function isAiJob(title: string, description: string): { category: 'pure_ai' | 'hybrid_ai'; skills: string[] } {
  const text = `${title} ${description}`.toLowerCase();
  const matchedSkills: string[] = [];

  const skillKeywords = [
    'Python',
    'PyTorch',
    'TensorFlow',
    'LLM',
    'RAG',
    'Agent',
    'Kubernetes',
    'AWS',
    'GCP',
    'SQL',
    'Spark',
    'Hugging Face',
    'OpenAI',
    'LangChain',
    'MLOps',
    'Deep Learning',
    'NLP',
    'Computer Vision',
  ];

  for (const skill of skillKeywords) {
    if (text.includes(skill.toLowerCase())) matchedSkills.push(skill);
  }

  const isPureAi =
    text.includes('research scientist') ||
    text.includes('research engineer') ||
    text.includes('ai scientist') ||
    text.includes('machine learning engineer') ||
    text.includes('llm engineer');

  return { category: isPureAi ? 'pure_ai' : 'hybrid_ai', skills: matchedSkills };
}

function slugifyCompany(company: string, title: string): string {
  return `${company.toLowerCase().replace(/\s+/g, '-')}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}`;
}

// RemoteOK 公开 API（无需 Key）
async function fetchRemoteOk(): Promise<JobPosting[]> {
  try {
    const response = await fetch('https://remoteok.com/api', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OrgFutureInsights/1.0)',
      },
    });

    if (!response.ok) return [];

    const data = (await response.json()) as any[];
    // 第一项是 API 元数据
    const jobs = data.slice(1);

    return jobs
      .filter((job) => job.position && job.company)
      .map((job) => {
        const title = job.position as string;
        const description = (job.description || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        const { category, skills } = isAiJob(title, description);

        return toAppJobPosting(
          `job-remoteok-${job.id || Date.now()}`,
          title,
          job.company as string,
          job.location || 'Remote',
          description.slice(0, 300),
          job.apply_url || job.url || '',
          job.date ? new Date(job.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
          category,
          skills
        );
      })
      .filter((job) => {
        const text = `${job.title} ${job.description}`.toLowerCase();
        return AI_KEYWORDS.some((kw) => text.includes(kw.toLowerCase()));
      });
  } catch (error) {
    console.warn('RemoteOK fetch failed:', error instanceof Error ? error.message : String(error));
    return [];
  }
}

// 简单的公司关键词匹配（用于没有公开 API 的公司）
async function fetchFromSearchApi(): Promise<JobPosting[]> {
  // 如果用户配置了 SERP_API_KEY，可以接入 Google Jobs 等搜索
  const serpApiKey = process.env.SERP_API_KEY;
  if (!serpApiKey) return [];

  const results: JobPosting[] = [];
  for (const company of WATCHED_COMPANIES) {
    try {
      const query = `${company.name} AI engineer`;
      const url = `https://serpapi.com/search.json?engine=google_jobs&q=${encodeURIComponent(query)}&api_key=${serpApiKey}`;
      const response = await fetch(url);
      if (!response.ok) continue;

      const data = await response.json();
      const jobs = data.jobs_results || [];

      for (const job of jobs) {
        const title = job.title || '';
        const description = job.description || '';
        const { category, skills } = isAiJob(title, description);
        const companyName = job.company_name || company.name;

        results.push(
          toAppJobPosting(
            `job-serp-${slugifyCompany(companyName, title)}`,
            title,
            companyName,
            job.location || 'Unknown',
            description.slice(0, 300),
            job.share_link || job.apply_link || '',
            job.date_posted || new Date().toISOString().slice(0, 10),
            category,
            skills
          )
        );
      }
    } catch (error) {
      console.warn(`Search API fetch failed for ${company.name}:`, error instanceof Error ? error.message : String(error));
    }
  }
  return results;
}

export async function fetchJobs(): Promise<JobPosting[]> {
  const [remoteOkJobs, searchJobs] = await Promise.all([fetchRemoteOk(), fetchFromSearchApi()]);

  const allJobs = [...remoteOkJobs, ...searchJobs];

  // 去重
  const seen = new Set<string>();
  return allJobs
    .filter((job) => {
      const key = `${job.company}-${job.title}`.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => b.postedAt.localeCompare(a.postedAt))
    .slice(0, 30);
}

export { WATCHED_COMPANIES };
