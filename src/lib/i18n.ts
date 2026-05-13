export type Locale = "it" | "en" | "es" | "fr";

export const defaultLocale: Locale = "it";
export const supportedLocales: Locale[] = ["it", "en", "es", "fr"];

export const localeLabels: Record<Locale, string> = {
  it: "Italiano",
  en: "English",
  es: "Español",
  fr: "Français",
};

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
  "nav.neighborhoods": string;
  "nav.community": string;
  "nav.calendar": string;
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
  "listings.contact": string;
  "listings.photos": string;
  // Dashboard
  "dashboard.title": string;
  "dashboard.overview": string;
  "dashboard.listings": string;
  "dashboard.messages": string;
  "dashboard.analytics": string;
  "dashboard.payments": string;
  "dashboard.documents": string;
  "dashboard.reviews": string;
  "dashboard.settings": string;
  "dashboard.journey": string;
  "dashboard.groups": string;
  "dashboard.insurance": string;
  "dashboard.disputes": string;
  "dashboard.tours": string;
  "dashboard.pricing": string;
  "dashboard.forYou": string;
  "dashboard.accessibility": string;
  "dashboard.legalCompliance": string;
  "dashboard.tenantScore": string;
  "dashboard.forecasting": string;
  "dashboard.landlordApi": string;
  "dashboard.universitySso": string;
  "dashboard.notificationHub": string;
  "dashboard.compliance": string;
  // Onboarding
  "onboarding.title": string;
  "onboarding.welcome": string;
  "onboarding.step1": string;
  "onboarding.step2": string;
  "onboarding.step3": string;
  "onboarding.complete": string;
  // Neighborhoods
  "neighborhoods.title": string;
  "neighborhoods.quiz": string;
  "neighborhoods.explore": string;
  "neighborhoods.safety": string;
  "neighborhoods.transport": string;
  "neighborhoods.nightlife": string;
  // Community
  "community.title": string;
  "community.feed": string;
  "community.stories": string;
  "community.articles": string;
  "community.share": string;
  // Calendar
  "calendar.title": string;
  "calendar.semester": string;
  "calendar.availability": string;
  "calendar.sync": string;
  // Notifications
  "notifications.title": string;
  "notifications.markRead": string;
  "notifications.markAllRead": string;
  "notifications.preferences": string;
  "notifications.empty": string;
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
  "auth.forgotPassword": string;
  "auth.resetPassword": string;
  "auth.confirmPassword": string;
  "auth.termsAgree": string;
  // Payments
  "payments.title": string;
  "payments.rent": string;
  "payments.depositPayment": string;
  "payments.receipt": string;
  "payments.history": string;
  "payments.pending": string;
  "payments.completed": string;
  "payments.failed": string;
  "payments.refunded": string;
  "payments.amount": string;
  "payments.fee": string;
  // Reviews
  "reviews.title": string;
  "reviews.write": string;
  "reviews.overall": string;
  "reviews.cleanliness": string;
  "reviews.communication": string;
  "reviews.accuracy": string;
  "reviews.value": string;
  "reviews.verifiedLease": string;
  // Messages
  "messages.title": string;
  "messages.send": string;
  "messages.placeholder": string;
  "messages.noConversations": string;
  "messages.translate": string;
  // Admin
  "admin.title": string;
  "admin.users": string;
  "admin.moderation": string;
  "admin.analytics": string;
  "admin.marketplace": string;
  "admin.telemetry": string;
  // Errors
  "error.generic": string;
  "error.notFound": string;
  "error.unauthorized": string;
  "error.validation": string;
  "error.rateLimited": string;
  // Common
  "common.save": string;
  "common.cancel": string;
  "common.submit": string;
  "common.loading": string;
  "common.noResults": string;
  "common.back": string;
  "common.next": string;
  "common.previous": string;
  "common.delete": string;
  "common.edit": string;
  "common.close": string;
  "common.confirm": string;
  "common.search": string;
  "common.filter": string;
  "common.sort": string;
  "common.all": string;
  "common.more": string;
  "common.less": string;
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
    "nav.neighborhoods": "Quartieri",
    "nav.community": "Comunità",
    "nav.calendar": "Calendario",
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
    "listings.contact": "Contatta",
    "listings.photos": "Foto",
    "dashboard.title": "Dashboard",
    "dashboard.overview": "Panoramica",
    "dashboard.listings": "Annunci",
    "dashboard.messages": "Messaggi",
    "dashboard.analytics": "Analytics",
    "dashboard.payments": "Pagamenti",
    "dashboard.documents": "Documenti",
    "dashboard.reviews": "Recensioni",
    "dashboard.settings": "Impostazioni",
    "dashboard.journey": "Percorso",
    "dashboard.groups": "Gruppi",
    "dashboard.insurance": "Assicurazione",
    "dashboard.disputes": "Contestazioni",
    "dashboard.tours": "Visite",
    "dashboard.pricing": "Prezzi",
    "dashboard.forYou": "Per te",
    "dashboard.accessibility": "Accessibilità",
    "dashboard.legalCompliance": "Conformità legale",
    "dashboard.tenantScore": "Punteggio inquilino",
    "dashboard.forecasting": "Previsioni domanda",
    "dashboard.landlordApi": "API proprietario",
    "dashboard.universitySso": "SSO universitario",
    "dashboard.notificationHub": "Centro notifiche",
    "dashboard.compliance": "Documenti",
    "onboarding.title": "Benvenuto su CasaStudente",
    "onboarding.welcome": "Completiamo il tuo profilo",
    "onboarding.step1": "Dati personali",
    "onboarding.step2": "Preferenze alloggio",
    "onboarding.step3": "Verifica università",
    "onboarding.complete": "Profilo completato!",
    "neighborhoods.title": "Scopri i quartieri di Forlì",
    "neighborhoods.quiz": "Quiz quartiere ideale",
    "neighborhoods.explore": "Esplora la zona",
    "neighborhoods.safety": "Sicurezza",
    "neighborhoods.transport": "Trasporti",
    "neighborhoods.nightlife": "Vita notturna",
    "community.title": "Comunità CasaStudente",
    "community.feed": "Feed",
    "community.stories": "Storie",
    "community.articles": "Articoli",
    "community.share": "Condividi",
    "calendar.title": "Calendario semestrale",
    "calendar.semester": "Semestre",
    "calendar.availability": "Disponibilità",
    "calendar.sync": "Sincronizza",
    "notifications.title": "Notifiche",
    "notifications.markRead": "Segna come letto",
    "notifications.markAllRead": "Segna tutto come letto",
    "notifications.preferences": "Preferenze notifiche",
    "notifications.empty": "Nessuna notifica",
    "auth.login": "Accedi a CasaStudente",
    "auth.register": "Crea il tuo account",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.name": "Nome completo",
    "auth.role": "Ruolo",
    "auth.student": "Studente",
    "auth.landlord": "Proprietario",
    "auth.admin": "Amministratore",
    "auth.forgotPassword": "Password dimenticata?",
    "auth.resetPassword": "Reimposta password",
    "auth.confirmPassword": "Conferma password",
    "auth.termsAgree": "Accetto i termini e condizioni",
    "payments.title": "Pagamenti",
    "payments.rent": "Canone",
    "payments.depositPayment": "Deposito cauzionale",
    "payments.receipt": "Ricevuta",
    "payments.history": "Storico pagamenti",
    "payments.pending": "In attesa",
    "payments.completed": "Completato",
    "payments.failed": "Fallito",
    "payments.refunded": "Rimborsato",
    "payments.amount": "Importo",
    "payments.fee": "Commissione piattaforma",
    "reviews.title": "Recensioni",
    "reviews.write": "Scrivi una recensione",
    "reviews.overall": "Valutazione complessiva",
    "reviews.cleanliness": "Pulizia",
    "reviews.communication": "Comunicazione",
    "reviews.accuracy": "Precisione annuncio",
    "reviews.value": "Rapporto qualità/prezzo",
    "reviews.verifiedLease": "Contratto verificato",
    "messages.title": "Messaggi",
    "messages.send": "Invia",
    "messages.placeholder": "Scrivi un messaggio...",
    "messages.noConversations": "Nessuna conversazione",
    "messages.translate": "Traduci",
    "admin.title": "Amministrazione",
    "admin.users": "Utenti",
    "admin.moderation": "Moderazione",
    "admin.analytics": "Analytics",
    "admin.marketplace": "Marketplace",
    "admin.telemetry": "Telemetria",
    "error.generic": "Si è verificato un errore. Riprova.",
    "error.notFound": "Pagina non trovata",
    "error.unauthorized": "Accesso non autorizzato",
    "error.validation": "Dati non validi",
    "error.rateLimited": "Troppi tentativi. Riprova più tardi.",
    "common.save": "Salva",
    "common.cancel": "Annulla",
    "common.submit": "Invia",
    "common.loading": "Caricamento...",
    "common.noResults": "Nessun risultato trovato",
    "common.back": "Indietro",
    "common.next": "Avanti",
    "common.previous": "Precedente",
    "common.delete": "Elimina",
    "common.edit": "Modifica",
    "common.close": "Chiudi",
    "common.confirm": "Conferma",
    "common.search": "Cerca",
    "common.filter": "Filtra",
    "common.sort": "Ordina",
    "common.all": "Tutti",
    "common.more": "Altro",
    "common.less": "Meno",
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
    "nav.neighborhoods": "Neighborhoods",
    "nav.community": "Community",
    "nav.calendar": "Calendar",
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
    "listings.contact": "Contact",
    "listings.photos": "Photos",
    "dashboard.title": "Dashboard",
    "dashboard.overview": "Overview",
    "dashboard.listings": "Listings",
    "dashboard.messages": "Messages",
    "dashboard.analytics": "Analytics",
    "dashboard.payments": "Payments",
    "dashboard.documents": "Documents",
    "dashboard.reviews": "Reviews",
    "dashboard.settings": "Settings",
    "dashboard.journey": "Journey",
    "dashboard.groups": "Groups",
    "dashboard.insurance": "Insurance",
    "dashboard.disputes": "Disputes",
    "dashboard.tours": "Tours",
    "dashboard.pricing": "Pricing",
    "dashboard.forYou": "For you",
    "dashboard.accessibility": "Accessibility",
    "dashboard.legalCompliance": "Legal compliance",
    "dashboard.tenantScore": "Tenant score",
    "dashboard.forecasting": "Demand forecasting",
    "dashboard.landlordApi": "Landlord API",
    "dashboard.universitySso": "University SSO",
    "dashboard.notificationHub": "Notification hub",
    "dashboard.compliance": "Documents",
    "onboarding.title": "Welcome to CasaStudente",
    "onboarding.welcome": "Let's complete your profile",
    "onboarding.step1": "Personal details",
    "onboarding.step2": "Housing preferences",
    "onboarding.step3": "University verification",
    "onboarding.complete": "Profile completed!",
    "neighborhoods.title": "Discover Forlì's neighborhoods",
    "neighborhoods.quiz": "Ideal neighborhood quiz",
    "neighborhoods.explore": "Explore the area",
    "neighborhoods.safety": "Safety",
    "neighborhoods.transport": "Transport",
    "neighborhoods.nightlife": "Nightlife",
    "community.title": "CasaStudente Community",
    "community.feed": "Feed",
    "community.stories": "Stories",
    "community.articles": "Articles",
    "community.share": "Share",
    "calendar.title": "Semester calendar",
    "calendar.semester": "Semester",
    "calendar.availability": "Availability",
    "calendar.sync": "Sync",
    "notifications.title": "Notifications",
    "notifications.markRead": "Mark as read",
    "notifications.markAllRead": "Mark all as read",
    "notifications.preferences": "Notification preferences",
    "notifications.empty": "No notifications",
    "auth.login": "Log in to CasaStudente",
    "auth.register": "Create your account",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.name": "Full name",
    "auth.role": "Role",
    "auth.student": "Student",
    "auth.landlord": "Landlord",
    "auth.admin": "Administrator",
    "auth.forgotPassword": "Forgot password?",
    "auth.resetPassword": "Reset password",
    "auth.confirmPassword": "Confirm password",
    "auth.termsAgree": "I agree to the terms and conditions",
    "payments.title": "Payments",
    "payments.rent": "Rent",
    "payments.depositPayment": "Security deposit",
    "payments.receipt": "Receipt",
    "payments.history": "Payment history",
    "payments.pending": "Pending",
    "payments.completed": "Completed",
    "payments.failed": "Failed",
    "payments.refunded": "Refunded",
    "payments.amount": "Amount",
    "payments.fee": "Platform fee",
    "reviews.title": "Reviews",
    "reviews.write": "Write a review",
    "reviews.overall": "Overall rating",
    "reviews.cleanliness": "Cleanliness",
    "reviews.communication": "Communication",
    "reviews.accuracy": "Listing accuracy",
    "reviews.value": "Value for money",
    "reviews.verifiedLease": "Verified lease",
    "messages.title": "Messages",
    "messages.send": "Send",
    "messages.placeholder": "Write a message...",
    "messages.noConversations": "No conversations",
    "messages.translate": "Translate",
    "admin.title": "Administration",
    "admin.users": "Users",
    "admin.moderation": "Moderation",
    "admin.analytics": "Analytics",
    "admin.marketplace": "Marketplace",
    "admin.telemetry": "Telemetry",
    "error.generic": "An error occurred. Please try again.",
    "error.notFound": "Page not found",
    "error.unauthorized": "Unauthorized access",
    "error.validation": "Invalid data",
    "error.rateLimited": "Too many attempts. Please try again later.",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.submit": "Submit",
    "common.loading": "Loading...",
    "common.noResults": "No results found",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.close": "Close",
    "common.confirm": "Confirm",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.all": "All",
    "common.more": "More",
    "common.less": "Less",
  },
  es: {
    "nav.home": "Inicio",
    "nav.listings": "Anuncios",
    "nav.roommates": "Compañeros",
    "nav.dashboard": "Panel",
    "nav.login": "Entrar",
    "nav.register": "Registrarse",
    "nav.logout": "Salir",
    "nav.notifications": "Notificaciones",
    "nav.verify": "Verificar universidad",
    "nav.publishListing": "Publicar anuncio",
    "nav.neighborhoods": "Barrios",
    "nav.community": "Comunidad",
    "nav.calendar": "Calendario",
    "home.title": "Encuentra tu alojamiento en Forlì",
    "home.subtitle": "La plataforma que conecta estudiantes y propietarios con anuncios fiables, herramientas digitales y una experiencia pensada para quienes llegan a la ciudad para estudiar.",
    "home.cta": "Explorar anuncios",
    "home.secondary": "Ir al panel",
    "home.verifiedListings": "Anuncios verificados",
    "home.coveredZones": "Zonas cubiertas",
    "home.languageSupport": "Soporte de idiomas",
    "features.title": "Todo lo que necesitas para alquilar bien",
    "features.subtitle": "CasaStudente simplifica la búsqueda de vivienda en Forlì con funciones para estudiantes y propietarios.",
    "features.verified.title": "Alojamientos verificados",
    "features.verified.desc": "Anuncios revisados con información clara sobre ubicación, servicios y disponibilidad.",
    "features.tours.title": "Visitas virtuales",
    "features.tours.desc": "Vistas previas fotográficas y visitas digitales para evaluar el alojamiento antes de llegar.",
    "features.pricing.title": "Precios transparentes",
    "features.pricing.desc": "Alquiler, depósito y gastos mostrados desde el principio para evitar sorpresas.",
    "features.roommates.title": "Búsqueda de compañeros",
    "features.roommates.desc": "Perfiles compatibles para compartir apartamentos con estudiantes afines en presupuesto y estilo de vida.",
    "features.multilingual.title": "Multilingüe",
    "features.multilingual.desc": "Interfaz y anuncios diseñados también para estudiantes Erasmus e internacionales.",
    "features.payments.title": "Pagos seguros",
    "features.payments.desc": "Flujos guiados para depósitos y alquileres con recibos y confirmaciones centralizadas.",
    "listings.title": "Anuncios seleccionados para estudiantes universitarios",
    "listings.subtitle": "Filtra por zona, rango de precios y tipo de alojamiento.",
    "listings.search": "Buscar vivienda en Forlì",
    "listings.filters": "Filtros",
    "listings.results": "resultados encontrados",
    "listings.viewDetail": "Ver detalles",
    "listings.perMonth": "al mes",
    "listings.verified": "Verificado",
    "listings.available": "Disponible",
    "listings.negotiating": "En negociación",
    "listings.allTypes": "Todos los tipos",
    "listings.zoneOrStreet": "Zona o calle",
    "listings.minPrice": "Precio mín",
    "listings.maxPrice": "Precio máx",
    "listings.verifiedOnly": "Solo anuncios verificados",
    "listings.virtualTourOnly": "Con visita virtual",
    "listings.utilitiesIncluded": "Servicios incluidos",
    "listings.deposit": "Depósito",
    "listings.availableFrom": "Disponible desde",
    "listings.contact": "Contactar",
    "listings.photos": "Fotos",
    "dashboard.title": "Panel",
    "dashboard.overview": "Resumen",
    "dashboard.listings": "Anuncios",
    "dashboard.messages": "Mensajes",
    "dashboard.analytics": "Analítica",
    "dashboard.payments": "Pagos",
    "dashboard.documents": "Documentos",
    "dashboard.reviews": "Reseñas",
    "dashboard.settings": "Configuración",
    "dashboard.journey": "Recorrido",
    "dashboard.groups": "Grupos",
    "dashboard.insurance": "Seguro",
    "dashboard.disputes": "Disputas",
    "dashboard.tours": "Visitas",
    "dashboard.pricing": "Precios",
    "dashboard.forYou": "Para ti",
    "dashboard.accessibility": "Accesibilidad",
    "dashboard.legalCompliance": "Cumplimiento legal",
    "dashboard.tenantScore": "Puntuación inquilino",
    "dashboard.forecasting": "Previsión demanda",
    "dashboard.landlordApi": "API propietario",
    "dashboard.universitySso": "SSO universitario",
    "dashboard.notificationHub": "Centro de notificaciones",
    "dashboard.compliance": "Documentos",
    "onboarding.title": "Bienvenido a CasaStudente",
    "onboarding.welcome": "Completemos tu perfil",
    "onboarding.step1": "Datos personales",
    "onboarding.step2": "Preferencias de alojamiento",
    "onboarding.step3": "Verificación universitaria",
    "onboarding.complete": "¡Perfil completado!",
    "neighborhoods.title": "Descubre los barrios de Forlì",
    "neighborhoods.quiz": "Quiz del barrio ideal",
    "neighborhoods.explore": "Explora la zona",
    "neighborhoods.safety": "Seguridad",
    "neighborhoods.transport": "Transporte",
    "neighborhoods.nightlife": "Vida nocturna",
    "community.title": "Comunidad CasaStudente",
    "community.feed": "Feed",
    "community.stories": "Historias",
    "community.articles": "Artículos",
    "community.share": "Compartir",
    "calendar.title": "Calendario semestral",
    "calendar.semester": "Semestre",
    "calendar.availability": "Disponibilidad",
    "calendar.sync": "Sincronizar",
    "notifications.title": "Notificaciones",
    "notifications.markRead": "Marcar como leído",
    "notifications.markAllRead": "Marcar todo como leído",
    "notifications.preferences": "Preferencias de notificaciones",
    "notifications.empty": "Sin notificaciones",
    "auth.login": "Entrar en CasaStudente",
    "auth.register": "Crea tu cuenta",
    "auth.email": "Email",
    "auth.password": "Contraseña",
    "auth.name": "Nombre completo",
    "auth.role": "Rol",
    "auth.student": "Estudiante",
    "auth.landlord": "Propietario",
    "auth.admin": "Administrador",
    "auth.forgotPassword": "¿Olvidaste tu contraseña?",
    "auth.resetPassword": "Restablecer contraseña",
    "auth.confirmPassword": "Confirmar contraseña",
    "auth.termsAgree": "Acepto los términos y condiciones",
    "payments.title": "Pagos",
    "payments.rent": "Alquiler",
    "payments.depositPayment": "Depósito de seguridad",
    "payments.receipt": "Recibo",
    "payments.history": "Historial de pagos",
    "payments.pending": "Pendiente",
    "payments.completed": "Completado",
    "payments.failed": "Fallido",
    "payments.refunded": "Reembolsado",
    "payments.amount": "Importe",
    "payments.fee": "Comisión plataforma",
    "reviews.title": "Reseñas",
    "reviews.write": "Escribir una reseña",
    "reviews.overall": "Valoración general",
    "reviews.cleanliness": "Limpieza",
    "reviews.communication": "Comunicación",
    "reviews.accuracy": "Precisión del anuncio",
    "reviews.value": "Relación calidad/precio",
    "reviews.verifiedLease": "Contrato verificado",
    "messages.title": "Mensajes",
    "messages.send": "Enviar",
    "messages.placeholder": "Escribe un mensaje...",
    "messages.noConversations": "Sin conversaciones",
    "messages.translate": "Traducir",
    "admin.title": "Administración",
    "admin.users": "Usuarios",
    "admin.moderation": "Moderación",
    "admin.analytics": "Analítica",
    "admin.marketplace": "Marketplace",
    "admin.telemetry": "Telemetría",
    "error.generic": "Se produjo un error. Inténtalo de nuevo.",
    "error.notFound": "Página no encontrada",
    "error.unauthorized": "Acceso no autorizado",
    "error.validation": "Datos no válidos",
    "error.rateLimited": "Demasiados intentos. Inténtalo más tarde.",
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.submit": "Enviar",
    "common.loading": "Cargando...",
    "common.noResults": "Sin resultados",
    "common.back": "Atrás",
    "common.next": "Siguiente",
    "common.previous": "Anterior",
    "common.delete": "Eliminar",
    "common.edit": "Editar",
    "common.close": "Cerrar",
    "common.confirm": "Confirmar",
    "common.search": "Buscar",
    "common.filter": "Filtrar",
    "common.sort": "Ordenar",
    "common.all": "Todos",
    "common.more": "Más",
    "common.less": "Menos",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.listings": "Annonces",
    "nav.roommates": "Colocataires",
    "nav.dashboard": "Tableau de bord",
    "nav.login": "Se connecter",
    "nav.register": "S'inscrire",
    "nav.logout": "Se déconnecter",
    "nav.notifications": "Notifications",
    "nav.verify": "Vérifier l'université",
    "nav.publishListing": "Publier une annonce",
    "nav.neighborhoods": "Quartiers",
    "nav.community": "Communauté",
    "nav.calendar": "Calendrier",
    "home.title": "Trouvez votre logement à Forlì",
    "home.subtitle": "La plateforme qui connecte étudiants et propriétaires avec des annonces fiables, des outils numériques et une expérience pensée pour ceux qui arrivent en ville pour étudier.",
    "home.cta": "Explorer les annonces",
    "home.secondary": "Aller au tableau de bord",
    "home.verifiedListings": "Annonces vérifiées",
    "home.coveredZones": "Zones couvertes",
    "home.languageSupport": "Support linguistique",
    "features.title": "Tout ce dont vous avez besoin pour bien louer",
    "features.subtitle": "CasaStudente simplifie la recherche de logement à Forlì avec des fonctionnalités pour les étudiants et les propriétaires.",
    "features.verified.title": "Logements vérifiés",
    "features.verified.desc": "Annonces vérifiées avec des informations claires sur l'emplacement, les équipements et la disponibilité.",
    "features.tours.title": "Visites virtuelles",
    "features.tours.desc": "Aperçus photographiques et visites numériques pour évaluer le logement avant d'arriver.",
    "features.pricing.title": "Prix transparents",
    "features.pricing.desc": "Loyer, dépôt et charges affichés dès le départ pour éviter les surprises.",
    "features.roommates.title": "Recherche de colocataires",
    "features.roommates.desc": "Profils compatibles pour partager des appartements avec des étudiants ayant un budget et un style de vie similaires.",
    "features.multilingual.title": "Multilingue",
    "features.multilingual.desc": "Interface et annonces pensées aussi pour les étudiants Erasmus et internationaux.",
    "features.payments.title": "Paiements sécurisés",
    "features.payments.desc": "Flux guidés pour les dépôts et loyers avec reçus et confirmations centralisés.",
    "listings.title": "Annonces sélectionnées pour les étudiants universitaires",
    "listings.subtitle": "Filtrez par zone, gamme de prix et type de logement.",
    "listings.search": "Chercher un logement à Forlì",
    "listings.filters": "Filtres",
    "listings.results": "résultats trouvés",
    "listings.viewDetail": "Voir les détails",
    "listings.perMonth": "par mois",
    "listings.verified": "Vérifié",
    "listings.available": "Disponible",
    "listings.negotiating": "En négociation",
    "listings.allTypes": "Tous les types",
    "listings.zoneOrStreet": "Zone ou rue",
    "listings.minPrice": "Prix min",
    "listings.maxPrice": "Prix max",
    "listings.verifiedOnly": "Annonces vérifiées uniquement",
    "listings.virtualTourOnly": "Avec visite virtuelle",
    "listings.utilitiesIncluded": "Charges incluses",
    "listings.deposit": "Dépôt",
    "listings.availableFrom": "Disponible à partir de",
    "listings.contact": "Contacter",
    "listings.photos": "Photos",
    "dashboard.title": "Tableau de bord",
    "dashboard.overview": "Aperçu",
    "dashboard.listings": "Annonces",
    "dashboard.messages": "Messages",
    "dashboard.analytics": "Analytique",
    "dashboard.payments": "Paiements",
    "dashboard.documents": "Documents",
    "dashboard.reviews": "Avis",
    "dashboard.settings": "Paramètres",
    "dashboard.journey": "Parcours",
    "dashboard.groups": "Groupes",
    "dashboard.insurance": "Assurance",
    "dashboard.disputes": "Litiges",
    "dashboard.tours": "Visites",
    "dashboard.pricing": "Tarifs",
    "dashboard.forYou": "Pour vous",
    "dashboard.accessibility": "Accessibilité",
    "dashboard.legalCompliance": "Conformité juridique",
    "dashboard.tenantScore": "Score locataire",
    "dashboard.forecasting": "Prévision de demande",
    "dashboard.landlordApi": "API propriétaire",
    "dashboard.universitySso": "SSO universitaire",
    "dashboard.notificationHub": "Centre de notifications",
    "dashboard.compliance": "Documents",
    "onboarding.title": "Bienvenue sur CasaStudente",
    "onboarding.welcome": "Complétons votre profil",
    "onboarding.step1": "Données personnelles",
    "onboarding.step2": "Préférences de logement",
    "onboarding.step3": "Vérification universitaire",
    "onboarding.complete": "Profil complété !",
    "neighborhoods.title": "Découvrez les quartiers de Forlì",
    "neighborhoods.quiz": "Quiz du quartier idéal",
    "neighborhoods.explore": "Explorer le quartier",
    "neighborhoods.safety": "Sécurité",
    "neighborhoods.transport": "Transports",
    "neighborhoods.nightlife": "Vie nocturne",
    "community.title": "Communauté CasaStudente",
    "community.feed": "Fil",
    "community.stories": "Histoires",
    "community.articles": "Articles",
    "community.share": "Partager",
    "calendar.title": "Calendrier semestriel",
    "calendar.semester": "Semestre",
    "calendar.availability": "Disponibilité",
    "calendar.sync": "Synchroniser",
    "notifications.title": "Notifications",
    "notifications.markRead": "Marquer comme lu",
    "notifications.markAllRead": "Tout marquer comme lu",
    "notifications.preferences": "Préférences de notifications",
    "notifications.empty": "Aucune notification",
    "auth.login": "Se connecter à CasaStudente",
    "auth.register": "Créer votre compte",
    "auth.email": "Email",
    "auth.password": "Mot de passe",
    "auth.name": "Nom complet",
    "auth.role": "Rôle",
    "auth.student": "Étudiant",
    "auth.landlord": "Propriétaire",
    "auth.admin": "Administrateur",
    "auth.forgotPassword": "Mot de passe oublié ?",
    "auth.resetPassword": "Réinitialiser le mot de passe",
    "auth.confirmPassword": "Confirmer le mot de passe",
    "auth.termsAgree": "J'accepte les conditions générales",
    "payments.title": "Paiements",
    "payments.rent": "Loyer",
    "payments.depositPayment": "Dépôt de garantie",
    "payments.receipt": "Reçu",
    "payments.history": "Historique des paiements",
    "payments.pending": "En attente",
    "payments.completed": "Terminé",
    "payments.failed": "Échoué",
    "payments.refunded": "Remboursé",
    "payments.amount": "Montant",
    "payments.fee": "Commission plateforme",
    "reviews.title": "Avis",
    "reviews.write": "Écrire un avis",
    "reviews.overall": "Note globale",
    "reviews.cleanliness": "Propreté",
    "reviews.communication": "Communication",
    "reviews.accuracy": "Précision de l'annonce",
    "reviews.value": "Rapport qualité/prix",
    "reviews.verifiedLease": "Bail vérifié",
    "messages.title": "Messages",
    "messages.send": "Envoyer",
    "messages.placeholder": "Écrire un message...",
    "messages.noConversations": "Aucune conversation",
    "messages.translate": "Traduire",
    "admin.title": "Administration",
    "admin.users": "Utilisateurs",
    "admin.moderation": "Modération",
    "admin.analytics": "Analytique",
    "admin.marketplace": "Marketplace",
    "admin.telemetry": "Télémétrie",
    "error.generic": "Une erreur s'est produite. Veuillez réessayer.",
    "error.notFound": "Page non trouvée",
    "error.unauthorized": "Accès non autorisé",
    "error.validation": "Données invalides",
    "error.rateLimited": "Trop de tentatives. Réessayez plus tard.",
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.submit": "Envoyer",
    "common.loading": "Chargement...",
    "common.noResults": "Aucun résultat trouvé",
    "common.back": "Retour",
    "common.next": "Suivant",
    "common.previous": "Précédent",
    "common.delete": "Supprimer",
    "common.edit": "Modifier",
    "common.close": "Fermer",
    "common.confirm": "Confirmer",
    "common.search": "Rechercher",
    "common.filter": "Filtrer",
    "common.sort": "Trier",
    "common.all": "Tous",
    "common.more": "Plus",
    "common.less": "Moins",
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

/** Detect locale from browser Accept-Language header */
export function getLocaleFromHeader(acceptLanguage?: string): Locale {
  if (!acceptLanguage) return defaultLocale;

  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [code, quality] = lang.trim().split(";q=");
      return { code: code.split("-")[0].toLowerCase(), quality: quality ? parseFloat(quality) : 1 };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { code } of languages) {
    if (supportedLocales.includes(code as Locale)) {
      return code as Locale;
    }
  }

  return defaultLocale;
}

/** Format currency for the given locale */
export function formatCurrency(amount: number, locale: Locale = defaultLocale): string {
  const localeMap: Record<Locale, string> = { it: "it-IT", en: "en-GB", es: "es-ES", fr: "fr-FR" };
  return new Intl.NumberFormat(localeMap[locale], { style: "currency", currency: "EUR" }).format(amount);
}

/** Format date for the given locale */
export function formatDate(date: Date | string, locale: Locale = defaultLocale): string {
  const localeMap: Record<Locale, string> = { it: "it-IT", en: "en-GB", es: "es-ES", fr: "fr-FR" };
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(localeMap[locale], { dateStyle: "medium" }).format(d);
}
