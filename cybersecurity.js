/**
 * =================================================================
 * ZIVO IT — CYBERSECURITY INTERACTIVE ENGINE (cybersecurity.js)
 * Isolated scripts for cybersecurity.html with On-Page Framework Modal
 * =================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ---------------- 1. Header Scroll Shadow ---------------- */
  const siteHeader = document.getElementById('siteHeader');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    });
  }

  /* ---------------- 2. Theme Toggle Logic ---------------- */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const currentTheme = localStorage.getItem('theme') || 'light';

  const moonPath = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
  const sunPath = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';

  if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeIcon) themeIcon.innerHTML = sunPath;
  } else {
    document.documentElement.removeAttribute('data-theme');
    if (themeIcon) themeIcon.innerHTML = moonPath;
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      if (theme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
        if (themeIcon) themeIcon.innerHTML = moonPath;
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        if (themeIcon) themeIcon.innerHTML = sunPath;
      }
    });
  }

  /* ---------------- 3. Mobile Navigation Drawer ---------------- */
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  const navOverlay = document.getElementById('navOverlay');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      document.body.classList.toggle('menu-open');
      primaryNav.classList.toggle('open');
      primaryNav.classList.toggle('active');
      if (navOverlay) navOverlay.classList.toggle('active');
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
      primaryNav.classList.remove('open');
      primaryNav.classList.remove('active');
      navOverlay.classList.remove('active');
    });
  }

  /* ---------------- 4. IntersectionObserver Scroll Animations ---------------- */
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.08
  };

  const animatedElements = document.querySelectorAll(
    '.challenge-card, .pillar-card, .arch-layer, .risk-card, .compliance-card, .tech-item-card, .process-step-card, .journey-step, .why-card'
  );

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s var(--ease), transform 0.6s var(--ease), border-color 0.3s var(--ease), box-shadow 0.3s var(--ease)';
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, (index % 6) * 60);
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));

  /* ---------------- 5. Hero Node Pulsing Cycle ---------------- */
  const meshNodes = document.querySelectorAll('.mesh-node');
  if (meshNodes.length > 0) {
    let activeIdx = 0;
    setInterval(() => {
      meshNodes.forEach(node => node.classList.remove('active'));
      meshNodes[activeIdx].classList.add('active');
      activeIdx = (activeIdx + 1) % meshNodes.length;
    }, 2400);
  }

  /* ---------------- 6. Reusable On-Page Framework Modal Component ---------------- */
  const frameworkData = {
    'soc2': {
      title: 'SOC 2',
      badge: 'SOC 2',
      badgeClass: 'blue',
      percentage: '100%',
      reqs: '55',
      ctrls: '265/265',
      subtitle: 'AICPA Trust Services Criteria (Security, Availability, Confidentiality)',
      overview: 'SOC 2 is an assurance framework developed by the AICPA establishing controls relevant to security, availability, processing integrity, confidentiality, and privacy.',
      focusAreas: [
        'Security & Logical Access Control',
        'System Monitoring & Operational Oversight',
        'Change Management & Deployment Security',
        'Data Encryption & Disaster Recovery Preparedness'
      ],
      advisoryScope: 'ZIVO IT provides control alignment advisory, technical baseline evaluation, and readiness support to structure your enterprise IT environment for independent SOC 2 evaluations.'
    },
    'iso27001': {
      title: 'ISO 27001:2022',
      badge: 'ISO',
      badgeClass: 'cyan',
      percentage: '91%',
      reqs: '123',
      ctrls: '230/253',
      subtitle: 'International Information Security Management System (ISMS)',
      overview: 'ISO 27001:2022 is the global benchmark for establishing, implementing, maintaining, and continually improving an Information Security Management System (ISMS).',
      focusAreas: [
        'Organizational Security Controls',
        'People & Access Governance',
        'Physical & Environmental Safeguards',
        'Technological & Network Security Controls'
      ],
      advisoryScope: 'We assist enterprise teams in mapping technical controls against ISO 27001 Annex A requirements, establishing risk registers, and preparing for audit readiness.'
    },
    'gdpr': {
      title: 'GDPR',
      badge: 'GDPR',
      badgeClass: 'purple',
      percentage: '100%',
      reqs: '40',
      ctrls: '39/39',
      subtitle: 'General Data Protection Regulation Privacy Framework',
      overview: 'GDPR mandates strict requirements for organizations collecting, storing, processing, or transferring personal data belonging to individuals within the European Union.',
      focusAreas: [
        'Data Privacy by Design & Default',
        'Data Subject Rights & Consent Architecture',
        'Cross-Border Data Transfer Safeguards',
        'Incident Response & 72-Hour Breach Notification'
      ],
      advisoryScope: 'ZIVO IT helps structure technical data flow mapping, privacy control validation, and database security mechanisms required for GDPR alignment.'
    },
    'pci': {
      title: 'PCI DSS v4.0.1',
      badge: 'PCI',
      badgeClass: 'blue',
      percentage: '64%',
      reqs: '54',
      ctrls: '42/66',
      subtitle: 'Payment Card Industry Data Security Standard v4.0.1',
      overview: 'PCI DSS v4.0.1 governs organizations that store, process, or transmit cardholder data (CHD), mandating technical controls across network, data, and access layers.',
      focusAreas: [
        'Cardholder Data Environment (CDE) Isolation',
        'Network Segmentation & Firewall Hygiene',
        'Strong Access Control & Key Management',
        'Continuous Vulnerability Management'
      ],
      advisoryScope: 'We evaluate network segmentation boundaries, encryption posture, and host configuration guardrails to minimize technical CDE exposure.'
    },
    'ccpa': {
      title: 'CCPA',
      badge: 'CCPA',
      badgeClass: 'teal',
      percentage: '68%',
      reqs: '42',
      ctrls: '68/100',
      subtitle: 'California Consumer Privacy Act & CPRA Framework',
      overview: 'CCPA/CPRA sets data privacy rights and consumer protection mandates for businesses processing personal information of California residents.',
      focusAreas: [
        'Consumer Data Disclosure & Opt-Out Controls',
        'Data Minimization & Retention Schedules',
        'Third-Party Service Provider Governance',
        'Reasonable Security Safeguards Enforcement'
      ],
      advisoryScope: 'ZIVO IT helps enterprises audit data inventories, construct consumer request mechanisms, and validate technical privacy controls.'
    },
    'hipaa': {
      title: 'HIPAA',
      badge: 'HIPAA',
      badgeClass: 'teal',
      percentage: '94%',
      reqs: '201',
      ctrls: '120/128',
      subtitle: 'Health Insurance Portability and Accountability Act Security Rule',
      overview: 'The HIPAA Security Rule sets national standards for protecting electronic Protected Health Information (ePHI) created, received, or maintained by covered entities.',
      focusAreas: [
        'Administrative Safeguards & Risk Analysis',
        'Physical Security Controls for Data Systems',
        'Technical Safeguards: Access Control & Encryption',
        'Audit Logging & Transmission Security'
      ],
      advisoryScope: 'ZIVO IT reviews ePHI database access controls, transmission encryption protocols, and technical log integrity for healthcare environments.'
    },
    'nis2': {
      title: 'NIS 2',
      badge: 'NIS 2',
      badgeClass: 'blue',
      percentage: '82%',
      reqs: '31',
      ctrls: '94/115',
      subtitle: 'EU Network and Information Security Directive 2',
      overview: 'NIS 2 establishes legal measures to boost the overall level of cybersecurity across essential and important entities within the European Union.',
      focusAreas: [
        'Cybersecurity Risk Management Policies',
        'Incident Handling & Rapid Crisis Management',
        'Supply Chain Security & Vendor Auditing',
        'MFA, Encryption & Secure Communications'
      ],
      advisoryScope: 'We assist infrastructure and digital service providers in mapping technical resilience controls against NIS 2 directive requirements.'
    },
    'nist-ai': {
      title: 'NIST AI RMF',
      badge: 'NIST',
      badgeClass: 'purple',
      percentage: '100%',
      reqs: '73',
      ctrls: '29/29',
      subtitle: 'NIST Artificial Intelligence Risk Management Framework 1.0',
      overview: 'NIST AI RMF provides structured guidance to manage risks associated with artificial intelligence systems across GOVERN, MAP, MEASURE, and MANAGE functions.',
      focusAreas: [
        'GOVERN: Organizational AI Culture & Governance',
        'MAP: System Context & Risk Identification',
        'MEASURE: Quantitative & Qualitative Risk Analysis',
        'MANAGE: Continuous AI Risk Mitigation'
      ],
      advisoryScope: 'We assist organizations in evaluating AI system data pipelines, access control boundaries, and risk governance frameworks in alignment with NIST guidelines.'
    },
    'hitrust': {
      title: 'HITRUST',
      badge: 'HITRUST',
      badgeClass: 'cyan',
      percentage: '76%',
      reqs: '3031',
      ctrls: '244/321',
      subtitle: 'Health Information Trust Alliance CSF Framework',
      overview: 'HITRUST CSF is a certifiable security framework that harmonizes international standards (NIST, ISO, HIPAA, PCI) into a unified risk management model.',
      focusAreas: [
        'Harmonized Control Architecture across 14 Domains',
        'Risk-Based Security & Privacy Controls',
        'Third-Party Supply Chain Assurance',
        'Continuous Security Maturation'
      ],
      advisoryScope: 'ZIVO IT supports multi-standard control harmonization, technical control validation, and readiness roadmap structuring for enterprise IT.'
    },
    'iso42001': {
      title: 'ISO 42001',
      badge: 'ISO',
      badgeClass: 'purple',
      percentage: '73%',
      reqs: '71',
      ctrls: '41/56',
      subtitle: 'Artificial Intelligence Management System (AIMS)',
      overview: 'ISO 42001 specifies requirements for establishing, implementing, maintaining, and continually improving an Artificial Intelligence Management System (AIMS).',
      focusAreas: [
        'Ethical AI Impact Assessments',
        'AI Data Quality & Model Integrity Controls',
        'AI System Lifecycle Management',
        'Transparency & Model Governance'
      ],
      advisoryScope: 'We provide strategic guidance on AI system governance, data input validation, and access control guardrails for enterprise AI integrations.'
    },
    'cmmc': {
      title: 'CMMC',
      badge: 'CMMC',
      badgeClass: 'teal',
      percentage: '79%',
      reqs: '11',
      ctrls: '154/195',
      subtitle: 'Cybersecurity Maturity Model Certification (US DoD)',
      overview: 'CMMC is designed to enforce the protection of Controlled Unclassified Information (CUI) and Federal Contract Information (FCI) across defense supply chains.',
      focusAreas: [
        'Access Control & Identity Verification',
        'Media Protection & System Hardening',
        'Incident Response & Audit Logging',
        'Boundary Protection & Risk Mitigation'
      ],
      advisoryScope: 'ZIVO IT assists suppliers in structuring isolated CUI technical enclaves, reviewing baseline security controls, and conducting readiness reviews.'
    },
    'essential-eight': {
      title: 'Essential Eight',
      badge: 'E8',
      badgeClass: 'cyan',
      percentage: '100%',
      reqs: '153',
      ctrls: '130/130',
      subtitle: 'Australian Cyber Security Centre (ACSC) Mitigation Strategies',
      overview: 'The Essential Eight is a prioritized set of mitigation strategies designed to assist organizations in protecting their systems against cyber threats.',
      focusAreas: [
        'Application Control & Patch Applications',
        'Configure Microsoft Office Macro Settings',
        'User Application Hardening & Restrict Admin Privileges',
        'Multi-Factor Authentication & Regular Backups'
      ],
      advisoryScope: 'We help enterprise IT teams evaluate maturity levels across all eight controls to build resilient technical defenses.'
    }
  };

  const modalOverlay = document.getElementById('frameworkModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalSub = document.getElementById('modalSub');
  const modalBadge = document.getElementById('modalBadge');
  const modalPercent = document.getElementById('modalPercent');
  const modalReqs = document.getElementById('modalReqs');
  const modalCtrls = document.getElementById('modalCtrls');
  const modalOverview = document.getElementById('modalOverview');
  const modalFocusAreas = document.getElementById('modalFocusAreas');
  const modalAdvisoryScope = document.getElementById('modalAdvisoryScope');

  let activeTriggerElement = null;

  function openFrameworkModal(frameworkKey, triggerEl) {
    const data = frameworkData[frameworkKey];
    if (!data || !modalOverlay) return;

    activeTriggerElement = triggerEl || document.activeElement;

    if (modalTitle) modalTitle.textContent = data.title;
    if (modalSub) modalSub.textContent = data.subtitle;
    if (modalBadge) {
      modalBadge.textContent = data.badge;
      modalBadge.className = `comp-badge-icon modal-badge ${data.badgeClass}`;
    }
    if (modalPercent) modalPercent.textContent = data.percentage;
    if (modalReqs) modalReqs.textContent = data.reqs;
    if (modalCtrls) modalCtrls.textContent = data.ctrls;
    if (modalOverview) modalOverview.textContent = data.overview;
    if (modalAdvisoryScope) modalAdvisoryScope.textContent = data.advisoryScope;

    if (modalFocusAreas) {
      modalFocusAreas.innerHTML = data.focusAreas
        .map(item => `<li>${item}</li>`)
        .join('');
    }

    modalOverlay.classList.add('active', 'is-open', 'open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    if (modalCloseBtn) {
      setTimeout(() => modalCloseBtn.focus(), 50);
    }
  }

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active', 'is-open', 'open');
      modalOverlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      if (activeTriggerElement && typeof activeTriggerElement.focus === 'function') {
        activeTriggerElement.focus();
      }
    }
  }

  // Attach click listeners to cards and buttons
  const frameworkCards = document.querySelectorAll('.compliance-card');
  frameworkCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const frameworkKey = card.getAttribute('data-framework');
      openFrameworkModal(frameworkKey, card);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const frameworkKey = card.getAttribute('data-framework');
        openFrameworkModal(frameworkKey, card);
      }
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && (modalOverlay.classList.contains('active') || modalOverlay.classList.contains('is-open'))) {
      closeModal();
    }
  });
});
