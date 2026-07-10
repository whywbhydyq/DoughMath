import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');
const failures = [];
const policy = read('src/lib/publicPolicy.ts');
for (const slug of ['bakers-percentage-calculator', 'sourdough-hydration-calculator', 'starter-feeding-calculator', 'dough-scaling-calculator', 'pizza-dough-calculator']) {
  if (!policy.includes(`'${slug}'`)) failures.push(`Missing approved core calculator: ${slug}`);
}
const toolPage = read('src/components/ToolPage.tsx');
const calculatorAt = toolPage.indexOf('<Calculator');
const headingAt = toolPage.indexOf('<h1');
if (calculatorAt < 0 || headingAt < 0 || calculatorAt > headingAt) failures.push('Calculator must be the first visual content on every tool page');
if (!toolPage.includes('robots: isIndexableToolSlug')) failures.push('Tool metadata must apply the index policy');
const ads = read('src/components/AdSenseAutoAds.tsx');
if (!ads.includes('isAdsenseAllowedPath')) failures.push('AdSense must use the explicit route allowlist');
const sitemap = read('src/app/sitemap.ts');
if (!sitemap.includes('isIndexableToolSlug')) failures.push('Sitemap must filter the tool inventory');
const guides = read('src/lib/guideData.ts');
for (const phrase of ['Worked scaling example', 'Total hydration includes the starter split', 'Convert a target weight into parts', 'Solve backward from target dough weight', 'Use suitable precision']) {
  if (!guides.includes(phrase)) failures.push(`Guide content missing unique section: ${phrase}`);
}
const sectionCount = (guides.match(/heading:/g) || []).length;
if (sectionCount < 15) failures.push(`Expected at least 15 unique guide sections, found ${sectionCount}`);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('DoughMath source policy audit passed');
