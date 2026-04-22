export type AssetCategory = "viñedo" | "inmueble" | "tierra" | "energia" | "marina";
export type AssetStatus = "activo" | "en_rendimiento" | "proximo_pago" | "en_fondeo";

export interface DividendEntry {
  date: string;
  amountUsd: number;
  periodLabel: string;
}

export interface Milestone {
  date: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface AssetDocument {
  id: string;
  name: string;
  type: "contrato" | "reporte" | "legal" | "fiscal";
  date: string;
  sizeKb: number;
}

export interface Asset {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: AssetCategory;
  location: string;
  description: string;
  tokensOwned: number;
  tokensTotal: number;
  pricePerToken: number;
  currentValueUsd: number;
  investedUsd: number;
  ytdReturnPct: number;
  targetApyPct: number;
  status: AssetStatus;
  nextDividendDate?: string;
  heroColor: string;
  dividendHistory: DividendEntry[];
  milestones: Milestone[];
  documents: AssetDocument[];
  operator: string;
  fiduciario: string;
  vintage?: string;
}

export interface Opportunity {
  id: string;
  name: string;
  category: AssetCategory;
  location: string;
  minInvestmentUsd: number;
  targetApyPct: number;
  fundedPct: number;
  closingDate: string;
  highlight?: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: "compra" | "dividendo" | "venta";
  assetName: string;
  assetSlug?: string;
  amountUsd: number;
  tokens?: number;
  txHashShort?: string;
}

export interface PortfolioMetrics {
  totalValueUsd: number;
  totalInvestedUsd: number;
  totalReturnPct: number;
  monthlyYieldUsd: number;
  assetCount: number;
  nextPaymentUsd: number;
  nextPaymentDate: string;
}

export interface UserProfile {
  name: string;
  email: string;
  memberSince: string;
  kycVerified: boolean;
  walletShort: string;
  country: string;
  phone: string;
}
