import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-surface-primary dark:bg-dark-surface-primary">
          <div className="max-w-2xl w-full text-center">
            {/* Error Icon */}
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-red-500/20 dark:bg-red-400/20 rounded-full animate-pulse" />
              <div className="relative bg-gradient-to-br from-red-600 to-red-800 dark:from-red-500 dark:to-red-700 p-8 rounded-full">
                <AlertTriangle className="w-20 h-20 text-white" />
              </div>
            </div>

            {/* Error Message */}
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
              Oops! Something Went Wrong
            </h1>
            <p className="text-lg text-text-secondary dark:text-dark-text-secondary mb-8 max-w-md mx-auto">
              We encountered an unexpected error. Don't worry, our team has been
              notified and we're working on fixing it.
            </p>

            {/* Error Details (Development) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-left max-w-xl mx-auto">
                <p className="text-sm font-mono text-red-800 dark:text-red-200 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={this.handleReset}
                className="btn-primary inline-flex items-center gap-2 w-full sm:w-auto"
              >
                <Home className="w-4 h-4" />
                Go to Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary inline-flex items-center gap-2 w-full sm:w-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
            </div>

            {/* Additional Help */}
            <div className="mt-12 pt-8 border-t border-border dark:border-dark-border">
              <p className="text-sm text-text-muted dark:text-dark-text-muted mb-4">
                If the problem persists, please contact support
              </p>
              <div className="flex flex-wrap gap-3 justify-center text-sm">
                <Link
                  to="/shop"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Browse Products
                </Link>
                <span className="text-text-muted dark:text-dark-text-muted">
                  •
                </span>
                <Link
                  to="/about"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  About Us
                </Link>
                <span className="text-text-muted dark:text-dark-text-muted">
                  •
                </span>
                <a
                  href="mailto:desilva.sam17.sgds@gmail.com"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
