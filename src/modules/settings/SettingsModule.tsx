import React, { useState } from 'react';
import { Database, RefreshCw } from 'lucide-react';
import { CARD_CONTAINER, HEADING_TEXT, PRIMARY_BUTTON } from '../../ui/styles/tokens';

export default function SettingsModule() {
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSyncDatabase = async () => {
    setSyncing(true);
    setMessage(null);
    try {
      const response = await fetch('/api/db/sync', {
        method: 'POST',
      });
      const result = await response.json();
      
      if (response.ok) {
        setMessage({ type: 'success', text: result.message || 'Sinkronisasi berhasil (PostgreSQL Idempotent Schema Sync applied)' });
      } else {
        let errorMsg = result.error || 'Terjadi kesalahan saat sinkronisasi';
        
        // Penanganan khusus untuk error autentikasi Supabase/PostgreSQL
        if (errorMsg.includes('password authentication failed')) {
          errorMsg = 'Gagal Autentikasi: Password Database salah. Pastikan Anda memasukkan Password Database (bukan password akun Supabase), atau gunakan URL Connection Pooler (Port 6543) dengan username "postgres.[project-ref]".';
        }
        
        setMessage({ type: 'error', text: errorMsg });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Koneksi ke server gagal' });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto flex flex-col gap-6">
      <div className={CARD_CONTAINER}>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <Database className="w-6 h-6 text-teal-600" />
          <h2 className={HEADING_TEXT}>Database Management</h2>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Fungsi sinkronisasi ini akan memastikan skema database PostgreSQL (Supabase) Anda menggunakan versi terbaru secara aman. 
            Mendukung penambahan kolom atau inisialisasi tabel baru tanpa menghilangkan data existing.
          </p>

          {message && (
            <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-teal-50 text-teal-700 border border-teal-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
              {message.text}
            </div>
          )}

          <button 
            onClick={handleSyncDatabase} 
            disabled={syncing}
            className={`${PRIMARY_BUTTON} flex items-center justify-center gap-2 w-full md:w-auto px-6`}
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Memproses Sinkronisasi...' : 'Sinkronisasi Database'}
          </button>
        </div>
      </div>
    </div>
  );
}
