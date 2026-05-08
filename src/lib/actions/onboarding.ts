"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser, userStore } from "@/lib/auth";
import { listingStore, type Listing, type ListingType } from "@/lib/data";
import {
  roommateStore,
  savedSearchStore,
  type RoommateProfile,
  type SleepSchedule,
  type SocialPreference,
} from "@/lib/stores";

function generateId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function splitList(value: FormDataEntryValue | null) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function createListingId(address: string, type: string) {
  return `${address
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 30)}-${type}-${Date.now().toString(36)}`;
}

export async function completeOnboardingAction(_prevState: unknown, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Devi accedere" };

  const step = formData.get("step") as string;
  if (step !== "complete") {
    return { error: "Step non valido" };
  }

  if (user.role === "student") {
    const bio = String(formData.get("bio") || "").trim();
    const budgetMin = Number(formData.get("budgetMin") || 250);
    const budgetMax = Number(formData.get("budgetMax") || 500);
    const preferredZone = String(formData.get("preferredZone") || "Campus");
    const sleepSchedule = String(formData.get("sleepSchedule") || "flexible") as SleepSchedule;
    const socialPreference = String(formData.get("socialPreference") || "balanced") as SocialPreference;
    const petTolerant = String(formData.get("petTolerant") || "false") === "true";
    const smokingTolerant = String(formData.get("smokingTolerant") || "false") === "true";

    const existingProfile = (await roommateStore.filter((profile) => profile.userId === user.id))[0];
    const roommateProfile: RoommateProfile = {
      id: existingProfile?.id || generateId("roommate"),
      userId: user.id,
      name: user.name,
      studyProgram: "Studente UNIBO",
      languages: ["Italiano"],
      budgetMin,
      budgetMax,
      sleepSchedule,
      cleanliness: 4,
      socialPreference,
      petTolerant,
      smokingTolerant,
      bio: bio || "Profilo creato durante l'onboarding CasaStudente.",
      lookingForRoommate: true,
      preferredZones: [preferredZone],
    };

    if (existingProfile) {
      await roommateStore.update(existingProfile.id, roommateProfile);
    } else {
      await roommateStore.create(roommateProfile);
    }

    const existingSearch = (await savedSearchStore.filter((search) => search.userId === user.id))[0];
    const savedSearch = {
      id: existingSearch?.id || generateId("search"),
      userId: user.id,
      name: `Ricerca ${preferredZone}`,
      criteria: {
        zone: preferredZone,
        minPrice: budgetMin,
        maxPrice: budgetMax,
        verifiedOnly: true,
      },
      notifyEmail: true,
      notifyInApp: true,
      createdAt: new Date().toISOString(),
    };

    if (existingSearch) {
      await savedSearchStore.update(existingSearch.id, savedSearch);
    } else {
      await savedSearchStore.create(savedSearch);
    }
  }

  if (user.role === "landlord") {
    const title = String(formData.get("listingTitle") || "").trim();
    const address = String(formData.get("listingAddress") || "").trim();
    const type = String(formData.get("listingType") || "stanza singola") as ListingType;
    const price = Number(formData.get("listingPrice") || 0);
    const description = String(formData.get("listingDescription") || "").trim();

    if (!title || !address || !price || !description) {
      return { error: "Completa i dati del tuo primo annuncio per terminare l'onboarding." };
    }

    const existingListing = (await listingStore.filter((listing) => listing.landlord.email === user.email))[0];
    const nextListing: Listing = {
      id: existingListing?.id || createListingId(address, type.replace(/\s+/g, "-")),
      title,
      address,
      neighborhood: String(formData.get("listingNeighborhood") || formData.get("listingZone") || "Centro"),
      zone: String(formData.get("listingZone") || "Centro"),
      type,
      price,
      deposit: price * 2,
      utilities: "Da concordare",
      size: Number(formData.get("listingSize") || 18),
      rooms: Number(formData.get("listingRooms") || 1),
      bathrooms: Number(formData.get("listingBathrooms") || 1),
      floor: String(formData.get("listingFloor") || "Piano terra"),
      availableFrom: String(formData.get("listingAvailableFrom") || "Da concordare"),
      status: "Disponibile",
      verified: user.verified,
      virtualTour: false,
      securePayments: true,
      furnished: true,
      photos: splitList(formData.get("listingPhotos")).length > 0 ? splitList(formData.get("listingPhotos")) : ["Foto principale"],
      features: splitList(formData.get("listingFeatures")),
      description,
      nearby: splitList(formData.get("listingNearby")),
      landlord: {
        name: user.name,
        role: user.verified ? "Proprietario verificato" : "Proprietario",
        phone: "",
        email: user.email,
        languages: ["Italiano"],
        responseRate: "N/A",
        responseTime: "Da verificare",
      },
    };

    if (existingListing) {
      await listingStore.update(existingListing.id, nextListing);
    } else {
      await listingStore.create(nextListing);
    }
  }

  await userStore.update(user.id, { profileComplete: true, onboardingComplete: true });

  revalidatePath("/onboarding");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/listings");
  revalidatePath("/notifications");
  revalidatePath("/listings");

  redirect(user.role === "landlord" ? "/dashboard/listings" : "/listings");
}

export async function skipOnboardingAction() {
  const user = await getCurrentUser();
  if (!user) return;

  await userStore.update(user.id, { onboardingComplete: true });
  redirect(user.role === "landlord" ? "/dashboard" : "/listings");
}
