'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Video, Sparkles, Rocket, Shield, Globe, 
  ArrowRight, Check, Play, Star, Menu, X 
} from 'lucide-react';
import Link from 'next/link';

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-xl font-bold tracking-tight font-outfit">YoutubeAI</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <Link href="/login" className="px-6 py-2.5 bg-white text-black rounded-full font-bold hover:bg-slate-200 transition-all">
              Login Studio
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen Video Production
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black font-outfit leading-[1.1] mb-8 tracking-tight"
          >
            Create Viral Videos <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              In Seconds, Not Hours.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            The all-in-one AI production studio for YouTube creators. Generate scripts, visuals, voiceovers, and edits with a single click.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/login" className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-500 transition-all hover:scale-105 shadow-2xl shadow-indigo-600/25 flex items-center justify-center gap-2">
              Start Building Free <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <Play className="w-5 h-5 fill-white" /> Watch Demo
            </button>
          </motion.div>
        </div>

        {/* Abstract Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] pointer-events-none opacity-20 overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-indigo-600 rounded-full blur-[120px]" />
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px]" />
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-outfit">The Studio in Your Pocket</h2>
            <p className="text-slate-400">Everything you need to dominate the YouTube algorithm.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Big Feature 1 */}
            <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-[2.5rem] p-10 hover:bg-white/[0.07] transition-all group overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
                  <Rocket className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Multi-Step AI Pipeline</h3>
                <p className="text-slate-400 max-w-sm mb-8">From niche research to final export, our automated pipeline handles the heavy lifting while you keep creative control.</p>
                <div className="flex items-center gap-2 text-indigo-400 font-bold group-hover:gap-4 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
            </div>

            {/* Small Feature 1 */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[2.5rem] p-10 shadow-2xl">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Global Reach</h3>
              <p className="text-white/70 text-sm leading-relaxed">Publish to multiple platforms and reach millions with optimized metadata generation.</p>
            </div>

            {/* Small Feature 2 */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 hover:bg-white/[0.07] transition-all">
               <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                  <Video className="w-7 h-7 text-white" />
               </div>
               <h3 className="text-2xl font-bold mb-4">4K Rendering</h3>
               <p className="text-slate-400 text-sm leading-relaxed">High-fidelity exports ready for the big screen. No quality compromises.</p>
            </div>

            {/* Big Feature 2 */}
            <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-[2.5rem] p-10 hover:bg-white/[0.07] transition-all group overflow-hidden relative">
               <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                  <div className="flex-1">
                    <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
                      <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4">Voice Synthesis 2.0</h3>
                    <p className="text-slate-400 max-w-sm">Neural voices that sound human. Choose from hundreds of accents and emotional tones.</p>
                  </div>
                  <div className="w-full md:w-64 bg-white/10 rounded-3xl p-6 border border-white/10">
                     <div className="space-y-4">
                        <div className="h-2 w-full bg-white/10 rounded-full" />
                        <div className="h-2 w-3/4 bg-white/10 rounded-full" />
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-indigo-500 animate-pulse" />
                           <div className="h-2 w-1/2 bg-indigo-500/50 rounded-full" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-12">Trusted by 10,000+ Creators Worldwide</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="text-2xl font-black">YOUTUBE</div>
             <div className="text-2xl font-black">TIKTOK</div>
             <div className="text-2xl font-black">INSTAGRAM</div>
             <div className="text-2xl font-black">REELS</div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-outfit">Choose Your Power</h2>
            <p className="text-slate-400">Scale your production with transparent pricing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plan 1 */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10">
              <h4 className="text-lg font-bold mb-2">Creator</h4>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black">$0</span>
                <span className="text-slate-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-2 text-sm text-slate-400"><Check className="w-4 h-4 text-emerald-500" /> 3 Videos / month</li>
                <li className="flex items-center gap-2 text-sm text-slate-400"><Check className="w-4 h-4 text-emerald-500" /> 720p Rendering</li>
                <li className="flex items-center gap-2 text-sm text-slate-400"><Check className="w-4 h-4 text-emerald-500" /> Standard Voices</li>
              </ul>
              <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all">Get Started</button>
            </div>

            {/* Plan 2 - Popular */}
            <div className="bg-indigo-600 rounded-[2.5rem] p-10 relative scale-105 shadow-2xl shadow-indigo-600/30">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-indigo-600 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-xl">
                Best Value
              </div>
              <h4 className="text-lg font-bold mb-2">Studio Pro</h4>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black">$29</span>
                <span className="text-indigo-200">/mo</span>
              </div>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-2 text-sm text-white/90"><Check className="w-4 h-4 text-white" /> Unlimited Videos</li>
                <li className="flex items-center gap-2 text-sm text-white/90"><Check className="w-4 h-4 text-white" /> 4K Ultra HD Rendering</li>
                <li className="flex items-center gap-2 text-sm text-white/90"><Check className="w-4 h-4 text-white" /> All Premium Voices</li>
                <li className="flex items-center gap-2 text-sm text-white/90"><Check className="w-4 h-4 text-white" /> Custom Branding</li>
              </ul>
              <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-slate-100 transition-all shadow-xl">Start Pro Trial</button>
            </div>

            {/* Plan 3 */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10">
              <h4 className="text-lg font-bold mb-2">Agency</h4>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black">$99</span>
                <span className="text-slate-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-2 text-sm text-slate-400"><Check className="w-4 h-4 text-emerald-500" /> API Access</li>
                <li className="flex items-center gap-2 text-sm text-slate-400"><Check className="w-4 h-4 text-emerald-500" /> Multi-User Studio</li>
                <li className="flex items-center gap-2 text-sm text-slate-400"><Check className="w-4 h-4 text-emerald-500" /> Custom AI Models</li>
              </ul>
              <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="pt-24 pb-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-20">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold mb-4 font-outfit">Ready to go viral?</h2>
              <p className="text-slate-400">Join the thousands of creators scaling with YoutubeAI.</p>
            </div>
            <Link href="/login" className="px-10 py-5 bg-white text-black rounded-2xl font-bold hover:bg-slate-200 transition-all">
              Login Studio
            </Link>
          </div>

          <div className="flex flex-col md:flex-row justify-between border-t border-white/5 pt-12 gap-8">
            <div className="flex items-center gap-2 opacity-50">
               <Zap className="w-5 h-5 text-indigo-500 fill-indigo-500" />
               <span className="font-bold text-sm">YoutubeAI © 2026</span>
            </div>
            <div className="flex gap-8 text-xs font-medium text-slate-500">
               <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 font-bold">Dev Bypass</Link>
               <a href="#" className="hover:text-white">Privacy Policy</a>
               <a href="#" className="hover:text-white">Terms of Service</a>
               <a href="#" className="hover:text-white">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
