// ==========================================
// 1. THREE.JS - NỀN KHÔNG GIAN HẠT 3D ĐỘNG
// ==========================================
const init3DBackground = () => {
    const canvas = document.querySelector('#bg3d');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Tạo 2500 hạt không gian 3D
    const particlesCount = 2500;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 15;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.025,
        color: 0x00d2ff,
        transparent: true,
        opacity: 0.75
    });

    const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleMesh);

    // Tương tác chuột
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    // Render loop
    const animate = () => {
        requestAnimationFrame(animate);
        particleMesh.rotation.y += 0.0015;
        particleMesh.rotation.x += (mouseY * 0.3 - particleMesh.rotation.x) * 0.05;
        particleMesh.rotation.y += (mouseX * 0.3 - particleMesh.rotation.y) * 0.05;
        renderer.render(scene, camera);
    };
    animate();

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// ==========================================
// 2. CHỨC NĂNG TƯƠNG TÁC 3D CARD TILT
// ==========================================
const init3DTiltCards = () => {
    const cards = document.querySelectorAll('.card-3d');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 8;
            const rotateY = (centerX - x) / 8;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });
};

// ==========================================
// 3. DARK / LIGHT MODE TOGGLE
// ==========================================
const initThemeToggle = () => {
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        themeBtn.textContent = isLight ? '☀️ Light Mode' : '🌙 Dark Mode';
    });
};

// ==========================================
// 4. MOBILE MENU TOGGLE
// ==========================================
const initMobileMenu = () => {
    const menuBtn = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
};

// ==========================================
// 5. VALIDATION FORM LIÊN HỆ
// ==========================================
const initFormValidation = () => {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Lấy giá trị
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const msgInput = document.getElementById('message');

        const nameErr = document.getElementById('name-error');
        const emailErr = document.getElementById('email-error');
        const msgErr = document.getElementById('message-error');

        // Reset lỗi
        nameErr.textContent = '';
        emailErr.textContent = '';
        msgErr.textContent = '';
        status.textContent = '';

        let isValid = true;

        // Validation Tên
        if (nameInput.value.trim() === '') {
            nameErr.textContent = 'Vui lòng nhập họ và tên!';
            isValid = false;
        }

        // Validation Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            emailErr.textContent = 'Email không hợp lệ!';
            isValid = false;
        }

        // Validation Lời nhắn
        if (msgInput.value.trim().length < 10) {
            msgErr.textContent = 'Lời nhắn phải có tối thiểu 10 ký tự!';
            isValid = false;
        }

        // Nếu hợp lệ
        if (isValid) {
            status.style.color = '#00d2ff';
            status.textContent = '🎉 Cảm ơn bạn! Tin nhắn đã được gửi thành công.';
            form.reset();
        }
    });
};

// ==========================================
// KÍCH HOẠT KHI TRANG TẢI XONG
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    init3DBackground();
    init3DTiltCards();
    initThemeToggle();
    initMobileMenu();
    initFormValidation();
});