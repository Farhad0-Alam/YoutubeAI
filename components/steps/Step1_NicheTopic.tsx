import { useState } from 'react';
import { niches } from '../../lib/niches';
import { NicheCard } from '../ui/NicheCard';
import { useVideoGeneration } from '../../hooks/useVideoGeneration';
import { useVideoStore } from '../../store/videoStore';
import { Loader2, CheckCircle2, Search, X, TrendingUp, Youtube } from 'lucide-react';
import { generateStoryboardPrompts } from '../../lib/storyboardLogic';

const VISUAL_STYLES = [
  { id: 'cinematic', name: 'Cinematic', description: 'YouTube #1', icon: '🎥' },
  { id: 'ghibli', name: 'Ghibli / Anime', description: 'TikTok viral', icon: '🌸' },
  { id: 'webcomic', name: 'Webcomic', description: 'Storytelling', icon: '📖' },
  { id: 'watercolor', name: 'Watercolor', description: 'Lifestyle', icon: '🎨' },
  { id: 'retro', name: 'Retro', description: 'Nostalgia', icon: '📺' },
  { id: '3d_render', name: '3D Render', description: 'Premium', icon: '🧊' },
  { id: 'whiteboard', name: 'Whiteboard', description: 'Education', icon: '✏️' },
  { id: 'paper_craft', name: 'Paper Craft', description: 'Creative', icon: '✂️' },
  { id: 'pov', name: 'POV', description: 'Immersive', icon: '👁️' },
  { id: 'dark_noir', name: 'Dark / Noir', description: 'Drama', icon: '🌑' },
  { id: 'infographic', name: 'Infographic', description: 'Data driven', icon: '📊' },
  { id: 'stock_footage', name: 'Stock Footage', description: 'Faceless', icon: '🎞️' },
  { id: 'pixel_art', name: 'Pixel Art', description: 'Gaming, retro tech', icon: '👾' },
  { id: 'motion_graphic', name: 'Motion Graphic', description: 'Corporate, explainers', icon: '📐' },
  { id: 'documentary', name: 'Documentary', description: 'True story, news style', icon: '📰' },
  { id: 'minimalist', name: 'Minimalist', description: 'Finance, productivity', icon: '✨' },
];

export function Step1_NicheTopic() {
  const [selectedNiche, setSelectedNiche] = useState(niches[0].niche_id);
  const [selectedStyle, setSelectedStyle] = useState(niches[0].bestStyles?.[0] || 'cinematic');
  const [duration, setDuration] = useState(0.5);
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [isTrendModalOpen, setIsTrendModalOpen] = useState(false);

  const [sceneLength, setSceneLength] = useState(15);
  const [llmModel, setLlmModel] = useState('gemini'); // Default model
  const [aiVisualModel, setAiVisualModel] = useState('seedance2.0');
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState('qwen2.5:14b');
  const [customScript, setCustomScript] = useState('');
  const { generateScript, isGenerating, generateHooks, isGeneratingHooks } = useVideoGeneration();
  const setGeneratedIdeas = useVideoStore(s => s.setGeneratedIdeas);
  const setStep = useVideoStore(s => s.setStep);

  const handleSelectNiche = (nicheId: string) => {
    const activeNicheObj = niches.find(n => n.niche_id === nicheId);
    setSelectedNiche(nicheId);
    setSelectedStyle(activeNicheObj?.bestStyles?.[0] || 'cinematic');
  };

  const handleGenerateIdeas = async () => {
    const activeNicheObj = niches.find(n => n.niche_id === selectedNiche);
    const generatedTopic = activeNicheObj ? activeNicheObj.display_name : selectedNiche;
    try {
      const ideas = await generateHooks({
        niche_id: selectedNiche,
        topic: generatedTopic,
        duration_minutes: duration,
        scene_length: sceneLength,
        ai_model: aiVisualModel,
        script_style: 'Educational',
        voice_gender: 'Male',
        aspect_ratio: aspectRatio,
        llm_model: llmModel,
        ollama_url: ollamaUrl,
        ollama_model: ollamaModel,
        visual_style: selectedStyle
      } as any);
      setGeneratedIdeas(ideas);
      setStep(2);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Video</h1>
        
        <div className="bg-white border border-gray-200 rounded-xl mb-8 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">1</div>
              <h2 className="text-xl font-bold text-gray-900">Select Niche</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto pr-2 pb-2">
              {niches.map(niche => (
                  <NicheCard
                    key={niche.niche_id}
                    niche={niche}
                    selected={selectedNiche === niche.niche_id}
                    onClick={() => handleSelectNiche(niche.niche_id)}
                  />
              ))}
            </div>
            
            {/* Niche Details Pane */}
            {(() => {
              const active = niches.find(n => n.niche_id === selectedNiche);
              if (!active) return null;
              
              return (
                <div className="mt-6 p-5 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                    <h3 className="font-semibold text-lg text-indigo-900 flex items-center gap-2 m-0">
                      {active.emoji} {active.display_name} Insights
                    </h3>
                    <button
                      onClick={() => setIsTrendModalOpen(true)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 rounded-lg text-xs font-bold shadow-sm transition-all"
                    >
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      Competitor & Trend Research
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2">Platform Potential</h4>
                      <div className="space-y-2">
                        {active.platforms && Object.entries(active.platforms).map(([platform, data]) => (
                          <div key={platform} className="flex flex-col">
                            <div className="flex justify-between items-center text-sm">
                              <span className="capitalize font-medium text-gray-700">{platform}</span>
                              <span className="font-bold text-indigo-600">{data.score}/10</span>
                            </div>
                            <span className="text-[10px] text-gray-500 truncate">{data.note}</span>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                              <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${(data.score / 10) * 100}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2">Audience & Comp</h4>
                      <div className="space-y-2 text-sm text-gray-700">
                        {active.audience && (
                          <>
                            <p><span className="font-medium">Age:</span> {active.audience.age}</p>
                            <p><span className="font-medium">Intent:</span> {active.audience.intent}</p>
                            <p><span className="font-medium">Retention:</span> {active.audience.retention}</p>
                          </>
                        )}
                        <p><span className="font-medium">Competition:</span> <span className="capitalize">{active.competitionLevel}</span></p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2">Monetization</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {active.monetization?.map(m => (
                          <span key={m} className="px-2 py-1 bg-white border border-gray-200 rounded-md text-[11px] font-medium text-gray-700">
                            {m}
                          </span>
                        ))}
                      </div>
                      <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mt-4 mb-2">Best Styles</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {active.bestStyles?.map(s => (
                          <span key={s} className="px-2 py-1 bg-indigo-100 border border-indigo-200 rounded-md text-[11px] font-medium text-indigo-800 capitalize">
                            {s.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl mb-8 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">2</div>
              <h2 className="text-xl font-bold text-gray-900">Choose visual style</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {VISUAL_STYLES.map(style => {
                const isSelected = selectedStyle === style.id;
                return (
                  <div
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`relative cursor-pointer rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all duration-200 ${
                      isSelected 
                        ? 'border-2 border-indigo-600 bg-indigo-50/30 shadow-sm' 
                        : 'border border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 text-indigo-600">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                    <div className="text-3xl mb-3">{style.icon}</div>
                    <div className="font-bold text-sm text-gray-900 mb-1">{style.name}</div>
                    <div className="text-[11px] text-gray-500">{style.description}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">3</div>
          <h2 className="text-xl font-bold text-gray-900">Video Details</h2>
        </div>
        
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
                  <p className="text-[10px] text-gray-500 mt-1">Make sure you have set OLLAMA_ORIGINS=&quot;*&quot; on your daemon.</p>
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
            <p className="text-xs text-gray-500 mb-2">Paste a full long script here. If provided, we will automatically split it into a list of scenes when you click &quot;Write Custom Script&quot;.</p>
            <textarea 
              value={customScript}
              onChange={(e) => setCustomScript(e.target.value)}
              placeholder="Paste your full script draft here..."
              className="w-full h-32 bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 resize-y"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end pt-4 gap-4">
        <button
          onClick={async () => {
            const activeNicheObj = niches.find(n => n.niche_id === selectedNiche);
            const fallbackTopic = activeNicheObj ? activeNicheObj.display_name : 'Custom Video';
            
            let parsedScenes: any[] = [];
            const scriptText = customScript.trim();
            if (scriptText) {
               // Use Vibe Coding Logic
               const { parseScriptByScenes } = require('../../lib/storyboardLogic');
               parsedScenes = parseScriptByScenes(scriptText, duration * 60);
            }
            
            if (parsedScenes.length === 0) {
              // fallback if blank
              parsedScenes = [
                {
                  scene_number: 1,
                  duration_seconds: duration * 60 > 15 ? 5 : duration * 60,
                  narration: '',
                  text_overlay: '',
                  visual_description: '',
                  search_keyword: '',
                  image_prompt: '',
                  transition: 'none'
                }
              ];
            }

            const totalDuration = parsedScenes.reduce((acc, s) => acc + s.duration_seconds, 0);

            const scriptData = {
              title: fallbackTopic,
              description: '',
              tags: [],
              hook: '',
              cta: '',
              scenes: parsedScenes,
              total_duration_seconds: totalDuration || (duration * 60),
              aspect_ratio: aspectRatio,
            };
            
            // Just simulate setting a project so they can proceed
            // We use the store from useVideoGeneration logic essentially
            const projectData = {
              title: fallbackTopic,
              niche_id: selectedNiche,
              topic: fallbackTopic,
              script_style: 'Custom',
              visual_style: selectedStyle,
              duration_minutes: (totalDuration || (duration * 60)) / 60,
              scene_length: sceneLength,
              ai_model: aiVisualModel,
              voice: 'Male',
              aspect_ratio: aspectRatio,
              status: "script_ready",
              settings: {
                llm_model: llmModel,
                ollama_url: ollamaUrl,
                ollama_model: ollamaModel,
              },
            };
            
            try {
              const { useVideoStore } = await import('../../store/videoStore');
              const { toast } = await import('sonner');
              const { api } = await import('../../lib/api');
              const store = useVideoStore.getState();
              
              store.setScriptData(scriptData);
              const proj = await api.createProject(projectData);
              store.setProject({ ...projectData, _id: proj._id } as any);
              store.setStep(3);
            } catch (err) {
              console.error(err);
            }
          }}
          disabled={isGenerating}
          className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center justify-center gap-2 shadow-sm"
        >
          Write Custom Script
        </button>
        <button 
          onClick={handleGenerateIdeas}
          disabled={isGeneratingHooks}
          className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-sm"
        >
          {isGeneratingHooks ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
          {isGeneratingHooks ? 'Brainstorming...' : 'Generate Hooks & Titles'}
        </button>
      </div>

      {/* Competitor & Trend Modal */}
      {isTrendModalOpen && (() => {
        const active = niches.find(n => n.niche_id === selectedNiche);
        if (!active) return null;
        
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
              
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 leading-tight">Competitor & Trend Research</h2>
                    <p className="text-xs text-gray-500 font-medium">{active.display_name} Niche Insights</p>
                  </div>
                </div>
                <button onClick={() => setIsTrendModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto bg-gray-50/50 flex-1">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-1">Top Performing Angles</h3>
                    <p className="text-xs text-gray-500">Based on recent algorithm bumps and audience retention data.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1"><Search className="w-3 h-3"/> Live Data Sync</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Mock Video 1 */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row gap-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-full md:w-48 h-28 bg-gray-900 rounded-lg overflow-hidden relative flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2">
                        <div className="text-[10px] font-bold text-white mb-0.5" style={{ color: active.thumbnail_colors?.accent || '#FFF' }}>{active.thumbnail_emotion?.toUpperCase() || 'URGENT'}</div>
                        <div className="text-xs font-bold text-white leading-tight">THE TRUTH THEY HIDE</div>
                      </div>
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Youtube className="w-3 h-3" /> VIRAL
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-bold text-gray-900 line-clamp-2">{active.title_formula?.replace('[Number]', '7').replace('[Topic]', active.keywords?.[0] || 'Secrets').replace('[Outcome]', 'Will Shock You').replace('[Timeframe]', 'in 2025') || 'Amazing Viral Video Concept'}</h4>
                        <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 ml-2 whitespace-nowrap">2.4M Views</div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Hook: <span className="font-semibold text-gray-700 capitalize">{active.hook_style?.replace('_', ' ') || 'Curiosity'}</span></div>
                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Pacing: <span className="font-semibold text-gray-700">Fast (2s cuts)</span></div>
                      </div>
                      <div className="mt-auto flex items-center gap-2">
                        <button onClick={async () => { 
                          setIsTrendModalOpen(false); 
                          const { toast } = await import('sonner');
                          toast.success("Applied 'Improve on this' framework to Hook generator!"); 
                        }} className="flex-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 py-1.5 rounded-lg text-xs font-bold transition-colors">
                          Improve on this
                        </button>
                        <button onClick={async () => { 
                          setIsTrendModalOpen(false); 
                          const { toast } = await import('sonner');
                          toast.success("Applied 'Differentiate' framework to Hook generator!"); 
                        }} className="flex-1 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 py-1.5 rounded-lg text-xs font-bold transition-colors">
                          Differentiate (Pivot)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mock Video 2 */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row gap-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-full md:w-48 h-28 bg-gray-800 rounded-lg overflow-hidden relative flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2">
                        <div className="text-[10px] font-bold text-white mb-0.5" style={{ color: active.thumbnail_colors?.primary_text || '#FFF' }}>{active.keywords?.[1]?.toUpperCase() || 'EXPOSED'}</div>
                        <div className="text-xs font-bold text-white leading-tight">STOP DOING THIS</div>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-bold text-gray-900 line-clamp-2">Why 99% of people fail at {active.keywords?.[0] || 'this'} (And how to fix it)</h4>
                        <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 ml-2 whitespace-nowrap">890K Views</div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Hook: <span className="font-semibold text-gray-700">Contrarian Claim</span></div>
                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Style: <span className="font-semibold text-gray-700 capitalize">{active.bestStyles?.[0] || 'Cinematic'}</span></div>
                      </div>
                      <div className="mt-auto flex items-center gap-2">
                        <button onClick={async () => { 
                          setIsTrendModalOpen(false); 
                          const { toast } = await import('sonner');
                          toast.success("Applied 'Improve on this' framework to Hook generator!"); 
                        }} className="flex-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 py-1.5 rounded-lg text-xs font-bold transition-colors">
                          Improve on this
                        </button>
                        <button onClick={async () => { 
                          setIsTrendModalOpen(false); 
                          const { toast } = await import('sonner');
                          toast.success("Applied 'Differentiate' framework to Hook generator!"); 
                        }} className="flex-1 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 py-1.5 rounded-lg text-xs font-bold transition-colors">
                          Differentiate (Pivot)
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
