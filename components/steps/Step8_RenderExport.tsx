import React from 'react';
import { useRenderExportLogic } from '../../hooks/useRenderExportLogic';
import { RenderSettingsView } from '../ui/Step8/RenderSettingsView';
import { FinalVideoDashboard } from '../ui/Step8/FinalVideoDashboard';
import { VideoEditor } from './VideoEditor';

export function Step8_RenderExport() {
  const {
    scriptData,
    voices,
    selectedVoice,
    setSelectedVoice,
    grokMode,
    setGrokMode,
    pipelineStage,
    grokProgress,
    isPrepping,
    renderComplete,
    showEditor,
    setShowEditor,
    isExporting,
    isGeneratingSEO,
    seoData,
    copiedId,
    handleCopy,
    handleGenerateSEO,
    startLocalRender,
    handleDownloadProjectZip,
    handleExportVideo,
    setStep
  } = useRenderExportLogic();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate & Export</h1>
        <p className="text-gray-500 mb-6">
          Generate your AI voiceover and Grok video clips, then assemble into a final production video.
        </p>
      </div>

      {renderComplete && scriptData ? (
        <FinalVideoDashboard
          scenes={scriptData.scenes}
          isExporting={isExporting}
          onExport={handleExportVideo}
          onOpenEditor={() => setShowEditor(true)}
          onDownloadAssets={handleDownloadProjectZip}
          onGenerateSEO={handleGenerateSEO}
          isGeneratingSEO={isGeneratingSEO}
          seoData={seoData}
          onCopy={handleCopy}
          copiedId={copiedId}
          onContinue={() => setStep(9)}
        />
      ) : (
        <RenderSettingsView
          voices={voices}
          selectedVoice={selectedVoice}
          setSelectedVoice={setSelectedVoice}
          grokMode={grokMode}
          setGrokMode={setGrokMode}
          pipelineStage={pipelineStage}
          grokProgress={grokProgress}
          isPrepping={isPrepping}
          onStartRender={startLocalRender}
          onBack={() => setStep(4)}
        />
      )}

      {showEditor && (
        <VideoEditor onClose={() => setShowEditor(false)} />
      )}
    </div>
  );
}
