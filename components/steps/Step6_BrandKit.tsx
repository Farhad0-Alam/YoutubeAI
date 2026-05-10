import React from 'react';
import { useBrandKitLogic } from '../../hooks/useBrandKitLogic';
import { BrandKitPremiumLock } from '../ui/Step6/BrandKitPremiumLock';
import { Palette, PlaySquare } from 'lucide-react';

export function Step6_BrandKit() {
  const { setStep, handleUpgrade } = useBrandKitLogic();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in duration-500">
      <div className="p-4 sm:p-8 border-b border-gray-100 bg-gradient-to-br from-indigo-50/50 to-white">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 font-display flex items-center gap-2">
          <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
          Brand Kit & Asset Library
        </h2>
        <p className="text-sm sm:text-base text-gray-500">Save character references, brand colors, voice presets, and logo overlays to ensure consistent branding across videos.</p>
      </div>

      <BrandKitPremiumLock onUpgrade={handleUpgrade} />

      <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
        <button 
          onClick={() => setStep(5)}
          className="w-full sm:w-auto px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors"
        >
          Back to Media
        </button>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button 
            onClick={() => setStep(8)}
            className="px-6 py-3 bg-gray-100 text-gray-500 rounded-lg font-bold border border-gray-300 hover:bg-gray-200 transition-colors"
          >
            Skip to Render
          </button>
          <button 
            onClick={() => setStep(7)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold transition-colors hover:bg-indigo-700 shadow-sm flex items-center justify-center gap-2"
          >
            Skip to Thumbnail <PlaySquare className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
