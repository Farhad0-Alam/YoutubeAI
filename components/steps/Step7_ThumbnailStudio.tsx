import React, { useState, useRef } from 'react';
import { useVideoStore } from '../../store/videoStore';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

export function Step7_ThumbnailStudio() {
  const { scriptData, project, setStep } = useVideoStore();
  const [title, setTitle] = useState(scriptData?.title?.substring(0, 30) || 'Shocking Update');
  const [subtitle, setSubtitle] = useState('Watch this now');
  const [prompt, setPrompt] = useState(scriptData?.niche_config?.image_prompt_style || 'Dramatic dark lighting');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Customization states
  const [fontFamily, setFontFamily] = useState('Inter');
  const [filter, setFilter] = useState('none');
  const [textY, setTextY] = useState(50);
  const [textColor, setTextColor] = useState('#ffffff');
  const [textAlign, setTextAlign] = useState<'left'|'center'|'right'>('center');

  const previewRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!project) return;
    setIsGenerating(true);
    try {
      const res = await api.generateThumbnail({
        background_prompt: prompt
      });
      setThumbnailUrl(res.thumbnail_url);
      toast.success('Background generated!');
    } catch (e) {
      toast.error('Failed to generate background');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(previewRef.current, { cacheBust: true, pixelRatio: 2 });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'thumbnail_custom.png';
      a.click();
    } catch (err) {
      console.error(err);
      toast.error("Failed to render final image. Check CORS or use a supported browser.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thumbnail Studio</h1>
        <p className="text-gray-500 mb-6">Create a high-CTR thumbnail for your video.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Art Direction Prompt</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px] resize-none"
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 bg-white border-2 border-gray-200 text-gray-900 rounded-lg font-semibold hover:border-indigo-600 hover:text-indigo-600 transition-colors flex justify-center items-center gap-2"
            >
              {isGenerating && <Loader2 className="w-5 h-5 animate-spin" />}
              {isGenerating ? 'Rendering Background...' : 'Generate New Background'}
            </button>
            
            <hr className="my-4 border-gray-100" />
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Main Title overlay</label>
              <input 
                type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle overlay</label>
              <input 
                type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Font Style</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none"
                  value={fontFamily} onChange={e => setFontFamily(e.target.value)}
                >
                  <option value="Inter">Inter</option>
                  <option value="Impact">Impact</option>
                  <option value="Arial Black">Arial Black</option>
                  <option value="Georgia">Georgia</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Background Filter</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none"
                  value={filter} onChange={e => setFilter(e.target.value)}
                >
                  <option value="none">None</option>
                  <option value="grayscale(100%) border-white">Grayscale</option>
                  <option value="blur(4px)">Blur</option>
                  <option value="contrast(150%) saturate(150%)">Vibrant HDR</option>
                  <option value="sepia(100%)">Sepia</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pb-2">
               <div className="col-span-2">
                 <label className="block text-sm font-semibold text-gray-700 mb-2">Text Layout Y-Axis ({textY}%)</label>
                 <input 
                   type="range" min="0" max="100" value={textY} onChange={e => setTextY(Number(e.target.value))}
                   className="w-full accent-indigo-600"
                 />
               </div>
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-2">Text Color</label>
                 <input 
                    type="color" value={textColor} onChange={e => setTextColor(e.target.value)}
                    className="w-full h-8 rounded cursor-pointer border-none"
                 />
               </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Text Align</label>
              <div className="flex gap-2">
                 {['left','center','right'].map(align => (
                   <button 
                     key={align} onClick={() => setTextAlign(align as any)}
                     className={`flex-1 py-1.5 rounded border text-sm font-medium ${textAlign === align ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                   >
                     {align.charAt(0).toUpperCase() + align.slice(1)}
                   </button>
                 ))}
              </div>
            </div>

          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 tracking-wide uppercase">Live Preview Editor</h3>
            
            <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-900 aspect-video relative flex items-center justify-center">
               {thumbnailUrl ? (
                 <div ref={previewRef} className="w-full h-full relative overflow-hidden bg-black flex flex-col" style={{ alignItems: textAlign === 'left' ? 'flex-start' : textAlign === 'right' ? 'flex-end' : 'center', justifyContent: 'flex-start' }}>
                    {/* Background Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={thumbnailUrl} 
                      crossOrigin="anonymous" 
                      className="absolute inset-0 w-full h-full object-cover transition-all" 
                      style={{ filter }}
                      alt="Thumbnail Background" 
                    />
                    {/* Overlay Text */}
                    <div 
                      className="relative z-10 w-full px-12 pb-4 pt-4 shrink-0 transition-all pointer-events-none" 
                      style={{ 
                         marginTop: `${textY}%`, 
                         textAlign, 
                         color: textColor, 
                         fontFamily: fontFamily === 'Inter' ? 'var(--font-sans)' : fontFamily,
                         textShadow: '0px 4px 12px rgba(0,0,0,0.8), 0px 2px 4px rgba(0,0,0,0.6)'
                      }}
                    >
                      <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-tight drop-shadow-2xl">
                         {title}
                      </h2>
                      {subtitle && (
                        <p className="text-2xl md:text-3xl font-bold mt-2 opacity-90 drop-shadow-xl">{subtitle}</p>
                      )}
                    </div>
                 </div>
               ) : (
                 <div className="text-gray-400 text-sm font-medium">Generate a background first</div>
               )}
            </div>
            
            {thumbnailUrl && (
               <div className="flex justify-end mt-4">
                 <button 
                   onClick={handleDownload}
                   className="text-sm font-bold bg-indigo-50 text-indigo-600 px-4 py-2 rounded shadow-sm hover:bg-indigo-100 transition-colors cursor-pointer"
                 >
                   Download PNG
                 </button>
               </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-8">
        <button 
          onClick={() => setStep(6)}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold border border-gray-300 shadow-sm hover:bg-gray-200 transition-colors"
        >
          Back
        </button>
        <button 
          onClick={() => setStep(8)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow-sm hover:bg-indigo-700 transition-colors"
        >
          Proceed to Render
        </button>
      </div>
    </div>
  );
}
