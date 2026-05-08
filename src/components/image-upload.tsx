"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useToast } from "@/components/toast";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

interface ImageUploadProps {
  maxImages?: number;
  onImagesChange?: (images: string[]) => void;
}

export function ImageUpload({ maxImages = 10, onImagesChange }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  async function handleFiles(files: FileList | null) {
    if (!files) return;

    const remaining = maxImages - images.length;
    const acceptedFiles = Array.from(files)
      .slice(0, remaining)
      .filter((file) => file.type.startsWith("image/"));

    const oversizedFile = acceptedFiles.find((file) => file.size > MAX_UPLOAD_BYTES);
    if (oversizedFile) {
      showToast(`Il file ${oversizedFile.name} supera il limite di 10MB.`, "error");
      return;
    }

    const newImages = await Promise.all(acceptedFiles.map(readFileAsDataUrl));
    const updated = [...images, ...newImages];
    setImages(updated);
    onImagesChange?.(updated);
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    setDragOver(false);
    void handleFiles(event.dataTransfer.files);
  }

  function handleOpenPicker() {
    fileInputRef.current?.click();
  }

  function handleTriggerKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpenPicker();
    }
  }

  function removeImage(index: number) {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onImagesChange?.(updated);
  }

  return (
    <div className="space-y-4">
      <div
        role="button"
        tabIndex={0}
        className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${
          dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={handleOpenPicker}
        onKeyDown={handleTriggerKeyDown}
        aria-label="Carica immagini dell'annuncio"
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
          onChange={(event) => {
            void handleFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((src, index) => (
            <div key={index} className="group relative aspect-square overflow-hidden rounded-xl">
              <Image src={src} alt={`Foto ${index + 1}`} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" unoptimized />
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  removeImage(index);
                }}
                className="absolute right-2 top-2 rounded-full bg-red-600 p-1 text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                aria-label={`Rimuovi foto ${index + 1}`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {index === 0 && (
                <span className="absolute bottom-2 left-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
                  Principale
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400">{images.length}/{maxImages} foto caricate</p>
    </div>
  );
}

interface ImageGalleryProps {
  images: string[];
  virtualTour?: boolean;
  virtualTourUrl?: string;
}

export function ImageGallery({ images, virtualTour, virtualTourUrl }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const hasRealImages = images.some((img) => img.startsWith("data:") || img.startsWith("http"));
  const displayImages = hasRealImages ? images : [];

  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setLightboxOpen(false);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setCurrentIndex((value) => (value - 1 + displayImages.length) % displayImages.length);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setCurrentIndex((value) => (value + 1) % displayImages.length);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [displayImages.length, lightboxOpen]);

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
              type="button"
              onClick={() => {
                setCurrentIndex(0);
                setLightboxOpen(true);
              }}
              className="relative min-h-80 overflow-hidden rounded-3xl"
            >
              <Image src={displayImages[0]} alt="Foto principale" fill sizes="(max-width: 768px) 100vw, 60vw" className="object-cover" unoptimized />
            </button>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
              {displayImages.slice(1, 3).map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(index + 1);
                    setLightboxOpen(true);
                  }}
                  className="relative min-h-36 overflow-hidden rounded-3xl"
                >
                  <Image src={img} alt={`Foto ${index + 2}`} fill sizes="(max-width: 768px) 50vw, 30vw" className="object-cover" unoptimized />
                </button>
              ))}
              {displayImages.length > 3 && (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentIndex(3);
                    setLightboxOpen(true);
                  }}
                  className="flex min-h-36 items-center justify-center rounded-3xl bg-gray-200 text-sm font-medium text-gray-700"
                >
                  +{displayImages.length - 3} altre foto
                </button>
              )}
            </div>
          </div>

          {lightboxOpen && (
            <div role="dialog" aria-modal="true" aria-label="Galleria fotografica" className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white transition hover:bg-white/30"
                aria-label="Chiudi galleria"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setCurrentIndex((currentIndex - 1 + displayImages.length) % displayImages.length)}
                className="absolute left-4 rounded-full bg-white/20 p-2 text-white transition hover:bg-white/30"
                aria-label="Foto precedente"
              >
                ←
              </button>
              <Image
                src={displayImages[currentIndex]}
                alt={`Foto ${currentIndex + 1}`}
                width={1600}
                height={1200}
                className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain"
                unoptimized
              />
              <button
                type="button"
                onClick={() => setCurrentIndex((currentIndex + 1) % displayImages.length)}
                className="absolute right-4 rounded-full bg-white/20 p-2 text-white transition hover:bg-white/30"
                aria-label="Foto successiva"
              >
                →
              </button>
              <p className="absolute bottom-4 text-sm text-white/70">{currentIndex + 1} / {displayImages.length}</p>
            </div>
          )}
        </>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="flex min-h-80 items-end rounded-3xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 p-6 text-white">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">Anteprima 1</p>
              <p className="mt-2 text-2xl font-semibold">Ambiente principale</p>
              <p className="mt-2 text-sm text-blue-50">{images[0] ?? "Gli scatti saranno disponibili dopo il caricamento delle foto reali."}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
            {images.slice(1).map((photo, index) => (
              <div
                key={`${photo}-${index}`}
                className="flex min-h-36 items-end rounded-3xl bg-gradient-to-br from-slate-200 to-slate-300 p-5 text-slate-800"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Anteprima {index + 2}</p>
                  <p className="mt-2 text-base font-semibold">{photo}</p>
                </div>
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

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = () => reject(new Error(`Impossibile leggere ${file.name}`));
    reader.readAsDataURL(file);
  });
}
