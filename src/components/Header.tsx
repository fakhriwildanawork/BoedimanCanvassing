import { Search, User, Settings, Bell } from 'lucide-react';
import { useNav } from '../logic/context/NavigationContext';

export default function Header() {
  const { activeRoute } = useNav();
  
  return (
    <header className="flex justify-between items-center py-4 bg-transparent mb-6">
      <div>
        <div className="flex items-center text-sm font-medium text-gray-400 mb-1">
           <span>Pages</span>
           <span className="mx-2">/</span>
           <span className="text-gray-800">{activeRoute}</span>
        </div>
        <h1 className="text-lg font-bold text-gray-800">{activeRoute}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-800 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Type here..." 
            className="pl-9 pr-4 py-2.5 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white font-medium text-gray-700 w-64 shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 text-gray-500 hover:text-gray-800 cursor-pointer font-bold text-sm ml-2">
          <User className="w-4 h-4" />
          <span>Sign In</span>
        </div>
        
        <button className="text-gray-500 hover:text-gray-800 ml-2">
          <Settings className="w-4 h-4" />
        </button>
        
        <button className="text-gray-500 hover:text-gray-800">
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
