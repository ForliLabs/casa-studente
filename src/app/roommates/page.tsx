import type { Metadata } from "next";
import { roommateStore, calculateCompatibility } from "@/lib/stores";
import { getCurrentUser } from "@/lib/auth";
import { RoommateList } from "@/components/roommate-list";

export const metadata: Metadata = {
  title: "Coinquilini",
  description: "Trova il coinquilino ideale per condividere un appartamento a Forlì.",
};

export default async function RoommatesPage() {
  const user = await getCurrentUser();
  const profiles = await roommateStore.findAll();

  // Calculate compatibility scores if user has a profile
  let currentProfile = null;
  if (user) {
    const userProfiles = await roommateStore.filter((p) => p.userId === user.id);
    currentProfile = userProfiles[0] || null;
  }

  const profilesWithScores = profiles
    .filter((p) => p.userId !== user?.id)
    .map((p) => ({
      ...p,
      compatibility: currentProfile ? calculateCompatibility(currentProfile, p) : null,
    }))
    .sort((a, b) => (b.compatibility ?? 0) - (a.compatibility ?? 0));

  return (
    <main className="flex-1 bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Matching coinquilini
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Trova il tuo coinquilino ideale
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Scopri profili compatibili con il tuo stile di vita, budget e preferenze. L&apos;algoritmo
            calcola un punteggio di compatibilità basato su orari, pulizia, socialità e altro.
          </p>
        </div>

        <div className="mt-10">
          <RoommateList
            profiles={profilesWithScores}
            hasProfile={!!currentProfile}
            isLoggedIn={!!user}
          />
        </div>
      </div>
    </main>
  );
}
