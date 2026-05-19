import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Ruler,
  Tags,
  Weight,
  Plus,
  LogOut,
  Home,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { USER_ROLE } from '@/constants/enums';
import { ToastProvider } from '@/components/Toast';

const sidebarLinks = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Orders',
    path: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    label: 'Users',
    path: '/admin/users',
    icon: Users,
  },
  {
    label: 'Products',
    path: '/admin/products',
    icon: Package,
  },
  {
    label: 'Add Product',
    path: '/admin/products/add',
    icon: Plus,
  },
  {
    label: 'Categories',
    path: '/admin/categories',
    icon: Tags,
  },
  {
    label: 'Grains',
    path: '/admin/grains',
    icon: Weight,
  },
  {
    label: 'Diameters',
    path: '/admin/diameters',
    icon: Ruler,
  },
];

export function AdminLayout() {
  const { user, loading, initialize, signOut } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!loading && (!user || user.role !== USER_ROLE.ADMIN)) {
      navigate('/admin');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-dark-surface flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-surface flex">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          bg-dark-surface-secondary border-r border-dark-border
          transition-all duration-300 flex flex-col
          ${sidebarCollapsed ? 'w-16' : 'w-64'}
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-dark-border">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 min-w-[36px] rounded-lg bg-primary-600/20 border border-primary-500/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-400" />
            </div>
            {!sidebarCollapsed && (
              <div className="truncate">
                <h1 className="text-lg font-bold text-dark-text-primary truncate">
                  PrimeShot
                </h1>
                <p className="text-xs text-dark-text-muted -mt-0.5 truncate">
                  Admin Panel
                </p>
              </div>
            )}
          </div>
          {/* Close mobile sidebar */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden text-dark-text-muted hover:text-dark-text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setMobileSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  ${
                    isActive
                      ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                      : 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-surface-tertiary border border-transparent'
                  }
                  ${sidebarCollapsed ? 'justify-center' : ''}
                `}
                title={sidebarCollapsed ? link.label : undefined}
              >
                <link.icon className="w-5 h-5 min-w-[20px]" />
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium truncate">
                    {link.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="px-3 py-4 border-t border-dark-border space-y-1">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-surface-tertiary border border-transparent transition-all duration-200"
          >
            <Home className="w-5 h-5 min-w-[20px]" />
            {!sidebarCollapsed && (
              <span className="text-sm font-medium">View Site</span>
            )}
          </button>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent transition-all duration-200"
          >
            <LogOut className="w-5 h-5 min-w-[20px]" />
            {!sidebarCollapsed && (
              <span className="text-sm font-medium">Sign Out</span>
            )}
          </button>
          {/* Collapse toggle - desktop only */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-dark-text-muted hover:text-dark-text-primary hover:bg-dark-surface-tertiary border border-transparent transition-all duration-200"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5 min-w-[20px]" />
            ) : (
              <ChevronLeft className="w-5 h-5 min-w-[20px]" />
            )}
            {!sidebarCollapsed && (
              <span className="text-sm font-medium">Collapse</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar (mobile only) */}
        <header className="lg:hidden bg-dark-surface-secondary border-b border-dark-border">
          <div className="flex items-center justify-between h-14 px-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="text-dark-text-secondary hover:text-dark-text-primary"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-400" />
              <span className="text-sm font-bold text-dark-text-primary">
                Admin
              </span>
            </div>
            <div className="w-5" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <ToastProvider>
            <Outlet />
          </ToastProvider>
        </main>
      </div>
    </div>
  );
}
