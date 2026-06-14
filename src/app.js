const express = require('express');
const path = require('path');
const fs = require('fs');
const { initDb, dbRun, dbAll, dbGet } = require('./db/database');
const { buildXmlFromFormData, validateResumeData } = require('./services/xmlBuilder');
const { transformXmlToHtml } = require('./services/transformationService');
const { compileResumePdf } = require('./services/pdfService');
const { validatePageLayout } = require('./services/layoutValidator');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Create needed directories
const outputDir = path.resolve(__dirname, '../output');
const tempDir = path.resolve(__dirname, '../temp');
const diffDir = path.resolve(__dirname, '../diff');

[outputDir, tempDir, diffDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ============================================================
// API ENDPOINTS
// ============================================================

/**
 * POST /api/resume/compile
 * Accepts resume form data as JSON, builds XML, transforms via XSLT,
 * compiles PDF, runs visual QA, and returns the result.
 */
app.post('/api/resume/compile', async (req, res) => {
  const { formData, activeTags, pageLimit, profileName } = req.body;

  if (!formData) {
    return res.status(400).json({ error: 'formData is required.' });
  }

  const limit = pageLimit || 2;
  const tags = activeTags || '';
  const profile = profileName || 'default';

  try {
    // 1. Validate resume data (XSD-like check)
    const validation = validateResumeData(formData);
    if (!validation.valid) {
      return res.status(400).json({
        error: 'Validation failed',
        xsdStatus: 'FAILED',
        details: validation.errors
      });
    }

    // 2. Build XML from form data
    const xmlString = buildXmlFromFormData(formData);

    // 3. Save resume to database
    const result = await dbRun(
      'INSERT INTO resumes (profile_name, active_tags, page_limit, xml_data) VALUES (?, ?, ?, ?)',
      [profile, tags, limit, xmlString]
    );
    const resumeId = result.lastID;

    // 4. Transform XML to HTML via XSLT
    const xsltPath = path.join(__dirname, 'templates', 'resume.xslt');
    const htmlContent = await transformXmlToHtml(xmlString, xsltPath, tags);

    // 5. Compile PDF + capture screenshot
    const timestamp = Date.now();
    const pdfPath = path.join(outputDir, `resume_${resumeId}_${timestamp}.pdf`);
    const screenshotPath = path.join(tempDir, `resume_${resumeId}_${timestamp}.png`);
    const diffPath = path.join(diffDir, `resume_${resumeId}_${timestamp}_diff.png`);

    await compileResumePdf(htmlContent, pdfPath, screenshotPath);

    // 6. Visual QA — Page boundary check
    const layoutResult = validatePageLayout(screenshotPath, limit, diffPath);

    // 7. Log compilation result
    await dbRun(
      `INSERT INTO compilation_logs 
       (resume_id, active_tags, page_limit, xsd_status, layout_status, mismatch_percentage, pdf_path, screenshot_path, diff_path)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        resumeId,
        tags,
        limit,
        'PASSED',
        layoutResult.pass ? 'PASSED' : 'PAGE_OVERFLOW',
        layoutResult.mismatchPercentage,
        pdfPath,
        screenshotPath,
        layoutResult.pass ? null : diffPath
      ]
    );

    res.json({
      success: true,
      resumeId,
      xsdStatus: 'PASSED',
      layoutStatus: layoutResult.pass ? 'PASSED' : 'PAGE_OVERFLOW',
      layoutDetails: layoutResult.reason,
      actualPages: layoutResult.actualPages,
      mismatchPercentage: layoutResult.mismatchPercentage,
      pdfUrl: `/api/resume/${resumeId}/pdf`,
      screenshotUrl: `/api/resume/${resumeId}/screenshot`,
      diffUrl: layoutResult.pass ? null : `/api/resume/${resumeId}/diff`,
      xmlPreview: xmlString
    });

  } catch (error) {
    console.error('Compilation error:', error);
    res.status(500).json({ error: 'Compilation failed: ' + error.message });
  }
});

/**
 * GET /api/resume/history
 * Returns the compilation history log.
 */
app.get('/api/resume/history', async (req, res) => {
  try {
    const logs = await dbAll(`
      SELECT cl.*, r.profile_name, r.created_at as resume_created_at
      FROM compilation_logs cl
      JOIN resumes r ON cl.resume_id = r.id
      ORDER BY cl.compiled_at DESC
      LIMIT 50
    `);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/resume/:id/pdf
 * Serves the compiled PDF file.
 */
app.get('/api/resume/:id/pdf', async (req, res) => {
  try {
    const log = await dbGet(
      'SELECT pdf_path FROM compilation_logs WHERE resume_id = ? ORDER BY compiled_at DESC LIMIT 1',
      [req.params.id]
    );
    if (!log || !log.pdf_path || !fs.existsSync(log.pdf_path)) {
      return res.status(404).json({ error: 'PDF not found' });
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="resume.pdf"');
    fs.createReadStream(log.pdf_path).pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/resume/:id/screenshot
 * Serves the layout screenshot PNG.
 */
app.get('/api/resume/:id/screenshot', async (req, res) => {
  try {
    const log = await dbGet(
      'SELECT screenshot_path FROM compilation_logs WHERE resume_id = ? ORDER BY compiled_at DESC LIMIT 1',
      [req.params.id]
    );
    if (!log || !log.screenshot_path || !fs.existsSync(log.screenshot_path)) {
      return res.status(404).json({ error: 'Screenshot not found' });
    }
    res.setHeader('Content-Type', 'image/png');
    fs.createReadStream(log.screenshot_path).pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/resume/:id/diff
 * Serves the visual diff PNG.
 */
app.get('/api/resume/:id/diff', async (req, res) => {
  try {
    const log = await dbGet(
      'SELECT diff_path FROM compilation_logs WHERE resume_id = ? ORDER BY compiled_at DESC LIMIT 1',
      [req.params.id]
    );
    if (!log || !log.diff_path || !fs.existsSync(log.diff_path)) {
      return res.status(404).json({ error: 'Diff not found' });
    }
    res.setHeader('Content-Type', 'image/png');
    fs.createReadStream(log.diff_path).pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/resume/:id/xml
 * Returns the raw XML payload.
 */
app.get('/api/resume/:id/xml', async (req, res) => {
  try {
    const resume = await dbGet('SELECT xml_data FROM resumes WHERE id = ?', [req.params.id]);
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    res.set('Content-Type', 'application/xml');
    res.send(resume.xml_data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  initDb();
  console.log(`ResuMake server running on http://localhost:${PORT}`);
});
