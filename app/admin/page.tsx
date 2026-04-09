'use client';

import { useAppStore } from '@/lib/store';
import { motion } from 'motion/react';
import { Users, AlertTriangle, CheckCircle, XCircle, BarChart2 } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPanel() {
  const { user, bookings } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== 'Admin') {
      router.push('/');
    }
  }, [user, router]);

  if (!user || user.role !== 'Admin') return null;

  const activeBookings = bookings.filter(b => b.status === 'active');
  const todayBookings = bookings.filter(b => b.date === format(new Date(), 'yyyy-MM-dd'));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-text-muted">System overview and resource management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-indigo-500/10 to-transparent">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-500/20 rounded-xl">
              <BarChart2 className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-text-muted">Total Bookings Today</p>
              <h3 className="text-2xl font-bold text-white">{todayBookings.length}</h3>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-emerald-500/10 to-transparent">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-text-muted">Active Passes</p>
              <h3 className="text-2xl font-bold text-white">{activeBookings.length}</h3>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-red-500/10 to-transparent">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-500/20 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-text-muted">Reported Issues</p>
              <h3 className="text-2xl font-bold text-white">2</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h3 className="text-lg font-semibold text-white">Recent Bookings</h3>
          </div>
          <div className="divide-y divide-white/5">
            {bookings.slice(0, 5).map(booking => (
              <div key={booking.id} className="p-4 hover:bg-white/5 transition-colors flex justify-between items-center">
                <div>
                  <p className="text-white font-medium">{booking.resourceName}</p>
                  <p className="text-xs text-text-muted">{booking.userId} • {format(new Date(booking.date), 'MMM d')} at {booking.timeSlot}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                  booking.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                  booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {booking.status}
                </span>
              </div>
            ))}
            {bookings.length === 0 && (
              <div className="p-8 text-center text-text-muted">No bookings in the system.</div>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="glass-panel rounded-2xl border border-white/5 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">System Status</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-text-muted">Server Load</span>
                <span className="text-emerald-400">Normal (24%)</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[24%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-text-muted">Database Storage</span>
                <span className="text-yellow-400">Warning (82%)</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 w-[82%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-text-muted">API Rate Limit</span>
                <span className="text-emerald-400">Healthy (12%)</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[12%]" />
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <button className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-colors border border-red-500/20 flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Broadcast Emergency Alert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
