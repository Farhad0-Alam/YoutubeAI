import React, { useState } from 'react';
import { useVideoStore } from '../../store/videoStore';
import { toast } from 'sonner';
import { Loader2, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';

export function YouTubeSEOMetadata() {
  const { scriptData, setScriptData, project } = useVideoStore();
  const [isGeneratingComment, setIsGeneratingComment] = useState(false);

  if (!scriptData) return null;

  const handleGeneratePinnedComment = async () => {
    if (!project || !scriptData) return;
    setIsGeneratingComment(true);
    try {
      const fullScript = scriptData.scenes.map(s => s.narration).join(' ');
      const response = await api.generateSEOPackage({
        script: fullScript,
        title: scriptData.title || project.topic,
        niche: project.niche_id,
        llm_model: project.settings?.llm_model
      });
      if (response && response.pinned_comment) {
        setScriptData({ ...scriptData, pinned_comment: response.pinned_comment });
        toast.success('Pinned comment generated!');
      } else {
        toast.error('Failed to generate comment');
      }
    } catch (e: any) {
      toast.error(e.message || 'Error generating comment');
    } finally {
      setIsGeneratingComment(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
          YouTube SEO Metadata
        </h2>
        <button
          onClick={() => {
            const commentStr = scriptData.pinned_comment ? `\n\nPinned Comment:\n${scriptData.pinned_comment}` : '';
            const text = `Title: ${scriptData.title}\n\nDescription:\n${scriptData.description}\n\nTags: ${(scriptData.tags || []).join(', ')}${commentStr}`;
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
          <div className="flex justify-between items-end mb-2">
            <label className="block text-sm font-semibold text-gray-700">Video Title</label>
            <span className={`text-xs font-medium ${(scriptData.title || '').length > 90 ? 'text-orange-500' : 'text-gray-400'}`}>{(scriptData.title || '').length}/100</span>
          </div>
          <input 
            type="text"
            maxLength={100}
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
          <div className="flex justify-between items-end mb-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Video Description & Hashtags</label>
            <span className={`text-xs font-medium ${(scriptData.description || '').length > 900 ? 'text-orange-500' : 'text-gray-400'}`}>{(scriptData.description || '').length}/1000</span>
          </div>
          <textarea 
            maxLength={1000}
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
          <div className="flex justify-between items-end mb-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Tags (Comma Separated)</label>
            {(() => {
                const tagsLen = (scriptData.tags || []).join(', ').length;
                let lenColor = "text-gray-400";
                if (tagsLen > 0 && tagsLen < 450) lenColor = "text-orange-500";
                if (tagsLen > 500) lenColor = "text-red-500";
                if (tagsLen >= 450 && tagsLen <= 500) lenColor = "text-emerald-500";
                return <span className={`text-xs font-medium ${lenColor}`}>{tagsLen}/500</span>;
            })()}
          </div>
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
        <div className="relative group">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Pinned Comment</label>
            <button
              onClick={handleGeneratePinnedComment}
              disabled={isGeneratingComment}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 disabled:opacity-50 transition-colors"
            >
              {isGeneratingComment ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
              {isGeneratingComment ? 'Generating...' : scriptData.pinned_comment ? 'Regenerate' : 'Auto-Generate'}
            </button>
          </div>
          <textarea 
            value={scriptData.pinned_comment || ''}
            onChange={(e) => setScriptData({ ...scriptData, pinned_comment: e.target.value })}
            rows={3}
            className="w-full bg-slate-50 border border-gray-200 rounded-lg pl-4 pr-12 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-colors cursor-text"
            placeholder="Enter a controversial or engaging pinned comment..."
          />
          <button
              onClick={() => {
                navigator.clipboard.writeText(scriptData.pinned_comment || '');
                toast.success('Pinned Comment copied to clipboard!');
              }}
              className="absolute right-3 top-[32px] p-2 text-gray-400 hover:text-gray-600 bg-white border border-gray-200 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              title="Copy Pinned Comment"
          >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
