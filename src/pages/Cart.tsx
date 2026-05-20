import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  Target,
  CheckSquare,
  Square,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/utils/format';

export function Cart() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
    selectedItems,
    toggleItemSelection,
    selectAllItems,
    deselectAllItems,
    removeSelectedItems,
    getSelectedTotal,
    getSelectedItemCount,
  } = useCartStore();

  const allSelected =
    items.length > 0 && items.every((item) => selectedItems.has(item.id));
  const someSelected = selectedItems.size > 0;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <ShoppingCart className="w-20 h-20 mx-auto text-text-muted dark:text-dark-text-muted mb-6" />
        <h1 className="font-serif text-3xl font-bold text-text-primary dark:text-dark-text-primary mb-3">
          Your Cart is Empty
        </h1>
        <p className="text-text-secondary dark:text-dark-text-secondary mb-8 max-w-md mx-auto">
          Looks like you haven't added any ammunition to your cart yet. Browse
          our collection and find the perfect pellets or slugs for your next
          session.
        </p>
        <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
          Browse Products
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title">Shopping Cart</h1>
          <p className="section-subtitle mt-1">
            {getItemCount()} item{getItemCount() !== 1 ? 's' : ''} in your cart
            {someSelected && (
              <span className="ml-2 text-primary-600 dark:text-primary-400">
                ({selectedItems.size} selected)
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {someSelected && (
            <button
              onClick={removeSelectedItems}
              className="btn-ghost text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Remove Selected
            </button>
          )}
          <button
            onClick={clearCart}
            className="btn-ghost text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cart
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Select All */}
          <div className="flex items-center gap-3 px-4 py-2 bg-surface-secondary dark:bg-dark-surface-secondary rounded-lg">
            <button
              onClick={allSelected ? deselectAllItems : selectAllItems}
              className="flex items-center gap-2 text-sm font-medium text-text-primary dark:text-dark-text-primary hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {allSelected ? (
                <CheckSquare className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              ) : (
                <Square className="w-5 h-5" />
              )}
              Select All
            </button>
          </div>

          {items.map((item) => (
            <div key={item.id} className="card p-4 flex gap-4">
              {/* Checkbox */}
              <button
                onClick={() => toggleItemSelection(item.id)}
                className="flex-shrink-0 mt-1"
                aria-label="Select item"
              >
                {selectedItems.has(item.id) ? (
                  <CheckSquare className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                ) : (
                  <Square className="w-5 h-5 text-text-muted dark:text-dark-text-muted" />
                )}
              </button>
              {/* Product Image */}
              <Link
                to={`/product/${item.product_id}`}
                className="w-24 h-24 rounded-lg overflow-hidden bg-surface-tertiary dark:bg-dark-surface-tertiary flex-shrink-0"
              >
                {item.product.images?.[0] ? (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted dark:text-dark-text-muted">
                    <Target className="w-6 h-6" />
                  </div>
                )}
              </Link>

              {/* Item Details */}
              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${item.product_id}`}
                  className="font-medium text-text-primary dark:text-dark-text-primary hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-0.5">
                  {item.product.category}
                </p>
                {item.size && (
                  <p className="text-sm text-text-muted dark:text-dark-text-muted">
                    Caliber: {item.size}
                  </p>
                )}
                {item.color && (
                  <p className="text-sm text-text-muted dark:text-dark-text-muted">
                    Type: {item.color}
                  </p>
                )}

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-border dark:border-dark-border rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product_id,
                          Math.max(1, item.quantity - 1),
                        )
                      }
                      className="p-1.5 hover:bg-surface-tertiary dark:hover:bg-dark-surface-tertiary transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-sm font-medium text-text-primary dark:text-dark-text-primary min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product_id, item.quantity + 1)
                      }
                      className="p-1.5 hover:bg-surface-tertiary dark:hover:bg-dark-surface-tertiary transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-text-primary dark:text-dark-text-primary">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.product_id)}
                      className="btn-ghost p-1.5 text-red-500 hover:text-red-600"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-serif text-xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
              Order Summary
            </h2>

            {someSelected && (
              <div className="mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                <p className="text-sm font-medium text-primary-900 dark:text-primary-100 mb-1">
                  Selected Items
                </p>
                <p className="text-xs text-primary-700 dark:text-primary-300">
                  {getSelectedItemCount()} item
                  {getSelectedItemCount() !== 1 ? 's' : ''} •{' '}
                  {formatPrice(getSelectedTotal())}
                </p>
              </div>
            )}

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-text-secondary dark:text-dark-text-secondary">
                <span>
                  Subtotal (
                  {someSelected ? getSelectedItemCount() : getItemCount()}{' '}
                  items)
                </span>
                <span>
                  {formatPrice(someSelected ? getSelectedTotal() : getTotal())}
                </span>
              </div>
              <div className="flex justify-between text-text-secondary dark:text-dark-text-secondary">
                <span>Shipping</span>
                <span className="text-green-600 dark:text-green-400 font-medium">
                  Free
                </span>
              </div>
              <div className="flex justify-between text-text-secondary dark:text-dark-text-secondary">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
              <hr className="border-border dark:border-dark-border" />
              <div className="flex justify-between font-bold text-text-primary dark:text-dark-text-primary text-base">
                <span>Total</span>
                <span>
                  {formatPrice(someSelected ? getSelectedTotal() : getTotal())}
                </span>
              </div>
            </div>

            <button
              className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
              disabled={someSelected && selectedItems.size === 0}
            >
              Proceed to Checkout {someSelected && `(${selectedItems.size})`}
              <ArrowRight className="w-4 h-4" />
            </button>

            {someSelected && selectedItems.size === 0 && (
              <p className="text-xs text-center text-text-muted dark:text-dark-text-muted mt-2">
                Select items to checkout
              </p>
            )}

            <Link
              to="/shop"
              className="block text-center text-sm text-primary-600 dark:text-primary-400 hover:underline mt-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
