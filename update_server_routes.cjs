const fs = require('fs');
let file = fs.readFileSync('server_routes.ts', 'utf8');

file = file.replace(
  `      const pinsResult = await pool.query(\`
        SELECT p.*, 
          COALESCE(
            json_agg(json_build_object('id', ph.id, 'url', ph.photo_url)) 
            FILTER (WHERE ph.id IS NOT NULL), 
            '[]'
          ) as photos_raw
        FROM canvassing_pins p
        LEFT JOIN canvassing_photos ph ON p.id = ph.pin_id
        GROUP BY p.id
        ORDER BY p.created_at DESC
      \`);`,
  `      const pinsResult = await pool.query(\`
        SELECT *
        FROM canvassing_pins
        ORDER BY created_at DESC
      \`);`
);

file = file.replace(
  `        photos: row.photos_raw.map((p: any) => p.url)`,
  `        photos: row.files_url || []`
);

file = file.replace(
  `        INSERT INTO canvassing_pins (
          status, nama_titik, lat, lng, patokan_lokasi, alamat, nama_pic, no_hp, 
          keterangan, kuota_penjualan, buka_tiap_hari, jam_buka, persentase_komisi
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING id
      \`, [
        status, namaTitik, lokasi.lat, lokasi.lng, patokanLokasi, alamat, namaPIC, noHP,
        keterangan, kuotaPenjualan || 0, bukaTiapHari ?? true, jamBuka, persentaseKomisi || 0
      ]);

      const pinId = pinResult.rows[0].id;

      if (photos && photos.length > 0) {
        for (const photo of photos) {
          await client.query(\`
            INSERT INTO canvassing_photos (pin_id, photo_url)
            VALUES ($1, $2)
          \`, [pinId, photo]);
        }
      }`,
  `        INSERT INTO canvassing_pins (
          status, nama_titik, lat, lng, patokan_lokasi, alamat, nama_pic, no_hp, 
          keterangan, kuota_penjualan, buka_tiap_hari, jam_buka, persentase_komisi, files_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING id
      \`, [
        status, namaTitik, lokasi.lat, lokasi.lng, patokanLokasi, alamat, namaPIC, noHP,
        keterangan, kuotaPenjualan || 0, bukaTiapHari ?? true, jamBuka, persentaseKomisi || 0, JSON.stringify(photos || [])
      ]);

      const pinId = pinResult.rows[0].id;`
);

file = file.replace(
  `      await client.query(\`
        UPDATE canvassing_pins SET
          status = $1, nama_titik = $2, lat = $3, lng = $4, patokan_lokasi = $5,
          alamat = $6, nama_pic = $7, no_hp = $8, keterangan = $9, 
          kuota_penjualan = $10, buka_tiap_hari = $11, jam_buka = $12, persentase_komisi = $13
        WHERE id = $14
      \`, [
        status, namaTitik, lokasi.lat, lokasi.lng, patokanLokasi, alamat, namaPIC, noHP,
        keterangan, kuotaPenjualan || 0, bukaTiapHari ?? true, jamBuka, persentaseKomisi || 0, id
      ]);

      // Handle photos hard delete
      const existingPhotosRes = await client.query('SELECT photo_url FROM canvassing_photos WHERE pin_id = $1', [id]);
      const existingPhotos = existingPhotosRes.rows.map(r => r.photo_url);
      
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

      await client.query('DELETE FROM canvassing_photos WHERE pin_id = $1', [id]);

      if (newPhotos.length > 0) {
        for (const photo of newPhotos) {
          await client.query(\`
            INSERT INTO canvassing_photos (pin_id, photo_url)
            VALUES ($1, $2)
          \`, [id, photo]);
        }
      }`,
  `      // Handle photos hard delete
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

      await client.query(\`
        UPDATE canvassing_pins SET
          status = $1, nama_titik = $2, lat = $3, lng = $4, patokan_lokasi = $5,
          alamat = $6, nama_pic = $7, no_hp = $8, keterangan = $9, 
          kuota_penjualan = $10, buka_tiap_hari = $11, jam_buka = $12, persentase_komisi = $13, files_url = $14
        WHERE id = $15
      \`, [
        status, namaTitik, lokasi.lat, lokasi.lng, patokanLokasi, alamat, namaPIC, noHP,
        keterangan, kuotaPenjualan || 0, bukaTiapHari ?? true, jamBuka, persentaseKomisi || 0, JSON.stringify(newPhotos), id
      ]);`
);

file = file.replace(
  `      const photosRes = await client.query('SELECT photo_url FROM canvassing_photos WHERE pin_id = $1', [id]);
      const photos = photosRes.rows.map(r => r.photo_url);`,
  `      const pinRes = await client.query('SELECT files_url FROM canvassing_pins WHERE id = $1', [id]);
      const photos = pinRes.rows[0]?.files_url || [];`
);

fs.writeFileSync('server_routes.ts', file);
