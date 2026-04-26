import { InMemoryStore } from "@/lib/db";

// ============ ACADEMIC CALENDAR ============

export interface AcademicEvent {
  id: string;
  campusId: string;
  title: string;
  titleEn: string;
  type: "semester_start" | "semester_end" | "enrollment" | "ergo_deadline" | "exam_period" | "holiday";
  startDate: string;
  endDate?: string;
  description: string;
  descriptionEn: string;
}

export interface SemesterPeriod {
  id: string;
  campusId: string;
  name: string;
  nameEn: string;
  startDate: string;
  endDate: string;
  enrollmentDeadline: string;
  year: string;
}

export const academicEventStore = new InMemoryStore<AcademicEvent>();
export const semesterStore = new InMemoryStore<SemesterPeriod>();

semesterStore.seed([
  {
    id: "sem-2026-fall",
    campusId: "campus-forli",
    name: "Primo Semestre 2026/2027",
    nameEn: "Fall Semester 2026/2027",
    startDate: "2026-09-15",
    endDate: "2027-01-31",
    enrollmentDeadline: "2026-09-01",
    year: "2026/2027",
  },
  {
    id: "sem-2027-spring",
    campusId: "campus-forli",
    name: "Secondo Semestre 2026/2027",
    nameEn: "Spring Semester 2026/2027",
    startDate: "2027-02-17",
    endDate: "2027-06-30",
    enrollmentDeadline: "2027-02-01",
    year: "2026/2027",
  },
  {
    id: "sem-2027-fall",
    campusId: "campus-forli",
    name: "Primo Semestre 2027/2028",
    nameEn: "Fall Semester 2027/2028",
    startDate: "2027-09-15",
    endDate: "2028-01-31",
    enrollmentDeadline: "2027-09-01",
    year: "2027/2028",
  },
]);

academicEventStore.seed([
  {
    id: "evt-1",
    campusId: "campus-forli",
    title: "Inizio lezioni primo semestre",
    titleEn: "Fall semester classes begin",
    type: "semester_start",
    startDate: "2026-09-15",
    description: "Inizio delle lezioni per il primo semestre dell'anno accademico 2026/2027.",
    descriptionEn: "Classes begin for the fall semester of academic year 2026/2027.",
  },
  {
    id: "evt-2",
    campusId: "campus-forli",
    title: "Scadenza bando Er.Go",
    titleEn: "Er.Go housing application deadline",
    type: "ergo_deadline",
    startDate: "2026-07-31",
    description: "Scadenza per la presentazione delle domande di alloggio Er.Go per l'a.a. 2026/2027.",
    descriptionEn: "Deadline for Er.Go housing applications for the 2026/2027 academic year.",
  },
  {
    id: "evt-3",
    campusId: "campus-forli",
    title: "Sessione esami invernale",
    titleEn: "Winter exam session",
    type: "exam_period",
    startDate: "2027-01-10",
    endDate: "2027-02-14",
    description: "Sessione d'esame del primo semestre.",
    descriptionEn: "First semester exam session.",
  },
  {
    id: "evt-4",
    campusId: "campus-forli",
    title: "Iscrizioni a.a. 2027/2028",
    titleEn: "Enrollment for 2027/2028",
    type: "enrollment",
    startDate: "2027-07-15",
    endDate: "2027-10-31",
    description: "Periodo di iscrizione per il nuovo anno accademico.",
    descriptionEn: "Enrollment period for the new academic year.",
  },
  {
    id: "evt-5",
    campusId: "campus-forli",
    title: "Inizio lezioni secondo semestre",
    titleEn: "Spring semester classes begin",
    type: "semester_start",
    startDate: "2027-02-17",
    description: "Inizio delle lezioni per il secondo semestre dell'anno accademico 2026/2027.",
    descriptionEn: "Classes begin for the spring semester of academic year 2026/2027.",
  },
]);
