/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import CanvassingModule from './modules/canvassing/CanvassingModule';
import { APP_LOGO } from './logic/utils/assets';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col antialiased">
      {/* Sleek Header */}
      <header className="bg-white border-b border-gray-100 py-3 px-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <img 
            src={APP_LOGO} 
            alt="Boediman Canvassing Logo" 
            className="w-10 h-10 rounded-xl object-cover shadow-sm border border-gray-100"
          />
          <div>
            <h1 className="text-base font-bold text-gray-800 tracking-tight leading-none">Boediman Canvassing</h1>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Aplikasi Canvassing Boediman</p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-2 py-4 sm:px-4 sm:py-6">
        <CanvassingModule />
      </main>
    </div>
  );
}
