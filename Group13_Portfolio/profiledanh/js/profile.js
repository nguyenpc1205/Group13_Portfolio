/**
 * Portfolio Mai Hoàng Danh — Interactive JavaScript
 * Chức năng:
 * 1. Menu Mobile đóng/mở & tự động đóng khi chọn mục
 * 2. Chuyển đổi chủ đề Dark / Light (mặc định Dark) lưu vào localStorage
 * 3. Sao chép email vào Clipboard + thông báo Toast
 * 4. Kiểm tra dữ liệu biểu mẫu liên hệ (Validation) & mở Mailto
 * 5. Hiệu ứng cuộn trang (Scroll Spy, Reveal on Scroll, Scroll Progress Bar)
 */

document.addEventListener("DOMContentLoaded", () => {
  const htmlEl = document.documentElement;
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-links a");
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const themeLabel = document.getElementById("themeLabel");
  const copyEmailBtn = document.getElementById("copyEmailBtn");
  const toastEl = document.getElementById("toast");
  const currentYearEl = document.getElementById("currentYear");
  const scrollProgressEl = document.getElementById("scrollProgress");
  const contactForm = document.getElementById("contactForm");

  // Cập nhật năm hiện tại ở Footer
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // Hàm hiển thị thông báo Toast
  let toastTimeout;
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastEl.classList.remove("show");
    }, 3200);
  }

  // 1. Quản lý Theme (Mặc định: dark)
  const savedTheme = localStorage.getItem("danh_portfolio_theme") || "dark";
  applyTheme(savedTheme);

  function applyTheme(theme) {
    htmlEl.setAttribute("data-theme", theme);
    if (themeIcon && themeLabel) {
      if (theme === "light") {
        themeIcon.textContent = "☀️";
        themeLabel.textContent = "Light";
      } else {
        themeIcon.textContent = "🌙";
        themeLabel.textContent = "Dark";
      }
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = htmlEl.getAttribute("data-theme") || "dark";
      const nextTheme = current === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      localStorage.setItem("danh_portfolio_theme", nextTheme);
      showToast(
        nextTheme === "dark"
          ? "Đã chuyển sang giao diện Tối (Dark Mode)"
          : "Đã chuyển sang giao diện Sáng (Light Mode)"
      );
    });
  }

  // 2. Menu điều hướng trên thiết bị di động
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      menuToggle.classList.toggle("open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        menuToggle.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 3. Chức năng sao chép địa chỉ Email
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", async () => {
      const email = copyEmailBtn.getAttribute("data-email") || "danh14102006@gmail.com";
      try {
        await navigator.clipboard.writeText(email);
        showToast("Đã sao chép email: " + email);
      } catch (err) {
        // Fallback nếu trình duyệt chặn clipboard API
        const tempInput = document.createElement("input");
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        showToast("Đã sao chép email: " + email);
      }
    });
  }

  // 4. Kiểm tra dữ liệu Form liên hệ (Validation) & gửi qua Mailto
  if (contactForm) {
    const nameInput = document.getElementById("senderName");
    const emailInput = document.getElementById("senderEmail");
    const subjectInput = document.getElementById("senderSubject");
    const messageInput = document.getElementById("senderMessage");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const subjectError = document.getElementById("subjectError");
    const messageError = document.getElementById("messageError");
    const formStatus = document.getElementById("formStatus");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(inputEl, errorEl, message) {
      if (!inputEl || !errorEl) return;
      if (message) {
        inputEl.classList.add("input-error");
        errorEl.textContent = message;
      } else {
        inputEl.classList.remove("input-error");
        errorEl.textContent = "";
      }
    }

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;

      const nameVal = nameInput.value.trim();
      const emailVal = emailInput.value.trim();
      const subjectVal = subjectInput.value.trim();
      const messageVal = messageInput.value.trim();

      if (nameVal.length < 2) {
        setError(nameInput, nameError, "Vui lòng nhập họ và tên (tối thiểu 2 ký tự).");
        isValid = false;
      } else {
        setError(nameInput, nameError, "");
      }

      if (!emailRegex.test(emailVal)) {
        setError(emailInput, emailError, "Vui lòng nhập địa chỉ email hợp lệ.");
        isValid = false;
      } else {
        setError(emailInput, emailError, "");
      }

      if (subjectVal.length < 3) {
        setError(subjectInput, subjectError, "Vui lòng nhập tiêu đề liên hệ (tối thiểu 3 ký tự).");
        isValid = false;
      } else {
        setError(subjectInput, subjectError, "");
      }

      if (messageVal.length < 10) {
        setError(messageInput, messageError, "Nội dung tin nhắn cần tối thiểu 10 ký tự.");
        isValid = false;
      } else {
        setError(messageInput, messageError, "");
      }

      if (!isValid) {
        if (formStatus) {
          formStatus.style.color = "var(--danger)";
          formStatus.textContent = "Vui lòng kiểm tra lại các trường báo lỗi phía trên.";
        }
        showToast("Vui lòng điền đầy đủ và đúng thông tin liên hệ.");
        return;
      }

      // Tạo liên kết mailto chuẩn xác
      const receiver = "danh14102006@gmail.com";
      const mailSubject = encodeURIComponent("[Portfolio Liên hệ] " + subjectVal);
      const mailBody = encodeURIComponent(
        "Người gửi: " + nameVal + "\n" +
        "Email liên hệ: " + emailVal + "\n\n" +
        "Nội dung:\n" + messageVal
      );

      if (formStatus) {
        formStatus.style.color = "var(--success)";
        formStatus.textContent = "Hợp lệ! Đang mở ứng dụng Email (Mailto)...";
      }
      showToast("Đang mở ứng dụng gửi email...");
      window.location.href = `mailto:${receiver}?subject=${mailSubject}&body=${mailBody}`;
    });
  }

  // 5. Hiệu ứng xuất hiện khi cuộn (IntersectionObserver) & Scroll Spy
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("visible"));
  }

  // Thanh tiến trình cuộn & cập nhật mục menu đang xem
  const sections = document.querySelectorAll("main section[id]");
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollProgressEl && docHeight > 0) {
      const pct = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
      scrollProgressEl.style.width = pct + "%";
    }

    let currentSectionId = "";
    sections.forEach((sec) => {
      const top = sec.offsetTop - 140;
      if (scrollTop >= top) {
        currentSectionId = sec.getAttribute("id");
      }
    });

    if (currentSectionId) {
      navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (href === "#" + currentSectionId) {
          link.classList.add("active");
        } else if (!link.classList.contains("nav-contact")) {
          link.classList.remove("active");
        }
      });
    }
  });
});
