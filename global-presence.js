/**
 * =================================================================
 * ZIVO IT - GLOBAL PRESENCE & OUR APPROACH INTERACTIVE ENGINE
 * Framework-agnostic Vanilla JS with GSAP ScrollTrigger
 * Compatible with Odoo Website 19 Custom Modules
 * =================================================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', initGlobalPresence);

  function initGlobalPresence() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    } else {
      console.warn('ZIVO IT: GSAP or ScrollTrigger library missing. Falling back to static view.');
      return;
    }

    initVideoController();
    initTimelines();

    // Ensure initial layout stability after page load & media ready
    window.addEventListener('load', function () {
      setTimeout(function () {
        ScrollTrigger.refresh();
      }, 100);
    });
  }

  /* -----------------------------------------------------------------
     1. EARTH VIDEO CONTROLLER & SMOOTH SCRUBBING
  ----------------------------------------------------------------- */
  let videoObj = null;
  let videoReady = false;

  function initVideoController() {
    videoObj = document.getElementById('gp-earth-video');
    if (!videoObj) return;

    videoObj.muted = true;
    videoObj.playsInline = true;
    videoObj.preload = 'auto';

    const markReady = function () {
      videoReady = true;
      videoObj.pause();
    };

    if (videoObj.readyState >= 1) {
      markReady();
    } else {
      videoObj.addEventListener('loadedmetadata', markReady, { once: true });
    }
  }

  function setVideoProgress(progress) {
    if (!videoObj || !videoReady || !videoObj.duration || isNaN(videoObj.duration)) return;
    const target = Math.max(0, Math.min(1, progress)) * videoObj.duration;
    if (Math.abs(videoObj.currentTime - target) > 0.008) {
      try {
        videoObj.currentTime = target;
      } catch (e) {
        // Fallback for in-flight seek
      }
    }
  }

  /* -----------------------------------------------------------------
     2. ETHEREAL CYAN LASER BEAM OVERLAY
  ----------------------------------------------------------------- */
  let laserPaths = [];

  function initLaserBeams() {
    const svgOverlay = document.getElementById('gp-svg-overlay');
    const globeWrapper = document.querySelector('.gp-globe-wrapper');
    const cards = document.querySelectorAll('.gp-card');

    if (!svgOverlay || !globeWrapper || cards.length === 0) return;

    const defs = svgOverlay.querySelector('defs');
    svgOverlay.innerHTML = '';
    if (defs) svgOverlay.appendChild(defs);

    laserPaths = [];

    const overlayRect = svgOverlay.getBoundingClientRect();
    const globeRect = globeWrapper.getBoundingClientRect();
    const globeCenterX = globeRect.left + globeRect.width / 2 - overlayRect.left;
    const globeCenterY = globeRect.top + globeRect.height / 2 - overlayRect.top;

    cards.forEach(function (card, index) {
      const cardRect = card.getBoundingClientRect();
      const isLeft = card.closest('.gp-col-left') !== null;

      const startX = isLeft
        ? cardRect.right - overlayRect.left - 12
        : cardRect.left - overlayRect.left + 12;
      const startY = cardRect.top + cardRect.height / 2 - overlayRect.top;

      const angle = ((index - cards.length / 2) / cards.length) * Math.PI * 0.7;
      const radius = globeRect.width * 0.44;
      const endX = globeCenterX + Math.cos(angle) * (isLeft ? -radius : radius);
      const endY = globeCenterY + Math.sin(angle) * (radius * 0.55);

      const controlX1 = startX + (isLeft ? 90 : -90);
      const controlY1 = startY;
      const controlX2 = endX + (isLeft ? -50 : 50);
      const controlY2 = endY;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const pathData = `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;

      path.setAttribute('d', pathData);
      path.setAttribute('class', 'gp-laser-beam');
      path.setAttribute('stroke', isLeft ? 'url(#gp-laser-grad-left)' : 'url(#gp-laser-grad-right)');

      const pulseNode = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pulseNode.setAttribute('cx', endX);
      pulseNode.setAttribute('cy', endY);
      pulseNode.setAttribute('class', 'gp-laser-pulse');

      svgOverlay.appendChild(path);
      svgOverlay.appendChild(pulseNode);

      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;

      laserPaths.push({ path: path, length: length });
    });
  }

  function updateLaserBeams() {
    initLaserBeams();
  }

  function animateLaserBeams(progress) {
    if (laserPaths.length === 0) return;
    laserPaths.forEach(function (item, idx) {
      const itemProgress = Math.max(0, Math.min(1, (progress - idx * 0.04) / 0.65));
      const drawLength = item.length * (1 - itemProgress);
      item.path.style.strokeDashoffset = drawLength;
    });
  }

  /* -----------------------------------------------------------------
     3. STAIRCASE SVG CONNECTOR LINE ENGINE
  ----------------------------------------------------------------- */
  let stairData = null;

  function buildStairPath() {
    const svg = document.getElementById('oa-stair-svg');
    const grid = document.querySelector('.oa-steps-grid');
    const stepCards = document.querySelectorAll('.oa-step-card');

    if (!svg || !grid || stepCards.length < 2) return;

    const gridRect = grid.getBoundingClientRect();
    if (gridRect.width === 0 || gridRect.height === 0) return;

    svg.setAttribute('viewBox', `0 0 ${gridRect.width} ${gridRect.height}`);
    svg.setAttribute('preserveAspectRatio', 'none');

    const isMobile = window.innerWidth <= 768;

    const cardsData = Array.prototype.map.call(stepCards, function (card) {
      const r = card.getBoundingClientRect();
      return {
        left: r.left - gridRect.left,
        right: r.right - gridRect.left,
        top: r.top - gridRect.top,
        bottom: r.bottom - gridRect.top
      };
    });

    svg.innerHTML = `
      <defs>
        <linearGradient id="oa-stair-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#22D3EE" stop-opacity="1"/>
          <stop offset="100%" stop-color="#0EA5B7" stop-opacity="1"/>
        </linearGradient>
        <filter id="oa-energy-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    `;

    let pathData = '';

    if (isMobile) {
      // Mobile: Straight vertical energy timeline line down the left side (x = 12px)
      const lineX = 12;
      const startY = cardsData[0].top;
      const endY = cardsData[cardsData.length - 1].bottom;
      pathData = `M ${lineX} ${startY.toFixed(2)} L ${lineX} ${endY.toFixed(2)}`;
    } else {
      // Desktop / Tablet: Orthogonal top-border staircase line with R=14px rounded corners
      const R = 14;
      pathData = `M ${(cardsData[0].left + R).toFixed(2)} ${cardsData[0].top.toFixed(2)}`;

      for (let i = 0; i < cardsData.length; i++) {
        const c = cardsData[i];
        if (i < cardsData.length - 1) {
          const nextC = cardsData[i + 1];
          const nextLeft = nextC.left;
          const curTop = c.top;
          const nextTop = nextC.top;

          pathData += ` L ${(nextLeft - R).toFixed(2)} ${curTop.toFixed(2)}`;
          pathData += ` Q ${nextLeft.toFixed(2)} ${curTop.toFixed(2)}, ${nextLeft.toFixed(2)} ${(curTop - R).toFixed(2)}`;
          pathData += ` L ${nextLeft.toFixed(2)} ${(nextTop + R).toFixed(2)}`;
          pathData += ` Q ${nextLeft.toFixed(2)} ${nextTop.toFixed(2)}, ${(nextLeft + R).toFixed(2)} ${nextTop.toFixed(2)}`;
        } else {
          pathData += ` L ${(c.right - R).toFixed(2)} ${c.top.toFixed(2)}`;
        }
      }
    }

    // Faint guide background path
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    bg.setAttribute('d', pathData);
    bg.setAttribute('class', 'oa-stair-path-bg');
    svg.appendChild(bg);

    // Active growing energy path
    const fg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    fg.setAttribute('d', pathData);
    fg.setAttribute('class', 'oa-stair-path');
    fg.setAttribute('stroke', 'url(#oa-stair-grad)');
    fg.setAttribute('fill', 'none');
    svg.appendChild(fg);

    // Glowing energy pulse head orb
    const headG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    headG.setAttribute('class', 'oa-energy-head');

    const outerGlow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    outerGlow.setAttribute('r', '8');
    outerGlow.setAttribute('fill', '#22D3EE');
    outerGlow.setAttribute('filter', 'url(#oa-energy-glow)');
    outerGlow.setAttribute('opacity', '0.95');

    const innerCore = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    innerCore.setAttribute('r', '4');
    innerCore.setAttribute('fill', '#FFFFFF');

    headG.appendChild(outerGlow);
    headG.appendChild(innerCore);
    svg.appendChild(headG);

    const length = fg.getTotalLength();
    fg.style.strokeDasharray = length;
    fg.style.strokeDashoffset = length;

    stairData = { fg: fg, head: headG, length: length };
  }

  function setStairProgress(progress) {
    if (!stairData) return;
    const p = Math.max(0, Math.min(1, progress));
    const drawLen = stairData.length * (1 - p);
    stairData.fg.style.strokeDashoffset = drawLen;

    // Move glowing energy orb along path
    const currentPoint = stairData.fg.getPointAtLength(stairData.length * Math.min(p, 0.999));
    stairData.head.setAttribute('transform', `translate(${currentPoint.x.toFixed(2)}, ${currentPoint.y.toFixed(2)})`);
    stairData.head.style.opacity = p > 0.01 ? '1' : '0';
  }

  function updateActiveStep(progress) {
    const stepCards = document.querySelectorAll('.oa-step-card');
    if (!stepCards || stepCards.length === 0) return;
    const total = stepCards.length;
    const p = Math.max(0, Math.min(1, progress));

    let active = Math.floor(p * total);
    if (p >= 0.95 || active >= total) active = total - 1;

    stepCards.forEach(function (card, idx) {
      if (p >= 0.95) {
        card.classList.add('completed');
        card.classList.remove('future');
        if (idx === total - 1) card.classList.add('is-active');
      } else if (idx < active) {
        card.classList.add('completed');
        card.classList.remove('is-active', 'future');
      } else if (idx === active) {
        card.classList.add('is-active');
        card.classList.remove('completed', 'future');
      } else {
        card.classList.add('future');
        card.classList.remove('is-active', 'completed');
      }
    });
  }

  /* -----------------------------------------------------------------
     4. RESPONSIVE GSAP SCROLLTRIGGER TIMELINES
  ----------------------------------------------------------------- */
  function initTimelines() {
    // Kill existing ScrollTriggers to prevent duplicate pin-spacers on refresh
    ScrollTrigger.getAll().forEach(function (st) {
      st.kill();
    });

    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize"
    });

    ScrollTrigger.matchMedia({
      // Desktop (> 1024px) & Tablet (769px - 1024px)
      "(min-width: 769px)": function () {
        setupGlobalPresenceTimeline();
        setupOurApproachTimeline();
      },

      // Mobile (<= 768px)
      "(max-width: 768px)": function () {
        setupMobileFallback();
      }
    });
  }

  function setupGlobalPresenceTimeline() {
    const gpSection = document.getElementById('global-presence');
    const leftCards = document.querySelectorAll('.gp-col-left .gp-card');
    const rightCards = document.querySelectorAll('.gp-col-right .gp-card');
    const globeGlow = document.querySelector('.gp-globe-glow');

    if (!gpSection) return;

    gsap.set([...leftCards], { opacity: 0, x: -40, scale: 0.95 });
    gsap.set([...rightCards], { opacity: 0, x: 40, scale: 0.95 });
    initLaserBeams();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: gpSection,
        start: 'top top',
        end: '+=250%',
        pin: true,
        pinSpacing: true,
        scrub: 0.35,
        refreshPriority: 2,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onRefresh: function () {
          updateLaserBeams();
        },
        onUpdate: function (self) {
          setVideoProgress(self.progress);
          animateLaserBeams(self.progress);
        }
      }
    });

    tl.to(leftCards, {
      opacity: 1,
      x: 0,
      scale: 1,
      stagger: 0.1,
      ease: 'power2.out',
      duration: 1
    }, 0);

    tl.to(rightCards, {
      opacity: 1,
      x: 0,
      scale: 1,
      stagger: 0.1,
      ease: 'power2.out',
      duration: 1
    }, 0.15);

    if (globeGlow) {
      tl.to(globeGlow, {
        boxShadow: '0 0 100px rgba(34, 211, 238, 0.45)',
        background: 'radial-gradient(circle, rgba(34, 211, 238, 0.35) 0%, rgba(14, 165, 183, 0.1) 60%, transparent 75%)',
        duration: 1.5,
        ease: 'none'
      }, 0.2);
    }

    const allCards = document.querySelectorAll('.gp-card');
    allCards.forEach(function (card, idx) {
      tl.to(card, {
        className: 'gp-card is-active',
        duration: 0.2
      }, 0.3 + (idx * 0.07));
    });
  }

  function setupOurApproachTimeline() {
    const oaSection = document.getElementById('our-approach');
    const stepCards = document.querySelectorAll('.oa-step-card');

    if (!oaSection || stepCards.length === 0) return;

    buildStairPath();

    stepCards.forEach(function (card) {
      card.classList.remove('is-active', 'completed');
      card.classList.add('future');
    });

    ScrollTrigger.create({
      trigger: oaSection,
      start: 'top top',
      end: '+=250%',
      pin: true,
      pinSpacing: true,
      scrub: 0.5,
      refreshPriority: 1,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onRefresh: function () {
        buildStairPath();
      },
      onUpdate: function (self) {
        const p = self.progress;
        setStairProgress(p);
        updateActiveStep(p);
      }
    });
  }

  /* -----------------------------------------------------------------
     5. MOBILE FALLBACK WITH ANIMATED VERTICAL TIMELINE LINE
  ----------------------------------------------------------------- */
  function setupMobileFallback() {
    const video = document.getElementById('gp-earth-video');
    if (video) {
      video.autoplay = true;
      video.loop = true;
      video.play().catch(function () { });
    }

    const oaSection = document.getElementById('our-approach');
    if (oaSection) {
      buildStairPath();

      ScrollTrigger.create({
        trigger: oaSection,
        start: 'top 75%',
        end: 'bottom 85%',
        scrub: 0.2,
        onRefresh: function () {
          buildStairPath();
        },
        onUpdate: function (self) {
          setStairProgress(self.progress);
          updateActiveStep(self.progress);
        }
      });
    }

    const elementsToAnimate = document.querySelectorAll('.gp-card');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-active');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      elementsToAnimate.forEach(function (el) {
        observer.observe(el);
      });
    }
  }

})();