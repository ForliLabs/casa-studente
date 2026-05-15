import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ToastProvider } from "@/components/toast";
import { PWAInstallPrompt } from "@/components/pwa-install";
import { getCurrentUser } from "@/lib/auth";
import { getLocaleFromCookie } from "@/lib/i18n";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://casastudente.it"),
  title: {
    default: "CasaStudente | Alloggi per studenti a Forlì",
    template: "%s | CasaStudente",
  },
  description:
    "Trova stanze, monolocali e bilocali verificati a Forlì. CasaStudente connette studenti e proprietari con annunci trasparenti e strumenti dedicati.",
  keywords: [
    "alloggi studenti Forlì",
    "stanze Forlì",
    "affitti universitari Forlì",
    "CasaStudente",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CasaStudente",
  },
  openGraph: {
    title: "CasaStudente | Alloggi per studenti a Forlì",
    description:
      "La piattaforma che connette studenti e proprietari a Forlì con annunci verificati, tour virtuali e prezzi trasparenti.",
    locale: "it_IT",
    siteName: "CasaStudente",
    type: "website",
  },
};

const baseNavItems = [
  { label: "Home", href: "/" },
  { label: "Annunci", href: "/listings" },
  { label: "Coinquilini", href: "/roommates" },
  { label: "Quartieri", href: "/neighborhoods" },
  { label: "Comunità", href: "/community" },
  { label: "Dashboard", href: "/dashboard" },
];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const cookieStore = await cookies();
  const currentLocale = getLocaleFromCookie(cookieStore.get("locale")?.value);
  const navItems = baseNavItems.filter((item) => item.href !== "/dashboard" || Boolean(user));

  return (
    <html
      lang={currentLocale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <a href="#main-content" className="skip-to-content">
          Salta al contenuto principale
        </a>
        <ToastProvider>
          <Navbar
            brand="CasaStudente"
            items={navItems}
            ctaLabel={user ? undefined : "Pubblica annuncio"}
            ctaHref={user ? undefined : "/auth/register"}
            currentLocale={currentLocale}
            user={user ? { name: user.name, email: user.email, role: user.role } : null}
          />
          <div id="main-content" className="flex flex-1 flex-col">{children}</div>
          <Footer
            brand="CasaStudente"
            tagline="Alloggi verificati e strumenti digitali per vivere Forlì da studenti."
          />
          <PWAInstallPrompt />
        </ToastProvider>
      </body>
    </html>
  );
}
