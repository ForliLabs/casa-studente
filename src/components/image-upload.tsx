"use client";

import { useState, useRef, type DragEvent } from "react";

interface ImageUploadProps {
  maxImages?: number;
  onImagesChange?: (images: string[]) => void;
}

export function ImageUpload({ maxImages = 10, onImagesChange }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const remaining = maxImages - images.length;
    const newImages: string[] = [];

    Array.from(files)
      .slice(0, remaining)
      .forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            newImages.push(result);
            if (newImages.length === Math.min(files.length, remaining)) {
              const updated = [...images, ...newImages];
              setImages(updated);
              onImagesChange?.(updated);
            }
          };
          reader.readAsDataURL(file);
        }
      });
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  function removeImage(index: number) {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onImagesChange?.(updated);
  }

  return (
    <div className="space-y-4">
      <div
        className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${
          dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="mt-3 text-sm font-medium text-gray-700">
          Trascina le foto qui o clicca per selezionarle
        </p>
        <p className="mt-1 text-xs text-gray-500">
          PNG, JPG, WebP fino a 10MB. Massimo {maxImages} foto.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((src, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-xl">
              <img src={src} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                className="absolute right-2 top-2 rounded-full bg-red-600 p-1 text-white opacity-0 transition group-hover:opacity-100"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {i === 0 && (
                <span className="absolute bottom-2 left-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
                  Principale
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400">
        {images.length}/{maxImages} foto caricate
      </p>
    </div>
  );
}

// Gallery lightbox for listing detail pages
interface ImageGalleryProps {
  images: string[];
  virtualTour?: boolean;
  virtualTourUrl?: string;
}

export function ImageGallery({ images, virtualTour, virtualTourUrl }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasRealImages = images.some((img) => img.startsWith("data:") || img.startsWith("http"));
  const displayImages = hasRealImages ? images : [];

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Foto e tour virtuale</h2>
          <p className="mt-2 text-sm text-gray-500">
            Esplora gli spazi principali dell&apos;alloggio prima di fissare una visita.
          </p>
        </div>
        {virtualTour && (
          <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
            Tour virtuale disponibile
          </span>
        )}
      </div>

      {displayImages.length > 0 ? (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <button
              onClick={() => { setCurrentIndex(0); setLightboxOpen(true); }}
              className="relative min-h-80 overflow-hidden rounded-3xl"
            >
              <img
                src={displayImages[0]}
                alt="Foto principale"
                className="h-full w-full object-cover"
              />
            </button>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
              {displayImages.slice(1, 3).map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrentIndex(i + 1); setLightboxOpen(true); }}
                  className="min-h-36 overflow-hidden rounded-3xl"
                >
                  <img src={img} alt={`Foto ${i + 2}`} className="h-full w-full object-cover" />
                </button>
              ))}
              {displayImages.length > 3 && (
                <button
                  onClick={() => { setCurrentIndex(3); setLightboxOpen(true); }}
                  className="flex min-h-36 items-center justify-center rounded-3xl bg-gray-200 text-sm font-medium text-gray-700"
                >
                  +{displayImages.length - 3} altre foto
                </button>
              )}
            </div>
          </div>

          {lightboxOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentIndex((currentIndex - 1 + displayImages.length) % displayImages.length)}
                className="absolute left-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
              >
                ←
              </button>
              <img
                src={displayImages[currentIndex]}
                alt={`Foto ${currentIndex + 1}`}
                className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain"
              />
              <button
                onClick={() => setCurrentIndex((currentIndex + 1) % displayImages.length)}
                className="absolute right-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
              >
                →
              </button>
              <p className="absolute bottom-4 text-sm text-white/70">
                {currentIndex + 1} / {displayImages.length}
              </p>
            </div>
          )}
        </>
      ) : (
        // Placeholder gradients when no real images
        <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="flex min-h-80 items-end rounded-3xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 p-6 text-white">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
                {images[0]}
              </p>
              <p className="mt-2 text-2xl font-semibold">Ambiente principale</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
            {images.slice(1).map((photo) => (
              <div
                key={photo}
                className="flex min-h-36 items-end rounded-3xl bg-gradient-to-br from-slate-200 to-slate-300 p-5 text-slate-800"
              >
                <p className="text-base font-semibold">{photo}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {virtualTour && virtualTourUrl && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900">Tour virtuale 360°</h3>
          <div className="mt-3 aspect-video overflow-hidden rounded-2xl border border-gray-200">
            <iframe
              src={virtualTourUrl}
              className="h-full w-full"
              allowFullScreen
              title="Tour virtuale"
            />
          </div>
        </div>
      )}

      {virtualTour && !virtualTourUrl && (
        <div className="mt-6 rounded-2xl border border-dashed border-indigo-300 bg-indigo-50 p-6 text-center">
          <p className="text-sm font-medium text-indigo-700">Tour virtuale disponibile</p>
          <p className="mt-1 text-xs text-indigo-500">
            Contatta il proprietario per ricevere il link al tour virtuale 360° dell&apos;alloggio.
          </p>
        </div>
      )}
    </div>
  );
}
