import React from 'react';
import { useNicheTopicLogic } from '../../hooks/useNicheTopicLogic';
import { NicheSelector } from '../ui/Step1/NicheSelector';
import { NicheDetailsPane } from '../ui/Step1/NicheDetailsPane';
import { VisualStylePicker } from '../ui/Step1/VisualStylePicker';
import { VideoDetailsForm } from '../ui/Step1/VideoDetailsForm';
import { TrendResearchModal } from '../ui/Step1/TrendResearchModal';
import { Loader2 } from 'lucide-react';

export function Step1_NicheTopic() {
  const {
    selectedNiche,
    selectedStyle,
    setSelectedStyle,
    duration,
    setDuration,
    aspectRatio,
    setAspectRatio,
    isTrendModalOpen,
    setIsTrendModalOpen,
    sceneLength,
    setSceneLength,
    llmModel,
    setLlmModel,
    aiVisualModel,
    setAiVisualModel,
    ollamaUrl,
    setOllamaUrl,
    ollamaModel,
    setOllamaModel,
    customScript,
    setCustomScript,
    isGeneratingHooks,
    handleSelectNiche,
    handleGenerateIdeas,
    handleCustomScriptSubmit
  } = useNicheTopicLogic();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6 font-outfit">Create New Video</h1>
        
        {/* Section 1: Niche Selection */}
        <div className="bg-white border border-gray-200 rounded-xl mb-8 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-md">1</div>
              <h2 className="text-xl font-bold text-gray-900">Select Niche</h2>
            </div>
            
            <NicheSelector 
              selectedNiche={selectedNiche} 
              onSelect={handleSelectNiche} 
            />
            
            <NicheDetailsPane 
              selectedNiche={selectedNiche} 
              onOpenTrendResearch={() => setIsTrendModalOpen(true)} 
            />
          </div>
        </div>

        {/* Section 2: Visual Style */}
        <div className="bg-white border border-gray-200 rounded-xl mb-8 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-md">2</div>
              <h2 className="text-xl font-bold text-gray-900">Choose visual style</h2>
            </div>
            
            <VisualStylePicker 
              selectedStyle={selectedStyle} 
              onSelect={setSelectedStyle} 
            />
          </div>
        </div>
      </div>

      {/* Section 3: Video Details */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-md">3</div>
          <h2 className="text-xl font-bold text-gray-900">Video Details & AI Models</h2>
        </div>
        
        <VideoDetailsForm 
          duration={duration} setDuration={setDuration}
          sceneLength={sceneLength} setSceneLength={setSceneLength}
          aiVisualModel={aiVisualModel} setAiVisualModel={setAiVisualModel}
          aspectRatio={aspectRatio} setAspectRatio={setAspectRatio}
          llmModel={llmModel} setLlmModel={setLlmModel}
          ollamaUrl={ollamaUrl} setOllamaUrl={setOllamaUrl}
          ollamaModel={ollamaModel} setOllamaModel={setOllamaModel}
          customScript={customScript} setCustomScript={setCustomScript}
        />
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end pt-4 gap-4">
        <button
          onClick={handleCustomScriptSubmit}
          disabled={isGeneratingHooks}
          className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold transition-all hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center gap-2 shadow-sm"
        >
          Write Custom Script
        </button>
        <button 
          onClick={handleGenerateIdeas}
          disabled={isGeneratingHooks}
          className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
        >
          {isGeneratingHooks ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
          {isGeneratingHooks ? 'Brainstorming...' : 'Generate Hooks & Titles'}
        </button>
      </div>

      {/* Trend Modal Overlay */}
      {isTrendModalOpen && (
        <TrendResearchModal 
          selectedNiche={selectedNiche} 
          onClose={() => setIsTrendModalOpen(false)} 
        />
      )}
    </div>
  );
}
