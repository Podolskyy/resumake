/**
 * Builds a structured XML string from the resume form data object.
 * This is the "bridge" between the user-friendly form input and the XSLT engine.
 *
 * @param {object} formData - The resume data submitted from the frontend form.
 * @returns {string} Well-formed XML string.
 */
function buildXmlFromFormData(formData) {
  const escapeXml = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const header = formData.header || {};
  const experiences = formData.experiences || [];
  const projects = formData.projects || [];
  const education = formData.education || {};
  const skills = formData.skills || {};
  const awards = formData.awards || [];
  const certifications = formData.certifications || [];
  const languages = formData.languages || [];
  const references = formData.references || [];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<resume>\n`;

  // 1. Personal Header
  xml += `  <header>\n`;
  xml += `    <fullName>${escapeXml(header.fullName)}</fullName>\n`;
  xml += `    <title>${escapeXml(header.title)}</title>\n`;
  xml += `    <location>${escapeXml(header.location)}</location>\n`;
  xml += `    <email>${escapeXml(header.email)}</email>\n`;
  xml += `    <phone>${escapeXml(header.phone)}</phone>\n`;
  xml += `    <linkedin>${escapeXml(header.linkedin)}</linkedin>\n`;
  xml += `    <github>${escapeXml(header.github)}</github>\n`;
  xml += `    <targetPosition>${escapeXml(header.targetPosition)}</targetPosition>\n`;
  xml += `    <startDate>${escapeXml(header.startDate)}</startDate>\n`;
  xml += `  </header>\n`;

  // 2. Professional Experience
  xml += `  <experiences>\n`;
  for (const exp of experiences) {
    xml += `    <experience>\n`;
    xml += `      <company>${escapeXml(exp.company)}</company>\n`;
    xml += `      <role>${escapeXml(exp.role)}</role>\n`;
    xml += `      <dateRange>${escapeXml(exp.dateRange)}</dateRange>\n`;
    xml += `      <bullets>\n`;
    for (const bullet of (exp.bullets || [])) {
      const tags = (bullet.tags || []).join(',');
      xml += `        <bullet tags="${escapeXml(tags)}">${escapeXml(bullet.text)}</bullet>\n`;
    }
    xml += `      </bullets>\n`;
    xml += `    </experience>\n`;
  }
  xml += `  </experiences>\n`;

  // 3. University Projects
  xml += `  <projects>\n`;
  for (const proj of projects) {
    xml += `    <project>\n`;
    xml += `      <projectName>${escapeXml(proj.projectName)}</projectName>\n`;
    xml += `      <technologies>${escapeXml(proj.technologies)}</technologies>\n`;
    xml += `      <date>${escapeXml(proj.date)}</date>\n`;
    xml += `      <bullets>\n`;
    for (const bullet of (proj.bullets || [])) {
      const tags = (bullet.tags || []).join(',');
      xml += `        <bullet tags="${escapeXml(tags)}">${escapeXml(bullet.text)}</bullet>\n`;
    }
    xml += `      </bullets>\n`;
    xml += `    </project>\n`;
  }
  xml += `  </projects>\n`;

  // 4. Academic Background
  xml += `  <education>\n`;
  xml += `    <institution>${escapeXml(education.institution)}</institution>\n`;
  xml += `    <location>${escapeXml(education.location)}</location>\n`;
  xml += `    <degree>${escapeXml(education.degree)}</degree>\n`;
  xml += `    <cgpa>${escapeXml(education.cgpa)}</cgpa>\n`;
  xml += `    <dates>${escapeXml(education.dates)}</dates>\n`;
  xml += `    <specialisation>${escapeXml(education.specialisation)}</specialisation>\n`;
  xml += `    <coursework>\n`;
  for (const course of (education.coursework || [])) {
    xml += `      <course>${escapeXml(course)}</course>\n`;
  }
  xml += `    </coursework>\n`;
  xml += `  </education>\n`;

  // 5. Technical Skills
  xml += `  <skills>\n`;
  for (const [category, items] of Object.entries(skills)) {
    xml += `    <category name="${escapeXml(category)}">\n`;
    for (const item of (items || [])) {
      xml += `      <skill>${escapeXml(item)}</skill>\n`;
    }
    xml += `    </category>\n`;
  }
  xml += `  </skills>\n`;

  // 6. Awards
  xml += `  <awards>\n`;
  for (const award of awards) {
    xml += `    <award>\n`;
    xml += `      <title>${escapeXml(award.title)}</title>\n`;
    xml += `      <details>${escapeXml(award.details)}</details>\n`;
    xml += `    </award>\n`;
  }
  xml += `  </awards>\n`;

  // 7. Certifications
  xml += `  <certifications>\n`;
  for (const cert of certifications) {
    xml += `    <certification>\n`;
    xml += `      <name>${escapeXml(cert.name)}</name>\n`;
    xml += `      <date>${escapeXml(cert.date)}</date>\n`;
    xml += `      <description>${escapeXml(cert.description)}</description>\n`;
    xml += `    </certification>\n`;
  }
  xml += `  </certifications>\n`;

  // 8. Languages
  xml += `  <languages>\n`;
  for (const lang of languages) {
    xml += `    <language>${escapeXml(lang)}</language>\n`;
  }
  xml += `  </languages>\n`;

  // 9. References
  xml += `  <references>\n`;
  for (const ref of references) {
    xml += `    <reference>\n`;
    xml += `      <name>${escapeXml(ref.name)}</name>\n`;
    xml += `      <organization>${escapeXml(ref.organization)}</organization>\n`;
    xml += `      <role>${escapeXml(ref.role)}</role>\n`;
    xml += `      <email>${escapeXml(ref.email)}</email>\n`;
    xml += `      <phone>${escapeXml(ref.phone)}</phone>\n`;
    xml += `    </reference>\n`;
  }
  xml += `  </references>\n`;

  xml += `</resume>`;
  return xml;
}

/**
 * Validates the XML data to ensure required fields are present.
 * Acts as a lightweight XSD-like schema check.
 *
 * @param {object} formData - The resume data object.
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateResumeData(formData) {
  const errors = [];
  const header = formData.header || {};

  if (!header.fullName || header.fullName.trim() === '') {
    errors.push('Full Name is required.');
  }
  if (!header.email || header.email.trim() === '') {
    errors.push('Email address is required.');
  }
  if (!header.phone || header.phone.trim() === '') {
    errors.push('Phone number is required.');
  }

  const education = formData.education || {};
  if (!education.institution || education.institution.trim() === '') {
    errors.push('Education institution is required.');
  }
  if (!education.degree || education.degree.trim() === '') {
    errors.push('Degree is required.');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  buildXmlFromFormData,
  validateResumeData
};
