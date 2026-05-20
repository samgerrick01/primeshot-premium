import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Target, Shield } from 'lucide-react';
import { SignInForm } from '@/components/auth/SignInForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { useAuthStore } from '@/store/authStore';

export function Auth() {
  const [isSignIn, setIsSignIn] = useState(true);
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-600 dark:border-primary-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Target className="w-12 h-12 mx-auto text-primary-600 dark:text-primary-400 mb-4" />
            <h1 className="font-serif text-2xl font-bold text-text-primary dark:text-dark-text-primary">
              {isSignIn ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-text-secondary dark:text-dark-text-secondary mt-2">
              {isSignIn
                ? 'Sign in to your PrimeShot account'
                : 'Join PrimeShot Premium today'}
            </p>
          </div>

          {/* Form */}
          {isSignIn ? (
            <SignInForm onToggleForm={() => setIsSignIn(false)} />
          ) : (
            <SignUpForm onToggleForm={() => setIsSignIn(true)} />
          )}

          {/* Admin Sign In Link */}
          {isSignIn && (
            <div className="mt-6 pt-6 border-t border-border dark:border-dark-border">
              <Link
                to="/admin"
                className="flex items-center justify-center gap-2 text-sm text-text-secondary dark:text-dark-text-secondary hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <Shield className="w-4 h-4" />
                Admin Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
