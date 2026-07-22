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
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ========================================
  // Stagger Delays for Grid Items
  // ========================================
  function assignStaggerDelays() {
    var grids = document.querySelectorAll('.tech-grid, .projects-grid, .learning-grid, .focus-grid, .about-stats, .contact-methods');
    grids.forEach(function (grid) {
      var children = grid.querySelectorAll('.fade-in');
      children.forEach(function (child, index) {
        child.setAttribute('data-delay', Math.min(index + 1, 7));
      });
    });
  }

  assignStaggerDelays();

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
  // Navbar Scroll Effect
  // ========================================
  function updateNavbarScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // ========================================
  // Scroll Animations (Intersection Observer)
  // ========================================
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
        updateNavbarScroll();
        updateActiveNav();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  updateNavbarScroll();
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

  // ========================================
  // Button Ripple Effect Coordinates
  // ========================================
  if (!prefersReducedMotion) {
    document.querySelectorAll('.btn').forEach(function (btn) {
      btn.addEventListener('mouseenter', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width) * 100;
        var y = ((e.clientY - rect.top) / rect.height) * 100;
        btn.style.setProperty('--ripple-x', x + '%');
        btn.style.setProperty('--ripple-y', y + '%');
      });
    });
  }
})();
