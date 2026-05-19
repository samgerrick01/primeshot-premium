import { useState, useCallback } from 'react';
import { Tags, Plus, Trash2, AlertTriangle } from 'lucide-react';
import {
  useCategories,
  useAddCategory,
  useDeleteCategory,
} from '@/hooks/adminQueries';
import { useToast } from '@/components/Toast';

export function AdminCategories() {
  const { data: categories, isLoading } = useCategories();
  const { mutateAsync: addCategory, isPending: isAdding } = useAddCategory();
  const { mutateAsync: deleteCategory, isPending: isDeleting } =
    useDeleteCategory();
  const { showToast } = useToast();
  const [newCategory, setNewCategory] = useState('');
  const [addError, setAddError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const adding = isAdding;
  const deleting = isDeleting;

  const handleAdd = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setAddError(null);

      const name = newCategory.trim();
      if (!name) {
        setAddError('Please enter a category name');
        return;
      }

      // Check if already exists
      if (
        categories?.some((c) => c.name.toLowerCase() === name.toLowerCase())
      ) {
        setAddError('This category already exists');
        return;
      }

      try {
        await addCategory(name);
        setNewCategory('');
        showToast(`Category "${name}" added successfully!`, 'success');
      } catch (err: any) {
        console.error('[AdminCategories] add error:', err);
        const msg = err?.message || 'Failed to add category';
        setAddError(msg);
        showToast(msg, 'error');
      }
    },
    [newCategory, categories, addCategory, showToast],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteConfirm) return;
    try {
      await deleteCategory(deleteConfirm.id);
      showToast(
        `Category "${deleteConfirm.name}" deleted successfully!`,
        'success',
      );
      setDeleteConfirm(null);
    } catch (err: any) {
      console.error('[AdminCategories] delete error:', err);
      const msg = err?.message || 'Failed to delete category';
      showToast(msg, 'error');
      setDeleteConfirm(null);
    }
  }, [deleteConfirm, deleteCategory, showToast]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-text-primary flex items-center gap-3">
          <Tags className="w-6 h-6 text-primary-400" />
          Manage Categories
        </h1>
        <p className="text-dark-text-secondary mt-1">
          Add or remove product categories
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add New Category */}
        <div className="lg:col-span-1">
          <div className="bg-dark-surface-secondary rounded-xl border border-dark-border p-5">
            <h2 className="text-base font-semibold text-dark-text-primary mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary-400" />
              Add New Category
            </h2>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => {
                    setNewCategory(e.target.value);
                    setAddError(null);
                  }}
                  placeholder="e.g., Pellets, Slugs"
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
                    Add Category
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 p-3 rounded-lg bg-dark-surface border border-dark-border">
              <p className="text-xs text-dark-text-muted">
                <strong>Tip:</strong> Categories like "Pellets" and "Slugs" are
                added by default. You can add more categories as needed.
              </p>
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2">
          <div className="bg-dark-surface-secondary rounded-xl border border-dark-border overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (categories ?? []).length === 0 ? (
              <div className="text-center py-12">
                <Tags className="w-10 h-10 text-dark-text-muted mx-auto mb-3" />
                <p className="text-dark-text-secondary">
                  No categories added yet
                </p>
                <p className="text-xs text-dark-text-muted mt-1">
                  Add your first category using the form
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
                        Category Name
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
                    {(categories ?? []).map((c) => (
                      <tr
                        key={c.id}
                        className="border-b border-dark-border/50 hover:bg-dark-surface-tertiary/30 transition-colors"
                      >
                        <td className="py-3 px-4 text-dark-text-muted">
                          {c.id}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-dark-text-primary font-medium">
                            {c.name}
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
                            title="Delete category"
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
                Delete Category
              </h3>
              <p className="text-sm text-dark-text-secondary mt-2">
                Are you sure you want to delete{' '}
                <span className="text-dark-text-primary font-medium">
                  {deleteConfirm.name}
                </span>
                ? This may affect products using this category.
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
