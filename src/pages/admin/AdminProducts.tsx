import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Plus,
  Edit3,
  Trash2,
  AlertTriangle,
  Search,
  X,
  ChevronDown,
  Star,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/Toast';
import { formatPrice } from '@/utils/format';
import {
  useDiameters,
  useCategories,
  useGrains,
  useDeleteProduct,
  useUpdateProduct,
} from '@/hooks/adminQueries';

interface AdminProduct {
  id: number;
  product_name: string;
  description: string;
  price: number;
  stocks: number;
  caliber: string;
  grains: string;
  diameter: string;
  category: string;
  images: string[];
  videos: string[];
  featured: boolean;
  thumbnail: string;
  created_at: string;
}

interface EditFormData {
  product_name: string;
  description: string;
  price: string;
  stocks: string;
  caliber: string;
  grains: string;
  diameter: string;
  category: string;
  featured: boolean;
}

export function AdminProducts() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { data: diameters = [] } = useDiameters();
  const { data: categories = [] } = useCategories();
  const { data: grains = [] } = useGrains();
  const { mutateAsync: deleteProduct, isPending: isDeleting } =
    useDeleteProduct();
  const { mutateAsync: updateProduct, isPending: isUpdating } =
    useUpdateProduct();

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<AdminProduct | null>(null);

  // Edit modal
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null);
  const [editForm, setEditForm] = useState<EditFormData>({
    product_name: '',
    description: '',
    price: '',
    stocks: '',
    caliber: '',
    grains: '',
    diameter: '',
    category: '',
    featured: false,
  });
  const [editError, setEditError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[AdminProducts] fetch error:', error);
      showToast('Failed to load products', 'error');
    } else {
      setProducts(
        (data || []).map((p: Record<string, unknown>) => ({
          id: Number(p.id),
          product_name: (p.product_name as string) || '',
          description: (p.description as string) || '',
          price: Number(p.price) || 0,
          stocks: Number(p.stocks) || 0,
          caliber: (p.caliber as string) || '',
          grains: (p.grains as string) || '',
          diameter: (p.diameter as string) || '',
          category: (p.category as string) || '',
          images: Array.isArray(p.images) ? p.images : [],
          videos: Array.isArray(p.videos) ? p.videos : [],
          featured: Boolean(p.featured),
          thumbnail: (p.thumbnail as string) || '',
          created_at: (p.created_at as string) || '',
        })),
      );
    }
    setIsLoading(false);
  }, [showToast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = useCallback(async () => {
    if (!deleteConfirm) return;
    try {
      await deleteProduct(deleteConfirm.id);
      showToast(
        `Product "${deleteConfirm.product_name}" deleted successfully!`,
        'success',
      );
      setDeleteConfirm(null);
      fetchProducts();
    } catch (err: any) {
      const msg = err?.message || 'Failed to delete product';
      showToast(msg, 'error');
      setDeleteConfirm(null);
    }
  }, [deleteConfirm, deleteProduct, showToast, fetchProducts]);

  const openEditModal = (product: AdminProduct) => {
    setEditProduct(product);
    setEditForm({
      product_name: product.product_name,
      description: product.description,
      price: String(product.price),
      stocks: String(product.stocks),
      caliber: product.caliber,
      grains: product.grains,
      diameter: product.diameter,
      category: product.category,
      featured: product.featured,
    });
    setEditError(null);
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);

    if (!editProduct) return;
    if (!editForm.product_name.trim()) {
      setEditError('Product name is required');
      return;
    }
    if (!editForm.price || parseFloat(editForm.price) <= 0) {
      setEditError('Please enter a valid price');
      return;
    }
    if (!editForm.category) {
      setEditError('Please select a category');
      return;
    }

    try {
      await updateProduct({
        id: editProduct.id,
        updates: {
          product_name: editForm.product_name,
          description: editForm.description,
          price: parseFloat(editForm.price),
          stocks: parseInt(editForm.stocks) || 0,
          caliber: editForm.caliber,
          grains: editForm.grains,
          diameter: editForm.diameter,
          category: editForm.category,
          featured: editForm.featured,
        },
      });
      showToast('Product updated successfully!', 'success');
      setEditProduct(null);
      fetchProducts();
    } catch (err: any) {
      const msg = err?.message || 'Failed to update product';
      setEditError(msg);
      showToast(msg, 'error');
    }
  };

  // Filter products by search
  const filteredProducts = products.filter(
    (p) =>
      p.product_name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.diameter.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-text-primary flex items-center gap-3">
            <Package className="w-6 h-6 text-primary-400" />
            Products
          </h1>
          <p className="text-dark-text-secondary mt-1">
            View, edit, or remove products from the store
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/products/add')}
          className="px-4 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors text-sm flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-dark-border bg-dark-surface text-dark-text-primary placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-text-muted hover:text-dark-text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-dark-surface-secondary rounded-xl border border-dark-border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-dark-text-muted mx-auto mb-3" />
            <p className="text-dark-text-secondary font-medium">
              {search
                ? 'No products match your search'
                : 'No products added yet'}
            </p>
            <p className="text-xs text-dark-text-muted mt-1">
              {search
                ? 'Try a different search term'
                : 'Add your first product using the button above'}
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
                    Product Name
                  </th>
                  <th className="text-left py-3 px-4 text-dark-text-muted font-medium text-xs uppercase tracking-wider hidden sm:table-cell">
                    Category
                  </th>
                  <th className="text-right py-3 px-4 text-dark-text-muted font-medium text-xs uppercase tracking-wider hidden md:table-cell">
                    Price
                  </th>
                  <th className="text-right py-3 px-4 text-dark-text-muted font-medium text-xs uppercase tracking-wider hidden md:table-cell">
                    Stock
                  </th>
                  <th className="text-center py-3 px-4 text-dark-text-muted font-medium text-xs uppercase tracking-wider hidden lg:table-cell">
                    Featured
                  </th>
                  <th className="text-right py-3 px-4 text-dark-text-muted font-medium text-xs uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-dark-border/50 hover:bg-dark-surface-tertiary/30 transition-colors"
                  >
                    <td className="py-3 px-4 text-dark-text-muted">
                      {product.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-dark-border shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-dark-surface border border-dark-border flex items-center justify-center shrink-0">
                            <Package className="w-4 h-4 text-dark-text-muted" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-dark-text-primary font-medium truncate">
                            {product.product_name}
                          </p>
                          <p className="text-xs text-dark-text-muted truncate">
                            {product.diameter}
                            {product.grains ? ` · ${product.grains}gr` : ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <span className="text-dark-text-secondary">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right hidden md:table-cell">
                      <span className="text-dark-text-primary font-medium">
                        {formatPrice(Number(product.price))}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right hidden md:table-cell">
                      <span
                        className={`font-medium ${
                          product.stocks > 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {product.stocks}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center hidden lg:table-cell">
                      {product.featured ? (
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 inline-block" />
                      ) : (
                        <span className="text-dark-text-muted">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 rounded-lg text-dark-text-muted hover:text-primary-400 hover:bg-primary-500/10 transition-colors"
                          title="Edit product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product)}
                          className="p-2 rounded-lg text-dark-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete product"
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
        )}
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
                Delete Product
              </h3>
              <p className="text-sm text-dark-text-secondary mt-2">
                Are you sure you want to delete{' '}
                <span className="text-dark-text-primary font-medium">
                  {deleteConfirm.product_name}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-lg border border-dark-border text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-surface-tertiary transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-surface-secondary rounded-2xl border border-dark-border shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 pb-0">
              <h3 className="text-lg font-bold text-dark-text-primary flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-primary-400" />
                Edit Product
              </h3>
              <button
                onClick={() => setEditProduct(null)}
                className="p-2 rounded-lg text-dark-text-muted hover:text-dark-text-primary hover:bg-dark-surface-tertiary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="mx-6 mt-4 p-3 rounded-lg bg-red-900/20 border border-red-800 text-sm text-red-400">
                {editError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-dark-text-primary mb-1.5">
                  Product Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="product_name"
                  value={editForm.product_name}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-dark-border bg-dark-surface text-dark-text-primary placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-dark-text-primary mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-dark-border bg-dark-surface text-dark-text-primary placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none"
                />
              </div>

              {/* Price & Stock Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-text-primary mb-1.5">
                    Price (₱) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editForm.price}
                    onChange={handleEditChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2.5 rounded-lg border border-dark-border bg-dark-surface text-dark-text-primary placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-text-primary mb-1.5">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stocks"
                    value={editForm.stocks}
                    onChange={handleEditChange}
                    min="0"
                    className="w-full px-4 py-2.5 rounded-lg border border-dark-border bg-dark-surface text-dark-text-primary placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Caliber, Grains, Diameter Row */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-text-primary mb-1.5">
                    Caliber
                  </label>
                  <input
                    type="text"
                    name="caliber"
                    value={editForm.caliber}
                    onChange={handleEditChange}
                    placeholder="e.g., 4.5mm"
                    className="w-full px-4 py-2.5 rounded-lg border border-dark-border bg-dark-surface text-dark-text-primary placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-text-primary mb-1.5">
                    Grains
                  </label>
                  <div className="relative">
                    <select
                      name="grains"
                      value={editForm.grains}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2.5 pr-8 rounded-lg border border-dark-border bg-dark-surface text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm appearance-none cursor-pointer"
                    >
                      <option value="">Select...</option>
                      {grains.map((g) => (
                        <option key={g.id} value={g.value}>
                          {g.value} gr
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-text-muted pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-text-primary mb-1.5">
                    Diameter
                  </label>
                  <div className="relative">
                    <select
                      name="diameter"
                      value={editForm.diameter}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2.5 pr-8 rounded-lg border border-dark-border bg-dark-surface text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm appearance-none cursor-pointer"
                    >
                      <option value="">Select...</option>
                      {diameters.map((d) => (
                        <option key={d.id} value={d.value}>
                          {d.value}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-text-muted pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-dark-text-primary mb-1.5">
                  Category <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() =>
                        setEditForm((prev) => ({
                          ...prev,
                          category: cat.name,
                        }))
                      }
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                        editForm.category === cat.name
                          ? 'bg-primary-600/20 text-primary-400 border-primary-500/30'
                          : 'bg-dark-surface text-dark-text-secondary border-dark-border hover:border-primary-500/30 hover:text-dark-text-primary'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={editForm.featured}
                    onChange={handleEditChange}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-dark-surface rounded-full peer peer-checked:bg-primary-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all border border-dark-border"></div>
                </label>
                <span className="text-sm text-dark-text-primary">
                  Featured Product
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditProduct(null)}
                  className="flex-1 px-5 py-2.5 rounded-lg border border-dark-border text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-surface-tertiary transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-[2] px-5 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
