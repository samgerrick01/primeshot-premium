import { Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useOrdersStore } from '@/store/ordersStore';
import { useEffect } from 'react';

export function OrdersIcon() {
  const user = useAuthStore((state) => state.user);
  const { unviewedCount, fetched, fetchUnviewedCount } = useOrdersStore();

  useEffect(() => {
    if (user && !fetched) {
      fetchUnviewedCount(user.id);
    }
  }, [user, fetched, fetchUnviewedCount]);

  // Don't render anything if not logged in
  if (!user) return null;

  return (
    <Link to="/orders" className="relative btn-ghost p-2 rounded-full">
      <Package className="w-5 h-5" />
      {unviewedCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {unviewedCount > 99 ? '99+' : unviewedCount}
        </span>
      )}
    </Link>
  );
}
