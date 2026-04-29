import { requireAdmin } from "@/lib/auth";
import Link from "next/link";
import type { ReactNode } from "react";
import { BarChart3, Flag, LayoutDashboard, Shield, Users, Activity } from "lucide-react";

const adminNav = [
  { label: "Panoramica", href: "/admin", icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: "Utenti", href: "/admin/users", icon: <Users className="h-5 w-5" /> },
  { label: "Moderazione", href: "/admin/moderation", icon: <Flag className="h-5 w-5" /> },
  { label: "Analytics", href: "/admin/analytics", icon: <BarChart3 className="h-5 w-5" /> },
  { label: "Marketplace", href: "/admin/marketplace", icon: <Activity className="h-5 w-5" /> },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <div className="flex min-h-[calc(100vh-130px)]">
      <aside className="w-64 border-r border-gray-200 bg-gray-50 p-4">
        <div className="mb-6 flex items-center gap-2">
          <Shield className="h-6 w-6 text-red-600" />
          <h2 className="text-lg font-bold text-gray-900">Admin Console</h2>
        </div>
        <nav className="space-y-1">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 border-t border-gray-200 pt-4">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
            ← Torna alla dashboard
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
