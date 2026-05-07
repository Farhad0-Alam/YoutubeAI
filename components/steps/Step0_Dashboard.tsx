import { motion, AnimatePresence } from 'framer-motion';
import { useVideoStore } from '../../store/videoStore';
import { useHistoryStore } from '../../store/historyStore';
import { 
  Plus, History, Video, ArrowRight, Clock, Trash2, 
  TrendingUp, Activity, Layout, Zap, Search, 
  MoreHorizontal, ChevronRight, Play, Rocket, Terminal, ShieldCheck, Globe
} from 'lucide-react';
import { toast } from 'sonner';

export function Step0_Dashboard() {
  const { resetProject, setStep, setProject, setScriptData } = useVideoStore();
  const { history, deleteProject } = useHistoryStore();

  const handleStartNew = () => {
    resetProject();
    toast.success('Starting a fresh project!');
  };

  const handleResume = (item: any) => {
    setProject(item.project);
    setScriptData(item.scriptData);
    setStep(1);
    toast.info(`Resuming: ${item.project.title}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto space-y-12 pb-20"
    >
      {/* Top Banner / Welcome */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 md:p-12 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider mb-6"
            >
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" /> AI Video Engine Active
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-extrabold font-outfit tracking-tight mb-4 bg-gradient-to-r from-white via-indigo-200 to-white bg-clip-text text-transparent">
              Create the Future of Video.
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Transform your ideas into high-retention cinematic content with the world's most advanced AI video pipeline.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleStartNew}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/25"
              >
                <Plus className="w-5 h-5" /> Start New Project
              </button>
              <div className="relative group">
                <div className="absolute inset-0 bg-white/5 blur-xl group-hover:bg-white/10 transition-colors rounded-full" />
                <button className="relative px-8 py-4 bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all">
                  Browse Templates
                </button>
              </div>
            </div>
          </div>
          <div className="hidden lg:block relative">
             <div className="w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl absolute -inset-4 animate-pulse" />
             <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl w-80">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                   </div>
                   <Activity className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="space-y-4">
                   <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '70%' }} transition={{ duration: 2, delay: 0.5 }} className="h-full bg-indigo-500" />
                   </div>
                   <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} transition={{ duration: 2, delay: 0.7 }} className="h-full bg-emerald-500" />
                   </div>
                   <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '90%' }} transition={{ duration: 2, delay: 0.9 }} className="h-full bg-amber-500" />
                   </div>
                </div>
                <div className="mt-6 flex justify-between items-end">
                   <div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Total Output</div>
                      <div className="text-2xl font-bold text-white tracking-tighter">14,204s</div>
                   </div>
                   <TrendingUp className="w-8 h-8 text-indigo-500/50" />
                </div>
             </div>
          </div>
        </div>
        
        {/* Animated background particles */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
      </motion.div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Drafts', value: history.length, icon: Layout, color: 'text-indigo-500', bg: 'bg-indigo-50' },
          { label: 'Minutes Generated', value: Math.round(history.reduce((a, b) => a + (b.project.duration_minutes || 0), 0)), icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Recent Growth', value: '+12%', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'AI Efficiency', value: '98.4%', icon: Zap, color: 'text-rose-500', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            variants={itemVariants}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-300" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mb-1">{stat.value}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Creative Journey Roadmap */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="flex items-center justify-between">
           <h2 className="text-2xl font-bold text-slate-900 font-outfit flex items-center gap-3">
              <Rocket className="w-6 h-6 text-indigo-600" /> Your Creative Journey
           </h2>
           <p className="text-slate-400 text-xs font-medium">9 Automated Steps to Viral Content</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-4">
           {[
             { step: 1, label: 'Niche', icon: Layout },
             { step: 2, label: 'Hook', icon: Zap },
             { step: 3, label: 'Script', icon: Terminal },
             { step: 4, label: 'Story', icon: Video },
             { step: 5, label: 'Media', icon: Play },
             { step: 6, label: 'Brand', icon: ShieldCheck },
             { step: 7, label: 'Thumb', icon: Star },
             { step: 8, label: 'Render', icon: Activity },
             { step: 9, label: 'Publish', icon: Globe },
           ].map((item, i) => (
             <div key={i} className="group relative">
                <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col items-center text-center hover:border-indigo-200 hover:shadow-lg transition-all cursor-default">
                   <div className="w-8 h-8 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center mb-2 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <item.icon className="w-4 h-4" />
                   </div>
                   <div className="text-[10px] font-black text-slate-900 uppercase tracking-tighter mb-1">Step 0{item.step}</div>
                   <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</div>
                </div>
                {i < 8 && (
                   <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-[1px] bg-slate-100 -translate-y-1/2" />
                )}
             </div>
           ))}
        </div>
      </motion.div>
      {/* Projects Grid Section */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 font-outfit">
             <Video className="w-6 h-6 text-indigo-600" /> Recent Studio Work
          </h2>
          <div className="flex items-center gap-2">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search projects..." className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all w-40 md:w-64" />
             </div>
             <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                <History className="w-5 h-5" />
             </button>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 flex flex-col items-center text-center">
             <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
                <Video className="w-10 h-10 text-slate-200" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">No projects yet</h3>
             <p className="text-slate-400 max-w-sm mb-8">Start your creative journey today. Use our AI to build your first viral masterpiece.</p>
             <button 
                onClick={handleStartNew}
                className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
              >
                Create First Video <ChevronRight className="w-4 h-4" />
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {history.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-indigo-600 rounded-[2rem] translate-y-2 translate-x-2 -z-10 opacity-0 group-hover:opacity-100 transition-all blur-xl" />
                  <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 h-full flex flex-col">
                    {/* Thumbnail Placeholder */}
                    <div className="relative aspect-video bg-slate-900 overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />
                       {/* Abstract placeholder visual */}
                       <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.4),transparent_70%)]" />
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                          <button 
                            onClick={() => handleResume(item)}
                            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl text-indigo-600 transform hover:scale-110 transition-transform"
                          >
                             <Play className="w-5 h-5 fill-indigo-600 ml-0.5" />
                          </button>
                       </div>
                       <div className="absolute bottom-4 left-4 z-20">
                          <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">{item.project.niche_id}</div>
                          <div className="text-sm font-bold text-white truncate max-w-[200px]">{item.project.title || 'Untitled'}</div>
                       </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                       <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                <Activity className="w-3.5 h-3.5 text-slate-400" />
                             </div>
                             <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Duration</div>
                                <div className="text-xs font-bold text-slate-900">{item.project.duration_minutes}m</div>
                             </div>
                          </div>
                          <div className="text-right">
                             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Scenes</div>
                             <div className="text-xs font-bold text-slate-900">{item.scriptData.scenes.length}</div>
                          </div>
                       </div>

                       <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                          <button 
                             onClick={() => handleResume(item)}
                             className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-colors"
                          >
                             Resume Work
                          </button>
                          <button 
                            onClick={() => deleteProject(item.id)}
                            className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

