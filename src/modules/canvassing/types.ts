export interface CanvassingPin {
  id: string;
  status: 'DEAL' | 'NEGOTIATE' | 'FAIL';
  
  // Audit Trails
  created_at?: string;
  created_by?: string;
  created_timezone?: string;
  updated_at?: string;
  updated_by?: string;
  updated_timezone?: string;

  namaTitik: string;
  lokasi: { lat: number; lng: number };
  patokanLokasi: string;
  alamat: string;
  namaPIC: string;
  noHP: string;
  keterangan: string;
  kuotaPenjualan: number;
  bukaTiapHari: boolean;
  jamBuka: string;
  persentaseKomisi: number;
  photos: string[];
}

