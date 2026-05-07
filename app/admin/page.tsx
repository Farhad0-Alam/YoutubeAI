'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { Overview } from '../../components/admin/Overview';
import { UserManagement } from '../../components/admin/UserManagement';
import { PlanManagement } from '../../components/admin/PlanManagement';
import { 
  ShieldAlert, Settings, HardDrive, Globe, 
  Bell, Search, RefreshCw 
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex bg-[#020617] min-h-screen text-slate-200">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-[1400px] mx-auto space-y-8">
          {/* Admin Navbar (Internal) */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-rose-600/10 rounded-2xl">
                  <ShieldAlert className="w-6 h-6 text-rose-500" />
               </div>
               <div>
                  <h1 className="text-3xl font-black text-white font-outfit tracking-tight capitalize">
                    {activeTab.replace('-', ' ')}
                  </h1>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                    System Control Panel
                  </p>
               </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="text" placeholder="Global search..." className="bg-white/5 border border-white/10 rounded-xl px-10 py-2.5 text-sm text-white focus:ring-2 focus:ring-rose-500 transition-all w-64" />
              </div>
              <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all relative">
                <Bell className="w-5 h-5" />
                <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#020617]" />
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/20">
                <RefreshCw className="w-4 h-4" /> System Sync
              </button>
            </div>
          </div>

          {/* Dynamic Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && <Overview />}
              {activeTab === 'users' && <UserManagement />}
              {activeTab === 'plans' && <PlanManagement />}
              {activeTab === 'settings' && (
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-12 text-center">
                   <Settings className="w-16 h-16 text-slate-700 mx-auto mb-6" />
                   <h2 className="text-2xl font-bold text-white mb-2">Global Settings</h2>
                   <p className="text-slate-500 max-w-md mx-auto mb-8 text-sm">Configure site-wide parameters, maintenance modes, and API orchestrations.</p>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                      <button className="p-6 bg-white/5 border border-white/5 rounded-2xl text-left hover:bg-white/10 transition-all">
                         <div className="font-bold text-white mb-1">Maintenance Mode</div>
                         <div className="text-xs text-slate-500">Toggle site-wide access restriction</div>
                      </button>
                      <button className="p-6 bg-white/5 border border-white/5 rounded-2xl text-left hover:bg-white/10 transition-all">
                         <div className="font-bold text-white mb-1">API Orchestration</div>
                         <div className="text-xs text-slate-500">Manage LLM and Visual model routing</div>
                      </button>
                   </div>
                </div>
              )}
              {activeTab === 'analytics' && (
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-12 text-center">
                   <HardDrive className="w-16 h-16 text-slate-700 mx-auto mb-6" />
                   <h2 className="text-2xl font-bold text-white mb-2">System Analytics</h2>
                   <p className="text-slate-500 max-w-md mx-auto mb-8 text-sm">Real-time data visualizations of traffic, render loads, and server health.</p>
                   <div className="h-64 bg-white/5 rounded-3xl border border-dashed border-white/10 flex items-center justify-center">
                      <div className="text-slate-600 font-bold uppercase tracking-widest text-xs">Analytics Engine Hydrating...</div>
                   </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
