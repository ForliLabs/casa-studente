"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { listingStore, type Listing } from "@/lib/data";
import { createListingSchema } from "@/lib/validation";

function generateListingId(address: string, type: string): string {
  const slug = address
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 30);
  return `${slug}-${type.replace(/\s+/g, "-")}-${Date.now().toString(36)}`;
}

function canManageListing(user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>, listing: Listing) {
  return user.role === "admin" || listing.landlord.email === user.email;
}

function parsePhotoPayload(rawPhotos: FormDataEntryValue | null): string[] {
  if (typeof rawPhotos !== "string" || rawPhotos.length === 0) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawPhotos) as string[];
    return Array.isArray(parsed) ? parsed.filter((photo) => typeof photo === "string") : [];
  } catch {
    return [];
  }
}

export async function createListingAction(_prevState: unknown, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "landlord" && user.role !== "admin")) {
    return { error: "Solo i proprietari possono creare annunci" };
  }

  const parsed = createListingSchema.safeParse({
    title: formData.get("title"),
    address: formData.get("address"),
    neighborhood: formData.get("neighborhood") || undefined,
    zone: formData.get("zone") || undefined,
    type: formData.get("type"),
    price: formData.get("price"),
    deposit: formData.get("deposit") || undefined,
    utilities: formData.get("utilities") || undefined,
    size: formData.get("size") || undefined,
    rooms: formData.get("rooms") || undefined,
    bathrooms: formData.get("bathrooms") || undefined,
    floor: formData.get("floor") || undefined,
    availableFrom: formData.get("availableFrom") || undefined,
    description: formData.get("description") || undefined,
    features: formData.get("features") || undefined,
    nearby: formData.get("nearby") || undefined,
    status: (formData.get("status") as string) || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const photos = parsePhotoPayload(formData.get("photos"));
  const data = parsed.data;

  const listing: Listing = {
    id: generateListingId(data.address, data.type),
    title: data.title,
    address: data.address,
    neighborhood: data.neighborhood || data.zone || "Centro",
    zone: data.zone || "Centro",
    type: data.type,
    price: data.price,
    deposit: data.deposit || data.price * 2,
    utilities: data.utilities || "Da concordare",
    size: data.size || 0,
    rooms: data.rooms || 1,
    bathrooms: data.bathrooms || 1,
    floor: data.floor || "Piano terra",
    availableFrom: data.availableFrom || "Da concordare",
    status: data.status || "Disponibile",
    verified: user.verified,
    virtualTour: photos.length > 2,
    securePayments: true,
    furnished: true,
    photos: photos.length > 0 ? photos : ["Foto principale", "Altra vista"],
    features: data.features ? data.features.split(",").map((feature) => feature.trim()).filter(Boolean) : [],
    description: data.description || "",
    nearby: data.nearby ? data.nearby.split(",").map((place) => place.trim()).filter(Boolean) : [],
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

  await listingStore.create(listing);
  revalidatePath("/listings");
  revalidatePath(`/listings/${listing.id}`);
  revalidatePath("/dashboard/listings");
  redirect("/dashboard/listings");
}

export async function updateListingAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Devi accedere per modificare un annuncio" };
  }

  const id = formData.get("id") as string;
  const listing = await listingStore.findById(id);
  if (!listing) {
    return { error: "Annuncio non trovato" };
  }

  if (!canManageListing(user, listing)) {
    return { error: "Non puoi modificare questo annuncio" };
  }

  const updates: Partial<Listing> = {};
  const title = formData.get("title") as string;
  if (title?.trim()) updates.title = title.trim();
  const price = formData.get("price");
  if (price) updates.price = Number(price);
  const deposit = formData.get("deposit");
  if (deposit) updates.deposit = Number(deposit);
  const description = formData.get("description") as string;
  if (description) updates.description = description.trim();
  const status = formData.get("status") as string;
  if (status === "Disponibile" || status === "In trattativa") {
    updates.status = status;
  }
  const availableFrom = formData.get("availableFrom") as string;
  if (availableFrom) updates.availableFrom = availableFrom;

  await listingStore.update(id, updates);
  revalidatePath("/listings");
  revalidatePath(`/listings/${id}`);
  revalidatePath("/dashboard/listings");

  return { success: true };
}

export async function deleteListingAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const id = formData.get("id") as string;
  if (!id) return;

  const listing = await listingStore.findById(id);
  if (!listing || !canManageListing(user, listing)) return;

  await listingStore.delete(id);
  revalidatePath("/listings");
  revalidatePath("/dashboard/listings");
}

export async function updateListingStatusAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const id = formData.get("id") as string;
  const status = formData.get("status") as "Disponibile" | "In trattativa";

  if (!id || !status) return;

  const listing = await listingStore.findById(id);
  if (!listing || !canManageListing(user, listing)) {
    return;
  }

  await listingStore.update(id, { status });
  revalidatePath("/listings");
  revalidatePath("/dashboard/listings");
}
