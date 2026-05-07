import React from 'react';
import { Download, PackageOpen, Loader2, Share2 } from 'lucide-react';
import { LivePreviewPlayer } from '../LivePreviewPlayer';
import { YouTubeSEOPackage } from './YouTubeSEOPackage';

interface FinalVideoDashboardProps {
  scenes: any[];
  isExporting: boolean;
  onExport: () => void;
  onOpenEditor: () => void;
  onDownloadAssets: () => void;
  onGenerateSEO: () => void;
  isGeneratingSEO: boolean;
  seoData: any;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
  onContinue: () => void;
}

export function FinalVideoDashboard({
  scenes,
  isExporting,
  onExport,
  onOpenEditor,
  onDownloadAssets,
  onGenerateSEO,
  isGeneratingSEO,
  seoData,
  onCopy,
  copiedId,
  onContinue
}: FinalVideoDashboardProps) {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Final Video Sequence</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-lg">
            Your video has been stitched together dynamically in the browser! Playback is rendered live rather than as a heavy cloud MP4.
          </p>
        </div>
        <div className="text-sm font-bold text-green-700 bg-green-50 px-4 py-2 rounded-full border border-green-200 shadow-sm shrink-0">
           Live Render Complete
        </div>
      </div>
      
      <div className="mt-6 mb-8 rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/5">
         <LivePreviewPlayer scenes={scenes} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
        <button 
          onClick={onExport}
          disabled={isExporting}
          className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors w-full sm:w-auto text-center flex items-center justify-center gap-2"
        >
          {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
          {isExporting ? 'Encoding...' : 'Download Video'}
        </button>
        <button 
          onClick={onOpenEditor}
          className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-colors w-full sm:w-auto text-center"
        >
          Video Editor
        </button>
         <button 
          onClick={onDownloadAssets}
          className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-colors w-full sm:w-auto text-center flex items-center justify-center gap-2"
        >
          <PackageOpen className="w-5 h-5" />
          Source Assets
        </button>
      </div>

      <YouTubeSEOPackage 
        seoData={seoData}
        isGenerating={isGeneratingSEO}
        onGenerate={onGenerateSEO}
        onCopy={onCopy}
        copiedId={copiedId}
      />
      
      <div className="mt-12 pt-6 border-t border-gray-200 flex justify-end">
        <button 
          onClick={onContinue}
          className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700 transition-all text-lg flex items-center gap-2"
        >
          Continue to Publish <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
