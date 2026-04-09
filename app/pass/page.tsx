'use client';

import { useAppStore } from '@/lib/store';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { Download, Ticket, MapPin, Clock, Calendar } from 'lucide-react';

export default function MyPass() {
  const { bookings, user } = useAppStore();

  const activeBookings = bookings.filter(b => b.status === 'active' && b.userId === user?.id);

  if (activeBookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
          <Ticket className="w-12 h-12 text-text-muted" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No Active Passes</h2>
        <p className="text-text-muted max-w-md">You don't have any active bookings right now. Head over to the resources to book a slot.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Passes</h1>
        <p className="text-text-muted">Your active booking passes and QR codes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {activeBookings.map((booking, i) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel rounded-3xl overflow-hidden border border-white/10 relative group"
          >
            {/* Top Section */}
            <div className="p-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-b border-white/10">
              <div className="flex justify-between items-start mb-4">
                <div className="px-3 py-1 bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                  Active
                </div>
                <span className="text-text-muted text-xs font-mono">{booking.id}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{booking.resourceName}</h3>
              <p className="text-sm text-text-muted flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Main Campus
              </p>
            </div>

            {/* Middle Section: Details */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider">Date</p>
                  <p className="text-white font-medium">{format(new Date(booking.date), 'MMM d, yyyy')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider">Time</p>
                  <p className="text-white font-medium">{booking.timeSlot}</p>
                </div>
              </div>
            </div>

            {/* Bottom Section: QR Code */}
            <div className="p-6 border-t border-white/10 bg-white/5 flex flex-col items-center justify-center">
              <div className="bg-white p-4 rounded-2xl mb-4">
                <QRCodeSVG value={booking.qrCodeData} size={150} />
              </div>
              <p className="text-xs text-text-muted text-center mb-4">Scan this code at the entrance</p>
              
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download Pass
              </button>
            </div>
            
            {/* Decorative cutouts */}
            <div className="absolute left-[-10px] top-[45%] w-5 h-5 rounded-full bg-background border-r border-white/10" />
            <div className="absolute right-[-10px] top-[45%] w-5 h-5 rounded-full bg-background border-l border-white/10" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
