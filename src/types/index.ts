// ===== 数据来源类型 =====
export type SourceType =
  | 'consulting'    // 咨询机构
  | 'tech'          // 科技公司
  | 'academic'      // 学术研究
  | 'think_tank'    // 智库
  | 'vc'            // 风险投资
  | 'hr_media'      // HR 媒体
  | 'china_local';  // 中国本土

export interface SourceInfo {
  type: SourceType;
  name: string;
  label: string;
}

// ===== 信号类型 =====
export type Priority = 'high' | 'medium' | 'low';

export interface Signal {
  id: string;
  emoji: string;
  title: string;
  summary: string;
  detail: string;
  priority: Priority;
  tags: string[];
  relatedCompanies: string[];
  sourceType: SourceType;
  sourceName: string;
}

// ===== 行动项 =====
export interface ActionItem {
  id: string;
  priority: Priority;
  action: string;
  timeWindow: string;
  basis: string;
}

// ===== 来源覆盖 =====
export interface SourceCoverage {
  total: number;
  types: SourceType[];
  baseline: number;
  passed: boolean;
}

// ===== 每日日报 =====
export type Session = 'am' | 'pm' | 'auto' | 'visual';

export interface DailyReport {
  id: string;
  date: string;
  session: Session;
  title: string;
  signals: Signal[];
  actionPlan: ActionItem[];
  sourceCoverage: SourceCoverage;
  content: string;
  fetchWindow?: string;
}

// ===== 公司 =====
export type CompanyCategory = 'ai' | 'ecommerce';

export interface JobPosting {
  id: string;
  title: string;
  company?: string;                        // 所属公司
  category: 'pure_ai' | 'hybrid_ai';   // 纯 AI 岗 vs 业务+AI 复合岗
  responsibilities: string[];            // 核心职责（用于反推战略）
  skills?: string[];                      // 技能要求
  location: string;
  source: 'linkedin' | 'company_career' | 'greenhouse' | 'ashby';
  sourceUrl: string;
  postedAt?: string;                      // 发布日期
  isNew?: boolean;                        // 是否新发布
}

export interface CompanyUpdate {
  id: string;
  date: string;
  company: string;
  person?: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  category: CompanyCategory;
  bizImpact?: string;   // 电商竞对：业务动向
  orgImpact?: string;   // 电商竞对：组织/人才影响
  aiEffort?: string;    // 电商竞对：AI 转型尝试
  jobPostings?: JobPosting[];           // AI 相关在招岗位
  strategicSignal?: string;             // 从岗位反推的战略信号
}

// ===== 研究 =====
export interface ResearchPaper {
  id: string;
  date: string;
  title: string;
  authors: string[];
  institution: string;
  sourceType: SourceType;
  summary: string;
  keyFindings: string[];
  hrImplications: string;
  tags: string[];
  url?: string;
}

// ===== 转型案例 =====
export type CaseOutcome = 'success' | 'failure' | 'mixed';
export type CaseStage = 'exploring' | 'scaling' | 'deep';

export interface TransformCase {
  id: string;
  date: string;
  company: string;
  industry?: string;       // 行业
  companySize?: string;    // 公司规模
  title: string;
  outcome: CaseOutcome;
  stage: CaseStage;        // 转型阶段
  summary: string;
  timeline?: string;       // 转型时间线
  metrics?: string[];      // 量化结果
  whatWorked: string[];
  whatFailed: string[];
  hrLessons: string[];
  tags: string[];
}

// ===== 延伸阅读 =====
export interface Reading {
  id: string;
  date: string;
  title: string;
  originalTitle?: string;
  source: string;
  sourceType: SourceType;
  summary: string;
  keyExcerpts: { text: string; context: string }[];
  editorNote: string;
  tags: string[];
  url?: string;
}

// ===== 自动抓取数据类型 =====
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

// ===== HR 词典 =====
export interface GlossaryTerm {
  id: string;
  term: string;
  chinese: string;
  definition: string;
  example: string;
  relatedTerms: string[];
  firstSeen: string;
}

// ===== 数据看板 =====
export interface KPIData {
  id: string;
  label: string;
  value: number;
  unit: string;
  change?: number;
  changeLabel?: string;
  color: string;
  date: string;
}

export interface DetailTableRow {
  indicator: string;
  value: string;
  yoyChange?: string;
  source?: string;
  impact?: string;
}

export interface DetailTable {
  id: string;
  title: string;
  emoji: string;
  columns: string[];
  rows: DetailTableRow[];
  hrInsight?: string;
}

export interface DashboardSnapshot {
  date: string;
  kpis: KPIData[];
  trends: { label: string; data: { date: string; value: number }[] }[];
  detailTables: DetailTable[];
}

// ===== 行业议程 =====
export type EventRegion = 'north_america' | 'europe' | 'asia_pacific' | 'online';

export interface EventItem {
  id: string;
  name: string;
  organizer: string;
  date: string;
  endDate?: string;
  location: string;
  region: EventRegion;
  type: string;
  url?: string;
  relevance: 'high' | 'medium' | 'low';
}

// ===== 板块导航 =====
export interface Section {
  id: string;
  emoji: string;
  title: string;
  description: string;
  path: string;
  count: number;
}

// ===== 用户偏好 =====
export type UserRole = 'chro' | 'hrbp' | 'learner' | 'od';

export interface UserPreferences {
  role: UserRole | null;
  readHistory: string[];
  favorites: string[];
  theme: 'light' | 'dark' | 'system';
}

// ===== 搜索结果 =====
export interface SearchResult {
  id: string;
  title: string;
  section: string;
  excerpt: string;
  path: string;
  score: number;
}
