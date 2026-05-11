"use client";

import { useState } from "react";
import Link from "next/link";
import {
  quizQuestions,
  calculateQuizResults,
  type Neighborhood,
} from "@/lib/stores/neighborhoods";
import { neighborhoodStore } from "@/lib/stores/neighborhoods";
import { getBudgetFilterFromQuiz } from "@/lib/listings-search";
import { ArrowLeft, ArrowRight, CheckCircle, MapPin } from "lucide-react";

interface QuizResult {
  neighborhood: Neighborhood;
  score: number;
  reasons: string[];
}

export default function NeighborhoodQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<QuizResult[] | null>(null);

  const question = quizQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === quizQuestions.length - 1;
  const hasAnswer = answers[question?.id] !== undefined;

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const handleNext = async () => {
    if (isLastQuestion) {
      const neighborhoods = await neighborhoodStore.findAll();
      const scored = calculateQuizResults(answers, neighborhoods).map((result) => ({
        ...result,
        reasons: buildReasons(result.neighborhood, answers),
      }));
      setResults(scored);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  if (results) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 text-center">
          <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-500" />
          <h1 className="text-3xl font-bold text-gray-900">Il tuo quartiere ideale</h1>
          <p className="mt-2 text-gray-600">Abbiamo trasformato le tue risposte in una shortlist pronta da esplorare.</p>
        </div>

        <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Le tue priorità</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {quizQuestions.map((quizQuestion) => {
              const selected = quizQuestion.options.find((option) => option.value === answers[quizQuestion.id]);
              if (!selected) return null;
              return (
                <span key={quizQuestion.id} className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                  {selected.label}
                </span>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          {results.slice(0, 3).map((result, index) => (
            <div
              key={result.neighborhood.id}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-lg font-bold ${
                      index === 0
                        ? "bg-yellow-100 text-yellow-700"
                        : index === 1
                          ? "bg-gray-100 text-gray-600"
                          : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                      <MapPin className="h-4 w-4" />
                      {result.neighborhood.zone}
                    </div>
                    <h2 className="mt-1 text-xl font-semibold text-gray-900">{result.neighborhood.name}</h2>
                    <p className="mt-2 text-sm text-gray-500">
                      Affitto medio: €{result.neighborhood.avgRent}/mese · Sicurezza: {result.neighborhood.safetyRating}/5 · Annunci: {result.neighborhood.listingCount}
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-3xl font-bold text-blue-600">{result.score}%</p>
                  <p className="text-xs text-gray-400">compatibilità</p>
                </div>
              </div>

              <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                {result.reasons.map((reason) => (
                  <li key={reason} className="rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-700">
                    {reason}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/listings?${buildListingsQuery(result.neighborhood.zone, answers)}`}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Vedi annunci in {result.neighborhood.zone}
                </Link>
                <Link
                  href={`/neighborhoods/${slugifyZone(result.neighborhood.zone)}`}
                  className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Approfondisci il quartiere
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => {
              setResults(null);
              setCurrentQuestion(0);
              setAnswers({});
            }}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Rifai il quiz
          </button>
          <Link
            href="/listings"
            className="rounded-lg bg-gray-900 px-6 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Sfoglia tutti gli annunci
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <Link href="/neighborhoods" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Quartieri
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">🎯 Trova il tuo quartiere ideale</h1>
        <p className="mt-2 text-gray-600">Rispondi a 5 domande per scoprire quale zona di Forlì fa per te e applicare subito i risultati agli annunci.</p>
      </div>

      <div className="mb-6 flex gap-1">
        {quizQuestions.map((_, index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded-full ${index <= currentQuestion ? "bg-blue-500" : "bg-gray-200"}`}
          />
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 p-6">
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">
          Domanda {currentQuestion + 1} di {quizQuestions.length}
        </p>
        <h2 className="mb-6 text-lg font-semibold text-gray-900">{question.question}</h2>

        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className={`w-full rounded-lg border-2 p-4 text-left text-sm font-medium transition ${
                answers[question.id] === option.value
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-30"
          >
            ← Indietro
          </button>
          <button
            onClick={handleNext}
            disabled={!hasAnswer}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-30"
          >
            {isLastQuestion ? "Vedi risultati" : "Avanti"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
}

function buildReasons(neighborhood: Neighborhood, answers: Record<string, string>) {
  const reasons: string[] = [];

  if (answers.q1) {
    reasons.push(`Budget coerente con un affitto medio di €${neighborhood.avgRent}.`);
  }
  if (answers.q3 === "short" && ["Campus", "Centro"].includes(neighborhood.zone)) {
    reasons.push("Spostamenti rapidi verso il campus e i poli centrali.");
  } else if (answers.q3 === "long") {
    reasons.push(`Hai margine per quartieri più convenienti come ${neighborhood.zone}.`);
  }
  if (answers.q5 === "very" && neighborhood.noiseLevel === "quiet") {
    reasons.push("Ambiente tranquillo, ideale per studio e riposo.");
  } else if (answers.q2 === "very" && neighborhood.nightlifeIndex >= 4) {
    reasons.push("Zona vivace con locali e servizi per la vita serale.");
  }
  if (reasons.length < 3) {
    reasons.push(`Servizi utili in zona: ${neighborhood.amenities.slice(0, 2).join(" e ")}.`);
  }

  return reasons.slice(0, 3);
}

function buildListingsQuery(zone: string, answers: Record<string, string>) {
  const params = new URLSearchParams({ zone, sort: "recommended" });
  const budget = getBudgetFilterFromQuiz(answers.q1);

  if (budget.minPrice !== undefined) params.set("minPrice", String(budget.minPrice));
  if (budget.maxPrice !== undefined) params.set("maxPrice", String(budget.maxPrice));

  return params.toString();
}

function slugifyZone(zone: string) {
  return zone.toLowerCase().replace(/\s+/g, "-");
}
