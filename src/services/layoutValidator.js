const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

// A4 at 96 DPI: 794 x 1123 pixels per page
const A4_PAGE_HEIGHT = 1123;

/**
 * Validates the layout screenshot height against the target page limit.
 * If the screenshot height exceeds the page limit boundary, it flags
 * a PAGE_OVERFLOW and generates a visual diff highlighting the spillover.
 *
 * @param {string} screenshotPath - Path to the full-page layout screenshot.
 * @param {number} pageLimit - Target page count (1 or 2).
 * @param {string} diffOutputPath - Path to save the diff PNG.
 * @returns {{ pass: boolean, mismatchPercentage: number, actualPages: number, reason: string }}
 */
function validatePageLayout(screenshotPath, pageLimit, diffOutputPath) {
  try {
    const img = PNG.sync.read(fs.readFileSync(screenshotPath));
    const { width, height } = img;
    const maxHeight = A4_PAGE_HEIGHT * pageLimit;
    const actualPages = Math.ceil(height / A4_PAGE_HEIGHT);

    console.log(`Layout check: ${width}x${height}px | Max allowed: ${maxHeight}px (${pageLimit} page(s)) | Actual: ~${actualPages} page(s)`);

    if (height <= maxHeight) {
      // Layout fits within the page limit
      return {
        pass: true,
        mismatchPercentage: 0,
        actualPages,
        reason: `Layout fits within ${pageLimit}-page limit (${height}px <= ${maxHeight}px).`
      };
    }

    // Content overflows — generate a visual diff highlighting the overflow area
    const overflowHeight = height - maxHeight;
    const overflowPercentage = (overflowHeight / maxHeight) * 100;

    // Create a diff image: draw the original but paint the overflow zone in red
    const diff = new PNG({ width, height });

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (width * y + x) << 2;

        if (y >= maxHeight) {
          // Overflow zone — paint red highlight
          diff.data[idx] = 255;    // R
          diff.data[idx + 1] = 50; // G
          diff.data[idx + 2] = 50; // B
          diff.data[idx + 3] = 200; // A
        } else {
          // Within boundary — copy original pixels
          diff.data[idx] = img.data[idx];
          diff.data[idx + 1] = img.data[idx + 1];
          diff.data[idx + 2] = img.data[idx + 2];
          diff.data[idx + 3] = img.data[idx + 3];
        }
      }
    }

    // Draw a sharp red line at the page boundary
    for (let x = 0; x < width; x++) {
      for (let lineY = Math.max(0, maxHeight - 2); lineY < Math.min(height, maxHeight + 2); lineY++) {
        const idx = (width * lineY + x) << 2;
        diff.data[idx] = 255;
        diff.data[idx + 1] = 0;
        diff.data[idx + 2] = 0;
        diff.data[idx + 3] = 255;
      }
    }

    // Save diff image
    const diffDir = path.dirname(diffOutputPath);
    if (!fs.existsSync(diffDir)) {
      fs.mkdirSync(diffDir, { recursive: true });
    }
    fs.writeFileSync(diffOutputPath, PNG.sync.write(diff));

    return {
      pass: false,
      mismatchPercentage: overflowPercentage,
      actualPages,
      reason: `PAGE_OVERFLOW: Content spills ${overflowHeight}px beyond the ${pageLimit}-page boundary (${overflowPercentage.toFixed(1)}% overflow). Diff saved.`
    };
  } catch (error) {
    console.error('Error validating page layout:', error);
    throw error;
  }
}

module.exports = {
  validatePageLayout
};
