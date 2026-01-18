#!/usr/bin/env node
/**
 * Automated Screenshot Capture Tool
 *
 * Usage:
 *   node capture-screenshot.js [url] [output-path]
 *
 * Examples:
 *   node capture-screenshot.js
 *   node capture-screenshot.js http://localhost:3000
 *   node capture-screenshot.js http://localhost:3000 ./screenshots/home.png
 */

const playwright = require('playwright');

async function captureScreenshot(url = 'http://localhost:3000', outputPath = null) {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();

  // Set viewport size
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle' });

  // Wait a bit for any animations
  await page.waitForTimeout(1000);

  // Generate output path if not provided
  if (!outputPath) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    outputPath = `./screenshots/screenshot-${timestamp}.png`;
  }

  // Ensure directory exists
  const fs = require('fs');
  const dir = outputPath.substring(0, outputPath.lastIndexOf('/'));
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  console.log(`Capturing screenshot to ${outputPath}...`);
  await page.screenshot({ path: outputPath, fullPage: false });

  await browser.close();
  console.log(`✓ Screenshot saved: ${outputPath}`);

  return outputPath;
}

// CLI interface
const args = process.argv.slice(2);
const url = args[0] || 'http://localhost:3000';
const outputPath = args[1];

captureScreenshot(url, outputPath)
  .then(path => {
    console.log(`\nShare this path with Claude Code: ${path}`);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
