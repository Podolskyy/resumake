const fs = require('fs');
const { XmlParser, Xslt } = require('xslt-processor');

const xmlParser = new XmlParser();
const xsltProcessor = new Xslt();

/**
 * Transforms resume XML into HTML using the specified XSLT stylesheet.
 * The activeTags parameter is injected into the XSLT as a parameter so the
 * stylesheet can conditionally include/exclude tagged bullet points.
 *
 * @param {string} xmlString - The raw resume XML data.
 * @param {string} xsltPath - Path to the XSLT stylesheet file.
 * @param {string} activeTags - Comma-separated active tag filters (e.g. "backend,sql").
 * @returns {Promise<string>} Generated HTML content.
 */
async function transformXmlToHtml(xmlString, xsltPath, activeTags = '') {
  try {
    const xsltString = fs.readFileSync(xsltPath, 'utf8');

    // Inject activeTags as an XSLT parameter by wrapping the XML
    // with a processing instruction that the stylesheet can read
    const xmlWithParams = xmlString.replace(
      '<resume>',
      `<resume activeTags=",${activeTags},">`
    );

    const xmlDoc = xmlParser.xmlParse(xmlWithParams);
    const xsltDoc = xmlParser.xmlParse(xsltString);

    return await xsltProcessor.xsltProcess(xmlDoc, xsltDoc);
  } catch (error) {
    console.error('Error performing XSLT transformation:', error);
    throw error;
  }
}

module.exports = {
  transformXmlToHtml
};
