# Panduan Otomatisasi Sinkronisasi Database (Supabase, Turso & Lainnya)

Dokumen ini menjelaskan mekanisme dan konsep desain untuk sinkronisasi skema database dua arah secara otomatis (Idempotent Schema Sync), termasuk penambahan tabel/kolom baru dan penghapusan otomatis tabel/kolom usang yang tidak didefinisikan lagi dalam deklarasi skema aplikasi.

---

## 1. Arsitektur Idempotent Schema Sync (PostgreSQL / Supabase)

Mekanisme sinkronisasi yang diimplementasikan di backend Node.js/TypeScript menggunakan driver `pg` untuk mengelola Supabase (atau PostgreSQL lainnya):

### Alur Kerja Sinkronisasi:
1. **Identifikasi Tabel Terdaftar**: Membaca skema TypeScript (`databaseSchema`) sebagai satu-satunya *Source of Truth*.
2. **Pembersihan Tabel Usang**: Membandingkan tabel di skema `public` database dengan skema terdaftar. Tabel di database yang tidak ada dalam daftar (selain tabel bawaan seperti `spatial_ref_sys`) akan di-`DROP CASCADE`.
3. **Inisialisasi Tabel**: Membuat tabel baru secara aman (`CREATE TABLE IF NOT EXISTS`) dengan primary key baseline jika belum terdaftar.
4. **Sinkronisasi Kolom Baru**: Menambahkan kolom baru (`ALTER TABLE ... ADD COLUMN`) yang dideklarasikan di skema aplikasi tetapi belum ada di database.
5. **Penghapusan Kolom Usang**: Menghapus kolom di database (`ALTER TABLE ... DROP COLUMN ... CASCADE`) jika kolom tersebut tidak didefinisikan lagi dalam skema tabel aplikasi.
6. **Trigger Audit & Kunci Asing**: Memperbarui relasi Kunci Asing (Foreign Keys) dan Trigger perubahan tanggal (`updated_at`) secara dinamis.

---

## 2. Implementasi untuk SQLite / Turso (libsql)

Untuk database relasional ringan berbasis SQLite seperti **Turso**, proses sinkronisasi otomatis memiliki karakteristik berbeda karena keterbatasan SQLite (SQLite tidak mendukung `DROP COLUMN` secara penuh di versi lama, tetapi mendukung `ALTER TABLE DROP COLUMN` di versi terbaru 3.35.0+).

### Skema Logika Sinkronisasi Turso:

```typescript
import { createClient } from "@libsql/client";
import { databaseSchema } from "../../database/schema";

export async function syncSQLiteDatabase() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  // 1. Dapatkan semua tabel aktif di SQLite
  const tablesRes = await client.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
  );
  const existingTables = tablesRes.rows.map(r => r.name as string);
  const allowedTables = databaseSchema.map(t => t.name);

  // 2. Hapus tabel usang (Redundant Tables)
  for (const table of existingTables) {
    if (!allowedTables.includes(table)) {
      await client.execute(`DROP TABLE IF EXISTS "${table}";`);
    }
  }

  for (const table of databaseSchema) {
    // 3. Buat tabel jika belum ada
    const idCol = table.columns.find(c => c.name === 'id');
    const idDef = idCol ? `id TEXT PRIMARY KEY` : `id TEXT PRIMARY KEY`;
    await client.execute(`CREATE TABLE IF NOT EXISTS "${table.name}" (${idDef});`);

    // 4. Ambil info kolom yang ada saat ini
    const pragmaRes = await client.execute(`PRAGMA table_info("${table.name}");`);
    const existingCols = pragmaRes.rows.map(r => r.name as string);

    // 5. Tambahkan kolom baru
    for (const col of table.columns) {
      if (col.name !== 'id' && !existingCols.includes(col.name)) {
        await client.execute(`ALTER TABLE "${table.name}" ADD COLUMN "${col.name}" ${col.type};`);
      }
    }

    // 6. Hapus kolom usang (Membutuhkan rekonstruksi tabel di SQLite versi < 3.35.0)
    const targetCols = table.columns.map(c => c.name);
    for (const dbCol of existingCols) {
      if (!targetCols.includes(dbCol)) {
        // Pada SQLite 3.35.0+, kita bisa menggunakan DROP COLUMN langsung
        try {
          await client.execute(`ALTER TABLE "${table.name}" DROP COLUMN "${dbCol}";`);
        } catch (e) {
          // Fallback rekonstruksi tabel jika versi SQLite lama:
          // - Buat tabel sementara tanpa kolom usang
          // - Salin data dari tabel lama ke tabel sementara
          // - Hapus tabel lama, lalu ganti nama tabel sementara ke nama tabel asli
        }
      }
    }
  }
}
```

---

## 3. Best Practice & Keamanan Data (Data Invariant)

> [!WARNING]
> Proses otomatisasi penghapusan kolom (`DROP COLUMN CASCADE`) dan tabel bersifat **irreversible** (permanen).

Untuk memastikan data produksi aman, terapkan prinsip perlindungan berikut:
1. **Verifikasi Lingkungan**: Batasi fitur pembersihan otomatis (`DROP`) hanya di lingkungan *Development* atau *Staging*. Jangan jalankan penghapusan otomatis langsung di *Production* tanpa backup atau konfirmasi UI eksplisit.
2. **Eksekusi dalam Transaksi**: Selalu bungkus langkah migrasi ke dalam blok transaksi (`BEGIN` / `COMMIT`) agar kegagalan di tengah jalan otomatis melakukan pembatalan penuh (`ROLLBACK`).
3. **Pengecualian Tabel Metadata**: Selalu kecualikan tabel internal database (seperti `spatial_ref_sys`, `_prisma_migrations`, `drizzle_migrations`, atau `sqlite_sequence`) dari daftar tabel yang akan dihapus.
