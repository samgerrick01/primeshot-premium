import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingCart,
  Star,
  Minus,
  Plus,
  ChevronLeft,
  Target,
} from 'lucide-react';
import { useProduct } from '../hooks/useProducts';
import { useCartStore } from '../store/cartStore';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id!);
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
          <div className="aspect-square bg-surface-tertiary dark:bg-dark-surface-tertiary rounded-lg" />
          <div className="space-y-4">
            <div className="h-4 w-20 bg-surface-tertiary dark:bg-dark-surface-tertiary rounded" />
            <div className="h-8 w-3/4 bg-surface-tertiary dark:bg-dark-surface-tertiary rounded" />
            <div className="h-4 w-full bg-surface-tertiary dark:bg-dark-surface-tertiary rounded" />
            <div className="h-4 w-2/3 bg-surface-tertiary dark:bg-dark-surface-tertiary rounded" />
            <div className="h-10 w-32 bg-surface-tertiary dark:bg-dark-surface-tertiary rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Target className="w-16 h-16 mx-auto text-text-muted dark:text-dark-text-muted mb-4" />
        <h2 className="font-serif text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
          Product Not Found
        </h2>
        <p className="text-text-secondary dark:text-dark-text-secondary mb-6">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/shop" className="btn-primary">
          Back to Shop
        </Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : ['/placeholder.svg'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-secondary dark:text-dark-text-secondary mb-6">
        <Link
          to="/"
          className="hover:text-primary-600 dark:hover:text-primary-400"
        >
          Home
        </Link>
        <span>/</span>
        <Link
          to="/shop"
          className="hover:text-primary-600 dark:hover:text-primary-400"
        >
          Shop
        </Link>
        <span>/</span>
        <span className="text-text-primary dark:text-dark-text-primary">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-lg overflow-hidden bg-surface-tertiary dark:bg-dark-surface-tertiary mb-4">
            {images[selectedImage] !== '/placeholder.svg' ? (
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-muted dark:text-dark-text-muted">
                <Target className="w-16 h-16" />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? 'border-primary-600 dark:border-primary-400'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className="text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-2">
            {product.category}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-text-primary dark:text-dark-text-primary">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-text-primary dark:text-dark-text-primary">
                {product.rating}
              </span>
            </div>
            <span className="text-text-muted dark:text-dark-text-muted">
              ({product.reviews} reviews)
            </span>
          </div>

          <p className="mt-6 text-text-secondary dark:text-dark-text-secondary leading-relaxed">
            {product.description}
          </p>

          <div className="mt-8">
            <span className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">
              ${product.price.toFixed(2)}
            </span>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-border dark:border-dark-border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-surface-tertiary dark:hover:bg-dark-surface-tertiary transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 font-medium text-text-primary dark:text-dark-text-primary min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-surface-tertiary dark:hover:bg-dark-surface-tertiary transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => addItem(product, quantity)}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
          </div>

          {/* Product Details */}
          <div className="mt-10 border-t border-border dark:border-dark-border pt-8">
            <h3 className="font-semibold text-text-primary dark:text-dark-text-primary mb-3">
              Product Details
            </h3>
            <ul className="space-y-2 text-sm text-text-secondary dark:text-dark-text-secondary">
              {product.details?.map((detail, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
