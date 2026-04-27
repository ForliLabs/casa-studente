import { InMemoryStore } from "@/lib/db";

// ============ DOCUMENT VAULT & COMPLIANCE ============

export type DocumentType = "lease" | "id" | "enrollment" | "receipt" | "tax" | "template" | "other";

export interface UserDocument {
  id: string;
  userId: string;
  type: DocumentType;
  name: string;
  description: string;
  fileUrl: string;
  linkedEntityId?: string;
  linkedEntityType?: "lease" | "payment" | "user";
  expiryDate?: string;
  uploadedAt: string;
  size: number;
}

export interface ComplianceItem {
  id: string;
  leaseId: string;
  userId: string;
  label: string;
  description: string;
  category: "contract" | "tax" | "certificate" | "registration";
  completed: boolean;
  deadline?: string;
  completedAt?: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  category: "contract" | "notice" | "inventory" | "handover" | "tax";
  downloadUrl: string;
}

export const documentStore = new InMemoryStore<UserDocument>();
export const complianceStore = new InMemoryStore<ComplianceItem>();
export const templateStore = new InMemoryStore<DocumentTemplate>();

documentStore.seed([
  {
    id: "doc-1",
    userId: "user-student-1",
    type: "lease",
    name: "Contratto transitorio - Via Colombo 21",
    description: "Contratto di locazione transitorio per l'a.a. 2026/2027",
    fileUrl: "/documents/contratto-colombo-21.pdf",
    linkedEntityId: "lease-1",
    linkedEntityType: "lease",
    uploadedAt: new Date(Date.now() - 35 * 86400000).toISOString(),
    size: 245000,
  },
  {
    id: "doc-2",
    userId: "user-student-1",
    type: "enrollment",
    name: "Certificato di iscrizione UniBo",
    description: "Certificato di iscrizione per l'anno accademico 2026/2027",
    fileUrl: "/documents/iscrizione-unibo.pdf",
    linkedEntityType: "user",
    uploadedAt: new Date(Date.now() - 40 * 86400000).toISOString(),
    size: 180000,
  },
  {
    id: "doc-3",
    userId: "user-student-1",
    type: "receipt",
    name: "Ricevuta affitto Luglio 2026",
    description: "Ricevuta di pagamento per il canone di Luglio 2026 - €360",
    fileUrl: "/documents/ricevuta-luglio-2026.pdf",
    linkedEntityId: "pay-1",
    linkedEntityType: "payment",
    uploadedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    size: 95000,
  },
]);

complianceStore.seed([
  {
    id: "compliance-1",
    leaseId: "lease-1",
    userId: "user-landlord-1",
    label: "Registrazione contratto (Agenzia delle Entrate)",
    description: "Il contratto deve essere registrato entro 30 giorni dalla firma.",
    category: "registration",
    completed: true,
    completedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: "compliance-2",
    leaseId: "lease-1",
    userId: "user-landlord-1",
    label: "Elezione cedolare secca",
    description: "Comunicazione dell'opzione cedolare secca all'Agenzia delle Entrate.",
    category: "tax",
    completed: true,
    completedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: "compliance-3",
    leaseId: "lease-1",
    userId: "user-landlord-1",
    label: "APE - Attestato di Prestazione Energetica",
    description: "L'attestato energetico deve essere allegato al contratto.",
    category: "certificate",
    completed: false,
    deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
  },
  {
    id: "compliance-4",
    leaseId: "lease-1",
    userId: "user-landlord-1",
    label: "Aggiornamento catastale",
    description: "Verifica della conformità catastale dell'immobile.",
    category: "registration",
    completed: false,
    deadline: new Date(Date.now() + 60 * 86400000).toISOString(),
  },
]);

templateStore.seed([
  {
    id: "template-1",
    name: "Contratto Transitorio",
    nameEn: "Temporary Rental Agreement",
    description: "Modello di contratto di locazione transitorio per studenti universitari.",
    descriptionEn: "Template for temporary student rental agreements.",
    category: "contract",
    downloadUrl: "/templates/contratto-transitorio.pdf",
  },
  {
    id: "template-2",
    name: "Disdetta (Recesso anticipato)",
    nameEn: "Early Termination Notice",
    description: "Modello di lettera di disdetta per recesso anticipato.",
    descriptionEn: "Template for early termination notice.",
    category: "notice",
    downloadUrl: "/templates/disdetta.pdf",
  },
  {
    id: "template-3",
    name: "Inventario (Elenco arredi)",
    nameEn: "Inventory Checklist",
    description: "Lista degli arredi e delle dotazioni presenti nell'immobile alla consegna.",
    descriptionEn: "List of furniture and equipment present at the property upon handover.",
    category: "inventory",
    downloadUrl: "/templates/inventario.pdf",
  },
  {
    id: "template-4",
    name: "Verbale di Consegna",
    nameEn: "Handover Report",
    description: "Verbale di consegna dell'immobile con stato di conservazione e letture contatori.",
    descriptionEn: "Property handover report with condition assessment and meter readings.",
    category: "handover",
    downloadUrl: "/templates/verbale-consegna.pdf",
  },
  {
    id: "template-5",
    name: "Ricevuta di Pagamento",
    nameEn: "Payment Receipt",
    description: "Modello di ricevuta per il pagamento del canone di locazione.",
    descriptionEn: "Template for rental payment receipt.",
    category: "tax",
    downloadUrl: "/templates/ricevuta-pagamento.pdf",
  },
]);

// ============ TAX CALCULATOR ============

export interface CedolareSeccaResult {
  annualRent: number;
  taxRate: number;
  annualTax: number;
  quarterlyTax: number;
  quarterlyDeadlines: string[];
  contractType: string;
}

export function calculateCedolareSecca(
  monthlyRent: number,
  contractType: "transitorio" | "4+4" | "3+2"
): CedolareSeccaResult {
  const annualRent = monthlyRent * 12;
  const taxRate = contractType === "4+4" ? 0.21 : 0.10;
  const annualTax = Math.round(annualRent * taxRate * 100) / 100;
  const quarterlyTax = Math.round(annualTax / 4 * 100) / 100;

  return {
    annualRent,
    taxRate,
    annualTax,
    quarterlyTax,
    quarterlyDeadlines: ["16 giugno", "30 novembre (acconto)", "16 giugno (saldo)"],
    contractType: contractType === "transitorio" ? "Transitorio studenti" : contractType,
  };
}
