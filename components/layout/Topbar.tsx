'use client';

import { Bell, Search, Settings, LogOut, User as UserIcon } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';

export default function Topbar() {
  const { user, notifications, logout, demoMode, toggleDemoMode, persona, setPersona } = useAppStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const router = useRouter();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="h-20 glass-panel border-b border-border/50 fixed top-0 right-0 left-64 z-30 flex items-center justify-between px-8">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search resources, bookings, people..." 
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Demo Mode Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted font-medium uppercase tracking-wider">Demo Mode</span>
          <button 
            onClick={toggleDemoMode}
            className={`w-10 h-5 rounded-full relative transition-colors ${demoMode ? 'bg-indigo-500' : 'bg-white/10'}`}
          >
            <motion.div 
              className="w-4 h-4 bg-white rounded-full absolute top-0.5"
              animate={{ left: demoMode ? '22px' : '2px' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        {/* Persona Selector */}
        <div className="flex items-center gap-2 border-l border-white/10 pl-6">
          <span className="text-xs text-text-muted font-medium uppercase tracking-wider">Persona</span>
          <select 
            value={persona}
            onChange={(e) => setPersona(e.target.value as any)}
            className="bg-white/5 border border-white/10 rounded-lg py-1 px-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="Student">Student</option>
            <option value="Faculty">Faculty</option>
            <option value="Staff">Staff</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        {/* Notifications */}
        <div className="relative border-l border-white/10 pl-6">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-white/5 transition-colors"
          >
            <Bell className="w-5 h-5 text-text-muted hover:text-white transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 glass-panel rounded-xl shadow-2xl overflow-hidden border border-white/10"
              >
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                  <h3 className="font-semibold text-white">Notifications</h3>
                  <span className="text-xs text-indigo-400 cursor-pointer hover:text-indigo-300">Mark all as read</span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-text-muted text-sm">No new notifications</div>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif.id} className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${!notif.read ? 'bg-indigo-500/5' : ''}`}>
                        <h4 className={`text-sm font-medium ${!notif.read ? 'text-white' : 'text-text-muted'}`}>{notif.title}</h4>
                        <p className="text-xs text-text-muted mt-1">{notif.message}</p>
                        <span className="text-[10px] text-text-muted mt-2 block">{new Date(notif.date).toLocaleTimeString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="p-2 rounded-full hover:bg-white/5 transition-colors"
          >
            <Settings className="w-5 h-5 text-text-muted hover:text-white transition-colors" />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-48 glass-panel rounded-xl shadow-2xl overflow-hidden border border-white/10 py-2"
              >
                <button className="w-full px-4 py-2 text-left text-sm text-text-muted hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors">
                  <UserIcon className="w-4 h-4" /> Profile
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
