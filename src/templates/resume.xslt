<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="/resume">
    <xsl:variable name="activeTags" select="@activeTags"/>
    <html>
      <head>
        <title>Resume - <xsl:value-of select="header/fullName"/></title>
        <style>
          @page {
            size: A4;
            margin: 0;
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
            font-size: 10pt;
            line-height: 1.35;
            color: #333;
            background: #fff;
            padding: 32px 40px;
            max-width: 794px;
          }

          /* Header */
          .resume-header { text-align: center; margin-bottom: 14px; border-bottom: 2px solid #333; padding-bottom: 10px; }
          .resume-header h1 { font-size: 18pt; font-weight: 700; color: #111; letter-spacing: 0.5px; margin-bottom: 2px; }
          .resume-header .subtitle { font-size: 10pt; color: #555; margin-bottom: 6px; }
          .resume-header .contact-row { font-size: 8.5pt; color: #444; }
          .resume-header .contact-row a { color: #0366d6; text-decoration: none; }

          /* Sections */
          .section { margin-bottom: 10px; }
          .section-title { font-size: 11pt; font-weight: 700; text-transform: uppercase; color: #111; border-bottom: 1px solid #ccc; padding-bottom: 2px; margin-bottom: 6px; letter-spacing: 0.8px; }

          /* Experience / Project items */
          .item { margin-bottom: 6px; }
          .item-header { display: flex; justify-content: space-between; align-items: baseline; }
          .item-title { font-weight: 700; font-size: 10pt; }
          .item-date { font-size: 9pt; color: #666; font-style: italic; }
          .item-subtitle { font-size: 9pt; color: #555; margin-bottom: 2px; }
          ul { padding-left: 18px; margin-top: 2px; }
          ul li { font-size: 9.5pt; margin-bottom: 1px; }

          /* Skills grid */
          .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 20px; }
          .skill-category { font-size: 9.5pt; margin-bottom: 2px; }
          .skill-label { font-weight: 700; }

          /* Awards, Certs, Languages, References */
          .compact-list { font-size: 9.5pt; }
          .compact-list li { margin-bottom: 1px; }

          /* References grid */
          .ref-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 20px; }
          .ref-item { font-size: 9pt; }
          .ref-name { font-weight: 700; }
        </style>
      </head>
      <body>

        <!-- HEADER -->
        <div class="resume-header">
          <h1><xsl:value-of select="header/fullName"/></h1>
          <div class="subtitle"><xsl:value-of select="header/title"/></div>
          <div class="contact-row">
            <xsl:value-of select="header/location"/>
            <xsl:text> | </xsl:text>
            <xsl:value-of select="header/phone"/>
            <xsl:text> | </xsl:text>
            <xsl:value-of select="header/email"/>
          </div>
          <div class="contact-row">
            <a><xsl:attribute name="href"><xsl:value-of select="header/linkedin"/></xsl:attribute>LinkedIn</a>
            <xsl:text> | </xsl:text>
            <a><xsl:attribute name="href"><xsl:value-of select="header/github"/></xsl:attribute>GitHub</a>
            <xsl:if test="header/targetPosition != ''">
              <xsl:text> | Target: </xsl:text>
              <xsl:value-of select="header/targetPosition"/>
            </xsl:if>
            <xsl:if test="header/startDate != ''">
              <xsl:text> | Available: </xsl:text>
              <xsl:value-of select="header/startDate"/>
            </xsl:if>
          </div>
        </div>

        <!-- PROFESSIONAL EXPERIENCE -->
        <xsl:if test="experiences/experience">
          <div class="section">
            <div class="section-title">Professional Experience</div>
            <xsl:for-each select="experiences/experience">
              <div class="item">
                <div class="item-header">
                  <span class="item-title"><xsl:value-of select="role"/> — <xsl:value-of select="company"/></span>
                  <span class="item-date"><xsl:value-of select="dateRange"/></span>
                </div>
                <ul>
                  <xsl:for-each select="bullets/bullet">
                    <xsl:variable name="bulletTags" select="concat(',', @tags, ',')"/>
                    <xsl:if test="$activeTags = ',,' or contains($bulletTags, substring-before(substring-after($activeTags, ','), ','))">
                      <li><xsl:value-of select="."/></li>
                    </xsl:if>
                  </xsl:for-each>
                </ul>
              </div>
            </xsl:for-each>
          </div>
        </xsl:if>

        <!-- UNIVERSITY PROJECTS -->
        <xsl:if test="projects/project">
          <div class="section">
            <div class="section-title">University Projects</div>
            <xsl:for-each select="projects/project">
              <div class="item">
                <div class="item-header">
                  <span class="item-title"><xsl:value-of select="projectName"/></span>
                  <span class="item-date"><xsl:value-of select="date"/></span>
                </div>
                <div class="item-subtitle"><xsl:value-of select="technologies"/></div>
                <ul>
                  <xsl:for-each select="bullets/bullet">
                    <xsl:variable name="bulletTags" select="concat(',', @tags, ',')"/>
                    <xsl:if test="$activeTags = ',,' or contains($bulletTags, substring-before(substring-after($activeTags, ','), ','))">
                      <li><xsl:value-of select="."/></li>
                    </xsl:if>
                  </xsl:for-each>
                </ul>
              </div>
            </xsl:for-each>
          </div>
        </xsl:if>

        <!-- EDUCATION -->
        <div class="section">
          <div class="section-title">Education</div>
          <div class="item">
            <div class="item-header">
              <span class="item-title"><xsl:value-of select="education/degree"/></span>
              <span class="item-date"><xsl:value-of select="education/dates"/></span>
            </div>
            <div class="item-subtitle">
              <xsl:value-of select="education/institution"/>, <xsl:value-of select="education/location"/>
              <xsl:if test="education/cgpa != ''">
                <xsl:text> | CGPA: </xsl:text><xsl:value-of select="education/cgpa"/>
              </xsl:if>
            </div>
            <xsl:if test="education/specialisation != ''">
              <div class="item-subtitle">Specialisation: <xsl:value-of select="education/specialisation"/></div>
            </xsl:if>
            <xsl:if test="education/coursework/course">
              <div class="item-subtitle" style="font-size: 9pt;">
                <strong>Relevant Coursework: </strong>
                <xsl:for-each select="education/coursework/course">
                  <xsl:value-of select="."/>
                  <xsl:if test="position() != last()">, </xsl:if>
                </xsl:for-each>
              </div>
            </xsl:if>
          </div>
        </div>

        <!-- TECHNICAL SKILLS -->
        <xsl:if test="skills/category">
          <div class="section">
            <div class="section-title">Technical Skills</div>
            <div class="skills-grid">
              <xsl:for-each select="skills/category">
                <div class="skill-category">
                  <span class="skill-label"><xsl:value-of select="@name"/>: </span>
                  <xsl:for-each select="skill">
                    <xsl:value-of select="."/>
                    <xsl:if test="position() != last()">, </xsl:if>
                  </xsl:for-each>
                </div>
              </xsl:for-each>
            </div>
          </div>
        </xsl:if>

        <!-- AWARDS -->
        <xsl:if test="awards/award">
          <div class="section">
            <div class="section-title">Awards &amp; Recognition</div>
            <ul class="compact-list">
              <xsl:for-each select="awards/award">
                <li><strong><xsl:value-of select="title"/></strong> — <xsl:value-of select="details"/></li>
              </xsl:for-each>
            </ul>
          </div>
        </xsl:if>

        <!-- CERTIFICATIONS -->
        <xsl:if test="certifications/certification">
          <div class="section">
            <div class="section-title">Certifications</div>
            <ul class="compact-list">
              <xsl:for-each select="certifications/certification">
                <li><strong><xsl:value-of select="name"/></strong> (<xsl:value-of select="date"/>) — <xsl:value-of select="description"/></li>
              </xsl:for-each>
            </ul>
          </div>
        </xsl:if>

        <!-- LANGUAGES -->
        <xsl:if test="languages/language">
          <div class="section">
            <div class="section-title">Languages</div>
            <ul class="compact-list">
              <xsl:for-each select="languages/language">
                <li><xsl:value-of select="."/></li>
              </xsl:for-each>
            </ul>
          </div>
        </xsl:if>

        <!-- REFERENCES -->
        <xsl:if test="references/reference">
          <div class="section">
            <div class="section-title">References</div>
            <div class="ref-grid">
              <xsl:for-each select="references/reference">
                <div class="ref-item">
                  <div class="ref-name"><xsl:value-of select="name"/></div>
                  <div><xsl:value-of select="role"/>, <xsl:value-of select="organization"/></div>
                  <div><xsl:value-of select="email"/> | <xsl:value-of select="phone"/></div>
                </div>
              </xsl:for-each>
            </div>
          </div>
        </xsl:if>

      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
