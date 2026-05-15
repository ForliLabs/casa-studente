import type { Metadata } from "next";
import { getMyUniversityProfile, getSSOConfigurations, getInstitutionalAPIKeys, getInstitutionalMetrics, getAllUniversityProfiles } from "@/lib/actions/university-sso";
import { getCurrentUser } from "@/lib/auth";
import { GraduationCap, Key, Users, Building, CheckCircle, Clock, Globe, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "SSO Universitario — Integrazione",
  description: "Accesso con credenziali universitarie e API istituzionale su CasaStudente.",
};

export default async function UniversitySSOPage() {
  const user = await getCurrentUser();
  const profile = await getMyUniversityProfile();
  const ssoConfigs = await getSSOConfigurations();
  const apiKeys = await getInstitutionalAPIKeys();
  const metrics = await getInstitutionalMetrics("unibo");
  const allProfiles = user?.role === "admin" ? await getAllUniversityProfiles() : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          SSO Universitario
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Integrazione universitaria
        </h1>
        <p className="mt-4 max-w-3xl text-base text-gray-600">
          Login con un click tramite credenziali UniBo (federazione IDEM-GARR), verifica automatica
          dell&apos;iscrizione, API per uffici alloggi universitari e onboarding massivo durante le settimane
          di orientamento.
        </p>
      </section>

      {/* Student Profile */}
      {profile && (
        <section className="rounded-2xl border border-green-200 bg-green-50 p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-green-100 p-3">
              <GraduationCap className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-green-900">Profilo universitario verificato</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-xs text-green-600">Matricola</p>
                  <p className="font-medium text-green-900">{profile.matricola}</p>
                </div>
                <div>
                  <p className="text-xs text-green-600">Università</p>
                  <p className="font-medium text-green-900">{profile.universityName}</p>
                </div>
                <div>
                  <p className="text-xs text-green-600">Facoltà</p>
                  <p className="font-medium text-green-900">{profile.faculty}</p>
                </div>
                <div>
                  <p className="text-xs text-green-600">Campus</p>
                  <p className="font-medium text-green-900">{profile.campus}</p>
                </div>
                <div>
                  <p className="text-xs text-green-600">Anno iscrizione</p>
                  <p className="font-medium text-green-900">{profile.enrollmentYear}</p>
                </div>
                <div>
                  <p className="text-xs text-green-600">Stato</p>
                  <p className="flex items-center gap-1 font-medium text-green-900">
                    <CheckCircle className="h-4 w-4" />
                    {profile.enrollmentStatus === "active" ? "Attivo" : profile.enrollmentStatus}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-xs text-green-500">
                Ultima sincronizzazione: {new Date(profile.lastSyncAt).toLocaleString("it-IT")}
                {profile.autoVerified && " — Verifica automatica via SSO"}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* SSO Login Card (for non-verified users) */}
      {!profile && user?.role === "student" && (
        <section className="rounded-2xl border border-blue-200 bg-blue-50 p-8 text-center">
          <Globe className="mx-auto h-12 w-12 text-blue-400" />
          <h2 className="mt-4 text-lg font-semibold text-blue-900">Collega il tuo account universitario</h2>
          <p className="mt-2 text-sm text-blue-700">
            Accedi con le tue credenziali UniBo per verificare automaticamente la tua iscrizione e sbloccare
            funzionalità esclusive.
          </p>
          <button className="mt-4 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Accedi con SSO UniBo
            </span>
          </button>
          <p className="mt-3 text-xs text-blue-500">Federazione IDEM-GARR — compatibile con tutte le università italiane</p>
        </section>
      )}

      {/* Admin: SSO Configurations */}
      {ssoConfigs.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">Configurazioni SSO (Admin)</h2>
          <div className="space-y-4">
            {ssoConfigs.map((config) => (
              <div key={config.id} className="rounded-xl border border-gray-100 bg-gray-50 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{config.universityName}</p>
                      <p className="text-xs text-gray-500">Provider: {config.provider} — Entity ID: {config.entityId}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${config.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {config.enabled ? "Attivo" : "Disabilitato"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Admin: API Keys */}
      {apiKeys.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">Chiavi API istituzionali</h2>
          <div className="space-y-3">
            {apiKeys.map((key) => (
              <div key={key.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <Key className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{key.universityName}</p>
                    <p className="text-xs text-gray-500">
                      {key.keyPrefix}••••••• — {key.usageCount.toLocaleString()} richieste — Limite: {key.rateLimit}/min
                    </p>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${key.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {key.active ? "Attiva" : "Revocata"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Institutional Metrics */}
      {metrics.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">Metriche istituzionali</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-3 font-medium text-gray-500">Periodo</th>
                  <th className="pb-3 font-medium text-gray-500">Tasso vacanza</th>
                  <th className="pb-3 font-medium text-gray-500">Affitto medio</th>
                  <th className="pb-3 font-medium text-gray-500">Soddisfazione</th>
                  <th className="pb-3 font-medium text-gray-500">Annunci</th>
                  <th className="pb-3 font-medium text-gray-500">Studenti</th>
                  <th className="pb-3 font-medium text-gray-500">Indice domanda</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((m) => (
                  <tr key={m.id} className="border-b border-gray-100">
                    <td className="py-3 font-medium text-gray-900">{m.period}</td>
                    <td className="py-3 text-gray-600">{m.vacancyRate}%</td>
                    <td className="py-3 text-gray-600">€{m.averageRent}</td>
                    <td className="py-3 text-gray-600">{m.studentSatisfaction}/5</td>
                    <td className="py-3 text-gray-600">{m.totalListings}</td>
                    <td className="py-3 text-gray-600">{m.totalStudents.toLocaleString()}</td>
                    <td className="py-3 text-gray-600">{m.demandIndex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Admin: University Profiles */}
      {allProfiles.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Users className="h-5 w-5" />
            Profili universitari verificati ({allProfiles.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-3 font-medium text-gray-500">Matricola</th>
                  <th className="pb-3 font-medium text-gray-500">Facoltà</th>
                  <th className="pb-3 font-medium text-gray-500">Campus</th>
                  <th className="pb-3 font-medium text-gray-500">Anno</th>
                  <th className="pb-3 font-medium text-gray-500">Stato</th>
                  <th className="pb-3 font-medium text-gray-500">SSO</th>
                </tr>
              </thead>
              <tbody>
                {allProfiles.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100">
                    <td className="py-3 font-mono text-xs text-gray-900">{p.matricola}</td>
                    <td className="py-3 text-gray-600">{p.faculty}</td>
                    <td className="py-3 text-gray-600">{p.campus}</td>
                    <td className="py-3 text-gray-600">{p.enrollmentYear}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                        {p.enrollmentStatus === "active" ? "Attivo" : p.enrollmentStatus}
                      </span>
                    </td>
                    <td className="py-3">
                      {p.autoVerified ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clock className="h-4 w-4 text-gray-400" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* API Documentation Preview */}
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">API Istituzionale — Endpoint</h2>
        <p className="mb-4 text-sm text-gray-600">API REST read-only per uffici alloggi universitari. Autenticazione tramite API key.</p>
        <div className="space-y-2 font-mono text-sm">
          {[
            { method: "GET", path: "/api/institutional/vacancy-rates", desc: "Tassi vacanza per zona" },
            { method: "GET", path: "/api/institutional/average-rents", desc: "Affitti medi per tipologia" },
            { method: "GET", path: "/api/institutional/student-satisfaction", desc: "Indici soddisfazione studenti" },
            { method: "GET", path: "/api/institutional/demand-forecast", desc: "Previsioni domanda per periodo" },
          ].map((ep) => (
            <div key={ep.path} className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-2">
              <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">{ep.method}</span>
              <span className="text-gray-900">{ep.path}</span>
              <span className="ml-auto text-xs text-gray-500">{ep.desc}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
