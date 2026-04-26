import { academicEventStore, semesterStore } from "@/lib/stores/calendar";
import { Calendar, Clock, GraduationCap, AlertCircle } from "lucide-react";

const eventTypeConfig: Record<string, { color: string; icon: string; label: string }> = {
  semester_start: { color: "bg-green-100 text-green-700 border-green-200", icon: "🎓", label: "Inizio lezioni" },
  semester_end: { color: "bg-red-100 text-red-700 border-red-200", icon: "📕", label: "Fine lezioni" },
  enrollment: { color: "bg-blue-100 text-blue-700 border-blue-200", icon: "📝", label: "Iscrizioni" },
  ergo_deadline: { color: "bg-amber-100 text-amber-700 border-amber-200", icon: "⚠️", label: "Scadenza Er.Go" },
  exam_period: { color: "bg-purple-100 text-purple-700 border-purple-200", icon: "📚", label: "Sessione esami" },
  holiday: { color: "bg-gray-100 text-gray-700 border-gray-200", icon: "🏖️", label: "Vacanza" },
};

export default async function CalendarPage() {
  const semesters = await semesterStore.findAll();
  const events = await academicEventStore.findAll();

  const sortedEvents = [...events].sort((a, b) => a.startDate.localeCompare(b.startDate));

  // Check for upcoming deadlines
  const now = new Date();
  const upcomingDeadlines = sortedEvents.filter((e) => {
    const eventDate = new Date(e.startDate);
    const diffDays = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays > 0 && diffDays <= 60 && (e.type === "ergo_deadline" || e.type === "enrollment");
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Calendario Accademico</h1>
        </div>
        <p className="mt-3 text-lg text-gray-600">
          Date importanti dell&apos;Università di Bologna — Campus di Forlì. Pianifica la tua ricerca di alloggio in base al calendario universitario.
        </p>
      </div>

      {/* Upcoming Deadlines Alert */}
      {upcomingDeadlines.length > 0 && (
        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <h2 className="font-semibold text-amber-800">Scadenze in arrivo</h2>
          </div>
          {upcomingDeadlines.map((d) => (
            <p key={d.id} className="text-sm text-amber-700">
              {d.title} — <strong>{new Date(d.startDate).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}</strong>
            </p>
          ))}
        </div>
      )}

      {/* Semesters */}
      <section className="mb-10">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
          <Calendar className="h-5 w-5 text-blue-600" /> Semestri
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {semesters.map((sem) => (
            <div key={sem.id} className="rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900">{sem.name}</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Inizio</dt>
                  <dd className="font-medium text-gray-900">{new Date(sem.startDate).toLocaleDateString("it-IT")}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Fine</dt>
                  <dd className="font-medium text-gray-900">{new Date(sem.endDate).toLocaleDateString("it-IT")}</dd>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-2">
                  <dt className="text-gray-500">Scadenza iscrizione</dt>
                  <dd className="font-medium text-amber-700">{new Date(sem.enrollmentDeadline).toLocaleDateString("it-IT")}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
          <Clock className="h-5 w-5 text-blue-600" /> Timeline eventi
        </h2>
        <div className="space-y-4">
          {sortedEvents.map((event) => {
            const config = eventTypeConfig[event.type] || eventTypeConfig.holiday;
            return (
              <div key={event.id} className={`rounded-xl border p-4 ${config.color}`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{config.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{event.title}</h3>
                      <span className="text-xs font-medium">
                        {new Date(event.startDate).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" })}
                        {event.endDate && ` — ${new Date(event.endDate).toLocaleDateString("it-IT", { day: "numeric", month: "short" })}`}
                      </span>
                    </div>
                    <p className="mt-1 text-sm opacity-80">{event.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
