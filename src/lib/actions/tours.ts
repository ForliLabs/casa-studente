"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser, userStore } from "@/lib/auth";
import { listingStore } from "@/lib/data";
import {
  canCancelTour,
  canCompleteTour,
  canConfirmTour,
  canRequestTour,
  validateTourDateTime,
} from "@/lib/tour-workflow";
import {
  tourBookingStore,
  tourAvailabilityStore,
  virtualTour360Store,
  type TourBooking,
  type TourType,
  type TourAvailability,
  type VirtualTour360,
} from "@/lib/stores/tours";

function generateId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function requestTourAction(_prevState: unknown, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Devi accedere per prenotare un tour" };

  const listingId = formData.get("listingId") as string;
  const type = (formData.get("type") as TourType) || "virtual";
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const notes = formData.get("notes") as string;

  if (!listingId || !date || !time) {
    return { error: "Data e ora sono obbligatori" };
  }

  const validationError = validateTourDateTime(date, time);
  if (validationError) {
    return { error: validationError };
  }

  const listing = await listingStore.findById(listingId);
  if (!listing) {
    return { error: "Annuncio non trovato" };
  }

  const landlordUser = (await userStore.filter((candidate) => candidate.email === listing.landlord.email))[0];
  if (!landlordUser) {
    return { error: "Proprietario non trovato" };
  }

  if (!canRequestTour(user, landlordUser.id, listing.landlord.email)) {
    return { error: "Solo gli studenti possono richiedere tour per annunci di altri proprietari" };
  }

  const existing = await tourBookingStore.filter(
    (tour) =>
      tour.listingId === listingId &&
      tour.studentId === user.id &&
      (tour.status === "requested" || tour.status === "confirmed")
  );
  if (existing.length > 0) {
    return { error: "Hai già una prenotazione attiva per questo annuncio" };
  }

  const now = new Date().toISOString();
  const booking: TourBooking = {
    id: `tour-${generateId()}`,
    listingId,
    listingTitle: listing.title,
    studentId: user.id,
    studentName: user.name,
    landlordId: landlordUser.id,
    landlordName: landlordUser.name,
    type,
    status: "requested",
    requestedDate: date,
    requestedTime: time,
    notes: notes || undefined,
    createdAt: now,
    updatedAt: now,
  };

  await tourBookingStore.create(booking);
  revalidatePath(`/listings/${listingId}`);
  revalidatePath("/dashboard/tours");
  return { success: true, bookingId: booking.id };
}

export async function confirmTourAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Non autorizzato" };

  const bookingId = formData.get("bookingId") as string;
  const booking = await tourBookingStore.findById(bookingId);
  if (!booking) return { error: "Prenotazione non trovata" };

  if (!canConfirmTour(booking, user)) {
    return { error: "Solo il proprietario può confermare questa prenotazione" };
  }

  const confirmedDate = (formData.get("confirmedDate") as string) || booking.requestedDate;
  const confirmedTime = (formData.get("confirmedTime") as string) || booking.requestedTime;
  const validationError = validateTourDateTime(confirmedDate, confirmedTime);
  if (validationError) {
    return { error: validationError };
  }

  await tourBookingStore.update(bookingId, {
    status: "confirmed",
    confirmedDate,
    confirmedTime,
    updatedAt: new Date().toISOString(),
  });

  revalidatePath("/dashboard/tours");
  return { success: true };
}

export async function completeTourAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Non autorizzato" };

  const bookingId = formData.get("bookingId") as string;
  const rating = Number(formData.get("rating")) || undefined;
  const feedback = formData.get("feedback") as string;
  const booking = await tourBookingStore.findById(bookingId);
  if (!booking) return { error: "Prenotazione non trovata" };

  if (!canCompleteTour(booking, user)) {
    return { error: "Puoi completare solo tour confermati di cui fai parte" };
  }

  if (rating && (rating < 1 || rating > 5)) {
    return { error: "Il rating deve essere compreso tra 1 e 5" };
  }

  await tourBookingStore.update(bookingId, {
    status: "completed",
    rating,
    feedback: feedback || undefined,
    updatedAt: new Date().toISOString(),
  });

  revalidatePath("/dashboard/tours");
  return { success: true };
}

export async function cancelTourAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Non autorizzato" };

  const bookingId = formData.get("bookingId") as string;
  const booking = await tourBookingStore.findById(bookingId);
  if (!booking) return { error: "Prenotazione non trovata" };

  if (!canCancelTour(booking, user)) {
    return { error: "Non puoi annullare questo tour" };
  }

  await tourBookingStore.update(bookingId, {
    status: "cancelled",
    updatedAt: new Date().toISOString(),
  });
  revalidatePath("/dashboard/tours");
  return { success: true };
}

export async function getMyTours() {
  const user = await getCurrentUser();
  if (!user) return [];

  if (user.role === "student") {
    return tourBookingStore.filter((tour) => tour.studentId === user.id);
  }
  if (user.role === "landlord") {
    return tourBookingStore.filter((tour) => tour.landlordId === user.id);
  }
  return tourBookingStore.findAll();
}

export async function getLandlordAvailability(landlordId: string): Promise<TourAvailability[]> {
  return tourAvailabilityStore.filter((availability) => availability.landlordId === landlordId);
}

export async function getVirtualTour360(listingId: string): Promise<VirtualTour360 | null> {
  const tours = await virtualTour360Store.filter((tour) => tour.listingId === listingId);
  return tours[0] || null;
}
