import { requireAuth } from "@/lib/auth";
import { complianceStore } from "@/lib/stores/documents";
import { leaseStore } from "@/lib/stores";
import { calculateCedolareSecca } from "@/lib/stores/documents";
import { toggleComplianceAction } from "@/lib/actions/documents";
import { AlertCircle, Calculator, CheckCircle2, Circle, FileText, Shield } from "lucide-react";

export default async function CompliancePage() {
  const user = await requireAuth();

  const leases = await leaseStore.filter(
    (l) => l.tenantId === user.id || l.landlordId === user.id
  );
  const activeLeases = leases.filter((l) => l.status === "active");

  const allCompliance = await complianceStore.filter((c) => c.userId === user.id);

  // Tax calculation for active leases
  const taxCalcs = activeLeases.map((lease) =>
    calculateCedolareSecca(lease.monthlyRent, lease.contractType)
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <Shield className="h-6 w-6 text-blue-600" /> Centro Conformità
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Traccia gli adempimenti del contratto e calcola la cedolare secca
        </p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <div className="flex items-start gap-2">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <p>
            <strong>Disclaimer:</strong> Le informazioni fornite non costituiscono consulenza fiscale o legale.
            Per questioni specifiche, consultare un commercialista o un avvocato.
          </p>
        </div>
      </div>

      {/* Compliance Checklist */}
      {activeLeases.length > 0 ? (
        activeLeases.map((lease) => {
          const items = allCompliance.filter((c) => c.leaseId === lease.id);
          const completedCount = items.filter((c) => c.completed).length;
          const totalCount = items.length;
          const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

          return (
            <div key={lease.id} className="rounded-xl border border-gray-200 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{lease.listingTitle}</h2>
                  <p className="text-sm text-gray-500">
                    Contratto {lease.contractType} · {lease.startDate} — {lease.endDate}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{percentage}%</p>
                  <p className="text-xs text-gray-500">completato</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-4 h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full ${percentage === 100 ? "bg-green-500" : "bg-blue-500"}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Checklist items */}
              <div className="space-y-2">
                {items.map((item) => (
                  <form key={item.id} action={toggleComplianceAction} className="flex items-start gap-3 rounded-lg border border-gray-100 p-3">
                    <input type="hidden" name="itemId" value={item.id} />
                    <button type="submit" className="mt-0.5 flex-shrink-0">
                      {item.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-300" />
                      )}
                    </button>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${item.completed ? "text-gray-400 line-through" : "text-gray-900"}`}>
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                      {item.deadline && !item.completed && (
                        <p className="mt-1 text-xs text-amber-600">
                          Scadenza: {new Date(item.deadline).toLocaleDateString("it-IT")}
                        </p>
                      )}
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${
                      item.category === "tax" ? "bg-red-100 text-red-700" :
                      item.category === "registration" ? "bg-blue-100 text-blue-700" :
                      item.category === "certificate" ? "bg-green-100 text-green-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {item.category === "tax" ? "Fiscale" :
                       item.category === "registration" ? "Registrazione" :
                       item.category === "certificate" ? "Certificato" : "Contratto"}
                    </span>
                  </form>
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <div className="rounded-xl border border-gray-200 p-8 text-center">
          <FileText className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <p className="text-gray-500">Nessun contratto attivo trovato</p>
        </div>
      )}

      {/* Tax Calculator */}
      {taxCalcs.length > 0 && (
        <div className="rounded-xl border border-gray-200 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Calculator className="h-5 w-5 text-green-600" /> Calcolo Cedolare Secca
          </h2>
          {taxCalcs.map((calc, i) => (
            <div key={i} className="rounded-lg bg-green-50 p-4">
              <dl className="grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-gray-600">Canone annuo</dt>
                  <dd className="text-lg font-semibold text-gray-900">€{calc.annualRent.toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Aliquota ({calc.contractType})</dt>
                  <dd className="text-lg font-semibold text-gray-900">{(calc.taxRate * 100).toFixed(0)}%</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Imposta annua</dt>
                  <dd className="text-lg font-semibold text-red-600">€{calc.annualTax.toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Rata trimestrale</dt>
                  <dd className="text-lg font-semibold text-gray-900">€{calc.quarterlyTax.toLocaleString()}</dd>
                </div>
              </dl>
              <div className="mt-3 border-t border-green-200 pt-3">
                <p className="text-xs text-gray-600">
                  <strong>Scadenze:</strong> {calc.quarterlyDeadlines.join(" · ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
