import type { Metadata } from "next";
import { getAccessibilityDashboard } from "@/lib/actions/accessibility";
import { Eye, CheckCircle, AlertTriangle, XCircle, Accessibility, Monitor, Keyboard, Volume2, Palette } from "lucide-react";

export const metadata: Metadata = {
  title: "Accessibilità — WCAG 2.1 AA",
  description: "Dashboard di conformità accessibilità WCAG 2.1 AA per CasaStudente.",
};

export default async function AccessibilityPage() {
  const dashboard = await getAccessibilityDashboard();

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Accedi per visualizzare le informazioni sull&apos;accessibilità.</p>
      </div>
    );
  }

  const { audits, config, stats, checklist } = dashboard;

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">
          Accessibilità
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          WCAG 2.1 AA Compliance
        </h1>
        <p className="mt-4 max-w-3xl text-base text-gray-600">
          Conformità alla Legge Stanca e WCAG 2.1 AA: landmark ARIA, navigazione da tastiera,
          annunci screen reader, contrasto colori ≥4.5:1, gestione focus, supporto riduzione movimento
          e test automatizzati con axe-core nella pipeline CI.
        </p>
      </section>

      {/* Stats */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-teal-100 p-2"><Accessibility className="h-5 w-5 text-teal-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Score medio</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgScore}/100</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2"><CheckCircle className="h-5 w-5 text-green-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Violazioni risolte</p>
              <p className="text-2xl font-bold text-gray-900">{stats.fixedViolations}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-100 p-2"><AlertTriangle className="h-5 w-5 text-amber-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Violazioni aperte</p>
              <p className="text-2xl font-bold text-gray-900">{stats.openViolations}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2"><Monitor className="h-5 w-5 text-blue-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Pagine auditate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPages}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Features */}
      {config && (
        <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">Funzionalità accessibilità attive</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Skip to content", enabled: config.skipToContentEnabled, icon: <Accessibility className="h-4 w-4" /> },
              { label: "Focus trap modali", enabled: config.focusTrapEnabled, icon: <Eye className="h-4 w-4" /> },
              { label: "Riduzione movimento", enabled: config.reducedMotionEnabled, icon: <Monitor className="h-4 w-4" /> },
              { label: "ARIA live regions", enabled: config.ariaLiveRegionsEnabled, icon: <Volume2 className="h-4 w-4" /> },
              { label: "Navigazione tastiera", enabled: config.keyboardNavigationEnabled, icon: <Keyboard className="h-4 w-4" /> },
              { label: "Hint screen reader", enabled: config.screenReaderHintsEnabled, icon: <Volume2 className="h-4 w-4" /> },
              { label: "Contrasto alto", enabled: config.highContrastMode, icon: <Palette className="h-4 w-4" /> },
              { label: "Tab order validato", enabled: config.tabOrderValidated, icon: <Keyboard className="h-4 w-4" /> },
            ].map((feature) => (
              <div key={feature.label} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                <span className="text-gray-400">{feature.icon}</span>
                <span className="flex-1 text-sm text-gray-700">{feature.label}</span>
                {feature.enabled ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-300" />
                )}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-400">Rapporto contrasto minimo: {config.minimumContrastRatio}:1 (WCAG AA)</p>
        </section>
      )}

      {/* WCAG Compliance by Category */}
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">Conformità per principio WCAG</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(stats.complianceByCategory).map(([category, passCount]) => (
            <div key={category} className="rounded-xl border border-gray-100 p-6 text-center">
              <p className="text-sm font-medium text-gray-500">{category}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats.totalPages > 0 ? Math.round((passCount / stats.totalPages) * 100) : 0}%
              </p>
              <p className="mt-1 text-xs text-gray-400">{passCount}/{stats.totalPages} pagine</p>
            </div>
          ))}
        </div>
      </section>

      {/* Page Audits */}
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">Audit per pagina</h2>
        <div className="space-y-4">
          {audits.map((audit) => (
            <div key={audit.id} className="rounded-xl border border-gray-100 bg-gray-50 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{audit.pageName}</h3>
                  <p className="text-xs text-gray-500">{audit.pageUrl}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold ${audit.lighthouseScore >= 90 ? "text-green-600" : audit.lighthouseScore >= 70 ? "text-amber-600" : "text-red-600"}`}>
                    {audit.lighthouseScore}
                  </span>
                </div>
              </div>

              {/* WCAG principles */}
              <div className="mt-3 flex gap-3">
                {(["perceivable", "operable", "understandable", "robust"] as const).map((p) => (
                  <span key={p} className={`rounded-full px-2 py-1 text-xs font-medium ${
                    audit[p] === "pass" ? "bg-green-100 text-green-700" :
                    audit[p] === "partial" ? "bg-amber-100 text-amber-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}: {audit[p] === "pass" ? "✓" : audit[p] === "partial" ? "⚠" : "✗"}
                  </span>
                ))}
              </div>

              {/* Violations */}
              {audit.violations.length > 0 && (
                <div className="mt-4 space-y-2">
                  {audit.violations.map((v) => (
                    <div key={v.id} className="flex items-center gap-3 rounded-lg bg-white p-3 text-sm">
                      <span className={`h-2 w-2 flex-shrink-0 rounded-full ${
                        v.severity === "critical" ? "bg-red-500" :
                        v.severity === "major" ? "bg-amber-500" : "bg-gray-400"
                      }`} />
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">{v.rule}</span>
                        <span className="mx-2 text-gray-300">·</span>
                        <span className="text-gray-500">{v.description}</span>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-xs ${
                        v.status === "fixed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {v.status === "fixed" ? "Risolto" : "Aperto"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* WCAG Checklist */}
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">Checklist WCAG 2.1 AA</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-3 font-medium text-gray-500">Criterio</th>
                <th className="pb-3 font-medium text-gray-500">Nome</th>
                <th className="pb-3 font-medium text-gray-500">Livello</th>
                <th className="pb-3 font-medium text-gray-500">Categoria</th>
              </tr>
            </thead>
            <tbody>
              {checklist.map((item) => (
                <tr key={item.criteria} className="border-b border-gray-100">
                  <td className="py-2 font-mono text-xs text-gray-900">{item.criteria}</td>
                  <td className="py-2 text-gray-700">{item.name}</td>
                  <td className="py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.level === "AA" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {item.level}
                    </span>
                  </td>
                  <td className="py-2 text-gray-500">{item.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Accessibility Statement */}
      <section className="rounded-2xl border border-teal-200 bg-teal-50 p-8">
        <h2 className="text-lg font-semibold text-teal-900">Dichiarazione di accessibilità</h2>
        <div className="mt-4 space-y-3 text-sm text-teal-800">
          <p>
            CasaStudente si impegna a garantire l&apos;accessibilità digitale per tutte le persone, incluse quelle
            con disabilità. Adottiamo lo standard WCAG 2.1 livello AA come riferimento di conformità.
          </p>
          <p>
            <strong>Legge Stanca (L. 4/2004, aggiornata 2022)</strong>: In qualità di servizio utilizzabile
            da istituzioni pubbliche, ci conformiamo ai requisiti di accessibilità previsti dalla normativa italiana.
          </p>
          <p>
            <strong>Feedback</strong>: Se riscontri barriere di accessibilità, contattaci a{" "}
            <span className="font-medium">accessibilita@casastudente.it</span> — ci impegniamo a rispondere
            entro 5 giorni lavorativi.
          </p>
        </div>
      </section>
    </div>
  );
}
