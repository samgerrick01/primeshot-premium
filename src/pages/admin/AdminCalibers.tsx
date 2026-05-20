import { useState, useCallback } from 'react';
import { Target, Plus, Trash2, AlertTriangle } from 'lucide-react';
import {
  useCalibers,
  useAddCaliber,
  useDeleteCaliber,
} from '@/hooks/adminQueries';
import { useToast } from '@/components/Toast';

export function AdminCalibers() {
  const { data: calibers, isLoading } = useCalibers();
  const { mutateAsync: addCaliber, isPending: isAdding } = useAddCaliber();
  const { mutateAsync: deleteCaliber, isPending: isDeleting } =
    useDeleteCaliber();
  const { showToast } = useToast();
  const [newCaliber, setNewCaliber] = useState('');
  const [addError, setAddError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: number;
    value: string;
  } | null>(null);
  const [selectedCalibers, setSelectedCalibers] = useState<Set<number>>(
    new Set(),
  );
  const [deleteMultipleConfirm, setDeleteMultipleConfirm] = useState(false);

  const adding = isAdding;
  const deleting = isDeleting;

  const handleAdd = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setAddError(null);

      const value = newCaliber.trim();
      if (!value) {
        setAddError('Please enter a caliber value');
        return;
      }

      // Check if already exists
      if (
        calibers?.some((c) => c.value.toLowerCase() === value.toLowerCase())
      ) {
        setAddError('This caliber already exists');
        return;
      }

      try {
        await addCaliber(value);
        setNewCaliber('');
        showToast(`Caliber "${value}" added successfully!`, 'success');
      } catch (err: any) {
        console.error('[AdminCalibers] add error:', err);
        const msg = err?.message || 'Failed to add caliber';
        setAddError(msg);
        showToast(msg, 'error');
      }
    },
    [newCaliber, calibers, addCaliber, showToast],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteConfirm) return;
    try {
      await deleteCaliber(deleteConfirm.id);
      showToast(
        `Caliber "${deleteConfirm.value}" deleted successfully!`,
        'success',
      );
      setDeleteConfirm(null);
    } catch (err: any) {
      console.error('[AdminCalibers] delete error:', err);
      const msg = err?.message || 'Failed to delete caliber';
      showToast(msg, 'error');
      setDeleteConfirm(null);
    }
  }, [deleteConfirm, deleteCaliber, showToast]);

  const handleDeleteMultiple = useCallback(async () => {
    if (selectedCalibers.size === 0) return;
    try {
      const deletePromises = Array.from(selectedCalibers).map((id) =>
        deleteCaliber(id),
      );
      await Promise.all(deletePromises);

      showToast(
        `${selectedCalibers.size} caliber${selectedCalibers.size > 1 ? 's' : ''} deleted successfully!`,
        'success',
      );
      setSelectedCalibers(new Set());
      setDeleteMultipleConfirm(false);
    } catch (err: any) {
      const msg = err?.message || 'Failed to delete calibers';
      showToast(msg, 'error');
      setDeleteMultipleConfirm(false);
    }
  }, [selectedCalibers, deleteCaliber, showToast]);

  const toggleSelectCaliber = (id: number) => {
    setSelectedCalibers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedCalibers.size === (calibers ?? []).length) {
      setSelectedCalibers(new Set());
    } else {
      setSelectedCalibers(new Set((calibers ?? []).map((c) => c.id)));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-text-primary flex items-center gap-3">
            <Target className="w-6 h-6 text-primary-400" />
            Manage Calibers
          </h1>
          <p className="text-dark-text-secondary mt-1">
            Add or remove caliber options for product listings
          </p>
        </div>
        {selectedCalibers.size > 0 && (
          <button
            onClick={() => setDeleteMultipleConfirm(true)}
            className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors text-sm flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete ({selectedCalibers.size})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add New Caliber */}
        <div className="lg:col-span-1">
          <div className="bg-dark-surface-secondary rounded-xl border border-dark-border p-5">
            <h2 className="text-base font-semibold text-dark-text-primary mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary-400" />
              Add New Caliber
            </h2>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <input
                  type="text"
                  value={newCaliber}
                  onChange={(e) => {
                    setNewCaliber(e.target.value);
                    setAddError(null);
                  }}
                  placeholder="e.g., .177, .22, 4.5mm"
                  className="w-full px-4 py-2.5 rounded-lg border border-dark-border bg-dark-surface text-dark-text-primary placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>
              {addError && <p className="text-xs text-red-400">{addError}</p>}
              <button
                type="submit"
                disabled={adding}
                className="w-full px-4 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {adding ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Caliber
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 p-3 rounded-lg bg-dark-surface border border-dark-border">
              <p className="text-xs text-dark-text-muted">
                <strong>Tip:</strong> Add caliber values like .177, .22, .25,
                4.5mm, 5.5mm, etc. These will appear as a dropdown when adding
                products.
              </p>
            </div>
          </div>
        </div>

        {/* Calibers List */}
        <div className="lg:col-span-2">
          <div className="bg-dark-surface-secondary rounded-xl border border-dark-border overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (calibers ?? []).length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-10 h-10 text-dark-text-muted mx-auto mb-3" />
                <p className="text-dark-text-secondary">
                  No calibers added yet
                </p>
                <p className="text-xs text-dark-text-muted mt-1">
                  Add your first caliber using the form
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-dark-border bg-dark-surface/50">
                      <th className="text-center py-3 px-4 text-dark-text-muted font-medium text-xs uppercase tracking-wider w-12">
                        <input
                          type="checkbox"
                          checked={
                            selectedCalibers.size === (calibers ?? []).length &&
                            (calibers ?? []).length > 0
                          }
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded border-dark-border bg-dark-surface text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer"
                        />
                      </th>
                      <th className="text-left py-3 px-4 text-dark-text-muted font-medium text-xs uppercase tracking-wider">
                        ID
                      </th>
                      <th className="text-left py-3 px-4 text-dark-text-muted font-medium text-xs uppercase tracking-wider">
                        Caliber Value
                      </th>
                      <th className="text-left py-3 px-4 text-dark-text-muted font-medium text-xs uppercase tracking-wider hidden sm:table-cell">
                        Added
                      </th>
                      <th className="text-right py-3 px-4 text-dark-text-muted font-medium text-xs uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(calibers ?? []).map((c) => (
                      <tr
                        key={c.id}
                        className={`border-b border-dark-border/50 hover:bg-dark-surface-tertiary/30 transition-colors ${
                          selectedCalibers.has(c.id) ? 'bg-primary-500/5' : ''
                        }`}
                      >
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={selectedCalibers.has(c.id)}
                            onChange={() => toggleSelectCaliber(c.id)}
                            className="w-4 h-4 rounded border-dark-border bg-dark-surface text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-4 text-dark-text-muted">
                          {c.id}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-dark-text-primary font-medium">
                            {c.value}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-dark-text-secondary hidden sm:table-cell">
                          {new Date(c.created_at).toLocaleDateString('en-PH', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setDeleteConfirm(c)}
                            className="p-2 rounded-lg text-dark-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete caliber"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Multiple Confirmation Modal */}
      {deleteMultipleConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-surface-secondary rounded-2xl border border-dark-border shadow-2xl w-full max-w-sm p-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-dark-text-primary">
                Delete Multiple Calibers
              </h3>
              <p className="text-sm text-dark-text-secondary mt-2">
                Are you sure you want to delete{' '}
                <span className="text-dark-text-primary font-medium">
                  {selectedCalibers.size} caliber
                  {selectedCalibers.size > 1 ? 's' : ''}
                </span>
                ? This may affect products using these calibers.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteMultipleConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-lg border border-dark-border text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-surface-tertiary transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMultiple}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Delete All'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Single Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-surface-secondary rounded-2xl border border-dark-border shadow-2xl w-full max-w-sm p-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-dark-text-primary">
                Delete Caliber
              </h3>
              <p className="text-sm text-dark-text-secondary mt-2">
                Are you sure you want to delete{' '}
                <span className="text-dark-text-primary font-medium">
                  {deleteConfirm.value}
                </span>
                ? This may affect products using this caliber.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-lg border border-dark-border text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-surface-tertiary transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
