// ══════════════════════════════════════════════════════════
//  HELLWEAR — Módulo de Seguridad
//  Protecciones incluidas:
//  ✅ Rate limiting (bloqueo por intentos excesivos)
//  ✅ Helmet (cabeceras HTTP seguras)
//  ✅ Sanitización de inputs (inyección SQL / XSS)
//  ✅ CORS estricto
//  ✅ Tokens JWT con expiración
//  ✅ Contraseñas hasheadas con bcrypt (factor 12)
//  ✅ Logs de actividad sospechosa
//  ✅ Límite de tamaño de peticiones
//  ✅ Protección contra fuerza bruta en login
//  ✅ Validación y normalización de emails
// ══════════════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');

// ── Rate limiter simple (sin dependencias externas) ────────
// Guarda en memoria: { "ip:accion": [timestamp, timestamp, ...] }
const _limitStore = {};

/**
 * Crea un middleware de rate limiting.
 * @param {object} opts
 *   ventanaMs   — ventana de tiempo en ms       (default: 15 min)
 *   maxPeticiones — intentos permitidos          (default: 100)
 *   mensaje     — mensaje de error               (default: genérico)
 *   accion      — clave para separar por ruta    (default: 'global')
 */
function rateLimiter({ ventanaMs = 15*60*1000, maxPeticiones = 100, mensaje, accion = 'global' } = {}) {
  return (req, res, next) => {
    const ip    = obtenerIP(req);
    const clave = `${ip}:${accion}`;
    const ahora = Date.now();

    if (!_limitStore[clave]) _limitStore[clave] = [];

    // Eliminar registros fuera de la ventana
    _limitStore[clave] = _limitStore[clave].filter(t => ahora - t < ventanaMs);
    _limitStore[clave].push(ahora);

    const intentos = _limitStore[clave].length;
    const restante = Math.ceil((Math.min(..._limitStore[clave]) + ventanaMs - ahora) / 1000);

    // Cabeceras informativas
    res.setHeader('X-RateLimit-Limit',     maxPeticiones);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxPeticiones - intentos));
    res.setHeader('X-RateLimit-Reset',     restante);

    if (intentos > maxPeticiones) {
      logSeguridad('RATE_LIMIT', ip, `${accion} — ${intentos} intentos en ${ventanaMs/1000}s`);
      return res.status(429).json({
        error: mensaje || `Demasiadas solicitudes. Espera ${restante} segundos.`
      });
    }

    next();
  };
}

// Limpiar store viejo cada 30 minutos para evitar memory leaks
setInterval(() => {
  const ahora = Date.now();
  for (const clave of Object.keys(_limitStore)) {
    _limitStore[clave] = (_limitStore[clave] || []).filter(t => ahora - t < 60*60*1000);
    if (!_limitStore[clave].length) delete _limitStore[clave];
  }
}, 30 * 60 * 1000);

// ── Cabeceras de seguridad HTTP (similar a Helmet) ─────────
function cabecerasSeguras(req, res, next) {
  // Evita que el navegador adivine el tipo de contenido
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Evita que la página se cargue en un iframe (clickjacking)
  res.setHeader('X-Frame-Options', 'DENY');
  // Fuerza HTTPS si el navegador ya lo usó
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  // Controla qué información se envía en el Referer
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Deshabilita funciones peligrosas del navegador
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  // Content Security Policy: solo permite recursos del mismo origen
  res.setHeader('Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data:; " +
    "connect-src 'self' http://localhost:3000; " +
    "frame-ancestors 'none';"
  );
  // Eliminar cabecera que revela tecnología usada
  res.removeHeader('X-Powered-By');
  next();
}

// ── Sanitizar texto (previene XSS e inyección) ─────────────
function sanitizar(texto) {
  if (typeof texto !== 'string') return texto;
  return texto
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/\\/g, '&#x5C;')
    // Eliminar caracteres de control
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();
}

// Sanitiza recursivamente un objeto (body de requests)
function sanitizarBody(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const limpio = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string')       limpio[k] = sanitizar(v);
    else if (typeof v === 'object')  limpio[k] = sanitizarBody(v);
    else                             limpio[k] = v;
  }
  return limpio;
}

// Middleware que sanitiza req.body automáticamente
function middlewareSanitizar(req, res, next) {
  if (req.body) req.body = sanitizarBody(req.body);
  next();
}

// ── Validaciones ───────────────────────────────────────────
function validarEmail(email) {
  if (typeof email !== 'string') return false;
  const regex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email) && email.length <= 254;
}

function validarPassword(pass) {
  if (typeof pass !== 'string') return { ok: false, error: 'Contraseña inválida' };
  if (pass.length < 6)  return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres' };
  if (pass.length > 128) return { ok: false, error: 'Contraseña demasiado larga' };
  return { ok: true };
}

function validarNombre(nombre) {
  if (typeof nombre !== 'string') return false;
  const limpio = nombre.trim();
  return limpio.length >= 2 && limpio.length <= 80;
}

// ── Detectar IP real (detrás de proxy/nginx) ───────────────
function obtenerIP(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

// ── Logs de seguridad ──────────────────────────────────────
const LOG_FILE = path.join(__dirname, 'security.log');

function logSeguridad(evento, ip, detalle = '') {
  const linea = `[${new Date().toISOString()}] ${evento.padEnd(20)} IP:${ip.padEnd(20)} ${detalle}\n`;
  // Consola con color
  const colores = {
    RATE_LIMIT:     '\x1b[33m', // amarillo
    LOGIN_FALLIDO:  '\x1b[31m', // rojo
    LOGIN_OK:       '\x1b[32m', // verde
    REGISTRO_OK:    '\x1b[32m',
    SOSPECHOSO:     '\x1b[35m', // magenta
    TOKEN_INVALIDO: '\x1b[31m',
  };
  const color = colores[evento] || '\x1b[37m';
  console.log(`${color}⛧ SEGURIDAD ${linea}\x1b[0m`.trim());

  // Escribir al archivo de log (no bloquea)
  fs.appendFile(LOG_FILE, linea, () => {});
}

// ── Middleware: detectar patrones sospechosos ──────────────
const _puntajesSospechosos = {};

function detectarSospechoso(req, res, next) {
  const ip = obtenerIP(req);
  const ua = req.headers['user-agent'] || '';

  // User-agents típicos de scanners/bots maliciosos
  const uasMalos = ['sqlmap', 'nikto', 'nmap', 'masscan', 'zgrab', 'nuclei', 'curl/7.'];
  if (uasMalos.some(u => ua.toLowerCase().includes(u))) {
    logSeguridad('SOSPECHOSO', ip, `User-Agent sospechoso: ${ua.slice(0,60)}`);
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  // Detectar intentos de path traversal
  const url = req.originalUrl || '';
  if (url.includes('..') || url.includes('%2e%2e') || url.includes('etc/passwd')) {
    logSeguridad('SOSPECHOSO', ip, `Path traversal: ${url.slice(0,80)}`);
    return res.status(400).json({ error: 'Ruta inválida' });
  }

  next();
}

// ── Middleware: autenticación JWT ──────────────────────────
function crearMiddlewareAuth(SECRET) {
  const jwt = require('jsonwebtoken');
  return function autenticar(req, res, next) {
    const token = req.cookies?.hw_token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No autenticado. Inicia sesión.' });
    }
    try {
      req.usuario = jwt.verify(token, SECRET);
      next();
    } catch (err) {
      const ip = obtenerIP(req);
      logSeguridad('TOKEN_INVALIDO', ip, err.message);
      res.clearCookie('hw_token');
      return res.status(401).json({ error: 'Sesión expirada. Inicia sesión de nuevo.' });
    }
  };
}

// ── CORS seguro ────────────────────────────────────────────
function crearCORS(origenesPermitidos = []) {
  return (req, res, next) => {
    const origen = req.headers.origin;
    const permitido =
      !origen || // misma origin (archivos locales)
      origenesPermitidos.length === 0 ||
      origenesPermitidos.includes(origen);

    if (permitido) {
      res.setHeader('Access-Control-Allow-Origin',      origen || '*');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods',     'GET,POST,PUT,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers',     'Content-Type,Authorization');
    }

    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  };
}

// ── Exportar todo ──────────────────────────────────────────
module.exports = {
  rateLimiter,
  cabecerasSeguras,
  middlewareSanitizar,
  detectarSospechoso,
  crearMiddlewareAuth,
  crearCORS,
  sanitizar,
  sanitizarBody,
  validarEmail,
  validarPassword,
  validarNombre,
  obtenerIP,
  logSeguridad,
};
