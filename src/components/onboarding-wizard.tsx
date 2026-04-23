"use client";

import { useState } from "react";
import { completeOnboardingAction, skipOnboardingAction } from "@/lib/actions/onboarding";
import { ArrowRight, Camera, CheckCircle, Home, MapPin, Search, Star, Upload } from "lucide-react";

interface OnboardingWizardProps {
  userRole: string;
  userName: string;
  userEmail: string;
}

const studentSteps = [
  { id: "profile", title: "Completa il profilo", icon: <Camera className="h-6 w-6" />, description: "Aggiungi foto e bio per farti conoscere dai proprietari" },
  { id: "preferences", title: "Preferenze coinquilino", icon: <Star className="h-6 w-6" />, description: "Imposta le tue preferenze per trovare coinquilini compatibili" },
  { id: "search", title: "Prima ricerca", icon: <Search className="h-6 w-6" />, description: "Salva la tua prima ricerca per ricevere notifiche" },
  { id: "browse", title: "Esplora annunci", icon: <Home className="h-6 w-6" />, description: "Sfoglia 3 annunci consigliati per te" },
];

const landlordSteps = [
  { id: "profile", title: "Verifica identità", icon: <Upload className="h-6 w-6" />, description: "Carica un documento per verificare la tua identità" },
  { id: "listing", title: "Primo annuncio", icon: <Home className="h-6 w-6" />, description: "Crea il tuo primo annuncio con descrizione AI" },
  { id: "photos", title: "Aggiungi foto", icon: <Camera className="h-6 w-6" />, description: "Aggiungi foto di qualità con i nostri consigli" },
  { id: "publish", title: "Pubblica e condividi", icon: <MapPin className="h-6 w-6" />, description: "Pubblica l'annuncio e condividilo con gli studenti" },
];

export function OnboardingWizard({ userRole, userName }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const steps = userRole === "landlord" ? landlordSteps : studentSteps;
  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleComplete = () => {
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    if (isLastStep) {
      // Submit final step
      const formData = new FormData();
      formData.set("step", "complete");
      completeOnboardingAction(formData);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-xl">
      {/* Header */}
      <div className="border-b border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Benvenuto{userRole === "landlord" ? "" : "/a"}, {userName.split(" ")[0]}! 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {userRole === "student"
            ? "Completa questi passaggi per trovare il tuo alloggio ideale a Forlì"
            : "Configura il tuo profilo e pubblica il primo annuncio"}
        </p>
      </div>

      {/* Progress */}
      <div className="flex border-b border-gray-100">
        {steps.map((s, i) => (
          <div key={s.id} className="flex flex-1 items-center">
            <div className={`flex w-full items-center justify-center gap-2 px-3 py-3 text-xs font-medium ${
              i === currentStep ? "bg-blue-50 text-blue-700" :
              completedSteps.has(i) ? "text-green-600" : "text-gray-400"
            }`}>
              {completedSteps.has(i) ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px]">{i + 1}</span>
              )}
              <span className="hidden sm:inline">{s.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Current Step */}
      <div className="p-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
            {step.icon}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{step.title}</h2>
            <p className="text-sm text-gray-500">{step.description}</p>
          </div>
        </div>

        {/* Step content placeholder */}
        <div className="mb-8 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center">
          {step.id === "profile" && userRole === "student" && (
            <div className="space-y-4">
              <div className="mx-auto h-24 w-24 rounded-full bg-gray-200" />
              <p className="text-sm text-gray-500">Carica una foto profilo</p>
              <textarea
                className="w-full rounded-lg border border-gray-300 p-3 text-sm"
                placeholder="Scrivi una breve presentazione..."
                rows={3}
              />
            </div>
          )}
          {step.id === "preferences" && (
            <div className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-gray-700">Orario di sonno</label>
                <select className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm">
                  <option>Nottambulo (tardi)</option>
                  <option>Mattiniero (presto)</option>
                  <option>Flessibile</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Preferenza sociale</label>
                <select className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm">
                  <option>Socievole</option>
                  <option>Tranquillo</option>
                  <option>Bilanciato</option>
                </select>
              </div>
            </div>
          )}
          {step.id === "search" && (
            <div className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-gray-700">Zona preferita</label>
                <select className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm">
                  <option>Centro</option>
                  <option>Campus</option>
                  <option>Stazione</option>
                  <option>San Benedetto</option>
                  <option>Cava</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Budget min</label>
                  <input type="number" className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm" placeholder="€200" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Budget max</label>
                  <input type="number" className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm" placeholder="€500" />
                </div>
              </div>
            </div>
          )}
          {(step.id === "browse" || step.id === "listing" || step.id === "photos" || step.id === "publish") && (
            <p className="text-sm text-gray-500">{step.description}</p>
          )}
          {step.id === "profile" && userRole === "landlord" && (
            <div className="space-y-4">
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-6">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Trascina qui il documento d&apos;identità</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <form action={skipOnboardingAction}>
            <button type="submit" className="text-sm text-gray-400 hover:text-gray-600">
              Salta per ora
            </button>
          </form>
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Indietro
              </button>
            )}
            <button
              onClick={handleComplete}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {isLastStep ? "Completa" : "Avanti"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
