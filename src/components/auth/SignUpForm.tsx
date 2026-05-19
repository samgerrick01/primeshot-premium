import { useState } from 'react';
import {
  Mail,
  Lock,
  UserPlus,
  Eye,
  EyeOff,
  User,
  AtSign,
  MapPin,
  Home,
  Road,
  Building2,
  Globe,
  Hash,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface SignUpFormProps {
  onToggleForm: () => void;
}

export function SignUpForm({ onToggleForm }: SignUpFormProps) {
  const { signUp } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstname: '',
    lastname: '',
    nickname: '',
    street: '',
    barangay: '',
    city: '',
    province: '',
    zipcode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    // Build full_address from individual address fields
    const full_address = [
      formData.street,
      formData.barangay,
      formData.city,
      formData.province,
      formData.zipcode,
    ]
      .filter(Boolean)
      .join(', ');

    const { error } = await signUp(formData.email, formData.password, {
      firstname: formData.firstname,
      lastname: formData.lastname,
      nickname: formData.nickname,
      full_address,
      street: formData.street,
      barangay: formData.barangay,
      city: formData.city,
      province: formData.province,
      zipcode: formData.zipcode,
    });

    if (error) {
      setError(error);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="font-serif text-xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
          Check Your Email
        </h3>
        <p className="text-text-secondary dark:text-dark-text-secondary">
          We've sent a confirmation link to{' '}
          <span className="font-medium">{formData.email}</span>. Please check
          your inbox and confirm your email address to complete registration.
        </p>
        <button onClick={onToggleForm} className="btn-primary mt-6">
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Personal Information */}
      <div>
        <h4 className="text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-3 flex items-center gap-2">
          <User className="w-4 h-4" />
          Personal Information
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="signup-firstname"
              className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1.5"
            >
              First Name
            </label>
            <input
              id="signup-firstname"
              type="text"
              value={formData.firstname}
              onChange={(e) => handleChange('firstname', e.target.value)}
              placeholder="Juan"
              required
              className="input-field"
            />
          </div>
          <div>
            <label
              htmlFor="signup-lastname"
              className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1.5"
            >
              Last Name
            </label>
            <input
              id="signup-lastname"
              type="text"
              value={formData.lastname}
              onChange={(e) => handleChange('lastname', e.target.value)}
              placeholder="Dela Cruz"
              required
              className="input-field"
            />
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="signup-nickname"
          className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1.5"
        >
          Nickname
        </label>
        <div className="relative">
          <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted dark:text-dark-text-muted" />
          <input
            id="signup-nickname"
            type="text"
            value={formData.nickname}
            onChange={(e) => handleChange('nickname', e.target.value)}
            placeholder="JD"
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Address Information */}
      <div>
        <h4 className="text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Address Information
        </h4>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="signup-street"
              className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1.5"
            >
              Street / House No.
            </label>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted dark:text-dark-text-muted" />
              <input
                id="signup-street"
                type="text"
                value={formData.street}
                onChange={(e) => handleChange('street', e.target.value)}
                placeholder="123 Rizal St."
                required
                className="input-field pl-10"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="signup-barangay"
              className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1.5"
            >
              Barangay
            </label>
            <div className="relative">
              <Road className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted dark:text-dark-text-muted" />
              <input
                id="signup-barangay"
                type="text"
                value={formData.barangay}
                onChange={(e) => handleChange('barangay', e.target.value)}
                placeholder="Barangay San Jose"
                required
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="signup-city"
                className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1.5"
              >
                City
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted dark:text-dark-text-muted" />
                <input
                  id="signup-city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Manila"
                  required
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="signup-province"
                className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1.5"
              >
                Province
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted dark:text-dark-text-muted" />
                <input
                  id="signup-province"
                  type="text"
                  value={formData.province}
                  onChange={(e) => handleChange('province', e.target.value)}
                  placeholder="Metro Manila"
                  required
                  className="input-field pl-10"
                />
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="signup-zipcode"
              className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1.5"
            >
              ZIP Code
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted dark:text-dark-text-muted" />
              <input
                id="signup-zipcode"
                type="text"
                value={formData.zipcode}
                onChange={(e) => handleChange('zipcode', e.target.value)}
                placeholder="1000"
                required
                className="input-field pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Account Credentials */}
      <div>
        <h4 className="text-sm font-semibold text-text-primary dark:text-dark-text-primary mb-3 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Account Credentials
        </h4>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="signup-email"
              className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1.5"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted dark:text-dark-text-muted" />
              <input
                id="signup-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="you@example.com"
                required
                className="input-field pl-10"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="signup-password"
              className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted dark:text-dark-text-muted" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength={6}
                className="input-field pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-dark-text-muted hover:text-text-primary dark:hover:text-dark-text-primary"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="signup-confirm-password"
              className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1.5"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted dark:text-dark-text-muted" />
              <input
                id="signup-confirm-password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange('confirmPassword', e.target.value)
                }
                placeholder="Repeat your password"
                required
                className="input-field pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            Create Account
          </>
        )}
      </button>

      <p className="text-center text-sm text-text-secondary dark:text-dark-text-secondary">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onToggleForm}
          className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
        >
          Sign In
        </button>
      </p>
    </form>
  );
}
