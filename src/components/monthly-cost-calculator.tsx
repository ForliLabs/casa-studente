"use client";

import { useMemo, useState } from "react";
import { calculateMonthlyCost } from "@/lib/stores";
import { cn } from "@/lib/utils";

interface MonthlyCostCalculatorProps {
  rent: number;
  utilities: string;
  zone: string;
}

export function MonthlyCostCalculator({ rent, utilities, zone }: MonthlyCostCalculatorProps) {
  const [roommates, setRoommates] = useState(1);

  const breakdown = useMemo(
    () => calculateMonthlyCost(rent, utilities, zone),
    [rent, utilities, zone]
  );

  const perPerson = useMemo(
    () => ({
      rent: Math.round(breakdown.rent / roommates),
      utilities: Math.round(breakdown.utilitiesEstimate / roommates),
      transport: breakdown.transportEstimate, // transport is per-person already
      total: Math.round((breakdown.rent + breakdown.utilitiesEstimate) / roommates) + breakdown.transportEstimate,
    }),
    [breakdown, roommates]
  );

  return (
    <div className="mt-8 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
            Calcolatore costi
          </p>
          <h3 className="mt-1 text-lg font-semibold text-gray-900">
            Stima costo mensile reale
          </h3>
        </div>
        <div className="rounded-xl bg-blue-600 px-4 py-2 text-white shadow">
          <p className="text-xs text-blue-200">Totale stimato</p>
          <p className="text-xl font-bold">&euro;{perPerson.total}</p>
          {roommates > 1 && <p className="text-xs text-blue-200">a persona</p>}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <CostRow label="Canone" value={perPerson.rent} note={roommates > 1 ? `€${rent} ÷ ${roommates} persone` : undefined} />
        <CostRow
          label="Utenze"
          value={perPerson.utilities}
          note={breakdown.utilitiesNote}
          included={breakdown.utilitiesIncluded && breakdown.utilitiesEstimate === 0}
        />
        <CostRow label="Trasporto" value={perPerson.transport} note={breakdown.transportNote} />
        <div className="border-t border-blue-200 pt-3">
          <CostRow label="Totale stimato" value={perPerson.total} bold />
        </div>
      </div>

      {/* Roommate splitter */}
      <div className="mt-5 rounded-xl bg-white/70 p-4">
        <p className="text-sm font-medium text-gray-700">Dividi tra coinquilini</p>
        <div className="mt-2 flex items-center gap-2">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRoommates(n)}
              aria-pressed={roommates === n}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-semibold transition",
                roommates === n
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {n === 1 ? "Solo" : `${n} persone`}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-400">
        I valori di utenze e trasporto sono stime indicative basate sulla zona e sul tipo di contratto.
      </p>
    </div>
  );
}

function CostRow({
  label,
  value,
  note,
  included,
  bold,
}: {
  label: string;
  value: number;
  note?: string;
  included?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className={cn("text-sm", bold ? "font-semibold text-gray-900" : "text-gray-700")}>
          {label}
        </p>
        {note && <p className="text-xs text-gray-400">{note}</p>}
      </div>
      <div className="text-right">
        {included ? (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
            Incluso
          </span>
        ) : (
          <p className={cn("text-sm", bold ? "font-bold text-gray-900" : "font-semibold text-gray-700")}>
            &euro;{value}
          </p>
        )}
      </div>
    </div>
  );
}
