// ══════════════════════════════════════════════════════════
//  HELLWEAR — Base de datos SQLite
//  El archivo hellwear.db se crea automáticamente
// ══════════════════════════════════════════════════════════

const Database = require('better-sqlite3');
const path     = require('path');

const db = new Database(path.join(__dirname, 'hellwear.db'));

// Activar WAL mode para mejor rendimiento
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Crear tablas si no existen ─────────────────────────────
db.exec(`
  -- Usuarios
  CREATE TABLE IF NOT EXISTS usuarios (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre      TEXT    NOT NULL,
    email       TEXT    NOT NULL UNIQUE,
    password    TEXT    NOT NULL,
    creado_en   TEXT    DEFAULT (datetime('now')),
    ultimo_login TEXT
  );

  -- Carrito (persiste por usuario)
  CREATE TABLE IF NOT EXISTS carrito (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL,
    nombre      TEXT    NOT NULL,
    precio      INTEGER NOT NULL,
    imagen      TEXT,
    cantidad    INTEGER NOT NULL DEFAULT 1,
    agregado_en TEXT    DEFAULT (datetime('now')),
    UNIQUE(usuario_id, producto_id)
  );

  -- Pedidos (historial de compras)
  CREATE TABLE IF NOT EXISTS pedidos (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    total       INTEGER NOT NULL,
    estado      TEXT    DEFAULT 'completado',
    creado_en   TEXT    DEFAULT (datetime('now'))
  );

  -- Items de cada pedido
  CREATE TABLE IF NOT EXISTS pedido_items (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    pedido_id   INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL,
    nombre      TEXT    NOT NULL,
    precio      INTEGER NOT NULL,
    imagen      TEXT,
    cantidad    INTEGER NOT NULL
  );
`);

console.log('✅ Base de datos lista: hellwear.db');

module.exports = db;
