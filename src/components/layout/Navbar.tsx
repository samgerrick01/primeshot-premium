import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut, Shield, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { CartIcon } from '@/components/ui/CartIcon';
import { OrdersIcon } from '@/components/ui/OrdersIcon';
import { useAuthStore } from '@/store/authStore';
import { NAV_LINKS, USER_ROLE } from '@/constants/enums';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuthStore();

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 dark:bg-dark-surface/80 backdrop-blur-lg border-b border-border dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/nav_logo.png"
              alt="PrimeShot Premium"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className="btn-ghost text-sm">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <OrdersIcon />
            <CartIcon />

            {user ? (
              <div className="hidden md:flex items-center gap-2">
                {user.role === USER_ROLE.ADMIN && (
                  <Link
                    to="/admin/dashboard"
                    className="btn-ghost p-2 rounded-full"
                    title="Admin Dashboard"
                  >
                    <Shield className="w-5 h-5 text-primary-500" />
                  </Link>
                )}
                <Link to="/account" className="btn-ghost p-2 rounded-full">
                  <User className="w-5 h-5" />
                </Link>
                <button
                  onClick={signOut}
                  className="btn-ghost p-2 rounded-full"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="hidden md:inline-flex btn-primary text-sm"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden btn-ghost p-2 rounded-full"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-border dark:border-dark-border bg-surface dark:bg-dark-surface">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="block btn-ghost w-full text-left"
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-border dark:border-dark-border my-2" />
            {user ? (
              <>
                {user.role === USER_ROLE.ADMIN && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 btn-ghost w-full text-left"
                  >
                    <Shield className="w-4 h-4 text-primary-500" />
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  to="/orders"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 btn-ghost w-full text-left"
                >
                  <ShoppingBag className="w-4 h-4" />
                  My Orders
                </Link>
                <Link
                  to="/account"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 btn-ghost w-full text-left"
                >
                  <User className="w-4 h-4" />
                  My Account
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 btn-ghost w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setIsOpen(false)}
                className="block btn-primary w-full text-center"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
