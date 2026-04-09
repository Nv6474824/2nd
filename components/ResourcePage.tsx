'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { motion } from 'motion/react';
import { Calendar, Clock, Info, CheckCircle2, AlertCircle, Users } from 'lucide-react';
import { format, addDays } from 'date-fns';

interface ResourcePageProps {
  title: string;
  type: 'gym' | 'auditorium' | 'labs' | 'equipment' | 'library';
  description: string;
  image: string;
  capacity: number;
  features: string[];
}

const timeSlots = [
  '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
  '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00',
  '16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00',
];

export default function ResourcePage({ title, type, description, image, capacity, features }: ResourcePageProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const { user, addBooking, addNotification } = useAppStore();

  const dates = Array.from({ length: 7 }).map((_, i) => addDays(new Date(), i));

  const handleBook = () => {
    if (!selectedSlot || !user) return;

    const bookingId = `BKG-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    addBooking({
      id: bookingId,
      resourceId: `${type}-1`,
      resourceType: type,
      resourceName: title,
      date: format(selectedDate, 'yyyy-MM-dd'),
      timeSlot: selectedSlot,
      status: 'active',
      userId: user.id,
      qrCodeData: `${bookingId}-${type.toUpperCase()}`
    });

    addNotification({
      id: `notif-${Date.now()}`,
      title: 'Booking Confirmed',
      message: `Your booking for ${title} on ${format(selectedDate, 'MMM d')} at ${selectedSlot} is confirmed.`,
      date: new Date().toISOString(),
      read: false
    });

    setShowConfirm(true);
    setTimeout(() => setShowConfirm(false), 3000);
    setSelectedSlot(null);
  };

  return (
    <div className="space-y-8">
      {/* Header & Image */}
      <div className="relative h-64 rounded-3xl overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
          <p className="text-text-muted max-w-2xl">{description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Booking */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" /> Select Date
              </h3>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {dates.map((date) => {
                const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`flex flex-col items-center min-w-[80px] p-3 rounded-xl border transition-all ${
                      isSelected 
                        ? 'bg-indigo-500/20 border-indigo-500 text-white' 
                        : 'bg-white/5 border-white/10 text-text-muted hover:bg-white/10'
                    }`}
                  >
                    <span className="text-xs uppercase font-medium">{format(date, 'EEE')}</span>
                    <span className="text-2xl font-bold mt-1">{format(date, 'd')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" /> Available Slots
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400" /> Available</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-400" /> Full</span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {timeSlots.map((slot, i) => {
                // Simulate some slots being full
                const isFull = i === 2 || i === 5;
                const isSelected = selectedSlot === slot;
                
                return (
                  <button
                    key={slot}
                    disabled={isFull}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      isFull 
                        ? 'bg-red-500/5 border-red-500/20 text-red-400/50 cursor-not-allowed' 
                        : isSelected
                          ? 'bg-purple-500/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                          : 'bg-white/5 border-white/10 text-text-muted hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedSlot && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 flex items-center justify-between"
            >
              <div>
                <h4 className="text-white font-medium">Confirm Booking</h4>
                <p className="text-sm text-text-muted">{format(selectedDate, 'MMMM d, yyyy')} • {selectedSlot}</p>
              </div>
              <button 
                onClick={handleBook}
                className="px-6 py-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/25"
              >
                Book Now
              </button>
            </motion.div>
          )}

          {showConfirm && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5" />
              Booking confirmed successfully! Check your notifications.
            </motion.div>
          )}
        </div>

        {/* Right Column: Info */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-400" /> Details
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-text-muted">Capacity</span>
                <span className="text-white font-medium flex items-center gap-2"><Users className="w-4 h-4" /> {capacity} people</span>
              </div>
              <div>
                <span className="text-text-muted block mb-2">Features</span>
                <div className="flex flex-wrap gap-2">
                  {features.map(f => (
                    <span key={f} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-white">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Smart Insights */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl" />
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2 relative z-10">
              <span className="text-xl">🧠</span> Smart Insights
            </h3>
            <p className="text-sm text-text-muted relative z-10">
              This resource is usually busiest between 16:00 and 18:00. Booking early morning slots gives you the best experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
