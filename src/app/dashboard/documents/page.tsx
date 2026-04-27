import { requireAuth } from "@/lib/auth";
import { documentStore, templateStore } from "@/lib/stores/documents";
import { uploadDocumentAction, deleteDocumentAction } from "@/lib/actions/documents";
import { Download, File, FileText, Plus, Trash2 } from "lucide-react";

const typeLabels: Record<string, string> = {
  lease: "Contratto",
  id: "Documento identità",
  enrollment: "Iscrizione",
  receipt: "Ricevuta",
  tax: "Fiscale",
  template: "Modello",
  other: "Altro",
};

const typeColors: Record<string, string> = {
  lease: "bg-blue-100 text-blue-700",
  id: "bg-purple-100 text-purple-700",
  enrollment: "bg-green-100 text-green-700",
  receipt: "bg-amber-100 text-amber-700",
  tax: "bg-red-100 text-red-700",
  template: "bg-gray-100 text-gray-700",
  other: "bg-gray-100 text-gray-600",
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function DocumentsPage() {
  const user = await requireAuth();
  const documents = await documentStore.filter((d) => d.userId === user.id);
  const templates = await templateStore.findAll();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Archivio Documenti</h1>
          <p className="mt-1 text-sm text-gray-500">Gestisci contratti, ricevute e documenti importanti</p>
        </div>
      </div>

      {/* Upload form */}
      <div className="rounded-xl border border-gray-200 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Plus className="h-5 w-5" /> Carica documento
        </h2>
        <form action={uploadDocumentAction} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome documento</label>
            <input type="text" name="name" required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <select name="type" required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              {Object.entries(typeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Descrizione</label>
            <input type="text" name="description" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data scadenza (opzionale)</label>
            <input type="date" name="expiryDate" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Carica
            </button>
          </div>
        </form>
      </div>

      {/* Document list */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">I tuoi documenti ({documents.length})</h2>
        {documents.length === 0 ? (
          <div className="rounded-xl border border-gray-200 p-8 text-center">
            <FileText className="mx-auto mb-3 h-12 w-12 text-gray-300" />
            <p className="text-gray-500">Nessun documento caricato</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <File className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <span className={`rounded-full px-2 py-0.5 ${typeColors[doc.type]}`}>{typeLabels[doc.type]}</span>
                      <span>{formatFileSize(doc.size)}</span>
                      <span>· {new Date(doc.uploadedAt).toLocaleDateString("it-IT")}</span>
                      {doc.expiryDate && (
                        <span className="text-amber-600">Scade: {new Date(doc.expiryDate).toLocaleDateString("it-IT")}</span>
                      )}
                    </div>
                  </div>
                </div>
                <form action={deleteDocumentAction}>
                  <input type="hidden" name="documentId" value={doc.id} />
                  <button type="submit" className="rounded p-2 text-gray-400 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Templates */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Modelli scaricabili</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {templates.map((template) => (
            <div key={template.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div>
                <p className="font-medium text-gray-900">{template.name}</p>
                <p className="text-sm text-gray-500">{template.description}</p>
              </div>
              <button className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                <Download className="h-4 w-4" /> PDF
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
