import Link from "next/link";

import { submitOverlay } from "@/app/(app)/submit/actions";

import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { overlaySeries } from "@/lib/db/schema";

export default async function SubmitPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string; ids?: string }>;
}) {
  const sp = await searchParams;

  const series = await db
    .select({ id: overlaySeries.id, slug: overlaySeries.slug, name: overlaySeries.name })
    .from(overlaySeries)
    .where(eq(overlaySeries.isPublic, true))
    .orderBy(desc(overlaySeries.createdAt));

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <header className="card flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Submit an overlay
            </h1>
            <p className="text-muted mt-1 text-sm">
              Upload a transparent PNG overlay. It will be reviewed before it
              shows up.
            </p>
          </div>
          <Link className="btn text-sm" href="/overlays">
            Back to overlays
          </Link>
        </div>

        
      </header>

      {sp.error ? (
        <section className="card border-[rgba(220,38,38,0.45)] bg-[rgba(220,38,38,0.10)] p-5">
          <div className="text-sm font-medium">Submission failed</div>
          <div className="text-muted mt-1 text-sm">{sp.error}</div>
        </section>
      ) : null}

      {sp.ok ? (
        <section className="card border-[rgba(220,38,38,0.35)] bg-[rgba(220,38,38,0.07)] p-5">
          <div className="text-sm font-medium">Submitted</div>
          <div className="text-muted mt-1 text-sm">
            Your overlay(s) are pending approval.
            {sp.ids ? (
              <>
                {" "}
                <span className="text-[rgba(220,38,38,0.9)]">{sp.ids}</span>
              </>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="card p-6">
        <h2 className="text-lg font-medium">Submit</h2>

        <form className="mt-4 grid gap-4" action={submitOverlay}>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-sm">
              <div className="text-muted mb-1 text-xs">Series (pick existing)</div>
              <select className="btn w-full text-sm" name="seriesId">
                <option value="">Create new…</option>
                {series.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.slug})
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-3">
              <label className="text-sm">
                <div className="text-muted mb-1 text-xs">New series name</div>
                <input
                  className="btn w-full text-sm"
                  name="seriesName"
                  placeholder="shipwrecked"
                />
              </label>

              <label className="text-sm">
                <div className="text-muted mb-1 text-xs">New series slug (optional)</div>
                <input
                  className="btn w-full text-sm"
                  name="seriesSlug"
                  placeholder="shipwrecked"
                />
              </label>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-sm">
              <div className="text-muted mb-1 text-xs">Overlay name prefix (optional)</div>
              <input
                className="btn w-full text-sm"
                name="namePrefix"
                placeholder="Purple Corner"
              />
            </label>

            <label className="text-sm">
              <div className="text-muted mb-1 text-xs">Placement (optional)</div>
              <input
                className="btn w-full text-sm"
                name="placement"
                placeholder="top-left / bottom-right / full-frame"
              />
            </label>
          </div>

          <label className="text-sm">
            <div className="text-muted mb-1 text-xs">PNG files (you can select multiple)</div>
            <input
              className="btn w-full text-sm"
              name="files"
              type="file"
              accept="image/png"
              multiple
              required
            />
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-muted text-xs">
              Upload goes to R2. The record will be created as <code>pending</code>
              (not approved).
            </p>
            <button className="btn text-sm" type="submit">
              Submit overlay
            </button>
          </div>
        </form>
      </section>

      <section className="card p-6">
        <h2 className="text-lg font-medium">After submit</h2>
        <p className="text-muted mt-2 text-sm">
          Wait for approval by admin
        </p>
      </section>
    </main>
  );
}
