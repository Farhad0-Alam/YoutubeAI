'use client';
import { BarChart, TrendingUp, Video, Clock } from 'lucide-react';
import { useHistoryStore } from '../../store/historyStore';
import { useMemo } from 'react';

export default function AnalyticsPage() {
  const { history } = useHistoryStore();

  const stats = useMemo(() => {
    let totalMinutes = 0;
    history.forEach(item => {
      totalMinutes += item.project.duration_minutes || 0;
    });

    return {
      totalVideos: history.length,
      totalMinutes: Math.round(totalMinutes),
      avgScenes: history.length > 0 
        ? Math.round(history.reduce((acc, curr) => acc + curr.scriptData.scenes.length, 0) / history.length) 
        : 0
    };
  }, [history]);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-white p-2.5 rounded-xl border border-gray-200 shadow-sm">
          <BarChart className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Studio Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Metrics across all your rendered projects</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 text-gray-500 mb-4">
            <Video className="w-5 h-5 text-indigo-500" />
            <h3 className="font-semibold text-sm">Total Videos Generated</h3>
          </div>
          <p className="text-4xl font-bold text-gray-900">{stats.totalVideos}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 text-gray-500 mb-4">
            <Clock className="w-5 h-5 text-emerald-500" />
            <h3 className="font-semibold text-sm">Total Content Minutes</h3>
          </div>
          <p className="text-4xl font-bold text-gray-900">{stats.totalMinutes}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 text-gray-500 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-sm">Avg Scenes Per Video</h3>
          </div>
          <p className="text-4xl font-bold text-gray-900">{stats.avgScenes}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8">
         <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Projects Activity</h2>
         {history.length === 0 ? (
           <p className="text-gray-500 text-sm">Create some videos to see activity here.</p>
         ) : (
           <div className="space-y-4">
             {history.slice(0, 5).map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.project.title || item.project.topic}</h4>
                    <p className="text-xs text-gray-500 mt-1">{item.scriptData.scenes.length} scenes • {item.project.duration_minutes} min</p>
                  </div>
                  <div className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-md">
                    Completed
                  </div>
                </div>
             ))}
           </div>
         )}
      </div>
    </div>
  );
}
