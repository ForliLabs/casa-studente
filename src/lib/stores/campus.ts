import { InMemoryStore } from "@/lib/db";

// ============ MULTI-CAMPUS FRAMEWORK ============

export interface Campus {
  id: string;
  universityName: string;
  campusName: string;
  city: string;
  coordinates: { lat: number; lng: number };
  description: string;
  descriptionEn: string;
  studentCount: number;
  active: boolean;
}

export const campusStore = new InMemoryStore<Campus>();

campusStore.seed([
  {
    id: "campus-forli",
    universityName: "Università di Bologna",
    campusName: "Campus di Forlì",
    city: "Forlì",
    coordinates: { lat: 44.2226, lng: 12.0407 },
    description: "Sede di Scienze Politiche, Lingue (SSLMIT), Ingegneria e Economia. Circa 4.700 studenti fuorisede.",
    descriptionEn: "Home to Political Sciences, Languages (SSLMIT), Engineering, and Economics. ~4,700 non-resident students.",
    studentCount: 4700,
    active: true,
  },
  {
    id: "campus-cesena",
    universityName: "Università di Bologna",
    campusName: "Campus di Cesena",
    city: "Cesena",
    coordinates: { lat: 44.1396, lng: 12.2464 },
    description: "Sede di Informatica, Psicologia, Architettura e Scienze dell'Educazione.",
    descriptionEn: "Home to Computer Science, Psychology, Architecture, and Education Sciences.",
    studentCount: 2800,
    active: true,
  },
  {
    id: "campus-ravenna",
    universityName: "Università di Bologna",
    campusName: "Campus di Ravenna",
    city: "Ravenna",
    coordinates: { lat: 44.4184, lng: 12.2035 },
    description: "Sede di Beni Culturali, Giurisprudenza e Scienze Ambientali.",
    descriptionEn: "Home to Cultural Heritage, Law, and Environmental Sciences.",
    studentCount: 1500,
    active: true,
  },
]);
