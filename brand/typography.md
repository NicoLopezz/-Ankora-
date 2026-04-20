# Ankora — Tipografía

## Fuente principal: Plus Jakarta Sans

- **Proveedor:** Google Fonts, licencia SIL OFL, variable font
- **URL:** https://fonts.google.com/specimen/Plus+Jakarta+Sans
- **Fallback stack:** `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

## Escala tipográfica

| Nivel | Peso | Tamaño (desktop / mobile) | Tracking | Uso |
|---|---|---|---|---|
| **Display / H1** | ExtraBold (800) | 60px / 36px | -0.03em | Hero headlines, títulos de sección hero |
| **H2** | Bold (700) | 44px / 28px | -0.025em | Títulos de sección |
| **H3** | Bold (700) | 28px / 22px | -0.01em | Títulos de cards, subtítulos de sección |
| **H4** | SemiBold (600) | 20px / 18px | 0 | Labels de sección, nombres de features |
| **Body large** | Regular (400) | 20px / 18px | 0.01em | Subtítulos de hero, textos destacados |
| **Body** | Regular (400) | 16px / 16px | 0.01em | Texto principal de párrafos |
| **Body small** | Medium (500) | 14px / 14px | 0.02em | Captions, metadata, disclaimers |
| **Label / Badge** | Bold (700) | 12px / 11px | 0.06em (uppercase) | Tags, status badges, categorías |
| **Button** | SemiBold (600) | 16px / 15px | 0.02em | Texto de botones |

## Para Next.js (sugerencia)

```tsx
// app/layout.tsx
import { Plus_Jakarta_Sans } from 'next/font/google'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={jakarta.variable}>
      <body>{children}</body>
    </html>
  )
}
```

## Alternativas premium (si se escala)

Cuando el presupuesto lo permita, las opciones premium para reforzar la identidad son:

- **Söhne** (Klim Type Foundry, ~USD 400)
- **GT America** (Grilli Type, ~USD 500)

Estas se considerarían para un rebrand más adelante; por ahora Plus Jakarta Sans es suficiente y gratuita.
