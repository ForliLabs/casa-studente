"use client";

import type { ReactNode } from "react";
import { BarChart3, CreditCard, Home, LayoutDashboard, MessageSquare, Star } from "lucide-react";
import { DashboardShell } from "@/components/dashboard";

const items = [
  {
    label: "Panoramica",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Annunci",
    href: "/dashboard/listings",
    icon: <Home className="h-5 w-5" />,
  },
  {
    label: "Messaggi",
    href: "/dashboard/messages",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    label: "Pagamenti",
    href: "/dashboard/payments",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    label: "Recensioni",
    href: "/dashboard/reviews",
    icon: <Star className="h-5 w-5" />,
  },
  {
    label: "Analytics",
    href: "/dashboard#analytics",
    icon: <BarChart3 className="h-5 w-5" />,
  },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell brand="CasaStudente" items={items}>{children}</DashboardShell>;
}
