import { useState, useCallback } from 'react';
import {
  Users,
  Search,
  Shield,
  Ban,
  Trash2,
  Edit3,
  X,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { USER_ROLE } from '@/constants/enums';
import {
  useProfiles,
  useUpdateProfile,
  useDeleteProfile,
  type Profile,
} from '@/hooks/adminQueries';
import { useToast } from '@/components/Toast';

export function AdminUsers() {
  const { data: profiles, isLoading } = useProfiles();
  const { mutateAsync: updateProfile, isPending: isUpdating } =
    useUpdateProfile();
  const { mutateAsync: deleteProfile, isPending: isDeleting } =
    useDeleteProfile();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [editForm, setEditForm] = useState({
    firstname: '',
    lastname: '',
    role: '',
  });
  const [confirmAction, setConfirmAction] = useState<{
    type: 'ban' | 'unban' | 'delete';
    profile: Profile;
  } | null>(null);

  const actionLoading = isUpdating || isDeleting;

  // Stable callback for edit
  const handleEdit = useCallback(async () => {
    if (!editingUser) return;
    try {
      await updateProfile({
        id: editingUser.id,
        updates: {
          firstname: editForm.firstname,
          lastname: editForm.lastname,
          role: editForm.role,
        },
      });
      setEditingUser(null);
      showToast(`User ${editingUser.email} updated successfully!`, 'success');
    } catch (err: any) {
      console.error('[AdminUsers] update error:', err);
      showToast(err?.message || 'Failed to update user', 'error');
    }
  }, [editingUser, editForm, updateProfile, showToast]);

  // Stable callback for ban toggle
  const handleBanToggle = useCallback(async () => {
    if (!confirmAction) return;
    const { profile } = confirmAction;
    const action = profile.banned ? 'unbanned' : 'banned';
    try {
      await updateProfile({
        id: profile.id,
        updates: { banned: !profile.banned },
      });
      setConfirmAction(null);
      showToast(`User ${profile.email} ${action} successfully!`, 'success');
    } catch (err: any) {
      console.error('[AdminUsers] ban/unban error:', err);
      showToast(err?.message || 'Failed to update user', 'error');
    }
  }, [confirmAction, updateProfile, showToast]);

  // Stable callback for delete
  const handleDelete = useCallback(async () => {
    if (!confirmAction) return;
    try {
      await deleteProfile(confirmAction.profile.id);
      setConfirmAction(null);
      showToast(
        `User ${confirmAction.profile.email} deleted successfully!`,
        'success',
      );
    } catch (err: any) {
      console.error('[AdminUsers] delete error:', err);
      showToast(err?.message || 'Failed to delete user', 'error');
    }
  }, [confirmAction, deleteProfile, showToast]);

  const openEdit = useCallback((profile: Profile) => {
    setEditingUser(profile);
    setEditForm({
      firstname: profile.firstname || '',
      lastname: profile.lastname || '',
      role: profile.role || USER_ROLE.USER,
    });
  }, []);

  const filteredProfiles = (profiles ?? []).filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.email?.toLowerCase().includes(term) ||
      p.firstname?.toLowerCase().includes(term) ||
      p.lastname?.toLowerCase().includes(term) ||
      p.uuid?.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-text-primary flex items-center gap-3">
          <Users className="w-6 h-6 text-primary-400" />
          Manage Users
        </h1>
        <p className="text-dark-text-secondary mt-1">
          View, edit, ban, or remove users from the platform
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-text-muted" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, email, or ID..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-dark-border bg-dark-surface text-dark-text-primary placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-dark-surface-secondary rounded-xl border border-dark-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-border bg-dark-surface/50">
                  <th className="text-left py-3 px-4 text-dark-text-muted font-medium text-xs uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-dark-text-muted font-medium text-xs uppercase tracking-wider hidden md:table-cell">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-dark-text-muted font-medium text-xs uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 text-dark-text-muted font-medium text-xs uppercase tracking-wider hidden lg:table-cell">
                    Location
                  </th>
                  <th className="text-right py-3 px-4 text-dark-text-muted font-medium text-xs uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProfiles.map((profile) => (
                  <tr
                    key={profile.id}
                    className="border-b border-dark-border/50 hover:bg-dark-surface-tertiary/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-600/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-primary-400">
                            {(
                              profile.firstname?.[0] ||
                              profile.email?.[0] ||
                              '?'
                            ).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-dark-text-primary font-medium">
                            {profile.firstname && profile.lastname
                              ? `${profile.firstname} ${profile.lastname}`
                              : 'No name set'}
                          </p>
                          <p className="text-xs text-dark-text-muted">
                            ID: {profile.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-dark-text-secondary hidden md:table-cell">
                      {profile.email}
                    </td>
                    <td className="py-3 px-4">
                      {profile.role === USER_ROLE.ADMIN ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-primary-600/20 text-primary-400 border border-primary-500/30">
                          <Shield className="w-3 h-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-dark-surface text-dark-text-secondary border border-dark-border">
                          User
                        </span>
                      )}
                      {profile.banned && (
                        <span className="ml-1.5 text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                          Banned
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-dark-text-secondary hidden lg:table-cell">
                      {profile.city && profile.province
                        ? `${profile.city}, ${profile.province}`
                        : '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(profile)}
                          className="p-2 rounded-lg text-dark-text-muted hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                          title="Edit user"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setConfirmAction({
                              type: profile.banned ? 'unban' : 'ban',
                              profile,
                            })
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            profile.banned
                              ? 'text-green-400 hover:bg-green-500/10'
                              : 'text-dark-text-muted hover:text-orange-400 hover:bg-orange-500/10'
                          }`}
                          title={profile.banned ? 'Unban user' : 'Ban user'}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setConfirmAction({ type: 'delete', profile })
                          }
                          className="p-2 rounded-lg text-dark-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredProfiles.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-10 h-10 text-dark-text-muted mx-auto mb-3" />
              <p className="text-dark-text-secondary">No users found</p>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-surface-secondary rounded-2xl border border-dark-border shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-dark-text-primary flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-primary-400" />
                Edit User
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-dark-text-muted hover:text-dark-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-text-primary mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  value={editForm.firstname}
                  onChange={(e) =>
                    setEditForm({ ...editForm, firstname: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-dark-border bg-dark-surface text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text-primary mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  value={editForm.lastname}
                  onChange={(e) =>
                    setEditForm({ ...editForm, lastname: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-dark-border bg-dark-surface text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text-primary mb-1.5">
                  Role
                </label>
                <select
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm({ ...editForm, role: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-dark-border bg-dark-surface text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                >
                  <option value={USER_ROLE.USER}>User</option>
                  <option value={USER_ROLE.ADMIN}>Admin</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-dark-border text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-surface-tertiary transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Action Modal (Ban/Unban/Delete) */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-surface-secondary rounded-2xl border border-dark-border shadow-2xl w-full max-w-sm p-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-dark-text-primary">
                {confirmAction.type === 'delete'
                  ? 'Delete User'
                  : confirmAction.type === 'ban'
                    ? 'Ban User'
                    : 'Unban User'}
              </h3>
              <p className="text-sm text-dark-text-secondary mt-2">
                {confirmAction.type === 'delete'
                  ? `Are you sure you want to permanently delete ${confirmAction.profile.email}? This action cannot be undone.`
                  : confirmAction.type === 'ban'
                    ? `Are you sure you want to ban ${confirmAction.profile.email}? They will no longer be able to access the platform.`
                    : `Unban ${confirmAction.profile.email}? They will regain access to the platform.`}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 rounded-lg border border-dark-border text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-surface-tertiary transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={
                  confirmAction.type === 'delete'
                    ? handleDelete
                    : handleBanToggle
                }
                disabled={actionLoading}
                className={`flex-1 px-4 py-2.5 rounded-lg text-white font-medium transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2 ${
                  confirmAction.type === 'delete'
                    ? 'bg-red-600 hover:bg-red-700'
                    : confirmAction.type === 'ban'
                      ? 'bg-orange-600 hover:bg-orange-700'
                      : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {actionLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {confirmAction.type === 'delete'
                      ? 'Delete'
                      : confirmAction.type === 'ban'
                        ? 'Ban'
                        : 'Unban'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
