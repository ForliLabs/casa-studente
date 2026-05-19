"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useDismissibleLayer } from "@/lib/hooks/use-dismissible-layer";

interface UserMenuProps {
  user: { name: string; email: string; role: string } | null;
}

export function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useDismissibleLayer<HTMLDivElement>({
    isOpen: open,
    onDismiss: () => setOpen(false),
    triggerRef,
  });

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/auth/login"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Accedi
        </Link>
        <Link
          href="/auth/register"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Registrati
        </Link>
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
          {initials}
        </span>
        <span className="hidden sm:inline">{user.name}</span>
      </button>

      <div
        ref={menuRef}
        className={cn(
          "absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-gray-200 bg-white py-2 shadow-lg",
          open ? "block" : "hidden"
        )}
      >
        <div className="border-b border-gray-100 px-4 py-2">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
          <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
            {user.role === "student" ? "Studente" : user.role === "landlord" ? "Proprietario" : "Admin"}
          </span>
        </div>
        <Link
          href="/dashboard"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          onClick={() => setOpen(false)}
        >
          Dashboard
        </Link>
        <Link
          href="/notifications"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          onClick={() => setOpen(false)}
        >
          Notifiche
        </Link>
        <Link
          href="/reviews"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          onClick={() => setOpen(false)}
        >
          Recensioni
        </Link>
        <Link
          href="/status"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          onClick={() => setOpen(false)}
        >
          Stato piattaforma
        </Link>
        {user.role === "student" && (
          <Link
            href="/auth/verify"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            Verifica università
          </Link>
        )}
        {user.role === "admin" && (
          <Link
            href="/admin"
            className="block px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
            onClick={() => setOpen(false)}
          >
            Admin console
          </Link>
        )}
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            onClick={() => setOpen(false)}
          >
            Esci
          </button>
        </form>
      </div>
    </div>
  );
}
