import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/components/Toast';
import { formatPrice } from '@/utils/format';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { showToast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    showToast(`${product.name} added to cart!`, 'success');
  };

  return (
    <div className="card group overflow-hidden">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden bg-surface-tertiary dark:bg-dark-surface-tertiary">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted dark:text-dark-text-muted">
              <span className="font-serif text-lg">PrimeShot</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <p className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-text-primary dark:text-dark-text-primary group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-1 mt-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
            {product.rating}
          </span>
          <span className="text-sm text-text-muted dark:text-dark-text-muted">
            ({product.reviews})
          </span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-text-primary dark:text-dark-text-primary">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={handleAddToCart}
            className="btn-primary p-2.5"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
