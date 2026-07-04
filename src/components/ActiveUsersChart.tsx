import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { activeUsersData } from '../data/dummyData';
import { Users, MousePointerClick, CreditCard, Box } from 'lucide-react';

export default function ActiveUsersChart() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 h-[250px] mb-6 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={activeUsersData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff20" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#fff', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#fff', fontSize: 12 }} />
            <Tooltip 
              cursor={{ fill: '#ffffff20' }}
              contentStyle={{ backgroundColor: '#2d3748', border: 'none', borderRadius: '8px', color: '#fff' }}
            />
            <Bar dataKey="value" fill="#fff" radius={[4, 4, 0, 0]} barSize={8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Active Users</h3>
          <p className="text-sm text-gray-400 font-medium mb-6">
            <span className="text-green-500 font-bold">(+23)</span> than last week
          </p>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-teal-400 p-1.5 rounded-md text-white shadow-sm">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-gray-400">Users</span>
            </div>
            <p className="text-lg font-bold text-gray-800">32,984</p>
            <div className="w-full bg-gray-100 h-1 mt-2 rounded-full overflow-hidden">
               <div className="bg-teal-400 h-full w-[60%] rounded-full"></div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-teal-400 p-1.5 rounded-md text-white shadow-sm">
                <MousePointerClick className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-gray-400">Clicks</span>
            </div>
            <p className="text-lg font-bold text-gray-800">2,42m</p>
            <div className="w-full bg-gray-100 h-1 mt-2 rounded-full overflow-hidden">
               <div className="bg-teal-400 h-full w-[80%] rounded-full"></div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-teal-400 p-1.5 rounded-md text-white shadow-sm">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-gray-400">Sales</span>
            </div>
            <p className="text-lg font-bold text-gray-800">2,400$</p>
            <div className="w-full bg-gray-100 h-1 mt-2 rounded-full overflow-hidden">
               <div className="bg-teal-400 h-full w-[40%] rounded-full"></div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-teal-400 p-1.5 rounded-md text-white shadow-sm">
                <Box className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-gray-400">Items</span>
            </div>
            <p className="text-lg font-bold text-gray-800">320</p>
            <div className="w-full bg-gray-100 h-1 mt-2 rounded-full overflow-hidden">
               <div className="bg-teal-400 h-full w-[50%] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
