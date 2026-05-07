import React from 'react';
import { useThumbnailStudioLogic } from '../../hooks/useThumbnailStudioLogic';
import { ThumbnailCanvas } from '../ui/Step7/ThumbnailCanvas';
import { ThumbnailControls } from '../ui/Step7/ThumbnailControls';
import { StoryboardContextPicker } from '../ui/Step7/StoryboardContextPicker';

export function Step7_ThumbnailStudio() {
  const {
    availableImagePrompts,
    availableTexts,
    title, setTitle,
    subtitle, setSubtitle,
    prompt, setPrompt,
    thumbnailUrl,
    isGenerating,
    fontFamily, setFontFamily,
    filter, setFilter,
    textY, setTextY,
    textColor, setTextColor,
    textAlign, setTextAlign,
    previewRef,
    handleGenerate,
    handleDownload,
    setStep
  } = useThumbnailStudioLogic();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thumbnail Studio</h1>
        <p className="text-gray-500 mb-6">Create a high-CTR thumbnail for your video.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Panel */}
        <div className="lg:col-span-5 space-y-6">
          <StoryboardContextPicker 
            availableImagePrompts={availableImagePrompts}
            availableTexts={availableTexts}
            currentPrompt={prompt}
            onSelectPrompt={setPrompt}
            onSelectText={setSubtitle}
          />

          <ThumbnailControls 
            prompt={prompt} setPrompt={setPrompt}
            title={title} setTitle={setTitle}
            subtitle={subtitle} setSubtitle={setSubtitle}
            fontFamily={fontFamily} setFontFamily={setFontFamily}
            filter={filter} setFilter={setFilter}
            textY={textY} setTextY={setTextY}
            textColor={textColor} setTextColor={setTextColor}
            textAlign={textAlign} setTextAlign={setTextAlign}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 tracking-wide uppercase">Live Preview Editor</h3>
            
            <ThumbnailCanvas 
              previewRef={previewRef}
              thumbnailUrl={thumbnailUrl}
              filter={filter}
              textY={textY}
              textAlign={textAlign}
              textColor={textColor}
              fontFamily={fontFamily}
              title={title}
              subtitle={subtitle}
            />
            
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
          Back to Brand Kit
        </button>
        <button 
          onClick={() => setStep(8)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold transition-colors hover:bg-indigo-700 shadow-sm"
        >
          Continue to Render
        </button>
      </div>
    </div>
  );
}
