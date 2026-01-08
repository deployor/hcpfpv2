import Image from "next/image";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { overlays, overlaySeries } from "@/lib/db/schema";

export default async function Home() {
  const skipDb = process.env.SKIP_DB === "1";

  const series = skipDb
    ? []
    : await db
        .select({
          id: overlaySeries.id,
          slug: overlaySeries.slug,
          name: overlaySeries.name,
          description: overlaySeries.description,
          createdAt: overlaySeries.createdAt,
        })
        .from(overlaySeries)
        .where(eq(overlaySeries.isPublic, true))
        .orderBy(desc(overlaySeries.createdAt));

  const banners = skipDb
    ? []
    : await db
        .select({
          seriesId: overlays.seriesId,
          imageUrl: overlays.imageUrl,
          createdAt: overlays.createdAt,
        })
        .from(overlays)
        .where(eq(overlays.isApproved, true))
        .orderBy(desc(overlays.createdAt));

  const bannerBySeries = new Map<string, string>();
  for (const b of banners) {
    if (!bannerBySeries.has(b.seriesId)) bannerBySeries.set(b.seriesId, b.imageUrl);
  }

  return (
    <main className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-blob-purple absolute -left-1/4 top-0 h-[420px] w-[360px] -rotate-12 rounded-full" />
        <div className="bg-blob-blue absolute right-0 top-1/3 h-[360px] w-[280px] rotate-12 rounded-full" />
        <div className="bg-grid absolute inset-0" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 p-6">
        <header className="card flex flex-col gap-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-muted text-sm">pick a pack → open editor</span>
            </div>
            <div className="flex gap-2">
              <Link className="btn text-sm" href="/editor">
                Open editor
              </Link>
              <Link className="btn text-sm" href="/submit">
                Submit overlay
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="https://hackclub.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative h-12 w-12"
            >
              <Image
                src="/hackclub.png"
                alt="Hack Club"
                fill
                className="object-contain"
              />
              <div className="absolute -inset-2 -z-10 rounded-full bg-[rgba(248,113,113,0.18)] opacity-0 blur transition-opacity group-hover:opacity-80" />
            </Link>

            <div className="flex flex-col gap-1">
              <h1 className="flex items-center gap-2 text-4xl font-bold tracking-tight">
                <span className="text-[var(--brand)]">HC</span>
                <span>PFP</span>
              </h1>
              <p className="text-muted max-w-3xl">
                Every overlay belongs to a series. Browse packs below, then render
                your PFP in the editor.
              </p>
            </div>
          </div>

          
        </header>

        <section className="grid gap-6 sm:grid-cols-2">
          {series.map((s) => {
            const banner = bannerBySeries.get(s.id);
            return (
              <Link
                key={s.id}
                href={`/overlays#${encodeURIComponent(s.slug)}`}
                className="group relative block overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] transition-colors hover:border-[rgba(55,65,81,1)]"
              >
                <div className="relative h-40 w-full overflow-hidden bg-[rgba(31,41,55,1)]">
                  {banner ? (
                    <Image
                      alt={s.name}
                      src={banner}
                      fill
                      className="object-cover p-4"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-muted text-xs">no banner yet</div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(3,7,18,0.55),transparent)]" />
                </div>

                <div className="relative p-6">
                  <h2 className="text-xl font-semibold tracking-tight">{s.name}</h2>
                  <p className="mt-2 text-sm text-[rgba(156,163,175,1)] line-clamp-2">
                    {s.description ?? "A series of overlays. Click to view variants."}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="font-medium text-[rgba(96,165,250,1)]">
                      View variants
                    </span>
                    <span className="text-xs text-[rgba(248,113,113,0.9)]">
                      {s.slug}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}

          {series.length === 0 ? (
            <div className="card p-6">
              <div className="text-lg font-medium">No series yet</div>
              <p className="text-muted mt-1 text-sm">
                Create a series and approve at least one overlay to show a banner.
              </p>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
