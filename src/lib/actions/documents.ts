"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { documentStore, complianceStore, type UserDocument } from "@/lib/stores/documents";

function generateId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function uploadDocumentAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const name = formData.get("name") as string;
  const type = formData.get("type") as UserDocument["type"];
  const description = formData.get("description") as string;
  const linkedEntityId = formData.get("linkedEntityId") as string;
  const linkedEntityType = formData.get("linkedEntityType") as UserDocument["linkedEntityType"];
  const expiryDate = formData.get("expiryDate") as string;

  if (!name || !type) return;

  const doc: UserDocument = {
    id: `doc-${generateId()}`,
    userId: user.id,
    type,
    name,
    description: description || "",
    fileUrl: `/documents/${name.toLowerCase().replace(/\s+/g, "-")}.pdf`,
    linkedEntityId: linkedEntityId || undefined,
    linkedEntityType: linkedEntityType || undefined,
    expiryDate: expiryDate || undefined,
    uploadedAt: new Date().toISOString(),
    size: Math.floor(Math.random() * 500000) + 50000,
  };

  await documentStore.create(doc);
  revalidatePath("/dashboard/documents");
}

export async function deleteDocumentAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const docId = formData.get("documentId") as string;
  const doc = await documentStore.findById(docId);
  if (!doc || doc.userId !== user.id) return;

  await documentStore.delete(docId);
  revalidatePath("/dashboard/documents");
}

export async function toggleComplianceAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const itemId = formData.get("itemId") as string;
  const item = await complianceStore.findById(itemId);
  if (!item) return;

  await complianceStore.update(itemId, {
    completed: !item.completed,
    completedAt: !item.completed ? new Date().toISOString() : undefined,
  });

  revalidatePath("/dashboard/compliance");
}

export async function getMyDocuments() {
  const user = await getCurrentUser();
  if (!user) return [];
  return documentStore.filter((d) => d.userId === user.id);
}

export async function getMyCompliance() {
  const user = await getCurrentUser();
  if (!user) return [];
  return complianceStore.filter((c) => c.userId === user.id);
}
