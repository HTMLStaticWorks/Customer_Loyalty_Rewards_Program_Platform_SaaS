/**
 * LOYALLOOP — Customer Loyalty & Rewards Platform SaaS
 * Core JavaScript & Interactive Components
 */

(function () {
  'use strict';

  // 1. Theme Management (Light / Dark)
  const THEME_STORAGE_KEY = 'loyalloop-theme-preference';

  function getSavedTheme() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      btn.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    });
  }

  // Initial Theme Load
  applyTheme(getSavedTheme());

  // Listen for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // 2. RTL Layout Management
  const RTL_STORAGE_KEY = 'loyalloop-rtl-preference';

  function getSavedRTL() {
    return localStorage.getItem(RTL_STORAGE_KEY) === 'true';
  }

  function applyRTL(isRTL) {
    if (isRTL) {
      document.documentElement.setAttribute('dir', 'rtl');
      localStorage.setItem(RTL_STORAGE_KEY, 'true');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      localStorage.setItem(RTL_STORAGE_KEY, 'false');
    }

    const rtlBtns = document.querySelectorAll('.rtl-toggle-btn');
    rtlBtns.forEach(btn => {
      btn.textContent = isRTL ? 'LTR' : 'RTL';
      btn.setAttribute('aria-label', isRTL ? 'Switch to LTR layout' : 'Switch to RTL layout');
      btn.setAttribute('title', isRTL ? 'Switch to LTR layout' : 'Switch to RTL layout');
    });
  }

  // Initial RTL Load
  applyRTL(getSavedRTL());

  document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle click handlers
    const themeToggles = document.querySelectorAll('.theme-toggle-btn');
    themeToggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
      });
    });

    // RTL Toggle click handlers
    const rtlToggles = document.querySelectorAll('.rtl-toggle-btn');
    rtlToggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const currentRTL = document.documentElement.getAttribute('dir') === 'rtl';
        applyRTL(!currentRTL);
      });
    });

    // 3. Sticky Header & Scroll States
    const header = document.querySelector('.site-header');
    const backToTopBtn = document.querySelector('.back-to-top-btn');

    function handleScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      if (header) {
        if (scrollY > 30) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      if (backToTopBtn) {
        if (scrollY > 400) {
          backToTopBtn.classList.add('show');
        } else {
          backToTopBtn.classList.remove('show');
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // 4. Mobile Navigation & Keyboard Accessibility (ESC closes menu)
    const navCollapse = document.getElementById('mainNavCollapse');

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (navCollapse && navCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
          if (bsCollapse) bsCollapse.hide();
        }
        document.querySelectorAll('.dropdown-menu.show').forEach(el => {
          el.classList.remove('show');
        });
      }
    });

    // Auto-close mobile nav on link click
    if (navCollapse) {
      const navLinks = navCollapse.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (window.innerWidth < 1200 && navCollapse.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
            if (bsCollapse) bsCollapse.hide();
          }
        });
      });
    }

    // 5. Pricing Switcher (Monthly / Annual)
    const pricingSwitcher = document.querySelector('.pricing-switcher-wrap');
    if (pricingSwitcher) {
      const monthlyBtn = pricingSwitcher.querySelector('[data-plan="monthly"]');
      const annualBtn = pricingSwitcher.querySelector('[data-plan="annual"]');
      const priceStarter = document.getElementById('priceStarter');
      const priceGrowth = document.getElementById('priceGrowth');
      const priceScale = document.getElementById('priceScale');
      const billingCycleLabels = document.querySelectorAll('.billing-cycle-label');

      function updatePricing(type) {
        if (type === 'annual') {
          if (annualBtn) annualBtn.classList.add('active');
          if (monthlyBtn) monthlyBtn.classList.remove('active');
          if (priceStarter) priceStarter.textContent = '$39';
          if (priceGrowth) priceGrowth.textContent = '$79';
          if (priceScale) priceScale.textContent = '$159';
          billingCycleLabels.forEach(l => l.textContent = '/month, billed annually');
        } else {
          if (monthlyBtn) monthlyBtn.classList.add('active');
          if (annualBtn) annualBtn.classList.remove('active');
          if (priceStarter) priceStarter.textContent = '$49';
          if (priceGrowth) priceGrowth.textContent = '$99';
          if (priceScale) priceScale.textContent = '$199';
          billingCycleLabels.forEach(l => l.textContent = '/month');
        }
      }

      if (monthlyBtn) monthlyBtn.addEventListener('click', () => updatePricing('monthly'));
      if (annualBtn) annualBtn.addEventListener('click', () => updatePricing('annual'));
    }

    // 6. Interactive ROI / Points Calculator
    const calcSpend = document.getElementById('calcSpend');
    const calcTrans = document.getElementById('calcTrans');
    const calcSpendVal = document.getElementById('calcSpendVal');
    const calcTransVal = document.getElementById('calcTransVal');
    const calcIncRev = document.getElementById('calcIncRev');
    const calcPointsGen = document.getElementById('calcPointsGen');

    function calculateROI() {
      if (!calcSpend || !calcTrans) return;
      const spend = parseFloat(calcSpend.value) || 45;
      const trans = parseFloat(calcTrans.value) || 1200;

      if (calcSpendVal) calcSpendVal.textContent = `$${spend}`;
      if (calcTransVal) calcTransVal.textContent = trans.toLocaleString();

      const monthlyRevenue = spend * trans;
      const incrementalGain = Math.round(monthlyRevenue * 0.24);
      const pointsGenerated = Math.round(monthlyRevenue * 10);

      if (calcIncRev) calcIncRev.textContent = `+$${incrementalGain.toLocaleString()}`;
      if (calcPointsGen) calcPointsGen.textContent = `${pointsGenerated.toLocaleString()} pts`;
    }

    if (calcSpend && calcTrans) {
      calcSpend.addEventListener('input', calculateROI);
      calcTrans.addEventListener('input', calculateROI);
      calculateROI();
    }

    // 7. Category Filter Buttons
    const filterBtnGroups = document.querySelectorAll('.filter-btn-group');
    filterBtnGroups.forEach(group => {
      const buttons = group.querySelectorAll('.filter-btn');
      const targetGrid = document.querySelector(group.getAttribute('data-target-grid') || '.filterable-grid');

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const category = btn.getAttribute('data-filter');
          if (!targetGrid) return;

          const items = targetGrid.querySelectorAll('.filter-item');
          items.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
              item.style.display = '';
            } else {
              item.style.display = 'none';
            }
          });
        });
      });
    });

    // 8. Password Visibility Toggles
    const passToggleBtns = document.querySelectorAll('.password-toggle-btn');
    passToggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('input');
        if (!input) return;
        if (input.type === 'password') {
          input.type = 'text';
          btn.innerHTML = '<i class="bi bi-eye-slash"></i>';
        } else {
          input.type = 'password';
          btn.innerHTML = '<i class="bi bi-eye"></i>';
        }
      });
    });

    // 9. Password Strength Meter
    const passInput = document.getElementById('signupPassword');
    const strengthBar = document.getElementById('passwordStrengthBar');
    const strengthText = document.getElementById('passwordStrengthText');

    if (passInput && strengthBar) {
      passInput.addEventListener('input', () => {
        const val = passInput.value;
        let score = 0;
        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;

        if (val.length === 0) {
          strengthBar.style.width = '0%';
          strengthBar.className = 'progress-bar';
          if (strengthText) strengthText.textContent = 'Password strength';
        } else if (score <= 1) {
          strengthBar.style.width = '25%';
          strengthBar.className = 'progress-bar bg-danger';
          if (strengthText) strengthText.textContent = 'Weak';
        } else if (score === 2) {
          strengthBar.style.width = '50%';
          strengthBar.className = 'progress-bar bg-warning';
          if (strengthText) strengthText.textContent = 'Medium';
        } else if (score === 3) {
          strengthBar.style.width = '75%';
          strengthBar.className = 'progress-bar bg-info';
          if (strengthText) strengthText.textContent = 'Good';
        } else {
          strengthBar.style.width = '100%';
          strengthBar.className = 'progress-bar bg-success';
          if (strengthText) strengthText.textContent = 'Strong';
        }
      });
    }

    // 10. Forms Validation Demo
    const demoForms = document.querySelectorAll('form[data-demo-form]');
    demoForms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!form.checkValidity()) {
          e.stopPropagation();
          form.classList.add('was-validated');
          return;
        }

        const alertBox = form.parentElement.querySelector('.form-alert-state') || form.querySelector('.form-alert-state');
        if (alertBox) {
          alertBox.style.display = 'flex';
          alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          const originalText = submitBtn.innerHTML;
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span> Processing...';
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-check2-circle me-1"></i> Success!';
            setTimeout(() => {
              submitBtn.innerHTML = originalText;
            }, 3000);
          }, 600);
        }
      });
    });

    // 11. Coming Soon Countdown Timer
    const countdownWrap = document.getElementById('comingSoonCountdown');
    if (countdownWrap) {
      const launchDate = new Date();
      launchDate.setDate(launchDate.getDate() + 45);

      function updateCountdown() {
        const now = new Date().getTime();
        const diff = launchDate - now;

        if (diff <= 0) {
          countdownWrap.innerHTML = '<p class="lead text-accent">We are LIVE!</p>';
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const dEl = document.getElementById('countDays');
        const hEl = document.getElementById('countHours');
        const mEl = document.getElementById('countMinutes');
        const sEl = document.getElementById('countSeconds');

        if (dEl) dEl.textContent = String(days).padStart(2, '0');
        if (hEl) hEl.textContent = String(hours).padStart(2, '0');
        if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
        if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
      }

      updateCountdown();
      setInterval(updateCountdown, 1000);
    }

    // 12. GSAP Micro-Animations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
      }

      gsap.from('.hero-content-anim > *', {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out'
      });

      gsap.from('.hero-visual-anim', {
        opacity: 0,
        scale: 0.94,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out'
      });
    }
  });
})();
