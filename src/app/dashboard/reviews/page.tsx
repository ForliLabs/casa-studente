import type { Metadata } from "next";
import Link from "next/link";
import { reviewStore } from "@/lib/stores";

export const metadata: Metadata = {
  title: "Le mie recensioni",
  description: "Gestisci le recensioni ricevute e inviate su CasaStudente.",
};

export default async function DashboardReviewsPage() {
  const reviews = await reviewStore.findAll();

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Recensioni
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
              Le tue recensioni
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-gray-600">
              Monitora il feedback ricevuto da studenti e proprietari.
            </p>
          </div>
          <Link
            href="/reviews"
            className="rounded-xl border border-gray-300 px-5 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Vedi tutte le recensioni
          </Link>
        </div>
      </section>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">{review.reviewerName}</p>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {review.reviewerRole === "student" ? "Studente" : "Proprietario"}
                  </span>
                  {review.verifiedLease && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                      Contratto verificato
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Per: {review.revieweeName} &middot; {review.listingTitle}
                </p>
              </div>
              <div className="flex gap-0.5 text-lg">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className={s <= review.ratingOverall ? "text-amber-500" : "text-gray-300"}>
                    &#9733;
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-600">{review.comment}</p>
            <p className="mt-3 text-xs text-gray-400">
              {new Date(review.createdAt).toLocaleDateString("it-IT", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
