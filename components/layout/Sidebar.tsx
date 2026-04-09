'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Mic2, 
  FlaskConical, 
  MonitorSpeaker, 
  Library, 
  History, 
  ShieldAlert, 
  Map as MapIcon, 
  Ticket, 
  IdCard 
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { motion } from 'motion/react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Gym', href: '/gym', icon: Dumbbell },
  { name: 'Auditorium', href: '/auditorium', icon: Mic2 },
  { name: 'Labs', href: '/labs', icon: FlaskConical },
  { name: 'Equipment', href: '/equipment', icon: MonitorSpeaker },
  { name: 'Library', href: '/library', icon: Library },
  { name: 'My Pass', href: '/pass', icon: Ticket },
  { name: 'ID Card', href: '/card', icon: IdCard },
  { name: 'History', href: '/history', icon: History },
  { name: 'Campus Map', href: '/map', icon: MapIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAppStore();

  const filteredNavItems = navItems;

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 glass-panel border-r border-border/50 flex flex-col z-40">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <span className="text-white font-bold text-xl">S</span>
        </div>
        <h1 className="text-xl font-bold text-gradient tracking-tight">SmartCampus</h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <span className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative group ${isActive ? 'text-white' : 'text-text-muted hover:text-white'}`}>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-white/10 rounded-xl border border-white/10"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-indigo-400' : 'group-hover:text-indigo-400 transition-colors'}`} />
                <span className="relative z-10 font-medium">{item.name}</span>
              </span>
            </Link>
          );
        })}

        {user?.role === 'Admin' && (
          <Link href="/admin">
            <span className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative group ${pathname === '/admin' ? 'text-white' : 'text-text-muted hover:text-white'}`}>
              {pathname === '/admin' && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-white/10 rounded-xl border border-white/10"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <ShieldAlert className={`w-5 h-5 relative z-10 ${pathname === '/admin' ? 'text-red-400' : 'group-hover:text-red-400 transition-colors'}`} />
              <span className="relative z-10 font-medium">Admin Panel</span>
            </span>
          </Link>
        )}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="glass-panel rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'Guest User'}</p>
            <p className="text-xs text-text-muted truncate">{user?.role || 'Student'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
