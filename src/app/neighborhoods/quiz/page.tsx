"use client";

import { useState } from "react";
import Link from "next/link";
import {
  quizQuestions,
  calculateQuizResults,
  type Neighborhood,
} from "@/lib/stores/neighborhoods";
import { neighborhoodStore } from "@/lib/stores/neighborhoods";
import { ArrowLeft, ArrowRight, CheckCircle, MapPin } from "lucide-react";

export default function NeighborhoodQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<{ neighborhood: Neighborhood; score: number }[] | null>(null);

  const question = quizQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === quizQuestions.length - 1;
  const hasAnswer = answers[question?.id] !== undefined;

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const handleNext = async () => {
    if (isLastQuestion) {
      // Calculate results
      const neighborhoods = await neighborhoodStore.findAll();
      const scored = calculateQuizResults(answers, neighborhoods);
      setResults(scored);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  if (results) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8 text-center">
          <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-500" />
          <h1 className="text-2xl font-bold text-gray-900">Il tuo quartiere ideale</h1>
          <p className="mt-2 text-gray-600">Ecco i quartieri più adatti alle tue preferenze</p>
        </div>
        <div className="space-y-4">
          {results.slice(0, 3).map((result, i) => (
            <Link
              key={result.neighborhood.id}
              href={`/neighborhoods/${result.neighborhood.zone.toLowerCase().replace(/\s+/g, "-")}`}
              className="flex items-center gap-4 rounded-xl border border-gray-200 p-5 transition hover:shadow-md"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${
                i === 0 ? "bg-yellow-100 text-yellow-700" :
                i === 1 ? "bg-gray-100 text-gray-600" :
                "bg-amber-50 text-amber-600"
              }`}>
                {i + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{result.neighborhood.name}</h3>
                <p className="text-sm text-gray-500">
                  Affitto medio: €{result.neighborhood.avgRent}/mese · Sicurezza: {result.neighborhood.safetyRating}/5
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{result.score}%</p>
                <p className="text-xs text-gray-400">compatibilità</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => { setResults(null); setCurrentQuestion(0); setAnswers({}); }}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Rifai il quiz
          </button>
          <Link
            href="/listings"
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Cerca annunci →
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
        <p className="mt-2 text-gray-600">Rispondi a 5 domande per scoprire quale zona di Forlì fa per te</p>
      </div>

      {/* Progress */}
      <div className="mb-6 flex gap-1">
        {quizQuestions.map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full ${
              i <= currentQuestion ? "bg-blue-500" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Question */}
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
