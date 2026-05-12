"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser, userStore } from "@/lib/auth";
import { canSendLeaseForSignature, canSignLease, validateLeaseDates } from "@/lib/lease-workflow";
import { listingStore } from "@/lib/data";
import { createLeaseSchema, createPaymentSchema } from "@/lib/validation";
import { paymentStore, leaseStore, type Payment, type LeaseContract } from "@/lib/stores";

function generateId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function generateReceiptNumber() {
  return `RIC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, "0")}`;
}

function appendAuditEntry(lease: LeaseContract, entry: string) {
  return [...(lease.signatureAuditTrail ?? []), entry];
}

export async function createPaymentAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Devi accedere per effettuare un pagamento" };
  }

  const parsed = createPaymentSchema.safeParse({
    recipientId: (formData.get("recipientId") as string) || "pending-recipient",
    recipientName: formData.get("recipientName"),
    listingId: formData.get("listingId"),
    listingTitle: formData.get("listingTitle"),
    amount: formData.get("amount"),
    type: formData.get("type"),
    month: (formData.get("month") as string) || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const listing = await listingStore.findById(parsed.data.listingId);
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

  const platformFee = Math.round(parsed.data.amount * 0.05);
  const receiptNumber = generateReceiptNumber();

  const payment: Payment = {
    id: `pay-${generateId()}`,
    payerId: user.id,
    payerName: user.name,
    recipientId: landlordUser.id,
    recipientName: landlordUser.name || listing.landlord.name || parsed.data.recipientName,
    listingId: listing.id,
    listingTitle: listing.title,
    amount: parsed.data.amount,
    platformFee,
    type: parsed.data.type,
    status: "pending",
    month: parsed.data.month,
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

  const parsed = createLeaseSchema.safeParse({
    tenantId: formData.get("tenantId") || undefined,
    tenantName: formData.get("tenantName") || undefined,
    listingId: formData.get("listingId"),
    listingTitle: formData.get("listingTitle"),
    address: formData.get("address"),
    monthlyRent: formData.get("monthlyRent"),
    deposit: formData.get("deposit") || undefined,
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    contractType: formData.get("contractType") || undefined,
    taxRegime: formData.get("taxRegime") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  if (!parsed.data.tenantId) {
    return { error: "Seleziona uno studente da invitare alla firma" };
  }

  const dateError = validateLeaseDates(parsed.data.startDate, parsed.data.endDate);
  if (dateError) {
    return { error: dateError };
  }

  const listing = await listingStore.findById(parsed.data.listingId);
  if (!listing) {
    return { error: "Annuncio non trovato" };
  }

  if (user.role !== "admin" && listing.landlord.email !== user.email) {
    return { error: "Puoi creare contratti solo per i tuoi annunci" };
  }

  const tenant = await userStore.findById(parsed.data.tenantId);
  if (!tenant || tenant.role !== "student") {
    return { error: "Lo studente selezionato non è valido" };
  }

  const landlordUser =
    user.role === "admin"
      ? (await userStore.filter((candidate) => candidate.email === listing.landlord.email))[0]
      : user;

  if (!landlordUser) {
    return { error: "Proprietario non trovato per questo annuncio" };
  }

  const now = new Date().toISOString();
  const lease: LeaseContract = {
    id: `lease-${generateId()}`,
    tenantId: tenant.id,
    tenantName: tenant.name,
    landlordId: landlordUser.id,
    landlordName: landlordUser.name,
    listingId: listing.id,
    listingTitle: listing.title,
    address: listing.address,
    monthlyRent: parsed.data.monthlyRent,
    deposit: parsed.data.deposit || parsed.data.monthlyRent * 2,
    startDate: parsed.data.startDate,
    endDate: parsed.data.endDate,
    contractType: parsed.data.contractType || "transitorio",
    taxRegime: parsed.data.taxRegime || "cedolare_secca",
    status: "draft",
    createdAt: now,
    lastUpdatedAt: now,
    signatureAuditTrail: ["Bozza creata dal proprietario"],
  };

  await leaseStore.create(lease);
  revalidatePath("/dashboard/payments");
  return { success: true, leaseId: lease.id };
}

export async function sendLeaseForSignatureAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Devi accedere per inviare il contratto" };
  }

  const leaseId = formData.get("leaseId") as string;
  if (!leaseId) {
    return { error: "Contratto non valido" };
  }

  const lease = await leaseStore.findById(leaseId);
  if (!lease) {
    return { error: "Contratto non trovato" };
  }

  if (!canSendLeaseForSignature(lease, user)) {
    return { error: "Non puoi inviare questo contratto alla firma" };
  }

  const now = new Date().toISOString();
  await leaseStore.update(leaseId, {
    status: "pending_signature",
    sentForSignatureAt: now,
    landlordSignedAt: now,
    lastUpdatedAt: now,
    signatureAuditTrail: appendAuditEntry(lease, "Contratto inviato per la firma digitale"),
  });

  revalidatePath("/dashboard/payments");
  return { success: true };
}

export async function signLeaseAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Devi accedere per firmare il contratto" };
  }

  const leaseId = formData.get("leaseId") as string;
  if (!leaseId) {
    return { error: "Contratto non valido" };
  }

  const lease = await leaseStore.findById(leaseId);
  if (!lease) {
    return { error: "Contratto non trovato" };
  }

  if (!canSignLease(lease, user)) {
    return { error: "Non puoi firmare questo contratto" };
  }

  const now = new Date().toISOString();
  await leaseStore.update(leaseId, {
    status: "active",
    tenantSignedAt: now,
    lastUpdatedAt: now,
    signatureAuditTrail: appendAuditEntry(lease, "Inquilino ha firmato digitalmente il contratto"),
  });

  revalidatePath("/dashboard/payments");
  return { success: true };
}
