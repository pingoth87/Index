// ══════════════════════════════════════════════════════════
//  HELLWEAR — Cliente de autenticación y carrito
//  Incluir en todas las páginas DESPUÉS de hw-data.js
//  <script src="hw-auth.js"></script>
// ══════════════════════════════════════════════════════════

const API = 'http://localhost:3000/api';

// ── Estado global ──────────────────────────────────────────
let usuarioActual = null;

// ── API helpers ────────────────────────────────────────────
async function apiPost(url, body) {
  const r = await fetch(API + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body)
  });
  return r.json();
}

async function apiGet(url) {
  const r = await fetch(API + url, { credentials: 'include' });
  return r.json();
}

async function apiPut(url, body) {
  const r = await fetch(API + url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body)
  });
  return r.json();
}

async function apiDelete(url) {
  const r = await fetch(API + url, { method: 'DELETE', credentials: 'include' });
  return r.json();
}

// ── Verificar sesión activa ────────────────────────────────
async function verificarSesion() {
  try {
    const data = await apiGet('/yo');
    if (data.usuario) {
      usuarioActual = data.usuario;
      actualizarNavUsuario();
      await sincronizarCarrito(); // Carga el carrito del servidor
      return true;
    }
  } catch (e) {}
  usuarioActual = null;
  actualizarNavUsuario();
  return false;
}

// ── Actualizar navbar según sesión ────────────────────────
function actualizarNavUsuario() {
  const btn = document.getElementById('userNavBtn');
  if (!btn) return;

  if (usuarioActual) {
    btn.innerHTML = `👤 ${usuarioActual.nombre.split(' ')[0]}`;
    btn.onclick = () => location.href = 'cuenta.html';
  } else {
    btn.innerHTML = `👤 Entrar`;
    btn.onclick = () => location.href = 'auth.html';
  }
}

// ════════════════════════════════════════════════════════════
//  CARRITO — Conectado al servidor si hay sesión
// ════════════════════════════════════════════════════════════

// ── Sincronizar carrito desde el servidor ─────────────────
async function sincronizarCarrito() {
  if (!usuarioActual) return;
  try {
    const data = await apiGet('/carrito');
    if (data.items) {
      // Guardar en localStorage como caché local también
      localStorage.setItem('hw_cart_server', JSON.stringify(data.items));
      actualizarContadorCarrito(data.items);
    }
  } catch(e) {}
}

function getCartItems() {
  if (usuarioActual) {
    try { return JSON.parse(localStorage.getItem('hw_cart_server') || '[]'); } catch(e){ return []; }
  } else {
    try { return JSON.parse(localStorage.getItem('hw_cart') || '[]'); } catch(e){ return []; }
  }
}

function actualizarContadorCarrito(items) {
  const total = items.reduce((s, i) => s + i.cantidad, 0);
  const cc = document.getElementById('cartCount');
  if (cc) cc.textContent = total;
}

// ── Añadir al carrito ──────────────────────────────────────
async function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  if (usuarioActual) {
    // Usuario logueado → guardar en servidor
    const data = await apiPost('/carrito', {
      producto_id: p.id,
      nombre:      p.name,
      precio:      p.price,
      imagen:      p.img || '',
      cantidad:    1
    });
    if (data.items) {
      localStorage.setItem('hw_cart_server', JSON.stringify(data.items));
      actualizarContadorCarrito(data.items);
      renderCartDrawer(data.items);
    }
  } else {
    // Sin sesión → guardar local
    let cart = getCartItems();
    const existing = cart.find(i => i.producto_id === id);
    if (existing) existing.cantidad++;
    else cart.push({ producto_id: id, nombre: p.name, precio: p.price, imagen: p.img || '', cantidad: 1 });
    localStorage.setItem('hw_cart', JSON.stringify(cart));
    actualizarContadorCarrito(cart);
    renderCartDrawer(cart);
  }

  showToast(`⛧ ${p.name} añadido al carrito`);
}

// ── Cambiar cantidad ───────────────────────────────────────
async function changeQty(productoId, delta) {
  if (usuarioActual) {
    const items = getCartItems();
    const item  = items.find(i => i.producto_id === productoId);
    if (!item) return;
    const nuevaCantidad = item.cantidad + delta;
    const data = await apiPut(`/carrito/${productoId}`, { cantidad: nuevaCantidad });
    if (data.items) {
      localStorage.setItem('hw_cart_server', JSON.stringify(data.items));
      actualizarContadorCarrito(data.items);
      renderCartDrawer(data.items);
    }
  } else {
    let cart = getCartItems();
    const item = cart.find(i => i.producto_id === productoId);
    if (!item) return;
    item.cantidad += delta;
    if (item.cantidad <= 0) cart = cart.filter(i => i.producto_id !== productoId);
    localStorage.setItem('hw_cart', JSON.stringify(cart));
    actualizarContadorCarrito(cart);
    renderCartDrawer(cart);
  }
}

// ── Eliminar del carrito ───────────────────────────────────
async function removeFromCart(productoId) {
  if (usuarioActual) {
    const data = await apiDelete(`/carrito/${productoId}`);
    if (data.items) {
      localStorage.setItem('hw_cart_server', JSON.stringify(data.items));
      actualizarContadorCarrito(data.items);
      renderCartDrawer(data.items);
    }
  } else {
    let cart = getCartItems().filter(i => i.producto_id !== productoId);
    localStorage.setItem('hw_cart', JSON.stringify(cart));
    actualizarContadorCarrito(cart);
    renderCartDrawer(cart);
  }
}

// ── Checkout ───────────────────────────────────────────────
async function checkout() {
  const items = getCartItems();
  if (!items.length) { showToast('El carrito está vacío'); return; }

  if (usuarioActual) {
    const data = await apiPost('/checkout', {});
    if (data.ok) {
      showToast('¡Pedido realizado! 🔥 Revísalo en tu cuenta');
      localStorage.removeItem('hw_cart_server');
      actualizarContadorCarrito([]);
      renderCartDrawer([]);
      document.getElementById('cartDrawer')?.classList.remove('open');
      document.getElementById('cartOverlay')?.classList.remove('open');
    } else {
      showToast(data.error || 'Error al procesar el pedido', true);
    }
  } else {
    // Sin sesión, redirigir a login
    showToast('⛧ Inicia sesión para completar tu compra');
    setTimeout(() => location.href = 'auth.html?redirect=checkout', 1500);
  }
}

// ── Render carrito drawer ──────────────────────────────────
function renderCartDrawer(items) {
  const el = document.getElementById('cartItems');
  if (!el) return;

  const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const ct = document.getElementById('cartTotal');
  if (ct) ct.textContent = '$' + total.toLocaleString('es-CO');

  if (!items.length) {
    el.innerHTML = `<div class="cart-empty"><span class="icon">🛒</span>Tu carrito está vacío.<br>¡Añade algo desde el infierno!</div>`;
    return;
  }

  el.innerHTML = items.map(item => `
    <div class="cart-item">
      <div class="cart-item-img" style="background:#180303">
        ${item.imagen ? `<img src="${item.imagen}" style="width:100%;height:100%;object-fit:cover"/>` : '🛍️'}
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.nombre}</div>
        <div class="cart-item-price">$${(item.precio * item.cantidad).toLocaleString('es-CO')}</div>
        <div class="cart-item-qty">
          <button onclick="changeQty(${item.producto_id},-1)">−</button>
          <span>${item.cantidad}</span>
          <button onclick="changeQty(${item.producto_id},1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.producto_id})">✕</button>
    </div>`).join('');
}

// ── Abrir/cerrar carrito ───────────────────────────────────
function toggleCart() {
  const drawer  = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (!drawer) return;
  const opening = !drawer.classList.contains('open');
  drawer.classList.toggle('open');
  overlay?.classList.toggle('open');
  if (opening) renderCartDrawer(getCartItems());
}

// ── Logout ─────────────────────────────────────────────────
async function logout() {
  await apiPost('/logout', {});
  usuarioActual = null;
  localStorage.removeItem('hw_cart_server');
  showToast('Sesión cerrada ⛧');
  setTimeout(() => location.href = 'index.html', 1000);
}

// ── Toast ──────────────────────────────────────────────────
let _toastT;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(_toastT);
  _toastT = setTimeout(() => t.classList.remove('show'), 2500);
}

// ── Wishlist (local) ───────────────────────────────────────
let wish = (() => { try { return JSON.parse(localStorage.getItem('hw_wish') || '[]'); } catch(e){ return []; } })();

function isWished(id) { return wish.includes(id); }

function toggleWish(id, btn) {
  const p = PRODUCTS.find(x => x.id === id);
  if (wish.includes(id)) {
    wish = wish.filter(x => x !== id);
    btn?.classList.remove('active');
    showToast(`💔 ${p?.name} eliminado de favoritos`);
  } else {
    wish.push(id);
    btn?.classList.add('active');
    showToast(`♥ ${p?.name} añadido a favoritos`);
  }
  localStorage.setItem('hw_wish', JSON.stringify(wish));
  const wc = document.getElementById('wishCount');
  if (wc) wc.textContent = wish.length;
}

// ── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  await verificarSesion();

  // Cargar carrito inicial
  renderCartDrawer(getCartItems());
  actualizarContadorCarrito(getCartItems());

  const wc = document.getElementById('wishCount');
  if (wc) wc.textContent = wish.length;

  // Marcar link activo en navbar
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
});
