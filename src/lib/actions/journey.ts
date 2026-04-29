"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import {
  journeyStore,
  canTransition,
  type JourneyStage,
  type RentalJourney,
} from "@/lib/stores/journey";
import { executeWorkflowTriggers, detectStaleJourneys } from "@/lib/stores/workflow";

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

  const fromStage = journey.stage;
  const now = new Date().toISOString();
  await journeyStore.update(journeyId, {
    stage: nextStage,
    stageHistory: [...journey.stageHistory, { stage: nextStage, timestamp: now, note: note || undefined }],
    updatedAt: now,
  });

  // Execute workflow triggers for this transition
  await executeWorkflowTriggers(journeyId, fromStage, nextStage, {
    studentName: journey.studentName,
    landlordName: journey.landlordName,
    listingTitle: journey.listingTitle,
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

export async function checkStaleJourneys() {
  const allJourneys = await journeyStore.findAll();
  return detectStaleJourneys(
    allJourneys.map((j) => ({
      id: j.id,
      studentName: j.studentName,
      listingTitle: j.listingTitle,
      stage: j.stage,
      updatedAt: j.updatedAt,
    }))
  );
}

export async function getJourneyFunnelAnalytics() {
  const allJourneys = await journeyStore.findAll();

  const stageCounts: Record<string, number> = {};
  const stageTimings: Record<string, number[]> = {};

  for (const journey of allJourneys) {
    stageCounts[journey.stage] = (stageCounts[journey.stage] || 0) + 1;

    // Calculate time per stage from history
    for (let i = 1; i < journey.stageHistory.length; i++) {
      const prev = journey.stageHistory[i - 1];
      const curr = journey.stageHistory[i];
      const days = Math.round(
        (new Date(curr.timestamp).getTime() - new Date(prev.timestamp).getTime()) / 86400000
      );
      if (!stageTimings[prev.stage]) stageTimings[prev.stage] = [];
      stageTimings[prev.stage].push(days);
    }
  }

  const avgTimePerStage = Object.entries(stageTimings).map(([stage, times]) => ({
    stage,
    avgDays: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
    count: times.length,
  }));

  return { stageCounts, avgTimePerStage, totalJourneys: allJourneys.length };
}
