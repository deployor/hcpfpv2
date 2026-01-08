import { PutObjectCommand } from "@aws-sdk/client-s3";

import { r2, R2_BUCKET, R2_PUBLIC_BASE_URL } from "./client";

export function makePublicUrl(key: string) {
  const base = R2_PUBLIC_BASE_URL.replace(/\/$/, "");
  const safeKey = key.replace(/^\//, "");
  return `${base}/${safeKey}`;
}

export async function uploadPublicPng(params: {
  key: string;
  body: Uint8Array;
}) {
  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: params.key,
      Body: params.body,
      ContentType: "image/png",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return makePublicUrl(params.key);
}
