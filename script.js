/* ================================================================
   IRONEDGE GYM — MAIN JAVASCRIPT
   ================================================================
   All interactive features:
   - Navbar scroll behavior & mobile menu
   - Smooth scrolling
   - Gallery lightbox
   - BMI Calculator
   - Testimonial slider dots
   - Contact form handling (Formspree)
   - Scroll reveal animations
   - Back to top button
   - Footer year
   ================================================================ */

'use strict';

/* ================================================================
   UTILITY: Wait for DOM to be ready
================================================================ */
document.addEventListener('DOMContentLoaded', function () {

  /* ==============================================================
     1. FOOTER — AUTO YEAR
     Update the copyright year automatically
  ============================================================== */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ==============================================================
     2. NAVBAR — SCROLL BEHAVIOUR
     Adds .scrolled class when page scrolls past 60px
  ============================================================== */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Run once on load


  /* ==============================================================
     3. NAVBAR — MOBILE MENU TOGGLE
  ============================================================== */
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');

  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
    // Prevent body scroll when menu is open
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu when a nav link is clicked
  document.querySelectorAll('.nav-link, .nav-cta').forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('active');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (e) {
    if (navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });


  /* ==============================================================
     4. ACTIVE NAV LINK — Highlight current section on scroll
  ============================================================== */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    let current = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active-link');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active-link');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });


  /* ==============================================================
     5. BACK TO TOP BUTTON
  ============================================================== */
  const backTop = document.getElementById('backTop');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      backTop.classList.add('visible');
    } else {
      backTop.classList.remove('visible');
    }
  }, { passive: true });

  backTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ==============================================================
     6. GALLERY LIGHTBOX
  ============================================================== */
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  // Open lightbox on gallery item click
  document.querySelectorAll('.gallery-item').forEach(function (item) {
    item.addEventListener('click', function () {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src  = img.src;
        lightboxImg.alt  = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close on button click
  lightboxClose.addEventListener('click', closeLightbox);

  // Close on background click
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(function () { lightboxImg.src = ''; }, 300);
  }


  /* ==============================================================
     7. TESTIMONIALS SLIDER DOTS
     (Reviews are displayed in a grid; dots indicate count)
  ============================================================== */
  const reviewCards = document.querySelectorAll('.review-card');
  const dotsWrap    = document.getElementById('sliderDots');

  reviewCards.forEach(function (_, i) {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Review ' + (i + 1));
    dotsWrap.appendChild(dot);
  });


  /* ==============================================================
     8. SCROLL REVEAL ANIMATION
     Elements with class .reveal animate in when they enter view
  ============================================================== */
  // Add .reveal class to all key elements
  const revealTargets = document.querySelectorAll(
    '.about-grid, .plan-card, .trainer-card, .gallery-item, .review-card, .contact-item, .bmi-wrap, .contact-form-wrap, .stat'
  );

  revealTargets.forEach(function (el) {
    el.classList.add('reveal');
  });

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        // Stagger the reveal with a small delay based on position
        setTimeout(function () {
          entry.target.classList.add('revealed');
        }, (entry.target.dataset.delay || 0));
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach(function (el, i) {
    // Assign stagger delay to sibling elements
    el.dataset.delay = (i % 4) * 80;
    revealObserver.observe(el);
  });


  /* ==============================================================
     9. COUNTER ANIMATION — About section stats
  ============================================================== */
  function animateCounter(el, target, suffix) {
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(target / (duration / 16));

    const timer = setInterval(function () {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = start.toLocaleString() + suffix;
    }, 16);
  }

  const statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const nums = entry.target.querySelectorAll('.stat-num');
        nums.forEach(function (num) {
          const text   = num.textContent.trim();
          const hasPlus = text.includes('+');
          const hasPct  = text.includes('%');
          const isSlash = text.includes('/');

          if (!isSlash) {
            const raw = parseInt(text.replace(/[^0-9]/g, ''), 10);
            const suffix = hasPlus ? '+' : (hasPct ? '%' : '');
            if (!isNaN(raw)) animateCounter(num, raw, suffix);
          }
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const aboutStats = document.querySelector('.about-stats');
  if (aboutStats) statsObserver.observe(aboutStats);

}); // end DOMContentLoaded


/* ================================================================
   10. BMI CALCULATOR
   Called from HTML onclick attributes
================================================================ */

// Track current unit system
let bmiUnit = 'metric'; // 'metric' or 'imperial'

/**
 * switchUnit(unit)
 * Switches between metric (cm/kg) and imperial (ft/lbs)
 *
 * ===================== HOW TO CHANGE UNITS HERE =====================
 * Modify the placeholder text and unit labels as needed below
 * ===================================================================
 */
function switchUnit(unit) {
  bmiUnit = unit;

  const metricBtn   = document.getElementById('metricBtn');
  const imperialBtn = document.getElementById('imperialBtn');
  const heightInput = document.getElementById('height');
  const weightInput = document.getElementById('weight');
  const heightUnit  = document.getElementById('heightUnit');
  const weightUnit  = document.getElementById('weightUnit');

  if (unit === 'metric') {
    metricBtn.classList.add('active');
    imperialBtn.classList.remove('active');
    heightInput.placeholder = '175';
    weightInput.placeholder = '75';
    heightUnit.textContent  = 'cm';
    weightUnit.textContent  = 'kg';
  } else {
    imperialBtn.classList.add('active');
    metricBtn.classList.remove('active');
    heightInput.placeholder = '5.9';
    weightInput.placeholder = '165';
    heightUnit.textContent  = 'ft';
    weightUnit.textContent  = 'lbs';
  }

  // Clear previous result
  resetBMIResult();
}

/**
 * calculateBMI()
 * Main BMI calculation logic
 */
function calculateBMI() {
  const heightInput = document.getElementById('height');
  const weightInput = document.getElementById('weight');
  const height      = parseFloat(heightInput.value);
  const weight      = parseFloat(weightInput.value);

  // --- Validation ---
  if (!height || !weight || height <= 0 || weight <= 0) {
    showBMIError('Please enter valid height and weight values.');
    return;
  }

  let bmi;

  if (bmiUnit === 'metric') {
    // Metric: height in cm, weight in kg
    if (height < 50 || height > 300) {
      showBMIError('Please enter a height between 50 and 300 cm.');
      return;
    }
    if (weight < 10 || weight > 500) {
      showBMIError('Please enter a weight between 10 and 500 kg.');
      return;
    }
    const heightM = height / 100; // convert cm to metres
    bmi = weight / (heightM * heightM);
  } else {
    // Imperial: height in feet, weight in lbs
    if (height < 1 || height > 10) {
      showBMIError('Please enter height between 1 and 10 feet.');
      return;
    }
    if (weight < 22 || weight > 1100) {
      showBMIError('Please enter a weight between 22 and 1100 lbs.');
      return;
    }
    // Formula: BMI = (weight_lbs / height_in²) × 703
    const heightIn = height * 12; // feet to inches
    bmi = (weight / (heightIn * heightIn)) * 703;
  }

  displayBMIResult(bmi);
}

/**
 * displayBMIResult(bmi)
 * Updates the result panel with the calculated BMI
 */
function displayBMIResult(bmi) {
  const bmiScore    = document.getElementById('bmiScore');
  const bmiCategory = document.getElementById('bmiCategory');
  const bmiAdvice   = document.getElementById('bmiAdvice');
  const bmiPointer  = document.getElementById('bmiPointer');
  const bmiResult   = document.getElementById('bmiResult');

  const rounded = Math.round(bmi * 10) / 10;

  // --- Category thresholds (WHO standard) ---
  let category, advice, color, pointerPct;

  if (bmi < 18.5) {
    category   = 'Underweight';
    advice     = 'Your BMI is below the healthy range. A structured nutrition plan and strength training program can help you reach a healthier weight. Our trainers can guide you with a personalised plan.';
    color      = '#4fc3f7';
    pointerPct = Math.max(2, Math.min(22, (bmi / 18.5) * 22));
  } else if (bmi < 25) {
    category   = 'Healthy Weight';
    advice     = 'Great news! Your BMI is within the healthy range. Keep it up with a balanced routine of strength training and cardio. Focus on building muscle and maintaining your current lifestyle.';
    color      = '#66bb6a';
    pointerPct = 22 + ((bmi - 18.5) / 6.5) * 28;
  } else if (bmi < 30) {
    category   = 'Overweight';
    advice     = 'Your BMI indicates you are slightly above the healthy range. A consistent workout schedule combining cardio and resistance training, paired with a clean diet, can bring you back to the healthy zone.';
    color      = '#ffa726';
    pointerPct = 50 + ((bmi - 25) / 5) * 25;
  } else {
    category   = 'Obese';
    advice     = 'Your BMI is in the obese range. The good news is that even modest changes to activity and nutrition can make a significant difference. Our trainers are here to build a safe, effective programme just for you.';
    color      = '#ef5350';
    pointerPct = Math.min(98, 75 + ((bmi - 30) / 10) * 23);
  }

  // Update UI
  bmiScore.textContent    = rounded;
  bmiScore.style.color    = color;
  bmiCategory.textContent = category;
  bmiAdvice.textContent   = advice;
  bmiPointer.style.left   = pointerPct + '%';

  // Highlight result card border
  bmiResult.style.borderColor = color;

  // Animate score counting up
  animateBMINumber(bmiScore, rounded, color);
}

/**
 * animateBMINumber(el, target, color)
 * Counts up to the BMI value for a nice effect
 */
function animateBMINumber(el, target, color) {
  let start = 0;
  const duration = 800;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out
    const eased = 1 - Math.pow(1 - progress, 3);
    const value  = Math.round(eased * target * 10) / 10;
    el.textContent = value.toFixed(1);
    el.style.color = color;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/**
 * resetBMIResult()
 * Resets the result panel to default state
 */
function resetBMIResult() {
  document.getElementById('bmiScore').textContent    = '--';
  document.getElementById('bmiScore').style.color    = 'var(--red)';
  document.getElementById('bmiCategory').textContent = 'Enter your details';
  document.getElementById('bmiAdvice').textContent   = 'Your BMI will appear here once you fill in your measurements.';
  document.getElementById('bmiPointer').style.left   = '0%';
  document.getElementById('bmiResult').style.borderColor = '';
  document.getElementById('height').value = '';
  document.getElementById('weight').value = '';
}

/**
 * showBMIError(msg)
 * Displays a validation error in the BMI category field
 */
function showBMIError(msg) {
  const bmiCategory = document.getElementById('bmiCategory');
  bmiCategory.textContent = '⚠ ' + msg;
  bmiCategory.style.color = 'var(--red)';
  document.getElementById('bmiScore').textContent = '--';
}


/* ================================================================
   11. CONTACT FORM HANDLING — Formspree (No Backend)
   ================================================================
   HOW TO SET UP (One-time setup required):
   1. Go to https://formspree.io and sign up for a free account
   2. Click "New Form" and enter your email: mdalam332002@gmail.com
   3. Copy the form ID (e.g. xyzabcde)
   4. In index.html, replace YOUR_FORMSPREE_ID in the form action URL
      Example: action="https://formspree.io/f/xyzabcde"
   5. That's it — messages will be sent to your email automatically!
   ================================================================ */

async function handleFormSubmit(event) {
  event.preventDefault();

  const form      = document.getElementById('contactForm');
  const statusEl  = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');
  const btnText   = document.getElementById('btnText');

  // --- Loading state ---
  submitBtn.disabled  = true;
  btnText.textContent = 'Sending…';
  statusEl.className  = 'form-status';
  statusEl.textContent = '';

  try {
    const formData = new FormData(form);

    // Check if the Formspree ID has been set up
    const action = form.getAttribute('action');
    if (action.includes('YOUR_FORMSPREE_ID')) {
      // Demo mode — show a success message without actually sending
      await fakeDelay(1200);
      showFormSuccess(form, statusEl, submitBtn, btnText);
      statusEl.textContent = '✓ Message sent! (Demo mode — please set up Formspree to receive real emails)';
      return;
    }

    const response = await fetch(action, {
      method:  'POST',
      body:    formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      showFormSuccess(form, statusEl, submitBtn, btnText);
    } else {
      const data = await response.json();
      const errorMsg = data.errors
        ? data.errors.map(function (e) { return e.message; }).join(', ')
        : 'Something went wrong. Please try again.';
      showFormError(statusEl, submitBtn, btnText, errorMsg);
    }
  } catch (err) {
    showFormError(statusEl, submitBtn, btnText, 'Network error. Please check your connection and try again.');
  }
}

function showFormSuccess(form, statusEl, submitBtn, btnText) {
  form.reset();
  statusEl.className  = 'form-status success';
  statusEl.textContent = '✓ Your message has been sent! We\'ll get back to you within 24 hours.';
  submitBtn.disabled  = false;
  btnText.textContent = 'Send Message';
}

function showFormError(statusEl, submitBtn, btnText, msg) {
  statusEl.className  = 'form-status error';
  statusEl.textContent = '✗ ' + msg;
  submitBtn.disabled  = false;
  btnText.textContent = 'Send Message';
}

function fakeDelay(ms) {
  return new Promise(function (resolve) { setTimeout(resolve, ms); });
}


/* ================================================================
   12. SMOOTH SCROLL — for browsers that don't support scroll-behavior
================================================================ */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navbarH = document.getElementById('navbar').offsetHeight;
      const top     = target.getBoundingClientRect().top + window.scrollY - navbarH - 10;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  });
});


/* ================================================================
   13. ACTIVE NAV LINK STYLE — injected CSS
================================================================ */
(function injectActiveStyle() {
  const style = document.createElement('style');
  style.textContent = '.nav-link.active-link { color: #e81c24 !important; }';
  document.head.appendChild(style);
})();
