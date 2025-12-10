// ========== الإعدادات العامة ==========
const WA_MAIN = "2011556062656"; // رقم الواتساب الرئيسي بتاع الخالد تك

// نضمن إن الكود يشتغل بعد تحميل الـ DOM
document.addEventListener("DOMContentLoaded", () => {
  // ========== 1) NAVBAR BURGER للموبايل ==========
  const burger = document.getElementById("ekBurger");
  const menu = document.getElementById("ekMenu");

  if (burger && menu) {
    burger.addEventListener("click", () => {
      menu.classList.toggle("show");
    });

    // قفل المنيو لما أختار لينك في الموبايل
    menu.querySelectorAll(".ek-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 980) {
          menu.classList.remove("show");
        }
      });
    });
  }

  // ========== 2) أزرار واتساب للمنتجات (الهوم) ==========
  // أزرار طلب واتساب للمنتجات - سواء class="wh-btn" أو data-product
  const waButtons = document.querySelectorAll(".wh-btn, .btn.btn-primary[data-product]");

  waButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // لو A مش لازم نمنع، لو Button ممكن نمنع الافتراضي
      if (btn.tagName.toLowerCase() === "button") {
        e.preventDefault();
      }

      const product =
        btn.dataset.product ||
        btn.getAttribute("data-product") ||
        "منتج من عروض الخالد تك";

      const name = prompt("أدخل اسمك (اختياري):") || "";
      const phone = prompt("رقم للتواصل (مهم):") || "";

      const msg = مرحبًا، أريد طلب: ${product}\nالاسم: ${name}\nالهاتف: ${phone};
      const url =
        "https://api.whatsapp.com/send?phone=" +
        WA_MAIN +
        "&text=" +
        encodeURIComponent(msg);

      window.open(url, "_blank");
    });
  });

  // ========== 3) فورم الطلب الرئيسي -> واتساب (الهوم) ==========
  const orderForm = document.getElementById("orderFormMain");
  if (orderForm) {
    orderForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("fullName")?.value.trim() || "";
      const phone = document.getElementById("phoneNumber")?.value.trim() || "";
      const email = document.getElementById("emailAddr")?.value.trim() || "";
      const address = document.getElementById("address")?.value.trim() || "";
      const product = document.getElementById("productName")?.value.trim() || "";

      const productTypeEl = document.getElementById("productType");
      const contactMethodEl = document.getElementById("contactMethod");

      const productType = productTypeEl ? productTypeEl.value : "غير محدد";
      const contactMethod = contactMethodEl
        ? contactMethodEl.value
        : "أي طريقة متاحة";

      const msg =
        "طلب من موقع الخالد تك:\n" +
        المنتج: ${product} (${productType})\n +
        الاسم: ${name}\n +
        الهاتف: ${phone}\n +
        البريد: ${email}\n +
        طريقة التواصل المفضلة: ${contactMethod}\n +
        العنوان: ${address};

      const url =
        "https://api.whatsapp.com/send?phone=" +
        WA_MAIN +
        "&text=" +
        encodeURIComponent(msg);

      window.open(url, "_blank");
    });
  }

  // ========== 4) REVEAL ON SCROLL (كل الصفحات) ==========
  function revealOnScroll() {
    const elements = document.querySelectorAll(
      [
        ".product-card",
        ".offer-card",
        ".about-content",
        ".founder-img",
        ".why-card",
        ".testimonial-card",
        ".service-card",
        ".step-card",
        ".services-hero-card",
        ".about-section",
        ".about-stat-card",
        ".founder-card",
      ].join(", ")
    );

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) {
        el.classList.add("visible");
      }
    });
  }

  window.addEventListener("scroll", revealOnScroll);
  window.addEventListener("load", revealOnScroll);
  revealOnScroll(); // استدعاء مرة في الأول

  // ========== 5) SCROLL TO TOP BUTTON ==========
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
  window.addEventListener("scroll", handleScrollTop);
  window.addEventListener("load", handleScrollTop);
  handleScrollTop();

  // ========== 6) DARK MODE (زرين: في النافبار + العائم) ==========
  const bodyEl = document.body;
  const themeButtons = document.querySelectorAll(
    "#darkModeToggle, #darkModeToggleNav"
  );

  // تطبيق الثيم المحفوظ
  if (localStorage.getItem("theme") === "dark") {
    bodyEl.classList.add("dark-mode");
    themeButtons.forEach((btn) => (btn.textContent = "☀"));
  } else {
    themeButtons.forEach((btn) => (btn.textContent = "🌙"));
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

  // ========== 7) اختيار خدمة + زر واتساب (صفحة Services) ==========
  (function initServicesPage() {
    const serviceCards = document.querySelectorAll(".service-card[data-service]");
    const panel = document.getElementById("serviceContactPanel");
    const titleEl = document.getElementById("selectedServiceTitle");
    const textEl = document.getElementById("selectedServiceText");
    const waBtn = document.getElementById("serviceWhatsAppBtn");

    if (!serviceCards.length || !panel || !titleEl || !textEl || !waBtn) {
      return; // لو مش في صفحة الخدمات أو العناصر مش موجودة
    }

    let selectedService = null;

    serviceCards.forEach((card) => {
      card.addEventListener("click", () => {
        selectedService = card.dataset.service || card.textContent.trim();

        // شيل التحديد من كل الكروت
        serviceCards.forEach((c) => c.classList.remove("selected"));

        // حدّد الكارت الحالي
        card.classList.add("selected");

        // حدّث نص البانِل
        titleEl.textContent = "الخدمة المختارة: " + selectedService;
        textEl.textContent =
          "اضغط على الزر بالأسفل للتواصل معنا مباشرة على واتساب بخصوص هذه الخدمة.";

        // فعّل الزر
        waBtn.disabled = false;

        // سكرول للبانِل
        panel.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });

    waBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!selectedService) return;

      const msg =
        "مرحبًا، أريد الاستفسار أو حجز خدمة: " + selectedService;
      const url =
        "https://api.whatsapp.com/send?phone=" +
        WA_MAIN +
        "&text=" +
        encodeURIComponent(msg);

      window.open(url, "_blank");
    });
  })();

  // ========== 8) تفعيل الأنيميشن في صفحة من نحن (about) ==========
  // (هو أصلاً داخل revealOnScroll، بس الجزء ده للتأكيد على أول تحميل)
  const aboutSections = document.querySelectorAll(
    ".about-section, .about-stat-card, .founder-card"
  );
  if (aboutSections.length) {
    revealOnScroll(); // نضمن إنها تظهر حتى لو الصفحة قصيرة
  }
});