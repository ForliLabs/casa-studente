import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { roommateStore } from "@/lib/stores";
import { RoommateProfileForm } from "@/components/roommate-profile-form";

export const metadata: Metadata = {
  title: "Profilo Coinquilino",
  description: "Crea o modifica il tuo profilo coinquilino su CasaStudente.",
};

export default async function RoommateProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }

  const existingProfile = (await roommateStore.filter((p) => p.userId === user.id))[0] ?? null;

  const formData = existingProfile
    ? {
        studyProgram: existingProfile.studyProgram,
        languages: existingProfile.languages,
        budgetMin: existingProfile.budgetMin,
        budgetMax: existingProfile.budgetMax,
        sleepSchedule: existingProfile.sleepSchedule,
        cleanliness: existingProfile.cleanliness,
        socialPreference: existingProfile.socialPreference,
        petTolerant: existingProfile.petTolerant,
        smokingTolerant: existingProfile.smokingTolerant,
        bio: existingProfile.bio,
        preferredZones: existingProfile.preferredZones,
      }
    : null;

  return (
    <main className="flex-1 bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <Link href="/roommates" className="text-sm font-medium text-blue-600 hover:text-blue-700">
          &larr; Torna ai coinquilini
        </Link>

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            {existingProfile ? "Modifica profilo" : "Nuovo profilo"}
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {existingProfile ? "Aggiorna il tuo profilo coinquilino" : "Crea il tuo profilo coinquilino"}
          </h1>
          <p className="mt-4 text-base text-gray-600">
            {existingProfile
              ? "Modifica le tue preferenze per migliorare i match con altri studenti."
              : "Compila le tue preferenze per trovare coinquilini compatibili e ricevere punteggi personalizzati."}
          </p>
        </div>

        <div className="mt-8">
          <RoommateProfileForm existingProfile={formData} />
        </div>
      </div>
    </main>
  );
}
