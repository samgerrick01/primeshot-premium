import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useThemeStore } from '@/store/themeStore';
import { THEME } from '@/constants/enums';

export default function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === THEME.DARK);
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-dark-surface text-text-primary dark:text-dark-text-primary transition-colors">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
