import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

// Inisialisasi S3Client untuk Tigris (Hanya boleh dipanggil dari sisi server/backend)
export const getTigrisClient = () => {
  return new S3Client({
    region: "auto",
    endpoint: process.env.TIGRIS_STORAGE_ENDPOINT || '',
    credentials: {
      accessKeyId: process.env.TIGRIS_STORAGE_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.TIGRIS_STORAGE_SECRET_ACCESS_KEY || '',
    },
    forcePathStyle: true, // Wajib untuk Tigris
  });
};

export { PutObjectCommand, GetObjectCommand };
