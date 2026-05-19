/* ============================================================
   ClubRival sub-landing interactions:
   - Audience tab switcher (drives form sub-section + hidden role/subject)
   - FAQ accordion
   - TAM bar fill animation when in view
   - Deep-link from CTAs that carry data-tab="..."
   ============================================================ */
(function () {
  'use strict';

  // ─── PostHog safe-call helper ──────────────────────────────
  // Fires events only if PostHog loaded; never throws. Properties should
  // be categorical / non-PII (no names, emails, etc.) so we stay in
  // marketing-analytics territory rather than ops-data territory.
  function track(event, props) {
    try {
      if (window.posthog && typeof window.posthog.capture === 'function') {
        window.posthog.capture(event, props || {});
      }
    } catch (e) {
      // never let analytics break the UX
    }
  }

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
  let currentTab = 'runners';

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
    if (name !== currentTab) {
      track('audience_tab_change', { from_tab: currentTab, to_tab: name });
      currentTab = name;
    }
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
  document.querySelectorAll('.cr-faq-item').forEach((item, idx) => {
    const q = item.querySelector('.cr-faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-open');
      item.classList.toggle('is-open');
      if (willOpen) {
        const text = (q.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80);
        track('faq_open', { question_index: idx, question_preview: text });
      }
    });
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

  // ─── Form submit handler — writes directly to Supabase ──
  const form = document.getElementById('crForm');
  const okBox = document.getElementById('crFormSuccess');
  const errBox = document.getElementById('crFormError');
  
  // Initialize Supabase client
  const supabaseUrl = 'https://ykdzlrvkyhxslasesfbc.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrZHpscnZreWh4c2xhc2VzZmJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMTM1MDYsImV4cCI6MjA5Mzc4OTUwNn0.wuwbQo8q1V_NBOtpAOeXOdjjYT4VlHhTREjHNH7tP-g';
  const supabase = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseAnonKey) : null;

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!supabase) {
        errBox.textContent = 'Database client not loaded. Please try again.';
        errBox.style.display = 'block';
        return;
      }

      okBox.style.display = 'none';
      errBox.style.display = 'none';
      
      const data = new FormData(form);
      const role = data.get('role');
      
      try {
        let error = null;
        
        if (role === 'runner') {
          const { error: e } = await supabase.from('waitlist_signups').insert({
            name: data.get('name'),
            email: data.get('email'),
            city: data.get('city'),
            club_name: data.get('club') || null,
            club_activity: data.get('club_activity') || null,
            message: data.get('message') || null,
            source: 'hyperius/clubrival',
            user_agent: navigator.userAgent
          });
          error = e;
        } else if (role === 'brand') {
          const { error: e } = await supabase.from('brand_applications').insert({
            contact_name: data.get('name'),
            contact_email: data.get('email'),
            brand_name: data.get('brand'),
            brand_url: data.get('brand_url') || null,
            brand_location: data.get('brand_location'),
            category: data.get('brand_category'),
            proposed_offer: data.get('offer'),
            source: 'hyperius/clubrival',
            user_agent: navigator.userAgent
          });
          error = e;
        } else if (role === 'investor') {
          const { error: e } = await supabase.from('investor_inquiries').insert({
            contact_name: data.get('name'),
            contact_email: data.get('email'),
            firm: data.get('firm') || null,
            role_title: data.get('role_title') || null,
            check_size: data.get('check_size') || null,
            accredited: data.get('accredited') || null,
            notes: data.get('notes') || null,
            source: 'hyperius/clubrival',
            user_agent: navigator.userAgent
          });
          error = e;
        }

        if (error) throw error;

        form.reset();
        okBox.style.display = 'block';
        okBox.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Successful submission — fire categorical analytics only (no PII).
        track('form_submit_success', {
          form_type: role,
          city: role === 'runner' ? (data.get('city') || null) : null,
          category: role === 'brand' ? (data.get('brand_category') || null) : null,
          check_size: role === 'investor' ? (data.get('check_size') || null) : null,
        });
      } catch (err) {
        console.error('Supabase insert error:', err);
        // Friendlier message when the email is already on the list.
        // Postgres unique-constraint violation code is 23505.
        const isDup = err && (err.code === '23505' || /duplicate key|unique constraint/i.test(err.message || ''));
        if (isDup) {
          errBox.innerHTML = "You're already on our list. We'll reach out as soon as a spot opens — or email <a href=\"mailto:admin@hyperius.site\" style=\"color:var(--gold-400);\">admin@hyperius.site</a> if you need to update your details.";
          track('form_submit_duplicate', { form_type: role });
        } else {
          errBox.textContent = 'Something went wrong submitting your form. Please try again or email admin@hyperius.site.';
          track('form_submit_error', {
            form_type: role,
            error_code: (err && err.code) || 'unknown',
          });
        }
        errBox.style.display = 'block';
        errBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // Initialize default tab.
  setTab('runners');
})();
