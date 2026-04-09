import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'Student' | 'Faculty' | 'Staff' | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  points: number;
}

export interface Booking {
  id: string;
  resourceId: string;
  resourceType: 'gym' | 'auditorium' | 'labs' | 'equipment' | 'library';
  resourceName: string;
  date: string;
  timeSlot: string;
  status: 'active' | 'completed' | 'cancelled' | 'waitlisted';
  userId: string;
  qrCodeData: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface AppState {
  user: User | null;
  theme: 'dark' | 'light';
  demoMode: boolean;
  persona: Role;
  bookings: Booking[];
  notifications: Notification[];
  login: (user: User) => void;
  logout: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleDemoMode: () => void;
  setPersona: (role: Role) => void;
  addBooking: (booking: Booking) => void;
  cancelBooking: (id: string) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      theme: 'dark',
      demoMode: false,
      persona: 'Student',
      bookings: [],
      notifications: [],
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      setTheme: (theme) => set({ theme }),
      toggleDemoMode: () => set((state) => {
        const newDemoMode = !state.demoMode;
        if (newDemoMode) {
          // Add fake data
          return {
            demoMode: true,
            bookings: [
              {
                id: 'BKG-1234',
                resourceId: 'gym-1',
                resourceType: 'gym',
                resourceName: 'Main Campus Gym',
                date: new Date().toISOString().split('T')[0],
                timeSlot: '18:00 - 19:00',
                status: 'active',
                userId: state.user?.id || 'demo-user',
                qrCodeData: 'BKG-1234-GYM'
              }
            ],
            notifications: [
              {
                id: 'notif-1',
                title: 'Booking Confirmed',
                message: 'Your gym slot is confirmed for today at 18:00.',
                date: new Date().toISOString(),
                read: false
              }
            ]
          };
        } else {
          return { demoMode: false, bookings: [], notifications: [] };
        }
      }),
      setPersona: (persona) => set({ persona }),
      addBooking: (booking) => set((state) => ({ bookings: [...state.bookings, booking] })),
      cancelBooking: (id) => set((state) => ({
        bookings: state.bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b)
      })),
      addNotification: (notification) => set((state) => ({ notifications: [notification, ...state.notifications] })),
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),
      clearNotifications: () => set({ notifications: [] })
    }),
    {
      name: 'smart-campus-storage',
    }
  )
);
