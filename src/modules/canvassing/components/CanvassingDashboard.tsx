import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Plus, Edit2, Trash2, MapPin, User, Phone } from 'lucide-react';
import { CanvassingPin } from '../types';
import { PRIMARY_BUTTON, HEADING_TEXT, CARD_CONTAINER } from '../../../ui/styles/tokens';

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

interface CanvassingDashboardProps {
  pins: CanvassingPin[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (pin: CanvassingPin) => void;
  onView: (pin: CanvassingPin) => void;
  onDelete: (id: string) => void;
}

export default function CanvassingDashboard({ pins, loading, onAdd, onEdit, onView, onDelete }: CanvassingDashboardProps) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'DEAL' | 'NEGOTIATE' | 'FAIL'>('ALL');
  
  const filteredPins = pins.filter(p => activeTab === 'ALL' || p.status === activeTab);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Full Width Map */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[250px] sm:h-[400px] z-0 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <span className="font-bold text-teal-600 animate-pulse">Memuat Peta...</span>
          </div>
        )}
        <MapContainer center={[-6.2088, 106.8456]} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {pins.map(pin => (
            <Marker 
              key={pin.id} 
              position={[pin.lokasi.lat, pin.lokasi.lng]} 
              icon={getStatusIcon(pin.status)}
              eventHandlers={{
                click: () => onView(pin)
              }}
            >
              <Popup>{pin.namaTitik}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Table Section */}
      <div className={CARD_CONTAINER + " !p-4 sm:!p-6"}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={HEADING_TEXT}>Data Canvassing</h2>
          <button onClick={onAdd} className={PRIMARY_BUTTON + " flex items-center gap-2"}>
            <Plus className="w-4 h-4" />
            Add Canvas
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-4 mb-6 border-b border-gray-100 overflow-x-auto whitespace-nowrap scrollbar-none no-scrollbar">
          {(['ALL', 'DEAL', 'NEGOTIATE', 'FAIL'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-1 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === tab 
                  ? 'border-teal-500 text-teal-600' 
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab === 'ALL' ? 'Semua' : tab === 'DEAL' ? 'Success (Deal)' : tab === 'NEGOTIATE' ? 'Negotiate' : 'Fail'}
            </button>
          ))}
        </div>

        {/* Card List representation */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12 font-medium text-teal-600 animate-pulse">
              Memuat Data...
            </div>
          ) : filteredPins.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-medium">
              Belum ada data canvassing
            </div>
          ) : (
            filteredPins.map((pin) => (
              <div 
                key={pin.id} 
                onClick={() => onView(pin)}
                className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col gap-3 relative overflow-hidden"
              >
                {/* Left side accent indicator */}
                <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                  pin.status === 'DEAL' ? 'bg-teal-500' :
                  pin.status === 'NEGOTIATE' ? 'bg-orange-500' :
                  'bg-red-500'
                }`} />

                {/* Header info */}
                <div className="flex justify-between items-start pl-2">
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base truncate">{pin.namaTitik}</h3>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-teal-500 shrink-0" />
                      <span className="truncate">{pin.patokanLokasi}</span>
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-extrabold uppercase shrink-0 ${
                    pin.status === 'DEAL' ? 'bg-teal-50 text-teal-600 border border-teal-100' :
                    pin.status === 'NEGOTIATE' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                    'bg-red-50 text-red-600 border border-red-100'
                  }`}>
                    {pin.status === 'DEAL' ? 'Success (Deal)' : pin.status === 'NEGOTIATE' ? 'Negotiate' : 'Fail'}
                  </span>
                </div>

                {/* Body info */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50/50 p-2.5 rounded-lg pl-4">
                  <div className="space-y-1">
                    <p className="text-gray-400 font-medium">PIC</p>
                    <div className="flex items-center gap-1 text-gray-700 font-bold">
                      <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{pin.namaPIC}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400 font-medium">No. HP</p>
                    <div className="flex items-center gap-1 text-gray-700 font-bold">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{pin.noHP}</span>
                    </div>
                  </div>
                </div>

                {/* Footer details & actions */}
                <div className="flex justify-between items-center pl-2 text-xs">
                  <div className="text-gray-500 flex items-center gap-1 font-medium">
                    <span className="text-gray-400">Kuota:</span>
                    <span className="font-bold text-gray-700">{pin.kuotaPenjualan} pcs/hari</span>
                  </div>
                  
                  <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                    <button 
                      onClick={() => onEdit(pin)} 
                      className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(pin.id)} 
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
