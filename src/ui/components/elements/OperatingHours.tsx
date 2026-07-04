import React, { useState } from 'react';
import { LABEL_TEXT } from '../../styles/tokens';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

interface OperatingHoursProps {
  initialData?: Record<string, { isOpen: boolean, open: string, close: string }>;
}

export default function OperatingHours({ initialData }: OperatingHoursProps) {
  const [schedule, setSchedule] = useState(
    initialData || DAYS.reduce((acc, day) => {
      acc[day] = { isOpen: true, open: '08:00', close: '22:00' };
      return acc;
    }, {} as Record<string, { isOpen: boolean, open: string, close: string }>)
  );

  const toggleDay = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], isOpen: !prev[day].isOpen }
    }));
  };

  const updateTime = (day: string, field: 'open' | 'close', value: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  return (
    <div className="space-y-2">
      <label className={LABEL_TEXT}>Jadwal Operasional</label>
      <div className="border border-gray-200 rounded-xl p-3 space-y-2 bg-white">
        {DAYS.map(day => (
          <div key={day} className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer w-24">
              <input 
                type="checkbox" 
                checked={schedule[day].isOpen} 
                onChange={() => toggleDay(day)}
                className="rounded text-teal-400 focus:ring-teal-400"
              />
              <span className={schedule[day].isOpen ? 'text-gray-800 font-bold' : 'text-gray-400 font-medium'}>{day}</span>
            </label>
            
            {schedule[day].isOpen ? (
              <div className="flex items-center gap-2">
                <input 
                  type="time" 
                  value={schedule[day].open}
                  onChange={(e) => updateTime(day, 'open', e.target.value)}
                  className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-teal-400 text-gray-700 font-medium"
                />
                <span className="text-gray-400">-</span>
                <input 
                  type="time" 
                  value={schedule[day].close}
                  onChange={(e) => updateTime(day, 'close', e.target.value)}
                  className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-teal-400 text-gray-700 font-medium"
                />
              </div>
            ) : (
              <span className="text-xs text-red-400 font-bold w-[140px] text-center">Tutup</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
