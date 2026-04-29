import { InMemoryStore } from "@/lib/db";

// ============ VIRTUAL TOUR SYSTEM ============

export type TourType = "in_person" | "virtual" | "async_360";
export type TourStatus = "requested" | "confirmed" | "completed" | "cancelled" | "no_show";

export interface TourBooking {
  id: string;
  listingId: string;
  listingTitle: string;
  studentId: string;
  studentName: string;
  landlordId: string;
  landlordName: string;
  type: TourType;
  status: TourStatus;
  requestedDate: string;
  requestedTime: string;
  confirmedDate?: string;
  confirmedTime?: string;
  notes?: string;
  rating?: number;
  feedback?: string;
  journeyId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TourAvailability {
  id: string;
  landlordId: string;
  dayOfWeek: number; // 0=Sunday, 6=Saturday
  startTime: string;
  endTime: string;
  tourTypes: TourType[];
}

export interface VirtualTour360 {
  id: string;
  listingId: string;
  rooms: TourRoom[];
  totalViews: number;
  avgCompletionRate: number;
  createdAt: string;
}

export interface TourRoom {
  id: string;
  name: string;
  nameEn: string;
  photoUrl: string;
  annotations: string[];
  order: number;
}

export const tourBookingStore = new InMemoryStore<TourBooking>();
export const tourAvailabilityStore = new InMemoryStore<TourAvailability>();
export const virtualTour360Store = new InMemoryStore<VirtualTour360>();

// Seed tour bookings
tourBookingStore.seed([
  {
    id: "tour-1",
    listingId: "via-colombo-21-singola",
    listingTitle: "Via Cristoforo Colombo 21",
    studentId: "user-student-1",
    studentName: "Martina López",
    landlordId: "user-landlord-1",
    landlordName: "Elena Rossi",
    type: "virtual",
    status: "completed",
    requestedDate: "2026-04-15",
    requestedTime: "17:30",
    confirmedDate: "2026-04-15",
    confirmedTime: "17:30",
    rating: 5,
    feedback: "Tour molto utile, la proprietaria ha mostrato ogni stanza con attenzione.",
    journeyId: "journey-1",
    createdAt: new Date(Date.now() - 80 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 80 * 86400000).toISOString(),
  },
  {
    id: "tour-2",
    listingId: "viale-roma-48-bilocale",
    listingTitle: "Viale Roma 48",
    studentId: "user-student-2",
    studentName: "Luca Bianchi",
    landlordId: "user-landlord-2",
    landlordName: "Marco Guidi",
    type: "in_person",
    status: "confirmed",
    requestedDate: "2026-07-18",
    requestedTime: "10:00",
    confirmedDate: "2026-07-18",
    confirmedTime: "10:00",
    notes: "Citofonare Guidi al secondo piano",
    journeyId: "journey-2",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
]);

// Seed availability windows
tourAvailabilityStore.seed([
  { id: "avail-1", landlordId: "user-landlord-1", dayOfWeek: 1, startTime: "15:00", endTime: "19:00", tourTypes: ["virtual", "in_person"] },
  { id: "avail-2", landlordId: "user-landlord-1", dayOfWeek: 3, startTime: "15:00", endTime: "19:00", tourTypes: ["virtual", "in_person"] },
  { id: "avail-3", landlordId: "user-landlord-1", dayOfWeek: 5, startTime: "10:00", endTime: "13:00", tourTypes: ["virtual"] },
  { id: "avail-4", landlordId: "user-landlord-2", dayOfWeek: 2, startTime: "09:00", endTime: "12:00", tourTypes: ["in_person"] },
  { id: "avail-5", landlordId: "user-landlord-2", dayOfWeek: 4, startTime: "14:00", endTime: "18:00", tourTypes: ["virtual", "in_person"] },
]);

// Seed 360° tours
virtualTour360Store.seed([
  {
    id: "tour360-1",
    listingId: "via-colombo-21-singola",
    rooms: [
      { id: "room-1", name: "Ingresso", nameEn: "Entrance", photoUrl: "/photos/entrance.jpg", annotations: ["Porta blindata", "Armadio ingresso"], order: 1 },
      { id: "room-2", name: "Camera", nameEn: "Bedroom", photoUrl: "/photos/bedroom.jpg", annotations: ["Scrivania ampia", "Letto singolo", "Vista cortile"], order: 2 },
      { id: "room-3", name: "Cucina", nameEn: "Kitchen", photoUrl: "/photos/kitchen.jpg", annotations: ["Cucina attrezzata", "Lavastoviglie"], order: 3 },
      { id: "room-4", name: "Bagno", nameEn: "Bathroom", photoUrl: "/photos/bathroom.jpg", annotations: ["Doccia", "Lavatrice"], order: 4 },
      { id: "room-5", name: "Balcone", nameEn: "Balcony", photoUrl: "/photos/balcony.jpg", annotations: ["Vista sul cortile"], order: 5 },
    ],
    totalViews: 47,
    avgCompletionRate: 78,
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
  },
  {
    id: "tour360-2",
    listingId: "piazzale-vittoria-6-doppia",
    rooms: [
      { id: "room-6", name: "Stanza doppia", nameEn: "Double room", photoUrl: "/photos/double-room.jpg", annotations: ["Due scrivanie", "Armadio doppio"], order: 1 },
      { id: "room-7", name: "Cucina", nameEn: "Kitchen", photoUrl: "/photos/shared-kitchen.jpg", annotations: ["Cucina condivisa", "Microonde"], order: 2 },
      { id: "room-8", name: "Bagno", nameEn: "Bathroom", photoUrl: "/photos/bathroom2.jpg", annotations: ["Bagno condiviso"], order: 3 },
    ],
    totalViews: 23,
    avgCompletionRate: 65,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
]);
