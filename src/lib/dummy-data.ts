import type {
  Asset,
  Opportunity,
  Transaction,
  PortfolioMetrics,
  UserProfile,
  P2POrder,
} from "@/types/ankora";

export const dummyUser: UserProfile = {
  name: "Mariano Pfeiffer",
  email: "mpfeiffer@ankora.io",
  memberSince: "2025-08-14",
  kycVerified: true,
  walletShort: "0x7f3a…b21e",
  country: "Argentina",
  phone: "+54 9 11 5423 8877",
};

export const dummyAssets: Asset[] = [
  {
    id: "ank-cafayate",
    slug: "cafayate",
    name: "Cafayate Vineyards I",
    shortName: "Cafayate",
    category: "viñedo",
    location: "Cafayate, Salta",
    description:
      "Fideicomiso financiero con oferta pública que tokeniza 500 hectáreas de tierra vitivinícola en Cafayate, Salta — corazón del noroeste argentino. Malbec y Torrontés de altura a 1.660 m.s.n.m.",
    tokensOwned: 50,
    tokensTotal: 15000,
    pricePerToken: 500,
    investedUsd: 25000,
    currentValueUsd: 28450,
    ytdReturnPct: 13.8,
    targetApyPct: 14.2,
    status: "en_rendimiento",
    nextDividendDate: "2026-05-15",
    heroColor: "#6d2721",
    imageUrl: "/projects/cafayate/hero-main.jpg",
    operator: "Bodega Lavaque",
    fiduciario: "Allaria SA",
    vintage: "2025",
    dividendHistory: [
      { date: "2026-04-15", amountUsd: 312.5, periodLabel: "Q1 2026" },
      { date: "2026-01-15", amountUsd: 298.7, periodLabel: "Q4 2025" },
      { date: "2025-10-15", amountUsd: 275.2, periodLabel: "Q3 2025" },
      { date: "2025-07-15", amountUsd: 241.0, periodLabel: "Q2 2025" },
    ],
    milestones: [
      { date: "2025-08-20", title: "Fondeo completado", description: "Tramo Early Adopters cerrado", completed: true },
      { date: "2025-09-10", title: "Escrituración fiduciaria", description: "Allaria SA titulariza las 500 hectáreas", completed: true },
      { date: "2026-03-01", title: "Cosecha vendimia 2026", description: "Inicio de vendimia — Malbec y Torrontés", completed: true },
      { date: "2026-05-15", title: "Dividendo Q1 2026", description: "Distribución trimestral programada", completed: false },
      { date: "2028-08-01", title: "Fin horizonte 36 meses", description: "Transformación tierra virgen → semi-productiva", completed: false },
    ],
    documents: [
      { id: "d1", name: "Contrato fiduciario Cafayate.pdf", type: "contrato", date: "2025-09-10", sizeKb: 412 },
      { id: "d2", name: "Reporte operativo Q1 2026.pdf", type: "reporte", date: "2026-04-10", sizeKb: 1840 },
      { id: "d3", name: "Prospecto CNV RG 1069/2025.pdf", type: "legal", date: "2025-07-22", sizeKb: 2210 },
      { id: "d4", name: "Comprobante fiscal Q1.pdf", type: "fiscal", date: "2026-04-16", sizeKb: 98 },
    ],
  },
  {
    id: "ank-alto-agrelo",
    slug: "alto-agrelo",
    name: "Alto Agrelo Estates",
    shortName: "Alto Agrelo",
    category: "inmueble",
    location: "Luján de Cuyo, Mendoza",
    description:
      "Desarrollo inmobiliario productivo en Alto Agrelo — el corazón de la 'Land of Malbec'. Combina parcela con cultivos premium (nogales, pistachos, viñedos), residencia rural y hospitality tipo Airbnb.",
    tokensOwned: 20,
    tokensTotal: 8000,
    pricePerToken: 500,
    investedUsd: 10000,
    currentValueUsd: 10650,
    ytdReturnPct: 6.5,
    targetApyPct: 9.2,
    status: "en_rendimiento",
    nextDividendDate: "2026-05-02",
    heroColor: "#3d2a1e",
    imageUrl: "/projects/alto-agrelo/hero-v2.jpg",
    operator: "Alto Agrelo Estates",
    fiduciario: "Allaria SA",
    dividendHistory: [
      { date: "2026-04-02", amountUsd: 108.33, periodLabel: "Abril 2026" },
      { date: "2026-03-02", amountUsd: 105.2, periodLabel: "Marzo 2026" },
      { date: "2026-02-02", amountUsd: 103.1, periodLabel: "Febrero 2026" },
    ],
    milestones: [
      { date: "2024-11-15", title: "Fondeo completado", description: "Ronda cerrada", completed: true },
      { date: "2025-02-10", title: "Escrituración", description: "Transferencia fiduciaria", completed: true },
      { date: "2025-06-01", title: "Residencias en operación", description: "Alquiler turístico activo", completed: true },
    ],
    documents: [
      { id: "p1", name: "Contrato fiduciario Alto Agrelo.pdf", type: "contrato", date: "2025-02-10", sizeKb: 380 },
      { id: "p2", name: "Reporte ocupación Q1.pdf", type: "reporte", date: "2026-04-05", sizeKb: 720 },
    ],
  },
  {
    id: "ank-cantini",
    slug: "cantini",
    name: "Cantini Estates",
    shortName: "Cantini",
    category: "tierra",
    location: "Mendoza, Argentina",
    description:
      "Viñedo boutique + hospitality en el valle del Uco. Bodega propia, casa de huéspedes y renta mixta por producción de vino premium y experiencia enoturística.",
    tokensOwned: 10,
    tokensTotal: 5000,
    pricePerToken: 500,
    investedUsd: 5000,
    currentValueUsd: 5180,
    ytdReturnPct: 3.6,
    targetApyPct: 11.0,
    status: "activo",
    nextDividendDate: "2026-07-10",
    heroColor: "#2a2812",
    imageUrl: "/projects/cantini/hero.jpg",
    operator: "Cantini Estates",
    fiduciario: "Allaria SA",
    dividendHistory: [{ date: "2026-01-10", amountUsd: 92.5, periodLabel: "Campaña 2025" }],
    milestones: [
      { date: "2025-11-01", title: "Fondeo completado", description: "Ronda cerrada", completed: true },
      { date: "2026-07-10", title: "Dividendo campaña 2026", description: "Liquidación post-vendimia", completed: false },
    ],
    documents: [{ id: "c1", name: "Escritura fiduciaria.pdf", type: "legal", date: "2025-11-20", sizeKb: 1200 }],
  },
  {
    id: "ank-caravan-tech",
    slug: "caravan-tech",
    name: "Caravan Tech",
    shortName: "Caravan Tech",
    category: "ganaderia",
    location: "Brasil · Argentina",
    description:
      "Livestock tech platform — tokenización de ganado bovino con trazabilidad on-chain. Renta por engorde + apreciación del kilo en pie. Operaciones en Brasil y Argentina.",
    tokensOwned: 6,
    tokensTotal: 20000,
    pricePerToken: 500,
    investedUsd: 3000,
    currentValueUsd: 3090,
    ytdReturnPct: 3.0,
    targetApyPct: 10.5,
    status: "proximo_pago",
    nextDividendDate: "2026-04-28",
    heroColor: "#1e2a3a",
    imageUrl: "/projects/caravan-tech/hero.jpg",
    operator: "Caravan Tech SA",
    fiduciario: "Allaria SA",
    dividendHistory: [{ date: "2026-03-28", amountUsd: 28.5, periodLabel: "Marzo 2026" }],
    milestones: [
      { date: "2025-06-01", title: "Piloto Brasil", description: "Primeros 500 animales trazados on-chain", completed: true },
      { date: "2026-04-28", title: "Primer dividendo", description: "Distribución post engorde", completed: false },
    ],
    documents: [{ id: "s1", name: "Infraestructura tokenización.pdf", type: "legal", date: "2025-06-15", sizeKb: 890 }],
  },
];

export function getAssetBySlug(slug: string): Asset | undefined {
  return dummyAssets.find((a) => a.slug === slug);
}

export const dummyOpportunities: Opportunity[] = [
  {
    id: "opp-vin-002",
    name: "Bodega Agrelo — Reserva",
    category: "viñedo",
    location: "Luján de Cuyo, Mendoza",
    minInvestmentUsd: 500,
    targetApyPct: 14.2,
    fundedPct: 68,
    closingDate: "2026-06-30",
    highlight: "Vintage 2026 asegurada",
  },
  {
    id: "opp-inm-021",
    name: "Residencial Nordelta III",
    category: "inmueble",
    location: "Tigre, Buenos Aires",
    minInvestmentUsd: 500,
    targetApyPct: 9.8,
    fundedPct: 42,
    closingDate: "2026-07-15",
    highlight: "Entrega 2027",
  },
  {
    id: "opp-mar-004",
    name: "Marina Puerto Madero",
    category: "marina",
    location: "CABA, Argentina",
    minInvestmentUsd: 1000,
    targetApyPct: 11.5,
    fundedPct: 91,
    closingDate: "2026-05-10",
    highlight: "Últimos cupos",
  },
  {
    id: "opp-tie-008",
    name: "Olivar Premium La Rioja",
    category: "tierra",
    location: "La Rioja, Argentina",
    minInvestmentUsd: 500,
    targetApyPct: 12.0,
    fundedPct: 23,
    closingDate: "2026-08-20",
    highlight: "Exportación a UE",
  },
  {
    id: "opp-ene-012",
    name: "Parque Eólico Bahía",
    category: "energia",
    location: "Bahía Blanca, Buenos Aires",
    minInvestmentUsd: 1000,
    targetApyPct: 10.5,
    fundedPct: 56,
    closingDate: "2026-09-01",
  },
  {
    id: "opp-vin-009",
    name: "Viñedo Altura 1800 — Salta",
    category: "viñedo",
    location: "Molinos, Salta",
    minInvestmentUsd: 500,
    targetApyPct: 15.0,
    fundedPct: 12,
    closingDate: "2026-10-30",
    highlight: "Recién lanzado",
  },
];

export const dummyTransactions: Transaction[] = [
  { id: "tx-001", date: "2026-04-15", type: "dividendo", assetName: "Cafayate Vineyards I", assetSlug: "cafayate", amountUsd: 312.5, txHashShort: "0xa4…9e2f" },
  { id: "tx-002", date: "2026-04-02", type: "dividendo", assetName: "Alto Agrelo Estates", assetSlug: "alto-agrelo", amountUsd: 108.33, txHashShort: "0x8c…1d4a" },
  { id: "tx-003", date: "2026-03-28", type: "dividendo", assetName: "Caravan Tech", assetSlug: "caravan-tech", amountUsd: 28.5, txHashShort: "0x3b…77cc" },
  { id: "tx-004", date: "2026-03-20", type: "compra", assetName: "Caravan Tech", assetSlug: "caravan-tech", amountUsd: 3000, tokens: 6, txHashShort: "0xef…2abc" },
  { id: "tx-005", date: "2026-03-02", type: "dividendo", assetName: "Alto Agrelo Estates", assetSlug: "alto-agrelo", amountUsd: 105.2, txHashShort: "0x12…4dde" },
  { id: "tx-006", date: "2026-02-28", type: "compra", assetName: "Cantini Estates", assetSlug: "cantini", amountUsd: 5000, tokens: 10, txHashShort: "0x7a…b9c1" },
  { id: "tx-007", date: "2026-02-14", type: "compra", assetName: "Alto Agrelo Estates", assetSlug: "alto-agrelo", amountUsd: 10000, tokens: 20, txHashShort: "0x55…3f08" },
  { id: "tx-008", date: "2026-01-15", type: "dividendo", assetName: "Cafayate Vineyards I", assetSlug: "cafayate", amountUsd: 298.7, txHashShort: "0xde…4a11" },
  { id: "tx-009", date: "2026-01-10", type: "dividendo", assetName: "Cantini Estates", assetSlug: "cantini", amountUsd: 92.5, txHashShort: "0x09…ffed" },
  { id: "tx-010", date: "2025-09-15", type: "compra", assetName: "Cafayate Vineyards I", assetSlug: "cafayate", amountUsd: 25000, tokens: 50, txHashShort: "0xaa…0011" },
];

export function getPortfolioMetrics(): PortfolioMetrics {
  const totalValueUsd = dummyAssets.reduce((s, a) => s + a.currentValueUsd, 0);
  const totalInvestedUsd = dummyAssets.reduce((s, a) => s + a.investedUsd, 0);
  const totalReturnPct = ((totalValueUsd - totalInvestedUsd) / totalInvestedUsd) * 100;
  const monthlyYieldUsd = dummyTransactions
    .filter((t) => t.type === "dividendo" && t.date.startsWith("2026-04"))
    .reduce((s, t) => s + t.amountUsd, 0);
  return {
    totalValueUsd,
    totalInvestedUsd,
    totalReturnPct,
    monthlyYieldUsd,
    assetCount: dummyAssets.length,
    nextPaymentUsd: 178.4,
    nextPaymentDate: "2026-04-28",
  };
}

export function formatUsd(value: number, opts?: { decimals?: number }): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: opts?.decimals ?? 0,
    maximumFractionDigits: opts?.decimals ?? 0,
  });
}

export function formatDateAr(iso: string): string {
  return new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
}

export const categoryLabel: Record<Asset["category"], string> = {
  viñedo: "Viñedo",
  inmueble: "Inmueble",
  tierra: "Tierra productiva",
  energia: "Energía",
  marina: "Marina",
  ganaderia: "Ganadería tech",
};

export const statusLabel: Record<Asset["status"], string> = {
  activo: "Activo",
  en_rendimiento: "En rendimiento",
  proximo_pago: "Próximo pago",
  en_fondeo: "En fondeo",
};

// =========================================================
// P2P Market (mercado secundario entre usuarios verificados)
// =========================================================

// Market reference prices por activo (lo que "vale" un token hoy)
const marketPrices: Record<string, number> = {
  cafayate: 569,       // +13.8% vs pricePerToken 500
  "alto-agrelo": 532.5,
  cantini: 518,
  "caravan-tech": 515,
};

export const dummyP2POrders: P2POrder[] = [
  // ===== SELL orders (alguien está vendiendo) =====
  {
    id: "P2P-AX71",
    side: "sell",
    assetSlug: "cafayate",
    assetName: "Cafayate Vineyards I",
    userHandle: "0x8c4a…b21e",
    userVerified: true,
    tokens: 15,
    tokensFilled: 0,
    pricePerToken: 575,
    marketPricePerToken: marketPrices.cafayate,
    createdAt: "2026-04-22T10:14:00Z",
    status: "open",
  },
  {
    id: "P2P-AX72",
    side: "sell",
    assetSlug: "cafayate",
    assetName: "Cafayate Vineyards I",
    userHandle: "sofia.ank",
    userVerified: true,
    tokens: 8,
    tokensFilled: 0,
    pricePerToken: 568,
    marketPricePerToken: marketPrices.cafayate,
    createdAt: "2026-04-22T09:02:00Z",
    status: "open",
  },
  {
    id: "P2P-AX73",
    side: "sell",
    assetSlug: "cafayate",
    assetName: "Cafayate Vineyards I",
    userHandle: "0xdd31…7e9f",
    userVerified: true,
    tokens: 30,
    tokensFilled: 12,
    pricePerToken: 572,
    marketPricePerToken: marketPrices.cafayate,
    createdAt: "2026-04-21T18:41:00Z",
    status: "partial",
  },
  {
    id: "P2P-AX74",
    side: "sell",
    assetSlug: "alto-agrelo",
    assetName: "Alto Agrelo Estates",
    userHandle: "lucas.ank",
    userVerified: true,
    tokens: 6,
    tokensFilled: 0,
    pricePerToken: 540,
    marketPricePerToken: marketPrices["alto-agrelo"],
    createdAt: "2026-04-22T08:15:00Z",
    status: "open",
  },
  {
    id: "P2P-AX75",
    side: "sell",
    assetSlug: "alto-agrelo",
    assetName: "Alto Agrelo Estates",
    userHandle: "0x1f88…a3c1",
    userVerified: true,
    tokens: 12,
    tokensFilled: 0,
    pricePerToken: 529,
    marketPricePerToken: marketPrices["alto-agrelo"],
    createdAt: "2026-04-21T22:03:00Z",
    status: "open",
  },
  {
    id: "P2P-AX76",
    side: "sell",
    assetSlug: "cantini",
    assetName: "Cantini Estates",
    userHandle: "valentina.ank",
    userVerified: true,
    tokens: 4,
    tokensFilled: 0,
    pricePerToken: 525,
    marketPricePerToken: marketPrices.cantini,
    createdAt: "2026-04-22T07:22:00Z",
    status: "open",
  },
  {
    id: "P2P-AX77",
    side: "sell",
    assetSlug: "cantini",
    assetName: "Cantini Estates",
    userHandle: "0x4b12…9dff",
    userVerified: false,
    tokens: 20,
    tokensFilled: 0,
    pricePerToken: 515,
    marketPricePerToken: marketPrices.cantini,
    createdAt: "2026-04-20T12:47:00Z",
    status: "open",
  },
  {
    id: "P2P-AX78",
    side: "sell",
    assetSlug: "caravan-tech",
    assetName: "Caravan Tech",
    userHandle: "diego.ank",
    userVerified: true,
    tokens: 10,
    tokensFilled: 0,
    pricePerToken: 520,
    marketPricePerToken: marketPrices["caravan-tech"],
    createdAt: "2026-04-21T15:11:00Z",
    status: "open",
  },

  // ===== BUY orders (alguien quiere comprar) =====
  {
    id: "P2P-BD01",
    side: "buy",
    assetSlug: "cafayate",
    assetName: "Cafayate Vineyards I",
    userHandle: "florencia.ank",
    userVerified: true,
    tokens: 20,
    tokensFilled: 0,
    pricePerToken: 560,
    marketPricePerToken: marketPrices.cafayate,
    createdAt: "2026-04-22T10:31:00Z",
    status: "open",
  },
  {
    id: "P2P-BD02",
    side: "buy",
    assetSlug: "cafayate",
    assetName: "Cafayate Vineyards I",
    userHandle: "0xaa77…1f3b",
    userVerified: true,
    tokens: 50,
    tokensFilled: 15,
    pricePerToken: 555,
    marketPricePerToken: marketPrices.cafayate,
    createdAt: "2026-04-22T09:48:00Z",
    status: "partial",
  },
  {
    id: "P2P-BD03",
    side: "buy",
    assetSlug: "alto-agrelo",
    assetName: "Alto Agrelo Estates",
    userHandle: "andres.ank",
    userVerified: true,
    tokens: 25,
    tokensFilled: 0,
    pricePerToken: 525,
    marketPricePerToken: marketPrices["alto-agrelo"],
    createdAt: "2026-04-22T08:55:00Z",
    status: "open",
  },
  {
    id: "P2P-BD04",
    side: "buy",
    assetSlug: "cantini",
    assetName: "Cantini Estates",
    userHandle: "0x9f21…b4e2",
    userVerified: true,
    tokens: 8,
    tokensFilled: 0,
    pricePerToken: 510,
    marketPricePerToken: marketPrices.cantini,
    createdAt: "2026-04-21T17:38:00Z",
    status: "open",
  },
  {
    id: "P2P-BD05",
    side: "buy",
    assetSlug: "caravan-tech",
    assetName: "Caravan Tech",
    userHandle: "camila.ank",
    userVerified: true,
    tokens: 40,
    tokensFilled: 0,
    pricePerToken: 508,
    marketPricePerToken: marketPrices["caravan-tech"],
    createdAt: "2026-04-22T06:19:00Z",
    status: "open",
  },

  // ===== MIS órdenes (del usuario actual) =====
  {
    id: "P2P-OWN-01",
    side: "sell",
    assetSlug: "cafayate",
    assetName: "Cafayate Vineyards I",
    userHandle: "tú",
    userVerified: true,
    tokens: 5,
    tokensFilled: 2,
    pricePerToken: 580,
    marketPricePerToken: marketPrices.cafayate,
    createdAt: "2026-04-21T11:22:00Z",
    status: "partial",
    isOwn: true,
  },
  {
    id: "P2P-OWN-02",
    side: "buy",
    assetSlug: "alto-agrelo",
    assetName: "Alto Agrelo Estates",
    userHandle: "tú",
    userVerified: true,
    tokens: 10,
    tokensFilled: 0,
    pricePerToken: 520,
    marketPricePerToken: marketPrices["alto-agrelo"],
    createdAt: "2026-04-22T07:05:00Z",
    status: "open",
    isOwn: true,
  },
];

export function getMarketPrice(slug: string): number {
  return marketPrices[slug] ?? 500;
}

/** Mock: volumen 24h sumando filled tokens × price. */
export function getP2PStats() {
  const open24h = dummyP2POrders.filter((o) => o.status === "open" || o.status === "partial");
  const volume24h = dummyP2POrders.reduce((s, o) => s + o.tokensFilled * o.pricePerToken, 0);
  const spread = 0.8; // % promedio bid-ask dummy
  return {
    openOrders: open24h.length,
    volume24hUsd: volume24h,
    operatorsOnline: 47,
    spreadPct: spread,
  };
}

export function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}

