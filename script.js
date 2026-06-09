/* ============================================================
   PSICÓLOGA AURA HERRERA — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAVBAR: scroll effect ── */
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ── HAMBURGER MENU ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ── ACCORDION ── */
  document.querySelectorAll('.acc-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const item     = btn.closest('.acc-item');
      const body     = item.querySelector('.acc-body');
      const isOpen   = btn.getAttribute('aria-expanded') === 'true';

      // Close all others
      document.querySelectorAll('.acc-item').forEach(other => {
        if (other !== item) {
          other.querySelector('.acc-header').setAttribute('aria-expanded', 'false');
          other.querySelector('.acc-body').classList.remove('open');
        }
      });

      // Toggle current
      btn.setAttribute('aria-expanded', !isOpen);
      body.classList.toggle('open', !isOpen);
    });
  });

  /* ── SCROLL-TO-TOP BUTTON ── */
  const scrollTopBtn = document.getElementById('scrollTop');
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── INTERSECTION OBSERVER: fade-in animations ── */
  const fadeEls = document.querySelectorAll(
    '.service-card, .specialty-card, .testimonial-card, .policy-card, .step, .consent-item'
  );

  fadeEls.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => observer.observe(el));

  /* ── ACTIVE NAV LINK: highlight on scroll ── */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active-nav', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => sectionObserver.observe(s));

  /* ── CONTACT FORM: basic client-side validation + mailto fallback ── */
  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name     = form.name.value.trim();
      const email    = form.email.value.trim();
      const message  = form.message.value.trim();
      const privacy  = form.privacy.checked;

      // Simple validation
      if (!name || !email || !message || !privacy) {
        showFormError('Por favor completa todos los campos obligatorios y acepta el tratamiento de datos.');
        return;
      }

      if (!isValidEmail(email)) {
        showFormError('Por favor ingresa un correo electrónico válido.');
        return;
      }

      // Build mailto link as fallback (replace with a backend/FormSubmit/Netlify if needed)
      const modality = form.modality.value || 'Sin definir';
      const phone    = form.phone.value.trim();
      const subject  = encodeURIComponent(`Consulta de ${name} – Psicóloga Aura Herrera`);
      const body     = encodeURIComponent(
        `Nombre: ${name}\nCorreo: ${email}\nTeléfono: ${phone || 'No indicado'}\nModalidad: ${modality}\n\nMensaje:\n${message}`
      );

      window.location.href = `mailto:psicologa.auraherrera@gmail.com?subject=${subject}&body=${body}`;

      // Show success feedback
      form.style.display = 'none';
      formSuccess.style.display = 'flex';
    });
  }

  function showFormError(msg) {
    let err = form.querySelector('.form-error');
    if (!err) {
      err = document.createElement('p');
      err.className = 'form-error';
      err.style.cssText = 'color:#C0392B;font-size:0.85rem;background:#FDECEA;padding:0.7rem 1rem;border-radius:6px;';
      form.insertBefore(err, form.querySelector('button[type="submit"]'));
    }
    err.textContent = msg;
    err.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ── COPYRIGHT YEAR ── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── SMOOTH SCROLL for anchor links with offset ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH   = navbar.offsetHeight + 10;
      const top    = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── WHATSAPP PULSE: small pulse animation via JS ── */
  const wa = document.querySelector('.whatsapp-float');
  if (wa) {
    // Pulse every 8s after 3s delay
    setTimeout(() => {
      setInterval(() => {
        wa.style.transform = 'scale(1.15)';
        setTimeout(() => { wa.style.transform = 'scale(1)'; }, 300);
      }, 8000);
    }, 3000);
  }

  /* ── SPECIALTY CARDS: tooltip on mobile tap ── */
  document.querySelectorAll('.specialty-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  /* ── HERO: subtle parallax on scroll ── */
  const heroShapes = document.querySelectorAll('.shape');
  if (heroShapes.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      heroShapes[0] && (heroShapes[0].style.transform = `translateY(${scrollY * 0.08}px)`);
      heroShapes[1] && (heroShapes[1].style.transform = `translateY(${scrollY * 0.05}px)`);
    }, { passive: true });
  }

  /* ── PERFORMANCE: defer non-critical initializations ── */
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => prefillWhatsApp());
  } else {
    setTimeout(prefillWhatsApp, 500);
  }

  function prefillWhatsApp() {
    // If user clicked any service card, pre-fill WA message
    document.querySelectorAll('.service-card .btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const serviceTitle = btn.closest('.service-card').querySelector('h3').textContent;
        const waLinks = document.querySelectorAll('a[href*="wa.me"]');
        const msg = encodeURIComponent(`Hola Aura, me interesa agendar una sesión de: ${serviceTitle}`);
        waLinks.forEach(l => {
          const base = l.href.split('?')[0];
          l.href = `${base}?text=${msg}`;
        });
      });
    });
  }

});
