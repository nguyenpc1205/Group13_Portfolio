// 1. Đồng hồ độ cao Fansipan: cuộn xuống = leo lên (0 → 3.143 m)
(function () {
    var MAX = 3143;
    var altitude = document.getElementById('altitude');
    var fill = document.getElementById('gaugeFill');
    if (!altitude || !fill) return;

    function update() {
        var total = document.documentElement.scrollHeight - window.innerHeight;
        var p = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
        altitude.textContent = Math.round(p * MAX).toLocaleString('vi-VN');
        fill.style.height = (p * 100).toFixed(1) + '%';
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
})();

// 2. Chế độ Leo Đêm (Night Trek Mode / Theme Toggle)
(function () {
    var toggleBtn = document.getElementById('themeToggle');
    if (!toggleBtn) return;

    // Check saved preference
    var savedTheme = localStorage.getItem('hieu_theme');
    if (savedTheme === 'night') {
        document.body.classList.add('night-mode');
        toggleBtn.textContent = '☀️ Leo Ngày';
    }

    toggleBtn.addEventListener('click', function () {
        var isNight = document.body.classList.toggle('night-mode');
        if (isNight) {
            toggleBtn.textContent = '☀️ Leo Ngày';
            localStorage.setItem('hieu_theme', 'night');
        } else {
            toggleBtn.textContent = '🌙 Leo Đêm';
            localStorage.setItem('hieu_theme', 'day');
        }
    });
})();

// 3. Bộ lọc dự án (Project Category Filter)
(function () {
    var filterBtns = document.querySelectorAll('.project-filters .filter-btn');
    var cards = document.querySelectorAll('.project-cards-wrap .project-card');

    if (!filterBtns.length || !cards.length) return;

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var filter = btn.getAttribute('data-filter');
            cards.forEach(function (card) {
                var cat = card.getAttribute('data-category');
                if (filter === 'all' || cat === filter) {
                    card.classList.remove('is-hidden');
                } else {
                    card.classList.add('is-hidden');
                }
            });
        });
    });
})();

// 4. Form Liên Hệ & Kiểm tra dữ liệu (Form Validation)
(function () {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var nameInput = document.getElementById('contact-name');
    var emailInput = document.getElementById('contact-email');
    var msgInput = document.getElementById('contact-message');
    var nameError = document.getElementById('name-error');
    var emailError = document.getElementById('email-error');
    var msgError = document.getElementById('message-error');
    var feedback = document.getElementById('formFeedback');

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var isValid = true;

        // Reset errors
        nameError.textContent = '';
        emailError.textContent = '';
        msgError.textContent = '';
        feedback.className = 'form-feedback';
        feedback.style.display = 'none';

        // Check name
        if (!nameInput.value.trim()) {
            nameError.textContent = 'Vui lòng cho Hiếu biết tên của bạn.';
            nameInput.focus();
            isValid = false;
        }

        // Check email
        if (!emailInput.value.trim()) {
            emailError.textContent = 'Vui lòng cung cấp email để Hiếu có thể phản hồi.';
            if (isValid) emailInput.focus();
            isValid = false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
            emailError.textContent = 'Địa chỉ email chưa đúng định dạng (ví dụ: ten@domain.com).';
            if (isValid) emailInput.focus();
            isValid = false;
        }

        // Check message
        if (!msgInput.value.trim()) {
            msgError.textContent = 'Nội dung tin nhắn không được để trống.';
            if (isValid) msgInput.focus();
            isValid = false;
        } else if (msgInput.value.trim().length < 10) {
            msgError.textContent = 'Lời nhắn quá ngắn, vui lòng nhập ít nhất 10 ký tự.';
            if (isValid) msgInput.focus();
            isValid = false;
        }

        if (isValid) {
            feedback.className = 'form-feedback success';
            feedback.textContent = '✓ Lời nhắn đã được gửi thành công! Hiếu sẽ đọc và phản hồi bạn sớm nhất.';
            feedback.style.display = 'block';
            form.reset();
        }
    });
})();
