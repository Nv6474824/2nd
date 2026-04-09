'use client';

import { useAppStore } from '@/lib/store';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'motion/react';
import { Download, ShieldCheck } from 'lucide-react';

export default function IDCard() {
  const { user } = useAppStore();

  if (!user) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">Digital ID Card</h1>
        <p className="text-text-muted">Your official campus identification.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full max-w-sm"
        style={{ perspective: 1000 }}
      >
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/20 shadow-2xl relative">
          {/* Card Header Background */}
          <div className="h-32 bg-gradient-to-br from-indigo-600 to-purple-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-md">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-white font-bold tracking-widest uppercase text-sm">SmartCampus</span>
            </div>
          </div>

          {/* Profile Picture */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2">
            <div className="w-28 h-28 rounded-full border-4 border-[#0f111a] overflow-hidden bg-[#1e1e2d] flex items-center justify-center relative">
              <span className="text-4xl font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
              {user.role === 'Admin' && (
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full border-2 border-[#0f111a] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Card Details */}
          <div className="pt-20 pb-8 px-8 text-center bg-gradient-to-b from-white/5 to-transparent">
            <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
            <div className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              {user.role}
            </div>

            <div className="grid grid-cols-2 gap-4 text-left mb-8">
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">ID Number</p>
                <p className="text-sm text-white font-mono">{user.id.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Valid Until</p>
                <p className="text-sm text-white font-mono">12/2027</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Email</p>
                <p className="text-sm text-white">{user.email}</p>
              </div>
            </div>

            <div className="flex justify-center bg-white p-3 rounded-xl inline-block mx-auto">
              <QRCodeSVG value={`ID-${user.id}-${user.role}`} size={100} />
            </div>
          </div>
        </div>

        <button className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
          <Download className="w-5 h-5" /> Save to Apple Wallet / GPay
        </button>
      </motion.div>
    </div>
  );
}
