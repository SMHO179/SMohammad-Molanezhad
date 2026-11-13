(() => {
  'use strict';

  const root = document.documentElement;
  const masthead = document.querySelector('.masthead');
  const themeToggle = document.getElementById('themeToggle');
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  const navToggle = document.getElementById('navToggle');
  const navToggleLabel = document.getElementById('navToggleLabel');
  const navPanel = document.getElementById('navPanel');
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toastText');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ------------------------------------------------------------------------
     Theme
     ------------------------------------------------------------------------ */

  const syncThemeUI = () => {
    const isDark = root.dataset.theme !== 'light';
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', isDark ? '#11140F' : '#F7F3EA');
    }

    if (themeToggle) {
      themeToggle.setAttribute('aria-label', label);
      themeToggle.setAttribute('title', label);
    }
  };

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = root.dataset.theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = next;

      try {
        localStorage.setItem('theme', next);
      } catch {
        /* Storage can be unavailable; the theme still works for this session. */
      }

      syncThemeUI();
    });
  }

  syncThemeUI();

  /* ------------------------------------------------------------------------
     Mobile navigation
     ------------------------------------------------------------------------ */

  const desktopQuery = window.matchMedia('(min-width: 901px)');
  let previouslyFocused = null;

  const setMenu = (open, restoreFocus = false) => {
    if (!navToggle || !navPanel) return;

    navPanel.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');

    if (navToggleLabel) {
      navToggleLabel.textContent = open ? 'Close' : 'Menu';
    }

    document.body.classList.toggle('menu-open', open);

    if (open) {
      previouslyFocused = document.activeElement;
      const firstLink = navPanel.querySelector('a, button');
      if (firstLink) firstLink.focus({ preventScroll: true });
    } else if (restoreFocus && previouslyFocused instanceof HTMLElement) {
      previouslyFocused.focus({ preventScroll: true });
    }
  };

  if (navToggle && navPanel) {
    navToggle.addEventListener('click', () => {
      setMenu(!navPanel.classList.contains('is-open'));
    });

    navPanel.addEventListener('click', event => {
      if (event.target.closest('a')) setMenu(false);
    });

    document.addEventListener('click', event => {
      if (!navPanel.classList.contains('is-open')) return;
      if (!masthead || !masthead.contains(event.target)) setMenu(false);
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && navPanel.classList.contains('is-open')) {
        setMenu(false, true);
      }
    });

    const closeForDesktop = event => {
      if (event.matches) setMenu(false);
    };

    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener('change', closeForDesktop);
    } else {
      desktopQuery.addListener(closeForDesktop);
    }
  }

  /* ------------------------------------------------------------------------
     Scroll spy
     ------------------------------------------------------------------------ */

  const sectionIds = ['about', 'stack', 'projects', 'github', 'contact'];
  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const navLinks = document.querySelectorAll('.nav-link, .nav-panel__link');

  const updateActiveLink = () => {
    if (!sections.length) return;

    const mastheadHeight = masthead ? masthead.getBoundingClientRect().height : 76;
    const threshold = mastheadHeight + 72;
    let current = '';

    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= threshold) {
        current = section.id;
      }
    });

    const atBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

    if (atBottom) current = 'contact';

    navLinks.forEach(link => {
      if (current && link.getAttribute('href') === `#${current}`) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  let scrollTicking = false;

  const onScroll = () => {
    if (scrollTicking) return;
    scrollTicking = true;

    window.requestAnimationFrame(() => {
      updateActiveLink();
      scrollTicking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  updateActiveLink();

  /* ------------------------------------------------------------------------
     Reveal on scroll
     ------------------------------------------------------------------------ */

  const revealItems = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window) || reduceMotion.matches) {
    revealItems.forEach(item => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries, instance) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            instance.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -6% 0px'
      }
    );

    revealItems.forEach(item => observer.observe(item));
  }

  /* ------------------------------------------------------------------------
     Toast + copy email
     ------------------------------------------------------------------------ */

  let toastTimer;

  const showToast = message => {
    if (!toast || !toastText) return;

    toastText.textContent = message;
    toast.classList.add('show');

    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  };

  const copyText = async text => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        /* Fall through to the legacy copy path. */
      }
    }

    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.inset = '0 auto auto -9999px';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();

    let copied = false;

    try {
      copied = document.execCommand('copy');
    } catch {
      copied = false;
    }

    document.body.removeChild(field);
    return copied;
  };

  document.querySelectorAll('[data-copy]').forEach(button => {
    const label = button.querySelector('.copy-btn__label');
    const defaultLabel = label ? label.textContent : '';
    let resetTimer;

    button.addEventListener('click', async () => {
      const text = button.dataset.copy;
      if (!text) return;

      const copied = await copyText(text);

      if (!copied) {
        showToast('Could not copy email');
        return;
      }

      button.classList.add('copied');
      button.setAttribute('aria-label', 'Email address copied');

      if (label) label.textContent = 'Copied';
      showToast('Email copied to clipboard');

      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        button.classList.remove('copied');
        button.setAttribute('aria-label', 'Copy email address');
        if (label) label.textContent = defaultLabel;
      }, 1800);
    });
  });

  /* ------------------------------------------------------------------------
     Dates and footer year
     ------------------------------------------------------------------------ */

  const shamsiDate = document.getElementById('shamsiDate');

  if (shamsiDate) {
    try {
      shamsiDate.textContent = new Intl.DateTimeFormat('fa-IR', {
        calendar: 'persian',
        dateStyle: 'long'
      }).format(new Date());
    } catch {
      shamsiDate.textContent = new Date().toLocaleDateString('fa-IR');
    }
  }

  const year = document.getElementById('year');

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
})();
