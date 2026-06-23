import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { fetchNews } from './fetchers/rss';
import { fetchArxivPapers } from './fetchers/arxiv';
import { fetchJobs } from './fetchers/jobs';
import type { FetchedData } from './fetchers/types';

const OUTPUT_DIR = join(process.cwd(), 'src', 'data', 'generated');

async function main() {
  console.log('🌐 开始抓取外部数据...\n');

  const [news, papers, jobs] = await Promise.all([
    fetchNews().catch((e) => {
      console.warn('News fetch error:', e);
      return [];
    }),
    fetchArxivPapers().catch((e) => {
      console.warn('arXiv fetch error:', e);
      return [];
    }),
    fetchJobs().catch((e) => {
      console.warn('Jobs fetch error:', e);
      return [];
    }),
  ]);

  const data: FetchedData = {
    news,
    papers,
    jobs,
    fetchedAt: new Date().toISOString(),
  };

  if (!existsSync(OUTPUT_DIR)) {
    await mkdir(OUTPUT_DIR, { recursive: true });
  }

  const output = `import type { NewsItem, ArxivPaper, JobPosting } from '@/types';

export const generatedNews: NewsItem[] = ${JSON.stringify(news, null, 2)};

export const generatedPapers: ArxivPaper[] = ${JSON.stringify(papers, null, 2)};

export const generatedJobs: JobPosting[] = ${JSON.stringify(jobs, null, 2)};

export const dataFetchedAt = '${data.fetchedAt}';
`;

  await writeFile(join(OUTPUT_DIR, 'fetched-data.ts'), output, 'utf-8');

  console.log(`✅ 数据抓取完成`);
  console.log(`   新闻: ${news.length} 条`);
  console.log(`   论文: ${papers.length} 篇`);
  console.log(`   岗位: ${jobs.length} 个`);
  console.log(`   输出: ${join('src', 'data', 'generated', 'fetched-data.ts')}`);
}

main().catch((error) => {
  console.error('数据抓取失败:', error);
  process.exit(1);
});
