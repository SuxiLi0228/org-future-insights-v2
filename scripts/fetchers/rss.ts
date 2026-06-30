import { XMLParser } from 'fast-xml-parser';
import type { NewsItem } from './types';

interface RssFeed {
  name: string;
  url: string;
  tags: string[];
}

// 可配置的 RSS 源列表
const RSS_FEEDS: RssFeed[] = [
  {
    name: 'MIT Technology Review',
    url: 'https://www.technologyreview.com/feed/',
    tags: ['ai', 'technology'],
  },
  {
    name: 'Harvard Business Review',
    url: 'https://hbr.org/rss/topics/technology.topic',
    tags: ['hr', 'organization', 'technology'],
  },
  {
    name: 'World Economic Forum',
    url: 'https://feeds.weforum.org/agenda',
    tags: ['future-of-work', 'ai', 'policy'],
  },
  {
    name: 'HR Executive',
    url: 'https://hrexecutive.com/feed/',
    tags: ['hr', 'ai-hr'],
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

function inferTags(title: string, summary: string, baseTags: string[]): string[] {
  const text = `${title} ${summary}`.toLowerCase();
  const tags = new Set(baseTags);

  const keywordMap: Record<string, string[]> = {
    ai: ['ai', 'artificial intelligence', 'machine learning', 'llm', 'generative ai', 'agent'],
    'ai-hr': ['hr tech', 'recruiting', 'hiring', 'talent', 'workforce', 'employee', 'people analytics'],
    organization: ['organization', 'structure', 'reorg', 'team', 'culture', 'leadership'],
    strategy: ['strategy', 'competitive', 'transformation', 'digital'],
    ecommerce: ['ecommerce', 'retail', 'amazon', 'shopify', 'marketplace'],
  };

  for (const [tag, keywords] of Object.entries(keywordMap)) {
    if (keywords.some((kw) => text.includes(kw))) tags.add(tag);
  }

  return Array.from(tags);
}

async function fetchFeed(feed: RssFeed): Promise<NewsItem[]> {
  try {
    const response = await fetch(feed.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OrgFutureInsights/1.0)',
      },
    });

    if (!response.ok) {
      console.warn(`RSS fetch failed for ${feed.name}: ${response.status}`);
      return [];
    }

    const xml = await response.text();
    const parser = new XMLParser({ ignoreAttributes: false });
    const parsed = parser.parse(xml);

    const channel = parsed.rss?.channel || parsed.feed;
    const items = channel?.item || channel?.entry || [];
    const rawItems = Array.isArray(items) ? items : [items];

    return rawItems
      .slice(0, 10)
      .map((item: any) => {
        const title = item.title || '';
        const link = item.link || item.guid || '';
        const description = item.description || item.summary || '';
        const pubDate = item.pubDate || item.published || item.updated || new Date().toISOString();
        const summary = description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 600);

        return {
          id: `news-${slugify(title)}-${new Date(pubDate).getTime()}`,
          title: title.replace(/<[^>]+>/g, ''),
          link: typeof link === 'string' ? link : link['#text'] || '',
          summary,
          publishedAt: new Date(pubDate).toISOString().slice(0, 10),
          source: feed.name,
          tags: inferTags(title, summary, feed.tags),
        };
      })
      .filter((item) => item.title && item.link);
  } catch (error) {
    console.warn(`Error fetching ${feed.name}:`, error instanceof Error ? error.message : String(error));
    return [];
  }
}

export async function fetchNews(): Promise<NewsItem[]> {
  const results = await Promise.all(RSS_FEEDS.map(fetchFeed));
  const allNews = results.flat();

  // 去重并排序
  const seen = new Set<string>();
  return allNews
    .filter((item) => {
      if (seen.has(item.link)) return false;
      seen.add(item.link);
      return true;
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 30);
}
