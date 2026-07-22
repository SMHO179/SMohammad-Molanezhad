/* ========================================
   Portfolio JavaScript
   Mobile Nav, Scroll Animations, Active Nav, Theme Toggle
   ======================================== */

(function () {
  'use strict';

  // ========================================
  // DOM Elements
  // ========================================
  var navbar = document.getElementById('navbar');
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');
  var navLinks = document.querySelectorAll('.nav-link');
  var fadeElements = document.querySelectorAll('.fade-in');
  var sections = document.querySelectorAll('.section, .hero');
  var themeOptions = document.querySelectorAll('.theme-option');

  // ========================================
  // Mobile Navigation
  // ========================================
  function toggleMobileNav() {
    var isActive = navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
  }

  function closeMobileNav() {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', toggleMobileNav);

  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileNav);
  });

  document.addEventListener('click', function (e) {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      closeMobileNav();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMobileNav();
      navToggle.focus();
    }
  });

  // Close mobile menu on resize to desktop
  var mql = window.matchMedia('(min-width: 768px)');
  mql.addEventListener('change', function (e) {
    if (e.matches) {
      closeMobileNav();
    }
  });

  // ========================================
  // Scroll Animations (Intersection Observer)
  // ========================================
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    var fadeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    fadeElements.forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else {
    // If reduced motion preferred, show everything immediately
    fadeElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ========================================
  // Active Navigation Highlight
  // ========================================
  function updateActiveNav() {
    var scrollPos = window.scrollY + 120;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Throttle scroll handler with rAF
  var scrollTicking = false;
  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      window.requestAnimationFrame(function () {
        updateActiveNav();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  updateActiveNav();

  // ========================================
  // Theme Toggle
  // ========================================
  var STORAGE_KEY = 'portfolio-theme';

  function getSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      // localStorage unavailable
    }
  }

  function applyTheme(theme) {
    if (theme === 'night') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }

    themeOptions.forEach(function (btn) {
      var isActive = btn.dataset.theme === theme;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-checked', isActive);
    });
  }

  var savedTheme = getSavedTheme() || 'night';
  applyTheme(savedTheme);

  themeOptions.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var theme = this.dataset.theme;
      applyTheme(theme);
      saveTheme(theme);
    });
  });
})();
