/* ============================================================
   ClubRival sub-landing interactions:
   - Audience tab switcher (drives form sub-section + hidden role/subject)
   - FAQ accordion
   - TAM bar fill animation when in view
   - Deep-link from CTAs that carry data-tab="..."
   ============================================================ */
(function () {
  'use strict';

  // ─── Audience tabs ─────────────────────────────────────────
  const tabs = document.querySelectorAll('.cr-tab');
  const formSections = document.querySelectorAll('[data-form]');
  const roleField = document.getElementById('crRole');
  const subjectField = document.getElementById('crSubject');
  const subjects = {
    runners:   'ClubRival — Runner waitlist',
    brands:    'ClubRival — Brand partner application',
    investors: 'ClubRival — Investor brief request',
  };

  function setTab(name) {
    tabs.forEach((t) => t.classList.toggle('is-active', t.dataset.tab === name));
    formSections.forEach((s) => {
      const match = s.dataset.form === name;
      s.hidden = !match;
      // Inputs in hidden sections shouldn't validate / submit.
      s.querySelectorAll('input, select, textarea').forEach((el) => {
        if (match) el.removeAttribute('disabled');
        else el.setAttribute('disabled', 'disabled');
      });
    });
    if (roleField) roleField.value = name === 'runners' ? 'runner' : name === 'brands' ? 'brand' : 'investor';
    if (subjectField) subjectField.value = subjects[name] || subjects.runners;
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => setTab(tab.dataset.tab));
  });

  // CTA buttons can pre-select a tab, e.g. data-tab="brands"
  document.querySelectorAll('a[data-tab]').forEach((a) => {
    a.addEventListener('click', () => {
      const t = a.dataset.tab;
      if (t) setTab(t);
    });
  });

  // ─── FAQ accordion ─────────────────────────────────────────
  document.querySelectorAll('.cr-faq-item').forEach((item) => {
    const q = item.querySelector('.cr-faq-q');
    if (!q) return;
    q.addEventListener('click', () => item.classList.toggle('is-open'));
  });

  // ─── TAM bars: fill on enter ──────────────────────────────
  const bars = document.querySelectorAll('.cr-tam-bar-fill[data-pct]');
  if (bars.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target;
            const pct = Number(el.dataset.pct || 0);
            requestAnimationFrame(() => { el.style.width = pct + '%'; });
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.3 },
    );
    bars.forEach((b) => {
      b.style.width = '0%';
      io.observe(b);
    });
  } else {
    bars.forEach((b) => { b.style.width = (b.dataset.pct || 0) + '%'; });
  }

  // ─── Form submit handler — surfaces success/error inline ──
  const form = document.getElementById('crForm');
  const okBox = document.getElementById('crFormSuccess');
  const errBox = document.getElementById('crFormError');
  if (form) {
    form.addEventListener('submit', async (e) => {
      // If the action URL still has the placeholder, fall back to mailto so
      // the form is never silently dropped in dev / pre-deploy.
      if (form.action.includes('YOUR_FORM_ID')) {
        e.preventDefault();
        const data = new FormData(form);
        const lines = [];
        data.forEach((value, key) => {
          if (value && key !== 'consent') lines.push(`${key}: ${value}`);
        });
        const role = data.get('role') || 'unknown';
        const subject = encodeURIComponent(`ClubRival inquiry — ${role}`);
        const body = encodeURIComponent(lines.join('\n'));
        window.location.href = `mailto:hello@hyperiusholdings.com?subject=${subject}&body=${body}`;
        return;
      }

      e.preventDefault();
      okBox.style.display = 'none';
      errBox.style.display = 'none';
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          form.reset();
          okBox.style.display = 'block';
          okBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          throw new Error('non-ok');
        }
      } catch {
        errBox.style.display = 'block';
      }
    });
  }

  // Initialize default tab.
  setTab('runners');
})();
