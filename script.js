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
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px'; cur.style.top = my + 'px';
  });
  (function animRing() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  })();
  document.querySelectorAll('a, button, .btn, .srv-card, .port-item, .why-card, .price-card, .testi-card, .floater').forEach(el => {
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
  window.addEventListener('scroll', () => { nav.classList.toggle('stuck', window.scrollY > 50); }, { passive: true });
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
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
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
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  const particles = [];
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize, { passive: true });
  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random()*W; this.y = Math.random()*H;
      this.r = Math.random()*1.4+0.3; this.vx = (Math.random()-0.5)*0.25; this.vy = (Math.random()-0.5)*0.25;
      this.a = Math.random()*0.5+0.1; this.life = 0; this.maxLife = Math.random()*300+200;
    }
    update() {
      this.x += this.vx; this.y += this.vy; this.life++;
      if (this.x<0||this.x>W||this.y<0||this.y>H||this.life>this.maxLife) this.reset();
    }
    draw() {
      const alpha = this.a * Math.sin(Math.PI*(this.life/this.maxLife));
      ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
      ctx.fillStyle = `rgba(91,143,255,${alpha})`; ctx.fill();
    }
  }
  const COUNT = window.innerWidth < 768 ? 60 : 120;
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i+1; j < particles.length; j++) {
        const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if (dist < 100) {
          const alpha = (0.4-dist/250)*0.3;
          if (alpha<=0) continue;
          ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y); ctx.lineTo(particles[j].x,particles[j].y);
          ctx.strokeStyle=`rgba(37,99,235,${alpha})`; ctx.lineWidth=0.5; ctx.stroke();
        }
      }
    }
  }
  function loop() { ctx.clearRect(0,0,W,H); drawConnections(); particles.forEach(p=>{p.update();p.draw();}); requestAnimationFrame(loop); }
  loop();
})();

/* ── Scroll reveal ───────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.rv, .rv-left, .rv-right, .rv-scale');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
})();

/* ── Service card mouse-glow ─────────────────────────── */
(function initCardGlow() {
  document.querySelectorAll('.srv-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
      card.style.setProperty('--my', ((e.clientY-r.top)/r.height*100).toFixed(1)+'%');
    });
  });
})();

/* ── Animated metric bars ────────────────────────────── */
(function initMetrics() {
  const section = document.getElementById('whyMetrics');
  if (!section) return;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.wm-bar-fill').forEach(bar => { setTimeout(() => { bar.style.width = bar.dataset.w+'%'; }, 100); });
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
    if (m1) m1.style.transform = `translateY(${y*0.12}px)`;
    if (m2) m2.style.transform = `translateY(${y*-0.08}px)`;
  }, { passive: true });
})();

/* ══════════════════════════════════════════════════════
   WHATSAPP PLAN MODAL
══════════════════════════════════════════════════════ */

const WA_NUMBER = '34642699821'; // ← número WhatsApp (sin + ni espacios)

let _currentPlan = { name: '', price: '' };

/* ── Open modal ── */
function openPlanModal(planName, planPrice) {
  _currentPlan = { name: planName, price: planPrice };
  const modal = document.getElementById('plan-modal');
  if (!modal) return;

  document.getElementById('pmodal-plan-name').textContent = planName;
  document.getElementById('pmodal-plan-price').textContent = planPrice;

  /* Reset fields */
  ['pm-nombre','pm-tipo','pm-detalles','pm-contacto'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.tagName === 'SELECT') el.selectedIndex = 0; else el.value = '';
    el.removeAttribute('aria-invalid');
  });
  ['pm-err-nombre','pm-err-tipo','pm-err-detalles','pm-err-contacto'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });

  modal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  setTimeout(() => { const f = document.getElementById('pm-nombre'); if (f) f.focus(); }, 60);
}

/* ── Close modal ── */
function closePlanModal() {
  const modal = document.getElementById('plan-modal');
  if (!modal) return;
  modal.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

/* ── Init modal events ── */
(function initPlanModal() {
  const modal    = document.getElementById('plan-modal');
  if (!modal) return;
  document.getElementById('pmodalClose')  && document.getElementById('pmodalClose').addEventListener('click', closePlanModal);
  document.getElementById('pmodalSubmit') && document.getElementById('pmodalSubmit').addEventListener('click', handlePlanSubmit);
  modal.addEventListener('click', e => { if (e.target === modal) closePlanModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closePlanModal(); });

  /* Live: clear error on user input */
  [['pm-nombre','pm-err-nombre'],['pm-tipo','pm-err-tipo'],['pm-detalles','pm-err-detalles'],['pm-contacto','pm-err-contacto']].forEach(([inputId, errId]) => {
    const el = document.getElementById(inputId);
    if (!el) return;
    el.addEventListener('input', () => { if (el.getAttribute('aria-invalid')) { el.removeAttribute('aria-invalid'); const err=document.getElementById(errId); if(err) err.textContent=''; } });
  });
})();

/* ── Field error helper ── */
function pmSetError(inputId, errId, msg) {
  const input = document.getElementById(inputId);
  const err   = document.getElementById(errId);
  if (!input || !err) return;
  if (msg) {
    input.setAttribute('aria-invalid', 'true');
    err.textContent = msg;
    input.classList.remove('field-shake');
    void input.offsetWidth;
    input.classList.add('field-shake');
    input.addEventListener('animationend', () => input.classList.remove('field-shake'), { once: true });
  } else {
    input.removeAttribute('aria-invalid');
    err.textContent = '';
  }
}

/* ── Validate phone or email ── */
function isValidContact(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || /^[\d\s\+\-\(\)]{6,20}$/.test(val);
}

/* ── Submit → validate → open WhatsApp ── */
function handlePlanSubmit() {
  const nombre   = document.getElementById('pm-nombre');
  const tipo     = document.getElementById('pm-tipo');
  const detalles = document.getElementById('pm-detalles');
  const contacto = document.getElementById('pm-contacto');
  let valid = true;

  const nomVal  = nombre   ? nombre.value.trim()   : '';
  const tipoVal = tipo     ? tipo.value             : '';
  const detVal  = detalles ? detalles.value.trim()  : '';
  const contVal = contacto ? contacto.value.trim()  : '';

  if (!nomVal || nomVal.length < 2) {
    pmSetError('pm-nombre',   'pm-err-nombre',   'Introduce tu nombre completo.');
    valid = false;
  } else { pmSetError('pm-nombre', 'pm-err-nombre', ''); }

  if (!tipoVal) {
    pmSetError('pm-tipo',     'pm-err-tipo',     'Selecciona un tipo de web.');
    valid = false;
  } else { pmSetError('pm-tipo', 'pm-err-tipo', ''); }

  if (!detVal || detVal.length < 10) {
    pmSetError('pm-detalles', 'pm-err-detalles', 'Explica brevemente lo que necesitas (mín. 10 caracteres).');
    valid = false;
  } else { pmSetError('pm-detalles', 'pm-err-detalles', ''); }

  if (!contVal || !isValidContact(contVal)) {
    pmSetError('pm-contacto', 'pm-err-contacto', 'Introduce un teléfono o email válido.');
    valid = false;
  } else { pmSetError('pm-contacto', 'pm-err-contacto', ''); }

  if (!valid) {
    const first = document.querySelector('#pmodalForm [aria-invalid="true"]');
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  /* Build message */
  const rawMsg = [
    `Hola, quiero contratar el PLAN ${_currentPlan.name} (${_currentPlan.price})`,
    ``,
    `👤 Nombre: ${nomVal}`,
    `🌐 Tipo de web: ${tipoVal}`,
    `📝 Detalles: ${detVal}`,
    `📞 Contacto: ${contVal}`,
  ].join('\n');

  const waURL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(rawMsg)}`;
  closePlanModal();
  window.open(waURL, '_blank', 'noopener,noreferrer');
}

/* ══════════════════════════════════════════════════════
   CONTACT FORM (Formspree)
══════════════════════════════════════════════════════ */

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setFieldError(inputEl, errEl, msg) {
  if (!inputEl || !errEl) return;
  if (msg) { inputEl.setAttribute('aria-invalid','true'); errEl.textContent = msg; }
  else { inputEl.removeAttribute('aria-invalid'); errEl.textContent = ''; }
}

function showBanner(id, show) {
  const el = document.getElementById(id);
  if (el) el.hidden = !show;
}

(function initContactForm() {
  const form = document.getElementById('cForm');
  if (!form) return;

  const nombre     = document.getElementById('nombre');
  const email      = document.getElementById('email');
  const mensaje    = document.getElementById('mensaje');
  const privacidad = document.getElementById('privacy-check');
  const submitBtn  = document.getElementById('submitBtn');

  nombre && nombre.addEventListener('blur', () => {
    const v = nombre.value.trim();
    setFieldError(nombre, document.getElementById('err-nombre'),
      !v ? 'Por favor, introduce tu nombre.' : v.length < 2 ? 'El nombre debe tener al menos 2 caracteres.' : '');
  });

  email && email.addEventListener('blur', () => {
    const v = email.value.trim();
    setFieldError(email, document.getElementById('err-email'),
      !v ? 'Por favor, introduce tu correo electrónico.' : !validateEmail(v) ? 'Introduce un correo electrónico válido.' : '');
  });

  mensaje && mensaje.addEventListener('blur', () => {
    const v = mensaje.value.trim();
    setFieldError(mensaje, document.getElementById('err-mensaje'),
      !v ? 'Por favor, describe tu proyecto.' : v.length < 10 ? 'El mensaje debe tener al menos 10 caracteres.' : '');
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    showBanner('form-success', false);
    showBanner('form-error', false);
    let valid = true;

    const nomVal = nombre ? nombre.value.trim() : '';
    if (!nomVal || nomVal.length < 2) {
      setFieldError(nombre, document.getElementById('err-nombre'), !nomVal ? 'Por favor, introduce tu nombre.' : 'El nombre debe tener al menos 2 caracteres.');
      valid = false;
    } else { setFieldError(nombre, document.getElementById('err-nombre'), ''); }

    const emailVal = email ? email.value.trim() : '';
    if (!emailVal || !validateEmail(emailVal)) {
      setFieldError(email, document.getElementById('err-email'), !emailVal ? 'Por favor, introduce tu correo electrónico.' : 'Introduce un correo electrónico válido.');
      valid = false;
    } else { setFieldError(email, document.getElementById('err-email'), ''); }

    const msgVal = mensaje ? mensaje.value.trim() : '';
    if (!msgVal || msgVal.length < 10) {
      setFieldError(mensaje, document.getElementById('err-mensaje'), !msgVal ? 'Por favor, describe tu proyecto.' : 'El mensaje debe tener al menos 10 caracteres.');
      valid = false;
    } else { setFieldError(mensaje, document.getElementById('err-mensaje'), ''); }

    if (privacidad && !privacidad.checked) {
      setFieldError(privacidad, document.getElementById('err-privacidad'), 'Debes aceptar la Política de Privacidad y la Política de Cookies para continuar.');
      valid = false;
    } else if (privacidad) { setFieldError(privacidad, document.getElementById('err-privacidad'), ''); }

    if (!valid) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin .8s linear infinite"><path d="M12 2a10 10 0 0 1 10 10"/></svg>Enviando…</span>';

    try {
      const data = new FormData(form);
      const res  = await fetch(form.action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        form.reset();
        showBanner('form-success', true);
        document.getElementById('form-success').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        submitBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> ¡Enviado!';
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Enviar mensaje <span class="btn-arrow" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>';
          showBanner('form-success', false);
        }, 6000);
      } else { throw new Error('Server error'); }
    } catch {
      showBanner('form-error', true);
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Enviar mensaje <span class="btn-arrow" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>';
    }
  });
})();

/* ── handleCheckout kept for any legacy calls ── */
function handleCheckout(planKey, _amount, btn) {
  const planMap = {
    basic:        { name: 'Básico',       price: '250€'    },
    professional: { name: 'Professional', price: '600€'    },
    premium:      { name: 'Prémium',      price: '850€'    },
  };
  const plan = planMap[planKey] || { name: planKey, price: '' };
  openPlanModal(plan.name, plan.price);
}