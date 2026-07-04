import { Wallet, Globe, FileText, ShoppingCart } from 'lucide-react';
import { StatItem } from '../types';

const iconMap: Record<string, React.ElementType> = {
  Wallet,
  Globe,
  FileText,
  ShoppingCart
};

export default function StatCard({ stat }: { stat: StatItem }) {
  const Icon = iconMap[stat.icon];
  
  return (
    <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100">
      <div>
        <p className="text-sm font-bold text-gray-400 mb-1">{stat.title}</p>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-800">{stat.value}</span>
          <span className={`text-sm font-bold ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {stat.change}
          </span>
        </div>
      </div>
      <div className="w-12 h-12 bg-teal-400 rounded-xl flex items-center justify-center text-white shadow-md">
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}
