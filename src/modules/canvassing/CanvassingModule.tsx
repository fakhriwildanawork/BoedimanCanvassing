import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { CanvassingPin } from './types';
import CanvassingDashboard from './components/CanvassingDashboard';
import CanvasForm from './components/CanvasForm';
import CanvassingDetail from './components/CanvassingDetail';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    popup: 'rounded-xl shadow-lg border border-gray-100'
  }
});

export default function CanvassingModule() {
  const [view, setView] = useState<'DASHBOARD' | 'FORM' | 'DETAIL'>('DASHBOARD');
  const [selectedPin, setSelectedPin] = useState<CanvassingPin | null>(null);
  const [pins, setPins] = useState<CanvassingPin[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPins = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/canvassing');
      if (res.ok) {
        const data = await res.json();
        setPins(data);
      }
    } catch (err) {
      console.error("Failed to fetch canvassing pins", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPins();
  }, []);

  const handleAdd = () => {
    setSelectedPin(null);
    setView('FORM');
  };

  const handleEdit = (pin: CanvassingPin) => {
    setSelectedPin(pin);
    setView('FORM');
  };

  const handleView = (pin: CanvassingPin) => {
    setSelectedPin(pin);
    setView('DETAIL');
  };

  const handleClose = () => {
    setView('DASHBOARD');
    setSelectedPin(null);
  };

  const handleSave = async (data: any) => {
    setView('DASHBOARD');
    setSelectedPin(null);
    await fetchPins();
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Semua file foto terkait akan dihapus secara permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0d9488', // teal-600
      cancelButtonColor: '#9ca3af', // gray-400
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-xl px-4 py-2 font-bold text-sm',
        cancelButton: 'rounded-xl px-4 py-2 font-bold text-sm'
      }
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/canvassing/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchPins();
        Toast.fire({
          icon: 'success',
          title: 'Data canvassing telah berhasil dihapus!'
        });
      } else {
        Toast.fire({
          icon: 'error',
          title: 'Gagal menghapus data canvassing.'
        });
      }
    } catch (err) {
      console.error(err);
      Toast.fire({
        icon: 'error',
        title: 'Terjadi kesalahan saat menghapus data.'
      });
    }
  };

  return (
    <div className="h-full min-h-screen pb-10">
      {view === 'DASHBOARD' && (
        <CanvassingDashboard 
          pins={pins}
          loading={loading}
          onAdd={handleAdd} 
          onEdit={handleEdit} 
          onView={handleView}
          onDelete={handleDelete}
        />
      )}
      
      {view === 'FORM' && (
        <CanvasForm 
          mode={selectedPin ? 'edit' : 'create'}
          pin={selectedPin}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
      
      {view === 'DETAIL' && selectedPin && (
        <CanvassingDetail 
          pin={selectedPin}
          onClose={handleClose}
          onEdit={() => handleEdit(selectedPin)}
        />
      )}
    </div>
  );
}
