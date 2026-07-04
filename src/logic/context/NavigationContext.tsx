import { createContext, useContext, useState, ReactNode } from 'react';

interface NavContextType {
  activeRoute: string;
  setActiveRoute: (route: string) => void;
}

const NavContext = createContext<NavContextType | undefined>(undefined);

export function NavProvider({ children }: { children: ReactNode }) {
  const [activeRoute, setActiveRoute] = useState('Dashboard');
  return (
    <NavContext.Provider value={{ activeRoute, setActiveRoute }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  const context = useContext(NavContext);
  if (!context) throw new Error('useNav must be used within NavProvider');
  return context;
}
