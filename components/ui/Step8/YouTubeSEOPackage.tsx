import React from 'react';
import { Sparkles, Loader2, Copy, Check } from 'lucide-react';

interface YouTubeSEOPackageProps {
  seoData: any;
  isGenerating: boolean;
  onGenerate: () => void;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
}

export function YouTubeSEOPackage({
  seoData,
  isGenerating,
  onGenerate,
  onCopy,
  copiedId
}: YouTubeSEOPackageProps) {
  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">YouTube SEO Package</h2>
          <p className="text-sm text-gray-500 mt-1">Generate viral titles, description, tags, and pinned comment for publishing.</p>
        </div>
        <button 
          onClick={onGenerate}
          disabled={isGenerating}
          className="px-6 py-2.5 bg-indigo-50 text-indigo-700 font-semibold rounded-lg shadow-sm hover:bg-indigo-100 transition-colors flex items-center gap-2 border border-indigo-200"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {seoData ? 'Regenerate SEO' : 'Generate SEO Metadata'}
        </button>
      </div>
      
      {seoData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-2">Viral Titles</h3>
              <div className="space-y-2">
                {seoData.titles?.map((t: string, i: number) => (
                  <div key={i} className="flex gap-2 relative group">
                    <div className="bg-white p-3 rounded-lg border border-gray-200 text-sm font-semibold text-gray-800 flex-1">{t}</div>
                    <button onClick={() => onCopy(t, `title-${i}`)} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                      {copiedId === `title-${i}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-2">Pinned Comment</h3>
              <div className="flex gap-2 relative group">
                <div className="bg-white p-3 rounded-lg border border-gray-200 text-sm text-gray-800 flex-1">{seoData.pinned_comment}</div>
                <button onClick={() => onCopy(seoData.pinned_comment, 'comment')} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  {copiedId === 'comment' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-2">Tags</h3>
              <div className="flex gap-2 relative group">
                <div className="bg-white p-3 rounded-lg border border-gray-200 text-xs text-gray-600 flex-1 leading-relaxed">
                  {seoData.tags?.join(', ')}
                </div>
                <button onClick={() => onCopy(seoData.tags?.join(', '), 'tags')} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  {copiedId === 'tags' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-2 flex justify-between items-center">
              YouTube Description
              <button onClick={() => onCopy(seoData.description, 'desc')} className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold bg-indigo-50 px-2 py-1 rounded">
                {copiedId === 'desc' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedId === 'desc' ? 'Copied' : 'Copy Full Description'}
              </button>
            </h3>
            <textarea 
              readOnly
              value={seoData.description}
              className="w-full h-80 bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-700 font-mono resize-none focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
