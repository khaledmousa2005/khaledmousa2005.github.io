// script.js - slider, per-offer countdowns, WhatsApp handlers, UX
(function () {
  // رقم الواتساب (دولي) - رقمك: 01156062656 -> +20 1156062656 (مكتوب في الكومنت بتاعك)
  const WA = "2011556062656";

  /* TOP ALERT (لو موجودة في الصفحة) */
  const topAlertText = document.getElementById("topAlertText");
  const topAlertBtn = document.getElementById("topAlertBtn");
  const scrollToOffersBtn = document.getElementById("scrollToOffers");

  const topMessages = [
    "🎉 خصم 20% على بعض الأجهزة — سارع الآن!",
    "🚚 شحن مجاني لأول 50 طلب كل يوم!",
    "🎓 خصم خاص للطلاب 20% (مع الكارنيه)!",
  ];

  if (topAlertText) {
    let topIdx = 0;
    setInterval(() => {
      topIdx = (topIdx + 1) % topMessages.length;
      topAlertText.textContent = topMessages[topIdx];
    }, 4500);
  }

  if (topAlertBtn) {
    topAlertBtn.addEventListener("click", () => {
      const msg = encodeURIComponent(
        "مرحبًا، أريد معرفة أحدث العروض المتاحة الآن."
      );
      window.open(https://wa.me/${WA}?text=${msg}, "_blank");
    });
  }

  if (scrollToOffersBtn) {
    scrollToOffersBtn.addEventListener("click", () => {
      const offersSection = document.getElementById("offersSection");
      if (offersSection) {
        offersSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  /* OFFERS SLIDER (لو استخدمت عنصر offersSlider و offer-card) */
  const offersSlider = document.getElementById("offersSlider");

  if (offersSlider) {
    const offerCards = Array.from(
      offersSlider.querySelectorAll(".offer-card")
    );
    const prevBtn = document.getElementById("prevOffer");
    const nextBtn = document.getElementById("nextOffer");
    let current = 0;

    function showOffer(i) {
      current = (i + offerCards.length) % offerCards.length;
      offerCards.forEach((c, idx) => {
        c.classList.toggle("visible", idx === current);
        c.style.order = idx - current;
      });
    }

    if (offerCards.length > 0) {
      showOffer(0);
    }

    function resetAuto() {
      clearInterval(autoSlide);
      autoSlide = setInterval(() => showOffer(current + 1), 7000);
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        showOffer(current - 1);
        resetAuto();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        showOffer(current + 1);
        resetAuto();
      });
    }

    let autoSlide = setInterval(() => showOffer(current + 1), 7000);

    /* Per-offer countdowns */
    const countdownIntervals = [];
    offerCards.forEach((card, idx) => {
      const attr =
        card.getAttribute("data-duration-mins") ||
        card.getAttribute("data-duration-minutes") ||
        card.dataset.durationMins ||
        card.dataset.durationMinutes;

      const minutes = parseInt(attr || 1440, 10); // default 24h
      const endTime = Date.now() + minutes * 60 * 1000;
      const timerEl = card.querySelector(".offer-timer");

      if (!timerEl) return;

      function update() {
        const diff = endTime - Date.now();
        if (diff <= 0) {
          timerEl.textContent = "انتهى العرض";
          clearInterval(countdownIntervals[idx]);
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hrs = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        timerEl.textContent = `${days} يوم : ${String(hrs).padStart(
          2,
          "0"
        )}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
      }

      update();
      countdownIntervals[idx] = setInterval(update, 1000);
    });

    /* Offer CTA buttons -> open WA with offer title */
    document.querySelectorAll(".offer-cta").forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        const offerCard = offerCards[idx];
        const title =
          offerCard?.querySelector("h3")?.textContent || "عرض خاص";
        const msg = encodeURIComponent(
          مرحبًا، أريد الاستفادة من العرض: ${title}
        );
        window.open(https://wa.me/${WA}?text=${msg}, "_blank");
      });
    });

    /* Global countdown (24h مثال) */
    (function globalCountdown() {
      const el = document.getElementById("globalCountdown");
      if (!el) return;
      const end = Date.now() + 24 * 60 * 60 * 1000;
      const iv = setInterval(() => {
        const diff = end - Date.now();
        if (diff <= 0) {
          el.textContent = "00:00:00";
          clearInterval(iv);
          return;
        }
        const hrs = Math.floor(diff / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        el.textContent = `${String(hrs).padStart(2, "0")}:${String(
          mins
        ).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
      }, 1000);
    })();
  }

  /* Product WA buttons (اللي عليها كلاس wh-btn) */
  document.querySelectorAll(".wh-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // لو الزرار رابط خارجي ما نمنعش دايفولت
      e.preventDefault();

      const product =
        btn.dataset.product ||
        btn.getAttribute("data-product") ||
        "منتج من عروض الخالد تك";

      const name = prompt("أدخل اسمك (اختياري):") || "";
      const phone = prompt("رقم للتواصل (مهم):") || "";

      const msg = encodeURIComponent(
        مرحبًا، أريد طلب ${product}\nالاسم: ${name}\nالهاتف: ${phone}
      );
      window.open(https://wa.me/${WA}?text=${msg}, "_blank");
    });
  });

  /* Order form -> WhatsApp summary */
  const orderForm = document.getElementById("orderFormMain");
  if (orderForm) {
    orderForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("fullName").value.trim();
      const phone = document.getElementById("phoneNumber").value.trim();
      const email = document.getElementById("emailAddr").value.trim();
      const address = document.getElementById("address").value.trim();
      const product = document.getElementById("productName").value.trim();

      const msg = encodeURIComponent(
        طلب من الموقع:\nالمنتج: ${product}\nالاسم: ${name}\nالهاتف: ${phone}\nالبريد: ${email}\nالعنوان: ${address}
      );

      window.open(https://wa.me/${WA}?text=${msg}, "_blank");
    });
  }

  /* Welcome message (لو استخدمته) */
  const welcomeBtn = document.getElementById("welcomeBtn");
  const welcomeMessage = document.getElementById("welcomeMessage");

  if (welcomeBtn && welcomeMessage) {
    welcomeBtn.addEventListener("click", () => {
      welcomeMessage.textContent =
        "أهلاً! لو محتاج أي مساعدة ابعتلنا على الواتساب أو اختار منتج واطلبه فوراً!";
      welcomeMessage.classList.add("show");
      setTimeout(() => welcomeMessage.classList.remove("show"), 6000);
    });
  }

  /* Reveal on scroll (للكروت + صورة المؤسس) */
  const revealList = Array.from(
    document.querySelectorAll(".product-card, .offer-card, .about-content, .founder-img")
  );

  function reveal() {
    revealList.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - 80) el.classList.add("visible");
    });
  }

  window.addEventListener("scroll", reveal);
  reveal();

  /* Slider (لو ضفت elements باسم slide / dot) */
  let slides = document.querySelectorAll(".slide");
  let dots = document.querySelectorAll(".dot");
  let index = 0;

  function showSlide(n) {
    slides.forEach((slide, i) => {
      slide.classList.remove("active");
      if (dots[i]) dots[i].classList.remove("active");
      if (i === n) {
        slide.classList.add("active");
        if (dots[i]) dots[i].classList.add("active");
      }
    });
  }

  // جاهز لو حبيت تفعله بعدين
  // function nextSlide() {
  //   index = (index + 1) % slides.length;
  //   showSlide(index);
  // }
  // setInterval(nextSlide, 4000);

  // dots.forEach((dot, i) => {
  //   dot.addEventListener("click", () => {
  //     index = i;
  //     showSlide(index);
  //   });
  // });

  /* Dark Mode (يدعم الزر الأساسي وزر النافبار) */
  const bodyEl = document.body;
  const themeButtons = document.querySelectorAll(
    "#darkModeToggle, #darkModeToggleNav"
  );

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
})();
