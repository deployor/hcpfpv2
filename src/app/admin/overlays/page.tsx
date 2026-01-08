import Link from "next/link";
import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { overlays, overlaySeries } from "@/lib/db/schema";

import { approveOverlay, rejectOverlay } from "./actions";

export default async function AdminOverlaysPage() {
  const pending = await db
    .select({
      id: overlays.id,
      slug: overlays.slug,
      name: overlays.name,
      imageUrl: overlays.imageUrl,
      placement: overlays.placement,
      createdAt: overlays.createdAt,
      seriesId: overlays.seriesId,
      seriesSlug: overlaySeries.slug,
      seriesName: overlaySeries.name,
    })
    .from(overlays)
    .innerJoin(overlaySeries, eq(overlays.seriesId, overlaySeries.id))
    .where(eq(overlays.isApproved, false))
    .orderBy(desc(overlays.createdAt));

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-6">
      <header className="card flex flex-col gap-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Admin · Overlays</h1>
            <p className="text-muted mt-1 text-sm">Approve or reject submitted overlays.</p>
          </div>
          <div className="flex gap-2">
            <Link className="btn text-sm" href="/overlays">
              Public overlays
            </Link>
            <Link className="btn text-sm" href="/submit">
              Submit
            </Link>
          </div>
        </div>
      </header>

      <section className="card p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-medium">Pending</h2>
          <div className="text-muted text-sm">{pending.length} items</div>
        </div>

        {pending.length === 0 ? (
          <div className="text-muted mt-3 text-sm">No pending overlays.</div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pending.map((o) => (
              <article
                key={o.id}
                className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={o.name}
                  className="aspect-square w-full bg-[rgba(31,41,55,1)] object-cover p-3"
                  src={o.imageUrl}
                />

                <div className="grid gap-2 p-4">
                  <div>
                    <div className="text-sm font-semibold">{o.name}</div>
                    <div className="text-muted mt-0.5 text-xs">
                      {o.seriesName} · <span className="text-[rgba(248,113,113,0.9)]">{o.seriesSlug}</span>
                    </div>
                    <div className="text-muted mt-0.5 text-xs">{o.slug}</div>
                    {o.placement ? (
                      <div className="text-muted mt-0.5 text-xs">{o.placement}</div>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <form action={approveOverlay}>
                      <input name="id" type="hidden" value={o.id} />
                      <button className="btn text-sm" type="submit">
                        Approve
                      </button>
                    </form>

                    <form action={rejectOverlay}>
                      <input name="id" type="hidden" value={o.id} />
                      <button
                        className="btn text-sm border-[rgba(220,38,38,0.45)] bg-[rgba(220,38,38,0.10)]"
                        type="submit"
                      >
                        Reject
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
