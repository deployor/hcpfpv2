"use client";

import { useMemo, useState, useTransition } from "react";

import { renderAvatar } from "./actions";

type Overlay = {
  id: string;
  seriesId: string;
  seriesSlug: string;
  seriesName: string;
  slug: string;
  name: string;
  imageUrl: string;
  placement: string | null;
};

function downloadDataUrl(filename: string, dataUrl: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function EditorClient({ overlays }: { overlays: Overlay[] }) {
  const [baseDataUrl, setBaseDataUrl] = useState<string | null>(null);
  const [overlayId, setOverlayId] = useState<string | null>(
    overlays.length ? overlays[0]!.id : null,
  );
  const [size, setSize] = useState(512);
  const [resultDataUrl, setResultDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedOverlay = useMemo(
    () => overlays.find((o) => o.id === overlayId) ?? null,
    [overlays, overlayId],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <section className="card p-5">
        <h2 className="text-lg font-medium">1) Your photo</h2>
        <p className="text-muted mt-1 text-sm">
          Upload a square-ish image. We'll crop to fit.
        </p>

        <div className="mt-4">
          <input
            className="btn w-full text-sm"
            type="file"
            accept="image/*"
            onChange={(e) => {
              setError(null);
              setResultDataUrl(null);

              const file = e.target.files?.[0];
              if (!file) return;

              const reader = new FileReader();
              reader.onload = () => {
                const v = reader.result;
                if (typeof v === "string") setBaseDataUrl(v);
              };
              reader.readAsDataURL(file);
            }}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="text-sm">
            <div className="text-muted mb-1 text-xs">Output size</div>
            <select
              className="btn w-full text-sm"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            >
              <option value={256}>256×256</option>
              <option value={512}>512×512</option>
              <option value={1024}>1024×1024</option>
            </select>
          </label>

          <label className="text-sm">
            <div className="text-muted mb-1 text-xs">Overlay</div>
            <select
              className="btn w-full text-sm"
              value={overlayId ?? ""}
              onChange={(e) => {
                setError(null);
                setResultDataUrl(null);
                setOverlayId(e.target.value);
              }}
            >
              {Array.from(
                overlays.reduce((m, o) => {
                  const key = `${o.seriesId}:${o.seriesSlug}:${o.seriesName}`;
                  const arr = m.get(key) ?? [];
                  arr.push(o);
                  m.set(key, arr);
                  return m;
                }, new Map<string, Overlay[]>()),
              ).map(([key, items]) => {
                const [, seriesSlug, seriesName] = key.split(":");
                return (
                  <optgroup key={key} label={`${seriesName} (${seriesSlug})`}>
                    {items.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <button
            className="btn text-sm"
            disabled={!baseDataUrl || !selectedOverlay || isPending}
            type="button"
            onClick={() => {
              if (!baseDataUrl || !selectedOverlay) return;

              startTransition(async () => {
                setError(null);
                const r = await renderAvatar({
                  baseImageDataUrl: baseDataUrl,
                  overlayUrl: selectedOverlay.imageUrl,
                  size,
                });

                if (!r.ok) {
                  setResultDataUrl(null);
                  setError(r.error);
                  return;
                }

                setResultDataUrl(`data:image/png;base64,${r.pngBase64}`);
              });
            }}
          >
            {isPending ? "Rendering…" : "Render PNG"}
          </button>

          <button
            className="btn text-sm"
            disabled={!resultDataUrl}
            type="button"
            onClick={() => {
              if (!resultDataUrl) return;
              downloadDataUrl("hc-pfp.png", resultDataUrl);
            }}
          >
            Download
          </button>

          {error ? (
            <div className="rounded-xl border border-[rgba(220,38,38,0.45)] bg-[rgba(220,38,38,0.10)] p-3 text-sm">
              {error}
            </div>
          ) : null}
        </div>
      </section>

      <section className="card p-5">
        <h2 className="text-lg font-medium">2) Preview</h2>
        <p className="text-muted mt-1 text-sm">
          This uses the exact render pipeline used for download.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-3">
            <div className="text-muted mb-2 text-xs">Base</div>
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-[rgba(255,255,255,0.03)]">
              {baseDataUrl ? (
                <img
                  alt="Base avatar preview"
                  className="h-full w-full object-cover"
                  src={baseDataUrl}
                />
              ) : null}
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-3">
            <div className="text-muted mb-2 text-xs">Result</div>
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-[rgba(255,255,255,0.03)]">
              {resultDataUrl ? (
                <img
                  alt="Rendered avatar preview"
                  className="h-full w-full object-cover"
                  src={resultDataUrl}
                />
              ) : null}
            </div>
          </div>
        </div>

        {selectedOverlay ? (
          <div className="mt-4 rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-3">
            <div className="text-muted mb-2 text-xs">Selected overlay</div>
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={selectedOverlay.name}
                className="h-14 w-14 rounded-lg object-cover"
                src={selectedOverlay.imageUrl}
              />
              <div>
                <div className="text-sm font-medium">{selectedOverlay.name}</div>
                <div className="text-muted text-xs">{selectedOverlay.slug}</div>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
