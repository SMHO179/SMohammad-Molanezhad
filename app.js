/* ========================================
   Portfolio JavaScript
   Mobile Nav, Scroll Animations, Active Nav, Theme Toggle
   ======================================== */

(function () {
  'use strict';

  // DOM Elements
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const fadeElements = document.querySelectorAll('.fade-in');
  const sections = document.querySelectorAll('.section, .hero');
  const themeToggle = document.getElementById('themeToggle');
  const themeOptions = document.querySelectorAll('.theme-option');

  // ========================================
  // Mobile Navigation
  // ========================================
  navToggle.addEventListener('click', function () {
    this.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu on link click
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', function (e) {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });

  // ========================================
  // Scroll Animations (Intersection Observer)
  // ========================================
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
      rootMargin: '0px 0px -50px 0px',
    }
  );

  fadeElements.forEach(function (el) {
    fadeObserver.observe(el);
  });

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

  // Throttle scroll handler
  var scrollTimeout;
  window.addEventListener('scroll', function () {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(function () {
      updateActiveNav();
    });
  });

  // Initial call
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
      // ignore
    }
  }

  function applyTheme(theme) {
    if (theme === 'night') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    themeOptions.forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.theme === theme);
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
