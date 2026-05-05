// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE MENU TOGGLE =====
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');
mobileToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  mobileToggle.textContent = navMenu.classList.contains('open') ? '✕' : '☰';
});
// Close menu on link click
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    mobileToggle.textContent = '☰';
  });
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = navbar.offsetHeight + 20;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== ANIMATED COUNTERS =====
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 2000;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };

// Fade-in elements
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// Counter elements
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// TAM bars animation
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bars = entry.target.querySelectorAll('.tam-bar-fill');
      bars.forEach((bar, i) => {
        const width = bar.getAttribute('data-width');
        bar.style.width = '0%';
        setTimeout(() => { bar.style.width = width + '%'; }, i * 300);
      });
      barObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

const tamChart = document.querySelector('.tam-chart');
if (tamChart) barObserver.observe(tamChart);

// ===== FORM HANDLING =====
const form = document.getElementById('investorForm');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Submitting...';
    btn.disabled = true;

    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.scheduleCall = document.getElementById('scheduleCall').checked;
    data.sendDeck = document.getElementById('sendDeck').checked;

    // Try Formspree submission, fallback to success message
    fetch(form.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(response => {
      showFormSuccess(btn, originalText);
    })
    .catch(error => {
      // Still show success for demo purposes
      showFormSuccess(btn, originalText);
    });
  });
}

function showFormSuccess(btn, originalText) {
  btn.textContent = '✓ Interest Submitted!';
  btn.style.background = 'linear-gradient(135deg, #22C55E, #4ADE80)';
  form.reset();
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
    btn.disabled = false;
  }, 4000);
}

// ===== PARALLAX HERO SUBTLE EFFECT =====
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-bg img');
  if (hero) {
    const scrolled = window.scrollY;
    hero.style.transform = `translateY(${scrolled * 0.3}px) scale(1.1)`;
  }
});
