import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Plus, Edit2, Trash2, MapPin, User, Phone } from 'lucide-react';
import { CanvassingPin } from '../types';
import { PRIMARY_BUTTON, HEADING_TEXT, CARD_CONTAINER } from '../../../ui/styles/tokens';
import { APP_LOGO } from '../../../logic/utils/assets';

const createCustomMarker = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="position: relative; width: 30px; height: 42px; display: flex; align-items: center; justify-content: center;">
        <svg width="30" height="42" viewBox="0 0 30 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 3px 4px rgba(0,0,0,0.35)); position: absolute; top: 0; left: 0;">
          <path d="M15 0C6.71573 0 0 6.71573 0 15C0 26.25 15 42 15 42C15 42 30 26.25 30 15C30 6.71573 23.2843 0 15 0Z" fill="${color}"/>
          <circle cx="15" cy="15" r="5" fill="white"/>
        </svg>
      </div>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -36]
  });
};

const dealIcon = createCustomMarker('#0d9488');      // Teal Success
const negotiateIcon = createCustomMarker('#f97316'); // Bright Vibrant Orange
const failIcon = createCustomMarker('#ef4444');      // Red Fail

const getStatusIcon = (status: string) => {
  if (status === 'DEAL') return dealIcon;
  if (status === 'NEGOTIATE') return negotiateIcon;
  return failIcon;
};

// Map updater to automatically fit bounds when pins change or filter changes
function MapUpdater({ pins }: { pins: CanvassingPin[] }) {
  const map = useMap();
  useEffect(() => {
    if (pins && pins.length > 0) {
      const bounds = L.latLngBounds(pins.map(p => [p.lokasi.lat, p.lokasi.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [pins, map]);
  return null;
}

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
  
  const dealCount = pins.filter(p => p.status === 'DEAL').length;
  const negotiateCount = pins.filter(p => p.status === 'NEGOTIATE').length;
  const failCount = pins.filter(p => p.status === 'FAIL').length;

  const filteredPins = pins.filter(p => activeTab === 'ALL' || p.status === activeTab);

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Premium Compact Mini Stats Row */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-2.5 sm:p-3.5 shadow-sm flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse"></span>
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider truncate">Deal</p>
            <h4 className="text-sm sm:text-xl font-black text-teal-600 leading-none mt-0.5 sm:mt-1">{dealCount}</h4>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-2.5 sm:p-3.5 shadow-sm flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider truncate">Negotiate</p>
            <h4 className="text-sm sm:text-xl font-black text-orange-500 leading-none mt-0.5 sm:mt-1">{negotiateCount}</h4>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-2.5 sm:p-3.5 shadow-sm flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider truncate">Fail</p>
            <h4 className="text-sm sm:text-xl font-black text-red-500 leading-none mt-0.5 sm:mt-1">{failCount}</h4>
          </div>
        </div>
      </div>

      {/* Top Full Width Map */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[250px] sm:h-[400px] z-0 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <span className="font-bold text-teal-600 animate-pulse">Memuat Peta...</span>
          </div>
        )}
        <MapContainer center={[-6.2088, 106.8456]} zoom={12} style={{ height: '100%', width: '100%' }} attributionControl={false}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater pins={filteredPins.length > 0 ? filteredPins : pins} />
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
        {/* Custom Watermark */}
        <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg shadow-sm border border-gray-100 flex items-center gap-1.5 z-[1000] pointer-events-none text-[10px] font-bold text-gray-700">
          <img src={APP_LOGO} alt="Boediman Logo" className="w-4 h-4 rounded-md object-cover" />
          <span>Boediman Maps</span>
        </div>
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
          {(['ALL', 'DEAL', 'NEGOTIATE', 'FAIL'] as const).map(tab => {
            const count = tab === 'ALL' ? pins.length : tab === 'DEAL' ? dealCount : tab === 'NEGOTIATE' ? negotiateCount : failCount;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-1 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === tab 
                    ? 'border-teal-500 text-teal-600' 
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab === 'ALL' ? `Semua (${count})` : 
                 tab === 'DEAL' ? `Success (${count})` : 
                 tab === 'NEGOTIATE' ? `Negotiate (${count})` : 
                 `Fail (${count})`}
              </button>
            );
          })}
        </div>

        {/* Card List representation */}
        <div className="space-y-2">
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
                className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 relative overflow-hidden pl-5"
              >
                {/* Left side accent indicator */}
                <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                  pin.status === 'DEAL' ? 'bg-teal-500' :
                  pin.status === 'NEGOTIATE' ? 'bg-orange-500' :
                  'bg-red-500'
                }`} />

                {/* Left: Info details (1-2 lines) */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-800 text-sm sm:text-base truncate">{pin.namaTitik}</span>
                    <span className={`px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-extrabold uppercase shrink-0 ${
                      pin.status === 'DEAL' ? 'bg-teal-50 text-teal-600 border border-teal-100' :
                      pin.status === 'NEGOTIATE' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                      'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      {pin.status === 'DEAL' ? 'Success' : pin.status === 'NEGOTIATE' ? 'Nego' : 'Fail'}
                    </span>
                  </div>
                  
                  {/* Row 2: Sub-details in single compact line */}
                  <p className="text-[11px] sm:text-xs text-gray-500 mt-1 flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-gray-700">{pin.namaPIC}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-400">{pin.noHP}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-400">Kuota: <strong className="text-gray-600 font-bold">{pin.kuotaPenjualan}</strong></span>
                  </p>
                </div>

                {/* Right: Actions clearly visible without hover */}
                <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                  <button 
                    onClick={() => onEdit(pin)} 
                    className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors border border-gray-100 bg-gray-50/50"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => onDelete(pin.id)} 
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-100 bg-gray-50/50"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
