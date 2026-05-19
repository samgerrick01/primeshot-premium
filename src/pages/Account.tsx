import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Calendar,
  Target,
  MapPin,
  Home,
  Road,
  Building2,
  Globe,
  Hash,
  AtSign,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { PROFILE_FIELDS } from '@/constants/enums';

const iconMap: Record<string, React.ElementType> = {
  User,
  Mail,
  Calendar,
  MapPin,
  Home,
  Road,
  Building2,
  Globe,
  Hash,
  AtSign,
};

export function Account() {
  const { user, loading, initialize } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-surface-tertiary dark:bg-dark-surface-tertiary rounded" />
          <div className="h-4 w-64 bg-surface-tertiary dark:bg-dark-surface-tertiary rounded" />
          <div className="h-32 bg-surface-tertiary dark:bg-dark-surface-tertiary rounded" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const getFieldValue = (key: string) => {
    const value = (user as unknown as Record<string, string | undefined>)[key];
    return value ? String(value) : 'Not set';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="section-title">My Account</h1>
        <p className="section-subtitle mt-1">Manage your profile and orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="card p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name || 'Profile'}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              )}
            </div>
            <h2 className="font-serif text-xl font-bold text-text-primary dark:text-dark-text-primary">
              {user.firstname || user.full_name || 'User'}
            </h2>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">
              {user.email}
            </p>
          </div>
        </div>

        {/* Account Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-text-primary dark:text-dark-text-primary mb-4">
              Personal Information
            </h3>
            <div className="space-y-4">
              {PROFILE_FIELDS.PERSONAL.map((field) => {
                const Icon = iconMap[field.icon];
                return (
                  <div key={field.key} className="flex items-center gap-3">
                    {Icon && (
                      <Icon className="w-5 h-5 text-text-muted dark:text-dark-text-muted" />
                    )}
                    <div>
                      <p className="text-sm text-text-muted dark:text-dark-text-muted">
                        {field.label}
                      </p>
                      <p className="text-text-primary dark:text-dark-text-primary">
                        {getFieldValue(field.key)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-text-muted dark:text-dark-text-muted" />
                <div>
                  <p className="text-sm text-text-muted dark:text-dark-text-muted">
                    Member Since
                  </p>
                  <p className="text-text-primary dark:text-dark-text-primary">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="card p-6">
            <h3 className="font-semibold text-text-primary dark:text-dark-text-primary mb-4">
              Address Information
            </h3>
            <div className="space-y-4">
              {PROFILE_FIELDS.ADDRESS.map((field) => {
                const Icon = iconMap[field.icon];
                return (
                  <div key={field.key} className="flex items-center gap-3">
                    {Icon && (
                      <Icon className="w-5 h-5 text-text-muted dark:text-dark-text-muted" />
                    )}
                    <div>
                      <p className="text-sm text-text-muted dark:text-dark-text-muted">
                        {field.label}
                      </p>
                      <p className="text-text-primary dark:text-dark-text-primary">
                        {getFieldValue(field.key)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="card p-6">
            <h3 className="font-semibold text-text-primary dark:text-dark-text-primary mb-4">
              Recent Orders
            </h3>
            <div className="text-center py-8">
              <Target className="w-12 h-12 mx-auto text-text-muted dark:text-dark-text-muted mb-3" />
              <p className="text-text-secondary dark:text-dark-text-secondary">
                No orders yet
              </p>
              <p className="text-sm text-text-muted dark:text-dark-text-muted mt-1">
                Your order history will appear here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
