// ══════════════════════════════════════════════════════════
//  HELLWEAR — Servidor seguro
//  node server.js
// ══════════════════════════════════════════════════════════

const express      = require('express');
const bcrypt       = require('bcryptjs');
const jwt          = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path         = require('path');
const db           = require('./db');

const {
  rateLimiter, cabecerasSeguras, middlewareSanitizar,
  detectarSospechoso, crearMiddlewareAuth, crearCORS,
  validarEmail, validarPassword, validarNombre,
  obtenerIP, logSeguridad,
} = require('./seguridad');

const app    = express();
const PORT   = process.env.PORT || 3000;

// ⚠️  CAMBIA ESTA CLAVE en producción:
// node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
const SECRET = process.env.JWT_SECRET || (() => {
  console.warn('\n⚠️  Usando JWT_SECRET por defecto. Define JWT_SECRET en producción.\n');
  return 'hellwear_dev_secret_cambiar_en_produccion';
})();

const autenticar = crearMiddlewareAuth(SECRET);

// ── Middlewares globales ───────────────────────────────────
app.use(cabecerasSeguras);
app.use(crearCORS());
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: false, limit: '50kb' }));
app.use(cookieParser());
app.use(detectarSospechoso);
app.use(middlewareSanitizar);
app.use('/api', rateLimiter({ ventanaMs: 15*60*1000, maxPeticiones: 100, accion: 'api_global' }));
app.use(express.static(path.join(__dirname, '..')));

// ── Opciones de cookie ─────────────────────────────────────
function cookieOpts() {
  return {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge:   30 * 24 * 60 * 60 * 1000,
    path:     '/'
  };
}

// ════ AUTH ═════════════════════════════════════════════════

app.post('/api/registro',
  rateLimiter({ ventanaMs: 60*60*1000, maxPeticiones: 5, accion: 'registro', mensaje: 'Límite de registros alcanzado. Espera 1 hora.' }),
  (req, res) => {
    const ip = obtenerIP(req);
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password)
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    if (!validarNombre(nombre))
      return res.status(400).json({ error: 'Nombre inválido (2-80 caracteres)' });
    if (!validarEmail(email))
      return res.status(400).json({ error: 'Email inválido' });
    const pc = validarPassword(password);
    if (!pc.ok) return res.status(400).json({ error: pc.error });

    const emailNorm = email.toLowerCase().trim();
    const existe = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(emailNorm);
    if (existe) {
      bcrypt.hashSync('dummy', 12); // timing attack prevention
      return res.status(409).json({ error: 'No se pudo crear la cuenta con ese email' });
    }

    const hash = bcrypt.hashSync(password, 12);
    try {
      const info = db.prepare('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)').run(nombre.trim(), emailNorm, hash);
      const token = jwt.sign({ id: info.lastInsertRowid, nombre: nombre.trim(), email: emailNorm }, SECRET, { expiresIn: '30d', issuer: 'hellwear' });
      res.cookie('hw_token', token, cookieOpts());
      logSeguridad('REGISTRO_OK', ip, `email:${emailNorm}`);
      res.json({ ok: true, usuario: { id: info.lastInsertRowid, nombre: nombre.trim(), email: emailNorm } });
    } catch(err) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

app.post('/api/login',
  rateLimiter({ ventanaMs: 15*60*1000, maxPeticiones: 10, accion: 'login', mensaje: 'Demasiados intentos. Espera 15 minutos.' }),
  (req, res) => {
    const ip = obtenerIP(req);
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    if (!validarEmail(email)) return res.status(400).json({ error: 'Email inválido' });

    const emailNorm = email.toLowerCase().trim();
    const usuario   = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(emailNorm);
    const hash      = usuario ? usuario.password : '$2b$12$invalido.hash.para.timing.prevention.xxx';
    const valido    = bcrypt.compareSync(password, hash);

    if (!usuario || !valido) {
      logSeguridad('LOGIN_FALLIDO', ip, `email:${emailNorm}`);
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    db.prepare('UPDATE usuarios SET ultimo_login = datetime("now") WHERE id = ?').run(usuario.id);
    const token = jwt.sign({ id: usuario.id, nombre: usuario.nombre, email: usuario.email }, SECRET, { expiresIn: '30d', issuer: 'hellwear' });
    res.cookie('hw_token', token, cookieOpts());
    logSeguridad('LOGIN_OK', ip, `id:${usuario.id} email:${emailNorm}`);
    res.json({ ok: true, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email } });
  }
);

app.post('/api/logout', (req, res) => {
  res.clearCookie('hw_token', { path: '/' });
  res.json({ ok: true });
});

app.get('/api/yo', autenticar, (req, res) => {
  const u = db.prepare('SELECT id, nombre, email, creado_en, ultimo_login FROM usuarios WHERE id = ?').get(req.usuario.id);
  if (!u) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json({ usuario: u });
});

// ════ CARRITO ══════════════════════════════════════════════

app.get('/api/carrito', autenticar, (req, res) => {
  const items = db.prepare('SELECT * FROM carrito WHERE usuario_id = ? ORDER BY agregado_en').all(req.usuario.id);
  res.json({ items });
});

app.post('/api/carrito', autenticar,
  rateLimiter({ ventanaMs: 60000, maxPeticiones: 60, accion: 'carrito_add' }),
  (req, res) => {
    const { producto_id, nombre, precio, imagen, cantidad = 1 } = req.body;
    if (!Number.isInteger(Number(producto_id)) || !nombre || !Number.isFinite(Number(precio)))
      return res.status(400).json({ error: 'Datos del producto inválidos' });

    const pid  = parseInt(producto_id);
    const prec = Math.abs(parseInt(precio));
    const cant = Math.max(1, Math.min(99, parseInt(cantidad) || 1));
    const img  = typeof imagen === 'string' ? imagen.slice(0, 200) : '';
    const nom  = typeof nombre === 'string' ? nombre.slice(0, 120) : '';

    const existe = db.prepare('SELECT * FROM carrito WHERE usuario_id = ? AND producto_id = ?').get(req.usuario.id, pid);
    if (existe) {
      db.prepare('UPDATE carrito SET cantidad = ? WHERE usuario_id = ? AND producto_id = ?').run(Math.min(99, existe.cantidad + cant), req.usuario.id, pid);
    } else {
      db.prepare('INSERT INTO carrito (usuario_id, producto_id, nombre, precio, imagen, cantidad) VALUES (?,?,?,?,?,?)').run(req.usuario.id, pid, nom, prec, img, cant);
    }
    res.json({ ok: true, items: db.prepare('SELECT * FROM carrito WHERE usuario_id = ? ORDER BY agregado_en').all(req.usuario.id) });
  }
);

app.put('/api/carrito/:pid', autenticar, (req, res) => {
  const pid  = parseInt(req.params.pid);
  const cant = Math.max(0, Math.min(99, parseInt(req.body.cantidad) || 0));
  if (!Number.isInteger(pid)) return res.status(400).json({ error: 'ID inválido' });
  if (cant <= 0) db.prepare('DELETE FROM carrito WHERE usuario_id = ? AND producto_id = ?').run(req.usuario.id, pid);
  else db.prepare('UPDATE carrito SET cantidad = ? WHERE usuario_id = ? AND producto_id = ?').run(cant, req.usuario.id, pid);
  res.json({ ok: true, items: db.prepare('SELECT * FROM carrito WHERE usuario_id = ? ORDER BY agregado_en').all(req.usuario.id) });
});

app.delete('/api/carrito/:pid', autenticar, (req, res) => {
  const pid = parseInt(req.params.pid);
  if (!Number.isInteger(pid)) return res.status(400).json({ error: 'ID inválido' });
  db.prepare('DELETE FROM carrito WHERE usuario_id = ? AND producto_id = ?').run(req.usuario.id, pid);
  res.json({ ok: true, items: db.prepare('SELECT * FROM carrito WHERE usuario_id = ? ORDER BY agregado_en').all(req.usuario.id) });
});

app.delete('/api/carrito', autenticar, (req, res) => {
  db.prepare('DELETE FROM carrito WHERE usuario_id = ?').run(req.usuario.id);
  res.json({ ok: true, items: [] });
});

// ════ PEDIDOS ══════════════════════════════════════════════

app.post('/api/checkout', autenticar,
  rateLimiter({ ventanaMs: 60000, maxPeticiones: 5, accion: 'checkout' }),
  (req, res) => {
    const items = db.prepare('SELECT * FROM carrito WHERE usuario_id = ?').all(req.usuario.id);
    if (!items.length) return res.status(400).json({ error: 'El carrito está vacío' });

    const total  = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
    const pedido = db.prepare('INSERT INTO pedidos (usuario_id, total) VALUES (?,?)').run(req.usuario.id, total);
    const ins    = db.prepare('INSERT INTO pedido_items (pedido_id,producto_id,nombre,precio,imagen,cantidad) VALUES (?,?,?,?,?,?)');

    db.transaction(() => {
      for (const i of items) ins.run(pedido.lastInsertRowid, i.producto_id, i.nombre, i.precio, i.imagen, i.cantidad);
      db.prepare('DELETE FROM carrito WHERE usuario_id = ?').run(req.usuario.id);
    })();

    res.json({ ok: true, pedido_id: pedido.lastInsertRowid, total });
  }
);

app.get('/api/pedidos', autenticar, (req, res) => {
  const pedidos = db.prepare('SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY creado_en DESC').all(req.usuario.id);
  res.json({ pedidos: pedidos.map(p => ({ ...p, items: db.prepare('SELECT * FROM pedido_items WHERE pedido_id = ?').all(p.id) })) });
});

app.get('/api/pedidos/:id', autenticar, (req, res) => {
  const id = parseInt(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID inválido' });
  const pedido = db.prepare('SELECT * FROM pedidos WHERE id = ? AND usuario_id = ?').get(id, req.usuario.id);
  if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
  pedido.items = db.prepare('SELECT * FROM pedido_items WHERE pedido_id = ?').all(pedido.id);
  res.json({ pedido });
});

// ── Errores ────────────────────────────────────────────────
app.use('/api/*', (req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
app.use((err, req, res, next) => {
  logSeguridad('ERROR_SERVIDOR', obtenerIP(req), err.message.slice(0,100));
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n⛧ HELLWEAR Backend en http://localhost:${PORT}`);
  console.log('\n🔒 Protecciones activas:');
  ['Cabeceras HTTP seguras','Rate limiting (100/15min global, 10/15min login)','Bcrypt factor 12','JWT 30 días','Cookies HttpOnly + SameSite','Sanitización automática de inputs','Detección de bots/scanners','Mensajes genéricos (anti-enumeración)','Logs en security.log'].forEach(p => console.log(`   ✅ ${p}`));
  console.log('');
});
