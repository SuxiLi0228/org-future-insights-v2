import { XMLParser } from 'fast-xml-parser';
import type { ArxivPaper } from './types';

const ARXIV_QUERY = 'cat:cs.AI+OR+cat:cs.LG+OR+cat:cs.CL';
const MAX_RESULTS = 20;

export async function fetchArxivPapers(): Promise<ArxivPaper[]> {
  try {
    const url = `http://export.arxiv.org/api/query?search_query=${ARXIV_QUERY}&sortBy=submittedDate&sortOrder=descending&max_results=${MAX_RESULTS}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OrgFutureInsights/1.0)',
      },
    });

    if (!response.ok) {
      console.warn(`arXiv fetch failed: ${response.status}`);
      return [];
    }

    const xml = await response.text();
    const parser = new XMLParser({ ignoreAttributes: false });
    const parsed = parser.parse(xml);

    const entries = parsed.feed?.entry || [];
    const rawEntries = Array.isArray(entries) ? entries : [entries];

    return rawEntries
      .map((entry: any) => {
        const title = (entry.title || '').replace(/\s+/g, ' ').trim();
        const summary = (entry.summary || '').replace(/\s+/g, ' ').trim().slice(0, 400);
        const link = entry.id || '';
        const published = entry.published || new Date().toISOString();
        const authors = entry.author
          ? Array.isArray(entry.author)
            ? entry.author.map((a: any) => a.name || '')
            : [entry.author.name || '']
          : [];
        const categories = entry.category
          ? Array.isArray(entry.category)
            ? entry.category.map((c: any) => c['@_term'] || '')
            : [entry.category['@_term'] || '']
          : [];

        return {
          id: `arxiv-${link.split('/').pop() || Date.now()}`,
          title,
          authors,
          summary,
          link,
          publishedAt: new Date(published).toISOString().slice(0, 10),
          categories,
        };
      })
      .filter((p) => p.title && p.link);
  } catch (error) {
    console.warn('Error fetching arXiv:', error instanceof Error ? error.message : String(error));
    return [];
  }
}
