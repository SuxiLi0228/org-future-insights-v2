/**
 * Markdown -> JSON 导入脚本
 * 将原项目的 Markdown 文件解析为结构化 JSON 数据
 *
 * 用法: npx tsx scripts/import-markdown.ts [source-dir] [output-dir]
 * 默认: source-dir = ../org-future-insights, output-dir = ./src/data
 */
import { readdir, readFile, writeFile, mkdir, stat } from 'fs/promises';
import { join, basename, extname } from 'path';
import { existsSync } from 'fs';

interface ImportResult {
  files: number;
  imported: number;
  errors: string[];
}

// 简易 Markdown frontmatter 解析
function parseFrontmatter(content: string): { meta: Record<string, string>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };

  const meta: Record<string, string> = {};
  match[1].split('\n').forEach((line) => {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      meta[line.slice(0, colonIdx).trim()] = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
    }
  });
  return { meta, body: match[2] };
}

// 从 Markdown 提取信号列表
function extractSignals(body: string): Array<{
  emoji: string;
  title: string;
  summary: string;
  priority: 'high' | 'medium' | 'low';
}> {
  const signals: Array<{ emoji: string; title: string; summary: string; priority: 'high' | 'medium' | 'low' }> = [];
  const lines = body.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // 匹配 "1. 🚨 **标题**" 格式
    const signalMatch = line.match(/^\d+\.\s+(🚨|💼|⚠️|🔄|📊|🎯|🔥|💡)\s+\*?\*?(.+?)\*?\*?[——]/);
    if (signalMatch) {
      const emoji = signalMatch[1];
      const title = signalMatch[2].replace(/\*\*/g, '').trim();

      // 收集后续段落作为 summary
      let summary = '';
      for (let j = i + 1; j < lines.length && j < i + 5; j++) {
        if (lines[j].trim() === '' || lines[j].match(/^\d+\./)) break;
        summary += lines[j].trim() + ' ';
      }

      const priority = emoji === '🚨' ? 'high' : emoji === '⚠️' ? 'medium' : 'medium';
      signals.push({ emoji, title, summary: summary.trim(), priority });
    }
  }
  return signals;
}

// 从文件名提取日期
function extractDate(filename: string): string | null {
  const match = filename.match(/(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
}

// 从文件名提取 session
function extractSession(filename: string): string {
  if (filename.includes('-pm')) return 'pm';
  if (filename.includes('-auto')) return 'auto';
  if (filename.includes('-visual')) return 'visual';
  return 'am';
}

async function importDailyReports(sourceDir: string, outputDir: string): Promise<ImportResult> {
  const dir = join(sourceDir, 'daily-reports');
  const result: ImportResult = { files: 0, imported: 0, errors: [] };

  if (!existsSync(dir)) {
    result.errors.push(`目录不存在: ${dir}`);
    return result;
  }

  const files = (await readdir(dir)).filter((f) => f.endsWith('.md'));
  result.files = files.length;

  const reports: any[] = [];

  for (const file of files) {
    try {
      const content = await readFile(join(dir, file), 'utf-8');
      const { meta, body } = parseFrontmatter(content);
      const date = extractDate(file) || meta.date || 'unknown';
      const session = extractSession(file);
      const signals = extractSignals(body);

      reports.push({
        id: basename(file, extname(file)),
        date,
        session,
        title: meta.title || `${date} · ${session === 'pm' ? 'PM 精读版' : session === 'auto' ? '自动版' : session === 'visual' ? '可视化' : '上午基线'}`,
        signals: signals.map((s, i) => ({
          id: `sig-${date}-${session}-${i + 1}`,
          ...s,
          detail: '',
          tags: [],
          relatedCompanies: [],
          sourceType: 'consulting',
          sourceName: '',
        })),
        actionPlan: [],
        sourceCoverage: { total: 0, types: [], baseline: 5, passed: false },
        content: body,
      });
      result.imported++;
    } catch (e) {
      result.errors.push(`解析失败: ${file} - ${e}`);
    }
  }

  // 写入输出文件
  const output = `import { DailyReport } from '@/types';\n\nexport const dailyReports: DailyReport[] = ${JSON.stringify(reports, null, 2)};\n`;
  await writeFile(join(outputDir, 'daily-reports.ts'), output, 'utf-8');

  return result;
}

async function main() {
  const sourceDir = process.argv[2] || join(process.cwd(), '..', 'org-future-insights');
  const outputDir = process.argv[3] || join(process.cwd(), 'src', 'data');

  console.log('📥 Markdown -> JSON 导入工具');
  console.log(`   源目录: ${sourceDir}`);
  console.log(`   输出目录: ${outputDir}`);
  console.log();

  if (!existsSync(outputDir)) {
    await mkdir(outputDir, { recursive: true });
  }

  // 导入日报
  console.log('📅 导入每日日报...');
  const dailyResult = await importDailyReports(sourceDir, outputDir);
  console.log(`   文件: ${dailyResult.files}, 成功: ${dailyResult.imported}, 错误: ${dailyResult.errors.length}`);
  if (dailyResult.errors.length > 0) {
    dailyResult.errors.forEach((e) => console.log(`   ❌ ${e}`));
  }

  console.log();
  console.log('✅ 导入完成！');
  console.log('   提示: 导入的数据为初始结构，可能需要手动补充信号详情和标签。');
}

main().catch(console.error);
