'use client';

import { motion } from 'motion/react';
import { MapPin, Navigation, Building2, Coffee, BookOpen } from 'lucide-react';

export default function CampusMap() {
  return (
    <div className="space-y-8 h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Campus Map</h1>
        <p className="text-text-muted">Interactive map to find resources and navigate the campus.</p>
      </div>

      <div className="flex-1 glass-panel rounded-3xl border border-white/5 overflow-hidden relative flex">
        {/* Sidebar */}
        <div className="w-80 border-r border-white/5 bg-background/50 p-6 flex flex-col gap-6">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search locations..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Quick Filters</h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-medium border border-indigo-500/30 flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> Study Spaces
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-white/5 text-text-muted text-xs font-medium border border-white/10 hover:bg-white/10 flex items-center gap-1">
                <Building2 className="w-3 h-3" /> Labs
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-white/5 text-text-muted text-xs font-medium border border-white/10 hover:bg-white/10 flex items-center gap-1">
                <Coffee className="w-3 h-3" /> Cafeteria
              </button>
            </div>

            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mt-6">Popular Locations</h3>
            {[
              { name: 'Central Library', desc: 'Main Study Area', status: 'Busy' },
              { name: 'CS Block A', desc: 'Computer Labs', status: 'Moderate' },
              { name: 'Main Gym', desc: 'Sports Complex', status: 'Quiet' },
            ].map((loc, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-white text-sm font-medium group-hover:text-indigo-400 transition-colors">{loc.name}</h4>
                    <p className="text-xs text-text-muted">{loc.desc}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    loc.status === 'Busy' ? 'bg-red-500/20 text-red-400' :
                    loc.status === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {loc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map Area (Simulated) */}
        <div className="flex-1 relative bg-[#0a0c10] overflow-hidden">
          {/* Grid Background */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />

          {/* Simulated Map Elements */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative w-[600px] h-[400px]">
              {/* Buildings */}
              <div className="absolute top-10 left-10 w-40 h-32 bg-indigo-500/10 border-2 border-indigo-500/30 rounded-lg flex items-center justify-center backdrop-blur-sm group cursor-pointer hover:bg-indigo-500/20 transition-all">
                <span className="text-indigo-400 font-bold">Library</span>
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold animate-pulse">!</div>
              </div>
              
              <div className="absolute bottom-10 right-20 w-48 h-40 bg-purple-500/10 border-2 border-purple-500/30 rounded-lg flex items-center justify-center backdrop-blur-sm group cursor-pointer hover:bg-purple-500/20 transition-all">
                <span className="text-purple-400 font-bold">CS Block</span>
              </div>

              <div className="absolute top-20 right-10 w-32 h-32 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-full flex items-center justify-center backdrop-blur-sm group cursor-pointer hover:bg-emerald-500/20 transition-all">
                <span className="text-emerald-400 font-bold">Gym</span>
              </div>

              {/* Paths */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
                <path d="M 170 100 L 300 100 L 300 250 L 450 250" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" strokeDasharray="8 8" />
                <path d="M 300 100 L 450 150" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" strokeDasharray="8 8" />
              </svg>

              {/* User Location */}
              <div className="absolute top-[150px] left-[280px] flex flex-col items-center">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-full animate-ping absolute" />
                <div className="w-4 h-4 bg-indigo-500 rounded-full border-2 border-white relative z-10 shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
                <div className="bg-white text-background text-[10px] font-bold px-2 py-1 rounded mt-1 relative z-10">You</div>
              </div>
            </div>
          </motion.div>

          {/* Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2">
            <button className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center text-white transition-colors">
              +
            </button>
            <button className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center text-white transition-colors">
              -
            </button>
            <button className="w-10 h-10 bg-indigo-500 hover:bg-indigo-400 rounded-xl flex items-center justify-center text-white transition-colors mt-2 shadow-lg shadow-indigo-500/25">
              <Navigation className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
