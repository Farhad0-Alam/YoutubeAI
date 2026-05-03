import { useVideoStore } from '../../store/videoStore';
import { Share2, Calendar, Youtube, BarChart2, Globe, Clock, Lock } from 'lucide-react';

export function Step9_PublishSchedule() {
  const { setStep } = useVideoStore();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in duration-500">
      <div className="p-4 sm:p-8 border-b border-gray-100 bg-gradient-to-br from-indigo-50/50 to-white">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 font-display flex items-center gap-2">
          <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
          Publish & Schedule
        </h2>
        <p className="text-sm sm:text-base text-gray-500">Directly publish or schedule your generated video to YouTube and TikTok, fully closing the loop.</p>
      </div>

      <div className="p-8">
        <div className="border border-indigo-100 bg-indigo-50/30 rounded-xl p-8 flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-12">
          <div className="w-16 h-16 bg-white shadow-sm border border-indigo-100 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Enterprise Feature</h3>
          <p className="text-gray-600 mb-8 max-w-md">
            Direct API publishing to YouTube, TikTok, and automated Analytics Repost loops require an enterprise level plan with active OAuth integrations.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
              <Youtube className="w-6 h-6 text-red-500 mb-2" />
              <div className="text-xs font-bold text-gray-800">Direct Publish</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
              <Clock className="w-6 h-6 text-blue-500 mb-2" />
              <div className="text-xs font-bold text-gray-800">Best-time Scheduler</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
              <Globe className="w-6 h-6 text-emerald-500 mb-2" />
              <div className="text-xs font-bold text-gray-800">Multi-Platform</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
              <BarChart2 className="w-6 h-6 text-purple-500 mb-2" />
              <div className="text-xs font-bold text-gray-800">Analytics Loop</div>
            </div>
          </div>
          
          <button 
            disabled
            className="px-6 py-3 bg-gray-200 text-gray-500 font-bold rounded-xl cursor-not-allowed border border-gray-300"
          >
            Upgrade to Enterprise to Unlock
          </button>
        </div>
      </div>

      <div className="p-6 border-t border-gray-200 flex justify-between items-center bg-gray-50/50">
        <button 
          onClick={() => setStep(8)}
          className="px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors"
        >
          Back to Render
        </button>
        <button 
          onClick={() => setStep(1)}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold transition-colors hover:bg-emerald-700 shadow-sm"
        >
          Finish & Start New Project
        </button>
      </div>
    </div>
  );
}
