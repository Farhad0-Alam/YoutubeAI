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

  const sceneCounts = [
    1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 30, 45, 60, 90, 120,
    150, 180, 240, 300, 360, 450, 600, 720, 900
  ];

  const formatDuration = (totalSeconds: number) => {
    if (totalSeconds < 60) return `${totalSeconds} Seconds`;
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    
    if (h > 0) {
      if (m === 0 && s === 0) return `${h} Hour${h > 1 ? 's' : ''}`;
      if (s === 0) return `${h}h ${m}m`;
      return `${h}h ${m}m ${s}s`;
    }
    
    return s === 0 ? `${m} Minute${m > 1 ? 's' : ''}` : `${m}m ${s}s`;
  };

  React.useEffect(() => {
    const currentSeconds = Math.round(duration * 60);
    if (currentSeconds % sceneLength !== 0 || currentSeconds === 0) {
      // Snap to nearest multiple
      const currentScenes = Math.max(1, Math.round(currentSeconds / sceneLength));
      setDuration(Number(((currentScenes * sceneLength) / 60).toFixed(4)));
    }
  }, [sceneLength, duration, setDuration]);

  const getClipOptions = React.useCallback(() => {
    switch (aiVisualModel) {
      case 'veo3.1': return [4, 6, 8];
      case 'grok2': return [6, 10];
      case 'sora': return [4, 10];
      case 'runway_gen3':
      case 'kling_v1.5': return [5, 10];
      case 'seedance2.0':
      default: return Array.from({length: 12}, (_, i) => i + 4);
    }
  }, [aiVisualModel]);

  const clipOptions = getClipOptions();

  React.useEffect(() => {
    if (!clipOptions.includes(sceneLength)) {
      setSceneLength(clipOptions[0]);
    }
  }, [clipOptions, sceneLength, setSceneLength]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">1. AI Visual Model (For Export)</label>
          <select
            value={aiVisualModel}
            onChange={(e) => setAiVisualModel(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
          >
            <option value="veo3.1">Veo 3.1</option>
            <option value="grok2">Grok 2.0</option>
            <option value="seedance2.0">Seedance 2.0</option>
            <option value="kling_v1.5">Kling v1.5</option>
            <option value="midjourney_v6">Midjourney v6</option>
            <option value="runway_gen3">Runway Gen-3</option>
            <option value="sora">OpenAI Sora</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">4. Video Format</label>
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
        <label className="block text-sm font-semibold text-gray-700 mb-2">2. Target Scene Length ({sceneLength}s)</label>
        <div className="flex flex-wrap gap-2">
          {clipOptions.map((val) => (
            <button
              key={val}
              onClick={() => setSceneLength(val)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors border shadow-sm ${sceneLength === val ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              {val}s
            </button>
          ))}
        </div>
        <p className="text-[10px] text-gray-500 mt-2">
          Exact lengths natively supported by {aiVisualModel}.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">3. Target Duration</label>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
        >
          {sceneCounts.map(count => {
            const totalSeconds = count * sceneLength;
            const val = Number((totalSeconds / 60).toFixed(4));
            return (
              <option key={count} value={val}>
                {formatDuration(totalSeconds)} ({count} {count === 1 ? 'Scene' : 'Scenes'})
              </option>
            );
          })}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">5. AI Script Writer Model</label>
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
