# Cantini Estates

> Ecosistema de tokenización de fine wine que integra propiedad de viñedos, producción anual y experiencias reales (hospitalidad, vino, eventos) en activos digitales — "from soil to glass, from vine to villa".

**Status:** Propuesta de tokenización en revisión · Integración con Ankora a definir
**Asset type:** Viñedo + producción vitivinícola + hospitalidad (mixed-use)
**Ubicación:** Alto Agrelo, Mendoza, Argentina
**Partners de experiencia:** Cantini Estates (hotel + spa) · Oria Club (Mendoza, Tuscany, Punta del Este)

---

## El concepto

Cantini propone un modelo de **tokenización multi-capa** donde un mismo inversor puede participar en:

1. **La tierra** — propiedad fraccional de viñedos (m² en Alto Agrelo).
2. **La producción** — yield anual de vino equivalente a la superficie staked.
3. **La experiencia** — canje de tokens por estadías, eventos, botellas coleccionables.

El objetivo: que cada inversor "se vuelva parte de la historia", no solo dueño de un pedazo de tierra.

## Ecosistema de tokens propuesto

El modelo propuesto por Cantini define **3 activos digitales** que reflejan componentes tangibles del estate:

| Token / Asset | Type | Representa | Utilidad |
|---|---|---|---|
| **CT_LAND** | ERC-20 | Propiedad de viñedo (m² de Alto Agrelo) | Activo tradeable, genera CT_WINE por staking |
| **CT_WINE** | ERC-20 | Yield anual de vino (o crédito equivalente) | Canjeable, redimible, quemable para mintear NFTs |
| **CNC_WINE_NFT** | ERC-721 (Soulbound) | Certificado de vino coleccionable (cosecha/añada específica) | Proof of ownership + acceso a entrega física |

## Tokenomics (estimación inicial)

| Elemento | Descripción | Estimado inicial |
|---|---|---|
| Superficie total del viñedo | 25 hectáreas (250.000 m²) | Tokenizadas como 250.000 CT_LAND |
| Precio CT_LAND | 1 CT_LAND = 1 m² | 50 USDT |
| Generación CT_WINE | Yield anual por CT_LAND staked | 1,5 CT_WINE / CT_LAND / año |
| Precio referencia CT_WINE | Ligado al valor de botella física | ≈ USD 50 |
| Ratio NFT burn | CT_WINE necesarios para 1 NFT | 6 CT_WINE → 1 NFT |

## Token flow

1. **Compra:** inversores compran parcelas de viñedo (CT_LAND).
2. **Generación:** cada año, los CT_LAND staked generan CT_WINE (yield anual).
3. **Redención:** holders queman CT_WINE para mintear CNC_WINE_NFT (botella física, edición limitada o experiencia).
4. **Rewards:** acumulación de tokens desbloquea tiers de membresía con acceso a beneficios reales.

## Sistema de membresías (tiers)

| Tier | Requerimientos | Rewards |
|---|---|---|
| **MOSAIC** | +200 CT_LAND | 1 noche en hotel boutique + cata virtual |
| **QUADRO** | +800 CT_LAND o 3.000 CT_WINE | 3 noches + 1 sesión de spa + acceso a Oria Club |
| **ALTURA** | +5.000 CT_LAND o 15.000 CT_WINE | 5 noches/año + blending session + NFT de cosecha personalizado |
| **TERROIR LANDLORD** | +6.000 CT_LAND + NFT ownership | Estadía estacional en villa + "Homenaje al Malbec" + beneficios vitalicios |

## Plataforma digital (features propuestas)

- **Mapa interactivo:** visualización 3D de parcelas con status de propiedad.
- **Dashboard:** balance de CT_LAND, CT_WINE, NFTs.
- **Rewards section:** canje de beneficios y gestión de NFTs de hospitalidad.
- **Trazabilidad:** datos de terroir + cámaras en vivo del viñedo.
- **Governance (opcional):** voting tokenizado sobre blends, eventos, nuevas añadas.

## Integración con el mundo físico

- Wine NFTs canjeables por botellas físicas o ediciones coleccionables.
- Reward NFTs funcionan como vouchers (canje por QR) para estadías o spa.
- Conexión con **Oria Club** extiende la experiencia a Mendoza, Toscana y Punta del Este.

## Roadmap propuesto (por Cantini)

| Fase | Entregables | Tiempo |
|---|---|---|
| 1 — Smart contracts | Contratos base de tokens, staking, rewards | 3–4 semanas |
| 2 — dApp + wallet | Dashboard, marketplace, rewards panel | 4–6 semanas |
| 3 — Oracles + data layer | Datos en vivo del viñedo (clima, cámaras, crecimiento) | 6–8 semanas |
| 4 — Token sale + wine generation | Pre-sale, activación de tiers, NFT minting | 2–3 meses |
| 5 — Marketplace expansion | Mercado secundario para tokens y experiencias | Ongoing |

## Ventajas estratégicas

- **Transparencia:** operaciones del viñedo y rewards en blockchain.
- **Engagement:** staking, voting, experiencias — participación continua.
- **Liquidez:** activos digitales con mecanismos de buyback.
- **Prestigio:** heritage de Cantini + expertise enológico.
- **Sustentabilidad:** fees operativos bajos, arquitectura escalable.

## Riesgos específicos

- **Encaje regulatorio:** el modelo Cantini usa tokens utility + soulbound NFTs — necesita ser adaptado al régimen CNV RG 1069/2025 (fideicomiso financiero como vehículo legal).
- **Agronómico / climático:** granizo, heladas, estrés hídrico.
- **Operativo:** dependencia del sponsor para producción, hospitalidad y cámaras en vivo.
- **Liquidez del secundario:** la tokenomics supone mercado activo para CT_LAND y CT_WINE.

---

## Notas para el dev

**Imágenes disponibles en `/projects/cantini/` (servidas desde `public/projects/cantini/`):**

- `hero.jpg` — hero image
- `gallery-01.jpg` – `gallery-08.jpg` — 8 imágenes extraídas de la revista de marca Cantini Estates (viñedos, villa, interiores de hotel, detalles de producción, retratos)

**Uso en Next.js:**

```tsx
<Image src="/projects/cantini/hero.jpg" alt="Cantini Estates" width={6000} height={4000} priority />
```

> ⚠️ Las imágenes originales están en resolución print (hasta 6000×4000). Usar `next/image` con `sizes` y `quality` apropiados para no servir MB innecesarios.

- **Adaptación Ankora:** la propuesta Cantini es para **su propia plataforma**. Para listarlo en Ankora, hay que adaptar el modelo a fideicomiso financiero bajo CNV. Usar el modelo Cantini como **referencia de features y UX**, no como spec final de la ficha.
- **Modelo de tiers:** es una feature diferenciadora — preservar el concepto de membresías / rewards experiencial.
- **Campos a confirmar con el equipo antes de publicar:** estructura legal final (fideicomiso), tickets en USD, APY o equivalente, tramos si los hay, relación entre CT_LAND/CT_WINE y la documentación de oferta pública.
- **Faltantes sugeridas:** logo vectorial Cantini + Oria Club, fotos del spa y del Oria Club fuera de Mendoza (Tuscany, Punta del Este), videos cortos del viñedo.
