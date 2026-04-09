'use client';

import { useAppStore } from '@/lib/store';
import { format } from 'date-fns';
import { Search, Filter, XCircle } from 'lucide-react';
import { useState } from 'react';

export default function History() {
  const { bookings, user, cancelBooking } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

  const userBookings = bookings.filter(b => b.userId === user?.id);
  const filteredBookings = filter === 'all' ? userBookings : userBookings.filter(b => b.status === filter);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Booking History</h1>
          <p className="text-text-muted">View and manage your past and upcoming bookings.</p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search bookings..." 
              className="w-full bg-background/50 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            {(['all', 'active', 'completed', 'cancelled'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                  filter === f 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-white/5 text-text-muted hover:bg-white/10 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-text-muted bg-white/5">
                <th className="p-4 font-medium">ID</th>
                <th className="p-4 font-medium">Resource</th>
                <th className="p-4 font-medium">Date & Time</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-muted">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                filteredBookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4 font-mono text-sm text-text-muted">{booking.id}</td>
                    <td className="p-4">
                      <p className="text-white font-medium">{booking.resourceName}</p>
                      <p className="text-xs text-text-muted capitalize">{booking.resourceType}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-white text-sm">{format(new Date(booking.date), 'MMM d, yyyy')}</p>
                      <p className="text-xs text-text-muted">{booking.timeSlot}</p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        booking.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        booking.status === 'completed' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {booking.status === 'active' && (
                        <button 
                          onClick={() => cancelBooking(booking.id)}
                          className="p-2 text-text-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="Cancel Booking"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
