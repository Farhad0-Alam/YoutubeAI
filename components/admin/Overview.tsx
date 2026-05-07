'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, Users, Zap, Activity, 
  ArrowUpRight, ArrowDownRight, Server, 
  Terminal 
} from 'lucide-react';

export function Overview() {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-10">
      {/* Global Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'System MRR', value: '$24,802', growth: '+12.5%', icon: CreditCard, color: 'text-emerald-500', trend: 'up' },
          { label: 'Active Sessions', value: '1,402', growth: '+342', icon: Users, color: 'text-indigo-500', trend: 'up' },
          { label: 'AI API Latency', value: '142ms', growth: '-22ms', icon: Zap, color: 'text-amber-500', trend: 'down' },
          { label: 'Generation Queue', value: '12 / 64', growth: 'Optimal', icon: Activity, color: 'text-rose-500', trend: 'none' },
        ].map((stat, i) => (
          <motion.div key={i} variants={itemVariants} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 hover:bg-white/10 transition-all group relative overflow-hidden">
             <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                   <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-emerald-500/20 text-emerald-500' : stat.trend === 'down' ? 'bg-rose-500/20 text-rose-500' : 'bg-white/5 text-slate-400'}`}>
                   {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : stat.trend === 'down' ? <ArrowDownRight className="w-3 h-3" /> : null}
                   {stat.growth}
                </div>
             </div>
             <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
             <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Infrastructure & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-xl font-bold flex items-center gap-3">
                    <Server className="w-5 h-5 text-rose-500" /> Infra Health
                 </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                 {[
                   { label: 'GPU Cluster-01', value: 42, color: 'text-indigo-500' },
                   { label: 'Storage Node', value: 78, color: 'text-amber-500' },
                   { label: 'RAM Availability', value: 24, color: 'text-rose-500' },
                 ].map((usage, i) => (
                    <div key={i} className="space-y-4">
                       <div className="flex justify-between items-end">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{usage.label}</span>
                          <span className="text-sm font-black text-white">{usage.value}%</span>
                       </div>
                       <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${usage.value}%` }} transition={{ duration: 1.5 }} className={`h-full ${usage.color.replace('text', 'bg')}`} />
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl font-bold flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-emerald-500" /> System Feed
                 </h2>
              </div>
              <div className="space-y-4 font-mono text-[10px]">
                 {[
                   { time: '20:46:12', action: 'Video Render Initiated', status: 'SUCCESS' },
                   { time: '20:45:55', action: 'Subscription Upgrade', status: 'SUCCESS' },
                   { time: '20:45:30', action: 'AI Script Gen Failed', status: 'WARNING' },
                 ].map((log, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                       <span className="text-slate-600">[{log.time}]</span>
                       <span className="flex-1 text-slate-400">{log.action}</span>
                       <span className={`font-black ${log.status === 'SUCCESS' ? 'text-emerald-500' : 'text-amber-500'}`}>{log.status}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
