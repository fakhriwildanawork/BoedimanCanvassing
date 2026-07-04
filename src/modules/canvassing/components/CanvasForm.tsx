import React, { useState, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';
import { CanvassingPin } from '../types';
import { CARD_CONTAINER, HEADING_TEXT, PRIMARY_BUTTON, SECONDARY_BUTTON, INPUT_FIELD, LABEL_TEXT } from '../../../ui/styles/tokens';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import PhoneInput from '../../../ui/components/elements/PhoneInput';
import LongText from '../../../ui/components/elements/LongText';
import FileUpload from '../../../ui/components/elements/FileUpload';
import NumberInput from '../../../ui/components/elements/NumberInput';
import OperatingHours from '../../../ui/components/elements/OperatingHours';
import { useLocation } from '../../../logic/hooks/useLocation';

const dealIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const negotiateIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const failIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const getStatusIcon = (status: string) => {
  if (status === 'DEAL') return dealIcon;
  if (status === 'NEGOTIATE') return negotiateIcon;
  return failIcon;
};

function MapEvents({ onClick, center }: { onClick: (latlng: {lat: number, lng: number}) => void, center?: {lat: number, lng: number} | null }) {
  const map = useMapEvents({
    click(e) {
      onClick(e.latlng);
    }
  });
  
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], map.getZoom());
    }
  }, [center, map]);

  return null;
}

interface CanvasFormProps {
  pin?: CanvassingPin | null;
  mode: 'create' | 'edit' | 'view';
  onClose: () => void;
  onSave: (data: any) => void;
  onEdit?: () => void;
}

export default function CanvasForm({ pin, mode, onClose, onSave, onEdit }: CanvasFormProps) {
  const { data: locationData, fetchLocation, error: locationError } = useLocation();
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(pin?.lokasi || null);
  const [address, setAddress] = useState<string>(pin?.alamat || '');
  const [status, setStatus] = useState<'DEAL' | 'NEGOTIATE' | 'FAIL'>(pin?.status || 'NEGOTIATE');
  const [namaTitik, setNamaTitik] = useState(pin?.namaTitik || '');
  const [patokanLokasi, setPatokanLokasi] = useState(pin?.patokanLokasi || '');
  const [namaPIC, setNamaPIC] = useState(pin?.namaPIC || '');
  const [noHP, setNoHP] = useState(pin?.noHP || '');
  const [keterangan, setKeterangan] = useState(pin?.keterangan || '');
  const [kuotaPenjualan, setKuotaPenjualan] = useState(pin?.kuotaPenjualan || 0);
  const [persentaseKomisi, setPersentaseKomisi] = useState(pin?.persentaseKomisi || 0);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [keptPhotos, setKeptPhotos] = useState<string[]>(pin?.photos || []);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!coords && mode === 'create') {
      fetchLocation();
    }
  }, [coords, mode, fetchLocation]);

  useEffect(() => {
    if (locationData && !coords && mode === 'create') {
      setCoords({ lat: locationData.lat, lng: locationData.lng });
      fetchAddress(locationData.lat, locationData.lng);
    }
  }, [locationData, coords, mode]);

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      setAddress(data.display_name || '');
    } catch (err) {
      setAddress('');
    }
  };

  const handleMapClick = (latlng: {lat: number, lng: number}) => {
    if (mode === 'view') return;
    setCoords(latlng);
    setAddress('Fetching address...');
    fetchAddress(latlng.lat, latlng.lng);
  };

  const isReadOnly = mode === 'view';
  const defaultCenter = { lat: -6.2088, lng: 106.8456 };
  const mapCenter = coords || locationData || defaultCenter;

  return (
    <div className={CARD_CONTAINER + " max-w-3xl mx-auto w-full !p-4 sm:!p-6"}>
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <h2 className={HEADING_TEXT}>
          {mode === 'create' ? 'Tambah Prospek Baru' : mode === 'edit' ? 'Edit Prospek' : 'Detail Prospek'}
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-800 p-1 rounded-lg hover:bg-gray-100">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form className="flex flex-col gap-6" onSubmit={async (e) => { 
        e.preventDefault(); 
        setSubmitting(true);
        try {
          const uploadedUrls = [];
          for (const f of newFiles) {
            const reader = new FileReader();
            const base64 = await new Promise((resolve) => {
              reader.onloadend = () => {
                const result = reader.result as string;
                const base64Data = result.split(',')[1];
                resolve(base64Data);
              };
              reader.readAsDataURL(f);
            });
            const res = await fetch('/api/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                filename: f.name,
                contentType: f.type,
                base64Data: base64
              })
            });
            if (res.ok) {
              const data = await res.json();
              uploadedUrls.push(data.url);
            }
          }
          
          const finalPhotos = [...keptPhotos, ...uploadedUrls];
          
          const payload = {
            status,
            namaTitik,
            lokasi: coords || { lat: -6.2088, lng: 106.8456 },
            patokanLokasi,
            alamat: address,
            namaPIC,
            noHP,
            keterangan,
            kuotaPenjualan: Number(kuotaPenjualan),
            persentaseKomisi: Number(persentaseKomisi),
            bukaTiapHari: true,
            jamBuka: '08:00 - 20:00',
            photos: finalPhotos
          };
          
          if (mode === 'create') {
            await fetch('/api/canvassing', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
          } else if (mode === 'edit' && pin?.id) {
            await fetch(`/api/canvassing/${pin.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
          }
          onSave(payload);
        } catch (err) {
          console.error(err);
          alert('Terjadi kesalahan saat menyimpan');
        } finally {
          setSubmitting(false);
        }
      }}>
        {/* Status Selection */}
        <div className="flex gap-2">
          <button type="button" disabled={isReadOnly} onClick={() => setStatus('DEAL')} className={`flex-1 py-2 px-1 sm:py-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition-all ${status === 'DEAL' ? 'bg-teal-500 text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>Success</button>
          <button type="button" disabled={isReadOnly} onClick={() => setStatus('NEGOTIATE')} className={`flex-1 py-2 px-1 sm:py-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition-all ${status === 'NEGOTIATE' ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>Negotiate</button>
          <button type="button" disabled={isReadOnly} onClick={() => setStatus('FAIL')} className={`flex-1 py-2 px-1 sm:py-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition-all ${status === 'FAIL' ? 'bg-red-500 text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>Fail</button>
        </div>

        {/* Map */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-end">
            <label className={LABEL_TEXT}>Lokasi di Peta</label>
            <div className="flex items-center gap-3">
              {locationError && mode === 'create' && (
                <span className="text-xs text-red-500 font-medium">GPS tidak tersedia / ditolak.</span>
              )}
              {mode === 'create' && (
                <button type="button" onClick={() => fetchLocation()} className="text-xs font-bold text-teal-600 hover:text-teal-700 bg-teal-50 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Deteksi Lokasi
                </button>
              )}
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl relative overflow-hidden h-48 sm:h-64 border border-gray-200 z-0">
            <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {!isReadOnly && <MapEvents onClick={handleMapClick} center={coords} />}
              {coords && (
                <Marker position={[coords.lat, coords.lng]} icon={getStatusIcon(status)}>
                  <Popup>Lokasi Dipilih</Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={LABEL_TEXT}>Nama Titik</label>
            <input type="text" className={INPUT_FIELD} placeholder="Contoh: Warung Kopi Jaya" value={namaTitik} onChange={e => setNamaTitik(e.target.value)} required readOnly={isReadOnly} />
          </div>
          <div>
            <label className={LABEL_TEXT}>Patokan Lokasi</label>
            <input type="text" className={INPUT_FIELD} placeholder="Contoh: Depan Indomaret" value={patokanLokasi} onChange={e => setPatokanLokasi(e.target.value)} required readOnly={isReadOnly} />
          </div>
        </div>

        <div>
          <label className={LABEL_TEXT}>Alamat Lengkap (Reverse Geotag)</label>
          {/* @ts-ignore */}
          <LongText 
            rows={2} 
            placeholder="Alamat akan terisi otomatis atau ketik manual..." 
            value={address}
            onChange={(e: any) => setAddress(e.target.value)}
            required
            readOnly={isReadOnly}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={LABEL_TEXT}>Nama PIC</label>
            <input type="text" className={INPUT_FIELD} placeholder="Nama penanggung jawab" value={namaPIC} onChange={e => setNamaPIC(e.target.value)} required readOnly={isReadOnly} />
          </div>
          <div>
            <label className={LABEL_TEXT}>No HP</label>
            {/* @ts-ignore */}
            <PhoneInput placeholder="0812..." value={noHP} onChange={(val: any) => setNoHP(val.target ? val.target.value : val)} required readOnly={isReadOnly} />
          </div>
        </div>

        {!isReadOnly ? (
          <div>
            <label className={LABEL_TEXT}>Upload Foto Lokasi</label>
            {/* @ts-ignore */}
            <FileUpload initialPhotos={pin?.photos || []} onFilesChange={(f, k) => { setNewFiles(f); setKeptPhotos(k); }} />
          </div>
        ) : (
          pin?.photos && pin.photos.length > 0 && (
            <div>
              <label className={LABEL_TEXT}>Foto Lokasi</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
                {pin.photos.map((photo, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square cursor-pointer" onClick={() => window.open(photo, '_blank')}>
                    <img src={photo} alt={`Foto ${idx+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-200" />
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        <div>
          <label className={LABEL_TEXT}>Catatan / Keterangan</label>
          {/* @ts-ignore */}
          <LongText rows={2} placeholder="Catatan tambahan..." value={keterangan} onChange={(e: any) => setKeterangan(e.target.value)} readOnly={isReadOnly} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={LABEL_TEXT}>Kuota/Hari (Botol)</label>
            {/* @ts-ignore */}
            <NumberInput placeholder="0" value={kuotaPenjualan} onChange={(e: any) => setKuotaPenjualan(e.target.value)} min={0} required readOnly={isReadOnly} />
          </div>
          <div>
            <label className={LABEL_TEXT}>Komisi (%)</label>
            {/* @ts-ignore */}
            <NumberInput placeholder="0" value={persentaseKomisi} onChange={(e: any) => setPersentaseKomisi(e.target.value)} min={0} max={100} required readOnly={isReadOnly} />
          </div>
        </div>

        {/* OperatingHours - Need to adapt if readonly but for now we'll just show it */}
        <div className={isReadOnly ? 'pointer-events-none opacity-80' : ''}>
          <OperatingHours />
        </div>

        {!isReadOnly ? (
          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4">
            <button type="button" onClick={onClose} className={"flex-1 " + SECONDARY_BUTTON}>
              Batal
            </button>
            <button type="submit" className={"flex-1 " + PRIMARY_BUTTON} disabled={submitting}>
              {submitting ? 'Menyimpan...' : 'Simpan Data'}
            </button>
          </div>
        ) : (
          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4">
            <button type="button" onClick={onClose} className={"flex-1 " + SECONDARY_BUTTON}>
              Tutup
            </button>
            <button 
              type="button" 
              onClick={() => {
                if (onEdit) onEdit();
              }} 
              className={"flex-1 " + PRIMARY_BUTTON}
            >
              Edit Data
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
