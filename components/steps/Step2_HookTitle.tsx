import { useState, useEffect } from 'react';
import { useVideoStore } from '../../store/videoStore';
import { useVideoGeneration } from '../../hooks/useVideoGeneration';
import { Loader2, ArrowRight, CheckCircle2, PlusCircle, RefreshCw, Sparkles, X, ChevronLeft } from 'lucide-react';
import { api } from '../../lib/api';
import { niches } from '../../lib/niches';

const FOCUS_ANGLES = [
  { id: 'beginner_guide', label: 'Beginner Guide', description: 'Step-by-step introduction' },
  { id: 'mistakes', label: 'Mistakes to Avoid', description: 'Common pitfalls & warnings' },
  { id: 'secrets', label: 'Hidden Secrets', description: 'Advanced tips & tricks' },
  { id: 'case_study', label: 'Case Study', description: 'Real-world example breakdown' },
  { id: 'top_list', label: 'Top 10 / Best Of', description: 'Curated list format' },
  { id: 'myth_busting', label: 'Myth Busting', description: 'Debunking common beliefs' }
];

export function Step2_HookTitle() {
  const { project, generatedIdeas, setGeneratedIdeas, setStep } = useVideoStore();
  const { generateScript, isGenerating, generateHooks, isGeneratingHooks } = useVideoGeneration();
  const [selectedIndex, setSelectedIndex] = useState<number | 'custom' | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [customHook, setCustomHook] = useState('');
  const [isGeneratingCustomHook, setIsGeneratingCustomHook] = useState(false);
  const [activeSubNiche, setActiveSubNiche] = useState<string | null>(null);
  const [showSubNicheModal, setShowSubNicheModal] = useState(true);
  const [modalStep, setModalStep] = useState<1 | 2>(1);
  const [tempSubNiche, setTempSubNiche] = useState<string | null>(null);

  const activeNicheObj = project ? niches.find(n => n.niche_id === project.niche_id) : null;

  // Auto-open modal when step loads
  useEffect(() => {
    setShowSubNicheModal(true);
    setModalStep(1);
    setTempSubNiche(null);
  }, []);

  const handleSubNicheSelect = (subNiche: string) => {
    setTempSubNiche(subNiche);
    setModalStep(2);
  };

  const handleAngleSelect = async (angleLabel: string) => {
    if (!tempSubNiche || !project) return;
    
    const finalTopicLabel = `${tempSubNiche} (${angleLabel})`;
    setActiveSubNiche(finalTopicLabel);
    setShowSubNicheModal(false);
    
    const topic = `${activeNicheObj?.display_name} - ${tempSubNiche}. Focus Angle: ${angleLabel}. Make sure all hooks and titles strongly reflect this specific angle format.`;

    const newIdeas = await generateHooks({
      niche_id: project.niche_id,
      topic,
      script_style: project.script_style,
      duration_minutes: project.duration_minutes,
      scene_length: project.scene_length,
      voice_gender: project.voice || 'Male',
      aspect_ratio: project.aspect_ratio || '16:9',
      llm_model: project.settings?.llm_model,
      ollama_url: project.settings?.ollama_url,
      ollama_model: project.settings?.ollama_model
    } as any);

    if (newIdeas && newIdeas.length > 0) {
      setGeneratedIdeas(newIdeas);
      setSelectedIndex(null);
    }
    
    // Reset modal state for next open
    setModalStep(1);
    setTempSubNiche(null);
  };

  const handleSkipSubNiche = () => {
    setShowSubNicheModal(false);
  };

  const handleGenerateCustomHook = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!project || !customTitle.trim()) return;
    setIsGeneratingCustomHook(true);
    try {
      const data = await api.generateHooksAndTitles({
        niche_id: project.niche_id,
        topic: `Topic: ${project.topic}. The user has chosen a specific title: "${customTitle}". Please generate 1-3 ideas where the 'title' matches the user's title EXACTLY, and the 'hook' is a perfectly matched first 5 seconds script for this title.`,
        llm_model: project.settings?.llm_model,
        ollama_url: project.settings?.ollama_url,
        ollama_model: project.settings?.ollama_model
      });
      if (data && data.ideas && data.ideas.length > 0) {
        setCustomHook(data.ideas[0].hook);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingCustomHook(false);
    }
  };

  const handleWriteScript = () => {
    if (selectedIndex === null || !project || !generatedIdeas) return;

    let selectedTitle = '';
    let selectedHook = '';

    if (selectedIndex === 'custom') {
      selectedTitle = customTitle.trim();
      selectedHook = customHook.trim();
    } else {
      selectedTitle = generatedIdeas[selectedIndex as number].title;
      selectedHook = generatedIdeas[selectedIndex as number].hook;
    }

    const enhancedTopic = `${project.topic}. 
    CRITICAL: YOU MUST USE THIS EXACT TITLE: "${selectedTitle}"
    CRITICAL: YOU MUST USE THIS EXACT HOOK FOR THE FIRST SCENE: "${selectedHook}"`;

    generateScript({
      niche_id: project.niche_id,
      topic: enhancedTopic,
      duration_minutes: project.duration_minutes,
      scene_length: project.scene_length,
      script_style: project.script_style,
      voice_gender: project.voice || 'Male',
      aspect_ratio: project.aspect_ratio || '16:9',
      llm_model: project.settings?.llm_model,
      ollama_url: project.settings?.ollama_url,
      ollama_model: project.settings?.ollama_model
    });
  };

  const handleGenerateMore = async () => {
    if (!project) return;
    const newIdeas = await generateHooks({
      niche_id: project.niche_id,
      topic: project.topic,
      script_style: project.script_style,
      duration_minutes: project.duration_minutes,
      scene_length: project.scene_length,
      voice_gender: project.voice || 'Male',
      aspect_ratio: project.aspect_ratio || '16:9',
      llm_model: project.settings?.llm_model,
      ollama_url: project.settings?.ollama_url,
      ollama_model: project.settings?.ollama_model
    } as any);
    if (newIdeas && newIdeas.length > 0) {
      setGeneratedIdeas([...(generatedIdeas || []), ...newIdeas]);
    }
  };

  if (!generatedIdeas || generatedIdeas.length === 0) {
    return (
      <div className="bg-white border text-center border-gray-200 rounded-xl p-6 shadow-sm">
        <p className="text-gray-500 mb-4">No ideas generated.</p>
        <button onClick={() => setStep(1)} className="px-4 py-2 bg-indigo-600 text-white rounded">Go Back</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* ── Claude-style Sub-Niche Modal ── */}
      {showSubNicheModal && activeNicheObj && activeNicheObj.contentPillars && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {modalStep === 2 && (
                    <button 
                      onClick={() => setModalStep(1)}
                      className="text-white/80 hover:text-white mr-1 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}
                  <Sparkles className="w-5 h-5 text-white/90" />
                  <span className="text-xs font-semibold text-white/80 uppercase tracking-widest">AI Assistant</span>
                </div>
                <button
                  onClick={handleSkipSubNiche}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-white">
                {modalStep === 1 ? 'What specific topic do you want to focus on?' : 'What angle should we take?'}
              </h2>
              <p className="text-indigo-100 text-sm mt-1">
                {modalStep === 1 
                  ? <>Pick a sub-niche from <span className="font-semibold">{activeNicheObj.emoji} {activeNicheObj.display_name}</span>.</>
                  : <>Select a highly effective viral angle for <span className="font-semibold">{tempSubNiche}</span>.</>}
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {modalStep === 1 ? (
                <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                  {activeNicheObj.contentPillars.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => handleSubNicheSelect(sub)}
                      className="group flex items-center gap-3 p-4 rounded-xl border-2 border-gray-100 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50 text-left transition-all duration-200"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 group-hover:border-indigo-300 group-hover:bg-indigo-100 flex items-center justify-center flex-shrink-0 transition-all">
                        <Sparkles className="w-4 h-4 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-700 capitalize leading-tight">{sub}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 max-h-72 overflow-y-auto pr-1">
                  {FOCUS_ANGLES.map((angle) => (
                    <button
                      key={angle.id}
                      onClick={() => handleAngleSelect(angle.label)}
                      disabled={isGeneratingHooks}
                      className="group flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50 text-left transition-all duration-200 disabled:opacity-50"
                    >
                      <div className="w-10 h-10 rounded-full bg-white border border-gray-200 group-hover:border-indigo-300 group-hover:bg-indigo-100 flex items-center justify-center flex-shrink-0 transition-all">
                        <CheckCircle2 className="w-5 h-5 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-gray-900 group-hover:text-indigo-800 leading-tight mb-0.5">{angle.label}</span>
                        <span className="block text-xs text-gray-500 group-hover:text-indigo-600/80">{angle.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-400">Or keep the generated ideas as-is</p>
                <button
                  onClick={handleSkipSubNiche}
                  className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Skip →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Page Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Your Hook & Title</h1>
          <p className="text-gray-500">Choose the most viral angle for your video before generating the full script.</p>
        </div>
        {/* Re-open sub-niche selector */}
        {activeNicheObj?.contentPillars && (
          <button
            onClick={() => {
              setModalStep(1);
              setTempSubNiche(null);
              setShowSubNicheModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 text-sm font-semibold hover:bg-indigo-100 transition-colors flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            {activeSubNiche ? (
              <span className="capitalize">{activeSubNiche}</span>
            ) : (
              'Choose Topic'
            )}
          </button>
        )}
      </div>

      {/* Loading overlay while regenerating */}
      {isGeneratingHooks && (
        <div className="flex items-center gap-3 px-5 py-4 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700">
          <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" />
          <span className="font-medium text-sm">
            Generating viral hooks for <span className="font-bold capitalize">{activeSubNiche || 'your niche'}</span>...
          </span>
        </div>
      )}

      {/* Hook & Title Cards */}
      <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {generatedIdeas.map((idea, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={`relative cursor-pointer bg-white border-2 rounded-xl p-6 transition-all ${
              selectedIndex === idx
                ? 'border-indigo-600 shadow-md ring-1 ring-indigo-600'
                : 'border-gray-200 hover:border-indigo-300 hover:shadow-sm'
            }`}
          >
            {selectedIndex === idx && (
              <div className="absolute top-4 right-4 text-indigo-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-900 pr-8">{idea.title}</h3>
            <p className="text-gray-600 mt-2 italic">"{idea.hook}"</p>
          </div>
        ))}

        {/* Custom Title Option */}
        <div
          onClick={() => setSelectedIndex('custom')}
          className={`relative cursor-pointer bg-white border-2 rounded-xl p-6 transition-all ${
            selectedIndex === 'custom'
              ? 'border-indigo-600 shadow-md ring-1 ring-indigo-600'
              : 'border-gray-200 border-dashed hover:border-indigo-300 hover:shadow-sm'
          }`}
        >
          {selectedIndex === 'custom' && (
            <div className="absolute top-4 right-4 text-indigo-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          )}
          <div className="flex items-center gap-2 mb-4">
            <PlusCircle className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xl font-bold text-gray-900">Write Your Own Title & Hook</h3>
          </div>

          {selectedIndex === 'custom' ? (
            <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Custom Title</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Enter a highly-clickable title..."
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-sm font-medium text-gray-700">Custom Hook</label>
                  <button
                    onClick={handleGenerateCustomHook}
                    disabled={!customTitle.trim() || isGeneratingCustomHook}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 disabled:opacity-50 transition-colors"
                  >
                    {isGeneratingCustomHook ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                    {isGeneratingCustomHook ? 'Generating...' : 'Auto-Generate Hook'}
                  </button>
                </div>
                <textarea
                  value={customHook}
                  onChange={(e) => setCustomHook(e.target.value)}
                  placeholder="Enter the first 5 seconds script..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Have a better idea? Click here to enter a custom title and hook manually.</p>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row justify-between pt-4 gap-4 border-t border-gray-200">
        <button
          onClick={() => setStep(1)}
          className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold transition-colors hover:bg-gray-50 flex items-center justify-center gap-2 shadow-sm"
        >
          Back
        </button>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={handleGenerateMore}
            disabled={isGeneratingHooks}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-100 flex items-center justify-center gap-2 shadow-sm"
          >
            {isGeneratingHooks ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
            {isGeneratingHooks ? 'Generating...' : 'More Suggestions'}
          </button>

          <button
            onClick={handleWriteScript}
            disabled={selectedIndex === null || isGenerating || (selectedIndex === 'custom' && (!customTitle.trim() || !customHook.trim()))}
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-sm"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
            {isGenerating ? 'Writing Script...' : 'Write Full Script'}
          </button>
        </div>
      </div>
    </div>
  );
}
