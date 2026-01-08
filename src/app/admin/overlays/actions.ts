"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db/client";
import { overlays } from "@/lib/db/schema";

function getId(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("Missing id");
  return id;
}

export async function approveOverlay(formData: FormData) {
  const id = getId(formData);

  await db.update(overlays).set({ isApproved: true }).where(eq(overlays.id, id));

  revalidatePath("/overlays");
  revalidatePath("/editor");
  revalidatePath("/admin/overlays");
}

export async function rejectOverlay(formData: FormData) {
  const id = getId(formData);

  await db.delete(overlays).where(eq(overlays.id, id));

  revalidatePath("/overlays");
  revalidatePath("/editor");
  revalidatePath("/admin/overlays");
}
