"use client";

import { useRef, useState, useTransition } from "react";

interface ConfirmActionButtonProps {
  /** FormData key/value pairs to pass to the server action. */
  fields: Record<string, string>;
  /** The server action to call on confirmation. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (formData: FormData) => Promise<any>;
  /** Label shown on the primary trigger button. */
  triggerLabel: React.ReactNode;
  /** Label shown on the confirm button inside the dialog. */
  confirmLabel?: string;
  /** Optional title text for the dialog. */
  dialogTitle?: string;
  /** Body copy for the dialog. */
  dialogBody?: string;
  /** Tailwind classes for the trigger button. */
  triggerClassName?: string;
  /** Tailwind classes for the confirm button (defaults to destructive red). */
  confirmClassName?: string;
}

/**
 * A drop-in replacement for a plain `<form>` that wraps a destructive server
 * action with a native `<dialog>` confirmation step.  No portal, no third-party
 * library — just the browser's built-in modal element with Tailwind styling.
 */
export function ConfirmActionButton({
  fields,
  action,
  triggerLabel,
  confirmLabel = "Conferma",
  dialogTitle = "Sei sicuro?",
  dialogBody = "L'operazione non può essere annullata.",
  triggerClassName,
  confirmClassName = "rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700",
}: ConfirmActionButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function openDialog() {
    setError(null);
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function handleConfirm() {
    startTransition(async () => {
      try {
        const fd = new FormData();
        for (const [key, value] of Object.entries(fields)) {
          fd.set(key, value);
        }
        await action(fd);
        closeDialog();
      } catch {
        setError("Qualcosa è andato storto. Riprova.");
      }
    });
  }

  return (
    <>
      <button type="button" onClick={openDialog} className={triggerClassName}>
        {triggerLabel}
      </button>

      {/* Native <dialog> — backdrop is styled via the ::backdrop pseudo-element
          which Tailwind can't target directly, so we use an inline style. */}
      <dialog
        ref={dialogRef}
        className="m-auto max-w-sm rounded-3xl border border-gray-200 bg-white p-6 shadow-xl backdrop:bg-black/40"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        onClick={(e) => {
          // Close on backdrop click (the dialog element itself, not its children).
          if (e.target === e.currentTarget) closeDialog();
        }}
      >
        <h2 id="confirm-dialog-title" className="text-lg font-semibold text-gray-900">
          {dialogTitle}
        </h2>
        <p id="confirm-dialog-desc" className="mt-2 text-sm text-gray-600">
          {dialogBody}
        </p>

        {error && (
          <p role="alert" className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={closeDialog}
            disabled={isPending}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          >
            Annulla
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className={`${confirmClassName} disabled:opacity-60`}
          >
            {isPending ? "Attendi…" : confirmLabel}
          </button>
        </div>
      </dialog>
    </>
  );
}
