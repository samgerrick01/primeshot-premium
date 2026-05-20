import { useState, useCallback } from 'react';
import { Ruler, Plus, Trash2, AlertTriangle } from 'lucide-react';
import {
  useDiameters,
  useAddDiameter,
  useDeleteDiameter,
} from '@/hooks/adminQueries';
import { useToast } from '@/components/Toast';

export function AdminDiameters() {
  const { data: diameters, isLoading } = useDiameters();
  const { mutateAsync: addDiameter, isPending: isAdding } = useAddDiameter();
  const { mutateAsync: deleteDiameter, isPending: isDeleting } =
    useDeleteDiameter();
  const { showToast } = useToast();
  const [newDiameter, setNewDiameter] = useState('');
  const [addError, setAddError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: number;
    value: string;
  } | null>(null);
  const [selectedDiameters, setSelectedDiameters] = useState<Set<number>>(
    new Set(),
  );
  const [deleteMultipleConfirm, setDeleteMultipleConfirm] = useState(false);

  const adding = isAdding;
  const deleting = isDeleting;

  const handleAdd = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setAddError(null);

      const value = newDiameter.trim();
      if (!value) {
        setAddError('Please enter a diameter value');
        return;
      }

      // Check if already exists
      if (
        diameters?.some((d) => d.value.toLowerCase() === value.toLowerCase())
      ) {
        setAddError('This diameter already exists');
        return;
      }

      try {
        await addDiameter(value);
        setNewDiameter('');
        showToast(`Diameter "${value}" added successfully!`, 'success');
      } catch (err: any) {
        console.error('[AdminDiameters] add error:', err);
        const msg = err?.message || 'Failed to add diameter';
        setAddError(msg);
        showToast(msg, 'error');
      }
    },
    [newDiameter, diameters, addDiameter, showToast],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteConfirm) return;
    try {
      await deleteDiameter(deleteConfirm.id);
      showToast(
        `Diameter "${deleteConfirm.value}" deleted successfully!`,
        'success',
      );
      setDeleteConfirm(null);
    } catch (err: any) {
      console.error('[AdminDiameters] delete error:', err);
      const msg = err?.message || 'Failed to delete diameter';
      showToast(msg, 'error');
      setDeleteConfirm(null);
    }
  }, [deleteConfirm, deleteDiameter, showToast]);

  const handleDeleteMultiple = useCallback(async () => {
    if (selectedDiameters.size === 0) return;
    try {
      const deletePromises = Array.from(selectedDiameters).map((id) =>
        deleteDiameter(id),
      );
      await Promise.all(deletePromises);

      showToast(
        `${selectedDiameters.size} diameter${selectedDiameters.size > 1 ? 's' : ''} deleted successfully!`,
        'success',
      );
      setSelectedDiameters(new Set());
      setDeleteMultipleConfirm(false);
    } catch (err: any) {
      const msg = err?.message || 'Failed to delete diameters';
      showToast(msg, 'error');
      setDeleteMultipleConfirm(false);
    }
  }, [selectedDiameters, deleteDiameter, showToast]);

  const toggleSelectDiameter = (id: number) => {
    setSelectedDiameters((prev) => {
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
    if (selectedDiameters.size === (diameters ?? []).length) {
      setSelectedDiameters(new Set());
    } else {
      setSelectedDiameters(new Set((diameters ?? []).map((d) => d.id)));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-text-primary flex items-center gap-3">
            <Ruler className="w-6 h-6 text-primary-400" />
            Manage Diameters
          </h1>
          <p className="text-dark-text-secondary mt-1">
            Add or remove diameter options for product listings
          </p>
        </div>
        {selectedDiameters.size > 0 && (
          <button
            onClick={() => setDeleteMultipleConfirm(true)}
            className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors text-sm flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete ({selectedDiameters.size})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add New Diameter */}
        <div className="lg:col-span-1">
          <div className="bg-dark-surface-secondary rounded-xl border border-dark-border p-5">
            <h2 className="text-base font-semibold text-dark-text-primary mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary-400" />
              Add New Diameter
            </h2>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <input
                  type="text"
                  value={newDiameter}
                  onChange={(e) => {
                    setNewDiameter(e.target.value);
                    setAddError(null);
                  }}
                  placeholder="e.g., 5.52mm, 5.54mm"
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
                    Add Diameter
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 p-3 rounded-lg bg-dark-surface border border-dark-border">
              <p className="text-xs text-dark-text-muted">
                <strong>Tip:</strong> Add diameter values like caliber sizes
                (e.g., 5.52mm, 5.54mm). These will appear as a dropdown when
                adding products.
              </p>
            </div>
          </div>
        </div>

        {/* Diameters List */}
        <div className="lg:col-span-2">
          <div className="bg-dark-surface-secondary rounded-xl border border-dark-border overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (diameters ?? []).length === 0 ? (
              <div className="text-center py-12">
                <Ruler className="w-10 h-10 text-dark-text-muted mx-auto mb-3" />
                <p className="text-dark-text-secondary">
                  No diameters added yet
                </p>
                <p className="text-xs text-dark-text-muted mt-1">
                  Add your first diameter using the form
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
                            selectedDiameters.size ===
                              (diameters ?? []).length &&
                            (diameters ?? []).length > 0
                          }
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded border-dark-border bg-dark-surface text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer"
                        />
                      </th>
                      <th className="text-left py-3 px-4 text-dark-text-muted font-medium text-xs uppercase tracking-wider">
                        ID
                      </th>
                      <th className="text-left py-3 px-4 text-dark-text-muted font-medium text-xs uppercase tracking-wider">
                        Diameter Value
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
                    {(diameters ?? []).map((d) => (
                      <tr
                        key={d.id}
                        className={`border-b border-dark-border/50 hover:bg-dark-surface-tertiary/30 transition-colors ${
                          selectedDiameters.has(d.id) ? 'bg-primary-500/5' : ''
                        }`}
                      >
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={selectedDiameters.has(d.id)}
                            onChange={() => toggleSelectDiameter(d.id)}
                            className="w-4 h-4 rounded border-dark-border bg-dark-surface text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-4 text-dark-text-muted">
                          {d.id}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-dark-text-primary font-medium">
                            {d.value}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-dark-text-secondary hidden sm:table-cell">
                          {new Date(d.created_at).toLocaleDateString('en-PH', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setDeleteConfirm(d)}
                            className="p-2 rounded-lg text-dark-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete diameter"
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
                Delete Multiple Diameters
              </h3>
              <p className="text-sm text-dark-text-secondary mt-2">
                Are you sure you want to delete{' '}
                <span className="text-dark-text-primary font-medium">
                  {selectedDiameters.size} diameter
                  {selectedDiameters.size > 1 ? 's' : ''}
                </span>
                ? This may affect products using these diameters.
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
                Delete Diameter
              </h3>
              <p className="text-sm text-dark-text-secondary mt-2">
                Are you sure you want to delete{' '}
                <span className="text-dark-text-primary font-medium">
                  {deleteConfirm.value}
                </span>
                ? This may affect products using this diameter.
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
