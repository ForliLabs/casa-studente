"use client";

import type { ReactNode } from "react";
import { BarChart3, Bell, CreditCard, DollarSign, FileText, Heart, Home, LayoutDashboard, Map, MessageSquare, Shield, Star, TrendingUp, Video } from "lucide-react";
import { DashboardShell } from "@/components/dashboard";

const items = [
  {
    label: "Panoramica",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Percorso",
    href: "/dashboard/journey",
    icon: <Map className="h-5 w-5" />,
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
    label: "Documenti",
    href: "/dashboard/documents",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    label: "Conformità",
    href: "/dashboard/compliance",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    label: "Pricing",
    href: "/dashboard/pricing",
    icon: <DollarSign className="h-5 w-5" />,
  },
  {
    label: "Insights",
    href: "/dashboard/insights",
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    label: "Per Te",
    href: "/dashboard/for-you",
    icon: <Heart className="h-5 w-5" />,
  },
  {
    label: "Tour",
    href: "/dashboard/tours",
    icon: <Video className="h-5 w-5" />,
  },
  {
    label: "Notifiche Hub",
    href: "/dashboard/notification-hub",
    icon: <Bell className="h-5 w-5" />,
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
