const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

/**
 * Renders HTML content into a PDF document and captures a layout screenshot.
 *
 * @param {string} htmlContent - The HTML layout content.
 * @param {string} pdfOutputPath - File path for the generated PDF.
 * @param {string} screenshotOutputPath - File path for the layout screenshot PNG.
 * @returns {Promise<{ pdfPath: string, screenshotPath: string }>}
 */
async function compileResumePdf(htmlContent, pdfOutputPath, screenshotOutputPath) {
  let browser;
  try {
    // Ensure output directories exist
    for (const filePath of [pdfOutputPath, screenshotOutputPath]) {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    // Set A4 viewport dimensions (794px x 1123px at 96 DPI)
    await page.setViewport({ width: 794, height: 1123 });
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

    // Generate PDF (A4, print background for styling)
    await page.pdf({
      path: pdfOutputPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' }
    });

    // Capture full-page screenshot for layout QA
    await page.screenshot({
      path: screenshotOutputPath,
      fullPage: true
    });

    console.log('PDF compiled to:', pdfOutputPath);
    console.log('Screenshot captured to:', screenshotOutputPath);

    return { pdfPath: pdfOutputPath, screenshotPath: screenshotOutputPath };
  } catch (error) {
    console.error('Error in PDF compilation:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = {
  compileResumePdf
};
