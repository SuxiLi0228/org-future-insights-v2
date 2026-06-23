export interface NewsItem {
  id: string;
  title: string;
  link: string;
  summary: string;
  publishedAt: string;
  source: string;
  tags: string[];
}

export interface ArxivPaper {
  id: string;
  title: string;
  authors: string[];
  summary: string;
  link: string;
  publishedAt: string;
  categories: string[];
}

export interface JobPosting {
  id: string;
  title: string;
  company?: string;
  category: 'pure_ai' | 'hybrid_ai';
  responsibilities: string[];
  skills?: string[];
  location: string;
  source: 'linkedin' | 'company_career' | 'greenhouse' | 'ashby';
  sourceUrl: string;
  postedAt?: string;
  isNew?: boolean;
  description?: string; // 临时字段，用于生成 responsibilities
}

export interface FetchedData {
  news: NewsItem[];
  papers: ArxivPaper[];
  jobs: JobPosting[];
  fetchedAt: string;
}
