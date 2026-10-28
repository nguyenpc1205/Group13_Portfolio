// Hiệu ứng xuất hiện khi cuộn đến từng khu vực.
const revealItems = document.querySelectorAll(
  '.section-heading, .about-grid, .skill-card, .project-row, .contact-section > *, .goal-card, .timeline-item, .extra-info'
);

if ('IntersectionObserver' in window) {
  revealItems.forEach((item) => item.classList.add('reveal'));
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
}

const profilePhoto = document.querySelector('.avatar-photo');
if (profilePhoto) {
  const showPhoto = () => profilePhoto.parentElement.classList.add('has-photo');
  profilePhoto.addEventListener('load', showPhoto);
  if (profilePhoto.complete && profilePhoto.naturalWidth > 0) showPhoto();
}

// Tương tác 1: menu điều hướng trên màn hình nhỏ.
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('#site-nav');
if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Đóng menu' : 'Mở menu');
    menuToggle.textContent = isOpen ? '×' : '☰';
  });
  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Mở menu');
      menuToggle.textContent = '☰';
    });
  });
}

// Tương tác 2: lọc dự án theo nhóm.
const filterButtons = document.querySelectorAll('.filter-btn');
const projectRows = document.querySelectorAll('.project-row[data-category]');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    projectRows.forEach((project) => {
      project.classList.toggle('is-hidden', filter !== 'all' && project.dataset.category !== filter);
    });
  });
});

// ===== Form Validation & Submit handling =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const msgInput = document.getElementById('contact-message');
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const msgError = document.getElementById('message-error');
  const feedback = document.getElementById('formFeedback');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    if (nameError) nameError.textContent = '';
    if (emailError) emailError.textContent = '';
    if (msgError) msgError.textContent = '';
    if (feedback) {
      feedback.className = 'form-feedback';
      feedback.textContent = '';
      feedback.style.display = 'none';
    }

    if (!nameInput.value.trim()) {
      if (nameError) nameError.textContent = 'Vui lòng nhập họ và tên của bạn.';
      nameInput.focus();
      isValid = false;
    }

    if (!emailInput.value.trim()) {
      if (emailError) emailError.textContent = 'Vui lòng nhập địa chỉ email.';
      if (isValid) emailInput.focus();
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      if (emailError) emailError.textContent = 'Email không hợp lệ (ví dụ: user@example.com).';
      if (isValid) emailInput.focus();
      isValid = false;
    }

    if (!msgInput.value.trim()) {
      if (msgError) msgError.textContent = 'Vui lòng nhập nội dung tin nhắn.';
      if (isValid) msgInput.focus();
      isValid = false;
    }

    if (isValid) {
      if (feedback) {
        feedback.className = 'form-feedback success';
        feedback.textContent = '✓ Cảm ơn bạn! Tin nhắn của bạn đã được gửi thành công đến Võ Tuấn Kiệt.';
        feedback.style.display = 'block';
      }
      contactForm.reset();
    }
  });
}
