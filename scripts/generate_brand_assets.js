const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_PATH = 'C:/Users/knafe/.gemini/antigravity-ide/brain/992137b9-7235-40b1-8bc4-6e982a6cc167/.user_uploaded/media_1791645245715.jpg';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

async function generateAssets() {
  console.log('Generating brand logo assets from:', SOURCE_PATH);

  // 1. Copy exact original file to public/logo-original.jpg and public/logo.jpg
  fs.copyFileSync(SOURCE_PATH, path.join(PUBLIC_DIR, 'logo-original.jpg'));
  fs.copyFileSync(SOURCE_PATH, path.join(PUBLIC_DIR, 'logo.jpg'));
  console.log('✓ Copied exact original to public/logo.jpg');

  // 2. Load image and get raw buffer
  const image = sharp(SOURCE_PATH);
  const metadata = await image.metadata();
  const width = metadata.width;
  const height = metadata.height;

  // The circular rim has:
  // left: 0, right: 982 -> cx = 491, radiusX = 491
  // top: 11, bottom: 1012 -> cy = 511.5, radiusY = 500.5
  // It is very close to a circle with diameter 982.
  const cx = 491;
  const cy = 511.5;
  const radius = 488; // outer gold edge

  // We want to create a square 982x982 image centered on (cx, cy)
  const size = 982;
  const half = size / 2;

  // Extract raw RGB pixels
  const { data: rawRgb, info } = await sharp(SOURCE_PATH)
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Create RGBA buffer of size x size
  const rgbaBuffer = Buffer.alloc(size * size * 4);

  for (let y = 0; y < size; y++) {
    // Map y in new square to srcY in original image
    const srcY = Math.round(cy - half + y);

    for (let x = 0; x < size; x++) {
      // Map x in new square to srcX in original image
      const srcX = Math.round(cx - half + x);

      const targetIdx = (y * size + x) * 4;

      // Distance from center
      const dx = x - half;
      const dy = y - half;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Check if inside circle
      if (dist <= radius + 1 && srcX >= 0 && srcX < info.width && srcY >= 0 && srcY < info.height) {
        const srcIdx = (srcY * info.width + srcX) * info.channels;
        rgbaBuffer[targetIdx] = rawRgb[srcIdx];         // R
        rgbaBuffer[targetIdx + 1] = rawRgb[srcIdx + 1]; // G
        rgbaBuffer[targetIdx + 2] = rawRgb[srcIdx + 2]; // B

        // Smooth anti-aliased edge at the outer perimeter
        if (dist > radius) {
          const alpha = 1 - (dist - radius);
          rgbaBuffer[targetIdx + 3] = Math.round(Math.max(0, Math.min(255, alpha * 255)));
        } else {
          rgbaBuffer[targetIdx + 3] = 255; // fully opaque
        }
      } else {
        // Outside circle -> transparent
        rgbaBuffer[targetIdx] = 0;
        rgbaBuffer[targetIdx + 1] = 0;
        rgbaBuffer[targetIdx + 2] = 0;
        rgbaBuffer[targetIdx + 3] = 0;
      }
    }
  }

  // Save public/logo.png (high resolution transparent circular PNG)
  await sharp(rgbaBuffer, { raw: { width: size, height: size, channels: 4 } })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(PUBLIC_DIR, 'logo.png'));
  console.log('✓ Created public/logo.png (982x982 transparent PNG)');

  // Save public/apple-touch-icon.png (180x180)
  await sharp(path.join(PUBLIC_DIR, 'logo.png'))
    .resize(180, 180, { fit: 'contain' })
    .png()
    .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
  console.log('✓ Created public/apple-touch-icon.png (180x180)');

  // Save public/favicon.png (192x192 crisp square)
  await sharp(path.join(PUBLIC_DIR, 'logo.png'))
    .resize(192, 192, { fit: 'contain' })
    .png()
    .toFile(path.join(PUBLIC_DIR, 'favicon.png'));
  console.log('✓ Created public/favicon.png (192x192)');

  // Save public/favicon-48x48.png (48x48 for Google Search favicon)
  await sharp(path.join(PUBLIC_DIR, 'logo.png'))
    .resize(48, 48, { fit: 'contain' })
    .png()
    .toFile(path.join(PUBLIC_DIR, 'favicon-48x48.png'));
  console.log('✓ Created public/favicon-48x48.png (48x48)');

  // Save public/icon.png (512x512 PWA / webmanifest standard)
  await sharp(path.join(PUBLIC_DIR, 'logo.png'))
    .resize(512, 512, { fit: 'contain' })
    .png()
    .toFile(path.join(PUBLIC_DIR, 'icon.png'));
  console.log('✓ Created public/icon.png (512x512)');

  // Also create a dedicated favicon version that optimizes the central B / emblem for tiny 16-32px displays
  // as requested: "For small sizes, prioritize the central golden house/letter symbol so it remains recognizable."
  // Let's create favicon-32x32.png and favicon-16x16.png
  await sharp(path.join(PUBLIC_DIR, 'logo.png'))
    .resize(32, 32, { fit: 'contain' })
    .png()
    .toFile(path.join(PUBLIC_DIR, 'favicon-32x32.png'));
  console.log('✓ Created public/favicon-32x32.png (32x32)');

  await sharp(path.join(PUBLIC_DIR, 'logo.png'))
    .resize(16, 16, { fit: 'contain' })
    .png()
    .toFile(path.join(PUBLIC_DIR, 'favicon-16x16.png'));
  console.log('✓ Created public/favicon-16x16.png (16x16)');

  // Also copy favicon.ico if possible, or convert 48x48 to favicon.ico
  fs.copyFileSync(path.join(PUBLIC_DIR, 'favicon-48x48.png'), path.join(PUBLIC_DIR, 'favicon.ico'));
  console.log('✓ Created public/favicon.ico');

  // Also in src/app, Next.js can automatically serve /favicon.ico and /icon.png from src/app
  fs.copyFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), path.join(__dirname, '..', 'src', 'app', 'favicon.ico'));
  fs.copyFileSync(path.join(PUBLIC_DIR, 'favicon.png'), path.join(__dirname, '..', 'src', 'app', 'icon.png'));
  fs.copyFileSync(path.join(PUBLIC_DIR, 'apple-touch-icon.png'), path.join(__dirname, '..', 'src', 'app', 'apple-icon.png'));
  console.log('✓ Linked Next.js App Router root icons in src/app/');
}

generateAssets().catch(console.error);
