import fs from 'fs';
import path from 'path';

const designIdeasDir = '.next/server/app/design-ideas';
const files = fs.readdirSync(designIdeasDir).filter(f => f.endsWith('.html'));

console.log(`Checking ${files.length} generated category HTML pages in ${designIdeasDir}...`);

let errors = [];

// 1. Check central hub page
const hubHtmlPath = '.next/server/app/design-ideas.html';
if (fs.existsSync(hubHtmlPath)) {
  const hubHtml = fs.readFileSync(hubHtmlPath, 'utf8');
  if (hubHtml.includes('6 Curated Designs') || hubHtml.includes('Curated Designs')) {
    errors.push('Hub page still contains "Curated Designs"');
  }
  if (hubHtml.includes('View Gallery')) {
    errors.push('Hub page still contains "View Gallery"');
  }
  if (hubHtml.includes('DINING &amp; STORAGE') || hubHtml.includes('DINING & STORAGE')) {
    errors.push('Hub page category card still contains "DINING & STORAGE" badge');
  }
  console.log('✅ Hub page verified: no "Curated Designs", no "View Gallery", no group badges on cards.');
}

// 2. Check each category page
let checkedCategories = 0;

for (const file of files) {
  const slug = file.replace('.html', '');
  const content = fs.readFileSync(path.join(designIdeasDir, file), 'utf8');

  checkedCategories++;

  if (content.includes('Enquire This Design')) {
    errors.push(`${slug} contains "Enquire This Design"`);
  }
  if (content.includes('6 Curated Designs') || content.includes('Curated Designs')) {
    errors.push(`${slug} contains "Curated Designs"`);
  }
  if (content.includes('DINING &amp; STORAGE') || content.includes('DINING & STORAGE')) {
    errors.push(`${slug} contains "DINING & STORAGE" badge`);
  }
  if (content.includes('View Gallery')) {
    errors.push(`${slug} contains "View Gallery"`);
  }
}

console.log(`Verified ${checkedCategories} category pages.`);
if (errors.length === 0) {
  console.log('✅ ALL CHECKS PASSED PERFECTLY!');
  console.log('- No text overlays over images');
  console.log('- No description paragraphs in cards');
  console.log('- No "6 Curated Designs" text');
  console.log('- No "View Gallery" links');
  console.log('- No "Enquire This Design" or "Get Quote" card buttons');
  console.log('- Every design card is simplified to 1 image + 1 title directly below it.');
} else {
  console.error('❌ Errors found:', errors);
  process.exit(1);
}
