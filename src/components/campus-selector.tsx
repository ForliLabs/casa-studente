"use client";

import { useState, useEffect } from "react";
import { campusStore, type Campus } from "@/lib/stores/campus";
import { MapPin } from "lucide-react";

interface CampusSelectorProps {
  currentCampusId?: string;
  onCampusChange?: (campus: Campus) => void;
}

export function CampusSelector({ currentCampusId = "campus-forli", onCampusChange }: CampusSelectorProps) {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(currentCampusId);

  useEffect(() => {
    campusStore.findAll().then(setCampuses);
  }, []);

  const selectedCampus = campuses.find((c) => c.id === selected);

  const handleSelect = (campus: Campus) => {
    setSelected(campus.id);
    setOpen(false);
    onCampusChange?.(campus);
  };

  if (campuses.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <MapPin className="h-4 w-4 text-blue-600" />
        <span>{selectedCampus?.city || "Forlì"}</span>
        <svg className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
          {campuses.map((campus) => (
            <button
              key={campus.id}
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
