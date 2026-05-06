import React from 'react';

interface VideoDetailsFormProps {
  duration: number;
  setDuration: (val: number) => void;
  sceneLength: number;
  setSceneLength: (val: number) => void;
  aiVisualModel: string;
  setAiVisualModel: (val: string) => void;
  aspectRatio: string;
  setAspectRatio: (val: string) => void;
  llmModel: string;
  setLlmModel: (val: string) => void;
  ollamaUrl: string;
  setOllamaUrl: (val: string) => void;
  ollamaModel: string;
  setOllamaModel: (val: string) => void;
  customScript: string;
  setCustomScript: (val: string) => void;
}

export function VideoDetailsForm({
  duration, setDuration,
  sceneLength, setSceneLength,
  aiVisualModel, setAiVisualModel,
  aspectRatio, setAspectRatio,
  llmModel, setLlmModel,
  ollamaUrl, setOllamaUrl,
  ollamaModel, setOllamaModel,
  customScript, setCustomScript
}: VideoDetailsFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Target Duration</label>
        <select 
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
        >
          <option value={0.167}>10 Seconds (Ultra Short)</option>
          <option value={0.25}>15 Seconds (Shorts / Reels)</option>
          <option value={0.5}>30 Seconds (Shorts / Reels)</option>
          <option value={1}>1 Minute (Short-form)</option>
          <option value={2}>2 Minutes (Short-form)</option>
          <option value={3}>3 Minutes (Standard)</option>
          <option value={5}>5 Minutes (Standard)</option>
          <option value={8}>8 Minutes (Mid-roll Ads)</option>
          <option value={10}>10 Minutes (Optimal)</option>
          <option value={15}>15 Minutes (Documentary)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Target Scene Length ({sceneLength}s)
        </label>
        <div className="flex items-center gap-4">
          <input 
            type="range" 
            min="4" 
            max="15" 
            value={sceneLength}
            onChange={(e) => setSceneLength(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <span className="text-sm font-semibold text-gray-700 w-8 text-right">{sceneLength}s</span>
        </div>
        <p className="text-[10px] text-gray-500 mt-1">Shorter scenes (4-6s) feel faster, longer scenes (10-15s) give AI models like Seedance more time to develop movement.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">AI Visual Model (For Export)</label>
          <select 
            value={aiVisualModel}
            onChange={(e) => setAiVisualModel(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
          >
            <option value="seedance2.0">Seedance 2.0</option>
            <option value="veo3.1">Veo 3.1</option>
            <option value="kling_v1.5">Kling v1.5</option>
            <option value="grok2">Grok 2.0</option>
            <option value="midjourney_v6">Midjourney v6</option>
            <option value="runway_gen3">Runway Gen-3</option>
            <option value="sora">OpenAI Sora</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Video Format</label>
          <select 
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
          >
            <option value="16:9">16:9 (Widescreen)</option>
            <option value="9:16">9:16 (Vertical)</option>
            <option value="1:1">1:1 (Square)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">AI Script Writer Model</label>
        <select 
          value={llmModel}
          onChange={(e) => setLlmModel(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
        >
          <option value="gemini">Google Gemini 2.0 (Fast & Free)</option>
          <option value="openai">OpenAI GPT-4o (Premium)</option>
          <option value="qwen">Alibaba Qwen-Max (Premium)</option>
          <option value="ollama">Ollama (Local / Custom Model)</option>
        </select>
      </div>

      {llmModel === 'ollama' && (
        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Ollama Base URL</label>
              <input 
                type="text" 
                value={ollamaUrl}
                onChange={(e) => setOllamaUrl(e.target.value)}
                placeholder="http://localhost:11434"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              />
              <p className="text-[10px] text-gray-500 mt-1">Make sure you have set OLLAMA_ORIGINS="*" on your daemon.</p>
           </div>
           <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Model Name</label>
              <input 
                type="text" 
                value={ollamaModel}
                onChange={(e) => setOllamaModel(e.target.value)}
                placeholder="qwen2.5:14b"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              />
           </div>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Custom Script (Optional)</label>
        <p className="text-xs text-gray-500 mb-2">Paste a full long script here. If provided, we will automatically split it into a list of scenes when you click "Write Custom Script".</p>
        <textarea 
          value={customScript}
          onChange={(e) => setCustomScript(e.target.value)}
          placeholder="Paste your full script draft here..."
          className="w-full h-32 bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 resize-y"
        />
      </div>
    </div>
  );
}
