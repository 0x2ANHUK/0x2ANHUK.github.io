const playwright = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await playwright.chromium.launch();
  const screenshotsDir = './screenshots';
  if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir);

  const pages = [
    { url: 'http://127.0.0.1:9696/nexus/', name: 'nexus-hub' },
    { url: 'http://127.0.0.1:9696/nexus/nexus-genesis.html', name: 'nexus-genesis' },
    { url: 'http://127.0.0.1:9696/nexus/nexus-autonomy.html', name: 'nexus-autonomy' },
    { url: 'http://127.0.0.1:9696/nexus/nexus-discovery.html', name: 'nexus-discovery' },
    { url: 'http://127.0.0.1:9696/nexus/nexus-integration.html', name: 'nexus-integration' }
  ];

  // Desktop
  const desktopCtx = await browser.createContext({ viewport: { width: 1920, height: 1080 } });
  for (const page of pages) {
    const p = await desktopCtx.newPage();
    await p.goto(page.url, { waitUntil: 'networkidle' });
    await p.screenshot({ path: `${screenshotsDir}/${page.name}-desktop.png`, fullPage: true });
    console.log(`✅ ${page.name} (desktop)`);
    await p.close();
  }
  await desktopCtx.close();

  // Mobile (iPhone 12)
  const mobileCtx = await browser.createContext({ viewport: { width: 390, height: 844 } });
  for (const page of pages) {
    const p = await mobileCtx.newPage();
    await p.goto(page.url, { waitUntil: 'networkidle' });
    await p.screenshot({ path: `${screenshotsDir}/${page.name}-mobile.png`, fullPage: true });
    console.log(`✅ ${page.name} (mobile)`);
    await p.close();
  }
  await mobileCtx.close();

  await browser.close();
  console.log(`\n✨ Screenshots saved to ./${screenshotsDir}/`);
})();
