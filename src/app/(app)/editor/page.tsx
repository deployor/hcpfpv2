import Link from "next/link";
import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { overlays, overlaySeries } from "@/lib/db/schema";

import { EditorClient } from "./ui";

export default async function EditorPage() {
  const overlayRows = await db
    .select({
      id: overlays.id,
      seriesId: overlays.seriesId,
      seriesSlug: overlaySeries.slug,
      seriesName: overlaySeries.name,
      slug: overlays.slug,
      name: overlays.name,
      imageUrl: overlays.imageUrl,
      placement: overlays.placement,
      createdAt: overlays.createdAt,
    })
    .from(overlays)
    .innerJoin(overlaySeries, eq(overlays.seriesId, overlaySeries.id))
    .where(eq(overlays.isApproved, true))
    .orderBy(desc(overlays.createdAt));

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-6">
      <header className="card flex flex-col gap-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Editor</h1>
            <p className="text-muted mt-1 text-sm">
              Upload a photo, pick an overlay, render, download.
            </p>
          </div>
          <div className="flex gap-2">
            <Link className="btn text-sm" href="/overlays">
              Overlays
            </Link>
            <Link className="btn text-sm" href="/">
              Home
            </Link>
          </div>
        </div>
      </header>

      <EditorClient overlays={overlayRows} />
    </main>
  );
}
