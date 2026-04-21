export type Locale = "it" | "en";

export const defaultLocale: Locale = "it";
export const supportedLocales: Locale[] = ["it", "en"];

type TranslationKeys = {
  // Navigation
  "nav.home": string;
  "nav.listings": string;
  "nav.roommates": string;
  "nav.dashboard": string;
  "nav.login": string;
  "nav.register": string;
  "nav.logout": string;
  "nav.notifications": string;
  "nav.verify": string;
  "nav.publishListing": string;
  // Home
  "home.title": string;
  "home.subtitle": string;
  "home.cta": string;
  "home.secondary": string;
  "home.verifiedListings": string;
  "home.coveredZones": string;
  "home.languageSupport": string;
  // Features
  "features.title": string;
  "features.subtitle": string;
  "features.verified.title": string;
  "features.verified.desc": string;
  "features.tours.title": string;
  "features.tours.desc": string;
  "features.pricing.title": string;
  "features.pricing.desc": string;
  "features.roommates.title": string;
  "features.roommates.desc": string;
  "features.multilingual.title": string;
  "features.multilingual.desc": string;
  "features.payments.title": string;
  "features.payments.desc": string;
  // Listings
  "listings.title": string;
  "listings.subtitle": string;
  "listings.search": string;
  "listings.filters": string;
  "listings.results": string;
  "listings.viewDetail": string;
  "listings.perMonth": string;
  "listings.verified": string;
  "listings.available": string;
  "listings.negotiating": string;
  "listings.allTypes": string;
  "listings.zoneOrStreet": string;
  "listings.minPrice": string;
  "listings.maxPrice": string;
  "listings.verifiedOnly": string;
  "listings.virtualTourOnly": string;
  "listings.utilitiesIncluded": string;
  "listings.deposit": string;
  "listings.availableFrom": string;
  // Dashboard
  "dashboard.title": string;
  "dashboard.overview": string;
  "dashboard.listings": string;
  "dashboard.messages": string;
  "dashboard.analytics": string;
  // Auth
  "auth.login": string;
  "auth.register": string;
  "auth.email": string;
  "auth.password": string;
  "auth.name": string;
  "auth.role": string;
  "auth.student": string;
  "auth.landlord": string;
  "auth.admin": string;
  // Common
  "common.save": string;
  "common.cancel": string;
  "common.submit": string;
  "common.loading": string;
  "common.noResults": string;
  "common.back": string;
};

const translations: Record<Locale, TranslationKeys> = {
  it: {
    "nav.home": "Home",
    "nav.listings": "Annunci",
    "nav.roommates": "Coinquilini",
    "nav.dashboard": "Dashboard",
    "nav.login": "Accedi",
    "nav.register": "Registrati",
    "nav.logout": "Esci",
    "nav.notifications": "Notifiche",
    "nav.verify": "Verifica università",
    "nav.publishListing": "Pubblica annuncio",
    "home.title": "Trova il tuo alloggio a Forlì",
    "home.subtitle": "La piattaforma che connette studenti e proprietari con annunci affidabili, strumenti digitali e un'esperienza pensata per chi arriva in città per studiare.",
    "home.cta": "Esplora gli annunci",
    "home.secondary": "Vai alla dashboard",
    "home.verifiedListings": "Annunci verificati",
    "home.coveredZones": "Zone coperte",
    "home.languageSupport": "Supporto lingue",
    "features.title": "Tutto quello che serve per affittare bene",
    "features.subtitle": "CasaStudente semplifica la ricerca di casa a Forlì con funzionalità utili sia per gli studenti sia per i proprietari.",
    "features.verified.title": "Alloggi verificati",
    "features.verified.desc": "Annunci controllati con informazioni chiare su posizione, dotazioni e disponibilità.",
    "features.tours.title": "Tour virtuali",
    "features.tours.desc": "Anteprime fotografiche e visite digitali per valutare l'alloggio prima di arrivare a Forlì.",
    "features.pricing.title": "Prezzi trasparenti",
    "features.pricing.desc": "Canone, deposito e spese evidenziati subito per evitare sorprese in fase di contatto.",
    "features.roommates.title": "Matching coinquilini",
    "features.roommates.desc": "Profili compatibili per condividere appartamenti con studenti affini per budget e stile di vita.",
    "features.multilingual.title": "Multilingue",
    "features.multilingual.desc": "Interfaccia e annunci pensati anche per studenti Erasmus e internazionali.",
    "features.payments.title": "Pagamenti sicuri",
    "features.payments.desc": "Flussi guidati per caparre e canoni con ricevute e conferme centralizzate.",
    "listings.title": "Annunci selezionati per studenti universitari",
    "listings.subtitle": "Filtra per zona, fascia di prezzo e tipo di alloggio.",
    "listings.search": "Cerca casa a Forlì",
    "listings.filters": "Filtri",
    "listings.results": "risultati trovati",
    "listings.viewDetail": "Vedi dettaglio",
    "listings.perMonth": "al mese",
    "listings.verified": "Verificato",
    "listings.available": "Disponibile",
    "listings.negotiating": "In trattativa",
    "listings.allTypes": "Tutti i tipi",
    "listings.zoneOrStreet": "Zona o via",
    "listings.minPrice": "Prezzo min",
    "listings.maxPrice": "Prezzo max",
    "listings.verifiedOnly": "Solo annunci verificati",
    "listings.virtualTourOnly": "Con tour virtuale",
    "listings.utilitiesIncluded": "Utenze incluse",
    "listings.deposit": "Deposito",
    "listings.availableFrom": "Disponibile da",
    "dashboard.title": "Dashboard",
    "dashboard.overview": "Panoramica",
    "dashboard.listings": "Annunci",
    "dashboard.messages": "Messaggi",
    "dashboard.analytics": "Analytics",
    "auth.login": "Accedi a CasaStudente",
    "auth.register": "Crea il tuo account",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.name": "Nome completo",
    "auth.role": "Ruolo",
    "auth.student": "Studente",
    "auth.landlord": "Proprietario",
    "auth.admin": "Amministratore",
    "common.save": "Salva",
    "common.cancel": "Annulla",
    "common.submit": "Invia",
    "common.loading": "Caricamento...",
    "common.noResults": "Nessun risultato trovato",
    "common.back": "Indietro",
  },
  en: {
    "nav.home": "Home",
    "nav.listings": "Listings",
    "nav.roommates": "Roommates",
    "nav.dashboard": "Dashboard",
    "nav.login": "Log in",
    "nav.register": "Sign up",
    "nav.logout": "Log out",
    "nav.notifications": "Notifications",
    "nav.verify": "Verify university",
    "nav.publishListing": "Post listing",
    "home.title": "Find your home in Forlì",
    "home.subtitle": "The platform that connects students and landlords with reliable listings, digital tools, and an experience designed for those arriving in the city to study.",
    "home.cta": "Browse listings",
    "home.secondary": "Go to dashboard",
    "home.verifiedListings": "Verified listings",
    "home.coveredZones": "Areas covered",
    "home.languageSupport": "Language support",
    "features.title": "Everything you need to rent well",
    "features.subtitle": "CasaStudente simplifies the housing search in Forlì with features for both students and landlords.",
    "features.verified.title": "Verified listings",
    "features.verified.desc": "Listings vetted with clear information on location, amenities, and availability.",
    "features.tours.title": "Virtual tours",
    "features.tours.desc": "Photo previews and digital visits to evaluate housing before arriving in Forlì.",
    "features.pricing.title": "Transparent pricing",
    "features.pricing.desc": "Rent, deposit, and expenses shown upfront to avoid surprises when contacting.",
    "features.roommates.title": "Roommate matching",
    "features.roommates.desc": "Compatible profiles to share apartments with students matching your budget and lifestyle.",
    "features.multilingual.title": "Multilingual",
    "features.multilingual.desc": "Interface and listings designed for Erasmus and international students too.",
    "features.payments.title": "Secure payments",
    "features.payments.desc": "Guided flows for deposits and rent with centralized receipts and confirmations.",
    "listings.title": "Curated listings for university students",
    "listings.subtitle": "Filter by zone, price range, and property type.",
    "listings.search": "Search housing in Forlì",
    "listings.filters": "Filters",
    "listings.results": "results found",
    "listings.viewDetail": "View details",
    "listings.perMonth": "per month",
    "listings.verified": "Verified",
    "listings.available": "Available",
    "listings.negotiating": "In negotiation",
    "listings.allTypes": "All types",
    "listings.zoneOrStreet": "Zone or street",
    "listings.minPrice": "Min price",
    "listings.maxPrice": "Max price",
    "listings.verifiedOnly": "Verified listings only",
    "listings.virtualTourOnly": "With virtual tour",
    "listings.utilitiesIncluded": "Utilities included",
    "listings.deposit": "Deposit",
    "listings.availableFrom": "Available from",
    "dashboard.title": "Dashboard",
    "dashboard.overview": "Overview",
    "dashboard.listings": "Listings",
    "dashboard.messages": "Messages",
    "dashboard.analytics": "Analytics",
    "auth.login": "Log in to CasaStudente",
    "auth.register": "Create your account",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.name": "Full name",
    "auth.role": "Role",
    "auth.student": "Student",
    "auth.landlord": "Landlord",
    "auth.admin": "Administrator",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.submit": "Submit",
    "common.loading": "Loading...",
    "common.noResults": "No results found",
    "common.back": "Back",
  },
};

export function t(key: keyof TranslationKeys, locale: Locale = defaultLocale): string {
  return translations[locale]?.[key] ?? translations[defaultLocale][key] ?? key;
}

export function getLocaleFromCookie(cookieValue?: string): Locale {
  if (cookieValue && supportedLocales.includes(cookieValue as Locale)) {
    return cookieValue as Locale;
  }
  return defaultLocale;
}
