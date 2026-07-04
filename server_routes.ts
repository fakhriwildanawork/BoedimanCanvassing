import { pool } from "./src/logic/libs/db.js";
import { getTigrisClient } from "./src/logic/libs/tigris.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export function registerCanvassingRoutes(app: any) {
  // GET all pins
  app.get("/api/canvassing", async (req: any, res: any) => {
    try {
      const pinsResult = await pool.query(`
        SELECT *
        FROM canvassing_pins
        ORDER BY created_at DESC
      `);
      
      const pins = pinsResult.rows.map(row => ({
        id: row.id,
        status: row.status,
        namaTitik: row.nama_titik,
        lokasi: { lat: row.lat, lng: row.lng },
        patokanLokasi: row.patokan_lokasi,
        alamat: row.alamat,
        namaPIC: row.nama_pic,
        noHP: row.no_hp,
        keterangan: row.keterangan,
        kuotaPenjualan: row.kuota_penjualan,
        bukaTiapHari: row.buka_tiap_hari,
        jamBuka: row.jam_buka,
        persentaseKomisi: row.persentase_komisi,
        photos: row.files_url || []
      }));
      
      res.json(pins);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch canvassing data" });
    }
  });

  // POST new pin
  app.post("/api/canvassing", async (req: any, res: any) => {
    const client = await pool.connect();
    try {
      const {
        status, namaTitik, lokasi, patokanLokasi, alamat, namaPIC, noHP,
        keterangan, kuotaPenjualan, bukaTiapHari, jamBuka, persentaseKomisi, photos
      } = req.body;

      await client.query('BEGIN');
      
      const pinResult = await client.query(`
        INSERT INTO canvassing_pins (
          status, nama_titik, lat, lng, patokan_lokasi, alamat, nama_pic, no_hp, 
          keterangan, kuota_penjualan, buka_tiap_hari, jam_buka, persentase_komisi, files_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING id
      `, [
        status, namaTitik, lokasi.lat, lokasi.lng, patokanLokasi, alamat, namaPIC, noHP,
        keterangan, kuotaPenjualan || 0, bukaTiapHari ?? true, jamBuka, persentaseKomisi || 0, JSON.stringify(photos || [])
      ]);

      const pinId = pinResult.rows[0].id;

      await client.query('COMMIT');
      res.json({ success: true, id: pinId });
    } catch (err: any) {
      await client.query('ROLLBACK');
      console.error(err);
      res.status(500).json({ error: "Failed to create pin" });
    } finally {
      client.release();
    }
  });

  // PUT (update) pin
  app.put("/api/canvassing/:id", async (req: any, res: any) => {
    const client = await pool.connect();
    try {
      const { id } = req.params;
      const {
        status, namaTitik, lokasi, patokanLokasi, alamat, namaPIC, noHP,
        keterangan, kuotaPenjualan, bukaTiapHari, jamBuka, persentaseKomisi, photos
      } = req.body;

      await client.query('BEGIN');
      
      // Handle photos hard delete
      const existingPinRes = await client.query('SELECT files_url FROM canvassing_pins WHERE id = $1', [id]);
      const existingPhotos = existingPinRes.rows[0]?.files_url || [];
      
      const newPhotos = photos || [];
      const photosToDelete = existingPhotos.filter(url => !newPhotos.includes(url));

      if (photosToDelete.length > 0) {
        const bucketName = process.env.TIGRIS_STORAGE_BUCKET;
        const s3Client = getTigrisClient();
        for (const url of photosToDelete) {
          const actualKey = url.includes('/api/images/') ? url.split('/api/images/').pop() : url;
          if (actualKey && bucketName) {
            try {
              await s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: actualKey }));
            } catch(e) {
              console.error("Failed to delete orphaned photo from Tigris on update", e);
            }
          }
        }
      }

      await client.query(`
        UPDATE canvassing_pins SET
          status = $1, nama_titik = $2, lat = $3, lng = $4, patokan_lokasi = $5,
          alamat = $6, nama_pic = $7, no_hp = $8, keterangan = $9, 
          kuota_penjualan = $10, buka_tiap_hari = $11, jam_buka = $12, persentase_komisi = $13, files_url = $14
        WHERE id = $15
      `, [
        status, namaTitik, lokasi.lat, lokasi.lng, patokanLokasi, alamat, namaPIC, noHP,
        keterangan, kuotaPenjualan || 0, bukaTiapHari ?? true, jamBuka, persentaseKomisi || 0, JSON.stringify(newPhotos), id
      ]);

      await client.query('COMMIT');
      res.json({ success: true });
    } catch (err: any) {
      await client.query('ROLLBACK');
      console.error(err);
      res.status(500).json({ error: "Failed to update pin" });
    } finally {
      client.release();
    }
  });

  // DELETE pin
  app.delete("/api/canvassing/:id", async (req: any, res: any) => {
    const client = await pool.connect();
    try {
      const { id } = req.params;

      await client.query('BEGIN');

      const pinRes = await client.query('SELECT files_url FROM canvassing_pins WHERE id = $1', [id]);
      const photos = pinRes.rows[0]?.files_url || [];

      if (photos.length > 0) {
        const bucketName = process.env.TIGRIS_STORAGE_BUCKET;
        const s3Client = getTigrisClient();
        for (const url of photos) {
          const actualKey = url.includes('/api/images/') ? url.split('/api/images/').pop() : url;
          if (actualKey && bucketName) {
            try {
              await s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: actualKey }));
            } catch(e) {
              console.error("Failed to delete orphaned photo from Tigris on delete", e);
            }
          }
        }
      }

      // Deleting pin will cascade delete the photos in the database table
      await client.query('DELETE FROM canvassing_pins WHERE id = $1', [id]);

      await client.query('COMMIT');
      res.json({ success: true });
    } catch (err: any) {
      await client.query('ROLLBACK');
      console.error(err);
      res.status(500).json({ error: "Failed to delete pin" });
    } finally {
      client.release();
    }
  });
}

import { PutObjectCommand } from "@aws-sdk/client-s3";

export function registerUploadRoute(app: any) {
  app.post("/api/upload", async (req: any, res: any) => {
    try {
      const { filename, contentType, base64Data } = req.body;
      const bucketName = process.env.TIGRIS_STORAGE_BUCKET;
      if (!bucketName) return res.status(500).json({ error: "TIGRIS_STORAGE_BUCKET not set" });

      const buffer = Buffer.from(base64Data, "base64");
      const key = `canvassing/${Date.now()}-${filename}`;

      const s3Client = getTigrisClient();
      await s3Client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType
      }));

      res.json({ url: `/api/images/${encodeURIComponent(key)}` });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });
}
