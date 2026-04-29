import { InMemoryStore } from "@/lib/db";

// ============ LANDLORD REPUTATION & BADGE SYSTEM ============

export type BadgeTier = "none" | "verificato" | "affidabile" | "superhost";

export interface LandlordReputation {
  id: string;
  landlordId: string;
  landlordName: string;
  // Component scores (0-10)
  avgReviewScore: number;       // 30% weight
  responseTime: number;         // 20% weight (lower is better, scored inversely)
  leaseCompletionRate: number;  // 15% weight
  documentCompliance: number;   // 15% weight
  disputeFrequency: number;     // 10% weight (lower is better)
  listingAccuracy: number;      // 10% weight
  // Computed
  overallScore: number;         // 0-10
  badge: BadgeTier;
  completedLeases: number;
  totalApplications: number;
  avgResponseHours: number;
  // Trend
  scoreHistory: { month: string; score: number }[];
  badgeEarnedAt?: string;
  lastComputedAt: string;
}

export const reputationStore = new InMemoryStore<LandlordReputation>();

reputationStore.seed([
  {
    id: "rep-landlord-1",
    landlordId: "user-landlord-1",
    landlordName: "Elena Rossi",
    avgReviewScore: 9.5,
    responseTime: 9.0,
    leaseCompletionRate: 10.0,
    documentCompliance: 10.0,
    disputeFrequency: 10.0,
    listingAccuracy: 8.5,
    overallScore: 9.4,
    badge: "superhost",
    completedLeases: 12,
    totalApplications: 14,
    avgResponseHours: 1.5,
    scoreHistory: [
      { month: "2026-01", score: 8.8 },
      { month: "2026-02", score: 9.0 },
      { month: "2026-03", score: 9.1 },
      { month: "2026-04", score: 9.2 },
      { month: "2026-05", score: 9.3 },
      { month: "2026-06", score: 9.4 },
    ],
    badgeEarnedAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    lastComputedAt: new Date().toISOString(),
  },
  {
    id: "rep-landlord-2",
    landlordId: "user-landlord-2",
    landlordName: "Marco Guidi",
    avgReviewScore: 8.0,
    responseTime: 7.0,
    leaseCompletionRate: 8.5,
    documentCompliance: 9.0,
    disputeFrequency: 9.0,
    listingAccuracy: 8.0,
    overallScore: 8.2,
    badge: "affidabile",
    completedLeases: 5,
    totalApplications: 7,
    avgResponseHours: 8,
    scoreHistory: [
      { month: "2026-01", score: 7.5 },
      { month: "2026-02", score: 7.8 },
      { month: "2026-03", score: 7.9 },
      { month: "2026-04", score: 8.0 },
      { month: "2026-05", score: 8.1 },
      { month: "2026-06", score: 8.2 },
    ],
    badgeEarnedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    lastComputedAt: new Date().toISOString(),
  },
]);

export function computeReputation(params: {
  avgReviewScore: number;
  responseTime: number;
  leaseCompletionRate: number;
  documentCompliance: number;
  disputeFrequency: number;
  listingAccuracy: number;
  completedLeases: number;
}): { overallScore: number; badge: BadgeTier } {
  const overall =
    params.avgReviewScore * 0.3 +
    params.responseTime * 0.2 +
    params.leaseCompletionRate * 0.15 +
    params.documentCompliance * 0.15 +
    params.disputeFrequency * 0.1 +
    params.listingAccuracy * 0.1;

  const overallScore = Math.round(overall * 10) / 10;

  let badge: BadgeTier = "none";
  if (overallScore >= 9.0 && params.completedLeases >= 10) {
    badge = "superhost";
  } else if (overallScore >= 7.0 && params.completedLeases >= 3) {
    badge = "affidabile";
  } else if (params.completedLeases >= 1) {
    badge = "verificato";
  }

  return { overallScore, badge };
}

export const BADGE_CONFIG: Record<BadgeTier, { label: string; labelEn: string; color: string; icon: string; description: string }> = {
  none: { label: "Non verificato", labelEn: "Not verified", color: "bg-gray-100 text-gray-600", icon: "🔘", description: "Completa almeno un affitto per ottenere il badge" },
  verificato: { label: "Verificato", labelEn: "Verified", color: "bg-blue-100 text-blue-800", icon: "✓", description: "Identità verificata e almeno 1 affitto completato" },
  affidabile: { label: "Affidabile", labelEn: "Trusted", color: "bg-green-100 text-green-800", icon: "★", description: "Punteggio ≥7.0, ≥3 affitti completati, risposta <24h" },
  superhost: { label: "Superhost", labelEn: "Superhost", color: "bg-amber-100 text-amber-800", icon: "🏆", description: "Punteggio ≥9.0, ≥10 affitti, zero dispute, 100% conformità" },
};

export function getBadgePerks(badge: BadgeTier): string[] {
  switch (badge) {
    case "superhost":
      return [
        "Posizionamento prioritario nei risultati di ricerca",
        "Commissione ridotta (3% invece del 5%)",
        "Supporto prioritario",
        "Badge dorato visibile su tutti gli annunci",
      ];
    case "affidabile":
      return [
        "Badge verde su tutti gli annunci",
        "Priorità nelle raccomandazioni",
        "Accesso anticipato a nuove funzionalità",
      ];
    case "verificato":
      return [
        "Badge blu di verifica",
        "Visibilità maggiore rispetto a profili non verificati",
      ];
    default:
      return [];
  }
}
