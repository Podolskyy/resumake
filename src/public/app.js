// ============================================================
// ResuMake — Frontend Application Logic
// ============================================================

const ALL_TAGS = ['qa', 'backend', 'frontend', 'mobile', 'iot', 'ai-ml'];

// ---- Tab Navigation ----
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`section-${btn.dataset.section}`).classList.add('active');
  });
});

document.querySelectorAll('.result-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.result-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.result-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`rpanel-${btn.dataset.tab}`).classList.add('active');
  });
});

// ---- Dynamic List Helpers ----
let expCounter = 0, projCounter = 0, skillCatCounter = 0;
let awardCounter = 0, certCounter = 0, refCounter = 0;

function createTagButtons(bulletId) {
  return ALL_TAGS.map(tag =>
    `<span class="mini-tag selected" data-tag="${tag}" data-bullet="${bulletId}" onclick="toggleMiniTag(this)">${tag}</span>`
  ).join('');
}

function toggleMiniTag(el) {
  el.classList.toggle('selected');
}

function createBulletItem(parentId, idx) {
  const bulletId = `${parentId}-bullet-${idx}`;
  return `
    <div class="bullet-item" data-bullet-id="${bulletId}">
      <input type="text" placeholder="Describe an achievement or responsibility..." class="bullet-text">
      <div class="bullet-tags">${createTagButtons(bulletId)}</div>
      <button class="btn-remove-bullet" onclick="this.closest('.bullet-item').remove()">✕</button>
    </div>
  `;
}

// ---- Experience ----
document.getElementById('btn-add-experience').addEventListener('click', () => {
  const id = `exp-${expCounter++}`;
  const html = `
    <div class="dynamic-item" data-id="${id}">
      <div class="dynamic-item-header">
        <span>Experience #${expCounter}</span>
        <button class="btn-remove" onclick="this.closest('.dynamic-item').remove()">Remove</button>
      </div>
      <div class="field-row">
        <div class="field-group"><label>Company</label><input type="text" class="exp-company" placeholder="e.g. Ant International"></div>
        <div class="field-group"><label>Role</label><input type="text" class="exp-role" placeholder="e.g. Software Engineer Intern"></div>
      </div>
      <div class="field-group"><label>Date Range</label><input type="text" class="exp-daterange" placeholder="e.g. March 2026 - Present"></div>
      <div class="bullet-list">${createBulletItem(id, 0)}</div>
      <button class="btn-add-bullet" onclick="addBullet(this, '${id}')">+ Add Bullet</button>
    </div>
  `;
  document.getElementById('experience-list').insertAdjacentHTML('beforeend', html);
});

// ---- Projects ----
document.getElementById('btn-add-project').addEventListener('click', () => {
  const id = `proj-${projCounter++}`;
  const html = `
    <div class="dynamic-item" data-id="${id}">
      <div class="dynamic-item-header">
        <span>Project #${projCounter}</span>
        <button class="btn-remove" onclick="this.closest('.dynamic-item').remove()">Remove</button>
      </div>
      <div class="field-row">
        <div class="field-group"><label>Project Name</label><input type="text" class="proj-name" placeholder="e.g. JARS"></div>
        <div class="field-group"><label>Date</label><input type="text" class="proj-date" placeholder="e.g. 2025"></div>
      </div>
      <div class="field-group"><label>Technologies</label><input type="text" class="proj-tech" placeholder="e.g. PHP, MySQL, HTML/CSS"></div>
      <div class="bullet-list">${createBulletItem(id, 0)}</div>
      <button class="btn-add-bullet" onclick="addBullet(this, '${id}')">+ Add Bullet</button>
    </div>
  `;
  document.getElementById('project-list').insertAdjacentHTML('beforeend', html);
});

// ---- Skills ----
document.getElementById('btn-add-skill-category').addEventListener('click', () => {
  const id = `skillcat-${skillCatCounter++}`;
  const html = `
    <div class="dynamic-item" data-id="${id}">
      <div class="dynamic-item-header">
        <span>Skill Category</span>
        <button class="btn-remove" onclick="this.closest('.dynamic-item').remove()">Remove</button>
      </div>
      <div class="field-group"><label>Category Name</label><input type="text" class="skill-cat-name" placeholder="e.g. Programming Languages"></div>
      <div class="field-group"><label>Skills (comma-separated)</label><input type="text" class="skill-items" placeholder="e.g. Java, Python, JavaScript"></div>
    </div>
  `;
  document.getElementById('skills-list').insertAdjacentHTML('beforeend', html);
});

// ---- Awards ----
document.getElementById('btn-add-award').addEventListener('click', () => {
  const html = `
    <div class="dynamic-item">
      <div class="dynamic-item-header">
        <span>Award</span>
        <button class="btn-remove" onclick="this.closest('.dynamic-item').remove()">Remove</button>
      </div>
      <div class="field-row">
        <div class="field-group"><label>Title</label><input type="text" class="award-title" placeholder="e.g. Dean's Honour List"></div>
        <div class="field-group"><label>Details</label><input type="text" class="award-details" placeholder="e.g. Semester 1-6"></div>
      </div>
    </div>
  `;
  document.getElementById('awards-list').insertAdjacentHTML('beforeend', html);
});

// ---- Certifications ----
document.getElementById('btn-add-cert').addEventListener('click', () => {
  const html = `
    <div class="dynamic-item">
      <div class="dynamic-item-header">
        <span>Certification</span>
        <button class="btn-remove" onclick="this.closest('.dynamic-item').remove()">Remove</button>
      </div>
      <div class="field-row">
        <div class="field-group"><label>Name</label><input type="text" class="cert-name" placeholder="e.g. Cisco CCNA"></div>
        <div class="field-group"><label>Date</label><input type="text" class="cert-date" placeholder="e.g. 2023"></div>
      </div>
      <div class="field-group"><label>Description</label><input type="text" class="cert-desc" placeholder="Brief description..."></div>
    </div>
  `;
  document.getElementById('certs-list').insertAdjacentHTML('beforeend', html);
});

// ---- References ----
document.getElementById('btn-add-ref').addEventListener('click', () => {
  const html = `
    <div class="dynamic-item">
      <div class="dynamic-item-header">
        <span>Reference</span>
        <button class="btn-remove" onclick="this.closest('.dynamic-item').remove()">Remove</button>
      </div>
      <div class="field-row">
        <div class="field-group"><label>Name</label><input type="text" class="ref-name" placeholder="Dr. Example"></div>
        <div class="field-group"><label>Role</label><input type="text" class="ref-role" placeholder="Senior Lecturer"></div>
      </div>
      <div class="field-row">
        <div class="field-group"><label>Organization</label><input type="text" class="ref-org" placeholder="UUM"></div>
        <div class="field-group"><label>Email</label><input type="text" class="ref-email" placeholder="email@org.com"></div>
      </div>
      <div class="field-group"><label>Phone</label><input type="text" class="ref-phone" placeholder="+60 12-345 6789"></div>
    </div>
  `;
  document.getElementById('refs-list').insertAdjacentHTML('beforeend', html);
});

// ---- Add Bullet Helper ----
let bulletGlobalIdx = 100;
function addBullet(btn, parentId) {
  const bulletList = btn.previousElementSibling;
  bulletList.insertAdjacentHTML('beforeend', createBulletItem(parentId, bulletGlobalIdx++));
}

// ============================================================
// COMPILE
// ============================================================
document.getElementById('btn-compile').addEventListener('click', async () => {
  const overlay = document.getElementById('compile-overlay');
  overlay.style.display = 'flex';

  try {
    const formData = collectFormData();
    const activeTags = getActiveTags().join(',');
    const pageLimit = parseInt(document.getElementById('page-limit').value);

    const response = await fetch('/api/resume/compile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formData, activeTags, pageLimit, profileName: 'Dashboard' })
    });

    const result = await response.json();

    if (!response.ok) {
      alert(`Compilation failed: ${result.error}\n${(result.details || []).join('\n')}`);
      overlay.style.display = 'none';
      return;
    }

    // Update PDF tab
    const pdfPlaceholder = document.getElementById('pdf-placeholder');
    const pdfResult = document.getElementById('pdf-result');
    const banner = document.getElementById('status-banner');
    const iframe = document.getElementById('pdf-iframe');
    const downloadBtn = document.getElementById('btn-download');

    pdfPlaceholder.style.display = 'none';
    pdfResult.style.display = 'block';

    if (result.layoutStatus === 'PASSED') {
      banner.className = 'status-banner pass';
      banner.innerHTML = `✅ Layout Check: PASSED — ${result.actualPages} page(s), fits within ${pageLimit}-page limit.`;
    } else {
      banner.className = 'status-banner fail';
      banner.innerHTML = `❌ Layout Check: PAGE_OVERFLOW — ${result.actualPages} page(s). ${result.layoutDetails}`;
    }

    iframe.src = result.pdfUrl;
    downloadBtn.href = result.pdfUrl;

    // Update XML tab
    document.getElementById('xml-code').textContent = result.xmlPreview || '';

    // Update QA tab
    const qaPlaceholder = document.getElementById('qa-placeholder');
    const qaResult = document.getElementById('qa-result');
    qaPlaceholder.style.display = 'none';
    qaResult.style.display = 'block';

    document.getElementById('img-screenshot').src = result.screenshotUrl;

    const diffCard = document.getElementById('diff-card');
    if (result.diffUrl) {
      diffCard.style.display = 'block';
      document.getElementById('img-diff').src = result.diffUrl;
    } else {
      diffCard.style.display = 'none';
    }

    // Auto-switch to PDF tab
    document.querySelectorAll('.result-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.result-panel').forEach(p => p.classList.remove('active'));
    document.querySelector('[data-tab="pdf"]').classList.add('active');
    document.getElementById('rpanel-pdf').classList.add('active');

    // Refresh history
    loadHistory();

  } catch (err) {
    alert('Error: ' + err.message);
  } finally {
    overlay.style.display = 'none';
  }
});

// ============================================================
// DATA COLLECTION
// ============================================================
function val(id) { return document.getElementById(id)?.value?.trim() || ''; }

function collectFormData() {
  return {
    header: {
      fullName: val('fullName'),
      title: val('title'),
      email: val('email'),
      phone: val('phone'),
      location: val('location'),
      linkedin: val('linkedin'),
      github: val('github'),
      targetPosition: val('targetPosition'),
      startDate: val('startDate')
    },
    experiences: collectExperiences(),
    projects: collectProjects(),
    education: {
      institution: val('edu-institution'),
      location: val('edu-location'),
      degree: val('edu-degree'),
      cgpa: val('edu-cgpa'),
      dates: val('edu-dates'),
      specialisation: val('edu-specialisation'),
      coursework: val('edu-coursework').split(',').map(c => c.trim()).filter(c => c)
    },
    skills: collectSkills(),
    awards: collectAwards(),
    certifications: collectCertifications(),
    languages: val('languages').split(',').map(l => l.trim()).filter(l => l),
    references: collectReferences()
  };
}

function collectBullets(container) {
  const bullets = [];
  container.querySelectorAll('.bullet-item').forEach(bi => {
    const text = bi.querySelector('.bullet-text')?.value?.trim();
    if (!text) return;
    const tags = [];
    bi.querySelectorAll('.mini-tag.selected').forEach(t => tags.push(t.dataset.tag));
    bullets.push({ text, tags });
  });
  return bullets;
}

function collectExperiences() {
  const items = [];
  document.querySelectorAll('#experience-list .dynamic-item').forEach(item => {
    items.push({
      company: item.querySelector('.exp-company')?.value?.trim() || '',
      role: item.querySelector('.exp-role')?.value?.trim() || '',
      dateRange: item.querySelector('.exp-daterange')?.value?.trim() || '',
      bullets: collectBullets(item)
    });
  });
  return items;
}

function collectProjects() {
  const items = [];
  document.querySelectorAll('#project-list .dynamic-item').forEach(item => {
    items.push({
      projectName: item.querySelector('.proj-name')?.value?.trim() || '',
      technologies: item.querySelector('.proj-tech')?.value?.trim() || '',
      date: item.querySelector('.proj-date')?.value?.trim() || '',
      bullets: collectBullets(item)
    });
  });
  return items;
}

function collectSkills() {
  const skills = {};
  document.querySelectorAll('#skills-list .dynamic-item').forEach(item => {
    const name = item.querySelector('.skill-cat-name')?.value?.trim();
    const raw = item.querySelector('.skill-items')?.value?.trim();
    if (name && raw) {
      skills[name] = raw.split(',').map(s => s.trim()).filter(s => s);
    }
  });
  return skills;
}

function collectAwards() {
  const items = [];
  document.querySelectorAll('#awards-list .dynamic-item').forEach(item => {
    items.push({
      title: item.querySelector('.award-title')?.value?.trim() || '',
      details: item.querySelector('.award-details')?.value?.trim() || ''
    });
  });
  return items;
}

function collectCertifications() {
  const items = [];
  document.querySelectorAll('#certs-list .dynamic-item').forEach(item => {
    items.push({
      name: item.querySelector('.cert-name')?.value?.trim() || '',
      date: item.querySelector('.cert-date')?.value?.trim() || '',
      description: item.querySelector('.cert-desc')?.value?.trim() || ''
    });
  });
  return items;
}

function collectReferences() {
  const items = [];
  document.querySelectorAll('#refs-list .dynamic-item').forEach(item => {
    items.push({
      name: item.querySelector('.ref-name')?.value?.trim() || '',
      role: item.querySelector('.ref-role')?.value?.trim() || '',
      organization: item.querySelector('.ref-org')?.value?.trim() || '',
      email: item.querySelector('.ref-email')?.value?.trim() || '',
      phone: item.querySelector('.ref-phone')?.value?.trim() || ''
    });
  });
  return items;
}

function getActiveTags() {
  const tags = [];
  document.querySelectorAll('#tag-checkboxes input[type="checkbox"]:checked').forEach(cb => {
    tags.push(cb.value);
  });
  return tags;
}

// ============================================================
// HISTORY
// ============================================================
async function loadHistory() {
  try {
    const res = await fetch('/api/resume/history');
    const logs = await res.json();
    const list = document.getElementById('history-list');

    if (!logs.length) {
      list.innerHTML = '<p class="muted">No compilation history yet.</p>';
      return;
    }

    list.innerHTML = logs.map(log => `
      <div class="history-item">
        <div>
          <div class="hi-name">${log.profile_name || 'Untitled'}</div>
          <div class="hi-date">${new Date(log.compiled_at).toLocaleString()} — Tags: ${log.active_tags || 'all'}</div>
        </div>
        <span class="hi-status ${log.layout_status === 'PASSED' ? 'pass' : 'fail'}">${log.layout_status}</span>
        <a href="/api/resume/${log.resume_id}/pdf" target="_blank" class="btn btn-secondary" style="font-size:11px;padding:4px 10px;">View PDF</a>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error loading history:', err);
  }
}

// Load history on page load
loadHistory();
