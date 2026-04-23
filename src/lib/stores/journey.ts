import { InMemoryStore } from "@/lib/db";

// ============ RENTAL JOURNEY STATE MACHINE ============

export type JourneyStage =
  | "discovered"
  | "contacted"
  | "visiting"
  | "applied"
  | "lease_pending"
  | "lease_signed"
  | "active_tenancy"
  | "completed"
  | "reviewed"
  | "cancelled";

export interface RentalJourney {
  id: string;
  studentId: string;
  studentName: string;
  listingId: string;
  listingTitle: string;
  landlordId: string;
  landlordName: string;
  stage: JourneyStage;
  stageHistory: { stage: JourneyStage; timestamp: string; note?: string }[];
  createdAt: string;
  updatedAt: string;
}

const VALID_TRANSITIONS: Record<JourneyStage, JourneyStage[]> = {
  discovered: ["contacted", "cancelled"],
  contacted: ["visiting", "applied", "cancelled"],
  visiting: ["applied", "cancelled"],
  applied: ["lease_pending", "cancelled"],
  lease_pending: ["lease_signed", "cancelled"],
  lease_signed: ["active_tenancy", "cancelled"],
  active_tenancy: ["completed"],
  completed: ["reviewed"],
  reviewed: [],
  cancelled: [],
};

export function canTransition(from: JourneyStage, to: JourneyStage): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export function getNextStages(current: JourneyStage): JourneyStage[] {
  return VALID_TRANSITIONS[current] || [];
}

export const STAGE_LABELS: Record<JourneyStage, { it: string; en: string }> = {
  discovered: { it: "Scoperto", en: "Discovered" },
  contacted: { it: "Contattato", en: "Contacted" },
  visiting: { it: "Visita programmata", en: "Visit scheduled" },
  applied: { it: "Candidatura inviata", en: "Applied" },
  lease_pending: { it: "Contratto in attesa", en: "Lease pending" },
  lease_signed: { it: "Contratto firmato", en: "Lease signed" },
  active_tenancy: { it: "Affitto attivo", en: "Active tenancy" },
  completed: { it: "Completato", en: "Completed" },
  reviewed: { it: "Recensito", en: "Reviewed" },
  cancelled: { it: "Annullato", en: "Cancelled" },
};

export const STAGE_ORDER: JourneyStage[] = [
  "discovered", "contacted", "visiting", "applied",
  "lease_pending", "lease_signed", "active_tenancy",
  "completed", "reviewed",
];

export const journeyStore = new InMemoryStore<RentalJourney>();

journeyStore.seed([
  {
    id: "journey-1",
    studentId: "user-student-1",
    studentName: "Martina López",
    listingId: "via-colombo-21-singola",
    listingTitle: "Via Cristoforo Colombo 21",
    landlordId: "user-landlord-1",
    landlordName: "Elena Rossi",
    stage: "active_tenancy",
    stageHistory: [
      { stage: "discovered", timestamp: new Date(Date.now() - 90 * 86400000).toISOString() },
      { stage: "contacted", timestamp: new Date(Date.now() - 85 * 86400000).toISOString() },
      { stage: "visiting", timestamp: new Date(Date.now() - 80 * 86400000).toISOString() },
      { stage: "applied", timestamp: new Date(Date.now() - 75 * 86400000).toISOString() },
      { stage: "lease_pending", timestamp: new Date(Date.now() - 60 * 86400000).toISOString() },
      { stage: "lease_signed", timestamp: new Date(Date.now() - 55 * 86400000).toISOString() },
      { stage: "active_tenancy", timestamp: new Date(Date.now() - 35 * 86400000).toISOString() },
    ],
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 35 * 86400000).toISOString(),
  },
  {
    id: "journey-2",
    studentId: "user-student-2",
    studentName: "Luca Bianchi",
    listingId: "viale-roma-48-bilocale",
    listingTitle: "Viale Roma 48",
    landlordId: "user-landlord-2",
    landlordName: "Marco Guidi",
    stage: "visiting",
    stageHistory: [
      { stage: "discovered", timestamp: new Date(Date.now() - 14 * 86400000).toISOString() },
      { stage: "contacted", timestamp: new Date(Date.now() - 10 * 86400000).toISOString() },
      { stage: "visiting", timestamp: new Date(Date.now() - 3 * 86400000).toISOString(), note: "Visita fissata per venerdì" },
    ],
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
]);
