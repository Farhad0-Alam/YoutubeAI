import { useState, useEffect } from 'react';
import { useVideoStore } from '../../store/videoStore';
import { useHistoryStore } from '../../store/historyStore';
import { VoiceSelector } from '../ui/VoiceSelector';
import { LivePreviewPlayer } from '../ui/LivePreviewPlayer';
import { VideoEditor } from './VideoEditor';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { Loader2, Download, PackageOpen } from 'lucide-react';
import { compileAndDownloadVideo } from '../../lib/videoCompiler';

export function Step8_RenderExport() {
  const { project, scriptData, voices, setVoices, setStep } = useVideoStore();
  const saveProject = useHistoryStore(state => state.saveProject);
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [isPrepping, setIsPrepping] = useState(false);
  const [renderComplete, setRenderComplete] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    api.getVoices().then(setVoices).catch(console.error);
  }, [setVoices]);

  const startLocalRender = async () => {
    if (!project || !scriptData) return;
    setIsPrepping(true);
    
    toast.info('Generating AI Voiceover...', { duration: 4000 });
    
    // Actually hit our TTS pipeline using OpenAI
    try {
      const audioRes = await api.generateTTS({ scenes: scriptData.scenes, voice: selectedVoice });
      
      const newScenes = scriptData.scenes.map(s => {
        const match = audioRes.audio_files.find((a: any) => a.scene_number === s.scene_number);
        // Ensure "audio_url" gets bound for LivePreviewPlayer
        return { ...s, audio_url: match ? match.url : null };
      });

      // Update the centralized store with the newly baked audio states
      useVideoStore.getState().setScriptData({ ...scriptData, scenes: newScenes });
      saveProject(project, { ...scriptData, scenes: newScenes });

      setRenderComplete(true);
      toast.success('Sequence Compiled successfully!');
    } catch (err) {
      toast.error('Failed to generate voiceovers. Did you add an OpenAI key?');
    } finally {
      setIsPrepping(false);
    }
  };

  const handleDownloadProjectZip = () => {
    if (!scriptData) return;
    
    const projectData = JSON.stringify(scriptData, null, 2);
    const blob = new Blob([projectData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `project_${project?.niche_id}_assets.json`;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);
    
    toast.success("Project data downloaded. Ready for CapCut!");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Export Video</h1>
        <p className="text-gray-500 mb-6">Preview your fully stitched video sequence directly in the browser.</p>
      </div>

      {renderComplete && scriptData ? (
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Final Video Sequence</h2>
              <p className="text-sm text-gray-500 mt-1 max-w-lg">
                Your video has been stitched together dynamically in the browser! Since we rely on a 100% free local architecture, playback is rendered live rather than as a heavy cloud MP4.
              </p>
            </div>
            <div className="text-sm font-bold text-green-700 bg-green-50 px-4 py-2 rounded-full border border-green-200 shadow-sm shrink-0">
               Live Render Complete
            </div>
          </div>
          
          <div className="mt-6 mb-8 rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/5">
             <LivePreviewPlayer scenes={scriptData.scenes} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <button 
              onClick={async () => {
                 setIsExporting(true);
                 try {
                   await compileAndDownloadVideo(scriptData.scenes, project?.aspect_ratio);
                 } catch (e) {
                   toast.error('Export failed or canceled');
                 } finally {
                   setIsExporting(false);
                 }
              }}
              disabled={isExporting}
              className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors w-full sm:w-auto text-center flex items-center justify-center gap-2"
            >
              {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {isExporting ? 'Encoding...' : 'Download Video'}
            </button>
            <button 
              onClick={() => setShowEditor(true)}
              className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-colors w-full sm:w-auto text-center"
            >
              Video Editor
            </button>
             <button 
              onClick={handleDownloadProjectZip}
              className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-colors w-full sm:w-auto text-center flex items-center justify-center gap-2"
            >
              <PackageOpen className="w-5 h-5" />
              Source Assets
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8">
          <div className="bg-blue-50 border border-blue-100 text-blue-800 rounded-lg p-4 mb-8 text-sm">
             <strong>Note on Rendering:</strong> Deep MP4 encoding requires paid GPU servers. To keep this tool 100% free, we compile your video into an interactive &quot;Live Timeline Player&quot; right in your browser!
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Voice Configuration</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">AI Voice Talent</label>
                <VoiceSelector 
                  voices={voices}
                  selectedId={selectedVoice}
                  onSelect={setSelectedVoice}
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 flex justify-between gap-4">
            <button 
              onClick={() => setStep(7)}
              className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold border border-gray-300 shadow-sm hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              Back
            </button>
            <button 
              onClick={startLocalRender}
              disabled={isPrepping}
              className="w-full py-4 bg-indigo-600 text-white text-base font-semibold rounded-xl shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all flex justify-center items-center gap-2"
            >
              {isPrepping && <Loader2 className="w-5 h-5 animate-spin" />}
              {isPrepping ? 'Compiling Local Timeline...' : 'Preview Live Video Sequence'}
            </button>
          </div>
        </div>
      )}

      {showEditor && (
        <VideoEditor onClose={() => setShowEditor(false)} />
      )}
    </div>
  );
}
