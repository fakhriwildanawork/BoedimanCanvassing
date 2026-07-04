import Sidebar from './Sidebar';
import Header from './Header';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Sidebar */}
      <div className="hidden xl:block w-[260px] flex-shrink-0 z-20 relative">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 px-4 md:px-6">
        <div className="w-full max-w-[1400px] mx-auto pt-2">
          <Header />
          <main>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
