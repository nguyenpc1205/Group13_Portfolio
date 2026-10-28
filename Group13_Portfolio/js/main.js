document.addEventListener('DOMContentLoaded', function() {
    try {
        // 1. Mobile Menu Toggle
        var hamburger = document.querySelector('.hamburger');
        var navLinks = document.querySelector('.nav-links');

        if (hamburger && navLinks) {
            hamburger.addEventListener('click', function() {
                navLinks.classList.toggle('active');
            });
        }

        // 2. Intersection Observer: Hiệu ứng Burst Out từ 2 bên lề vào
        var observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -100px 0px"
        };

        var revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal');
                }
            });
        }, observerOptions);

        var revealItems = document.querySelectorAll('.burst-fade');
        revealItems.forEach(function(el) {
            revealObserver.observe(el);
        });

        // 3. Ultra-Smooth 60FPS Animation Loop (LERP Interpolation & Physics)
        var navbar = document.querySelector('.navbar');
        var orbs = document.querySelectorAll('.glow-orb');
        var neonProgress = document.getElementById('neonProgress');
        var membersSection = document.getElementById('members');
        var cubeLeft = document.getElementById('cubeLeft');
        var gyroRight = document.getElementById('gyroRight');

        // Biến điều khiển làm mịn 60fps
        var currentScrollY = window.scrollY || 0;
        var targetScrollY = window.scrollY || 0;
        var mouseX = 0, mouseY = 0;
        var targetMouseX = 0, targetMouseY = 0;
        var animTime = 0;

        window.addEventListener('scroll', function() {
            targetScrollY = window.scrollY;
        }, { passive: true });

        // Tương tác chuột làm mềm góc nhìn 3D
        window.addEventListener('mousemove', function(e) {
            targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        }, { passive: true });

        function update60FPS() {
            animTime += 0.016; // Tần số ~60FPS

            // Thuật toán LERP (Linear Interpolation) làm mịn cuộn chuột từ 30fps notch lên mượt 60fps
            currentScrollY += (targetScrollY - currentScrollY) * 0.085;
            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;

            var scrolled = currentScrollY;

            // 1. Navbar Glassmorphism
            if (navbar) {
                if (scrolled > 50) {
                    navbar.style.background = 'rgba(2, 2, 2, 0.95)';
                } else {
                    navbar.style.background = 'rgba(3, 3, 3, 0.85)';
                }
            }

            // 2. Chuyển đổi MÀU NỀN RGB lỏng mịn 60FPS
            var hue1 = (240 + scrolled * 0.38 + Math.sin(animTime * 0.6) * 5) % 360;
            if (hue1 < 0) hue1 += 360;
            var hue2 = (hue1 + 75) % 360;
            var hue3 = (hue1 + 150) % 360;
            var bgLightness = scrolled <= 10 ? (4 + scrolled * 1.4) : (18 + Math.sin(animTime * 0.8) * 1.2);
            var dynamicBgColor = 'hsl(' + hue1.toFixed(2) + ', 82%, ' + bgLightness.toFixed(2) + '%)';

            document.documentElement.style.setProperty('--bg-color', dynamicBgColor);
            document.body.style.backgroundColor = dynamicBgColor;
            document.documentElement.style.setProperty('--bg-hue-1', hue1.toFixed(2));
            document.documentElement.style.setProperty('--bg-hue-2', hue2.toFixed(2));
            document.documentElement.style.setProperty('--bg-hue-3', hue3.toFixed(2));
            document.documentElement.style.setProperty('--glow-hue', ((scrolled * 0.35) % 360).toFixed(2) + 'deg');

            // 3. Quầng sáng Parallax trôi nổi mượt mà
            orbs.forEach(function(orb, index) {
                var factor = (index + 1) * 0.08;
                var floatWobble = Math.sin(animTime * 1.2 + index) * 14;
                orb.style.transform = 'translate3d(0, ' + (scrolled * factor + floatWobble).toFixed(2) + 'px, 0)';
            });

            // 4. Khối 3D Cube & Gyroscope chuyển động mượt mà 60FPS
            if (cubeLeft) {
                var cubeRotX = 25 + scrolled * 0.18 + Math.sin(animTime * 1.8) * 8 + mouseY * 15;
                var cubeRotY = 35 + scrolled * 0.25 + Math.cos(animTime * 1.4) * 10 + mouseX * 20;
                var cubeFloatY = Math.sin(animTime * 2) * 12;
                cubeLeft.style.transform =
                    'translate3d(0, ' + cubeFloatY.toFixed(2) + 'px, 0) rotateX(' + cubeRotX.toFixed(2) + 'deg) rotateY(' + cubeRotY.toFixed(2) + 'deg)';
            }

            if (gyroRight) {
                var gyroRotX = scrolled * 0.16 + animTime * 22 + mouseY * 20;
                var gyroRotY = scrolled * 0.22 + animTime * 30 + mouseX * 25;
                var gyroFloatY = Math.cos(animTime * 1.6) * 10;
                gyroRight.style.transform =
                    'translate3d(0, ' + gyroFloatY.toFixed(2) + 'px, 0) rotateX(' + gyroRotX.toFixed(2) + 'deg) rotateY(' + gyroRotY.toFixed(2) + 'deg)';
            }

            // 5. Trục Neon lấp đầy từng pixel liên tục
            if (membersSection && neonProgress) {
                var sectionTop = membersSection.offsetTop;
                var sectionHeight = membersSection.offsetHeight;
                var windowHeight = window.innerHeight;
                var startDraw = sectionTop - windowHeight + 250;
                var endDraw = sectionTop + sectionHeight - windowHeight;

                var percentage = ((scrolled - startDraw) / Math.max(endDraw - startDraw, 1)) * 100;
                percentage = Math.max(0, Math.min(100, percentage));
                neonProgress.style.height = percentage.toFixed(2) + '%';
            }

            // Lặp lại chu kỳ 60FPS
            requestAnimationFrame(update60FPS);
        }

        requestAnimationFrame(update60FPS);

    } catch (e) {
        console.error("Lỗi JS:", e);
    }
});

// 4. Tương tác Avatar: Flip 720 -> Flash RGB -> Fade To Black -> Chuyển sang profile/lam.html
function handleAvatarClick(element, url) {
    if (element.classList.contains('avatar-animating')) return;
    element.classList.add('avatar-animating');

    var flash = document.createElement('div');
    flash.style.position = 'fixed'; flash.style.top = '0'; flash.style.left = '0';
    flash.style.width = '100vw'; flash.style.height = '100vh';

    var colors = ['#ff0055', '#00ffcc', '#ffea00', '#00ff00'];
    flash.style.background = colors[Math.floor(Math.random() * colors.length)];
    flash.style.opacity = '0'; flash.style.pointerEvents = 'none';
    flash.style.zIndex = '9998'; flash.style.mixBlendMode = 'color-dodge';
    flash.style.transition = 'opacity 0.1s';
    document.body.appendChild(flash);

    var blackOut = document.createElement('div');
    blackOut.style.position = 'fixed'; blackOut.style.top = '0'; blackOut.style.left = '0';
    blackOut.style.width = '100vw'; blackOut.style.height = '100vh';
    blackOut.style.background = '#000';
    blackOut.style.opacity = '0'; blackOut.style.pointerEvents = 'none';
    blackOut.style.zIndex = '9999';
    blackOut.style.transition = 'opacity 0.6s ease-in-out';
    document.body.appendChild(blackOut);

    setTimeout(function() {
        flash.style.opacity = '0.9';

        setTimeout(function() {
            blackOut.style.opacity = '1';

            setTimeout(function() {
                window.location.href = url || 'profile/lam.html';
            }, 600);
        }, 150);
    }, 400);
}
