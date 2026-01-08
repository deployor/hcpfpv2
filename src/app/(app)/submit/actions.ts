"use server";

import crypto from "node:crypto";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/lib/db/client";
import { overlays, overlaySeries } from "@/lib/db/schema";
import { uploadPublicPng } from "@/lib/r2/upload";

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function submitOverlay(formData: FormData): Promise<void> {
  const seriesIdInput = String(formData.get("seriesId") ?? "").trim();
  const seriesName = String(formData.get("seriesName") ?? "").trim();
  const seriesSlugInput = String(formData.get("seriesSlug") ?? "").trim();
  const namePrefix = String(formData.get("namePrefix") ?? "").trim();
  const placement = String(formData.get("placement") ?? "").trim();

  const files = formData.getAll("files").filter((v): v is File => v instanceof File);
  if (files.length === 0) {
    redirect(`/submit?error=${encodeURIComponent("Missing file(s)")}`);
  }

  // Pick existing series or create a new one
  let seriesId: string | null = seriesIdInput || null;
  let seriesSlug: string | null = null;

  if (seriesId) {
    const existing = await db
      .select({ id: overlaySeries.id, slug: overlaySeries.slug, isPublic: overlaySeries.isPublic })
      .from(overlaySeries)
      .where(eq(overlaySeries.id, seriesId))
      .limit(1);

    const row = existing[0];
    if (!row) redirect(`/submit?error=${encodeURIComponent("Invalid series")}`);
    if (!row.isPublic) redirect(`/submit?error=${encodeURIComponent("Series is not public")}`);

    seriesSlug = row.slug;
  } else {
    if (!seriesName)
      redirect(`/submit?error=${encodeURIComponent("Series name is required")}`);

    seriesSlug = slugify(seriesSlugInput || seriesName);
    if (!seriesSlug)
      redirect(`/submit?error=${encodeURIComponent("Invalid series slug")}`);

    // Find or create series by slug
    const found = await db
      .select({ id: overlaySeries.id })
      .from(overlaySeries)
      .where(eq(overlaySeries.slug, seriesSlug))
      .limit(1);

    seriesId = found[0]?.id ?? null;
    if (!seriesId) {
      const created = await db
        .insert(overlaySeries)
        .values({ slug: seriesSlug, name: seriesName, isPublic: true })
        .returning({ id: overlaySeries.id });
      seriesId = created[0]!.id;
    }
  }

  const ids: string[] = [];

  for (const file of files) {
    if (file.type !== "image/png") {
      redirect(
        `/submit?error=${encodeURIComponent("All overlays must be PNG (with transparency).")}`,
      );
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    if (bytes.byteLength > 5 * 1024 * 1024) {
      redirect(`/submit?error=${encodeURIComponent("File too large (max 5MB)")}`);
    }

    const baseName = file.name.replace(/\.png$/i, "").trim();
    const finalName = [namePrefix, baseName].filter(Boolean).join(" - ") || baseName;
    const overlaySlug = slugify(finalName);
    if (!overlaySlug)
      redirect(`/submit?error=${encodeURIComponent("Invalid overlay name")}`);

    const rand = crypto.randomBytes(8).toString("hex");
    const key = `overlays/${seriesSlug}/${overlaySlug}-${rand}.png`;
    const imageUrl = await uploadPublicPng({ key, body: bytes });

    const inserted = await db
      .insert(overlays)
      .values({
        seriesId: seriesId!,
        slug: overlaySlug,
        name: finalName,
        imageUrl,
        placement: placement || null,
        isApproved: false,
      })
      .returning({ id: overlays.id });

    ids.push(inserted[0]!.id);
  }

  redirect(`/submit?ok=1&ids=${encodeURIComponent(ids.join(","))}`);
}
