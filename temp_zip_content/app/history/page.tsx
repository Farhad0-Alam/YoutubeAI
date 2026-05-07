'use client';
import { Video, Calendar, Trash2, Play } from 'lucide-react';
import { useHistoryStore } from '../../store/historyStore';
import { useVideoStore } from '../../store/videoStore';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

export default function HistoryPage() {
  const { history, deleteProject } = useHistoryStore();
  const { setProject, setScriptData, setStep } = useVideoStore();
  const router = useRouter();

  const handleLoadProject = (item: any) => {
    setProject(item.project);
    setScriptData(item.scriptData);
    setStep(7);
    router.push('/');
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-white p-2.5 rounded-xl border border-gray-200 shadow-sm">
          <Video className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Video History</h1>
          <p className="text-gray-500 text-sm mt-1">Past rendered projects and thumbnails</p>
        </div>
      </div>
      
      {history.length === 0 ? (
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-16 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
            <Video className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No videos yet</h3>
          <p className="text-sm text-gray-500">Start your first project in the Studio tab.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                {item.scriptData.scenes[0]?.image_prompt ? (
                  <div className="absolute inset-0 bg-indigo-50 flex flex-col items-center justify-center p-4 text-center">
                     <Video className="w-8 h-8 text-indigo-300 mb-2" />
                     <p className="text-xs text-indigo-600 font-medium line-clamp-3">{item.scriptData.scenes[0].narration}</p>
                  </div>
                ) : (
                  <Video className="w-10 h-10 text-gray-300" />
                )}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-all cursor-pointer group" onClick={() => handleLoadProject(item)}>
                  <div className="bg-white text-gray-900 rounded-full p-3 transform scale-90 group-hover:scale-100 transition-all shadow-lg">
                    <Play className="w-6 h-6 ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-semibold text-gray-900 line-clamp-1 flex-1" title={item.project.topic}>
                    {item.project.title || item.project.topic}
                  </h3>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
                   {item.scriptData.scenes[0]?.narration || 'No description available'}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                  </div>
                  <button 
                    onClick={() => deleteProject(item.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
