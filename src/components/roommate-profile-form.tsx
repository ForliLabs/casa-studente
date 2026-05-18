"use client";

import { useActionState, useEffect, useState } from "react";
import { upsertRoommateProfileAction } from "@/lib/actions/roommates";
import { useToast } from "@/components/toast";
import { cn } from "@/lib/utils";

interface RoommateProfileData {
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
}

interface RoommateProfileFormProps {
  existingProfile: RoommateProfileData | null;
}

const ZONES = ["Campus", "Centro", "Stazione", "San Benedetto", "Cava", "Ronco", "Ospedaletto"];

const sleepOptions = [
  { value: "early", label: "Mattiniero" },
  { value: "late", label: "Nottambulo" },
  { value: "flexible", label: "Flessibile" },
];

const socialOptions = [
  { value: "quiet", label: "Tranquillo" },
  { value: "balanced", label: "Equilibrato" },
  { value: "social", label: "Socievole" },
];

export function RoommateProfileForm({ existingProfile }: RoommateProfileFormProps) {
  const [state, formAction, isPending] = useActionState(upsertRoommateProfileAction, null);
  const { showToast } = useToast();
  // When the user intentionally dismisses the success panel to make edits again.
  const [editingAfterSuccess, setEditingAfterSuccess] = useState(false);

  useEffect(() => {
    if (!state) return;
    if (state.error) showToast(state.error, "error");
    // Success is communicated via the dedicated success panel; no toast needed.
  }, [showToast, state]);

  // Show a clear success panel after a successful save, unless the user chose to
  // go back to editing. This prevents accidental re-submission.
  if (state?.success && !editingAfterSuccess) {
    return (
      <div
        className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 shadow-sm"
        role="status"
        aria-live="polite"
      >
        <div className="text-center">
          <span className="text-4xl" aria-hidden="true">✓</span>
          <p className="mt-4 text-xl font-semibold text-emerald-800">
            {state.isUpdate ? "Profilo aggiornato!" : "Profilo creato con successo!"}
          </p>
          <p className="mt-2 text-sm text-emerald-700">
            {state.isUpdate
              ? "Le tue preferenze sono state salvate. I match vengono ricalcolati automaticamente."
              : "Il tuo profilo è ora visibile agli altri studenti. Puoi modificarlo in qualsiasi momento."}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href="/roommates"
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Scopri i coinquilini
            </a>
            <button
              type="button"
              onClick={() => setEditingAfterSuccess(true)}
              className="rounded-xl border border-emerald-300 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              Modifica ancora
            </button>
          </div>
        </div>
      </div>
    );
  }

  const defaults = existingProfile ?? {
    studyProgram: "",
    languages: ["Italiano"],
    budgetMin: 250,
    budgetMax: 500,
    sleepSchedule: "flexible",
    cleanliness: 3,
    socialPreference: "balanced",
    petTolerant: false,
    smokingTolerant: false,
    bio: "",
    preferredZones: ["Centro"],
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-900">
        {existingProfile ? "Modifica profilo coinquilino" : "Crea il tuo profilo coinquilino"}
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        {existingProfile
          ? "Aggiorna le tue preferenze per migliorare i match."
          : "Completa il profilo per trovare coinquilini compatibili e ottenere punteggi personalizzati."}
      </p>

      <form action={formAction} className="mt-6 space-y-6">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Corso di studio</span>
          <input
            name="studyProgram"
            required
            defaultValue={defaults.studyProgram}
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
            placeholder="Es. Ingegneria Aerospaziale"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Lingue parlate</span>
          <input
            name="languages"
            required
            defaultValue={defaults.languages.join(", ")}
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
            placeholder="Es. Italiano, English, Español"
          />
          <p className="mt-1 text-xs text-gray-400">Separate da virgola</p>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Budget minimo (€/mese)</span>
            <input
              name="budgetMin"
              type="number"
              required
              min={0}
              max={10000}
              defaultValue={defaults.budgetMin}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Budget massimo (€/mese)</span>
            <input
              name="budgetMax"
              type="number"
              required
              min={1}
              max={10000}
              defaultValue={defaults.budgetMax}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
            />
          </label>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-gray-700">Orario di sonno</legend>
          <div className="mt-2 flex flex-wrap gap-3">
            {sleepOptions.map((opt) => (
              <label
                key={opt.value}
                className={cn(
                  "cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-medium transition",
                  "has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-700",
                  "border-gray-200 text-gray-700 hover:bg-gray-50"
                )}
              >
                <input
                  type="radio"
                  name="sleepSchedule"
                  value={opt.value}
                  defaultChecked={defaults.sleepSchedule === opt.value}
                  className="sr-only"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium text-gray-700">Livello di pulizia</legend>
          <div className="mt-2 flex flex-wrap gap-3">
            {[1, 2, 3, 4, 5].map((level) => (
              <label
                key={level}
                className={cn(
                  "cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-medium transition",
                  "has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-700",
                  "border-gray-200 text-gray-700 hover:bg-gray-50"
                )}
              >
                <input
                  type="radio"
                  name="cleanliness"
                  value={level}
                  defaultChecked={defaults.cleanliness === level}
                  className="sr-only"
                  aria-label={`${level} ${level === 1 ? "stella" : "stelle"} su 5`}
                />
                <span aria-hidden="true">{"★".repeat(level)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium text-gray-700">Preferenza sociale</legend>
          <div className="mt-2 flex flex-wrap gap-3">
            {socialOptions.map((opt) => (
              <label
                key={opt.value}
                className={cn(
                  "cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-medium transition",
                  "has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-700",
                  "border-gray-200 text-gray-700 hover:bg-gray-50"
                )}
              >
                <input
                  type="radio"
                  name="socialPreference"
                  value={opt.value}
                  defaultChecked={defaults.socialPreference === opt.value}
                  className="sr-only"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
            <input
              type="hidden"
              name="petTolerant"
              value="false"
            />
            <input
              type="checkbox"
              name="petTolerant"
              value="true"
              defaultChecked={defaults.petTolerant}
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
            />
            <span className="text-sm text-gray-700">🐾 Animali ammessi</span>
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
            <input
              type="hidden"
              name="smokingTolerant"
              value="false"
            />
            <input
              type="checkbox"
              name="smokingTolerant"
              value="true"
              defaultChecked={defaults.smokingTolerant}
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
            />
            <span className="text-sm text-gray-700">🚬 Fumatori ammessi</span>
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Zone preferite</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {ZONES.map((zone) => (
              <label
                key={zone}
                className={cn(
                  "cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition",
                  "has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-700",
                  "border-gray-200 text-gray-700 hover:bg-gray-50"
                )}
              >
                <input
                  type="checkbox"
                  name="zone_checkbox"
                  value={zone}
                  defaultChecked={defaults.preferredZones.includes(zone)}
                  className="sr-only"
                  onChange={(e) => {
                    const form = e.target.form;
                    if (!form) return;
                    const checkboxes = form.querySelectorAll<HTMLInputElement>('input[name="zone_checkbox"]');
                    const selected = Array.from(checkboxes)
                      .filter((cb) => cb.checked)
                      .map((cb) => cb.value);
                    const hidden = form.querySelector<HTMLInputElement>('input[name="preferredZones"]');
                    if (hidden) hidden.value = selected.join(", ");
                  }}
                />
                {zone}
              </label>
            ))}
          </div>
          <input type="hidden" name="preferredZones" defaultValue={defaults.preferredZones.join(", ")} />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Bio</span>
          <textarea
            name="bio"
            required
            minLength={10}
            rows={4}
            defaultValue={defaults.bio}
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500"
            placeholder="Raccontati in poche righe: cosa studi, i tuoi interessi, cosa cerchi in un coinquilino..."
          />
        </label>

        {state?.error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
            {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {isPending
            ? "Salvataggio..."
            : existingProfile
              ? "Aggiorna profilo"
              : "Crea profilo"}
        </button>
      </form>
    </div>
  );
}
