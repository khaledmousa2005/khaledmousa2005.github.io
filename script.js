// script.js — مدمج ومصحح
(() => {
  // ---------- CONFIG ----------
  const MERCHANT_WA = "201156062656"; // رقم واتساب المطلوب (عدل لو تحتاج)
  // ---------- helpers ----------
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));
  const safeParse = (s, def) => { try { return JSON.parse(s); } catch(e){ return def; } };
  const CART_KEY = 'ec_cart';
  const formatNumber = v => Number(v || 0).toLocaleString('ar-EG');

  // ---------- navbar burger ----------
  const burger = $('#ekBurger'), menu = $('#ekMenu');
  if (burger && menu) {
    burger.addEventListener('click', () => menu.classList.toggle('show'));
    menu.querySelectorAll('.ek-link').forEach(link => link.addEventListener('click', () => {
      if (window.innerWidth <= 980) menu.classList.remove('show');
    }));
  }

  // ---------- reveal on scroll (simple) ----------
  const revealEls = $$(
    '.product-card, .offer-card, .about-content, .founder-img, .why-card, .testimonial-card'
  );
  const reveal = () => {
    revealEls.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - 80) el.classList.add('visible');
    });
  };

  // ---------- scroll to top btn ----------
  const scrollTopBtn = $('#scrollTopBtn');
  const handleScrollTop = () => {
    if (!scrollTopBtn) return;
    if ((window.pageYOffset || document.documentElement.scrollTop) > 300) scrollTopBtn.classList.add('show');
    else scrollTopBtn.classList.remove('show');
  };
  if (scrollTopBtn) scrollTopBtn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

  // ---------- dark mode toggle ----------
  const body = document.body;
  const darkToggle = $('#darkModeToggle');
  if (darkToggle) {
    if (localStorage.getItem('theme') === 'dark') body.classList.add('dark-mode');
    darkToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
      darkToggle.textContent = body.classList.contains('dark-mode') ? '☀' : '🌙';
    });
  }

  // ---------- WhatsApp product buttons (fixed templates) ----------
  const waButtons = Array.from(document.querySelectorAll('.wh-btn, .btn.btn-primary[data-product]'));
  waButtons.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    const product = btn.dataset.product || btn.getAttribute('data-product') || 'منتج من عروض الخالد تك';
    const name = prompt('أدخل اسمك (اختياري):') || '';
    const phone = prompt('رقم للتواصل (مهم):') || '';
    const msg = `مرحبًا، أريد طلب: ${product}\nالاسم: ${name}\nالهاتف: ${phone}`;
    window.open(`https://wa.me/${MERCHANT_WA}?text=${encodeURIComponent(msg)}`, '_blank');
  }));

  // ---------- Order form -> WhatsApp ----------
  const orderForm = $('#orderFormMain');
  if (orderForm) {
    orderForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const name = $('#fullName')?.value.trim() || '';
      const phone = $('#phoneNumber')?.value.trim() || '';
      const email = $('#emailAddr')?.value.trim() || '';
      const address = $('#address')?.value.trim() || '';
      const product = $('#productName')?.value.trim() || '';
      const productType = $('#productType')?.value || '';
      const contactMethod = $('#contactMethod')?.value || '';
      const msg = `طلب من موقع الخالد تك:\nالمنتج: ${product} (${productType})\nالاسم: ${name}\nالهاتف: ${phone}\nالبريد: ${email}\nطريقة التواصل: ${contactMethod}\nالعنوان: ${address}`;
      window.open(`https://wa.me/${MERCHANT_WA}?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }

  // ---------- CART (localStorage: ec_cart) ----------
  function getCart(){ return safeParse(localStorage.getItem(CART_KEY), []); }
  function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCartUI(); }
  function addToCart(item){
    if(!item || !item.id) return;
    const cart = getCart();
    const idx = cart.findIndex(i => i.id === item.id);
    if (idx > -1) cart[idx].qty = Math.min(99, Number(cart[idx].qty || 0) + Number(item.qty || 1));
    else cart.push({...item, qty: Number(item.qty || 1)});
    saveCart(cart);
  }
  function updateQty(i, q){
    const cart = getCart();
    if(!cart[i]) return;
    cart[i].qty = Math.max(1, Math.min(99, Number(q)));
    saveCart(cart);
  }
  function removeItem(i){
    const cart = getCart();
    if(!cart[i]) return;
    cart.splice(i,1);
    saveCart(cart);
  }
  function clearCart(){
    localStorage.removeItem(CART_KEY);
    updateCartUI();
  }
  // ---------- mini cart UI ----------
  const miniCart = $('#miniCart'), openCartBtn = $('#openCartBtn'), miniItems = $('#miniItems'), cartCountEl = $('#cartCount'), miniTotal = $('#miniTotal'), miniClose = $('#miniClose'), clearMini = $('#clearMini'), goCart = $('#goCart');
  function renderMini(){
    const cart = getCart();
    miniItems.innerHTML = '';
    if(!cart.length){
      miniItems.innerHTML = `<div style="padding:12px;color:#6b7280">السلة فارغة</div>`;
      cartCountEl.textContent = '0';
      miniTotal.textContent = 'الإجمالي: 0 جـ';
      return;
    }
    let total = 0;
    cart.forEach((it, idx) => {
      total += Number(it.price || 0) * Number(it.qty || 1);
      const item = document.createElement('div');
      item.className = 'item';
      item.innerHTML = `
        <img src="${escapeHtml(it.image||'')}" alt="${escapeHtml(it.title||'منتج')}">
        <div class="meta">
          <div style="font-weight:700">${escapeHtml(it.title)}</div>
          <div style="color:#6b7280;font-size:13px">${escapeHtml(it.attrs||'')}</div>
          <div style="margin-top:6px;font-weight:800">${formatNumber(it.price)} جـ × ${it.qty}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <button data-i="${idx}" class="miniQtyUp" style="padding:6px;border-radius:7px;border:none;background:#e6f3ff;cursor:pointer">+</button>
          <button data-i="${idx}" class="miniRemove" style="padding:6px;border-radius:7px;border:none;background:#fff0f0;cursor:pointer">حذف</button>
        </div>
      `;
      miniItems.appendChild(item);
    });
    cartCountEl.textContent = String(cart.reduce((s,i)=> s + Number(i.qty||0), 0));
    miniTotal.textContent = 'الإجمالي: ' + formatNumber(total) + ' جـ';
    // attach handlers
    miniItems.querySelectorAll('.miniQtyUp').forEach(b => b.addEventListener('click', (e)=> {
      const i = Number(b.dataset.i); const c = getCart(); c[i].qty = Number(c[i].qty||0) + 1; saveCart(c);
    }));
    miniItems.querySelectorAll('.miniRemove').forEach(b => b.addEventListener('click', (e)=> {
      const i = Number(b.dataset.i); if(!confirm('هل تريد حذف هذا المنتج؟')) return; removeItem(i);
    }));
  }
  function updateCartUI(){ renderMini(); }

  // escape helper
  function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

  // init mini cart listeners
  if(openCartBtn){
    openCartBtn.addEventListener('click', (e)=> {
      const isOpen = openCartBtn.getAttribute('aria-expanded') === 'true';
      if(isOpen){ miniCart.style.display = 'none'; openCartBtn.setAttribute('aria-expanded','false'); }
      else { renderMini(); miniCart.style.display = 'block'; openCartBtn.setAttribute('aria-expanded','true'); }
    });
  }
  if(miniClose) miniClose.addEventListener('click', ()=> { miniCart.style.display='none'; openCartBtn.setAttribute('aria-expanded','false'); });
  if(clearMini) clearMini.addEventListener('click', ()=> { if(confirm('افراغ السلة؟')) clearCart(); });
  if(goCart) goCart.addEventListener('click', ()=> { window.location.href = 'cart.html'; });

  // ---------- wire "Add to cart" buttons ----------
  // Support:
  // - buttons with class .add-to-cart and data attributes (data-id, data-title, data-price, data-image, data-attrs, data-qty)
  // - buttons with id="addCart" (single product) — take some data from DOM if data-* not present
  $$( '.add-to-cart, #addCart, .btn.btn-primary[data-product], .btn-primary[data-product]' ).forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // product info priority: data-* attrs, then nearest .product-card values
      const dataset = btn.dataset || {};
      let id = dataset.id || dataset.productId || dataset.product || btn.getAttribute('data-id') || `prod-${Date.now()}`;
      let title = dataset.title || dataset.product || btn.getAttribute('data-title') || btn.getAttribute('data-product') || (btn.closest('.product-card')?.querySelector('h3')?.textContent?.trim()) || 'منتج';
      let priceRaw = dataset.price || btn.getAttribute('data-price') || (btn.closest('.product-card')?.querySelector('.price')?.textContent?.replace(/[^\d.]/g,''));
      let price = Number((priceRaw||'').toString().replace(/,/g,'')||0);
      let image = dataset.image || btn.getAttribute('data-image') || btn.closest('.product-card')?.querySelector('img')?.getAttribute('src') || '';
      let attrs = dataset.attrs || btn.getAttribute('data-attrs') || '';
      let qty = Number(dataset.qty || btn.getAttribute('data-qty') || 1);

      // fallback: if btn id addCart and page has price element in product details
      if(btn.id === 'addCart') {
        // try to read price from nearest .price text
        const nearPrice = btn.closest('.product-card')?.querySelector('.price')?.textContent || document.querySelector('.price')?.textContent;
        if(!price) price = Number((nearPrice||'').toString().replace(/[^\d.]/g,'')||6200);
      }

      addToCart({ id: String(id), title: String(title), price: Number(price), image, attrs, qty: Number(qty) });
      // feedback
      btn.disabled = true;
      const old = btn.textContent;
      btn.textContent = 'تم الإضافة ✓';
      setTimeout(()=> { btn.textContent = old; btn.disabled = false; }, 1200);
    });
  });

  // ---------- checkout via WA from mini cart or full cart (opens WA message) ----------
  // If you want a separate "checkout" button in header, you can call checkoutViaWA()
  function checkoutViaWA(){
    const cart = getCart();
    if(!cart.length){ alert('السلة فارغة'); return; }
    const name = $('#fullName')?.value?.trim() || '';
    const phone = $('#phoneNumber')?.value?.trim() || '';
    const address = $('#address')?.value?.trim() || '';
    const gov = $('#govSelect')?.value || '';
    const center = $('#centerSelect')?.value || '';
    const lines = cart.map(i => `${i.title} x${i.qty} — ${formatNumber(i.price)} ج`).join('\n');
    const subtotal = cart.reduce((s,i)=> s + Number(i.price||0)*Number(i.qty||1), 0);
    const shipping = Number( ($('#shippingCostView')?.textContent?.replace(/[^\d]/g,'') ) || 0 );
    // tax disabled per request
    const total = Math.round(subtotal + (Number(shipping) || 0));
    const msg = `مرحبًا، هذا طلب من موقع الخالد تك:\n\n${lines}\n\nالإجمالي: ${formatNumber(total)} ج\n\nتفاصيل العميل:\nالاسم: ${name}\nالهاتف: ${phone}\nالعنوان: ${address}\nالمحافظة: ${gov}\nالمركز: ${center}`;
    window.open(`https://wa.me/${MERCHANT_WA}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  // expose checkout function (optional)
  window.checkoutViaWA = checkoutViaWA;

  // ---------- init ----------
  renderMini();
  updateCartUI = renderMini; // alias
  // scroll events
  window.addEventListener('scroll', () => { reveal(); handleScrollTop(); });
  // run once
  reveal();
  handleScrollTop();
})();
