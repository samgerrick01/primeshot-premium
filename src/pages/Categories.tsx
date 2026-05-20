import { Link } from 'react-router-dom';
import { Target, Crosshair, CircleDot, Swords, Zap, Ruler } from 'lucide-react';
import { CATEGORY_PAGE_DATA } from '@/constants/enums';
import { useCategoryCounts } from '@/hooks/useProducts';

const categoryIcons = [Target, Crosshair, CircleDot, Swords, Zap, Ruler];

export function Categories() {
  const { data: categoryCounts, isLoading } = useCategoryCounts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10">
        <h1 className="section-title">Categories</h1>
        <p className="section-subtitle mt-2">Browse our product categories</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORY_PAGE_DATA.map((category) => (
            <div
              key={category.name}
              className="card overflow-hidden animate-pulse"
            >
              <div className={`bg-gradient-to-br ${category.color} p-6 h-32`} />
              <div className="p-4 h-12 bg-surface-secondary dark:bg-dark-surface-secondary" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORY_PAGE_DATA.map((category, index) => {
            const Icon = categoryIcons[index];
            const count = categoryCounts?.[category.name] || 0;

            // Only show categories that have products
            if (count === 0) return null;

            return (
              <Link
                key={category.name}
                to={`/shop?category=${encodeURIComponent(category.name)}`}
                className="group card overflow-hidden"
              >
                <div
                  className={`bg-gradient-to-br ${category.color} p-6 text-white`}
                >
                  <Icon className="w-12 h-12 mb-3 opacity-80 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-serif text-xl font-bold">
                    {category.name}
                  </h3>
                  <p className="text-sm opacity-80 mt-1">
                    {category.description}
                  </p>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm text-text-secondary dark:text-dark-text-secondary">
                    {count} {count === 1 ? 'product' : 'products'}
                  </span>
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:underline">
                    Browse &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
