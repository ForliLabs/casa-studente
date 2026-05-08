"use client";

import { useActionState, useMemo, useState } from "react";
import { completeOnboardingAction, skipOnboardingAction } from "@/lib/actions/onboarding";
import { ArrowRight, Camera, CheckCircle, Home, MapPin, Search, Star, Upload } from "lucide-react";

interface OnboardingWizardProps {
  userRole: string;
  userName: string;
  userEmail: string;
}

const studentSteps = [
  { id: "profile", title: "Completa il profilo", icon: <Camera className="h-6 w-6" />, description: "Aggiungi una bio breve per presentarti a proprietari e coinquilini." },
  { id: "preferences", title: "Preferenze coinquilino", icon: <Star className="h-6 w-6" />, description: "Imposta ritmi e abitudini per migliorare i match." },
  { id: "search", title: "Prima ricerca", icon: <Search className="h-6 w-6" />, description: "Salva zona e budget iniziali per ricevere alert pertinenti." },
  { id: "browse", title: "Pronto a partire", icon: <Home className="h-6 w-6" />, description: "Conferma il riepilogo e vai subito agli annunci consigliati." },
];

const landlordSteps = [
  { id: "profile", title: "Profilo host", icon: <Upload className="h-6 w-6" />, description: "Configura le basi del tuo profilo prima di pubblicare." },
  { id: "listing", title: "Primo annuncio", icon: <Home className="h-6 w-6" />, description: "Inserisci titolo, indirizzo e prezzo del primo alloggio." },
  { id: "photos", title: "Foto e dettagli", icon: <Camera className="h-6 w-6" />, description: "Aggiungi foto, feature e punti d'interesse per evitare schede vuote." },
  { id: "publish", title: "Pubblicazione", icon: <MapPin className="h-6 w-6" />, description: "Rivedi i dati chiave e pubblica il tuo primo annuncio." },
];

export function OnboardingWizard({ userRole, userName, userEmail }: OnboardingWizardProps) {
  const [state, formAction, isPending] = useActionState(completeOnboardingAction, null);
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState({
    bio: "",
    preferredZone: "Campus",
    budgetMin: "250",
    budgetMax: "500",
    sleepSchedule: "flexible",
    socialPreference: "balanced",
    petTolerant: false,
    smokingTolerant: false,
    listingTitle: "",
    listingAddress: "",
    listingZone: "Centro",
    listingNeighborhood: "",
    listingType: "stanza singola",
    listingPrice: "",
    listingSize: "18",
    listingRooms: "1",
    listingBathrooms: "1",
    listingFloor: "2° piano",
    listingAvailableFrom: "",
    listingDescription: "",
    listingPhotos: "",
    listingFeatures: "",
    listingNearby: "",
  });

  const steps = useMemo(
    () => (userRole === "landlord" ? landlordSteps : studentSteps),
    [userRole],
  );
  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const markCompleted = () => new Set(Array.from({ length: currentStep }, (_, index) => index));
  const completedSteps = markCompleted();

  const updateValue = (key: keyof typeof values, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <form action={formAction} className="rounded-2xl border border-gray-200 bg-white shadow-xl">
      <input type="hidden" name="step" value="complete" />
      {Object.entries(values).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={typeof value === "boolean" ? String(value) : value} />
      ))}

      <div className="border-b border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Benvenuto{userRole === "landlord" ? "" : "/a"}, {userName.split(" ")[0]}! 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {userRole === "student"
            ? `Configuriamo il tuo profilo ${userEmail} per mostrarti annunci e coinquilini pertinenti.`
            : `Prepariamo il tuo primo annuncio host a partire dall'account ${userEmail}.`}
        </p>
      </div>

      <div className="flex border-b border-gray-100">
        {steps.map((item, index) => (
          <div key={item.id} className="flex flex-1 items-center">
            <div
              className={`flex w-full items-center justify-center gap-2 px-3 py-3 text-xs font-medium ${
                index === currentStep
                  ? "bg-blue-50 text-blue-700"
                  : completedSteps.has(index)
                    ? "text-green-600"
                    : "text-gray-400"
              }`}
            >
              {completedSteps.has(index) ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px]">{index + 1}</span>
              )}
              <span className="hidden sm:inline">{item.title}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-600">{step.icon}</div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{step.title}</h2>
            <p className="text-sm text-gray-500">{step.description}</p>
          </div>
        </div>

        {state?.error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {state.error}
          </div>
        )}

        <div className="mb-8 rounded-2xl border border-gray-200 bg-gray-50 p-6">
          {userRole === "student" && step.id === "profile" && (
            <div className="space-y-4">
              <label className="block text-left">
                <span className="text-sm font-medium text-gray-700">Breve presentazione</span>
                <textarea
                  value={values.bio}
                  onChange={(event) => updateValue("bio", event.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900"
                  placeholder="Racconta in poche righe chi sei, cosa studi e che tipo di casa cerchi."
                />
              </label>
              <p className="text-xs text-gray-500">Questo testo verrà usato per popolare il tuo profilo coinquilino iniziale.</p>
            </div>
          )}

          {userRole === "student" && step.id === "preferences" && (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-left">
                <span className="text-sm font-medium text-gray-700">Orario di sonno</span>
                <select
                  value={values.sleepSchedule}
                  onChange={(event) => updateValue("sleepSchedule", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900"
                >
                  <option value="late">Nottambulo</option>
                  <option value="early">Mattiniero</option>
                  <option value="flexible">Flessibile</option>
                </select>
              </label>
              <label className="block text-left">
                <span className="text-sm font-medium text-gray-700">Stile di convivenza</span>
                <select
                  value={values.socialPreference}
                  onChange={(event) => updateValue("socialPreference", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900"
                >
                  <option value="social">Socievole</option>
                  <option value="quiet">Tranquillo</option>
                  <option value="balanced">Bilanciato</option>
                </select>
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={values.petTolerant}
                  onChange={(event) => updateValue("petTolerant", event.target.checked)}
                />
                Animali ammessi
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={values.smokingTolerant}
                  onChange={(event) => updateValue("smokingTolerant", event.target.checked)}
                />
                Fumo tollerato
              </label>
            </div>
          )}

          {userRole === "student" && step.id === "search" && (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-left md:col-span-2">
                <span className="text-sm font-medium text-gray-700">Zona preferita</span>
                <select
                  value={values.preferredZone}
                  onChange={(event) => updateValue("preferredZone", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900"
                >
                  <option value="Centro">Centro</option>
                  <option value="Campus">Campus</option>
                  <option value="Stazione">Stazione</option>
                  <option value="San Benedetto">San Benedetto</option>
                  <option value="Cava">Cava</option>
                </select>
              </label>
              <label className="block text-left">
                <span className="text-sm font-medium text-gray-700">Budget minimo</span>
                <input
                  type="number"
                  min={150}
                  value={values.budgetMin}
                  onChange={(event) => updateValue("budgetMin", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900"
                />
              </label>
              <label className="block text-left">
                <span className="text-sm font-medium text-gray-700">Budget massimo</span>
                <input
                  type="number"
                  min={200}
                  value={values.budgetMax}
                  onChange={(event) => updateValue("budgetMax", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900"
                />
              </label>
            </div>
          )}

          {userRole === "student" && step.id === "browse" && (
            <div className="space-y-3 text-sm text-gray-600">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="font-semibold text-gray-900">Profilo pronto</p>
                <p className="mt-1">Bio: {values.bio || "Aggiungerai la bio più tardi"}</p>
                <p className="mt-1">Zona: {values.preferredZone} · Budget: €{values.budgetMin}–€{values.budgetMax}</p>
              </div>
              <p>Alla conferma creeremo una ricerca salvata e un profilo coinquilino iniziale.</p>
            </div>
          )}

          {userRole === "landlord" && step.id === "profile" && (
            <div className="space-y-4 text-sm text-gray-600">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="font-semibold text-gray-900">Profilo host attivo</p>
                <p className="mt-1">Useremo nome ed email del tuo account per il primo annuncio.</p>
              </div>
              <p>Nel passaggio successivo creerai un annuncio reale invece di lasciare il funnel incompleto.</p>
            </div>
          )}

          {userRole === "landlord" && step.id === "listing" && (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-left md:col-span-2">
                <span className="text-sm font-medium text-gray-700">Titolo annuncio</span>
                <input
                  value={values.listingTitle}
                  onChange={(event) => updateValue("listingTitle", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900"
                  placeholder="Stanza singola luminosa vicino al Campus"
                />
              </label>
              <label className="block text-left md:col-span-2">
                <span className="text-sm font-medium text-gray-700">Indirizzo</span>
                <input
                  value={values.listingAddress}
                  onChange={(event) => updateValue("listingAddress", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900"
                  placeholder="Via Cristoforo Colombo 21, Forlì"
                />
              </label>
              <label className="block text-left">
                <span className="text-sm font-medium text-gray-700">Zona</span>
                <select
                  value={values.listingZone}
                  onChange={(event) => updateValue("listingZone", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900"
                >
                  <option value="Centro">Centro</option>
                  <option value="Campus">Campus</option>
                  <option value="Stazione">Stazione</option>
                  <option value="San Benedetto">San Benedetto</option>
                  <option value="Cava">Cava</option>
                </select>
              </label>
              <label className="block text-left">
                <span className="text-sm font-medium text-gray-700">Tipo</span>
                <select
                  value={values.listingType}
                  onChange={(event) => updateValue("listingType", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900"
                >
                  <option value="stanza singola">Stanza singola</option>
                  <option value="stanza doppia">Stanza doppia</option>
                  <option value="monolocale">Monolocale</option>
                  <option value="bilocale">Bilocale</option>
                </select>
              </label>
              <label className="block text-left">
                <span className="text-sm font-medium text-gray-700">Prezzo mensile</span>
                <input
                  type="number"
                  min={150}
                  value={values.listingPrice}
                  onChange={(event) => updateValue("listingPrice", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900"
                  placeholder="360"
                />
              </label>
              <label className="block text-left">
                <span className="text-sm font-medium text-gray-700">Quartiere</span>
                <input
                  value={values.listingNeighborhood}
                  onChange={(event) => updateValue("listingNeighborhood", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900"
                  placeholder="Zona Campus"
                />
              </label>
            </div>
          )}

          {userRole === "landlord" && step.id === "photos" && (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-left md:col-span-2">
                <span className="text-sm font-medium text-gray-700">Foto (etichette separate da virgola)</span>
                <textarea
                  value={values.listingPhotos}
                  onChange={(event) => updateValue("listingPhotos", event.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900"
                  placeholder="Camera studio, Cucina condivisa, Cortile interno"
                />
              </label>
              <label className="block text-left md:col-span-2">
                <span className="text-sm font-medium text-gray-700">Caratteristiche</span>
                <input
                  value={values.listingFeatures}
                  onChange={(event) => updateValue("listingFeatures", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900"
                  placeholder="Wi‑Fi, Balcone, Lavatrice"
                />
              </label>
              <label className="block text-left md:col-span-2">
                <span className="text-sm font-medium text-gray-700">Punti vicini</span>
                <input
                  value={values.listingNearby}
                  onChange={(event) => updateValue("listingNearby", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900"
                  placeholder="8 min dal campus, Supermercato a 300m"
                />
              </label>
            </div>
          )}

          {userRole === "landlord" && step.id === "publish" && (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-left md:col-span-2">
                <span className="text-sm font-medium text-gray-700">Descrizione</span>
                <textarea
                  value={values.listingDescription}
                  onChange={(event) => updateValue("listingDescription", event.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900"
                  placeholder="Descrivi alloggio, servizi e target ideale."
                />
              </label>
              <label className="block text-left">
                <span className="text-sm font-medium text-gray-700">Superficie</span>
                <input
                  type="number"
                  min={10}
                  value={values.listingSize}
                  onChange={(event) => updateValue("listingSize", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900"
                />
              </label>
              <label className="block text-left">
                <span className="text-sm font-medium text-gray-700">Disponibile da</span>
                <input
                  value={values.listingAvailableFrom}
                  onChange={(event) => updateValue("listingAvailableFrom", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900"
                  placeholder="1 settembre 2026"
                />
              </label>
              <label className="block text-left">
                <span className="text-sm font-medium text-gray-700">Camere</span>
                <input
                  type="number"
                  min={1}
                  value={values.listingRooms}
                  onChange={(event) => updateValue("listingRooms", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900"
                />
              </label>
              <label className="block text-left">
                <span className="text-sm font-medium text-gray-700">Bagni</span>
                <input
                  type="number"
                  min={1}
                  value={values.listingBathrooms}
                  onChange={(event) => updateValue("listingBathrooms", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900"
                />
              </label>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <button
              type="submit"
              formAction={skipOnboardingAction}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Salta per ora
            </button>
          </div>
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={() => setCurrentStep((stepIndex) => stepIndex - 1)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Indietro
              </button>
            )}
            {isLastStep ? (
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isPending ? "Completamento..." : "Completa onboarding"}
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentStep((stepIndex) => stepIndex + 1)}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Avanti
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
