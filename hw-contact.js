// ══════════════════════════════════════════════════════════
//  HELLWEAR — Widget de contacto
//  WhatsApp Business + Telegram
//
//  Incluir en todas las páginas antes de </body>:
//  <script src="hw-contact.js"></script>
//
//  CONFIGURACIÓN: edita solo el bloque CONFIG de abajo
// ══════════════════════════════════════════════════════════

const CONTACT_CONFIG = {
  // ── WhatsApp Business ────────────────────────────────────
  // Número en formato internacional sin + ni espacios
  whatsapp: {
    activo:   true,
    numero:   '573143834293',
    mensaje:  'Hola! Me interesa un producto de HELLWEAR ⛧',
    // Mensaje diferente por página (opcional — deja vacío '' para usar el default)
    mensajes: {
      'catalogo.html':   'Hola! Tengo una pregunta sobre un producto del catálogo ⛧',
      'ofertas.html':    'Hola! Me interesan las ofertas de HELLWEAR ⛧',
      'nosotros.html':   'Hola! Quiero más información sobre HELLWEAR ⛧',
    }
  },

  // ── Telegram ─────────────────────────────────────────────
  // Pon tu @usuario de Telegram O tu número con código de país
  // Ejemplos:
  //   usuario:  'hellwear_soporte'   → abre t.me/hellwear_soporte
  //   numero:   '573143834293'       → abre t.me/+573143834293
  telegram: {
    activo:  true,
    usuario: '',           // ← pon tu @usuario aquí (sin el @)
    numero:  '573143834293', // ← o tu número (se usa si usuario está vacío)
    mensaje: 'Hola! Me interesa HELLWEAR ⛧',
  },

  // ── Apariencia ───────────────────────────────────────────
  posicion:      'derecha',   // 'derecha' o 'izquierda'
  mostrarTextos: true,        // mostrar etiquetas de texto en desktop
  ordenar:       ['telegram', 'whatsapp'], // orden de los botones (de abajo a arriba)
};

// ═════════════════════════════════════════════════════════
//  NO EDITES DEBAJO DE ESTA LÍNEA
// ═════════════════════════════════════════════════════════

(function () {
  // ── Construir URLs ──────────────────────────────────────
  function urlWhatsApp() {
    const cfg    = CONTACT_CONFIG.whatsapp;
    const pagina = location.pathname.split('/').pop() || 'index.html';
    const msg    = cfg.mensajes?.[pagina] || cfg.mensaje || '';
    return `https://wa.me/${cfg.numero}?text=${encodeURIComponent(msg)}`;
  }

  function urlTelegram() {
    const cfg = CONTACT_CONFIG.telegram;
    const msg = encodeURIComponent(cfg.mensaje || '');
    if (cfg.usuario) return `https://t.me/${cfg.usuario}?text=${msg}`;
    if (cfg.numero)  return `https://t.me/+${cfg.numero}`;
    return '#';
  }

  // ── Estilos ─────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    .hw-contact-widget {
      position: fixed;
      ${CONTACT_CONFIG.posicion === 'izquierda' ? 'left: 1.4rem;' : 'right: 1.4rem;'}
      bottom: 1.4rem;
      z-index: 400;
      display: flex;
      flex-direction: column;
      align-items: ${CONTACT_CONFIG.posicion === 'izquierda' ? 'flex-start' : 'flex-end'};
      gap: 10px;
    }

    .hw-contact-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 11px 16px 11px 14px;
      border-radius: 50px;
      border: none;
      cursor: pointer;
      text-decoration: none;
      font-family: 'Share Tech Mono', monospace;
      font-size: 12px;
      letter-spacing: 0.06em;
      color: #fff;
      transition: transform 0.2s, box-shadow 0.2s, padding 0.3s;
      white-space: nowrap;
      position: relative;
      overflow: hidden;
    }

    .hw-contact-btn::before {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,0);
      transition: background 0.15s;
    }
    .hw-contact-btn:hover::before { background: rgba(255,255,255,0.08); }
    .hw-contact-btn:hover  { transform: translateY(-3px); }
    .hw-contact-btn:active { transform: scale(0.97); }

    .hw-contact-btn.wa {
      background: #25d366;
      box-shadow: 0 4px 18px rgba(37,211,102,0.4);
    }
    .hw-contact-btn.wa:hover {
      box-shadow: 0 8px 28px rgba(37,211,102,0.55);
    }

    .hw-contact-btn.tg {
      background: #229ed9;
      box-shadow: 0 4px 18px rgba(34,158,217,0.4);
    }
    .hw-contact-btn.tg:hover {
      box-shadow: 0 8px 28px rgba(34,158,217,0.55);
    }

    .hw-contact-btn svg {
      width: 22px;
      height: 22px;
      flex-shrink: 0;
    }

    .hw-contact-label {
      font-weight: 500;
      transition: max-width 0.3s, opacity 0.3s;
    }

    /* En móvil: solo íconos */
    @media (max-width: 600px) {
      .hw-contact-btn {
        padding: 13px;
        border-radius: 50%;
      }
      .hw-contact-label { display: none; }
    }

    /* Tooltip al hover en móvil */
    @media (max-width: 600px) {
      .hw-contact-btn::after {
        content: attr(data-tooltip);
        position: absolute;
        ${CONTACT_CONFIG.posicion === 'izquierda' ? 'left: calc(100% + 10px);' : 'right: calc(100% + 10px);'}
        top: 50%;
        transform: translateY(-50%);
        background: #0e0101;
        border: 1px solid #3a1010;
        color: #f0e4e4;
        font-family: 'Share Tech Mono', monospace;
        font-size: 10px;
        letter-spacing: 0.08em;
        padding: 5px 10px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s;
      }
      .hw-contact-btn:hover::after { opacity: 1; }
    }

    /* Animación de entrada */
    @keyframes slideInContact {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .hw-contact-btn {
      animation: slideInContact 0.4s ease both;
    }
    .hw-contact-btn:nth-child(1) { animation-delay: 0.1s; }
    .hw-contact-btn:nth-child(2) { animation-delay: 0.2s; }
  `;
  document.head.appendChild(style);

  // ── SVG íconos ──────────────────────────────────────────
  const SVG_WA = `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>`;

  const SVG_TG = `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>`;

  // ── Construir widget ────────────────────────────────────
  const wrap = document.createElement('div');
  wrap.className = 'hw-contact-widget';
  wrap.id = 'hwContactWidget';

  const botones = {
    whatsapp: () => {
      const cfg = CONTACT_CONFIG.whatsapp;
      if (!cfg.activo) return null;
      const a = document.createElement('a');
      a.className  = 'hw-contact-btn wa';
      a.href       = urlWhatsApp();
      a.target     = '_blank';
      a.rel        = 'noopener noreferrer';
      a.setAttribute('data-tooltip', 'WhatsApp');
      a.setAttribute('aria-label', 'Contactar por WhatsApp');
      a.innerHTML  = SVG_WA + (CONTACT_CONFIG.mostrarTextos
        ? `<span class="hw-contact-label">WhatsApp</span>` : '');
      return a;
    },
    telegram: () => {
      const cfg = CONTACT_CONFIG.telegram;
      if (!cfg.activo) return null;
      const url = urlTelegram();
      if (url === '#') return null;
      const a = document.createElement('a');
      a.className  = 'hw-contact-btn tg';
      a.href       = url;
      a.target     = '_blank';
      a.rel        = 'noopener noreferrer';
      a.setAttribute('data-tooltip', 'Telegram');
      a.setAttribute('aria-label', 'Contactar por Telegram');
      a.innerHTML  = SVG_TG + (CONTACT_CONFIG.mostrarTextos
        ? `<span class="hw-contact-label">Telegram</span>` : '');
      return a;
    }
  };

  // Insertar en el orden configurado
  CONTACT_CONFIG.ordenar.forEach(nombre => {
    const el = botones[nombre]?.();
    if (el) wrap.appendChild(el);
  });

  // ── Eliminar el botón WA anterior si existe ─────────────
  document.addEventListener('DOMContentLoaded', () => {
    // Eliminar botón flotante antiguo (clase wa-btn del código anterior)
    document.querySelectorAll('.wa-btn').forEach(el => el.remove());
    document.body.appendChild(wrap);
  });

})();
