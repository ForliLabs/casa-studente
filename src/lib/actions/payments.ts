"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser, userStore } from "@/lib/auth";
import { listingStore } from "@/lib/data";
import { paymentStore, leaseStore, type Payment, type LeaseContract } from "@/lib/stores";

function generateId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function createPaymentAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Devi accedere per effettuare un pagamento" };
  }

  const recipientName = formData.get("recipientName") as string;
  const listingId = formData.get("listingId") as string;
  const listingTitle = formData.get("listingTitle") as string;
  const amount = Number(formData.get("amount"));
  const type = formData.get("type") as "rent" | "deposit";
  const month = formData.get("month") as string;

  if (!listingId || !listingTitle || !(type === "rent" || type === "deposit")) {
    return { error: "Dati pagamento incompleti" };
  }

  if (!amount || amount <= 0) {
    return { error: "Importo non valido" };
  }

  const listing = await listingStore.findById(listingId);
  if (!listing) {
    return { error: "Annuncio non trovato" };
  }

  if (user.email === listing.landlord.email) {
    return { error: "Non puoi pagare il tuo stesso annuncio" };
  }

  const landlordUser = (await userStore.filter((candidate) => candidate.email === listing.landlord.email))[0];
  if (!landlordUser) {
    return { error: "Proprietario non trovato" };
  }

  const platformFee = Math.round(amount * 0.05);
  const receiptNumber = `RIC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, "0")}`;

  const payment: Payment = {
    id: `pay-${generateId()}`,
    payerId: user.id,
    payerName: user.name,
    recipientId: landlordUser.id,
    recipientName: listing.landlord.name || recipientName,
    listingId,
    listingTitle,
    amount,
    platformFee,
    type,
    status: "pending",
    month,
    createdAt: new Date().toISOString(),
    receiptNumber,
  };

  await paymentStore.create(payment);
  revalidatePath("/dashboard/payments");
  return {
    success: true,
    receiptNumber,
    message: "Pagamento creato in stato pending. Confermalo tramite provider prima di considerarlo completato.",
  };
}

export async function createLeaseAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Devi accedere per creare un contratto" };
  }

  if (user.role !== "landlord" && user.role !== "admin") {
    return { error: "Solo i proprietari possono creare contratti" };
  }

  const tenantId = formData.get("tenantId") as string;
  const tenantName = formData.get("tenantName") as string;
  const listingId = formData.get("listingId") as string;
  const listingTitle = formData.get("listingTitle") as string;
  const address = formData.get("address") as string;
  const monthlyRent = Number(formData.get("monthlyRent"));
  const deposit = Number(formData.get("deposit"));
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const contractType = (formData.get("contractType") as LeaseContract["contractType"]) || "transitorio";
  const taxRegime = (formData.get("taxRegime") as LeaseContract["taxRegime"]) || "cedolare_secca";

  if (!tenantId || !tenantName || !listingId || !listingTitle || !address) {
    return { error: "Dati contratto incompleti" };
  }

  if (!monthlyRent || !startDate || !endDate) {
    return { error: "Canone, data inizio e data fine sono obbligatori" };
  }

  const lease: LeaseContract = {
    id: `lease-${generateId()}`,
    tenantId,
    tenantName,
    landlordId: user.id,
    landlordName: user.name,
    listingId,
    listingTitle,
    address,
    monthlyRent,
    deposit: deposit || monthlyRent * 2,
    startDate,
    endDate,
    contractType,
    taxRegime,
    status: "draft",
    createdAt: new Date().toISOString(),
  };

  await leaseStore.create(lease);
  revalidatePath("/dashboard/payments");
  return { success: true, leaseId: lease.id };
}
