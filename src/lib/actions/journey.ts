"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import {
  journeyStore,
  canTransition,
  type JourneyStage,
  type RentalJourney,
} from "@/lib/stores/journey";

function generateId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function createJourneyAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Devi accedere per iniziare un percorso" };

  const listingId = formData.get("listingId") as string;
  const listingTitle = formData.get("listingTitle") as string;
  const landlordId = formData.get("landlordId") as string;
  const landlordName = formData.get("landlordName") as string;

  if (!listingId || !listingTitle) {
    return { error: "Dati dell'annuncio mancanti" };
  }

  // Check for existing journey
  const existing = await journeyStore.filter(
    (j) => j.studentId === user.id && j.listingId === listingId && j.stage !== "cancelled"
  );
  if (existing.length > 0) {
    return { error: "Hai già un percorso attivo per questo annuncio" };
  }

  const now = new Date().toISOString();
  const journey: RentalJourney = {
    id: `journey-${generateId()}`,
    studentId: user.id,
    studentName: user.name,
    listingId,
    listingTitle,
    landlordId: landlordId || "",
    landlordName: landlordName || "",
    stage: "discovered",
    stageHistory: [{ stage: "discovered", timestamp: now }],
    createdAt: now,
    updatedAt: now,
  };

  await journeyStore.create(journey);
  revalidatePath("/dashboard/journey");
  return { success: true, journeyId: journey.id };
}

export async function advanceJourneyAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const journeyId = formData.get("journeyId") as string;
  const nextStage = formData.get("nextStage") as JourneyStage;
  const note = formData.get("note") as string;

  const journey = await journeyStore.findById(journeyId);
  if (!journey) return;

  if (journey.studentId !== user.id && journey.landlordId !== user.id && user.role !== "admin") {
    return;
  }

  if (!canTransition(journey.stage, nextStage)) return;

  const now = new Date().toISOString();
  await journeyStore.update(journeyId, {
    stage: nextStage,
    stageHistory: [...journey.stageHistory, { stage: nextStage, timestamp: now, note: note || undefined }],
    updatedAt: now,
  });

  revalidatePath("/dashboard/journey");
  revalidatePath("/admin");
}

export async function getMyJourneys() {
  const user = await getCurrentUser();
  if (!user) return [];

  if (user.role === "student") {
    return journeyStore.filter((j) => j.studentId === user.id);
  } else if (user.role === "landlord") {
    return journeyStore.filter((j) => j.landlordId === user.id);
  } else {
    return journeyStore.findAll();
  }
}
