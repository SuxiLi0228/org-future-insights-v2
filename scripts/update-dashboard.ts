import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import type { DashboardSnapshot } from '../src/types';

const inputPath = resolve(process.cwd(), 'scripts/dashboard-input.json');
const outputPath = resolve(process.cwd(), 'src/data/dashboard.ts');

function loadInput(): DashboardSnapshot {
  const raw = readFileSync(inputPath, 'utf-8');
  const parsed = JSON.parse(raw) as DashboardSnapshot;

  if (!parsed.date || !Array.isArray(parsed.kpis) || !Array.isArray(parsed.trends) || !Array.isArray(parsed.detailTables)) {
    throw new Error('dashboard-input.json 格式错误：必须包含 date、kpis、trends、detailTables 字段');
  }

  return parsed;
}

function stringifyValue(value: unknown, indent = 2, level = 1): string {
  if (value === null || typeof value === 'boolean' || typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'string') {
    // 包含单引号或中文直角引号时，使用反引号包裹
    if (value.includes("'") || value.includes('"') || value.includes('`') || value.includes('\n')) {
      return '`' + value.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\\\$/g, '\\$') + '`';
    }
    return `'${value}'`;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const items = value.map((v) => stringifyValue(v, indent, level + 1));
    const inner = items.join(',\n' + ' '.repeat((level + 1) * indent));
    return `[\n${' '.repeat((level + 1) * indent)}${inner}\n${' '.repeat(level * indent)}]`;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${k}: ${stringifyValue(v, indent, level + 1)}`);
    if (entries.length === 0) return '{}';
    const inner = entries.join(',\n' + ' '.repeat((level + 1) * indent));
    return `{\n${' '.repeat((level + 1) * indent)}${inner}\n${' '.repeat(level * indent)}}`;
  }

  return String(value);
}

function stringify(obj: unknown, indent = 2): string {
  return stringifyValue(obj, indent, 1);
}

function generateDashboardTs(snapshot: DashboardSnapshot): string {
  return `import { DashboardSnapshot } from '@/types';

export const dashboardSnapshot: DashboardSnapshot = ${stringify(snapshot, 2)};
`;
}

function main() {
  console.log('🔄 正在读取 scripts/dashboard-input.json...');
  const snapshot = loadInput();

  console.log('📝 正在生成 src/data/dashboard.ts...');
  const output = generateDashboardTs(snapshot);
  writeFileSync(outputPath, output, 'utf-8');

  console.log(`✅ 数据看板已更新：${snapshot.date}`);
  console.log(`   KPIs: ${snapshot.kpis.length} 项`);
  console.log(`   趋势图: ${snapshot.trends.length} 张`);
  console.log(`   明细表: ${snapshot.detailTables.length} 张`);
}

main();
