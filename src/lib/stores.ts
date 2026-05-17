import { InMemoryStore } from "@/lib/db";

// ============ MESSAGING (Feature 4) ============

export interface Conversation {
  id: string;
  listingId: string;
  listingTitle: string;
  participantIds: string[];
  participantNames: string[];
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  read: boolean;
  createdAt: string;
  translatedContent?: string;
}

export const conversationStore = new InMemoryStore<Conversation>();
export const messageStore = new InMemoryStore<Message>();

// Seed demo conversations
conversationStore.seed([
  {
    id: "conv-1",
    listingId: "via-colombo-21-singola",
    listingTitle: "Via Cristoforo Colombo 21",
    participantIds: ["user-student-1", "user-landlord-1"],
    participantNames: ["Martina López", "Elena Rossi"],
    lastMessage: "Vorrei anche sapere se le utenze sono già incluse nel canone.",
    lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
    unreadCount: 1,
  },
  {
    id: "conv-2",
    listingId: "viale-roma-48-bilocale",
    listingTitle: "Viale Roma 48",
    participantIds: ["user-student-2", "user-landlord-2"],
    participantNames: ["Luca Bianchi", "Marco Guidi"],
    lastMessage: "Il bilocale è disponibile anche per due studenti con contratto cointestato?",
    lastMessageAt: new Date(Date.now() - 86400000).toISOString(),
    unreadCount: 1,
  },
]);

messageStore.seed([
  {
    id: "msg-1",
    conversationId: "conv-1",
    senderId: "user-student-1",
    senderName: "Martina López",
    content: "Ciao, sarei interessata alla stanza. È possibile fissare un tour virtuale martedì pomeriggio?",
    read: true,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "msg-2",
    conversationId: "conv-1",
    senderId: "user-landlord-1",
    senderName: "Elena Rossi",
    content: "Certamente! Posso inviarti il link per il tour alle 17:30 e poi organizziamo una chiamata di 15 minuti.",
    read: true,
    createdAt: new Date(Date.now() - 5400000).toISOString(),
  },
  {
    id: "msg-3",
    conversationId: "conv-1",
    senderId: "user-student-1",
    senderName: "Martina López",
    content: "Perfetto, grazie. Vorrei anche sapere se le utenze sono già incluse nel canone.",
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "msg-4",
    conversationId: "conv-2",
    senderId: "user-student-2",
    senderName: "Luca Bianchi",
    content: "Il bilocale è disponibile anche per due studenti con contratto cointestato?",
    read: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
]);

// ============ ROOMMATE MATCHING (Feature 7) ============

export type SleepSchedule = "early" | "late" | "flexible";
export type SocialPreference = "quiet" | "social" | "balanced";

export interface RoommateProfile {
  id: string;
  userId: string;
  name: string;
  studyProgram: string;
  languages: string[];
  budgetMin: number;
  budgetMax: number;
  sleepSchedule: SleepSchedule;
  cleanliness: number; // 1-5
  socialPreference: SocialPreference;
  petTolerant: boolean;
  smokingTolerant: boolean;
  bio: string;
  lookingForRoommate: boolean;
  preferredZones: string[];
}

export const roommateStore = new InMemoryStore<RoommateProfile>();

roommateStore.seed([
  {
    id: "roommate-1",
    userId: "user-student-1",
    name: "Martina López",
    studyProgram: "SSLMIT — Interpretazione",
    languages: ["Español", "Italiano", "English"],
    budgetMin: 250,
    budgetMax: 400,
    sleepSchedule: "late",
    cleanliness: 4,
    socialPreference: "social",
    petTolerant: true,
    smokingTolerant: false,
    bio: "Studentessa Erasmus dalla Spagna, cerco coinquilini per condividere un appartamento vicino al campus.",
    lookingForRoommate: true,
    preferredZones: ["Campus", "Centro"],
  },
  {
    id: "roommate-2",
    userId: "user-student-2",
    name: "Luca Bianchi",
    studyProgram: "Ingegneria Aerospaziale",
    languages: ["Italiano", "English"],
    budgetMin: 300,
    budgetMax: 450,
    sleepSchedule: "early",
    cleanliness: 5,
    socialPreference: "balanced",
    petTolerant: false,
    smokingTolerant: false,
    bio: "Studente magistrale, cerco coinquilino/a ordinato/a e tranquillo/a.",
    lookingForRoommate: true,
    preferredZones: ["Stazione", "Centro"],
  },
  {
    id: "roommate-3",
    userId: "user-student-3",
    name: "Anna Petrova",
    studyProgram: "Scienze Internazionali",
    languages: ["Русский", "English", "Italiano"],
    budgetMin: 200,
    budgetMax: 350,
    sleepSchedule: "flexible",
    cleanliness: 3,
    socialPreference: "social",
    petTolerant: true,
    smokingTolerant: true,
    bio: "Studentessa russa al secondo anno, mi piace cucinare e fare sport. Cerco coinquilini aperti e internazionali.",
    lookingForRoommate: true,
    preferredZones: ["Campus", "Cava"],
  },
  {
    id: "roommate-4",
    userId: "user-student-4",
    name: "Kenji Tanaka",
    studyProgram: "SSLMIT — Traduzione",
    languages: ["日本語", "English", "Italiano"],
    budgetMin: 300,
    budgetMax: 500,
    sleepSchedule: "late",
    cleanliness: 4,
    socialPreference: "quiet",
    petTolerant: false,
    smokingTolerant: false,
    bio: "Studente giapponese, cerco un ambiente tranquillo dove poter studiare e riposare bene.",
    lookingForRoommate: true,
    preferredZones: ["Centro", "San Benedetto"],
  },
]);

// ============ REVIEWS & TRUST (Feature 8) ============

export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: "student" | "landlord";
  revieweeId: string;
  revieweeName: string;
  listingId: string;
  listingTitle: string;
  ratingOverall: number; // 1-5
  ratingCleanliness: number;
  ratingCommunication: number;
  ratingAccuracy: number;
  ratingValue: number;
  comment: string;
  verifiedLease: boolean;
  createdAt: string;
  flagged: boolean;
}

export const reviewStore = new InMemoryStore<Review>();

reviewStore.seed([
  {
    id: "review-1",
    reviewerId: "user-student-1",
    reviewerName: "Martina López",
    reviewerRole: "student",
    revieweeId: "user-landlord-1",
    revieweeName: "Elena Rossi",
    listingId: "via-colombo-21-singola",
    listingTitle: "Via Cristoforo Colombo 21",
    ratingOverall: 5,
    ratingCleanliness: 5,
    ratingCommunication: 5,
    ratingAccuracy: 4,
    ratingValue: 4,
    comment: "Proprietaria molto disponibile e professionale. L'appartamento era esattamente come nelle foto. Consiglio vivamente!",
    verifiedLease: true,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    flagged: false,
  },
  {
    id: "review-2",
    reviewerId: "user-student-2",
    reviewerName: "Luca Bianchi",
    reviewerRole: "student",
    revieweeId: "user-landlord-2",
    revieweeName: "Marco Guidi",
    listingId: "viale-roma-48-bilocale",
    listingTitle: "Viale Roma 48",
    ratingOverall: 4,
    ratingCleanliness: 4,
    ratingCommunication: 5,
    ratingAccuracy: 4,
    ratingValue: 3,
    comment: "Ottimo bilocale, ben collegato. Il proprietario risponde sempre velocemente. Unica nota: il riscaldamento potrebbe essere migliorato.",
    verifiedLease: true,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    flagged: false,
  },
  {
    id: "review-3",
    reviewerId: "user-landlord-1",
    reviewerName: "Elena Rossi",
    reviewerRole: "landlord",
    revieweeId: "user-student-1",
    revieweeName: "Martina López",
    listingId: "via-colombo-21-singola",
    listingTitle: "Via Cristoforo Colombo 21",
    ratingOverall: 5,
    ratingCleanliness: 5,
    ratingCommunication: 5,
    ratingAccuracy: 5,
    ratingValue: 5,
    comment: "Inquilina eccezionale. Sempre puntuale con i pagamenti, rispettosa degli spazi comuni. La consiglio a tutti i proprietari.",
    verifiedLease: true,
    createdAt: new Date(Date.now() - 28 * 86400000).toISOString(),
    flagged: false,
  },
]);

// ============ PAYMENTS (Feature 9) ============

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface Payment {
  id: string;
  payerId: string;
  payerName: string;
  recipientId: string;
  recipientName: string;
  listingId: string;
  listingTitle: string;
  amount: number;
  platformFee: number;
  type: "rent" | "deposit" | "deposit_return";
  status: PaymentStatus;
  month?: string;
  createdAt: string;
  receiptNumber: string;
}

export interface LeaseContract {
  id: string;
  tenantId: string;
  tenantName: string;
  landlordId: string;
  landlordName: string;
  listingId: string;
  listingTitle: string;
  address: string;
  monthlyRent: number;
  deposit: number;
  startDate: string;
  endDate: string;
  contractType: "transitorio" | "4+4" | "3+2";
  taxRegime: "cedolare_secca" | "ordinario";
  status: "draft" | "pending_signature" | "active" | "expired";
  createdAt: string;
  lastUpdatedAt?: string;
  sentForSignatureAt?: string;
  landlordSignedAt?: string;
  tenantSignedAt?: string;
  signatureAuditTrail?: string[];
}

export const paymentStore = new InMemoryStore<Payment>();
export const leaseStore = new InMemoryStore<LeaseContract>();

paymentStore.seed([
  {
    id: "pay-1",
    payerId: "user-student-1",
    payerName: "Martina López",
    recipientId: "user-landlord-1",
    recipientName: "Elena Rossi",
    listingId: "via-colombo-21-singola",
    listingTitle: "Via Cristoforo Colombo 21",
    amount: 360,
    platformFee: 18,
    type: "rent",
    status: "completed",
    month: "Luglio 2026",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    receiptNumber: "RIC-2026-00142",
  },
  {
    id: "pay-2",
    payerId: "user-student-1",
    payerName: "Martina López",
    recipientId: "user-landlord-1",
    recipientName: "Elena Rossi",
    listingId: "via-colombo-21-singola",
    listingTitle: "Via Cristoforo Colombo 21",
    amount: 720,
    platformFee: 36,
    type: "deposit",
    status: "completed",
    createdAt: new Date(Date.now() - 35 * 86400000).toISOString(),
    receiptNumber: "RIC-2026-00089",
  },
]);

leaseStore.seed([
  {
    id: "lease-1",
    tenantId: "user-student-1",
    tenantName: "Martina López",
    landlordId: "user-landlord-1",
    landlordName: "Elena Rossi",
    listingId: "via-colombo-21-singola",
    listingTitle: "Via Cristoforo Colombo 21",
    address: "Via Cristoforo Colombo 21, Forlì",
    monthlyRent: 360,
    deposit: 720,
    startDate: "2026-09-01",
    endDate: "2027-08-31",
    contractType: "transitorio",
    taxRegime: "cedolare_secca",
    status: "active",
    createdAt: new Date(Date.now() - 35 * 86400000).toISOString(),
    sentForSignatureAt: new Date(Date.now() - 37 * 86400000).toISOString(),
    landlordSignedAt: new Date(Date.now() - 37 * 86400000).toISOString(),
    tenantSignedAt: new Date(Date.now() - 36 * 86400000).toISOString(),
    lastUpdatedAt: new Date(Date.now() - 36 * 86400000).toISOString(),
    signatureAuditTrail: [
      "Bozza creata dal proprietario",
      "Contratto inviato per la firma digitale",
      "Inquilina ha firmato digitalmente il contratto",
    ],
  },
]);

// ============ NOTIFICATIONS (Feature 10) ============

export type NotificationType = "new_listing" | "message" | "payment" | "review" | "availability" | "system";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  criteria: {
    zone?: string;
    minPrice?: number;
    maxPrice?: number;
    type?: string;
    verifiedOnly?: boolean;
  };
  notifyEmail: boolean;
  notifyInApp: boolean;
  createdAt: string;
}

export const notificationStore = new InMemoryStore<Notification>();
export const savedSearchStore = new InMemoryStore<SavedSearch>();

notificationStore.seed([
  {
    id: "notif-1",
    userId: "user-student-1",
    type: "new_listing",
    title: "Nuovo annuncio compatibile",
    message: "Un nuovo monolocale è disponibile in Centro a €580/mese — corrisponde alla tua ricerca salvata.",
    read: false,
    link: "/listings/via-giorgio-regnoli-33-monolocale",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "notif-2",
    userId: "user-student-1",
    type: "message",
    title: "Nuovo messaggio da Elena Rossi",
    message: "Hai ricevuto una risposta sulla tua richiesta per Via Cristoforo Colombo 21.",
    read: false,
    link: "/dashboard/messages",
    createdAt: new Date(Date.now() - 5400000).toISOString(),
  },
  {
    id: "notif-3",
    userId: "user-landlord-1",
    type: "availability",
    title: "Aggiorna disponibilità",
    message: "Il tuo annuncio per Via Cristoforo Colombo 21 non viene aggiornato da 30 giorni. Conferma che è ancora disponibile.",
    read: false,
    link: "/dashboard/listings",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "notif-4",
    userId: "user-student-1",
    type: "payment",
    title: "Pagamento confermato",
    message: "Il pagamento di €360 per il canone di Luglio 2026 è stato confermato. Ricevuta: RIC-2026-00142.",
    read: true,
    link: "/dashboard/payments",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
]);

savedSearchStore.seed([
  {
    id: "search-1",
    userId: "user-student-1",
    name: "Monolocale Centro",
    criteria: {
      zone: "Centro",
      minPrice: 400,
      maxPrice: 700,
      type: "monolocale",
    },
    notifyEmail: true,
    notifyInApp: true,
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
]);

// ============ COMPATIBILITY ALGORITHM (Feature 7) ============

export function calculateCompatibility(a: RoommateProfile, b: RoommateProfile): number {
  let score = 0;
  let maxScore = 0;

  // Budget overlap (weight: 25)
  maxScore += 25;
  const overlapMin = Math.max(a.budgetMin, b.budgetMin);
  const overlapMax = Math.min(a.budgetMax, b.budgetMax);
  if (overlapMax >= overlapMin) {
    const overlapRange = overlapMax - overlapMin;
    const totalRange = Math.max(a.budgetMax, b.budgetMax) - Math.min(a.budgetMin, b.budgetMin);
    score += totalRange > 0 ? Math.round(25 * (overlapRange / totalRange)) : 25;
  }

  // Sleep schedule (weight: 20)
  maxScore += 20;
  if (a.sleepSchedule === b.sleepSchedule) score += 20;
  else if (a.sleepSchedule === "flexible" || b.sleepSchedule === "flexible") score += 14;

  // Cleanliness (weight: 20)
  maxScore += 20;
  const cleanDiff = Math.abs(a.cleanliness - b.cleanliness);
  score += Math.max(0, 20 - cleanDiff * 5);

  // Social preference (weight: 15)
  maxScore += 15;
  if (a.socialPreference === b.socialPreference) score += 15;
  else if (a.socialPreference === "balanced" || b.socialPreference === "balanced") score += 10;

  // Language compatibility (weight: 10)
  maxScore += 10;
  const commonLangs = a.languages.filter((l) => b.languages.includes(l));
  score += Math.min(10, commonLangs.length * 4);

  // Zone preference overlap (weight: 5)
  maxScore += 5;
  const commonZones = a.preferredZones.filter((z) => b.preferredZones.includes(z));
  if (commonZones.length > 0) score += 5;

  // Pet/smoking tolerance (weight: 5)
  maxScore += 5;
  if (a.petTolerant === b.petTolerant) score += 2;
  if (a.smokingTolerant === b.smokingTolerant) score += 3;

  return Math.round((score / maxScore) * 100);
}

// ============ TRUST SCORE (Feature 8) ============

export function calculateTrustScore(reviews: Review[], verified: boolean, accountAgeDays: number): {
  score: number;
  badge: "bronze" | "silver" | "gold" | "none";
} {
  if (reviews.length === 0) {
    return { score: verified ? 3.0 : 1.0, badge: "none" };
  }

  const avgRating = reviews.reduce((sum, r) => sum + r.ratingOverall, 0) / reviews.length;
  const verifiedBonus = verified ? 0.5 : 0;
  const ageBonus = Math.min(accountAgeDays / 365, 1) * 0.3;
  const reviewCountBonus = Math.min(reviews.length / 10, 1) * 0.2;

  const score = Math.min(5, avgRating + verifiedBonus + ageBonus + reviewCountBonus);
  const roundedScore = Math.round(score * 10) / 10;

  let badge: "bronze" | "silver" | "gold" | "none" = "none";
  if (roundedScore >= 4.5 && reviews.length >= 5) badge = "gold";
  else if (roundedScore >= 4.0 && reviews.length >= 3) badge = "silver";
  else if (roundedScore >= 3.5 && reviews.length >= 1) badge = "bronze";

  return { score: roundedScore, badge };
}

// ============ MAP DATA (Feature 5) ============

export const campusCoordinates = { lat: 44.2226, lng: 12.0407 };

export const listingCoordinates: Record<string, { lat: number; lng: number }> = {
  "via-colombo-21-singola": { lat: 44.2242, lng: 12.0432 },
  "viale-roma-48-bilocale": { lat: 44.2210, lng: 12.0380 },
  "corso-repubblica-112-monolocale": { lat: 44.2219, lng: 12.0415 },
  "piazzale-vittoria-6-doppia": { lat: 44.2235, lng: 12.0405 },
  "via-cesare-battisti-14-singola": { lat: 44.2198, lng: 12.0448 },
  "via-giorgio-regnoli-33-monolocale": { lat: 44.2223, lng: 12.0398 },
  "via-ravegnana-84-bilocale": { lat: 44.2180, lng: 12.0520 },
};

export function calculateDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 1000); // meters
}

export function getWalkingTime(distanceMeters: number): number {
  return Math.round(distanceMeters / 80); // ~80m/min walking speed
}

export function getCyclingTime(distanceMeters: number): number {
  return Math.round(distanceMeters / 250); // ~250m/min cycling speed
}

// ============ FAVORITES (Feature: Listing Favorites) ============

export interface Favorite {
  id: string;
  userId: string;
  listingId: string;
  createdAt: string;
}

export const favoriteStore = new InMemoryStore<Favorite>();

favoriteStore.seed([
  {
    id: "fav-1",
    userId: "user-student-1",
    listingId: "via-colombo-21-singola",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: "fav-2",
    userId: "user-student-1",
    listingId: "piazzale-vittoria-6-doppia",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "fav-3",
    userId: "user-student-2",
    listingId: "viale-roma-48-bilocale",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
]);

// ============ COST CALCULATOR (Feature: Monthly Cost Calculator) ============

export interface MonthlyCostBreakdown {
  rent: number;
  utilitiesEstimate: number;
  utilitiesIncluded: boolean;
  utilitiesNote: string;
  transportEstimate: number;
  transportNote: string;
  totalEstimate: number;
}

/**
 * Parse the Italian utilities string to extract cost information.
 * Returns estimated monthly utility cost and whether utilities are included.
 */
export function parseUtilitiesCost(utilities: string): { estimate: number; included: boolean; note: string } {
  const lower = utilities.toLowerCase();

  // Fully included
  if (lower.includes("tutto incluso") || lower.includes("tutte incluse")) {
    return { estimate: 0, included: true, note: "Tutte le utenze incluse nel canone" };
  }

  // Partially included with cap
  const capMatch = lower.match(/inclus[eio]?\s+fino\s+a\s+[€]?(\d+)/);
  if (capMatch) {
    return { estimate: 0, included: true, note: `Utenze incluse fino a €${capMatch[1]}/mese` };
  }

  // Excluded with estimate
  const estimateMatch = lower.match(/stima\s+[€]?(\d+)/);
  if (estimateMatch) {
    return { estimate: Number(estimateMatch[1]), included: false, note: `Stima utenze: €${estimateMatch[1]}/mese` };
  }

  // Utilities at consumption (check before partial "inclus" to avoid false match)
  if (lower.includes("consumo")) {
    return { estimate: 70, included: false, note: "Utenze a consumo, stima media ~€70/mese" };
  }

  // Partially included (condo fees, water, etc.) — not fully included
  if (lower.includes("inclus")) {
    return { estimate: 30, included: false, note: "Alcune spese incluse, utenze extra stimate ~€30/mese" };
  }

  // Default: unknown
  return { estimate: 60, included: false, note: "Utenze non specificate, stima media ~€60/mese" };
}

/**
 * Estimate monthly transport cost based on zone distance to campus.
 */
export function estimateTransportCost(zone: string): { estimate: number; note: string } {
  const zoneTransport: Record<string, { estimate: number; note: string }> = {
    "Campus": { estimate: 0, note: "A piedi dal campus — nessun costo di trasporto" },
    "Centro": { estimate: 10, note: "In bici o a piedi — costo minimo" },
    "Stazione": { estimate: 25, note: "Bus o bici — abbonamento bus ~€25/mese" },
    "San Benedetto": { estimate: 25, note: "Bus consigliato — abbonamento ~€25/mese" },
    "Cava": { estimate: 25, note: "Bus consigliato — abbonamento ~€25/mese" },
    "Ronco": { estimate: 35, note: "Bus o mezzo proprio — stima ~€35/mese" },
    "Ospedaletto": { estimate: 25, note: "Bus consigliato — abbonamento ~€25/mese" },
  };

  return zoneTransport[zone] ?? { estimate: 25, note: "Stima trasporto ~€25/mese" };
}

/**
 * Calculate full monthly cost breakdown for a listing.
 */
export function calculateMonthlyCost(
  rent: number,
  utilities: string,
  zone: string
): MonthlyCostBreakdown {
  const utilityInfo = parseUtilitiesCost(utilities);
  const transportInfo = estimateTransportCost(zone);

  return {
    rent,
    utilitiesEstimate: utilityInfo.estimate,
    utilitiesIncluded: utilityInfo.included,
    utilitiesNote: utilityInfo.note,
    transportEstimate: transportInfo.estimate,
    transportNote: transportInfo.note,
    totalEstimate: rent + utilityInfo.estimate + transportInfo.estimate,
  };
}

// ============ ROOMMATE-AWARE SEARCH (Feature: Search Together) ============

/**
 * Merge two roommate profiles' preferences into listing search filters.
 * Finds the budget intersection and union of preferred zones.
 */
export function mergeRoommatePreferences(
  profiles: Array<{ budgetMin: number; budgetMax: number; preferredZones: string[]; petTolerant: boolean; smokingTolerant: boolean }>
): {
  budgetMin: number;
  budgetMax: number;
  zones: string[];
  requirePetFriendly: boolean;
  requireNoSmoking: boolean;
} {
  if (profiles.length === 0) {
    return { budgetMin: 0, budgetMax: 10000, zones: [], requirePetFriendly: false, requireNoSmoking: false };
  }

  // Combined budget is the sum of individual budgets (for shared apartments)
  const budgetMin = profiles.reduce((sum, p) => sum + p.budgetMin, 0);
  const budgetMax = profiles.reduce((sum, p) => sum + p.budgetMax, 0);

  // Zones: intersection first, fall back to union if intersection is empty
  const allZones = profiles.map((p) => new Set(p.preferredZones));
  let zoneIntersection = [...allZones[0]].filter((z) => allZones.every((s) => s.has(z)));
  if (zoneIntersection.length === 0) {
    zoneIntersection = [...new Set(profiles.flatMap((p) => p.preferredZones))];
  }

  // Pet-friendly only if ALL roommates tolerate pets (petTolerant = "Animali ammessi")
  const requirePetFriendly = profiles.every((p) => p.petTolerant);
  // No smoking if ANY roommate doesn't tolerate smoking
  const requireNoSmoking = profiles.some((p) => !p.smokingTolerant);

  return {
    budgetMin,
    budgetMax,
    zones: zoneIntersection,
    requirePetFriendly,
    requireNoSmoking,
  };
}
