import { useState } from 'react';
import { useVideoStore } from '../../store/videoStore';
import { SceneCard } from '../ui/SceneCard';
import { toast } from 'sonner';
import { YouTubeSEOMetadata } from '../ui/YouTubeSEOMetadata';

export function Step3_ScriptEditor() {
  const { scriptData, updateScene, setStep, project, setScriptData } = useVideoStore();
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  if (!scriptData) return null;



  const handleRegenerateScene = async (index: number) => {
    if (!project) return;
    setIsUpdating(index);
    try {
      toast.success('Scene revised');
    } catch (e) {
      toast.error('Revision failed');
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Review Script</h1>
        <p className="text-gray-500 mb-2">Edit your narration and visuals before generating media.</p>
      </div>

      <div className="space-y-4">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-2 gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Scenes List</h2>
          <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full md:w-auto">
             <button
               onClick={() => {
                 const fullNarration = scriptData.scenes
                   .filter(scene => scene.narration && scene.narration.trim().length > 0)
                   .map(scene => scene.narration.trim())
                   .join('\n\n');
                 if (fullNarration) {
                   navigator.clipboard.writeText(fullNarration);
                   toast.success('Full pure narration copied to clipboard!');
                 } else {
                   toast.error('No narration found to copy.');
                 }
               }}
               className="text-sm font-semibold text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
               title="Copy pure narration text for external voice generation"
             >
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
               Copy Full Narration
             </button>
             <button
               onClick={() => {
                 let markdown = `# VISUAL STORYBOARD PROMPTS\n`;
                 if (project?.ai_model) {
                    markdown += `**Target AI Model:** ${project.ai_model}\n`;
                 }
                 if (project?.aspect_ratio) {
                    markdown += `**Format:** ${project.aspect_ratio}\n`;
                 }
                 markdown += `\n`;
                 
                 let styleStr = 'Cinematic realism, 4K, 60fps, teal-orange grade, high quality';
                 const aspectRatio = project?.aspect_ratio || '16:9';
                 const aiModel = project?.ai_model || 'seedance2.0';

                 if (aiModel === 'seedance2.0') {
                    styleStr += ` --ar ${aspectRatio} --v 2.0`;
                 } else if (aiModel === 'veo3.1') {
                    styleStr = `Highly realistic, cinematic lighting, Veo 3.1 optimization, aspect ratio ${aspectRatio}`;
                 } else if (aiModel === 'kling_v1.5') {
                    styleStr = `Masterpiece, best quality, cinematography, Kling v1.5, aspect ratio ${aspectRatio}`;
                 } else if (aiModel === 'midjourney_v6') {
                    styleStr = `--ar ${aspectRatio} --v 6.0 --style raw`;
                 } else if (aiModel === 'runway_gen3') {
                    styleStr = `Gen-3 Alpha, hyperrealistic, dynamic motion, aspect ratio ${aspectRatio}`;
                 } else if (aiModel === 'sora') {
                    styleStr = `OpenAI Sora, photorealistic, highly detailed, smooth motion, 4k resolution`;
                 } else if (aiModel === 'grok2') {
                    styleStr = `Grok 2.0 rendering, highly cinematic, detailed textures, vivid lighting, ratio ${aspectRatio}`;
                 }

                 scriptData.scenes.forEach((scene) => {
                   markdown += `## Scene ${scene.scene_number || 1} - ${scene.duration_seconds}s\n`;
                   markdown += `**Keyword:** ${scene.search_keyword}\n\n`;
                   markdown += `**VISUAL:**\n${scene.visual_description || ''}\n\n`;
                   markdown += `**VFX LAYERS:**\n${scene.vfx || ''}\n\n`;
                   markdown += `**SOUND DESIGN:**\n${scene.sound || ''}\n\n`;
                   markdown += `**MUSIC:**\n${scene.music || ''}\n\n`;
                   markdown += `**Style:** ${styleStr}\n\n`;
                   markdown += `---\n\n`;
                 });
                 const blob = new Blob([markdown], { type: 'text/markdown' });
                 const url = URL.createObjectURL(blob);
                 const a = document.createElement('a');
                 a.href = url;
                 a.download = 'storyboard_prompts.md';
                 a.click();
                 URL.revokeObjectURL(url);
               }}
               className="text-sm font-semibold text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors"
               title="Download prompts for external AI generation"
             >
               Export Storyboard
             </button>
             <button
               onClick={() => {
                 const newScene = {
                   scene_number: scriptData.scenes.length + 1,
                   duration_seconds: 5,
                   narration: '',
                   text_overlay: '',
                   visual_description: '',
                   search_keyword: '',
                   image_prompt: '',
                   transition: 'none'
                 };
                 setScriptData({
                   ...scriptData,
                   scenes: [...scriptData.scenes, newScene],
                   total_duration_seconds: scriptData.total_duration_seconds + 5
                 });
               }}
               className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors"
             >
               + Add Scene
             </button>
             <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
               {scriptData.scenes.length} Scenes
             </span>
          </div>
        </div>
        
        {scriptData.scenes.map((scene, idx) => (
          <div key={idx} className="relative">
             <div className="absolute -left-2 -top-2 z-10 hidden group-hover:block">
               {/* Could add a drag handle here if needed */}
             </div>
             <SceneCard 
               index={idx}
               scene={scene}
               onUpdate={(data) => updateScene(idx, data)}
               onRegenerate={() => handleRegenerateScene(idx)}
               isRegenerating={isUpdating === idx}
             />
             <div className="absolute right-4 top-4 z-10">
                <button
                   onClick={() => {
                     const updatedScenes = [...scriptData.scenes];
                     updatedScenes.splice(idx, 1);
                     // Re-number remaining scenes
                     updatedScenes.forEach((s, i) => s.scene_number = i + 1);
                     setScriptData({
                       ...scriptData,
                       scenes: updatedScenes,
                       total_duration_seconds: updatedScenes.reduce((acc, s) => acc + (s.duration_seconds || 5), 0)
                     });
                   }}
                   className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-full transition-colors flex items-center justify-center opacity-50 hover:opacity-100"
                   title="Delete Scene"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </button>
             </div>
          </div>
        ))}
      </div>

      <YouTubeSEOMetadata />

      {/* Step 3.5: Voice & Pacing Check */}
      {(() => {
        const totalWords = scriptData.scenes.reduce((acc, s) => acc + (s.narration ? s.narration.trim().split(/\s+/).filter(w => w.length > 0).length : 0), 0);
        const estReadTimeSecs = Math.round(totalWords / 2.5); // 150 wpm
        const totalDurationSecs = scriptData.total_duration_seconds || scriptData.scenes.reduce((acc, s) => acc + (s.duration_seconds || 15), 0);
        const wpm = totalDurationSecs > 0 ? Math.round((totalWords / totalDurationSecs) * 60) : 150;
        
        let pacingStatus = "Perfect Pacing";
        let pacingColor = "text-emerald-600 bg-emerald-50 border-emerald-200";
        if (wpm > 170) { pacingStatus = "Too Fast"; pacingColor = "text-amber-600 bg-amber-50 border-amber-200"; }
        if (wpm < 130) { pacingStatus = "Too Slow"; pacingColor = "text-amber-600 bg-amber-50 border-amber-200"; }

        // Pattern interrupt check (just check if transitions are used)
        const hasInterrupts = scriptData.scenes.some(s => s.transition && s.transition.length > 5);

        return (
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
              Voice & Pacing Check
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Est. Read Time</div>
                <div className="text-xl font-bold text-gray-800">{Math.floor(estReadTimeSecs / 60)}m {estReadTimeSecs % 60}s</div>
                <div className="text-xs text-gray-500 mt-1">vs {Math.floor(totalDurationSecs / 60)}m {totalDurationSecs % 60}s target</div>
              </div>
              <div className={`border rounded-lg p-4 ${pacingColor}`}>
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Speaking Pace</div>
                <div className="text-xl font-bold">{wpm} WPM</div>
                <div className="text-xs mt-1 font-semibold">{pacingStatus}</div>
              </div>
              <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pattern Interrupts</div>
                <div className="text-lg font-bold text-gray-800">{hasInterrupts ? "Active" : "Needs Work"}</div>
                <div className="text-xs text-gray-500 mt-1">Add transitions to keep attention</div>
              </div>
              <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Retention Reminders</div>
                <div className="text-sm font-bold text-gray-800">Check 30s & 60s marks</div>
                <div className="text-[10px] text-gray-500 mt-1">Is there a hook re-engagement?</div>
              </div>
            </div>
          </div>
        );
      })()}

      <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-6 mt-8">
        <button 
          onClick={() => setStep(2)}
          className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold border border-gray-300 shadow-sm hover:bg-gray-200 transition-colors"
        >
          Back
        </button>
        <button 
          onClick={() => setStep(4)}
          className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow-sm hover:bg-indigo-700 transition-colors"
        >
          Approve Script & Continue
        </button>
      </div>
    </div>
  );
}
