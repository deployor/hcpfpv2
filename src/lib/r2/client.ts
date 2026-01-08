import { S3Client } from "@aws-sdk/client-s3";

function req(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is required`);
  return v;
}

export const r2 = new S3Client({
  region: "auto",
  endpoint: req("R2_ENDPOINT"),
  credentials: {
    accessKeyId: req("R2_ACCESS_KEY_ID"),
    secretAccessKey: req("R2_SECRET_ACCESS_KEY"),
  },
});

export const R2_BUCKET = req("R2_BUCKET");
export const R2_PUBLIC_BASE_URL = req("R2_PUBLIC_BASE_URL");
