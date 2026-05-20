import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Target } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/utils/format';

export function Checkout() {
  const navigate = useNavigate();
  const { items, selectedItems, getSelectedTotal, getSelectedItemCount, getTotal } = useCartStore();
  const { user } = useAuthStore();

  const checkoutItems = items.filter((item) => selectedItems.has(item.id));
  const total = selectedItems.size > 0 ? getSelectedTotal() : getTotal();
  const itemCount = selectedItems.size > 0 ? getSelectedItemCount() : items.reduce((c, i) => c + i.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/cart')}
        className="flex items-center gap-1 text-sm text-text-muted dark:text-dark-text-muted hover:text-text-primary dark:hover:text-dark-text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Cart
      </button>

      <h1 className="section-title mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping & Payment Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Information */}
          <div className="card p-6">
            <h2 className="font-serif text-lg font-bold text-text-primary dark:text-dark-text-primary mb-4">
              Shipping Information
            </h2>
            {user ? (
              <div className="space-y-2 text-sm text-text-secondary dark:text-dark-text-secondary">
                <p>
                  <span className="font-medium">Name:</span>{' '}
                  {user.firstname || user.full_name || 'N/A'}{' '}
                  {user.lastname || ''}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {user.email || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Address:</span>{' '}
                  {user.full_address || 'No address set'}
                </p>
                {!user.full_address && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    Please update your address in{' '}
                    <button
                      onClick={() => navigate('/account')}
                      className="underline hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      My Account
                    </button>
                  </p>
                )}
              </div>
            ) : (
              <div className="text-sm text-text-muted dark:text-dark-text-muted">
                <p>
                  Please{' '}
                  <button
                    onClick={() => navigate('/auth')}
                    className="text-primary-600 dark:text-primary-400 underline hover:no-underline"
                  >
                    sign in
                  </button>{' '}
                  to proceed with checkout.
                </p>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="card p-6">
            <h2 className="font-serif text-lg font-bold text-text-primary dark:text-dark-text-primary mb-4">
              Payment Method
            </h2>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="font-medium text-blue-900 dark:text-blue-100 text-sm">
                GCash
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Pay via GCash. You'll receive the payment details after placing
                your order.
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="card p-6">
            <h2 className="font-serif text-lg font-bold text-text-primary dark:text-dark-text-primary mb-4">
              Order Items
            </h2>
            <div className="space-y-3">
              {(checkoutItems.length > 0 ? checkoutItems : items).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-surface-secondary dark:bg-dark-surface-secondary rounded-lg"
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-surface-tertiary dark:bg-dark-surface-tertiary flex-shrink-0">
                    {item.product.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted dark:text-dark-text-muted">
                        <Target className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary dark:text-dark-text-primary truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-text-muted dark:text-dark-text-muted">
                      Qty: {item.quantity}
                      {item.size && ` | ${item.size}`}
                      {item.color && ` | ${item.color}`}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-serif text-xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
              Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-text-secondary dark:text-dark-text-secondary">
                <span>Items ({itemCount})</span>
                <span>{formatPrice(total)}</span>
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
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Place Order
            </button>

            <p className="text-xs text-center text-text-muted dark:text-dark-text-muted mt-3">
              By placing this order, you agree to our{' '}
              <button
                onClick={() => navigate('/privacy-policy')}
                className="underline hover:text-primary-600 dark:hover:text-primary-400"
              >
                Terms & Conditions
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
