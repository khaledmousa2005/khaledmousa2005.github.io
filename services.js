// رقم الواتساب الرئيسي للموقع كله
const WA = "2011556062656";

/* ========== NAVBAR BURGER ========== */
const burger = document.getElementById("ekBurger");
const menu = document.getElementById("ekMenu");

if (burger && menu) {
  burger.addEventListener("click", () => {
    menu.classList.toggle("show");
  });

  // قفل المنيو لما تختار لينك في الموبايل
  menu.querySelectorAll(".ek-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 980) {
        menu.classList.remove("show");
      }
    });
  });
}

/* ========== PRODUCT WHATSAPP BUTTONS ========== */
// .wh-btn + .btn.btn-primary[data-product] من صفحة الهوم
const waButtons = document.querySelectorAll(".wh-btn, .btn.btn-primary[data-product]");

waButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    // لو الزرار داخل فورم ما نبطلش السبمت، إنما لو Button عادي نمنع
    if (btn.tagName.toLowerCase() === "a") {
      e.preventDefault();
    }
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

/* ========== ORDER FORM -> WhatsApp ========== */
// من صفحة الهوم (فورم الطلب)
const orderForm = document.getElementById("orderFormMain");
if (orderForm) {
  orderForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phoneNumber").value.trim();
    const email = document.getElementById("emailAddr").value.trim();
    const address = document.getElementById("address").value.trim();
    const product = document.getElementById("productName").value.trim();
    const productTypeEl = document.getElementById("productType");
    const contactMethodEl = document.getElementById("contactMethod");

    const productType = productTypeEl ? productTypeEl.value : "غير محدد";
    const contactMethod = contactMethodEl ? contactMethodEl.value : "أي طريقة متاحة";

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

/* ========== REVEAL ON SCROLL (عام + الخدمات) ========== */
function revealOnScroll() {
  const elements = document.querySelectorAll(
    ".product-card, .offer-card, .about-content, .founder-img, .why-card, .testimonial-card, .service-card, .step-card, .services-hero-card"
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

/* ========== NAV ACTIVE ON SCROLL (للهوم بس) ========== */
const sections = document.querySelectorAll("section[id], header[id]");
const navLinks = document.querySelectorAll(".ek-menu .ek-link[href^='#']");

function updateActiveNav() {
  let currentId = null;
  const scrollPos = window.scrollY || window.pageYOffset;

  sections.forEach((sec) => {
    const offsetTop = sec.offsetTop - 120;
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

window.addEventListener("scroll", updateActiveNav);
window.addEventListener("load", updateActiveNav);

/* ========== SCROLL TO TOP BUTTON ========== */
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

/* ========== DARK MODE (Nav + Floating) ========== */
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

/* ========== اختيار خدمة + زر واتساب مخصص (صفحة الخدمات) ========== */
(function () {
  const serviceCards = document.querySelectorAll(".service-card[data-service]");
  const panel = document.getElementById("serviceContactPanel");
  const titleEl = document.getElementById("selectedServiceTitle");
  const textEl = document.getElementById("selectedServiceText");
  const waBtn = document.getElementById("serviceWhatsAppBtn");

  // لو العناصر مش موجودة (زي صفحة الهوم) نخرج بهدوء
  if (!serviceCards.length || !panel || !waBtn) return;

  let selectedService = null;

  serviceCards.forEach((card) => {
    card.addEventListener("click", () => {
      // اسم الخدمة من data-service أو من النص
      selectedService = card.dataset.service || card.textContent.trim();

      // شيل التحديد من أي كارت تاني
      serviceCards.forEach((c) => c.classList.remove("selected"));
      // حدد الكارت الحالي
      card.classList.add("selected");

      // حدّث نص البانِل
      titleEl.textContent = الخدمة المختارة: ${selectedService};
      textEl.textContent =
        "اضغط على الزر بالأسفل للتواصل معنا مباشرة على واتساب بخصوص هذه الخدمة.";

      // فعل الزر بعد الاختيار
      waBtn.disabled = false;

      // سكرول بسيط للبانِل عشان يبقى باين قدام العميل
      panel.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  waBtn.addEventListener("click", () => {
    if (!selectedService) return;

    const msg = encodeURIComponent(
      مرحبًا، أريد الاستفسار أو حجز خدمة: ${selectedService}
    );

    window.open(https://wa.me/${WA}?text=${msg}, "_blank");
  });
})();