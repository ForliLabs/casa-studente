import type { Metadata } from "next";
import { getLegalComplianceDashboard, calculateTaxComparison } from "@/lib/actions/legal-compliance";
import { FileText, AlertTriangle, CheckCircle, Shield, Calculator, BookOpen, XCircle, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Conformità Legale — Wizard Contratti",
  description: "Guida interattiva alla conformità legale per contratti di affitto studentesco in Italia.",
};

export default async function LegalCompliancePage() {
  const dashboard = await getLegalComplianceDashboard();
  const taxExample = await calculateTaxComparison(450, "transitorio");

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Accedi per visualizzare la guida legale.</p>
      </div>
    );
  }

  const { contractTypes, clauses, prohibited, rights, checklist } = dashboard;

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Conformità Legale
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Wizard contratti e diritti
        </h1>
        <p className="mt-4 max-w-3xl text-base text-gray-600">
          Guida interattiva alla legge italiana sugli affitti per studenti: tipi di contratto,
          clausole obbligatorie, calcolatore fiscale, diritti dell&apos;inquilino in più lingue e
          checklist di conformità. Contenuti basati sulla normativa vigente (L. 431/1998, D.Lgs. 23/2011).
        </p>
      </section>

      {/* Contract Types */}
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <FileText className="h-5 w-5" /> Tipi di contratto
        </h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {contractTypes.map((ct) => (
            <div key={ct.id} className="rounded-xl border border-gray-100 bg-gray-50 p-6">
              <h3 className="text-base font-bold text-gray-900">{ct.name}</h3>
              <p className="mt-1 text-xs text-gray-500">{ct.legalReference}</p>
              <div className="mt-3 space-y-2 text-sm">
                <p><span className="font-medium text-gray-700">Durata:</span> <span className="text-gray-600">{ct.duration}</span></p>
                <p><span className="font-medium text-gray-700">Rinnovo:</span> <span className="text-gray-600">{ct.renewal}</span></p>
                <p><span className="font-medium text-gray-700">Ideale per:</span> <span className="text-gray-600">{ct.bestFor}</span></p>
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold text-green-700">✓ Vantaggi</p>
                <ul className="mt-1 space-y-1">
                  {ct.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-1 text-xs text-green-600">
                      <CheckCircle className="mt-0.5 h-3 w-3 flex-shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-3">
                <p className="text-xs font-semibold text-red-700">✗ Svantaggi</p>
                <ul className="mt-1 space-y-1">
                  {ct.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-1 text-xs text-red-600">
                      <XCircle className="mt-0.5 h-3 w-3 flex-shrink-0" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tax Calculator Example */}
      {taxExample && (
        <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Calculator className="h-5 w-5" /> Calcolatore fiscale
          </h2>
          <p className="mb-4 text-sm text-gray-600">Esempio: canone €{taxExample.monthlyRent}/mese con contratto {taxExample.contractType}</p>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-green-200 bg-green-50 p-6">
              <h3 className="text-base font-semibold text-green-900">Cedolare secca ({(taxExample.cedolareRate * 100)}%)</h3>
              <div className="mt-3 space-y-2 text-sm">
                <p>Reddito annuo: €{taxExample.annualRent}</p>
                <p>Imposta: €{taxExample.cedolareTax}</p>
                <p>Imposta di registro: €0</p>
                <p className="text-lg font-bold text-green-700">Netto: €{taxExample.netIncomeCedolare}/anno</p>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h3 className="text-base font-semibold text-gray-900">Regime ordinario (IRPEF {(taxExample.irpefRate * 100)}%)</h3>
              <div className="mt-3 space-y-2 text-sm">
                <p>Reddito annuo: €{taxExample.annualRent}</p>
                <p>IRPEF: €{taxExample.irpefTax}</p>
                <p>Imposta di registro: €{taxExample.registrationTax}</p>
                <p>Bollo: €{taxExample.stampDuty}</p>
                <p className="text-lg font-bold text-gray-700">Netto: €{taxExample.netIncomeOrdinario}/anno</p>
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-800">💡 {taxExample.recommendation}</p>
          </div>
        </section>
      )}

      {/* Required Clauses */}
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Shield className="h-5 w-5" /> Clausole obbligatorie
        </h2>
        <div className="space-y-4">
          {clauses.filter(c => c.required).map((clause) => (
            <div key={clause.id} className="rounded-xl border border-gray-100 bg-gray-50 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-medium text-gray-400">{clause.category}</span>
                  <h3 className="mt-1 text-sm font-semibold text-gray-900">{clause.title}</h3>
                  <p className="mt-2 text-xs text-gray-600">{clause.explanation}</p>
                </div>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">Obbligatoria</span>
              </div>
              <div className="mt-3 rounded-lg bg-white p-3 font-mono text-xs text-gray-700">
                {clause.italianText.length > 200 ? `${clause.italianText.slice(0, 200)}...` : clause.italianText}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Prohibited Clauses */}
      <section className="rounded-2xl border border-red-200 bg-red-50 p-8">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-red-900">
          <AlertTriangle className="h-5 w-5" /> Clausole vietate
        </h2>
        <div className="space-y-3">
          {prohibited.map((pc) => (
            <div key={pc.id} className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{pc.description}</p>
                  <p className="mt-1 text-xs text-gray-500">{pc.legalReference}</p>
                  <p className="mt-1 text-xs text-red-600">{pc.penalty}</p>
                  {pc.commonlyFound && (
                    <span className="mt-2 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                      ⚠ Frequente nei contratti non registrati
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Compliance Checklist (Landlord) */}
      {checklist && (
        <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <CheckCircle className="h-5 w-5" /> Checklist conformità ({checklist.completedCount}/{checklist.totalCount})
          </h2>
          <div className="mb-4 h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-green-500 transition-all"
              style={{ width: `${(checklist.completedCount / checklist.totalCount) * 100}%` }}
            />
          </div>
          <div className="space-y-2">
            {checklist.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                {item.completed ? (
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                ) : (
                  <div className="h-5 w-5 flex-shrink-0 rounded-full border-2 border-gray-300" />
                )}
                <div className="flex-1">
                  <p className={`text-sm ${item.completed ? "text-gray-500 line-through" : "font-medium text-gray-900"}`}>
                    {item.label}
                  </p>
                  {item.deadline && !item.completed && (
                    <p className="flex items-center gap-1 text-xs text-amber-600">
                      <Clock className="h-3 w-3" />
                      Scadenza: {new Date(item.deadline).toLocaleDateString("it-IT")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tenant Rights */}
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <BookOpen className="h-5 w-5" /> Diritti dell&apos;inquilino
        </h2>
        <div className="space-y-4">
          {rights.map((right) => (
            <div key={right.id} className="rounded-xl border border-gray-100 bg-gray-50 p-6">
              <span className="text-xs font-medium text-gray-400">{right.category}</span>
              <h3 className="mt-1 text-sm font-semibold text-gray-900">{right.title}</h3>
              <p className="mt-2 text-sm text-gray-700">{right.description}</p>
              <p className="mt-1 text-xs text-gray-400">{right.legalReference}</p>
              {Object.entries(right.languages).length > 0 && (
                <div className="mt-3 space-y-1 border-t border-gray-200 pt-3">
                  {Object.entries(right.languages).map(([lang, text]) => (
                    <p key={lang} className="text-xs text-gray-500">
                      <span className="font-medium uppercase">{lang}:</span> {text}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section className="rounded-2xl border border-gray-300 bg-gray-100 p-6">
        <p className="text-xs text-gray-600">
          <strong>Avvertenza:</strong> Le informazioni contenute in questa sezione hanno carattere puramente
          informativo e non costituiscono consulenza legale. CasaStudente non è uno studio legale.
          Per situazioni specifiche, si consiglia di consultare un avvocato specializzato in diritto
          immobiliare. Ultimo aggiornamento contenuti: luglio 2025.
        </p>
      </section>
    </div>
  );
}
