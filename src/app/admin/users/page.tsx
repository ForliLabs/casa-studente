import { getAllUsers, updateUserAction } from "@/lib/actions/admin";
import { BadgeCheck, Ban, ShieldCheck } from "lucide-react";

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Gestione Utenti</h1>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Utente</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Ruolo</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Stato</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Registrato</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users.map((user) => (
              <tr key={user.id} className={user.banned ? "bg-red-50" : ""}>
                <td className="whitespace-nowrap px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                    user.role === "admin" ? "bg-red-100 text-red-700" :
                    user.role === "landlord" ? "bg-blue-100 text-blue-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {user.role === "admin" && <ShieldCheck className="h-3 w-3" />}
                    {user.role === "admin" ? "Admin" : user.role === "landlord" ? "Proprietario" : "Studente"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex items-center gap-2">
                    {user.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                        <BadgeCheck className="h-3 w-3" /> Verificato
                      </span>
                    )}
                    {user.banned && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs text-red-700">
                        <Ban className="h-3 w-3" /> Bannato
                      </span>
                    )}
                    {!user.verified && !user.banned && (
                      <span className="text-xs text-gray-400">Non verificato</span>
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString("it-IT")}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  {user.role !== "admin" && (
                    <div className="flex justify-end gap-2">
                      {!user.verified ? (
                        <form action={updateUserAction}>
                          <input type="hidden" name="userId" value={user.id} />
                          <input type="hidden" name="action" value="verify" />
                          <button type="submit" className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-200">
                            Verifica
                          </button>
                        </form>
                      ) : (
                        <form action={updateUserAction}>
                          <input type="hidden" name="userId" value={user.id} />
                          <input type="hidden" name="action" value="unverify" />
                          <button type="submit" className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200">
                            Rimuovi verifica
                          </button>
                        </form>
                      )}
                      {!user.banned ? (
                        <form action={updateUserAction}>
                          <input type="hidden" name="userId" value={user.id} />
                          <input type="hidden" name="action" value="ban" />
                          <button type="submit" className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-200">
                            Banna
                          </button>
                        </form>
                      ) : (
                        <form action={updateUserAction}>
                          <input type="hidden" name="userId" value={user.id} />
                          <input type="hidden" name="action" value="unban" />
                          <button type="submit" className="rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 hover:bg-amber-200">
                            Sblocca
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
