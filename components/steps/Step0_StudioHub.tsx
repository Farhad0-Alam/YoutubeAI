'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Video, BookOpen, Sparkles, 
  ArrowRight, Clock, Play, Zap, 
  ShieldCheck, HelpCircle, Star, ChevronRight, TrendingUp, Cpu, Search, Layout
} from 'lucide-react';
import { useVideoStore } from '../../store/videoStore';
import { useHistoryStore } from '../../store/historyStore';
import { toast } from 'sonner';

export function Step0_StudioHub() {
  const { resetProject, setStep, setProject, setScriptData } = useVideoStore();
  const { history } = useHistoryStore();

  const handleStartNew = () => {
    resetProject();
    toast.success('Initializing fresh workspace...');
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
      className="max-w-7xl mx-auto space-y-12 pb-24"
    >
      {/* Cinematic Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
        <div>
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] mb-3"
           >
              <Sparkles className="w-4 h-4 fill-indigo-600" /> Creative Headquarters
           </motion.div>
           <h1 className="text-4xl md:text-5xl font-black text-slate-900 font-outfit tracking-tight">Studio Hub</h1>
        </div>
        <p className="text-slate-500 max-w-sm text-sm font-medium leading-relaxed hidden md:block">
           Your all-in-one production environment for generating high-retention AI content.
        </p>
      </div>

      {/* Why Studio Best Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 md:px-0">
        {[
          { title: '10x Faster', desc: 'Go from idea to 4K video in under 5 minutes.', icon: Zap, color: 'text-amber-500' },
          { title: 'Algo-Optimized', desc: 'Scripts designed for maximum retention.', icon: TrendingUp, color: 'text-indigo-500' },
          { title: 'Full Automation', desc: 'No manual editing required.', icon: Cpu, color: 'text-rose-500' },
        ].map((feat, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-white/50 border border-white rounded-[2rem] shadow-sm">
             <div className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 ${feat.color}`}>
                <feat.icon className="w-5 h-5" />
             </div>
             <div>
                <h4 className="text-sm font-bold text-slate-900">{feat.title}</h4>
                <p className="text-[10px] text-slate-400 font-medium">{feat.desc}</p>
             </div>
          </div>
        ))}
      </motion.div>

      {/* Main Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 md:px-0">
        
        {/* Create New Project Card */}
        <motion.div 
          variants={itemVariants}
          onClick={handleStartNew}
          className="lg:col-span-2 group cursor-pointer relative overflow-hidden bg-indigo-600 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 text-white shadow-2xl shadow-indigo-600/20 hover:scale-[1.01] transition-all"
        >
           <div className="relative z-10">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform">
                 <Plus className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 font-outfit">Create New Masterpiece</h2>
              <p className="text-indigo-100 text-sm md:text-lg max-w-md mb-8 md:mb-10 leading-relaxed">
                 Launch the multi-step AI pipeline and transform your vision into a viral video.
              </p>
              <div className="flex items-center gap-3 font-bold group-hover:gap-5 transition-all text-lg md:text-xl">
                 Initialize Studio <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </div>
           </div>
           
           <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-[100px] pointer-events-none" />
        </motion.div>

        {/* Recent Project Quick-Access */}
        <motion.div variants={itemVariants} className="flex flex-col gap-6">
           {history.length > 0 ? (
              <div 
                onClick={() => handleResume(history[0])}
                className="flex-1 bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-8 hover:shadow-xl transition-all cursor-pointer group"
              >
                 <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resume Latest</div>
                    <Clock className="w-4 h-4 text-slate-300" />
                 </div>
                 <div className="aspect-video bg-slate-100 rounded-2xl mb-4 md:mb-6 overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-colors">
                       <Play className="w-10 h-10 text-indigo-600 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100" />
                    </div>
                 </div>
                 <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors truncate">
                    {history[0].project.title || 'Untitled Project'}
                 </h3>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{history[0].project.duration_minutes}m • {history[0].project.niche_id}</p>
              </div>
           ) : (
              <div className="flex-1 bg-slate-50 border border-dashed border-slate-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center">
                 <Video className="w-10 h-10 text-slate-200 mb-4" />
                 <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed">No Recent Projects</p>
              </div>
           )}
        </motion.div>
      </div>

      {/* Strategic Discovery Section */}
      <motion.div variants={itemVariants} className="space-y-6 px-4 md:px-0">
        <div className="flex items-center justify-between">
           <h2 className="text-2xl font-bold text-slate-900 font-outfit flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-indigo-600" /> Strategic Discovery
           </h2>
           <p className="text-slate-400 text-[10px] md:text-xs font-medium italic">SEO Frameworks</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
           {[
             { title: 'Niche Authority', desc: 'High-CPM, low-competition targets.', icon: Layout, color: 'indigo' },
             { step: 'Sub-Niche', desc: 'Micro-target specific viewer interests.', icon: Search, color: 'emerald' },
             { step: 'Brainstorming', desc: 'AI-powered infinite ideation loop.', icon: Sparkles, color: 'amber' },
             { step: 'The Hook', desc: 'Master the critical first 3 seconds.', icon: Zap, color: 'rose' },
             { step: 'The Angle', desc: 'Unique viral perspectives.', icon: TrendingUp, color: 'violet' },
           ].map((strat, i) => {
             const colorMap: any = {
               indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:bg-indigo-600',
               emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-600',
               amber: 'bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-600',
               rose: 'bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-600',
               violet: 'bg-violet-50 text-violet-600 border-violet-100 group-hover:bg-violet-600',
             };
             
             return (
               <div key={i} className="bg-white border border-slate-100 rounded-[2rem] p-5 md:p-6 hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all ${colorMap[strat.color].split('group-hover')[0]} group-hover:scale-110 group-hover:shadow-lg`}>
                     <strat.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-[10px] md:text-xs font-black text-slate-900 uppercase tracking-tighter mb-2 group-hover:text-indigo-600 transition-colors">{strat.title || strat.step}</h4>
                  <p className="text-[9px] md:text-[10px] text-slate-400 font-bold leading-relaxed">{strat.desc}</p>
                  
                  {/* Subtle Background Glow on Hover */}
                  <div className={`absolute -right-4 -bottom-4 w-16 h-16 opacity-0 group-hover:opacity-10 transition-opacity rounded-full blur-2xl ${colorMap[strat.color].split(' ')[0]}`} />
               </div>
             );
           })}
        </div>
      </motion.div>
      {/* Guidelines & Resources Section */}
      <motion.div variants={itemVariants} className="space-y-6 px-4 md:px-0">
        <div className="flex items-center justify-between">
           <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-outfit flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-indigo-600" /> Guidelines
           </h2>
           <button className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:underline">Full Docs</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
           {[
             { title: 'Retention Masterclass', desc: 'Secret strategies for keeping viewers hooked.', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
             { title: 'AI Scripting Protocols', desc: 'How to prompt for natural voice synthesis.', icon: Zap, color: 'text-indigo-500', bg: 'bg-indigo-50' },
             { title: 'Copyright & Safety', desc: 'Legal guidelines for AI-generated assets.', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
             { title: 'Optimization Tips', desc: 'Exporting for maximum algorithm reach.', icon: HelpCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
           ].map((guide, i) => (
             <div key={i} className="bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-lg transition-all cursor-pointer group">
                <div className={`w-10 h-10 rounded-xl ${guide.bg} ${guide.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                   <guide.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{guide.title}</h3>
                <p className="text-[10px] text-slate-400 leading-relaxed">{guide.desc}</p>
             </div>
           ))}
        </div>
      </motion.div>

      {/* Recent Activity Grid */}
      <motion.div variants={itemVariants} className="space-y-6 px-4 md:px-0 pb-10">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-outfit flex items-center gap-3">
           <Clock className="w-6 h-6 text-indigo-600" /> Recent Activity
        </h2>
        
        <div className="bg-white border border-slate-100 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-sm">
           <div className="divide-y divide-slate-50">
              {history.length > 0 ? (
                history.slice(0, 5).map((item) => (
                   <div key={item.id} className="p-4 md:p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => handleResume(item)}>
                      <div className="flex items-center gap-3 md:gap-4">
                         <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            <Video className="w-5 h-5" />
                         </div>
                         <div>
                            <div className="text-xs md:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate max-w-[150px] md:max-w-none">{item.project.title || 'Untitled'}</div>
                            <div className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{item.project.niche_id} • {item.project.duration_minutes}m</div>
                         </div>
                      </div>
                      <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                         <ArrowRight className="w-4 h-4" />
                      </div>
                   </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-400 text-sm font-medium">
                   No recent activity to display.
                </div>
              )}
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
