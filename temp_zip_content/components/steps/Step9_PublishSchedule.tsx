import React from 'react';
import { usePublishLogic } from '../../hooks/usePublishLogic';
import { PublishEnterpriseLock } from '../ui/Step9/PublishEnterpriseLock';
import { Share2 } from 'lucide-react';

export function Step9_PublishSchedule() {
  const { setStep, handleFinishProject } = usePublishLogic();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in duration-500">
      <div className="p-4 sm:p-8 border-b border-gray-100 bg-gradient-to-br from-indigo-50/50 to-white">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 font-display flex items-center gap-2">
          <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
          Publish & Schedule
        </h2>
        <p className="text-sm sm:text-base text-gray-500">Directly publish or schedule your generated video to YouTube and TikTok, fully closing the loop.</p>
      </div>

      <PublishEnterpriseLock />

      <div className="p-6 border-t border-gray-200 flex justify-between items-center bg-gray-50/50">
        <button 
          onClick={() => setStep(8)}
          className="px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors"
        >
          Back to Render
        </button>
        <button 
          onClick={handleFinishProject}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold transition-colors hover:bg-emerald-700 shadow-sm"
        >
          Finish & Start New Project
        </button>
      </div>
    </div>
  );
}
