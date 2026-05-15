"use client";

import { useMemo, useState } from "react";
import type { ServiceCheck } from "@/lib/health";

interface StatusServiceBoardProps {
  services: Record<string, ServiceCheck>;
}

const statusStyles: Record<ServiceCheck["status"], string> = {
  connected: "bg-emerald-100 text-emerald-700",
  configured: "bg-emerald-100 text-emerald-700",
  not_configured: "bg-amber-100 text-amber-700",
  error: "bg-red-100 text-red-700",
};

export function StatusServiceBoard({ services }: StatusServiceBoardProps) {
  const [filter, setFilter] = useState<"all" | "attention" | "ready">("all");

  const serviceEntries = Object.entries(services);
  const filteredEntries = useMemo(() => {
    if (filter === "attention") {
      return serviceEntries.filter(([, service]) => service.status === "error" || service.status === "not_configured");
    }

    if (filter === "ready") {
      return serviceEntries.filter(([, service]) => service.status === "configured" || service.status === "connected");
    }

    return serviceEntries;
  }, [filter, serviceEntries]);

  const attentionCount = serviceEntries.filter(([, service]) => service.status === "error" || service.status === "not_configured").length;
  const readyCount = serviceEntries.length - attentionCount;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: `Tutti (${serviceEntries.length})` },
          { key: "attention", label: `Da verificare (${attentionCount})` },
          { key: "ready", label: `Pronti (${readyCount})` },
        ].map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setFilter(option.key as "all" | "attention" | "ready")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              filter === option.key
                ? "bg-slate-900 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredEntries.map(([serviceKey, service]) => (
          <div key={serviceKey} className="rounded-2xl border border-gray-100 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-gray-900">{service.label}</p>
                <p className="mt-1 text-sm text-gray-500">{service.details}</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${statusStyles[service.status]}`}>
                {service.status.replaceAll("_", " ")}
              </span>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              {service.recommendation ?? (service.critical ? "Servizio critico per il traffico live." : "Servizio opzionale ma raccomandato in produzione.")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
