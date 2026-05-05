import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { uploadFile } from "@/lib/services/storage";

/**
 * File upload API endpoint.
 * Accepts multipart form data with file, category, and optional listingId.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "listing_photo";
    const listingId = formData.get("listingId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "File mancante" }, { status: 400 });
    }

    const result = await uploadFile(file, file.name, category, {
      userId: user.id,
      listingId: listingId || undefined,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      url: result.url,
      fileKey: result.fileKey,
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      category,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
