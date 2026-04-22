"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { paymentStore, leaseStore, type Payment, type LeaseContract } from "@/lib/stores";

function generateId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function createPaymentAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Devi accedere per effettuare un pagamento" };
  }

  const recipientId = formData.get("recipientId") as string;
  const recipientName = formData.get("recipientName") as string;
  const listingId = formData.get("listingId") as string;
  const listingTitle = formData.get("listingTitle") as string;
  const amount = Number(formData.get("amount"));
  const type = formData.get("type") as "rent" | "deposit";
  const month = formData.get("month") as string;

  if (!amount || amount <= 0) {
    return { error: "Importo non valido" };
  }

  const platformFee = Math.round(amount * 0.05);
  const receiptNumber = `RIC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, "0")}`;

  const payment: Payment = {
    id: `pay-${generateId()}`,
    payerId: user.id,
    payerName: user.name,
    recipientId,
    recipientName,
    listingId,
    listingTitle,
    amount,
    platformFee,
    type,
    status: "completed",
    month,
    createdAt: new Date().toISOString(),
    receiptNumber,
  };

  await paymentStore.create(payment);
  revalidatePath("/dashboard/payments");
  return { success: true, receiptNumber };
}

export async function createLeaseAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Devi accedere per creare un contratto" };
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

  if (!monthlyRent || !startDate || !endDate) {
    return { error: "Canone, data inizio e data fine sono obbligatori" };
  }

  const lease: LeaseContract = {
    id: `lease-${generateId()}`,
    tenantId: tenantId || user.id,
    tenantName: tenantName || user.name,
    landlordId: user.role === "landlord" ? user.id : "",
    landlordName: user.role === "landlord" ? user.name : "",
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
