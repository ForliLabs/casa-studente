"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { campusStore, type Campus } from "@/lib/stores/campus";
import { useDismissibleLayer } from "@/lib/hooks/use-dismissible-layer";

const campusPreferenceKey = "casastudente-campus";

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
    let cancelled = false;

    campusStore.findAll().then((availableCampuses) => {
      if (cancelled) return;
      setCampuses(availableCampuses);

      if (typeof window === "undefined") return;
      const storedCampusId = window.localStorage.getItem(campusPreferenceKey);
      const preferredCampusId = availableCampuses.some((campus) => campus.id === storedCampusId)
        ? storedCampusId
        : currentCampusId;

      if (preferredCampusId) {
        setSelected(preferredCampusId);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [currentCampusId]);

  const selectedCampus = campuses.find((c) => c.id === selected);

  const handleSelect = (campus: Campus) => {
    setSelected(campus.id);
    setOpen(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(campusPreferenceKey, campus.id);
    }
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
        aria-label="Seleziona campus"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <MapPin className="h-4 w-4 text-blue-600" />
        <span className="hidden text-xs font-medium text-gray-500 sm:inline">Campus</span>
        <span>{selectedCampus?.city || "Forlì"}</span>
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div ref={menuRef} className="absolute left-0 top-full z-50 mt-1 w-80 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
          <div className="border-b border-gray-100 px-3 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
              Multi-campus preview
            </p>
            <p className="mt-2 text-xs leading-5 text-gray-500">
              Scegli il campus UniBo Romagna da esplorare. Alcuni flussi restano ancora centrati su
              Forlì mentre estendiamo Cesena e Ravenna.
            </p>
          </div>
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
                <p className="mt-1 text-xs leading-5 text-gray-500">{campus.description}</p>
                <p className="mt-2 text-xs text-gray-400">~{campus.studentCount.toLocaleString()} studenti</p>
              </div>
            </button>
          ))}
          <div className="mt-1 border-t border-gray-100 px-3 py-3">
            <p className="text-xs leading-5 text-gray-400">
              La tua scelta viene salvata su questo dispositivo come preferenza di esplorazione.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
