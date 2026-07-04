import { orders } from '../data/dummyData';
import { ArrowUp } from 'lucide-react';
import * as Icons from 'lucide-react';

export default function OrdersOverview() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-1">Orders overview</h3>
        <p className="text-sm text-gray-400 font-medium flex items-center gap-1">
          <ArrowUp className="w-4 h-4 text-green-500" />
          <span className="text-green-500 font-bold">24%</span> this month
        </p>
      </div>
      
      <div className="flex flex-col gap-6 relative">
        {orders.map((order, idx) => {
          const Icon = (Icons as any)[order.icon];
          return (
            <div key={order.id} className="flex gap-4 relative">
              {idx !== orders.length - 1 && (
                <div className="absolute left-[11px] top-6 bottom-[-24px] w-0.5 bg-gray-200 z-0"></div>
              )}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                   <Icon className={`w-4 h-4 ${order.color}`} />
                </div>
              </div>
              <div className="-mt-1">
                <p className="text-sm font-bold text-gray-800">{order.title}</p>
                <p className="text-xs font-bold text-gray-400 mt-1">{order.date}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
