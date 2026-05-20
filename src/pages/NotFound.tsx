import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, Target } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Target Icon */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-primary-500/20 dark:bg-primary-400/20 rounded-full animate-ping" />
          <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-500 dark:to-primary-700 p-8 rounded-full">
            <Target className="w-20 h-20 text-white" />
          </div>
        </div>

        {/* 404 Text */}
        <h1 className="font-serif text-8xl md:text-9xl font-bold text-primary-600 dark:text-primary-400 mb-4">
          404
        </h1>

        {/* Message */}
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
          Target Not Found
        </h2>
        <p className="text-lg text-text-secondary dark:text-dark-text-secondary mb-8 max-w-md mx-auto">
          Looks like this page missed the mark. The page you're looking for
          doesn't exist or has been moved to a different location.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="btn-primary inline-flex items-center gap-2 w-full sm:w-auto"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            to="/shop"
            className="btn-secondary inline-flex items-center gap-2 w-full sm:w-auto"
          >
            <Search className="w-4 h-4" />
            Browse Products
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-12 pt-8 border-t border-border dark:border-dark-border">
          <p className="text-sm text-text-muted dark:text-dark-text-muted mb-4">
            Need help finding something?
          </p>
          <div className="flex flex-wrap gap-3 justify-center text-sm">
            <Link
              to="/categories"
              className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              View Categories
            </Link>
            <span className="text-text-muted dark:text-dark-text-muted">•</span>
            <Link
              to="/about"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              About Us
            </Link>
            <span className="text-text-muted dark:text-dark-text-muted">•</span>
            <Link
              to="/account"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              My Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
