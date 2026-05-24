import * as Minio from "minio"

const globalForMinio = globalThis as unknown as { minio: Minio.Client }

export const minioClient =
  globalForMinio.minio ||
  new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || "localhost",
    port: Number(process.env.MINIO_PORT) || 9000,
    useSSL: process.env.MINIO_USE_SSL === "true",
    accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
    secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
  })

if (process.env.NODE_ENV !== "production") globalForMinio.minio = minioClient

export const BUCKET_NAME = process.env.MINIO_BUCKET || "union-alkimia"

export async function ensureBucket() {
  const exists = await minioClient.bucketExists(BUCKET_NAME)
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME)
  }
}

export function getFileUrl(key: string): string {
  const endpoint = process.env.MINIO_ENDPOINT || "localhost"
  const port = process.env.MINIO_PORT || "9000"
  const protocol = process.env.MINIO_USE_SSL === "true" ? "https" : "http"
  return `${protocol}://${endpoint}:${port}/${BUCKET_NAME}/${key}`
}
