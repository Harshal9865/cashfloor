const puppeteer = require('puppeteer-core');
const path = require('path');

async function capture() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const outDir = 'C:\\Users\\Harsh\\.gemini\\antigravity-ide\\brain\\0df51bc4-1db5-4a12-a4d2-c1596d6eb5d4';

  console.log('Launching Edge from:', edgePath);
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  // 1. Capture Desktop Viewport (1440x900, 2x Retina)
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  
  console.log('Navigating to http://localhost:3000 on Desktop...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1200));

  const desktopOut = path.join(outDir, 'calm_ledger_stitch_desktop.png');
  console.log('Capturing Desktop full page screenshot to:', desktopOut);
  await page.screenshot({ path: desktopOut, fullPage: true });

  // 2. Open Pinterest Card Modal
  console.log('Clicking Pinterest Card button...');
  const clicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find((b) => b.textContent && b.textContent.includes('Pinterest'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });

  if (clicked) {
    await new Promise((r) => setTimeout(r, 800));
    const modalOut = path.join(outDir, 'calm_ledger_pinterest_card.png');
    console.log('Capturing Pinterest Card modal screenshot to:', modalOut);
    await page.screenshot({ path: modalOut, fullPage: false });
  }

  // 3. Capture Mobile Viewport (390x844 iPhone 14/15 size, 2x Retina)
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  console.log('Navigating to http://localhost:3000 on Mobile...');
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1200));

  const mobileOut = path.join(outDir, 'calm_ledger_stitch_mobile.png');
  console.log('Capturing Mobile full page screenshot to:', mobileOut);
  await mobilePage.screenshot({ path: mobileOut, fullPage: true });

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Capture error:', err);
  process.exit(1);
});
