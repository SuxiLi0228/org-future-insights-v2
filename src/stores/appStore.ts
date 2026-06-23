import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole } from '@/types';

interface AppState {
  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  resolvedTheme: 'light' | 'dark';

  // User role
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;

  // Read history
  readHistory: string[];
  markAsRead: (id: string) => void;
  isRead: (id: string) => boolean;

  // Favorites
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  // Search
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // Active tags filter
  activeTags: string[];
  toggleTag: (tag: string) => void;
  clearTags: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'system',
      resolvedTheme: 'light',
      setTheme: (theme) => {
        const resolved = theme === 'system'
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : theme;
        document.documentElement.classList.toggle('dark', resolved === 'dark');
        set({ theme, resolvedTheme: resolved });
      },

      // User role
      role: null,
      setRole: (role) => set({ role }),

      // Read history
      readHistory: [],
      markAsRead: (id) => set((s) => ({
        readHistory: s.readHistory.includes(id) ? s.readHistory : [...s.readHistory, id],
      })),
      isRead: (id) => get().readHistory.includes(id),

      // Favorites
      favorites: [],
      toggleFavorite: (id) => set((s) => ({
        favorites: s.favorites.includes(id)
          ? s.favorites.filter((f) => f !== id)
          : [...s.favorites, id],
      })),
      isFavorite: (id) => get().favorites.includes(id),

      // Search
      searchOpen: false,
      setSearchOpen: (open) => set({ searchOpen: open }),

      // Active tags
      activeTags: [],
      toggleTag: (tag) => set((s) => ({
        activeTags: s.activeTags.includes(tag)
          ? s.activeTags.filter((t) => t !== tag)
          : [...s.activeTags, tag],
      })),
      clearTags: () => set({ activeTags: [] }),
    }),
    {
      name: 'hr-insights-store',
      partialize: (state) => ({
        theme: state.theme,
        role: state.role,
        readHistory: state.readHistory,
        favorites: state.favorites,
      }),
    }
  )
);
