import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { salesOverviewData } from '../data/dummyData';

export default function SalesOverviewChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-1">Sales overview</h3>
        <p className="text-sm text-gray-400 font-medium">
          <span className="text-green-500 font-bold">(+5) more</span> in 2021
        </p>
      </div>
      
      <div className="flex-1 min-h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={salesOverviewData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4fd1c5" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4fd1c5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a0aec0', fontSize: 12, fontWeight: 600 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a0aec0', fontSize: 12, fontWeight: 600 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#2d3748', fontWeight: 600 }}
            />
            <Area type="monotone" dataKey="value" stroke="#4fd1c5" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
