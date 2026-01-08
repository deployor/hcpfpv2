import Link from "next/link";
import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { overlays, overlaySeries } from "@/lib/db/schema";

export default async function OverlaysPage() {
  const skipDb = process.env.SKIP_DB === "1";

  const series = skipDb
    ? []
    : await db
        .select({
          id: overlaySeries.id,
          slug: overlaySeries.slug,
          name: overlaySeries.name,
          description: overlaySeries.description,
          isPublic: overlaySeries.isPublic,
          createdAt: overlaySeries.createdAt,
        })
        .from(overlaySeries)
        .where(eq(overlaySeries.isPublic, true))
        .orderBy(desc(overlaySeries.createdAt));

  const overlayRows = skipDb
    ? []
    : await db
        .select({
          id: overlays.id,
          seriesId: overlays.seriesId,
          slug: overlays.slug,
          name: overlays.name,
          imageUrl: overlays.imageUrl,
          placement: overlays.placement,
          createdAt: overlays.createdAt,
        })
        .from(overlays)
        .where(eq(overlays.isApproved, true))
        .orderBy(desc(overlays.createdAt));

  const bySeries = new Map<string, typeof overlayRows>();
  for (const o of overlayRows) {
    const arr = bySeries.get(o.seriesId) ?? [];
    arr.push(o);
    bySeries.set(o.seriesId, arr);
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-6">
      <header className="card flex flex-col gap-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Overlays</h1>
            <p className="text-muted mt-1 text-sm">
              Packs grouped into series. Pick one to apply on a PFP.
            </p>
          </div>
          <div className="flex gap-2">
            <Link className="btn text-sm" href="/">
              Home
            </Link>
            <Link className="btn text-sm" href="/submit">
              Submit
            </Link>
            <Link className="btn text-sm" href="/admin/overlays">
              Admin
            </Link>
          </div>
        </div>

        
      </header>

      <div className="flex flex-col gap-8">
        {series.map((s) => (
          <section id={s.slug} key={s.id} className="card scroll-mt-24 p-5">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">{s.name}</h2>
                <div className="text-muted text-xs">
                    <span className="text-[rgba(248,113,113,0.9)]">{s.slug}</span>
                    {s.description ? <span> · {s.description}</span> : null}
                  </div>
              </div>
              <div className="text-muted text-xs">
                {(bySeries.get(s.id) ?? []).length} overlays
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {(bySeries.get(s.id) ?? []).map((o) => (
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

                    <div className="p-3">
                      <div className="text-sm font-bold text-white">
                        {o.name}
                      </div>
                      <div className="mt-0.5 text-xs text-[rgba(156,163,175,1)]">
                        {o.slug}
                      </div>
                      {o.placement ? (
                        <div className="mt-0.5 text-xs text-[rgba(156,163,175,1)]">
                          {o.placement}
                        </div>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
          </section>
        ))}

        {series.length === 0 ? (
          <section className="card p-6">
              <h2 className="text-lg font-medium">No overlays yet</h2>
              <p className="text-muted mt-1 text-sm">
                Add a series + overlays in the DB, then refresh.
              </p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
