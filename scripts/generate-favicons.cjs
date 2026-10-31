const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generate() {
  const publicDir = path.resolve(__dirname, '../web/public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  // 1. favicon.svg (Vector SVG for modern browsers with dark mode support)
  const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <style>
    circle { fill: #111111; }
    @media (prefers-color-scheme: dark) {
      circle { fill: #ffffff; }
    }
  </style>
  <circle cx="16" cy="16" r="12"/>
</svg>
`;
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgFavicon, 'utf8');
  console.log('Created favicon.svg');

  // 2. favicon.png (32x32 transparent PNG with solid black dot)
  const svg32 = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="12" fill="#111111"/>
  </svg>`;
  await sharp(Buffer.from(svg32))
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('Created favicon.png');

  // 3. favicon.ico (fallback 32x32 ICO buffer)
  const icoBuf = await sharp(Buffer.from(svg32)).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuf);
  console.log('Created favicon.ico');

  // 4. apple-touch-icon.png (180x180 for iOS homescreen)
  const svg180 = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
    <rect width="180" height="180" fill="#ffffff" rx="40"/>
    <circle cx="90" cy="90" r="50" fill="#111111"/>
  </svg>`;
  await sharp(Buffer.from(svg180))
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');

  // 4b. icon-192.png and icon-512.png for PWA / manifest / modern touch targets
  const svg192 = `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
    <rect width="192" height="192" fill="#ffffff"/>
    <circle cx="96" cy="96" r="64" fill="#111111"/>
  </svg>`;
  await sharp(Buffer.from(svg192))
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));

  const svg512 = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <rect width="512" height="512" fill="#ffffff"/>
    <circle cx="256" cy="256" r="170" fill="#111111"/>
  </svg>`;
  await sharp(Buffer.from(svg512))
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));
  console.log('Created icon-192.png and icon-512.png');

  // 5. meta-logo.png (1200x630 Open Graph & Twitter Social Card)
  const svgMeta = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#ffffff"/>
    <circle cx="600" cy="260" r="54" fill="#111111"/>
    <text x="600" y="375" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="32" font-weight="700" letter-spacing="8" fill="#111111" text-anchor="middle">SHIVANSH NAYAK</text>
    <text x="600" y="420" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="16" font-weight="500" letter-spacing="3" fill="#666666" text-anchor="middle">WEBSITES · AI AGENTS · AUTOMATION</text>
  </svg>`;
  await sharp(Buffer.from(svgMeta))
    .png()
    .toFile(path.join(publicDir, 'meta-logo.png'));
  console.log('Created meta-logo.png');
}

generate().catch(console.error);
