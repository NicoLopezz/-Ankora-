<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Ankora — convenciones vigentes

## Qué es
Plataforma argentina de tokenización de activos reales (RWA) regulada por
CNV RG 1069/2025. Fiduciario Allaria SA, PSAV AMG Capital Group, stack
Brickken + Polygon + ERC-7943.

## Estructura de rutas
- `/` — landing pública (**no tocar** durante trabajo de paneles).
- `/dashboard/*` — panel del inversor final.
- `/admin/*` — panel super-admin Ankora team.

El chrome del landing (Nav + HeroSeal) se oculta en `/dashboard` y
`/admin` vía `usePathname()` en `ClientChrome.tsx` y `layout/Nav.tsx`. No
renderizar globos, navs ni CustomCursor dentro de esos paneles.

## Stack
- Next.js 16 App Router + React 19 + Turbopack.
- Tailwind v4 con tokens oklch en `globals.css`.
- `@base-ui/react` para Dialog primitives, `motion/react` para icons
  animados, `lenis` smooth scroll global.
- Fonts: Fraunces (display), Inter Tight (sans), Geist Mono.

## Paleta (marca Ankora)
Bordeaux `#5e0b15` / `#3a1410`, bronze `#D4A45A`, oak `#ddcfc9`, taupe
`#b8a99e`, card `#4a1a16`.

Los tokens semánticos ya están expuestos (`bg-bordeaux`, `text-bronze`,
`text-oak`, `text-taupe`). **Dashboard y admin actualmente usan hex
arbitrarios** por decisión consciente — el refactor a tokens está en
`TODO.md`. Para código nuevo, preferir tokens semánticos salvo que
quieras consistencia visual con un componente hermano que ya usa hex.

Los leftovers purple/cyan de Securitize en `globals.css` no se usan y
están para limpieza futura.

## Reglas de UI

- **Sin emojis** en dashboard ni admin. Nada de `categoryEmoji`.
- **Lenis smooth scroll** es global: cualquier scroll interno (tablas
  largas, body de modales, drawers) necesita `data-lenis-prevent`, si no
  Lenis hijackea el wheel.
- **Iconos de nav**: patrón shadcn-style (`forwardRef` + `useAnimation` +
  `motion.svg`), el trigger va desde el `Link` parent vía ref — no desde
  hover del icono. Ver `src/components/ui/layout-dashboard.tsx` como
  referencia.
- **Toasts**: usar `useToast` de `src/components/ui/toast.tsx`. Variants
  `success | error | info | loading` (loading no auto-dismiss). No
  agregar otra lib.
- **Scrollbar del documento**: los layouts de dashboard/admin aplican
  `.dashboard-no-scrollbar` al `<html>` en mount. Si creás una superficie
  nueva fuera de esos paneles, no heredes esa clase.

## Reglas de código

- **React Compiler (Next 16) memoiza automático** — no usar `useMemo`
  manual, triggerea lint.
- **`react-hooks/set-state-in-effect`** es estricta. Si tenés una
  secuencia intencional de `setState` dentro de un effect, desactivala
  puntual con comentario, no globalmente.
- TypeScript strict, `any` prohibido. Named exports.

## Flujo P2P y flujos regulados

El `P2PTakeOrderDialog` tiene 6 pasos obligatorios (preflight, review con
price lock 3 min, disclosures CNV/UIF, 2 firmas on-chain, settlement
escrow, receipt). Cualquier otro flujo regulado nuevo (issuance primaria,
redención, rebalanceo) debe seguir el mismo esqueleto Stepper +
disclosures + firmas + receipt.

## Autorización

Hoy es **dummy** via detección del path `/admin`. `RoleSwitcher` es
demo-only. Cuando aterrice auth real (Clerk / NextAuth), reemplazar la
detección por path sin romper el componente.

## Commits y push

- Mensajes concisos, en castellano rioplatense.
- **Nunca** incluir `Co-Authored-By: Claude` (regla global del usuario).
- **Nunca** `git push` sin OK explícito — cada push requiere autorización
  nueva, aunque ya se hayan hecho pushes en la sesión. Commitear cuando
  el usuario pide avanzar está OK; pushear no.
