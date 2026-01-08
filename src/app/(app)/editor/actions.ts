"use server";

import sharp from "sharp";

export type RenderParams = {
  baseImageDataUrl: string;
  overlayUrl: string;
  size: number;
};

export type RenderResult =
  | { ok: true; pngBase64: string }
  | { ok: false; error: string };

function dataUrlToBuffer(dataUrl: string) {
  const match = dataUrl.match(/^data:(.+);base64,(.*)$/);
  if (!match) throw new Error("Invalid data URL");
  return Buffer.from(match[2]!, "base64");
}

export async function renderAvatar(params: RenderParams): Promise<RenderResult> {
  try {
    const baseBuf = dataUrlToBuffer(params.baseImageDataUrl);

    const base = sharp(baseBuf)
      .resize(params.size, params.size, {
        fit: "cover",
        position: "centre",
      })
      .ensureAlpha();

    const overlayResp = await fetch(params.overlayUrl, { cache: "no-store" });
    if (!overlayResp.ok) {
      return { ok: false, error: `Overlay fetch failed (${overlayResp.status})` };
    }

    const overlayBuf = Buffer.from(await overlayResp.arrayBuffer());
    const overlay = await sharp(overlayBuf)
      .resize(params.size, params.size, { fit: "cover" })
      .ensureAlpha()
      .png()
      .toBuffer();

    const out = await base
      .composite([{ input: overlay }])
      .png({ compressionLevel: 9 })
      .toBuffer();

    return { ok: true, pngBase64: out.toString("base64") };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: msg };
  }
}
