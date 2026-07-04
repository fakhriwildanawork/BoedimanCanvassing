import { CanvassingPin } from '../types';

export const dummyPins: CanvassingPin[] = [
  {
    id: '1',
    status: 'DEAL',
    namaTitik: 'Warung Kopi Jaya',
    lokasi: { lat: -6.2088, lng: 106.8456 },
    patokanLokasi: 'Dekat stasiun Cikini',
    alamat: 'Jl. Pegangsaan Timur No. 56, RT.1/RW.1, Menteng, Kec. Menteng, Kota Jakarta Pusat',
    namaPIC: 'Budi Santoso',
    noHP: '081234567890',
    keterangan: 'Lokasi strategis dekat perkantoran.',
    kuotaPenjualan: 50,
    bukaTiapHari: true,
    jamBuka: '08:00 - 22:00',
    persentaseKomisi: 15,
    photos: []
  },
  {
    id: '2',
    status: 'NEGOTIATE',
    namaTitik: 'Toko Kelontong Berkah',
    lokasi: { lat: -6.2200, lng: 106.8200 },
    patokanLokasi: 'Samping minimarket',
    alamat: 'Jl. Jend. Sudirman Kav. 52-53, Senayan, Kebayoran Baru, Jakarta Selatan',
    namaPIC: 'Siti Aminah',
    noHP: '089876543210',
    keterangan: 'Ramai saat akhir pekan.',
    kuotaPenjualan: 30,
    bukaTiapHari: false,
    jamBuka: '09:00 - 21:00',
    persentaseKomisi: 10,
    photos: []
  },
  {
    id: '3',
    status: 'FAIL',
    namaTitik: 'Kafe Senja Malam',
    lokasi: { lat: -6.1800, lng: 106.8300 },
    patokanLokasi: 'Lantai 2 ruko',
    alamat: 'Jl. M.H. Thamrin No.1, Menteng, Kota Jakarta Pusat',
    namaPIC: 'Rudi Hermawan',
    noHP: '085612345678',
    keterangan: 'Target anak muda, potensial tinggi.',
    kuotaPenjualan: 100,
    bukaTiapHari: true,
    jamBuka: '15:00 - 00:00',
    persentaseKomisi: 20,
    photos: []
  }
];
