import { feedStore, successStoryStore, contentStore } from "@/lib/stores/community";
import Link from "next/link";
import { BookOpen, Heart, MessageCircle, Share2, TrendingUp } from "lucide-react";

export default async function CommunityPage() {
  const feedItems = await feedStore.findAll();
  const stories = await successStoryStore.findAll();
  const articles = await contentStore.findAll();

  const featuredStories = stories.filter((s) => s.featured);
  const sortedFeed = [...feedItems].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Comunità CasaStudente</h1>
        <p className="mt-3 text-lg text-gray-600">
          Attività recenti, storie di successo e guide per vivere a Forlì da studenti
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
            <TrendingUp className="h-5 w-5 text-blue-600" /> Attività recente
          </h2>
          <div className="space-y-3">
            {sortedFeed.map((item) => (
              <div key={item.id} className="flex items-start gap-3 rounded-xl border border-gray-200 p-4">
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {formatRelativeTime(item.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Success Stories */}
          <h2 className="mb-4 mt-10 flex items-center gap-2 text-xl font-semibold text-gray-900">
            <Heart className="h-5 w-5 text-red-500" /> Storie di successo
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {featuredStories.map((story) => (
              <div key={story.id} className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-6">
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-3xl">{story.photoPlaceholder}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{story.studentName}</p>
                    <p className="text-xs text-gray-500">{story.program}</p>
                  </div>
                </div>
                <blockquote className="text-sm italic text-gray-700">
                  &ldquo;{story.quote}&rdquo;
                </blockquote>
                <p className="mt-2 text-xs text-gray-400">Quartiere: {story.neighborhood}</p>
              </div>
            ))}
          </div>

          {/* Share CTA */}
          <div className="mt-8 rounded-xl bg-blue-600 p-6 text-white">
            <h3 className="text-lg font-semibold">Invita un amico</h3>
            <p className="mt-1 text-sm text-blue-100">
              Conosci qualcuno che sta cercando casa a Forlì? Condividi CasaStudente e guadagna il badge &ldquo;Ambassador&rdquo;.
            </p>
            <div className="mt-4 flex gap-3">
              <button className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">
                <Share2 className="h-4 w-4" /> Condividi link
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2 text-sm font-medium text-white hover:bg-white/10">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar: Content Hub */}
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
            <BookOpen className="h-5 w-5 text-green-600" /> Guide per studenti
          </h2>
          <div className="space-y-3">
            {articles.map((article) => (
              <div key={article.id} className="rounded-xl border border-gray-200 p-4 hover:bg-gray-50">
                <span className={`mb-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                  article.category === "guide" ? "bg-blue-100 text-blue-700" :
                  article.category === "checklist" ? "bg-green-100 text-green-700" :
                  article.category === "tips" ? "bg-amber-100 text-amber-700" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  {article.category === "guide" ? "Guida" :
                   article.category === "checklist" ? "Checklist" :
                   article.category === "tips" ? "Consigli" : "Info"}
                </span>
                <h3 className="font-medium text-gray-900">{article.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{article.summary}</p>
                <p className="mt-2 text-xs text-gray-400">
                  Aggiornato: {new Date(article.updatedAt).toLocaleDateString("it-IT")}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
            <p className="text-sm font-medium text-gray-700">Hai un consiglio per i nuovi studenti?</p>
            <p className="mt-1 text-xs text-gray-500">Contribuisci alla comunità condividendo la tua esperienza</p>
            <Link
              href="/neighborhoods"
              className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Lascia un consiglio →
            </Link>
          </div>

          {/* Calendar link */}
          <Link
            href="/calendar"
            className="mt-4 block rounded-xl border border-blue-200 bg-blue-50 p-4 text-center hover:bg-blue-100"
          >
            <p className="text-sm font-medium text-blue-700">📅 Calendario accademico</p>
            <p className="mt-1 text-xs text-blue-600">Scadenze, semestri e date importanti</p>
          </Link>
        </div>
      </div>
    </main>
  );
}

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} min fa`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ore fa`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} giorni fa`;
  return new Date(dateStr).toLocaleDateString("it-IT");
}
