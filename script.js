/* ═══════════════════════════════════════════════════════
   WEBCRAFT STUDIO — script.js
═══════════════════════════════════════════════════════ */

'use strict';

/* ── Security: sanitize string for safe DOM insertion ── */
function sanitize(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' };
  return String(str).replace(/[&<>"']/g, c => map[c]);
}

/* ── Custom cursor (desktop only) ────────────────────── */
(function initCursor() {
  const cur  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!cur || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  const hoverEls = document.querySelectorAll(
    'a, button, .btn, .srv-card, .port-item, .why-card, .price-card, .testi-card, .floater'
  );

  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-grow'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-grow'));
  });
})();

/* ── Loader ──────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('out');
  }, 1700);
});

/* ── Sticky navbar ───────────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('stuck', window.scrollY > 50);
  }, { passive: true });
})();

/* ── Mobile drawer ───────────────────────────────────── */
(function initDrawer() {
  const toggle = document.getElementById('navToggle');
  const drawer = document.getElementById('mobDrawer');
  if (!toggle || !drawer) return;

  toggle.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    toggle.classList.toggle('x', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* Close drawer on Escape key */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
})();

function closeDrawer() {
  const toggle = document.getElementById('navToggle');
  const drawer = document.getElementById('mobDrawer');
  if (toggle) { toggle.classList.remove('x'); toggle.setAttribute('aria-expanded', 'false'); }
  if (drawer) drawer.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Hero canvas particles ───────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let W, H;
  const particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x       = Math.random() * W;
      this.y       = Math.random() * H;
      this.r       = Math.random() * 1.4 + 0.3;
      this.vx      = (Math.random() - 0.5) * 0.25;
      this.vy      = (Math.random() - 0.5) * 0.25;
      this.a       = Math.random() * 0.5 + 0.1;
      this.life    = 0;
      this.maxLife = Math.random() * 300 + 200;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H || this.life > this.maxLife) {
        this.reset();
      }
    }

    draw() {
      const progress = this.life / this.maxLife;
      const alpha    = this.a * Math.sin(Math.PI * progress);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(91,143,255,${alpha})`;
      ctx.fill();
    }
  }

  const COUNT = window.innerWidth < 768 ? 60 : 120;
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const alpha = (0.4 - dist / 250) * 0.3;
          if (alpha <= 0) continue;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(37,99,235,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ── Scroll reveal ───────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.rv, .rv-left, .rv-right, .rv-scale');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => obs.observe(el));
})();

/* ── Service card mouse-glow ─────────────────────────── */
(function initCardGlow() {
  document.querySelectorAll('.srv-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
      const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });
})();

/* ── Animated metric bars ────────────────────────────── */
(function initMetrics() {
  const section = document.getElementById('whyMetrics');
  if (!section) return;

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.wm-bar-fill').forEach(bar => {
        const target = bar.dataset.w + '%';
        setTimeout(() => { bar.style.width = target; }, 100);
      });
      obs.disconnect();
    }
  }, { threshold: 0.3 });

  obs.observe(section);
})();

/* ── Parallax hero meshes ────────────────────────────── */
(function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const m1 = document.querySelector('.hero-mesh-1');
  const m2 = document.querySelector('.hero-mesh-2');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (m1) m1.style.transform = `translateY(${y * 0.12}px)`;
    if (m2) m2.style.transform = `translateY(${y * -0.08}px)`;
  }, { passive: true });
})();

/* ── Form validation helpers ─────────────────────────── */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setFieldError(inputEl, errEl, msg) {
  if (msg) {
    inputEl.setAttribute('aria-invalid', 'true');
    errEl.textContent = msg;
  } else {
    inputEl.removeAttribute('aria-invalid');
    errEl.textContent = '';
  }
}

function showBanner(id, show) {
  const el = document.getElementById(id);
  if (el) el.hidden = !show;
}

/* ── Formspree contact form ──────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('cForm');
  if (!form) return;

  const nombre     = document.getElementById('nombre');
  const email      = document.getElementById('email');
  const mensaje    = document.getElementById('mensaje');
  const privacidad = document.getElementById('privacidad');
  const submitBtn  = document.getElementById('submitBtn');

  /* Live validation on blur */
  nombre && nombre.addEventListener('blur', () => {
    const v = nombre.value.trim();
    setFieldError(nombre, document.getElementById('err-nombre'),
      !v ? 'Por favor, introduce tu nombre.' :
      v.length < 2 ? 'El nombre debe tener al menos 2 caracteres.' : '');
  });

  email && email.addEventListener('blur', () => {
    const v = email.value.trim();
    setFieldError(email, document.getElementById('err-email'),
      !v ? 'Por favor, introduce tu correo electrónico.' :
      !validateEmail(v) ? 'Introduce un correo electrónico válido.' : '');
  });

  mensaje && mensaje.addEventListener('blur', () => {
    const v = mensaje.value.trim();
    setFieldError(mensaje, document.getElementById('err-mensaje'),
      !v ? 'Por favor, describe tu proyecto.' :
      v.length < 10 ? 'El mensaje debe tener al menos 10 caracteres.' : '');
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    /* Hide banners */
    showBanner('form-success', false);
    showBanner('form-error', false);

    /* Validate */
    let valid = true;

    const nomVal = nombre ? nombre.value.trim() : '';
    if (!nomVal || nomVal.length < 2) {
      setFieldError(nombre, document.getElementById('err-nombre'),
        !nomVal ? 'Por favor, introduce tu nombre.' : 'El nombre debe tener al menos 2 caracteres.');
      valid = false;
    } else {
      setFieldError(nombre, document.getElementById('err-nombre'), '');
    }

    const emailVal = email ? email.value.trim() : '';
    if (!emailVal || !validateEmail(emailVal)) {
      setFieldError(email, document.getElementById('err-email'),
        !emailVal ? 'Por favor, introduce tu correo electrónico.' : 'Introduce un correo electrónico válido.');
      valid = false;
    } else {
      setFieldError(email, document.getElementById('err-email'), '');
    }

    const msgVal = mensaje ? mensaje.value.trim() : '';
    if (!msgVal || msgVal.length < 10) {
      setFieldError(mensaje, document.getElementById('err-mensaje'),
        !msgVal ? 'Por favor, describe tu proyecto.' : 'El mensaje debe tener al menos 10 caracteres.');
      valid = false;
    } else {
      setFieldError(mensaje, document.getElementById('err-mensaje'), '');
    }

    if (privacidad && !privacidad.checked) {
      setFieldError(privacidad, document.getElementById('err-privacidad'),
        'Debes aceptar la política de privacidad.');
      valid = false;
    } else if (privacidad) {
      setFieldError(privacidad, document.getElementById('err-privacidad'), '');
    }

    if (!valid) return;

    /* Submit to Formspree */
    submitBtn.disabled   = true;
    submitBtn.textContent = 'Enviando…';

    try {
      const data = new FormData(form);
      const res  = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.reset();
        showBanner('form-success', true);
        submitBtn.textContent = '✓ Enviado';
        setTimeout(() => {
          submitBtn.disabled    = false;
          submitBtn.textContent = 'Enviar mensaje';
          submitBtn.innerHTML   = 'Enviar mensaje <span class="btn-arrow" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>';
        }, 5000);
      } else {
        throw new Error('Server error');
      }
    } catch {
      showBanner('form-error', true);
      submitBtn.disabled    = false;
      submitBtn.innerHTML   = 'Enviar mensaje <span class="btn-arrow" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>';
    }
  });
})();

/* ── Stripe Checkout integration ─────────────────────── */
/*
  SETUP INSTRUCTIONS:
  1. Replace 'pk_test_YOUR_STRIPE_KEY' with your actual Stripe publishable key.
  2. Create Price IDs in your Stripe Dashboard for each plan.
  3. Replace the price IDs in the PLANS object below.
  4. On your server, create a /create-checkout-session endpoint (or use
     Stripe Payment Links for a no-server approach).
*/

const STRIPE_KEY = 'pk_test_YOUR_STRIPE_KEY'; // ← Replace with your key

const PLANS = {
  basic: {
    name: 'Plan Básico',
    priceId: 'price_BASIC_PRICE_ID',   // ← Replace
    amount: 497,
  },
  professional: {
    name: 'Plan Professional',
    priceId: 'price_PRO_PRICE_ID',     // ← Replace
    amount: 1497,
  },
  premium: {
    name: 'Plan Prémium',
    priceId: 'price_PREMIUM_PRICE_ID', // ← Replace
    amount: 2997,
  },
};

async function handleCheckout(planKey, _amountCents, btn) {
  const plan = PLANS[planKey];
  if (!plan) return;

  /* If Stripe key not configured, scroll to contact form */
  if (STRIPE_KEY === 'pk_test_YOUR_STRIPE_KEY' || !plan.priceId.startsWith('price_') || plan.priceId.includes('PRICE_ID')) {
    showCheckoutFallback(plan.name, btn);
    return;
  }

  btn.disabled = true;
  const originalHTML = btn.innerHTML;
  btn.textContent = 'Redirigiendo…';

  try {
    const stripe = window.Stripe ? Stripe(STRIPE_KEY) : null;
    if (!stripe) throw new Error('Stripe not loaded');

    const res = await fetch('/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId: plan.priceId }),
    });

    if (!res.ok) throw new Error('Server error');

    const { sessionId } = await res.json();
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) throw error;

  } catch (err) {
    console.warn('Stripe not configured — falling back to contact form.', err.message);
    showCheckoutFallback(plan.name, btn);
    btn.innerHTML = originalHTML;
  } finally {
    btn.disabled = false;
  }
}

function showCheckoutFallback(planName, btn) {
  /* Scroll to contact form and pre-select the service */
  const contactSection = document.getElementById('contacto');
  const servicioSelect = document.getElementById('servicio');

  if (servicioSelect) {
    const planMap = {
      'Plan Básico':        'landing',
      'Plan Professional':  'tienda',
      'Plan Prémium':       'medida',
    };
    const val = planMap[planName];
    if (val) servicioSelect.value = val;
  }

  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}