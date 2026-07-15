/* ==========================================================================
   LinguaBridge Academy — Global JavaScript
   Handles: loader, nav, dark mode, scroll progress, back-to-top,
   reveal animations, counters, typing effect, testimonial slider,
   FAQ accordion, course search/filter, contact form, newsletter.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loading Screen ---------- */
  const loader = document.querySelector('.loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hide'), 400);
    });
    // Fallback in case load event already fired
    setTimeout(() => loader.classList.add('hide'), 1800);
  }

  /* ---------- Sticky Navbar + Mobile Toggle ---------- */
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
    updateScrollProgress();
    toggleBackToTop();
  });

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      navToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>' : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    // Close menu when a link is clicked (mobile)
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
      });
    });
  }

  /* ---------- Dark Mode Toggle ---------- */
  const darkToggle = document.querySelector('.dark-toggle');
  const applyDarkMode = (on) => {
    document.body.classList.toggle('dark-mode', on);
    if (darkToggle) darkToggle.innerHTML = on ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  };
  const savedTheme = localStorage.getItem('lb-theme');
  applyDarkMode(savedTheme === 'dark');
  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      const isDark = !document.body.classList.contains('dark-mode');
      applyDarkMode(isDark);
      localStorage.setItem('lb-theme', isDark ? 'dark' : 'light');
    });
  }

  /* ---------- Scroll Progress Bar ---------- */
  const progressBar = document.getElementById('scroll-progress');
  function updateScrollProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  /* ---------- Back To Top ---------- */
  const backToTop = document.querySelector('.back-to-top');
  function toggleBackToTop() {
    if (!backToTop) return;
    if (window.scrollY > 500) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
  }
  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Reveal on Scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Animated Counters ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString() + suffix;
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Hero Typing Effect ---------- */
  const typedEl = document.getElementById('typed-text');
  if (typedEl) {
    const phrases = ['English.', 'French.', 'Spanish.', 'German.', 'Arabic.'];
    let phraseIdx = 0, charIdx = 0, deleting = false;

    function typeLoop() {
      const current = phrases[phraseIdx];
      if (!deleting) {
        charIdx++;
        typedEl.textContent = current.slice(0, charIdx);
        if (charIdx === current.length) {
          deleting = true;
          setTimeout(typeLoop, 1400);
          return;
        }
      } else {
        charIdx--;
        typedEl.textContent = current.slice(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
        }
      }
      setTimeout(typeLoop, deleting ? 55 : 95);
    }
    typeLoop();
  }

  /* ---------- Testimonial Slider ---------- */
  const slidesTrack = document.querySelector('.testi-slides');
  if (slidesTrack) {
    const slides = slidesTrack.querySelectorAll('.testi-slide');
    const dotsWrap = document.querySelector('.testi-dots');
    const prevBtn = document.querySelector('.testi-arrow.prev');
    const nextBtn = document.querySelector('.testi-arrow.next');
    let index = 0;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      slidesTrack.style.transform = `translateX(-${index * 100}%)`;
      dotsWrap.querySelectorAll('.testi-dot').forEach((d, di) => d.classList.toggle('active', di === index));
    }
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(index + 1));
    if (prevBtn) prevBtn.addEventListener('click', () => goTo(index - 1));

    let autoSlide = setInterval(() => goTo(index + 1), 6000);
    const slider = document.querySelector('.testi-slider');
    slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
    slider.addEventListener('mouseleave', () => autoSlide = setInterval(() => goTo(index + 1), 6000));
  }

  /* ---------- FAQ Accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-answer').style.maxHeight = null;
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Course Search + Filter ---------- */
  const searchInput = document.getElementById('course-search');
  const filterChips = document.querySelectorAll('.filter-chip');
  const courseCards = document.querySelectorAll('.course-card');

  function applyFilters() {
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const activeChip = document.querySelector('.filter-chip.active');
    const activeFilter = activeChip ? activeChip.dataset.filter : 'all';

    courseCards.forEach(card => {
      const title = card.dataset.title.toLowerCase();
      const category = card.dataset.category;
      const matchesSearch = title.includes(query);
      const matchesFilter = activeFilter === 'all' || category === activeFilter;
      card.style.display = (matchesSearch && matchesFilter) ? 'flex' : 'none';
    });
  }
  if (searchInput) searchInput.addEventListener('input', applyFilters);
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      applyFilters();
    });
  });

  /* ---------- Contact Form (frontend only, no backend) ---------- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = document.getElementById('form-status');
      status.textContent = 'Thank you! Your message has been received. Our team will reach out within 24 hours.';
      status.classList.add('success');
      contactForm.reset();
    });
  }

  /* ---------- Newsletter Form ---------- */
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = document.getElementById('newsletter-status');
      if (status) {
        status.textContent = 'You are subscribed! Welcome to the LinguaBridge community.';
        status.classList.add('success');
      }
      newsletterForm.reset();
    });
  }

  /* ---------- Set current year in footer ---------- */
  document.querySelectorAll('.current-year').forEach(el => el.textContent = new Date().getFullYear());

});
