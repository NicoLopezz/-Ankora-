import type {
  Asset,
  Opportunity,
  Transaction,
  PortfolioMetrics,
  UserProfile,
} from "@/types/ankora";

export const dummyUser: UserProfile = {
  name: "Santiago Cendoya",
  email: "scendoya@bafa.com.ar",
  memberSince: "2025-08-14",
  kycVerified: true,
  walletShort: "0x7f3a…b21e",
  country: "Argentina",
  phone: "+54 9 11 5423 8877",
};

export const dummyAssets: Asset[] = [
  {
    id: "ank-vin-cafa",
    slug: "vinedo-cafayate",
    name: "Viñedo Cafayate — Finca La Estancia",
    shortName: "Viñedo Cafayate",
    category: "viñedo",
    location: "Cafayate, Salta",
    description:
      "120 hectáreas de Malbec y Torrontés de altura en Valles Calchaquíes. Producción regulada, exportación certificada y renta trimestral por venta de uva y vino terminado.",
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
    operator: "Bodega Estancia Cafayate SA",
    fiduciario: "Allaria SA",
    vintage: "2025",
    dividendHistory: [
      { date: "2026-04-15", amountUsd: 312.5, periodLabel: "Q1 2026" },
      { date: "2026-01-15", amountUsd: 298.7, periodLabel: "Q4 2025" },
      { date: "2025-10-15", amountUsd: 275.2, periodLabel: "Q3 2025" },
      { date: "2025-07-15", amountUsd: 241.0, periodLabel: "Q2 2025" },
    ],
    milestones: [
      {
        date: "2025-08-20",
        title: "Fondeo completado",
        description: "Cierre de ronda en USD 7.5M · 100% fondeado",
        completed: true,
      },
      {
        date: "2025-09-10",
        title: "Escrituración fiduciaria",
        description: "Allaria SA recibe titularidad de las 120 hectáreas",
        completed: true,
      },
      {
        date: "2026-03-01",
        title: "Cosecha vendimia 2026",
        description: "Inicio de vendimia — Malbec y Torrontés",
        completed: true,
      },
      {
        date: "2026-05-15",
        title: "Dividendo Q1 2026",
        description: "Distribución trimestral programada",
        completed: false,
      },
      {
        date: "2026-12-01",
        title: "Embotellado reserva",
        description: "Salida comercial del vino 2026",
        completed: false,
      },
    ],
    documents: [
      { id: "d1", name: "Contrato fiduciario Cafayate.pdf", type: "contrato", date: "2025-09-10", sizeKb: 412 },
      { id: "d2", name: "Reporte operativo Q1 2026.pdf", type: "reporte", date: "2026-04-10", sizeKb: 1840 },
      { id: "d3", name: "Prospecto CNV registrado.pdf", type: "legal", date: "2025-07-22", sizeKb: 2210 },
      { id: "d4", name: "Comprobante fiscal Q1.pdf", type: "fiscal", date: "2026-04-16", sizeKb: 98 },
    ],
  },
  {
    id: "ank-inm-014",
    slug: "edificio-palermo-soho",
    name: "Edificio Palermo Soho",
    shortName: "Edificio Palermo",
    category: "inmueble",
    location: "CABA, Argentina",
    description:
      "Edificio boutique de 12 unidades en Palermo Soho. Renta mensual por alquiler más revalorización del m².",
    tokensOwned: 20,
    tokensTotal: 8000,
    pricePerToken: 500,
    investedUsd: 10000,
    currentValueUsd: 10650,
    ytdReturnPct: 6.5,
    targetApyPct: 8.0,
    status: "en_rendimiento",
    nextDividendDate: "2026-05-02",
    heroColor: "#3d2a1e",
    operator: "Urban Development Group",
    fiduciario: "Allaria SA",
    dividendHistory: [
      { date: "2026-04-02", amountUsd: 108.33, periodLabel: "Abril 2026" },
      { date: "2026-03-02", amountUsd: 105.2, periodLabel: "Marzo 2026" },
      { date: "2026-02-02", amountUsd: 103.1, periodLabel: "Febrero 2026" },
    ],
    milestones: [
      { date: "2024-11-15", title: "Fondeo completado", description: "Ronda cerrada USD 4M", completed: true },
      { date: "2025-02-10", title: "Escrituración", description: "Transferencia fiduciaria", completed: true },
      { date: "2025-06-01", title: "Ocupación 100%", description: "12/12 unidades alquiladas", completed: true },
    ],
    documents: [
      { id: "p1", name: "Contrato fiduciario Palermo.pdf", type: "contrato", date: "2025-02-10", sizeKb: 380 },
      { id: "p2", name: "Reporte ocupación Q1.pdf", type: "reporte", date: "2026-04-05", sizeKb: 720 },
    ],
  },
  {
    id: "ank-tie-007",
    slug: "campo-pergamino",
    name: "Campo Productivo Pergamino",
    shortName: "Campo Pergamino",
    category: "tierra",
    location: "Buenos Aires, Argentina",
    description: "480 hectáreas de soja y maíz en núcleo pampeano. Renta por arrendamiento + revalorización.",
    tokensOwned: 10,
    tokensTotal: 5000,
    pricePerToken: 500,
    investedUsd: 5000,
    currentValueUsd: 5180,
    ytdReturnPct: 3.6,
    targetApyPct: 7.5,
    status: "activo",
    nextDividendDate: "2026-07-10",
    heroColor: "#2a2812",
    operator: "Agro Pampeana SRL",
    fiduciario: "Allaria SA",
    dividendHistory: [{ date: "2026-01-10", amountUsd: 92.5, periodLabel: "Campaña 2025" }],
    milestones: [
      { date: "2025-11-01", title: "Fondeo completado", description: "USD 2.5M recaudados", completed: true },
      { date: "2026-07-10", title: "Dividendo campaña 2026", description: "Liquidación agrícola", completed: false },
    ],
    documents: [{ id: "c1", name: "Escritura fiduciaria.pdf", type: "legal", date: "2025-11-20", sizeKb: 1200 }],
  },
  {
    id: "ank-ene-003",
    slug: "parque-solar-san-juan",
    name: "Parque Solar San Juan",
    shortName: "Solar San Juan",
    category: "energia",
    location: "San Juan, Argentina",
    description: "Parque solar de 25 MW con PPA firmado a 15 años. Renta mensual por venta de energía.",
    tokensOwned: 6,
    tokensTotal: 20000,
    pricePerToken: 500,
    investedUsd: 3000,
    currentValueUsd: 3090,
    ytdReturnPct: 3.0,
    targetApyPct: 11.0,
    status: "proximo_pago",
    nextDividendDate: "2026-04-28",
    heroColor: "#1e2a3a",
    operator: "Solar Cuyo SA",
    fiduciario: "Allaria SA",
    dividendHistory: [{ date: "2026-03-28", amountUsd: 28.5, periodLabel: "Marzo 2026" }],
    milestones: [
      { date: "2025-06-01", title: "PPA firmado", description: "Contrato venta energía 15 años", completed: true },
      { date: "2026-04-28", title: "Primer dividendo", description: "Distribución mensual", completed: false },
    ],
    documents: [{ id: "s1", name: "PPA CAMMESA.pdf", type: "legal", date: "2025-06-15", sizeKb: 890 }],
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
  { id: "tx-001", date: "2026-04-15", type: "dividendo", assetName: "Viñedo Cafayate", assetSlug: "vinedo-cafayate", amountUsd: 312.5, txHashShort: "0xa4…9e2f" },
  { id: "tx-002", date: "2026-04-02", type: "dividendo", assetName: "Edificio Palermo", assetSlug: "edificio-palermo-soho", amountUsd: 108.33, txHashShort: "0x8c…1d4a" },
  { id: "tx-003", date: "2026-03-28", type: "dividendo", assetName: "Solar San Juan", assetSlug: "parque-solar-san-juan", amountUsd: 28.5, txHashShort: "0x3b…77cc" },
  { id: "tx-004", date: "2026-03-20", type: "compra", assetName: "Solar San Juan", assetSlug: "parque-solar-san-juan", amountUsd: 3000, tokens: 6, txHashShort: "0xef…2abc" },
  { id: "tx-005", date: "2026-03-02", type: "dividendo", assetName: "Edificio Palermo", assetSlug: "edificio-palermo-soho", amountUsd: 105.2, txHashShort: "0x12…4dde" },
  { id: "tx-006", date: "2026-02-28", type: "compra", assetName: "Campo Pergamino", assetSlug: "campo-pergamino", amountUsd: 5000, tokens: 10, txHashShort: "0x7a…b9c1" },
  { id: "tx-007", date: "2026-02-14", type: "compra", assetName: "Edificio Palermo", assetSlug: "edificio-palermo-soho", amountUsd: 10000, tokens: 20, txHashShort: "0x55…3f08" },
  { id: "tx-008", date: "2026-01-15", type: "dividendo", assetName: "Viñedo Cafayate", assetSlug: "vinedo-cafayate", amountUsd: 298.7, txHashShort: "0xde…4a11" },
  { id: "tx-009", date: "2026-01-10", type: "dividendo", assetName: "Campo Pergamino", assetSlug: "campo-pergamino", amountUsd: 92.5, txHashShort: "0x09…ffed" },
  { id: "tx-010", date: "2025-09-15", type: "compra", assetName: "Viñedo Cafayate", assetSlug: "vinedo-cafayate", amountUsd: 25000, tokens: 50, txHashShort: "0xaa…0011" },
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
};

export const statusLabel: Record<Asset["status"], string> = {
  activo: "Activo",
  en_rendimiento: "En rendimiento",
  proximo_pago: "Próximo pago",
  en_fondeo: "En fondeo",
};

export const categoryEmoji: Record<Asset["category"], string> = {
  viñedo: "🍇",
  inmueble: "🏢",
  tierra: "🌾",
  energia: "☀️",
  marina: "⚓",
};
