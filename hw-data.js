// ── HELLWEAR — Product Database ──────────────────────────

const PRODUCTS = [
  // ── CAMISETAS ──────────────────────────────────────────
  { id:1,  name:'Camiseta Modeus',           cat:'camisetas',  price:54900, old:null,   badge:'hot',  img:'img/Camisa_Modeus.jpg',    stars:5 },
  { id:2,  name:'Camiseta Helltaker Trio',   cat:'camisetas',  price:52900, old:null,   badge:'new',  img:'img/Camisa_triple_j.jpg',  stars:5 },
  { id:3,  name:'Camiseta Chibi Modeus',     cat:'camisetas',  price:48900, old:62000,  badge:'sale', img:'img/Camisa_mini_modeus.jpg',stars:4 },
  { id:4,  name:'Camiseta Ángel',            cat:'camisetas',  price:45900, old:null,   badge:null,   img:'img/Camisa_azazel.jpg', stars:4 },
  { id:5,  name:'Camiseta Roja Hellfire',    cat:'camisetas',  price:49900, old:65000,  badge:'sale', img:'img/Camiseta_Justice.jpg',           stars:5 },

  // ── SUDADERAS ──────────────────────────────────────────
  { id:6,  name:'Sudadera Hellcollage',      cat:'sudaderas',  price:89900, old:120000, badge:'sale', img:'img/Camisa_Helltaker.jpg',       stars:5 },
  { id:7,  name:'Sudadera Lucifer',          cat:'sudaderas',  price:94900, old:null,   badge:'new',  img:'img/Camisa_Lucifer.jpg',       stars:5 },

  // ── ACCESORIOS ─────────────────────────────────────────
  { id:8,  name:'Peluche Lucifer',           cat:'accesorios', price:68000, old:null,   badge:'hot',  img:'img/Peluche_Lucifer.jpg',           stars:5 },
  { id:9,  name:'Pack Stickers x12',         cat:'accesorios', price:18900, old:null,   badge:'new',  img:'img/Stickers_helltaker.jpg',          stars:4 },
  { id:10, name:'Mouse Pad XL Gaming',       cat:'accesorios', price:42000, old:55000,  badge:'sale', img:'img/img_mousepad.jpg',          stars:5 },
  { id:11, name:'Pack Llaveros Acrílicos',   cat:'accesorios', price:28900, old:null,   badge:null,   img:'img/llaveros.jpg',          stars:4 },
 
  // ── EDICIÓN LIMITADA ───────────────────────────────────
  { id:12, name:'ArtBook Conceptual',        cat:'limitada',   price:24900, old:32000,  badge:'sale', img:'img/artbook_conceptual.jpg',           stars:4 },
  { id:13, name:'Nendoroid Modeus',          cat:'limitada',   price:185000,old:null,   badge:'hot',  img:'img/Modeus_Nendoroid.jpg',         stars:5 },
  { id:14, name:'Peluche Ed. Especial',      cat:'limitada',   price:95000, old:null,   badge:'new',  img:'img/img_peluche.jpg',           stars:5 },
];

const CAT_META = {
  camisetas:  { label:'Camisetas',        icon:'👕' },
  sudaderas:  { label:'Sudaderas',        icon:'🧥' },
  accesorios: { label:'Accesorios',       icon:'🧤' },
  limitada:   { label:'Edición Limitada', icon:'⛧'  },
};

function fmtPrice(n) { return '$' + Number(n).toLocaleString('es-CO'); }

function stars(n) { return '★'.repeat(n) + '☆'.repeat(5-n); }

function badgeHtml(b) {
  if (!b) return '';
  const map = { new:'badge-new', sale:'badge-sale', hot:'badge-hot' };
  const lbl = { new:'Nuevo', sale:'Oferta', hot:'Popular' };
  return `<span class="product-badge ${map[b]}">${lbl[b]}</span>`;
}

function productCard(p) {
  const imgHtml = p.img
    ? `<img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;display:block;"/>`
    : '🛍️';
  return `
  <div class="product-card" onclick="openProduct(${p.id})">
    <div class="product-img" style="background:#180303;font-size:0;">
      ${imgHtml}
      ${badgeHtml(p.badge)}
    </div>
    <div class="product-actions">
      <button onclick="event.stopPropagation();addToCart(${p.id})">Añadir al carrito</button>
      <button class="wish ${isWished(p.id)?'active':''}" onclick="event.stopPropagation();toggleWish(${p.id},this)">♡</button>
    </div>
    <div class="product-info">
      <div class="product-category">${CAT_META[p.cat]?.label || p.cat}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-meta">
        <div class="product-price">
          ${p.old ? `<span class="old">${fmtPrice(p.old)}</span>` : ''}
          ${fmtPrice(p.price)}
        </div>
        <div class="product-stars">${stars(p.stars)}</div>
      </div>
    </div>
  </div>`;
}

function openProduct(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (p) showToast(`${p.name} — próximamente vista detalle`);
}
