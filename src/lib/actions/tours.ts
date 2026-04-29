"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
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

export async function requestTourAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Devi accedere per prenotare un tour" };

  const listingId = formData.get("listingId") as string;
  const listingTitle = formData.get("listingTitle") as string;
  const landlordId = formData.get("landlordId") as string;
  const landlordName = formData.get("landlordName") as string;
  const type = formData.get("type") as TourType;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const notes = formData.get("notes") as string;

  if (!listingId || !date || !time) {
    return { error: "Data e ora sono obbligatori" };
  }

  // Check for existing pending/confirmed booking
  const existing = await tourBookingStore.filter(
    (t) => t.listingId === listingId && t.studentId === user.id && (t.status === "requested" || t.status === "confirmed")
  );
  if (existing.length > 0) {
    return { error: "Hai già una prenotazione attiva per questo annuncio" };
  }

  const now = new Date().toISOString();
  const booking: TourBooking = {
    id: `tour-${generateId()}`,
    listingId,
    listingTitle,
    studentId: user.id,
    studentName: user.name,
    landlordId,
    landlordName,
    type: type || "virtual",
    status: "requested",
    requestedDate: date,
    requestedTime: time,
    notes: notes || undefined,
    createdAt: now,
    updatedAt: now,
  };

  await tourBookingStore.create(booking);
  revalidatePath("/dashboard/tours");
  return { success: true, bookingId: booking.id };
}

export async function confirmTourAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Non autorizzato" };

  const bookingId = formData.get("bookingId") as string;
  const confirmedDate = formData.get("confirmedDate") as string;
  const confirmedTime = formData.get("confirmedTime") as string;

  const booking = await tourBookingStore.findById(bookingId);
  if (!booking) return { error: "Prenotazione non trovata" };

  if (booking.landlordId !== user.id && user.role !== "admin") {
    return { error: "Solo il proprietario può confermare" };
  }

  await tourBookingStore.update(bookingId, {
    status: "confirmed",
    confirmedDate: confirmedDate || booking.requestedDate,
    confirmedTime: confirmedTime || booking.requestedTime,
    updatedAt: new Date().toISOString(),
  });

  revalidatePath("/dashboard/tours");
  return { success: true };
}

export async function completeTourAction(formData: FormData) {
  const bookingId = formData.get("bookingId") as string;
  const rating = Number(formData.get("rating")) || undefined;
  const feedback = formData.get("feedback") as string;

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
  const bookingId = formData.get("bookingId") as string;
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
    return tourBookingStore.filter((t) => t.studentId === user.id);
  } else if (user.role === "landlord") {
    return tourBookingStore.filter((t) => t.landlordId === user.id);
  }
  return tourBookingStore.findAll();
}

export async function getLandlordAvailability(landlordId: string): Promise<TourAvailability[]> {
  return tourAvailabilityStore.filter((a) => a.landlordId === landlordId);
}

export async function getVirtualTour360(listingId: string): Promise<VirtualTour360 | null> {
  const tours = await virtualTour360Store.filter((t) => t.listingId === listingId);
  return tours[0] || null;
}
