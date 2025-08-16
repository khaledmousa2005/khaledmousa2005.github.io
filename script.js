// script.js - slider, per-offer countdowns (days:hh:mm:ss), whatsapp handlers, UX
(function(){
  // رقم الواتساب (دولي) - رقمك: 01156062656 -> +20 11556062656
  const WA = "2011556062656";

  /* TOP ALERT */
  const topAlertText = document.getElementById('topAlertText');
  const topMessages = [
    "🎉 خصم 20% على بعض الأجهزة — سارع الآن!",
    "🚚 شحن مجاني لأول 50 طلب كل يوم!",
    "🎓 خصم خاص للطلاب 20% (مع الكارنيه)!"
  ];
  let topIdx = 0;
  setInterval(()=> {
    topIdx = (topIdx + 1) % topMessages.length;
    topAlertText.textContent = topMessages[topIdx];
  }, 4500);

  document.getElementById('topAlertBtn').addEventListener('click', ()=> {
    const msg = encodeURIComponent("مرحبًا، أريد معرفة أحدث العروض المتاحة الآن.");
    window.open(https://wa.me/${WA}?text=${msg}, '_blank');
  });
  document.getElementById('scrollToOffers').addEventListener('click', ()=> {
    document.getElementById('offersSection').scrollIntoView({behavior:'smooth', block:'start'});
  });

  /* OFFERS SLIDER */
  const offersSlider = document.getElementById('offersSlider');
  const offerCards = Array.from(offersSlider.querySelectorAll('.offer-card'));
  const prevBtn = document.getElementById('prevOffer');
  const nextBtn = document.getElementById('nextOffer');
  let current = 0;

  function showOffer(i){
    current = (i + offerCards.length) % offerCards.length;
    offerCards.forEach((c, idx)=> {
      c.classList.toggle('visible', idx === current);
      // keep horizontal order for layout (not strictly necessary)
      c.style.order = idx - current;
    });
  }
  showOffer(0);

  prevBtn.addEventListener('click', ()=> { showOffer(current - 1); resetAuto(); });
  nextBtn.addEventListener('click', ()=> { showOffer(current + 1); resetAuto(); });

  let autoSlide = setInterval(()=> showOffer(current + 1), 7000);
  function resetAuto(){ clearInterval(autoSlide); autoSlide = setInterval(()=> showOffer(current + 1), 7000); }

  /* Per-offer countdowns using data-duration-mins (each relative to now).
     Format: X يوم : HH:MM:SS
  */
  const countdownIntervals = [];
  offerCards.forEach((card, idx) => {
    const attr = card.getAttribute('data-duration-mins') || card.getAttribute('data-duration-minutes') || card.dataset.durationMins || card.dataset.durationMinutes;
    const minutes = parseInt(attr || 1440, 10); // default 24h
    const endTime = Date.now() + minutes * 60 * 1000;
    const timerEl = card.querySelector('.offer-timer');

    function update() {
      const diff = endTime - Date.now();
      if (diff <= 0) {
        timerEl.textContent = "انتهى العرض";
        clearInterval(countdownIntervals[idx]);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      timerEl.textContent = ${days} يوم : ${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')};
    }
    update();
    countdownIntervals[idx] = setInterval(update, 1000);
  });

  // Global countdown (24h example)
  (function globalCountdown(){
    const el = document.getElementById('globalCountdown');
    const end = Date.now() + (24 * 60 * 60 * 1000);
    const iv = setInterval(()=> {
      const diff = end - Date.now();
      if (diff <= 0) { el.textContent = "00:00:00"; clearInterval(iv); return; }
      const hrs = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      el.textContent = ${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')};
    }, 1000);
  })();

  /* Offer CTA buttons -> open WA with offer title */
  document.querySelectorAll('.offer-cta').forEach((btn, idx) => {
    btn.addEventListener('click', ()=> {
      const offerCard = offerCards[idx];
      const title = offerCard.querySelector('h3')?.textContent || 'عرض خاص';
      const msg = encodeURIComponent(مرحبًا، أريد الاستفادة من العرض: ${title});
      window.open(https://wa.me/${WA}?text=${msg}, '_blank');
    });
  });

  /* Product WA buttons */
  document.querySelectorAll('.wh-btn').forEach(btn => {
    btn.addEventListener('click', ()=> {
      const product = btn.dataset.product || btn.getAttribute('data-product') || 'منتج';
      const name = prompt('أدخل اسمك (اختياري):') || '';
      const phone = prompt('رقم للتواصل (مهم):') || '';
      const msg = encodeURIComponent(مرحبًا، أريد طلب ${product}\nالاسم: ${name}\nالهاتف: ${phone});
      window.open(https://wa.me/${WA}?text=${msg}, '_blank');
    });
  });

  /* Order form -> WA summary */
  const orderForm = document.getElementById('orderFormMain');
  if (orderForm) {
    orderForm.addEventListener('submit', function(e){
      e.preventDefault();
      const name = document.getElementById('fullName').value.trim();
      const phone = document.getElementById('phoneNumber').value.trim();
      const email = document.getElementById('emailAddr').value.trim();
      const address = document.getElementById('address').value.trim();
      const product = document.getElementById('productName').value.trim();
      const msg = encodeURIComponent(طلب من الموقع:\nالمنتج: ${product}\nالاسم: ${name}\nالهاتف: ${phone}\nالبريد: ${email}\nالعنوان: ${address});
      window.open(https://wa.me/${WA}?text=${msg}, '_blank');
    });
  }

  /* Welcome message */
  const welcomeBtn = document.getElementById('welcomeBtn');
  const welcomeMessage = document.getElementById('welcomeMessage');
  welcomeBtn.addEventListener('click', ()=> {
    welcomeMessage.textContent = 'أهلاً! لو محتاج أي مساعدة ابعتلنا على الواتساب أو اختار منتج واطلبه فوراً!';
    welcomeMessage.classList.add('show');
    setTimeout(()=> welcomeMessage.classList.remove('show'), 6000);
  });

  /* Reveal on scroll */
  const revealList = Array.from(document.querySelectorAll('.product-card, .offer-card, .about-content, .founder-img'));
  function reveal() {
    revealList.forEach(el=>{
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - 80) el.classList.add('visible');
    });
  }
  window.addEventListener('scroll', reveal);
  reveal();

})();

let slides = document.querySelectorAll(".slide");
let dots = document.querySelectorAll(".dot");
let index = 0;

function showSlide(n) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    dots[i].classList.remove("active");
    if (i === n) {
      slide.classList.add("active");
      dots[i].classList.add("active");
    }
  });
}

// function nextSlide() {
//   index = (index + 1) % slides.length;
//   showSlide(index);
// }

// setInterval(nextSlide, 4000); // كل 4 ثواني يتغير السلايد

// dots.forEach((dot, i) => {
//   dot.addEventListener("click", () => {
//     index = i;
//     showSlide(index);
//   });
// });
