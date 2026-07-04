import { useState, useEffect } from 'react';
import { CanvassingPin } from './types';
import CanvassingDashboard from './components/CanvassingDashboard';
import CanvasForm from './components/CanvasForm';
import CanvassingDetail from './components/CanvassingDetail';

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
    if (!confirm('Apakah Anda yakin ingin menghapus data ini? Semua file foto terkait akan dihapus permanen.')) return;
    try {
      const res = await fetch(`/api/canvassing/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchPins();
      } else {
        alert('Gagal menghapus data');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menghapus data');
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
