// الانتقال للقسم المطلوب
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

// محاكاة الدفع
function payNow() {
  alert("✅ تم تحويلك لصفحة الدفع (ممكن تربطها بـ PayPal أو Visa لاحقًا)");
}
