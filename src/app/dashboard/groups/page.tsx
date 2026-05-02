import type { Metadata } from "next";
import { getMyGroups, getGroupById } from "@/lib/actions/housing-groups";
import { getCurrentUser } from "@/lib/auth";
import { Users, Heart, MapPin, DollarSign, Calendar, MessageSquare, FileText, CheckCircle, Clock, UserPlus, Receipt } from "lucide-react";

export const metadata: Metadata = {
  title: "Gruppi Alloggio — Convivenza",
  description: "Formazione gruppi e co-candidatura per alloggi condivisi su CasaStudente.",
};

export default async function GroupsPage() {
  const user = await getCurrentUser();
  const groups = await getMyGroups();
  const groupDetails = groups.length > 0 ? await getGroupById(groups[0].id) : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-600">
          Gruppi Alloggio
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Collaborative Housing Groups
        </h1>
        <p className="mt-4 max-w-3xl text-base text-gray-600">
          Crea un gruppo di 2-5 studenti, unisci i budget, cerca appartamenti insieme e candidati
          come gruppo. Divisione affitto per persona, gestione spese condivise e chat di gruppo integrate.
          Il 60%+ degli affitti studenteschi a Forlì sono appartamenti condivisi.
        </p>
      </section>

      {/* Group Details */}
      {groupDetails && (
        <>
          {/* Group Card */}
          <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{groupDetails.name}</h2>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {groupDetails.members.length}/{groupDetails.maxMembers} membri</span>
                  <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" /> €{groupDetails.combinedBudget}/mese</span>
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {groupDetails.preferredZones.join(", ") || "Non definite"}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {groupDetails.moveInDate || "Da definire"}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  groupDetails.status === "forming" ? "bg-blue-100 text-blue-700" :
                  groupDetails.status === "searching" ? "bg-amber-100 text-amber-700" :
                  groupDetails.status === "housed" ? "bg-green-100 text-green-700" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {groupDetails.status === "forming" ? "In formazione" :
                   groupDetails.status === "searching" ? "In ricerca" :
                   groupDetails.status === "applied" ? "Candidatura inviata" :
                   groupDetails.status === "housed" ? "Alloggiati" : "Sciolto"}
                </span>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-pink-500" />
                  <span className="text-sm font-medium text-gray-700">Armonia: {groupDetails.harmonyScore}%</span>
                </div>
              </div>
            </div>

            {/* Invite Code */}
            <div className="mt-4 rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Codice invito:</p>
              <p className="font-mono text-sm font-bold text-gray-900">{groupDetails.inviteCode}</p>
            </div>
          </section>

          {/* Members */}
          <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Users className="h-5 w-5" /> Membri del gruppo
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groupDetails.members.map((member) => (
                <div key={member.userId} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-sm font-bold text-pink-600">
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 text-xs text-gray-600">
                    <p>Budget: €{member.individualBudget}/mese</p>
                    <p>Ruolo: {member.role === "creator" ? "Creatore" : "Membro"}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {member.preferences.quietHours && <span className="rounded bg-blue-100 px-1.5 py-0.5 text-blue-700">🤫 Silenzio</span>}
                      {!member.preferences.smokingOk && <span className="rounded bg-green-100 px-1.5 py-0.5 text-green-700">🚭 No fumo</span>}
                      {member.preferences.petsOk && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-700">🐾 Animali ok</span>}
                    </div>
                  </div>
                </div>
              ))}

              {/* Add member slot */}
              {groupDetails.members.length < groupDetails.maxMembers && (
                <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-4">
                  <div className="text-center">
                    <UserPlus className="mx-auto h-8 w-8 text-gray-300" />
                    <p className="mt-2 text-sm text-gray-400">Invita un membro</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Applications */}
          {groupDetails.applications && groupDetails.applications.length > 0 && (
            <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <FileText className="h-5 w-5" /> Candidature di gruppo
              </h2>
              <div className="space-y-3">
                {groupDetails.applications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{app.listingTitle}</p>
                      <p className="text-xs text-gray-500">
                        €{app.perPersonRent}/persona/mese — Deposito: €{app.perPersonDeposit}/persona
                      </p>
                      <p className="text-xs text-gray-400">
                        Confermati: {app.confirmedMembers.length}/{groupDetails.members.length}
                      </p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                      app.status === "pending" ? "bg-amber-100 text-amber-700" :
                      app.status === "accepted" ? "bg-green-100 text-green-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {app.status === "pending" ? "In attesa" : app.status === "accepted" ? "Accettata" : app.status === "rejected" ? "Rifiutata" : "Ritirata"}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Shared Expenses */}
          <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Receipt className="h-5 w-5" /> Spese condivise
            </h2>
            {groupDetails.expenses.length === 0 ? (
              <p className="text-sm text-gray-500">Nessuna spesa condivisa registrata.</p>
            ) : (
              <div className="space-y-3">
                {groupDetails.expenses.map((exp) => (
                  <div key={exp.id} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{exp.description}</p>
                        <p className="text-xs text-gray-500">
                          Pagato da {exp.paidByName} — {exp.category} — {new Date(exp.createdAt).toLocaleDateString("it-IT")}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">€{exp.amount}</p>
                    </div>
                    <div className="mt-2 flex gap-2">
                      {exp.splits.map((split) => (
                        <span key={split.userId} className={`rounded-full px-2 py-0.5 text-xs ${
                          split.settled ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {split.name.split(" ")[0]}: €{split.amount} {split.settled ? "✓" : "⏳"}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Balances */}
            {groupDetails.balances && groupDetails.balances.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">Bilancio</h3>
                <div className="grid gap-2 sm:grid-cols-3">
                  {groupDetails.balances.filter(b => b.name).map((b) => (
                    <div key={b.userId} className="rounded-lg bg-gray-50 p-3 text-center">
                      <p className="text-sm font-medium text-gray-900">{b.name}</p>
                      <p className={`mt-1 text-lg font-bold ${
                        b.netBalance > 0 ? "text-green-600" : b.netBalance < 0 ? "text-red-600" : "text-gray-600"
                      }`}>
                        {b.netBalance > 0 ? "+" : ""}€{b.netBalance.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {b.netBalance > 0 ? "Da ricevere" : b.netBalance < 0 ? "Da pagare" : "In pari"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </>
      )}

      {/* No groups */}
      {groups.length === 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <Users className="mx-auto h-12 w-12 text-gray-300" />
          <h2 className="mt-4 text-lg font-semibold text-gray-900">Nessun gruppo</h2>
          <p className="mt-2 text-sm text-gray-500">
            Crea un gruppo per cercare appartamenti condivisi con i tuoi amici o compagni di corso.
          </p>
          <button className="mt-4 rounded-lg bg-pink-600 px-6 py-3 text-sm font-semibold text-white hover:bg-pink-700">
            Crea nuovo gruppo
          </button>
        </section>
      )}

      {/* How it works */}
      <section className="rounded-2xl border border-pink-200 bg-pink-50 p-8">
        <h2 className="text-lg font-semibold text-pink-900">Come funzionano i gruppi</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { step: "1", label: "Crea il gruppo", desc: "Scegli nome, budget e preferenze condivise" },
            { step: "2", label: "Invita amici", desc: "Condividi il codice invito con i tuoi compagni" },
            { step: "3", label: "Cerca insieme", desc: "Browse annunci con filtri e punteggi di gruppo" },
            { step: "4", label: "Candidati", desc: "Invio candidatura collettiva con split affitto" },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-pink-200 text-sm font-bold text-pink-800">
                {s.step}
              </div>
              <p className="mt-2 text-sm font-medium text-pink-900">{s.label}</p>
              <p className="mt-1 text-xs text-pink-700">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
