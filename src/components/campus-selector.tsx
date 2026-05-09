"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { campusStore, type Campus } from "@/lib/stores/campus";
import { useDismissibleLayer } from "@/lib/hooks/use-dismissible-layer";

interface CampusSelectorProps {
  currentCampusId?: string;
  onCampusChange?: (campus: Campus) => void;
}

export function CampusSelector({ currentCampusId = "campus-forli", onCampusChange }: CampusSelectorProps) {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(currentCampusId);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useDismissibleLayer<HTMLDivElement>({
    isOpen: open,
    onDismiss: () => setOpen(false),
    triggerRef,
  });

  useEffect(() => {
    campusStore.findAll().then(setCampuses);
  }, []);

  const selectedCampus = campuses.find((c) => c.id === selected);

  const handleSelect = (campus: Campus) => {
    setSelected(campus.id);
    setOpen(false);
    onCampusChange?.(campus);
  };

  if (campuses.length === 0) {
    return (
      <div className="inline-flex h-10 w-36 animate-pulse rounded-lg border border-gray-200 bg-gray-100" />
    );
  }

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <MapPin className="h-4 w-4 text-blue-600" />
        <span>{selectedCampus?.city || "Forlì"}</span>
        <svg className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div ref={menuRef} className="absolute left-0 top-full z-50 mt-1 w-72 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
          {campuses.map((campus) => (
            <button
              key={campus.id}
              type="button"
              onClick={() => handleSelect(campus)}
              className={`flex w-full items-start gap-3 rounded-lg p-3 text-left transition ${
                campus.id === selected ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
            >
              <MapPin className={`mt-0.5 h-4 w-4 ${campus.id === selected ? "text-blue-600" : "text-gray-400"}`} />
              <div>
                <p className={`text-sm font-medium ${campus.id === selected ? "text-blue-700" : "text-gray-900"}`}>
                  {campus.campusName}
                </p>
                <p className="text-xs text-gray-500">{campus.description.slice(0, 80)}...</p>
                <p className="mt-1 text-xs text-gray-400">~{campus.studentCount.toLocaleString()} studenti</p>
              </div>
            </button>
          ))}
          <div className="mt-1 border-t border-gray-100 pt-2">
            <p className="px-3 py-1 text-xs text-gray-400">
              CasaStudente è disponibile per tutti i campus UniBo Romagna
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
