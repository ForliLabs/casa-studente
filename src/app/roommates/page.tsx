import type { Metadata } from "next";
import { getCurrentUser, userStore } from "@/lib/auth";
import { roommateStore, calculateCompatibility, type RoommateProfile } from "@/lib/stores";
import { RoommateList } from "@/components/roommate-list";
import { SearchTogetherPanel } from "@/components/search-together-panel";

export const metadata: Metadata = {
  title: "Coinquilini",
  description: "Trova il coinquilino ideale per condividere un appartamento a Forlì.",
};

export default async function RoommatesPage() {
  const [user, profiles, users] = await Promise.all([
    getCurrentUser(),
    roommateStore.findAll(),
    userStore.findAll(),
  ]);

  const currentProfile = user ? profiles.find((profile) => profile.userId === user.id) || null : null;
  const userMap = new Map(users.map((candidate) => [candidate.id, candidate]));

  const profilesWithScores = profiles
    .filter((profile) => profile.userId !== user?.id)
    .map((profile) => ({
      ...profile,
      recipientId: profile.userId,
      recipientEmail: userMap.get(profile.userId)?.email || "",
      compatibility: currentProfile ? calculateCompatibility(currentProfile, profile) : null,
      matchReasons: buildMatchReasons(currentProfile, profile),
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
            Scopri profili compatibili con il tuo stile di vita, budget e preferenze. Ogni card evidenzia
            perché il match potrebbe funzionare e ti permette di inviare un&apos;intro in un click.
          </p>
        </div>

        <div className="mt-10 space-y-8">
          {currentProfile && profilesWithScores.length > 0 && (
            <SearchTogetherPanel
              roommates={profilesWithScores.map((p) => ({
                id: p.id,
                name: p.name,
                compatibility: p.compatibility,
                budgetMin: p.budgetMin,
                budgetMax: p.budgetMax,
                preferredZones: p.preferredZones,
              }))}
            />
          )}

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

function buildMatchReasons(currentProfile: RoommateProfile | null, profile: RoommateProfile) {
  if (!currentProfile) {
    return [
      `Budget indicativo €${profile.budgetMin}-${profile.budgetMax}`,
      `Zone preferite: ${profile.preferredZones.slice(0, 2).join(", ")}`,
      `Stile di convivenza: ${profile.socialPreference}`,
    ];
  }

  const reasons: string[] = [];
  const budgetOverlapMin = Math.max(currentProfile.budgetMin, profile.budgetMin);
  const budgetOverlapMax = Math.min(currentProfile.budgetMax, profile.budgetMax);
  if (budgetOverlapMin <= budgetOverlapMax) {
    reasons.push(`Budget compatibile: €${budgetOverlapMin}-${budgetOverlapMax}`);
  }

  const sharedZones = currentProfile.preferredZones.filter((zone) => profile.preferredZones.includes(zone));
  if (sharedZones.length > 0) {
    reasons.push(`Zone in comune: ${sharedZones.slice(0, 2).join(", ")}`);
  }

  const sharedLanguages = currentProfile.languages.filter((language) => profile.languages.includes(language));
  if (sharedLanguages.length > 0) {
    reasons.push(`Lingue condivise: ${sharedLanguages.slice(0, 2).join(", ")}`);
  }

  if (reasons.length < 3) {
    reasons.push(`Routine ${profile.sleepSchedule === "early" ? "mattiniera" : profile.sleepSchedule === "late" ? "serale" : "flessibile"}`);
  }

  return reasons.slice(0, 3);
}
