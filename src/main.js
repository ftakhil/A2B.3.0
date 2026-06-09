import './style.css';

/* ==============================================
   A2B — Main JavaScript
   Hero word animation, mobile menu, scroll effects
   ============================================== */

/**
 * Animated word cycling in the hero heading.
 * Cycles through: Businesses → Operations → Teams → Workflows → Enterprises
 * with a smooth fade-up / fade-out transition.
 */
function initWordAnimation() {
  const words = document.querySelectorAll('.hero-word');
  if (!words.length) return;

  let current = 0;
  const total = words.length;
  const holdDuration = 2400;       // ms each word stays visible
  const transitionDuration = 550;  // ms for the CSS transition

  setInterval(() => {
    const prev = current;
    const next = (current + 1) % total;

    // Exit current word (slides up + fades out)
    words[prev].classList.remove('active');
    words[prev].classList.add('exit');

    // After the exit transition, bring in the next word
    setTimeout(() => {
      words[prev].classList.remove('exit');
      words[next].classList.add('active');
    }, transitionDuration);

    current = next;
  }, holdDuration + transitionDuration);
}

/**
 * Mobile hamburger menu toggle.
 */
function initMobileMenu() {
  const hamburger = document.getElementById('navHamburger');
  const navLinks = document.getElementById('navLinks');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    navLinks.classList.toggle('mobile-open');
    document.body.classList.toggle('no-scroll', isOpen);
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('mobile-open');
      document.body.classList.remove('no-scroll');
    });
  });
}

/**
 * Resources dropdown dynamic content — scoped to #resourcesDropdown.
 */
function initDropdowns() {
  const wrapper = document.getElementById('resourcesDropdown');
  if (!wrapper) return;

  const links = wrapper.querySelectorAll('.mega-link');
  const titleEl = wrapper.querySelector('.mega-title');
  const descEl = wrapper.querySelector('.mega-desc');

  if (!links.length || !titleEl || !descEl) return;

  const defaultTitle = titleEl.textContent;
  const defaultDesc = descEl.textContent;

  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const title = link.getAttribute('data-title');
      const desc = link.getAttribute('data-desc');
      if (title) titleEl.textContent = title;
      if (desc) descEl.textContent = desc;
    });
  });

  const megaMenuLeft = wrapper.querySelector('.mega-menu-left');
  if (megaMenuLeft) {
    megaMenuLeft.addEventListener('mouseleave', () => {
      titleEl.textContent = defaultTitle;
      descEl.textContent = defaultDesc;
    });
  }
}

/**
 * Services dropdown — category list with dynamic subcategory panel.
 */
function initServiceDropdown() {
  const wrapper = document.getElementById('servicesDropdown');
  if (!wrapper) return;

  const svcLinks = wrapper.querySelectorAll('.svc-link');
  const titleEl  = wrapper.querySelector('.svc-mega-title');
  const descEl   = wrapper.querySelector('.svc-mega-desc');
  const subList  = wrapper.querySelector('.svc-sub-list');

  if (!svcLinks.length || !titleEl) return;

  const defaultTitle = titleEl.textContent;
  const defaultDesc  = descEl ? descEl.textContent : '';

  svcLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      if (link.dataset.title) titleEl.textContent = link.dataset.title;
      if (descEl && link.dataset.desc) descEl.textContent = link.dataset.desc;
      if (subList && link.dataset.subs) {
        const items = link.dataset.subs.split(',');
        subList.innerHTML = items.map(s =>
          `<li class="svc-sub-item"><span class="svc-sub-dot"></span>${s.trim()}</li>`
        ).join('');
        subList.style.display = '';
      }
    });
  });

  const svcLeft = wrapper.querySelector('.svc-mega-left');
  if (svcLeft) {
    svcLeft.addEventListener('mouseleave', () => {
      titleEl.textContent = defaultTitle;
      if (descEl) descEl.textContent = defaultDesc;
      if (subList) subList.style.display = 'none';
    });
  }
}

/**
 * Navbar background on scroll and dynamic color adapting based on section background.
 */
function initNavScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let ticking = false;

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        // Scrolled styling
        if (window.scrollY > 60) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }

        // Dynamic light/dark mode adapting
        const lightSections = document.querySelectorAll('.how-we-work-section, .new-white-section');
        let isOverLightSection = false;
        const checkY = 40; // check color roughly halfway down the navbar

        lightSections.forEach(sec => {
          const rect = sec.getBoundingClientRect();
          if (rect.top <= checkY && rect.bottom >= checkY) {
            isOverLightSection = true;
          }
        });

        if (isOverLightSection) {
          navbar.classList.add('light-mode');
        } else {
          navbar.classList.remove('light-mode');
        }

        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  // Trigger once on load to set initial state
  onScroll();
}

/**
 * Smooth entrance — ensures animations play when page is ready.
 */
function initEntranceAnimations() {
  // Small delay to ensure fonts are loaded before animations start
  document.fonts.ready.then(() => {
    document.body.classList.add('fonts-loaded');
  });
}

/**
 * Dark theme tab switching — shows/hides content cards.
 */
function initDarkTabs() {
  const tabsContainer = document.getElementById('darkTabs');
  if (!tabsContainer) return;

  const tabs = tabsContainer.querySelectorAll('.dark-tab');
  const cards = document.querySelectorAll('.dark-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update active card
      cards.forEach(card => {
        card.classList.remove('active');
        if (card.dataset.card === target) {
          card.classList.add('active');
        }
      });
    });
  });
}

/**
 * Process Accordion — toggles the process cards in the white section.
 */
function initProcessAccordion() {
  const items = document.querySelectorAll('.process-item');
  if (!items.length) return;

  items.forEach(item => {
    const header = item.querySelector('.process-item-header');
    header.addEventListener('click', () => {
      const isExpanded = item.classList.contains('expanded');
      
      // Close all items
      items.forEach(i => i.classList.remove('expanded'));
      
      // Open the clicked one if it wasn't already open
      if (!isExpanded) {
        item.classList.add('expanded');
      }
    });
  });
}

/**
 * Case Study Filtering
 */
function initCaseStudyFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.cs-row-card');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Show/Hide cards based on filter
      cards.forEach(card => {
        if (filterValue === 'all') {
          card.classList.remove('hidden');
        } else {
          const industry = card.getAttribute('data-industry');
          if (industry === filterValue) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        }
      });
    });
  });
}

// ===== Initialize everything =====
document.addEventListener('DOMContentLoaded', () => {
  initWordAnimation();
  initMobileMenu();
  initDropdowns();
  initServiceDropdown();
  initNavScroll();
  initEntranceAnimations();
  initDarkTabs();
  initProcessAccordion();
  initCaseStudyFilters();
});
