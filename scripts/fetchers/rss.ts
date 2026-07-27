import { XMLParser } from 'fast-xml-parser';
import type { NewsItem } from './types';

interface RssFeed {
  name: string;
  url: string;
  tags: string[];
}

// 可配置的 RSS 源列表
const RSS_FEEDS: RssFeed[] = [
  // 国际科技
  {
    name: 'MIT Technology Review',
    url: 'https://www.technologyreview.com/feed/',
    tags: ['ai', 'technology'],
  },
  {
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    tags: ['technology', 'startup', 'ai'],
  },
  // HR 垂直媒体
  {
    name: 'HR Executive',
    url: 'https://hrexecutive.com/feed/',
    tags: ['hr', 'ai-hr'],
  },
  {
    name: 'HR Dive',
    url: 'https://www.hrdive.com/feeds/news/',
    tags: ['hr', 'ai-hr', 'workforce'],
  },
  // 中国科技 / AI 媒体
  {
    name: '36氪',
    url: 'https://36kr.com/feed',
    tags: ['china', 'technology', 'startup', 'ai'],
  },
  {
    name: '量子位',
    url: 'https://www.qbitai.com/feed',
    tags: ['china', 'ai', 'technology'],
  },
  {
    name: '虎嗅',
    url: 'https://rss.huxiu.com/',
    tags: ['china', 'business', 'technology'],
  },
  {
    name: '钛媒体',
    url: 'https://www.tmtpost.com/rss',
    tags: ['china', 'technology', 'business', 'ai'],
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

  // 按来源去重，每个来源保留最新 5 条
  const perSource: NewsItem[][] = results.map((items) => {
    const seen = new Set<string>();
    return items
      .filter((item) => {
        if (seen.has(item.link)) return false;
        seen.add(item.link);
        return true;
      })
      .slice(0, 5);
  });

  // 轮询混合各来源，避免单一来源垄断，同时保证来源多样性
  const mixed: NewsItem[] = [];
  let index = 0;
  while (mixed.length < 30) {
    let added = false;
    for (const sourceItems of perSource) {
      if (sourceItems[index]) {
        mixed.push(sourceItems[index]);
        added = true;
        if (mixed.length >= 30) break;
      }
    }
    if (!added) break;
    index++;
  }

  return mixed;
}
