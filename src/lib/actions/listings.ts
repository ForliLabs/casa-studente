"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { listingStore, type Listing, type ListingType } from "@/lib/data";

function generateListingId(address: string, type: string): string {
  const slug = address
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 30);
  return `${slug}-${type.replace(/\s+/g, "-")}-${Date.now().toString(36)}`;
}

export async function createListingAction(_prevState: unknown, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "landlord" && user.role !== "admin")) {
    return { error: "Solo i proprietari possono creare annunci" };
  }

  const title = formData.get("title") as string;
  const address = formData.get("address") as string;
  const neighborhood = formData.get("neighborhood") as string;
  const zone = formData.get("zone") as string;
  const type = formData.get("type") as ListingType;
  const price = Number(formData.get("price"));
  const deposit = Number(formData.get("deposit"));
  const utilities = formData.get("utilities") as string;
  const size = Number(formData.get("size"));
  const rooms = Number(formData.get("rooms"));
  const bathrooms = Number(formData.get("bathrooms"));
  const floor = formData.get("floor") as string;
  const availableFrom = formData.get("availableFrom") as string;
  const description = formData.get("description") as string;
  const featuresRaw = formData.get("features") as string;
  const nearbyRaw = formData.get("nearby") as string;
  const status = (formData.get("status") as "Disponibile" | "In trattativa") || "Disponibile";

  if (!title || !address || !price || !type) {
    return { error: "Titolo, indirizzo, prezzo e tipo sono obbligatori" };
  }

  const listing: Listing = {
    id: generateListingId(address, type),
    title,
    address,
    neighborhood: neighborhood || zone,
    zone: zone || "Centro",
    type,
    price,
    deposit: deposit || price * 2,
    utilities: utilities || "Da concordare",
    size: size || 0,
    rooms: rooms || 1,
    bathrooms: bathrooms || 1,
    floor: floor || "Piano terra",
    availableFrom: availableFrom || "Da concordare",
    status,
    verified: user.verified,
    virtualTour: false,
    securePayments: true,
    furnished: true,
    photos: ["Foto principale", "Altra vista"],
    features: featuresRaw ? featuresRaw.split(",").map((f) => f.trim()) : [],
    description: description || "",
    nearby: nearbyRaw ? nearbyRaw.split(",").map((n) => n.trim()) : [],
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

  const updates: Partial<Listing> = {};
  const title = formData.get("title") as string;
  if (title) updates.title = title;
  const price = formData.get("price");
  if (price) updates.price = Number(price);
  const deposit = formData.get("deposit");
  if (deposit) updates.deposit = Number(deposit);
  const description = formData.get("description") as string;
  if (description) updates.description = description;
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
  await listingStore.delete(id);
  revalidatePath("/listings");
  revalidatePath("/dashboard/listings");
}

export async function updateListingStatusAction(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;
  const status = formData.get("status") as "Disponibile" | "In trattativa";

  if (!id || !status) return;

  await listingStore.update(id, { status });
  revalidatePath("/listings");
  revalidatePath("/dashboard/listings");
}
