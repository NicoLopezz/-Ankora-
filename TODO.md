# TODO — Ankora

> Última auditoría: 2026-04-23

Roadmap vivo del proyecto. Las sesiones nuevas se insertan **al tope**, por
fecha descendente. Cada bullet referencia archivos/funciones concretas.

---

## Sesión 2026-04-23 · i18n + OG

### Hecho

- **Landing bilingüe ES/EN con `next-intl` 4.9** (modo cookie, sin routing
  prefix). Config en `src/i18n/{config,locale,request}.ts`.
  - `messages/es.json` + `messages/en.json` con 11 namespaces: `nav`,
    `languageSwitch`, `hero`, `stats`, `steps`, `projects`,
    `projectModal`, `structure`, `about`, `faq`, `cta`, `footer`.
  - `NextIntlClientProvider` en `RootLayout`; `<html lang>` dinámico.
  - Server actions `getUserLocale/setUserLocale` con cookie
    `ANKORA_LOCALE` (path `/`, maxAge 1 año, sameSite lax).
  - Dashboard/admin **fuera del scope i18n** — siguen en castellano.
- **Componentes migrados a `useTranslations`**: Nav, Hero, Stats, Steps,
  Projects, ProjectModal, Structure, About, FAQ, CTA, Footer. Status de
  proyectos y categorías FAQ se mantienen como keys (Spanish) con label
  resuelta via `t(\`categories.\${key}\`)` para no tocar estilos por
  categoría.
- **`LanguageSwitch`** (`src/components/layout/LanguageSwitch.tsx`) —
  toggle ES/EN que llama al server action + `router.refresh()` dentro de
  `useTransition`. Está montado **dentro del Nav**, reemplazando el
  antiguo CTA "Acceso anticipado".
- **Logo del Nav** achicado de `h-7 md:h-8` a `h-5 md:h-6` para
  compensar el toggle.
- **OG card dinámica** en `src/app/opengraph-image.tsx` (Next `ImageResponse`
  runtime nodejs, 1200×630): lee `src/app/icon.svg`, renderiza fondo
  bordeaux + logo Ankora + "Anchored to real assets" + subtitle
  "Tokenized real-world assets · Regulated marketplace".
- **Metadata en inglés** en `src/app/layout.tsx`: title, description,
  `openGraph`, `twitter` (Next auto-cablea el `opengraph-image.tsx` como
  `og:image` / `twitter:image`).
- **Commits de la sesión en `main`**:
  - `8393605` — scaffold i18n + migración secciones.
  - `d03d630` — misc (brand assets, TODO, AGENTS, ajustes
    dashboard/admin/dummy-data).
  - `ebdd421` — OG card + metadata en inglés.
  - `6cb385f` — nav logo chico + toggle ES/EN en vez de CTA.
  - Merge commit `f2314ec` de `feat/i18n-landing`.
- **Infra**: rama `feat/i18n-landing` mergeada y pusheada. Vercel
  auto-deploy OK (último Ready al momento de cerrar).

### Convenciones a respetar

- **Para agregar strings nuevos**: meter la clave en ambos `messages/*.json`
  y consumir con `useTranslations('<namespace>')`. Usar `t.raw()` cuando
  el string tenga placeholders `{var}` que se resuelven más tarde (ej.
  `projects.labels.viewDetails` con `{name}`), para evitar que
  `next-intl` tire `FORMATTING_ERROR` al cargar.
- **Datos con estructura** (proyectos, pilares, FAQs): el código tiene
  las keys estáticas (slugs, IDs) y el copy vive en el diccionario. Ver
  `Projects.tsx` `projectsStatic` + `t.raw('items.\${slug}.gallery')`
  como patrón.
- **React Compiler (Next 16)**: no usar `useMemo` para memorizar los
  objects de traducción — si necesitás construir un array por render,
  hacelo inline y el compiler lo resuelve.
- **No tocar dashboard/admin con i18n**. Son paneles regulados AR y
  quedan en castellano. Si mañana se abren a inglés, mover esas rutas
  bajo `[locale]/` y cambiar a `next-intl` en modo routing.
- **Cache de WhatsApp/Telegram**: al cambiar OG, la preview vieja queda
  cacheada. Para forzar refresh compartir URL con query param (`?v=2`).
  Validar scraping real con https://www.opengraph.xyz/.

### Pendiente (nueva sesión)

**i18n / marca**

- [ ] **Favicon más distintivo a tamaño chico**. `src/app/icon.svg`
      tiene 3 triangular paths que forman la "A" de Ankora pero a
      16–32px colapsan visualmente en un triángulo (puede confundirse
      con el logo de Vercel). Opciones: SVG alternativo más bold
      (A rellena en bronze sobre fondo bordeaux), o favicon dinámico
      programático usando la fuente Fraunces.
- [ ] **Metadata bilingüe real**: `src/app/layout.tsx` hoy tiene title/
      description siempre en inglés. Para que un scraper vea el title
      español cuando el cookie dice `es`, usar `generateMetadata()` con
      `getLocale()` y devolver metadata del idioma activo. Impacto SEO.
- [ ] **Upgrade a routing `/en`** si/cuando se busque SEO bilingüe real
      (hreflang, URLs indexables separadas). Hoy con cookie-only Google
      solo indexa la versión default (español). Requiere mover `page.tsx`
      a `app/[locale]/page.tsx` con middleware que excluya
      `/dashboard` y `/admin`.
- [ ] **Dashboard/admin i18n**: si el producto cruza fronteras, migrar
      esos paneles a `useTranslations`. Reusar la infra de `next-intl`
      ya instalada. Alto volumen de strings (disclosures CNV/UIF,
      labels financieros, estados P2P).

**Heredado — sigue vigente del TODO anterior**

*(lo de más abajo no se tocó, sigue siendo el backlog real del producto)*

---

## Sesión 2026-04-23 · Dashboard + Admin

### Hecho

- **Dashboard cliente completo** (`src/app/dashboard/*`):
  - `/dashboard` home con `OnboardingChecklist`, `ActivitySummary`
    (dividendos YTD, próximo pago, últimas liquidaciones, próximo hito),
    KPIs, `PortfolioChart`, `HoldingsTable`, `OpportunitiesCard`,
    `RecentActivity`, footer regulatorio.
  - `/dashboard/activos`, `/dashboard/activos/[slug]` con hero image,
    `AssetActions` (Buy/Sell), `AssetGallery` con lightbox, milestones,
    documentos.
  - `/dashboard/portfolio`, `/dashboard/marketplace`,
    `/dashboard/transacciones`, `/dashboard/perfil`.
  - `/dashboard/p2p` con orderbook y flujo **regulado de 6 pasos** en
    `P2PTakeOrderDialog` (preflight, review con price lock 3 min,
    disclosures CNV/UIF, 2 firmas on-chain, settlement escrow, receipt).
- **Panel super-admin** (`src/app/admin/*`):
  - `/admin` overview (AUM, clientes activos, alertas, top clients, cola
    KYC, audit log).
  - `/admin/usuarios` con 25 clientes mock + search + filtros KYC,
    `/admin/usuarios/[id]` con acciones contextuales (aprobar/rechazar KYC,
    flag UIF).
  - `/admin/compliance` tabla de audit log.
  - `/admin/finanzas` 4 KPIs de tesorería (stub).
  - `/admin/kyc`, `/admin/proyectos`, `/admin/mercado` — placeholders.
- **Componentes comunes nuevos**:
  - `src/components/common/RoleSwitcher.tsx` (demo Cliente ↔ Admin).
  - `src/components/ui/toast.tsx` (`ToastProvider` + `useToast`, variants
    success/error/info/loading con spinner sin auto-dismiss).
  - `NotificationCenter` (drawer lateral), `NotificationPreferences`
    (matrix 7 eventos × 3 canales, críticos bloqueados por compliance),
    `ReferralProgram`, `EmptyState`.
- **Iconos animados nuevos** en `src/components/ui/` siguiendo patrón
  shadcn (`forwardRef` + `useAnimation` + `motion.svg`, trigger desde el
  `Link` parent vía ref):
  - `layout-dashboard`, `coins`, `pie-chart`, `store`, `arrow-left-right`,
    `users`, `shield`, `shield-alert`, `building`.
- **Data mock**:
  - `src/lib/dummy-data.ts` — `dummyUser` (Mariano Pfeiffer), 4 assets con
    `imageUrl` + `gallery[]`, 6 opportunities, 10 transactions, 15 P2P
    orders (2 propias) + helpers (`formatUsd`, `formatDateAr`,
    `formatTimeAgo`, `getPortfolioMetrics`, `getP2PStats`,
    `getMarketPrice`, `categoryLabel`, `statusLabel`).
  - `src/lib/admin-data.ts` — 25 `dummyClients`, `dummyKycQueue` (4 con
    riesgo low/medium/high), `dummyAuditLog`, `getPlatformStats`,
    `formatUsdShort`.
  - `src/types/ankora.ts` — tipos `Asset`, `AssetCategory`, `AssetStatus`,
    `DividendEntry`, `Milestone`, `Opportunity`, `Transaction`,
    `UserProfile`, `P2POrder`, `Client`, `KycQueueItem`, `AuditLogEntry`.
- **Aislamiento del chrome del landing**: `ClientChrome.tsx` y
  `layout/Nav.tsx` ocultan Nav + `HeroSeal` en `/dashboard` y `/admin` vía
  `usePathname()`.
- **Commits de la sesión en `main`**: `2ec2087` (GlobeCanvas sidebar),
  `120ae10` (buy/sell + P2P + notifs + admin), `70c5618` (galería,
  onboarding, empty states, referidos, notif prefs).
- **Infra repo**: origin cambiado a
  `https://github.com/NicoLopezz/-Ankora-.git` (el viejo
  `marianopfeiffer-AMG/Ankora.git` estaba archivado).

### Arquitectura / infra a tener presente

- **Dos superficies separadas** bajo la misma app Next:
  `/dashboard/*` (cliente final) y `/admin/*` (super-admin Ankora team).
  Ambas reusan `GrainientBackground` (shader WebGL del landing) como
  fondo animado y `GlobeCanvas` (2D dot-matrix) como decoración del
  sidebar cliente.
- **Scrollbar**: el layout de dashboard/admin aplica la clase
  `.dashboard-no-scrollbar` al `<html>` en mount para ocultar la barra
  del documento.
- **Lenis smooth scroll global**: cualquier scroll interno (tablas largas,
  body de modales) requiere `data-lenis-prevent` para que Lenis no
  hijackee el wheel.
- **React Compiler (Next 16)**: memoiza automático → **no** usar
  `useMemo` manual (triggerea lint).
- **Rule `react-hooks/set-state-in-effect`** muy estricta — se desactiva
  puntual en secuencias de `setState` intencionales.
- **Autorización**: hoy es dummy — detección por path `/admin`. No hay
  auth real. `RoleSwitcher` es demo.
- **Paleta**: los `globals.css` ya exponen tokens semánticos
  (`bg-bordeaux`, `text-bronze`, `text-oak`, `text-taupe`, card), pero el
  dashboard/admin usan **hex arbitrarios** por decisión consciente para
  no refactorizar. Leftovers purple/cyan de Securitize en `globals.css`
  no se usan.
- **Flujo P2P regulado**: cualquier cambio al take-order debe mantener la
  secuencia de 6 steps + price lock 3 min (requisito CNV/UIF).
- **Notificaciones críticas**: compliance bloquea desactivar ciertos
  eventos en `NotificationPreferences`.

### Pendiente / riesgos conocidos (nueva sesión)

**Urgente**

- [ ] **Mobile nav**: sidebars cliente y admin son `md:flex` only. Falta
      bottom nav en `/dashboard` y `/admin`, y responsive de tablas
      grandes (`/admin/usuarios`, P2P orderbook).
- [ ] **Auth real**: `/dashboard` y `/admin` accesibles a cualquiera.
      Meter Clerk o NextAuth + middleware, gatear por role. Mantener
      `RoleSwitcher` como demo-only.

**Admin Fase 2**

- [ ] `/admin/kyc` funcional — queue con preview de docs (DNI, domicilio,
      origen fondos), modal aprobar/rechazar con motivo, triggers audit
      log + toast.
- [ ] `/admin/proyectos` — cap table por proyecto, próximo milestone,
      ops para cargar reporte Q y distribuir dividendos.
- [ ] `/admin/mercado` — órdenes P2P globales, cancelación por
      moderación, detección wash trading, stats por activo.
- [ ] `/admin/finanzas` — breakdown mensual fees, balances escrow,
      reconciliación Allaria.

**Completitud cliente**

- [ ] Sparkline histórico en el detalle de activo (valor token en el
      tiempo).
- [ ] **Centro fiscal** en `/dashboard/perfil` — Certificado fiscal 2025,
      resumen anual AFIP, historial dividendos. **Alta prioridad
      regulatoria Argentina.**
- [ ] Búsqueda funcional del Topbar (hoy es decorativa).

**Growth**

- [ ] Push/email reales detrás de `NotificationPreferences` (hoy solo
      persiste la preferencia visualmente).

**Deuda técnica**

- [ ] Refactor paleta: migrar dashboard/admin de hex arbitrarios a tokens
      semánticos (`bg-bordeaux`, etc.) ya expuestos.
- [ ] Limpiar leftovers purple/cyan de Securitize en `globals.css`.

### Lo que agregué al radar de "Arq"

- `src/components/common/RoleSwitcher.tsx` — patrón para gateo de rol
  cuando aterricemos auth real: reemplazar detección por path con
  `useUser()` del provider que elijamos.
- `src/components/dashboard/P2PTakeOrderDialog.tsx` — referencia para
  cualquier flujo regulado futuro (issuance primaria, redención,
  rebalanceo): mismo esqueleto de Stepper + disclosures + firmas +
  receipt.
- `src/components/ui/toast.tsx` — single source of truth para toasts. No
  agregar otra lib encima.
- Patrón de iconos animados shadcn-style ya consistente en todo el
  sidebar (cliente y admin) — cualquier icono nuevo de nav debe seguirlo.
