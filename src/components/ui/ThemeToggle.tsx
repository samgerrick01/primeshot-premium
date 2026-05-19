import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { THEME } from '@/constants/enums';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="btn-ghost p-2 rounded-full"
      aria-label={`Switch to ${theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT} mode`}
    >
      {theme === THEME.LIGHT ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
}
