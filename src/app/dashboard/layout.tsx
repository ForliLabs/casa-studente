import type { ReactNode } from "react";
import {
  Accessibility,
  Bell,
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  GraduationCap,
  Heart,
  Home,
  Key,
  LayoutDashboard,
  Map,
  MessageSquare,
  Orbit,
  Scale,
  Shield,
  Star,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard";
import { getCurrentUser } from "@/lib/auth";

const dashboardSections = [
  {
    label: "Fondamenta",
    items: [
      { label: "Panoramica", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" />, roles: ["student", "landlord", "admin"] },
      { label: "Annunci", href: "/dashboard/listings", icon: <Home className="h-5 w-5" />, roles: ["landlord", "admin"] },
      { label: "Messaggi", href: "/dashboard/messages", icon: <MessageSquare className="h-5 w-5" />, roles: ["student", "landlord", "admin"] },
      { label: "Pagamenti", href: "/dashboard/payments", icon: <CreditCard className="h-5 w-5" />, roles: ["student", "landlord", "admin"] },
      { label: "Documenti", href: "/dashboard/documents", icon: <FileText className="h-5 w-5" />, roles: ["student", "landlord", "admin"] },
      { label: "Recensioni", href: "/dashboard/reviews", icon: <Star className="h-5 w-5" />, roles: ["student", "landlord", "admin"] },
      { label: "Notifiche Hub", href: "/dashboard/notification-hub", icon: <Bell className="h-5 w-5" />, roles: ["student", "landlord", "admin"] },
    ],
  },
  {
    label: "Esperienza studente",
    items: [
      { label: "Percorso", href: "/dashboard/journey", icon: <Map className="h-5 w-5" />, roles: ["student", "admin"] },
      { label: "Per Te", href: "/dashboard/for-you", icon: <Heart className="h-5 w-5" />, roles: ["student", "admin"] },
      { label: "Tour", href: "/dashboard/tours", icon: <Video className="h-5 w-5" />, roles: ["student", "landlord", "admin"] },
      { label: "Gruppi", href: "/dashboard/groups", icon: <Users className="h-5 w-5" />, roles: ["student", "admin"] },
      { label: "SSO Università", href: "/dashboard/university-sso", icon: <GraduationCap className="h-5 w-5" />, roles: ["student", "admin"] },
      { label: "Accessibilità", href: "/dashboard/accessibility", icon: <Accessibility className="h-5 w-5" />, roles: ["student", "landlord", "admin"] },
    ],
  },
  {
    label: "Operatività proprietario",
    items: [
      { label: "Pricing", href: "/dashboard/pricing", icon: <DollarSign className="h-5 w-5" />, roles: ["landlord", "admin"] },
      { label: "Insights", href: "/dashboard/insights", icon: <TrendingUp className="h-5 w-5" />, roles: ["landlord", "admin"] },
      { label: "Conformità", href: "/dashboard/compliance", icon: <Shield className="h-5 w-5" />, roles: ["landlord", "admin"] },
      { label: "TenantScore", href: "/dashboard/tenant-score", icon: <Shield className="h-5 w-5" />, roles: ["landlord", "admin"] },
      { label: "Assicurazione", href: "/dashboard/insurance", icon: <Shield className="h-5 w-5" />, roles: ["landlord", "admin"] },
      { label: "Controversie", href: "/dashboard/disputes", icon: <Scale className="h-5 w-5" />, roles: ["landlord", "admin"] },
      { label: "API Proprietario", href: "/dashboard/landlord-api", icon: <Key className="h-5 w-5" />, roles: ["landlord", "admin"] },
      { label: "Previsioni", href: "/dashboard/forecasting", icon: <Calendar className="h-5 w-5" />, roles: ["landlord", "admin"] },
      { label: "Guida Legale", href: "/dashboard/legal-compliance", icon: <Scale className="h-5 w-5" />, roles: ["landlord", "admin"] },
    ],
  },
  {
    label: "Labs",
    items: [
      { label: "Moonshots hub", href: "/dashboard/moonshots", icon: <Orbit className="h-5 w-5" />, roles: ["student", "landlord", "admin"] },
    ],
  },
] as const;

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const role = user?.role ?? "student";

  const sections = dashboardSections
    .map((section) => ({
      label: section.label,
      items: section.items.filter((item) => item.roles.some((allowedRole) => allowedRole === role) || role === "admin"),
    }))
    .filter((section) => section.items.length > 0);

  return <DashboardShell brand="CasaStudente" sections={sections}>{children}</DashboardShell>;
}
