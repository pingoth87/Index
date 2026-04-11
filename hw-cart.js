// ── HELLWEAR — Cart & Wishlist ────────────────────────────

// ── Storage helpers ───────────────────────────────────────
function loadCart()    { try { return JSON.parse(localStorage.getItem('hw_cart')    || '[]'); } catch(e){ return []; } }
function saveCart(c)   { localStorage.setItem('hw_cart',    JSON.stringify(c)); }
function loadWish()    { try { return JSON.parse(localStorage.getItem('hw_wish')    || '[]'); } catch(e){ return []; } }
function saveWish(w)   { localStorage.setItem('hw_wish',    JSON.stringify(w)); }

let cart = loadCart();
let wish = loadWish();

// ── Cart ──────────────────────────────────────────────────
function toggleCart() {
  document.getElementById('cartDrawer').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
  renderCart();
}

function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty++;
  else cart.push({ id, qty: 1 });
  saveCart(cart);
  renderCart();
  showToast(`⛧ ${p.name} añadido al carrito`);
  // Flash cart button
  const btn = document.querySelector('.nav-icons button[title="Carrito"]');
  if (btn) { btn.style.color='var(--red-lit)'; setTimeout(()=>btn.style.color='',600); }
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
}

function renderCart() {
  const el = document.getElementById('cartItems');
  if (!el) return;
  const total = cart.reduce((s, i) => s + PRODUCTS.find(p=>p.id===i.id).price * i.qty, 0);
  const totalCount = cart.reduce((s, i) => s + i.qty, 0);

  const cc = document.getElementById('cartCount');
  if (cc) cc.textContent = totalCount;
  const ct = document.getElementById('cartTotal');
  if (ct) ct.textContent = fmtPrice(total);

  if (cart.length === 0) {
    el.innerHTML = `<div class="cart-empty"><span class="icon">🛒</span>Tu carrito está vacío.<br>¡Añade algo desde el infierno!</div>`;
    return;
  }

  el.innerHTML = cart.map(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    return `
    <div class="cart-item">
      <div class="cart-item-img" style="background:${p.bg}">${p.icon}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${p.name}</div>
        <div class="cart-item-price">${fmtPrice(p.price * item.qty)}</div>
        <div class="cart-item-qty">
          <button onclick="changeQty(${p.id},-1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${p.id},1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${p.id})">✕</button>
    </div>`;
  }).join('');
}

function checkout() {
  if (cart.length === 0) { showToast('El carrito está vacío'); return; }
  showToast('¡Pedido realizado! 🔥 Gracias por comprar en HELLWEAR');
  cart = [];
  saveCart(cart);
  renderCart();
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}

// ── Wishlist ──────────────────────────────────────────────
function isWished(id) { return wish.includes(id); }

function toggleWish(id, btn) {
  const p = PRODUCTS.find(x => x.id === id);
  if (wish.includes(id)) {
    wish = wish.filter(x => x !== id);
    if (btn) btn.classList.remove('active');
    showToast(`💔 ${p.name} eliminado de favoritos`);
  } else {
    wish.push(id);
    if (btn) btn.classList.add('active');
    showToast(`♥ ${p.name} añadido a favoritos`);
  }
  saveWish(wish);
  const wc = document.getElementById('wishCount');
  if (wc) wc.textContent = wish.length;
}

// ── Toast ─────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
}

// ── Init on load ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  const wc = document.getElementById('wishCount');
  if (wc) wc.textContent = wish.length;
  const cc = document.getElementById('cartCount');
  if (cc) cc.textContent = cart.reduce((s, i) => s + i.qty, 0);

  // Mark active nav link
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
});
