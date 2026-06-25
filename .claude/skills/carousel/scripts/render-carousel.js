#!/usr/bin/env node
/**
 * Carousel Renderer - {DEIN_NAME} Studio
 *
 * Renders an HTML carousel template to individual 1080x1350 PNG slides
 * using Playwright (chromium). Each .slide element becomes one PNG.
 *
 * Usage:
 *   node render-carousel.js <input.html> <output-dir>
 *
 * Example:
 *   node .claude/skills/carousel/scripts/render-carousel.js \
 *        tmp_video/carousel/slides.html \
 *        tmp_video/carousel
 *
 * Output:
 *   tmp_video/carousel/slide_01.png
 *   tmp_video/carousel/slide_02.png
 *   ...
 *   tmp_video/carousel/cover_A.png  (duplicate of slide_01 for A/B)
 *   tmp_video/carousel/cover_B.png  (alternate hook variant if present)
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SLIDE_WIDTH = 1080;
const SLIDE_HEIGHT = 1350;
const DEVICE_SCALE = 2; // retina-quality PNG

async function main() {
  const [, , inputArg, outputArg] = process.argv;

  if (!inputArg || !outputArg) {
    console.error('Usage: node render-carousel.js <input.html> <output-dir>');
    process.exit(1);
  }

  const inputPath = path.resolve(inputArg);
  const outputDir = path.resolve(outputArg);

  if (!fs.existsSync(inputPath)) {
    console.error(`ERROR: Input HTML not found: ${inputPath}`);
    process.exit(1);
  }

  // Auto-create output directory (per arbeitsregeln.md: no manual mkdir)
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`[carousel] Output dir ready: ${outputDir}`);

  console.log(`[carousel] Launching chromium...`);
  const browser = await chromium.launch({
    args: ['--font-render-hinting=none'],
  });

  const context = await browser.newContext({
    viewport: { width: SLIDE_WIDTH, height: SLIDE_HEIGHT },
    deviceScaleFactor: DEVICE_SCALE,
  });

  const page = await context.newPage();

  const fileUrl = 'file:///' + inputPath.replace(/\\/g, '/');
  console.log(`[carousel] Loading: ${fileUrl}`);
  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  // Wait for webfonts (Space Grotesk + Inter from Google Fonts)
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);

  const slides = await page.$$('.slide');
  console.log(`[carousel] Found ${slides.length} slides`);

  if (slides.length === 0) {
    console.error('ERROR: No .slide elements found in HTML');
    await browser.close();
    process.exit(1);
  }

  if (slides.length < 4) {
    console.warn(`WARNING: Only ${slides.length} slides - 2026 SOTA is 7-10 slides`);
  }
  if (slides.length > 10) {
    console.warn(`WARNING: ${slides.length} slides exceeds 10 - completion rate drops`);
  }

  const results = [];

  for (let i = 0; i < slides.length; i++) {
    const slideNum = String(i + 1).padStart(2, '0');
    const outPath = path.join(outputDir, `slide_${slideNum}.png`);

    // Measure actual slide box
    const box = await slides[i].boundingBox();
    if (!box) {
      console.warn(`[carousel] Slide ${slideNum}: no bounding box, skipping`);
      continue;
    }

    // Clip exactly to 1080x1350 at the slide origin
    await page.screenshot({
      path: outPath,
      clip: {
        x: box.x,
        y: box.y,
        width: SLIDE_WIDTH,
        height: SLIDE_HEIGHT,
      },
      omitBackground: false,
    });

    console.log(`[carousel] ${outPath}`);
    results.push(outPath);
  }

  // Cover A/B: duplicate slide 1 as cover_A, copy slide 2 as cover_B (fallback)
  if (results.length >= 1) {
    fs.copyFileSync(results[0], path.join(outputDir, 'cover_A.png'));
    console.log(`[carousel] cover_A.png (copy of slide_01)`);
  }
  if (results.length >= 2) {
    fs.copyFileSync(results[1], path.join(outputDir, 'cover_B.png'));
    console.log(`[carousel] cover_B.png (copy of slide_02 for A/B testing)`);
  }

  await browser.close();

  console.log(`\n[carousel] DONE - ${results.length} slides rendered at ${SLIDE_WIDTH}x${SLIDE_HEIGHT}`);
  console.log(`[carousel] Next: fire instagram-caption-generator skill for caption`);
}

main().catch((err) => {
  console.error('[carousel] FATAL:', err);
  process.exit(1);
});
