'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, CreditCard, Shield, Zap, Rocket, 
  ArrowRight, Video, Download, Settings, 
  ChevronRight, Star, Bell, Search
} from 'lucide-react';
import { useHistoryStore } from '../../store/historyStore';
import Link from 'next/link';

export default function UserDashboard() {
  const { history } = useHistoryStore();

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
      className="p-8 max-w-7xl mx-auto space-y-10"
    >
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-outfit tracking-tight flex items-center gap-3">
             Good morning, Creator <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your studio today.</p>
        </div>
        <div className="flex items-center gap-4">
           <button className="p-2.5 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
           </button>
           <div className="h-10 w-[1px] bg-gray-200 mx-2 hidden md:block" />
           <div className="flex items-center gap-3 bg-white border border-gray-200 p-1.5 rounded-2xl shadow-sm">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">FA</div>
              <div className="hidden sm:block pr-3">
                 <div className="text-xs font-bold text-gray-900">Farhad Alam</div>
                 <div className="text-[10px] text-gray-400 font-medium">Pro Member</div>
              </div>
           </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Plan */}
        <div className="lg:col-span-2 space-y-8">
           {/* Active Plan Card */}
           <motion.div variants={itemVariants} className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                 <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-4">
                       Active Subscription
                    </div>
                    <h2 className="text-3xl font-bold mb-2 font-outfit">Studio Pro Yearly</h2>
                    <p className="text-slate-400 text-sm mb-6">You have 12,500 AI credits remaining for this month.</p>
                    <div className="flex items-center gap-4">
                       <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all flex items-center gap-2">
                          Manage Plan <Settings className="w-4 h-4" />
                       </button>
                       <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all">
                          View Invoice
                       </button>
                    </div>
                 </div>
                 <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                       <svg className="w-full h-full transform -rotate-90">
                          <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                          <motion.circle 
                             cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                             strokeDasharray={364.4}
                             initial={{ strokeDashoffset: 364.4 }}
                             animate={{ strokeDashoffset: 364.4 * 0.3 }}
                             transition={{ duration: 2, ease: "easeOut" }}
                             className="text-indigo-500" 
                          />
                       </svg>
                       <div className="absolute flex flex-col items-center">
                          <span className="text-2xl font-bold">70%</span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase">Left</span>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
           </motion.div>

           {/* Stats Row */}
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Videos Generated', value: history.length, icon: Video, color: 'text-indigo-500' },
                { label: 'Credits Used', value: '4,200', icon: Zap, color: 'text-amber-500' },
                { label: 'Monthly Growth', value: '+14%', icon: Rocket, color: 'text-emerald-500' },
              ].map((stat, i) => (
                <motion.div key={i} variants={itemVariants} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-gray-50 ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                   </div>
                   <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                   <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
           </div>

           {/* Recent Exports */}
           <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-bold text-gray-900 font-outfit">Latest Masterpieces</h3>
                 <Link href="/history" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                    View All <ChevronRight className="w-3 h-3" />
                 </Link>
              </div>
              <div className="space-y-3">
                 {history.slice(0, 3).map((item) => (
                    <div key={item.id} className="group bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-16 h-10 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center text-slate-300">
                             <Video className="w-5 h-5" />
                          </div>
                          <div>
                             <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate max-w-[200px]">
                                {item.project.title || 'Untitled Project'}
                             </h4>
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{item.project.duration_minutes}m • {item.project.niche_id}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                             <Download className="w-4 h-4" />
                          </button>
                          <button className="px-4 py-2 bg-slate-50 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-100 transition-all">
                             Review
                          </button>
                       </div>
                    </div>
                 ))}
                 {history.length === 0 && (
                   <div className="py-12 text-center bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl">
                      <p className="text-gray-400 text-sm font-medium">No videos exported yet.</p>
                      <Link href="/studio" className="text-indigo-600 text-xs font-bold mt-2 inline-block">Create your first video</Link>
                   </div>
                 )}
              </div>
           </motion.div>
        </div>

        {/* Right Column: Quick Start & Tools */}
        <div className="space-y-8">
           {/* Quick Start Studio */}
           <motion.div variants={itemVariants} className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-600/20">
              <h3 className="text-xl font-bold mb-3 font-outfit">Ready to Create?</h3>
              <p className="text-indigo-100 text-xs leading-relaxed mb-6">Launch the AI studio and transform your next big idea into a viral video.</p>
              <Link href="/studio" className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition-all">
                 Launch Studio <ArrowRight className="w-4 h-4" />
              </Link>
           </motion.div>

           {/* Pro Tips / News */}
           <motion.div variants={itemVariants} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 space-y-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 font-outfit">Creator News</h3>
              <div className="space-y-4">
                 {[
                   { title: 'New 4K Rendering Mode', tag: 'UPDATE', date: '2d ago' },
                   { title: 'Optimizing for Shorts Algorithm', tag: 'GUIDE', date: '4d ago' },
                   { title: 'Secret to High CPM Niches', tag: 'PRO TIP', date: '1w ago' },
                 ].map((news, i) => (
                    <div key={i} className="group cursor-pointer">
                       <div className="flex items-center justify-between mb-1">
                          <span className="text-[8px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded tracking-widest uppercase">{news.tag}</span>
                          <span className="text-[10px] text-gray-400">{news.date}</span>
                       </div>
                       <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{news.title}</h4>
                    </div>
                 ))}
              </div>
              <button className="w-full py-3 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all">
                 Browse All Resources
              </button>
           </motion.div>

           {/* Support Card */}
           <motion.div variants={itemVariants} className="bg-emerald-50 rounded-[2.5rem] p-8 border border-emerald-100">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm text-emerald-500">
                 <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-emerald-900 font-outfit">Priority Support</h3>
              <p className="text-emerald-700/70 text-xs mb-6">Need help? Your Pro status gives you 1-hour response times.</p>
              <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors">
                 Open Ticket <ChevronRight className="w-4 h-4" />
              </button>
           </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
