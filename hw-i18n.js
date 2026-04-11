// ══════════════════════════════════════════════════════════
//  HELLWEAR — Sistema de traducción (i18n)
//  - Detecta idioma por IP automáticamente
//  - Permite selección manual
//  - Traduce toda la interfaz sin recargar la página
//  - Guarda preferencia del usuario
//
//  Incluir en todas las páginas ANTES de hw-auth.js:
//  <script src="hw-i18n.js"></script>
// ══════════════════════════════════════════════════════════

// ── Idiomas soportados ─────────────────────────────────────
const IDIOMAS = {
  es: { nombre: 'Español',    bandera: '🇪🇸', codigo: 'es' },
  en: { nombre: 'English',    bandera: '🇺🇸', codigo: 'en' },
  pt: { nombre: 'Português',  bandera: '🇧🇷', codigo: 'pt' },
  fr: { nombre: 'Français',   bandera: '🇫🇷', codigo: 'fr' },
  de: { nombre: 'Deutsch',    bandera: '🇩🇪', codigo: 'de' },
  ja: { nombre: '日本語',      bandera: '🇯🇵', codigo: 'ja' },
};

// ── Países → idioma ────────────────────────────────────────
const PAIS_IDIOMA = {
  // Español
  CO:'es', MX:'es', AR:'es', ES:'es', CL:'es', PE:'es', VE:'es',
  EC:'es', BO:'es', PY:'es', UY:'es', CR:'es', PA:'es', DO:'es',
  GT:'es', HN:'es', SV:'es', NI:'es', CU:'es',
  // Inglés
  US:'en', GB:'en', CA:'en', AU:'en', NZ:'en', IE:'en', ZA:'en',
  // Portugués
  BR:'pt', PT:'pt', AO:'pt', MZ:'pt',
  // Francés
  FR:'fr', BE:'fr', CH:'fr', LU:'fr', SN:'fr', CI:'fr',
  // Alemán
  DE:'de', AT:'de',
  // Japonés
  JP:'ja',
};

// ── Traducciones ───────────────────────────────────────────
const T = {
  es: {
    // Navbar
    nav_catalogo:     'Catálogo',
    nav_categorias:   'Categorías',
    nav_ofertas:      'Ofertas',
    nav_nosotros:     'Nosotros',
    nav_entrar:       '👤 Entrar',
    nav_buscar:       'Buscar en el infierno...',
    nav_carrito:      'Carrito',

    // Hero
    hero_eyebrow:     'Nueva colección 2025',
    hero_titulo1:     'VISTE',
    hero_titulo2:     'EL CAOS',
    hero_sub:         'Ropa oscura, exclusiva y sin igual. Diseñada para quienes no pertenecen a este mundo.',
    hero_btn1:        'Ver colección',
    hero_btn2:        'Lookbook ↗',

    // Secciones
    sec_explorar:     'Explorar',
    sec_categorias:   'CATEGORÍAS',
    sec_destacados_e: 'Lo más popular',
    sec_destacados:   'DESTACADOS',
    sec_catalogo_e:   'Catálogo',
    sec_catalogo:     'CATÁLOGO',

    // Categorías
    cat_camisetas:    'CAMISETAS',
    cat_sudaderas:    'SUDADERAS',
    cat_accesorios:   'ACCESORIOS',
    cat_limitada:     'EDICIÓN LIMITADA',
    cat_productos:    'productos',

    // Productos
    prod_anadir:      'Añadir al carrito',
    prod_nuevo:       'Nuevo',
    prod_oferta:      'Oferta',
    prod_popular:     'Popular',
    ver_catalogo:     'Ver todo el catálogo →',

    // Promo
    promo_titulo:     'OFERTA INFERNAL',
    promo_sub:        '30% OFF en toda la colección de temporada',
    promo_btn:        'Ver ofertas',
    promo_horas:      'horas',
    promo_min:        'min',
    promo_seg:        'seg',

    // Filtros
    filtrar:          'Filtrar:',
    todos:            'Todos',
    ordenar:          'Ordenar: Defecto',
    precio_menor:     'Precio: Menor',
    precio_mayor:     'Precio: Mayor',
    mejor_val:        'Mejor valorados',
    en_oferta:        'En oferta',

    // Carrito
    carrito_titulo:   '⛧ CARRITO',
    carrito_vacio:    'Tu carrito está vacío. ¡Añade algo desde el infierno!',
    carrito_total:    'Total',
    carrito_pagar:    'Proceder al pago',

    // Auth
    auth_login:       'Iniciar sesión',
    auth_registro:    'Crear cuenta',
    auth_email:       'Correo electrónico',
    auth_password:    'Contraseña',
    auth_nombre:      'Nombre completo',
    auth_confirmar:   'Confirmar contraseña',
    auth_btn_login:   'Entrar al infierno ⛧',
    auth_btn_reg:     'Unirse al infierno ⛧',
    auth_ya_cuenta:   '¿Ya tienes cuenta?',
    auth_no_cuenta:   '¿No tienes cuenta?',
    auth_creala:      'Créala aquí',
    auth_inicia:      'Inicia sesión',
    auth_volver:      '← Volver a la tienda',

    // Cuenta
    cuenta_titulo:    'MI CUENTA',
    cuenta_perfil:    '👤 Perfil',
    cuenta_pedidos:   '📦 Mis pedidos',
    cuenta_carrito:   '🛒 Carrito guardado',
    cuenta_cerrar:    '⛧ Cerrar sesión',
    pedidos_vacio:    'Aún no has realizado ningún pedido.',
    ir_catalogo:      'Ir al catálogo →',
    finalizar:        'Finalizar compra ⛧',
    seguir:           'Seguir comprando',

    // WA
    wa_soporte:       'Soporte en vivo',

    // Footer
    foot_tienda:      'Tienda',
    foot_ayuda:       'Ayuda',
    foot_siguenos:    'Síguenos',
    foot_faq:         'FAQ',
    foot_envios:      'Envíos',
    foot_devol:       'Devoluciones',
    foot_tallas:      'Tallas',
    foot_copy:        '© 2025 HELLWEAR — TODOS LOS DERECHOS RESERVADOS',

    // Selector de idioma
    lang_titulo:      'Selecciona tu idioma',
    lang_auto:        'Detectado automáticamente',
    lang_cambiar:     'Cambiar idioma',
  },

  en: {
    nav_catalogo:     'Catalog',
    nav_categorias:   'Categories',
    nav_ofertas:      'Deals',
    nav_nosotros:     'About',
    nav_entrar:       '👤 Sign in',
    nav_buscar:       'Search in hell...',
    nav_carrito:      'Cart',

    hero_eyebrow:     'New collection 2025',
    hero_titulo1:     'WEAR',
    hero_titulo2:     'THE CHAOS',
    hero_sub:         'Dark, exclusive, unmatched clothing. Designed for those who don\'t belong in this world.',
    hero_btn1:        'View collection',
    hero_btn2:        'Lookbook ↗',

    sec_explorar:     'Explore',
    sec_categorias:   'CATEGORIES',
    sec_destacados_e: 'Most popular',
    sec_destacados:   'FEATURED',
    sec_catalogo_e:   'Catalog',
    sec_catalogo:     'CATALOG',

    cat_camisetas:    'T-SHIRTS',
    cat_sudaderas:    'HOODIES',
    cat_accesorios:   'ACCESSORIES',
    cat_limitada:     'LIMITED EDITION',
    cat_productos:    'products',

    prod_anadir:      'Add to cart',
    prod_nuevo:       'New',
    prod_oferta:      'Sale',
    prod_popular:     'Hot',
    ver_catalogo:     'View full catalog →',

    promo_titulo:     'INFERNAL DEAL',
    promo_sub:        '30% OFF on the entire seasonal collection',
    promo_btn:        'View deals',
    promo_horas:      'hours',
    promo_min:        'min',
    promo_seg:        'sec',

    filtrar:          'Filter:',
    todos:            'All',
    ordenar:          'Sort: Default',
    precio_menor:     'Price: Low to High',
    precio_mayor:     'Price: High to Low',
    mejor_val:        'Top rated',
    en_oferta:        'On sale',

    carrito_titulo:   '⛧ CART',
    carrito_vacio:    'Your cart is empty. Add something from hell!',
    carrito_total:    'Total',
    carrito_pagar:    'Proceed to checkout',

    auth_login:       'Sign in',
    auth_registro:    'Create account',
    auth_email:       'Email address',
    auth_password:    'Password',
    auth_nombre:      'Full name',
    auth_confirmar:   'Confirm password',
    auth_btn_login:   'Enter the inferno ⛧',
    auth_btn_reg:     'Join the inferno ⛧',
    auth_ya_cuenta:   'Already have an account?',
    auth_no_cuenta:   'Don\'t have an account?',
    auth_creala:      'Create one here',
    auth_inicia:      'Sign in',
    auth_volver:      '← Back to store',

    cuenta_titulo:    'MY ACCOUNT',
    cuenta_perfil:    '👤 Profile',
    cuenta_pedidos:   '📦 My orders',
    cuenta_carrito:   '🛒 Saved cart',
    cuenta_cerrar:    '⛧ Sign out',
    pedidos_vacio:    'You haven\'t placed any orders yet.',
    ir_catalogo:      'Go to catalog →',
    finalizar:        'Complete purchase ⛧',
    seguir:           'Continue shopping',

    wa_soporte:       'Live support',

    foot_tienda:      'Store',
    foot_ayuda:       'Help',
    foot_siguenos:    'Follow us',
    foot_faq:         'FAQ',
    foot_envios:      'Shipping',
    foot_devol:       'Returns',
    foot_tallas:      'Size guide',
    foot_copy:        '© 2025 HELLWEAR — ALL RIGHTS RESERVED',

    lang_titulo:      'Select your language',
    lang_auto:        'Auto-detected',
    lang_cambiar:     'Change language',
  },

  pt: {
    nav_catalogo:     'Catálogo',
    nav_categorias:   'Categorias',
    nav_ofertas:      'Ofertas',
    nav_nosotros:     'Sobre nós',
    nav_entrar:       '👤 Entrar',
    nav_buscar:       'Buscar no inferno...',
    nav_carrito:      'Carrinho',

    hero_eyebrow:     'Nova coleção 2025',
    hero_titulo1:     'VISTA',
    hero_titulo2:     'O CAOS',
    hero_sub:         'Roupas sombrias, exclusivas e inigualáveis. Criadas para quem não pertence a este mundo.',
    hero_btn1:        'Ver coleção',
    hero_btn2:        'Lookbook ↗',

    sec_explorar:     'Explorar',
    sec_categorias:   'CATEGORIAS',
    sec_destacados_e: 'Mais popular',
    sec_destacados:   'DESTAQUES',
    sec_catalogo_e:   'Catálogo',
    sec_catalogo:     'CATÁLOGO',

    cat_camisetas:    'CAMISETAS',
    cat_sudaderas:    'MOLETONS',
    cat_accesorios:   'ACESSÓRIOS',
    cat_limitada:     'EDIÇÃO LIMITADA',
    cat_produtos:     'produtos',
    cat_productos:    'produtos',

    prod_anadir:      'Adicionar ao carrinho',
    prod_nuevo:       'Novo',
    prod_oferta:      'Oferta',
    prod_popular:     'Popular',
    ver_catalogo:     'Ver catálogo completo →',

    promo_titulo:     'OFERTA INFERNAL',
    promo_sub:        '30% OFF em toda a coleção da temporada',
    promo_btn:        'Ver ofertas',
    promo_horas:      'horas',
    promo_min:        'min',
    promo_seg:        'seg',

    filtrar:          'Filtrar:',
    todos:            'Todos',
    ordenar:          'Ordenar: Padrão',
    precio_menor:     'Preço: Menor',
    precio_mayor:     'Preço: Maior',
    mejor_val:        'Mais avaliados',
    en_oferta:        'Em oferta',

    carrito_titulo:   '⛧ CARRINHO',
    carrito_vacio:    'Seu carrinho está vazio. Adicione algo do inferno!',
    carrito_total:    'Total',
    carrito_pagar:    'Finalizar compra',

    auth_login:       'Entrar',
    auth_registro:    'Criar conta',
    auth_email:       'E-mail',
    auth_password:    'Senha',
    auth_nombre:      'Nome completo',
    auth_confirmar:   'Confirmar senha',
    auth_btn_login:   'Entrar no inferno ⛧',
    auth_btn_reg:     'Juntar-se ao inferno ⛧',
    auth_ya_cuenta:   'Já tem uma conta?',
    auth_no_cuenta:   'Não tem uma conta?',
    auth_creala:      'Crie aqui',
    auth_inicia:      'Entrar',
    auth_volver:      '← Voltar à loja',

    cuenta_titulo:    'MINHA CONTA',
    cuenta_perfil:    '👤 Perfil',
    cuenta_pedidos:   '📦 Meus pedidos',
    cuenta_carrito:   '🛒 Carrinho salvo',
    cuenta_cerrar:    '⛧ Sair',
    pedidos_vacio:    'Você ainda não fez nenhum pedido.',
    ir_catalogo:      'Ir ao catálogo →',
    finalizar:        'Finalizar compra ⛧',
    seguir:           'Continuar comprando',

    wa_soporte:       'Suporte ao vivo',

    foot_tienda:      'Loja',
    foot_ayuda:       'Ajuda',
    foot_siguenos:    'Siga-nos',
    foot_faq:         'FAQ',
    foot_envios:      'Envios',
    foot_devol:       'Devoluções',
    foot_tallas:      'Guia de tamanhos',
    foot_copy:        '© 2025 HELLWEAR — TODOS OS DIREITOS RESERVADOS',

    lang_titulo:      'Selecione seu idioma',
    lang_auto:        'Detectado automaticamente',
    lang_cambiar:     'Mudar idioma',
  },

  fr: {
    nav_catalogo:     'Catalogue',
    nav_categorias:   'Catégories',
    nav_ofertas:      'Promotions',
    nav_nosotros:     'À propos',
    nav_entrar:       '👤 Connexion',
    nav_buscar:       'Chercher dans l\'enfer...',
    nav_carrito:      'Panier',

    hero_eyebrow:     'Nouvelle collection 2025',
    hero_titulo1:     'PORTE',
    hero_titulo2:     'LE CHAOS',
    hero_sub:         'Vêtements sombres, exclusifs et inégalés. Conçus pour ceux qui n\'appartiennent pas à ce monde.',
    hero_btn1:        'Voir la collection',
    hero_btn2:        'Lookbook ↗',

    sec_explorar:     'Explorer',
    sec_categorias:   'CATÉGORIES',
    sec_destacados_e: 'Les plus populaires',
    sec_destacados:   'VEDETTES',
    sec_catalogo_e:   'Catalogue',
    sec_catalogo:     'CATALOGUE',

    cat_camisetas:    'T-SHIRTS',
    cat_sudaderas:    'SWEATS',
    cat_accesorios:   'ACCESSOIRES',
    cat_limitada:     'ÉDITION LIMITÉE',
    cat_productos:    'produits',

    prod_anadir:      'Ajouter au panier',
    prod_nuevo:       'Nouveau',
    prod_oferta:      'Promo',
    prod_popular:     'Populaire',
    ver_catalogo:     'Voir tout le catalogue →',

    promo_titulo:     'OFFRE INFERNALE',
    promo_sub:        '30% de réduction sur toute la collection saisonnière',
    promo_btn:        'Voir les offres',
    promo_horas:      'heures',
    promo_min:        'min',
    promo_seg:        'sec',

    filtrar:          'Filtrer:',
    todos:            'Tous',
    ordenar:          'Trier: Défaut',
    precio_menor:     'Prix: Croissant',
    precio_mayor:     'Prix: Décroissant',
    mejor_val:        'Mieux notés',
    en_oferta:        'En promo',

    carrito_titulo:   '⛧ PANIER',
    carrito_vacio:    'Votre panier est vide. Ajoutez quelque chose de l\'enfer!',
    carrito_total:    'Total',
    carrito_pagar:    'Passer à la caisse',

    auth_login:       'Se connecter',
    auth_registro:    'Créer un compte',
    auth_email:       'Adresse e-mail',
    auth_password:    'Mot de passe',
    auth_nombre:      'Nom complet',
    auth_confirmar:   'Confirmer le mot de passe',
    auth_btn_login:   'Entrer dans l\'enfer ⛧',
    auth_btn_reg:     'Rejoindre l\'enfer ⛧',
    auth_ya_cuenta:   'Vous avez déjà un compte?',
    auth_no_cuenta:   'Pas de compte?',
    auth_creala:      'Créez-en un ici',
    auth_inicia:      'Se connecter',
    auth_volver:      '← Retour à la boutique',

    cuenta_titulo:    'MON COMPTE',
    cuenta_perfil:    '👤 Profil',
    cuenta_pedidos:   '📦 Mes commandes',
    cuenta_carrito:   '🛒 Panier sauvegardé',
    cuenta_cerrar:    '⛧ Se déconnecter',
    pedidos_vacio:    'Vous n\'avez pas encore passé de commande.',
    ir_catalogo:      'Aller au catalogue →',
    finalizar:        'Finaliser l\'achat ⛧',
    seguir:           'Continuer les achats',

    wa_soporte:       'Support en direct',

    foot_tienda:      'Boutique',
    foot_ayuda:       'Aide',
    foot_siguenos:    'Suivez-nous',
    foot_faq:         'FAQ',
    foot_envios:      'Livraison',
    foot_devol:       'Retours',
    foot_tallas:      'Guide des tailles',
    foot_copy:        '© 2025 HELLWEAR — TOUS DROITS RÉSERVÉS',

    lang_titulo:      'Choisissez votre langue',
    lang_auto:        'Détecté automatiquement',
    lang_cambiar:     'Changer de langue',
  },

  de: {
    nav_catalogo:     'Katalog',
    nav_categorias:   'Kategorien',
    nav_ofertas:      'Angebote',
    nav_nosotros:     'Über uns',
    nav_entrar:       '👤 Anmelden',
    nav_buscar:       'In der Hölle suchen...',
    nav_carrito:      'Warenkorb',

    hero_eyebrow:     'Neue Kollektion 2025',
    hero_titulo1:     'TRAGE',
    hero_titulo2:     'DAS CHAOS',
    hero_sub:         'Dunkle, exklusive und unvergleichliche Kleidung. Für diejenigen gemacht, die nicht in diese Welt gehören.',
    hero_btn1:        'Kollektion ansehen',
    hero_btn2:        'Lookbook ↗',

    sec_explorar:     'Erkunden',
    sec_categorias:   'KATEGORIEN',
    sec_destacados_e: 'Beliebteste',
    sec_destacados:   'HIGHLIGHTS',
    sec_catalogo_e:   'Katalog',
    sec_catalogo:     'KATALOG',

    cat_camisetas:    'T-SHIRTS',
    cat_sudaderas:    'HOODIES',
    cat_accesorios:   'ACCESSOIRES',
    cat_limitada:     'LIMITIERTE EDITION',
    cat_productos:    'Produkte',

    prod_anadir:      'In den Warenkorb',
    prod_nuevo:       'Neu',
    prod_oferta:      'Angebot',
    prod_popular:     'Beliebt',
    ver_catalogo:     'Gesamten Katalog ansehen →',

    promo_titulo:     'HÖLLISCHES ANGEBOT',
    promo_sub:        '30% Rabatt auf die gesamte Saisonkollektion',
    promo_btn:        'Angebote ansehen',
    promo_horas:      'Stunden',
    promo_min:        'Min',
    promo_seg:        'Sek',

    filtrar:          'Filtern:',
    todos:            'Alle',
    ordenar:          'Sortieren: Standard',
    precio_menor:     'Preis: Aufsteigend',
    precio_mayor:     'Preis: Absteigend',
    mejor_val:        'Beste Bewertung',
    en_oferta:        'Im Angebot',

    carrito_titulo:   '⛧ WARENKORB',
    carrito_vacio:    'Ihr Warenkorb ist leer. Fügen Sie etwas aus der Hölle hinzu!',
    carrito_total:    'Gesamt',
    carrito_pagar:    'Zur Kasse gehen',

    auth_login:       'Anmelden',
    auth_registro:    'Konto erstellen',
    auth_email:       'E-Mail-Adresse',
    auth_password:    'Passwort',
    auth_nombre:      'Vollständiger Name',
    auth_confirmar:   'Passwort bestätigen',
    auth_btn_login:   'In die Hölle eintreten ⛧',
    auth_btn_reg:     'Der Hölle beitreten ⛧',
    auth_ya_cuenta:   'Haben Sie bereits ein Konto?',
    auth_no_cuenta:   'Noch kein Konto?',
    auth_creala:      'Hier erstellen',
    auth_inicia:      'Anmelden',
    auth_volver:      '← Zurück zum Shop',

    cuenta_titulo:    'MEIN KONTO',
    cuenta_perfil:    '👤 Profil',
    cuenta_pedidos:   '📦 Meine Bestellungen',
    cuenta_carrito:   '🛒 Gespeicherter Warenkorb',
    cuenta_cerrar:    '⛧ Abmelden',
    pedidos_vacio:    'Sie haben noch keine Bestellung aufgegeben.',
    ir_catalogo:      'Zum Katalog →',
    finalizar:        'Kauf abschließen ⛧',
    seguir:           'Weiter einkaufen',

    wa_soporte:       'Live-Support',

    foot_tienda:      'Shop',
    foot_ayuda:       'Hilfe',
    foot_siguenos:    'Folgen Sie uns',
    foot_faq:         'FAQ',
    foot_envios:      'Versand',
    foot_devol:       'Rückgaben',
    foot_tallas:      'Größentabelle',
    foot_copy:        '© 2025 HELLWEAR — ALLE RECHTE VORBEHALTEN',

    lang_titulo:      'Sprache auswählen',
    lang_auto:        'Automatisch erkannt',
    lang_cambiar:     'Sprache ändern',
  },

  ja: {
    nav_catalogo:     'カタログ',
    nav_categorias:   'カテゴリー',
    nav_ofertas:      'セール',
    nav_nosotros:     '私たちについて',
    nav_entrar:       '👤 ログイン',
    nav_buscar:       '地獄で検索...',
    nav_carrito:      'カート',

    hero_eyebrow:     '新コレクション 2025',
    hero_titulo1:     '纏え',
    hero_titulo2:     '混沌を',
    hero_sub:         'この世界に属さない人のために作られた、ダークで唯一無二の服。',
    hero_btn1:        'コレクションを見る',
    hero_btn2:        'ルックブック ↗',

    sec_explorar:     '探索',
    sec_categorias:   'カテゴリー',
    sec_destacados_e: '人気商品',
    sec_destacados:   '注目商品',
    sec_catalogo_e:   'カタログ',
    sec_catalogo:     'カタログ',

    cat_camisetas:    'Tシャツ',
    cat_sudaderas:    'パーカー',
    cat_accesorios:   'アクセサリー',
    cat_limitada:     '限定版',
    cat_productos:    '商品',

    prod_anadir:      'カートに追加',
    prod_nuevo:       '新着',
    prod_oferta:      'セール',
    prod_popular:     '人気',
    ver_catalogo:     'カタログをすべて見る →',

    promo_titulo:     '地獄のセール',
    promo_sub:        'シーズンコレクション全品30%オフ',
    promo_btn:        'セールを見る',
    promo_horas:      '時間',
    promo_min:        '分',
    promo_seg:        '秒',

    filtrar:          '絞り込み:',
    todos:            'すべて',
    ordenar:          '並び替え: デフォルト',
    precio_menor:     '価格: 安い順',
    precio_mayor:     '価格: 高い順',
    mejor_val:        '評価順',
    en_oferta:        'セール中',

    carrito_titulo:   '⛧ カート',
    carrito_vacio:    'カートは空です。地獄から何かを追加してください！',
    carrito_total:    '合計',
    carrito_pagar:    'チェックアウトへ進む',

    auth_login:       'ログイン',
    auth_registro:    'アカウント作成',
    auth_email:       'メールアドレス',
    auth_password:    'パスワード',
    auth_nombre:      'フルネーム',
    auth_confirmar:   'パスワードを確認',
    auth_btn_login:   '地獄に入る ⛧',
    auth_btn_reg:     '地獄に参加する ⛧',
    auth_ya_cuenta:   'すでにアカウントをお持ちですか?',
    auth_no_cuenta:   'アカウントをお持ちでないですか?',
    auth_creala:      'こちらで作成',
    auth_inicia:      'ログイン',
    auth_volver:      '← ショップに戻る',

    cuenta_titulo:    'マイアカウント',
    cuenta_perfil:    '👤 プロフィール',
    cuenta_pedidos:   '📦 注文履歴',
    cuenta_carrito:   '🛒 保存されたカート',
    cuenta_cerrar:    '⛧ ログアウト',
    pedidos_vacio:    'まだ注文がありません。',
    ir_catalogo:      'カタログへ →',
    finalizar:        '購入を完了する ⛧',
    seguir:           '買い物を続ける',

    wa_soporte:       'ライブサポート',

    foot_tienda:      'ショップ',
    foot_ayuda:       'ヘルプ',
    foot_siguenos:    'フォローする',
    foot_faq:         'FAQ',
    foot_envios:      '配送',
    foot_devol:       '返品',
    foot_tallas:      'サイズガイド',
    foot_copy:        '© 2025 HELLWEAR — 全著作権所有',

    lang_titulo:      '言語を選択',
    lang_auto:        '自動検出',
    lang_cambiar:     '言語を変更',
  },
};

// ── Estado del i18n ────────────────────────────────────────
let idiomaActual = 'es';
let detectadoPorIP = false;

// ── Función principal de traducción ───────────────────────
function t(clave) {
  return (T[idiomaActual] && T[idiomaActual][clave]) || T['es'][clave] || clave;
}

// ── Aplicar traducciones al DOM ────────────────────────────
// Elementos con data-i18n="clave" se traducen automáticamente
function aplicarTraduccion() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const clave = el.getAttribute('data-i18n');
    const attr  = el.getAttribute('data-i18n-attr'); // para placeholder, title, etc.
    const texto = t(clave);
    if (attr) el.setAttribute(attr, texto);
    else      el.textContent = texto;
  });

  // Actualizar selector si existe
  const sel = document.getElementById('langSelector');
  if (sel) sel.value = idiomaActual;

  // Actualizar bandera del botón
  const btn = document.getElementById('langBtn');
  if (btn) {
    const info = IDIOMAS[idiomaActual];
    btn.innerHTML = `${info.bandera} <span style="font-size:10px;letter-spacing:0.1em">${info.codigo.toUpperCase()}</span>`;
  }

  // Actualizar <html lang="">
  document.documentElement.lang = idiomaActual;

  // Disparar evento para que otros scripts reaccionen
  document.dispatchEvent(new CustomEvent('idiomaChanged', { detail: { idioma: idiomaActual } }));
}

// ── Cambiar idioma manualmente ─────────────────────────────
function cambiarIdioma(codigo, cerrarModal = true) {
  if (!T[codigo]) return;
  idiomaActual = codigo;
  localStorage.setItem('hw_idioma', codigo);
  aplicarTraduccion();
  if (cerrarModal) cerrarModalIdioma();
}

// ── Detectar idioma por IP ─────────────────────────────────
async function detectarIdiormaIP() {
  // 1. Leer preferencia guardada
  const guardado = localStorage.getItem('hw_idioma');
  if (guardado && T[guardado]) {
    idiomaActual = guardado;
    aplicarTraduccion();
    return;
  }

  // 2. Intentar detectar por IP usando ip-api.com (gratis, sin key)
  try {
    const r    = await fetch('https://ip-api.com/json/?fields=countryCode', { signal: AbortSignal.timeout(3000) });
    const data = await r.json();
    const pais = data.countryCode;
    const idioma = PAIS_IDIOMA[pais] || 'en';
    idiomaActual    = idioma;
    detectadoPorIP  = true;
    localStorage.setItem('hw_idioma', idioma);
  } catch (e) {
    // 3. Fallback: idioma del navegador
    const navLang = (navigator.language || 'es').slice(0, 2).toLowerCase();
    idiomaActual = T[navLang] ? navLang : 'es';
  }

  aplicarTraduccion();

  // Si fue detectado automáticamente y no es español, mostrar notificación
  if (detectadoPorIP && idiomaActual !== 'es') {
    mostrarNotifIdioma();
  }
}

// ── Notificación de idioma detectado ──────────────────────
function mostrarNotifIdioma() {
  const info = IDIOMAS[idiomaActual];
  const notif = document.createElement('div');
  notif.id = 'langNotif';
  notif.style.cssText = `
    position:fixed; bottom:5rem; left:50%; transform:translateX(-50%);
    background:#130202; border:1px solid #6a0f10; padding:12px 20px;
    font-family:'Share Tech Mono',monospace; font-size:11px; color:#f0e4e4;
    letter-spacing:0.1em; z-index:500; display:flex; align-items:center;
    gap:12px; white-space:nowrap; animation: fadeInUp 0.4s ease;
  `;
  notif.innerHTML = `
    <span>${info.bandera} ${t('lang_auto')}: <strong>${info.nombre}</strong></span>
    <button onclick="abrirModalIdioma()" style="background:none;border:1px solid #6a0f10;color:#ff4040;
      font-family:'Share Tech Mono',monospace;font-size:10px;padding:4px 10px;cursor:pointer;
      letter-spacing:0.1em;">${t('lang_cambiar')}</button>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:#7a5555;
      cursor:pointer;font-size:1rem;">✕</button>
  `;
  document.body.appendChild(notif);
  setTimeout(() => notif?.remove(), 6000);
}

// ── Modal selector de idioma ───────────────────────────────
function abrirModalIdioma() {
  let modal = document.getElementById('langModal');
  if (modal) { modal.classList.add('open'); return; }

  modal = document.createElement('div');
  modal.id = 'langModal';
  modal.style.cssText = `
    position:fixed; inset:0; z-index:600;
    background:rgba(0,0,0,0.85);
    display:flex; align-items:center; justify-content:center;
    padding:2rem;
  `;
  modal.innerHTML = `
    <div style="background:#130202; border:1px solid #3a1010;
      max-width:480px; width:100%; position:relative; overflow:hidden;">

      <!-- Esquinas decorativas -->
      <div style="position:absolute;top:-1px;left:-1px;width:14px;height:14px;border-top:2px solid #c0191a;border-left:2px solid #c0191a;"></div>
      <div style="position:absolute;top:-1px;right:-1px;width:14px;height:14px;border-top:2px solid #c0191a;border-right:2px solid #c0191a;"></div>
      <div style="position:absolute;bottom:-1px;left:-1px;width:14px;height:14px;border-bottom:2px solid #c0191a;border-left:2px solid #c0191a;"></div>
      <div style="position:absolute;bottom:-1px;right:-1px;width:14px;height:14px;border-bottom:2px solid #c0191a;border-right:2px solid #c0191a;"></div>

      <div style="padding:1.75rem 2rem; border-bottom:1px solid #3a1010;
        display:flex; justify-content:space-between; align-items:center;">
        <div style="font-family:'Black Han Sans',sans-serif;font-size:1.4rem;letter-spacing:0.08em;">
          ⛧ <span style="color:#ff4040;">${t('lang_titulo').split(' ').slice(0,2).join(' ')}</span> ${t('lang_titulo').split(' ').slice(2).join(' ')}
        </div>
        <button onclick="cerrarModalIdioma()" style="background:none;border:none;
          color:#7a5555;cursor:pointer;font-size:1.3rem;transition:color 0.2s;"
          onmouseover="this.style.color='#ff4040'" onmouseout="this.style.color='#7a5555'">✕</button>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#3a1010;padding:1px;margin:1.5rem;">
        ${Object.entries(IDIOMAS).map(([cod, info]) => `
          <button onclick="cambiarIdioma('${cod}')"
            style="background:${cod===idiomaActual?'rgba(192,25,26,0.15)':'#180303'};
            border:${cod===idiomaActual?'1px solid #c0191a':'1px solid transparent'};
            padding:1rem; cursor:pointer; display:flex; align-items:center; gap:12px;
            font-family:'Barlow',sans-serif; color:#f0e4e4; text-align:left;
            transition:background 0.15s;"
            onmouseover="this.style.background='rgba(192,25,26,0.1)'"
            onmouseout="this.style.background='${cod===idiomaActual?'rgba(192,25,26,0.15)':'#180303'}'">
            <span style="font-size:1.8rem;">${info.bandera}</span>
            <div>
              <div style="font-family:'Black Han Sans',sans-serif;font-size:0.95rem;letter-spacing:0.06em;">${info.nombre}</div>
              <div style="font-family:'Share Tech Mono',monospace;font-size:9px;color:#7a5555;letter-spacing:0.1em;">${cod.toUpperCase()}${cod===idiomaActual?' ✓':''}</div>
            </div>
          </button>
        `).join('')}
      </div>
    </div>
  `;

  modal.addEventListener('click', e => { if (e.target === modal) cerrarModalIdioma(); });
  document.body.appendChild(modal);
}

function cerrarModalIdioma() {
  document.getElementById('langModal')?.remove();
}

// ── Inyectar botón de idioma en el navbar ──────────────────
function inyectarBotonIdioma() {
  const navIcons = document.querySelector('.nav-icons');
  if (!navIcons || document.getElementById('langBtn')) return;

  const btn = document.createElement('button');
  btn.id = 'langBtn';
  btn.title = 'Cambiar idioma';
  btn.style.cssText = 'background:none;border:1px solid #3a1010;color:#f0e4e4;cursor:pointer;font-size:14px;padding:4px 10px;display:flex;align-items:center;gap:4px;transition:border-color 0.2s;';
  btn.onmouseover = () => btn.style.borderColor = '#c0191a';
  btn.onmouseout  = () => btn.style.borderColor = '#3a1010';
  btn.onclick = abrirModalIdioma;

  const info = IDIOMAS[idiomaActual];
  btn.innerHTML = `${info.bandera} <span style="font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:0.1em;">${info.codigo.toUpperCase()}</span>`;

  // Insertar antes del primer botón
  navIcons.insertBefore(btn, navIcons.firstChild);
}

// ── Animación CSS ──────────────────────────────────────────
const estiloAnim = document.createElement('style');
estiloAnim.textContent = `
  @keyframes fadeInUp {
    from { opacity:0; transform:translateX(-50%) translateY(20px); }
    to   { opacity:1; transform:translateX(-50%) translateY(0); }
  }
`;
document.head.appendChild(estiloAnim);

// ── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  await detectarIdiormaIP();
  inyectarBotonIdioma();
});
