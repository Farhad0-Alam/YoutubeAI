'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Search, MoreVertical, Edit2, Trash2, ShieldCheck, Mail, Calendar } from 'lucide-react';

export function UserManagement() {
  const users = [
    { id: '1', name: 'Farhad Alam', email: 'farhad@example.com', plan: 'Pro Yearly', status: 'Active', joined: '2024-05-01' },
    { id: '2', name: 'Sarah Connor', email: 'sarah@skynet.com', plan: 'Creator', status: 'Active', joined: '2024-05-05' },
    { id: '3', name: 'John Doe', email: 'john@gmail.com', plan: 'Free', status: 'Inactive', joined: '2024-04-20' },
    { id: '4', name: 'Jane Smith', email: 'jane@agency.com', plan: 'Agency', status: 'Active', joined: '2024-05-07' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-white font-outfit">User Directory</h2>
        <div className="flex items-center gap-3">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="text" placeholder="Search by name or email..." className="bg-white/5 border border-white/10 rounded-xl px-10 py-2.5 text-sm text-white focus:ring-2 focus:ring-rose-500 transition-all w-80" />
           </div>
           <button className="px-4 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-500 transition-all">
              Add New User
           </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">User</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Subscription</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Joined Date</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{user.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    user.plan === 'Agency' ? 'bg-purple-500/20 text-purple-400' :
                    user.plan === 'Pro Yearly' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {user.plan}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/40' : 'bg-slate-600'}`} />
                    <span className={`text-xs font-bold ${user.status === 'Active' ? 'text-emerald-500' : 'text-slate-500'}`}>{user.status}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {user.joined}
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all" title="Edit User">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all" title="Delete User">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all" title="Reset Permissions">
                      <ShieldCheck className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
