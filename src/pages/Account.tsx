import { useEffect, useState } from 'react';
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
  Pencil,
  X,
  Save,
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

type FieldKey =
  | 'firstname'
  | 'lastname'
  | 'nickname'
  | 'street'
  | 'barangay'
  | 'city'
  | 'province'
  | 'zipcode';

interface EditableField {
  key: FieldKey;
  label: string;
  icon: string;
  section: 'personal' | 'address';
  readOnly?: boolean;
}

const EDITABLE_FIELDS: EditableField[] = [
  {
    key: 'firstname',
    label: 'First Name',
    icon: 'User',
    section: 'personal',
    readOnly: true,
  },
  {
    key: 'lastname',
    label: 'Last Name',
    icon: 'User',
    section: 'personal',
    readOnly: true,
  },
  { key: 'nickname', label: 'Nickname', icon: 'AtSign', section: 'personal' },
  { key: 'street', label: 'Street', icon: 'Home', section: 'address' },
  { key: 'barangay', label: 'Barangay', icon: 'Road', section: 'address' },
  { key: 'city', label: 'City', icon: 'Building2', section: 'address' },
  { key: 'province', label: 'Province', icon: 'Globe', section: 'address' },
  { key: 'zipcode', label: 'Zip Code', icon: 'Hash', section: 'address' },
];

export function Account() {
  const { user, loading, updateProfile } = useAuthStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const startEditing = () => {
    if (!user) return;
    const form: Record<string, string> = {};
    EDITABLE_FIELDS.forEach((field) => {
      const val = (user as unknown as Record<string, string | undefined>)[
        field.key
      ];
      form[field.key] = val || '';
    });
    setEditForm(form);
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditForm({});
    setError(null);
    setSuccess(null);
  };

  const handleChange = (key: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const { error: saveError } = await updateProfile({
      nickname: editForm.nickname || '',
      street: editForm.street || '',
      barangay: editForm.barangay || '',
      city: editForm.city || '',
      province: editForm.province || '',
      zipcode: editForm.zipcode || '',
      full_address: [
        editForm.street,
        editForm.barangay,
        editForm.city,
        editForm.province,
        editForm.zipcode,
      ]
        .filter(Boolean)
        .join(', '),
    });

    if (saveError) {
      setError(saveError);
    } else {
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    }
    setIsSaving(false);
  };

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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="section-title">My Account</h1>
          <p className="section-subtitle mt-1">
            Manage your profile and orders
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={startEditing}
            className="btn-secondary flex items-center gap-2"
          >
            <Pencil className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Error / Success Messages */}
      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-sm text-green-600 dark:text-green-400">
          {success}
        </div>
      )}

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
          {/* Personal Information */}
          <div className="card p-6">
            <h3 className="font-semibold text-text-primary dark:text-dark-text-primary mb-4">
              Personal Information
            </h3>
            <div className="space-y-4">
              {PROFILE_FIELDS.PERSONAL.map((field) => {
                if (isEditing && field.key === 'email') {
                  // Email not editable, but still show it
                  const Icon = iconMap[field.icon];
                  return (
                    <div key={field.key} className="flex items-center gap-3">
                      {Icon && (
                        <Icon className="w-5 h-5 text-text-muted dark:text-dark-text-muted" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm text-text-muted dark:text-dark-text-muted">
                          {field.label}
                        </p>
                        <p className="text-text-primary dark:text-dark-text-primary">
                          {getFieldValue(field.key)}
                        </p>
                      </div>
                    </div>
                  );
                }
                if (!isEditing) {
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
                }
                return null;
              })}
              {isEditing && (
                <>
                  {EDITABLE_FIELDS.filter((f) => f.section === 'personal').map(
                    (field) => {
                      const Icon = iconMap[field.icon];
                      return (
                        <div
                          key={field.key}
                          className="flex items-center gap-3"
                        >
                          {Icon && (
                            <Icon className="w-5 h-5 text-text-muted dark:text-dark-text-muted shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm text-text-muted dark:text-dark-text-muted mb-1">
                              {field.label}
                            </p>
                            <input
                              type="text"
                              value={editForm[field.key] || ''}
                              onChange={(e) => {
                                if (!field.readOnly) {
                                  handleChange(field.key, e.target.value);
                                }
                              }}
                              disabled={field.readOnly}
                              className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
                                field.readOnly
                                  ? 'border-surface-tertiary dark:border-dark-surface-tertiary bg-surface-tertiary/50 dark:bg-dark-surface-tertiary/50 text-text-muted dark:text-dark-text-muted cursor-not-allowed'
                                  : 'input-field'
                              }`}
                            />
                          </div>
                        </div>
                      );
                    },
                  )}
                </>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-text-muted dark:text-dark-text-muted shrink-0" />
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
            {!isEditing ? (
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
            ) : (
              <div className="space-y-4">
                {EDITABLE_FIELDS.filter((f) => f.section === 'address').map(
                  (field) => {
                    const Icon = iconMap[field.icon];
                    return (
                      <div key={field.key} className="flex items-center gap-3">
                        {Icon && (
                          <Icon className="w-5 h-5 text-text-muted dark:text-dark-text-muted shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm text-text-muted dark:text-dark-text-muted mb-1">
                            {field.label}
                          </p>
                          <input
                            type="text"
                            value={editForm[field.key] || ''}
                            onChange={(e) =>
                              handleChange(field.key, e.target.value)
                            }
                            className="input-field w-full"
                          />
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            )}
          </div>

          {/* Edit/Save Actions */}
          {isEditing && (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary flex items-center gap-2"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
              <button
                onClick={cancelEditing}
                disabled={isSaving}
                className="btn-secondary flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}

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
