import React from 'react';
import { Lock, Paintbrush, Image as ImageIcon } from 'lucide-react';

interface BrandKitPremiumLockProps {
  onUpgrade: () => void;
}

export function BrandKitPremiumLock({ onUpgrade }: BrandKitPremiumLockProps) {
  return (
    <div className="p-8">
      <div className="border border-indigo-100 bg-indigo-50/30 rounded-xl p-8 flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-12">
        <div className="w-16 h-16 bg-white shadow-sm border border-indigo-100 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-8 h-8 text-indigo-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Premium Feature</h3>
        <p className="text-gray-600 mb-8 max-w-md">
          The advanced Brand Kit and cross-video Asset Library require a premium API integration for consistent multi-shot rendering and saved entity tracking.
        </p>
        
        <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
            <Paintbrush className="w-6 h-6 text-indigo-400 mb-2" />
            <div className="text-sm font-bold text-gray-800">Color Presets</div>
            <div className="text-[10px] text-gray-500">Auto-apply LUTs</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
            <ImageIcon className="w-6 h-6 text-indigo-400 mb-2" />
            <div className="text-sm font-bold text-gray-800">Logo Overlays</div>
            <div className="text-[10px] text-gray-500">Watermarks</div>
          </div>
        </div>
        
        <button 
          disabled
          onClick={onUpgrade}
          className="px-6 py-3 bg-gray-200 text-gray-500 font-bold rounded-xl cursor-not-allowed border border-gray-300"
        >
          Upgrade to Pro to Unlock
        </button>
      </div>
    </div>
  );
}
