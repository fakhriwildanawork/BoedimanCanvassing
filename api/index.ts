import express from "express";
import { getTigrisClient, GetObjectCommand } from "../src/logic/libs/tigris.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import type { Readable } from "stream";
import dotenv from "dotenv";
import { syncDatabase } from "../src/logic/services/dbMigrator.js";
import { registerCanvassingRoutes, registerUploadRoute } from "../server_routes.js";

dotenv.config();

const app = express();

app.use(express.json({ limit: "50mb" }));

// Register standard routes
registerCanvassingRoutes(app);
registerUploadRoute(app);

// API Route untuk Tigris Image Proxy
app.get("/api/images/:key", async (req, res) => {
  try {
    const { key } = req.params;
    const bucketName = process.env.TIGRIS_STORAGE_BUCKET;
    
    if (!bucketName) {
      res.status(500).send("TIGRIS_STORAGE_BUCKET belum diatur");
      return;
    }

    const s3Client = getTigrisClient();
    const response = await s3Client.send(new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    }));

    if (response.ContentType) res.setHeader("Content-Type", response.ContentType);
    if (response.ContentLength) res.setHeader("Content-Length", response.ContentLength);
    
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    if (response.Body) {
      (response.Body as Readable).pipe(res);
    } else {
      res.status(404).send("File tidak ditemukan");
    }
  } catch (error: any) {
    if (error.name === "NoSuchKey") {
      res.status(404).send("File tidak ditemukan");
    } else {
      console.error("Error fetching image:", error);
      res.status(500).send("Gagal mengambil gambar");
    }
  }
});

// API Route untuk Hapus File dari Tigris
app.delete("/api/images/:key", async (req, res) => {
  try {
    const { key } = req.params;
    const bucketName = process.env.TIGRIS_STORAGE_BUCKET;
    if (!bucketName) {
      res.status(500).send("TIGRIS_STORAGE_BUCKET belum diatur");
      return;
    }

    const actualKey = key.includes('/api/images/') ? key.split('/api/images/').pop() : key;
    
    if (!actualKey) {
      res.status(400).send("Key tidak valid");
      return;
    }

    const s3Client = getTigrisClient();
    await s3Client.send(new DeleteObjectCommand({
      Bucket: bucketName,
      Key: actualKey,
    }));

    res.json({ success: true, message: "File berhasil dihapus" });
  } catch (error: any) {
    console.error("Error deleting image:", error);
    res.status(500).send("Gagal menghapus gambar");
  }
});

// API Route untuk Sinkronisasi Database
app.post("/api/db/sync", async (req, res) => {
  try {
    if (!process.env.VITE_SUPABASE_DB_URL && !process.env.SUPABASE_DB_URL) {
      res.status(400).json({ error: "VITE_SUPABASE_DB_URL is not set" });
      return;
    }
    await syncDatabase();
    res.json({ success: true, message: "Sinkronisasi database berhasil dijalankan" });
  } catch (error: any) {
    console.error("Database Sync Error:", error);
    res.status(500).json({ error: error.message || "Gagal sinkronisasi" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
