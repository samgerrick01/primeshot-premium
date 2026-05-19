import { useState, useCallback } from 'react';
import { Weight, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { useGrains, useAddGrain, useDeleteGrain } from '@/hooks/adminQueries';
import { useToast } from '@/components/Toast';

export function AdminGrains() {
  const { data: grains, isLoading } = useGrains();
  const { mutateAsync: addGrain, isPending: isAdding } = useAddGrain();
  const { mutateAsync: deleteGrain, isPending: isDeleting } = useDeleteGrain();
  const { showToast } = useToast();
  const [newGrain, setNewGrain] = useState('');
  const [addError, setAddError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: number;
    value: string;
  } | null>(null);

  const adding = isAdding;
  const deleting = isDeleting;

  const handleAdd = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setAddError(null);

      const value = newGrain.trim();
      if (!value) {
        setAddError('Please enter a grain weight value');
        return;
      }

      // Check if already exists
      if (grains?.some((g) => g.value.toLowerCase() === value.toLowerCase())) {
        setAddError('This grain weight already exists');
        return;
      }

      try {
        await addGrain(value);
        setNewGrain('');
        showToast(`Grain weight "${value}" added successfully!`, 'success');
      } catch (err: any) {
        console.error('[AdminGrains] add error:', err);
        const msg = err?.message || 'Failed to add grain weight';
        setAddError(msg);
        showToast(msg, 'error');
      }
    },
    [newGrain, grains, addGrain, showToast],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteConfirm) return;
    try {
      await deleteGrain(deleteConfirm.id);
      showToast(
        `Grain weight "${deleteConfirm.value}" deleted successfully!`,
        'success',
      );
      setDeleteConfirm(null);
    } catch (err: any) {
      console.error('[AdminGrains] delete error:', err);
      const msg = err?.message || 'Failed to delete grain weight';
      showToast(msg, 'error');
      setDeleteConfirm(null);
    }
  }, [deleteConfirm, deleteGrain, showToast]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-text-primary flex items-center gap-3">
          <Weight className="w-6 h-6 text-primary-400" />
          Manage Grains
        </h1>
        <p className="text-dark-text-secondary mt-1">
          Add or remove grain weight options for product listings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add New Grain */}
        <div className="lg:col-span-1">
          <div className="bg-dark-surface-secondary rounded-xl border border-dark-border p-5">
            <h2 className="text-base font-semibold text-dark-text-primary mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary-400" />
              Add New Grain Weight
            </h2>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <input
                  type="text"
                  value={newGrain}
                  onChange={(e) => {
                    setNewGrain(e.target.value);
                    setAddError(null);
                  }}
                  placeholder="e.g., 16, 18, 20, 25"
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
                    Add Grain
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 p-3 rounded-lg bg-dark-surface border border-dark-border">
              <p className="text-xs text-dark-text-muted">
                <strong>Tip:</strong> Add grain weight values (e.g., 16, 18, 20,
                25 grains). These will appear as a dropdown when adding
                products.
              </p>
            </div>
          </div>
        </div>

        {/* Grains List */}
        <div className="lg:col-span-2">
          <div className="bg-dark-surface-secondary rounded-xl border border-dark-border overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (grains ?? []).length === 0 ? (
              <div className="text-center py-12">
                <Weight className="w-10 h-10 text-dark-text-muted mx-auto mb-3" />
                <p className="text-dark-text-secondary">
                  No grain weights added yet
                </p>
                <p className="text-xs text-dark-text-muted mt-1">
                  Add your first grain weight using the form
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-dark-border bg-dark-surface/50">
                      <th className="text-left py-3 px-4 text-dark-text-muted font-medium text-xs uppercase tracking-wider">
                        ID
                      </th>
                      <th className="text-left py-3 px-4 text-dark-text-muted font-medium text-xs uppercase tracking-wider">
                        Grain Weight
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
                    {(grains ?? []).map((g) => (
                      <tr
                        key={g.id}
                        className="border-b border-dark-border/50 hover:bg-dark-surface-tertiary/30 transition-colors"
                      >
                        <td className="py-3 px-4 text-dark-text-muted">
                          {g.id}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-dark-text-primary font-medium">
                            {g.value} gr
                          </span>
                        </td>
                        <td className="py-3 px-4 text-dark-text-secondary hidden sm:table-cell">
                          {new Date(g.created_at).toLocaleDateString('en-PH', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setDeleteConfirm(g)}
                            className="p-2 rounded-lg text-dark-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete grain weight"
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-surface-secondary rounded-2xl border border-dark-border shadow-2xl w-full max-w-sm p-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-dark-text-primary">
                Delete Grain Weight
              </h3>
              <p className="text-sm text-dark-text-secondary mt-2">
                Are you sure you want to delete{' '}
                <span className="text-dark-text-primary font-medium">
                  {deleteConfirm.value} gr
                </span>
                ? This may affect products using this grain weight.
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
