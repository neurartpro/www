/* NeurArt — Main JS */
'use strict';

// === NAV SCROLL ===
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// === MOBILE MENU ===
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen);
    // Animate burger
    const spans = burger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close on nav link click
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// === SCROLL REVEAL ===
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay based on sibling index
      const siblings = entry.target.parentElement?.querySelectorAll('.reveal');
      let delay = 0;
      if (siblings) {
        Array.from(siblings).forEach((el, idx) => {
          if (el === entry.target) delay = idx * 80;
        });
      }
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// === ACCORDION ===
document.querySelectorAll('.accordion__q').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    const panelId = btn.getAttribute('aria-controls');
    const panel = document.getElementById(panelId);

    // Close all others
    document.querySelectorAll('.accordion__q').forEach(other => {
      if (other !== btn) {
        other.setAttribute('aria-expanded', 'false');
        const otherId = other.getAttribute('aria-controls');
        const otherPanel = document.getElementById(otherId);
        if (otherPanel) {
          otherPanel.hidden = true;
          otherPanel.style.maxHeight = '';
        }
      }
    });

    btn.setAttribute('aria-expanded', !expanded);
    if (panel) {
      if (expanded) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        requestAnimationFrame(() => {
          panel.style.maxHeight = '0';
          panel.style.overflow = 'hidden';
          setTimeout(() => {
            panel.hidden = true;
            panel.style.maxHeight = '';
            panel.style.overflow = '';
          }, 280);
        });
      } else {
        panel.hidden = false;
        panel.style.maxHeight = '0';
        panel.style.overflow = 'hidden';
        requestAnimationFrame(() => {
          panel.style.maxHeight = panel.scrollHeight + 'px';
          setTimeout(() => {
            panel.style.maxHeight = '';
            panel.style.overflow = '';
          }, 280);
        });
      }
    }
  });
});

// === FORM SUBMIT ===
const form = document.querySelector('.booking__form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Отправлено ✓';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    setTimeout(() => {
      btn.textContent = 'Начать сейчас';
      btn.disabled = false;
      btn.style.opacity = '';
      form.reset();
    }, 3500);
  });
}

// === SMOOTH SCROLL for anchor links ===
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// === GALLERY — subtle parallax ===
const galleryItems = document.querySelectorAll('.gallery__item img');
if (window.matchMedia('(min-width: 768px)').matches) {
  window.addEventListener('scroll', () => {
    galleryItems.forEach((img, i) => {
      const rect = img.closest('.gallery__item').getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const speed = (i % 2 === 0) ? 0.04 : -0.04;
        const offset = (rect.top - window.innerHeight / 2) * speed;
        img.style.transform = `translateY(${offset}px) scale(1.06)`;
      }
    });
  }, { passive: true });
}
