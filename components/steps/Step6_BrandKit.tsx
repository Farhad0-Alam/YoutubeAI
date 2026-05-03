import { useVideoStore } from '../../store/videoStore';
import { Palette, PlaySquare, Image as ImageIcon, Paintbrush, Lock } from 'lucide-react';

export function Step6_BrandKit() {
  const { setStep } = useVideoStore();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in duration-500">
      <div className="p-4 sm:p-8 border-b border-gray-100 bg-gradient-to-br from-indigo-50/50 to-white">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 font-display flex items-center gap-2">
          <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
          Brand Kit & Asset Library
        </h2>
        <p className="text-sm sm:text-base text-gray-500">Save character references, brand colors, voice presets, and logo overlays to ensure consistent branding across videos.</p>
      </div>

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
            className="px-6 py-3 bg-gray-200 text-gray-500 font-bold rounded-xl cursor-not-allowed border border-gray-300"
          >
            Upgrade to Pro to Unlock
          </button>
        </div>
      </div>

      <div className="p-6 border-t border-gray-200 flex justify-between items-center bg-gray-50/50">
        <button 
          onClick={() => setStep(5)}
          className="px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors"
        >
          Back to Media
        </button>
        <button 
          onClick={() => setStep(7)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold transition-colors hover:bg-indigo-700 shadow-sm flex items-center gap-2"
        >
          Skip to Thumbnail <PlaySquare className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
