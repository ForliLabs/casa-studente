"use client";

import { useState, useMemo } from "react";
import {
  campusCoordinates,
  listingCoordinates,
  calculateDistance,
  getWalkingTime,
  getCyclingTime,
} from "@/lib/stores";

interface ListingPin {
  id: string;
  title: string;
  price: number;
  type: string;
  address: string;
  lat: number;
  lng: number;
}

interface ListingMapProps {
  listings: ListingPin[];
  selectedId?: string;
  onSelectListing?: (id: string) => void;
  singleListing?: boolean;
}

export function ListingMap({ listings, selectedId, onSelectListing, singleListing }: ListingMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const pinsWithCoords = useMemo(() => {
    return listings
      .filter((l) => listingCoordinates[l.id])
      .map((l) => ({
        ...l,
        lat: listingCoordinates[l.id].lat,
        lng: listingCoordinates[l.id].lng,
        distanceFromCampus: calculateDistance(
          listingCoordinates[l.id].lat,
          listingCoordinates[l.id].lng,
          campusCoordinates.lat,
          campusCoordinates.lng
        ),
      }));
  }, [listings]);

  // Normalize coordinates to SVG viewBox
  const allLats = [...pinsWithCoords.map((p) => p.lat), campusCoordinates.lat];
  const allLngs = [...pinsWithCoords.map((p) => p.lng), campusCoordinates.lng];
  const minLat = Math.min(...allLats) - 0.002;
  const maxLat = Math.max(...allLats) + 0.002;
  const minLng = Math.min(...allLngs) - 0.002;
  const maxLng = Math.max(...allLngs) + 0.002;

  function toSvgX(lng: number) {
    return ((lng - minLng) / (maxLng - minLng)) * 600;
  }
  function toSvgY(lat: number) {
    return 400 - ((lat - minLat) / (maxLat - minLat)) * 400;
  }

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
        <svg viewBox="0 0 600 400" className="h-full w-full" style={{ minHeight: singleListing ? 300 : 400 }} role="group" aria-label="Mappa degli annunci con posizioni relative al campus">
          {/* Grid lines for reference */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={`h-${i}`} x1={0} y1={i * 100} x2={600} y2={i * 100} stroke="#e5e7eb" strokeWidth={0.5} />
          ))}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <line key={`v-${i}`} x1={i * 100} y1={0} x2={i * 100} y2={400} stroke="#e5e7eb" strokeWidth={0.5} />
          ))}

          {/* Roads (simplified) */}
          <path d="M 0 200 L 600 200" stroke="#d1d5db" strokeWidth={3} strokeDasharray="8 4" />
          <path d="M 300 0 L 300 400" stroke="#d1d5db" strokeWidth={3} strokeDasharray="8 4" />

          {/* Campus marker */}
          <g transform={`translate(${toSvgX(campusCoordinates.lng)}, ${toSvgY(campusCoordinates.lat)})`}>
            <circle r={20} fill="#059669" fillOpacity={0.15} />
            <circle r={10} fill="#059669" fillOpacity={0.3} />
            <circle r={5} fill="#059669" />
            <text y={-14} textAnchor="middle" className="text-xs font-bold" fill="#059669">
              🎓 Campus
            </text>
          </g>

          {/* Listing pins */}
          {pinsWithCoords.map((pin) => {
            const isActive = pin.id === selectedId || pin.id === hoveredId;
            return (
              <g
                key={pin.id}
                transform={`translate(${toSvgX(pin.lng)}, ${toSvgY(pin.lat)})`}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`${pin.title}, €${pin.price}`}
                onMouseEnter={() => setHoveredId(pin.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(pin.id)}
                onBlur={() => setHoveredId(null)}
                onClick={() => onSelectListing?.(pin.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectListing?.(pin.id);
                  }
                }}
              >
                {/* Distance line to campus */}
                {isActive && (
                  <line
                    x1={0} y1={0}
                    x2={toSvgX(campusCoordinates.lng) - toSvgX(pin.lng)}
                    y2={toSvgY(campusCoordinates.lat) - toSvgY(pin.lat)}
                    stroke="#2563eb"
                    strokeWidth={1}
                    strokeDasharray="4 2"
                    opacity={0.5}
                  />
                )}
                <circle r={isActive ? 18 : 14} fill={isActive ? "#1d4ed8" : "#2563eb"} fillOpacity={isActive ? 0.2 : 0.1} />
                <circle r={isActive ? 8 : 6} fill={isActive ? "#1d4ed8" : "#2563eb"} />
                <text y={-12} textAnchor="middle" className="text-xs font-bold" fill={isActive ? "#1d4ed8" : "#1e40af"}>
                  €{pin.price}
                </text>
                {isActive && (
                  <>
                    <rect x={-70} y={12} width={140} height={40} rx={6} fill="white" stroke="#e5e7eb" />
                    <text x={0} y={28} textAnchor="middle" className="text-xs font-medium" fill="#111827">
                      {pin.title.slice(0, 25)}
                    </text>
                    <text x={0} y={42} textAnchor="middle" className="text-xs" fill="#6b7280">
                      {getWalkingTime(pin.distanceFromCampus)} min a piedi
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>

        <div className="absolute bottom-3 left-3 rounded-xl bg-white/90 px-3 py-2 text-xs text-gray-500 shadow backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /> Campus
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> Annunci
          </div>
        </div>
      </div>

      {/* Distance list */}
      {!singleListing && pinsWithCoords.length > 0 && (
        <div className="rounded-2xl bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-900">Distanze dal campus</h3>
          <div className="mt-3 space-y-2">
            {pinsWithCoords
              .sort((a, b) => a.distanceFromCampus - b.distanceFromCampus)
              .map((pin) => (
                <div
                  key={pin.id}
                  className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm"
                >
                  <span className="font-medium text-gray-900">{pin.address}</span>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>🚶 {getWalkingTime(pin.distanceFromCampus)} min</span>
                    <span>🚲 {getCyclingTime(pin.distanceFromCampus)} min</span>
                    <span>{pin.distanceFromCampus}m</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Single listing map for detail page
interface SingleListingMapProps {
  listingId: string;
  address: string;
  nearby: string[];
}

export function SingleListingMap({ listingId, address, nearby }: SingleListingMapProps) {
  const coords = listingCoordinates[listingId];
  const distance = coords
    ? calculateDistance(coords.lat, coords.lng, campusCoordinates.lat, campusCoordinates.lng)
    : null;

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-900">Posizione</h2>
      <p className="mt-2 text-sm text-gray-500">
        Una vista rapida sul quartiere e sui collegamenti utili per la vita universitaria.
      </p>
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <ListingMap
          listings={[{
            id: listingId,
            title: address,
            price: 0,
            type: "",
            address,
            lat: coords?.lat ?? campusCoordinates.lat,
            lng: coords?.lng ?? campusCoordinates.lng,
          }]}
          selectedId={listingId}
          singleListing
        />
        <div className="rounded-3xl bg-gray-50 p-6">
          <h3 className="text-lg font-semibold text-gray-900">Nei dintorni</h3>
          {distance && (
            <div className="mt-3 rounded-xl bg-blue-50 p-3">
              <p className="text-sm font-medium text-blue-700">
                🎓 Campus: {distance}m ({getWalkingTime(distance)} min a piedi, {getCyclingTime(distance)} min in bici)
              </p>
            </div>
          )}
          <ul className="mt-4 space-y-3 text-sm text-gray-600">
            {nearby.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
