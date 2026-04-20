# Ankora — Overview del proyecto

> **Ankora** es una plataforma global de tokenización de Real World Assets (RWA), con base operativa en Argentina. Permite que activos del mundo real — viñedos, desarrollos inmobiliarios, tierras productivas, energía, infraestructura — se conviertan en certificados de participación digitales (tokens) que inversores de cualquier parte del mundo pueden comprar, mantener y eventualmente transferir.

*Este documento es el overview del producto / proyecto. Para el setup técnico del repo ver `README.md` (el generado por Next.js).*

---

## Tabla de contenidos

1. [La idea en una línea](#la-idea-en-una-línea)
2. [El problema que resolvemos](#el-problema-que-resolvemos)
3. [Cómo funciona Ankora](#cómo-funciona-ankora)
4. [Referente: Securitize](#referente-securitize)
5. [Cómo se diferencia Ankora](#cómo-se-diferencia-ankora)
6. [Arquitectura operativa](#arquitectura-operativa)
7. [Proyectos piloto](#proyectos-piloto)
8. [Estado actual del producto](#estado-actual-del-producto)
9. [Estructura de este repo](#estructura-de-este-repo)

---

## La idea en una línea

Ankora es **"Securitize adaptado al mundo real de Argentina y América Latina"**: marketplace regulado donde un inversor con USD 500 puede comprar una fracción tokenizada de un viñedo en Cafayate, un lote en Mendoza o un desarrollo inmobiliario en la costa — con la misma arquitectura legal, técnica y de cumplimiento que usan los fondos institucionales globales para tokenizar treasuries de BlackRock o private equity.

## El problema que resolvemos

Los **activos reales de alta calidad** (inmobiliario premium, tierras vitivinícolas, proyectos energéticos) son históricamente:

- **Ilíquidos** — salir de una inversión tarda meses o años.
- **Inaccesibles** — tickets mínimos de USD 50.000 a USD 500.000+.
- **Opacos** — papeles en PDF, custodios offline, planillas de Excel.
- **Geográficamente cerrados** — un inversor europeo no puede comprar fácilmente una parte de un viñedo argentino, y viceversa.

Al mismo tiempo, los **emisores de estos activos** (bodegas, desarrolladores, fondos de tierras) enfrentan:

- Capital raise lento y caro (roadshows, reuniones 1-a-1).
- Poca capacidad de ofrecer liquidez al inversor.
- Fricción regulatoria para abrir sus rondas a retail.

La **tokenización** convierte la titularidad fraccionada en un registro en blockchain, inmutable y transferible, regulado por las leyes del país del emisor.

## Cómo funciona Ankora

### Flujo para el inversor

1. **Onboarding / KYC** — Verificación de identidad (documento, selfie, prueba de domicilio) + chequeo de perfil de inversor (retail / calificado / HNWI) y jurisdicción.
2. **Browse** — Explora el marketplace: cada proyecto tiene ficha pública con ubicación, sponsor, monto a levantar (raise), rendimiento proyectado, plazo, estructura legal, riesgos, documentos legales.
3. **Invierte** — Elige ticket, paga en pesos (con on-ramp local) o en USD/USDC. Recibe tokens que representan su participación proporcional en el fideicomiso subyacente.
4. **Hold & track** — Dashboard con valuación actual, reportes trimestrales, distribuciones (yield, principal), estado del proyecto.
5. **Salida** — Venta en secundario dentro de la plataforma (cuando esté habilitada), o por vencimiento del fideicomiso.

### Flujo para el emisor (sponsor del activo)

1. **Structuring** — Ankora + partners legales arman el fideicomiso financiero (vehículo legal con patrimonio separado) y definen tokenomics.
2. **Registro regulatorio** — La emisión se presenta ante la CNV (Argentina) o el regulador correspondiente.
3. **Token mint** — Se emiten los tokens en blockchain (actualmente Polygon vía stack Brickken, estándar ERC-7943).
4. **Colocación** — Ankora publica el proyecto; Allaria coloca; inversores compran.
5. **Servicing** — Ankora gestiona distribuciones, reporting, gobernanza de los tokenholders.

## Referente: Securitize

**Securitize** es el operador referente a nivel global. Opera en EEUU como **transfer agent top-10, broker-dealer (FINRA/SIPC) y exempt adviser**, y en Europa como **plataforma MiFID**. Es el socio tecnológico detrás del **BUIDL Fund de BlackRock** (el money market tokenizado más grande del mundo, con USD ~2.9B bajo administración a fines de 2025).

Datos clave (2025–2026):

- USD 4B+ en AUM tokenizados entre socios como BlackRock, Apollo, KKR, Hamilton Lane, VanEck.
- Ronda estratégica de USD 47M liderada por BlackRock; luego deal SPAC a **USD 1.25B de valuación** (cotización pública vía Cantor Equity Partners II, anunciado oct-2025).
- Modelo de revenue: fees de emisión + servicios de compliance + comisiones de trading secundario.
- Q1 2026: lanzamiento de **exchange tokenizado de acciones** con settlement instantáneo y trading 24/7.

**Lo que tomamos de Securitize:**

- **Regulation-first** — no esquivar normas, traducirlas a código.
- **Dual audience** — producto claro para emisores *y* inversores.
- **Infraestructura SaaS** — la plataforma es la capa de servicios recurrente, no un broker transaccional puro.
- **KYC/compliance como primera capa** antes de acceder a cualquier producto.
- **Multi-chain y multi-activo** desde el día uno.

## Cómo se diferencia Ankora

| Dimensión | Securitize | Ankora |
|---|---|---|
| **Ticket mínimo** | USD 5.000+ (accredited investors) | **USD 500** (retail argentino / LatAm) |
| **Jurisdicción principal** | EEUU (SEC) + EU (MiFID) | **Argentina (CNV RG 1069/2025)** + escalamiento regional |
| **Tipos de activo** | Treasuries, private equity, credit, equities | **Real-world lifestyle**: viñedos, tierras, inmobiliario, energía, turismo |
| **On-ramp de fiat** | USD via broker | **Pesos argentinos** (PSPCP local del grupo) + USD / USDC |
| **Narrativa** | Financiero institucional | **Experiencial / lifestyle** + rendimiento |
| **Transparencia de fees** | Discrecional por emisión | **Publicados upfront** en cada proyecto |

Ankora no compite con Securitize: usa el mismo manual operativo y se enfoca en **activos reales latinoamericanos accesibles a retail**.

## Arquitectura operativa

Ankora funciona con una "triada" de roles regulados:

| Rol | Quién | Qué hace |
|---|---|---|
| **Operador / PSAV / Marca** | **AMG Capital Group S.A.** (grupo Blex) | Opera el marketplace. Inscripto en CNV como Proveedor de Servicios de Activos Virtuales. |
| **Fiduciario + Colocador + ALyC** | **Allaria S.A.** | Administra los fideicomisos financieros que son el vehículo legal de cada emisión. Coloca los tokens. |
| **Stack tecnológico** | **Brickken** (España) | White-label de tokenización. Smart contracts estándar ERC-7943, despliegue en Polygon. |
| **Procesamiento fiat** | **Mecaenpol S.R.L.** (grupo Blex) | PSPCP inscripto en BCRA. Procesa pagos en pesos. |
| **Asesoría legal** | **Estudio MB Partners** | Estructuración legal, compliance, representación ante CNV. |

El marco regulatorio principal es **CNV Resolución General 1069/2025** (con sus modificatorias 1081 y 1087), que habilita el régimen de tokenización de activos reales en Argentina.

## Proyectos piloto

La primera tanda del marketplace va a albergar **4 proyectos**. Cada uno tiene su dossier en `content/projects/<slug>/README.md` y sus imágenes en `public/projects/<slug>/`:

1. **Cafayate RWA Project** (`cafayate`) — 500 hectáreas de tierra vitivinícola en Cafayate, Salta. Sponsor: Bodega Lavaque. Fideicomiso financiero inmobiliario. **Proyecto ancla** con el material más desarrollado.
2. **Alto Agrelo Estates** (`alto-agrelo`) — Desarrollo inmobiliario productivo en Mendoza, zona Agrelo (región vitivinícola premium). Land + home + cultivos.
3. **Cantini Estates** (`cantini`) — Ecosistema inmobiliario con propuesta de tokenización multi-capa (land + wine + hospitality).
4. **Caravan Tech** (`caravan-tech`) — Tokenización de ganado con infraestructura propia (ear tags, bolus, DNA storage, smart contracts).

> Los 4 slugs correctos son los listados arriba. Los placeholders `costa-norte`, `pampa-fertil`, `solar-atacama` que estaban en `public/projects/` como imágenes flat no son proyectos reales del piloto.

## Estado actual del producto

**Q2 2026 — Fase demo (no transaccional).**

El objetivo inmediato es tener la **interfaz del marketplace funcionando** con los 4 proyectos cargados, de modo que:

- Se pueda **ver el flujo** end-to-end (browse, detalle, simulación de inversión).
- No se puedan ejecutar inversiones reales todavía (banner "Demo — investment coming soon").
- Sirva para validar UX con stakeholders y mostrar la plataforma a inversores y partners.

La activación del flujo transaccional real depende de hitos regulatorios y del contrato final con el stack tecnológico — fuera del scope del programador de la web.

## Estructura de este repo

```
Ankora/
├── README.md                    ← setup técnico del Next.js (generado)
├── ABOUT.md                     ← este archivo: overview del proyecto Ankora
├── .gitignore, package.json, next.config.ts, etc.
│
├── brand/                       ← identidad de marca (fuente de verdad)
│   ├── brand-dna.md             ← propósito, valores, voz, do/don'ts
│   ├── colors.md                ← paleta con hex + snippet Tailwind
│   ├── typography.md            ← Plus Jakarta Sans + snippet next/font
│   └── logo/                    ← SVG + PNG
│
├── content/projects/            ← fichas de contenido de los 4 proyectos
│   ├── cafayate/README.md
│   ├── alto-agrelo/README.md
│   ├── cantini/README.md
│   └── caravan-tech/README.md
│
├── public/                      ← assets servidos por Next.js
│   └── projects/                ← imágenes por proyecto (subcarpeta por slug)
│       ├── cafayate/            ← hero, viñedos, renders, mapa
│       ├── alto-agrelo/         ← hero, gallery-01..04, timeline
│       ├── cantini/             ← hero + gallery-01..08
│       └── caravan-tech/        ← hero, gallery-01/02, infrastructure
│
└── src/                         ← código Next.js (la web en sí)
    ├── app/
    ├── components/
    ├── hooks/
    └── lib/
```

**Regla:** todo lo que vive en este repo es material que puede ser público para colaboradores. Material interno (modelo financiero, legales, análisis competitivo, gestiones regulatorias) se mantiene fuera del repo.
