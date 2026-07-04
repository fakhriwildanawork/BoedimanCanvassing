import { Zap, Home, BarChart2, CreditCard, Wrench, User, LogIn, UserPlus, HelpCircle, MapPin, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNav } from '../logic/context/NavigationContext';

const navItems = [
  { name: 'Dashboard', icon: Home },
  { name: 'Canvassing', icon: MapPin },
  { name: 'Tables', icon: BarChart2 },
  { name: 'Billing', icon: CreditCard },
  { name: 'RTL', icon: Wrench },
  { name: 'Settings', icon: Settings },
];

const accountItems = [
  { name: 'Profile', icon: User },
  { name: 'Sign In', icon: LogIn },
  { name: 'Sign Up', icon: UserPlus },
];

export default function Sidebar() {
  const { activeRoute, setActiveRoute } = useNav();

  return (
    <div className="w-64 h-screen bg-transparent flex flex-col pt-8 pb-4 px-6 fixed left-0 top-0 overflow-y-auto">
      <div className="flex items-center mb-8 gap-2">
        <Zap className="w-6 h-6 text-teal-400 fill-teal-400" />
        <span className="font-bold text-gray-800 text-sm tracking-widest uppercase">Purity UI Dashboard</span>
      </div>
      
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6" />

      <nav className="flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeRoute === item.name;
            return (
              <li key={item.name}>
                <button 
                  onClick={() => setActiveRoute(item.name)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
                    isActive ? "bg-white shadow-sm text-gray-800" : "text-gray-400 hover:bg-white/50"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-xl flex items-center justify-center shadow-sm",
                    isActive ? "bg-teal-400 text-white" : "bg-white text-teal-400"
                  )}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  {item.name}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 mb-4 px-3">
          <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">Account Pages</span>
        </div>

        <ul className="space-y-1">
          {accountItems.map((item) => (
            <li key={item.name}>
              <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/50 transition-all duration-200">
                <div className="p-2 rounded-xl bg-white shadow-sm text-teal-400 flex items-center justify-center">
                  <item.icon className="w-4 h-4" />
                </div>
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Need Help Card */}
      <div className="mt-auto pt-8">
        <div className="bg-teal-400 rounded-xl p-4 text-white relative overflow-hidden shadow-md">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-xl" />
          <div className="bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center mb-4">
             <HelpCircle className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm mb-1">Need help?</h4>
          <p className="text-xs text-white/80 mb-4 font-medium">Please check our docs</p>
          <button className="w-full bg-white text-gray-800 text-xs font-bold py-2.5 rounded-lg hover:bg-gray-50 transition-colors uppercase">
            Documentation
          </button>
        </div>
      </div>
    </div>
  );
}
