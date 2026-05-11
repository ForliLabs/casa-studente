"use client";

import Link from "next/link";
import { RoommateIntroButton } from "@/components/roommate-intro-button";
import { cn } from "@/lib/utils";

interface RoommateProfileDisplay {
  id: string;
  recipientId: string;
  recipientEmail: string;
  name: string;
  studyProgram: string;
  languages: string[];
  budgetMin: number;
  budgetMax: number;
  sleepSchedule: string;
  cleanliness: number;
  socialPreference: string;
  petTolerant: boolean;
  smokingTolerant: boolean;
  bio: string;
  preferredZones: string[];
  compatibility: number | null;
  matchReasons: string[];
}

interface RoommateListProps {
  profiles: RoommateProfileDisplay[];
  hasProfile: boolean;
  isLoggedIn: boolean;
}

const sleepLabels: Record<string, string> = {
  early: "Mattiniero",
  late: "Nottambulo",
  flexible: "Flessibile",
};

const socialLabels: Record<string, string> = {
  quiet: "Tranquillo",
  social: "Socievole",
  balanced: "Equilibrato",
};

export function RoommateList({ profiles, hasProfile, isLoggedIn }: RoommateListProps) {
  return (
    <div className="space-y-6">
      {!isLoggedIn && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
          <Link href="/auth/login" className="font-medium underline">Accedi</Link> e completa il tuo profilo per vedere i punteggi di compatibilità e scrivere direttamente ai match migliori.
        </div>
      )}

      {isLoggedIn && !hasProfile && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Completa il tuo profilo coinquilino per ottenere punteggi personalizzati e inviare intro più mirate. <Link href="/onboarding" className="font-medium underline">Completa onboarding</Link>.
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {profiles.map((profile) => (
          <article
            key={profile.id}
            className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{profile.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{profile.studyProgram}</p>
                </div>
                {profile.compatibility !== null && (
                  <div
                    className={cn(
                      "flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold",
                      profile.compatibility >= 80
                        ? "bg-emerald-100 text-emerald-700"
                        : profile.compatibility >= 60
                          ? "bg-blue-100 text-blue-700"
                          : profile.compatibility >= 40
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-700"
                    )}
                  >
                    {profile.compatibility}%
                  </div>
                )}
              </div>

              <p className="mt-3 text-sm leading-6 text-gray-600">{profile.bio}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {profile.languages.map((lang) => (
                  <span
                    key={lang}
                    className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                  >
                    {lang}
                  </span>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Budget</p>
                  <p className="font-medium text-gray-900">€{profile.budgetMin}–{profile.budgetMax}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Orario</p>
                  <p className="font-medium text-gray-900">{sleepLabels[profile.sleepSchedule]}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Socialità</p>
                  <p className="font-medium text-gray-900">{socialLabels[profile.socialPreference]}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Pulizia</p>
                  <div role="img" aria-label={`${profile.cleanliness} su 5 stelle`} className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        aria-hidden="true"
                        className={star <= profile.cleanliness ? "text-amber-500" : "text-gray-300"}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Perché potrebbe funzionare</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {profile.matchReasons.map((reason) => (
                    <li key={reason}>• {reason}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
                {profile.petTolerant && (
                  <span className="rounded-full bg-green-50 px-2 py-1 text-green-700">🐾 Animali ok</span>
                )}
                {profile.smokingTolerant && (
                  <span className="rounded-full bg-orange-50 px-2 py-1 text-orange-700">🚬 Fumatori ok</span>
                )}
                {!profile.petTolerant && (
                  <span className="rounded-full bg-red-50 px-2 py-1 text-red-700">🚫 No animali</span>
                )}
                {!profile.smokingTolerant && (
                  <span className="rounded-full bg-red-50 px-2 py-1 text-red-700">🚭 No fumo</span>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="text-xs text-gray-500">Zone preferite:</span>
                {profile.preferredZones.map((zone) => (
                  <span key={zone} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                    {zone}
                  </span>
                ))}
              </div>

              {!isLoggedIn ? (
                <Link
                  href="/auth/login"
                  className="mt-5 block w-full rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Accedi per contattare
                </Link>
              ) : hasProfile ? (
                <RoommateIntroButton
                  profileId={profile.id}
                  recipientId={profile.recipientId}
                  recipientEmail={profile.recipientEmail}
                  recipientName={profile.name}
                  studyProgram={profile.studyProgram}
                  matchReasons={profile.matchReasons}
                />
              ) : (
                <Link
                  href="/onboarding"
                  className="mt-5 block w-full rounded-xl bg-gray-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Completa profilo per scrivere
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>

      {profiles.length === 0 && (
        <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <p className="text-lg font-semibold text-gray-900">Nessun profilo trovato</p>
          <p className="mt-2 text-sm text-gray-500">
            Sii il primo a creare il tuo profilo coinquilino!
          </p>
        </div>
      )}
    </div>
  );
}
