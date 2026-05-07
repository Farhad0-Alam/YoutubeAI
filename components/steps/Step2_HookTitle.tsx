import React from 'react';
import { useHookTitleLogic } from '../../hooks/useHookTitleLogic';
import { SubNicheModal } from '../ui/Step2/SubNicheModal';
import { HookIdeaCard } from '../ui/Step2/HookIdeaCard';
import { CustomIdeaEditor } from '../ui/Step2/CustomIdeaEditor';
import { Loader2, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';
import { GenerationProgressModal } from '../ui/GenerationProgressModal';

export function Step2_HookTitle() {
  const {
    generatedIdeas,
    isGenerating,
    isGeneratingHooks,
    selectedIndex,
    setSelectedIndex,
    customTitle,
    setCustomTitle,
    customHook,
    setCustomHook,
    isGeneratingCustomHook,
    activeSubNiche,
    showSubNicheModal,
    setShowSubNicheModal,
    modalStep,
    setModalStep,
    tempSubNiche,
    activeNicheObj,
    handleSubNicheSelect,
    handleAngleSelect,
    handleGenerateCustomHook,
    handleWriteScript,
    handleGenerateMore,
    setStep
  } = useHookTitleLogic();

  const [modalProgress, setModalProgress] = React.useState(0);

  React.useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setModalProgress(prev => (prev < 3 ? prev + 1 : prev));
      }, 5000); // Script takes longer
      return () => clearInterval(interval);
    } else {
      setModalProgress(0);
    }
  }, [isGenerating]);

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
      
      {/* AI Assistant Modal */}
      {showSubNicheModal && (
        <SubNicheModal 
          activeNicheObj={activeNicheObj}
          modalStep={modalStep}
          tempSubNiche={tempSubNiche}
          isGeneratingHooks={isGeneratingHooks}
          onSubNicheSelect={handleSubNicheSelect}
          onAngleSelect={handleAngleSelect}
          onClose={() => setShowSubNicheModal(false)}
          setModalStep={setModalStep}
        />
      )}

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Your Hook & Title</h1>
          <p className="text-gray-500">Choose the most viral angle for your video before generating the full script.</p>
        </div>
        {activeNicheObj?.contentPillars && (
          <button
            onClick={() => {
              setModalStep(1);
              setShowSubNicheModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 text-sm font-semibold hover:bg-indigo-100 transition-colors flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            {activeSubNiche ? <span className="capitalize">{activeSubNiche}</span> : 'Choose Topic'}
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
          <HookIdeaCard 
            key={idx}
            idea={idea}
            isSelected={selectedIndex === idx}
            onSelect={() => setSelectedIndex(idx)}
          />
        ))}

        <CustomIdeaEditor 
          isSelected={selectedIndex === 'custom'}
          onSelect={() => setSelectedIndex('custom')}
          title={customTitle}
          setTitle={setCustomTitle}
          hook={customHook}
          setHook={setCustomHook}
          onGenerateHook={handleGenerateCustomHook}
          isGeneratingHook={isGeneratingCustomHook}
        />
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col-reverse sm:flex-row justify-between pt-4 gap-4 border-t border-gray-200">
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

      <GenerationProgressModal
        isOpen={isGenerating}
        title="Writing Full Video Script"
        subtitle="Our AI is crafting a high-retention script for your topic..."
        steps={[
          "Initializing script structure",
          "Drafting cinematic visuals",
          "Optimizing narration pacing",
          "Adding production details & VFX"
        ]}
        currentStep={modalProgress}
      />
    </div>
  );
}
