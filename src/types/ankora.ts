export type AssetCategory = "viñedo" | "inmueble" | "tierra" | "energia" | "marina" | "ganaderia";
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
  imageUrl?: string;
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

// ===== Admin / Platform-wide =====

export type ClientKycStatus = "verified" | "pending" | "rejected" | "expired";
export type ClientTier = "retail" | "calificado" | "institucional";

export interface Client {
  id: string;
  name: string;
  email: string;
  country: string;
  walletShort: string;
  kycStatus: ClientKycStatus;
  tier: ClientTier;
  joinedAt: string;
  lastActivityAt: string;
  totalInvestedUsd: number;
  portfolioValueUsd: number;
  ytdReturnPct: number;
  txCount: number;
  flagged?: boolean;    // flagged for PEP / UIF review
  pep?: boolean;        // persona expuesta políticamente
}

export interface KycQueueItem {
  id: string;
  clientId: string;
  clientName: string;
  submittedAt: string;
  docsCount: number;
  pendingDays: number;
  riskScore: "low" | "medium" | "high";
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;           // email or "system"
  action: string;          // e.g. "kyc.approved"
  target: string;
  ip: string;
}

export type P2POrderSide = "sell" | "buy";
export type P2POrderStatus = "open" | "partial" | "filled" | "cancelled";

export interface P2POrder {
  id: string;
  side: P2POrderSide;
  assetSlug: string;
  assetName: string;
  userHandle: string;           // e.g., "0x8c4…a1b2" or "mariano.ank"
  userVerified: boolean;
  tokens: number;
  tokensFilled: number;
  pricePerToken: number;        // USD
  marketPricePerToken: number;  // reference for vs-market %
  createdAt: string;            // ISO
  status: P2POrderStatus;
  isOwn?: boolean;
}
