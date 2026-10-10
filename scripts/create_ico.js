const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createIco() {
  const publicDir = path.join(__dirname, '..', 'public');
  const srcAppDir = path.join(__dirname, '..', 'src', 'app');

  // Let's create 16x16, 32x32, and 48x48 PNG buffers for ICO
  // Using the crisp emblem-prioritized version for small sizes:
  const png16 = await sharp(path.join(publicDir, 'favicon-emblem-16.png')).toBuffer();
  const png32 = await sharp(path.join(publicDir, 'favicon-emblem-32.png')).toBuffer();
  const png48 = await sharp(path.join(publicDir, 'favicon-emblem-48.png')).toBuffer();

  const images = [
    { width: 16, height: 16, buffer: png16 },
    { width: 32, height: 32, buffer: png32 },
    { width: 48, height: 48, buffer: png48 }
  ];

  // ICO header: 6 bytes
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(images.length, 4); // number of images

  let offset = 6 + images.length * 16;
  const dirEntries = [];

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width, 0);
    entry.writeUInt8(img.height, 1);
    entry.writeUInt8(0, 2); // colors
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(img.buffer.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    dirEntries.push(entry);
    offset += img.buffer.length;
  }

  const icoBuffer = Buffer.concat([header, ...dirEntries, ...images.map(img => img.buffer)]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(srcAppDir, 'favicon.ico'), icoBuffer);
  console.log('✓ Multi-resolution favicon.ico generated (16x16, 32x32, 48x48)');

  // Also copy favicon-emblem-48.png to favicon-48x48.png and favicon.png (192x192)
  // And keep full logo in logo.png
  fs.copyFileSync(path.join(publicDir, 'favicon-emblem-48.png'), path.join(publicDir, 'favicon-48x48.png'));
  fs.copyFileSync(path.join(publicDir, 'favicon-emblem-192.png'), path.join(publicDir, 'favicon.png'));
  fs.copyFileSync(path.join(publicDir, 'favicon-emblem-32.png'), path.join(publicDir, 'favicon-32x32.png'));
  fs.copyFileSync(path.join(publicDir, 'favicon-emblem-16.png'), path.join(publicDir, 'favicon-16x16.png'));

  // In src/app:
  fs.copyFileSync(path.join(publicDir, 'favicon.png'), path.join(srcAppDir, 'icon.png'));

  console.log('✓ Public favicons updated with optimized emblem symbol for maximum visibility at small sizes');
}

createIco().catch(console.error);
