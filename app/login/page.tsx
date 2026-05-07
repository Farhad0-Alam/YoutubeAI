'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function LoginPage() {
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Logged in successfully! Redirecting to studio...');
    setTimeout(() => {
      window.location.href = '/studio';
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight font-outfit">YoutubeAI</span>
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-slate-400 text-sm">Enter your credentials to access your studio</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div className="text-right mt-2">
                <a href="#" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">Forgot Password?</a>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              Sign In <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-transparent px-2 text-slate-500 font-bold tracking-widest">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/10 transition-all">
              <Github className="w-4 h-4" /> Github
            </button>
            <button className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/10 transition-all">
              <Chrome className="w-4 h-4" /> Google
            </button>
          </div>

          <p className="text-center mt-8 text-sm text-slate-500">
            Don't have an account? <a href="#" className="text-white font-bold hover:text-indigo-400 transition-colors">Create one free</a>
          </p>

          <div className="mt-8 pt-6 border-t border-white/5">
             <Link href="/dashboard" className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-500 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <Zap className="w-3 h-3" /> Dev Mode: Bypass Login
             </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
