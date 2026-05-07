'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, CheckCircle2, Zap, Star, Layout } from 'lucide-react';

export function PlanManagement() {
  const plans = [
    { 
      name: 'Creator', 
      price: '0', 
      type: 'FREE',
      features: ['3 Videos / month', '720p Exports', 'Standard Voices'],
      activeUsers: 842,
      color: 'bg-slate-500'
    },
    { 
      name: 'Studio Pro', 
      price: '29', 
      type: 'POPULAR',
      features: ['Unlimited Videos', '4K Ultra HD', 'Premium Voices', 'Custom Branding'],
      activeUsers: 452,
      color: 'bg-rose-600'
    },
    { 
      name: 'Agency', 
      price: '99', 
      type: 'ENTERPRISE',
      features: ['API Access', 'Team Collaboration', 'Custom AI Models', 'Priority Support'],
      activeUsers: 108,
      color: 'bg-purple-600'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white font-outfit">Subscription Engineering</h2>
        <button className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all shadow-xl">
           <Plus className="w-4 h-4" /> Create New Tier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group">
            {plan.type === 'POPULAR' && (
               <div className="absolute top-6 right-6">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
               </div>
            )}
            
            <div className={`w-12 h-12 rounded-2xl ${plan.color} flex items-center justify-center mb-6 shadow-lg shadow-black/20`}>
               <Zap className="w-6 h-6 text-white" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-8">
               <span className="text-3xl font-black text-white">${plan.price}</span>
               <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">/ month</span>
            </div>

            <div className="space-y-4 mb-10">
               {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-3 text-sm text-slate-400">
                     <CheckCircle2 className="w-4 h-4 text-rose-500" />
                     {feature}
                  </div>
               ))}
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
               <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Accounts</div>
                  <div className="text-lg font-bold text-white">{plan.activeUsers}</div>
               </div>
               <div className="flex items-center gap-2">
                  <button className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                     <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all">
                     <Trash2 className="w-4 h-4" />
                  </button>
               </div>
            </div>

            {/* Background design */}
            <div className={`absolute -right-10 -bottom-10 w-40 h-40 ${plan.color} opacity-[0.03] rounded-full blur-3xl`} />
          </div>
        ))}
      </div>
    </div>
  );
}
