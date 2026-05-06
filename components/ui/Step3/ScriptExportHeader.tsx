import React from 'react';
import { toast } from 'sonner';

interface Scene {
  scene_number?: number;
  duration_seconds?: number;
  narration?: string;
  search_keyword?: string;
  visual_description?: string;
  vfx?: string;
  sound?: string;
  music?: string;
}

interface ScriptExportHeaderProps {
  scriptData: {
    scenes: Scene[];
    total_duration_seconds: number;
  };
  project: any;
  onAddScene: () => void;
}

export function ScriptExportHeader({ scriptData, project, onAddScene }: ScriptExportHeaderProps) {
  const handleCopyNarration = () => {
    const fullNarration = scriptData.scenes
      .filter(scene => scene.narration && scene.narration.trim().length > 0)
      .map(scene => scene.narration!.trim())
      .join('\n\n');
    
    if (fullNarration) {
      navigator.clipboard.writeText(fullNarration);
      toast.success('Full pure narration copied to clipboard!');
    } else {
      toast.error('No narration found to copy.');
    }
  };

  const handleExportStoryboard = () => {
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
    const aiModel = project?.ai_model || 'veo3.1';

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
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-2 gap-4">
      <h2 className="text-lg font-semibold text-gray-900">Scenes List</h2>
      <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full md:w-auto">
        <button
          onClick={handleCopyNarration}
          className="text-sm font-semibold text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
          title="Copy pure narration text for external voice generation"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy Full Narration
        </button>
        <button
          onClick={handleExportStoryboard}
          className="text-sm font-semibold text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors"
          title="Download prompts for external AI generation"
        >
          Export Storyboard
        </button>
        <button
          onClick={onAddScene}
          className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors"
        >
          + Add Scene
        </button>
        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
          {scriptData.scenes.length} Scenes
        </span>
      </div>
    </div>
  );
}
