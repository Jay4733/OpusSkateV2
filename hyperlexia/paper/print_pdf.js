// Print the review HTML to PDF with headless Chromium (Playwright).
// Usage: NODE_PATH=$(npm root -g) node print_pdf.js [in.html] [out.pdf] [png-prefix]
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const input = path.resolve(process.argv[2] || path.join(__dirname, 'hyperlexia_paper.html'));
  const output = path.resolve(process.argv[3] || path.join(__dirname, '..', 'Hyperlexia.pdf'));
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + input, { waitUntil: 'load' });
  const foot = `<div style="width:100%;font-family:'Liberation Sans',Arial;font-size:7px;color:#8a8983;padding:0 0.62in;display:flex;justify-content:space-between;">
    <span>Hyperlexia in Children and Adolescents · Narrative review · 2026</span>
    <span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`;
  await page.pdf({
    path: output, format: 'Letter', printBackground: true, preferCSSPageSize: true,
    displayHeaderFooter: true, headerTemplate: '<div></div>', footerTemplate: foot,
  });
  await browser.close();
  console.log('wrote', output);
})();
