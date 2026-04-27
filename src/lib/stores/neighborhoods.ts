import { InMemoryStore } from "@/lib/db";

// ============ NEIGHBORHOOD INTELLIGENCE ============

export interface Neighborhood {
  id: string;
  campusId: string;
  zone: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  safetyRating: number;
  noiseLevel: "quiet" | "moderate" | "lively";
  studentDensity: "low" | "medium" | "high";
  avgRent: number;
  listingCount: number;
  nightlifeIndex: number;
  amenities: string[];
  busRoutes: { line: string; frequency: string; destination: string }[];
  photos: string[];
}

export interface NeighborhoodTip {
  id: string;
  neighborhoodId: string;
  userId: string;
  userName: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  verified: boolean;
}

export const neighborhoodStore = new InMemoryStore<Neighborhood>();
export const neighborhoodTipStore = new InMemoryStore<NeighborhoodTip>();

neighborhoodStore.seed([
  {
    id: "neighborhood-centro",
    campusId: "campus-forli",
    zone: "Centro",
    name: "Centro Storico",
    nameEn: "Historic Center",
    description: "Il cuore di Forlì con Piazza Saffi, biblioteche, locali e facoltà universitarie. Zona vivace con tutti i servizi a portata di mano.",
    descriptionEn: "The heart of Forlì with Piazza Saffi, libraries, bars, and university faculties. A lively area with all services within walking distance.",
    safetyRating: 4,
    noiseLevel: "lively",
    studentDensity: "high",
    avgRent: 480,
    listingCount: 3,
    nightlifeIndex: 5,
    amenities: ["Biblioteca Comunale", "Piazza Saffi", "Cinema", "Coworking", "Farmacia", "Supermercato"],
    busRoutes: [
      { line: "1", frequency: "Ogni 15 min", destination: "Campus ↔ Stazione" },
      { line: "2", frequency: "Ogni 20 min", destination: "Cava ↔ Centro" },
    ],
    photos: ["Piazza Saffi", "Corso della Repubblica", "Via Giorgio Regnoli"],
  },
  {
    id: "neighborhood-campus",
    campusId: "campus-forli",
    zone: "Campus",
    name: "Zona Campus",
    nameEn: "Campus Area",
    description: "L'area universitaria per eccellenza. Quartiere residenziale tranquillo con buoni servizi e forte comunità studentesca.",
    descriptionEn: "The quintessential university area. A quiet residential neighborhood with good services and a strong student community.",
    safetyRating: 5,
    noiseLevel: "moderate",
    studentDensity: "high",
    avgRent: 380,
    listingCount: 1,
    nightlifeIndex: 2,
    amenities: ["Campus Universitario", "Mensa UniBo", "Campo sportivo", "Fermata bus", "Supermercato"],
    busRoutes: [
      { line: "1", frequency: "Ogni 15 min", destination: "Campus ↔ Stazione" },
      { line: "2", frequency: "Ogni 20 min", destination: "Campus ↔ Centro" },
    ],
    photos: ["Campus Universitario", "Biblioteca campus", "Area verde"],
  },
  {
    id: "neighborhood-stazione",
    campusId: "campus-forli",
    zone: "Stazione",
    name: "Zona Stazione",
    nameEn: "Station Area",
    description: "Zona ben collegata grazie alla stazione ferroviaria. Ideale per chi viaggia spesso verso Bologna o la Riviera.",
    descriptionEn: "Well-connected area thanks to the train station. Ideal for those who travel frequently to Bologna or the coast.",
    safetyRating: 3,
    noiseLevel: "moderate",
    studentDensity: "medium",
    avgRent: 420,
    listingCount: 1,
    nightlifeIndex: 3,
    amenities: ["Stazione FS", "Viale Roma commerciale", "Parco della Resistenza", "Farmacia"],
    busRoutes: [
      { line: "1", frequency: "Ogni 15 min", destination: "Stazione ↔ Campus" },
      { line: "3", frequency: "Ogni 30 min", destination: "Stazione ↔ San Benedetto" },
    ],
    photos: ["Stazione ferroviaria", "Viale Roma"],
  },
  {
    id: "neighborhood-san-benedetto",
    campusId: "campus-forli",
    zone: "San Benedetto",
    name: "San Benedetto",
    nameEn: "San Benedetto",
    description: "Quartiere residenziale tranquillo, ideale per chi cerca silenzio e ordine. Parchi e buoni collegamenti in bicicletta.",
    descriptionEn: "A quiet residential neighborhood, ideal for those seeking peace and order. Parks and good bike connections.",
    safetyRating: 5,
    noiseLevel: "quiet",
    studentDensity: "low",
    avgRent: 350,
    listingCount: 1,
    nightlifeIndex: 1,
    amenities: ["Parco Urbano", "Scuole", "Farmacia", "Minimarket", "Pista ciclabile"],
    busRoutes: [
      { line: "3", frequency: "Ogni 30 min", destination: "San Benedetto ↔ Stazione" },
    ],
    photos: ["Parco urbano", "Area residenziale"],
  },
  {
    id: "neighborhood-cava",
    campusId: "campus-forli",
    zone: "Cava",
    name: "Cava",
    nameEn: "Cava",
    description: "Zona residenziale a sud del centro, più economica e spaziosa. Buona per appartamenti grandi a canoni contenuti.",
    descriptionEn: "Residential area south of the center, more affordable and spacious. Good for larger apartments at lower rents.",
    safetyRating: 4,
    noiseLevel: "quiet",
    studentDensity: "medium",
    avgRent: 340,
    listingCount: 1,
    nightlifeIndex: 1,
    amenities: ["Supermercato Coop", "Palestra", "Percorso ciclabile", "Farmacia"],
    busRoutes: [
      { line: "2", frequency: "Ogni 20 min", destination: "Cava ↔ Centro" },
    ],
    photos: ["Via Ravegnana", "Area commerciale"],
  },
  {
    id: "neighborhood-ronco",
    campusId: "campus-forli",
    zone: "Ronco",
    name: "Ronco",
    nameEn: "Ronco",
    description: "Frazione a est di Forlì, più distante dal centro ma molto economica. Adatta a studenti motorizzati.",
    descriptionEn: "A hamlet east of Forlì, farther from the center but very affordable. Suitable for students with transport.",
    safetyRating: 4,
    noiseLevel: "quiet",
    studentDensity: "low",
    avgRent: 300,
    listingCount: 0,
    nightlifeIndex: 1,
    amenities: ["Bar", "Minimarket", "Chiesa", "Fermata bus"],
    busRoutes: [
      { line: "92", frequency: "Ogni 45 min", destination: "Ronco ↔ Centro Forlì" },
    ],
    photos: ["Piazza Ronco"],
  },
  {
    id: "neighborhood-ospedaletto",
    campusId: "campus-forli",
    zone: "Ospedaletto",
    name: "Ospedaletto",
    nameEn: "Ospedaletto",
    description: "Zona nord vicino all'ospedale Morgagni-Pierantoni. Comoda per studenti di scienze della salute.",
    descriptionEn: "Northern area near Morgagni-Pierantoni hospital. Convenient for health science students.",
    safetyRating: 4,
    noiseLevel: "quiet",
    studentDensity: "low",
    avgRent: 320,
    listingCount: 0,
    nightlifeIndex: 1,
    amenities: ["Ospedale Morgagni-Pierantoni", "Farmacia", "Supermercato", "Parco"],
    busRoutes: [
      { line: "4", frequency: "Ogni 30 min", destination: "Ospedaletto ↔ Centro" },
    ],
    photos: ["Ospedale", "Area residenziale"],
  },
]);

neighborhoodTipStore.seed([
  {
    id: "tip-1",
    neighborhoodId: "neighborhood-centro",
    userId: "user-student-1",
    userName: "Martina L.",
    content: "Piazza Saffi il sabato mattina ha un mercato fantastico! Perfetto per fare la spesa con prodotti locali a buon prezzo.",
    upvotes: 12,
    downvotes: 0,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    verified: true,
  },
  {
    id: "tip-2",
    neighborhoodId: "neighborhood-campus",
    userId: "user-student-2",
    userName: "Luca B.",
    content: "La mensa universitaria è aperta anche a cena e costa circa €5 per un pasto completo.",
    upvotes: 8,
    downvotes: 1,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    verified: true,
  },
  {
    id: "tip-3",
    neighborhoodId: "neighborhood-stazione",
    userId: "user-student-3",
    userName: "Anna P.",
    content: "I treni per Bologna partono ogni 30 minuti e costano circa €7. Comodissimo per chi ha lezioni in entrambe le sedi.",
    upvotes: 15,
    downvotes: 0,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    verified: true,
  },
]);

// ============ NEIGHBORHOOD QUIZ ============

export interface QuizQuestion {
  id: string;
  question: string;
  questionEn: string;
  options: { value: string; label: string; labelEn: string }[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "Qual è il tuo budget mensile per l'affitto?",
    questionEn: "What is your monthly rent budget?",
    options: [
      { value: "low", label: "Sotto €350", labelEn: "Under €350" },
      { value: "medium", label: "€350–€500", labelEn: "€350–€500" },
      { value: "high", label: "Oltre €500", labelEn: "Over €500" },
    ],
  },
  {
    id: "q2",
    question: "Quanto è importante la vita notturna per te?",
    questionEn: "How important is nightlife for you?",
    options: [
      { value: "none", label: "Per niente", labelEn: "Not at all" },
      { value: "some", label: "Un po'", labelEn: "Somewhat" },
      { value: "very", label: "Molto importante", labelEn: "Very important" },
    ],
  },
  {
    id: "q3",
    question: "Quanto tempo di spostamento accetti per il campus?",
    questionEn: "How much commute time to campus is acceptable?",
    options: [
      { value: "short", label: "Massimo 10 min a piedi", labelEn: "Max 10 min walk" },
      { value: "medium", label: "Fino a 15 min in bici", labelEn: "Up to 15 min by bike" },
      { value: "long", label: "Anche 20+ min con bus", labelEn: "Even 20+ min by bus" },
    ],
  },
  {
    id: "q4",
    question: "Hai bisogno di negozi e servizi sotto casa?",
    questionEn: "Do you need shops and services nearby?",
    options: [
      { value: "essential", label: "Essenziale", labelEn: "Essential" },
      { value: "nice", label: "Preferibile", labelEn: "Preferred" },
      { value: "no", label: "Non necessario", labelEn: "Not necessary" },
    ],
  },
  {
    id: "q5",
    question: "Preferisci un ambiente tranquillo per studiare?",
    questionEn: "Do you prefer a quiet environment for studying?",
    options: [
      { value: "very", label: "Silenzio assoluto", labelEn: "Absolute quiet" },
      { value: "moderate", label: "Moderato va bene", labelEn: "Moderate is fine" },
      { value: "no", label: "Non mi importa", labelEn: "I don't mind" },
    ],
  },
];

export function calculateQuizResults(
  answers: Record<string, string>,
  neighborhoods: Neighborhood[]
): { neighborhood: Neighborhood; score: number }[] {
  return neighborhoods.map((n) => {
    let score = 0;
    if (answers.q1 === "low" && n.avgRent <= 350) score += 30;
    else if (answers.q1 === "medium" && n.avgRent > 350 && n.avgRent <= 500) score += 30;
    else if (answers.q1 === "high" && n.avgRent > 500) score += 30;
    else score += 10;
    if (answers.q2 === "very" && n.nightlifeIndex >= 4) score += 20;
    else if (answers.q2 === "some" && n.nightlifeIndex >= 2) score += 20;
    else if (answers.q2 === "none" && n.nightlifeIndex <= 2) score += 20;
    else score += 5;
    if (answers.q3 === "short" && ["Campus", "Centro"].includes(n.zone)) score += 20;
    else if (answers.q3 === "medium" && n.studentDensity !== "low") score += 20;
    else if (answers.q3 === "long") score += 15;
    else score += 5;
    if (answers.q4 === "essential" && n.amenities.length >= 5) score += 15;
    else if (answers.q4 === "nice" && n.amenities.length >= 3) score += 15;
    else if (answers.q4 === "no") score += 10;
    else score += 5;
    if (answers.q5 === "very" && n.noiseLevel === "quiet") score += 15;
    else if (answers.q5 === "moderate" && n.noiseLevel !== "lively") score += 15;
    else if (answers.q5 === "no") score += 10;
    else score += 5;
    return { neighborhood: n, score };
  }).sort((a, b) => b.score - a.score);
}
