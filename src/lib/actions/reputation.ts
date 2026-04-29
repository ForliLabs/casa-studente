"use server";

import { getCurrentUser } from "@/lib/auth";
import {
  reputationStore,
  BADGE_CONFIG,
  getBadgePerks,
  type LandlordReputation,
  type BadgeTier,
} from "@/lib/stores/reputation";

export async function getLandlordReputation(landlordId: string): Promise<LandlordReputation | null> {
  const reps = await reputationStore.filter((r) => r.landlordId === landlordId);
  return reps[0] || null;
}

export async function getMyReputation() {
  const user = await getCurrentUser();
  if (!user || user.role !== "landlord") return null;

  const rep = await getLandlordReputation(user.id);
  if (!rep) return null;

  const config = BADGE_CONFIG[rep.badge];
  const perks = getBadgePerks(rep.badge);

  // Badge progression
  const nextBadge = getNextBadge(rep.badge);
  const nextConfig = nextBadge ? BADGE_CONFIG[nextBadge] : null;
  const progress = getProgressToNextBadge(rep);

  return {
    ...rep,
    badgeLabel: config.label,
    badgeColor: config.color,
    badgeIcon: config.icon,
    badgeDescription: config.description,
    perks,
    nextBadge: nextConfig ? { tier: nextBadge, label: nextConfig.label, progress } : null,
  };
}

export async function getAllReputations(): Promise<LandlordReputation[]> {
  return reputationStore.findAll();
}

function getNextBadge(current: BadgeTier): BadgeTier | null {
  const progression: BadgeTier[] = ["none", "verificato", "affidabile", "superhost"];
  const idx = progression.indexOf(current);
  return idx < progression.length - 1 ? progression[idx + 1] : null;
}

function getProgressToNextBadge(rep: LandlordReputation): { score: number; requirements: { label: string; met: boolean; current: string; target: string }[] } {
  const next = getNextBadge(rep.badge);
  if (!next) return { score: 100, requirements: [] };

  const requirements: { label: string; met: boolean; current: string; target: string }[] = [];

  switch (next) {
    case "verificato":
      requirements.push({ label: "Affitti completati", met: rep.completedLeases >= 1, current: String(rep.completedLeases), target: "1" });
      break;
    case "affidabile":
      requirements.push({ label: "Punteggio ≥ 7.0", met: rep.overallScore >= 7.0, current: String(rep.overallScore), target: "7.0" });
      requirements.push({ label: "≥ 3 affitti completati", met: rep.completedLeases >= 3, current: String(rep.completedLeases), target: "3" });
      requirements.push({ label: "Risposta < 24h", met: rep.avgResponseHours < 24, current: `${rep.avgResponseHours}h`, target: "24h" });
      break;
    case "superhost":
      requirements.push({ label: "Punteggio ≥ 9.0", met: rep.overallScore >= 9.0, current: String(rep.overallScore), target: "9.0" });
      requirements.push({ label: "≥ 10 affitti completati", met: rep.completedLeases >= 10, current: String(rep.completedLeases), target: "10" });
      requirements.push({ label: "Zero dispute", met: rep.disputeFrequency >= 9.5, current: rep.disputeFrequency >= 9.5 ? "0" : ">0", target: "0" });
      requirements.push({ label: "100% conformità documenti", met: rep.documentCompliance >= 10, current: `${Math.round(rep.documentCompliance * 10)}%`, target: "100%" });
      break;
  }

  const metCount = requirements.filter((r) => r.met).length;
  const score = requirements.length > 0 ? Math.round((metCount / requirements.length) * 100) : 0;

  return { score, requirements };
}
