import { InMemoryStore } from "@/lib/db";

// ============ COMMUNITY & SOCIAL PROOF ============

export type FeedItemType = "new_listing" | "housing_found" | "new_review" | "milestone" | "tip" | "success_story";

export interface FeedItem {
  id: string;
  type: FeedItemType;
  title: string;
  description: string;
  icon: string;
  createdAt: string;
}

export interface SuccessStory {
  id: string;
  studentName: string;
  program: string;
  neighborhood: string;
  quote: string;
  photoPlaceholder: string;
  createdAt: string;
  featured: boolean;
}

export interface ContentArticle {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  content: string;
  contentEn: string;
  category: "guide" | "checklist" | "tips" | "info";
  createdAt: string;
  updatedAt: string;
}

export interface Referral {
  id: string;
  referrerId: string;
  referrerName: string;
  referredEmail: string;
  status: "pending" | "registered" | "completed";
  createdAt: string;
}

export const feedStore = new InMemoryStore<FeedItem>();
export const successStoryStore = new InMemoryStore<SuccessStory>();
export const contentStore = new InMemoryStore<ContentArticle>();
export const referralStore = new InMemoryStore<Referral>();

feedStore.seed([
  {
    id: "feed-1",
    type: "housing_found",
    title: "Una studentessa SSLMIT ha trovato casa in Centro",
    description: "Monolocale in Via Giorgio Regnoli — 5 min da Piazza Saffi",
    icon: "🏠",
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "feed-2",
    type: "new_listing",
    title: "3 nuovi annunci verificati questa settimana",
    description: "Nuove opzioni in Zona Campus e Centro storico",
    icon: "📋",
    createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
  },
  {
    id: "feed-3",
    type: "new_review",
    title: "Nuova recensione 5★ per Elena Rossi",
    description: "\"Proprietaria molto disponibile e professionale\" — Martina L.",
    icon: "⭐",
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: "feed-4",
    type: "milestone",
    title: "50 studenti hanno trovato casa tramite CasaStudente",
    description: "Traguardo raggiunto nel primo semestre di attività!",
    icon: "🎉",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "feed-5",
    type: "tip",
    title: "Consiglio della settimana",
    description: "Visita il quartiere di sera prima di firmare — ti darà un'idea reale della zona!",
    icon: "💡",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
]);

successStoryStore.seed([
  {
    id: "story-1",
    studentName: "Martina L.",
    program: "SSLMIT — Interpretazione",
    neighborhood: "Centro",
    quote: "Arrivare dalla Spagna e trovare casa a Forlì era la mia più grande preoccupazione. Con CasaStudente ho trovato una stanza perfetta in meno di una settimana!",
    photoPlaceholder: "🇪🇸",
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    featured: true,
  },
  {
    id: "story-2",
    studentName: "Luca B.",
    program: "Ingegneria Aerospaziale",
    neighborhood: "Stazione",
    quote: "Il matching coinquilini mi ha fatto conoscere il mio attuale compagno di appartamento. Abbiamo abitudini molto simili!",
    photoPlaceholder: "🇮🇹",
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    featured: true,
  },
  {
    id: "story-3",
    studentName: "Anna P.",
    program: "Scienze Internazionali",
    neighborhood: "Campus",
    quote: "Da studentessa russa, la barriera linguistica era un problema enorme. Il supporto multilingue mi ha semplificato tutto.",
    photoPlaceholder: "🇷🇺",
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    featured: false,
  },
]);

contentStore.seed([
  {
    id: "article-1",
    slug: "checklist-trasferimento",
    title: "Checklist per il trasferimento a Forlì",
    titleEn: "Moving to Forlì Checklist",
    summary: "Tutto quello che devi fare prima, durante e dopo il trasferimento a Forlì.",
    summaryEn: "Everything you need to do before, during, and after moving to Forlì.",
    content: "## Prima del trasferimento\n- Conferma iscrizione\n- Richiedi alloggio Er.Go\n- Cerca alloggio su CasaStudente\n- Prepara documenti\n\n## All'arrivo\n- Firma contratto\n- Registra residenza\n- Attiva utenze\n\n## Prime settimane\n- Ritira badge universitario\n- Attiva tessera mensa\n- Ottieni abbonamento bus",
    contentEn: "## Before moving\n- Confirm enrollment\n- Apply for Er.Go housing\n- Search on CasaStudente\n- Prepare documents\n\n## Upon arrival\n- Sign rental agreement\n- Register residence\n- Set up utilities\n\n## First weeks\n- Pick up university badge\n- Activate meal card\n- Get bus pass",
    category: "checklist",
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "article-2",
    slug: "guida-permesso-soggiorno",
    title: "Guida al Permesso di Soggiorno",
    titleEn: "Residence Permit Guide",
    summary: "Come richiedere e rinnovare il permesso di soggiorno a Forlì.",
    summaryEn: "How to apply for and renew your residence permit in Forlì.",
    content: "## Documenti necessari\n- Passaporto con visto\n- Contratto registrato\n- Certificato iscrizione\n- Assicurazione sanitaria\n\n## Procedura\n1. Ritira il kit alla Posta\n2. Compila modulo 1\n3. Spedisci raccomandata\n4. Attendi convocazione Questura",
    contentEn: "## Required documents\n- Passport with visa\n- Registered contract\n- Enrollment certificate\n- Health insurance\n\n## Procedure\n1. Pick up kit at Post Office\n2. Fill out Form 1\n3. Send via registered mail\n4. Wait for Police HQ appointment",
    category: "guide",
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: "article-3",
    slug: "trasporti-forli",
    title: "Guida ai trasporti di Forlì",
    titleEn: "Forlì Transport Guide",
    summary: "Linee bus, abbonamenti e come muoversi in città.",
    summaryEn: "Bus lines, passes, and how to get around the city.",
    content: "## Linee principali\n- Linea 1: Campus ↔ Stazione\n- Linea 2: Cava ↔ Centro\n- Linea 3: San Benedetto ↔ Stazione\n\n## Abbonamenti\n- Mensile studenti: €26\n- Annuale: €220\n\n## Treno\n- Forlì–Bologna: ~45 min, ~€7\n- Forlì–Cesena: ~15 min, ~€3",
    contentEn: "## Main lines\n- Line 1: Campus ↔ Station\n- Line 2: Cava ↔ Center\n- Line 3: San Benedetto ↔ Station\n\n## Passes\n- Monthly student: €26\n- Annual: €220\n\n## Train\n- Forlì–Bologna: ~45 min, ~€7\n- Forlì–Cesena: ~15 min, ~€3",
    category: "guide",
    createdAt: new Date(Date.now() - 40 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "article-4",
    slug: "numeri-utili",
    title: "Numeri utili e contatti di emergenza",
    titleEn: "Useful Numbers and Emergency Contacts",
    summary: "Tutti i numeri importanti per vivere a Forlì.",
    summaryEn: "All important numbers for living in Forlì.",
    content: "## Emergenze\n- Emergenze: 112\n- Ambulanza: 118\n- Vigili del Fuoco: 115\n\n## Università\n- Segreteria: 051 2099200\n- Er.Go: 051 6436900\n\n## Servizi\n- Comune: 0543 712111\n- ASL Romagna: 0543 731731",
    contentEn: "## Emergencies\n- General: 112\n- Ambulance: 118\n- Fire: 115\n\n## University\n- Student office: 051 2099200\n- Er.Go: 051 6436900\n\n## Services\n- Municipality: 0543 712111\n- ASL Romagna: 0543 731731",
    category: "info",
    createdAt: new Date(Date.now() - 50 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
]);
