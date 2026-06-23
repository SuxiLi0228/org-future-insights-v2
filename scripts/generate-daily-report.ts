import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { generatedNews, generatedPapers, generatedJobs } from '../src/data/generated/fetched-data';
import type { DailyReport, Signal, ActionItem, SourceCoverage, SourceType } from '../src/types';

const GENERATED_DIR = join(process.cwd(), 'src', 'data', 'generated');
const DAILY_REPORTS_FILE = join(GENERATED_DIR, 'daily-reports.ts');

const today = new Date().toISOString().slice(0, 10);

function inferSourceType(source: string): SourceType {
  const lower = source.toLowerCase();
  if (lower.includes('mit') || lower.includes('arxiv')) return 'academic';
  if (lower.includes('hbr') || lower.includes('harvard')) return 'think_tank';
  if (lower.includes('hr')) return 'hr_media';
  if (lower.includes('wef')) return 'think_tank';
  return 'tech';
}

function inferTags(title: string, summary: string): string[] {
  const text = `${title} ${summary}`.toLowerCase();
  const tags = new Set<string>();

  const map: Record<string, string[]> = {
    ai: ['ai', 'artificial intelligence', 'machine learning', 'llm', 'generative ai'],
    agent: ['agent', 'agents'],
    'ai-hr': ['hiring', 'recruiting', 'talent', 'workforce', 'hr'],
    organization: ['organization', 'structure', 'team', 'culture'],
    strategy: ['strategy', 'competitive', 'transformation'],
    ecommerce: ['ecommerce', 'retail', 'amazon', 'shopify', 'marketplace'],
  };

  for (const [tag, keywords] of Object.entries(map)) {
    if (keywords.some((kw) => text.includes(kw))) tags.add(tag);
  }

  return Array.from(tags);
}

function inferPriority(title: string, summary: string): 'high' | 'medium' | 'low' {
  const text = `${title} ${summary}`.toLowerCase();
  if (text.includes('layoff') || text.includes('cut') || text.includes('crisis') || text.includes('regulation')) return 'high';
  if (text.includes('launch') || text.includes('new') || text.includes('partnership')) return 'medium';
  return 'low';
}

function generateSignals(): Signal[] {
  const signals: Signal[] = [];

  // 从新闻生成信号
  const topNews = generatedNews.slice(0, 3);
  for (const [index, news] of topNews.entries()) {
    signals.push({
      id: `sig-${today}-auto-${index + 1}`,
      emoji: inferPriority(news.title, news.summary) === 'high' ? '🚨' : inferPriority(news.title, news.summary) === 'medium' ? '⚠️' : '💡',
      title: news.title,
      summary: news.summary,
      detail: `来源: ${news.source}。${news.summary}`,
      priority: inferPriority(news.title, news.summary),
      tags: inferTags(news.title, news.summary),
      relatedCompanies: [],
      sourceType: inferSourceType(news.source),
      sourceName: news.source,
    });
  }

  // 从论文生成一个信号
  const topPaper = generatedPapers[0];
  if (topPaper) {
    signals.push({
      id: `sig-${today}-auto-4`,
      emoji: '📄',
      title: `研究速递：${topPaper.title.slice(0, 60)}...`,
      summary: topPaper.summary.slice(0, 200),
      detail: `作者: ${topPaper.authors.slice(0, 3).join(', ')}。${topPaper.summary}`,
      priority: 'medium',
      tags: ['ai', 'research'],
      relatedCompanies: [],
      sourceType: 'academic',
      sourceName: 'arXiv',
    });
  }

  // 从岗位生成一个信号
  const topJob = generatedJobs[0];
  if (topJob) {
    signals.push({
      id: `sig-${today}-auto-5`,
      emoji: '💼',
      title: `${topJob.company || '某科技公司'} 正在招募 ${topJob.title}`,
      summary: `岗位类型：${topJob.category === 'pure_ai' ? '纯 AI 岗' : '业务+AI 复合岗'}。${topJob.responsibilities[0] || ''}`,
      detail: `技能要求: ${topJob.skills?.join(', ') || '未标注'}。${topJob.responsibilities.join(' ')}`,
      priority: 'medium',
      tags: ['ai-hr', 'talent'],
      relatedCompanies: topJob.company ? [topJob.company] : [],
      sourceType: 'tech',
      sourceName: topJob.company || 'Company Career',
    });
  }

  return signals.slice(0, 3);
}

function generateActionPlan(signals: Signal[]): ActionItem[] {
  return signals.map((signal, index) => ({
    id: `action-${today}-${index + 1}`,
    priority: signal.priority,
    action: `关注「${signal.title.slice(0, 40)}」对 HR 组织人才的影响`,
    timeWindow: signal.priority === 'high' ? '本周内' : signal.priority === 'medium' ? '两周内' : '持续关注',
    basis: signal.sourceName,
  }));
}

function generateSourceCoverage(): SourceCoverage {
  const types: SourceType[] = [];
  if (generatedNews.length > 0) types.push('tech');
  if (generatedPapers.length > 0) types.push('academic');
  if (generatedJobs.length > 0) types.push('tech');

  return {
    total: generatedNews.length + generatedPapers.length + generatedJobs.length,
    types: Array.from(new Set(types)),
    baseline: 5,
    passed: generatedNews.length + generatedPapers.length + generatedJobs.length >= 5,
  };
}

function generateReport(): DailyReport {
  const signals = generateSignals();

  return {
    id: `report-${today}-auto`,
    date: today,
    session: 'auto',
    title: `${today} 自动日报 · AI 与 HR 情报聚合`,
    signals,
    actionPlan: generateActionPlan(signals),
    sourceCoverage: generateSourceCoverage(),
    content: `本报告由自动化脚本于 ${today} 生成，聚合了 ${generatedNews.length} 条新闻、${generatedPapers.length} 篇论文、${generatedJobs.length} 个岗位。`,
    fetchWindow: `${today} 00:00 - ${today} 23:59`,
  };
}

async function main() {
  console.log('📝 开始生成日报...\n');

  // 如果抓取数据为空，跳过生成
  if (generatedNews.length === 0 && generatedPapers.length === 0 && generatedJobs.length === 0) {
    console.log('⚠️ 没有抓取到任何数据，跳过日报生成');
    console.log('   提示：可以配置 RSS 源、API Key 或等待定时任务运行。');
    return;
  }

  if (!existsSync(GENERATED_DIR)) {
    await mkdir(GENERATED_DIR, { recursive: true });
  }

  // 读取已有生成报告
  let existingReports: DailyReport[] = [];
  try {
    const content = await readFile(DAILY_REPORTS_FILE, 'utf-8');
    const match = content.match(/export const generatedDailyReports: DailyReport\[\] = ([\s\S]*?);\s*$/);
    if (match) {
      existingReports = eval(`(${match[1]})`) as DailyReport[];
    }
  } catch {
    existingReports = [];
  }

  // 避免同一天重复生成
  if (existingReports.some((r) => r.date === today)) {
    console.log(`⚠️ ${today} 的日报已存在，跳过生成`);
    return;
  }

  const newReport = generateReport();
  const updatedReports = [newReport, ...existingReports];

  const output = `import type { DailyReport } from '@/types';

export const generatedDailyReports: DailyReport[] = ${JSON.stringify(updatedReports, null, 2)};
`;

  await writeFile(DAILY_REPORTS_FILE, output, 'utf-8');

  console.log(`✅ 日报生成完成`);
  console.log(`   日期: ${today}`);
  console.log(`   信号: ${newReport.signals.length} 条`);
  console.log(`   行动: ${newReport.actionPlan.length} 项`);
  console.log(`   输出: ${DAILY_REPORTS_FILE}`);
}

main().catch((error) => {
  console.error('日报生成失败:', error);
  process.exit(1);
});
