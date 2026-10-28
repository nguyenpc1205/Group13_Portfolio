(() => {
  const progress = document.getElementById('scrollProgress');
  const navLinks = [...document.querySelectorAll('.section-nav a')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const revealItems = document.querySelectorAll('.reveal');
  const backToTop = document.getElementById('backToTop');
  const cursorGlow = document.querySelector('.cursor-glow');
  const themeToggle = document.getElementById('themeToggle');
  const filterButtons = [...document.querySelectorAll('.filter-btn')];
  const projectCards = [...document.querySelectorAll('.project-card')];
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  // Small stagger between adjacent reveal elements makes the page feel more editorial.
  revealItems.forEach((item, index) => {
    const siblingIndex = [...(item.parentElement?.querySelectorAll('.reveal') || [])].indexOf(item);
    item.style.setProperty('--reveal-delay', `${Math.max(0, siblingIndex) * 75}ms`);
  });

  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
  };

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -25px 0px' });
    revealItems.forEach(item => revealObserver.observe(item));

    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(section => sectionObserver.observe(section));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  window.addEventListener('scroll', updateProgress, { passive: true });

  const updateBackToTop = () => {
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 520);
  };
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  updateBackToTop();
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  if (cursorGlow && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('pointermove', event => {
      cursorGlow.style.setProperty('--mouse-x', `${event.clientX}px`);
      cursorGlow.style.setProperty('--mouse-y', `${event.clientY}px`);
    }, { passive: true });
  }
  // Simple light/dark mode toggle; no external library required.
  themeToggle?.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-mode');
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.innerHTML = isLight ? '☾ <span>Giao diện tối</span>' : '☼ <span>Giao diện sáng</span>';
  });

  // Filter project cards by category.
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle('active', item === button));
    projectCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.hidden = !show;
      if (show) card.classList.add('is-visible');
    });
  }));

  // Client-side form validation only. This does not send email or store data.
  contactForm?.addEventListener('submit', event => {
    event.preventDefault();
    const name = contactForm.elements.name.value.trim();
    const email = contactForm.elements.email.value.trim();
    const message = contactForm.elements.message.value.trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (name.length < 2) formFeedback.textContent = 'Bạn vui lòng nhập họ tên (ít nhất 2 ký tự).';
    else if (!validEmail) formFeedback.textContent = 'Email chưa đúng định dạng, bạn kiểm tra lại nhé.';
    else if (message.length < 10) formFeedback.textContent = 'Nội dung cần có ít nhất 10 ký tự.';
    else formFeedback.textContent = 'Thông tin hợp lệ! Đây là bản demo, dữ liệu chưa được gửi đi.';
  });

  window.addEventListener('resize', updateProgress);
  updateProgress();

  // Subtle pointer parallax for the decorative illustration; disabled for touch devices.
  const art = document.querySelector('.hero-art');
  if (art && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    art.addEventListener('pointermove', event => {
      const rect = art.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      art.style.setProperty('--pointer-x', `${x * 10}px`);
      art.style.setProperty('--pointer-y', `${y * 10}px`);
    });
    art.addEventListener('pointerleave', () => {
      art.style.setProperty('--pointer-x', '0px');
      art.style.setProperty('--pointer-y', '0px');
    });
  }
})();
