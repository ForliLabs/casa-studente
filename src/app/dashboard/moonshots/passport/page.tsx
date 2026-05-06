import type { Metadata } from "next";
import { CheckCircle2, KeyRound, Map, ShieldCheck, Sparkles } from "lucide-react";
import { getPassportDashboard } from "@/lib/actions/moonshots";

export const metadata: Metadata = {
  title: "Student Housing Passport",
  description:
    "Credenziale abitativa portabile per studenti che unisce tenant score, verifica universitaria e trust cross-city.",
};

export default async function PassportPage() {
  const dashboard = await getPassportDashboard();
  if (!dashboard) {
    return null;
  }

  const { passport, tenantScore, universityProfile, verifications, isDemo } = dashboard;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
              Portable trust layer
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Student Housing Passport
            </h1>
            <p className="mt-4 max-w-3xl text-base text-gray-600">
              Un asset digitale condivisibile che porta con sé iscrizione universitaria, affidabilità
              locativa e reputazione economica. Riduce il reset di fiducia ogni volta che uno
              studente cambia città, semestre o piattaforma.
            </p>
          </div>
          <span className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-medium text-cyan-700">
            {isDemo ? "Demo mode" : "Live viewer"}
          </span>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Portability score</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{passport.portabilityScore}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Trust tier</p>
          <p className="mt-2 text-3xl font-bold capitalize text-gray-900">{passport.trustTier}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Partner corridors</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{passport.partnerCities.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">External verifications</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{passport.verificationCount}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-cyan-600" />
            <h2 className="text-lg font-semibold text-gray-900">Disclosed claims</h2>
          </div>
          <div className="mt-5 space-y-3">
            {passport.disclosedClaims.map((claim) => (
              <div key={claim.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{claim.label}</p>
                    <p className="mt-1 text-sm text-gray-600">{claim.value}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      claim.shareable
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {claim.shareable ? "Shareable" : "Private by default"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-cyan-600" />
              <h2 className="text-lg font-semibold text-gray-900">Verification token</h2>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Endpoint: <code className="rounded bg-gray-100 px-1 py-0.5">/api/moonshots/passport</code>
            </p>
            <p className="mt-4 rounded-2xl bg-slate-950 p-4 font-mono text-xs leading-6 text-cyan-100 break-all">
              {dashboard.tokenPreview}...
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-600" />
              <h2 className="text-lg font-semibold text-gray-900">Issuer stack</h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>• Issuer: {passport.issuer}</li>
              <li>• Tenant score: {tenantScore?.overallScore ?? "N/A"}</li>
              <li>• University sync: {universityProfile?.faculty ?? "pending"}</li>
              <li>• Expiry: {new Date(passport.expiresAt).toLocaleDateString("it-IT")}</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Map className="h-5 w-5 text-cyan-600" />
          <h2 className="text-lg font-semibold text-gray-900">Cross-city verification log</h2>
        </div>
        <div className="mt-5 space-y-3">
          {verifications.map((event) => (
            <div key={event.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{event.verifier}</p>
                  <p className="mt-1 text-sm text-gray-600">{event.corridor}</p>
                </div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-400">
                  {new Date(event.verifiedAt).toLocaleDateString("it-IT")}
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {event.disclosedClaimLabels.map((claim) => (
                  <span key={claim} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700">
                    {claim}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-cyan-200 bg-cyan-50 p-6">
        <h2 className="text-lg font-semibold text-cyan-950">Implementation slice in repo</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            "Signed portable credential with HMAC verification.",
            "Dashboard surface for selective disclosure and corridor tracking.",
            "Public verification API ready for partner pilots.",
          ].map((item) => (
            <div key={item} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-cyan-600" />
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
