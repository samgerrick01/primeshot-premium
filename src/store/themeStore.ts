import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '@/types';
import { THEME } from '@/constants/enums';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: THEME.LIGHT,
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT,
        })),
    }),
    {
      name: 'primeshot-theme',
    },
  ),
);
