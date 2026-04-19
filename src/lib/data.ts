import { InMemoryStore } from "@/lib/db";

export type ListingType =
  | "stanza singola"
  | "stanza doppia"
  | "monolocale"
  | "bilocale";

export interface LandlordProfile {
  name: string;
  role: string;
  phone: string;
  email: string;
  languages: string[];
  responseRate: string;
  responseTime: string;
}

export interface Listing {
  id: string;
  title: string;
  address: string;
  neighborhood: string;
  zone: string;
  type: ListingType;
  price: number;
  deposit: number;
  utilities: string;
  size: number;
  rooms: number;
  bathrooms: number;
  floor: string;
  availableFrom: string;
  status: "Disponibile" | "In trattativa";
  verified: boolean;
  virtualTour: boolean;
  securePayments: boolean;
  furnished: boolean;
  photos: string[];
  features: string[];
  description: string;
  nearby: string[];
  landlord: LandlordProfile;
}

export const listings: Listing[] = [
  {
    id: "via-colombo-21-singola",
    title: "Stanza singola luminosa vicino al Campus",
    address: "Via Cristoforo Colombo 21, Forlì",
    neighborhood: "Zona Campus",
    zone: "Campus",
    type: "stanza singola",
    price: 360,
    deposit: 720,
    utilities: "Utenze incluse fino a €60/mese",
    size: 18,
    rooms: 4,
    bathrooms: 2,
    floor: "2° piano",
    availableFrom: "1 settembre 2026",
    status: "Disponibile",
    verified: true,
    virtualTour: true,
    securePayments: true,
    furnished: true,
    photos: ["Camera studio", "Cucina condivisa", "Vista sul cortile"],
    features: ["Wi‑Fi fibra", "Scrivania ampia", "Lavatrice", "Balcone"],
    description:
      "Camera singola in appartamento condiviso con altri studenti, ideale per chi vuole raggiungere il campus in pochi minuti. Ambienti recenti, cucina completa e spazi comuni ordinati.",
    nearby: [
      "8 min a piedi dal Campus universitario",
      "Fermata bus linea 2 sotto casa",
      "Supermercato a 300 metri",
    ],
    landlord: {
      name: "Elena Rossi",
      role: "Proprietaria verificata",
      phone: "+39 348 555 0182",
      email: "elena.rossi@casastudente.it",
      languages: ["Italiano", "English"],
      responseRate: "98%",
      responseTime: "entro 2 ore",
    },
  },
  {
    id: "viale-roma-48-bilocale",
    title: "Bilocale arredato in Viale Roma",
    address: "Viale Roma 48, Forlì",
    neighborhood: "Stazione",
    zone: "Stazione",
    type: "bilocale",
    price: 750,
    deposit: 1500,
    utilities: "Spese condominiali incluse",
    size: 52,
    rooms: 2,
    bathrooms: 1,
    floor: "1° piano con ascensore",
    availableFrom: "15 ottobre 2026",
    status: "Disponibile",
    verified: true,
    virtualTour: true,
    securePayments: true,
    furnished: true,
    photos: ["Soggiorno open space", "Camera matrimoniale", "Ingresso palazzo"],
    features: ["Aria condizionata", "Cantina", "Posto bici", "Cucina nuova"],
    description:
      "Bilocale pensato per studenti magistrali o giovani lavoratori, con soggiorno luminoso e collegamenti rapidi verso il centro e la stazione. Contratto annuale con opzione rinnovo.",
    nearby: [
      "5 min dalla stazione ferroviaria",
      "12 min in bici dal campus",
      "Bar e servizi in Viale Roma",
    ],
    landlord: {
      name: "Marco Guidi",
      role: "Host Premium",
      phone: "+39 339 102 7784",
      email: "marco.guidi@casastudente.it",
      languages: ["Italiano", "English", "Español"],
      responseRate: "95%",
      responseTime: "entro la giornata",
    },
  },
  {
    id: "corso-repubblica-112-monolocale",
    title: "Monolocale smart nel cuore di Forlì",
    address: "Corso della Repubblica 112, Forlì",
    neighborhood: "Centro storico",
    zone: "Centro",
    type: "monolocale",
    price: 620,
    deposit: 1240,
    utilities: "Utenze escluse, stima €90/mese",
    size: 31,
    rooms: 1,
    bathrooms: 1,
    floor: "3° piano",
    availableFrom: "1 novembre 2026",
    status: "Disponibile",
    verified: true,
    virtualTour: false,
    securePayments: true,
    furnished: true,
    photos: ["Zona living-notte", "Angolo cucina", "Bagno finestrato"],
    features: ["Letto contenitore", "Porta blindata", "Microonde", "Riscaldamento autonomo"],
    description:
      "Monolocale funzionale a pochi passi da biblioteche, locali e facoltà. Ideale per chi cerca indipendenza in pieno centro con tutto a portata di mano.",
    nearby: [
      "10 min dal polo universitario del centro",
      "Piazza Saffi a 400 metri",
      "Farmacia e minimarket a 2 minuti",
    ],
    landlord: {
      name: "Sara Valentini",
      role: "Proprietaria verificata",
      phone: "+39 333 887 4104",
      email: "sara.valentini@casastudente.it",
      languages: ["Italiano"],
      responseRate: "93%",
      responseTime: "entro 4 ore",
    },
  },
  {
    id: "piazzale-vittoria-6-doppia",
    title: "Posto in stanza doppia vicino a Piazzale della Vittoria",
    address: "Piazzale della Vittoria 6, Forlì",
    neighborhood: "Centro / Università",
    zone: "Centro",
    type: "stanza doppia",
    price: 300,
    deposit: 600,
    utilities: "Tutto incluso",
    size: 24,
    rooms: 3,
    bathrooms: 1,
    floor: "Piano rialzato",
    availableFrom: "Subito",
    status: "Disponibile",
    verified: true,
    virtualTour: true,
    securePayments: true,
    furnished: true,
    photos: ["Stanza doppia", "Zona studio", "Cortile interno"],
    features: ["Due scrivanie", "Wi‑Fi 1Gbps", "Pulizie aree comuni", "Deposito bici"],
    description:
      "Soluzione economica e centrale per studenti che vogliono condividere la casa senza rinunciare ai servizi. Contratto flessibile con permanenza minima di sei mesi.",
    nearby: [
      "A 6 min da Piazzale della Vittoria",
      "Autobus diretti verso il campus",
      "Supermercato e lavanderia sotto casa",
    ],
    landlord: {
      name: "Studio Affitti Romagna",
      role: "Agenzia partner",
      phone: "+39 0543 555210",
      email: "romagna@casastudente.it",
      languages: ["Italiano", "English"],
      responseRate: "97%",
      responseTime: "entro 1 ora",
    },
  },
  {
    id: "via-cesare-battisti-14-singola",
    title: "Stanza singola tranquilla in appartamento ristrutturato",
    address: "Via Cesare Battisti 14, Forlì",
    neighborhood: "San Benedetto",
    zone: "San Benedetto",
    type: "stanza singola",
    price: 390,
    deposit: 780,
    utilities: "Condominio e acqua inclusi",
    size: 16,
    rooms: 3,
    bathrooms: 2,
    floor: "2° piano",
    availableFrom: "1 ottobre 2026",
    status: "Disponibile",
    verified: false,
    virtualTour: false,
    securePayments: true,
    furnished: true,
    photos: ["Camera singola", "Cucina abitabile", "Bagno condiviso"],
    features: ["Armadio grande", "Infissi nuovi", "Cucina completa", "Quartiere silenzioso"],
    description:
      "Camera per studenti che cercano un contesto ordinato e residenziale, con spazi condivisi rinnovati e ottimi collegamenti verso il centro.",
    nearby: [
      "15 min in bici dal campus",
      "Parco urbano a 200 metri",
      "Linea bus 3 verso stazione e centro",
    ],
    landlord: {
      name: "Paolo Monti",
      role: "Proprietario",
      phone: "+39 349 447 9910",
      email: "paolo.monti@casastudente.it",
      languages: ["Italiano", "Français"],
      responseRate: "89%",
      responseTime: "entro 6 ore",
    },
  },
  {
    id: "via-giorgio-regnoli-33-monolocale",
    title: "Monolocale moderno in Via Giorgio Regnoli",
    address: "Via Giorgio Regnoli 33, Forlì",
    neighborhood: "Centro storico",
    zone: "Centro",
    type: "monolocale",
    price: 580,
    deposit: 1160,
    utilities: "Wi‑Fi incluso, utenze a consumo",
    size: 28,
    rooms: 1,
    bathrooms: 1,
    floor: "1° piano",
    availableFrom: "20 settembre 2026",
    status: "In trattativa",
    verified: true,
    virtualTour: true,
    securePayments: true,
    furnished: true,
    photos: ["Zona notte", "Cucina lineare", "Ingresso indipendente"],
    features: ["Smart TV", "Macchina del caffè", "Check-in digitale", "Rastrelliera bici"],
    description:
      "Monolocale recentemente rinnovato, perfetto per studenti internazionali che vogliono vivere il centro con un appartamento indipendente e già pronto.",
    nearby: [
      "Piazza Saffi a 5 minuti",
      "Biblioteca comunale a 700 metri",
      "Molti locali e coworking in zona",
    ],
    landlord: {
      name: "Giulia Neri",
      role: "Host Premium",
      phone: "+39 351 600 4412",
      email: "giulia.neri@casastudente.it",
      languages: ["Italiano", "English", "Deutsch"],
      responseRate: "99%",
      responseTime: "entro 30 minuti",
    },
  },
  {
    id: "via-ravegnana-84-bilocale",
    title: "Bilocale con terrazzo in Via Ravegnana",
    address: "Via Ravegnana 84, Forlì",
    neighborhood: "Cava",
    zone: "Cava",
    type: "bilocale",
    price: 690,
    deposit: 1380,
    utilities: "Riscaldamento incluso nelle spese",
    size: 47,
    rooms: 2,
    bathrooms: 1,
    floor: "4° piano con ascensore",
    availableFrom: "1 dicembre 2026",
    status: "Disponibile",
    verified: true,
    virtualTour: false,
    securePayments: true,
    furnished: true,
    photos: ["Terrazzo", "Zona pranzo", "Camera matrimoniale"],
    features: ["Terrazzo abitabile", "Lavastoviglie", "Cantina", "Parcheggio facile"],
    description:
      "Bilocale comodo per chi cerca più privacy e un canone competitivo rispetto al centro. Ottimo per due studenti che vogliono condividere un appartamento indipendente.",
    nearby: [
      "15 min in bus dal centro",
      "Supermercato e palestra a 500 metri",
      "Percorso ciclabile verso università",
    ],
    landlord: {
      name: "Alberto Fabbri",
      role: "Proprietario verificato",
      phone: "+39 340 778 1205",
      email: "alberto.fabbri@casastudente.it",
      languages: ["Italiano", "English"],
      responseRate: "91%",
      responseTime: "entro la giornata",
    },
  },
];

export const listingStore = new InMemoryStore<Listing>();
listingStore.seed(listings);

export async function getAllListings() {
  return listingStore.findAll();
}

export async function getListingById(id: string) {
  return listingStore.findById(id);
}

export const dashboardStats = [
  { label: "Annunci attivi", value: "6", change: "+2 questo mese", trend: "up" as const },
  { label: "Richieste ricevute", value: "28", change: "+18% rispetto al mese scorso", trend: "up" as const },
  { label: "Messaggi", value: "14", change: "4 non letti", trend: "neutral" as const },
  { label: "Tasso risposta", value: "96%", change: "+3% negli ultimi 30 giorni", trend: "up" as const },
];

export const recentActivity = [
  {
    id: "activity-1",
    title: "Nuova richiesta per Via Cristoforo Colombo 21",
    description: "Martina, studentessa Erasmus, ha chiesto una visita virtuale per martedì.",
    time: "10 minuti fa",
  },
  {
    id: "activity-2",
    title: "Messaggio ricevuto su Corso della Repubblica 112",
    description: "Domanda sulle spese mensili e sulla durata minima del contratto.",
    time: "1 ora fa",
  },
  {
    id: "activity-3",
    title: "Annuncio aggiornato in Viale Roma 48",
    description: "Hai modificato disponibilità e foto del bilocale vicino alla stazione.",
    time: "Oggi, 09:15",
  },
  {
    id: "activity-4",
    title: "Pagamento caparra confermato",
    description: "Ricevuta emessa per la prenotazione di Via Giorgio Regnoli 33.",
    time: "Ieri",
  },
];

export const landlordListings = [
  {
    id: "via-colombo-21-singola",
    title: "Via Cristoforo Colombo 21",
    type: "stanza singola",
    status: "Pubblicato",
    price: "€360/mese",
    inquiries: 8,
    updatedAt: "Oggi",
  },
  {
    id: "viale-roma-48-bilocale",
    title: "Viale Roma 48",
    type: "bilocale",
    status: "Pubblicato",
    price: "€750/mese",
    inquiries: 5,
    updatedAt: "Ieri",
  },
  {
    id: "corso-repubblica-112-monolocale",
    title: "Corso della Repubblica 112",
    type: "monolocale",
    status: "Bozza",
    price: "€620/mese",
    inquiries: 0,
    updatedAt: "2 giorni fa",
  },
  {
    id: "via-giorgio-regnoli-33-monolocale",
    title: "Via Giorgio Regnoli 33",
    type: "monolocale",
    status: "In trattativa",
    price: "€580/mese",
    inquiries: 11,
    updatedAt: "3 giorni fa",
  },
];

export const inboxThreads = [
  {
    id: "thread-1",
    sender: "Martina López",
    listing: "Via Cristoforo Colombo 21",
    preview: "Ciao, sarei interessata alla stanza. È possibile fissare un tour virtuale?",
    time: "10:42",
    unread: true,
  },
  {
    id: "thread-2",
    sender: "Luca Bianchi",
    listing: "Viale Roma 48",
    preview: "Il bilocale è disponibile anche per due studenti con contratto cointestato?",
    time: "Ieri",
    unread: true,
  },
  {
    id: "thread-3",
    sender: "Anna Petrova",
    listing: "Corso della Repubblica 112",
    preview: "Grazie per le informazioni. Posso inviare i documenti entro venerdì.",
    time: "Ieri",
    unread: false,
  },
  {
    id: "thread-4",
    sender: "Marco De Santis",
    listing: "Via Giorgio Regnoli 33",
    preview: "Confermo la ricezione della ricevuta per la caparra.",
    time: "Lun",
    unread: false,
  },
];
