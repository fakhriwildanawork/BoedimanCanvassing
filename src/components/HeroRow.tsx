import { ArrowRight, Zap } from 'lucide-react';

export default function HeroRow() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
      <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
         <div className="flex flex-col h-full justify-between z-10 w-full md:w-3/5">
           <div>
             <p className="text-sm font-bold text-gray-400 mb-1">Built by developers</p>
             <h2 className="text-2xl font-bold text-gray-800 mb-2">Purity UI Dashboard</h2>
             <p className="text-sm text-gray-500 font-medium leading-relaxed">
               From colors, cards, typography to complex elements,
               you will find the full documentation.
             </p>
           </div>
           <button className="flex items-center gap-1 text-sm font-bold text-gray-800 hover:text-gray-600 mt-6 transition-colors group">
             Read more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
           </button>
         </div>
         
         <div className="w-full md:w-2/5 mt-6 md:mt-0 flex justify-end h-full min-h-[200px]">
           <div className="bg-teal-400 rounded-xl w-full h-full flex items-center justify-center relative overflow-hidden shadow-lg">
             <div className="absolute w-40 h-40 bg-white/20 rounded-full blur-2xl -top-10 -right-10"></div>
             <div className="absolute w-40 h-40 bg-white/20 rounded-full blur-2xl -bottom-10 -left-10"></div>
             <div className="text-white font-bold text-2xl tracking-widest flex items-center gap-2 z-10">
               <Zap className="w-8 h-8 fill-white text-white" />
               chakra
             </div>
           </div>
         </div>
      </div>
      
      <div className="lg:col-span-5 rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between group min-h-[250px]">
        <div className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent z-0"></div>
        
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Work with the rockets</h2>
            <p className="text-sm text-white/80 font-medium leading-relaxed">
              Wealth creation is a revolutionary recent positive-sum game. It is all about who takes the opportunity first.
            </p>
          </div>
          <button className="flex items-center gap-1 text-sm font-bold text-white hover:text-white/80 mt-6 transition-colors group-hover:gap-2">
             Read more <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
