# Ankora — Paleta de colores

## Colores primarios

| Nombre | Hex | RGB | Uso principal |
|---|---|---|---|
| **Brand Burgundy** | `#6d2721` | 109, 39, 33 | Color principal de marca. Nav, hero, secciones premium, botones CTA sobre fondo claro |
| **Brand Cream** | `#ddcfc9` | 221, 207, 201 | Texto principal sobre fondos oscuros. Wordmark del logo. Elementos de luz |
| **Brand Deep** | `#3a1410` | 58, 20, 16 | Body background. Fondos profundos. Base del hero |
| **Footer Deep** | `#2a0f0c` | 42, 15, 12 | Footer. La capa más oscura de la paleta |

## Colores secundarios

| Nombre | Hex | RGB | Uso |
|---|---|---|---|
| **Accent Gold** | `#D4A45A` | 212, 164, 90 | Badges, highlights, números destacados, tokens en renders, hover dorado |
| **Accent Gold Light** | `#e0b76a` | 224, 183, 106 | Gradientes sobre el gold base |
| **Accent Olive** | `#4a7a4e` | 74, 122, 78 | Señales de éxito, status "abierto", vegetación en renders, confianza |
| **Muted Text** | `#b8a99e` | 184, 169, 158 | Texto secundario, subtítulos, labels, placeholders |
| **Arena** | `#ece4dd` | 236, 228, 221 | Fondos secundarios claros, cards, tags, separadores (modo light) |
| **Ivory** | `#FAF8F5` | 250, 248, 245 | Fondo general en secciones claras. No es blanco puro — ligeramente cálido |

## Colores funcionales

| Nombre | Hex | Uso |
|---|---|---|
| **Success** | `#2D7A3A` | Confirmaciones, transacciones exitosas, status "completado" |
| **Warning** | `#D4A45A` | Alertas moderadas, vencimientos próximos (comparte con Accent Gold) |
| **Error** | `#c4392a` | Errores, transacciones fallidas, alertas críticas |
| **Info** | `#2E6B9C` | Información neutral, tooltips, help, links informativos |
| **Disabled** | `#B0ADA8` | Estados inactivos, botones disabled, placeholders |

## Reglas de uso

- **Fondo oscuro (por defecto):** Brand Deep `#3a1410` como body. Texto en Brand Cream `#ddcfc9`. Accent Gold para highlights.
- **Fondo claro (secciones alternadas):** Arena `#ece4dd` o Ivory `#FAF8F5`. Texto en `#1C1C1E` (charcoal). Brand Burgundy `#6d2721` para CTAs y accents.
- **Contrast ratio mínimo:** 4.5:1 (WCAG AA) en todo texto legible.
- **Nunca:** blanco puro `#fff` como fondo (usar Ivory o Arena). Nunca negro puro `#000` como texto (usar Brand Deep o charcoal).

## Para Tailwind (sugerencia de tokens)

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      brand: {
        burgundy: '#6d2721',
        cream: '#ddcfc9',
        deep: '#3a1410',
        'footer-deep': '#2a0f0c',
      },
      accent: {
        gold: '#D4A45A',
        'gold-light': '#e0b76a',
        olive: '#4a7a4e',
      },
      muted: '#b8a99e',
      arena: '#ece4dd',
      ivory: '#FAF8F5',
    },
  },
},
```
