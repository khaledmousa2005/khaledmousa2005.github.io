// script.js - UX, واتساب، داكن/فاتح، Scroll، Active Nav
(function () {
  // رقم الواتساب الرئيسي
  const WA = "2011556062656";

  /* ================== NAVBAR BURGER ================== */
  const burger = document.getElementById("ekBurger");
  const menu = document.getElementById("ekMenu");

  if (burger && menu) {
    burger.addEventListener("click", () => {
      menu.classList.toggle("show");
    });

    // إغلاق المنيو عند الضغط على لينك
    menu.querySelectorAll(".ek-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 980) {
          menu.classList.remove("show");
        }
      });
    });
  }

  /* ================== PRODUCT WHATSAPP BUTTONS ================== */
  // كل .wh-btn و كمان .btn.btn-primary لو عليها data-product
  const waButtons = document.querySelectorAll(".wh-btn, .btn.btn-primary[data-product]");

  waButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const product =
        btn.dataset.product ||
        btn.getAttribute("data-product") ||
        "منتج من عروض الخالد تك";

      const name = prompt("أدخل اسمك (اختياري):") || "";
      const phone = prompt("رقم للتواصل (مهم):") || "";

      const msg = encodeURIComponent(
        مرحبًا، أريد طلب: ${product}\nالاسم: ${name}\nالهاتف: ${phone}
      );
      window.open(https://wa.me/${WA}?text=${msg}, "_blank");
    });
  });

  /* ================== ORDER FORM -> WhatsApp ================== */
  const orderForm = document.getElementById("orderFormMain");
  if (orderForm) {
    orderForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("fullName").value.trim();
      const phone = document.getElementById("phoneNumber").value.trim();
      const email = document.getElementById("emailAddr").value.trim();
      const address = document.getElementById("address").value.trim();
      const product = document.getElementById("productName").value.trim();
      const productType = document.getElementById("productType").value;
      const contactMethod = document.getElementById("contactMethod").value;

      const msg = encodeURIComponent(
        طلب من موقع الخالد تك:\n +
        المنتج: ${product} (${productType})\n +
        الاسم: ${name}\n +
        الهاتف: ${phone}\n +
        البريد: ${email}\n +
        طريقة التواصل المفضلة: ${contactMethod}\n +
        العنوان: ${address}
      );

      window.open(https://wa.me/${WA}?text=${msg}, "_blank");
    });
  }

  /* ================== REVEAL ON SCROLL ================== */
  const revealList = Array.from(
    document.querySelectorAll(
      ".product-card, .offer-card, .about-content, .founder-img, .why-card, .testimonial-card"
    )
  );

  function reveal() {
    revealList.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - 80) el.classList.add("visible");
    });
  }

  /* ================== NAV ACTIVE ON SCROLL ================== */
  const sections = document.querySelectorAll("section[id], header[id]");
  const navLinks = document.querySelectorAll(".ek-menu .ek-link[href^='#']");

  function updateActiveNav() {
    let currentId = null;
    const scrollPos = window.scrollY || window.pageYOffset;

    sections.forEach((sec) => {
      const offsetTop = sec.offsetTop - 120; // شوية عشان الهيدر
      const offsetBottom = offsetTop + sec.offsetHeight;
      if (scrollPos >= offsetTop && scrollPos < offsetBottom) {
        currentId = sec.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const targetId = href && href.startsWith("#") ? href.slice(1) : null;
      if (targetId && targetId === currentId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  /* ================== SCROLL TO TOP BUTTON ================== */
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  function handleScrollTop() {
    if (!scrollTopBtn) return;
    const scrollPos = window.scrollY || window.pageYOffset;
    if (scrollPos > 300) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  }

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ================== DARK MODE (Nav + Floating) ================== */
  const bodyEl = document.body;
  const themeButtons = document.querySelectorAll(
    "#darkModeToggle, #darkModeToggleNav"
  );

  // تطبيق الثيم المحفوظ
  if (localStorage.getItem("theme") === "dark") {
    bodyEl.classList.add("dark-mode");
    themeButtons.forEach((btn) => (btn.textContent = "☀"));
  }

  themeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      bodyEl.classList.toggle("dark-mode");

      if (bodyEl.classList.contains("dark-mode")) {
        themeButtons.forEach((b) => (b.textContent = "☀"));
        localStorage.setItem("theme", "dark");
      } else {
        themeButtons.forEach((b) => (b.textContent = "🌙"));
        localStorage.setItem("theme", "light");
      }
    });
  });

  /* ================== SCROLL EVENTS ================== */
  function handleScroll() {
    reveal();
    updateActiveNav();
    handleScrollTop();
  }

  window.addEventListener("scroll", handleScroll);
  // أول ما الصفحة تفتح
  handleScroll();
})();