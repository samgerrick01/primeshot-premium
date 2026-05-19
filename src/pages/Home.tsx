import { Link } from 'react-router-dom';
import { ArrowRight, Target, Shield, Truck, RotateCcw } from 'lucide-react';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/ui/ProductCard';
import { FEATURES } from '@/constants/enums';

const featureIcons = [Target, Shield, Truck, RotateCcw];

export function Home() {
  const { data: featuredProducts, isLoading } = useFeaturedProducts();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="max-w-3xl">
            <p className="text-primary-200 font-medium mb-4 tracking-wider uppercase text-sm">
              Premium Airgun Ammunition
            </p>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Precision Engineered
              <span className="block bg-gradient-to-r from-accent-300 to-accent-500 bg-clip-text text-transparent">
                For Perfect Accuracy
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-100 max-w-xl">
              Discover our curated collection of premium pellets and slugs,
              precision-crafted for airgun enthusiasts who demand the best
              accuracy and performance.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-white text-primary-900 font-semibold py-3 px-6 rounded-lg hover:bg-primary-50 transition-colors"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 border border-white/30 text-white font-medium py-3 px-6 rounded-lg hover:bg-white/10 transition-colors"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {FEATURES.map((feature, index) => {
            const Icon = featureIcons[index];
            return (
              <div
                key={feature.title}
                className="card p-6 flex items-center gap-4"
              >
                <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary dark:text-dark-text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle mt-2">
              Our most popular pellets and slugs
            </p>
          </div>
          <Link
            to="/shop"
            className="hidden sm:inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:underline"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/shop"
            className="btn-primary inline-flex items-center gap-2"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold">
            Ready to Improve Your Accuracy?
          </h2>
          <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
            Join thousands of airgun enthusiasts who trust PrimeShot Premium for
            their ammunition needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-white text-primary-900 font-semibold py-3 px-6 rounded-lg hover:bg-primary-50 transition-colors"
            >
              Start Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-medium py-3 px-6 rounded-lg hover:bg-white/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
