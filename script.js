/* ════════════════════════════════════════
   MOHAMMAD RAFI — Premium Portfolio JS
   ════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── YEAR ── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── SCROLL PROGRESS BAR ── */
  const scrollBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    if (scrollBar) scrollBar.style.width = pct + '%';
  }, { passive: true });

  /* ── NAVBAR: scroll class + active link ── */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }

    // Active nav link
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }, { passive: true });

  /* ── MOBILE HAMBURGER ── */
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('nav-links');

  if (hamburger && navLinksContainer) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinksContainer.classList.toggle('mobile-open');
      document.body.style.overflow = navLinksContainer.classList.contains('mobile-open') ? 'hidden' : '';
    });

    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinksContainer.classList.remove('mobile-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── CUSTOM CURSOR ── */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');

  if (window.matchMedia('(pointer:fine)').matches && cursor && follower) {
    let mx = 0, my = 0, fx = 0, fy = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });

    const animateCursor = () => {
      fx += (mx - fx) * 0.1;
      fy += (my - fy) * 0.1;
      follower.style.left = fx + 'px';
      follower.style.top  = fy + 'px';
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    document.querySelectorAll('a, button, .tech-icon-item, .project-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
        follower.style.opacity = '0';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        follower.style.opacity = '0.5';
      });
    });
  } else {
    if (cursor) cursor.style.display = 'none';
    if (follower) follower.style.display = 'none';
    document.body.style.cursor = 'auto';
  }

  /* ── PARTICLE CANVAS ── */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const COLORS = ['rgba(108,99,255,0.6)', 'rgba(0,212,255,0.5)', 'rgba(167,139,250,0.5)'];

    class Particle {
      constructor() { this.reset(true); }
      reset(init = false) {
        this.x  = Math.random() * W;
        this.y  = init ? Math.random() * H : H + 10;
        this.r  = Math.random() * 2 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = -(Math.random() * 0.6 + 0.2);
        this.alpha = Math.random() * 0.5 + 0.2;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.y < -10) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    const COUNT = Math.min(80, Math.floor(W * H / 15000));
    for (let i = 0; i < COUNT; i++) particles.push(new Particle());

    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(108,99,255,${(1 - dist / 120) * 0.12})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    };

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ── ROLE CYCLER ── */
  const roleItems = document.querySelectorAll('.role-item');
  let roleIndex = 0;
  if (roleItems.length > 1) {
    setInterval(() => {
      roleItems[roleIndex].classList.remove('active');
      roleIndex = (roleIndex + 1) % roleItems.length;
      const next = roleItems[roleIndex];
      next.style.animation = 'none';
      next.offsetHeight; // reflow
      next.style.animation = '';
      next.classList.add('active');
    }, 2600);
  }

  /* ── AOS (Animate on Scroll) ── */
  const aosEls = document.querySelectorAll('[data-aos]');
  const aosDelays = {};
  aosEls.forEach(el => {
    const delay = parseInt(el.getAttribute('data-aos-delay') || '0');
    aosDelays.set ? null : (aosDelays.set = true); // no-op
    el._aosDelay = delay;
  });

  const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el._aosDelay || 0;
        setTimeout(() => el.classList.add('aos-animate'), delay);
        aosObserver.unobserve(el);

        /* Trigger skill bars when skills section is visible */
        if (el.closest('#skills') || el.id === 'skills') {
          triggerSkillBars();
        }
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  aosEls.forEach(el => aosObserver.observe(el));

  /* ── SKILL BARS ── */
  let skillBarsTriggered = false;
  const triggerSkillBars = () => {
    if (skillBarsTriggered) return;
    skillBarsTriggered = true;
    document.querySelectorAll('.skill-bar-fill').forEach(bar => {
      const target = bar.getAttribute('data-width') + '%';
      setTimeout(() => { bar.style.width = target; }, 200);
    });
  };

  /* Also trigger via IntersectionObserver on the skills section */
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const skillObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { triggerSkillBars(); skillObserver.disconnect(); }
    }, { threshold: 0.2 });
    skillObserver.observe(skillsSection);
  }

  /* ── COUNTER ANIMATION ── */
  const counters = document.querySelectorAll('.ach-num');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 1800;
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1);
          const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
          el.textContent = Math.floor(ease * target) + (target >= 100 ? '+' : target > 3 ? '+' : '+');
          if (t < 1) requestAnimationFrame(tick);
          else el.textContent = target + '+';
        };
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ── CONTACT FORM ── */
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-message');
  const submitBtn = document.getElementById('form-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending…</span><i class="fas fa-spinner fa-spin"></i>';

      try {
        const res = await fetch(this.action, {
          method: 'POST',
          body: new FormData(this),
          headers: { Accept: 'application/json' }
        });

        if (res.ok) {
          formFeedback.textContent = '✓ Message sent! I\'ll get back to you soon.';
          formFeedback.className = 'form-feedback success';
          contactForm.reset();
        } else {
          throw new Error('Bad response');
        }
      } catch {
        formFeedback.textContent = '✗ Something went wrong. Please email me directly.';
        formFeedback.className = 'form-feedback error';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
        setTimeout(() => { formFeedback.className = 'form-feedback'; }, 6000);
      }
    });
  }

  /* ── SMOOTH SCROLL for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
