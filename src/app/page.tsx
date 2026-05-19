import Link from "next/link";
import {
  BadgeCheck,
  CreditCard,
  Globe,
  HandCoins,
  ScanSearch,
  Users,
} from "lucide-react";
import { FeatureCard, FeatureGrid } from "@/components/features";
import { Hero } from "@/components/hero";
import { PricingSection } from "@/components/pricing";
import { getCurrentUser } from "@/lib/auth";
import { listings } from "@/lib/data";

const featuredHighlights = [
  {
    label: "Annunci verificati",
    value: `${listings.length}+`,
  },
  {
    label: "Zone coperte",
    value: "Centro, Campus, Stazione",
  },
  {
    label: "Supporto lingue",
    value: "IT · EN · ES",
  },
];

export default async function Home() {
  const currentUser = await getCurrentUser();
  const dashboardHref = currentUser
    ? "/dashboard"
    : "/auth/login?redirect=%2Fdashboard";
  const dashboardLabel = currentUser ? "Vai alla dashboard" : "Accedi alla dashboard";

  return (
    <main className="flex-1 bg-white">
      <Hero
        title="Trova il tuo alloggio a Forlì"
        subtitle="La piattaforma che connette studenti e proprietari con annunci affidabili, strumenti digitali e un’esperienza pensata per chi arriva in città per studiare."
        ctaLabel="Esplora gli annunci"
        ctaHref="/listings"
        secondaryLabel={dashboardLabel}
        secondaryHref={dashboardHref}
      >
        <div className="mt-12 grid gap-4 rounded-3xl border border-blue-100 bg-white/80 p-6 text-left shadow-xl shadow-blue-100/50 sm:grid-cols-3">
          {featuredHighlights.map((item) => (
            <div key={item.label}>
              <p className="text-sm font-medium text-gray-500">{item.label}</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>
      </Hero>

      <FeatureGrid
        title="Tutto quello che serve per affittare bene"
        subtitle="CasaStudente semplifica la ricerca di casa a Forlì con funzionalità utili sia per gli studenti sia per i proprietari."
      >
        <FeatureCard
          icon={<BadgeCheck className="h-6 w-6" />}
          title="Alloggi verificati"
          description="Annunci controllati con informazioni chiare su posizione, dotazioni e disponibilità."
        />
        <FeatureCard
          icon={<ScanSearch className="h-6 w-6" />}
          title="Tour virtuali"
          description="Anteprime fotografiche e visite digitali per valutare l’alloggio prima di arrivare a Forlì."
        />
        <FeatureCard
          icon={<HandCoins className="h-6 w-6" />}
          title="Prezzi trasparenti"
          description="Canone, deposito e spese evidenziati subito per evitare sorprese in fase di contatto."
        />
        <FeatureCard
          icon={<Users className="h-6 w-6" />}
          title="Matching coinquilini"
          description="Profili compatibili per condividere appartamenti con studenti affini per budget e stile di vita."
        />
        <FeatureCard
          icon={<Globe className="h-6 w-6" />}
          title="Multilingue"
          description="Interfaccia e annunci pensati anche per studenti Erasmus e internazionali."
        />
        <FeatureCard
          icon={<CreditCard className="h-6 w-6" />}
          title="Pagamenti sicuri"
          description="Flussi guidati per caparre e canoni con ricevute e conferme centralizzate."
        />
      </FeatureGrid>

      <PricingSection
        title="Piani semplici e trasparenti"
        subtitle="Scegli il piano più adatto al tuo ruolo sulla piattaforma."
        tiers={[
          {
            name: "Studenti",
            price: "Gratuito",
            description: "Per cercare, filtrare e contattare gli annunci a Forlì.",
            features: [
              "Ricerca avanzata per zona e budget",
              "Salvataggio preferiti",
              "Contatto diretto con i proprietari",
            ],
            ctaLabel: "Inizia ora",
            ctaHref: "/listings",
          },
          {
            name: "Proprietari",
            price: "€50",
            period: "anno",
            description: "Per pubblicare e gestire annunci verificati tutto l’anno.",
            features: [
              "Pubblicazione annunci illimitati",
              "Statistiche di visualizzazione",
              "Gestione richieste in dashboard",
            ],
            ctaLabel: "Pubblica il primo annuncio",
            ctaHref: "/dashboard/listings",
            highlighted: true,
          },
          {
            name: "Premium",
            price: "€39",
            period: "mese",
            description: "Per agenzie e proprietari con maggiore visibilità e automazioni.",
            features: [
              "Posizionamento prioritario",
              "Messaggistica centralizzata",
              "Report mensili e reminder automatici",
            ],
            ctaLabel: "Attiva Premium",
            ctaHref: "/dashboard",
          },
        ]}
      />

      <section className="bg-slate-950 py-16 text-white sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
              Pronto a trasferirti a Forlì?
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Cerca il tuo prossimo alloggio o gestisci i tuoi annunci in un unico posto.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/listings"
              className="rounded-xl bg-white px-6 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-blue-50"
            >
              Vedi annunci
            </Link>
            <Link
              href={dashboardHref}
              className="rounded-xl border border-white/30 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {dashboardLabel}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
