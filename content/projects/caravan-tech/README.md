# Caravan Tech

> Tokenización de ganado en producción usando tecnología propietaria de digitalización animal (ear tags, bolus ruminales, DNA storage, remote sensing). Cada token corresponde a un activo pecuario real, auditable end-to-end.

**Status:** En estructuración para listado en Ankora · Whitepaper técnico disponible
**Asset type:** Livestock (ganado) + infraestructura tech
**Alcance geográfico:** Brasil + Argentina + otros países productores (patentes registradas en USA, Brasil y principales mercados)

---

## La tecnología detrás del activo

Caravan Tech opera un **sistema distribuido de inteligencia de datos** para digitalizar operaciones ganaderas. Con 8+ años de tecnología madura y certificación ICAR.

### Hardware propietario

| Device | Capacidades |
|---|---|
| **Ear Tag** | GPS cada 15 min, lifespan 4+ años, self-recharging (solar), detección de pasos/saltos, THI (temperatura-humedad), 26g, low power, RFID |
| **Ruminal Bolus** | ID único por animal, temperatura interna, detección de movimiento, detección de enfermedades subclínicas, reducción de uso de antibióticos, 4+ años de shelf life |
| **DNA Storage** | Conservación 10+ años, resistente a 50°C, linkeado al ear tag → trazabilidad inmutable por animal |
| **Remote Sensing** | +100.000 imágenes orbitales de Brasil en blockchain, acceso a constelación satelital de alta resolución |

### Software / data

- AI en el cloud que se transforma en algoritmos edge en los ear tags.
- Adaptación de comunicaciones según entorno (5G / LoRaWAN / satélite).
- Information Assurance Models.

## Modelo de tokenización

Caravan Tech propone **dos tipos de activo digital**:

### 1. NFT por animal (Non-Fungible Digital Asset)

Cuando nace un ternero, el productor:
- Define el destino final del animal (peso objetivo + fecha).
- Toma muestra de DNA.
- Coloca ear tag y/o bolus ruminal.
- Se crea un **smart contract** basado en expectativa de vida y peso final.

### 2. CC (Fungible Coin) — respaldada por ganado real

**CC** es una criptomoneda respaldada por ganado físico. Cada animal tiene un conjunto de características que le asignan un valor único, ajustado al precio del pound de ganado en el índice **CME (Live Cattle Futures)**.

Fórmula del smart contract:

```
SC = Leg × B × R × H × DS × (Local market price per pound / CME price per pound)
```

Donde:
- **Leg** = Legalidad (origen, zonas no-deforestadas)
- **B** = Breed (raza)
- **R** = Rearing (orgánico / marbled / convencional)
- **H** = Health (estado sanitario)
- **DS** = Development Stage (0–6 / 6–12 / 12–24 meses)
- **Local market price** = precio de referencia local (ej: B3 Brasil)

## Estructura por etapas del animal

| Stage | Edad | Categoría | Token | Valor token | % disponible al farmer | Crédito al farmer |
|---|---|---|---|---|---|---|
| Birth | 0 meses | Calf | — | — | — | — |
| Stage 1 | 6 meses (weaning) | Steer | Token A | 80% | 45% | USD 540 |
| Stage 2 | 12 meses (growth) | Heifer | Token B | 85% | 70% | USD 858 |
| Stage 3 | 24 meses (feedlot) | Cow | Token C | 95% | 100% | USD 1.286 |
| Liquidation | 17 meses contrato | — | — | — | — | Contract value USD 1.500 |

- **Retorno proyectado CTT investor:** ~14%
- **Caravan Tech fee (certification + system + commission):** ~USD 63
- **Farmer gets:** debit card con liquidación instantánea

## Business models

1. **Direct Investment:** inversores compran tokens que representan animales específicos.
2. **Futures Contracts:** exposición a futuros del ganado.
3. **Warrants / Loans:** el animal actúa como colateral — mientras gana peso, el productor recibe monedas contra "mortgage" del animal.
4. **Marketplaces:** 80% del costo de un animal son insumos (supplies) = oportunidad billonaria.

## CRT — CaravanTech Revenue Token

El **CRT** es un token digital linkeado al valor nominal promedio de Caravan Tech, distribuye profits al inversor.

| Key aspect | Detalle |
|---|---|
| Token Symbol | CRT |
| Nominal value | 10 CRT ≈ precio promedio de animal trazado (USD 150 / CRT) |
| Sale size limit | Hard cap 2% = 2.000.000 CRTs (200.000 animales) |
| Further token issues | Sin emisiones adicionales — valor atado a performance |
| Purchase methods | Fiat + Ethereum (ETH) |
| Holder rights | Retorno directo por profits de la compañía + transparencia |
| Issuance date | 30 enero 2026, ongoing |
| Buy back program | Allocation de profits para recompra en mercado |
| Minting | 4 stages, presale para shareholders |

## Milestones proyectados

| Hito | Escala | Valor digitalizado |
|---|---|---|
| CRT Pre-sale (by contract) | — | — |
| CRT Pre-sale + IMO | — | — |
| Wallet integration + compliance | — | — |
| CT Coin launch | 500K animales, run de 5 meses | — |
| 1M animales digitalizados | — | **USD ~1.500M** |
| 2,7M animales digitalizados | — | **USD ~4.050M** en valor digitalizado |

## Pilares del sistema

- **Legality audit** — ganado de zonas no-deforestadas (compliance con EUDR y regulaciones ambientales).
- **Breed-specific pricing** — ajuste automático por raza (Angus, Brahman, etc.).
- **Rearing type** — orgánico y marbled con premium pricing.
- **Health tracking** — uso de antibióticos, enfermedades afectan valor en vivo.
- **Development stage adjustments** — valor evoluciona con la etapa del animal.

## Riesgos específicos

- **Operativo pecuario:** mortalidad del ganado, enfermedades, robos.
- **Climático:** sequías, inundaciones — afectan rearing y costos de alimentación.
- **Sanitario / regulatorio:** brotes, restricciones de movimiento, compliance EUDR.
- **Mercado de commodities:** precio CME Live Cattle tiene volatilidad significativa.
- **Cambiario:** costos operativos en reales / pesos, liquidación en USD.
- **Adopción tecnológica:** dependencia de los productores para usar correctamente los devices.
- **Encaje regulatorio:** el modelo fue diseñado originalmente como token utility + crypto — para listar en Ankora se debe adaptar al régimen CNV (fideicomiso financiero o estructura equivalente).

---

## Notas para el dev

**Imágenes disponibles en `/projects/caravan-tech/` (servidas desde `public/projects/caravan-tech/`):**

- `hero.png` — hero image
- `gallery-01.png`, `gallery-02.png` — extraídas del deck Crypto Caravan Blueprint
- `infrastructure.png` — diagrama de infraestructura de tokenización

**Uso en Next.js:**

```tsx
<Image src="/projects/caravan-tech/hero.png" alt="Caravan Tech" width={1500} height={1000} priority />
```

- **Tono diferenciado:** este proyecto es **muy diferente** a los otros 3 (tierra / inmobiliario). Narrativa "tech + supply chain + livestock" más que "lifestyle". Fotos documentales, no editoriales.
- **Modelo complejo:** resumir para el usuario final. El doc técnico tiene fórmulas matemáticas — convertir a UI visual (tier cards, timeline del animal, etc).
- **Adaptación Ankora:** el modelo original de Caravan Tech está pensado como plataforma propia (CRT token, Ethereum). Para listarlo en Ankora se debe:
  1. Envolver la exposición en un fideicomiso financiero CNV.
  2. Mapear los tokens Caravan a participaciones del fideicomiso.
  3. Traducir el "farmer debit card" a flujos de distribución del fideicomiso.
- **Campos a confirmar con el equipo antes de publicar:** estructura legal final, ticket mínimo en USD, APY target específico para Ankora, horizonte del listing, relación con el CRT ya emitido.
- **Faltantes sugeridas:** fotos de alta resolución de ganado con ear tags Caravan reales, detalle de hardware (tag + ruminal bolus), visual del sistema satelital en operación, foto del equipo técnico.
