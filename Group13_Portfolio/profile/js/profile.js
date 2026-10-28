/**
 * TRAN NGOC LAM - FLAGSHIP PORTFOLIO ANIMATION ENGINE
 * Powered by GSAP & ScrollTrigger (Identical to modern flagship product landing pages)
 */

document.addEventListener('DOMContentLoaded', function () {
    initCursor();
    initProgressBar();
    initStickySubnav();
    initHeroArt3D();
    initGSAPScrollAnimations();
    initContactForm();
    initDarkModeToggle();
});

/* ==================== 1. CON TRỎ CHUỘT FLAGSHIP ==================== */
function initCursor() {
    var cursor = document.getElementById('customCursor');
    var trail = document.getElementById('cursorTrail');
    if (!cursor || !trail) return;

    var mouseX = window.innerWidth / 2;
    var mouseY = window.innerHeight / 2;
    var trailX = mouseX;
    var trailY = mouseY;

    window.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    function renderTrail() {
        trailX += (mouseX - trailX) * 0.15;
        trailY += (mouseY - trailY) * 0.15;
        trail.style.left = trailX + 'px';
        trail.style.top = trailY + 'px';
        requestAnimationFrame(renderTrail);
    }
    requestAnimationFrame(renderTrail);

    var interactables = document.querySelectorAll('a, button, .bento-box, .project-deck-card');
    interactables.forEach(function (el) {
        el.addEventListener('mouseenter', function () {
            trail.style.width = '54px';
            trail.style.height = '54px';
            trail.style.borderColor = 'rgba(255, 105, 0, 0.6)';
        });
        el.addEventListener('mouseleave', function () {
            trail.style.width = '36px';
            trail.style.height = '36px';
            trail.style.borderColor = 'rgba(0, 245, 212, 0.4)';
        });
    });
}

/* ==================== 2. THANH TIẾN ĐỘ CUỘN TRANG (PROGRESS BAR) ==================== */
function initProgressBar() {
    var bar = document.getElementById('progressBar');
    if (!bar) return;

    window.addEventListener('scroll', function () {
        var totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            var progress = (window.scrollY / totalHeight) * 100;
            bar.style.width = progress + '%';
        }
    }, { passive: true });
}

/* ==================== 3. STICKY SUB-NAV & SCROLLSPY ==================== */
function initStickySubnav() {
    var navLinks = document.querySelectorAll('.subnav-link');
    var sections = document.querySelectorAll('section');

    window.addEventListener('scroll', function () {
        var scrollPos = window.scrollY + 160;

        sections.forEach(function (sec) {
            var top = sec.offsetTop;
            var height = sec.offsetHeight;
            var id = sec.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { passive: true });
}

/* ==================== 4. 3D HERO ART 60FPS PHYSICS & PARALLAX ==================== */
function initHeroArt3D() {
    var heroArt = document.querySelector('.hero-art');
    if (!heroArt) return;

    var pointerX = 0, pointerY = 0;
    var targetPointerX = 0, targetPointerY = 0;
    var animTime = 0;

    // Track pointer movement
    window.addEventListener('pointermove', function (e) {
        var rect = heroArt.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;
        targetPointerX = ((e.clientX - centerX) / (rect.width / 2)) * 18;
        targetPointerY = ((e.clientY - centerY) / (rect.height / 2)) * 18;
    }, { passive: true });

    window.addEventListener('pointerleave', function () {
        targetPointerX = 0;
        targetPointerY = 0;
    });

    // 60FPS continuous physics loop
    function update60FPS() {
        animTime += 0.016;

        // LERP interpolation for buttery-smooth motion
        pointerX += (targetPointerX - pointerX) * 0.085;
        pointerY += (targetPointerY - pointerY) * 0.085;

        // Auto float wobble even without mouse movement (True continuous 60FPS)
        var wobbleX = Math.sin(animTime * 1.5) * 5;
        var wobbleY = Math.cos(animTime * 1.2) * 5;

        heroArt.style.setProperty('--pointer-x', (pointerX + wobbleX).toFixed(2) + 'px');
        heroArt.style.setProperty('--pointer-y', (pointerY + wobbleY).toFixed(2) + 'px');

        requestAnimationFrame(update60FPS);
    }
    requestAnimationFrame(update60FPS);
}

/* ==================== 5. HIỆU ỨNG CUỘN GSAP & SCROLLTRIGGER ==================== */
function initGSAPScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded. Animations falling back to standard CSS.');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // 1. Hero Pin & 3D Visual Zoom
    var heroPin = ScrollTrigger.create({
        trigger: '#overview',
        start: 'top top',
        end: '+=700',
        pin: true,
        scrub: 1,
        anticipatePin: 1
    });

    gsap.to('.hero-art-stage', {
        scale: 1.15,
        y: -20,
        ease: 'none',
        scrollTrigger: {
            trigger: '#overview',
            start: 'top top',
            end: '+=700',
            scrub: 1
        }
    });

    gsap.to('.hero-specs-ribbon', {
        opacity: 0,
        y: -40,
        ease: 'none',
        scrollTrigger: {
            trigger: '#overview',
            start: 'top top',
            end: '+=350',
            scrub: 1
        }
    });

    gsap.to('.hero-scroll-cue', {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
            trigger: '#overview',
            start: 'top top',
            end: '+=200',
            scrub: 1
        }
    });

    // 2. Staggered Entrance cho các khối nội dung (.gsap-reveal)
    var revealElements = gsap.utils.toArray('.gsap-reveal');
    revealElements.forEach(function (el) {
        gsap.fromTo(el,
            {
                opacity: 0,
                y: 50,
                scale: 0.96
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.85,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // 3. Hiệu ứng làm đầy thanh kỹ năng khi cuộn tới Bento Box kỹ thuật
    var meterFills = document.querySelectorAll('.meter-fill');
    ScrollTrigger.create({
        trigger: '.bento-item-wide',
        start: 'top 80%',
        onEnter: function () {
            meterFills.forEach(function (fill) {
                var targetWidth = fill.style.width;
                fill.style.width = '0%';
                setTimeout(function () {
                    fill.style.width = targetWidth;
                }, 100);
            });
        }
    });
}

/* ==================== 5. FORM LIÊN HỆ — VALIDATE JS THUẦN ==================== */
function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    function showError(inputEl, errorEl, msg) {
        inputEl.classList.add('input-error');
        errorEl.textContent = msg;
    }

    function clearError(inputEl, errorEl) {
        inputEl.classList.remove('input-error');
        errorEl.textContent = '';
    }

    function isValidEmail(email) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var nameInput    = document.getElementById('contactName');
        var emailInput   = document.getElementById('contactEmail');
        var messageInput = document.getElementById('contactMessage');
        var nameError    = document.getElementById('nameError');
        var emailError   = document.getElementById('emailError');
        var messageError = document.getElementById('messageError');
        var successBox   = document.getElementById('formSuccess');

        var nameVal    = nameInput.value.trim();
        var emailVal   = emailInput.value.trim();
        var messageVal = messageInput.value.trim();
        var hasError   = false;

        // Clear previous
        clearError(nameInput, nameError);
        clearError(emailInput, emailError);
        clearError(messageInput, messageError);
        successBox.textContent = '';

        // Validate họ tên
        if (nameVal === '') {
            showError(nameInput, nameError, 'Vui lòng nhập họ và tên của bạn.');
            hasError = true;
        }

        // Validate email
        if (emailVal === '') {
            showError(emailInput, emailError, 'Vui lòng nhập địa chỉ email.');
            hasError = true;
        } else if (!isValidEmail(emailVal)) {
            showError(emailInput, emailError, 'Email không hợp lệ. Vui lòng nhập đúng định dạng (có @).');
            hasError = true;
        }

        // Validate lời nhắn
        if (messageVal === '') {
            showError(messageInput, messageError, 'Vui lòng nhập nội dung lời nhắn.');
            hasError = true;
        }

        // Nếu không có lỗi → thông báo thành công
        if (!hasError) {
            successBox.textContent = '✓ Đã gửi thành công! Cảm ơn bạn đã liên hệ với Trần Ngọc Lâm.';
            form.reset();
            // Xóa thông báo sau 5 giây
            setTimeout(function () {
                successBox.textContent = '';
            }, 5000);
        }
    });

    // Real-time clear error khi người dùng gõ
    var fields = [
        { input: document.getElementById('contactName'),    error: document.getElementById('nameError')    },
        { input: document.getElementById('contactEmail'),   error: document.getElementById('emailError')   },
        { input: document.getElementById('contactMessage'), error: document.getElementById('messageError') }
    ];
    fields.forEach(function (field) {
        if (field.input) {
            field.input.addEventListener('input', function () {
                clearError(field.input, field.error);
            });
        }
    });
}

/* ==================== 6. DARK / LIGHT MODE TOGGLE ==================== */
function initDarkModeToggle() {
    var btn   = document.getElementById('darkModeToggle');
    var icon  = document.getElementById('darkModeIcon');
    var label = document.getElementById('darkModeLabel');
    var body  = document.body;

    if (!btn) return;

    // Lấy trạng thái đã lưu từ localStorage
    var savedMode = localStorage.getItem('tnl-color-mode');
    if (savedMode === 'light') {
        enableLightMode();
    }

    btn.addEventListener('click', function () {
        if (body.classList.contains('light-mode')) {
            enableDarkMode();
        } else {
            enableLightMode();
        }
    });

    function enableLightMode() {
        body.classList.remove('mi-style-dark');
        body.classList.add('light-mode');
        icon.className  = 'fas fa-moon';
        label.textContent = 'Dark Mode';
        localStorage.setItem('tnl-color-mode', 'light');
    }

    function enableDarkMode() {
        body.classList.remove('light-mode');
        body.classList.add('mi-style-dark');
        icon.className  = 'fas fa-sun';
        label.textContent = 'Light Mode';
        localStorage.setItem('tnl-color-mode', 'dark');
    }
}
