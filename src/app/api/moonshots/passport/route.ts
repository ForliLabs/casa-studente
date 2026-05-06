import { NextResponse } from "next/server";
import { verifyPassportCredential } from "@/lib/actions/moonshots";
import { housingPassportStore, issuePassportToken } from "@/lib/stores/moonshots";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (token) {
    const verification = await verifyPassportCredential(token);
    return NextResponse.json(verification, {
      status: verification.valid ? 200 : 400,
    });
  }

  const passports = await housingPassportStore.findAll();
  return NextResponse.json({
    data: passports.map((passport) => ({
      id: passport.id,
      holderName: passport.holderName,
      portabilityScore: passport.portabilityScore,
      status: passport.status,
      token: issuePassportToken(passport),
    })),
    generatedAt: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { token?: string } | null;
  if (!body?.token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const verification = await verifyPassportCredential(body.token);
  return NextResponse.json(verification, {
    status: verification.valid ? 200 : 400,
  });
}
