export interface ColumnDef {
  name: string;
  type: string;
}

export interface TableDef {
  name: string;
  columns: ColumnDef[];
  foreignKeys?: string[];
}

export const auditColumns: ColumnDef[] = [
  { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP' },
  { name: 'created_by', type: 'TEXT' },
  { name: 'created_timezone', type: 'TEXT' },
  { name: 'updated_at', type: 'TIMESTAMP WITH TIME ZONE' },
  { name: 'updated_by', type: 'TEXT' },
  { name: 'updated_timezone', type: 'TEXT' },
];

export const databaseSchema: TableDef[] = [
  {
    name: 'canvassing_pins',
    columns: [
      { name: 'id', type: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()' },
      ...auditColumns,
      { name: 'nama_titik', type: 'TEXT NOT NULL' },
      { name: 'lat', type: 'REAL NOT NULL' },
      { name: 'lng', type: 'REAL NOT NULL' },
      { name: 'patokan_lokasi', type: 'TEXT' },
      { name: 'alamat', type: 'TEXT NOT NULL' },
      { name: 'nama_pic', type: 'TEXT NOT NULL' },
      { name: 'no_hp', type: 'TEXT NOT NULL' },
      { name: 'keterangan', type: 'TEXT' },
      { name: 'kuota_penjualan', type: 'INTEGER DEFAULT 0' },
      { name: 'buka_tiap_hari', type: 'BOOLEAN DEFAULT true' },
      { name: 'jam_buka', type: 'TEXT' },
      { name: 'persentase_komisi', type: 'REAL DEFAULT 0' },
      { name: 'status', type: 'TEXT DEFAULT \'NEGOTIATE\'' }, // DEAL, NEGOTIATE, FAIL
      { name: 'files_url', type: 'JSONB DEFAULT \'[]\'::jsonb' }
    ]
  }
];
