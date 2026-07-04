-- Aturan Database - PostgreSQL (Supabase)
-- Eksekusi file ini dapat menggunakan dbMigrator di backend untuk memastikan data existing aman.

-- Function for update_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ==========================================
-- TABEL: canvassing_pins
-- ==========================================
CREATE TABLE IF NOT EXISTS canvassing_pins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT,
    created_timezone TEXT,
    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by TEXT,
    updated_timezone TEXT,
    
    nama_titik TEXT NOT NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    patokan_lokasi TEXT,
    alamat TEXT NOT NULL,
    nama_pic TEXT NOT NULL,
    no_hp TEXT NOT NULL,
    keterangan TEXT,
    kuota_penjualan INTEGER DEFAULT 0,
    buka_tiap_hari BOOLEAN DEFAULT true,
    jam_buka TEXT,
    persentase_komisi REAL DEFAULT 0,
    status TEXT DEFAULT 'NEGOTIATE',
    files_url JSONB DEFAULT '[]'::jsonb
);

DROP TRIGGER IF EXISTS canvassing_pins_update_audit ON canvassing_pins;
CREATE TRIGGER canvassing_pins_update_audit
BEFORE UPDATE ON canvassing_pins
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
