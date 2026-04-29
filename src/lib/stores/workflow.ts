import { InMemoryStore } from "@/lib/db";
import type { JourneyStage } from "@/lib/stores/journey";

// ============ WORKFLOW ORCHESTRATION ENGINE ============

export type WorkflowActionType =
  | "create_conversation"
  | "send_notification"
  | "create_payment"
  | "upload_document"
  | "request_review"
  | "update_trust_score"
  | "alert_admin"
  | "send_info";

export interface WorkflowTrigger {
  id: string;
  fromStage: JourneyStage;
  toStage: JourneyStage;
  actions: WorkflowAction[];
  enabled: boolean;
}

export interface WorkflowAction {
  type: WorkflowActionType;
  params: Record<string, string>;
  description: string;
}

export interface WorkflowExecution {
  id: string;
  triggerId: string;
  journeyId: string;
  status: "completed" | "failed" | "pending";
  executedAt: string;
  results: { actionType: string; success: boolean; message: string }[];
  deduplicationKey: string;
}

export interface StaleJourney {
  id: string;
  journeyId: string;
  studentName: string;
  listingTitle: string;
  stage: JourneyStage;
  daysInStage: number;
  lastUpdated: string;
  notified: boolean;
}

export const workflowTriggerStore = new InMemoryStore<WorkflowTrigger>();
export const workflowExecutionStore = new InMemoryStore<WorkflowExecution>();
export const staleJourneyStore = new InMemoryStore<StaleJourney>();

// Registry of stage transition triggers
workflowTriggerStore.seed([
  {
    id: "trigger-discovered-contacted",
    fromStage: "discovered",
    toStage: "contacted",
    actions: [
      { type: "create_conversation", params: {}, description: "Crea conversazione automatica tra studente e proprietario" },
      { type: "send_notification", params: { to: "landlord", template: "new_inquiry" }, description: "Notifica il proprietario della nuova richiesta" },
    ],
    enabled: true,
  },
  {
    id: "trigger-contacted-visiting",
    fromStage: "contacted",
    toStage: "visiting",
    actions: [
      { type: "send_info", params: { content: "listing_details,neighborhood_info,map_link" }, description: "Invia dettagli annuncio, info quartiere e link mappa allo studente" },
      { type: "send_notification", params: { to: "student", template: "visit_scheduled" }, description: "Conferma visita programmata" },
    ],
    enabled: true,
  },
  {
    id: "trigger-visiting-applied",
    fromStage: "visiting",
    toStage: "applied",
    actions: [
      { type: "send_notification", params: { to: "student", template: "upload_documents" }, description: "Richiedi caricamento documenti (ID, certificato iscrizione)" },
      { type: "alert_admin", params: { type: "new_application" }, description: "Notifica admin della nuova candidatura" },
    ],
    enabled: true,
  },
  {
    id: "trigger-applied-lease_pending",
    fromStage: "applied",
    toStage: "lease_pending",
    actions: [
      { type: "upload_document", params: { template: "lease_draft" }, description: "Invia bozza contratto al vault documenti" },
      { type: "send_notification", params: { to: "both", template: "lease_ready" }, description: "Notifica che il contratto è pronto per la firma" },
    ],
    enabled: true,
  },
  {
    id: "trigger-lease_pending-lease_signed",
    fromStage: "lease_pending",
    toStage: "lease_signed",
    actions: [
      { type: "create_payment", params: { type: "deposit" }, description: "Crea primo pagamento (caparra)" },
      { type: "upload_document", params: { type: "signed_lease" }, description: "Carica contratto firmato nel vault" },
      { type: "send_notification", params: { to: "both", template: "lease_signed" }, description: "Conferma firma contratto" },
    ],
    enabled: true,
  },
  {
    id: "trigger-active-completed",
    fromStage: "active_tenancy",
    toStage: "completed",
    actions: [
      { type: "request_review", params: { sides: "both" }, description: "Richiedi recensione da entrambe le parti" },
      { type: "update_trust_score", params: {}, description: "Aggiorna punteggio di fiducia" },
      { type: "send_notification", params: { to: "both", template: "tenancy_completed" }, description: "Conferma conclusione affitto" },
    ],
    enabled: true,
  },
]);

// Seed some workflow execution history
workflowExecutionStore.seed([
  {
    id: "exec-1",
    triggerId: "trigger-discovered-contacted",
    journeyId: "journey-1",
    status: "completed",
    executedAt: new Date(Date.now() - 85 * 86400000).toISOString(),
    results: [
      { actionType: "create_conversation", success: true, message: "Conversazione conv-1 creata" },
      { actionType: "send_notification", success: true, message: "Notifica inviata a Elena Rossi" },
    ],
    deduplicationKey: "journey-1_discovered_contacted",
  },
  {
    id: "exec-2",
    triggerId: "trigger-lease_pending-lease_signed",
    journeyId: "journey-1",
    status: "completed",
    executedAt: new Date(Date.now() - 55 * 86400000).toISOString(),
    results: [
      { actionType: "create_payment", success: true, message: "Pagamento pay-2 (caparra) creato" },
      { actionType: "upload_document", success: true, message: "Contratto firmato caricato nel vault" },
      { actionType: "send_notification", success: true, message: "Notifica firma contratto inviata" },
    ],
    deduplicationKey: "journey-1_lease_pending_lease_signed",
  },
]);

// Seed a stale journey
staleJourneyStore.seed([
  {
    id: "stale-journey-2",
    journeyId: "journey-2",
    studentName: "Luca Bianchi",
    listingTitle: "Viale Roma 48",
    stage: "visiting",
    daysInStage: 3,
    lastUpdated: new Date(Date.now() - 3 * 86400000).toISOString(),
    notified: false,
  },
]);

export async function executeWorkflowTriggers(
  journeyId: string,
  fromStage: JourneyStage,
  toStage: JourneyStage,
  context: { studentName: string; landlordName: string; listingTitle: string }
): Promise<WorkflowExecution | null> {
  const deduplicationKey = `${journeyId}_${fromStage}_${toStage}`;

  // Check deduplication
  const existing = await workflowExecutionStore.filter(
    (e) => e.deduplicationKey === deduplicationKey
  );
  if (existing.length > 0) return null;

  // Find matching triggers
  const triggers = await workflowTriggerStore.filter(
    (t) => t.fromStage === fromStage && t.toStage === toStage && t.enabled
  );
  if (triggers.length === 0) return null;

  const trigger = triggers[0];
  const results = trigger.actions.map((action) => ({
    actionType: action.type,
    success: true,
    message: `${action.description} — eseguito per ${context.studentName} / ${context.listingTitle}`,
  }));

  const execution: WorkflowExecution = {
    id: `exec-${Date.now().toString(36)}`,
    triggerId: trigger.id,
    journeyId,
    status: "completed",
    executedAt: new Date().toISOString(),
    results,
    deduplicationKey,
  };

  await workflowExecutionStore.create(execution);
  return execution;
}

export async function detectStaleJourneys(journeys: { id: string; studentName: string; listingTitle: string; stage: JourneyStage; updatedAt: string }[]): Promise<StaleJourney[]> {
  const stale: StaleJourney[] = [];
  const now = Date.now();
  const STALE_THRESHOLD_DAYS = 7;

  for (const j of journeys) {
    if (j.stage === "completed" || j.stage === "reviewed" || j.stage === "cancelled") continue;
    const daysSince = Math.floor((now - new Date(j.updatedAt).getTime()) / 86400000);
    if (daysSince >= STALE_THRESHOLD_DAYS) {
      const existing = await staleJourneyStore.filter((s) => s.journeyId === j.id);
      if (existing.length === 0) {
        const entry: StaleJourney = {
          id: `stale-${j.id}`,
          journeyId: j.id,
          studentName: j.studentName,
          listingTitle: j.listingTitle,
          stage: j.stage,
          daysInStage: daysSince,
          lastUpdated: j.updatedAt,
          notified: false,
        };
        await staleJourneyStore.create(entry);
        stale.push(entry);
      }
    }
  }

  return stale;
}
