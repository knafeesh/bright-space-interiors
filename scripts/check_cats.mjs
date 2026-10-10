import fs from 'fs';

const content = fs.readFileSync('src/lib/design-ideas-data.ts', 'utf8');
const cats = [];
const regex = /slug:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g;
let match;
while ((match = regex.exec(content)) !== null) {
  cats.push({ slug: match[1], name: match[2] });
}
console.log('Total categories:', cats.length);
console.log(cats);
