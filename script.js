/* ═══════════════════════════════════════════════════════
   WEBCRAFT STUDIO — script.js
═══════════════════════════════════════════════════════ */

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
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
})();

function closeDrawer() {
  const toggle = document.getElementById('navToggle');
  const drawer = document.getElementById('mobDrawer');
  if (toggle) toggle.classList.remove('x');
  if (drawer) drawer.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Hero canvas particles ───────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  /* Skip heavy particle animation on low-power devices */
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

/* ── Contact form validation ─────────────────────────── */
function sendForm(btn) {
  const inputs = document.querySelectorAll('#cForm input, #cForm select, #cForm textarea');
  let valid = true;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = '#ef4444';
      valid = false;
    } else {
      input.style.borderColor = '';
    }
  });

  if (!valid) return;

  btn.textContent = 'Enviant…';
  btn.disabled    = true;

  /* Simulate async submit — replace with real fetch() call */
  setTimeout(() => {
    btn.innerHTML  = '✓ Missatge enviat — Ens posem en contacte aviat';
    btn.style.background  = '#059669';
    btn.style.boxShadow   = '0 0 30px rgba(5,150,105,0.4)';
    inputs.forEach(i => { i.value = ''; i.style.borderColor = ''; });
  }, 1400);
}