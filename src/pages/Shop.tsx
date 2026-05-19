import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/ui/ProductCard';
import { PRODUCT_CATEGORIES } from '@/constants/enums';

export function Shop() {
  const { data: products, isLoading } = useProducts();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = products?.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title">Shop</h1>
        <p className="section-subtitle mt-2">
          Browse our collection of premium airgun ammunition
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted dark:text-dark-text-muted" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary inline-flex items-center gap-2 sm:w-auto"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {selectedCategory !== 'All' && (
            <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {1}
            </span>
          )}
        </button>
      </div>

      {/* Category Filters */}
      {showFilters && (
        <div className="mb-8 p-4 card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-text-primary dark:text-dark-text-primary">
              Categories
            </h3>
            <button
              onClick={() => setShowFilters(false)}
              className="btn-ghost p-1 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRODUCT_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-surface-tertiary dark:bg-dark-surface-tertiary text-text-secondary dark:text-dark-text-secondary hover:bg-surface-tertiary/80 dark:hover:bg-dark-surface-tertiary/80'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-square bg-surface-tertiary dark:bg-dark-surface-tertiary" />
              <div className="p-4 space-y-3">
                <div className="h-3 w-16 bg-surface-tertiary dark:bg-dark-surface-tertiary rounded" />
                <div className="h-4 w-3/4 bg-surface-tertiary dark:bg-dark-surface-tertiary rounded" />
                <div className="h-3 w-full bg-surface-tertiary dark:bg-dark-surface-tertiary rounded" />
                <div className="h-6 w-20 bg-surface-tertiary dark:bg-dark-surface-tertiary rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts?.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-text-muted dark:text-dark-text-muted text-lg">
            No products found matching your criteria.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
            }}
            className="btn-primary mt-4"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
