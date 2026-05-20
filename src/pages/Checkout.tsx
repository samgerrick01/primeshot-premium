import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

/**
 * Checkout page simply redirects to the Payment Session page
 * since we removed COD — payment first only.
 */
export function Checkout() {
  const navigate = useNavigate();
  const { items, selectedItems } = useCartStore();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate('/auth');
      return;
    }

    const hasItems =
      selectedItems.size > 0
        ? items.some((item) => selectedItems.has(item.id))
        : items.length > 0;

    if (!hasItems) {
      navigate('/cart');
      return;
    }

    navigate('/payment-session');
  }, [user, loading, items, selectedItems, navigate]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="w-8 h-8 border-2 border-primary-600 dark:border-primary-400 border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="mt-4 text-text-secondary dark:text-dark-text-secondary">
        Redirecting to payment...
      </p>
    </div>
  );
}
