import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { getTigrisClient, GetObjectCommand } from "./src/logic/libs/tigris.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import type { Readable } from "stream";
import dotenv from "dotenv";
import { syncDatabase } from "./src/logic/services/dbMigrator.js";
import { registerCanvassingRoutes, registerUploadRoute } from "./server_routes.js";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" })); // Increase limit for potential large payloads
  
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

      // Teruskan metadata
      if (response.ContentType) res.setHeader("Content-Type", response.ContentType);
      if (response.ContentLength) res.setHeader("Content-Length", response.ContentLength);
      
      // Tambahkan header caching
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

      if (response.Body) {
        // Pipe stream langsung ke res
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

  // API Route untuk Hapus File dari Tigris (StorageRule.md)
  app.delete("/api/images/:key", async (req, res) => {
    try {
      const { key } = req.params;
      const bucketName = process.env.TIGRIS_STORAGE_BUCKET;
      if (!bucketName) {
         res.status(500).send("TIGRIS_STORAGE_BUCKET belum diatur");
         return;
      }

      // Pastikan membersihkan key dari URL jika client secara tidak sengaja mengirim proxy path
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // @ts-ignore Express v4 vs v5 typings
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
