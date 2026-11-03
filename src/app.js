import { site } from './data/site.js';
import { skillCategories } from './data/skills.js';
import { projects } from './data/projects.js';
import { certificationsData } from './data/certifications.js';

// Application State
let activeFilter = 'All';
let isResumeAvailable = false;
let currentRoleIndex = 0;
let roleRotationInterval = null;

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initAccessibility();
  checkResumeAvailability();
  renderBrandAndHero();
  renderAboutSection();
  renderCapabilityPanels();
  renderSkillsSection();
  renderProjectsSection();
  renderCertificationsSection();
  renderResumeSection();
  renderContactSection();
  renderFooter();
  initNavigation();
  initTerminal();
  initRouting();
  initVisibilityListener();
});

// Check if resume PDF exists
async function checkResumeAvailability() {
  try {
    const res = await fetch(site.links.resumePath, { method: 'HEAD' });
    isResumeAvailable = res.ok;
  } catch (err) {
    isResumeAvailable = false;
  }
  updateResumeButtons();
}

// Render the approved four-panel cybersecurity capability visual.
function renderCapabilityPanels() {
  const container = document.getElementById('capabilityPanels');
  if (!container) return;

  const panels = [
    {
      number: '01',
      title: 'RECONNAISSANCE',
      summary: 'Nmap, Wireshark and network discovery.',
      tools: ['Nmap', 'Wireshark', 'DNS & HTTP/HTTPS Analysis'],
      tone: 'cobalt'
    },
    {
      number: '02',
      title: 'DETECTION',
      summary: 'Wazuh, Sysmon and security monitoring.',
      tools: ['Wazuh SIEM', 'Sysmon', 'Security Event Analysis'],
      tone: 'lime'
    },
    {
      number: '03',
      title: 'DEFENCE',
      summary: 'OpenVPN, IoT and web application security.',
      tools: ['OpenVPN', 'IoT Security', 'Web Application Security'],
      tone: 'blue'
    },
    {
      number: '04',
      title: 'RESPONSE',
      summary: 'Existing incident investigation and response work.',
      tools: ['Incident Detection Fundamentals', 'Endpoint Telemetry', 'Defensive security and incident investigation'],
      tone: 'signal'
    }
  ];

  container.innerHTML = panels.map(panel => `
    <article class="capability-panel capability-panel-${panel.tone}" tabindex="0" role="button" aria-expanded="false">
      <div class="capability-panel-top">
        <span class="capability-number">${panel.number}</span>
        <span class="capability-marker" aria-hidden="true"></span>
      </div>
      <div class="capability-panel-body">
        <h3>${panel.title}</h3>
        <p>${panel.summary}</p>
        <div class="capability-tools">
          ${panel.tools.map(tool => `<span>${tool}</span>`).join('')}
        </div>
      </div>
      <span class="capability-arrow" aria-hidden="true">↗</span>
    </article>
  `).join('');

  container.querySelectorAll('.capability-panel').forEach(panel => {
    const togglePanel = () => {
      const expanded = panel.classList.toggle('is-expanded');
      panel.setAttribute('aria-expanded', String(expanded));
    };

    panel.addEventListener('click', togglePanel);
    panel.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        togglePanel();
      }
    });
  });
}

function updateResumeButtons() {
  const resumeButtons = document.querySelectorAll('.js-resume-btn');
  resumeButtons.forEach(btn => {
    if (isResumeAvailable) {
      btn.classList.remove('btn-disabled');
      btn.setAttribute('href', site.links.resumePath);
      btn.removeAttribute('aria-disabled');
      btn.removeAttribute('title');
    } else {
      btn.classList.add('btn-disabled');
      btn.removeAttribute('href');
      btn.setAttribute('aria-disabled', 'true');
      btn.setAttribute('title', 'Resume coming soon (PDF not yet uploaded)');
    }
  });
}

// Render Brand and Hero
function renderBrandAndHero() {
  // Brand Logo and Name
  const brandPill = document.getElementById('brandLogoPill');
  if (brandPill) brandPill.textContent = site.logo;

  const brandName = document.getElementById('brandName');
  if (brandName) brandName.textContent = site.name;

  // Availability Pill
  const availContainer = document.getElementById('heroAvailability');
  if (availContainer) {
    if (site.availability.show) {
      availContainer.innerHTML = `
        <span class="pulse-dot" aria-hidden="true"></span>
        <span>${site.availability.text}</span>
      `;
      availContainer.style.display = 'inline-flex';
    } else {
      availContainer.style.display = 'none';
    }
  }

  // Hero Heading
  const heroHeading = document.getElementById('heroHeading');
  if (heroHeading) {
    heroHeading.innerHTML = `Hi, I'm <span class="text-gradient">${site.name}.</span>`;
  }

  // Rotating Role
  const roleEl = document.getElementById('rotatingRole');
  if (roleEl && site.rotatingRoles && site.rotatingRoles.length > 0) {
    roleEl.textContent = site.rotatingRoles[0];
    
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      roleRotationInterval = setInterval(() => {
        currentRoleIndex = (currentRoleIndex + 1) % site.rotatingRoles.length;
        roleEl.style.opacity = '0';
        setTimeout(() => {
          roleEl.textContent = site.rotatingRoles[currentRoleIndex];
          roleEl.style.opacity = '1';
        }, 200);
      }, 3000);
    }
  }

  // Social Links in Hero
  renderSocialLinks('heroSocials');
}

function renderSocialLinks(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';
  const links = site.links;

  if (links.github) {
    container.innerHTML += `
      <a href="${links.github}" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="GitHub Profile">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
      </a>
    `;
  }

  if (links.linkedin) {
    container.innerHTML += `
      <a href="${links.linkedin}" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="LinkedIn Profile">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
      </a>
    `;
  }

  if (links.email) {
    container.innerHTML += `
      <a href="mailto:${links.email}" class="social-btn" aria-label="Email Gokul">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
      </a>
    `;
  }
}

// Render About Section
function renderAboutSection() {
  const container = document.getElementById('aboutCardsContainer');
  if (!container) return;

  container.innerHTML = `
    <!-- Card 1: Education -->
    <div class="about-card">
      <div class="about-card-icon" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
      </div>
      <h3 class="about-card-title">Education &amp; Training</h3>
      <div class="about-card-content" style="display: flex; flex-direction: column; gap: 16px;">
        <!-- Qualification 1 -->
        <div>
          <div style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--accent); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">Bachelor of Computer Applications (BCA)</div>
          <div style="font-weight: 700; color: var(--text); font-size: 1rem;">BCA — Multimedia and Animation</div>
          <div style="color: var(--accent-2); font-size: 0.88rem; margin-top: 2px;">Hindustan Institute of Technology &amp; Science, Chennai</div>
          <div style="color: var(--text-muted); font-size: 0.86rem; margin-top: 6px;">Duration: 2022-2025</div>
          <p style="margin-top: 6px; font-size: 0.86rem; color: var(--text-muted); line-height: 1.5;">My multimedia background supports technical documentation, visual communication, and presenting complex technical concepts clearly.</p>
        </div>

        <div style="height: 1px; background: var(--border); width: 100%;"></div>

        <!-- Qualification 2 -->
        <div>
          <div style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--accent); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">Cybersecurity Training</div>
          <div style="font-weight: 700; color: var(--text); font-size: 1rem;">Cybersecurity &amp; Ethical Hacking</div>
          <div style="color: var(--accent-2); font-size: 0.88rem; margin-top: 2px;">Bostan Institute of Analysis</div>
          <p style="margin-top: 6px; font-size: 0.86rem; color: var(--text-muted); line-height: 1.5;">Developing practical cybersecurity knowledge through training in security fundamentals, ethical hacking, network security, vulnerability assessment, and security tools.</p>
        </div>
      </div>
    </div>

    <!-- Card 2: On-the-Job Training Experience -->
    <div class="about-card">
      <div class="about-card-icon" aria-hidden="true" style="background: rgba(56, 189, 248, 0.1); color: var(--accent-2);">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
      </div>
      <h3 class="about-card-title">On-the-Job Training Experience</h3>
      <div class="about-card-content">
        <p style="margin-bottom: 14px; font-size: 0.92rem; color: var(--text); line-height: 1.6;">
          Gaining practical exposure to cybersecurity concepts, security tools, technical troubleshooting, and hands-on learning through on-the-job training.
        </p>

        <div style="font-size: 0.78rem; font-family: var(--font-mono); color: var(--accent); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">
          Practical Focus Areas:
        </div>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 7px; font-size: 0.86rem; color: var(--text-muted);">
          <li style="display: flex; align-items: baseline; gap: 8px;"><span style="color: var(--accent); font-family: var(--font-mono);">•</span> <span>Cybersecurity fundamentals</span></li>
          <li style="display: flex; align-items: baseline; gap: 8px;"><span style="color: var(--accent); font-family: var(--font-mono);">•</span> <span>Network security and traffic analysis</span></li>
          <li style="display: flex; align-items: baseline; gap: 8px;"><span style="color: var(--accent); font-family: var(--font-mono);">•</span> <span>Ethical hacking fundamentals</span></li>
          <li style="display: flex; align-items: baseline; gap: 8px;"><span style="color: var(--accent); font-family: var(--font-mono);">•</span> <span>Vulnerability assessment</span></li>
          <li style="display: flex; align-items: baseline; gap: 8px;"><span style="color: var(--accent); font-family: var(--font-mono);">•</span> <span>Web application security</span></li>
          <li style="display: flex; align-items: baseline; gap: 8px;"><span style="color: var(--accent); font-family: var(--font-mono);">•</span> <span>Security monitoring and event analysis</span></li>
        </ul>
      </div>
    </div>

    <!-- Card 3: Technical Interests -->
    <div class="about-card">
      <div class="about-card-icon" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="22" y1="12" x2="18" y2="12"></line><line x1="6" y1="12" x2="2" y2="12"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="12" y1="22" x2="12" y2="18"></line></svg>
      </div>
      <h3 class="about-card-title">Technical Interests</h3>
      <div class="about-card-content">
        <p style="margin-bottom: 12px; font-size: 0.9rem; color: var(--text); line-height: 1.5;">
          Core areas of technical exploration, hands-on labs, and defensive specialization:
        </p>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 0.88rem; color: var(--text-muted);">
          <li style="display: flex; align-items: baseline; gap: 8px;"><span style="color: var(--accent-2); font-family: var(--font-mono);">→</span> <span>Security monitoring and incident detection.</span></li>
          <li style="display: flex; align-items: baseline; gap: 8px;"><span style="color: var(--accent-2); font-family: var(--font-mono);">→</span> <span>Endpoint telemetry using Sysmon and Wazuh.</span></li>
          <li style="display: flex; align-items: baseline; gap: 8px;"><span style="color: var(--accent-2); font-family: var(--font-mono);">→</span> <span>Network traffic analysis using Wireshark.</span></li>
          <li style="display: flex; align-items: baseline; gap: 8px;"><span style="color: var(--accent-2); font-family: var(--font-mono);">→</span> <span>Ethical hacking and vulnerability assessment.</span></li>
          <li style="display: flex; align-items: baseline; gap: 8px;"><span style="color: var(--accent-2); font-family: var(--font-mono);">→</span> <span>Web application security and OWASP Top 10.</span></li>
          <li style="display: flex; align-items: baseline; gap: 8px;"><span style="color: var(--accent-2); font-family: var(--font-mono);">→</span> <span>Defensive security and incident investigation.</span></li>
        </ul>
      </div>
    </div>

    <!-- Card 4: Career Objective -->
    <div class="about-card">
      <div class="about-card-icon" aria-hidden="true" style="background: rgba(245, 158, 11, 0.1); color: var(--warning);">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
      </div>
      <h3 class="about-card-title">Career Objective</h3>
      <div class="about-card-content" style="display: flex; flex-direction: column; gap: 14px;">
        <p style="font-size: 0.92rem; color: var(--text); line-height: 1.6;">
          Focused on securing entry-level <strong>SOC Analyst</strong>, <strong>Security Analyst</strong>, or <strong>Junior Penetration Tester</strong> roles where disciplined analysis, virtual lab experience, and evidence-driven documentation make an impact.
        </p>
        <div style="background: rgba(0, 245, 160, 0.05); border: 1px solid rgba(0, 245, 160, 0.2); border-radius: var(--radius-sm); padding: 12px 14px;">
          <div style="font-size: 0.78rem; font-family: var(--font-mono); color: var(--accent); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Primary Target Roles:</div>
          <div style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">
            Security Operations Center (SOC) • Security Analysis • Ethical Hacking
          </div>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">
          Committed to continuous technical growth through hands-on virtual labs, network protocol analysis, and defensive security workflows.
        </p>
      </div>
    </div>
  `;
}

// Render Skills Section
function renderSkillsSection() {
  const container = document.getElementById('skillsCategoriesContainer');
  if (!container) return;

  container.innerHTML = skillCategories.map(cat => `
    <div class="skill-category-card">
      <div class="category-header">
        <h3 class="category-title">${cat.title}</h3>
        <p class="category-desc">${cat.description}</p>
      </div>
      <div class="skill-chips-list">
        ${cat.skills.map(skill => {
          let badgeClass = 'badge-level-fundamentals';
          if (skill.level === 'Hands-on') badgeClass = 'badge-level-hands-on';
          if (skill.level === 'Learning') badgeClass = 'badge-level-learning';

          return `
            <div class="skill-chip">
              <div class="skill-chip-top">
                <span class="skill-name">${skill.name}</span>
                <span class="badge ${badgeClass}">${skill.level}</span>
              </div>
              ${skill.note ? `<span class="skill-note">${skill.note}</span>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `).join('');
}

// Render Projects Section & Filters
function renderProjectsSection() {
  const filterContainer = document.getElementById('projectFilterContainer');
  const projectsGrid = document.getElementById('projectsGrid');
  if (!projectsGrid) return;

  // Extract unique categories
  const categories = ['All', 'Blue Team / SOC', 'Network Security', 'Web Application Security', 'IoT Security'];

  if (filterContainer) {
    filterContainer.innerHTML = categories.map(cat => `
      <button 
        class="filter-btn ${cat === activeFilter ? 'active' : ''}" 
        data-filter="${cat}"
        role="tab"
        aria-selected="${cat === activeFilter}"
      >
        ${cat === 'All' ? 'All Projects' : cat}
      </button>
    `).join('');

    filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.getAttribute('data-filter');
        filterContainer.querySelectorAll('.filter-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        filterProjects();
      });
    });
  }

  filterProjects();
}

function filterProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  const filtered = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 48px; text-align: center; background: var(--card); border: 1px dashed var(--border); border-radius: var(--radius-md);">
        <p style="font-family: var(--font-mono); color: var(--text-muted);">No projects found matching category: "${activeFilter}".</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    let statusClass = 'badge-status-inprogress';
    if (p.status === 'Completed') statusClass = 'badge-status-completed';
    if (p.status === 'Planned') statusClass = 'badge-status-planned';

    return `
      <article class="project-card">
        <div class="project-visual">
          <img src="${p.evidence?.[0]?.src || ''}" alt="${p.evidence?.[0]?.alt || `${p.title} project evidence`}" loading="lazy" />
        </div>
        <div>
          <div class="project-meta-bar">
            <span class="project-category-tag">${p.category}</span>
            <span class="badge ${statusClass}">${p.status}</span>
          </div>
          <h3 class="project-title">${p.title}</h3>
          <p class="project-summary">${p.summary}</p>
          <div class="project-tech-badges">
            ${p.technologies.slice(0, 4).map(t => `<span class="tech-tag">${t}</span>`).join('')}
            ${p.technologies.length > 4 ? `<span class="tech-tag">+${p.technologies.length - 4} more</span>` : ''}
          </div>
        </div>
        <div class="project-card-footer">
          <button class="btn btn-primary" onclick="openCaseStudy('${p.slug}')" aria-label="View case study for ${p.title}">
            <span>View Case Study</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
          </button>
          ${p.repoUrl ? `
            <a href="${p.repoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" aria-label="GitHub Repository">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              <span>Code</span>
            </a>
          ` : ''}
        </div>
      </article>
    `;
  }).join('');
}

// Case Study Modal
window.openCaseStudy = function(slug) {
  const project = projects.find(p => p.slug === slug);
  if (!project) return;

  window.location.hash = `case-study/${slug}`;

  const modalBackdrop = document.getElementById('caseStudyModal');
  const modalContent = document.getElementById('modalCaseContent');
  if (!modalBackdrop || !modalContent) return;

  let statusClass = 'badge-status-inprogress';
  if (project.status === 'Completed') statusClass = 'badge-status-completed';
  if (project.status === 'Planned') statusClass = 'badge-status-planned';

  modalContent.innerHTML = `
    <div class="modal-header">
      <div>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
          <span class="project-category-tag">${project.category}</span>
          <span class="badge ${statusClass}">${project.status}</span>
        </div>
        <h2 style="font-size: 1.75rem; font-weight: 800; line-height: 1.3;">${project.title}</h2>
      </div>
      <button class="modal-close-btn" onclick="closeCaseStudy()" aria-label="Close modal">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>

    <div class="modal-body">
      <!-- Problem -->
      <section class="case-section">
        <h3 class="case-section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          Problem Statement
        </h3>
        <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.7;">${project.problem}</p>
      </section>

      <!-- Objectives -->
      <section class="case-section">
        <h3 class="case-section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
          Objectives
        </h3>
        <ul class="case-list">
          ${project.objectives.map(obj => `<li class="case-list-item">${obj}</li>`).join('')}
        </ul>
      </section>

      <!-- Environment & Technologies -->
      <section class="case-section">
        <h3 class="case-section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
          Environment &amp; Stack
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
          <div style="background: var(--card); padding: 16px; border-radius: var(--radius-sm); border: 1px solid var(--border);">
            <h4 style="font-size: 0.85rem; font-family: var(--font-mono); color: var(--accent-2); margin-bottom: 8px;">HOSTS &amp; VIRTUALIZATION</h4>
            <ul style="list-style: none; font-size: 0.88rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 6px;">
              ${project.environment.map(env => `<li>• ${env}</li>`).join('')}
            </ul>
          </div>
          <div style="background: var(--card); padding: 16px; border-radius: var(--radius-sm); border: 1px solid var(--border);">
            <h4 style="font-size: 0.85rem; font-family: var(--font-mono); color: var(--accent); margin-bottom: 8px;">TECHNOLOGIES &amp; PROTOCOLS</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
          </div>
        </div>
      </section>

      <!-- Methodology -->
      <section class="case-section">
        <h3 class="case-section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          Methodology
        </h3>
        <ul class="case-list">
          ${project.methodology.map(step => `<li class="case-list-item">${step}</li>`).join('')}
        </ul>
      </section>

      <!-- Implemented / Observed / Recommended (Strictly Separated per Section 16) -->
      <section class="case-section">
        <h3 class="case-section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          Technical Breakdown: Implemented / Observed / Recommended
        </h3>
        <div class="triage-grid">
          <div class="triage-card implemented">
            <h4 class="triage-card-title">IMPLEMENTED</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem; color: var(--text-muted);">
              ${project.implemented.map(i => `<li>• ${i}</li>`).join('')}
            </ul>
          </div>
          <div class="triage-card observed">
            <h4 class="triage-card-title">OBSERVED</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem; color: var(--text-muted);">
              ${project.observed.map(o => `<li>• ${o}</li>`).join('')}
            </ul>
          </div>
          <div class="triage-card recommended">
            <h4 class="triage-card-title">RECOMMENDED</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem; color: var(--text-muted);">
              ${project.recommended.map(r => `<li>• ${r}</li>`).join('')}
            </ul>
          </div>
        </div>
      </section>

      <!-- Results & Verification -->
      <section class="case-section">
        <h3 class="case-section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          Results &amp; Verification Status
        </h3>
        ${project.results.map(r => `
          <div class="result-item">
            <span class="result-badge ${r.verified ? 'verified' : 'unverified'}">
              ${r.verified ? 'Verified Result' : 'Unverified / To Confirm'}
            </span>
            <span style="font-size: 0.92rem; color: var(--text);">${r.text}</span>
          </div>
        `).join('')}
      </section>

      <!-- Limitations (Honest engineering account) -->
      <section class="case-section">
        <h3 class="case-section-title" style="color: var(--danger);">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          Limitations &amp; Boundary Conditions
        </h3>
        <ul class="case-list">
          ${project.limitations.map(lim => `<li class="case-list-item" style="color: #FDA4AF;">${lim}</li>`).join('')}
        </ul>
      </section>

      <!-- Technical Evidence Artifacts -->
      <section class="case-section">
        <h3 class="case-section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          Technical Evidence &amp; Visualizations
        </h3>
        ${project.evidence.map(ev => `
          <figure class="evidence-figure">
            <img src="${ev.src}" alt="${ev.alt}" class="evidence-img" loading="lazy" />
            <figcaption class="evidence-caption">${ev.caption}</figcaption>
          </figure>
        `).join('')}
      </section>

      <!-- Lessons Learned -->
      <section class="case-section">
        <h3 class="case-section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
          Lessons Learned
        </h3>
        <ul class="case-list">
          ${project.lessons.map(les => `<li class="case-list-item">${les}</li>`).join('')}
        </ul>
      </section>
    </div>
  `;

  modalBackdrop.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Trap focus
  const closeBtn = modalContent.querySelector('.modal-close-btn');
  if (closeBtn) closeBtn.focus();
};

window.closeCaseStudy = function() {
  const modalBackdrop = document.getElementById('caseStudyModal');
  if (modalBackdrop) modalBackdrop.style.display = 'none';
  document.body.style.overflow = 'auto';

  if (window.location.hash.startsWith('#case-study/')) {
    history.pushState('', document.title, window.location.pathname + window.location.search);
  }
};

// Routing for direct hash links
function initRouting() {
  const handleHash = () => {
    const hash = window.location.hash;
    if (hash.startsWith('#case-study/')) {
      const slug = hash.replace('#case-study/', '');
      openCaseStudy(slug);
    }
  };

  window.addEventListener('hashchange', handleHash);
  handleHash();

  // Close modal on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('caseStudyModal');
      if (modal && modal.style.display === 'flex') {
        closeCaseStudy();
      }
      const certificateModal = document.getElementById('certificateModal');
      if (certificateModal && certificateModal.style.display === 'flex') {
        closeCertificate();
      }
    }
  });

  // Close modal on click outside
  const modalBackdrop = document.getElementById('caseStudyModal');
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeCaseStudy();
      }
    });
  }

  const certificateModal = document.getElementById('certificateModal');
  if (certificateModal) {
    certificateModal.addEventListener('click', (e) => {
      if (e.target === certificateModal) {
        closeCertificate();
      }
    });
  }
}

// Render Certifications Section
function renderCertificationsSection() {
  const container = document.getElementById('certificationsContainer');
  if (!container) return;

  const certificates = certificationsData.certificates;
  container.innerHTML = `
    <div class="cert-gallery" aria-label="Completed cybersecurity certificates">
      ${certificates.map(certificate => `
        <article class="certificate-card">
          <div class="certificate-thumbnail ${certificate.format === 'pdf' ? 'certificate-thumbnail-pdf' : ''}">
            ${certificate.format === 'image'
              ? `<img src="${certificate.asset}" alt="${certificate.title} certificate from ${certificate.issuer}" loading="lazy">`
              : `<object data="${certificate.asset}" type="application/pdf" aria-label="Preview of ${certificate.title}"><span>PDF certificate</span></object>`}
            <span class="certificate-format">${certificate.format === 'pdf' ? 'PDF' : 'IMAGE'}</span>
          </div>
          <div class="certificate-card-body">
            <div class="certificate-card-heading">
              <span class="badge badge-status-completed">${certificate.status}</span>
              <span class="certificate-date">${certificate.date}</span>
            </div>
            <h3 class="certificate-title">${certificate.title}</h3>
            <p class="certificate-issuer">${certificate.issuer}</p>
            <p class="certificate-details">${certificate.details}</p>
            <button class="btn btn-secondary certificate-view-btn" type="button" onclick="openCertificate('${certificate.id}')" aria-label="View ${certificate.title} certificate">
              <span>View Certificate</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

window.openCertificate = function(id) {
  const certificate = certificationsData.certificates.find(item => item.id === id);
  const modal = document.getElementById('certificateModal');
  const content = document.getElementById('certificateModalContent');
  if (!certificate || !modal || !content) return;

  const viewer = certificate.format === 'image'
    ? `<img class="certificate-viewer-image" src="${certificate.asset}" alt="Full certificate: ${certificate.title}">`
    : `<iframe class="certificate-viewer-pdf" src="${certificate.asset}" title="${certificate.title} original PDF"></iframe>`;

  content.innerHTML = `
    <div class="certificate-modal-header">
      <div>
        <span class="section-kicker">Original certificate</span>
        <h2 id="certificateModalTitle">${certificate.title}</h2>
        <p>${certificate.issuer} &middot; ${certificate.date}</p>
      </div>
      <button class="modal-close-btn" type="button" onclick="closeCertificate()" aria-label="Close certificate viewer">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
    <div class="certificate-viewer">${viewer}</div>
    <div class="certificate-modal-footer">
      <span>${certificate.details}</span>
      ${certificate.format === 'pdf' ? `<a class="btn btn-secondary" href="${certificate.asset}" target="_blank" rel="noopener noreferrer">Open PDF in new tab</a>` : ''}
    </div>
  `;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  content.querySelector('.modal-close-btn')?.focus();
};

window.closeCertificate = function() {
  const modal = document.getElementById('certificateModal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = 'auto';
};

// Render Resume Section
function renderResumeSection() {
  const container = document.getElementById('resumeContentContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="resume-card">
      <div>
        <span class="section-kicker">Curriculum Vitae</span>
        <h3 style="font-size: 1.85rem; font-weight: 800; margin-bottom: 12px;">Explore My Complete Profile</h3>
        <p style="color: var(--text-muted); font-size: 1.05rem; max-width: 580px;">
          Review my academic foundation in multimedia and animation, dedicated virtual lab projects in SOC and network defense, and verified tool proficiencies.
        </p>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 14px;">
        <a class="btn btn-primary js-resume-btn" target="_blank" rel="noopener noreferrer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          <span>View Resume</span>
        </a>
        <a class="btn btn-secondary js-resume-btn" download="Gokul_Dass_Kannan_Resume.pdf">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <span>Download PDF</span>
        </a>
      </div>
    </div>
  `;
  updateResumeButtons();
}

// Render Contact Section & Form Validation
function renderContactSection() {
  const directMethodsContainer = document.getElementById('contactDirectMethods');
  if (directMethodsContainer) {
    let methodsHtml = '';
    const links = site.links;

    if (links.email) {
      methodsHtml += `
        <a href="mailto:${links.email}" class="contact-method-card">
          <div style="color: var(--accent);"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></div>
          <div>
            <div style="font-size: 0.82rem; font-family: var(--font-mono); color: var(--text-muted);">DIRECT EMAIL</div>
            <div style="font-weight: 600;">${links.email}</div>
          </div>
        </a>
      `;
    }

    if (links.linkedin) {
      methodsHtml += `
        <a href="${links.linkedin}" target="_blank" rel="noopener noreferrer" class="contact-method-card">
          <div style="color: var(--accent-2);"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></div>
          <div>
            <div style="font-size: 0.82rem; font-family: var(--font-mono); color: var(--text-muted);">LINKEDIN</div>
            <div style="font-weight: 600;">Connect on LinkedIn</div>
          </div>
        </a>
      `;
    }

    if (links.github) {
      methodsHtml += `
        <a href="${links.github}" target="_blank" rel="noopener noreferrer" class="contact-method-card">
          <div style="color: var(--text);"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg></div>
          <div>
            <div style="font-size: 0.82rem; font-family: var(--font-mono); color: var(--text-muted);">GITHUB</div>
            <div style="font-weight: 600;">Browse Repositories</div>
          </div>
        </a>
      `;
    }

    if (!methodsHtml) {
      methodsHtml = `
        <div style="padding: 16px; background: var(--card); border: 1px dashed var(--border); border-radius: var(--radius-sm); color: var(--text-muted); font-size: 0.9rem;">
          <p>Links will populate here once configured in <code style="color: var(--accent);">src/data/site.ts</code>.</p>
        </div>
      `;
    }

    directMethodsContainer.innerHTML = methodsHtml;
  }

  // Handle Contact Form Submit
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');

  if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const defaultBtnHtml = submitBtn ? submitBtn.innerHTML : '<span>Transmit Message</span>';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = form.elements['name']?.value?.trim();
      const email = form.elements['email']?.value?.trim();
      const subject = form.elements['subject']?.value?.trim();
      const message = form.elements['message']?.value?.trim();
      const honeypot = form.elements['company_field']?.value;

      // 1. Anti-Spam Honeypot check (silently drop bot submission)
      if (honeypot && String(honeypot).trim() !== '') {
        form.reset();
        showFormStatus('Message transmitted successfully! Thank you for reaching out.', 'success');
        return;
      }

      // 2. Validate required fields
      if (!name) {
        showFormStatus('Full Name is required.', 'error');
        form.elements['name']?.focus();
        return;
      }

      if (!email) {
        showFormStatus('Email Address is required.', 'error');
        form.elements['email']?.focus();
        return;
      }

      // 3. Validate email format
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
      if (!emailRegex.test(email) || email.length > 254) {
        showFormStatus('Please enter a valid email address.', 'error');
        form.elements['email']?.focus();
        return;
      }

      if (!message) {
        showFormStatus('Message is required.', 'error');
        form.elements['message']?.focus();
        return;
      }

      // 4. Prevent duplicate submissions & update button state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span>Transmitting...</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"></circle></svg>
        `;
      }

      // Clear previous status while transmitting
      if (statusEl) statusEl.style.display = 'none';

      const endpoint = site.contactFormEndpoint || '/api/contact';

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name,
            email,
            subject,
            message,
            company_field: honeypot || ''
          })
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok && data.success) {
          form.reset();
          showFormStatus(data.message || 'Message transmitted successfully! Thank you for reaching out.', 'success');
        } else {
          const errorMsg = data.error || 'Unable to send your message right now. Please try again later.';
          showFormStatus(errorMsg, 'error');
        }
      } catch (err) {
        showFormStatus('Unable to send your message right now. Please try again later.', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = defaultBtnHtml;
        }
      }
    });
  }
}

function showFormStatus(msg, type) {
  const el = document.getElementById('formStatus');
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
  el.style.padding = '12px 16px';
  el.style.borderRadius = '6px';
  el.style.marginTop = '16px';
  el.style.fontSize = '0.9rem';

  if (type === 'error') {
    el.style.background = 'rgba(244, 63, 94, 0.15)';
    el.style.color = '#F43F5E';
    el.style.border = '1px solid #F43F5E';
  } else if (type === 'success') {
    el.style.background = 'rgba(0, 245, 160, 0.15)';
    el.style.color = '#00F5A0';
    el.style.border = '1px solid #00F5A0';
  } else {
    el.style.background = 'rgba(56, 189, 248, 0.15)';
    el.style.color = '#38BDF8';
    el.style.border = '1px solid #38BDF8';
  }
}

// Render Footer
function renderFooter() {
  const footerYear = document.getElementById('footerYear');
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  renderSocialLinks('footerSocials');
}

// Navigation & ScrollSpy
function initNavigation() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileMenuDrawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      mobileDrawer.style.display = isExpanded ? 'none' : 'flex';
    });

    // Close on drawer link click
    mobileDrawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileDrawer.style.display = 'none';
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ScrollSpy
  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

// Tier 2: Interactive Terminal
function initTerminal() {
  const input = document.getElementById('terminalCommandInput');
  const output = document.getElementById('terminalInteractiveOutput');
  if (!input || !output) return;

  const commands = {
    help: () => `
Available static commands:
  <span style="color: var(--accent);">about</span>        - Summary of Gokul's cybersecurity focus and education
  <span style="color: var(--accent);">skills</span>       - List categorized hands-on and fundamentals skills
  <span style="color: var(--accent);">projects</span>     - Summary list of documented security lab projects
  <span style="color: var(--accent);">contact</span>      - Display configured contact avenues
  <span style="color: var(--accent);">status</span>       - Check career objective and availability
  <span style="color: var(--accent);">clear</span>        - Clear terminal screen
    `,
    about: () => `
Gokul Dass Kannan: Aspiring Cybersecurity Professional.
Education: BCA in Multimedia and Animation, Hindustan Institute of Technology & Science.
Training: Cybersecurity & Ethical Hacking, Bostan Institute of Analysis.
Experience: Practical On-the-Job Training in security tools, network analysis, vulnerability assessment, and security monitoring.
Focus: SOC operations, ethical hacking, and web application security.
    `,
    skills: () => `
[Security Monitoring] Wazuh SIEM, Sysmon, Windows Event Logs (EID 1, 3, 4688, 4624)
[Network Security]    Wireshark, Nmap, TCP/IP, OpenVPN
[Web App Security]   Burp Suite (Repeater), Host Header Analysis, OWASP Top 10
[Virtualization]     VMware Workstation 17 Pro, Kali Linux, Ubuntu, Windows Server 2022
    `,
    projects: () => `
1. Endpoint Security Monitoring with Sysmon & Wazuh [In Progress]
2. Establishing a Secure VPN for Remote Access (OpenVPN) [In Progress]
3. IoT Smart Home Security Assessment [In Progress]
4. Web Application Security Testing with Burp Suite [In Progress]
5. Open Redirection Testing with Security Headers [Planned]
    `,
    contact: () => `
Email:    ${site.links.email || '[Pending configuration in site.ts]'}
LinkedIn: ${site.links.linkedin || '[Pending configuration in site.ts]'}
GitHub:   ${site.links.github || '[Pending configuration in site.ts]'}
    `,
    status: () => `
Status: ${site.availability.text}
Focus: Entry-level SOC Analyst / Junior Security Analyst positions.
    `
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawCmd = input.value.trim().toLowerCase();
      input.value = '';

      if (!rawCmd) return;

      if (rawCmd === 'clear') {
        output.innerHTML = '';
        return;
      }

      const handler = commands[rawCmd];
      const resultHtml = handler 
        ? handler() 
        : `Command not recognized: "${escapeHtml(rawCmd)}". Type <span style="color: var(--accent);">help</span> for available commands.`;

      output.innerHTML += `
        <div style="margin-bottom: 8px;">
          <span style="color: var(--accent);">&gt; ${escapeHtml(rawCmd)}</span>
          <div style="color: var(--text-muted); margin-top: 4px; line-height: 1.6;">${resultHtml}</div>
        </div>
      `;

      output.parentElement.scrollTop = output.parentElement.scrollHeight;
    }
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function initAccessibility() {
  // Respect tab visibility for decorative animation
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (roleRotationInterval) clearInterval(roleRotationInterval);
    } else {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion && site.rotatingRoles && site.rotatingRoles.length > 0) {
        roleRotationInterval = setInterval(() => {
          const roleEl = document.getElementById('rotatingRole');
          if (!roleEl) return;
          currentRoleIndex = (currentRoleIndex + 1) % site.rotatingRoles.length;
          roleEl.style.opacity = '0';
          setTimeout(() => {
            roleEl.textContent = site.rotatingRoles[currentRoleIndex];
            roleEl.style.opacity = '1';
          }, 200);
        }, 3000);
      }
    }
  });
}

function initVisibilityListener() {
  // Focus ring helper for mouse vs keyboard
  document.body.addEventListener('mousedown', () => {
    document.body.classList.add('using-mouse');
  });
  document.body.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.remove('using-mouse');
    }
  });
}

