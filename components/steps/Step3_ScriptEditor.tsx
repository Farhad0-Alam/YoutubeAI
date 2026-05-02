import { useState } from 'react';
import { useVideoStore } from '../../store/videoStore';
import { SceneCard } from '../ui/SceneCard';
import { toast } from 'sonner';

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

      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
            YouTube SEO Metadata
          </h2>
          <button
            onClick={() => {
              const text = `Title: ${scriptData.title}\n\nDescription:\n${scriptData.description}\n\nTags: ${(scriptData.tags || []).join(', ')}`;
              navigator.clipboard.writeText(text);
              toast.success('SEO Metadata copied to clipboard!');
            }}
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            Copy All Output
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="relative group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Video Title</label>
            <input 
              type="text"
              value={scriptData.title}
              onChange={(e) => setScriptData({ ...scriptData, title: e.target.value })}
              className="w-full bg-slate-50 border border-gray-200 rounded-lg pl-4 pr-12 py-3 text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-colors cursor-text"
              placeholder="Enter video title..."
            />
            <button
               onClick={() => {
                  navigator.clipboard.writeText(scriptData.title || '');
                  toast.success('Title copied to clipboard!');
               }}
               className="absolute right-3 top-[34px] p-2 text-gray-400 hover:text-gray-600 bg-white border border-gray-200 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
               title="Copy Title"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
          </div>
          <div className="relative group">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Video Description & Hashtags</label>
            <textarea 
              value={scriptData.description || ''}
              onChange={(e) => setScriptData({ ...scriptData, description: e.target.value })}
              rows={4}
              className="w-full bg-slate-50 border border-gray-200 rounded-lg pl-4 pr-12 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-colors cursor-text"
              placeholder="Enter video description..."
            />
            <button
               onClick={() => {
                  navigator.clipboard.writeText(scriptData.description || '');
                  toast.success('Description copied to clipboard!');
               }}
               className="absolute right-3 top-[32px] p-2 text-gray-400 hover:text-gray-600 bg-white border border-gray-200 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
               title="Copy Description"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
          </div>
          <div className="relative group">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tags (Comma Separated)</label>
            <input 
              type="text"
              value={(scriptData.tags || []).join(', ')}
              onChange={(e) => setScriptData({ ...scriptData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
              className="w-full bg-slate-50 border border-gray-200 rounded-lg pl-4 pr-12 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-colors cursor-text"
              placeholder="e.g. tutorial, guide, software"
            />
            <button
               onClick={() => {
                  navigator.clipboard.writeText((scriptData.tags || []).join(', '));
                  toast.success('Tags copied to clipboard!');
               }}
               className="absolute right-3 top-[32px] p-2 text-gray-400 hover:text-gray-600 bg-white border border-gray-200 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
               title="Copy Tags"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
          </div>
        </div>
      </div>

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
