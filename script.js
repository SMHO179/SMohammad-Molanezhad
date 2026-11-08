const root = document.documentElement;
const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const themeToggle = document.getElementById("themeToggle");
const backTop = document.getElementById("backTop");
const toast = document.getElementById("toast");
const toastText = document.getElementById("toastText");
const scrollProgress = document.getElementById("scrollProgress");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

// Theme
const syncThemeUI = () => {
  const isDark = root.classList.contains("dark");

  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", isDark ? "#002b36" : "#fdf6e3");
  }

  if (themeToggle) {
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    themeToggle.setAttribute("aria-pressed", String(isDark));
  }
};

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = root.classList.toggle("dark");

    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      // Storage can be unavailable (private mode); theme still works for this session.
    }

    syncThemeUI();
  });
}

syncThemeUI();

// Mobile navigation
const closeMenu = () => {
  navMenu.classList.remove("open");
  navToggle.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
};

navToggle.addEventListener("click", () => {
  const open = navMenu.classList.toggle("open");
  navToggle.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", open);
});

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("click", event => {
  if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
    closeMenu();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

// Navbar + back to top + scroll progress + active link
const spySections = ["about", "stack", "projects", "github", "contact"]
  .map(id => document.getElementById(id));
const navLinks = document.querySelectorAll(".nav-link");

const onScroll = () => {
  const y = window.scrollY;

  navbar.classList.toggle("scrolled", y > 20);
  backTop.classList.toggle("visible", y > 500);

  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  scrollProgress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";

  const pos = y + 140;
  let current = "";
  spySections.forEach(section => {
    if (section.offsetTop <= pos) current = section.id;
  });

  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + current);
  });
};

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

backTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Reveal animations
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: .1,
    rootMargin: "0px 0px -6% 0px"
  });

  revealItems.forEach(element => {
    observer.observe(element);
  });
} else {
  revealItems.forEach(element => {
    element.classList.add("visible");
  });
}

// Pointer spotlight on project cards (fine pointers only)
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (finePointer.matches && !reducedMotion.matches) {
  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("pointermove", event => {
      const rect = card.getBoundingClientRect();

      card.style.setProperty("--mx", (event.clientX - rect.left) + "px");
      card.style.setProperty("--my", (event.clientY - rect.top) + "px");
    });
  });
}

// Copy email
const showToast = message => {
  toastText.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
};

// Shamsi date
const shamsiDateElement = document.getElementById("shamsiDate");
if (shamsiDateElement) {
  const date = new Intl.DateTimeFormat('fa-IR', { calendar: 'persian', dateStyle: 'long' }).format(new Date());
  shamsiDateElement.textContent = date;
}

document.querySelectorAll("[data-copy]").forEach(button => {
  button.addEventListener("click", async event => {
    event.preventDefault();
    event.stopPropagation();

    const text = button.dataset.copy;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const input = document.createElement("textarea");
      input.value = text;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }

    button.classList.add("copied");
    showToast("Email copied to clipboard");

    setTimeout(() => {
      button.classList.remove("copied");
    }, 1800);
  });
});
